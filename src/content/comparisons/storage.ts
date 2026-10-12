import { Comparison } from '../../types';

export const storageComparisons: Comparison[] = [
  {
    id: 's3-vs-ebs',
    title: 'S3 vs EBS',
    category: 'Storage',
    serviceA: 'Amazon S3',
    serviceB: 'Amazon EBS',
    problem: 'Choosing between distributed object storage and low-latency block storage for cloud application persistence.',
    decisiveDifferences: [
      'Storage Architecture: S3 provides flat object storage accessible via HTTP/HTTPS REST APIs from anywhere on the internet; EBS provides raw block-level volumes formatted with a filesystem (ext4, NTFS) and attached directly to an EC2 instance.',
      'Access Method: S3 stores objects up to 5 TB with key-value metadata and does not support partial in-place byte updates (requires full overwrite); EBS allows random-access, high-IOPS, in-place byte-level reads and writes.',
      'Availability & Scope: S3 is a regional service automatically replicated across a minimum of 3 Availability Zones with 99.999999999% (11 9s) durability; EBS is bound to a single Availability Zone and attaches to an EC2 instance in that same AZ.',
      'Scalability: S3 scales virtually infinitely in storage capacity without provisioning; EBS volumes must be provisioned with a specific capacity (e.g., 500 GB) and IOPS rating, though volumes can be expanded dynamically.'
    ],
    whenToChooseA: [
      'Storing static web assets, user media uploads, document archives, data lake datasets, and system backups.',
      'Direct web distribution to users globally or streaming via Amazon CloudFront CDN.',
      'Massive scale data lakes queried by serverless tools like Amazon Athena or AWS Glue.'
    ],
    whenToChooseB: [
      'Operating system root drives and boot volumes for EC2 instances.',
      'Transactional databases (PostgreSQL, MySQL, SQL Server, MongoDB) requiring low sub-millisecond disk latency and random read/write IOPS.',
      'Enterprise applications requiring standard POSIX block storage filesystem semantics.'
    ],
    workTogether: 'An EC2-hosted application uses high-performance EBS gp3 volumes for its local operating system and temporary scratch disk, while persisting long-term user attachments, database dumps, and historical logs into Amazon S3.',
    tradeoffs: [
      {
        dimension: 'Storage Protocol',
        optionA: 'REST API (HTTP/HTTPS GET, PUT, DELETE).',
        optionB: 'Block device bus protocol (NVMe / SCSI block storage).'
      },
      {
        dimension: 'Durability Scope',
        optionA: 'Regional (replicated across >= 3 AZs; 11 9s durability).',
        optionB: 'Zonal (replicated within a single AZ; 99.8% - 99.9% durability).'
      },
      {
        dimension: 'Latency Profile',
        optionA: 'Tens to hundreds of milliseconds for first-byte delivery.',
        optionB: 'Sub-millisecond to single-digit millisecond latency.'
      },
      {
        dimension: 'File Modification',
        optionA: 'Atomic overwrite; partial byte updates are not supported.',
        optionB: 'Direct random byte read/write in place.'
      }
    ],
    scenario: 'An image processing service boots from a 50 GB gp3 EBS volume where its processing binaries and temp swap files live. Users upload raw photos directly to an S3 bucket via presigned URLs, where the service reads, resizes, and writes thumbnail objects back to S3.',
    question: {
      id: 'quiz-s3-vs-ebs-1',
      question: 'A database administrator needs to install and configure an unmanaged Oracle Database on an Amazon EC2 instance. The database requires random read/write access with consistent sub-millisecond latency and in-place block updates. Which storage service should be chosen?',
      type: 'single',
      options: [
        'Amazon S3 Standard',
        'Amazon EBS io2 Block Express',
        'Amazon S3 Glacier Flexible Retrieval',
        'AWS Storage Gateway Volume Gateway'
      ],
      correctAnswers: [1],
      explanation: 'Amazon EBS provides block-level storage directly attached to EC2 instances, supporting random in-place updates and high IOPS with sub-millisecond latencies required by relational database engines like Oracle.',
      whyOthersWrong: [
        'Amazon S3 is object storage accessed via REST APIs and does not support mounting as a raw block storage device for direct database tablespace files.',
        'S3 Glacier is designed for cold archival storage with retrieval times ranging from minutes to hours.',
        'Storage Gateway Volume Gateway is for hybrid on-premises caching, not primary low-latency EC2 database block storage.'
      ],
      decisiveClue: 'Random read/write access with sub-millisecond latency and in-place block updates for an Oracle DB on EC2.',
      difficulty: 'beginner',
      isOriginal: true,
      source: 'Original AWS certification-style practice question'
    },
    sources: [
      { title: 'Amazon S3 Documentation', url: 'https://docs.aws.amazon.com/s3/' },
      { title: 'Amazon EBS Documentation', url: 'https://docs.aws.amazon.com/ebs/' }
    ]
  },
  {
    id: 'ebs-vs-efs',
    title: 'EBS vs EFS',
    category: 'Storage',
    serviceA: 'Amazon EBS',
    serviceB: 'Amazon EFS',
    problem: 'Selecting between block-level instance storage and a shared distributed Network File System for Linux workloads.',
    decisiveDifferences: [
      'Attachment Topology: Standard EBS volumes attach to a single EC2 instance within one AZ (EBS Multi-Attach io1/io2 allows up to 16 instances in the same AZ); EFS is a shared NFS file system that can be mounted concurrently by thousands of EC2 instances, ECS/EKS tasks, and Lambda functions across multiple AZs.',
      'Storage Type & Hierarchy: EBS is raw block storage requiring OS formatting into a file system; EFS is a managed POSIX-compliant distributed network file system (NFSv4.1).',
      'Cost & Elasticity: EBS requires pre-provisioning storage volume size (e.g., pay for 200 GB whether filled or empty); EFS is fully elastic, automatically expanding and shrinking as files are added or deleted, charging only for stored gigabytes.',
      'Performance Characteristics: EBS delivers predictable sub-millisecond latency for single-instance I/O; EFS has slightly higher baseline latency (low single-digit milliseconds) due to distributed cross-AZ replication, but offers high aggregate throughput across many concurrent clients.'
    ],
    whenToChooseA: [
      'EC2 boot volumes and operating system root filesystems.',
      'Standalone transactional database storage (PostgreSQL, MySQL, SQL Server) requiring minimal latency.',
      'Workloads where single-instance disk throughput and IOPS tuning are critical.'
    ],
    whenToChooseB: [
      'Shared content repositories like WordPress wp-content directories, home directories, and shared build artifacts.',
      'Containerized tasks (ECS/EKS) or Lambda functions in multiple AZs that need read/write access to a shared persistent directory.',
      'Big data and parallel processing jobs where hundreds of worker instances ingest and process files from a shared POSIX filesystem.'
    ],
    workTogether: 'An Auto Scaling group of web instances runs Linux OS and application code from local EBS root volumes while mounting a shared Amazon EFS filesystem at `/var/www/shared/uploads` to store user-submitted files accessible to all web servers simultaneously.',
    tradeoffs: [
      {
        dimension: 'Multi-Instance Concurrency',
        optionA: 'Single instance (or up to 16 in same AZ with io1/io2 Multi-Attach cluster filesystems).',
        optionB: 'Thousands of instances/containers across multiple AZs concurrently.'
      },
      {
        dimension: 'Capacity Management',
        optionA: 'Fixed provisioned volume size; must manually resize or use volume expansion.',
        optionB: 'Fully elastic; grows and shrinks automatically without pre-provisioning.'
      },
      {
        dimension: 'Latency',
        optionA: 'Sub-millisecond latency directly attached over Nitro/NVMe.',
        optionB: 'Low single-digit millisecond latency over local network NFS protocol.'
      }
    ],
    scenario: 'A content management system runs behind an Application Load Balancer with an Auto Scaling Group across three Availability Zones. Each EC2 instance mounts a central Amazon EFS filesystem so that any media file uploaded through one instance is immediately readable by all other instances.',
    question: {
      id: 'quiz-ebs-vs-efs-1',
      question: 'A fleet of 50 EC2 instances distributed across 3 Availability Zones in an Auto Scaling group needs concurrent read and write access to a shared Linux directory with POSIX file permissions. The storage capacity must grow automatically as new files arrive. Which storage solution should be implemented?',
      type: 'single',
      options: [
        'Amazon EBS gp3 volume with Multi-Attach enabled',
        'Amazon Elastic File System (Amazon EFS)',
        'Amazon S3 mounted via S3FS fuse driver',
        'Amazon EBS io2 volume formatted with ext4'
      ],
      correctAnswers: [1],
      explanation: 'Amazon EFS provides a serverless, fully elastic POSIX-compliant network file system that supports thousands of concurrent connections across multiple Availability Zones simultaneously.',
      whyOthersWrong: [
        'EBS Multi-Attach only works within a single Availability Zone, does not span across 3 AZs, and only supports up to 16 instances with cluster-aware file systems.',
        'S3 is not a true POSIX filesystem; using S3FS fuse driver lacks POSIX locking fidelity, has poor performance, and is not an AWS-recommended enterprise solution for shared concurrent file systems.',
        'Standard EBS io2 volumes attach to one instance in one AZ.'
      ],
      decisiveClue: '50 EC2 instances across 3 AZs needing concurrent POSIX read/write access with automatic capacity growth.',
      difficulty: 'intermediate',
      isOriginal: true,
      source: 'Original AWS certification-style practice question'
    },
    sources: [
      { title: 'Amazon EFS User Guide', url: 'https://docs.aws.amazon.com/efs/latest/ug/whatisefs.html' },
      { title: 'Amazon EBS Features', url: 'https://aws.amazon.com/ebs/features/' }
    ]
  },
  {
    id: 'efs-vs-s3',
    title: 'EFS vs S3',
    category: 'Storage',
    serviceA: 'Amazon EFS',
    serviceB: 'Amazon S3',
    problem: 'Determining when to use a shared POSIX network file system versus distributed HTTP object storage for application data.',
    decisiveDifferences: [
      'Protocol & Access: EFS is mounted as a native Linux network filesystem using NFSv4 protocol with standard POSIX commands (fopen, read, write, flock); S3 is accessed via HTTP/REST APIs (GET, PUT, DELETE, presigned URLs) or the AWS SDK.',
      'File Modification: EFS allows in-place file editing, append operations, and byte-range locking; S3 requires uploading entire new object versions for any byte change.',
      'Pricing: EFS Standard storage costs approximately $0.30/GB-month (though Lifecycle management to Infrequent Access lowers this); S3 Standard costs approximately $0.023/GB-month (an order of magnitude cheaper).',
      'Client Integration: EFS requires network connectivity from a VPC (or Direct Connect/VPN) and NFS client support; S3 can be accessed globally from any client with internet access and IAM/presigned authorization.'
    ],
    whenToChooseA: [
      'Existing legacy or off-the-shelf Linux applications expecting standard file system hierarchies and file locks without code modifications.',
      'Serverless Lambda functions or container tasks that need to read and append small configuration files or shared SQLite/ML model files from a local mount point.',
      'Collaborative development environments (JupyterHub, persistent user Linux home directories).'
    ],
    whenToChooseB: [
      'Web applications storing images, videos, documents, and backups directly downloadable by end users.',
      'Cost-sensitive architectures storing petabytes of unstructured files and big data analytics datasets.',
      'Globally distributed systems that require direct integration with CDN caching (CloudFront).'
    ],
    workTogether: 'An analytics pipeline ingests live log files and data chunks onto an Amazon EFS mount where real-time Linux worker tools append and parse records; once finalized, daily batches are compressed and archived into Amazon S3 for cost-effective long-term retention.',
    tradeoffs: [
      {
        dimension: 'Interface Protocol',
        optionA: 'POSIX / NFSv4 filesystem mount.',
        optionB: 'REST API (HTTP/HTTPS) and AWS SDK.'
      },
      {
        dimension: 'Cost per Stored Gigabyte',
        optionA: 'Higher (~$0.30/GB-month for Standard tier).',
        optionB: 'Significantly lower (~$0.023/GB-month for Standard tier).'
      },
      {
        dimension: 'Public Internet Accessibility',
        optionA: 'No; requires VPC attachment and private networking.',
        optionB: 'Yes; public endpoints accessible with HTTPS and signed URLs.'
      }
    ],
    scenario: 'A legacy enterprise document management system running on Linux expects files to be saved to `/mnt/shared-docs/` using POSIX file locks. Rather than rewriting the proprietary application to use the S3 SDK, the infrastructure team mounts Amazon EFS.',
    question: {
      id: 'quiz-efs-vs-s3-1',
      question: 'A media company has 500 TB of raw user video uploads that will be served directly to mobile and web browsers through Amazon CloudFront. The company wants to minimize storage costs and avoid managing filesystem mounts. Which storage service is the ideal target?',
      type: 'single',
      options: [
        'Amazon EFS One Zone',
        'Amazon S3 Standard',
        'Amazon EBS sc1 Cold HDD',
        'Amazon FSx for Lustre'
      ],
      correctAnswers: [1],
      explanation: 'Amazon S3 is an object store that natively integrates with Amazon CloudFront as an origin, provides the lowest unit storage cost for unstructured web assets, and eliminates the need for OS-level filesystem mounting.',
      whyOthersWrong: [
        'Amazon EFS is much more expensive per GB than S3 and cannot be directly targeted as an HTTP origin by CloudFront without custom compute proxies.',
        'EBS sc1 volumes are block storage attached to single EC2 instances, not direct CloudFront origins.',
        'FSx for Lustre is a high-performance compute filesystem for HPC/ML, not a cost-effective origin for general web streaming.'
      ],
      decisiveClue: '500 TB of video served directly via CloudFront, minimizing storage costs without filesystem mounts.',
      difficulty: 'beginner',
      isOriginal: true,
      source: 'Original AWS certification-style practice question'
    },
    sources: [
      { title: 'Amazon EFS Product Details', url: 'https://aws.amazon.com/efs/' },
      { title: 'Amazon S3 Architecture Best Practices', url: 'https://docs.aws.amazon.com/s3/latest/userguide/optimizing-performance.html' }
    ]
  },
  {
    id: 's3-storage-classes',
    title: 'S3 Storage Classes',
    category: 'Storage',
    serviceA: 'S3 Standard',
    serviceB: 'S3 Glacier / Infrequent Access',
    problem: 'Balancing retrieval latency, minimum retention durations, and per-gigabyte storage costs across the lifecycle of object data.',
    decisiveDifferences: [
      'Access Latency: S3 Standard and S3 Standard-IA provide immediate, millisecond-level retrieval; S3 Glacier Flexible Retrieval takes minutes to hours (1-5 minutes expedited, 3-5 hours standard), and Glacier Deep Archive takes 12-48 hours.',
      'Pricing Model: S3 Standard charges higher storage fees ($0.023/GB) with no retrieval fees; Glacier and IA charge fractions of a cent for storage (down to $0.00099/GB for Deep Archive) but add per-GB retrieval fees and per-request costs.',
      'Minimum Retention & Size: S3 Standard has no minimum storage duration or billable object size; IA and Glacier enforce minimum billable storage durations (30 to 180 days) and minimum billable sizes (128 KB).',
      'Use Case Focus: S3 Standard is designed for active, frequently accessed data; IA and Glacier are engineered for disaster recovery, compliance archives, and infrequent audit trails.'
    ],
    whenToChooseA: [
      'Frequently accessed data, active website assets, and dynamically queried application files.',
      'Objects that are rapidly modified or deleted within 30 days of creation.',
      'Data where access patterns are constant and per-request retrieval fees would exceed storage savings.'
    ],
    whenToChooseB: [
      'Regulatory compliance records, HIPAA archives, and financial ledgers that must be retained for 7+ years but are rarely accessed.',
      'Disaster recovery backups and secondary snapshots accessed less than once a month (Standard-IA) or once a year (Deep Archive).',
      'Workloads where S3 Intelligent-Tiering or S3 Lifecycle policies automatically transition cold data.'
    ],
    workTogether: 'S3 Lifecycle rules allow objects to automatically transition from S3 Standard to S3 Standard-IA after 30 days, then to S3 Glacier Flexible Retrieval after 90 days, and finally to S3 Glacier Deep Archive after 180 days, minimizing overall storage expenditure automatically.',
    tradeoffs: [
      {
        dimension: 'Storage Cost (per GB/mo)',
        optionA: 'Higher (~$0.023/GB).',
        optionB: 'Extremely Low (~$0.0036 for Glacier Flexible, ~$0.00099 for Deep Archive).'
      },
      {
        dimension: 'Retrieval Fees',
        optionA: '$0.00 per GB retrieved.',
        optionB: 'Per-GB retrieval charges apply (e.g. $0.01/GB for IA, plus request fees).'
      },
      {
        dimension: 'Retrieval Speed',
        optionA: 'Milliseconds (immediate synchronous read).',
        optionB: 'Minutes to hours (asynchronous restore job required before reading).'
      },
      {
        dimension: 'Minimum Storage Commitment',
        optionA: 'None; pay pro-rated per second.',
        optionB: '30 days (IA), 90 days (Glacier Flexible), 180 days (Deep Archive).'
      }
    ],
    scenario: 'A healthcare application stores patient imaging files in S3 Standard for 30 days while treatments are active. After 30 days, an S3 Lifecycle rule moves the images to S3 Glacier Flexible Retrieval where they remain for 7 years to meet medical compliance mandates at 85% lower cost.',
    question: {
      id: 'quiz-s3-storage-classes-1',
      question: 'A financial institution must retain transaction audit logs for 10 years to comply with regulatory mandates. The logs are never accessed unless an official government investigation occurs, which allows a retrieval turnaround time of 24 hours. What is the most cost-effective storage class?',
      type: 'single',
      options: [
        'S3 Standard',
        'S3 One Zone-IA',
        'S3 Glacier Instant Retrieval',
        'S3 Glacier Deep Archive'
      ],
      correctAnswers: [3],
      explanation: 'S3 Glacier Deep Archive is the lowest-cost storage tier in AWS (~$0.00099 per GB/month). It is specifically designed for long-term data retention (7-10+ years) where retrieval times of 12 to 48 hours are acceptable.',
      whyOthersWrong: [
        'S3 Standard is over 20 times more expensive per gigabyte than Glacier Deep Archive.',
        'S3 One Zone-IA is more expensive, stores data in only one AZ (risking total data loss if an AZ fails), and is designed for millisecond access.',
        'S3 Glacier Instant Retrieval is designed for millisecond access and costs approximately $0.004/GB-month, which is 4x the price of Glacier Deep Archive.'
      ],
      decisiveClue: 'Retain 10 years, almost never accessed, 24-hour retrieval turnaround allowed, lowest cost required.',
      difficulty: 'beginner',
      isOriginal: true,
      source: 'Original AWS certification-style practice question'
    },
    sources: [
      { title: 'Amazon S3 Storage Classes', url: 'https://aws.amazon.com/s3/storage-classes/' },
      { title: 'Managing S3 Lifecycles', url: 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lifecycle-mgmt.html' }
    ]
  },
  {
    id: 'ebs-snapshots-vs-backup',
    title: 'EBS Snapshots vs AWS Backup',
    category: 'Storage',
    serviceA: 'Amazon EBS Snapshots',
    serviceB: 'AWS Backup',
    problem: 'Deciding between service-native point-in-time volume snapshots and centralized multi-service backup governance.',
    decisiveDifferences: [
      'Scope of Protection: EBS Snapshots only capture individual Amazon EBS block volumes; AWS Backup is a centralized policy-based service orchestrating backups across EBS, EFS, RDS, DynamoDB, S3, EC2, Aurora, and AWS Storage Gateway.',
      'Governance & Compliance: AWS Backup centralizes backup policies, schedules, lifecycle transitions (to cold storage), cross-Region/cross-account copies, and AWS Backup Vault Lock (WORM compliance); raw EBS snapshots require custom Lambda scripts or Amazon Data Lifecycle Manager (DLM) rules.',
      'Auditability: AWS Backup provides centralized compliance dashboards, AWS Backup Audit Manager, and unified CloudTrail reporting across all protected resources.'
    ],
    whenToChooseA: [
      'Ad-hoc manual backups of a single EBS volume prior to a risky OS patch or application upgrade.',
      'Simple environments utilizing basic Amazon Data Lifecycle Manager (DLM) policies solely for EBS volumes.',
      'Creating custom Golden AMIs from an EC2 instance root volume snapshot.'
    ],
    whenToChooseB: [
      'Enterprise environments requiring unified backup policies, schedules, and retention rules across multiple AWS services.',
      'Meeting regulatory requirements for immutable, tamper-proof backups using AWS Backup Vault Lock.',
      'Automated cross-account and cross-region disaster recovery replication managed under AWS Organizations.'
    ],
    workTogether: 'AWS Backup leverages EBS Snapshots under the hood when backing up EC2 and EBS resources. Engineers set the centralized backup plan in AWS Backup, and the service invokes EBS snapshot APIs while applying global retention and compliance rules.',
    tradeoffs: [
      {
        dimension: 'Multi-Service Support',
        optionA: 'EBS block storage only.',
        optionB: 'EBS, EFS, RDS, Aurora, DynamoDB, S3, DocumentDB, Timestream, etc.'
      },
      {
        dimension: 'Compliance & Immutability',
        optionA: 'Requires custom IAM locks or snapshot copy scripts to prevent deletion.',
        optionB: 'AWS Backup Vault Lock provides WORM (Write Once Read Many) compliance.'
      },
      {
        dimension: 'Centralized Policy Management',
        optionA: 'Managed per volume or via basic DLM policies.',
        optionB: 'Centralized Backup Plans assigned by tags or resource IDs via AWS Organizations.'
      }
    ],
    scenario: 'A regulated banking platform uses AWS Backup to enforce a company-wide policy: every EBS volume, RDS database, and EFS filesystem tagged `Environment: Production` must be backed up daily at 02:00 UTC, transitioned to cold storage after 30 days, and locked against deletion for 365 days.',
    question: {
      id: 'quiz-ebs-snapshots-vs-backup-1',
      question: 'An enterprise security team requires a centralized solution to enforce daily backup schedules across Amazon EBS volumes, Amazon RDS databases, and Amazon EFS filesystems. The backups must be copied to a secondary AWS Region and protected from deletion even by root account users. Which service fulfills this requirement?',
      type: 'single',
      options: [
        'Amazon Data Lifecycle Manager (DLM)',
        'AWS Backup with Backup Vault Lock and cross-Region copy',
        'Custom Python scripts running on AWS Lambda invoked by EventBridge',
        'Amazon CloudWatch scheduled rules triggering EBS direct APIs'
      ],
      correctAnswers: [1],
      explanation: 'AWS Backup provides a centralized, policy-driven backup management service supporting EBS, RDS, and EFS. It natively supports automated cross-Region copies and Backup Vault Lock, which prevents backup deletion even by root or admin users.',
      whyOthersWrong: [
        'Amazon DLM only manages EBS volumes and EC2 instances, not RDS or EFS filesystems.',
        'Custom Lambda scripts introduce high operational overhead, maintenance risks, and cannot provide cryptographically enforced WORM compliance comparable to Vault Lock.',
        'CloudWatch scheduled rules triggering EBS APIs only handle EBS and do not support cross-service unified policy management or Vault Lock.'
      ],
      decisiveClue: 'Centralized solution across EBS, RDS, and EFS with cross-Region copy and protection against deletion even by root.',
      difficulty: 'intermediate',
      isOriginal: true,
      source: 'Original AWS certification-style practice question'
    },
    sources: [
      { title: 'AWS Backup Developer Guide', url: 'https://docs.aws.amazon.com/aws-backup/latest/devguide/whatisbackup.html' },
      { title: 'Amazon EBS Snapshots', url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EBSSnapshots.html' }
    ]
  }
];
