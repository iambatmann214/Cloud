import { TroubleshootingFlow } from '../types';

export const allTroubleshootingFlows: TroubleshootingFlow[] = [
  {
    id: 'ec2-app-inaccessible',
    title: 'EC2 Instance Running but Web Application Inaccessible',
    symptom: 'EC2 console shows instance status "Running" with 2/2 status checks passed, but HTTP/HTTPS requests from web browsers or curl timeout with ERR_CONNECTION_TIMED_OUT or connect ECONNREFUSED.',
    impact: 'Complete downtime for web traffic facing customers; transactions and API requests fail immediately.',
    causes: [
      {
        id: 'cause-1',
        cause: 'Security Group lacks inbound HTTP/HTTPS authorization rule',
        likelihood: 'high',
        checks: [
          {
            action: 'Describe Security Group inbound rules for the instance',
            command: 'aws ec2 describe-security-groups --group-ids $(aws ec2 describe-instances --instance-ids $INSTANCE_ID --query "Reservations[0].Instances[0].SecurityGroups[0].GroupId" --output text) --query "SecurityGroups[0].IpPermissions"',
            consoleLocation: 'EC2 Console > Instances > Select instance > Security tab > Inbound rules',
            interpretation: 'If there is no rule permitting TCP on port 80 or 443 from 0.0.0.0/0 (or your client CIDR), packets are silently dropped.'
          },
          {
            action: 'Test TCP socket reachability on port 80 using netcat or curl with timeout',
            command: 'curl -Iv --connect-timeout 5 http://$PUBLIC_IP',
            interpretation: 'A "Connection timed out" error strongly suggests firewall/security group blockage, whereas "Connection refused" indicates the packet arrived but no process is listening.'
          }
        ],
        fix: 'Add an inbound rule to the instance Security Group permitting TCP port 80 (HTTP) and port 443 (HTTPS) from 0.0.0.0/0 or the target CIDR: `aws ec2 authorize-security-group-ingress --group-id $SG_ID --protocol tcp --port 80 --cidr 0.0.0.0/0`.',
        verification: 'Execute `curl -I http://$PUBLIC_IP` to confirm an HTTP response header (e.g. 200 OK or 301 Redirect) is returned promptly.',
        prevention: 'Manage security groups via declarative Infrastructure as Code (Terraform or CloudFormation) with automated regression tests.'
      },
      {
        id: 'cause-2',
        cause: 'Web server daemon (nginx/httpd) is not running or crashed',
        likelihood: 'high',
        checks: [
          {
            action: 'Check web service status via SSM Run Command or SSH',
            command: 'systemctl status nginx || systemctl status httpd',
            consoleLocation: 'Systems Manager > Run Command > AWS-RunShellScript',
            interpretation: 'If status is "inactive (dead)" or "failed", the web server process has crashed or failed to start on boot.'
          },
          {
            action: 'Inspect open listening sockets on the operating system',
            command: 'sudo ss -tulpn | grep -E "(:80|:443)"',
            interpretation: 'If no process is bound to 0.0.0.0:80, curl will immediately receive "Connection refused".'
          }
        ],
        fix: 'Start the web service and enable it to start automatically on system boot: `sudo systemctl enable --now nginx` (or `httpd`). Review logs in `/var/log/nginx/error.log` or `journalctl -u nginx` to fix syntax errors.',
        verification: 'Run `systemctl is-active nginx` and `curl -s localhost | head -n 5` inside the instance.',
        prevention: 'Configure systemd service with `Restart=always` and `RestartSec=5` in unit files, and configure CloudWatch Synthetics canaries to alert on HTTP endpoint health.'
      },
      {
        id: 'cause-3',
        cause: 'Subnet Route Table missing route to Internet Gateway (IGW)',
        likelihood: 'medium',
        checks: [
          {
            action: 'Check route table associated with the instance subnet',
            command: 'aws ec2 describe-route-tables --filters "Name=association.subnet-id,Values=$(aws ec2 describe-instances --instance-ids $INSTANCE_ID --query "Reservations[0].Instances[0].SubnetId" --output text)" --query "RouteTables[0].Routes"',
            consoleLocation: 'VPC Console > Subnets > Select subnet > Route table tab',
            interpretation: 'If there is no route for destination `0.0.0.0/0` with target `igw-xxxx`, the subnet is private and instances cannot receive public internet traffic.'
          }
        ],
        fix: 'Attach an Internet Gateway to the VPC if missing, and add a route in the public subnet route table: `aws ec2 create-route --route-table-id $RT_ID --destination-cidr-block 0.0.0.0/0 --gateway-id $IGW_ID`.',
        verification: 'Check `aws ec2 describe-route-tables --route-table-id $RT_ID` to verify `0.0.0.0/0` points to an active `igw-` in State: active.',
        prevention: 'Tag subnets clearly as Public or Private and use AWS VPC Reachability Analyzer before deploying production traffic.'
      }
    ]
  },
  {
    id: 'ssh-timeout',
    title: 'SSH Connection Times Out',
    symptom: 'Running `ssh -i key.pem ec2-user@<public-ip>` hangs for 30–60 seconds before failing with `ssh: connect to host <public-ip> port 22: Connection timed out`.',
    impact: 'Engineers are unable to perform remote administration, emergency interventions, or manual inspections directly on the virtual server.',
    causes: [
      {
        id: 'cause-1',
        cause: 'Security Group port 22 is blocked or restricted to a different client IP',
        likelihood: 'high',
        checks: [
          {
            action: 'Verify your current client public IP address',
            command: 'curl -s https://checkip.amazonaws.com',
            interpretation: 'Dynamic home or office IPs frequently change. Compare this IP against the authorized CIDR in the Security Group.'
          },
          {
            action: 'Check EC2 Security Group rules for port 22',
            command: 'aws ec2 describe-security-groups --group-ids $SG_ID --query "SecurityGroups[0].IpPermissions[?ToPort==\`22\`]"',
            consoleLocation: 'EC2 Console > Security Groups > Inbound rules',
            interpretation: 'If your current public IP is not contained within the allowed CIDR blocks, all SSH packets are dropped.'
          }
        ],
        fix: 'Authorize your current client IP (/32) in the security group: `MY_IP=$(curl -s https://checkip.amazonaws.com); aws ec2 authorize-security-group-ingress --group-id $SG_ID --protocol tcp --port 22 --cidr "$MY_IP/32"`.',
        verification: 'Test SSH connection: `ssh -o ConnectTimeout=5 -i key.pem ec2-user@$PUBLIC_IP "echo connected"`.',
        prevention: 'Use AWS Systems Manager Session Manager (SSM) instead of opening port 22 SSH, avoiding IP management entirely.'
      },
      {
        id: 'cause-2',
        cause: 'Network ACL (NACL) is blocking inbound port 22 or outbound ephemeral ports',
        likelihood: 'medium',
        checks: [
          {
            action: 'Review subnet Network ACL inbound and outbound entries',
            command: 'aws ec2 describe-network-acls --filters "Name=association.subnet-id,Values=$SUBNET_ID" --query "NetworkAcls[0].Entries"',
            consoleLocation: 'VPC Console > Network ACLs > Inbound/Outbound Rules',
            interpretation: 'Because NACLs are stateless, outbound entries MUST allow ephemeral ports (1024-65535) back to the client IP.'
          }
        ],
        fix: 'Add an outbound NACL rule allowing TCP ports 1024-65535 to 0.0.0.0/0 with a lower rule number than any DENY rule.',
        verification: 'Execute `nc -zv -w 5 $PUBLIC_IP 22` to verify TCP handshake completes successfully.',
        prevention: 'Keep default NACLs (ALLOW all inbound/outbound) and control access exclusively at the stateful Security Group layer unless specific IP blacklisting is required.'
      },
      {
        id: 'cause-3',
        cause: 'Instance launched in a private subnet without public IP or IGW route',
        likelihood: 'medium',
        checks: [
          {
            action: 'Check if the instance has a public IP address allocated',
            command: 'aws ec2 describe-instances --instance-ids $INSTANCE_ID --query "Reservations[0].Instances[0].PublicIpAddress"',
            consoleLocation: 'EC2 Console > Instances > Instance details > Public IPv4 address',
            interpretation: 'If output is null or "None", the instance has only a private IP and cannot be reached directly from the internet.'
          }
        ],
        fix: 'Allocate an Elastic IP and associate it to the instance, or connect via a Bastion Host in a public subnet or AWS Systems Manager Session Manager.',
        verification: 'Run `aws ec2 describe-instances --instance-ids $INSTANCE_ID --query "Reservations[0].Instances[0].PublicIpAddress"` to verify public IP presence.',
        prevention: 'Enable "Auto-assign public IPv4 address" only on subnets designated as Public tiers.'
      }
    ]
  },
  {
    id: 'ec2-no-internet',
    title: 'EC2 Instance Cannot Connect to Internet',
    symptom: 'Commands running inside the EC2 instance such as `curl https://amazon.com`, `ping 8.8.8.8`, or `dnf update` fail with "Network is unreachable" or hang indefinitely.',
    impact: 'Instance cannot download software packages, install security updates, or call external third-party APIs.',
    causes: [
      {
        id: 'cause-1',
        cause: 'Subnet route table lacks a default route to an Internet Gateway',
        likelihood: 'high',
        checks: [
          {
            action: 'Inspect the subnet route table for a 0.0.0.0/0 route',
            command: 'aws ec2 describe-route-tables --filters "Name=association.subnet-id,Values=$SUBNET_ID" --query "RouteTables[0].Routes[?DestinationCidrBlock==\`0.0.0.0/0\`]"',
            consoleLocation: 'VPC Console > Route Tables > Routes tab',
            interpretation: 'If empty, traffic destined for outside the VPC has no gateway target and is dropped by the hypervisor router.'
          }
        ],
        fix: 'Add the default route targeting the attached Internet Gateway: `aws ec2 create-route --route-table-id $RT_ID --destination-cidr-block 0.0.0.0/0 --gateway-id $IGW_ID`.',
        verification: 'Inside EC2, run `curl -I https://aws.amazon.com` to verify HTTP 200/301 response.',
        prevention: 'Standardize VPC subnet creation scripts using IaC modules that automatically pair public subnets with public route tables.'
      },
      {
        id: 'cause-2',
        cause: 'Security Group egress rules modified or default egress (0.0.0.0/0) deleted',
        likelihood: 'medium',
        checks: [
          {
            action: 'Describe Security Group outbound (egress) rules',
            command: 'aws ec2 describe-security-groups --group-ids $SG_ID --query "SecurityGroups[0].IpPermissionsEgress"',
            consoleLocation: 'EC2 Console > Security Groups > Outbound rules tab',
            interpretation: 'By default, AWS security groups allow all outbound traffic. If this rule was removed, all outbound connections are blocked.'
          }
        ],
        fix: 'Restore default outbound egress permission: `aws ec2 authorize-security-group-egress --group-id $SG_ID --protocol -1 --cidr 0.0.0.0/0`.',
        verification: 'Execute `curl -Is https://checkip.amazonaws.com` from the instance.',
        prevention: 'Apply IAM policy guardrails preventing non-administrators from stripping egress rules without peer-reviewed IaC change sets.'
      },
      {
        id: 'cause-3',
        cause: 'Instance has no public IPv4 address associated in a public subnet',
        likelihood: 'medium',
        checks: [
          {
            action: 'Verify public IP attribute on the instance ENI',
            command: 'aws ec2 describe-network-interfaces --network-interface-ids $(aws ec2 describe-instances --instance-ids $INSTANCE_ID --query "Reservations[0].Instances[0].NetworkInterfaces[0].NetworkInterfaceId" --output text) --query "NetworkInterfaces[0].Association.PublicIp"',
            consoleLocation: 'EC2 Console > Network Interfaces > Select ENI > Public IPv4',
            interpretation: 'Even with an IGW route, an Internet Gateway will not perform 1:1 NAT without an assigned Public IP or Elastic IP.'
          }
        ],
        fix: 'Allocate an Elastic IP and associate it to the instance ENI: `ALLOC=$(aws ec2 allocate-address --domain vpc --query AllocationId --output text); aws ec2 associate-address --instance-id $INSTANCE_ID --allocation-id $ALLOC`.',
        verification: 'Verify outbound connectivity: `curl -s https://checkip.amazonaws.com`.',
        prevention: 'Enable "MapPublicIpOnLaunch" on public subnets.'
      }
    ]
  },
  {
    id: 'private-no-updates',
    title: 'Private Instances Cannot Download OS Updates or Software Packages',
    symptom: 'Instances located in private subnets fail to run `yum update`, `apt-get update`, or `docker pull`, failing with connection timeouts to package repositories.',
    impact: 'Operating systems cannot receive zero-day security patches, package dependencies fail to install during bootstrapping, and autoscaling scale-outs fail.',
    causes: [
      {
        id: 'cause-1',
        cause: 'NAT Gateway is missing or route table points 0.0.0.0/0 to nonexistent target',
        likelihood: 'high',
        checks: [
          {
            action: 'Check route table for private subnets',
            command: 'aws ec2 describe-route-tables --route-table-ids $PRIV_RT_ID --query "RouteTables[0].Routes[?DestinationCidrBlock==\`0.0.0.0/0\`]"',
            consoleLocation: 'VPC Console > Route Tables > Select Private Route Table > Routes',
            interpretation: 'The target must be an active NAT Gateway (`nat-xxxx`). If target shows "blackhole" or is absent, egress is broken.'
          },
          {
            action: 'Verify NAT Gateway status and state',
            command: 'aws ec2 describe-nat-gateways --nat-gateway-ids $NAT_ID --query "NatGateways[0].State"',
            consoleLocation: 'VPC Console > NAT Gateways',
            interpretation: 'NAT Gateway must be in the "available" state. If "deleted" or "failed", traffic cannot pass.'
          }
        ],
        fix: 'Deploy a NAT Gateway in a PUBLIC subnet with an Elastic IP, then add a route in the private route table: `aws ec2 create-route --route-table-id $PRIV_RT_ID --destination-cidr-block 0.0.0.0/0 --nat-gateway-id $NAT_ID`.',
        verification: 'From the private instance (via SSM Session Manager), run `curl -Is https://aws.amazon.com`.',
        prevention: 'Use VPC monitoring with CloudWatch metrics for NAT Gateway `ErrorPortAllocation` and `PacketsDropCount`.'
      },
      {
        id: 'cause-2',
        cause: 'NAT Gateway deployed into a private subnet instead of a public subnet',
        likelihood: 'high',
        checks: [
          {
            action: 'Check the route table of the subnet where the NAT Gateway resides',
            command: 'aws ec2 describe-route-tables --filters "Name=association.subnet-id,Values=$(aws ec2 describe-nat-gateways --nat-gateway-ids $NAT_ID --query "NatGateways[0].SubnetId" --output text)" --query "RouteTables[0].Routes[?DestinationCidrBlock==\`0.0.0.0/0\`]"',
            consoleLocation: 'VPC Console > NAT Gateways > Select NAT Gateway > Subnet ID > Route Table',
            interpretation: 'A NAT Gateway must reside in a subnet whose route table directs 0.0.0.0/0 to an Internet Gateway (`igw-xxxx`). If it points to another NAT or local only, traffic loops or drops.'
          }
        ],
        fix: 'Delete the misconfigured NAT Gateway and provision a new one explicitly inside a verified Public Subnet with a default route to an Internet Gateway.',
        verification: 'Confirm NAT Gateway subnet has route: 0.0.0.0/0 -> igw-xxxx.',
        prevention: 'Strict naming conventions: prefix public subnets with "public-" and private subnets with "private-".'
      },
      {
        id: 'cause-3',
        cause: 'VPC Endpoints for AWS services are missing when outbound internet is intentionally forbidden',
        likelihood: 'medium',
        checks: [
          {
            action: 'Check for Gateway VPC Endpoints for S3 (Amazon Linux package repository storage)',
            command: 'aws ec2 describe-vpc-endpoints --filters "Name=vpc-id,Values=$VPC_ID" "Name=service-name,Values=com.amazonaws.us-east-1.s3"',
            consoleLocation: 'VPC Console > Endpoints',
            interpretation: 'Amazon Linux packages are hosted on S3. An S3 VPC Endpoint allows instances to update without requiring a NAT Gateway.'
          }
        ],
        fix: 'Create a free Gateway VPC Endpoint for Amazon S3 and associate it with the private route tables: `aws ec2 create-vpc-endpoint --vpc-id $VPC_ID --service-name com.amazonaws.us-east-1.s3 --route-table-ids $PRIV_RT_ID`.',
        verification: 'Run `dnf check-update` inside the private instance without a NAT Gateway.',
        prevention: 'Always provision S3 and DynamoDB Gateway VPC Endpoints in custom VPCs; they are free of charge.'
      }
    ]
  },
  {
    id: 'app-cant-connect-rds',
    title: 'Application Server Cannot Connect to Amazon RDS Database',
    symptom: 'Application logs display database connection error: `Connection timed out` or `FATAL: remaining connection slots are reserved` or `could not connect to server: Connection refused`.',
    impact: 'Backend application services cannot read or write customer data, resulting in widespread 500 errors across all user-facing services.',
    causes: [
      {
        id: 'cause-1',
        cause: 'RDS Security Group does not authorize inbound traffic from App Security Group',
        likelihood: 'high',
        checks: [
          {
            action: 'Inspect RDS DB instance Security Group ingress rules',
            command: 'aws ec2 describe-security-groups --group-ids $(aws rds describe-db-instances --db-instance-identifier $DB_ID --query "DBInstances[0].VpcSecurityGroups[0].VpcSecurityGroupId" --output text) --query "SecurityGroups[0].IpPermissions"',
            consoleLocation: 'RDS Console > Databases > Connectivity & security > Security groups',
            interpretation: 'Verify there is an inbound rule for the database port (e.g. 5432 for Postgres, 3306 for MySQL) referencing the application security group ID.'
          }
        ],
        fix: 'Add an inbound rule to the RDS Security Group permitting the database port from the application Security Group: `aws ec2 authorize-security-group-ingress --group-id $DB_SG --protocol tcp --port 5432 --source-group $APP_SG`.',
        verification: 'From the EC2 app instance, run `nc -zv -w 5 $RDS_ENDPOINT 5432` to confirm TCP handshake succeeds.',
        prevention: 'Reference security groups by ID rather than CIDR blocks in infrastructure templates.'
      },
      {
        id: 'cause-2',
        cause: 'Application using incorrect endpoint (e.g. EC2 localhost or reader endpoint for writes)',
        likelihood: 'medium',
        checks: [
          {
            action: 'Verify configured database connection string against actual RDS endpoint',
            command: 'aws rds describe-db-instances --db-instance-identifier $DB_ID --query "DBInstances[0].Endpoint.Address" --output text',
            consoleLocation: 'RDS Console > Databases > Connectivity & security > Endpoint & port',
            interpretation: 'Check application environment variables or SSM Parameter Store to ensure the exact RDS endpoint address matches.'
          }
        ],
        fix: 'Update the application environment configuration to use the RDS endpoint retrieved from AWS.',
        verification: 'Run `echo $DATABASE_URL` in application environment and test connectivity using `pg_isready -h $RDS_HOST -p 5432`.',
        prevention: 'Inject RDS endpoints dynamically using AWS Systems Manager Parameter Store or CloudFormation output exports.'
      },
      {
        id: 'cause-3',
        cause: 'RDS DB Instance maximum connections exceeded',
        likelihood: 'medium',
        checks: [
          {
            action: 'Check CloudWatch DatabaseConnections metric for the RDS instance',
            command: 'aws cloudwatch get-metric-statistics --namespace AWS/RDS --metric-name DatabaseConnections --dimensions Name=DBInstanceIdentifier,Value=$DB_ID --start-time $(date -u -d "1 hour ago" +%Y-%m-%dT%H:%M:%SZ) --end-time $(date -u +%Y-%m-%dT%H:%M:%SZ) --period 300 --statistics Maximum',
            consoleLocation: 'RDS Console > Databases > Monitoring tab > Database connections',
            interpretation: 'If connections reach the maximum allowed for the instance class (e.g. ~80 on db.t3.micro), new connections are refused.'
          }
        ],
        fix: 'Deploy Amazon RDS Proxy to pool and share database connections, or terminate runaway connection leaks and increase DB instance size.',
        verification: 'Check `DatabaseConnections` metric drops within healthy thresholds.',
        prevention: 'Enable connection pooling (e.g. HikariCP or PgBouncer) in application code and set up CloudWatch alarms on connection thresholds.'
      }
    ]
  },
  {
    id: 's3-access-denied',
    title: 'Amazon S3 Returns 403 AccessDenied Error',
    symptom: 'AWS CLI or SDK calls to S3 fail with `An error occurred (AccessDenied) when calling the PutObject/GetObject/ListBucket operation: Access Denied`.',
    impact: 'File uploads, document processing pipelines, and data storage workflows abort with critical authorization errors.',
    causes: [
      {
        id: 'cause-1',
        cause: 'IAM Role or User lacks required action permission or bucket resource ARN is incorrect',
        likelihood: 'high',
        checks: [
          {
            action: 'Inspect the IAM policy attached to the calling identity',
            command: 'aws iam get-role-policy --role-name $ROLE_NAME --policy-name $POLICY_NAME || aws iam list-attached-role-policies --role-name $ROLE_NAME',
            consoleLocation: 'IAM Console > Roles > Permissions tab',
            interpretation: 'Verify if `s3:ListBucket` targets `arn:aws:s3:::bucket-name` and `s3:GetObject`/`s3:PutObject` targets `arn:aws:s3:::bucket-name/*`.'
          },
          {
            action: 'Run IAM Policy Simulator on the failing action',
            command: 'aws iam simulate-principal-policy --policy-source-arn $ROLE_ARN --action-names s3:GetObject --resource-arns "arn:aws:s3:::$BUCKET_NAME/test.txt"',
            interpretation: 'If EvalDecision returns "implicitDeny", the IAM policy does not match the resource or action.'
          }
        ],
        fix: 'Update the IAM policy to include both bucket-level (`arn:aws:s3:::bucket`) and object-level (`arn:aws:s3:::bucket/*`) resource specifications for the required actions.',
        verification: 'Test S3 read access: `aws s3 ls s3://$BUCKET_NAME` and `aws s3 cp test.txt s3://$BUCKET_NAME/`.',
        prevention: 'Always remember the rule: bucket actions (ListBucket) need bucket ARN; object actions (GetObject, PutObject) need `bucket/*` ARN.'
      },
      {
        id: 'cause-2',
        cause: 'S3 Bucket Policy contains an Explicit Deny statement matching the caller',
        likelihood: 'high',
        checks: [
          {
            action: 'Examine S3 bucket policy statements',
            command: 'aws s3api get-bucket-policy --bucket $BUCKET_NAME --query Policy --output text | jq .',
            consoleLocation: 'S3 Console > Buckets > Permissions tab > Bucket Policy',
            interpretation: 'Look for "Effect": "Deny" statements. An explicit deny overrides ALL allows, including IAM administrator roles.'
          }
        ],
        fix: 'Add an exception to the Deny statement condition (e.g. `StringNotEquals: { "aws:PrincipalArn": [...] }`) or remove conflicting conditions.',
        verification: 'Run `aws s3api get-object --bucket $BUCKET_NAME --key test.txt downloaded.txt`.',
        prevention: 'Carefully test bucket policy Deny conditions using IAM Policy Simulator before applying them to production buckets.'
      },
      {
        id: 'cause-3',
        cause: 'KMS Key Policy denies access when reading SSE-KMS encrypted objects',
        likelihood: 'medium',
        checks: [
          {
            action: 'Check KMS key policy and encryption settings of the S3 object',
            command: 'aws s3api head-object --bucket $BUCKET_NAME --key $KEY_NAME --query "ServerSideEncryption"',
            consoleLocation: 'S3 Console > Objects > Properties > Server-side encryption settings',
            interpretation: 'If object is encrypted with `aws:kms`, the calling IAM identity MUST possess `kms:Decrypt` and `kms:GenerateDataKey` permissions on that KMS key.'
          }
        ],
        fix: 'Update the KMS Key Policy or IAM policy to grant `kms:Decrypt` on the KMS Key ARN used to encrypt the S3 object.',
        verification: 'Download object: `aws s3 cp s3://$BUCKET_NAME/$KEY_NAME ./output.txt`.',
        prevention: 'When using KMS CMKs, add the application IAM role to the KMS key policy "Key users" list.'
      }
    ]
  },
  {
    id: 'lb-unhealthy-targets',
    title: 'Application Load Balancer Reports Unhealthy Targets (HTTP 502/504)',
    symptom: 'ALB Target Group shows 0 healthy targets, with targets displaying state "unhealthy". ALB returns HTTP 502 Bad Gateway to clients.',
    impact: 'Load balancer cannot route incoming client requests to backend compute targets, causing total application outage.',
    causes: [
      {
        id: 'cause-1',
        cause: 'Health check path returns unexpected HTTP status code (e.g. 404 Not Found or 301 Redirect)',
        likelihood: 'high',
        checks: [
          {
            action: 'Inspect target health description and error reason',
            command: 'aws elbv2 describe-target-health --target-group-arn $TG_ARN --query "TargetHealthDescriptions[*].[Target.Id,TargetHealth.State,TargetHealth.Reason,TargetHealth.Description]" --output table',
            consoleLocation: 'EC2 Console > Target Groups > Health check tab',
            interpretation: 'If description says "Health checks failed with these codes: [404]" or "[301]", the application is not returning the expected HTTP 200 code on the configured health check path.'
          },
          {
            action: 'Test health check path directly against the instance IP from within the VPC',
            command: 'curl -Iv http://$INSTANCE_PRIVATE_IP:80/health',
            interpretation: 'Verify if the response code matches the "Matcher" status code configured on the target group (default: 200).'
          }
        ],
        fix: 'Either create the endpoint `/health` returning HTTP 200 in the application, or modify target group health check matcher to include the returned status code (e.g. `200,301,302`): `aws elbv2 modify-target-group --target-group-arn $TG_ARN --health-check-path / --matcher HttpCode=200-399`.',
        verification: 'Wait 30 seconds and run `aws elbv2 describe-target-health --target-group-arn $TG_ARN` to verify status transitions to "healthy".',
        prevention: 'Standardize lightweight, dedicated `/healthz` endpoints that do not perform heavy database queries.'
      },
      {
        id: 'cause-2',
        cause: 'Instance Security Group blocks inbound traffic from ALB Security Group',
        likelihood: 'high',
        checks: [
          {
            action: 'Check target health description for timeout reason',
            command: 'aws elbv2 describe-target-health --target-group-arn $TG_ARN --query "TargetHealthDescriptions[*].TargetHealth.Reason"',
            interpretation: 'If reason is `Target.FailedHealthChecks` with description "Connection timed out", the target instance is not receiving or responding to TCP syn packets.'
          },
          {
            action: 'Examine instance security group rules',
            command: 'aws ec2 describe-security-groups --group-ids $INST_SG --query "SecurityGroups[0].IpPermissions"',
            consoleLocation: 'EC2 Console > Security Groups > Target Instance SG > Inbound rules',
            interpretation: 'Inbound port 80 must explicitly allow the ALB security group ID as the source.'
          }
        ],
        fix: 'Add ingress rule allowing target traffic from the ALB SG: `aws ec2 authorize-security-group-ingress --group-id $INST_SG --protocol tcp --port 80 --source-group $ALB_SG`.',
        verification: 'Verify target group transitions from unhealthy to healthy within the configured threshold period.',
        prevention: 'Automate security group chaining through Terraform or CloudFormation references.'
      },
      {
        id: 'cause-3',
        cause: 'Health check timeout is shorter than application response latency',
        likelihood: 'medium',
        checks: [
          {
            action: 'Check target group health check configuration parameters',
            command: 'aws elbv2 describe-target-groups --target-group-arns $TG_ARN --query "TargetGroups[0].[HealthCheckTimeoutSeconds,HealthCheckIntervalSeconds]"',
            consoleLocation: 'EC2 Console > Target Groups > Health checks tab',
            interpretation: 'If timeout is set to 2 seconds but backend application latency under load is 3 seconds, health checks will consistently fail.'
          }
        ],
        fix: 'Increase HealthCheckTimeoutSeconds (e.g. to 5 or 10 seconds) and ensure HealthCheckIntervalSeconds is larger than timeout.',
        verification: 'Monitor ALB `TargetResponseTime` metric in CloudWatch.',
        prevention: 'Never run intensive business logic or synchronous external calls in health check route handlers.'
      }
    ]
  },
  {
    id: 'cloudwatch-logs-missing',
    title: 'CloudWatch Logs Missing from EC2 or Container Workloads',
    symptom: 'Log events are not appearing in CloudWatch Logs Log Groups. Target log group is empty or missing expected recent log streams.',
    impact: 'Operations and security teams lack audit visibility, debugging information, and monitoring telemetry during incidents.',
    causes: [
      {
        id: 'cause-1',
        cause: 'EC2 IAM Instance Profile lacks permissions to create log streams and put log events',
        likelihood: 'high',
        checks: [
          {
            action: 'Examine CloudWatch Agent log file on the EC2 instance',
            command: 'sudo tail -n 20 /opt/aws/amazon-cloudwatch-agent/logs/amazon-cloudwatch-agent.log',
            consoleLocation: 'CloudWatch Console > Log groups',
            interpretation: 'Look for `AccessDeniedException: User ... is not authorized to perform: logs:PutLogEvents`.'
          },
          {
            action: 'Verify IAM policies attached to the instance role',
            command: 'aws iam list-attached-role-policies --role-name $ROLE_NAME --query "AttachedPolicies[*].PolicyName"',
            interpretation: 'Check if `CloudWatchAgentServerPolicy` is present.'
          }
        ],
        fix: 'Attach `CloudWatchAgentServerPolicy` to the instance role: `aws iam attach-role-policy --role-name $ROLE_NAME --policy-arn arn:aws:iam::aws:policy/CloudWatchAgentServerPolicy`.',
        verification: 'Restart CloudWatch agent: `sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl -a stop && sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl -a start` and check log group.',
        prevention: 'Enforce standard IAM roles containing CloudWatchAgentServerPolicy across all EC2 launch templates.'
      },
      {
        id: 'cause-2',
        cause: 'Amazon CloudWatch Agent is stopped or misconfigured',
        likelihood: 'high',
        checks: [
          {
            action: 'Check status of amazon-cloudwatch-agent service',
            command: 'sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl -m ec2 -a status',
            interpretation: 'If status is "stopped", the agent is not running.'
          },
          {
            action: 'Validate agent JSON configuration file syntax',
            command: 'cat /opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json | jq .',
            interpretation: 'Ensure file paths in the `collect_list` point to existing log files on disk.'
          }
        ],
        fix: 'Start the agent with the configuration: `sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl -a fetch-config -m ec2 -s -c file:/opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json`.',
        verification: 'Run `systemctl status amazon-cloudwatch-agent` and check CloudWatch Logs console for new log streams.',
        prevention: 'Manage CloudWatch Agent configuration centrally using AWS Systems Manager Parameter Store.'
      },
      {
        id: 'cause-3',
        cause: 'Outbound network connectivity to CloudWatch Logs endpoint is blocked',
        likelihood: 'medium',
        checks: [
          {
            action: 'Test HTTPS connectivity to regional logs endpoint from instance',
            command: 'curl -Iv --connect-timeout 5 https://logs.us-east-1.amazonaws.com',
            interpretation: 'If connection times out, instance has no NAT/IGW route or missing VPC Endpoint for `com.amazonaws.us-east-1.logs`.'
          }
        ],
        fix: 'Create an Interface VPC Endpoint for CloudWatch Logs (`com.amazonaws.<region>.logs`) in private subnets, or verify NAT Gateway routing.',
        verification: 'Confirm curl to `https://logs.<region>.amazonaws.com` establishes TLS handshake.',
        prevention: 'Deploy AWS VPC Endpoints for logs and monitoring in all strictly isolated private VPC architectures.'
      }
    ]
  },
  {
    id: 'autoscaling-no-launch',
    title: 'Auto Scaling Group Fails to Launch Instances',
    symptom: 'Auto Scaling group desired capacity is set to 2 or 4, but 0 instances are running. Scaling activities show failures.',
    impact: 'Application fails to scale under traffic spikes; capacity collapses, causing degradation or total outage.',
    causes: [
      {
        id: 'cause-1',
        cause: 'Subnets configured in ASG have exhausted available private IP addresses',
        likelihood: 'high',
        checks: [
          {
            action: 'Describe scaling activities for the Auto Scaling group',
            command: 'aws autoscaling describe-scaling-activities --auto-scaling-group-name $ASG_NAME --max-items 5 --query "Activities[*].[StartTime,StatusCode,StatusMessage]" --output table',
            consoleLocation: 'EC2 Console > Auto Scaling Groups > Activity tab',
            interpretation: 'Look for error: `Cannot launch instance... There are not enough free IP addresses in subnet-xxxx`.'
          },
          {
            action: 'Check available IP address count in associated subnets',
            command: 'aws ec2 describe-subnets --subnet-ids $SUBNET_IDS --query "Subnets[*].[SubnetId,AvailableIpAddressCount]" --output table',
            interpretation: 'If AvailableIpAddressCount is 0, no instances or ENIs can be provisioned in the subnet.'
          }
        ],
        fix: 'Add additional subnets with ample CIDR ranges to the Auto Scaling group: `aws autoscaling update-auto-scaling-group --auto-scaling-group-name $ASG_NAME --vpc-zone-identifier "$SUBNET1,$SUBNET2,$SUBNET3"`.',
        verification: 'Describe scaling activities to verify successful instance launches.',
        prevention: 'Size subnets properly (at least /24 for auto-scaling tiers) and set up CloudWatch alarms on available subnet IPs.'
      },
      {
        id: 'cause-2',
        cause: 'Specified AMI ID in Launch Template is invalid or deleted',
        likelihood: 'medium',
        checks: [
          {
            action: 'Check Launch Template AMI existence',
            command: 'AMI_ID=$(aws ec2 describe-launch-template-versions --launch-template-name $LT_NAME --versions "\$Default" --query "LaunchTemplateVersions[0].LaunchTemplateData.ImageId" --output text); aws ec2 describe-images --image-ids $AMI_ID',
            interpretation: 'If describe-images returns `InvalidAMIID.NotFound`, the AMI was deregistered or shared from an account that revoked access.'
          }
        ],
        fix: 'Create a new version of the Launch Template referencing a valid current AMI ID and set it as the default version.',
        verification: 'Execute `aws autoscaling start-instance-refresh --auto-scaling-group-name $ASG_NAME`.',
        prevention: 'Reference dynamic SSM Parameter Store public AMI aliases in launch templates or CI/CD pipelines.'
      },
      {
        id: 'cause-3',
        cause: 'AWS Account EC2 vCPU service quota limit reached',
        likelihood: 'medium',
        checks: [
          {
            action: 'Check scaling activity message for quota errors',
            command: 'aws autoscaling describe-scaling-activities --auto-scaling-group-name $ASG_NAME --query "Activities[0].StatusMessage"',
            interpretation: 'Look for `VcpuLimitExceeded` error message.'
          },
          {
            action: 'Query Service Quotas for running On-Demand standard vCPUs',
            command: 'aws service-quotas get-service-quota --service-code ec2 --quota-code L-1216C47A --query "Quota.Value"',
            consoleLocation: 'Service Quotas Console > Amazon EC2 > Running On-Demand Standard (A, C, D, H, I, M, R, T, Z) instances',
            interpretation: 'Compare current running vCPUs against account quota limit.'
          }
        ],
        fix: 'Request an immediate quota increase via AWS Service Quotas console, or scale down unused instances in the region.',
        verification: 'Confirm new scaling activity succeeds once quota is increased.',
        prevention: 'Configure CloudWatch alarms on Service Quota utilization metrics before launching large scaling events.'
      }
    ]
  },
  {
    id: 'lambda-timeout',
    title: 'AWS Lambda Function Times Out',
    symptom: 'Lambda executions terminate with `Task timed out after 3.00 seconds` or `Task timed out after 15.00 seconds` in CloudWatch Logs.',
    impact: 'API Gateway returns 504 Gateway Timeout or 502 Bad Gateway to clients; asynchronous messages fail and route to Dead Letter Queues.',
    causes: [
      {
        id: 'cause-1',
        cause: 'Lambda configured in a VPC subnet without internet route or NAT Gateway',
        likelihood: 'high',
        checks: [
          {
            action: 'Inspect Lambda VPC configuration',
            command: 'aws lambda get-function-configuration --function-name $FUNC_NAME --query "VpcConfig"',
            consoleLocation: 'Lambda Console > Functions > Configuration > VPC tab',
            interpretation: 'If Lambda is attached to VPC subnets, it can ONLY reach external internet/APIs if subnets route through a NAT Gateway. Private subnets without NAT will cause all external HTTP calls to hang until Lambda timeout.'
          }
        ],
        fix: 'Place Lambda ENIs in private subnets with a route to a NAT Gateway, or deploy Interface VPC Endpoints for the AWS services your Lambda function contacts.',
        verification: 'Test Lambda invocation: `aws lambda invoke --function-name $FUNC_NAME --log-type Tail response.json`.',
        prevention: 'Only configure Lambda in a VPC if it strictly needs access to private VPC resources like RDS or ElastiCache.'
      },
      {
        id: 'cause-2',
        cause: 'Function timeout configuration set too low for downstream database or API latency',
        likelihood: 'high',
        checks: [
          {
            action: 'Check configured function timeout duration',
            command: 'aws lambda get-function-configuration --function-name $FUNC_NAME --query "Timeout"',
            consoleLocation: 'Lambda Console > Configuration > General configuration > Timeout',
            interpretation: 'Default Lambda timeout is 3 seconds. Many cold starts, database connections, and external API calls require 10–30 seconds.'
          }
        ],
        fix: 'Increase Lambda timeout: `aws lambda update-function-configuration --function-name $FUNC_NAME --timeout 30`.',
        verification: 'Invoke function and check `Billed Duration` in CloudWatch logs.',
        prevention: 'Establish realistic timeout configurations based on downstream SLAs, and set up client-side HTTP timeouts shorter than the Lambda timeout.'
      },
      {
        id: 'cause-3',
        cause: 'Database connection exhaustion or connection hanging without timeout',
        likelihood: 'medium',
        checks: [
          {
            action: 'Inspect CloudWatch Logs for database connection lines prior to timeout',
            command: 'aws logs filter-log-events --log-group-name "/aws/lambda/$FUNC_NAME" --filter-pattern "connecting to database"',
            interpretation: 'If logs print "connecting to database..." and then nothing until "Task timed out", the DB connection pool is stalling or deadlocked.'
          }
        ],
        fix: 'Set connection timeout parameters (e.g. `connect_timeout=3` in PostgreSQL/MySQL drivers) and use Amazon RDS Proxy.',
        verification: 'Verify Lambda functions complete without timeouts in CloudWatch metrics.',
        prevention: 'Initialize database connections outside the handler in global scope to reuse across warm invocations.'
      }
    ]
  },
  {
    id: 'ecr-pull-failure',
    title: 'Container Orchestration Fails to Pull Image from Amazon ECR',
    symptom: 'ECS tasks fail to start with `CannotPullContainerError: inspect image has been retried 5 time(s)` or Kubernetes pods show `ImagePullBackOff`.',
    impact: 'Container deployments fail, new tasks cannot start, and autoscaling containers fail to scale up.',
    causes: [
      {
        id: 'cause-1',
        cause: 'ECS Task Execution Role lacks ECR pull permissions',
        likelihood: 'high',
        checks: [
          {
            action: 'Check executionRoleArn on the task definition',
            command: 'aws ecs describe-task-definition --task-definition $TASK_DEF --query "taskDefinition.executionRoleArn"',
            consoleLocation: 'ECS Console > Task Definitions > Select version > JSON tab',
            interpretation: 'Verify if `executionRoleArn` is defined. Note: `taskRoleArn` is for application code; `executionRoleArn` is required by the ECS agent to pull images.'
          },
          {
            action: 'Verify policies on the execution role',
            command: 'aws iam list-attached-role-policies --role-name $EXEC_ROLE_NAME',
            interpretation: 'Role must have `AmazonECSTaskExecutionRolePolicy` attached.'
          }
        ],
        fix: 'Attach `AmazonECSTaskExecutionRolePolicy` to the execution role: `aws iam attach-role-policy --role-name $EXEC_ROLE_NAME --policy-arn arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy`.',
        verification: 'Run `aws ecs run-task --cluster $CLUSTER --task-definition $TASK_DEF` and verify state reaches RUNNING.',
        prevention: 'Use standard IaC modules that automatically generate and attach the task execution role.'
      },
      {
        id: 'cause-2',
        cause: 'Subnet lacking internet access or missing ECR VPC Endpoints',
        likelihood: 'high',
        checks: [
          {
            action: 'Check if tasks run in private subnets without NAT Gateway or VPC Endpoints',
            command: 'aws ec2 describe-vpc-endpoints --filters "Name=vpc-id,Values=$VPC_ID" --query "VpcEndpoints[*].ServiceName"',
            consoleLocation: 'VPC Console > Endpoints',
            interpretation: 'For private subnets without NAT, pulling from ECR requires THREE VPC endpoints: `com.amazonaws.<region>.ecr.api`, `com.amazonaws.<region>.ecr.dkr`, and S3 Gateway Endpoint (`com.amazonaws.<region>.s3`).'
          }
        ],
        fix: 'Create Interface endpoints for `ecr.api` and `ecr.dkr`, and a Gateway endpoint for `s3` in the VPC.',
        verification: 'Start ECS task and confirm image download succeeds.',
        prevention: 'Include ECR endpoints and S3 gateway endpoint in foundational network IaC modules.'
      },
      {
        id: 'cause-3',
        cause: 'ECR repository policy denies cross-account access or image tag does not exist',
        likelihood: 'medium',
        checks: [
          {
            action: 'Verify image tag exists in ECR repository',
            command: 'aws ecr describe-images --repository-name $REPO_NAME --image-ids imageTag=$TAG',
            interpretation: 'If error `ImageNotFoundException` occurs, the CI/CD build failed to push the specified tag.'
          }
        ],
        fix: 'Push the required image tag or correct the image URI in the task definition.',
        verification: 'Confirm image tag exists using `aws ecr list-images`.',
        prevention: 'Enforce immutable image tags in ECR so release tags cannot be overwritten or accidentally deleted.'
      }
    ]
  },
  {
    id: 'container-deploy-fail',
    title: 'Container Works Locally but Fails When Deployed to AWS (ECS/Fargate)',
    symptom: 'Container runs smoothly with `docker run` on developer workstation, but crashes immediately upon deployment to AWS ECS with `Essential container in task exited` (ExitCode 1, 137, or 139).',
    impact: 'New feature releases cannot be deployed; production services experience rolling update deployment failures.',
    causes: [
      {
        id: 'cause-1',
        cause: 'CPU architecture mismatch (Image built on ARM64 Apple Silicon deployed to x86_64 Fargate)',
        likelihood: 'high',
        checks: [
          {
            action: 'Check image architecture manifest in ECR or local docker',
            command: 'docker inspect $IMAGE_NAME --format "{{.Architecture}}"',
            interpretation: 'If image architecture is "arm64" but ECS Task Definition specifies `cpuArchitecture: "X86_64"`, the container crashes instantly with exec format error.'
          },
          {
            action: 'Inspect stopped task container exit reason in ECS',
            command: 'aws ecs describe-tasks --cluster $CLUSTER --tasks $TASK_ID --query "tasks[0].containers[0].[exitCode,reason]"',
            interpretation: 'ExitCode 1 or 127 with "exec format error" indicates architecture mismatch.'
          }
        ],
        fix: 'Build image with multi-architecture support: `docker buildx build --platform linux/amd64 -t $REPO_URI:$TAG --push .` or update ECS task definition runtimePlatform to ARM64.',
        verification: 'Re-deploy task and verify container initializes properly.',
        prevention: 'Always build production images inside CI/CD pipelines (like AWS CodeBuild) matching target deployment architecture.'
      },
      {
        id: 'cause-2',
        cause: 'Container exceeds allocated Fargate memory limit (Out Of Memory - OOM Killed)',
        likelihood: 'high',
        checks: [
          {
            action: 'Inspect stopped task details for ExitCode 137',
            command: 'aws ecs describe-tasks --cluster $CLUSTER --tasks $TASK_ID --query "tasks[0].containers[0].[exitCode,reason]"',
            consoleLocation: 'ECS Console > Clusters > Tasks > Stopped tasks > Task detail',
            interpretation: 'ExitCode 137 means the Linux kernel sent SIGKILL because the process exceeded the container memory limit (OOMKilled).'
          }
        ],
        fix: 'Increase task memory limit in Task Definition (e.g. from 512 MB to 1024 MB or 2048 MB) and optimize memory utilization in code.',
        verification: 'Inspect CloudWatch Container Insights `MemoryUtilized` metric to ensure memory headroom.',
        prevention: 'Configure CloudWatch Container Insights alerts when memory utilization exceeds 80%.'
      },
      {
        id: 'cause-3',
        cause: 'Missing environment variables or AWS credentials injected locally but absent in cloud',
        likelihood: 'medium',
        checks: [
          {
            action: 'Check CloudWatch Logs for application stack trace on startup',
            command: 'aws logs get-log-events --log-group-name "/ecs/$TASK_DEF" --log-stream-name $STREAM_NAME --limit 30 --query "events[*].message"',
            interpretation: 'Look for `KeyError: DATABASE_URL` or `FileNotFoundError` or `NoCredentialsError`.'
          }
        ],
        fix: 'Supply required environment variables via Secrets Manager or SSM Parameter Store integration in the ECS Task Definition.',
        verification: 'Verify task logs show successful startup sequence.',
        prevention: 'Maintain a strict `.env.example` schema and validate environment variables on application bootstrap.'
      }
    ]
  },
  {
    id: 'dns-wrong-destination',
    title: 'DNS Record Points to Wrong Destination (Route 53 Routing Issues)',
    symptom: 'Browsing to custom domain `api.example.com` returns wrong website, 404 from unknown server, or old retired infrastructure.',
    impact: 'Users are routed to obsolete servers or security vulnerabilities arise from dangling DNS records.',
    causes: [
      {
        id: 'cause-1',
        cause: 'Route 53 Alias record points to stale ELB DNS name after recreation',
        likelihood: 'high',
        checks: [
          {
            action: 'Resolve the domain name using dig or nslookup',
            command: 'dig +short api.example.com',
            interpretation: 'Compare returned IP addresses with current ALB IP addresses (`dig +short $CURRENT_ALB_DNS`).'
          },
          {
            action: 'Check Route 53 resource record set target',
            command: 'aws route53 list-resource-record-sets --hosted-zone-id $ZONE_ID --query "ResourceRecordSets[?Name==\`api.example.com.\`]"',
            consoleLocation: 'Route 53 Console > Hosted zones > Select zone > Records',
            interpretation: 'When ALBs are deleted and recreated, they receive a brand new DNS name; old alias targets become invalid.'
          }
        ],
        fix: 'Update the Route 53 Alias record to target the active ALB DNS name and Hosted Zone ID: `aws route53 change-resource-record-sets --hosted-zone-id $ZONE_ID --change-batch file://update-record.json`.',
        verification: 'Query `dig +short api.example.com` and verify response matches current load balancer.',
        prevention: 'Manage Route 53 records and load balancers together in the same CloudFormation/Terraform stack.'
      },
      {
        id: 'cause-2',
        cause: 'Resolver TTL caching delaying update propagation',
        likelihood: 'high',
        checks: [
          {
            action: 'Check authoritative Route 53 nameserver directly to bypass local cache',
            command: 'NS=$(aws route53 get-hosted-zone --id $ZONE_ID --query "DelegationSet.NameServers[0]" --output text); dig @$NS +short api.example.com',
            interpretation: 'If the authoritative nameserver returns the new IP, the issue is purely client/ISP DNS caching governed by TTL.'
          }
        ],
        fix: 'Wait for the prior TTL window to expire. Lower TTL to 60 seconds 24 hours prior to scheduled production migrations.',
        verification: 'Confirm query without direct nameserver resolves to new IP after TTL expiry.',
        prevention: 'Always lower TTL to 60 or 300 seconds well in advance of planned DNS cutovers.'
      },
      {
        id: 'cause-3',
        cause: 'Domain registrar nameservers do not match Route 53 Hosted Zone delegation set',
        likelihood: 'medium',
        checks: [
          {
            action: 'Compare WHOIS nameservers with Route 53 assigned nameservers',
            command: 'whois example.com | grep -i "Name Server"',
            consoleLocation: 'Route 53 Console > Hosted zones > Hosted zone details > Name servers',
            interpretation: 'If the 4 nameservers at the domain registrar differ from the 4 nameservers in Route 53 delegation set, Route 53 records are completely ignored.'
          }
        ],
        fix: 'Update the registrar nameserver settings to match the 4 authoritative Route 53 nameservers.',
        verification: 'Run `dig NS example.com` to confirm authoritative delegation.',
        prevention: 'Never recreate hosted zones for existing domains without immediately updating registrar nameservers.'
      }
    ]
  },
  {
    id: 'guardduty-finding',
    title: 'Amazon GuardDuty Security Finding: Compromised Credentials or Port Scan',
    symptom: 'AWS GuardDuty alerts with High or Medium severity finding such as `UnauthorizedAccess:IAMUser/InstanceCredentialExfiltration.OutsideAWS` or `Recon:EC2/Portscan`.',
    impact: 'Potential data breach, malicious unauthorized API activity, cryptocurrency mining, or active network compromise.',
    causes: [
      {
        id: 'cause-1',
        cause: 'Temporary EC2 instance role credentials exfiltrated and used from external IP',
        likelihood: 'high',
        checks: [
          {
            action: 'Retrieve GuardDuty finding details',
            command: 'aws guardduty get-findings --detector-id $DETECTOR_ID --finding-ids $FINDING_ID --query "Findings[0].[Type,Severity,Resource,Service.Action]"',
            consoleLocation: 'GuardDuty Console > Findings',
            interpretation: 'Examine `callerType` and client IP address that invoked AWS APIs using the instance profile credentials.'
          },
          {
            action: 'Search CloudTrail for recent API calls by the affected role',
            command: 'aws cloudtrail lookup-events --lookup-attributes AttributeKey=Username,AttributeValue=$ROLE_NAME --max-results 10',
            interpretation: 'Identify unauthorized API calls performed outside AWS IP ranges.'
          }
        ],
        fix: 'Attach an explicit Deny policy to the IAM role restricting calls to the VPC or revoke existing role sessions: `aws iam put-role-policy --role-name $ROLE_NAME --policy-name RevokeOldSessions --policy-document \'{"Version":"2012-10-17","Statement":[{"Effect":"Deny","Action":"*","Resource":"*","Condition":{"DateLessThan":{"aws:TokenIssueTime":"\'$(date -u +%Y-%m-%dT%H:%M:%SZ)\'"}}}]}\'`. Enforce IMDSv2 on all instances to stop future SSRF credential extraction.',
        verification: 'Verify subsequent calls with old tokens fail with AccessDenied.',
        prevention: 'Mandate IMDSv2 (`HttpTokens=required`, `HttpPutResponseHopLimit=1`) account-wide using AWS SCPs.'
      },
      {
        id: 'cause-2',
        cause: 'EC2 instance compromised via open vulnerability and performing outbound network port scanning',
        likelihood: 'medium',
        checks: [
          {
            action: 'Identify target instance and outbound destination ports from finding',
            command: 'aws guardduty get-findings --detector-id $DETECTOR_ID --finding-ids $FINDING_ID --query "Findings[0].Service.Action.NetworkConnectionAction"',
            interpretation: 'Look for large numbers of outbound connections across multiple IP addresses.'
          }
        ],
        fix: 'Immediately isolate the compromised instance by modifying its security group to an isolation SG with 0 inbound/outbound rules. Take EBS snapshots for forensic investigation.',
        verification: 'Confirm instance can no longer generate network egress.',
        prevention: 'Keep software patched, run Amazon Inspector vulnerability scans, and implement egress filtering.'
      },
      {
        id: 'cause-3',
        cause: 'Legitimate penetration testing or vulnerability scanner triggering alert',
        likelihood: 'low',
        checks: [
          {
            action: 'Correlate finding timestamp and source IP with internal scheduled security testing',
            interpretation: 'Check if approved vulnerability scanner IP matches the finding source IP.'
          }
        ],
        fix: 'Archive the finding in GuardDuty with a comment and add trusted IP addresses to GuardDuty Trusted IP List.',
        verification: 'Confirm finding moves to Archived status.',
        prevention: 'Maintain an active GuardDuty Trusted IP List for internal vulnerability scanning appliances.'
      }
    ]
  },
  {
    id: 'spending-increase',
    title: 'Unexpected Spending Increase / Cloud Cost Spike',
    symptom: 'AWS Cost Anomaly Detection alerts or monthly billing forecast suddenly increases significantly above normal run rate.',
    impact: 'Budget breach, financial waste, unallocated operating expenditure.',
    causes: [
      {
        id: 'cause-1',
        cause: 'NAT Gateway data processing charges due to unexpected inter-AZ or outbound transfers',
        likelihood: 'high',
        checks: [
          {
            action: 'Query Cost Explorer for daily cost breakdown by service for the last 7 days',
            command: 'aws ce get-cost-and-usage --time-period Start=$(date -d "7 days ago" +%Y-%m-%d),End=$(date +%Y-%m-%d) --granularity DAILY --metrics "UnblendedCost" --group-by Type=DIMENSION,Key=SERVICE --query "ResultsByTime[*].[TimePeriod.Start,Groups[?Metrics.UnblendedCost.Amount > \`10\`].[Keys[0],Metrics.UnblendedCost.Amount]]"',
            consoleLocation: 'Billing Console > Cost Explorer',
            interpretation: 'Identify which service (e.g. EC2-Other representing NAT Gateway data processing) surged.'
          },
          {
            action: 'Inspect NAT Gateway BytesProcessed metric in CloudWatch',
            command: 'aws cloudwatch get-metric-statistics --namespace AWS/NATGateway --metric-name BytesProcessed --dimensions Name=NatGatewayId,Value=$NAT_ID --start-time $(date -u -d "3 days ago" +%Y-%m-%dT%H:%M:%SZ) --end-time $(date -u +%Y-%m-%dT%H:%M:%SZ) --period 86400 --statistics Sum',
            interpretation: 'High GB processed through NAT Gateway ($0.045/GB) often stems from backup transfers or software downloads.'
          }
        ],
        fix: 'Deploy S3 Gateway VPC Endpoints so S3 data transfers bypass NAT Gateway completely, cutting data processing fees to $0.',
        verification: 'Monitor NAT Gateway BytesProcessed metric dropping toward zero for S3 traffic.',
        prevention: 'Always provision S3 Gateway Endpoints in every custom VPC.'
      },
      {
        id: 'cause-2',
        cause: 'Unattached EBS volumes, unassociated Elastic IPs, or obsolete snapshots left running',
        likelihood: 'high',
        checks: [
          {
            action: 'List all unattached (available) EBS volumes in the region',
            command: 'aws ec2 describe-volumes --filters Name=status,Values=available --query "Volumes[*].[VolumeId,Size,CreateTime]" --output table',
            interpretation: 'Volumes detached from terminated instances continue to be billed for full provisioned capacity.'
          },
          {
            action: 'List unassociated Elastic IPs',
            command: 'aws ec2 describe-addresses --query "Addresses[?NetworkInterfaceId==null].[PublicIp,AllocationId]" --output table',
            interpretation: 'AWS charges an hourly fee for idle Elastic IPs not attached to running instances.'
          }
        ],
        fix: 'Delete unattached EBS volumes and release unassociated Elastic IPs: `aws ec2 delete-volume --volume-id $VOL_ID` and `aws ec2 release-address --allocation-id $ALLOC_ID`.',
        verification: 'Re-run inspection commands to ensure output is empty.',
        prevention: 'Implement automated AWS Lambda or AWS Config cleanup rules for orphaned volumes and IPs.'
      },
      {
        id: 'cause-3',
        cause: 'Accidental deployment of oversized instances or runaway Lambda infinite recursion',
        likelihood: 'medium',
        checks: [
          {
            action: 'Inspect running EC2 instance types and count',
            command: 'aws ec2 describe-instances --filters Name=instance-state-name,Values=running --query "Reservations[*].Instances[*].[InstanceId,InstanceType,LaunchTime]" --output table',
            interpretation: 'Spot unexpected expensive instance types (e.g. p4d, c5.18xlarge).'
          }
        ],
        fix: 'Stop or downsize instances to appropriate family sizing, and configure Lambda Reserved Concurrency to halt infinite recursion loops.',
        verification: 'Check hourly billing in Cost Explorer stabilizes.',
        prevention: 'Configure AWS Budgets with proactive email alerts at 80% and 100% threshold targets, plus Service Control Policies (SCPs) restricting expensive instance families.'
      }
    ]
  },
  {
    id: 'database-slow',
    title: 'Amazon RDS Database Becomes Slow / Query Bottlenecks',
    symptom: 'Application response times spike dramatically; API endpoints taking >5 seconds; database CPU utilization at 100% or IOPS throttling.',
    impact: 'System-wide degradation, timeouts, frustrated users, cascading microservice connection failures.',
    causes: [
      {
        id: 'cause-1',
        cause: 'Unindexed SQL queries causing full table scans',
        likelihood: 'high',
        checks: [
          {
            action: 'Inspect RDS Performance Insights for top SQL statements by load (Average Active Sessions)',
            consoleLocation: 'RDS Console > Performance Insights > Top SQL tab',
            interpretation: 'Look for queries consuming the largest slice of CPU and wait states (e.g. `wait/io/table/sql/handler`).'
          },
          {
            action: 'Run EXPLAIN ANALYZE on offending query in database engine',
            command: 'psql -h $RDS_HOST -U $USER -d $DB -c "EXPLAIN ANALYZE SELECT * FROM orders WHERE customer_id = 99999;"',
            interpretation: 'Look for `Seq Scan` (Sequential Table Scan) indicating missing index on `customer_id`.'
          }
        ],
        fix: 'Create proper database index on filter columns: `CREATE INDEX CONCURRENTLY idx_orders_customer ON orders(customer_id);`.',
        verification: 'Re-run `EXPLAIN ANALYZE` and verify plan uses `Index Scan` with sub-millisecond execution.',
        prevention: 'Enable Amazon DevOps Guru or RDS Performance Insights with automated alerts on query regression.'
      },
      {
        id: 'cause-2',
        cause: 'EBS storage volume IOPS throttling or burst bucket depletion on gp2/gp3',
        likelihood: 'high',
        checks: [
          {
            action: 'Check CloudWatch ReadIOPS, WriteIOPS, and DiskQueueDepth metrics',
            command: 'aws cloudwatch get-metric-statistics --namespace AWS/RDS --metric-name DiskQueueDepth --dimensions Name=DBInstanceIdentifier,Value=$DB_ID --start-time $(date -u -d "2 hours ago" +%Y-%m-%dT%H:%M:%SZ) --end-time $(date -u +%Y-%m-%dT%H:%M:%SZ) --period 300 --statistics Average',
            consoleLocation: 'RDS Console > Databases > Monitoring > Disk Queue Depth',
            interpretation: 'A persistent queue depth greater than 5 indicates storage IO bottlenecks.'
          }
        ],
        fix: 'Modify RDS instance storage to gp3 with higher provisioned IOPS (e.g. 12,000 IOPS) or io2 Block Express.',
        verification: 'Verify DiskQueueDepth returns to near zero and ReadLatency drops below 5ms.',
        prevention: 'Standardize all production databases on gp3 or io2 with adequate provisioned IOPS baseline.'
      },
      {
        id: 'cause-3',
        cause: 'Heavy analytical reporting queries starving OLTP write transactions',
        likelihood: 'medium',
        checks: [
          {
            action: 'Check CloudWatch DatabaseConnections and ReadIOPS vs WriteIOPS',
            interpretation: 'Heavy read spikes correlate with reporting batch jobs.'
          }
        ],
        fix: 'Provision an Amazon RDS Read Replica and offload read-only and analytical queries to the Read Replica endpoint.',
        verification: 'Verify primary DB instance CPU utilization drops substantially.',
        prevention: 'Direct all read-only workloads to read replicas or Amazon Aurora reader endpoints.'
      }
    ]
  },
  {
    id: 'terraform-failure',
    title: 'Terraform or CloudFormation Deployment Fails / State Lock Contention',
    symptom: 'Running `terraform apply` fails with `Error: Error acquiring the state lock: ConditionalCheckFailedException` or CloudFormation stack enters `ROLLBACK_IN_PROGRESS`.',
    impact: 'Automated CI/CD pipelines blocked; new infrastructure changes cannot be applied.',
    causes: [
      {
        id: 'cause-1',
        cause: 'Dangling Terraform state lock in Amazon DynamoDB after cancelled or killed pipeline run',
        likelihood: 'high',
        checks: [
          {
            action: 'Inspect DynamoDB lock table for active LockID item',
            command: 'aws dynamodb get-item --table-name $DYNAMODB_LOCK_TABLE --key \'{"LockID":{"S":"my-project/terraform.tfstate-md5"}}\'',
            consoleLocation: 'DynamoDB Console > Tables > Select lock table > Explore items',
            interpretation: 'If a previous CI/CD runner crashed or was killed with SIGKILL, the lock record remains in DynamoDB indefinitely.'
          }
        ],
        fix: 'Verify no other team member is actively applying changes, then unlock state: `terraform force-unlock <LOCK_ID>` or delete the item from DynamoDB.',
        verification: 'Run `terraform plan` to ensure state locking is acquired and released cleanly.',
        prevention: 'Ensure CI/CD build agents cleanly handle termination signals to allow graceful cleanup.'
      },
      {
        id: 'cause-2',
        cause: 'CloudFormation resource deletion conflict (e.g. S3 bucket not empty during stack update/delete)',
        likelihood: 'high',
        checks: [
          {
            action: 'Examine CloudFormation Stack events for failure reason',
            command: 'aws cloudformation describe-stack-events --stack-name $STACK_NAME --query "StackEvents[?ResourceStatus==\`CREATE_FAILED\` || ResourceStatus==\`DELETE_FAILED\`].[LogicalResourceId,ResourceStatusReason]" --output table',
            consoleLocation: 'CloudFormation Console > Stacks > Select stack > Events tab',
            interpretation: 'Look for `The bucket you are attempting to delete is not empty`.'
          }
        ],
        fix: 'Empty the S3 bucket using `aws s3 rm s3://$BUCKET_NAME --recursive`, then re-trigger stack deletion or update.',
        verification: 'Confirm stack reaches UPDATE_COMPLETE or DELETE_COMPLETE status.',
        prevention: 'Use DeletionPolicy: Retain on S3 buckets or enable automated custom resource bucket cleaners.'
      },
      {
        id: 'cause-3',
        cause: 'IAM permissions insufficient for the deploying CI/CD role',
        likelihood: 'medium',
        checks: [
          {
            action: 'Check Terraform apply output for AccessDenied API responses',
            interpretation: 'Look for specific missing actions like `iam:PassRole` or `ec2:RunInstances`.'
          }
        ],
        fix: 'Grant the required least-privilege action in the CI/CD execution role policy.',
        verification: 'Re-run `terraform plan && terraform apply`.',
        prevention: 'Validate IAM role permissions against target module resource requirements in staging environments.'
      }
    ]
  },
  {
    id: 'deployment-regression',
    title: 'Application Deployment Introduces Production Regression (Elevated 5xx Errors)',
    symptom: 'Immediately following a code deployment, CloudWatch alarms fire on ALB `HTTPCode_Target_5XX_Count` and error rates surge above 5%.',
    impact: 'Users experience broken checkouts, failed page loads, and service disruption.',
    causes: [
      {
        id: 'cause-1',
        cause: 'Application runtime exception on startup (e.g. missing environment variable or bad migration)',
        likelihood: 'high',
        checks: [
          {
            action: 'Tail live application logs in CloudWatch Logs Insights',
            command: 'aws logs tail "/aws/ecs/production-app" --since 10m --filter-pattern "ERROR"',
            consoleLocation: 'CloudWatch Logs > Log groups > Search log group',
            interpretation: 'Look for fatal unhandled exceptions, syntax errors, or failed schema migrations.'
          },
          {
            action: 'Check CloudWatch ALB Target 5XX metric rate',
            command: 'aws cloudwatch get-metric-statistics --namespace AWS/ApplicationELB --metric-name HTTPCode_Target_5XX_Count --dimensions Name=LoadBalancer,Value=$ALB_NAME --start-time $(date -u -d "30 minutes ago" +%Y-%m-%dT%H:%M:%SZ) --end-time $(date -u +%Y-%m-%dT%H:%M:%SZ) --period 60 --statistics Sum',
            interpretation: 'Correlate timestamp of spike with deployment completion timestamp.'
          }
        ],
        fix: 'Initiate immediate automated rollback to previous known-good task definition or deployment revision: `aws ecs update-service --cluster $CLUSTER --service $SERVICE --task-definition $PREVIOUS_TASK_DEF`.',
        verification: 'Verify ALB 5XX metric returns to zero and healthy target count returns to 100%.',
        prevention: 'Implement Blue/Green deployments with AWS CodeDeploy, Canary traffic shifting (e.g. 10% for 5 mins), and automated CloudWatch alarm rollbacks.'
      },
      {
        id: 'cause-2',
        cause: 'New code version database schema incompatibility with existing data',
        likelihood: 'medium',
        checks: [
          {
            action: 'Review database error logs in Amazon RDS',
            command: 'aws rds describe-db-log-files --db-instance-identifier $DB_ID',
            interpretation: 'Look for missing columns or type mismatches in SQL queries.'
          }
        ],
        fix: 'Roll back application version and run reverse migration script.',
        verification: 'Check error logs clear and database transactions succeed.',
        prevention: 'Follow expand-and-contract migration patterns: make database schema changes backward-compatible before deploying code changes.'
      },
      {
        id: 'cause-3',
        cause: 'New deployment overwhelmed downstream microservice or third-party API',
        likelihood: 'medium',
        checks: [
          {
            action: 'Inspect AWS X-Ray service map for high fault rates on downstream nodes',
            consoleLocation: 'CloudWatch Console > X-Ray traces > Service map',
            interpretation: 'Identify whether the node turning red is the application itself or a downstream microservice dependency.'
          }
        ],
        fix: 'Throttle incoming requests using API Gateway usage plans or enable circuit-breaker patterns.',
        verification: 'Confirm latency and fault rates stabilize.',
        prevention: 'Conduct performance load testing in pre-production staging with realistic traffic profiles.'
      }
    ]
  }
];
