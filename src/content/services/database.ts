import { AWSService } from '../../types';

export const databaseServices: AWSService[] = [
  {
    id: 'rds',
    name: 'Amazon Relational Database Service',
    shortName: 'RDS',
    category: 'database',
    difficulty: 'intermediate',
    importance: 'essential',
    icon: 'Database',
    tagline: 'Managed relational database service for MySQL, PostgreSQL, MariaDB, Oracle, and SQL Server',
    mentalModel: 'A database administrator in a box that handles provisioning, automated backups, hardware failures, and OS/DB patching for your relational databases.',
    problemItSolves: 'Removes the heavy operational burden of installing, patching, backing up, and setting up replication for standard relational database engines.',
    howItWorks: 'Provisions dedicated database instances running specialized Amazon Linux OS with the chosen database engine, offering automated synchronous Multi-AZ standby replication and asynchronous Read Replicas.',
    components: [
      { name: 'Multi-AZ Deployment', description: 'Synchronous replication to a standby instance in another AZ for automatic disaster recovery failover.' },
      { name: 'Read Replicas', description: 'Up to 15 asynchronous read-only copies used to offload read-heavy query workloads across AZs or regions.' },
      { name: 'Automated Backups', description: 'Continuous transaction log archiving enabling Point-In-Time Restore (PITR) up to 35 days with 5-minute precision.' },
      { name: 'RDS Custom', description: 'Managed database service providing root OS and database administrator access for legacy Oracle and SQL Server systems.' }
    ],
    realWorldExample: 'Backing an enterprise ERP or financial transaction system requiring strict ACID compliance, complex SQL JOINs, and Multi-AZ high availability.',
    whenToUse: [
      'Relational transactional workloads requiring full ACID compliance and foreign key integrity',
      'Migrating existing MySQL, PostgreSQL, MariaDB, SQL Server, or Oracle databases to AWS with minimal rewrites',
      'Applications needing built-in automated patching, point-in-time recovery, and Multi-AZ failover'
    ],
    whenNotToUse: [
      'Cloud-native applications demanding higher throughput, auto-scaling storage up to 128TB, and sub-minute replica lag (use Amazon Aurora)',
      'High-throughput key-value or document queries with millions of RPS needing sub-10ms latency (use DynamoDB)',
      'Complex petabyte-scale analytical OLAP data warehousing (use Amazon Redshift)'
    ],
    practicalImplementation: {
      cli: 'aws rds create-db-instance --db-instance-identifier prod-db --db-instance-class db.r6g.large --engine postgres --allocated-storage 100 --master-username masteradmin --master-user-password "SecretPass123!" --multi-az'
    },
    security: 'Encrypt storage using AWS KMS (SSE-KMS). Isolate DB inside private subnets, restrict access using DB Security Groups, and enforce IAM or SSL/TLS database authentication.',
    costDrivers: 'DB instance hours, allocated storage (gp3/io2 GB-month), backup storage exceeding DB size, and cross-AZ or cross-region replication data transfer.',
    limitations: [
      'No root/SSH access to the underlying operating system (except RDS Custom)',
      'Scaling compute size requires a brief failover interruption or maintenance window',
      'Storage can be scaled up automatically, but cannot be scaled down'
    ],
    commonMistakes: [
      'Confusing Multi-AZ with Read Replicas: Multi-AZ is for synchronous disaster recovery (cannot serve reads); Read Replicas are for read scalability',
      'Placing RDS in public subnets with public accessibility enabled instead of private isolated subnets',
      'Overlooking automated snapshot retention windows before major application database schema migrations'
    ],
    alternatives: [
      { service: 'aurora', reason: 'Up to 5x throughput of MySQL / 3x PostgreSQL with auto-expanding storage up to 128 TB' },
      { service: 'dynamodb', reason: 'Fully managed serverless NoSQL with single-digit millisecond scale' }
    ],
    relatedServices: ['aurora', 'ec2', 'kms', 'secrets-manager', 'vpc'],
    scenarioQuestion: {
      id: 'q-rds-01',
      question: 'A critical e-commerce PostgreSQL database on Amazon RDS must withstand an entire Availability Zone outage with minimal downtime and zero data loss. Additionally, the business requires offloading read-heavy reporting queries during business hours. Which architecture satisfies both requirements?',
      type: 'single',
      options: [
        'Deploy RDS in a Multi-AZ configuration for high availability and create one or more Read Replicas for reporting queries.',
        'Deploy a single RDS instance and configure automated hourly snapshots restored to another AZ.',
        'Deploy two independent RDS instances and use AWS DMS to replicate changes asynchronously.',
        'Deploy RDS with Read Replicas only, promoting a Read Replica if the primary fails.'
      ],
      correctAnswers: [0],
      explanation: 'Multi-AZ provides synchronous replication and automatic failover in 60-120 seconds with zero data loss for high availability, while Read Replicas offload analytical read queries.',
      whyOthersWrong: [
        'Hourly snapshots entail up to 1 hour of Data Loss (RPO) and manual restoration taking tens of minutes (high RTO).',
        'Running manual DMS replication between standalone RDS instances introduces unnecessary complexity and potential data sync drift.',
        'Read Replicas use asynchronous replication; failing over to a replica risks data loss and requires manual promotion.'
      ],
      decisiveClue: 'Zero data loss Multi-AZ failover paired with offloading read traffic specifies Multi-AZ plus Read Replicas.',
      difficulty: 'intermediate',
      isOriginal: true
    },
    quickRevision: [
      'Multi-AZ = Synchronous replication for high availability / disaster recovery (standby cannot be read).',
      'Read Replicas = Asynchronous replication for scaling read performance (can be promoted to standalone DB).',
      'Point-in-Time Restore (PITR) restores the DB to any second within retention (5 min to 35 days).',
      'Storage auto-scaling expands storage automatically when capacity drops below 10%.'
    ],
    sources: [
      { title: 'Amazon RDS User Guide', url: 'https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Welcome.html' },
      { title: 'RDS Multi-AZ Deployments', url: 'https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZ.html' }
    ],
    searchTerms: ['rds', 'relational database', 'postgres', 'mysql', 'multi-az', 'read replica']
  },
  {
    id: 'aurora',
    name: 'Amazon Aurora',
    shortName: 'Aurora',
    category: 'database',
    difficulty: 'intermediate',
    importance: 'important',
    icon: 'Database',
    tagline: 'High performance managed relational database compatible with MySQL and PostgreSQL',
    mentalModel: 'A next-generation cloud-native database that decouples compute instances from a distributed, self-healing shared storage layer.',
    problemItSolves: 'Overcomes traditional monolithic relational database bottlenecks, delivering up to 5x MySQL and 3x PostgreSQL throughput with sub-minute failovers.',
    howItWorks: 'Separates database compute from storage. Data is striped across a distributed storage fleet that replicates 6 copies across 3 Availability Zones with quorum writes (4/6) and reads (3/6).',
    components: [
      { name: 'Aurora Cluster Volume', description: 'Single shared distributed storage volume automatically scaling up to 128 TB across 3 AZs.' },
      { name: 'Aurora Serverless v2', description: 'Instantly scales compute capacity up and down in fine increments (ACUs) in fractions of a second.' },
      { name: 'Aurora Global Database', description: 'Cross-region replication with typical lag under 1 second and fast failover under 1 minute.' },
      { name: 'Aurora Replicas', description: 'Up to 15 read replicas sharing the same underlying cluster volume with near-zero replication lag (milliseconds).' }
    ],
    realWorldExample: 'A global SaaS enterprise serving millions of users requiring instant autoscaling compute and sub-second cross-continent disaster recovery.',
    whenToUse: [
      'High-throughput MySQL or PostgreSQL workloads exceeding standard RDS performance limits',
      'Applications with unpredictable or variable traffic using Aurora Serverless v2',
      'Global multi-region disaster recovery with RPO < 1 second using Aurora Global Database'
    ],
    whenNotToUse: [
      'Legacy Oracle or Microsoft SQL Server workloads (use RDS Oracle or RDS SQL Server)',
      'Infrequent development test databases where lowest possible flat cost is needed (Aurora has higher minimum hourly costs than micro RDS)',
      'Non-relational document or key-value schemas (use DynamoDB)'
    ],
    practicalImplementation: {
      cli: 'aws rds create-db-cluster --db-cluster-identifier aurora-prod-cluster --engine aurora-postgresql --master-username dbadmin --master-user-password "MasterSecure123!"'
    },
    security: 'Storage encryption with KMS, IAM database authentication, SSL/TLS connections, and automated audit logging to CloudWatch.',
    costDrivers: 'Aurora instance hours (or Aurora Capacity Unit hours for Serverless v2), storage consumed (GB-month), and I/O requests (standard) or fixed I/O optimized tier.',
    limitations: [
      'Only supports MySQL and PostgreSQL compatibility',
      'Higher minimum baseline cost compared to smallest t4g.micro standard RDS instances'
    ],
    commonMistakes: [
      'Connecting to the specific instance endpoint for writes instead of using the Cluster Endpoint (Writer Endpoint)',
      'Connecting read queries to the writer endpoint instead of the Reader Endpoint (load balanced across replicas)',
      'Failing to consider Aurora I/O-Optimized pricing for I/O heavy workloads to eliminate per-request I/O charges'
    ],
    alternatives: [
      { service: 'rds', reason: 'Lower cost entry point and support for Oracle/SQL Server/MariaDB engines' },
      { service: 'dynamodb', reason: 'Extreme horizontal write scaling for simple key-value and JSON document patterns' }
    ],
    relatedServices: ['rds', 'secrets-manager', 'kms', 'vpc'],
    scenarioQuestion: {
      id: 'q-aurora-01',
      question: 'A SaaS platform requires a PostgreSQL database that can automatically scale compute capacity in sub-second increments during unpredictable spikes, while scaling down to minimal footprint during inactive nights. Failover must take under 30 seconds with zero data loss. Which solution should be implemented?',
      type: 'single',
      options: [
        'Amazon Aurora Serverless v2 PostgreSQL cluster across multiple Availability Zones.',
        'Amazon RDS PostgreSQL with an Auto Scaling compute policy on EC2.',
        'Amazon DynamoDB with auto-scaling read/write capacity units.',
        'Self-hosted PostgreSQL on EC2 instances behind an Application Load Balancer.'
      ],
      correctAnswers: [0],
      explanation: 'Amazon Aurora Serverless v2 scales compute instantly in fractions of a second without downtime, supports PostgreSQL, and leverages shared multi-AZ storage for rapid failover.',
      whyOthersWrong: [
        'Amazon RDS PostgreSQL compute scaling requires an instance modification causing a brief failover; it cannot scale dynamically in fractions of a second.',
        'DynamoDB is a NoSQL key-value/document store, not a relational PostgreSQL database.',
        'Self-hosted PostgreSQL on EC2 requires enormous management overhead and cannot scale compute transparently in sub-seconds.'
      ],
      decisiveClue: 'Sub-second dynamic compute scaling with PostgreSQL compatibility points directly to Aurora Serverless v2.',
      difficulty: 'intermediate',
      isOriginal: true
    },
    quickRevision: [
      'Data is replicated 6 ways across 3 Availability Zones (survives loss of 2 copies without write interruption, 3 without read interruption).',
      'Storage automatically scales up to 128 TB in 10 GB increments without provisioning.',
      'Replicas share the same storage volume, resulting in replication lag typically under 10 milliseconds.',
      'Aurora Serverless v2 scales in fine-grained Aurora Capacity Units (ACUs) instantly.'
    ],
    sources: [
      { title: 'Amazon Aurora User Guide', url: 'https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/CHAP_AuroraOverview.html' },
      { title: 'Aurora Serverless v2', url: 'https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2.html' }
    ],
    searchTerms: ['aurora', 'aurora serverless', 'postgresql', 'mysql', 'cluster endpoint', 'global database']
  },
  {
    id: 'dynamodb',
    name: 'Amazon DynamoDB',
    shortName: 'DynamoDB',
    category: 'database',
    difficulty: 'intermediate',
    importance: 'essential',
    icon: 'Database',
    tagline: 'Fast, flexible NoSQL database service for single-digit millisecond performance at any scale',
    mentalModel: 'A massive distributed key-value dictionary that maintains the exact same sub-10ms response time whether storing 10 items or 10 billion items.',
    problemItSolves: 'Solves the horizontal scaling limits, connection pool bottlenecks, and schema rigidities of traditional relational databases under extreme web scale.',
    howItWorks: 'Stores JSON-like items partitioned across solid-state drives using a Partition Key (hash key) and optional Sort Key (range key). Fully managed and serverless with no instances to administer.',
    components: [
      { name: 'Partition Key & Sort Key', description: 'Primary key attributes determining partition placement and item sorting order.' },
      { name: 'Global Secondary Indexes (GSI)', description: 'Indexes with partition/sort keys different from the table, allowing queries across alternate attributes.' },
      { name: 'DynamoDB Streams', description: 'Time-ordered sequence of item-level modifications emitting CDC (Change Data Capture) events to Lambda.' },
      { name: 'DynamoDB Accelerator (DAX)', description: 'In-memory write-through cache providing microsecond response times for read-heavy tables.' }
    ],
    realWorldExample: 'Managing shopping carts, gaming player leaderboards, and user session state for hundreds of millions of concurrent mobile app users.',
    whenToUse: [
      'High-throughput OLTP workloads needing predictable single-digit millisecond latency at any scale',
      'Serverless microservices applications integrated with AWS Lambda and API Gateway',
      'Unstructured or semi-structured data with well-defined, predictable access patterns'
    ],
    whenNotToUse: [
      'Complex ad-hoc SQL queries with arbitrary table joins and multi-attribute filters',
      'Analytical OLAP queries aggregating millions of records (use Redshift or Athena)',
      'Large binary blob storage (store files in S3 and store metadata in DynamoDB)'
    ],
    practicalImplementation: {
      cli: 'aws dynamodb put-item --table-name Users --item "{\"UserId\": {\"S\": \"user_101\"}, \"Name\": {\"S\": \"Jane Doe\"}, \"Role\": {\"S\": \"Admin\"}}"'
    },
    security: 'Granular IAM policies, encryption at rest with KMS, VPC Endpoints, and fine-grained access control using IAM condition keys down to the item/attribute level.',
    costDrivers: 'Read and Write Capacity Units (RCU/WCU for provisioned mode) or per-request charges (On-Demand mode), plus storage volume in GB-month.',
    limitations: [
      'Maximum item size is 400 KB (including attribute names and values)',
      'Query operations can only query against a single Partition Key value; scanning entire tables is slow and costly',
      'Transaction operations consume 2x read/write capacity units'
    ],
    commonMistakes: [
      'Using `Scan` operations in production instead of `Query` on partition keys or secondary indexes',
      'Designing tables with low-cardinality partition keys causing hot partition throttling',
      'Designing relational third-normal-form schemas instead of single-table NoSQL designs'
    ],
    alternatives: [
      { service: 'rds', reason: 'When complex SQL JOINs, transactions, and foreign keys are mandatory' },
      { service: 'documentdb', reason: 'Fully managed MongoDB-compatible document database' },
      { service: 'elasticache', reason: 'Pure in-memory Redis/Memcached cache for sub-millisecond transient caching' }
    ],
    relatedServices: ['lambda', 's3', 'dax', 'kinesis', 'eventbridge'],
    scenarioQuestion: {
      id: 'q-ddb-01',
      question: 'A gaming leaderboard application experiences extreme unpredictable traffic surges when new tournaments launch. Reads and writes must guarantee consistent sub-10ms response times without provisioning excess idle capacity or risking throttling errors. Which DynamoDB configuration meets this requirement?',
      type: 'single',
      options: [
        'Configure the DynamoDB table with On-Demand capacity mode.',
        'Configure Provisioned capacity mode with Auto Scaling target tracking set to 70%.',
        'Deploy DynamoDB Accelerator (DAX) with a single t3.medium node.',
        'Use DynamoDB Global Tables across three regions.'
      ],
      correctAnswers: [0],
      explanation: 'DynamoDB On-Demand capacity mode instantly accommodates sudden, unpredictable traffic spikes without capacity planning, charging strictly per request.',
      whyOthersWrong: [
        'Provisioned Auto Scaling takes minutes to detect alarms and scale up partitions, which will throttle sudden explosive spikes.',
        'DAX caches reads only; it does not solve write throttling during sudden tournament surges.',
        'Global Tables replicate data across regions but do not change table capacity allocation modes.'
      ],
      decisiveClue: 'Instantly accommodating sudden unpredictable traffic surges without throttling points directly to On-Demand capacity mode.',
      difficulty: 'intermediate',
      isOriginal: true
    },
    quickRevision: [
      'Single-digit millisecond latency at any scale; microsecond latency with DAX.',
      'Two capacity modes: On-Demand (pay per request, best for spiky/unknown traffic) and Provisioned (best for predictable workloads).',
      'DynamoDB Streams enables event-driven architecture via AWS Lambda integration (Change Data Capture).',
      'Point-in-Time Recovery (PITR) protects against accidental deletes for 35 days.'
    ],
    sources: [
      { title: 'Amazon DynamoDB Developer Guide', url: 'https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Introduction.html' },
      { title: 'DynamoDB Core Components', url: 'https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.CoreComponents.html' }
    ],
    searchTerms: ['dynamodb', 'nosql', 'key-value', 'single-table design', 'dax', 'streams', 'rcu', 'wcu']
  },
  {
    id: 'elasticache',
    name: 'Amazon ElastiCache',
    shortName: 'ElastiCache',
    category: 'database',
    difficulty: 'intermediate',
    importance: 'important',
    icon: 'Database',
    tagline: 'Fully managed, in-memory caching service compatible with Redis and Memcached',
    mentalModel: 'An ultra-fast in-memory RAM cache positioned in front of your database to answer repetitive queries in sub-millisecond time.',
    problemItSolves: 'Relieves database read pressure and reduces application latency from tens of milliseconds to microseconds.',
    howItWorks: 'Deploys managed in-memory clusters running Redis OSS / Valkey or Memcached engines inside a VPC, handling replication, failover, and hardware management.',
    components: [
      { name: 'ElastiCache for Redis / Valkey', description: 'Feature-rich in-memory data store supporting data persistence, pub/sub, geospatial data, and multi-AZ failover.' },
      { name: 'ElastiCache for Memcached', description: 'Simple, pure multithreaded in-memory object caching for basic key-value strings and objects.' },
      { name: 'ElastiCache Serverless', description: 'Serverless deployment automatically scaling memory and compute with zero cluster management.' },
      { name: 'Cluster Mode', description: 'Redis clustering with automatic sharding across up to 500 shards for massive memory and write scaling.' }
    ],
    realWorldExample: 'Caching popular product catalog queries and storing user login session tokens to achieve sub-millisecond page rendering.',
    whenToUse: [
      'Sub-millisecond read access for frequently accessed database data (Cache-Aside pattern)',
      'Distributed session state storage across web server fleets',
      'Real-time leaderboards, rate limiting counters, and pub/sub message brokers'
    ],
    whenNotToUse: [
      'Primary persistent data store requiring complex SQL joins and strict transactional audit histories',
      'Large binary file storage (use S3)',
      'DynamoDB caching specifically (use DynamoDB Accelerator DAX which requires zero application code changes)'
    ],
    practicalImplementation: {
      cli: 'aws elasticache create-cache-cluster --cache-cluster-id prod-redis --engine redis --cache-node-type cache.t4g.medium --num-cache-nodes 1'
    },
    security: 'VPC private subnet placement, Redis AUTH password token, TLS in-transit encryption, and KMS encryption at rest.',
    costDrivers: 'Cache node instance hours (or data stored in GB-hours for Serverless), and data transfer out of cache.',
    limitations: [
      'Data is stored primarily in volatile RAM; while Redis supports snapshots (RDB) and AOF, it is not a replacement for durable disk databases',
      'ElastiCache clusters are accessible only from within the VPC (no public internet endpoints by design)'
    ],
    commonMistakes: [
      'Treating cache as a permanent durable database without backing it up with a persistent datastore',
      'Not setting proper TTL (Time To Live) on cached keys leading to stale data or out-of-memory eviction issues',
      'Selecting Memcached when replication, multi-AZ failover, or complex data structures are needed (use Redis)'
    ],
    alternatives: [
      { service: 'memorydb', reason: 'Ultra-fast Redis-compatible database with Multi-AZ transactional log durability as primary DB' },
      { service: 'dax', reason: 'Dedicated seamless cache for DynamoDB with microsecond response times' }
    ],
    relatedServices: ['rds', 'dynamodb', 'ec2', 'vpc'],
    scenarioQuestion: {
      id: 'q-elasticache-01',
      question: 'A media streaming application suffers from high RDS database read load and 80ms response times for user homepage feeds. Feeds are read hundreds of times per second but update only once an hour. What should the engineering team implement to reduce database load and latency to under 2ms?',
      type: 'single',
      options: [
        'Deploy an Amazon ElastiCache for Redis cluster and implement the Cache-Aside pattern with a 1-hour TTL.',
        'Increase RDS instance size and add 5 RDS Read Replicas across multiple regions.',
        'Place an Application Load Balancer in front of the RDS database.',
        'Migrate the database to Amazon S3 Standard storage.'
      ],
      correctAnswers: [0],
      explanation: 'ElastiCache stores query results in in-memory RAM, delivering microsecond responses, relieving RDS read contention completely for cached items.',
      whyOthersWrong: [
        'Adding RDS Read Replicas distributes read load but still incurs disk/network database latency (10-30ms) and costs significantly more than in-memory caching.',
        'Application Load Balancers route HTTP traffic to web servers; they cannot front relational SQL database engines.',
        'Amazon S3 is object storage, not a low-latency relational database.'
      ],
      decisiveClue: 'Sub-2ms response time and offloading repetitive read queries points directly to an in-memory ElastiCache layer.',
      difficulty: 'intermediate',
      isOriginal: true
    },
    quickRevision: [
      'Redis = Rich data types (hashes, lists, sets, sorted sets), multi-AZ failover, persistence, pub/sub.',
      'Memcached = Pure simple multithreaded key-value string caching without persistence or replication.',
      'ElastiCache Serverless eliminates cluster sizing and scales automatically.',
      'Always accessible only from within VPC subnets; no public endpoints.'
    ],
    sources: [
      { title: 'Amazon ElastiCache User Guide', url: 'https://docs.aws.amazon.com/AmazonElastiCache/latest/red-ug/WhatIs.html' },
      { title: 'ElastiCache Strategies', url: 'https://aws.amazon.com/caching/best-practices/' }
    ],
    searchTerms: ['elasticache', 'redis', 'memcached', 'in-memory', 'cache', 'sub-millisecond']
  },
  {
    id: 'redshift',
    name: 'Amazon Redshift',
    shortName: 'Redshift',
    category: 'database',
    difficulty: 'advanced',
    importance: 'supporting',
    icon: 'Database',
    tagline: 'Fast, petabyte-scale cloud data warehouse and analytical engine',
    mentalModel: 'A colossal industrial analytics engine with a leader coordinator and dozens of parallel worker nodes crunching massive SQL queries across billions of rows.',
    problemItSolves: 'Executes complex aggregation, reporting, and BI queries across petabytes of structured and semi-structured data where traditional OLTP databases choke.',
    howItWorks: 'Uses Massively Parallel Processing (MPP) and columnar data storage on SSDs with RA3 nodes, separating compute from managed storage and querying data directly in S3 via Redshift Spectrum.',
    components: [
      { name: 'Leader Node', description: 'Coordinates client SQL connections, parses queries, and develops execution plans for compute nodes.' },
      { name: 'Compute Nodes', description: 'Executes compiled query code in parallel across partitioned data slices.' },
      { name: 'Redshift Spectrum', description: 'Executes queries directly against exabytes of unstructured/structured data in Amazon S3 without loading.' },
      { name: 'Redshift Serverless', description: 'Automatically provisions and scales warehouse capacity (RPUs) without cluster management.' }
    ],
    realWorldExample: 'A retail giant querying historical transactional data across 10 years of sales records to generate quarterly financial forecasting reports.',
    whenToUse: [
      'Enterprise cloud data warehousing and Business Intelligence (BI) reporting across petabytes',
      'Massive columnar aggregations (SUM, AVG, COUNT) across millions or billions of rows',
      'Lakehouse architecture combining local warehouse tables with vast Amazon S3 data lake data'
    ],
    whenNotToUse: [
      'High-throughput Online Transaction Processing (OLTP) with frequent single-row INSERT/UPDATE/DELETE (use RDS or DynamoDB)',
      'Ad-hoc serverless querying on small S3 datasets where running a full warehouse is unnecessary (use Amazon Athena)',
      'Real-time sub-second operational dashboard caching (use OpenSearch or ElastiCache)'
    ],
    practicalImplementation: {
      cli: 'aws redshift create-cluster --cluster-identifier analytics-warehouse --node-type ra3.4xlarge --number-of-nodes 2 --master-username adminuser --master-user-password "MasterAnalytics2026!"'
    },
    security: 'KMS hardware encryption at rest, VPC isolation, IAM role credentialing, column-level and row-level access control security.',
    costDrivers: 'Node hours for provisioned clusters (RA3 instances) or Redshift Processing Unit (RPU) hours for Serverless, plus managed storage.',
    limitations: [
      'Poor performance on single-row OLTP transactions; optimized specifically for batch analytical workloads',
      'Concurrent query limits require Workload Management (WLM) queue configuration to prevent query starvation'
    ],
    commonMistakes: [
      'Treating Redshift like an OLTP database by running thousands of individual single-record INSERT statements (use `COPY` command from S3)',
      'Choosing wrong Distribution Keys (DISTKEY) and Sort Keys (SORTKEY) leading to massive data shuffling across nodes during joins',
      'Leaving VACUUM and ANALYZE unmanaged on legacy clusters'
    ],
    alternatives: [
      { service: 'athena', reason: 'Zero-infrastructure serverless interactive SQL querying directly on S3 on-demand' },
      { service: 'rds', reason: 'Standard OLTP relational database for daily transactional business applications' }
    ],
    relatedServices: ['s3', 'athena', 'quicksight', 'glue', 'dms'],
    scenarioQuestion: {
      id: 'q-redshift-01',
      question: 'A data analytics team needs to ingest hundreds of gigabytes of CSV logs arriving hourly into an Amazon Redshift cluster. What is the most performant and recommended approach to load this data into a Redshift table?',
      type: 'single',
      options: [
        'Use the Redshift `COPY` command to load files in parallel directly from Amazon S3.',
        'Run a Python script executing sequential multi-row `INSERT` statements over JDBC.',
        'Use an AWS Lambda function to parse each CSV line and call the Redshift Data API.',
        'Mount an Amazon EFS file system directly to the Redshift leader node and run SQL imports.'
      ],
      correctAnswers: [0],
      explanation: 'The Redshift `COPY` command leverages Massively Parallel Processing (MPP) to read and ingest data files in parallel across all compute node slices from Amazon S3.',
      whyOthersWrong: [
        'Sequential INSERT statements funnel all traffic through the single Leader node, causing severe bottlenecks and terrible performance.',
        'Lambda parsing single rows into the Data API violates Redshift columnar MPP ingestion design principles.',
        'Redshift does not support mounting external EFS filesystems directly to compute nodes.'
      ],
      decisiveClue: 'High-speed parallel ingestion of bulk files from S3 into Redshift requires the COPY command.',
      difficulty: 'advanced',
      isOriginal: true
    },
    quickRevision: [
      'MPP (Massively Parallel Processing) + Columnar storage = extreme analytical performance.',
      'RA3 nodes decouple compute from storage using AWS managed storage.',
      'Always use `COPY` from S3 to load data in parallel across all node slices.',
      'Redshift Spectrum queries open data lake formats (Parquet, ORC, CSV) in S3 without loading.'
    ],
    sources: [
      { title: 'Amazon Redshift Database Developer Guide', url: 'https://docs.aws.amazon.com/redshift/latest/dg/welcome.html' },
      { title: 'Redshift Best Practices for Designing Tables', url: 'https://docs.aws.amazon.com/redshift/latest/dg/c_designing-tables-best-practices.html' }
    ],
    searchTerms: ['redshift', 'data warehouse', 'columnar', 'mpp', 'copy command', 'spectrum', 'olap']
  }
];
