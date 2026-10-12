import { Comparison } from '../../types';

export const costReliabilityComparisons: Comparison[] = [
  {
    id: 'savings-plans-vs-reserved',
    title: 'Savings Plans vs Reserved Instances',
    category: 'Cost & Reliability',
    serviceA: 'AWS Savings Plans',
    serviceB: 'Reserved Instances (RIs)',
    problem: 'Committing to cloud usage in exchange for deep discounts (up to 72%) on compute resources.',
    decisiveDifferences: [
      'Commitment Metric: Savings Plans commit to a consistent dollar spend per hour (e.g., "$15.00/hour for 1 or 3 years"); Reserved Instances commit to a specific physical instance configuration or capacity allocation (e.g., "10 x c6i.xlarge in us-east-1").',
      'Flexibility & Scope: Compute Savings Plans automatically apply across EC2 instances, AWS Fargate, and AWS Lambda regardless of instance family, OS, region, or tenancy; standard EC2 Reserved Instances are tied to specific instance types and regions.',
      'Modern AWS Recommendation: AWS recommends Savings Plans for all new compute commitments due to significantly easier management and broad flexibility; Reserved Instances are primarily retained for non-compute services like Amazon RDS, Amazon Redshift, Amazon ElastiCache, and Amazon OpenSearch (which do not yet support Savings Plans).',
      'Resale & Marketplace: EC2 Reserved Instances can be listed and sold on the AWS Reserved Instance Marketplace if no longer needed; Savings Plans CANNOT be sold, transferred, or cancelled once purchased.'
    ],
    whenToChooseA: [
      'Discounting compute workloads across Amazon EC2, AWS Fargate, and AWS Lambda.',
      'Dynamic environments where instance types, architectures (e.g., migrating from x86 to Graviton arm64), or container launch types evolve over time.',
      'Organizations wanting simplified, automated cost optimization without managing hundreds of granular RI reservations.'
    ],
    whenToChooseB: [
      'Non-compute managed database and caching services: Amazon RDS, Amazon Aurora, Amazon ElastiCache, Amazon Redshift, and Amazon OpenSearch.',
      'Specific EC2 requirements where the company intends to resell excess reserved capacity on the AWS RI Marketplace.',
      'Zonal capacity reservations where guaranteed physical EC2 capacity in a specific AZ is required alongside financial discounts.'
    ],
    workTogether: 'A comprehensive cost optimization strategy uses Compute Savings Plans to cover dynamic EC2, Fargate, and Lambda workloads across the entire fleet, while purchasing Reserved Instances for steady-state Amazon RDS PostgreSQL and Amazon ElastiCache Redis clusters.',
    tradeoffs: [
      {
        dimension: 'Commitment Type',
        optionA: 'Spend-based: $/hour commitment (e.g., $10/hr for 1 or 3 years).',
        optionB: 'Capacity/Instance-based: specific count of instance types/sizes.'
      },
      {
        dimension: 'Cross-Service Application',
        optionA: 'Applies automatically across EC2, Fargate, and Lambda.',
        optionB: 'Tied to specific services (EC2 RIs, RDS RIs, ElastiCache RIs).'
      },
      {
        dimension: 'Secondary Marketplace',
        optionA: 'Cannot be resold or modified once purchased.',
        optionB: 'EC2 RIs can be listed and sold on the AWS RI Marketplace.'
      }
    ],
    scenario: 'A company migrates its backend from EC2 x86 instances to ECS Fargate on AWS Graviton. Because they purchased Compute Savings Plans rather than standard EC2 Reserved Instances, their 1-year financial commitment automatically applies to their new Fargate Graviton containers without waste.',
    question: {
      id: 'quiz-savings-plans-vs-reserved-1',
      question: 'A financial enterprise plans to modernize its compute fleet over the next 12 months by migrating from EC2 m5 instances to AWS Graviton-based instances and containerizing several workloads onto AWS Fargate. They want to commit to 3-year usage to achieve up to 66% discounts while maintaining flexibility across instance families and Fargate. Which pricing model should they purchase?',
      type: 'single',
      options: [
        'Standard EC2 Reserved Instances',
        'Compute Savings Plans',
        'EC2 Instance Savings Plans',
        'On-Demand Capacity Reservations'
      ],
      correctAnswers: [1],
      explanation: 'Compute Savings Plans provide the highest flexibility, applying discounts automatically to Amazon EC2 (regardless of family, OS, or architecture like x86 vs Graviton), AWS Fargate, and AWS Lambda.',
      whyOthersWrong: [
        'Standard EC2 Reserved Instances are locked to a specific instance family and region, and do not apply to Fargate or Lambda.',
        'EC2 Instance Savings Plans are tied to a specific instance family in a specific region, and do not apply to AWS Fargate.',
        'On-Demand Capacity Reservations reserve physical capacity in an AZ, but do not provide any pricing discounts.'
      ],
      decisiveClue: 'Discount compute while migrating across instance families (m5 to Graviton) and containerizing onto AWS Fargate.',
      difficulty: 'intermediate',
      isOriginal: true,
      source: 'Original AWS certification-style practice question'
    },
    sources: [
      { title: 'AWS Savings Plans User Guide', url: 'https://docs.aws.amazon.com/savingsplans/latest/userguide/what-is-savings-plans.html' },
      { title: 'Amazon EC2 Reserved Instances', url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-reserved-instances.html' }
    ]
  },
  {
    id: 'on-demand-vs-spot',
    title: 'On-Demand vs Spot Instances',
    category: 'Cost & Reliability',
    serviceA: 'On-Demand Instances',
    serviceB: 'Spot Instances',
    problem: 'Balancing compute cost savings (up to 90%) against interruption tolerance and availability guarantees.',
    decisiveDifferences: [
      'Interruption Risk: On-Demand instances run continuously without interruption until the user chooses to stop or terminate them; Spot instances tap into unused EC2 spare capacity and can be reclaimed by AWS with a 2-minute interruption warning when capacity is needed back.',
      'Pricing Discount: On-Demand instances charge standard fixed hourly rates; Spot instances offer discounts of up to 70-90% off On-Demand pricing based on real-time market supply and demand.',
      'Availability Guarantee: On-Demand instances are covered by the standard EC2 Service Level Agreement (SLA); Spot instances offer no availability SLA because instances can be terminated at any moment due to capacity spikes.',
      'Target Workloads: On-Demand is engineered for stateful, mission-critical, uninterruptible workloads (core databases, production transactional APIs); Spot is engineered for stateless, fault-tolerant, batch, or horizontally scalable workloads (video rendering, big data analytics, CI/CD runners).'
    ],
    whenToChooseA: [
      'Production relational databases, payment transaction engines, and core ERP systems.',
      'Workloads that cannot tolerate unexpected server shutdowns or two-minute interruption notices.',
      'Applications with short, non-interruptible batch jobs that would have to restart from scratch if terminated.'
    ],
    whenToChooseB: [
      'Stateless web application fleets scaled horizontally across multiple instance types and AZs.',
      'Big data processing clusters (Amazon EMR, Apache Spark, Hadoop) and machine learning training jobs with checkpointing.',
      'Batch processing, high-performance computing (HPC), image rendering, and CI/CD test runners.',
      'Cost-critical workloads where 70-90% savings outweigh occasional node replacements.'
    ],
    workTogether: 'EC2 Auto Scaling Groups with Mixed Instances Policies: A web tier defines a baseline of 20% On-Demand instances to guarantee a reliable minimum capacity floor for core availability, and satisfies the remaining 80% dynamic scaling capacity with Spot instances across diverse instance types to minimize costs.',
    tradeoffs: [
      {
        dimension: 'Pricing Discount',
        optionA: '0% (Standard fixed hourly rate).',
        optionB: 'Up to 90% discount compared to On-Demand.'
      },
      {
        dimension: 'Interruption Notice',
        optionA: 'No interruptions; runs until stopped by customer.',
        optionB: '2-minute warning via EC2 metadata or EventBridge before termination.'
      },
      {
        dimension: 'Suitability for Stateful DBs',
        optionA: 'Fully suitable (standard persistent production host).',
        optionB: 'Unsuitable (abrupt shutdowns risk database corruption).'
      }
    ],
    scenario: 'A genomics lab runs DNA sequencing algorithms that save state checkpoints to Amazon S3 every 10 minutes. By running their 500-node compute cluster on EC2 Spot Instances, they reduce their compute bill from $10,000/month to $1,500/month, safely recovering from occasional 2-minute Spot terminations.',
    question: {
      id: 'quiz-on-demand-vs-spot-1',
      question: 'A data science team runs distributed machine learning training jobs that take 30 hours to complete. The training framework automatically saves checkpoints to Amazon S3 every 15 minutes and can seamlessly resume from the last checkpoint if a node fails. The budget is extremely tight. Which EC2 purchasing option provides the highest cost savings?',
      type: 'single',
      options: [
        'Dedicated Hosts',
        'On-Demand Instances',
        'Spot Instances managed by an Auto Scaling Group with instance diversification',
        'Standard 1-year All-Upfront Reserved Instances'
      ],
      correctAnswers: [2],
      explanation: 'Spot Instances offer up to 90% savings off On-Demand rates. Because the training job is fault-tolerant and saves checkpoints to S3 every 15 minutes, it can easily tolerate Spot interruptions and resume from checkpoints.',
      whyOthersWrong: [
        'Dedicated Hosts are the most expensive EC2 option, designed for dedicated hardware and compliance/licensing needs.',
        'On-Demand instances charge full price with zero discounts.',
        'Standard 1-year Reserved Instances require long-term commitments and only offer ~40-60% savings compared to the ~90% savings possible with Spot.'
      ],
      decisiveClue: 'Fault-tolerant job with 15-minute S3 checkpoints needing maximum cost savings under tight budget.',
      difficulty: 'beginner',
      isOriginal: true,
      source: 'Original AWS certification-style practice question'
    },
    sources: [
      { title: 'Amazon EC2 Spot Instances', url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-spot-instances.html' },
      { title: 'Amazon EC2 On-Demand Pricing', url: 'https://aws.amazon.com/ec2/pricing/on-demand/' }
    ]
  },
  {
    id: 'backup-vs-snapshots',
    title: 'AWS Backup vs Service-Native Snapshots',
    category: 'Cost & Reliability',
    serviceA: 'AWS Backup',
    serviceB: 'Service-Native Snapshots',
    problem: 'Managing centralized enterprise-wide data protection policies versus individual service-level snapshot utilities.',
    decisiveDifferences: [
      'Policy Centralization: AWS Backup provides a single centralized control plane to define backup schedules, lifecycle retention rules, and cross-Region/cross-account copies across 10+ AWS services (EBS, RDS, Aurora, DynamoDB, EFS, S3, FSx, EC2); native snapshots are managed independently within each individual service console (e.g., EC2 console for EBS, RDS console for RDS snapshots).',
      'Compliance & WORM Protection: AWS Backup Vault Lock provides Write-Once-Read-Many (WORM) compliance protection, preventing backups from being deleted by ANY user (including the AWS root account) until the retention period expires; native snapshots lack native Vault Lock enforcement.',
      'Lifecycle Tiering: AWS Backup can automatically transition older backups from warm storage to cheaper cold storage tiers (such as EFS cold storage or DynamoDB cold storage); native snapshots do not support automated cross-tier cold storage transitions.',
      'Auditing & Reporting: AWS Backup Audit Manager provides continuous compliance reporting against regulatory standards; native snapshots require custom scripts to discover unbacked-up volumes.'
    ],
    whenToChooseA: [
      'Enterprise environments managing multi-account disaster recovery and compliance via AWS Organizations.',
      'Regulated industries requiring tamper-proof, non-deletable backups enforced by AWS Backup Vault Lock.',
      'Automated disaster recovery copying backups to a secondary AWS Region or dedicated isolated security account.',
      'Unified backup scheduling across heterogeneous storage services (RDS, DynamoDB, EFS, and S3).'
    ],
    whenToChooseB: [
      'Simple, single-service environments with basic snapshot requirements (e.g., using Amazon Data Lifecycle Manager for a few EBS volumes).',
      'One-off manual snapshots taken immediately prior to a risky application upgrade or database schema migration.',
      'Development or test accounts where centralized compliance policies are unnecessary.'
    ],
    workTogether: 'An engineer takes an immediate manual native RDS snapshot before applying a major database patch for quick rollback; simultaneously, AWS Backup enforces the corporate daily backup schedule, cross-Region replication to `us-west-2`, and 365-day WORM retention policy.',
    tradeoffs: [
      {
        dimension: 'Management Scope',
        optionA: 'Centralized policy engine across 10+ AWS services.',
        optionB: 'Fragmented across individual service consoles (EC2, RDS, DynamoDB).'
      },
      {
        dimension: 'Tamper-Proof Protection',
        optionA: 'AWS Backup Vault Lock (WORM compliance prevents root deletion).',
        optionB: 'Standard IAM policies (vulnerable to compromised admin/root credentials).'
      },
      {
        dimension: 'Cross-Region / Cross-Account Automation',
        optionA: 'Native policy setting in backup plan rules.',
        optionB: 'Requires custom EventBridge rules, Lambda functions, or DLM scripts.'
      }
    ],
    scenario: 'A fintech company must comply with SEC regulations mandating that all databases and file stores have immutable backups retained for 7 years. They deploy an AWS Backup plan across all AWS Organization member accounts with Vault Lock enabled, ensuring backups cannot be purged even during a ransomware breach.',
    question: {
      id: 'quiz-backup-vs-snapshots-1',
      question: 'A chief information security officer (CISO) mandates that all database and file storage backups across the entire company must be stored in a centralized backup vault where no user, including the root user or system administrators, can delete backups prior to their 90-day retention period. Which solution fulfills this compliance requirement?',
      type: 'single',
      options: [
        'Amazon Data Lifecycle Manager (DLM) with an IAM deny policy',
        'AWS Backup with AWS Backup Vault Lock in compliance mode',
        'Service-native automated snapshots with S3 Glacier Object Lock',
        'AWS Systems Manager Maintenance Windows triggering snapshot scripts'
      ],
      correctAnswers: [1],
      explanation: 'AWS Backup Vault Lock in compliance mode enforces strict WORM retention that prevents backups from being deleted by anyone, including IAM administrators and the AWS account root user, until the retention period has passed.',
      whyOthersWrong: [
        'Amazon DLM only manages EBS volumes and EC2 instances, and IAM policies can be modified or overridden by the root user or administrators.',
        'Service-native snapshots do not natively support S3 Glacier Object Lock; snapshots are stored in AWS-managed internal S3 space, not customer-managed S3 buckets.',
        'Systems Manager scripts do not prevent administrators from manually deleting snapshots via the AWS console or API.'
      ],
      decisiveClue: 'Centralized backup vault where NO user including root can delete backups before the retention period.',
      difficulty: 'intermediate',
      isOriginal: true,
      source: 'Original AWS certification-style practice question'
    },
    sources: [
      { title: 'AWS Backup Vault Lock', url: 'https://docs.aws.amazon.com/aws-backup/latest/devguide/vault-lock.html' },
      { title: 'AWS Backup Developer Guide', url: 'https://docs.aws.amazon.com/aws-backup/latest/devguide/whatisbackup.html' }
    ]
  },
  {
    id: 'multi-az-vs-multi-region',
    title: 'Multi-AZ vs Multi-Region Architecture',
    category: 'Cost & Reliability',
    serviceA: 'Multi-AZ Architecture',
    serviceB: 'Multi-Region Architecture',
    problem: 'Designing resilient architectures balancing local data center failure recovery against catastrophic regional disasters and global latency.',
    decisiveDifferences: [
      'Scope of Resilience: Multi-AZ protects against single data center, building, or local availability zone failures within a single geographical region; Multi-Region protects against entire AWS region outages, geopolitical disruptions, or major backbone fiber cuts.',
      'Replication Latency & Consistency: Multi-AZ operates within low-latency (<1-2 ms) optical fiber rings, supporting synchronous database replication (zero RPO); Multi-Region spans continents with physical speed-of-light propagation delays (tens to hundreds of milliseconds), necessitating asynchronous replication and eventual consistency.',
      'Operational Complexity & Cost: Multi-AZ is relatively simple and turnkey (often a single checkbox on RDS/ALB) with standard inter-AZ transfer fees; Multi-Region introduces enormous complexity (split-brain handling, conflict resolution, global routing, cross-region replication costs) and doubles baseline infrastructure costs.',
      'Primary Driver: Multi-AZ provides High Availability (HA); Multi-Region provides Disaster Recovery (DR) and Global User Latency Optimization.'
    ],
    whenToChooseA: [
      'The vast majority (95%+) of enterprise production workloads requiring 99.9% to 99.99% availability.',
      'Workloads requiring strict synchronous ACID transactions with zero data loss (RPO = 0) and fast automated failover.',
      'Cost-conscious architectures avoiding duplicate infrastructure fleets and expensive cross-region egress charges.'
    ],
    whenToChooseB: [
      'Mission-critical systems requiring business continuity during catastrophic regional power grid or telecommunication failures (RTO/RPO requirements that tolerate no single-region risk).',
      'Global user bases where serving users from local regional edge backends (e.g., US, Europe, Asia) is necessary for sub-50ms latency.',
      'Strict legal or regulatory data residency mandates requiring localized data storage across sovereign borders.'
    ],
    workTogether: 'The Tiered Resilience Pattern: Each regional deployment is itself built as a highly available Multi-AZ architecture (e.g., primary in us-east-1 across 3 AZs; secondary in us-west-2 across 3 AZs). Multi-AZ handles local daily infrastructure faults automatically, while cross-region replication serves as the disaster recovery backstop.',
    tradeoffs: [
      {
        dimension: 'Disaster Scope Mitigated',
        optionA: 'Local data center, rack, power, or AZ failure.',
        optionB: 'Total region failure, submarine cable cut, regulatory catastrophe.'
      },
      {
        dimension: 'Data Replication Type',
        optionA: 'Synchronous (<2 ms latency; zero data loss / RPO=0).',
        optionB: 'Asynchronous (tens of ms latency; eventual consistency / RPO>0).'
      },
      {
        dimension: 'Operational Complexity & Cost',
        optionA: 'Low to moderate; turnkey AWS service configuration.',
        optionB: 'Very high; duplicated fleets, complex data conflict resolution.'
      }
    ],
    scenario: 'A retail banking platform runs in `us-east-1` across three Availability Zones to achieve 99.99% daily uptime with synchronous database writes. To satisfy federal banking regulations requiring survival of catastrophic grid failure, they maintain an asynchronous warm-standby replica in `us-west-2` via Route 53 Application Recovery Controller.',
    question: {
      id: 'quiz-multi-az-vs-multi-region-1',
      question: 'A company is architecting a financial transaction system. The database must guarantee zero data loss (RPO = 0) in the event of an infrastructure failure, and failover must occur automatically in under 2 minutes without human intervention. The network latency between application and database must remain under 2 milliseconds. What architecture is required?',
      type: 'single',
      options: [
        'Multi-Region active-active deployment using DynamoDB Global Tables',
        'Amazon RDS deployed in a Multi-AZ configuration across Availability Zones in a single Region',
        'Amazon Aurora with cross-Region Read Replicas',
        'Single-AZ EC2 instances with nightly Amazon S3 cross-region replication'
      ],
      correctAnswers: [1],
      explanation: 'Amazon RDS Multi-AZ uses synchronous physical block-level replication across distinct Availability Zones in the same Region. It delivers sub-2ms network latency, guarantees zero data loss (RPO = 0) on failover, and fails over automatically in 60-120 seconds.',
      whyOthersWrong: [
        'Multi-Region deployments across different geographic regions cannot achieve sub-2ms network latency due to physical distance and use asynchronous replication, risking data loss.',
        'Aurora cross-Region replicas use asynchronous replication across regions, which has non-zero RPO and higher cross-region latency.',
        'Single-AZ instances offer no high availability and nightly backups result in up to 24 hours of data loss (RPO = 24h).'
      ],
      decisiveClue: 'Zero data loss (RPO = 0), automatic failover in under 2 minutes, and sub-2 millisecond latency.',
      difficulty: 'intermediate',
      isOriginal: true,
      source: 'Original AWS certification-style practice question'
    },
    sources: [
      { title: 'AWS Well-Architected Framework: Reliability Pillar', url: 'https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/welcome.html' },
      { title: 'Disaster Recovery of Workloads on AWS', url: 'https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/disaster-recovery-workloads-on-aws.html' }
    ]
  },
  {
    id: 'cw-alarms-vs-eventbridge',
    title: 'CloudWatch Alarms vs EventBridge Rules',
    category: 'Cost & Reliability',
    serviceA: 'CloudWatch Alarms',
    serviceB: 'Amazon EventBridge Rules',
    problem: 'Triggering automated notifications and operational remediation workflows based on state changes.',
    decisiveDifferences: [
      'Trigger Condition: CloudWatch Alarms trigger based on sustained numerical metric thresholds evaluated over a period of time (e.g., "CPUUtilization > 80% for 3 consecutive evaluation periods of 5 minutes"); EventBridge Rules trigger in near real-time on discrete, point-in-time JSON events and state change notifications (e.g., "EC2 instance state changed to `terminated`" or "S3 `PutObject` event emitted").',
      'Evaluation Nature: CloudWatch Alarms are metric-driven, stateful (OK, ALARM, INSUFFICIENT_DATA), and include hysteresis to avoid flapping; EventBridge Rules are event-driven, instantaneous, stateless, and evaluate JSON payload attributes against pattern filters.',
      'Target Breadth: CloudWatch Alarms trigger specific predefined actions (SNS notifications, EC2 Auto Scaling policies, EC2 reboot/stop/terminate/recover actions, Systems Manager OpsCenter); EventBridge Rules route to over 30+ AWS targets (Lambda, Step Functions, SQS, Kinesis, ECS tasks, API destinations).',
      'Use Case Focus: CloudWatch Alarms manage operational thresholds and capacity; EventBridge Rules coordinate asynchronous event-driven architectures and infrastructure state transitions.'
    ],
    whenToChooseA: [
      'Triggering EC2 Auto Scaling scale-out or scale-in policies based on CPU or memory load.',
      'Alerting on-call teams when 5xx HTTP error rates or database connection counts exceed acceptable thresholds.',
      'Detecting abnormal metric deviations using CloudWatch Anomaly Detection bands.',
      'Automated EC2 instance recovery when underlying hardware status checks fail.'
    ],
    whenToChooseB: [
      'Reacting immediately when an AWS resource changes state (e.g., GuardDuty finding generated, CodePipeline stage failed, EC2 Spot instance 2-minute interruption notice received).',
      'Triggering an automated remediation workflow (e.g., invoking a Step Functions state machine when an unencrypted S3 bucket is created).',
      'Scheduling cron jobs and periodic tasks (EventBridge Scheduled Rules / EventBridge Scheduler).'
    ],
    workTogether: 'CloudWatch Alarms and EventBridge complement each other: When a CloudWatch Alarm transitions from `OK` to `ALARM`, it automatically publishes an event to EventBridge. An EventBridge rule captures that alarm state change event, inspects the JSON payload, and routes it to an external PagerDuty webhook via an API Destination.',
    tradeoffs: [
      {
        dimension: 'Triggering Mechanism',
        optionA: 'Numerical metric threshold sustained over time windows.',
        optionB: 'Discrete point-in-time JSON event or state change.'
      },
      {
        dimension: 'Evaluation Statefulness',
        optionA: 'Stateful: maintains state across periods (OK / ALARM / INSUFFICIENT_DATA).',
        optionB: 'Stateless: fires immediately when event pattern matches.'
      },
      {
        dimension: 'Target Capabilities',
        optionA: 'SNS, EC2 Auto Scaling, EC2 recovery actions, OpsCenter.',
        optionB: '30+ AWS services, Step Functions, Lambda, SQS, API Destinations.'
      }
    ],
    scenario: 'An operations team uses CloudWatch Alarms to scale up an EC2 Auto Scaling group when average CPU exceeds 75% for 10 minutes. For immediate Spot instance reclamations, they use an EventBridge rule to intercept the 2-minute Spot interruption notice and instantly detach the instance from the load balancer.',
    question: {
      id: 'quiz-cw-alarms-vs-eventbridge-1',
      question: 'A DevOps engineer needs to trigger an automated remediation script on AWS Lambda within seconds whenever an Amazon EC2 Spot instance receives a 2-minute interruption termination warning from AWS. Which mechanism detects this notice with the lowest latency?',
      type: 'single',
      options: [
        'A CloudWatch Metric Alarm monitoring the EC2 CPUUtilization metric',
        'An Amazon EventBridge rule matching the "EC2 Spot Instance Interruption Warning" event',
        'A CloudWatch Metric Alarm evaluating the EC2 StatusCheckFailed_System metric',
        'An AWS Systems Manager State Manager association scheduled every 5 minutes'
      ],
      correctAnswers: [1],
      explanation: 'AWS publishes the Spot Instance Interruption Warning as an instantaneous event to Amazon EventBridge 2 minutes before the instance is reclaimed. An EventBridge rule matches this event pattern and invokes the Lambda function immediately.',
      whyOthersWrong: [
        'CloudWatch Metric Alarms monitor historical time-series metrics over minutes and cannot catch an instantaneous event notification.',
        'StatusCheckFailed_System measures underlying hardware degradation, not the planned Spot interruption warning, and updates on 1-minute metric intervals.',
        'Systems Manager State Manager runs on periodic cron intervals (e.g., 5 minutes), which is far too slow for a 2-minute interruption window.'
      ],
      decisiveClue: 'Trigger Lambda within seconds of the instantaneous EC2 Spot Instance 2-minute interruption warning.',
      difficulty: 'intermediate',
      isOriginal: true,
      source: 'Original AWS certification-style practice question'
    },
    sources: [
      { title: 'Using Amazon CloudWatch Alarms', url: 'https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/AlarmThatSendsEmail.html' },
      { title: 'Amazon EventBridge Event Patterns', url: 'https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-event-patterns.html' }
    ]
  }
];
