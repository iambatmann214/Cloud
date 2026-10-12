import { AWSService } from '../../types';

export const computeStorageServices: AWSService[] = [
  {
    id: 'ec2',
    name: 'Amazon Elastic Compute Cloud',
    shortName: 'EC2',
    category: 'compute',
    difficulty: 'beginner',
    importance: 'essential',
    icon: 'Compute',
    tagline: 'Resizable, secure compute capacity in the cloud',
    mentalModel: 'Renting a virtual computer in an AWS data center with your choice of CPU, RAM, OS, and networking.',
    problemItSolves: 'Eliminates the upfront expense and multi-week delay of procuring physical servers, enabling rapid infrastructure scaling.',
    howItWorks: 'AWS provisions virtual machines (instances) running on hypervisors (Nitro System) across global Availability Zones, backed by AMI images and attached EBS volumes.',
    components: [
      { name: 'AMI (Amazon Machine Image)', description: 'Pre-configured virtual machine templates containing OS and pre-installed software.' },
      { name: 'Instance Types', description: 'Optimized combinations of CPU, memory, storage, and networking capacity (e.g., General Purpose, Compute, Memory).' },
      { name: 'Security Groups', description: 'Virtual firewalls controlling inbound and outbound network traffic at the instance level.' },
      { name: 'Instance Metadata Service (IMDSv2)', description: 'On-instance endpoint delivering credentials and configuration details securely.' }
    ],
    realWorldExample: 'Hosting a monolithic legacy e-commerce application requiring direct OS access and custom third-party kernel modules.',
    whenToUse: [
      'Full administrative control (root/administrator access) over the operating system is required',
      'Long-running, legacy monolithic applications that cannot be containerized or run serverless',
      'Workloads needing specialized hardware like GPUs or FPGA acceleration'
    ],
    whenNotToUse: [
      'Stateless event-driven workloads that execute in milliseconds to seconds (use AWS Lambda)',
      'Standard web applications where infrastructure management can be offloaded (use ECS/Fargate or App Runner)',
      'Static websites with zero server-side computation (use Amazon S3 with CloudFront)'
    ],
    practicalImplementation: {
      cli: 'aws ec2 run-instances --image-id ami-0c55b159cbfafe1f0 --instance-type t3.micro --key-name MyKeyPair --security-group-ids sg-12345678 --subnet-id subnet-12345678'
    },
    security: 'Use IAM Instance Profiles rather than hardcoded credentials. Enforce IMDSv2 and restrict inbound Security Group rules to specific CIDRs.',
    costDrivers: 'Instance type hours, attached EBS volumes, and inter-region or Internet egress data transfer.',
    limitations: [
      'Maintenance and OS patching remain the customer responsibility',
      'Horizontal autoscaling takes minutes rather than milliseconds compared to serverless functions',
      'Default vCPU service quotas apply per region'
    ],
    commonMistakes: [
      'Leaving port 22 or 3389 open to 0.0.0.0/0 instead of using AWS Systems Manager Session Manager',
      'Overprovisioning instance sizes instead of relying on Auto Scaling and Compute Optimizer recommendations',
      'Forgetting that instance store volumes lose all data upon instance termination or hardware failure'
    ],
    alternatives: [
      { service: 'lambda', reason: 'Zero server management and per-millisecond billing for event-driven tasks' },
      { service: 'ecs', reason: 'Better density and container isolation without managing raw VMs' },
      { service: 'elastic-beanstalk', reason: 'PaaS experience managing provisioning, load balancing, and autoscaling automatically' }
    ],
    relatedServices: ['ebs', 'auto-scaling', 'elb', 'vpc', 'systems-manager'],
    scenarioQuestion: {
      id: 'q-ec2-01',
      question: 'A company runs an enterprise application on EC2 instances that requires high performance and secure access without exposing management ports to the internet. Which architecture achieves this with minimal management overhead?',
      type: 'single',
      options: [
        'Deploy a bastion host with SSH key rotation and restrict security groups to corporate IP addresses.',
        'Attach IAM roles to EC2 instances and connect via AWS Systems Manager Session Manager without open inbound ports.',
        'Place EC2 instances in a public subnet and restrict SSH ingress using a Network ACL.',
        'Use AWS Client VPN attached directly to the instance elastic network interface.'
      ],
      correctAnswers: [1],
      explanation: 'AWS Systems Manager Session Manager allows secure remote shell access without opening any inbound ports or managing SSH bastion hosts.',
      whyOthersWrong: [
        'Bastion hosts require patching, key management, and public IP exposure.',
        'Public subnets with open SSH ports violate security best practices even with NACLs.',
        'Client VPN connects to subnets rather than individual ENIs and incurs higher operational complexity.'
      ],
      decisiveClue: 'Access without open inbound ports and zero bastion host overhead points directly to Systems Manager Session Manager.',
      difficulty: 'intermediate',
      isOriginal: true
    },
    quickRevision: [
      'Nitro System offloads virtualization and networking to dedicated hardware for near-bare-metal speed.',
      'Purchasing models: On-Demand, Savings Plans/Reserved Instances (up to 72% discount), Spot Instances (up to 90% discount).',
      'Session Manager replaces SSH keys and eliminates public-facing bastion hosts.',
      'IMDSv2 uses session-oriented tokens to mitigate SSRF vulnerabilities.'
    ],
    sources: [
      { title: 'Amazon EC2 Documentation', url: 'https://docs.aws.amazon.com/ec2/' },
      { title: 'AWS Systems Manager Session Manager', url: 'https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager.html' }
    ],
    searchTerms: ['ec2', 'virtual machine', 'compute', 'instances', 'nitro', 'ami']
  },
  {
    id: 'lambda',
    name: 'AWS Lambda',
    shortName: 'Lambda',
    category: 'serverless',
    difficulty: 'intermediate',
    importance: 'essential',
    icon: 'Serverless',
    tagline: 'Run code without thinking about servers or clusters',
    mentalModel: 'A short-lived event-triggered container that spawns on demand, runs your code, and shuts down immediately.',
    problemItSolves: 'Removes the overhead of provisioning, patching, scaling, and paying for idle infrastructure.',
    howItWorks: 'Lambda runs code in secure microVMs (Firecracker) responding to events from services like S3, API Gateway, SQS, or EventBridge.',
    components: [
      { name: 'Function Handler', description: 'The entry point function AWS Lambda invokes when the function executes.' },
      { name: 'Execution Role', description: 'An IAM role granting permissions to AWS resources accessed by the function.' },
      { name: 'Event Source Mapping', description: 'Polling service that reads from stream/queue sources (SQS, Kinesis, DynamoDB Streams) and invokes Lambda.' },
      { name: 'Provisioned Concurrency', description: 'Pre-warmed execution environments that eliminate cold start latencies.' }
    ],
    realWorldExample: 'Resizing uploaded profile images in Amazon S3 automatically upon PUT events.',
    whenToUse: [
      'Event-driven processing responding to S3 uploads, DynamoDB updates, or queue messages',
      'Microservices APIs with unpredictable or spiky traffic patterns',
      'Scheduled background cron tasks running under 15 minutes'
    ],
    whenNotToUse: [
      'Tasks requiring more than 15 minutes of uninterrupted execution time (use ECS or Batch)',
      'Applications requiring stateful in-memory sessions across multiple HTTP requests',
      'Ultra-high sustained throughput where dedicated containers or EC2 instances are more cost-effective'
    ],
    practicalImplementation: {
      cli: 'aws lambda create-function --function-name image-processor --runtime nodejs18.x --role arn:aws:iam::123456789012:role/lambda-s3-role --handler index.handler --zip-file fileb://function.zip'
    },
    security: 'Follow principle of least privilege in IAM execution roles. Enable VPC integration with private endpoints for internal resource access.',
    costDrivers: 'Number of requests and compute duration (measured in GB-seconds).',
    limitations: [
      'Maximum execution timeout of 15 minutes per invocation',
      'Default /tmp ephemeral storage limit is 10 GB',
      'Cold starts can introduce latency for infrequently invoked functions'
    ],
    commonMistakes: [
      'Writing database connections inside the handler function instead of initializing them globally outside the handler',
      'Failing to configure Dead Letter Queues (DLQ) or destinations for asynchronous invocation failures',
      'Putting Lambda in a VPC without considering private endpoint routing or elastic network interface allocation'
    ],
    alternatives: [
      { service: 'fargate', reason: 'Containerized workloads needing hours of continuous runtime without timeouts' },
      { service: 'ec2', reason: 'Full OS level control and persistence across long execution intervals' },
      { service: 'step-functions', reason: 'Orchestrating complex multi-step workflows instead of nesting Lambda calls' }
    ],
    relatedServices: ['api-gateway', 'sqs', 'eventbridge', 's3', 'step-functions'],
    scenarioQuestion: {
      id: 'q-lambda-01',
      question: 'An e-commerce API experiences intermittent latency spikes on its customer checkout endpoint because of cold starts. Which configuration completely eliminates cold start delays for critical traffic?',
      type: 'single',
      options: [
        'Increase Lambda function memory allocation to 10,240 MB.',
        'Configure Provisioned Concurrency on the function alias used by the API.',
        'Create a CloudWatch Event rule that pings the function every 5 minutes.',
        'Enable Reserved Concurrency set to the expected concurrent user count.'
      ],
      correctAnswers: [1],
      explanation: 'Provisioned Concurrency keeps execution environments initialized and hyper-ready to respond immediately with double-digit millisecond latency.',
      whyOthersWrong: [
        'Increasing memory provides more CPU but does not initialize execution environments prior to requests.',
        'Pinging functions with cron warmers only warms a single environment and fails to handle concurrent spikes.',
        'Reserved Concurrency caps the maximum concurrent executions to prevent runaway spend; it does not pre-warm instances.'
      ],
      decisiveClue: 'Eliminating cold start latency for critical production paths is the primary purpose of Provisioned Concurrency.',
      difficulty: 'intermediate',
      isOriginal: true
    },
    quickRevision: [
      'Execution timeout limit is strictly 15 minutes (900 seconds).',
      'Memory scales CPU proportionally (from 128 MB up to 10,240 MB).',
      'Global scope outside the handler is reused across warm container invocations.',
      'Provisioned Concurrency eliminates cold starts for predictable low latency.'
    ],
    sources: [
      { title: 'AWS Lambda Developer Guide', url: 'https://docs.aws.amazon.com/lambda/latest/dg/welcome.html' },
      { title: 'Lambda Concurrency', url: 'https://docs.aws.amazon.com/lambda/latest/dg/configuration-concurrency.html' }
    ],
    searchTerms: ['lambda', 'serverless', 'faas', 'event-driven', 'cold start', 'provisioned concurrency']
  },
  {
    id: 's3',
    name: 'Amazon Simple Storage Service',
    shortName: 'S3',
    category: 'storage',
    difficulty: 'beginner',
    importance: 'essential',
    icon: 'Storage',
    tagline: 'Object storage built to retrieve any amount of data from anywhere',
    mentalModel: 'An infinite global digital locker where files are stored as immutable key-value objects within regional buckets.',
    problemItSolves: 'Provides virtually limitless, highly durable storage without capacity planning or disk provisioning.',
    howItWorks: 'Stores data as objects containing keys, values, and metadata inside regionally created buckets with 99.999999999% (11 9s) durability.',
    components: [
      { name: 'Buckets', description: 'Globally unique named containers for storing objects in a specific AWS Region.' },
      { name: 'Storage Classes', description: 'Tiers optimized for access frequency: Standard, Intelligent-Tiering, Standard-IA, One Zone-IA, Glacier Flexible, and Glacier Deep Archive.' },
      { name: 'Bucket Policies', description: 'Resource-based IAM policies attached directly to buckets controlling user and public permissions.' },
      { name: 'Lifecycle Rules', description: 'Automated rules transitioning objects between storage tiers or expiring them after set retention periods.' }
    ],
    realWorldExample: 'Hosting static frontend assets (HTML, CSS, JS) combined with storing multi-terabyte data lake datasets for analytics.',
    whenToUse: [
      'Storing unstructured data like media files, backups, logs, and analytics raw data',
      'Static website hosting combined with CloudFront CDN distribution',
      'Central data lake foundation using parquet/CSV queried via Amazon Athena'
    ],
    whenNotToUse: [
      'Block storage for EC2 root operating systems or file systems requiring sub-millisecond random I/O (use EBS)',
      'Shared POSIX file system requiring file locking and append modifications (use EFS)',
      'Relational transactional data requiring ACID queries (use RDS or Aurora)'
    ],
    practicalImplementation: {
      cli: 'aws s3 mb s3://my-enterprise-data-lake-2026 --region us-east-1 && aws s3 cp ./data.csv s3://my-enterprise-data-lake-2026/'
    },
    security: 'Enable S3 Block Public Access at account level, mandate SSE-KMS or SSE-S3 encryption, and use Bucket Policies requiring TLS/HTTPS.',
    costDrivers: 'Storage volume per GB-month, API requests (PUT/GET/LIST), and outbound data transfer across regions/Internet.',
    limitations: [
      'Maximum single object size is 5 TB (multi-part upload required for objects over 100 MB)',
      'Objects are immutable; modifying a single byte requires rewriting the entire object',
      'Bucket names must be globally unique across all AWS accounts worldwide'
    ],
    commonMistakes: [
      'Leaving S3 Block Public Access disabled and exposing sensitive files to the public internet',
      'Ignoring Intelligent-Tiering for data with unknown or shifting access patterns',
      'Not enabling Object Lock or Versioning to defend against accidental deletion or ransomware'
    ],
    alternatives: [
      { service: 'ebs', reason: 'Direct attached block storage for low-latency operating system disk volumes' },
      { service: 'efs', reason: 'Shared multi-instance network file system supporting concurrent POSIX read-write' }
    ],
    relatedServices: ['cloudfront', 'athena', 'kms', 'glacier', 'iam'],
    scenarioQuestion: {
      id: 'q-s3-01',
      question: 'A financial institution must store regulatory compliance audit logs for 7 years. The logs are accessed frequently during the first 30 days, rarely thereafter, and must be immutable to prevent deletion even by the root account. Which solution meets these requirements cost-effectively?',
      type: 'single',
      options: [
        'S3 Standard with Lifecycle policy to Glacier Deep Archive after 30 days and S3 Object Lock in Compliance mode.',
        'S3 Intelligent-Tiering with S3 Versioning and MFA Delete enabled on the bucket.',
        'EBS cold HDD (sc1) snapshots retained for 7 years with an AWS Backup lifecycle rule.',
        'S3 One Zone-IA with a bucket policy denying s3:DeleteObject.'
      ],
      correctAnswers: [0],
      explanation: 'S3 Object Lock in Compliance mode prevents object deletion by any user including root until the retention period expires. Moving to Glacier Deep Archive after 30 days optimizes cost for long-term retention.',
      whyOthersWrong: [
        'MFA Delete can still be bypassed or disabled by the root account and Intelligent-Tiering costs more than Glacier Deep Archive for archival.',
        'EBS snapshots are not object storage and do not offer immutable compliance locking.',
        'One Zone-IA lacks multi-AZ durability and bucket policies can be overridden by account administrators.'
      ],
      decisiveClue: 'Immutable compliance retention that cannot be deleted even by the root account requires S3 Object Lock in Compliance mode.',
      difficulty: 'intermediate',
      isOriginal: true
    },
    quickRevision: [
      'Durability: 99.999999999% (11 9s) across minimum 3 Availability Zones.',
      'Strong read-after-write consistency for PUT and DELETE of objects.',
      'S3 Object Lock: Governance mode (can be overridden by privileged IAM) vs Compliance mode (cannot be overridden by anyone).',
      'Intelligent-Tiering automatically avoids retrieval fees while optimizing cost.'
    ],
    sources: [
      { title: 'Amazon S3 Documentation', url: 'https://docs.aws.amazon.com/s3/' },
      { title: 'S3 Storage Classes', url: 'https://aws.amazon.com/s3/storage-classes/' }
    ],
    searchTerms: ['s3', 'simple storage service', 'object storage', 'bucket', 'glacier', 'lifecycle']
  },
  {
    id: 'ebs',
    name: 'Amazon Elastic Block Store',
    shortName: 'EBS',
    category: 'storage',
    difficulty: 'beginner',
    importance: 'essential',
    icon: 'Storage',
    tagline: 'High-performance block storage volumes for Amazon EC2',
    mentalModel: 'A virtual dedicated external hard drive plugged directly into an EC2 instance over a high-speed network bus.',
    problemItSolves: 'Provides persistent, low-latency block-level storage that survives the reboot or termination of an EC2 instance.',
    howItWorks: 'Allocates network-attached block volumes within an Availability Zone that can be formatted with any filesystem (ext4, XFS, NTFS) and attached to EC2.',
    components: [
      { name: 'Volume Types', description: 'General Purpose SSD (gp3/gp2), Provisioned IOPS SSD (io2/io1), Throughput Optimized HDD (st1), and Cold HDD (sc1).' },
      { name: 'EBS Snapshots', description: 'Point-in-time incremental backups saved durably into Amazon S3.' },
      { name: 'Multi-Attach', description: 'Allows attaching a single io1/io2 volume to up to 16 Nitro instances in the same AZ.' },
      { name: 'Fast Snapshot Restore (FSR)', description: 'Eliminates volume initialization latency when creating volumes from snapshots.' }
    ],
    realWorldExample: 'Hosting the primary OS boot drive and database data files for a self-hosted PostgreSQL database on EC2.',
    whenToUse: [
      'EC2 boot drives and operating system partitions',
      'Transactional database storage requiring consistent IOPS and sub-millisecond latencies (e.g., MongoDB, Oracle)',
      'Enterprise applications requiring block-level random reads and writes'
    ],
    whenNotToUse: [
      'Files that need to be shared across hundreds of instances in different AZs simultaneously (use EFS)',
      'Static media files, video hosting, and log archiving (use S3)',
      'Temporary scratch disks where peak I/O performance is needed and data loss on stop is acceptable (use EC2 Instance Store)'
    ],
    practicalImplementation: {
      cli: 'aws ec2 create-volume --availability-zone us-east-1a --size 100 --volume-type gp3 --iops 3000 --throughput 125'
    },
    security: 'Enforce default account-level EBS encryption using AWS KMS keys. Unencrypted snapshots cannot be shared across accounts.',
    costDrivers: 'Provisioned volume capacity (GB-month), provisioned IOPS/throughput on gp3/io2, and snapshot storage in S3.',
    limitations: [
      'Standard EBS volumes are confined to a single Availability Zone (cannot cross AZs without snapshot restore)',
      'Snapshots require first-touch initialization penalty unless Fast Snapshot Restore is used',
      'Volume resize can be done online, but shrinking a volume is not natively supported'
    ],
    commonMistakes: [
      'Using legacy gp2 volumes instead of gp3, paying 20% more while having IOPS tied to storage size',
      'Forgetting that DeleteOnTermination defaults to true for root volumes and false for secondary volumes',
      'Failing to automate snapshot lifecycles using Amazon Data Lifecycle Manager (DLM)'
    ],
    alternatives: [
      { service: 'efs', reason: 'Shared multi-AZ network filesystem accessible concurrently by multiple instances' },
      { service: 's3', reason: 'Cost-effective object storage accessible globally via HTTP REST APIs' },
      { service: 'fsx', reason: 'Fully managed third-party file systems like Lustre, NetApp ONTAP, or Windows File Server' }
    ],
    relatedServices: ['ec2', 'kms', 's3', 'dlm'],
    scenarioQuestion: {
      id: 'q-ebs-01',
      question: 'A database administrator notices that an EC2 instance running a reporting engine on a gp2 volume suffers from I/O throttling during peak reporting hours. The storage volume is 100 GB. How should the team resolve the bottleneck most cost-effectively without expanding volume size?',
      type: 'single',
      options: [
        'Switch the volume type to gp3 and provision higher IOPS and throughput independently.',
        'Increase the gp2 volume size to 1,000 GB to receive 3,000 baseline IOPS.',
        'Convert the volume to Provisioned IOPS SSD io2 Block Express with 10,000 IOPS.',
        'Attach an EC2 Instance Store volume and mirror the database using RAID 0.'
      ],
      correctAnswers: [0],
      explanation: 'gp3 volumes provide 3,000 IOPS and 125 MB/s baseline throughput for free at 20% lower storage cost, allowing independent scaling of IOPS and throughput without sizing up the volume.',
      whyOthersWrong: [
        'Increasing gp2 size to 1,000 GB increases storage cost tenfold unnecessarily.',
        'io2 Block Express is intended for mission-critical sub-millisecond workloads and is significantly more expensive.',
        'Instance Store is ephemeral; restarting the instance will result in total data loss.'
      ],
      decisiveClue: 'Separating IOPS provisioning from storage volume size cost-effectively points directly to gp3.',
      difficulty: 'intermediate',
      isOriginal: true
    },
    quickRevision: [
      'gp3 baseline: 3,000 IOPS and 125 MB/s throughput included with any volume size.',
      'io2 Block Express offers 99.999% durability and up to 256,000 IOPS.',
      'EBS volumes are tied to a single Availability Zone.',
      'Snapshots are incremental and saved to Amazon S3.'
    ],
    sources: [
      { title: 'Amazon EBS Volume Types', url: 'https://docs.aws.amazon.com/ebs/latest/userguide/ebs-volume-types.html' },
      { title: 'EBS Encryption', url: 'https://docs.aws.amazon.com/ebs/latest/userguide/ebs-encryption.html' }
    ],
    searchTerms: ['ebs', 'block store', 'gp3', 'io2', 'snapshots', 'disk volume']
  },
  {
    id: 'efs',
    name: 'Amazon Elastic File System',
    shortName: 'EFS',
    category: 'storage',
    difficulty: 'intermediate',
    importance: 'important',
    icon: 'Storage',
    tagline: 'Serverless, fully elastic NFS file storage for AWS cloud and on-premises',
    mentalModel: 'A shared network folder (NAS) that grows and shrinks automatically and can be mounted by thousands of servers concurrently.',
    problemItSolves: 'Enables multiple EC2 instances, containers, or Lambda functions across multiple AZs to share access to the same POSIX-compliant filesystem.',
    howItWorks: 'Provides a managed NFSv4 filesystem with mount targets in each Availability Zone, distributing files automatically across multiple AZs for high availability.',
    components: [
      { name: 'Mount Targets', description: 'Network endpoints placed in specific VPC subnets allowing EC2/containers to mount the NFS share.' },
      { name: 'Storage Classes', description: 'Standard, Infrequent Access (IA), and Archive tiers with automated lifecycle management.' },
      { name: 'Throughput Modes', description: 'Elastic mode (automatically scales with workload) and Provisioned mode (guaranteed throughput).' },
      { name: 'Performance Modes', description: 'General Purpose (default, low latency) and Max I/O (scales to massive concurrent operations).' }
    ],
    realWorldExample: 'A fleet of WordPress web servers running behind an ALB sharing the `/wp-content/uploads` directory across three Availability Zones.',
    whenToUse: [
      'Workloads requiring POSIX filesystem semantics shared across multiple compute instances',
      'Content management systems (WordPress, Drupal) and home directories',
      'Shared persistent storage across AWS Lambda functions or ECS/EKS container tasks'
    ],
    whenNotToUse: [
      'High-performance Windows workloads requiring SMB (use Amazon FSx for Windows File Server)',
      'Sub-millisecond high-performance compute requiring Lustre file systems (use FSx for Lustre)',
      'Single instance block storage requiring raw I/O performance (use EBS)'
    ],
    practicalImplementation: {
      cli: 'aws efs create-file-system --performance-mode generalPurpose --throughput-mode elastic --encrypted --region us-east-1'
    },
    security: 'Support for POSIX permissions, IAM authorization for NFS clients, and encryption in transit using TLS.',
    costDrivers: 'Stored data volume per GB-month, infrequent access tier requests, and provisioned throughput (if Elastic is not used).',
    limitations: [
      'Only supports Linux/Unix operating systems via NFSv4 (does not natively support Windows SMB)',
      'Higher latency than local EBS volumes due to network NFS overhead',
      'Can become expensive if lifecycle management to IA/Archive is not configured'
    ],
    commonMistakes: [
      'Using Max I/O performance mode when General Purpose provides much lower per-operation latency',
      'Forgetting to configure mount target security groups to allow inbound port 2049 from client instances',
      'Overpaying by not enabling EFS Lifecycle Management to tier cold files to Infrequent Access'
    ],
    alternatives: [
      { service: 'ebs', reason: 'Lower latency single-instance block storage' },
      { service: 'fsx', reason: 'Optimized for Windows SMB, Lustre, or NetApp ONTAP features' },
      { service: 's3', reason: 'Much cheaper object storage accessible via REST API when POSIX is not required' }
    ],
    relatedServices: ['ec2', 'lambda', 'ecs', 'backup'],
    scenarioQuestion: {
      id: 'q-efs-01',
      question: 'A web application hosted across EC2 instances in 3 Availability Zones requires shared access to uploaded media files. The filesystem must support POSIX locks, automatic capacity scaling, and multi-AZ resilience. Which storage service satisfies these requirements?',
      type: 'single',
      options: [
        'Amazon EFS with mount targets in each Availability Zone.',
        'Amazon EBS gp3 volume with Multi-Attach enabled across Availability Zones.',
        'Amazon S3 mounted to instances via S3 File Gateway in each AZ.',
        'Amazon FSx for Lustre configured in scratch mode.'
      ],
      correctAnswers: [0],
      explanation: 'Amazon EFS provides a serverless, multi-AZ POSIX-compliant network file system that supports concurrent reads and writes across multiple AZs natively.',
      whyOthersWrong: [
        'EBS Multi-Attach only works across instances in the exact same Availability Zone and requires cluster-aware filesystems.',
        'S3 File Gateway is intended for hybrid on-premises caching, not native multi-AZ EC2 POSIX mounting.',
        'FSx for Lustre scratch mode is non-replicated temporary HPC storage, not general-purpose web storage.'
      ],
      decisiveClue: 'Shared POSIX filesystem across multiple Availability Zones points directly to Amazon EFS.',
      difficulty: 'intermediate',
      isOriginal: true
    },
    quickRevision: [
      'Standard storage class replicates data across minimum 3 Availability Zones.',
      'Supports NFSv4.0 and NFSv4.1 over TCP port 2049.',
      'Elastic throughput mode dynamically scales throughput to match workload demands.',
      'Seamless integration with AWS Lambda and Amazon ECS/EKS.'
    ],
    sources: [
      { title: 'Amazon EFS User Guide', url: 'https://docs.aws.amazon.com/efs/latest/ug/whatisefs.html' },
      { title: 'EFS Storage Classes', url: 'https://aws.amazon.com/efs/features/storage-classes/' }
    ],
    searchTerms: ['efs', 'nfs', 'shared filesystem', 'posix', 'mount target', 'elastic file system']
  },
  {
    id: 'elb',
    name: 'Elastic Load Balancing',
    shortName: 'ELB / ALB',
    category: 'networking',
    difficulty: 'intermediate',
    importance: 'essential',
    icon: 'Networking',
    tagline: 'Distribute incoming traffic automatically across multiple targets and AZs',
    mentalModel: 'A high-capacity traffic police dispatcher directing incoming web and TCP requests to healthy backend servers.',
    problemItSolves: 'Prevents single-point-of-failure bottlenecks and ensures high availability by routing traffic away from failed instances.',
    howItWorks: 'Accepts incoming traffic through listener ports, applies routing rules (path, host, headers), and distributes requests to registered healthy targets.',
    components: [
      { name: 'Application Load Balancer (ALB)', description: 'Layer 7 load balancer supporting HTTP/HTTPS, WebSockets, path/host routing, and TLS termination.' },
      { name: 'Network Load Balancer (NLB)', description: 'Layer 4 load balancer handling millions of requests per second with ultra-low latency and static IP addresses.' },
      { name: 'Gateway Load Balancer (GWLB)', description: 'Distributes traffic to fleets of third-party virtual security appliances (firewalls, IDS/IPS).' },
      { name: 'Target Groups', description: 'Logical groupings of targets (EC2, ECS, Lambda, IP addresses) that receive traffic based on health check statuses.' }
    ],
    realWorldExample: 'Routing `/api/*` traffic to containerized microservices and `/*` to EC2 frontend instances with automatic SSL offloading.',
    whenToUse: [
      'Distributing HTTP/HTTPS traffic using Layer 7 path/host-based routing (ALB)',
      'Extreme TCP/UDP performance, ultra-low latency, or requiring static Elastic IPs (NLB)',
      'Scaling and managing transparent third-party inline firewall fleets (GWLB)'
    ],
    whenNotToUse: [
      'Global traffic routing across multiple distinct AWS regions (use AWS Global Accelerator or Route 53)',
      'Routing to a single EC2 instance without need for SSL termination or failover',
      'Simple static websites hosted on S3 (use CloudFront)'
    ],
    practicalImplementation: {
      cli: 'aws elbv2 create-load-balancer --name production-alb --subnets subnet-12345 subnet-67890 --security-groups sg-web --scheme internet-facing --type application'
    },
    security: 'Terminates SSL/TLS certificates via AWS Certificate Manager (ACM). Integrate with AWS WAF to block SQL injection and cross-site scripting.',
    costDrivers: 'Load balancer operating hours and Load Balancer Capacity Units (LCU) based on connections, bandwidth, and rule evaluations.',
    limitations: [
      'ALB IP addresses change dynamically; cannot assign static IPs directly (use NLB in front if static IP is needed)',
      'ALB connection timeout defaults to 60 seconds (must be adjusted for long-polling or file uploads)',
      'Cross-zone load balancing is enabled by default on ALB, but disabled by default on NLB'
    ],
    commonMistakes: [
      'Target security group not permitting ingress traffic from the ALB security group',
      'Misconfiguring target group health check paths causing ALB to mark all instances unhealthy (HTTP 502/504)',
      'Choosing Classic Load Balancer (CLB) instead of modern ALB/NLB for new cloud architectures'
    ],
    alternatives: [
      { service: 'global-accelerator', reason: 'Global anycast IP routing directly to multi-region targets with zero DNS caching delay' },
      { service: 'cloudfront', reason: 'Edge caching CDN providing lower latency for global content distribution' },
      { service: 'route53', reason: 'DNS-level weighted or failover routing across independent regions' }
    ],
    relatedServices: ['ec2', 'ecs', 'waf', 'acm', 'route53'],
    scenarioQuestion: {
      id: 'q-elb-01',
      question: 'A financial trading platform requires handling millions of concurrent TCP requests per second with microsecond latencies. The clients also require whitelisting a fixed static IP address. Which load balancer must be deployed?',
      type: 'single',
      options: [
        'Network Load Balancer (NLB) with an Elastic IP assigned per Availability Zone.',
        'Application Load Balancer (ALB) configured with cross-zone load balancing.',
        'Classic Load Balancer (CLB) attached to an Internet Gateway.',
        'Gateway Load Balancer (GWLB) with transparent proxy mode.'
      ],
      correctAnswers: [0],
      explanation: 'Network Load Balancer operates at Layer 4, provides ultra-low latency, handles millions of requests per second, and supports static Elastic IPs per AZ.',
      whyOthersWrong: [
        'Application Load Balancers operate at Layer 7 and do not support static Elastic IP addresses directly.',
        'Classic Load Balancer is legacy, operates slower, and does not provide static IPs.',
        'Gateway Load Balancer is designed for inline security virtual appliances, not direct TCP client load balancing.'
      ],
      decisiveClue: 'Millions of TCP requests, ultra-low latency, and fixed static IPs indicate Network Load Balancer (NLB).',
      difficulty: 'intermediate',
      isOriginal: true
    },
    quickRevision: [
      'ALB = Layer 7 (HTTP/HTTPS, WebSocket, path/host routing, AWS WAF integration).',
      'NLB = Layer 4 (TCP/UDP/TLS, millions of req/sec, ultra-low latency, static Elastic IPs).',
      'GWLB = Layer 3/4 transparent inspection for third-party security appliances via GENEVE protocol.',
      'Health checks dictate routing: unhealthy targets are removed immediately from rotation.'
    ],
    sources: [
      { title: 'Elastic Load Balancing Documentation', url: 'https://docs.aws.amazon.com/elasticloadbalancing/' },
      { title: 'ALB vs NLB Comparison', url: 'https://aws.amazon.com/elasticloadbalancing/features/' }
    ],
    searchTerms: ['elb', 'alb', 'nlb', 'gwlb', 'load balancer', 'target group']
  },
  {
    id: 'elastic-beanstalk',
    name: 'AWS Elastic Beanstalk',
    shortName: 'Beanstalk',
    category: 'compute',
    difficulty: 'intermediate',
    importance: 'supporting',
    icon: 'Compute',
    tagline: 'Platform as a Service (PaaS) to deploy and scale web applications rapidly',
    mentalModel: 'An automated deployment coordinator that takes your application code and automatically provisions the EC2, ALB, and Auto Scaling underneath.',
    problemItSolves: 'Allows developers to deploy applications without having to manually learn, architect, and wire up underlying infrastructure.',
    howItWorks: 'Developers upload application source bundles (Java, .NET, Node.js, Python, PHP, Docker); Beanstalk provisions and configures OS, runtime, web server, and load balancing.',
    components: [
      { name: 'Application', description: 'Logical collection of Elastic Beanstalk components including environments, versions, and configurations.' },
      { name: 'Environment', description: 'A running deployment containing provisioned AWS resources (Web Server tier or Worker tier).' },
      { name: 'Application Version', description: 'Specific labeled iteration of deployable code stored in Amazon S3.' },
      { name: '.ebextensions', description: 'Configuration YAML/JSON files inside source code to customize server software and environment resources.' }
    ],
    realWorldExample: 'A startup launching a Node.js web application with PostgreSQL backend within 30 minutes without a dedicated DevOps team.',
    whenToUse: [
      'Quickly deploying web applications without deep knowledge of AWS infrastructure orchestration',
      'Retaining full control over underlying EC2 instances while enjoying PaaS automation',
      'Educational environments and prototyping rapid MVPs'
    ],
    whenNotToUse: [
      'Container-first modern cloud-native architectures (use Amazon ECS or AWS App Runner)',
      'Complex multi-service microservice meshes with granular network topologies (use EKS or ECS)',
      'Serverless microservices architectures (use AWS Lambda and API Gateway)'
    ],
    practicalImplementation: {
      cli: 'eb init -p node.js my-app --region us-east-1 && eb create my-app-prod --tier webserver'
    },
    security: 'Inherits underlying EC2 and IAM security capabilities. Supports VPC isolation, HTTPS termination via ACM, and environment variables stored securely.',
    costDrivers: 'No additional charge for Elastic Beanstalk itself; you pay only for underlying EC2, ALB, and S3 resources created.',
    limitations: [
      'Platform updates and major stack upgrades can be cumbersome and cause drift',
      'Less flexible than dedicated Infrastructure as Code tools like Terraform or AWS CDK',
      'Slower deployments compared to containerized orchestration'
    ],
    commonMistakes: [
      'Creating production databases inside the Beanstalk environment lifecycle (terminating the environment deletes the DB)',
      'Ignoring deployment policies (using All-at-Once in production instead of Rolling or Immutable)',
      'Modifying EC2 resources manually in the AWS console leading to configuration drift'
    ],
    alternatives: [
      { service: 'app-runner', reason: 'Modern, fully managed container-based PaaS without underlying EC2 management' },
      { service: 'ecs', reason: 'Production container orchestration with finer control' },
      { service: 'amplify', reason: 'Turnkey fullstack framework tailored for frontend web and mobile developers' }
    ],
    relatedServices: ['ec2', 'elb', 'auto-scaling', 's3', 'rds'],
    scenarioQuestion: {
      id: 'q-beanstalk-01',
      question: 'A development team deploys a mission-critical web application on AWS Elastic Beanstalk. Deployments must guarantee zero downtime and verify new versions against healthy instances before redirecting traffic, while preserving existing capacity during deployment. Which deployment policy should be selected?',
      type: 'single',
      options: [
        'Immutable deployment',
        'All at once',
        'Rolling',
        'In place'
      ],
      correctAnswers: [0],
      explanation: 'Immutable deployments launch a full temporary Auto Scaling group with the new version, perform health checks, and swap traffic only when verified healthy, ensuring zero downtime and quick rollback.',
      whyOthersWrong: [
        'All at once causes complete downtime as all instances are updated simultaneously.',
        'Rolling reduces total available capacity during the update unless configured with additional batches.',
        'In place is not an Elastic Beanstalk deployment policy option (it is a CodeDeploy term).'
      ],
      decisiveClue: 'Zero downtime with full capacity preservation and testing on brand-new instances before cutover specifies Immutable deployment.',
      difficulty: 'intermediate',
      isOriginal: true
    },
    quickRevision: [
      'Beanstalk has zero extra fee; charges derive strictly from underlying provisioned AWS resources.',
      'Two environment tiers: Web Server tier (ALB + EC2) and Worker tier (SQS daemon + EC2).',
      'Never couple RDS lifecycle to Elastic Beanstalk in production environments.',
      'Deployment policies: All at Once, Rolling, Rolling with additional batch, Immutable, Traffic Splitting.'
    ],
    sources: [
      { title: 'AWS Elastic Beanstalk Developer Guide', url: 'https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/Welcome.html' },
      { title: 'Elastic Beanstalk Deployment Policies', url: 'https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/using-features.rolling-version-deploy.html' }
    ],
    searchTerms: ['elastic beanstalk', 'beanstalk', 'paas', 'ebextensions', 'eb cli']
  },
  {
    id: 'auto-scaling',
    name: 'EC2 Auto Scaling',
    shortName: 'Auto Scaling',
    category: 'compute',
    difficulty: 'intermediate',
    importance: 'essential',
    icon: 'Compute',
    tagline: 'Automatically adjust compute capacity to maintain steady, predictable performance at the lowest possible cost',
    mentalModel: 'An automated fleet manager that adds more cars when passenger lines grow long and parks cars when demand drops.',
    problemItSolves: 'Prevents under-provisioned performance degradation during traffic spikes and eliminates over-provisioned waste during quiet hours.',
    howItWorks: 'Monitors instance health and metrics (like CPU or request count) to launch or terminate EC2 instances based on minimum, maximum, and desired capacity bounds.',
    components: [
      { name: 'Auto Scaling Group (ASG)', description: 'Logical group of EC2 instances sharing identical configuration and scaling policies.' },
      { name: 'Launch Template', description: 'Specification containing AMI, instance type, key pair, security groups, and user data scripts.' },
      { name: 'Scaling Policies', description: 'Target tracking (e.g. keep CPU at 60%), Step scaling, Simple scaling, or Scheduled scaling.' },
      { name: 'Warm Pools', description: 'Pool of pre-initialized stopped instances ready to quickly serve traffic without cold boot delay.' }
    ],
    realWorldExample: 'Scaling an e-commerce platform from 10 instances to 80 instances during Black Friday based on ALB Target Response Time.',
    whenToUse: [
      'Maintaining high availability by automatically replacing unhealthy EC2 instances',
      'Dynamic workloads with variable daily, weekly, or seasonal traffic patterns',
      'Cost-optimizing compute by mixing Spot Instances and On-Demand instances in a single group'
    ],
    whenNotToUse: [
      'Single-node stateful applications that cannot run clustered or scale horizontally',
      'Serverless architectures where AWS Lambda manages horizontal concurrency natively',
      'Long-running batch jobs requiring fixed uninterrupted compute without interruption risk'
    ],
    practicalImplementation: {
      cli: 'aws autoscaling create-auto-scaling-group --auto-scaling-group-name web-asg --launch-template LaunchTemplateId=lt-0123456789abcdef0,Version=1 --min-size 2 --max-size 10 --desired-capacity 4 --vpc-zone-identifier "subnet-1a,subnet-1b"'
    },
    security: 'Use Launch Templates with IAM instance profiles. Ensure Auto Scaling service-linked roles have permissions to launch instances and attach ENIs.',
    costDrivers: 'Cost of running EC2 instances and attached EBS volumes in the group; the Auto Scaling service itself is free.',
    limitations: [
      'Instance launch takes minutes due to OS boot and initialization scripts',
      'Scale-in policies can accidentally terminate instances processing active jobs unless scale-in protection is configured',
      'Default cool down periods must be tuned to prevent thrashing and over-scaling'
    ],
    commonMistakes: [
      'Using legacy Launch Configurations instead of Launch Templates (Launch Configurations are deprecated)',
      'Configuring ASG across a single subnet/AZ instead of spanning multiple AZs for high availability',
      'Failing to enable ALB health checks on the ASG, meaning instances failing HTTP checks are not replaced'
    ],
    alternatives: [
      { service: 'fargate', reason: 'Serverless container scaling without managing EC2 Launch Templates' },
      { service: 'lambda', reason: 'Instant horizontal concurrency scaling in milliseconds' },
      { service: 'karpenter', reason: 'High-performance open-source Kubernetes cluster autoscaler for EKS' }
    ],
    relatedServices: ['ec2', 'elb', 'cloudwatch', 'launch-template'],
    scenarioQuestion: {
      id: 'q-asg-01',
      question: 'An Auto Scaling group attached to an Application Load Balancer reports that instances with crashed web server processes continue running because EC2 status checks show healthy. How can the administrator ensure failed web servers are automatically replaced by ASG?',
      type: 'single',
      options: [
        'Change the ASG health check type from EC2 to ELB and configure an appropriate health check grace period.',
        'Increase the CloudWatch CPU utilization alarm threshold to 90%.',
        'Create a Lambda function to restart crashed instances every 60 seconds.',
        'Enable default scale-in protection on all newly launched EC2 instances.'
      ],
      correctAnswers: [0],
      explanation: 'By default, ASG only evaluates EC2 hypervisor status checks. Switching the health check type to ELB ensures that when an instance fails the ALB target health check, ASG marks it unhealthy and replaces it.',
      whyOthersWrong: [
        'CPU alarms do not detect crashed web server processes running at 0% CPU.',
        'Writing custom polling Lambda functions adds unnecessary operational complexity when native ELB checks exist.',
        'Scale-in protection prevents termination during scale-in events; it does not replace unhealthy instances.'
      ],
      decisiveClue: 'Recognizing that ASG requires the ELB health check type to react to ALB application layer failures.',
      difficulty: 'intermediate',
      isOriginal: true
    },
    quickRevision: [
      'Launch Templates are required; Launch Configurations are deprecated.',
      'Always distribute ASG subnets across multiple AZs for high availability.',
      'Target Tracking scaling policies are recommended for most metrics (maintains target metric value).',
      'Instance Refresh allows rolling updates of AMIs with zero downtime.'
    ],
    sources: [
      { title: 'Amazon EC2 Auto Scaling User Guide', url: 'https://docs.aws.amazon.com/autoscaling/ec2/userguide/what-is-amazon-ec2-auto-scaling.html' },
      { title: 'ASG Health Checks', url: 'https://docs.aws.amazon.com/autoscaling/ec2/userguide/as-add-elb-healthcheck.html' }
    ],
    searchTerms: ['auto scaling', 'asg', 'launch template', 'target tracking', 'elasticity']
  }
];
