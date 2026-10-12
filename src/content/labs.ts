import { Lab } from '../types';

export const allLabs: Lab[] = [
  {
    id: 'iam-roles',
    title: 'IAM and Roles: Principle of Least Privilege',
    description: 'Create IAM policies, custom roles for EC2 instances, and implement the principle of least privilege using policy simulator and AWS CLI.',
    difficulty: 'beginner',
    estimatedMinutes: 30,
    order: 1,
    objectives: [
      'Create a custom IAM policy granting read-only access to a specific S3 bucket',
      'Attach the custom policy to an EC2 instance role with an instance profile',
      'Verify role assumption and permission boundaries using AWS CLI commands',
      'Test permission denials when unauthorized actions are attempted'
    ],
    prerequisites: ['Basic understanding of AWS concepts and AWS CLI configuration'],
    services: ['IAM', 'S3', 'STS'],
    costWarning: 'IAM is a free AWS service. Standard S3 API request rates may apply if making millions of requests (pennies).',
    steps: [
      {
        id: 'step-1',
        title: 'Define Custom IAM Policy Document',
        instructions: 'Create a JSON policy document restricting actions to GetObject and ListBucket on a specific bucket named "my-academy-lab-bucket-101".',
        code: `cat << 'EOF' > s3-readonly-policy.json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowBucketList",
      "Effect": "Allow",
      "Action": ["s3:ListBucket"],
      "Resource": "arn:aws:s3:::my-academy-lab-bucket-101"
    },
    {
      "Sid": "AllowObjectRead",
      "Effect": "Allow",
      "Action": ["s3:GetObject"],
      "Resource": "arn:aws:s3:::my-academy-lab-bucket-101/*"
    }
  ]
}
EOF`,
        codeLanguage: 'bash',
        expectedOutput: 's3-readonly-policy.json created successfully',
        tips: 'Always differentiate between bucket-level permissions (s3:ListBucket) and object-level permissions (s3:GetObject).'
      },
      {
        id: 'step-2',
        title: 'Create IAM Managed Policy via CLI',
        instructions: 'Use the AWS CLI to create the managed policy within your AWS account.',
        code: `aws iam create-policy \\
  --policy-name AcademyS3ReadOnlyPolicy \\
  --policy-document file://s3-readonly-policy.json \\
  --description "Read-only access restricted to specific lab bucket"`,
        codeLanguage: 'bash',
        expectedOutput: '{\n  "Policy": {\n    "PolicyName": "AcademyS3ReadOnlyPolicy",\n    "Arn": "arn:aws:iam::123456789012:policy/AcademyS3ReadOnlyPolicy",\n    "DefaultVersionId": "v1"\n  }\n}',
        tips: 'Note down the returned Policy ARN for use in subsequent steps.'
      },
      {
        id: 'step-3',
        title: 'Create EC2 Trust Policy and Role',
        instructions: 'Create a trust relationship document permitting the EC2 service to assume the role, and create the IAM role.',
        code: `cat << 'EOF' > ec2-trust-policy.json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": { "Service": "ec2.amazonaws.com" },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF

aws iam create-role \\
  --role-name AcademyEC2S3ReaderRole \\
  --assume-role-policy-document file://ec2-trust-policy.json`,
        codeLanguage: 'bash',
        expectedOutput: '{\n  "Role": {\n    "RoleName": "AcademyEC2S3ReaderRole",\n    "Arn": "arn:aws:iam::123456789012:role/AcademyEC2S3ReaderRole"\n  }\n}',
        tips: 'Trust policies define who can assume the role, while permission policies define what the assumed role can do.'
      },
      {
        id: 'step-4',
        title: 'Attach Policy to Role and Create Instance Profile',
        instructions: 'Attach the created S3 read-only policy to the role and encapsulate it in an IAM instance profile so EC2 can ingest it.',
        code: `aws iam attach-role-policy \\
  --role-name AcademyEC2S3ReaderRole \\
  --policy-arn arn:aws:iam::123456789012:policy/AcademyS3ReadOnlyPolicy

aws iam create-instance-profile \\
  --instance-profile-name AcademyEC2InstanceProfile

aws iam add-role-to-instance-profile \\
  --instance-profile-name AcademyEC2InstanceProfile \\
  --role-name AcademyEC2S3ReaderRole`,
        codeLanguage: 'bash',
        expectedOutput: 'Instance profile created and role attached without error (HTTP 200).',
        tips: 'The console creates instance profiles automatically, but with the CLI, creating the instance profile is an explicit extra step.'
      },
      {
        id: 'step-5',
        title: 'Simulate Permissions with IAM Policy Simulator',
        instructions: 'Validate that s3:PutObject is explicitly denied while s3:GetObject is allowed using the IAM Policy Simulator CLI.',
        code: `aws iam simulate-principal-policy \\
  --policy-source-arn arn:aws:iam::123456789012:role/AcademyEC2S3ReaderRole \\
  --action-names s3:GetObject s3:PutObject \\
  --resource-arns arn:aws:s3:::my-academy-lab-bucket-101/data.txt`,
        codeLanguage: 'bash',
        expectedOutput: '"EvaluationResults": [\n  {\n    "EvalActionName": "s3:GetObject",\n    "EvalDecision": "allowed"\n  },\n  {\n    "EvalActionName": "s3:PutObject",\n    "EvalDecision": "implicitDeny"\n  }\n]',
        tips: 'The IAM policy simulator checks effective permissions without modifying real cloud resources.'
      }
    ],
    commonErrors: [
      {
        error: 'MalformedPolicyDocumentException: Syntax errors in policy JSON',
        solution: 'Validate the JSON syntax using jq or jsonlint, ensuring all brackets match and Version is set to "2012-10-17".'
      },
      {
        error: 'NoSuchEntityException when attaching role to instance profile',
        solution: 'Wait 3-5 seconds after creating the role before running add-role-to-instance-profile due to eventual consistency.'
      }
    ],
    troubleshooting: [
      'Check if the role trust policy correctly specifies ec2.amazonaws.com under Principal.Service.',
      'Verify with aws iam list-attached-role-policies that the managed policy is actively attached to the role.'
    ],
    securityNotes: [
      'Never embed AWS Access Keys into EC2 user data or application configuration files; always use IAM Roles with instance profiles.',
      'Follow the Principle of Least Privilege: restrict Resource ARNs to specific bucket paths rather than wildcard "*".'
    ],
    cleanup: [
      'aws iam remove-role-from-instance-profile --instance-profile-name AcademyEC2InstanceProfile --role-name AcademyEC2S3ReaderRole',
      'aws iam delete-instance-profile --instance-profile-name AcademyEC2InstanceProfile',
      'aws iam detach-role-policy --role-name AcademyEC2S3ReaderRole --policy-arn arn:aws:iam::123456789012:policy/AcademyS3ReadOnlyPolicy',
      'aws iam delete-role --role-name AcademyEC2S3ReaderRole',
      'aws iam delete-policy --policy-arn arn:aws:iam::123456789012:policy/AcademyS3ReadOnlyPolicy',
      'rm -f s3-readonly-policy.json ec2-trust-policy.json'
    ],
    verification: 'Run aws iam get-role --role-name AcademyEC2S3ReaderRole to confirm the role status and verify simulate-principal-policy returns allowed for GetObject.'
  },
  {
    id: 'ec2-linux',
    title: 'EC2 Linux Deployment: Launch and Configure Instances',
    description: 'Launch an Amazon Linux 2023 instance, configure security groups, attach an Elastic IP, and bootstrap a web server using user data.',
    difficulty: 'beginner',
    estimatedMinutes: 45,
    order: 2,
    objectives: [
      'Create and configure an EC2 Security Group allowing SSH and HTTP traffic',
      'Launch an Amazon Linux 2023 instance with automated user-data bootstrapping',
      'Associate an Elastic IP address and verify public accessibility',
      'Query the EC2 Instance Metadata Service (IMDSv2) securely'
    ],
    prerequisites: ['iam-roles', 'Basic Linux command line knowledge'],
    services: ['EC2', 'VPC'],
    costWarning: 'Stay within the AWS Free Tier by choosing t2.micro or t3.micro. Remember to terminate the instance and release the Elastic IP to avoid hourly idle fees.',
    steps: [
      {
        id: 'step-1',
        title: 'Create Security Group for Web and SSH Access',
        instructions: 'Create a security group in the default VPC and authorize inbound traffic on port 22 (SSH) and port 80 (HTTP).',
        code: `VPC_ID=$(aws ec2 describe-vpcs --filters "Name=isDefault,Values=true" --query "Vpcs[0].VpcId" --output text)

SG_ID=$(aws ec2 create-security-group \\
  --group-name "Academy-Web-SG" \\
  --description "Security group for web server" \\
  --vpc-id $VPC_ID \\
  --query 'GroupId' --output text)

aws ec2 authorize-security-group-ingress --group-id $SG_ID --protocol tcp --port 22 --cidr 0.0.0.0/0
aws ec2 authorize-security-group-ingress --group-id $SG_ID --protocol tcp --port 80 --cidr 0.0.0.0/0`,
        codeLanguage: 'bash',
        expectedOutput: 'sg-0123456789abcdef0 created with ingress rules applied.',
        tips: 'In production, restrict port 22 access to your specific public IP address (/32).'
      },
      {
        id: 'step-2',
        title: 'Prepare EC2 User Data Script',
        instructions: 'Create a cloud-init shell script to install and start an Nginx or Apache web server serving a custom index page.',
        code: `cat << 'EOF' > user-data.sh
#!/bin/bash
dnf update -y
dnf install -y httpd
systemctl start httpd
systemctl enable httpd
INSTANCE_ID=$(curl -s http://169.254.169.254/latest/meta-data/instance-id)
echo "<h1>Hello from AWS Academy EC2: $INSTANCE_ID</h1>" > /var/www/html/index.html
EOF`,
        codeLanguage: 'bash',
        expectedOutput: 'user-data.sh created',
        tips: 'User data scripts run as root during the very first boot of the instance.'
      },
      {
        id: 'step-3',
        title: 'Launch EC2 Instance with IMDSv2 Required',
        instructions: 'Launch a t3.micro instance running Amazon Linux 2023 with metadata options set to HttpTokens=required (IMDSv2).',
        code: `AMI_ID=$(aws ssm get-parameter \\
  --name /aws/service/ami-amazon-linux-latest/al2023-ami-kernel-default-x86_64 \\
  --query "Parameter.Value" --output text)

INSTANCE_ID=$(aws ec2 run-instances \\
  --image-id $AMI_ID \\
  --instance-type t3.micro \\
  --security-group-ids $SG_ID \\
  --user-data file://user-data.sh \\
  --metadata-options "HttpTokens=required,HttpPutResponseHopLimit=1" \\
  --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=Academy-WebServer}]' \\
  --query 'Instances[0].InstanceId' --output text)

echo "Launched instance: $INSTANCE_ID"`,
        codeLanguage: 'bash',
        expectedOutput: 'Launched instance: i-0abc123456def7890',
        tips: 'Using AWS Systems Manager Parameter Store is the most reliable way to dynamically find latest AMI IDs.'
      },
      {
        id: 'step-4',
        title: 'Wait for Instance Running Status and Test HTTP',
        instructions: 'Wait for instance initialization to complete and verify the web server response.',
        code: `aws ec2 wait instance-status-ok --instance-ids $INSTANCE_ID

PUBLIC_IP=$(aws ec2 describe-instances \\
  --instance-ids $INSTANCE_ID \\
  --query "Reservations[0].Instances[0].PublicIpAddress" --output text)

curl http://$PUBLIC_IP`,
        codeLanguage: 'bash',
        expectedOutput: '<h1>Hello from AWS Academy EC2: i-0abc123456def7890</h1>',
        tips: 'If the curl times out, verify your Security Group rules and ensure the subnet has an Internet Gateway.'
      },
      {
        id: 'step-5',
        title: 'Test IMDSv2 Token Retrieval',
        instructions: 'Connect or execute commands to test fetching instance metadata using session tokens.',
        code: `TOKEN=$(curl -s -X PUT "http://169.254.169.254/latest/api/token" -H "X-aws-ec2-metadata-token-ttl-seconds: 21600")
curl -H "X-aws-ec2-metadata-token: $TOKEN" -s http://169.254.169.254/latest/meta-data/placement/availability-zone`,
        codeLanguage: 'bash',
        expectedOutput: 'us-east-1a',
        tips: 'IMDSv2 protects against SSRF vulnerabilities by requiring a PUT token exchange.'
      }
    ],
    commonErrors: [
      {
        error: 'Connection timed out on port 80',
        solution: 'Ensure the Security Group allows inbound HTTP from 0.0.0.0/0 and the subnet route table points 0.0.0.0/0 to an Internet Gateway.'
      },
      {
        error: 'Unauthorized (401) fetching instance metadata',
        solution: 'IMDSv2 requires passing the X-aws-ec2-metadata-token header obtained via a PUT request to /latest/api/token.'
      }
    ],
    troubleshooting: [
      'Check system logs in AWS Console under Actions > Monitor and Troubleshoot > Get System Log to check cloud-init execution errors.',
      'Ensure the VPC default route table contains a route to an IGW: 0.0.0.0/0 -> igw-xxx.'
    ],
    securityNotes: [
      'Enforce IMDSv2 across all instances to prevent SSRF credential theft.',
      'Never allow unrestricted SSH (0.0.0.0/0) in production environments; use AWS Systems Manager Session Manager instead of open SSH ports.'
    ],
    cleanup: [
      'aws ec2 terminate-instances --instance-ids $INSTANCE_ID',
      'aws ec2 wait instance-terminated --instance-ids $INSTANCE_ID',
      'aws ec2 delete-security-group --group-id $SG_ID',
      'rm -f user-data.sh'
    ],
    verification: 'Check that curl http://$PUBLIC_IP returns the expected HTML page and describe-instance-status reports "Status": "ok".'
  },
  {
    id: 'linux-admin',
    title: 'Linux Server Administration: Systems Operations on AWS',
    description: 'Perform essential administrative operations on Linux servers in AWS: user management, systemd service management, log inspection with journald, and disk usage analysis.',
    difficulty: 'beginner',
    estimatedMinutes: 40,
    order: 3,
    objectives: [
      'Manage Linux users and group permissions with sudo privileges',
      'Configure and manage systemd service units and auto-start behaviors',
      'Inspect system logs using journalctl and configure log rotation',
      'Analyze filesystem usage, inodes, and mount points'
    ],
    prerequisites: ['ec2-linux'],
    services: ['EC2', 'CloudWatch'],
    steps: [
      {
        id: 'step-1',
        title: 'Create and Manage Administrative Users',
        instructions: 'Add a new administrative user "devops-engineer", create their SSH directory, and grant passwordless sudo permissions.',
        code: `sudo useradd -m -s /bin/bash devops-engineer
sudo usermod -aG wheel devops-engineer
echo "devops-engineer ALL=(ALL) NOPASSWD:ALL" | sudo tee /etc/sudoers.d/devops-engineer
sudo chmod 0440 /etc/sudoers.d/devops-engineer`,
        codeLanguage: 'bash',
        expectedOutput: 'User created and sudo configuration file written to /etc/sudoers.d/devops-engineer.',
        tips: 'Never edit /etc/sudoers directly without using visudo or placing separate drop-in files in /etc/sudoers.d.'
      },
      {
        id: 'step-2',
        title: 'Create a Custom Systemd Service Unit',
        instructions: 'Build a custom background daemon service that collects metrics and runs as a systemd unit.',
        code: `sudo tee /usr/local/bin/heartbeat.sh << 'EOF'
#!/bin/bash
while true; do
  echo "$(date -u +'%Y-%m-%d %H:%M:%SZ') [HEARTBEAT] Load: $(cut -d' ' -f1 /proc/loadavg), Memory Free: $(grep MemFree /proc/meminfo | awk '{print $2}') kB"
  sleep 10
done
EOF

sudo chmod +x /usr/local/bin/heartbeat.sh

sudo tee /etc/systemd/system/heartbeat.service << 'EOF'
[Unit]
Description=Academy Heartbeat Daemon
After=network.target

[Service]
Type=simple
ExecStart=/usr/local/bin/heartbeat.sh
Restart=always
RestartSec=5
User=nobody

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable --now heartbeat.service`,
        codeLanguage: 'bash',
        expectedOutput: 'Created symlink /etc/systemd/system/multi-user.target.wants/heartbeat.service',
        tips: 'Running services as unprivileged users (like nobody) reduces attack surface.'
      },
      {
        id: 'step-3',
        title: 'Inspect Logs with Journalctl',
        instructions: 'Filter and inspect service logs using journalctl with time ranges and priority flags.',
        code: `journalctl -u heartbeat.service -n 10 --no-pager
journalctl -u heartbeat.service --since "5 minutes ago" --no-pager`,
        codeLanguage: 'bash',
        expectedOutput: 'Logs showing [HEARTBEAT] timestamp and memory metrics.',
        tips: 'Use -f with journalctl to stream live logs in real time.'
      },
      {
        id: 'step-4',
        title: 'Analyze Storage and Inodes',
        instructions: 'Examine disk partition utilization, available space, and inode consumption.',
        code: `df -hT
df -i
lsblk -f`,
        codeLanguage: 'bash',
        expectedOutput: 'Filesystem summary showing mounted xfs/ext4 volumes and inode usage percentages.',
        tips: 'An application can run out of disk space if all inodes are exhausted, even if physical gigabytes remain.'
      },
      {
        id: 'step-5',
        title: 'Verify Process State and Network Sockets',
        instructions: 'Inspect running processes and open listening ports using ps, top, and ss.',
        code: `ps aux | grep heartbeat
sudo ss -tulpn`,
        codeLanguage: 'bash',
        expectedOutput: 'Active process entry for heartbeat.sh and socket listen states.',
        tips: 'The ss tool has replaced netstat in modern Linux distributions for socket inspection.'
      }
    ],
    commonErrors: [
      {
        error: 'sudo: parse error in /etc/sudoers.d/devops-engineer near line 1',
        solution: 'Ensure syntax is exact and file permissions are strictly 0440.'
      },
      {
        error: 'Failed to start heartbeat.service: Unit heartbeat.service not found',
        solution: 'Run sudo systemctl daemon-reload after creating or editing any systemd unit file.'
      }
    ],
    troubleshooting: [
      'Use systemctl status <service> to see the exit status code and last log lines.',
      'Check SELinux or file execution bits (chmod +x) if systemd reports 203/EXEC error.'
    ],
    securityNotes: [
      'Never store plain passwords; enforce SSH public key authentication.',
      'Regularly audit sudoers files to prevent privilege escalation vulnerabilities.'
    ],
    cleanup: [
      'sudo systemctl stop heartbeat.service',
      'sudo systemctl disable heartbeat.service',
      'sudo rm -f /etc/systemd/system/heartbeat.service /usr/local/bin/heartbeat.sh /etc/sudoers.d/devops-engineer',
      'sudo systemctl daemon-reload',
      'sudo userdel -r devops-engineer'
    ],
    verification: 'Execute systemctl is-active heartbeat.service to verify it was operational during the lab session.'
  },
  {
    id: 'ebs-snapshots',
    title: 'EBS and Snapshots: Volume Management and Recovery',
    description: 'Create, attach, format, and resize Amazon EBS volumes, and perform crash-consistent snapshots and volume restore operations.',
    difficulty: 'beginner',
    estimatedMinutes: 30,
    order: 4,
    objectives: [
      'Create and attach a gp3 EBS volume to an active EC2 instance',
      'Create a filesystem, mount the volume, and write persistent test data',
      'Take a point-in-time EBS snapshot and restore it to a new volume',
      'Perform live volume modification to expand storage capacity without downtime'
    ],
    prerequisites: ['ec2-linux'],
    services: ['EC2', 'EBS'],
    costWarning: 'EBS volumes and snapshots incur standard per-GB/month costs. Clean up volumes and snapshots after completing the lab.',
    steps: [
      {
        id: 'step-1',
        title: 'Create and Attach a 10 GB gp3 Volume',
        instructions: 'Provision a gp3 volume in the same Availability Zone as your EC2 instance and attach it as /dev/sdf.',
        code: `AZ=$(aws ec2 describe-instances --instance-ids $INSTANCE_ID --query "Reservations[0].Instances[0].Placement.AvailabilityZone" --output text)

VOL_ID=$(aws ec2 create-volume \\
  --availability-zone $AZ \\
  --size 10 \\
  --volume-type gp3 \\
  --tag-specifications 'ResourceType=volume,Tags=[{Key=Name,Value=AcademyDataVol}]' \\
  --query 'VolumeId' --output text)

aws ec2 wait volume-available --volume-ids $VOL_ID

aws ec2 attach-volume \\
  --volume-id $VOL_ID \\
  --instance-id $INSTANCE_ID \\
  --device /dev/sdf`,
        codeLanguage: 'bash',
        expectedOutput: '{\n  "AttachTime": "...",\n  "Device": "/dev/sdf",\n  "InstanceId": "...",\n  "State": "attaching",\n  "VolumeId": "vol-0123456789"\n}',
        tips: 'EBS volumes are strictly tied to a single Availability Zone and cannot be attached across AZs.'
      },
      {
        id: 'step-2',
        title: 'Format and Mount the Volume in Linux',
        instructions: 'Inside the EC2 instance, identify the NVMe block device, format it with XFS, and mount it to /data.',
        code: `sudo lsblk
sudo file -s /dev/nvme1n1
sudo mkfs -t xfs /dev/nvme1n1
sudo mkdir -p /data
sudo mount /dev/nvme1n1 /data
echo "Crucial transaction record at $(date)" | sudo tee /data/transaction.log`,
        codeLanguage: 'bash',
        expectedOutput: 'meta-data=/dev/nvme1n1 ... volume mounted to /data',
        tips: 'On Nitro-based EC2 instances, EBS volumes appear as NVMe devices (/dev/nvme1n1).'
      },
      {
        id: 'step-3',
        title: 'Create a Point-in-Time Snapshot',
        instructions: 'Flush OS disk caches and create a snapshot using the AWS CLI.',
        code: `sudo sync
SNAP_ID=$(aws ec2 create-snapshot \\
  --volume-id $VOL_ID \\
  --description "Backup before maintenance" \\
  --tag-specifications 'ResourceType=snapshot,Tags=[{Key=Name,Value=AcademyDataBackup}]' \\
  --query 'SnapshotId' --output text)

aws ec2 wait snapshot-completed --snapshot-ids $SNAP_ID
echo "Snapshot completed: $SNAP_ID"`,
        codeLanguage: 'bash',
        expectedOutput: 'Snapshot completed: snap-0abcdef1234567890',
        tips: 'Snapshots are incremental; only changed blocks are saved to Amazon S3 backend.'
      },
      {
        id: 'step-4',
        title: 'Perform Live Volume Expansion (Elastic Volumes)',
        instructions: 'Expand the volume from 10 GB to 20 GB online without detaching it.',
        code: `aws ec2 modify-volume --volume-id $VOL_ID --size 20
aws ec2 wait volume-in-use --volume-ids $VOL_ID

# Inside EC2: expand the filesystem
sudo xfs_growfs /data
df -h /data`,
        codeLanguage: 'bash',
        expectedOutput: 'Filesystem size updated to 20G.',
        tips: 'AWS Elastic Volumes allows dynamic resizing, IOPS adjustments, and throughput scaling on the fly.'
      },
      {
        id: 'step-5',
        title: 'Restore Snapshot to a New Volume in Another AZ',
        instructions: 'Prove disaster recovery capability by restoring the snapshot into a different AZ.',
        code: `RESTORED_VOL=$(aws ec2 create-volume \\
  --snapshot-id $SNAP_ID \\
  --availability-zone us-east-1b \\
  --volume-type gp3 \\
  --query 'VolumeId' --output text)

aws ec2 wait volume-available --volume-ids $RESTORED_VOL
echo "Restored new volume in AZ us-east-1b: $RESTORED_VOL"`,
        codeLanguage: 'bash',
        expectedOutput: 'Restored new volume in AZ us-east-1b: vol-0987654321',
        tips: 'Snapshots can be restored into ANY Availability Zone within the same Region, enabling cross-AZ migration.'
      }
    ],
    commonErrors: [
      {
        error: 'InvalidVolume.ZoneMismatch: The volume and instance are in different AZs',
        solution: 'Always query the target instance Availability Zone and specify it in create-volume.'
      },
      {
        error: 'Device busy when attempting to unmount',
        solution: 'Ensure no open shell sessions or processes have their current working directory inside /data before unmounting.'
      }
    ],
    troubleshooting: [
      'Use lsblk and nvme id-ctrl to verify mapping between Linux NVMe names and AWS volume IDs.',
      'Check EBS Volume Modification state: volume can only be modified once every 6 hours per volume.'
    ],
    securityNotes: [
      'Enable default EBS encryption for your AWS account and region to guarantee all new volumes are encrypted with KMS keys.',
      'Snapshots inherit the encryption status of the source volume.'
    ],
    cleanup: [
      'sudo umount /data',
      'aws ec2 detach-volume --volume-id $VOL_ID',
      'aws ec2 wait volume-available --volume-ids $VOL_ID',
      'aws ec2 delete-volume --volume-id $VOL_ID',
      'aws ec2 delete-volume --volume-id $RESTORED_VOL',
      'aws ec2 delete-snapshot --snapshot-id $SNAP_ID'
    ],
    verification: 'Verify that xfs_growfs reflected the 20 GB capacity and that the restored volume reached the "available" state.'
  },
  {
    id: 's3-secure-access',
    title: 'S3 and Secure Access: Bucket Policies, KMS, and Pre-signed URLs',
    description: 'Configure Amazon S3 security controls including Server-Side Encryption with AWS KMS (SSE-KMS), enforce TLS via Bucket Policies, Block Public Access, and generate pre-signed URLs.',
    difficulty: 'beginner',
    estimatedMinutes: 35,
    order: 5,
    objectives: [
      'Create an Amazon S3 bucket with Block Public Access enabled',
      'Enforce HTTPS-only access using bucket policy aws:SecureTransport conditions',
      'Upload and configure default encryption using AWS KMS customer managed keys',
      'Generate time-limited pre-signed URLs for secure, temporary third-party downloads'
    ],
    prerequisites: ['iam-roles'],
    services: ['S3', 'KMS'],
    costWarning: 'Standard S3 storage and KMS key generation fees (~$1/month pro-rated for KMS key). Clean up KMS keys and buckets after the lab.',
    steps: [
      {
        id: 'step-1',
        title: 'Create S3 Bucket with Block Public Access',
        instructions: 'Create an S3 bucket and explicitly activate all four S3 Block Public Access settings.',
        code: `BUCKET_NAME="academy-secure-bucket-$(date +%s)"
aws s3api create-bucket --bucket $BUCKET_NAME --region us-east-1

aws s3api put-public-access-block \\
  --bucket $BUCKET_NAME \\
  --public-access-block-configuration \\
  "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"`,
        codeLanguage: 'bash',
        expectedOutput: 'Bucket created and public access blocked.',
        tips: 'S3 Block Public Access acts as an account-level and bucket-level centralized guardrail.'
      },
      {
        id: 'step-2',
        title: 'Enforce In-Transit Encryption (HTTPS Only)',
        instructions: 'Apply a bucket policy that denies any s3:GetObject or s3:PutObject requests that do not use TLS (aws:SecureTransport is false).',
        code: `cat << EOF > bucket-policy.json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "EnforceTLSRequestsOnly",
      "Effect": "Deny",
      "Principal": "*",
      "Action": "s3:*",
      "Resource": [
        "arn:aws:s3:::$BUCKET_NAME",
        "arn:aws:s3:::$BUCKET_NAME/*"
      ],
      "Condition": {
        "Bool": {
          "aws:SecureTransport": "false"
        }
      }
    }
  ]
}
EOF

aws s3api put-bucket-policy --bucket $BUCKET_NAME --policy file://bucket-policy.json`,
        codeLanguage: 'bash',
        expectedOutput: 'HTTP 200 OK - Bucket policy attached.',
        tips: 'The aws:SecureTransport condition key is the standard pattern for passing compliance audits requiring TLS.'
      },
      {
        id: 'step-3',
        title: 'Configure Default Server-Side Encryption with KMS',
        instructions: 'Enable KMS encryption by default on the bucket so any uploaded object is automatically encrypted at rest.',
        code: `aws s3api put-bucket-encryption \\
  --bucket $BUCKET_NAME \\
  --server-side-encryption-configuration '{
    "Rules": [
      {
        "ApplyServerSideEncryptionByDefault": {
          "SSEAlgorithm": "aws:kms",
          "KMSMasterKeyId": "alias/aws/s3"
        },
        "BucketKeyEnabled": true
      }
    ]
  }'`,
        codeLanguage: 'bash',
        expectedOutput: 'Encryption configuration applied with S3 Bucket Key enabled.',
        tips: 'Enabling S3 Bucket Key reduces AWS KMS request costs by up to 99% by reducing calls to KMS.'
      },
      {
        id: 'step-4',
        title: 'Upload File and Verify Encryption Headers',
        instructions: 'Upload a sample document and verify that KMS encryption metadata is returned in the object details.',
        code: `echo "Confidential Academy Intelligence" > secrets.txt
aws s3 cp secrets.txt s3://$BUCKET_NAME/secrets.txt

aws s3api head-object --bucket $BUCKET_NAME --key secrets.txt`,
        codeLanguage: 'bash',
        expectedOutput: '"ServerSideEncryption": "aws:kms", "BucketKeyEnabled": true',
        tips: 'head-object retrieves metadata without downloading the object payload.'
      },
      {
        id: 'step-5',
        title: 'Generate Pre-signed URL for Temporary Access',
        instructions: 'Generate a pre-signed URL valid for 300 seconds (5 minutes) and verify it can be downloaded via curl.',
        code: `PRESIGNED_URL=$(aws s3 presign s3://$BUCKET_NAME/secrets.txt --expires-in 300)
echo "Pre-signed URL: $PRESIGNED_URL"
curl -s "$PRESIGNED_URL"`,
        codeLanguage: 'bash',
        expectedOutput: 'Confidential Academy Intelligence',
        tips: 'Pre-signed URLs inherit the permissions of the IAM user or role that generated them.'
      }
    ],
    commonErrors: [
      {
        error: 'AccessDenied: The bucket policy explicitly denies HTTP requests',
        solution: 'Ensure all test scripts use https:// rather than http:// endpoints when interacting with S3.'
      },
      {
        error: 'KMS.DisabledException when reading object',
        solution: 'Verify the KMS Key used for SSE-KMS is in the Enabled state.'
      }
    ],
    troubleshooting: [
      'Check S3 Block Public Access settings if a policy allowing external access is rejected with AccessDenied.',
      'Test pre-signed URL expiration times using curl -I to check HTTP status headers (403 Forbidden after expiry).'
    ],
    securityNotes: [
      'Always enable S3 Block Public Access on all accounts unless specifically hosting a public static website.',
      'Use S3 Object Lock and S3 Versioning for critical compliance and ransomware protection.'
    ],
    cleanup: [
      'aws s3 rm s3://$BUCKET_NAME --recursive',
      'aws s3api delete-bucket --bucket $BUCKET_NAME',
      'rm -f secrets.txt bucket-policy.json'
    ],
    verification: 'Confirm head-object returns ServerSideEncryption: aws:kms and the pre-signed URL successfully downloads the file payload.'
  },
  {
    id: 'static-website',
    title: 'Static Website Hosting: S3, CloudFront, and Route 53',
    description: 'Host a modern static single-page web app using Amazon S3 origin, CloudFront Content Delivery Network (CDN), Origin Access Control (OAC), and custom error response routing.',
    difficulty: 'beginner',
    estimatedMinutes: 40,
    order: 6,
    objectives: [
      'Configure an Amazon S3 private bucket for website asset storage',
      'Create a CloudFront distribution with Origin Access Control (OAC)',
      'Lock down S3 bucket access so assets are ONLY reachable through CloudFront',
      'Configure custom error pages to handle client-side routing for Single Page Apps (SPA)'
    ],
    prerequisites: ['s3-secure-access'],
    services: ['S3', 'CloudFront'],
    costWarning: 'CloudFront provides 1 TB free data transfer out per month. Free tier eligible.',
    steps: [
      {
        id: 'step-1',
        title: 'Create Private S3 Bucket and Upload Web Assets',
        instructions: 'Create a private bucket and upload an index.html and 404.html file.',
        code: `WEB_BUCKET="academy-spa-site-$(date +%s)"
aws s3api create-bucket --bucket $WEB_BUCKET --region us-east-1

cat << 'EOF' > index.html
<!DOCTYPE html>
<html>
<head><title>Cloud Academy SPA</title></head>
<body style="font-family:sans-serif; text-align:center; padding:50px;">
  <h1>AWS Cloud Engineering Academy</h1>
  <p>Delivered globally via Amazon CloudFront Edge Locations!</p>
</body>
</html>
EOF

aws s3 cp index.html s3://$WEB_BUCKET/index.html`,
        codeLanguage: 'bash',
        expectedOutput: 'upload: ./index.html to s3://academy-spa-site-.../index.html',
        tips: 'Do NOT enable S3 Website Hosting; we will use CloudFront OAC for superior security and HTTPS.'
      },
      {
        id: 'step-2',
        title: 'Create CloudFront Origin Access Control (OAC)',
        instructions: 'Create an Origin Access Control resource to securely sign CloudFront requests into S3.',
        code: `OAC_ID=$(aws cloudfront create-origin-access-control \\
  --origin-access-control-config \\
  "Name=OAC-$WEB_BUCKET,Description=OAC for Academy Lab,SigningProtocol=sigv4,SigningBehavior=always,OriginAccessControlOriginType=s3" \\
  --query 'OriginAccessControl.Id' --output text)

echo "OAC created: $OAC_ID"`,
        codeLanguage: 'bash',
        expectedOutput: 'OAC created: E1ABC2XYZ345',
        tips: 'OAC replaces legacy Origin Access Identity (OAI) and supports all S3 regions, SSE-KMS, and dynamic requests.'
      },
      {
        id: 'step-3',
        title: 'Deploy CloudFront Distribution with S3 Origin',
        instructions: 'Provision a CloudFront distribution pointing to the S3 bucket using OAC and redirecting HTTP to HTTPS.',
        code: `DIST_CONFIG=$(cat << EOF
{
  "CallerReference": "academy-dist-$(date +%s)",
  "DefaultRootObject": "index.html",
  "Origins": {
    "Quantity": 1,
    "Items": [
      {
        "Id": "S3-$WEB_BUCKET",
        "DomainName": "$WEB_BUCKET.s3.us-east-1.amazonaws.com",
        "OriginAccessControlId": "$OAC_ID",
        "S3OriginConfig": {
          "OriginAccessIdentity": ""
        }
      }
    ]
  },
  "DefaultCacheBehavior": {
    "TargetOriginId": "S3-$WEB_BUCKET",
    "ViewerProtocolPolicy": "redirect-to-https",
    "AllowedMethods": {
      "Quantity": 2,
      "Items": ["GET", "HEAD"]
    },
    "CachePolicyId": "658327ea-f89d-4fab-a63d-7e88639e58f6"
  },
  "Comment": "Academy Static Website",
  "Enabled": true
}
EOF
)

DIST_ID=$(aws cloudfront create-distribution-with-tags \\
  --distribution-config-with-tags "DistributionConfig=$DIST_CONFIG,Tags={Items=[{Key=Environment,Value=Lab}]}" \\
  --query 'Distribution.Id' --output text)

DIST_DOMAIN=$(aws cloudfront get-distribution --id $DIST_ID --query 'Distribution.DomainName' --output text)
echo "Distribution ID: $DIST_ID, Domain: $DIST_DOMAIN"`,
        codeLanguage: 'bash',
        expectedOutput: 'Distribution ID: EDF1234567, Domain: d111111abcdef8.cloudfront.net',
        tips: 'CachePolicyId 658327ea-f89d-4fab-a63d-7e88639e58f6 is the AWS managed CachingOptimized policy.'
      },
      {
        id: 'step-4',
        title: 'Grant CloudFront Access via S3 Bucket Policy',
        instructions: 'Authorize the CloudFront distribution ARN to get objects from the bucket using the aws:SourceArn condition.',
        code: `cat << EOF > cf-bucket-policy.json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowCloudFrontServicePrincipalReadOnly",
      "Effect": "Allow",
      "Principal": {
        "Service": "cloudfront.amazonaws.com"
      },
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::$WEB_BUCKET/*",
      "Condition": {
        "StringEquals": {
          "AWS:SourceArn": "arn:aws:cloudfront::$(aws sts get-caller-identity --query Account --output text):distribution/$DIST_ID"
        }
      }
    }
  ]
}
EOF

aws s3api put-bucket-policy --bucket $WEB_BUCKET --policy file://cf-bucket-policy.json`,
        codeLanguage: 'bash',
        expectedOutput: 'Bucket policy applied successfully.',
        tips: 'Restricting by AWS:SourceArn guarantees other CloudFront distributions cannot access your bucket.'
      },
      {
        id: 'step-5',
        title: 'Verify Global Delivery via CloudFront URL',
        instructions: 'Test that direct S3 access is denied and CloudFront edge delivery returns 200 OK with x-cache headers.',
        code: `curl -I https://$WEB_BUCKET.s3.us-east-1.amazonaws.com/index.html
curl -I https://$DIST_DOMAIN/`,
        codeLanguage: 'bash',
        expectedOutput: 'Direct S3: HTTP/1.1 403 Forbidden\nCloudFront: HTTP/2 200 OK with X-Cache: Hit from cloudfront',
        tips: 'CloudFront edge caching significantly lowers TTFB (Time to First Byte) globally.'
      }
    ],
    commonErrors: [
      {
        error: 'CloudFront returns 403 Access Denied',
        solution: 'Verify the S3 bucket policy contains the exact AWS:SourceArn of the CloudFront distribution.'
      },
      {
        error: 'Distribution takes 5+ minutes to deploy',
        solution: 'CloudFront distributes configuration globally to hundreds of PoPs; wait until status changes to Deployed.'
      }
    ],
    troubleshooting: [
      'Inspect CloudFront response headers: X-Cache will show "Hit from cloudfront" or "Miss from cloudfront".',
      'Use aws cloudfront create-invalidation --distribution-id $DIST_ID --paths "/*" to purge cache after updating HTML files.'
    ],
    securityNotes: [
      'Never make your S3 website bucket public if using CloudFront; use OAC to ensure all traffic passes through WAF/CloudFront.',
      'Always redirect HTTP to HTTPS in CloudFront viewer protocol policies.'
    ],
    cleanup: [
      'ETAG=$(aws cloudfront get-distribution-config --id $DIST_ID --query ETag --output text)',
      'aws cloudfront get-distribution-config --id $DIST_ID --output json | jq \'.DistributionConfig.Enabled = false\' > disable-config.json',
      '# Disable distribution, wait, delete distribution, delete OAC, delete bucket',
      'aws s3 rm s3://$WEB_BUCKET --recursive',
      'aws s3api delete-bucket --bucket $WEB_BUCKET',
      'rm -f index.html cf-bucket-policy.json disable-config.json'
    ],
    verification: 'Check that curl https://$DIST_DOMAIN/ returns the HTML content with HTTP 200 status code.'
  },
  {
    id: 'vpc-subnets',
    title: 'VPC and Subnet Architecture: Building a Multi-AZ Network',
    description: 'Design and build an enterprise production-grade AWS Virtual Private Cloud (VPC) spanning two Availability Zones with public and private subnets.',
    difficulty: 'intermediate',
    estimatedMinutes: 45,
    order: 7,
    objectives: [
      'Create a custom VPC with non-overlapping CIDR block (10.0.0.0/16)',
      'Calculate and create 4 subnets: 2 public and 2 private across 2 AZs',
      'Attach an Internet Gateway and configure custom Route Tables',
      'Validate routing and isolation between public and private tiers'
    ],
    prerequisites: ['ec2-linux'],
    services: ['VPC'],
    costWarning: 'Standard VPC resources (VPC, IGW, Route Tables, Subnets) are completely free. No NAT Gateways are created in this introductory routing lab.',
    steps: [
      {
        id: 'step-1',
        title: 'Create the Custom VPC',
        instructions: 'Create a VPC with CIDR 10.0.0.0/16 and enable DNS hostnames and DNS resolution.',
        code: `VPC_ID=$(aws ec2 create-vpc --cidr-block 10.0.0.0/16 --query 'Vpc.VpcId' --output text)
aws ec2 create-tags --resources $VPC_ID --tags Key=Name,Value=Academy-Production-VPC
aws ec2 modify-vpc-attribute --vpc-id $VPC_ID --enable-dns-hostnames "{\\"Value\\":true}"
aws ec2 modify-vpc-attribute --vpc-id $VPC_ID --enable-dns-support "{\\"Value\\":true}"
echo "Created VPC: $VPC_ID"`,
        codeLanguage: 'bash',
        expectedOutput: 'Created VPC: vpc-0a1b2c3d4e5f6g7h8',
        tips: 'Enabling DNS hostnames is required for EC2 instances to receive public and private DNS records.'
      },
      {
        id: 'step-2',
        title: 'Provision Public Subnets Across Two AZs',
        instructions: 'Create two public subnets (/24) in us-east-1a and us-east-1b and enable auto-assign public IPs.',
        code: `PUB_SUB1=$(aws ec2 create-subnet --vpc-id $VPC_ID --cidr-block 10.0.1.0/24 --availability-zone us-east-1a --query 'Subnet.SubnetId' --output text)
PUB_SUB2=$(aws ec2 create-subnet --vpc-id $VPC_ID --cidr-block 10.0.2.0/24 --availability-zone us-east-1b --query 'Subnet.SubnetId' --output text)

aws ec2 modify-subnet-attribute --subnet-id $PUB_SUB1 --map-public-ip-on-launch
aws ec2 modify-subnet-attribute --subnet-id $PUB_SUB2 --map-public-ip-on-launch

aws ec2 create-tags --resources $PUB_SUB1 --tags Key=Name,Value=Public-Subnet-1a
aws ec2 create-tags --resources $PUB_SUB2 --tags Key=Name,Value=Public-Subnet-1b`,
        codeLanguage: 'bash',
        expectedOutput: 'Subnets created and auto-assign public IP enabled.',
        tips: 'AWS reserves 5 IP addresses per subnet (.0 network, .1 router, .2 DNS, .3 reserved, .255 broadcast).'
      },
      {
        id: 'step-3',
        title: 'Provision Private Subnets Across Two AZs',
        instructions: 'Create two private subnets for application and database tiers in us-east-1a and us-east-1b.',
        code: `PRIV_SUB1=$(aws ec2 create-subnet --vpc-id $VPC_ID --cidr-block 10.0.10.0/24 --availability-zone us-east-1a --query 'Subnet.SubnetId' --output text)
PRIV_SUB2=$(aws ec2 create-subnet --vpc-id $VPC_ID --cidr-block 10.0.11.0/24 --availability-zone us-east-1b --query 'Subnet.SubnetId' --output text)

aws ec2 create-tags --resources $PRIV_SUB1 --tags Key=Name,Value=Private-Subnet-1a
aws ec2 create-tags --resources $PRIV_SUB2 --tags Key=Name,Value=Private-Subnet-1b`,
        codeLanguage: 'bash',
        expectedOutput: 'Private subnets created.',
        tips: 'Keeping separate IP ranges (e.g. 10.0.1x for public and 10.0.10x for private) clarifies network topologies.'
      },
      {
        id: 'step-4',
        title: 'Attach Internet Gateway',
        instructions: 'Create an Internet Gateway and attach it to the custom VPC.',
        code: `IGW_ID=$(aws ec2 create-internet-gateway --query 'InternetGateway.InternetGatewayId' --output text)
aws ec2 attach-internet-gateway --vpc-id $VPC_ID --internet-gateway-id $IGW_ID
aws ec2 create-tags --resources $IGW_ID --tags Key=Name,Value=Academy-IGW`,
        codeLanguage: 'bash',
        expectedOutput: 'IGW attached to vpc-0a1b2c3d4e5f6g7h8.',
        tips: 'A VPC can only have one Internet Gateway attached at a time.'
      },
      {
        id: 'step-5',
        title: 'Configure Public Route Table and Associate Subnets',
        instructions: 'Create a custom route table, add a default route (0.0.0.0/0) to the IGW, and associate the public subnets.',
        code: `PUB_RT=$(aws ec2 create-route-table --vpc-id $VPC_ID --query 'RouteTable.RouteTableId' --output text)
aws ec2 create-route --route-table-id $PUB_RT --destination-cidr-block 0.0.0.0/0 --gateway-id $IGW_ID

aws ec2 associate-route-table --subnet-id $PUB_SUB1 --route-table-id $PUB_RT
aws ec2 associate-route-table --subnet-id $PUB_SUB2 --route-table-id $PUB_RT
aws ec2 create-tags --resources $PUB_RT --tags Key=Name,Value=Academy-Public-RouteTable`,
        codeLanguage: 'bash',
        expectedOutput: 'Route table created and subnets associated.',
        tips: 'Any subnet not explicitly associated with a route table uses the main VPC route table (which remains private).'
      }
    ],
    commonErrors: [
      {
        error: 'CidrBlockConflict: The CIDR conflicts with an existing subnet',
        solution: 'Ensure each subnet CIDR block is unique and contained inside the VPC 10.0.0.0/16 address space.'
      },
      {
        error: 'Resource.AlreadyAssociated: Internet Gateway already attached',
        solution: 'Each VPC supports exactly one attached Internet Gateway at any given time.'
      }
    ],
    troubleshooting: [
      'Use aws ec2 describe-route-tables to check which subnets are linked to the public route table.',
      'Check route table target states: verify target is active and not blackhole.'
    ],
    securityNotes: [
      'Keep the default main route table isolated and private; never point the main route table directly to an IGW.',
      'Ensure database subnets reside in private subnets with no route to an IGW.'
    ],
    cleanup: [
      'aws ec2 detach-internet-gateway --internet-gateway-id $IGW_ID --vpc-id $VPC_ID',
      'aws ec2 delete-internet-gateway --internet-gateway-id $IGW_ID',
      'aws ec2 delete-subnet --subnet-id $PUB_SUB1',
      'aws ec2 delete-subnet --subnet-id $PUB_SUB2',
      'aws ec2 delete-subnet --subnet-id $PRIV_SUB1',
      'aws ec2 delete-subnet --subnet-id $PRIV_SUB2',
      'aws ec2 delete-route-table --route-table-id $PUB_RT',
      'aws ec2 delete-vpc --vpc-id $VPC_ID'
    ],
    verification: 'Run aws ec2 describe-subnets --filters "Name=vpc-id,Values=$VPC_ID" to verify 4 subnets are in "available" state across 2 AZs.'
  },
  {
    id: 'routing-security',
    title: 'Routing and Security Controls: Security Groups vs Network ACLs',
    description: 'Implement defense-in-depth networking by combining stateful Security Groups with stateless Network Access Control Lists (NACLs) and deploying a NAT Gateway.',
    difficulty: 'intermediate',
    estimatedMinutes: 40,
    order: 8,
    objectives: [
      'Deploy a NAT Gateway in a public subnet to grant private instances internet egress',
      'Configure private route tables with default route pointing to the NAT Gateway',
      'Implement stateful Security Group tiering (ALB -> EC2 -> Database)',
      'Configure stateless Network ACLs with numbered rules and ephemeral port handling'
    ],
    prerequisites: ['vpc-subnets'],
    services: ['VPC', 'EC2'],
    costWarning: 'NAT Gateway hourly charges apply (~$0.045/hr + data processing). Terminate the NAT Gateway immediately upon finishing this lab!',
    steps: [
      {
        id: 'step-1',
        title: 'Allocate Elastic IP and Deploy NAT Gateway',
        instructions: 'Allocate an Elastic IP and create a NAT Gateway in the public subnet.',
        code: `ALLOC_ID=$(aws ec2 allocate-address --domain vpc --query 'AllocationId' --output text)

NAT_GW_ID=$(aws ec2 create-nat-gateway \\
  --subnet-id $PUB_SUB1 \\
  --allocation-id $ALLOC_ID \\
  --query 'NatGateway.NatGatewayId' --output text)

echo "Waiting for NAT Gateway $NAT_GW_ID to become available..."
aws ec2 wait nat-gateway-available --nat-gateway-ids $NAT_GW_ID`,
        codeLanguage: 'bash',
        expectedOutput: 'NAT Gateway is available.',
        tips: 'NAT Gateways must always be placed in a PUBLIC subnet with an attached Elastic IP.'
      },
      {
        id: 'step-2',
        title: 'Configure Private Route Table with NAT Route',
        instructions: 'Create a private route table, add a 0.0.0.0/0 route to the NAT Gateway, and associate the private subnets.',
        code: `PRIV_RT=$(aws ec2 create-route-table --vpc-id $VPC_ID --query 'RouteTable.RouteTableId' --output text)
aws ec2 create-route --route-table-id $PRIV_RT --destination-cidr-block 0.0.0.0/0 --nat-gateway-id $NAT_GW_ID

aws ec2 associate-route-table --subnet-id $PRIV_SUB1 --route-table-id $PRIV_RT
aws ec2 associate-route-table --subnet-id $PRIV_SUB2 --route-table-id $PRIV_RT`,
        codeLanguage: 'bash',
        expectedOutput: 'Private route table linked to NAT Gateway.',
        tips: 'Instances in private subnets can now initiate outbound connections (e.g. software updates) without being reachable from the internet.'
      },
      {
        id: 'step-3',
        title: 'Configure Tiered Security Groups (Referencing by ID)',
        instructions: 'Create an App SG and a DB SG, configuring DB SG to only allow traffic from App SG by group ID reference.',
        code: `APP_SG=$(aws ec2 create-security-group --group-name "AppTierSG" --description "App Servers" --vpc-id $VPC_ID --query GroupId --output text)
DB_SG=$(aws ec2 create-security-group --group-name "DBTierSG" --description "DB Servers" --vpc-id $VPC_ID --query GroupId --output text)

# Authorize DB SG to accept MySQL 3306 ONLY from App SG
aws ec2 authorize-security-group-ingress \\
  --group-id $DB_SG \\
  --protocol tcp \\
  --port 3306 \\
  --source-group $APP_SG`,
        codeLanguage: 'bash',
        expectedOutput: 'Security group rule referencing AppTierSG established.',
        tips: 'Referencing security group IDs instead of CIDR blocks avoids IP address hardcoding and survives dynamic autoscaling.'
      },
      {
        id: 'step-4',
        title: 'Create and Configure Custom Network ACL',
        instructions: 'Create a custom NACL, associate it with a subnet, and configure inbound and outbound ephemeral port rules.',
        code: `NACL_ID=$(aws ec2 create-network-acl --vpc-id $VPC_ID --query 'NetworkAcl.NetworkAclId' --output text)

# Inbound HTTP (port 80)
aws ec2 create-network-acl-entry --network-acl-id $NACL_ID --rule-number 100 --protocol tcp --rule-action allow --ingress --cidr-block 0.0.0.0/0 --port-range From=80,To=80

# Stateless: Outbound Ephemeral Ports (1024-65535) required for response traffic
aws ec2 create-network-acl-entry --network-acl-id $NACL_ID --rule-number 100 --protocol tcp --rule-action allow --egress --cidr-block 0.0.0.0/0 --port-range From=1024,To=65535`,
        codeLanguage: 'bash',
        expectedOutput: 'Stateless NACL rules created.',
        tips: 'NACLs are stateless; outbound response traffic is NOT automatically allowed unless an outbound rule exists.'
      },
      {
        id: 'step-5',
        title: 'Demonstrate NACL Explicit Deny',
        instructions: 'Add rule #50 to explicitly deny a specific malicious IP address block before rule #100.',
        code: `aws ec2 create-network-acl-entry \\
  --network-acl-id $NACL_ID \\
  --rule-number 50 \\
  --protocol tcp \\
  --rule-action deny \\
  --ingress \\
  --cidr-block 203.0.113.0/24 \\
  --port-range From=0,To=65535`,
        codeLanguage: 'bash',
        expectedOutput: 'Explicit deny rule 50 added.',
        tips: 'Security Groups only support ALLOW rules; NACLs support both ALLOW and DENY rules, evaluated in ascending numerical order.'
      }
    ],
    commonErrors: [
      {
        error: 'Stateless NACL blocking responses to outbound connections',
        solution: 'Add outbound NACL rules covering ephemeral ports (1024-65535) for Linux/Windows client returns.'
      },
      {
        error: 'NAT Gateway state remains pending',
        solution: 'Wait up to 2-3 minutes for the NAT Gateway ENI to be provisioned and assigned the Elastic IP.'
      }
    ],
    troubleshooting: [
      'Use VPC Flow Logs to inspect whether packets are rejected by REJECT status (identifies NACL drops vs SG drops).',
      'Verify that the subnet containing the NAT Gateway has a route table entry for 0.0.0.0/0 pointing to an Internet Gateway.'
    ],
    securityNotes: [
      'Security groups are stateful and evaluate all rules; NACLs are stateless and evaluate rules in ascending order until a match occurs.',
      'Use NACLs as subnet-wide perimeter firewalls and Security Groups as fine-grained host-level firewalls.'
    ],
    cleanup: [
      'aws ec2 delete-nat-gateway --nat-gateway-id $NAT_GW_ID',
      'aws ec2 wait nat-gateway-deleted --nat-gateway-ids $NAT_GW_ID',
      'aws ec2 release-address --allocation-id $ALLOC_ID',
      'aws ec2 delete-security-group --group-id $DB_SG',
      'aws ec2 delete-security-group --group-id $APP_SG',
      'aws ec2 delete-network-acl --network-acl-id $NACL_ID'
    ],
    verification: 'Verify with aws ec2 describe-nat-gateways that the NAT Gateway was successfully provisioned and then deleted.'
  },
  {
    id: 'load-balanced-app',
    title: 'Load-Balanced Application: Application Load Balancer Architecture',
    description: 'Deploy an Application Load Balancer (ALB) across multiple Availability Zones, create target groups with health checks, and configure path-based routing.',
    difficulty: 'intermediate',
    estimatedMinutes: 50,
    order: 9,
    objectives: [
      'Deploy an Internet-facing Application Load Balancer across two public subnets',
      'Configure Target Groups with customized HTTP health checks',
      'Register EC2 web instances with the target group',
      'Implement path-based routing rules on the ALB listener (/api/* vs /)'
    ],
    prerequisites: ['ec2-linux', 'vpc-subnets'],
    services: ['ELB', 'EC2'],
    costWarning: 'Application Load Balancers charge ~$0.0225 per hour plus LCU usage. Delete the ALB promptly after testing.',
    steps: [
      {
        id: 'step-1',
        title: 'Create Security Group for ALB and Target Instances',
        instructions: 'Configure ALB SG to accept HTTP from anywhere, and Instance SG to only accept HTTP from the ALB SG.',
        code: `ALB_SG=$(aws ec2 create-security-group --group-name "ALB-SG" --description "Public ALB SG" --vpc-id $VPC_ID --query GroupId --output text)
aws ec2 authorize-security-group-ingress --group-id $ALB_SG --protocol tcp --port 80 --cidr 0.0.0.0/0

INST_SG=$(aws ec2 create-security-group --group-name "Instance-From-ALB-SG" --description "Instances behind ALB" --vpc-id $VPC_ID --query GroupId --output text)
aws ec2 authorize-security-group-ingress --group-id $INST_SG --protocol tcp --port 80 --source-group $ALB_SG`,
        codeLanguage: 'bash',
        expectedOutput: 'Security groups created and chained.',
        tips: 'Locking backend instances to only accept traffic from the ALB SG prevents clients from bypassing load balancing and WAF.'
      },
      {
        id: 'step-2',
        title: 'Create ALB Target Groups with Health Checks',
        instructions: 'Create two target groups: default target group and api target group with specific health check paths.',
        code: `TG_DEFAULT=$(aws ec2 create-target-group \\
  --name "tg-web-default" \\
  --protocol HTTP \\
  --port 80 \\
  --vpc-id $VPC_ID \\
  --health-check-path "/index.html" \\
  --health-check-interval-seconds 15 \\
  --healthy-threshold-count 2 \\
  --unhealthy-threshold-count 2 \\
  --target-type instance \\
  --query 'TargetGroups[0].TargetGroupArn' --output text)

TG_API=$(aws ec2 create-target-group \\
  --name "tg-web-api" \\
  --protocol HTTP \\
  --port 80 \\
  --vpc-id $VPC_ID \\
  --health-check-path "/api/health" \\
  --target-type instance \\
  --query 'TargetGroups[0].TargetGroupArn' --output text)`,
        codeLanguage: 'bash',
        expectedOutput: 'Target groups created.',
        tips: 'Keep health check intervals short during testing (e.g. 15s) to detect state transitions quickly.'
      },
      {
        id: 'step-3',
        title: 'Provision Application Load Balancer',
        instructions: 'Create an Internet-facing ALB spanning public subnets in at least two Availability Zones.',
        code: `ALB_ARN=$(aws elbv2 create-load-balancer \\
  --name "academy-web-alb" \\
  --subnets $PUB_SUB1 $PUB_SUB2 \\
  --security-groups $ALB_SG \\
  --scheme internet-facing \\
  --type application \\
  --ip-address-type ipv4 \\
  --query 'LoadBalancers[0].LoadBalancerArn' --output text)

echo "Waiting for ALB to become active..."
aws elbv2 wait load-balancer-available --load-balancer-arns $ALB_ARN`,
        codeLanguage: 'bash',
        expectedOutput: 'ALB state is active.',
        tips: 'ALBs require at least two subnets in different Availability Zones to guarantee high availability.'
      },
      {
        id: 'step-4',
        title: 'Configure HTTP Listener and Path-Based Routing',
        instructions: 'Create port 80 listener with default forward to TG_DEFAULT, and add a rule forwarding path /api/* to TG_API.',
        code: `LISTENER_ARN=$(aws elbv2 create-listener \\
  --load-balancer-arn $ALB_ARN \\
  --protocol HTTP \\
  --port 80 \\
  --default-actions Type=forward,TargetGroupArn=$TG_DEFAULT \\
  --query 'Listeners[0].ListenerArn' --output text)

aws elbv2 create-rule \\
  --listener-arn $LISTENER_ARN \\
  --priority 10 \\
  --conditions Field=path-pattern,Values='/api/*' \\
  --actions Type=forward,TargetGroupArn=$TG_API`,
        codeLanguage: 'bash',
        expectedOutput: 'Listener and path-based routing rule established.',
        tips: 'ALB routing rules are evaluated in order of numerical priority (lowest number first).'
      },
      {
        id: 'step-5',
        title: 'Register Targets and Validate Health Checks',
        instructions: 'Register EC2 instance to target group and query target health until status is healthy.',
        code: `aws elbv2 register-targets --target-group-arn $TG_DEFAULT --targets Id=$INSTANCE_ID

aws elbv2 describe-target-health --target-group-arn $TG_DEFAULT`,
        codeLanguage: 'bash',
        expectedOutput: '"TargetHealth": { "State": "healthy" }',
        tips: 'If health is unhealthy, check the web server access log on the instance to see if the health check request is receiving 200.'
      }
    ],
    commonErrors: [
      {
        error: 'Target.FailedHealthChecks: Connection timed out',
        solution: 'Ensure the EC2 Security Group allows inbound port 80 from the ALB Security Group.'
      },
      {
        error: 'InvalidConfigurationRequest: Subnets must be in different AZs',
        solution: 'Provide subnets residing in distinct Availability Zones (e.g. us-east-1a and us-east-1b).'
      }
    ],
    troubleshooting: [
      'Check curl -I http://<alb-dns-name>/ to inspect ALB HTTP status codes (502 Bad Gateway means no healthy targets).',
      'Review target group health descriptions with aws elbv2 describe-target-health.'
    ],
    securityNotes: [
      'Always terminate TLS/HTTPS at the ALB using certificates provisioned via AWS Certificate Manager (ACM).',
      'Attach AWS WAF to the ALB to guard against SQL injection, cross-site scripting, and HTTP flood attacks.'
    ],
    cleanup: [
      'aws elbv2 delete-load-balancer --load-balancer-arn $ALB_ARN',
      'aws elbv2 wait load-balancers-deleted --load-balancer-arns $ALB_ARN',
      'aws elbv2 delete-target-group --target-group-arn $TG_DEFAULT',
      'aws elbv2 delete-target-group --target-group-arn $TG_API',
      'aws ec2 delete-security-group --group-id $INST_SG',
      'aws ec2 delete-security-group --group-id $ALB_SG'
    ],
    verification: 'Query the ALB DNS name with curl -I to confirm successful 200 OK routing through the target group.'
  },
  {
    id: 'auto-scaling',
    title: 'Auto Scaling: Launch Templates and Dynamic Scaling Policies',
    description: 'Configure an EC2 Auto Scaling group with EC2 Launch Templates, target tracking scaling policies, and automated scale-out under stress testing.',
    difficulty: 'intermediate',
    estimatedMinutes: 45,
    order: 10,
    objectives: [
      'Create a modular EC2 Launch Template with IMDSv2 and user data',
      'Provision an Auto Scaling Group (ASG) across multiple Availability Zones',
      'Attach the ASG to an Application Load Balancer Target Group',
      'Implement a Target Tracking Scaling Policy based on Average CPU Utilization'
    ],
    prerequisites: ['load-balanced-app'],
    services: ['Auto Scaling', 'EC2', 'CloudWatch'],
    costWarning: 'ASG may launch up to 4 t3.micro instances during scaling tests. Ensure termination of the ASG at completion.',
    steps: [
      {
        id: 'step-1',
        title: 'Create an EC2 Launch Template',
        instructions: 'Define instance configuration, AMI, instance type, security groups, and user-data script in a launch template.',
        code: `TEMPLATE_DATA=$(cat << 'EOF'
{
  "ImageId": "ami-0c101f26f147fa7fd",
  "InstanceType": "t3.micro",
  "SecurityGroupIds": ["sg-0123456789abcdef0"],
  "UserData": "IyEvYmluL2Jhc2gKeXVtIGluc3RhbGwgLXkgaHR0cGQgc3RyZXNzCnN5c3RlbWN0bCBzdGFydCBodHRwZAplY2hvICJva3kgZnJvbSAkKGN1cmwgLXMgaHR0cDovLzE2OS4yNTQuMTY5LjI1NC9sYXRlc3QvbWV0YS1kYXRhL2luc3RhbmNlLWlkKSIgPiAvdmFyL3d3dy9odG1sL2luZGV4Lmh0bWw=",
  "MetadataOptions": {
    "HttpTokens": "required",
    "HttpPutResponseHopLimit": 1
  }
}
EOF
)

LT_ID=$(aws ec2 create-launch-template \\
  --launch-template-name "Academy-WebServer-LT" \\
  --version-description "v1-production" \\
  --launch-template-data "$TEMPLATE_DATA" \\
  --query 'LaunchTemplate.LaunchTemplateId' --output text)`,
        codeLanguage: 'bash',
        expectedOutput: 'Launch template lt-0abcdef1234567890 created.',
        tips: 'Launch templates support versioning, allowing rollback to prior configurations with zero downtime.'
      },
      {
        id: 'step-2',
        title: 'Create Auto Scaling Group',
        instructions: 'Deploy an ASG with min=1, desired=2, max=4 spanning two private subnets and attached to the target group.',
        code: `aws autoscaling create-auto-scaling-group \\
  --auto-scaling-group-name "Academy-ASG" \\
  --launch-template "LaunchTemplateId=$LT_ID,Version=1" \\
  --min-size 1 \\
  --max-size 4 \\
  --desired-capacity 2 \\
  --vpc-zone-identifier "$PRIV_SUB1,$PRIV_SUB2" \\
  --target-group-arns "$TG_DEFAULT" \\
  --health-check-type ELB \\
  --health-check-grace-period 300`,
        codeLanguage: 'bash',
        expectedOutput: 'ASG created and instances begin launching in parallel.',
        tips: 'Health check type ELB ensures instances failing application health checks are replaced automatically.'
      },
      {
        id: 'step-3',
        title: 'Configure Target Tracking Scaling Policy',
        instructions: 'Configure automatic scaling to maintain an average target CPU utilization of 50%.',
        code: `aws autoscaling put-scaling-policy \\
  --auto-scaling-group-name "Academy-ASG" \\
  --policy-name "cpu50-target-tracking" \\
  --policy-type TargetTrackingScaling \\
  --target-tracking-configuration '{
    "PredefinedMetricSpecification": {
      "PredefinedMetricType": "ASGAverageCPUUtilization"
    },
    "TargetValue": 50.0,
    "DisableScaleIn": false
  }'`,
        codeLanguage: 'bash',
        expectedOutput: 'Scaling policy and CloudWatch alarms generated automatically.',
        tips: 'Target tracking operates like a thermostat, automatically calculating step adjustments to track the metric.'
      },
      {
        id: 'step-4',
        title: 'Simulate CPU Load and Observe Scale-Out',
        instructions: 'Simulate high CPU load using the stress tool on an instance and monitor ASG scaling activity.',
        code: `# Inside instance or via SSM:
# stress --cpu 2 --timeout 300s &

aws autoscaling describe-scaling-activities --auto-scaling-group-name "Academy-ASG"`,
        codeLanguage: 'bash',
        expectedOutput: '"Description": "Launching a new EC2 instance: i-0abc... in response to CloudWatch metric alarm"',
        tips: 'CloudWatch alarm breaches trigger Auto Scaling activities with cooldown intervals.'
      },
      {
        id: 'step-5',
        title: 'Verify Instance Termination Lifecycle and Cooldown',
        instructions: 'Inspect instance health and verify scale-in behavior after load subsides.',
        code: `aws autoscaling describe-auto-scaling-groups --auto-scaling-group-names "Academy-ASG" \\
  --query 'AutoScalingGroups[0].Instances[*].[InstanceId,LifecycleState,HealthStatus]' --output table`,
        codeLanguage: 'bash',
        expectedOutput: 'Table showing InService instances across both AZs.',
        tips: 'Termination policies determine which instances are terminated first during scale-in (default: oldest launch template version, then closest to billing hour).'
      }
    ],
    commonErrors: [
      {
        error: 'Instances repeatedly terminating and launching in loop',
        solution: 'Increase health-check-grace-period (e.g. 300 seconds) so instances have sufficient time to finish bootstrapping before health checks run.'
      },
      {
        error: 'LaunchTemplate not found or invalid base64 user data',
        solution: 'Base64 encode user data scripts when supplying them directly in JSON launch template parameters.'
      }
    ],
    troubleshooting: [
      'Examine aws autoscaling describe-scaling-activities for explicit failure reason strings (e.g. insufficient subnet IPs or AMI permissions).',
      'Confirm the IAM service-linked role for EC2 Auto Scaling exists: AWSServiceRoleForAutoScaling.'
    ],
    securityNotes: [
      'Store sensitive credentials in AWS Secrets Manager or Systems Manager Parameter Store rather than hardcoding in launch template user data.',
      'Always enforce IMDSv2 in launch templates by setting HttpTokens=required.'
    ],
    cleanup: [
      'aws autoscaling update-auto-scaling-group --auto-scaling-group-name Academy-ASG --min-size 0 --desired-capacity 0',
      'aws autoscaling delete-auto-scaling-group --auto-scaling-group-name Academy-ASG --force-delete',
      'aws ec2 delete-launch-template --launch-template-id $LT_ID'
    ],
    verification: 'Describe ASG to confirm initial launch to 2 instances and successful policy registration.'
  },
  {
    id: 'rds-deployment',
    title: 'RDS Deployment and Connectivity: Multi-AZ PostgreSQL Engine',
    description: 'Deploy an Amazon RDS PostgreSQL database in a Multi-AZ DB subnet group, configure automated backups, manage credentials with Secrets Manager, and connect securely.',
    difficulty: 'intermediate',
    estimatedMinutes: 45,
    order: 11,
    objectives: [
      'Create an RDS DB Subnet Group across private isolated subnets',
      'Deploy an Amazon RDS PostgreSQL database instance with Multi-AZ redundancy',
      'Store and rotate database master credentials in AWS Secrets Manager',
      'Connect to PostgreSQL from an application EC2 instance and inspect failover replication'
    ],
    prerequisites: ['vpc-subnets', 'routing-security'],
    services: ['RDS', 'Secrets Manager', 'VPC'],
    costWarning: 'Multi-AZ RDS instances incur hourly costs. Always delete the RDS DB instance with skip-final-snapshot at the end of the lab.',
    steps: [
      {
        id: 'step-1',
        title: 'Create DB Subnet Group Across 2 AZs',
        instructions: 'Define an RDS Subnet Group grouping the two private subnets together.',
        code: `aws rds create-db-subnet-group \\
  --db-subnet-group-name "academy-db-subnet-group" \\
  --db-subnet-group-description "Private subnets for RDS Multi-AZ" \\
  --subnet-ids "$PRIV_SUB1" "$PRIV_SUB2"`,
        codeLanguage: 'bash',
        expectedOutput: '"DBSubnetGroupName": "academy-db-subnet-group", "VpcId": "..."',
        tips: 'RDS Multi-AZ requires a subnet group spanning at least two distinct Availability Zones in the chosen region.'
      },
      {
        id: 'step-2',
        title: 'Store Master Credentials in AWS Secrets Manager',
        instructions: 'Generate and store database administrative credentials securely in Secrets Manager.',
        code: `SECRET_ARN=$(aws secretsmanager create-secret \\
  --name "academy/rds/postgres-master" \\
  --description "Master password for Academy RDS PostgreSQL" \\
  --secret-string '{"engine":"postgres","username":"postgresadmin","password":"ChangeMeSecureP@ss123"}' \\
  --query 'ARN' --output text)

echo "Secret created: $SECRET_ARN"`,
        codeLanguage: 'bash',
        expectedOutput: 'Secret ARN output: arn:aws:secretsmanager:...',
        tips: 'Never pass plain text passwords as CLI arguments in production history logs.'
      },
      {
        id: 'step-3',
        title: 'Deploy Multi-AZ RDS PostgreSQL Instance',
        instructions: 'Provision a db.t3.micro PostgreSQL instance with automated backups and Multi-AZ enabled.',
        code: `aws rds create-db-instance \\
  --db-instance-identifier "academy-postgres-db" \\
  --db-instance-class "db.t3.micro" \\
  --engine "postgres" \\
  --engine-version "15.4" \\
  --master-username "postgresadmin" \\
  --master-user-password "ChangeMeSecureP@ss123" \\
  --allocated-storage 20 \\
  --storage-type "gp3" \\
  --multi-az \\
  --db-subnet-group-name "academy-db-subnet-group" \\
  --vpc-security-group-ids "$DB_SG" \\
  --backup-retention-period 7 \\
  --no-publicly-accessible \\
  --storage-encrypted`,
        codeLanguage: 'bash',
        expectedOutput: '"DBInstanceStatus": "creating", "MultiAZ": true',
        tips: 'Multi-AZ synchronously replicates storage to a standby replica in a second AZ for automated failover.'
      },
      {
        id: 'step-4',
        title: 'Wait for RDS Available State and Retrieve Endpoint',
        instructions: 'Wait for the DB instance provisioning to complete and fetch the DNS endpoint.',
        code: `echo "Waiting for RDS instance to become available (can take ~5-10 minutes)..."
aws rds wait db-instance-available --db-instance-identifier "academy-postgres-db"

RDS_ENDPOINT=$(aws rds describe-db-instances \\
  --db-instance-identifier "academy-postgres-db" \\
  --query 'DBInstances[0].Endpoint.Address' --output text)

echo "RDS Endpoint: $RDS_ENDPOINT"`,
        codeLanguage: 'bash',
        expectedOutput: 'RDS Endpoint: academy-postgres-db.cxxxxxx.us-east-1.rds.amazonaws.com',
        tips: 'The RDS endpoint is a CNAME pointing to the current primary DB instance; upon failover, AWS updates the CNAME to point to the standby.'
      },
      {
        id: 'step-5',
        title: 'Verify Connectivity and Table Creation',
        instructions: 'Connect using psql from an authorized EC2 instance in the private subnet.',
        code: `psql -h $RDS_ENDPOINT -U postgresadmin -d postgres -c "CREATE TABLE users (id SERIAL PRIMARY KEY, name VARCHAR(50)); INSERT INTO users (name) VALUES ('Alice'), ('Bob'); SELECT * FROM users;"`,
        codeLanguage: 'bash',
        expectedOutput: 'id | name\n---+-------\n 1 | Alice\n 2 | Bob\n(2 rows)',
        tips: 'Check postgres port 5432 ingress in the DB Security Group if connection times out.'
      }
    ],
    commonErrors: [
      {
        error: 'DBSubnetGroupDoesNotCoverEnoughAZs',
        solution: 'Include subnets residing in at least two different Availability Zones in the DB Subnet Group.'
      },
      {
        error: 'Connection timeout connecting to RDS endpoint',
        solution: 'Verify the RDS security group allows port 5432 ingress from the EC2 instance security group.'
      }
    ],
    troubleshooting: [
      'Check DB instance status in CLI using aws rds describe-db-instances.',
      'Check Enhanced Monitoring and CloudWatch metrics for DatabaseConnections, FreeableMemory, and ReadIOPS.'
    ],
    securityNotes: [
      'Always set --no-publicly-accessible on RDS instances housing production and sensitive data.',
      'Enable KMS encryption at rest (--storage-encrypted) and enforce SSL/TLS for all client connections (rds.force_ssl=1).'
    ],
    cleanup: [
      'aws rds delete-db-instance --db-instance-identifier academy-postgres-db --skip-final-snapshot --delete-automated-backups',
      'aws rds wait db-instance-deleted --db-instance-identifier academy-postgres-db',
      'aws rds delete-db-subnet-group --db-subnet-group-name academy-db-subnet-group',
      'aws secretsmanager delete-secret --secret-id academy/rds/postgres-master --force-delete-without-recovery'
    ],
    verification: 'Confirm query output returned records from PostgreSQL and that describe-db-instances reports status as available prior to cleanup.'
  },
  {
    id: 'cloudwatch-monitoring',
    title: 'CloudWatch Monitoring and Alarms: Metrics, Logs, and SNS',
    description: 'Set up comprehensive observability using Amazon CloudWatch metrics, metric filters on logs, CloudWatch Alarms, and Amazon SNS email notifications.',
    difficulty: 'intermediate',
    estimatedMinutes: 35,
    order: 12,
    objectives: [
      'Install and configure the CloudWatch unified agent on Linux EC2',
      'Create CloudWatch Metric Filters to detect HTTP 500 error patterns in logs',
      'Provision an SNS topic and subscription for incident alerts',
      'Build CloudWatch composite alarms and test automated alarm state transitions'
    ],
    prerequisites: ['ec2-linux'],
    services: ['CloudWatch', 'SNS', 'EC2'],
    costWarning: 'Standard CloudWatch free tier includes 10 alarms and 5GB logs ingestion. Free tier eligible.',
    steps: [
      {
        id: 'step-1',
        title: 'Create SNS Alert Topic and Subscription',
        instructions: 'Set up an SNS notification topic for operational alerts.',
        code: `TOPIC_ARN=$(aws sns create-topic --name "Academy-CloudWatch-Alerts" --query 'TopicArn' --output text)

aws sns subscribe \\
  --topic-arn $TOPIC_ARN \\
  --protocol email \\
  --notification-endpoint "student@example.com"

echo "SNS Topic Created: $TOPIC_ARN"`,
        codeLanguage: 'bash',
        expectedOutput: 'Subscription request sent; email confirmation pending.',
        tips: 'SNS email subscriptions remain in "PendingConfirmation" until the link in the verification email is clicked.'
      },
      {
        id: 'step-2',
        title: 'Create CloudWatch Log Group and Stream',
        instructions: 'Provision a centralized CloudWatch Log Group with a 14-day retention policy.',
        code: `aws logs create-log-group --log-group-name "/aws/academy/webserver"
aws logs put-retention-policy --log-group-name "/aws/academy/webserver" --retention-in-days 14
aws logs create-log-stream --log-group-name "/aws/academy/webserver" --log-stream-name "instance-01"`,
        codeLanguage: 'bash',
        expectedOutput: 'Log group and stream initialized with 14 days retention.',
        tips: 'Always set log retention periods to prevent unexpected runaway storage costs from abandoned log groups.'
      },
      {
        id: 'step-3',
        title: 'Create CloudWatch Metric Filter for HTTP 500 Errors',
        instructions: 'Extract custom metric ErrorCount from application logs whenever HTTP status code 500 is encountered.',
        code: `aws logs put-metric-filter \\
  --log-group-name "/aws/academy/webserver" \\
  --filter-name "HTTP500Errors" \\
  --filter-pattern '[host, logName, user, timestamp, request, statusCode=5*, size]' \\
  --metric-transformations \\
  "metricName=HTTP500Count,metricNamespace=AcademyApp,metricValue=1,defaultValue=0"`,
        codeLanguage: 'bash',
        expectedOutput: 'Metric filter created.',
        tips: 'Metric filters convert unstructured text or JSON patterns into queryable CloudWatch time series metrics.'
      },
      {
        id: 'step-4',
        title: 'Create CloudWatch Alarm on Metric Filter',
        instructions: 'Trigger an ALARM state if HTTP500Count >= 3 in a 1-minute period and notify SNS.',
        code: `aws cloudwatch put-metric-alarm \\
  --alarm-name "HighHTTP500ErrorRate" \\
  --alarm-description "Triggers when 3 or more 5xx errors occur in 1 minute" \\
  --metric-name "HTTP500Count" \\
  --namespace "AcademyApp" \\
  --statistic "Sum" \\
  --period 60 \\
  --threshold 3 \\
  --comparison-operator "GreaterThanOrEqualToThreshold" \\
  --evaluation-periods 1 \\
  --alarm-actions "$TOPIC_ARN" \\
  --treat-missing-data "notBreaching"`,
        codeLanguage: 'bash',
        expectedOutput: 'CloudWatch alarm configured.',
        tips: 'Setting treat-missing-data to notBreaching prevents false alarm flapping on low-volume metrics.'
      },
      {
        id: 'step-5',
        title: 'Simulate Errors and Test Alarm Trigger',
        instructions: 'Inject simulated log events with status code 500 to trip the alarm into ALARM state.',
        code: `TIMESTAMP=$(date +%s000)
aws logs put-log-events \\
  --log-group-name "/aws/academy/webserver" \\
  --log-stream-name "instance-01" \\
  --log-events \\
  "[{\\"timestamp\\": $TIMESTAMP, \\"message\\": \\"192.0.2.1 - - [$(date +'%d/%b/%Y:%H:%M:%S +0000')] \\\\\\"GET /api/checkout HTTP/1.1\\\\\\" 500 234\\"}]"

aws cloudwatch set-alarm-state \\
  --alarm-name "HighHTTP500ErrorRate" \\
  --state-value ALARM \\
  --state-reason "Simulated breach test"`,
        codeLanguage: 'bash',
        expectedOutput: 'Alarm transitioned to ALARM state; notification sent to SNS.',
        tips: 'set-alarm-state allows testing downstream alert runbooks and SNS webhooks without waiting for real production failures.'
      }
    ],
    commonErrors: [
      {
        error: 'InvalidParameterValue: Log group already exists',
        solution: 'Use a unique log group name or check existing log groups with aws logs describe-log-groups.'
      },
      {
        error: 'Metric Filter pattern does not match Apache common log format',
        solution: 'Test filter patterns using the CloudWatch Logs Insights console before creating metric filters.'
      }
    ],
    troubleshooting: [
      'Check alarm history with aws cloudwatch describe-alarm-history --alarm-name HighHTTP500ErrorRate.',
      'Use CloudWatch Logs Insights query syntax to inspect raw matched logs: fields @timestamp, @message | filter @message like /500/.'
    ],
    securityNotes: [
      'Mask sensitive PII and credit card numbers from application log files using CloudWatch data protection policies.',
      'Restrict SNS topic publishing permissions to trusted AWS services and accounts only.'
    ],
    cleanup: [
      'aws cloudwatch delete-alarms --alarm-names HighHTTP500ErrorRate',
      'aws logs delete-metric-filter --log-group-name /aws/academy/webserver --filter-name HTTP500Errors',
      'aws logs delete-log-group --log-group-name /aws/academy/webserver',
      'aws sns delete-topic --topic-arn $TOPIC_ARN'
    ],
    verification: 'Run aws cloudwatch describe-alarms --alarm-names HighHTTP500ErrorRate to confirm successful creation and configuration.'
  },
  {
    id: 'cloudtrail-auditing',
    title: 'CloudTrail Auditing: Governance, Compliance, and Security Logs',
    description: 'Configure AWS CloudTrail multi-region organizational auditing, enable S3 data events, configure log file integrity validation, and query audit events with Athena.',
    difficulty: 'intermediate',
    estimatedMinutes: 30,
    order: 13,
    objectives: [
      'Create a Multi-Region CloudTrail trail storing audit logs in an encrypted S3 bucket',
      'Enable digest file hashing to verify Log File Integrity',
      'Capture S3 object-level Data Events alongside Management Events',
      'Query security API calls using AWS CloudTrail Event History and Athena'
    ],
    prerequisites: ['s3-secure-access'],
    services: ['CloudTrail', 'S3', 'Athena'],
    costWarning: 'The first copy of management events is free. Additional trails and S3 data events incur minor per-event charges.',
    steps: [
      {
        id: 'step-1',
        title: 'Create S3 Bucket for CloudTrail Logs',
        instructions: 'Create an S3 bucket with the mandatory CloudTrail service principal bucket policy.',
        code: `TRAIL_BUCKET="academy-trail-logs-$(date +%s)"
aws s3api create-bucket --bucket $TRAIL_BUCKET --region us-east-1

ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

cat << EOF > trail-bucket-policy.json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AWSCloudTrailAclCheck",
      "Effect": "Allow",
      "Principal": { "Service": "cloudtrail.amazonaws.com" },
      "Action": "s3:GetBucketAcl",
      "Resource": "arn:aws:s3:::$TRAIL_BUCKET"
    },
    {
      "Sid": "AWSCloudTrailWrite",
      "Effect": "Allow",
      "Principal": { "Service": "cloudtrail.amazonaws.com" },
      "Action": "s3:PutObject",
      "Resource": "arn:aws:s3:::$TRAIL_BUCKET/AWSLogs/$ACCOUNT_ID/*",
      "Condition": {
        "StringEquals": { "s3:x-amz-acl": "bucket-owner-full-control" }
      }
    }
  ]
}
EOF

aws s3api put-bucket-policy --bucket $TRAIL_BUCKET --policy file://trail-bucket-policy.json`,
        codeLanguage: 'bash',
        expectedOutput: 'Bucket created and CloudTrail write permissions configured.',
        tips: 'CloudTrail requires specific S3 bucket permissions before it allows a trail to be created.'
      },
      {
        id: 'step-2',
        title: 'Create Multi-Region Trail with Log File Integrity',
        instructions: 'Create a trail that captures all AWS regions and enables SHA-256 digest validation.',
        code: `aws cloudtrail create-trail \\
  --name "AcademyMasterTrail" \\
  --s3-bucket-name $TRAIL_BUCKET \\
  --is-multi-region-trail \\
  --enable-log-file-validation

aws cloudtrail start-logging --name "AcademyMasterTrail"`,
        codeLanguage: 'bash',
        expectedOutput: '"IsLogging": true, "LogFileValidationEnabled": true',
        tips: 'Log file integrity validation creates hourly digest files that prove log files were not altered or deleted.'
      },
      {
        id: 'step-3',
        title: 'Configure S3 Data Event Logging',
        instructions: 'Add data event selectors to record PutObject and DeleteObject calls on sensitive buckets.',
        code: `aws cloudtrail put-event-selectors \\
  --trail-name "AcademyMasterTrail" \\
  --event-selectors '[
    {
      "ReadWriteType": "All",
      "IncludeManagementEvents": true,
      "DataResources": [
        {
          "Type": "AWS::S3::Object",
          "Values": ["arn:aws:s3:::my-academy-lab-bucket-101/"]
        }
      ]
    }
  ]'`,
        codeLanguage: 'bash',
        expectedOutput: 'Event selectors updated with S3 data resource auditing.',
        tips: 'Data events are not logged by default due to high volume; selectively audit high-value data stores.'
      },
      {
        id: 'step-4',
        title: 'Query CloudTrail Events via CLI',
        instructions: 'Search event history for recent IAM policy modifications and unauthorized API calls.',
        code: `aws cloudtrail lookup-events \\
  --lookup-attributes AttributeKey=EventName,AttributeValue=CreateRole \\
  --max-results 5 \\
  --query 'Events[*].[EventTime,EventName,Username,CloudTrailEvent]' --output table`,
        codeLanguage: 'bash',
        expectedOutput: 'Tabular listing of recent CreateRole API calls with caller identity.',
        tips: 'lookup-events searches the last 90 days of management events free of charge in the AWS console and CLI.'
      },
      {
        id: 'step-5',
        title: 'Verify Log File Integrity',
        instructions: 'Use the AWS CLI validate-logs command to verify cryptographic integrity of exported logs.',
        code: `aws cloudtrail validate-logs \\
  --trail-arn "arn:aws:cloudtrail:us-east-1:$ACCOUNT_ID:trail/AcademyMasterTrail" \\
  --start-time "$(date -u -d '2 hours ago' +'%Y-%m-%dT%H:%M:%SZ')"`,
        codeLanguage: 'bash',
        expectedOutput: 'Results: 0 log files invalid, 0 log files missing.',
        tips: 'Validating logs satisfies stringent compliance requirements such as PCI-DSS, SOC 2, and HIPAA.'
      }
    ],
    commonErrors: [
      {
        error: 'InsufficientS3BucketPolicyException: CloudTrail cannot write to S3',
        solution: 'Verify the S3 bucket policy includes AWSLogs/$ACCOUNT_ID/* in the resource ARN and specifies bucket-owner-full-control condition.'
      },
      {
        error: 'TrailAlreadyExistsException',
        solution: 'Check existing trails using aws cloudtrail describe-trails or choose a different trail name.'
      }
    ],
    troubleshooting: [
      'Run aws cloudtrail get-trail-status --name AcademyMasterTrail to verify IsLogging is true and inspect LatestDeliveryTime.',
      'Check S3 bucket contents under AWSLogs/<Account>/CloudTrail/<Region>/ to verify gzipped JSON files are arriving.'
    ],
    securityNotes: [
      'Enable S3 MFA Delete and S3 Object Lock on CloudTrail audit buckets to guard against compromised administrator accounts.',
      'Always enable multi-region trails to detect adversary activity in unused AWS regions.'
    ],
    cleanup: [
      'aws cloudtrail stop-logging --name AcademyMasterTrail',
      'aws cloudtrail delete-trail --name AcademyMasterTrail',
      'aws s3 rm s3://$TRAIL_BUCKET --recursive',
      'aws s3api delete-bucket --bucket $TRAIL_BUCKET',
      'rm -f trail-bucket-policy.json'
    ],
    verification: 'Check get-trail-status to confirm logging was active and lookup-events returned valid API event records.'
  },
  {
    id: 'systems-manager',
    title: 'Systems Manager Operations: Fleet Management without SSH',
    description: 'Manage fleets of Amazon EC2 instances securely using AWS Systems Manager (SSM) Session Manager, Run Command, Patch Manager, and Parameter Store without opening SSH port 22.',
    difficulty: 'intermediate',
    estimatedMinutes: 40,
    order: 14,
    objectives: [
      'Attach AmazonSSMManagedInstanceCore IAM policy to an EC2 instance',
      'Establish interactive shell access using Session Manager without open inbound ports',
      'Execute fleet-wide commands across tagged instances using SSM Run Command',
      'Store and retrieve hierarchical application parameters using SSM Parameter Store'
    ],
    prerequisites: ['iam-roles', 'ec2-linux'],
    services: ['Systems Manager', 'EC2', 'IAM'],
    costWarning: 'Standard Systems Manager core capabilities (Session Manager, Run Command, Parameter Store Standard) are free of charge.',
    steps: [
      {
        id: 'step-1',
        title: 'Attach SSM Managed Policy to Instance Role',
        instructions: 'Attach the AWS-managed policy AmazonSSMManagedInstanceCore to the instance role.',
        code: `aws iam attach-role-policy \\
  --role-name AcademyEC2S3ReaderRole \\
  --policy-arn arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore`,
        codeLanguage: 'bash',
        expectedOutput: 'Policy attached successfully.',
        tips: 'AmazonSSMManagedInstanceCore provides the minimum permissions required for the SSM Agent to communicate with the AWS SSM endpoint.'
      },
      {
        id: 'step-2',
        title: 'Verify SSM Agent Registration',
        instructions: 'Check that the EC2 instance is registered as a managed instance in Systems Manager.',
        code: `aws ssm describe-instance-information \\
  --filters "Key=InstanceIds,Values=$INSTANCE_ID" \\
  --query 'InstanceInformationList[*].[InstanceId,PingStatus,AgentVersion,PlatformType]' --output table`,
        codeLanguage: 'bash',
        expectedOutput: 'Instance listed with PingStatus: Online.',
        tips: 'Amazon Linux 2023 comes with the SSM Agent pre-installed and enabled by default.'
      },
      {
        id: 'step-3',
        title: 'Start Interactive Shell via Session Manager',
        instructions: 'Connect to the instance shell using AWS CLI session manager plugin without any open inbound ports.',
        code: `aws ssm start-session --target $INSTANCE_ID`,
        codeLanguage: 'bash',
        expectedOutput: 'Starting session with SessionId: ...\nsh-5.2$ whoami\nssm-user',
        tips: 'Session Manager communicates over outbound TLS (HTTPS port 443); zero inbound security group rules are required.'
      },
      {
        id: 'step-4',
        title: 'Execute Fleet-Wide Run Command',
        instructions: 'Run a shell command simultaneously across all instances tagged Environment=Production.',
        code: `CMD_ID=$(aws ssm send-command \\
  --document-name "AWS-RunShellScript" \\
  --targets "Key=tag:Name,Values=Academy-WebServer" \\
  --parameters 'commands=["uptime", "df -h /", "uname -r"]' \\
  --query 'Command.CommandId' --output text)

echo "Command dispatched: $CMD_ID"
sleep 5
aws ssm get-command-invocation --command-id $CMD_ID --instance-id $INSTANCE_ID --query 'StandardOutputContent' --output text`,
        codeLanguage: 'bash',
        expectedOutput: 'Command output showing system uptime and kernel release.',
        tips: 'SSM Run Command logs full execution history, caller IAM identity, and stdout/stderr to S3 and CloudWatch.'
      },
      {
        id: 'step-5',
        title: 'Manage Secrets and Config in SSM Parameter Store',
        instructions: 'Store application configuration as a String and database password as a SecureString encrypted with KMS.',
        code: `aws ssm put-parameter \\
  --name "/academy/app/database_url" \\
  --value "postgres://db.internal:5432/app" \\
  --type "String" --overwrite

aws ssm put-parameter \\
  --name "/academy/app/database_password" \\
  --value "SuperSecretValue2026!" \\
  --type "SecureString" --overwrite

aws ssm get-parameter --name "/academy/app/database_password" --with-decryption --query 'Parameter.Value' --output text`,
        codeLanguage: 'bash',
        expectedOutput: 'SuperSecretValue2026!',
        tips: 'Use hierarchical path naming (/app/env/component) to manage permissions using IAM wildcards.'
      }
    ],
    commonErrors: [
      {
        error: 'TargetNotConnected: Instance not showing in describe-instance-information',
        solution: 'Ensure the EC2 instance role has AmazonSSMManagedInstanceCore and the subnet has internet access or VPC endpoints for ssm, ssmmessages, and ec2messages.'
      },
      {
        error: 'SessionManagerPlugin is not found',
        solution: 'Install the AWS Session Manager Plugin for the AWS CLI on your client machine.'
      }
    ],
    troubleshooting: [
      'Inspect SSM Agent logs inside EC2 at /var/log/amazon/ssm/amazon-ssm-agent.log.',
      'Check outbound port 443 egress in the Security Group and Subnet Route Table.'
    ],
    securityNotes: [
      'Eliminate SSH (port 22) from all Security Groups and manage instances entirely through Session Manager.',
      'Log Session Manager terminal keystrokes to an encrypted S3 bucket or CloudWatch Log Group for compliance auditing.'
    ],
    cleanup: [
      'aws ssm delete-parameter --name "/academy/app/database_url"',
      'aws ssm delete-parameter --name "/academy/app/database_password"',
      'aws iam detach-role-policy --role-name AcademyEC2S3ReaderRole --policy-arn arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore'
    ],
    verification: 'Confirm describe-instance-information returned PingStatus: Online and Run Command invocation returned output successfully.'
  },
  {
    id: 'terraform-cfn',
    title: 'Terraform or CloudFormation: Infrastructure as Code (IaC)',
    description: 'Author declarative Infrastructure as Code using AWS CloudFormation and Terraform, manage state files, parameters, outputs, and implement rollback behaviors.',
    difficulty: 'intermediate',
    estimatedMinutes: 50,
    order: 15,
    objectives: [
      'Author a complete AWS CloudFormation YAML template with Parameters and Mappings',
      'Deploy, update, and inspect CloudFormation Stacks using the AWS CLI',
      'Implement CloudFormation Change Sets to preview infrastructure modifications',
      'Configure drift detection and inspect resource drift status'
    ],
    prerequisites: ['vpc-subnets', 'ec2-linux'],
    services: ['CloudFormation', 'VPC', 'EC2'],
    costWarning: 'CloudFormation itself is free. Resources created by the template (subnets, security groups) may incur standard fees if not torn down.',
    steps: [
      {
        id: 'step-1',
        title: 'Author CloudFormation Template (template.yaml)',
        instructions: 'Write a declarative CloudFormation template defining a VPC, Subnet, Security Group, and outputs.',
        code: `cat << 'EOF' > template.yaml
AWSTemplateFormatVersion: '2010-09-09'
Description: 'Academy Cloud Engineering VPC Stack'

Parameters:
  VpcCidr:
    Type: String
    Default: '10.50.0.0/16'
    Description: 'CIDR block for the custom VPC'
  EnvironmentName:
    Type: String
    Default: 'Staging'
    AllowedValues: ['Staging', 'Production']

Resources:
  AcademyVpc:
    Type: 'AWS::EC2::VPC'
    Properties:
      CidrBlock: !Ref VpcCidr
      EnableDnsHostnames: true
      EnableDnsSupport: true
      Tags:
        - Key: Name
          Value: !Sub 'AcademyVpc-\${EnvironmentName}'

  AcademySubnet:
    Type: 'AWS::EC2::Subnet'
    Properties:
      VpcId: !Ref AcademyVpc
      CidrBlock: !Select [0, !Cidr [!Ref VpcCidr, 1, 8]]
      MapPublicIpOnLaunch: true
      Tags:
        - Key: Name
          Value: !Sub 'PublicSubnet-\${EnvironmentName}'

Outputs:
  VpcId:
    Description: 'ID of the created VPC'
    Value: !Ref AcademyVpc
    Export:
      Name: !Sub '\${AWS::StackName}-VpcId'
  SubnetId:
    Description: 'ID of the public subnet'
    Value: !Ref AcademySubnet
    Export:
      Name: !Sub '\${AWS::StackName}-SubnetId'
EOF`,
        codeLanguage: 'bash',
        expectedOutput: 'template.yaml created.',
        tips: 'Using Intrinsic functions like !Sub and !Select provides dynamic templating power.'
      },
      {
        id: 'step-2',
        title: 'Deploy CloudFormation Stack via CLI',
        instructions: 'Create the CloudFormation stack and wait for CREATE_COMPLETE status.',
        code: `aws cloudformation create-stack \\
  --stack-name "Academy-IaC-Stack" \\
  --template-body file://template.yaml \\
  --parameters ParameterKey=EnvironmentName,ParameterValue=Staging

aws cloudformation wait stack-create-complete --stack-name "Academy-IaC-Stack"
echo "Stack deployed successfully!"`,
        codeLanguage: 'bash',
        expectedOutput: 'Stack deployed successfully! Status: CREATE_COMPLETE',
        tips: 'CloudFormation automatically manages dependency ordering between resources (e.g. creating VPC before Subnet).'
      },
      {
        id: 'step-3',
        title: 'Create and Inspect a Change Set',
        instructions: 'Create a Change Set to preview the effect of adding an S3 Bucket before applying changes.',
        code: `cat << 'EOF' >> template.yaml

  AcademyBucket:
    Type: 'AWS::S3::Bucket'
    Properties:
      BucketEncryption:
        ServerSideEncryptionConfiguration:
          - ServerSideEncryptionByDefault:
              SSEAlgorithm: 'AES256'
EOF

aws cloudformation create-change-set \\
  --stack-name "Academy-IaC-Stack" \\
  --change-set-name "AddS3BucketChange" \\
  --template-body file://template.yaml

aws cloudformation wait change-set-create-complete \\
  --stack-name "Academy-IaC-Stack" \\
  --change-set-name "AddS3BucketChange"

aws cloudformation describe-change-set \\
  --stack-name "Academy-IaC-Stack" \\
  --change-set-name "AddS3BucketChange" \\
  --query 'Changes[*].ResourceChange.[Action,LogicalResourceId,ResourceType]' --output table`,
        codeLanguage: 'bash',
        expectedOutput: 'Table showing Action: Add, LogicalResourceId: AcademyBucket, ResourceType: AWS::S3::Bucket',
        tips: 'Change sets prevent accidental deletions or replacements of stateful resources like databases and storage volumes.'
      },
      {
        id: 'step-4',
        title: 'Execute Change Set and Query Outputs',
        instructions: 'Apply the change set and retrieve the exported stack outputs.',
        code: `aws cloudformation execute-change-set \\
  --stack-name "Academy-IaC-Stack" \\
  --change-set-name "AddS3BucketChange"

aws cloudformation wait stack-update-complete --stack-name "Academy-IaC-Stack"

aws cloudformation describe-stacks \\
  --stack-name "Academy-IaC-Stack" \\
  --query 'Stacks[0].Outputs' --output table`,
        codeLanguage: 'bash',
        expectedOutput: 'Table showing exported VpcId and SubnetId.',
        tips: 'Cross-stack references via Export and !ImportValue allow modular decoupling of network, compute, and database stacks.'
      },
      {
        id: 'step-5',
        title: 'Detect and Inspect Stack Drift',
        instructions: 'Trigger CloudFormation drift detection to verify if resources were altered outside of IaC.',
        code: `DRIFT_ID=$(aws cloudformation detect-stack-drift --stack-name "Academy-IaC-Stack" --query 'StackDriftDetectionId' --output text)
sleep 5
aws cloudformation describe-stack-drift-detection-status --stack-drift-detection-id $DRIFT_ID`,
        codeLanguage: 'bash',
        expectedOutput: '"StackDriftStatus": "IN_SYNC"',
        tips: 'Drift detection identifies manual console changes that violate your declared IaC code.'
      }
    ],
    commonErrors: [
      {
        error: 'ValidationError: Template format error: YAML syntax error',
        solution: 'Use aws cloudformation validate-template --template-body file://template.yaml to check syntax before deployment.'
      },
      {
        error: 'UPDATE_ROLLBACK_FAILED',
        solution: 'Examine stack events to identify which resource failed to update or delete during the rollback phase.'
      }
    ],
    troubleshooting: [
      'Use aws cloudformation describe-stack-events --stack-name Academy-IaC-Stack to pinpoint exact failure reasons.',
      'Check resource termination protection policies if deletion fails.'
    ],
    securityNotes: [
      'Store IaC templates in Git version control and enforce automated linting with cfn-lint and tfsec in CI/CD.',
      'Never hardcode secrets or IAM credentials inside CloudFormation templates.'
    ],
    cleanup: [
      'aws cloudformation delete-stack --stack-name "Academy-IaC-Stack"',
      'aws cloudformation wait stack-delete-complete --stack-name "Academy-IaC-Stack"',
      'rm -f template.yaml'
    ],
    verification: 'Verify that describe-stack-events shows stack reaching CREATE_COMPLETE and describe-stack-drift-detection-status reports IN_SYNC.'
  },
  {
    id: 'python-boto3',
    title: 'Python and Boto3 Automation: Cloud Engineering Scripts',
    description: 'Develop cloud automation scripts using Python 3 and the AWS SDK (Boto3): client vs resource paradigms, pagination, error handling, and automated snapshot management.',
    difficulty: 'intermediate',
    estimatedMinutes: 45,
    order: 16,
    objectives: [
      'Understand the architecture difference between Boto3 Client and Resource interfaces',
      'Use Boto3 Paginators to safely query thousands of resources without truncated responses',
      'Handle AWS service errors using botocore.exceptions.ClientError',
      'Build an automated script to identify unattached EBS volumes and purge stale snapshots'
    ],
    prerequisites: ['ebs-snapshots', 'iam-roles'],
    services: ['EC2', 'EBS', 'CloudWatch'],
    steps: [
      {
        id: 'step-1',
        title: 'Set Up Python Virtual Environment and Boto3',
        instructions: 'Initialize virtual environment and install current Boto3 and Botocore libraries.',
        code: `python3 -m venv academy-venv
source academy-venv/bin/activate
pip install --upgrade boto3 botocore`,
        codeLanguage: 'bash',
        expectedOutput: 'Successfully installed boto3 botocore',
        tips: 'Always use virtual environments to avoid library version conflicts.'
      },
      {
        id: 'step-2',
        title: 'Compare Boto3 Client vs Resource APIs',
        instructions: 'Write a script demonstrating the low-level 1:1 service client vs high-level object-oriented resource.',
        code: `cat << 'EOF' > client_vs_resource.py
import boto3

# Low-level client (returns raw dicts, exact mapping to AWS API)
ec2_client = boto3.client('ec2', region_name='us-east-1')
response = ec2_client.describe_instances()
print(f"[Client] Reservations count: {len(response['Reservations'])}")

# High-level resource (object-oriented attributes and sub-collections)
ec2_resource = boto3.resource('ec2', region_name='us-east-1')
instances = list(ec2_resource.instances.all())
print(f"[Resource] Total instance objects: {len(instances)}")
EOF

python3 client_vs_resource.py`,
        codeLanguage: 'bash',
        expectedOutput: '[Client] Reservations count: ...\n[Resource] Total instance objects: ...',
        tips: 'AWS is standardizing on Clients for all new services; Resources are maintained but not expanded for newer services.'
      },
      {
        id: 'step-3',
        title: 'Implement Resilient Pagination',
        instructions: 'Use Boto3 paginators to fetch all S3 objects or EC2 instances without missing records.',
        code: `cat << 'EOF' > paginator_demo.py
import boto3

s3_client = boto3.client('s3', region_name='us-east-1')
paginator = s3_client.get_paginator('list_buckets')

page_iterator = paginator.paginate()
for page in page_iterator:
    for bucket in page['Buckets']:
        print(f"Bucket: {bucket['Name']}, Created: {bucket['CreationDate']}")
EOF

python3 paginator_demo.py`,
        codeLanguage: 'bash',
        expectedOutput: 'Listing of all buckets in account.',
        tips: 'Never assume an API call returns all records; always check NextContinuationToken or use Paginators.'
      },
      {
        id: 'step-4',
        title: 'Robust Error Handling with ClientError',
        instructions: 'Catch specific AWS service exceptions using botocore.exceptions.ClientError.',
        code: `cat << 'EOF' > error_handling.py
import boto3
from botocore.exceptions import ClientError

s3_client = boto3.client('s3', region_name='us-east-1')

try:
    s3_client.head_bucket(Bucket='this-bucket-definitely-does-not-exist-123456789')
except ClientError as e:
    error_code = e.response['Error']['Code']
    error_message = e.response['Error']['Message']
    if error_code == '404' or error_code == 'NoSuchBucket':
        print(f"[Handled] Bucket does not exist: {error_code}")
    else:
        print(f"[Unhandled AWS error]: {error_code} - {error_message}")
EOF

python3 error_handling.py`,
        codeLanguage: 'bash',
        expectedOutput: '[Handled] Bucket does not exist: 404',
        tips: 'Extract e.response["Error"]["Code"] to handle specific API error scenarios gracefully.'
      },
      {
        id: 'step-5',
        title: 'Automated Idle EBS Volume Clean-Up Script',
        instructions: 'Develop and execute a utility that identifies and lists all unattached ("available") EBS volumes for cost savings.',
        code: `cat << 'EOF' > cleanup_volumes.py
import boto3

ec2 = boto3.client('ec2', region_name='us-east-1')

def find_unattached_volumes():
    unattached = []
    paginator = ec2.get_paginator('describe_volumes')
    for page in paginator.paginate(Filters=[{'Name': 'status', 'Values': ['available']}]):
        for vol in page['Volumes']:
            unattached.append({
                'VolumeId': vol['VolumeId'],
                'SizeGB': vol['Size'],
                'CreateTime': vol['CreateTime'].isoformat()
            })
    return unattached

vols = find_unattached_volumes()
print(f"Found {len(vols)} unattached EBS volumes incurring idle charges.")
for v in vols:
    print(f" - {v['VolumeId']} ({v['SizeGB']} GB) created {v['CreateTime']}")
EOF

python3 cleanup_volumes.py`,
        codeLanguage: 'bash',
        expectedOutput: 'Found 0 unattached EBS volumes incurring idle charges.',
        tips: 'Unattached EBS volumes continue to accrue standard per-GB charges until explicitly deleted.'
      }
    ],
    commonErrors: [
      {
        error: 'NoCredentialsError: Unable to locate credentials',
        solution: 'Configure credentials using aws configure or assign an IAM role to the environment.'
      },
      {
        error: 'ClientError: AccessDenied',
        solution: 'Check that the active IAM identity possesses the specific action permissions (e.g. ec2:DescribeVolumes).'
      }
    ],
    troubleshooting: [
      'Enable boto3 debug logging with boto3.set_stream_logger(name="botocore") to view raw HTTP requests and responses.',
      'Check boto3 default region configuration in ~/.aws/config or AWS_DEFAULT_REGION environment variable.'
    ],
    securityNotes: [
      'Never embed AWS credentials inside Python script source files; use environment variables or IAM roles.',
      'Implement exponential backoff and jitter when calling AWS APIs to avoid rate limiting.'
    ],
    cleanup: [
      'rm -rf academy-venv client_vs_resource.py paginator_demo.py error_handling.py cleanup_volumes.py'
    ],
    verification: 'Confirm all four Python test scripts execute without unexpected tracebacks.'
  },
  {
    id: 'docker-ecr',
    title: 'Docker and ECR: Container Images and Registries',
    description: 'Build a containerized microservice, configure Amazon Elastic Container Registry (ECR), push multi-architecture Docker images, and implement image vulnerability scanning.',
    difficulty: 'intermediate',
    estimatedMinutes: 45,
    order: 17,
    objectives: [
      'Author an optimized multi-stage Dockerfile for a production web application',
      'Provision an Amazon ECR private repository with scan-on-push enabled',
      'Authenticate Docker CLI to Amazon ECR using short-lived tokens',
      'Build, tag, and push container images to ECR and inspect security findings'
    ],
    prerequisites: ['ec2-linux'],
    services: ['ECR'],
    costWarning: 'ECR storage charges ~$0.10 per GB/month. Delete repository and images when finished.',
    steps: [
      {
        id: 'step-1',
        title: 'Author Multi-Stage Dockerfile',
        instructions: 'Create an application directory and write a minimal Alpine-based web server Dockerfile.',
        code: `mkdir -p container-lab && cd container-lab

cat << 'EOF' > Dockerfile
FROM alpine:3.19
RUN apk add --no-cache curl nginx
COPY index.html /var/lib/nginx/html/index.html
RUN mkdir -p /run/nginx
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
EOF

cat << 'EOF' > index.html
<!DOCTYPE html>
<html>
<body>
  <h1>Microservice running in Docker on AWS</h1>
</body>
</html>
EOF

docker build -t academy-app:v1 .`,
        codeLanguage: 'bash',
        expectedOutput: 'Successfully tagged academy-app:v1',
        tips: 'Multi-stage builds reduce container attack surface and minimize final image sizes.'
      },
      {
        id: 'step-2',
        title: 'Create Amazon ECR Repository with Scan on Push',
        instructions: 'Create an ECR repository with automated vulnerability scanning and tag immutability enabled.',
        code: `REPO_URI=$(aws ecr create-repository \\
  --repository-name "academy-microservice" \\
  --image-scanning-configuration scanOnPush=true \\
  --image-tag-mutability IMMUTABLE \\
  --query 'repository.repositoryUri' --output text)

echo "ECR Repo URI: $REPO_URI"`,
        codeLanguage: 'bash',
        expectedOutput: 'ECR Repo URI: 123456789012.dkr.ecr.us-east-1.amazonaws.com/academy-microservice',
        tips: 'Tag immutability prevents existing release tags from being overwritten, ensuring build reproducibility.'
      },
      {
        id: 'step-3',
        title: 'Authenticate Docker to Amazon ECR',
        instructions: 'Retrieve an authentication token and log Docker into the private ECR registry.',
        code: `aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin $REPO_URI`,
        codeLanguage: 'bash',
        expectedOutput: 'Login Succeeded',
        tips: 'ECR authorization tokens expire after 12 hours.'
      },
      {
        id: 'step-4',
        title: 'Tag and Push Image to ECR',
        instructions: 'Tag the local image with the ECR repository URI and push image layers.',
        code: `docker tag academy-app:v1 $REPO_URI:v1
docker push $REPO_URI:v1`,
        codeLanguage: 'bash',
        expectedOutput: 'v1: digest: sha256:... size: 1234',
        tips: 'Docker layers already stored in ECR will be skipped during subsequent pushes.'
      },
      {
        id: 'step-5',
        title: 'Inspect Image Vulnerability Scan Results',
        instructions: 'Wait for the automated scan to complete and describe image scan findings.',
        code: `sleep 10
aws ecr describe-image-scan-findings \\
  --repository-name "academy-microservice" \\
  --image-id imageTag=v1 \\
  --query 'imageScanFindings.[findingSeverityCounts,status]'`,
        codeLanguage: 'bash',
        expectedOutput: '{\n  "status": "COMPLETE",\n  "findingSeverityCounts": { "INFORMATIONAL": 1 }\n}',
        tips: 'Amazon Inspector integrates with ECR to provide continuous vulnerability detection.'
      }
    ],
    commonErrors: [
      {
        error: 'denied: Your authorization token has expired',
        solution: 'Re-run aws ecr get-login-password and pipe it into docker login.'
      },
      {
        error: 'ImageTagAlreadyExistsException',
        solution: 'Because IMMUTABLE is enabled, you must bump the tag (e.g. v2) instead of re-pushing v1.'
      }
    ],
    troubleshooting: [
      'Verify the IAM identity has ecr:GetAuthorizationToken and ecr:BatchCheckLayerAvailability permissions.',
      'Check local docker daemon status if docker login fails to connect.'
    ],
    securityNotes: [
      'Enable Enhanced Scanning with Amazon Inspector for deep CVE and programming package vulnerability detection.',
      'Configure ECR Lifecycle Policies to automatically purge old untagged development images.'
    ],
    cleanup: [
      'aws ecr delete-repository --repository-name "academy-microservice" --force',
      'docker rmi academy-app:v1 $REPO_URI:v1 || true',
      'rm -rf container-lab'
    ],
    verification: 'Confirm describe-image-scan-findings returns scan status COMPLETE and ECR reports image digest sha256.'
  },
  {
    id: 'ecs-deployment',
    title: 'ECS Deployment: Serverless Containers on AWS Fargate',
    description: 'Deploy containerized workloads to Amazon Elastic Container Service (ECS) using AWS Fargate serverless compute, task definitions, and Application Load Balancer integration.',
    difficulty: 'intermediate',
    estimatedMinutes: 50,
    order: 18,
    objectives: [
      'Create an Amazon ECS cluster with AWS Fargate capacity providers',
      'Define an ECS Task Definition with CPU, memory, and CloudWatch log routing',
      'Deploy an ECS Service maintaining desired task count across multiple subnets',
      'Connect the ECS Service to an Application Load Balancer target group'
    ],
    prerequisites: ['docker-ecr', 'load-balanced-app'],
    services: ['ECS', 'Fargate', 'ELB', 'CloudWatch'],
    costWarning: 'AWS Fargate charges for vCPU and memory per second. Delete the ECS Service and Cluster upon lab completion.',
    steps: [
      {
        id: 'step-1',
        title: 'Create ECS Cluster',
        instructions: 'Provision an ECS cluster configured for Fargate and Fargate Spot capacity.',
        code: `aws ecs create-cluster \\
  --cluster-name "Academy-Cluster" \\
  --capacity-providers FARGATE FARGATE_SPOT`,
        codeLanguage: 'bash',
        expectedOutput: '"clusterName": "Academy-Cluster", "status": "ACTIVE"',
        tips: 'AWS Fargate removes the operational overhead of provisioning, patching, and scaling underlying EC2 container hosts.'
      },
      {
        id: 'step-2',
        title: 'Create ECS Task Execution Role',
        instructions: 'Create an IAM role permitting ECS Fargate agent to pull images from ECR and write logs to CloudWatch.',
        code: `cat << 'EOF' > ecs-trust.json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": { "Service": "ecs-tasks.amazonaws.com" },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF

aws iam create-role --role-name AcademyEcsTaskExecutionRole --assume-role-policy-document file://ecs-trust.json
aws iam attach-role-policy --role-name AcademyEcsTaskExecutionRole --policy-arn arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy`,
        codeLanguage: 'bash',
        expectedOutput: 'Role created and AmazonECSTaskExecutionRolePolicy attached.',
        tips: 'The Task Execution Role is used by the Fargate infrastructure, while the Task Role is assumed by your application code.'
      },
      {
        id: 'step-3',
        title: 'Register ECS Task Definition',
        instructions: 'Define task specifications: 0.25 vCPU, 512 MB RAM, container image, port mappings, and awslogs driver.',
        code: `cat << EOF > task-def.json
{
  "family": "academy-task",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "executionRoleArn": "arn:aws:iam::$(aws sts get-caller-identity --query Account --output text):role/AcademyEcsTaskExecutionRole",
  "containerDefinitions": [
    {
      "name": "web",
      "image": "public.ecr.aws/docker/library/httpd:alpine",
      "essential": true,
      "portMappings": [
        {
          "containerPort": 80,
          "protocol": "tcp"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/academy-task",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs",
          "awslogs-create-group": "true"
        }
      }
    }
  ]
}
EOF

aws ecs register-task-definition --cli-input-json file://task-def.json`,
        codeLanguage: 'bash',
        expectedOutput: 'Registered task definition academy-task:1.',
        tips: 'awsvpc network mode assigns every Fargate container task its own dedicated Elastic Network Interface (ENI) and private IP.'
      },
      {
        id: 'step-4',
        title: 'Deploy ECS Fargate Service',
        instructions: 'Create an ECS service maintaining 2 tasks running across two subnets.',
        code: `aws ecs create-service \\
  --cluster "Academy-Cluster" \\
  --service-name "academy-web-service" \\
  --task-definition "academy-task" \\
  --desired-count 2 \\
  --launch-type FARGATE \\
  --network-configuration "awsvpcConfiguration={subnets=[$PUB_SUB1,$PUB_SUB2],securityGroups=[$ALB_SG],assignPublicIp=ENABLED}"`,
        codeLanguage: 'bash',
        expectedOutput: '"serviceName": "academy-web-service", "status": "ACTIVE"',
        tips: 'ECS service scheduler continuously monitors container health and automatically replaces failing tasks.'
      },
      {
        id: 'step-5',
        title: 'Verify Running Tasks and Scale Up',
        instructions: 'Inspect running tasks and dynamically scale service from 2 to 4 instances.',
        code: `aws ecs list-tasks --cluster "Academy-Cluster" --service-name "academy-web-service"
aws ecs update-service --cluster "Academy-Cluster" --service-name "academy-web-service" --desired-count 4`,
        codeLanguage: 'bash',
        expectedOutput: 'Desired count updated to 4.',
        tips: 'Task updates take effect within seconds without managing virtual machine capacity.'
      }
    ],
    commonErrors: [
      {
        error: 'ResourceInitializationError: unable to pull secrets or images',
        solution: 'Verify the Task Execution Role has AmazonECSTaskExecutionRolePolicy attached and the subnet has internet/NAT access.'
      },
      {
        error: 'CannotPullContainerError',
        solution: 'If using private ECR, ensure the task execution role has ecr:GetDownloadUrlForLayer permissions.'
      }
    ],
    troubleshooting: [
      'Examine stopped task reason using aws ecs describe-tasks --cluster Academy-Cluster --tasks <task-id>.',
      'Check CloudWatch Log group /ecs/academy-task for application startup crash traces.'
    ],
    securityNotes: [
      'Never run containers as root; specify user in Dockerfile or task definition.',
      'Use AWS Secrets Manager integration in Task Definitions to inject secrets into environment variables securely.'
    ],
    cleanup: [
      'aws ecs update-service --cluster Academy-Cluster --service-name academy-web-service --desired-count 0',
      'aws ecs delete-service --cluster Academy-Cluster --service-name academy-web-service',
      'aws ecs delete-cluster --cluster Academy-Cluster',
      'aws iam detach-role-policy --role-name AcademyEcsTaskExecutionRole --policy-arn arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy',
      'aws iam delete-role --role-name AcademyEcsTaskExecutionRole',
      'rm -f ecs-trust.json task-def.json'
    ],
    verification: 'Check that list-tasks returns healthy running task ARNs in the Academy-Cluster.'
  },
  {
    id: 'event-driven',
    title: 'Event-Driven Processing: S3, EventBridge, SQS, and Lambda',
    description: 'Build an asynchronous event-driven pipeline where S3 bucket uploads emit events to Amazon EventBridge, route through Amazon SQS queues, and trigger AWS Lambda functions.',
    difficulty: 'intermediate',
    estimatedMinutes: 45,
    order: 19,
    objectives: [
      'Configure S3 Event Notifications with EventBridge integration enabled',
      'Create an Amazon SQS Standard Queue with a Dead Letter Queue (DLQ)',
      'Create an Amazon EventBridge rule filtering for specific S3 object prefixes',
      'Deploy a Python AWS Lambda function with SQS event source mapping'
    ],
    prerequisites: ['s3-secure-access', 'python-boto3'],
    services: ['EventBridge', 'SQS', 'Lambda', 'S3'],
    costWarning: 'Free tier eligible: Lambda provides 1M free requests/month and SQS provides 1M free requests/month.',
    steps: [
      {
        id: 'step-1',
        title: 'Create SQS Main Queue and Dead Letter Queue',
        instructions: 'Deploy an SQS Dead-Letter Queue (DLQ) and link it to an ingestion Queue with maxReceiveCount=3.',
        code: `DLQ_URL=$(aws sqs create-queue --queue-name "academy-events-dlq" --query 'QueueUrl' --output text)
DLQ_ARN=$(aws sqs get-queue-attributes --queue-url $DLQ_URL --attribute-names QueueArn --query 'Attributes.QueueArn' --output text)

REDIVE_POLICY="{\\"deadLetterTargetArn\\":\\"$DLQ_ARN\\",\\"maxReceiveCount\\":\\"3\\"}"

QUEUE_URL=$(aws sqs create-queue \\
  --queue-name "academy-events-queue" \\
  --attributes "RedrivePolicy=$REDIVE_POLICY" \\
  --query 'QueueUrl' --output text)

QUEUE_ARN=$(aws sqs get-queue-attributes --queue-url $QUEUE_URL --attribute-names QueueArn --query 'Attributes.QueueArn' --output text)
echo "Main SQS ARN: $QUEUE_ARN"`,
        codeLanguage: 'bash',
        expectedOutput: 'Main SQS queue and Dead Letter Queue created.',
        tips: 'DLQs capture poisoned messages that repeatedly fail processing, protecting against infinite error loops.'
      },
      {
        id: 'step-2',
        title: 'Configure SQS Queue Policy for EventBridge',
        instructions: 'Authorize Amazon EventBridge to send messages to the SQS queue.',
        code: `cat << EOF > sqs-policy.json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowEventBridgeSendMessage",
      "Effect": "Allow",
      "Principal": { "Service": "events.amazonaws.com" },
      "Action": "sqs:SendMessage",
      "Resource": "$QUEUE_ARN"
    }
  ]
}
EOF

aws sqs set-queue-attributes --queue-url $QUEUE_URL --attributes Policy=file://sqs-policy.json`,
        codeLanguage: 'bash',
        expectedOutput: 'SQS policy applied.',
        tips: 'EventBridge requires explicit sqs:SendMessage authorization via resource-based queue policies.'
      },
      {
        id: 'step-3',
        title: 'Create EventBridge Rule for S3 Events',
        instructions: 'Create an EventBridge rule that filters for Object Created events in our lab bucket and targets the SQS queue.',
        code: `RULE_ARN=$(aws events put-rule \\
  --name "AcademyS3UploadRule" \\
  --event-pattern '{
    "source": ["aws.s3"],
    "detail-type": ["Object Created"],
    "detail": {
      "bucket": {
        "name": ["'$BUCKET_NAME'"]
      }
    }
  }' \\
  --query 'RuleArn' --output text)

aws events put-targets \\
  --rule "AcademyS3UploadRule" \\
  --targets "Id=1,Arn=$QUEUE_ARN"`,
        codeLanguage: 'bash',
        expectedOutput: 'EventBridge rule and target linked.',
        tips: 'Event patterns allow declarative JSON filtering by detail, source, account, or region.'
      },
      {
        id: 'step-4',
        title: 'Deploy Lambda Consumer Function',
        instructions: 'Create a Python Lambda function and link it to SQS via Event Source Mapping.',
        code: `cat << 'EOF' > lambda_function.py
import json

def lambda_handler(event, context):
    for record in event['Records']:
        body = json.loads(record['body'])
        print(f"Processed S3 event: {body.get('detail-type')} for key: {body.get('detail', {}).get('object', {}).get('key')}")
    return {"statusCode": 200}
EOF

zip lambda.zip lambda_function.py

LAMBDA_ROLE_ARN=$(aws iam create-role \\
  --role-name AcademyLambdaSQSRole \\
  --assume-role-policy-document '{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Principal":{"Service":"lambda.amazonaws.com"},"Action":"sts:AssumeRole"}]}' \\
  --query 'Role.Arn' --output text)

aws iam attach-role-policy --role-name AcademyLambdaSQSRole --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaSQSQueueExecutionRole

sleep 5

LAMBDA_ARN=$(aws lambda create-function \\
  --function-name "AcademyEventProcessor" \\
  --runtime "python3.11" \\
  --role "$LAMBDA_ROLE_ARN" \\
  --handler "lambda_function.lambda_handler" \\
  --zip-file "fileb://lambda.zip" \\
  --query 'FunctionArn' --output text)

aws lambda create-event-source-mapping \\
  --function-name "AcademyEventProcessor" \\
  --batch-size 10 \\
  --event-source-arn "$QUEUE_ARN"`,
        codeLanguage: 'bash',
        expectedOutput: 'Lambda function deployed and linked to SQS via Event Source Mapping.',
        tips: 'Lambda automatically polls SQS in batches and scales up polling workers based on queue depth.'
      },
      {
        id: 'step-5',
        title: 'Test End-to-End Pipeline',
        instructions: 'Upload an object to S3 and verify the Lambda function processes the event in CloudWatch logs.',
        code: `echo "Process me!" > invoice.pdf
aws s3 cp invoice.pdf s3://$BUCKET_NAME/invoices/invoice.pdf

sleep 10
aws logs tail "/aws/lambda/AcademyEventProcessor" --since 1m`,
        codeLanguage: 'bash',
        expectedOutput: 'Processed S3 event: Object Created for key: invoices/invoice.pdf',
        tips: 'aws logs tail streams CloudWatch Logs directly to the command line.'
      }
    ],
    commonErrors: [
      {
        error: 'Event source mapping in creating/disabled state',
        solution: 'Verify the Lambda role has AWSLambdaSQSQueueExecutionRole giving sqs:ReceiveMessage and sqs:DeleteMessage permissions.'
      },
      {
        error: 'Events not reaching SQS queue',
        solution: 'Check S3 bucket notification configuration to ensure EventBridge notifications are enabled: NotificationConfiguration={EventBridgeConfiguration={}}.'
      }
    ],
    troubleshooting: [
      'Check SQS ApproximateNumberOfMessagesVisible with aws sqs get-queue-attributes.',
      'Examine Lambda concurrency and throttles in CloudWatch metrics.'
    ],
    securityNotes: [
      'Grant Lambda minimal IAM permissions; never grant AdministratorAccess or generic s3:* to consumer functions.',
      'Enable server-side encryption (SSE-SQS) on SQS queues.'
    ],
    cleanup: [
      'aws lambda delete-event-source-mapping --id $(aws lambda list-event-source-mappings --function-name AcademyEventProcessor --query "EventSourceMappings[0].UUID" --output text)',
      'aws lambda delete-function --function-name AcademyEventProcessor',
      'aws events remove-targets --rule AcademyS3UploadRule --ids 1',
      'aws events delete-rule --name AcademyS3UploadRule',
      'aws sqs delete-queue --queue-url $QUEUE_URL',
      'aws sqs delete-queue --queue-url $DLQ_URL',
      'aws iam detach-role-policy --role-name AcademyLambdaSQSRole --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaSQSQueueExecutionRole',
      'aws iam delete-role --role-name AcademyLambdaSQSRole',
      'rm -f lambda_function.py lambda.zip sqs-policy.json invoice.pdf'
    ],
    verification: 'Confirm CloudWatch logs show the Lambda function successfully handled the S3 Object Created message.'
  },
  {
    id: 'cicd-pipeline',
    title: 'CI/CD Pipeline: AWS CodePipeline and CodeBuild Automation',
    description: 'Build an automated Continuous Integration and Continuous Deployment (CI/CD) delivery pipeline using AWS CodePipeline, CodeBuild, and S3 artifact repositories.',
    difficulty: 'intermediate',
    estimatedMinutes: 50,
    order: 20,
    objectives: [
      'Create a CodeBuild project running automated test suites in a container',
      'Define buildspec.yml with pre_build, build, and post_build phases',
      'Construct a multi-stage AWS CodePipeline (Source -> Build -> Deploy)',
      'Trigger pipeline execution and verify deployment promotion'
    ],
    prerequisites: ['docker-ecr', 's3-secure-access'],
    services: ['CodePipeline', 'CodeBuild', 'S3', 'IAM'],
    costWarning: 'CodeBuild provides 100 free build minutes per month. CodePipeline includes 1 free active pipeline per month.',
    steps: [
      {
        id: 'step-1',
        title: 'Create Pipeline Artifact S3 Bucket',
        instructions: 'Create an S3 bucket to store pipeline stage artifacts and build caches.',
        code: `ARTIFACT_BUCKET="academy-pipeline-artifacts-$(date +%s)"
aws s3api create-bucket --bucket $ARTIFACT_BUCKET --region us-east-1
aws s3api put-bucket-versioning --bucket $ARTIFACT_BUCKET --versioning-configuration Status=Enabled`,
        codeLanguage: 'bash',
        expectedOutput: 'Artifact bucket created and versioning enabled.',
        tips: 'CodePipeline requires artifact buckets to have S3 Versioning enabled.'
      },
      {
        id: 'step-2',
        title: 'Author buildspec.yml Configuration',
        instructions: 'Define the build execution phases, dependencies, unit testing commands, and output artifacts.',
        code: `cat << 'EOF' > buildspec.yml
version: 0.2

phases:
  install:
    runtime-versions:
      python: 3.11
    commands:
      - echo "Installing dependencies..."
      - pip install pytest
  pre_build:
    commands:
      - echo "Running automated linting..."
  build:
    commands:
      - echo "Running unit test suite..."
      - python -m pytest --version
  post_build:
    commands:
      - echo "Build and tests completed successfully on $(date)"

artifacts:
  files:
    - '**/*'
EOF`,
        codeLanguage: 'bash',
        expectedOutput: 'buildspec.yml created.',
        tips: 'Use the artifacts block to declare which compiled files should be passed to downstream deploy stages.'
      },
      {
        id: 'step-3',
        title: 'Create CodeBuild Service Role and Project',
        instructions: 'Provision an IAM service role and create the CodeBuild project.',
        code: `BUILD_ROLE_ARN=$(aws iam create-role \\
  --role-name AcademyCodeBuildRole \\
  --assume-role-policy-document '{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Principal":{"Service":"codebuild.amazonaws.com"},"Action":"sts:AssumeRole"}]}' \\
  --query 'Role.Arn' --output text)

aws iam attach-role-policy --role-name AcademyCodeBuildRole --policy-arn arn:aws:iam::aws:policy/AWSCodeBuildDeveloperAccess
aws iam attach-role-policy --role-name AcademyCodeBuildRole --policy-arn arn:aws:iam::aws:policy/CloudWatchLogsFullAccess

sleep 5

aws codebuild create-project \\
  --name "Academy-App-Build" \\
  --source "type=NO_SOURCE,buildspec='$(cat buildspec.yml)'" \\
  --artifacts "type=NO_ARTIFACTS" \\
  --environment "type=LINUX_CONTAINER,image=aws/codebuild/amazonlinux2-x86_64-standard:5.0,computeType=BUILD_GENERAL1_SMALL" \\
  --service-role "$BUILD_ROLE_ARN"`,
        codeLanguage: 'bash',
        expectedOutput: 'CodeBuild project Academy-App-Build initialized.',
        tips: 'CodeBuild executes inside isolated ephemeral Docker containers that are destroyed after every run.'
      },
      {
        id: 'step-4',
        title: 'Trigger Build and Stream Execution Logs',
        instructions: 'Start a build execution and stream build logs to verify pytest and build phases.',
        code: `BUILD_ID=$(aws codebuild start-build --project-name "Academy-App-Build" --query 'build.id' --output text)
echo "Started build: $BUILD_ID"

sleep 15
aws codebuild batch-get-builds --ids "$BUILD_ID" --query 'builds[0].[buildStatus,currentPhase]'`,
        codeLanguage: 'bash',
        expectedOutput: '["SUCCEEDED", "COMPLETED"]',
        tips: 'CodeBuild streams console output directly into CloudWatch Logs in real-time.'
      },
      {
        id: 'step-5',
        title: 'Inspect Pipeline Security Boundaries',
        instructions: 'Verify pipeline IAM service roles adhere to the principle of least privilege.',
        code: `aws iam list-attached-role-policies --role-name AcademyCodeBuildRole`,
        codeLanguage: 'bash',
        expectedOutput: 'List of managed policies attached to build role.',
        tips: 'Limit CodeBuild permissions to only the target ECR repo, S3 bucket, and CloudWatch log groups.'
      }
    ],
    commonErrors: [
      {
        error: 'BUILD_CONTAINER_UNABLE_TO_PULL_IMAGE',
        solution: 'Verify the CodeBuild role has permissions or use AWS managed curated container images.'
      },
      {
        error: 'Invalid buildspec format',
        solution: 'Ensure buildspec.yml adheres strictly to the YAML schema and begins with version: 0.2.'
      }
    ],
    troubleshooting: [
      'Examine detailed build phase error logs in CloudWatch under /aws/codebuild/Academy-App-Build.',
      'Check environment variable bindings if build scripts fail.'
    ],
    securityNotes: [
      'Never store access keys or database credentials in buildspec.yml; reference AWS Secrets Manager directly in the env block.',
      'Configure CodePipeline manual approval gates prior to production deployments.'
    ],
    cleanup: [
      'aws codebuild delete-project --name "Academy-App-Build"',
      'aws iam detach-role-policy --role-name AcademyCodeBuildRole --policy-arn arn:aws:iam::aws:policy/AWSCodeBuildDeveloperAccess',
      'aws iam detach-role-policy --role-name AcademyCodeBuildRole --policy-arn arn:aws:iam::aws:policy/CloudWatchLogsFullAccess',
      'aws iam delete-role --role-name AcademyCodeBuildRole',
      'aws s3 rm s3://$ARTIFACT_BUCKET --recursive',
      'aws s3api delete-bucket --bucket $ARTIFACT_BUCKET',
      'rm -f buildspec.yml'
    ],
    verification: 'Confirm CodeBuild batch-get-builds returns buildStatus: SUCCEEDED.'
  },
  {
    id: 'backup-restoration',
    title: 'Backups and Restoration: AWS Backup and DR Drills',
    description: 'Centralize cross-service backup management using AWS Backup: create backup vaults, assign automated backup plans with lifecycle rules, and perform point-in-time restoration drills.',
    difficulty: 'intermediate',
    estimatedMinutes: 35,
    order: 21,
    objectives: [
      'Create an encrypted AWS Backup Vault with Vault Lock compliance',
      'Author an AWS Backup Plan with cron schedule, retention, and cold-storage tiering',
      'Assign tags to automatically include EBS, RDS, and EFS resources in the backup plan',
      'Execute a simulated disaster recovery restore job and verify recovered data integrity'
    ],
    prerequisites: ['ebs-snapshots', 'rds-deployment'],
    services: ['AWS Backup', 'EBS', 'KMS'],
    costWarning: 'Standard AWS Backup storage rates apply based on backup data size. Delete recovery points at lab end.',
    steps: [
      {
        id: 'step-1',
        title: 'Create AWS Backup Vault with KMS Encryption',
        instructions: 'Create an AWS Backup Vault encrypted with the default AWS Backup KMS key.',
        code: `VAULT_NAME="Academy-Production-Vault"
aws backup create-backup-vault --backup-vault-name $VAULT_NAME`,
        codeLanguage: 'bash',
        expectedOutput: '"BackupVaultName": "Academy-Production-Vault", "BackupVaultArn": "..."',
        tips: 'Backup vaults provide a centralized boundary for auditing and access control across all AWS resources.'
      },
      {
        id: 'step-2',
        title: 'Create an Automated Backup Plan',
        instructions: 'Define an automated backup rule running daily at 05:00 UTC with a 30-day lifecycle retention.',
        code: `cat << EOF > backup-plan.json
{
  "BackupPlanName": "Daily-Production-Plan",
  "Rules": [
    {
      "RuleName": "DailyBackupRule",
      "TargetBackupVaultName": "$VAULT_NAME",
      "ScheduleExpression": "cron(0 5 * * ? *)",
      "StartWindowMinutes": 60,
      "CompletionWindowMinutes": 180,
      "Lifecycle": {
        "DeleteAfterDays": 30
      }
    }
  ]
}
EOF

PLAN_ID=$(aws backup create-backup-plan --backup-plan file://backup-plan.json --query 'BackupPlanId' --output text)
echo "Backup Plan created: $PLAN_ID"`,
        codeLanguage: 'bash',
        expectedOutput: 'Backup plan registered.',
        tips: 'Backup plans support transitioning older recovery points to cheaper Cold Storage.'
      },
      {
        id: 'step-3',
        title: 'Assign Resources via Tags',
        instructions: 'Assign any resource tagged BackupPlan=Production to the newly created backup plan.',
        code: `BACKUP_ROLE_ARN="arn:aws:iam::$(aws sts get-caller-identity --query Account --output text):role/service-role/AWSBackupDefaultServiceRole"

aws backup create-backup-selection \\
  --backup-plan-id $PLAN_ID \\
  --backup-selection '{
    "SelectionName": "Production-Tagged-Resources",
    "IamRoleArn": "'$BACKUP_ROLE_ARN'",
    "ListOfTags": [
      {
        "ConditionType": "STRINGEQUALS",
        "ConditionKey": "BackupPlan",
        "ConditionValue": "Production"
      }
    ]
  }'`,
        codeLanguage: 'bash',
        expectedOutput: 'Selection created.',
        tips: 'Tag-based assignment ensures that newly provisioned resources are backed up automatically without manual configuration.'
      },
      {
        id: 'step-4',
        title: 'Trigger an On-Demand Backup Job',
        instructions: 'Execute an immediate on-demand backup of an EBS volume to the vault.',
        code: `JOB_ID=$(aws backup start-backup-job \\
  --backup-vault-name $VAULT_NAME \\
  --resource-arn "arn:aws:ec2:us-east-1:$(aws sts get-caller-identity --query Account --output text):volume/$VOL_ID" \\
  --iam-role-arn "$BACKUP_ROLE_ARN" \\
  --query 'BackupJobId' --output text)

echo "Backup job started: $JOB_ID"
aws backup describe-backup-job --backup-job-id $JOB_ID --query 'State'`,
        codeLanguage: 'bash',
        expectedOutput: '"RUNNING" or "COMPLETED"',
        tips: 'On-demand backups are ideal before risky database migrations or application upgrades.'
      },
      {
        id: 'step-5',
        title: 'Perform Restore Drill',
        instructions: 'List recovery points in the vault and verify restore job capability.',
        code: `aws backup list-recovery-points-by-backup-vault --backup-vault-name $VAULT_NAME \\
  --query 'RecoveryPoints[*].[RecoveryPointArn,ResourceType,Status]' --output table`,
        codeLanguage: 'bash',
        expectedOutput: 'Table showing completed recovery points in COMPLETED state.',
        tips: 'A backup policy is only as reliable as its tested restoration process. Regular DR drills are mandatory.'
      }
    ],
    commonErrors: [
      {
        error: 'InvalidParameterValueException: IAM role lacks permissions',
        solution: 'Ensure the AWSBackupDefaultServiceRole exists and has AWSBackupServiceRolePolicyForBackup attached.'
      },
      {
        error: 'ResourceNotFoundException when initiating on-demand backup',
        solution: 'Verify the full ARN of the resource to be backed up is formatted correctly.'
      }
    ],
    troubleshooting: [
      'Check backup job progress and error codes with aws backup describe-backup-job --backup-job-id <id>.',
      'Inspect CloudWatch Events for AWS Backup Job State Change notifications.'
    ],
    securityNotes: [
      'Enable AWS Backup Vault Lock in Compliance mode to create immutable WORM (Write Once, Read Many) backups that cannot be deleted even by root.',
      'Enable cross-region backup copy to protect against regional outages.'
    ],
    cleanup: [
      '# Delete recovery points before deleting vault',
      'for rp in $(aws backup list-recovery-points-by-backup-vault --backup-vault-name $VAULT_NAME --query "RecoveryPoints[*].RecoveryPointArn" --output text); do aws backup delete-recovery-point --backup-vault-name $VAULT_NAME --recovery-point-arn $rp; done',
      'aws backup delete-backup-plan --backup-plan-id $PLAN_ID',
      'aws backup delete-backup-vault --backup-vault-name $VAULT_NAME',
      'rm -f backup-plan.json'
    ],
    verification: 'Verify that list-recovery-points-by-backup-vault returns recovery points in the COMPLETED status.'
  },
  {
    id: 'cost-analysis',
    title: 'Cost Analysis: AWS Cost Explorer, Budgets, and Rightsizing',
    description: 'Analyze cloud spend using AWS Cost Explorer API, establish AWS Budgets with proactive email alerts, configure cost allocation tags, and identify rightsizing opportunities.',
    difficulty: 'beginner',
    estimatedMinutes: 30,
    order: 22,
    objectives: [
      'Activate and standardize user-defined Cost Allocation Tags',
      'Create an AWS Budget with actual and forecasted threshold email alerts',
      'Query historical AWS spend grouped by service using Cost Explorer CLI',
      'Analyze EC2 compute rightsizing recommendations to eliminate waste'
    ],
    prerequisites: ['ec2-linux'],
    services: ['Cost Explorer', 'AWS Budgets'],
    costWarning: 'The first 2 AWS Budgets are free. Cost Explorer API queries charge $0.01 per query request.',
    steps: [
      {
        id: 'step-1',
        title: 'Activate Cost Allocation Tags',
        instructions: 'Activate standard tags (Environment, Project, Owner) for cost reporting.',
        code: `aws ce update-cost-allocation-tags-status \\
  --cost-allocation-tags-status '[
    {"TagKey": "Environment", "Status": "Active"},
    {"TagKey": "Project", "Status": "Active"}
  ]'`,
        codeLanguage: 'bash',
        expectedOutput: 'Cost allocation tags status set to Active.',
        tips: 'Activated cost allocation tags take up to 24 hours to begin appearing in Cost Explorer reports.'
      },
      {
        id: 'step-2',
        title: 'Create Monthly Spend Budget via CLI',
        instructions: 'Create an AWS Budget with a $50 limit and configure an alert at 80% actual spend.',
        code: `ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

cat << EOF > budget.json
{
  "BudgetName": "Academy-Monthly-Guardrail",
  "BudgetLimit": {
    "Amount": "50",
    "Unit": "USD"
  },
  "CostTypes": {
    "IncludeTax": true,
    "IncludeSubscription": true,
    "UseBlended": false,
    "IncludeRefund": false,
    "IncludeCredit": false,
    "IncludeUpfront": true,
    "IncludeRecurring": true,
    "IncludeOtherSubscription": true,
    "IncludeSupport": true,
    "IncludeDiscount": true,
    "UseAmortized": false
  },
  "TimeUnit": "MONTHLY",
  "BudgetType": "COST"
}
EOF

cat << EOF > notifications.json
[
  {
    "Notification": {
      "NotificationType": "ACTUAL",
      "ComparisonOperator": "GREATER_THAN",
      "Threshold": 80,
      "ThresholdType": "PERCENTAGE"
    },
    "Subscribers": [
      {
        "SubscriptionType": "EMAIL",
        "Address": "admin@example.com"
      }
    ]
  }
]
EOF

aws budgets create-budget \\
  --account-id $ACCOUNT_ID \\
  --budget file://budget.json \\
  --notifications-with-subscribers file://notifications.json`,
        codeLanguage: 'bash',
        expectedOutput: 'Budget created successfully.',
        tips: 'Combine ACTUAL and FORECASTED notifications to catch cost spikes before they breach your monthly budget.'
      },
      {
        id: 'step-3',
        title: 'Query Monthly Spend by Service via Cost Explorer',
        instructions: 'Retrieve total monthly spend over the last 30 days grouped by AWS service.',
        code: `START_DATE=$(date -d "30 days ago" +%Y-%m-%d)
END_DATE=$(date +%Y-%m-%d)

aws ce get-cost-and-usage \\
  --time-period Start=$START_DATE,End=$END_DATE \\
  --granularity MONTHLY \\
  --metrics "UnblendedCost" \\
  --group-by Type=DIMENSION,Key=SERVICE \\
  --query 'ResultsByTime[*].Groups[*].[Keys[0],Metrics.UnblendedCost.Amount]' --output table`,
        codeLanguage: 'bash',
        expectedOutput: 'Table showing service names (Amazon EC2, Amazon S3) and unblended costs in USD.',
        tips: 'Granularity can be MONTHLY, DAILY, or HOURLY (if hourly granularity is enabled in Cost Explorer settings).'
      },
      {
        id: 'step-4',
        title: 'Identify Unattached EBS Volumes and Idle IPs',
        instructions: 'Run audit queries to spot common cost leaks: idle Elastic IPs and unattached EBS volumes.',
        code: `echo "=== Unattached EBS Volumes ==="
aws ec2 describe-volumes --filters Name=status,Values=available --query 'Volumes[*].[VolumeId,Size,CreateTime]' --output table

echo "=== Unassociated Elastic IPs ==="
aws ec2 describe-addresses --query 'Addresses[?NetworkInterfaceId==null].[PublicIp,AllocationId]' --output table`,
        codeLanguage: 'bash',
        expectedOutput: 'Tables listing idle resources.',
        tips: 'AWS charges for Elastic IPs that are allocated to an account but not associated with a running instance.'
      },
      {
        id: 'step-5',
        title: 'Evaluate Compute Optimizer Recommendations',
        instructions: 'Query AWS Compute Optimizer for over-provisioned EC2 instance rightsizing advice.',
        code: `aws compute-optimizer get-ec2-instance-recommendations \\
  --query 'instanceRecommendations[*].[instanceArn,finding,currentInstanceType]' --output table || echo "Compute optimizer initializing."`,
        codeLanguage: 'bash',
        expectedOutput: 'Findings showing OVER_PROVISIONED or OPTIMIZED recommendations.',
        tips: 'Compute Optimizer uses machine learning over 14+ days of CloudWatch utilization data to recommend optimal instance families.'
      }
    ],
    commonErrors: [
      {
        error: 'DataUnavailableException: Cost Explorer has not yet been enabled',
        solution: 'Enable AWS Cost Explorer in the AWS Billing Console; initial indexing takes up to 24 hours.'
      },
      {
        error: 'DuplicateRecordException in create-budget',
        solution: 'A budget with that name already exists; specify a new budget name or update the existing budget.'
      }
    ],
    troubleshooting: [
      'Check aws budgets describe-budgets --account-id $ACCOUNT_ID to confirm budget parameters and active threshold rules.',
      'Check SPEND calculation type in budget configuration (blended vs unblended vs amortized).'
    ],
    securityNotes: [
      'Enforce SCPs (Service Control Policies) in AWS Organizations to restrict deployment of expensive instance types (e.g. p4d, x2gd).',
      'Use AWS Budgets action rules to automatically stop EC2 instances or attach strict SCPs when budget thresholds are exceeded.'
    ],
    cleanup: [
      'aws budgets delete-budget --account-id $ACCOUNT_ID --budget-name "Academy-Monthly-Guardrail"',
      'rm -f budget.json notifications.json'
    ],
    verification: 'Confirm describe-budgets lists the budget with correct limit and recipient email address.'
  },
  {
    id: 'observability-dashboards',
    title: 'Observability Dashboards: CloudWatch Dashboards and X-Ray Tracing',
    description: 'Build a centralized operational single-pane-of-glass dashboard using Amazon CloudWatch Dashboards, custom metric widgets, and distributed tracing with AWS X-Ray.',
    difficulty: 'intermediate',
    estimatedMinutes: 40,
    order: 23,
    objectives: [
      'Design a CloudWatch Dashboard displaying system and application health widgets',
      'Write dynamic Metric Math expressions (e.g. error rate percentages)',
      'Embed CloudWatch Logs Insights query results directly into dashboard widgets',
      'Instrument applications with AWS X-Ray to track request latencies and service maps'
    ],
    prerequisites: ['cloudwatch-monitoring'],
    services: ['CloudWatch', 'X-Ray'],
    costWarning: 'The first 3 CloudWatch dashboards (up to 50 metrics) are free. Free tier eligible.',
    steps: [
      {
        id: 'step-1',
        title: 'Design Dashboard JSON Definition',
        instructions: 'Define a CloudWatch dashboard specification with metric graphs, single-value callouts, and log queries.',
        code: `cat << 'EOF' > dashboard.json
{
  "widgets": [
    {
      "type": "metric",
      "x": 0,
      "y": 0,
      "width": 12,
      "height": 6,
      "properties": {
        "metrics": [
          [ "AWS/EC2", "CPUUtilization", { "stat": "Average" } ]
        ],
        "period": 300,
        "region": "us-east-1",
        "title": "Fleet CPU Utilization (Avg)"
      }
    },
    {
      "type": "log",
      "x": 12,
      "y": 0,
      "width": 12,
      "height": 6,
      "properties": {
        "query": "SOURCE '/aws/academy/webserver' | fields @timestamp, @message | filter @message like /500/ | sort @timestamp desc | limit 20",
        "region": "us-east-1",
        "title": "Recent 500 Internal Server Errors"
      }
    }
  ]
}
EOF`,
        codeLanguage: 'bash',
        expectedOutput: 'dashboard.json created.',
        tips: 'Widgets are arranged on a 24-column wide responsive grid.'
      },
      {
        id: 'step-2',
        title: 'Deploy CloudWatch Dashboard',
        instructions: 'Publish the dashboard using the AWS CLI put-dashboard command.',
        code: `aws cloudwatch put-dashboard \\
  --dashboard-name "Academy-Operations-Overview" \\
  --dashboard-body file://dashboard.json`,
        codeLanguage: 'bash',
        expectedOutput: '{\n  "DashboardValidationMessages": []\n}',
        tips: 'Empty DashboardValidationMessages confirms valid JSON syntax and metric definitions.'
      },
      {
        id: 'step-3',
        title: 'Add Metric Math Widget for Error Rate Percentage',
        instructions: 'Use Metric Math (m2 / (m1 + m2) * 100) to compute error rate percentage in real time.',
        code: `cat << 'EOF' > metric-math-widget.json
{
  "type": "metric",
  "x": 0,
  "y": 6,
  "width": 12,
  "height": 6,
  "properties": {
    "metrics": [
      [ "AcademyApp", "HTTP200Count", { "id": "m1", "visible": false } ],
      [ "AcademyApp", "HTTP500Count", { "id": "m2", "visible": false } ],
      [ { "expression": "100 * (m2 / (m1 + m2))", "label": "Error Rate (%)", "id": "e1" } ]
    ],
    "period": 60,
    "region": "us-east-1",
    "title": "Calculated HTTP Error Rate %"
  }
}
EOF`,
        codeLanguage: 'bash',
        expectedOutput: 'metric-math-widget.json created.',
        tips: 'Metric Math expressions evaluate across multiple time-series without creating new billed custom metrics.'
      },
      {
        id: 'step-4',
        title: 'Simulate Distributed Traces with AWS X-Ray',
        instructions: 'Generate sample trace segments using the AWS X-Ray CLI to visualize distributed request paths.',
        code: `TRACE_ID="1-$(printf '%x' $(date +%s))-$(head -c 12 /dev/urandom | xxd -p)"
SEGMENT_DOC=$(cat << EOF
{
  "trace_id": "$TRACE_ID",
  "id": "$(head -c 8 /dev/urandom | xxd -p)",
  "start_time": $(date +%s.%N | cut -b1-14),
  "end_time": $(date +%s.%N | cut -b1-14),
  "name": "Academy-Frontend-API",
  "http": {
    "request": {
      "method": "GET",
      "url": "https://api.academy.internal/v1/orders"
    },
    "response": {
      "status": 200
    }
  }
}
EOF
)

aws xray put-trace-segments --trace-segment-documents "$SEGMENT_DOC"`,
        codeLanguage: 'bash',
        expectedOutput: '{\n  "UnprocessedTraceSegments": []\n}',
        tips: 'AWS X-Ray generates visual Service Maps showing node latencies and downstream bottlenecks.'
      },
      {
        id: 'step-5',
        title: 'Verify Dashboard Status and Access URL',
        instructions: 'Retrieve dashboard details and construct the direct AWS Console deep link.',
        code: `aws cloudwatch get-dashboard --dashboard-name "Academy-Operations-Overview" --query 'DashboardName' --output text
echo "Dashboard live at: https://us-east-1.console.aws.amazon.com/cloudwatch/home?region=us-east-1#dashboards:name=Academy-Operations-Overview"`,
        codeLanguage: 'bash',
        expectedOutput: 'Academy-Operations-Overview',
        tips: 'Dashboards can also be shared with external stakeholders without IAM credentials using CloudWatch Dashboard Sharing.'
      }
    ],
    commonErrors: [
      {
        error: 'InvalidParameterInput: Invalid widget JSON',
        solution: 'Validate the dashboard JSON structure; check that x + width does not exceed 24.'
      },
      {
        error: 'PutTraceSegments: Segment document malformed',
        solution: 'Verify the trace_id adheres to X-Ray format: 1-{8 hex digits time}-{24 hex digits identifier}.'
      }
    ],
    troubleshooting: [
      'Use aws cloudwatch list-dashboards to inspect all created dashboard names.',
      'Check X-Ray sampling rules with aws xray get-sampling-rules.'
    ],
    securityNotes: [
      'Do not expose sensitive authentication tokens in X-Ray segment annotations or URLs.',
      'Control dashboard viewing permissions using IAM resource-level ARNs: arn:aws:cloudwatch::*:dashboard/Academy-*.'
    ],
    cleanup: [
      'aws cloudwatch delete-dashboards --dashboard-names "Academy-Operations-Overview"',
      'rm -f dashboard.json metric-math-widget.json'
    ],
    verification: 'Check get-dashboard returns DashboardName Academy-Operations-Overview and UnprocessedTraceSegments is empty.'
  },
  {
    id: 'failure-diagnosis',
    title: 'Failure Diagnosis: Troubleshooting Broken AWS Architectures',
    description: 'Diagnose and remediate complex multi-tier system failures: isolate VPC routing blackholes, resolve security group circular dependencies, and troubleshoot IAM permission boundaries.',
    difficulty: 'advanced',
    estimatedMinutes: 45,
    order: 24,
    objectives: [
      'Diagnose and repair VPC routing "blackhole" states after gateway deletions',
      'Isolate and fix Security Group misconfigurations blocking ALB health checks',
      'Debug IAM policy evaluation failures using AWS CloudTrail and VPC Flow Logs',
      'Perform systematic OSI-model network troubleshooting on cloud infrastructure'
    ],
    prerequisites: ['vpc-subnets', 'routing-security', 'load-balanced-app'],
    services: ['VPC', 'EC2', 'ELB', 'CloudTrail'],
    costWarning: 'Standard EC2 and VPC test components. Clean up all resources after finishing troubleshooting.',
    steps: [
      {
        id: 'step-1',
        title: 'Scenario 1: Detect and Repair Route Table Blackhole',
        instructions: 'Identify route tables with routes pointing to deleted gateways (Status: blackhole).',
        code: 'aws ec2 describe-route-tables --query RouteTables[?Routes[?State==blackhole]] --output json',

        codeLanguage: 'bash',
        expectedOutput: 'JSON list of route tables containing blackhole destinations.',
        tips: 'A route enters blackhole state when its target gateway, NAT gateway, or VPC peering connection is deleted before the route entry.'
      },
      {
        id: 'step-2',
        title: 'Remediate Blackhole Route via CLI',
        instructions: 'Replace the invalid blackhole route with an active gateway target.',
        code: `aws ec2 replace-route \\
  --route-table-id $PUB_RT \\
  --destination-cidr-block 0.0.0.0/0 \\
  --gateway-id $IGW_ID`,
        codeLanguage: 'bash',
        expectedOutput: 'Route replaced successfully without error.',
        tips: 'Use replace-route rather than delete-route followed by create-route to prevent temporary routing gaps.'
      },
      {
        id: 'step-3',
        title: 'Scenario 2: Diagnose ALB 502 Bad Gateway',
        instructions: 'Investigate reasons why Application Load Balancer returns HTTP 502 Bad Gateway.',
        code: `aws elbv2 describe-target-health --target-group-arn $TG_DEFAULT \\
  --query 'TargetHealthDescriptions[*].[Target.Id,TargetHealth.State,TargetHealth.Reason,TargetHealth.Description]' --output table`,
        codeLanguage: 'bash',
        expectedOutput: 'Table showing Reason: Target.FailedHealthChecks, Description: Connection refused/timed out',
        tips: 'HTTP 502 indicates the ALB was unable to establish a successful connection with any registered backend target.'
      },
      {
        id: 'step-4',
        title: 'Scenario 3: Debug IAM Explicit Deny vs Boundary',
        instructions: 'Determine why an authorized user receives AccessDenied when calling AWS APIs.',
        code: `aws iam simulate-principal-policy \\
  --policy-source-arn arn:aws:iam::$(aws sts get-caller-identity --query Account --output text):role/AcademyEC2S3ReaderRole \\
  --action-names s3:PutObject \\
  --resource-arns arn:aws:s3:::my-academy-lab-bucket-101/data.txt \\
  --query 'EvaluationResults[*].[EvalActionName,EvalDecision,MatchedStatements]' --output table`,
        codeLanguage: 'bash',
        expectedOutput: 'Table displaying EvalDecision: explicitDeny or implicitDeny with matched statement references.',
        tips: 'In IAM evaluation: Explicit Deny > Permissions Boundary > SCP > Identity Policy > Implicit Deny.'
      },
      {
        id: 'step-5',
        title: 'Scenario 4: Verify Subnet NACL Dropping Packets',
        instructions: 'Inspect VPC Flow Logs for REJECT records on ephemeral ports.',
        code: `aws ec2 describe-flow-logs --query 'FlowLogs[*].[FlowLogId,LogDestination,TrafficType,FlowLogStatus]' --output table`,
        codeLanguage: 'bash',
        expectedOutput: 'Flow log status showing ACTIVE.',
        tips: 'Flow log line format: <version> <account-id> <interface-id> <srcaddr> <dstaddr> <srcport> <dstport> <protocol> <packets> <bytes> <start> <end> <action> <log-status>.'
      }
    ],
    commonErrors: [
      {
        error: 'InvalidParameterException in replace-route',
        solution: 'Ensure the destination CIDR block matches the existing route table entry exactly.'
      },
      {
        error: 'Target.InvalidState during deregistration',
        solution: 'Wait for in-flight requests to drain during deregistration delay.'
      }
    ],
    troubleshooting: [
      'Follow the OSI model from Layer 3 (Routing), Layer 4 (Security Groups & NACLs), up to Layer 7 (Application health checks).',
      'Use AWS Reachability Analyzer (VPC Reachability Analyzer) to mathematically prove network path connectivity between source and destination.'
    ],
    securityNotes: [
      'Enable VPC Flow Logs on all critical VPCs to establish audit trails for security investigations.',
      'Regularly review AWS Trusted Advisor and Security Hub for high-priority operational findings.'
    ],
    cleanup: [
      '# Remove diagnostic test rules and temporary security group exceptions'
    ],
    verification: 'Confirm all describe-target-health targets return healthy and simulated policies evaluate as expected.'
  },
  {
    id: 'integrated-project',
    title: 'Integrated Cloud Engineering Capstone: End-to-End Enterprise Architecture',
    description: 'Synthesize all cloud engineering competencies: design and deploy an automated, secure, highly available, multi-AZ web platform with ALB, Auto Scaling, RDS PostgreSQL, CloudWatch, and IaC.',
    difficulty: 'advanced',
    estimatedMinutes: 90,
    order: 25,
    objectives: [
      'Design a production VPC across 2 AZs with public, private app, and isolated database subnets',
      'Deploy an Auto Scaling web application tier behind an Application Load Balancer',
      'Integrate a Multi-AZ RDS PostgreSQL database storing dynamic records',
      'Implement CloudWatch Alarms, SNS alerts, and least-privilege IAM instance roles',
      'Perform a comprehensive failover test and execute an automated teardown'
    ],
    prerequisites: [
      'vpc-subnets',
      'routing-security',
      'load-balanced-app',
      'auto-scaling',
      'rds-deployment',
      'cloudwatch-monitoring',
      'terraform-cfn'
    ],
    services: ['VPC', 'EC2', 'ELB', 'Auto Scaling', 'RDS', 'CloudWatch', 'SNS', 'Secrets Manager', 'IAM'],
    costWarning: 'This comprehensive capstone provisions multiple production resources (ALB, Multi-AZ RDS, EC2 ASG). Tear down all resources immediately after validation to avoid unnecessary charges.',
    steps: [
      {
        id: 'step-1',
        title: 'Deploy Enterprise Foundation Network Tier',
        instructions: 'Deploy custom VPC with 2 public subnets, 2 private app subnets, and 2 isolated database subnets across 2 AZs.',
        code: `CAPSTONE_VPC=$(aws ec2 create-vpc --cidr-block 10.100.0.0/16 --query 'Vpc.VpcId' --output text)
aws ec2 modify-vpc-attribute --vpc-id $CAPSTONE_VPC --enable-dns-hostnames "{\\"Value\\":true}"

# Public subnets
PUB1=$(aws ec2 create-subnet --vpc-id $CAPSTONE_VPC --cidr-block 10.100.1.0/24 --availability-zone us-east-1a --query 'Subnet.SubnetId' --output text)
PUB2=$(aws ec2 create-subnet --vpc-id $CAPSTONE_VPC --cidr-block 10.100.2.0/24 --availability-zone us-east-1b --query 'Subnet.SubnetId' --output text)

# Private App subnets
APP1=$(aws ec2 create-subnet --vpc-id $CAPSTONE_VPC --cidr-block 10.100.10.0/24 --availability-zone us-east-1a --query 'Subnet.SubnetId' --output text)
APP2=$(aws ec2 create-subnet --vpc-id $CAPSTONE_VPC --cidr-block 10.100.11.0/24 --availability-zone us-east-1b --query 'Subnet.SubnetId' --output text)

# Private DB subnets
DB1=$(aws ec2 create-subnet --vpc-id $CAPSTONE_VPC --cidr-block 10.100.20.0/24 --availability-zone us-east-1a --query 'Subnet.SubnetId' --output text)
DB2=$(aws ec2 create-subnet --vpc-id $CAPSTONE_VPC --cidr-block 10.100.21.0/24 --availability-zone us-east-1b --query 'Subnet.SubnetId' --output text)

echo "Network subnets provisioned successfully across us-east-1a and us-east-1b."`,
        codeLanguage: 'bash',
        expectedOutput: 'Network subnets provisioned successfully.',
        tips: 'Three-tier architecture (Web, App, DB) isolates data stores completely from the public internet.'
      },
      {
        id: 'step-2',
        title: 'Configure Tiered Security Groups',
        instructions: 'Chain security groups: Public ALB (port 80) -> App Servers (port 80 from ALB) -> RDS (port 5432 from App SG).',
        code: `SG_ALB=$(aws ec2 create-security-group --group-name "Capstone-ALB-SG" --description "Public ALB" --vpc-id $CAPSTONE_VPC --query GroupId --output text)
aws ec2 authorize-security-group-ingress --group-id $SG_ALB --protocol tcp --port 80 --cidr 0.0.0.0/0

SG_APP=$(aws ec2 create-security-group --group-name "Capstone-APP-SG" --description "App Tier" --vpc-id $CAPSTONE_VPC --query GroupId --output text)
aws ec2 authorize-security-group-ingress --group-id $SG_APP --protocol tcp --port 80 --source-group $SG_ALB

SG_DB=$(aws ec2 create-security-group --group-name "Capstone-DB-SG" --description "DB Tier" --vpc-id $CAPSTONE_VPC --query GroupId --output text)
aws ec2 authorize-security-group-ingress --group-id $SG_DB --protocol tcp --port 5432 --source-group $SG_APP`,
        codeLanguage: 'bash',
        expectedOutput: 'Tiered security groups linked by source group reference.',
        tips: 'Zero direct database access from internet or public load balancer.'
      },
      {
        id: 'step-3',
        title: 'Deploy Multi-AZ RDS PostgreSQL Instance',
        instructions: 'Create DB subnet group with DB1 and DB2, and launch a Multi-AZ database.',
        code: `aws rds create-db-subnet-group \\
  --db-subnet-group-name "capstone-db-subnet-group" \\
  --db-subnet-group-description "Isolated DB Subnets" \\
  --subnet-ids "$DB1" "$DB2"

aws rds create-db-instance \\
  --db-instance-identifier "capstone-postgres" \\
  --db-instance-class "db.t3.micro" \\
  --engine "postgres" \\
  --engine-version "15.4" \\
  --master-username "capstoneadmin" \\
  --master-user-password "CapstoneSecure2026!" \\
  --allocated-storage 20 \\
  --multi-az \\
  --db-subnet-group-name "capstone-db-subnet-group" \\
  --vpc-security-group-ids "$SG_DB" \\
  --no-publicly-accessible`,
        codeLanguage: 'bash',
        expectedOutput: 'RDS DB Instance creation initiated with MultiAZ: true.',
        tips: 'The database tier has zero internet routing, maximizing security.'
      },
      {
        id: 'step-4',
        title: 'Deploy Application Load Balancer and Target Group',
        instructions: 'Create an ALB spanning public subnets and configure target group health checks.',
        code: `TG_CAPSTONE=$(aws elbv2 create-target-group \\
  --name "tg-capstone-app" \\
  --protocol HTTP \\
  --port 80 \\
  --vpc-id $CAPSTONE_VPC \\
  --health-check-path "/" \\
  --query 'TargetGroups[0].TargetGroupArn' --output text)

ALB_CAPSTONE=$(aws elbv2 create-load-balancer \\
  --name "capstone-alb" \\
  --subnets $PUB1 $PUB2 \\
  --security-groups $SG_ALB \\
  --scheme internet-facing \\
  --query 'LoadBalancers[0].LoadBalancerArn' --output text)

aws elbv2 create-listener \\
  --load-balancer-arn $ALB_CAPSTONE \\
  --protocol HTTP \\
  --port 80 \\
  --default-actions Type=forward,TargetGroupArn=$TG_CAPSTONE`,
        codeLanguage: 'bash',
        expectedOutput: 'ALB and Listener deployed.',
        tips: 'ALB distributes incoming client requests across instances in both Availability Zones.'
      },
      {
        id: 'step-5',
        title: 'Deploy Auto Scaling Group with Health Check Integration',
        instructions: 'Deploy an Auto Scaling group with launch template connected to the ALB target group.',
        code: `aws autoscaling create-auto-scaling-group \\
  --auto-scaling-group-name "Capstone-ASG" \\
  --launch-template "LaunchTemplateName=Academy-WebServer-LT,Version=1" \\
  --min-size 2 \\
  --max-size 6 \\
  --desired-capacity 2 \\
  --vpc-zone-identifier "$APP1,$APP2" \\
  --target-group-arns "$TG_CAPSTONE" \\
  --health-check-type ELB \\
  --health-check-grace-period 300`,
        codeLanguage: 'bash',
        expectedOutput: 'Capstone Auto Scaling group active.',
        tips: 'The ASG maintains high availability across multiple availability zones automatically.'
      },
      {
        id: 'step-6',
        title: 'Configure Centralized CloudWatch Alarm and Monitoring',
        instructions: 'Set up an alarm tracking ALB 5XX error rates with notification to the operations SNS topic.',
        code: `aws cloudwatch put-metric-alarm \\
  --alarm-name "Capstone-ALB-High5XX" \\
  --metric-name "HTTPCode_Target_5XX_Count" \\
  --namespace "AWS/ApplicationELB" \\
  --statistic "Sum" \\
  --period 60 \\
  --threshold 5 \\
  --comparison-operator "GreaterThanOrEqualToThreshold" \\
  --evaluation-periods 1 \\
  --dimensions Name=LoadBalancer,Value=$(echo $ALB_CAPSTONE | awk -F'loadbalancer/' '{print $2}')`,
        codeLanguage: 'bash',
        expectedOutput: 'Capstone operational alarm configured.',
        tips: 'Metric alarms on ALB Target 5XX alert you instantly to backend application crashes.'
      },
      {
        id: 'step-7',
        title: 'Perform End-to-End Validation and Teardown',
        instructions: 'Verify ALB DNS endpoint responds, test simulated instance termination recovery, and execute teardown.',
        code: `ALB_DNS=$(aws elbv2 describe-load-balancers --load-balancer-arns $ALB_CAPSTONE --query 'LoadBalancers[0].DNSName' --output text)
echo "Testing platform at: http://$ALB_DNS"
curl -I http://$ALB_DNS`,
        codeLanguage: 'bash',
        expectedOutput: 'HTTP/1.1 200 OK',
        tips: 'Automating platform teardown is as critical as automating deployment to control infrastructure costs.'
      }
    ],
    commonErrors: [
      {
        error: 'Subnets in target group must be in same VPC as load balancer',
        solution: 'Verify all subnets, target groups, and load balancers share the identical VPC ID.'
      },
      {
        error: 'Multi-AZ DB creation takes 10+ minutes',
        solution: 'Multi-AZ DB instances synchronously replicate initial storage; plan execution windows accordingly.'
      }
    ],
    troubleshooting: [
      'Query ALB target health: aws elbv2 describe-target-health --target-group-arn $TG_CAPSTONE.',
      'Check Auto Scaling activities: aws autoscaling describe-scaling-activities --auto-scaling-group-name Capstone-ASG.'
    ],
    securityNotes: [
      'Enforce complete database subnet isolation with no route table path to an Internet Gateway or NAT Gateway.',
      'Enforce IMDSv2 and IAM instance roles across all compute instances.'
    ],
    cleanup: [
      'aws autoscaling update-auto-scaling-group --auto-scaling-group-name Capstone-ASG --min-size 0 --desired-capacity 0',
      'aws autoscaling delete-auto-scaling-group --auto-scaling-group-name Capstone-ASG --force-delete',
      'aws elbv2 delete-load-balancer --load-balancer-arn $ALB_CAPSTONE',
      'aws elbv2 wait load-balancers-deleted --load-balancer-arns $ALB_CAPSTONE',
      'aws elbv2 delete-target-group --target-group-arn $TG_CAPSTONE',
      'aws rds delete-db-instance --db-instance-identifier capstone-postgres --skip-final-snapshot --delete-automated-backups',
      'aws cloudwatch delete-alarms --alarm-names Capstone-ALB-High5XX',
      '# Delete security groups and VPC subnets'
    ],
    verification: 'Confirm curl -I http://$ALB_DNS returns HTTP 200 OK and describe-target-health reports targets healthy in both AZs.'
  }
];
