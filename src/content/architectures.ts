import type { Architecture } from '../types';

export const allArchitectures: Architecture[] = [
  {
    id: 'static-website',
    title: 'Static Website on AWS',
    description: 'A globally distributed, highly available, secure, and cost-effective architecture for hosting single-page applications (SPAs) and static assets using Amazon S3, CloudFront CDN, Route 53 DNS, and AWS Certificate Manager (ACM).',
    difficulty: 'beginner',
    services: ['s3', 'cloudfront', 'route53', 'acm'],
    diagram: `graph TD
  User["End User Browser"] -->|"1. DNS Query (HTTPS)"| R53["Amazon Route 53"]
  User -->|"2. HTTPS Request (TLS 1.3)"| CF["Amazon CloudFront (Edge Caches)"]
  CF -->|"3. Origin Request (OAC / S3 API)"| S3["Amazon S3 Bucket (Private Origin)"]
  ACM["AWS Certificate Manager (us-east-1)"] -.->|"Deploys Public SSL/TLS Certificate"| CF
  CF -.->|"Edge Caching & Compression (Gzip/Brotli)"| User`,
    diagramType: 'mermaid',
    requestFlow: [
      { step: 1, description: 'Client browser queries Amazon Route 53 for custom domain ALIAS record resolving to CloudFront distribution domain.', service: 'route53' },
      { step: 2, description: 'Browser establishes a secure TLS 1.3 connection to the nearest CloudFront Edge Location using a free ACM SSL/TLS certificate.', service: 'cloudfront' },
      { step: 3, description: 'CloudFront inspects edge cache: if cache hit, content is returned immediately with low latency.', service: 'cloudfront' },
      { step: 4, description: 'If cache miss, CloudFront signs request via Origin Access Control (OAC) and fetches object from private S3 bucket.', service: 's3' },
      { step: 5, description: 'CloudFront caches response at edge point-of-presence (PoP) based on Cache-Control headers and serves it to user.', service: 'cloudfront' }
    ],
    selectionRationale: [
      { service: 's3', reason: 'Provides 99.999999999% (11 9s) durability, unlimited scalability, and eliminates web server management overhead.', alternatives: 'EC2 web server, EBS, or EFS' },
      { service: 'cloudfront', reason: 'Lowers latency globally via 600+ edge locations, provides free DDoS mitigation with AWS Shield Standard, and allows caching.', alternatives: 'Direct S3 website hosting (lacks TLS on custom domains)' },
      { service: 'route53', reason: 'Offers highly resilient anycast DNS with native zone apex (naked domain) alias support pointing directly to CloudFront.', alternatives: 'Third-party DNS (Cloudflare, GoDaddy)' },
      { service: 'acm', reason: 'Provides free, auto-renewing public SSL/TLS certificates integrated seamlessly into CloudFront distributions.', alternatives: "Let's Encrypt with manual certbot automation" }
    ],
    securityConsiderations: [
      'Enable S3 Block Public Access on the bucket and enforce Origin Access Control (OAC) in CloudFront so users cannot bypass CDN.',
      'Deploy AWS WAF on CloudFront distribution to filter malicious requests, rate-limit bad actors, and prevent common web exploits.',
      'Enforce HTTPS-only traffic via CloudFront redirect HTTP to HTTPS policy and set TLS minimum protocol version to TLSv1.2_2021.',
      'Configure Content Security Policy (CSP), HSTS, and X-Content-Type-Options headers via CloudFront Response Headers Policies.'
    ],
    failureModes: [
      {
        scenario: 'S3 Regional Outage in primary bucket region',
        impact: 'Cache misses fail with 5xx HTTP responses if content is not already cached at the CloudFront Edge Location.',
        mitigation: 'Configure CloudFront Origin Groups with automatic failover to a secondary cross-region replica S3 bucket.'
      },
      {
        scenario: 'Expired or mismatched SSL/TLS Certificate',
        impact: 'Browser displays severe security warning and blocks user traffic from reaching the website.',
        mitigation: 'Use AWS Certificate Manager (ACM) in us-east-1 with DNS validation for automatic certificate renewals.'
      },
      {
        scenario: 'Malicious traffic burst / L7 DDoS attack',
        impact: 'Surge in CloudFront request volume and high data transfer out costs.',
        mitigation: 'Attach AWS WAF with rate-limiting rules and CloudFront geographic restrictions to block illegitimate traffic.'
      }
    ],
    costDrivers: [
      'CloudFront Data Transfer Out (billed per GB, tiered by geographic region)',
      'CloudFront HTTP/HTTPS request volume (per 10,000 requests)',
      'Amazon S3 standard storage capacity (GB-months) and PUT/GET API requests',
      'Route 53 hosted zone monthly fee ($0.50/zone) and DNS query volume'
    ],
    scenarioQuestion: {
      id: 'arch-static-website-q1',
      question: 'A company wants to host a public single-page application (SPA) on AWS using custom domain "app.example.com" over HTTPS. Users must not be able to access the underlying storage bucket directly via S3 URLs. Which architecture satisfies these requirements with the lowest operational overhead?',
      type: 'single',
      options: [
        'Host files on Amazon S3 with website hosting enabled, make bucket public, and point Route 53 CNAME directly to S3 website endpoint.',
        'Store files in a private Amazon S3 bucket, configure CloudFront with Origin Access Control (OAC), attach an ACM certificate, and point Route 53 Alias to CloudFront.',
        'Deploy an Auto Scaling group of t4g.nano EC2 instances running NGINX with Let\'s Encrypt certificates pulling files from Amazon EFS.',
        'Store files in S3 and deploy an Application Load Balancer (ALB) directly in front of the S3 bucket with ACM certificates.'
      ],
      correctAnswers: [1],
      explanation: 'Using a private S3 bucket fronted by CloudFront with Origin Access Control (OAC) ensures that content is only accessible through the CDN. ACM provides free SSL/TLS certificates for custom domains, and Route 53 alias records route traffic seamlessly with zero server management.',
      whyOthersWrong: [
        'Direct S3 website hosting requires public bucket access and does not support custom domain SSL/TLS certificates natively.',
        'EC2 instances running NGINX introduce substantial server maintenance, OS patching, and scaling management overhead.',
        'ALB cannot directly use Amazon S3 buckets as target group backends without Lambda or proxy instances.'
      ],
      decisiveClue: 'Users must not be able to access the underlying storage bucket directly, and custom domain HTTPS with lowest operational overhead is required.',
      difficulty: 'beginner',
      isOriginal: true,
      source: 'Original AWS certification-style practice question'
    }
  },
  {
    id: 'ha-web-app',
    title: 'High-Availability Web Application',
    description: 'A multi-tier, multi-Availability Zone production architecture delivering fault tolerance, auto-scaling compute, managed relational database replication, and automated operational patching.',
    difficulty: 'intermediate',
    services: ['vpc', 'elb', 'ec2', 'auto-scaling', 'rds', 'cloudwatch', 'systems-manager'],
    diagram: `graph TD
  Users["Internet Clients"] -->|"HTTPS / Port 443"| IGW["Internet Gateway"]
  IGW --> ALB["Application Load Balancer (Public Subnets AZ-a & AZ-b)"]
  subgraph VPC["Virtual Private Cloud (10.0.0.0/16)"]
    subgraph PublicSubnets["Public Subnets"]
      ALB
      NAT1["NAT Gateway (AZ-a)"]
      NAT2["NAT Gateway (AZ-b)"]
    end
    subgraph AppSubnets["Private App Subnets"]
      ASG["Auto Scaling Group"]
      EC2_A["EC2 Instance (AZ-a)"]
      EC2_B["EC2 Instance (AZ-b)"]
      ASG --- EC2_A
      ASG --- EC2_B
    end
    subgraph DataSubnets["Isolated Data Subnets"]
      RDS_P["RDS PostgreSQL (Primary - AZ-a)"]
      RDS_S["RDS PostgreSQL (Standby - AZ-b)"]
      RDS_P -.->|"Synchronous Multi-AZ Replication"| RDS_S
    end
  end
  ALB -->|"HTTP / 8080 Target Group"| EC2_A
  ALB -->|"HTTP / 8080 Target Group"| EC2_B
  EC2_A -->|"SQL / Port 5432"| RDS_P
  EC2_B -->|"SQL / Port 5432"| RDS_P
  EC2_A -.->|"Outbound Patches"| NAT1
  EC2_B -.->|"Outbound Patches"| NAT2
  CW["Amazon CloudWatch"] -.->|"Target Tracking Scaling Policy"| ASG
  SSM["AWS Systems Manager"] -.->|"Session Manager / Patch Mgr"| EC2_A
  SSM -.->|"Session Manager / Patch Mgr"| EC2_B`,
    diagramType: 'mermaid',
    requestFlow: [
      { step: 1, description: 'Incoming client requests hit the Internet-facing Application Load Balancer distributed across public subnets.', service: 'elb' },
      { step: 2, description: 'ALB terminates TLS, evaluates path/host listener rules, and routes requests across healthy EC2 targets in private subnets.', service: 'elb' },
      { step: 3, description: 'EC2 instances process requests inside private subnets and query the Amazon RDS Multi-AZ Primary database endpoint.', service: 'ec2' },
      { step: 4, description: 'Amazon RDS synchronously replicates data to the standby replica located in a secondary Availability Zone.', service: 'rds' },
      { step: 5, description: 'CloudWatch collects CPU/request count metrics, signaling Auto Scaling group to add or remove EC2 capacity dynamically.', service: 'cloudwatch' },
      { step: 6, description: 'Engineers manage and patch EC2 instances securely using AWS Systems Manager Session Manager without bastion hosts.', service: 'systems-manager' }
    ],
    selectionRationale: [
      { service: 'vpc', reason: 'Isolates application tiers across public, private, and database subnets with granular Security Groups and NACLs.', alternatives: 'Default VPC flat network structure' },
      { service: 'elb', reason: 'Provides layer 7 content routing, automatic health checks, and cross-zone traffic balancing across instances.', alternatives: 'Network Load Balancer (lacks HTTP path-based routing)' },
      { service: 'auto-scaling', reason: 'Automatically replaces unhealthy instances and adapts compute capacity based on workload demand.', alternatives: 'Fixed static EC2 instance deployments' },
      { service: 'rds', reason: 'Automates database provisioning, backups, snapshots, OS maintenance, and Multi-AZ synchronous failover.', alternatives: 'Self-hosted PostgreSQL on raw EC2 instances' },
      { service: 'systems-manager', reason: 'Eliminates open inbound SSH port 22 and bastion hosts by tunneling console sessions over AWS backbone.', alternatives: 'Bastion jump box with open internet port 22' }
    ],
    securityConsiderations: [
      'Strict Security Group chaining: ALB accepts 443 from 0.0.0.0/0; EC2 SG accepts traffic strictly from ALB SG; RDS SG accepts traffic strictly from EC2 SG.',
      'Deploy EC2 application instances in private subnets with no public IPv4 addresses assigned.',
      'Disable SSH (port 22) inbound rules and require IAM-governed AWS Systems Manager Session Manager for administrative access.',
      'Store database credentials in AWS Secrets Manager with automatic credential rotation enabled.'
    ],
    failureModes: [
      {
        scenario: 'Single Availability Zone hardware outage',
        impact: 'Instances in the impaired AZ terminate or become unresponsive.',
        mitigation: 'ALB shifts traffic to surviving AZ; RDS triggers automatic synchronous DNS failover to standby replica within 60-120 seconds; ASG spins up fresh instances in healthy AZ.'
      },
      {
        scenario: 'Sudden spike in web traffic / flash crowd',
        impact: 'High CPU utilization and increased request latency.',
        mitigation: 'Target Tracking Auto Scaling policy adds EC2 instances based on ALB Request Count Per Target metric.'
      },
      {
        scenario: 'Corrupted database transaction / accidental data deletion',
        impact: 'Data loss reproduced immediately to synchronous standby replica.',
        mitigation: 'Automated point-in-time recovery (PITR) enabled on RDS with retention up to 35 days.'
      }
    ],
    costDrivers: [
      'EC2 instance compute hours (vCPU and RAM specifications, Savings Plans vs On-Demand)',
      'NAT Gateway hourly operational cost and processed data volume per GB',
      'RDS Multi-AZ instance pricing (roughly 2x single-AZ instance cost) plus provisioned gp3/io2 storage',
      'ALB hourly charges and consumed Load Balancer Capacity Units (LCUs)'
    ],
    scenarioQuestion: {
      id: 'arch-ha-web-app-q1',
      question: 'A financial platform runs on EC2 instances behind an Application Load Balancer with an RDS PostgreSQL database. During an Availability Zone failure, the primary database instance goes down. How does the architecture achieve minimum downtime without manual administrator intervention?',
      type: 'single',
      options: [
        'An admin restores the latest RDS snapshot manually to a new instance and updates application database connection strings.',
        'Amazon RDS Multi-AZ automatically switches the CNAME DNS record to the synchronous standby replica in the secondary AZ within 60-120 seconds.',
        'The Auto Scaling group launches a new RDS database instance automatically using an EC2 launch template.',
        'The Application Load Balancer redirects database queries directly to the read replica using read-write splitting.'
      ],
      correctAnswers: [1],
      explanation: 'In an Amazon RDS Multi-AZ configuration, synchronous physical replication keeps the standby instance updated. When the primary fails, RDS automatically changes the database endpoint CNAME record to point to the standby, requiring zero application configuration changes or manual failover steps.',
      whyOthersWrong: [
        'Restoring from snapshots is a manual disaster recovery procedure that incurs significant RTO and loses data since the last snapshot.',
        'Auto Scaling groups manage EC2 instance fleets, not managed Amazon RDS database engines.',
        'Application Load Balancers operate at layer 7 for HTTP/HTTPS traffic and do not route database connection protocols.'
      ],
      decisiveClue: 'Minimum downtime without manual intervention during AZ failure with RDS PostgreSQL.',
      difficulty: 'intermediate',
      isOriginal: true,
      source: 'Original AWS certification-style practice question'
    }
  },
  {
    id: 'serverless-app',
    title: 'Serverless Application',
    description: 'An event-driven, fully serverless microservices architecture combining Amazon API Gateway, AWS Lambda, DynamoDB, Amazon S3, EventBridge, and SQS for extreme scalability and pay-per-use economics.',
    difficulty: 'intermediate',
    services: ['api-gateway', 'lambda', 'dynamodb', 's3', 'eventbridge', 'sqs', 'cloudwatch'],
    diagram: `graph TD
  Client["Client App / Web Browser"] -->|"1. REST API Calls (HTTPS)"| APIGW["Amazon API Gateway (HTTP/REST)"]
  Client -->|"Upload Documents"| S3["Amazon S3 Bucket"]
  APIGW -->|"2. Sync Execution"| LambdaAuth["Auth & Order Lambda"]
  LambdaAuth -->|"3. Read/Write State"| DDB[("Amazon DynamoDB")]
  LambdaAuth -->|"4. PutEvents (Async Order Placed)"| EB["Amazon EventBridge Event Bus"]
  S3 -.->|"ObjectCreated Notification"| EB
  EB -->|"Filter Rule: Order Processing"| SQS["Amazon SQS Queue (Buffering & DLQ)"]
  SQS -->|"5. Batch Trigger"| LambdaWorker["Order Worker Lambda"]
  LambdaWorker -->|"Update Status"| DDB
  LambdaWorker -.->|"Structured Logs & Traces"| CW["Amazon CloudWatch & X-Ray"]`,
    diagramType: 'mermaid',
    requestFlow: [
      { step: 1, description: 'Client submits HTTPS requests to Amazon API Gateway endpoints protected by JWT/Cognito authorizers.', service: 'api-gateway' },
      { step: 2, description: 'API Gateway validates requests and triggers backend AWS Lambda function synchronously via payload proxy.', service: 'lambda' },
      { step: 3, description: 'Lambda function processes business logic and updates transactional records in Amazon DynamoDB with single-digit millisecond latency.', service: 'dynamodb' },
      { step: 4, description: 'Lambda publishes domain events to Amazon EventBridge event bus for asynchronous downstream decoupling.', service: 'eventbridge' },
      { step: 5, description: 'EventBridge routes specific events to Amazon SQS for message buffering and backpressure management.', service: 'sqs' },
      { step: 6, description: 'Downstream worker Lambda consumes SQS batches, executes processing, and logs telemetry to CloudWatch and AWS X-Ray.', service: 'cloudwatch' }
    ],
    selectionRationale: [
      { service: 'api-gateway', reason: 'Provides turnkey API throttling, request validation, CORS, authorization, and OpenAPI specification integration.', alternatives: 'ALB with Lambda targets (lacks built-in API keys/usage plans)' },
      { service: 'lambda', reason: 'True pay-per-use compute that scales instantaneously with zero idle server costs or operating system overhead.', alternatives: 'ECS Fargate tasks (better for long-lived processes)' },
      { service: 'dynamodb', reason: 'Fully managed NoSQL database offering consistent single-digit millisecond latency at any scale with on-demand capacity mode.', alternatives: 'Amazon RDS Aurora Serverless v2' },
      { service: 'eventbridge', reason: 'Decouples microservices through a central schema-aware event bus with content-based filtering rules.', alternatives: 'Direct Lambda-to-Lambda invocation (creates tight coupling)' },
      { service: 'sqs', reason: 'Buffers bursts of downstream work, controls concurrency, and provides Dead Letter Queues (DLQ) for failed payloads.', alternatives: 'Synchronous invocation without queuing' }
    ],
    securityConsiderations: [
      'Grant Lambda least-privilege IAM roles scoped specifically to DynamoDB table ARNs, SQS queue ARNs, and EventBridge buses.',
      'Protect API Gateway with AWS WAF for rate limiting and Cognito User Pools or Lambda authorizers for token validation.',
      'Enable server-side encryption at rest (AWS KMS) for DynamoDB tables, S3 buckets, and SQS queues.',
      'Configure VPC integration for Lambda only if private VPC resources (e.g., RDS or internal endpoints) must be accessed.'
    ],
    failureModes: [
      {
        scenario: 'Downstream third-party API outage during worker processing',
        impact: 'Worker Lambda invocations fail repeatedly, potentially losing messages.',
        mitigation: 'Configure Amazon SQS Dead Letter Queue (DLQ) with maxReceiveCount of 3, alerting on DLQ queue depth via CloudWatch.'
      },
      {
        scenario: 'Sudden spike causing DynamoDB ProvisionedThroughputExceededException',
        impact: 'Writes fail with throttling errors.',
        mitigation: 'Use DynamoDB On-Demand capacity mode or configure exponential backoff and jitter in the AWS SDK client.'
      },
      {
        scenario: 'Lambda Cold Starts impacting latency-sensitive APIs',
        impact: 'Occasional p99 latency spikes during concurrency scaling.',
        mitigation: 'Enable Lambda Provisioned Concurrency or optimize runtime bundle size using arm64 Graviton and lightweight runtimes.'
      }
    ],
    costDrivers: [
      'AWS Lambda compute duration (GB-seconds) and total invocation count',
      'Amazon API Gateway request volume (per million requests)',
      'DynamoDB Read/Write Request Units (RRU/WRU) and storage volume',
      'EventBridge custom events ingested and SQS API requests (polling, sending, receiving)'
    ],
    scenarioQuestion: {
      id: 'arch-serverless-app-q1',
      question: 'A retail application processes checkout orders. High traffic surges cause sudden bursts of orders that occasionally overwhelm an external payment gateway. How should the serverless architecture be designed to decouple order intake from fulfillment and prevent dropped orders?',
      type: 'single',
      options: [
        'Have the API Gateway call the payment gateway directly using HTTP integration with a 60-second timeout.',
        'Ingest orders via API Gateway into Lambda, push order messages to an Amazon SQS queue, and trigger a downstream Lambda with controlled concurrency and a Dead Letter Queue (DLQ).',
        'Increase DynamoDB read/write capacity units to maximum and execute synchronous Lambda retry loops until the payment gateway responds.',
        'Replace AWS Lambda with EC2 Spot instances running a continuous polling script without a queue.'
      ],
      correctAnswers: [1],
      explanation: 'Buffering orders in an Amazon SQS queue decouples ingestion from asynchronous fulfillment. Setting reserved concurrency on the worker Lambda controls the downstream rate against the third-party gateway, while a Dead Letter Queue (DLQ) guarantees that failed messages are captured for inspection.',
      whyOthersWrong: [
        'Direct API Gateway integration creates tight coupling, risks client timeouts, and drops orders when the external payment gateway fails.',
        'Synchronous retry loops in Lambda burn costly execution time and will time out after 15 minutes without resolving downstream backpressure.',
        'EC2 Spot instances without a queue provide no persistence or throttling guarantees and can be interrupted at any time.'
      ],
      decisiveClue: 'Decouple order intake from fulfillment, buffer bursts, and prevent dropped orders against an external bottleneck.',
      difficulty: 'intermediate',
      isOriginal: true,
      source: 'Original AWS certification-style practice question'
    }
  },
  {
    id: 'containerized-app',
    title: 'Containerized Application',
    description: 'An enterprise microservices container architecture featuring Amazon ECR image registry, ECS with AWS Fargate serverless containers, Application Load Balancing, and CI/CD automation.',
    difficulty: 'intermediate',
    services: ['ecr', 'ecs', 'fargate', 'elb', 'cloudwatch'],
    diagram: `graph TD
  Dev["Developer Git Commit"] -->|"Push Code"| CodeBuild["AWS CodeBuild"]
  CodeBuild -->|"Build & Scan Docker Image"| ECR["Amazon Elastic Container Registry (ECR)"]
  subgraph ECS_Cluster["Amazon ECS Cluster (Serverless Fargate)"]
    subgraph PrivateSubnetA["Private Subnet (AZ-a)"]
      TaskA1["ECS Task: Service-A (Fargate)"]
      TaskB1["ECS Task: Service-B (Fargate)"]
    end
    subgraph PrivateSubnetB["Private Subnet (AZ-b)"]
      TaskA2["ECS Task: Service-A (Fargate)"]
      TaskB2["ECS Task: Service-B (Fargate)"]
    end
  end
  ECR -.->|"Pull Container Images (VPC Endpoint)"| TaskA1
  ECR -.->|"Pull Container Images (VPC Endpoint)"| TaskB2
  Users["Web Users"] -->|"HTTPS Requests"| ALB["Application Load Balancer"]
  ALB -->|"Path: /api/orders"| TaskA1
  ALB -->|"Path: /api/orders"| TaskA2
  ALB -->|"Path: /api/users"| TaskB1
  ALB -->|"Path: /api/users"| TaskB2
  TaskA1 -.->|"Container Insights (Logs/Metrics)"| CW["Amazon CloudWatch"]`,
    diagramType: 'mermaid',
    requestFlow: [
      { step: 1, description: 'Developer pushes code to source control, triggering CodeBuild to build, test, and scan a Docker container image.', service: 'ecr' },
      { step: 2, description: 'CodeBuild authenticates and pushes the tagged image into Amazon Elastic Container Registry (ECR).', service: 'ecr' },
      { step: 3, description: 'ECS initiates a rolling deployment, pulling the new image tag from ECR into Amazon ECS Fargate tasks.', service: 'ecs' },
      { step: 4, description: 'AWS Fargate provisions microVM sandboxes in private subnets, running containers without managing underlying EC2 hosts.', service: 'fargate' },
      { step: 5, description: 'The Application Load Balancer routes client requests across healthy Fargate tasks based on path and host rules.', service: 'elb' },
      { step: 6, description: 'CloudWatch Container Insights monitors CPU, memory, network I/O, and aggregated application logs.', service: 'cloudwatch' }
    ],
    selectionRationale: [
      { service: 'ecr', reason: 'Provides secure, private, highly available container image storage with automated vulnerability scanning (Amazon Inspector/Clair).', alternatives: 'Docker Hub public/private (incurs external data transfer and rate limits)' },
      { service: 'ecs', reason: 'Offers native AWS orchestration simplicity, deep IAM integration, and tight coupling with AWS networking and load balancing.', alternatives: 'Amazon EKS (higher complexity and control plane management cost)' },
      { service: 'fargate', reason: 'Removes the need to provision, patch, scale, and manage EC2 host clusters, isolating tasks in lightweight microVMs.', alternatives: 'EC2 launch type (requires AMI maintenance and cluster scaling)' },
      { service: 'elb', reason: 'Enables dynamic host port mapping, HTTP/2 and gRPC support, health checks, and path-based microservices routing.', alternatives: 'Network Load Balancer (lacks HTTP path-based layer 7 routing)' },
      { service: 'cloudwatch', reason: 'Provides Container Insights for turnkey task-level CPU/memory tracking and centralized stdout/stderr streaming.', alternatives: 'Third-party agent installations (Datadog, Dynatrace)' }
    ],
    securityConsiderations: [
      'Differentiate ECS Task Execution Role (grants Fargate permissions to pull ECR images and write CloudWatch logs) from ECS Task Role (grants container application permissions to AWS resources).',
      'Enable ECR image scanning on push to identify operating system and package vulnerabilities immediately.',
      'Deploy Fargate tasks exclusively inside private subnets; configure AWS PrivateLink VPC Endpoints for ECR, S3, and CloudWatch to prevent traffic traversing public internet.',
      'Implement read-only root filesystems on container definitions and drop unnecessary Linux capabilities (e.g., CAP_SYS_ADMIN).'
    ],
    failureModes: [
      {
        scenario: 'Container memory leak causes task to exceed allocated memory limits',
        impact: 'Linux Out-Of-Memory (OOM) killer terminates the container task unexpectedly.',
        mitigation: 'ECS service scheduler automatically launches replacement tasks while ALB redirects traffic; configure CloudWatch alarms on memory utilization.'
      },
      {
        scenario: 'New application deployment fails health check due to bad configuration',
        impact: 'New tasks fail health checks; service risks complete downtime if replaced aggressively.',
        mitigation: 'Use ECS rolling deployments with minimumHealthyPercent=100 and maximumPercent=200, or CodeDeploy blue/green canary deployments.'
      },
      {
        scenario: 'VPC private subnet runs out of available IP addresses',
        impact: 'Fargate tasks fail to launch with "CannotPullContainerError" or ENI allocation errors.',
        mitigation: 'Design VPC subnets with adequately large CIDR blocks (/24 or larger) and clean up orphaned task network interfaces.'
      }
    ],
    costDrivers: [
      'AWS Fargate provisioned vCPU and memory duration billed per second',
      'Amazon ECR storage volume (GB-months) and data transfer',
      'Application Load Balancer hours and Load Balancer Capacity Units (LCUs)',
      'CloudWatch Logs ingestion volume and Container Insights metrics'
    ],
    scenarioQuestion: {
      id: 'arch-containerized-app-q1',
      question: 'A software engineering team wants to run microservices in Docker containers on AWS. They require path-based HTTP routing, zero server maintenance or EC2 patching, and least-privilege IAM access for their containers to query an Amazon S3 bucket. Which combination of services best fulfills these requirements?',
      type: 'single',
      options: [
        'Amazon EKS with EC2 worker nodes, Network Load Balancer, and an IAM instance profile on the EC2 worker node.',
        'Amazon ECS with AWS Fargate launch type, Application Load Balancer, and an ECS Task Role assigned to the task definition.',
        'AWS Elastic Beanstalk single-container Docker environment with an IAM user access key hardcoded into the container image.',
        'Amazon ECS with EC2 launch type, Classic Load Balancer, and an ECS Task Execution Role granting S3 permissions.'
      ],
      correctAnswers: [1],
      explanation: 'Amazon ECS with AWS Fargate provides container orchestration with zero underlying server maintenance. An Application Load Balancer (ALB) handles path-based HTTP routing. Assigning an IAM role to the ECS Task Role gives the application containers granular access to Amazon S3 without granting permissions to the underlying host or other tasks.',
      whyOthersWrong: [
        'Amazon EKS on EC2 worker nodes requires managing EC2 instances and OS patching; NLB does not provide layer 7 path-based routing.',
        'Hardcoding IAM access keys into container images violates security best practices and exposes credentials.',
        'ECS Task Execution Role is used by the ECS container agent to pull images and push logs, not by the application running inside the container to access AWS services like S3; additionally, EC2 launch type requires server maintenance.'
      ],
      decisiveClue: 'Zero server maintenance (Fargate), path-based HTTP routing (ALB), and container-level least-privilege IAM (Task Role).',
      difficulty: 'intermediate',
      isOriginal: true,
      source: 'Original AWS certification-style practice question'
    }
  },
  {
    id: 'enterprise-network',
    title: 'Enterprise Cloud Network',
    description: 'A multi-account, hub-and-spoke enterprise architecture governed by AWS Organizations, Control Tower, and AWS Transit Gateway, centralizing egress inspection, hybrid connectivity, and federated IAM.',
    difficulty: 'advanced',
    services: ['organizations', 'control-tower', 'vpc', 'transit-gateway', 'iam-identity-center'],
    diagram: `graph TD
  IdP["Corporate IdP (Entra ID / Okta)"] -->|"SAML 2.0 / SCIM"| Identity["IAM Identity Center (SSO)"]
  Identity -.->|"Single Sign-On Permissions"| CoreOrg["AWS Organizations / Control Tower"]

  subgraph TGW_Hub["Network Hub Account"]
    TGW["AWS Transit Gateway (Central Hub)"]
    subgraph InspectionVPC["Inspection / Egress VPC"]
      FW["Network Firewall / NAT GW"]
      IGW["Internet Gateway"]
      FW --> IGW
    end
    TGW <-->|"VPC Attachment"| InspectionVPC
  end

  subgraph Spoke_Dev["Dev Workload Account"]
    VPC_Dev["VPC Dev (10.1.0.0/16)"]
    VPC_Dev <-->|"VPC Attachment"| TGW
  end

  subgraph Spoke_Prod["Prod Workload Account"]
    VPC_Prod["VPC Prod (10.2.0.0/16)"]
    VPC_Prod <-->|"VPC Attachment"| TGW
  end

  subgraph Spoke_Shared["Shared Services Account"]
    VPC_Shared["VPC Shared Services (10.3.0.0/16)"]
    VPC_Shared <-->|"VPC Attachment"| TGW
  end

  CorpData["On-Premises Data Center"] -->|"Direct Connect / IPsec VPN"| TGW
  InspectionVPC -->|"Inspected Outbound Traffic"| Internet["Public Internet"]`,
    diagramType: 'mermaid',
    requestFlow: [
      { step: 1, description: 'Enterprise users authenticate once via corporate Identity Provider into IAM Identity Center, receiving short-lived AWS STS credentials.', service: 'iam-identity-center' },
      { step: 2, description: 'Workload VPCs in Dev, Prod, and Shared accounts route non-local traffic to their local AWS Transit Gateway attachment.', service: 'vpc' },
      { step: 3, description: 'Transit Gateway route tables direct inter-VPC traffic or on-premises traffic over Direct Connect / VPN attachments.', service: 'transit-gateway' },
      { step: 4, description: 'Outbound internet traffic is routed through the Inspection/Egress VPC for centralized stateful inspection before traversing NAT Gateway.', service: 'transit-gateway' },
      { step: 5, description: 'Service Control Policies (SCPs) enforced by AWS Organizations block unauthorized regions and disable disabling of security controls.', service: 'organizations' },
      { step: 6, description: 'AWS Control Tower continuously evaluates multi-account compliance against established guardrails and account factory baselines.', service: 'control-tower' }
    ],
    selectionRationale: [
      { service: 'organizations', reason: 'Enforces preventative governance via Service Control Policies (SCPs) and centralizes enterprise consolidated billing.', alternatives: 'Unmanaged standalone AWS accounts' },
      { service: 'control-tower', reason: 'Automates well-architected multi-account landing zone provisioning, account factories, and mandatory compliance guardrails.', alternatives: 'Custom landing zone scripts built from scratch' },
      { service: 'transit-gateway', reason: 'Scales network connectivity by eliminating full-mesh VPC peering complexity (n*(n-1)/2 connections) with a hub-and-spoke model.', alternatives: 'VPC Peering mesh (unmanageable at scale)' },
      { service: 'vpc', reason: 'Provides isolated software-defined networks with custom non-overlapping CIDR allocations across spoke accounts.', alternatives: 'Shared public networks' },
      { service: 'iam-identity-center', reason: 'Provides unified multi-account access federation and directory synchronization without managing individual IAM users.', alternatives: 'IAM Users with static access keys in each account' }
    ],
    securityConsiderations: [
      'Apply Service Control Policies (SCPs) at organizational units (OUs) to deny root user actions, restrict unapproved AWS regions, and prevent leaving organization.',
      'Centralize all outbound internet egress through an inspection VPC equipped with AWS Network Firewall or Suricata IDS/IPS.',
      'Enforce non-overlapping IP address CIDR blocks across all spoke VPCs and on-premises subnets to prevent routing collisions.',
      'Disable VPC peering between Dev and Prod accounts; isolate them completely via separate Transit Gateway route tables.'
    ],
    failureModes: [
      {
        scenario: 'Transit Gateway VPC attachment bandwidth saturation',
        impact: 'Packet dropping and increased latency across inter-VPC and on-premises communications.',
        mitigation: 'Transit Gateway scales automatically up to 50 Gbps per VPC attachment burst; configure ECMP across multiple Direct Connect VPN links.'
      },
      {
        scenario: 'Overly restrictive SCP mistakenly applied to Root OU',
        impact: 'Critical administrative and automated API calls blocked across all member accounts.',
        mitigation: 'Test SCPs in a dedicated Sandbox OU prior to promoting to production; never apply untested deny rules to Organization root.'
      },
      {
        scenario: 'Single AZ failure in Egress Inspection VPC',
        impact: 'Outbound connectivity disrupted for workloads routing through that specific AZ.',
        mitigation: 'Deploy multi-AZ NAT Gateways and AWS Network Firewall endpoints across all available AZs with AZ-independent route tables.'
      }
    ],
    costDrivers: [
      'AWS Transit Gateway hourly attachment fees (per VPC/VPN/Direct Connect attachment)',
      'Transit Gateway data processing charges (per GB of data routed through hub)',
      'Centralized NAT Gateway data processing and hourly charges in Egress VPC',
      'AWS Direct Connect dedicated port hours and data egress fees'
    ],
    scenarioQuestion: {
      id: 'arch-enterprise-network-q1',
      question: 'An enterprise with 50 AWS accounts across multiple business units needs to connect dozens of VPCs to each other and to an on-premises data center. The security team requires that all outbound internet traffic be routed through a central firewall for inspection, and developers in Dev accounts must not be able to connect to Prod VPCs. What is the most scalable architecture?',
      type: 'single',
      options: [
        'Create a full mesh of VPC Peering connections between all 50 accounts and configure NAT Gateways in every individual VPC.',
        'Deploy an AWS Transit Gateway in a central Network Hub account, attach all spoke VPCs, use separate Transit Gateway route tables to isolate Dev and Prod, and route 0.0.0.0/0 to a centralized Egress Inspection VPC.',
        'Establish individual AWS Site-to-Site VPN connections between every spoke VPC and the on-premises data center router.',
        'Use VPC endpoints for all internal communication and assign public elastic IP addresses to all production EC2 instances.'
      ],
      correctAnswers: [1],
      explanation: 'AWS Transit Gateway provides a scalable hub-and-spoke network architecture. Separate Transit Gateway route tables enable network segmentation (keeping Dev isolated from Prod), while a default route (0.0.0.0/0) directed to a centralized Egress Inspection VPC satisfies compliance inspection requirements without full-mesh peering sprawl.',
      whyOthersWrong: [
        'A full mesh of 50+ VPCs would require over 1,200 peering connections, does not support transitive routing, and distributes internet egress costs across 50 separate NAT Gateways.',
        'Configuring separate site-to-site VPNs for 50 accounts creates immense operational overhead and lacks central egress inspection.',
        'VPC endpoints only connect to supported AWS services, not arbitrary inter-VPC workloads, and public IPs on production instances violate zero-trust security postures.'
      ],
      decisiveClue: '50 AWS accounts, isolate Dev from Prod, centralize outbound internet inspection, avoid full-mesh peering.',
      difficulty: 'advanced',
      isOriginal: true,
      source: 'Original AWS certification-style practice question'
    }
  },
  {
    id: 'iac-pipeline',
    title: 'Infrastructure as Code Pipeline',
    description: 'A robust, multi-stage CI/CD automation pipeline for deploying immutable infrastructure safely using AWS CloudFormation, AWS CodePipeline, and AWS CodeBuild with linting, security scanning, and manual approval gates.',
    difficulty: 'intermediate',
    services: ['cloudformation', 'codepipeline', 'codebuild'],
    diagram: `graph LR
  Git["Source Control (CodeCommit / GitHub)"] -->|"Trigger on PR / Push"| CP["AWS CodePipeline"]
  subgraph CP["AWS CodePipeline Stages"]
    Source["Stage 1: Source Pull"]
    Build["Stage 2: CodeBuild (Lint & Scan)"]
    Plan["Stage 3: CloudFormation ChangeSet (Plan)"]
    Approval["Stage 4: Manual Approval Gate"]
    Deploy["Stage 5: Execute ChangeSet (Apply)"]
    Source --> Build --> Plan --> Approval --> Deploy
  end
  Build -.->|"Run cfn-lint & cfn_nag"| S3Artifacts["S3 Pipeline Artifacts"]
  Deploy -->|"Deploys / Updates"| Stacks["Production AWS Resources"]
  Stacks -.->|"Drift Detection & Alarms"| CFN["AWS CloudFormation Engine"]`,
    diagramType: 'mermaid',
    requestFlow: [
      { step: 1, description: 'Engineer commits CloudFormation / CDK / Terraform code; webhook triggers AWS CodePipeline.', service: 'codepipeline' },
      { step: 2, description: 'AWS CodeBuild executes static analysis tools including cfn-lint, cfn_nag, checkov, and unit tests.', service: 'codebuild' },
      { step: 3, description: 'CodePipeline invokes AWS CloudFormation to generate a Change Set, showing the exact resource additions, modifications, and deletions.', service: 'cloudformation' },
      { step: 4, description: 'Pipeline halts at a Manual Approval Gate, sending an Amazon SNS notification to the Lead Cloud Architect with the Change Set diff.', service: 'codepipeline' },
      { step: 5, description: 'Upon approval, CodePipeline executes the CloudFormation Change Set, deploying resources into the target environment.', service: 'cloudformation' },
      { step: 6, description: 'CloudFormation monitors resource provisioning; if any resource fails, an automated rollback restores previous state.', service: 'cloudformation' }
    ],
    selectionRationale: [
      { service: 'cloudformation', reason: 'Native AWS declarative state management with built-in rollback capabilities, drift detection, and StackSets for multi-account deployments.', alternatives: 'Terraform CLI, Pulumi, AWS CDK (CDK synthesizes to CloudFormation)' },
      { service: 'codepipeline', reason: 'Fully managed continuous delivery orchestration service that models visual stages, transitions, and automated status gates.', alternatives: 'Jenkins, GitHub Actions, GitLab CI' },
      { service: 'codebuild', reason: 'Serverless build execution service providing isolated container environments that eliminate build server maintenance.', alternatives: 'Self-hosted Jenkins worker nodes on EC2' }
    ],
    securityConsiderations: [
      'Pass a dedicated CloudFormation Service Role with least-privilege permissions rather than granting the pipeline full AdministratorAccess.',
      'Integrate static security scanners (e.g., cfn_nag, checkov) in the CodeBuild stage to block templates containing unencrypted S3 buckets or open 0.0.0.0/0 ingress rules.',
      'Store CodePipeline artifacts in an S3 bucket encrypted with a customer-managed AWS KMS key.',
      'Enable CloudFormation Stack Termination Protection on critical production database and networking stacks.'
    ],
    failureModes: [
      {
        scenario: 'Resource creation failure during Change Set execution (e.g., name collision)',
        impact: 'Deployment stops; incomplete stack state threatens application availability.',
        mitigation: 'CloudFormation automatic rollback triggers, restoring all resources to their prior functioning configuration.'
      },
      {
        scenario: 'Configuration drift caused by manual console modifications',
        impact: 'Subsequent pipeline runs may overwrite manual hotfixes or fail due to unexpected resource state.',
        mitigation: 'Execute CloudFormation Drift Detection regularly; enforce IAM policies preventing out-of-band console edits.'
      },
      {
        scenario: 'Malicious or broken pull request merged into main branch',
        impact: 'Compromised infrastructure deployed to production environments.',
        mitigation: 'Mandate automated static security checks in CodeBuild and enforce a multi-party Manual Approval Stage before execution.'
      }
    ],
    costDrivers: [
      'AWS CodeBuild build minutes (billed per minute based on compute instance size: general1.small/medium/large)',
      'AWS CodePipeline active pipeline monthly charge ($1/month per active pipeline with 30-day grace period)',
      'S3 storage and KMS cryptographic requests for pipeline artifacts and template storage'
    ],
    scenarioQuestion: {
      id: 'arch-iac-pipeline-q1',
      question: 'A DevOps team needs to ensure that infrastructure updates deployed via CloudFormation do not accidentally delete critical production Amazon RDS databases or cause unexpected service disruptions without prior architectural review. How should the deployment pipeline be configured?',
      type: 'single',
      options: [
        'Configure the pipeline to run "aws cloudformation update-stack" directly without creating a change set.',
        'Configure CodePipeline to generate a CloudFormation Change Set, insert a Manual Approval stage to inspect proposed resource modifications, and configure Stack Termination Protection and DeletionPolicy=Retain on RDS.',
        'Grant the development team AdministratorAccess so they can manually review and edit resources in the AWS Management Console.',
        'Use CodeBuild to delete the existing CloudFormation stack and rebuild it completely from scratch on every commit.'
      ],
      correctAnswers: [1],
      explanation: 'Using CloudFormation Change Sets enables engineers to preview proposed additions, modifications, and deletions prior to application. Combining this with CodePipeline Manual Approval gates, Stack Termination Protection, and DeletionPolicy=Retain ensures critical databases cannot be accidentally deleted.',
      whyOthersWrong: [
        'Executing update-stack directly applies changes immediately without human or automated preview, risking silent resource replacements.',
        'Granting AdministratorAccess and allowing manual console edits causes severe configuration drift and destroys IaC repeatability.',
        'Deleting and recreating stacks from scratch causes massive downtime and terminates stateful production databases.'
      ],
      decisiveClue: 'Prevent accidental database deletion and require prior review of proposed modifications before deployment.',
      difficulty: 'intermediate',
      isOriginal: true,
      source: 'Original AWS certification-style practice question'
    }
  },
  {
    id: 'monitoring-incident',
    title: 'Monitoring & Incident Response',
    description: 'An automated observability and remediation framework leveraging Amazon CloudWatch alarms, AWS CloudTrail audit logs, Amazon SNS alerts, AWS Systems Manager runbooks, and GuardDuty threat detection.',
    difficulty: 'intermediate',
    services: ['cloudwatch', 'cloudtrail', 'systems-manager', 'sns', 'guardduty'],
    diagram: `graph TD
  Resources["AWS Workload Resources (EC2, S3, IAM)"] -->|"Metrics & Logs"| CW["Amazon CloudWatch (Logs & Alarms)"]
  Resources -->|"API Event Audits"| CT["AWS CloudTrail (Multi-Region Trail)"]
  CT -->|"Threat Analysis & Anomaly Detection"| GD["Amazon GuardDuty"]
  CW -->|"Alarm State: ALARM"| SNS["Amazon SNS (Incident Topic)"]
  GD -->|"High Severity Finding"| EB["Amazon EventBridge"]
  EB --> SNS
  EB -->|"Automated Remediation Trigger"| SSM["AWS Systems Manager Automation"]
  SNS -->|"Alert On-Call Engineers"| Pager["On-Call Team (Slack / PagerDuty / Email)"]
  SSM -->|"Execute Automation Runbook (e.g. Isolate EC2)"| Resources`,
    diagramType: 'mermaid',
    requestFlow: [
      { step: 1, description: 'AWS workload services stream performance metrics and logs to CloudWatch; CloudTrail records all control-plane and data-plane API actions.', service: 'cloudwatch' },
      { step: 2, description: 'Amazon GuardDuty analyzes CloudTrail management logs, VPC Flow Logs, and DNS logs using machine learning to detect threat indicators.', service: 'guardduty' },
      { step: 3, description: 'CloudWatch Alarms evaluate metric thresholds (e.g., error rate > 5% or CPU > 90%) and trigger Amazon SNS topics.', service: 'cloudwatch' },
      { step: 4, description: 'Amazon SNS broadcasts incident alerts to on-call engineers via email, SMS, or webhook integrations (Slack, PagerDuty).', service: 'sns' },
      { step: 5, description: 'GuardDuty findings send structured JSON events to EventBridge, which invokes AWS Systems Manager Automation runbooks.', service: 'guardduty' },
      { step: 6, description: 'Systems Manager Automation executes remediation runbooks to isolate compromised instances, revoke IAM sessions, or adjust security groups.', service: 'systems-manager' }
    ],
    selectionRationale: [
      { service: 'cloudwatch', reason: 'Centralized telemetry platform collecting operational metrics, log groups, composite alarms, and dashboard visualizations.', alternatives: 'Prometheus, Grafana, Datadog' },
      { service: 'cloudtrail', reason: 'Provides immutable governance, compliance auditing, and operational troubleshooting records of all API actions.', alternatives: 'Application-level custom audit logs' },
      { service: 'systems-manager', reason: 'Enables deterministic, automated remediation runbooks and secure node management without SSH keys.', alternatives: 'Custom Lambda scripts or manual operator intervention' },
      { service: 'sns', reason: 'High-throughput publish/subscribe notification system connecting cloud alerts to human and automated subscribers.', alternatives: 'Direct email or point-to-point webhook calls' },
      { service: 'guardduty', reason: 'Intelligent, agentless threat detection monitoring account behavior, compromised credentials, and cryptocurrency mining.', alternatives: 'Self-managed SIEM log analysis software' }
    ],
    securityConsiderations: [
      'Enable multi-region AWS CloudTrail trails across all accounts and store audit logs in a centralized, tamper-proof S3 bucket with Object Lock enabled.',
      'Protect CloudTrail log integrity by enabling log file validation and restricting S3 delete permissions via bucket policies and SCPs.',
      'Scope Systems Manager Automation execution roles strictly to the specific actions defined in remediation runbooks.',
      'Encrypt CloudWatch Logs and SNS topics at rest using customer-managed AWS KMS keys.'
    ],
    failureModes: [
      {
        scenario: 'CloudWatch alarm storm caused by cascading service failure',
        impact: 'Notification fatigue overwhelms on-call staff with hundreds of duplicate alerts.',
        mitigation: 'Implement CloudWatch Composite Alarms that suppress individual component alerts when a primary root alarm triggers.'
      },
      {
        scenario: 'Malicious actor disables CloudTrail logging to conceal unauthorized activities',
        impact: 'Loss of audit records during an ongoing security incident.',
        mitigation: 'Enforce an AWS Organizations SCP preventing "cloudtrail:StopLogging" or "cloudtrail:DeleteTrail" across all member accounts.'
      },
      {
        scenario: 'Automated remediation runbook executes against the wrong production instance',
        impact: 'Unintended service outage due to aggressive automated isolation.',
        mitigation: 'Implement tag-based targeting checks and approval gates in Systems Manager runbooks before executing disruptive actions.'
      }
    ],
    costDrivers: [
      'CloudWatch Logs ingestion ($0.50 per GB ingested) and log storage volume ($0.03 per GB-month)',
      'CloudWatch custom metrics and detailed monitoring frequency (1-minute vs 5-minute intervals)',
      'Amazon GuardDuty analysis volume (VPC flow log events, DNS query volume, and S3 event records)',
      'Amazon CloudTrail data events (S3 object-level and Lambda invoke API logging)'
    ],
    scenarioQuestion: {
      id: 'arch-monitoring-incident-q1',
      question: 'A security operations team discovers that an EC2 instance in a production VPC has been compromised and is communicating with a known cryptocurrency mining command-and-control server. The team needs an automated solution to detect this threat and immediately isolate the compromised instance from the network without human delay. Which architecture achieves this?',
      type: 'single',
      options: [
        'Configure Amazon GuardDuty to detect the malicious activity, send findings via Amazon EventBridge to an AWS Systems Manager Automation runbook that modifies the instance security group to block all inbound and outbound traffic, and publish an SNS alert.',
        'Write a cron script on the EC2 instance that checks CPU utilization every 5 minutes and runs "shutdown -h now" if usage exceeds 90%.',
        'Configure CloudWatch Logs to tail Apache access logs and create an Amazon SNS topic that sends an SMS to the sysadmin to manually terminate the instance.',
        'Use AWS Trusted Advisor to run a weekly check on open security groups and send an email report.'
      ],
      correctAnswers: [0],
      explanation: 'Amazon GuardDuty continuously analyzes VPC Flow Logs and DNS logs using threat intelligence to detect command-and-control communication. Routing GuardDuty findings to Amazon EventBridge allows immediate automated invocation of an AWS Systems Manager Automation runbook that detaches or isolates the instance security group, stopping data exfiltration within seconds.',
      whyOthersWrong: [
        'An in-guest cron script cannot be trusted once the operating system is compromised, and CPU utilization is not a reliable indicator of command-and-control activity.',
        'Manual intervention via sysadmin SMS creates severe operational delays during an active security breach.',
        'AWS Trusted Advisor runs asynchronously and does not monitor active runtime network anomalies or perform automated remediation.'
      ],
      decisiveClue: 'Automated threat detection of C2 communication and immediate automated network isolation without human delay.',
      difficulty: 'intermediate',
      isOriginal: true,
      source: 'Original AWS certification-style practice question'
    }
  },
  {
    id: 'backup-dr',
    title: 'Backup & Disaster Recovery',
    description: 'A multi-region business continuity and disaster recovery architecture meeting stringent RPO and RTO requirements using AWS Backup cross-region copy, Amazon RDS cross-region read replicas, S3 Cross-Region Replication, and Route 53 health check failover.',
    difficulty: 'intermediate',
    services: ['aws-backup', 'rds', 's3', 'route53'],
    diagram: `graph TD
  subgraph PrimaryRegion["Primary Region: us-east-1 (Active)"]
    R53["Amazon Route 53 (DNS Failover Routing)"]
    AppPrimary["Application Fleet"]
    RDS_Primary[("Amazon RDS Primary")]
    S3_Primary["Amazon S3 Source Bucket"]
    Backup_Primary["AWS Backup Vault (us-east-1)"]
    AppPrimary --> RDS_Primary
    AppPrimary --> S3_Primary
    Backup_Primary -.->|"Daily Snapshot Policy"| RDS_Primary
  end

  subgraph SecondaryRegion["Secondary Region: us-west-2 (Standby / DR)"]
    AppStandby["Application Fleet (Warm Standby / Pilot Light)"]
    RDS_Replica[("Amazon RDS Cross-Region Read Replica")]
    S3_Secondary["Amazon S3 Replica Bucket"]
    Backup_Secondary["AWS Backup Vault (us-west-2)"]
  end

  R53 -->|"Health Check: OK"| AppPrimary
  R53 -.->|"Health Check: FAILED (Failover)"| AppStandby
  RDS_Primary -->|"Asynchronous Cross-Region Replication"| RDS_Replica
  S3_Primary -->|"S3 Cross-Region Replication (CRR)"| S3_Secondary
  Backup_Primary -->|"Automated Cross-Region Copy"| Backup_Secondary
  RDS_Replica -.->|"Promoted to Standby Primary on Failover"| AppStandby`,
    diagramType: 'mermaid',
    requestFlow: [
      { step: 1, description: 'Under normal operations, Amazon Route 53 directs all production traffic to the primary region based on active health checks.', service: 'route53' },
      { step: 2, description: 'Amazon RDS continuously streams asynchronous database changes to a cross-region read replica in the standby region.', service: 'rds' },
      { step: 3, description: 'Amazon S3 Cross-Region Replication (CRR) automatically replicates uploaded objects to a secondary region bucket.', service: 's3' },
      { step: 4, description: 'AWS Backup centrally orchestrates snapshot schedules and copies protected backups to a secondary region vault.', service: 'aws-backup' },
      { step: 5, description: 'If the primary region fails, Route 53 health checks trip to unhealthy, shifting DNS records to the standby region.', service: 'route53' },
      { step: 6, description: 'The RDS cross-region read replica is promoted to a standalone primary database; standby application fleet scales to full capacity.', service: 'rds' }
    ],
    selectionRationale: [
      { service: 'aws-backup', reason: 'Centralizes and automates data protection compliance policies, immutable backup vaults (Vault Lock), and cross-region copies.', alternatives: 'Custom snapshot scripts and Lambda cron jobs' },
      { service: 'rds', reason: 'Provides managed asynchronous cross-region read replicas with single-command promotion during regional failover events.', alternatives: 'Logical database dumps transferred over internet' },
      { service: 's3', reason: 'S3 Cross-Region Replication (CRR) delivers automatic asynchronous replication with S3 Replication Time Control (RTC) SLA.', alternatives: 'Periodic AWS CLI s3 sync batch commands' },
      { service: 'route53', reason: 'Enables automated DNS failover routing based on endpoint health checkers distributed worldwide.', alternatives: 'Manual DNS record updates with long TTL delays' }
    ],
    securityConsiderations: [
      'Enable AWS Backup Vault Lock in compliance mode to prevent accidental deletion or ransomware modification of backup copies.',
      'Encrypt all cross-region replica S3 buckets and RDS snapshots using regional AWS KMS customer-managed keys (CMKs).',
      'Use cross-account and cross-region backup copies to protect against root account compromise in the primary environment.',
      'Restrict permissions for database replica promotion and Route 53 failover routing policies using strict IAM boundaries.'
    ],
    failureModes: [
      {
        scenario: 'Complete AWS Regional Outage in us-east-1',
        impact: 'Primary application and database become unreachable.',
        mitigation: 'Route 53 health check detects failure, shifts traffic to us-west-2; automation promotes RDS replica to primary writer (RPO < 5 mins, RTO < 15 mins).'
      },
      {
        scenario: 'Ransomware attack encrypts primary operational database',
        impact: 'Corrupted data replicated to read replica within seconds.',
        mitigation: 'Restore clean historical database state from immutable AWS Backup Vault Lock snapshots taken prior to infection.'
      },
      {
        scenario: 'Split-brain DNS routing during intermittent regional network flap',
        impact: 'Writes sent to both regions simultaneously, leading to data divergence.',
        mitigation: 'Configure Route 53 failover with strict request evaluation thresholds and automated circuit breakers.'
      }
    ],
    costDrivers: [
      'Cross-region data transfer out fees (billed per GB transferred from primary to secondary region)',
      'Standby compute capacity (Pilot Light vs Warm Standby vs Hot-Standby Active/Active costs)',
      'Secondary RDS instance charges and provisioned replica storage',
      'AWS Backup storage capacity and cross-region replication data transfer'
    ],
    scenarioQuestion: {
      id: 'arch-backup-dr-q1',
      question: 'A financial institution requires a disaster recovery strategy with a Recovery Point Objective (RPO) of under 5 minutes and a Recovery Time Objective (RTO) of under 15 minutes in the event of an entire AWS Regional failure. Which architectural design meets these criteria cost-effectively?',
      type: 'single',
      options: [
        'Take nightly RDS manual snapshots, export them to an S3 bucket, and manually launch an EC2 instance in a secondary region when an outage occurs.',
        'Implement an active-passive Warm Standby architecture using an RDS Cross-Region Read Replica, S3 Cross-Region Replication, and Route 53 DNS failover with automated replica promotion.',
        'Deploy a full-capacity Active-Active Multi-Region setup running identical maximum-scale compute clusters across 3 AWS regions 24/7.',
        'Back up data to on-premises tapes once per week and recreate cloud infrastructure using CloudFormation when notified by AWS support.'
      ],
      correctAnswers: [1],
      explanation: 'A Warm Standby / Pilot Light architecture using an RDS Cross-Region Read Replica provides near-continuous asynchronous data replication (RPO < 5 mins). Combining Route 53 DNS health checks with automated replica promotion brings the secondary environment online within 15 minutes (RTO < 15 mins) without the exorbitant cost of running full-scale active-active fleets 24/7.',
      whyOthersWrong: [
        'Nightly snapshots result in an RPO of up to 24 hours and a manual rebuild RTO of multiple hours.',
        'Full active-active across 3 regions meets RTO/RPO but incurs massive unnecessary infrastructure costs and complex multi-region write conflict resolution.',
        'Weekly tape backups completely fail the 5-minute RPO and 15-minute RTO financial requirements.'
      ],
      decisiveClue: 'RPO under 5 minutes, RTO under 15 minutes, cost-effective regional disaster recovery.',
      difficulty: 'intermediate',
      isOriginal: true,
      source: 'Original AWS certification-style practice question'
    }
  }
];
