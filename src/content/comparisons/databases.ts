import { Comparison } from '../../types';

export const databasesComparisons: Comparison[] = [
  {
    id: 'rds-vs-dynamodb',
    title: 'RDS vs DynamoDB',
    category: 'Databases',
    serviceA: 'Amazon RDS',
    serviceB: 'Amazon DynamoDB',
    problem: 'Selecting between managed relational SQL databases and serverless NoSQL key-value/document stores.',
    decisiveDifferences: [
      'Data Model & Schema: RDS provides structured relational tables with strict SQL schemas, foreign keys, and complex multi-table JOINs; DynamoDB is a schema-less NoSQL key-value and document store optimized for single-table access patterns without SQL JOINs.',
      'Scaling Model: RDS scales vertically by changing instance sizes (with horizontal read scaling via Read Replicas); DynamoDB scales horizontally and partition-wide automatically to unlimited throughput and storage with consistent single-digit millisecond latency.',
      'Management & Server Model: RDS manages instances, operating system patches, and DB parameters on provisioned virtual servers; DynamoDB is 100% serverless with zero instances, maintenance windows, or storage provisioning required.',
      'ACID & Transactions: RDS natively supports complex multi-row ACID transactions with relational constraints; DynamoDB supports ACID transactions across items via `TransactWriteItems` / `TransactGetItems`, but has item size limits (400 KB max per item).'
    ],
    whenToChooseA: [
      'Applications requiring complex relational queries, aggregate calculations, dynamic sorting, and multi-table JOINs.',
      'Migrating existing legacy systems built on PostgreSQL, MySQL, MariaDB, Oracle, or Microsoft SQL Server.',
      'Workloads where schema evolution is unpredictable and ad-hoc analytical queries are frequent.'
    ],
    whenToChooseB: [
      'High-throughput web/mobile applications requiring single-digit millisecond response times at any scale (shopping carts, session states, gaming leaderboards).',
      'Event-driven serverless architectures built with AWS Lambda.',
      'Unstructured or semi-structured JSON documents with well-defined primary key query patterns.'
    ],
    workTogether: 'An e-commerce platform uses Amazon DynamoDB to handle millions of rapid, concurrent shopping cart operations and user session lookups, while storing completed orders, tax computations, and relational customer accounts in Amazon RDS PostgreSQL.',
    tradeoffs: [
      {
        dimension: 'Data Structure & Querying',
        optionA: 'Relational SQL tables; supports complex JOINs and arbitrary WHERE clauses.',
        optionB: 'Key-value / document; queries restricted to Partition Key and Sort Key indexes.'
      },
      {
        dimension: 'Scaling Ceiling',
        optionA: 'Bounded by instance CPU/RAM ceiling (vertical scaling limit).',
        optionB: 'Virtually unlimited horizontal partitioning with predictable millisecond latency.'
      },
      {
        dimension: 'Operational Model',
        optionA: 'Managed instance (requires instance sizing, engine version upgrades).',
        optionB: 'Serverless (no instances, no maintenance windows, pay per request or provisioned capacity).'
      },
      {
        dimension: 'Item / Row Size Limit',
        optionA: 'Large rows/pages supported depending on engine (gigabytes via BLOB/TOAST).',
        optionB: 'Strict 400 KB maximum size limit per individual item.'
      }
    ],
    scenario: 'A mobile gaming company stores live player telemetry, session tokens, and game state updates in DynamoDB for ultra-fast low-latency performance. Once a day, aggregated summary logs are loaded into an RDS MySQL database for internal financial and business reporting.',
    question: {
      id: 'quiz-rds-vs-dynamodb-1',
      question: 'A mobile application requires a database to store user authentication sessions and shopping carts. The traffic fluctuates violently between 100 and 200,000 requests per second. The application requires consistent single-digit millisecond read/write latency without managing database servers or connection pooling. Which database is optimal?',
      type: 'single',
      options: [
        'Amazon RDS for MySQL with Multi-AZ',
        'Amazon DynamoDB with On-Demand capacity',
        'Amazon RDS for PostgreSQL with 5 Read Replicas',
        'Amazon Redshift Serverless'
      ],
      correctAnswers: [1],
      explanation: 'Amazon DynamoDB is a fully serverless NoSQL database that automatically handles extreme throughput scaling (from 100 to 200k RPS) with predictable single-digit millisecond latency without requiring connection pooling or server management.',
      whyOthersWrong: [
        'RDS MySQL requires database server sizing, connection poolers (RDS Proxy), and struggles with extreme instant traffic spikes without lag.',
        'RDS PostgreSQL Read Replicas only scale read traffic, not write traffic, and still require connection management.',
        'Amazon Redshift is an analytical data warehouse, not a high-speed transactional key-value session store.'
      ],
      decisiveClue: 'Violent fluctuations from 100 to 200,000 RPS, single-digit millisecond latency, no server management or connection pooling.',
      difficulty: 'beginner',
      isOriginal: true,
      source: 'Original AWS certification-style practice question'
    },
    sources: [
      { title: 'Amazon DynamoDB Developer Guide', url: 'https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Introduction.html' },
      { title: 'Amazon RDS User Guide', url: 'https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Welcome.html' }
    ]
  },
  {
    id: 'rds-multiaz-vs-replicas',
    title: 'RDS Multi-AZ vs Read Replicas',
    category: 'Databases',
    serviceA: 'RDS Multi-AZ Deployment',
    serviceB: 'RDS Read Replicas',
    problem: 'Distinguishing between high-availability disaster recovery and horizontal read scaling in relational database architectures.',
    decisiveDifferences: [
      'Primary Purpose: Multi-AZ is designed for High Availability (HA) and disaster recovery; Read Replicas are designed for Performance and Horizontal Read Scaling.',
      'Replication Mode: Multi-AZ uses synchronous physical block-level replication (zero data loss on failover); Read Replicas use asynchronous engine-level replication (subject to replication lag).',
      'Database Accessibility: Multi-AZ standby replica is passive and CANNOT accept read or write queries (unless using Multi-AZ DB Cluster with two readable standbys); Read Replicas are active and readable, handling SELECT queries.',
      'Failover Automation: Multi-AZ automatically detects primary instance crashes and fails over in 60-120 seconds by repointing the DB DNS endpoint; standard Read Replicas require manual or scripted promotion to primary status.'
    ],
    whenToChooseA: [
      'Production relational databases requiring high availability and automatic failover during AZ outages or hardware faults.',
      'Minimizing downtime during routine engine maintenance and operating system patching.',
      'Workloads where zero data loss (RPO = 0) is required during infrastructure failure.'
    ],
    whenToChooseB: [
      'Read-heavy applications where read queries saturate the primary database CPU (e.g., reporting dashboards, analytics queries).',
      'Geographical read performance optimization using Cross-Region Read Replicas.',
      'Offloading heavy batch exports or read queries without impacting primary write performance.'
    ],
    workTogether: 'Production architectures combine both: A primary RDS instance has a synchronous standby in another AZ for automatic Multi-AZ high availability failover, and maintains two asynchronous Read Replicas to handle high-volume read traffic from application servers.',
    tradeoffs: [
      {
        dimension: 'Main Objective',
        optionA: 'High availability and disaster recovery.',
        optionB: 'Read scaling and performance offloading.'
      },
      {
        dimension: 'Replication Mechanism',
        optionA: 'Synchronous (strong consistency, no data loss).',
        optionB: 'Asynchronous (eventual consistency, replication lag possible).'
      },
      {
        dimension: 'Standby Readability',
        optionA: 'Cannot be queried (passive standby in standard Multi-AZ).',
        optionB: 'Actively accessible for read-only SQL queries.'
      },
      {
        dimension: 'Failover Behavior',
        optionA: 'Automatic DNS switchover in 60-120 seconds.',
        optionB: 'Manual promotion required to become a standalone read/write DB.'
      }
    ],
    scenario: 'A news website uses an RDS Multi-AZ deployment to guarantee 99.95% uptime for user subscriptions and journalist publishing. When breaking news causes 50,000 readers to query articles simultaneously, the web servers route all SELECT queries to three Read Replicas.',
    question: {
      id: 'quiz-rds-multiaz-vs-replicas-1',
      question: 'A database administrator notices that the primary Amazon RDS PostgreSQL database instance is experiencing 95% CPU utilization due to a high volume of read-only analytical queries generated by the marketing team. Writes to the database are normal. What is the most appropriate architecture change?',
      type: 'single',
      options: [
        'Enable Multi-AZ deployment on the RDS instance',
        'Create an RDS Read Replica and direct the marketing analytical queries to its endpoint',
        'Upgrade the primary instance to an Amazon Aurora Serverless cluster with Multi-AZ standby',
        'Deploy a NAT Gateway between the marketing team and the primary database'
      ],
      correctAnswers: [1],
      explanation: 'RDS Read Replicas are specifically designed to offload read-heavy traffic from the primary instance. Directing read-only marketing queries to the replica relieves CPU saturation on the primary without requiring an instance upgrade.',
      whyOthersWrong: [
        'Multi-AZ creates a synchronous passive standby instance that cannot accept read queries and will not reduce primary CPU load.',
        'Migrating to Aurora may help but is far more disruptive and complex than simply provisioning a standard RDS Read Replica.',
        'A NAT Gateway handles outbound internet networking and has no impact on database query processing.'
      ],
      decisiveClue: 'Primary RDS CPU at 95% due to read-only queries with normal write volume.',
      difficulty: 'beginner',
      isOriginal: true,
      source: 'Original AWS certification-style practice question'
    },
    sources: [
      { title: 'Amazon RDS Multi-AZ Deployments', url: 'https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZ.html' },
      { title: 'Working with RDS Read Replicas', url: 'https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_ReadRepl.html' }
    ]
  },
  {
    id: 'rds-vs-aurora',
    title: 'RDS vs Aurora',
    category: 'Databases',
    serviceA: 'Amazon RDS (Standard Engines)',
    serviceB: 'Amazon Aurora',
    problem: 'Deciding between standard community database engines (PostgreSQL, MySQL) and AWS cloud-native distributed database architecture.',
    decisiveDifferences: [
      'Storage Architecture: Standard RDS uses EBS volumes attached to the DB instance; Aurora uses a distributed, log-structured, shared storage tier replicated 6 times across 3 Availability Zones that automatically grows up to 128 TiB.',
      'Replication Performance: Standard RDS Read Replicas use MySQL/PostgreSQL asynchronous binlog/WAL replication with separate EBS volumes and noticeable lag; Aurora Read Replicas share the same distributed storage volume with single-digit millisecond replication lag.',
      'Throughput & Performance: Aurora delivers up to 5x the throughput of standard MySQL and up to 3x the throughput of standard PostgreSQL on equivalent hardware due to offloading logging to the storage fleet.',
      'Replica Limits & Failover: Standard RDS supports up to 5 read replicas with 60-120s failover; Aurora supports up to 15 auto-scaling read replicas with failover under 30 seconds and automatic cluster endpoints.'
    ],
    whenToChooseA: [
      'Cost-conscious workloads, small development databases, or low-throughput applications where base Aurora minimum costs are prohibitive.',
      'Requiring database engines other than MySQL or PostgreSQL (e.g., Oracle, Microsoft SQL Server, MariaDB).',
      'Applications with standard performance requirements that easily fit within standard RDS gp3/io2 capabilities.'
    ],
    whenToChooseB: [
      'High-throughput enterprise production workloads needing maximum MySQL or PostgreSQL performance.',
      'Systems requiring near-instant failover (<30 seconds) and virtually zero replication lag (<10 ms).',
      'Workloads with highly variable traffic that benefit from Aurora Serverless v2 fine-grained auto-scaling (in 0.5 ACU increments).',
      'Globally distributed read databases requiring Aurora Global Database (<1 second cross-region replication).'
    ],
    workTogether: 'Organizations commonly use standard RDS MySQL or PostgreSQL for non-critical internal tools and development environments to save costs, while running their primary revenue-generating core platform on Amazon Aurora.',
    tradeoffs: [
      {
        dimension: 'Storage Resilience',
        optionA: 'Single EBS volume (Multi-AZ mirrors to a second EBS volume in 2 AZs).',
        optionB: 'Shared 6-way distributed replication across 3 AZs automatically.'
      },
      {
        dimension: 'Throughput Multiplier',
        optionA: 'Baseline open-source community engine performance.',
        optionB: 'Up to 5x MySQL and 3x PostgreSQL throughput.'
      },
      {
        dimension: 'Replica Scalability',
        optionA: 'Up to 5 read replicas (each with dedicated EBS volume).',
        optionB: 'Up to 15 auto-scaling read replicas sharing the same storage pool.'
      },
      {
        dimension: 'Cost Baseline',
        optionA: 'Lower entry cost (supports micro/small instances, cheap gp3 volumes).',
        optionB: 'Higher baseline cost due to specialized distributed architecture.'
      }
    ],
    scenario: 'An enterprise SaaS company outgrows their standard RDS MySQL instance due to frequent binlog replication lag crashes during peak billing runs. Migrating to Amazon Aurora MySQL eliminates replication lag and reduces failover recovery time from 2 minutes to 15 seconds.',
    question: {
      id: 'quiz-rds-vs-aurora-1',
      question: 'A company operates a critical PostgreSQL database that experiences severe replication lag on read replicas during high write bursts. The business requires near-instantaneous replica synchronization (under 20 milliseconds), up to 15 read replicas with automatic scaling, and storage that automatically expands up to 128 TiB. Which database engine satisfies these needs?',
      type: 'single',
      options: [
        'Amazon RDS for PostgreSQL with io2 Block Express storage',
        'Amazon Aurora PostgreSQL-Compatible Edition',
        'Amazon RDS for MariaDB with Multi-AZ Cluster',
        'Amazon DynamoDB with DynamoDB Accelerator (DAX)'
      ],
      correctAnswers: [1],
      explanation: 'Amazon Aurora PostgreSQL features a purpose-built distributed storage engine replicated across 3 AZs. Aurora replicas read directly from the shared storage tier with replication lag typically under 10-20 ms, supports up to 15 replicas, and auto-expands storage up to 128 TiB.',
      whyOthersWrong: [
        'Standard RDS PostgreSQL is capped at 5 read replicas and uses standard WAL replication over network connections, which suffers from replication lag during write bursts.',
        'Amazon RDS for MariaDB is MySQL-compatible, not PostgreSQL-compatible, and is capped at 5 replicas.',
        'DynamoDB is a NoSQL key-value store, not a drop-in relational PostgreSQL database engine.'
      ],
      decisiveClue: 'PostgreSQL database, <20 ms replication lag, up to 15 auto-scaling read replicas, auto-expanding storage up to 128 TiB.',
      difficulty: 'intermediate',
      isOriginal: true,
      source: 'Original AWS certification-style practice question'
    },
    sources: [
      { title: 'Amazon Aurora Product Details', url: 'https://aws.amazon.com/rds/aurora/' },
      { title: 'Comparing Aurora and RDS', url: 'https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora.Overview.html' }
    ]
  },
  {
    id: 'elasticache-vs-no-cache',
    title: 'ElastiCache vs No Separate Cache',
    category: 'Databases',
    serviceA: 'Amazon ElastiCache (Redis / Memcached)',
    serviceB: 'Direct Database Queries (No Cache)',
    problem: 'Evaluating whether to introduce an in-memory caching tier in front of persistent database storage.',
    decisiveDifferences: [
      'Latency Profile: ElastiCache serves cached data from RAM with microsecond response times (0.1 - 0.5 ms); direct relational or NoSQL database queries read from disk/buffer pools with millisecond latencies (2 - 20 ms).',
      'Database Load & Offloading: An in-memory cache shields the persistent database from absorbing repetitive read queries, preventing database CPU saturation and connection exhaustion; querying the database directly requires provisioning larger database instances to handle peak read spikes.',
      'Architectural Complexity: Introducing a cache requires implementing cache invalidation strategies (Cache-Aside, Write-Through, TTLs) and handling cache stampedes / thundering herd problems; direct database queries guarantee immediate read-after-write consistency with zero cache drift.',
      'Cost Impact: ElastiCache adds dedicated cluster costs, but frequently enables downsizing expensive primary database instances, leading to net cost reductions for read-heavy workloads.'
    ],
    whenToChooseA: [
      'Read-heavy applications (>80% reads) where the same data is repeatedly fetched by many users (e.g., top news articles, product catalogs, user profiles).',
      'Applications requiring sub-millisecond response times for real-time leaderboards, session states, or pub/sub messaging.',
      'Relational databases running near 100% CPU capacity due to repetitive complex SELECT queries.'
    ],
    whenToChooseB: [
      'Write-heavy workloads where data changes continuously and cached entries would be invalidated before being read.',
      'Small applications or early-stage MVPs where operational simplicity and strict consistency are prioritized over microsecond performance.',
      'Workloads where database query latency is already well within SLA and database utilization is low (<20%).'
    ],
    workTogether: 'In a classic Cache-Aside (Lazy Loading) architecture, the application checks Amazon ElastiCache first: on a cache hit, it returns immediately in microseconds; on a cache miss, it queries Amazon RDS, populates ElastiCache with a TTL, and returns the result, minimizing database strain.',
    tradeoffs: [
      {
        dimension: 'Read Latency',
        optionA: 'Microseconds (sub-millisecond in-memory RAM lookup).',
        optionB: 'Milliseconds (disk/buffer pool lookup over database engine).'
      },
      {
        dimension: 'Data Consistency Risk',
        optionA: 'Stale data possible if invalidation logic or TTLs are misconfigured.',
        optionB: 'Strict consistency; queries always return current committed state.'
      },
      {
        dimension: 'Engineering Complexity',
        optionA: 'Higher: requires cache invalidation logic, connection handling, and eviction policies.',
        optionB: 'Lower: application queries database directly using standard ORM/SQL.'
      }
    ],
    scenario: 'An online ticketing platform experiences database lockups whenever high-demand concert tickets go on sale because 200,000 users refresh event metadata simultaneously. Placing Amazon ElastiCache in front of RDS absorbs 98% of read queries, allowing the database to handle checkout transactions smoothly.',
    question: {
      id: 'quiz-elasticache-vs-no-cache-1',
      question: 'An e-commerce homepage issues 10 identical SQL queries to fetch navigation categories and featured products on every page load. The primary RDS database is struggling with CPU saturation during peak hours. What architectural pattern best addresses this issue with minimal database disruption?',
      type: 'single',
      options: [
        'Upgrade the RDS instance to a larger instance class with Provisioned IOPS',
        'Implement Amazon ElastiCache using a Cache-Aside pattern with appropriate TTLs',
        'Migrate the database tables to Amazon Redshift',
        'Place an Application Load Balancer directly in front of the RDS database'
      ],
      correctAnswers: [1],
      explanation: 'Implementing Amazon ElastiCache with a Cache-Aside pattern allows the application to serve repeated static queries from in-memory cache in sub-milliseconds, offloading repetitive read pressure from the RDS database.',
      whyOthersWrong: [
        'Upgrading RDS increases ongoing infrastructure costs without fixing the root architectural inefficiency of repetitive queries.',
        'Amazon Redshift is an analytical data warehouse for complex OLAP queries, not an operational web cache.',
        'Application Load Balancers route HTTP/HTTPS traffic to compute targets, not direct SQL database connections.'
      ],
      decisiveClue: 'Identical SQL queries repeatedly fetched on every page load causing RDS CPU saturation.',
      difficulty: 'intermediate',
      isOriginal: true,
      source: 'Original AWS certification-style practice question'
    },
    sources: [
      { title: 'Amazon ElastiCache Documentation', url: 'https://docs.aws.amazon.com/AmazonElastiCache/latest/red-ug/WhatIs.html' },
      { title: 'Database Caching Strategies with Redis', url: 'https://aws.amazon.com/caching/best-practices/' }
    ]
  },
  {
    id: 'oltp-vs-warehouse',
    title: 'OLTP Databases vs Data Warehouses',
    category: 'Databases',
    serviceA: 'OLTP Databases (Amazon RDS / Aurora)',
    serviceB: 'Data Warehouses (Amazon Redshift)',
    problem: 'Selecting the optimal database engine for real-time online transaction processing versus large-scale historical analytical reporting.',
    decisiveDifferences: [
      'Data Storage Architecture: OLTP databases store data in row-oriented formats optimized for rapid single-row inserts, updates, and deletes (`INSERT INTO users ...`); Redshift stores data in columnar formats with block-level compression optimized for scanning millions of rows across few columns (`SELECT AVG(spend) FROM sales GROUP BY region`).',
      'Query Processing Engine: OLTP systems process high-frequency, simple concurrent transactions with low latency; Redshift uses Massively Parallel Processing (MPP) distributing analytical query execution across multiple compute nodes.',
      'Concurrency vs Query Complexity: OLTP handles thousands of concurrent short-lived queries per second; Redshift is designed for complex analytical queries joining tens of millions of historical rows with lower concurrent query throughput.',
      'Write Patterns: OLTP excels at continuous, incremental single-record transactions; Redshift performs best with bulk data ingestion (`COPY` command from S3) and suffers performance degradation if subjected to continuous single-row `INSERT` statements.'
    ],
    whenToChooseA: [
      'Customer-facing operational applications, checkout flows, user profiles, inventory updates, and banking ledgers.',
      'Workloads requiring rapid sub-10ms response times for point lookups and single-row ACID transactions.',
      'High-concurrency systems handling thousands of simultaneous user read/write connections.'
    ],
    whenToChooseB: [
      'Enterprise Business Intelligence (BI), reporting dashboards, financial projections, and historical trend analysis.',
      'Complex analytical SQL queries scanning terabytes or petabytes of multi-year operational data.',
      'Aggregating disparate data sources from multiple production databases into a centralized corporate data warehouse.'
    ],
    workTogether: 'Production transactional systems write real-time orders to Amazon Aurora (OLTP). AWS Database Migration Service (DMS) or Amazon Aurora Zero-ETL automatically replicates transactional data into Amazon Redshift (OLAP), where data analysts run multi-year analytics queries without impacting production transactional performance.',
    tradeoffs: [
      {
        dimension: 'Storage Format',
        optionA: 'Row-based: Ideal for retrieving/modifying entire individual records.',
        optionB: 'Columnar: Ideal for aggregating specific columns across millions of rows.'
      },
      {
        dimension: 'Concurrency Model',
        optionA: 'High concurrency: Thousands of lightweight transactions per second.',
        optionB: 'Lower concurrency: Tens of complex analytical queries running in parallel.'
      },
      {
        dimension: 'Write Ingestion Model',
        optionA: 'Real-time single-row ACID transactions.',
        optionB: 'Batch bulk-loading via S3 COPY command or Zero-ETL pipelines.'
      }
    ],
    scenario: 'A retail chain records every register sale in Amazon Aurora PostgreSQL (OLTP) within 5 milliseconds. Every night, sales records are ingested into Amazon Redshift, where executives run complex analytical queries to compute regional revenue trends over the past five years.',
    question: {
      id: 'quiz-oltp-vs-warehouse-1',
      question: 'A company needs to run daily business intelligence reports that aggregate 5 years of historical order data totaling 40 TB. Queries perform multi-table JOINs and column aggregations across millions of rows. Running these reports on the operational PostgreSQL database causes severe slowdowns for active shoppers. Which service should host the reporting data?',
      type: 'single',
      options: [
        'Amazon RDS for PostgreSQL with Read Replicas',
        'Amazon Redshift',
        'Amazon ElastiCache for Redis',
        'Amazon DynamoDB'
      ],
      correctAnswers: [1],
      explanation: 'Amazon Redshift is a purpose-built columnar data warehouse designed for large-scale analytical (OLAP) queries across terabytes of historical data. Its MPP architecture scans and aggregates millions of rows efficiently without impacting operational systems.',
      whyOthersWrong: [
        'RDS Read Replicas still use row-based storage and can struggle with massive 40 TB analytical aggregations, while incurring high storage costs.',
        'ElastiCache is an in-memory key-value cache and cannot execute complex analytical SQL joins across 40 TB of historical tabular data.',
        'DynamoDB is a NoSQL key-value/document database and does not support complex analytical multi-table JOIN queries across historical data.'
      ],
      decisiveClue: 'Aggregating 5 years of historical data (40 TB) with multi-table JOINs and columnar aggregations.',
      difficulty: 'intermediate',
      isOriginal: true,
      source: 'Original AWS certification-style practice question'
    },
    sources: [
      { title: 'Amazon Redshift Getting Started', url: 'https://docs.aws.amazon.com/redshift/latest/gsg/getting-started.html' },
      { title: 'OLTP vs OLAP Architecture Overview', url: 'https://aws.amazon.com/compare/the-difference-between-olap-and-oltp/' }
    ]
  }
];
