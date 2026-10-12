import { AWSService } from '../../types';

export const monitoringServices: AWSService[] = [
  {
    id: 'cloudwatch',
    name: 'Amazon CloudWatch',
    shortName: 'CloudWatch',
    category: 'monitoring',
    difficulty: 'intermediate',
    importance: 'essential',
    icon: 'Monitoring',
    tagline: 'Observability and monitoring service for AWS cloud resources and applications',
    mentalModel: 'The central nervous system and telemetry dashboard of AWS, collecting metrics, logs, and alarms to keep systems healthy and automated.',
    problemItSolves: 'Provides unified visibility into operational performance, resource utilization, application health, and automated scaling triggers.',
    howItWorks: 'Collects metrics (numerical data over time), logs (timestamped text events), and traces, allowing you to visualize dashboards, configure alarms, and automate event responses.',
    components: [
      { name: 'CloudWatch Metrics', description: 'Time-ordered data points (CPU, network, disk) emitted by AWS services or custom application metrics.' },
      { name: 'CloudWatch Logs & Logs Insights', description: 'Centralized log aggregation engine supporting high-speed interactive SQL-like log queries.' },
      { name: 'CloudWatch Alarms', description: 'Triggers actions (SNS notifications, EC2 auto scaling, EC2 recovery) when metrics breach thresholds.' },
      { name: 'CloudWatch Synthetics & Evidentiary RUM', description: 'Canary testing running headless browsers to monitor API endpoints and end-user real user latency.' }
    ],
    realWorldExample: 'Alerting engineers via PagerDuty/SNS when API 5XX error rates exceed 2% over 5 minutes and triggering an EC2 Auto Scaling scale-out action.',
    whenToUse: [
      'Core monitoring and alerting across all AWS compute, database, and storage resources',
      'Centralized application and system log aggregation using CloudWatch Unified Agent',
      'Driving Auto Scaling policies based on custom application metrics or standard utilization'
    ],
    whenNotToUse: [
      'Auditing control plane API operations and user identity governance (use AWS CloudTrail)',
      'Long-term open-source metric analysis where Prometheus / PromQL standards are required (use Amazon Managed Prometheus)'
    ],
    practicalImplementation: {
      cli: 'aws cloudwatch put-metric-alarm --alarm-name HighCPUAlarm --metric-name CPUUtilization --namespace AWS/EC2 --statistic Average --period 300 --threshold 80 --comparison-operator GreaterThanOrEqualToThreshold --evaluation-periods 2'
    },
    security: 'VPC private endpoints, KMS encryption for log groups, and IAM resource policies governing log query access.',
    costDrivers: 'Log ingestion ($/GB), log archival storage ($/GB-month), custom metrics ($/metric/month), and alarm evaluations.',
    limitations: [
      'Standard metrics arrive at 5-minute resolution (Detailed Monitoring enables 1-minute resolution for an extra charge)',
      'High-cardinality custom dimensions can generate thousands of metrics and substantial unexpected costs',
      'Default log retention is indefinite unless explicitly configured on the log group'
    ],
    commonMistakes: [
      'Leaving Log Group retention set to "Never Expire", accumulating gigabytes of unnecessary old logs and storage costs',
      'Confusing CloudWatch (performance metrics and logs) with CloudTrail (API auditing)',
      'Forgetting that memory utilization on EC2 is NOT tracked by default and requires the CloudWatch Unified Agent'
    ],
    alternatives: [
      { service: 'amp', reason: 'Managed Prometheus for open-source PromQL metric ingestion at Kubernetes scale' },
      { service: 'datadog', reason: 'Third-party unified SaaS observability platform' }
    ],
    relatedServices: ['cloudtrail', 'sns', 'auto-scaling', 'xray', 'systems-manager'],
    scenarioQuestion: {
      id: 'q-cw-01',
      question: 'A systems administrator notices that EC2 instance CPU utilization and network metrics are visible in the CloudWatch console, but OS-level Memory utilization and free disk space are completely missing. What is required to collect memory metrics?',
      type: 'single',
      options: [
        'Install and configure the unified Amazon CloudWatch Agent on the EC2 instances with appropriate IAM permissions.',
        'Enable Detailed Monitoring in the EC2 instance settings.',
        'Upgrade EC2 instances to the latest Nitro hardware generation.',
        'Attach an AWS Systems Manager Automation document to run every 5 minutes.'
      ],
      correctAnswers: [0],
      explanation: 'The EC2 hypervisor only has visibility into CPU and network metrics. Operating system memory and disk space reside inside the guest OS and require the CloudWatch Agent to report them as custom metrics.',
      whyOthersWrong: [
        'Detailed Monitoring only increases frequency of existing hypervisor metrics from 5 minutes to 1 minute; it does not collect guest OS memory.',
        'Nitro hardware does not bypass guest OS memory isolation.',
        'Running manual SSM automation scripts is an unmanaged anti-pattern compared to the official continuous CloudWatch Agent.'
      ],
      decisiveClue: 'Collecting guest OS memory and disk utilization metrics on EC2 requires the Amazon CloudWatch Agent.',
      difficulty: 'intermediate',
      isOriginal: true
    },
    quickRevision: [
      'Standard EC2 monitoring = 5-minute intervals; Detailed monitoring = 1-minute intervals.',
      'Memory and disk metrics require the CloudWatch Unified Agent inside the OS.',
      'Always configure a Log Retention policy on Log Groups (default is "Never Expire").',
      'CloudWatch Logs Insights provides fast SQL-like queries across terabytes of log data.'
    ],
    sources: [
      { title: 'Amazon CloudWatch User Guide', url: 'https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/WhatIsCloudWatch.html' },
      { title: 'CloudWatch Agent Metrics', url: 'https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/metrics-collected-by-CloudWatch-agent.html' }
    ],
    searchTerms: ['cloudwatch', 'metrics', 'logs', 'alarms', 'cloudwatch agent', 'logs insights', 'observability']
  },
  {
    id: 'xray',
    name: 'AWS X-Ray',
    shortName: 'X-Ray',
    category: 'monitoring',
    difficulty: 'intermediate',
    importance: 'important',
    icon: 'Monitoring',
    tagline: 'Analyze and debug distributed production microservices and serverless architectures',
    mentalModel: 'A medical X-ray machine for software, following an individual user request through all your microservices, databases, and APIs to pinpoint exactly where latency occurs.',
    problemItSolves: 'Pinpoints latency bottlenecks, downstream service errors, and timeouts in distributed microservice and serverless systems.',
    howItWorks: 'Propagates a trace ID header (`X-Amzn-Trace-Id`) across HTTP request chains, collects segments and subsegments from instrumented SDKs, and constructs a visual service map.',
    components: [
      { name: 'Trace ID', description: 'Unique identifier propagated across service boundaries to correlate downstream requests.' },
      { name: 'Service Map', description: 'Visual dependency graph showing interconnected services, error percentages, and average latency.' },
      { name: 'Segments & Subsegments', description: 'Detailed timing breakdowns of database queries, HTTP calls, and internal compute blocks.' },
      { name: 'Sampling Rules', description: 'Controls the percentage of requests recorded to balance statistical significance and cost.' }
    ],
    realWorldExample: 'Investigating why a checkout API takes 4.2 seconds to complete, discovering that a specific third-party payment gateway subsegment takes 3.8 seconds.',
    whenToUse: [
      'End-to-end distributed tracing across microservices, Lambda functions, and containerized apps',
      'Visualizing architecture service dependencies and error propagation with Service Maps',
      'Diagnosing performance latency bottlenecks in multi-tier applications'
    ],
    whenNotToUse: [
      'High-level numerical infrastructure utilization monitoring (use CloudWatch Metrics)',
      'Open-source vendor-neutral tracing pipelines standardizing on OpenTelemetry (use AWS Distro for OpenTelemetry)'
    ],
    practicalImplementation: {
      cli: 'aws xray get-service-graph --start-time 1672531199 --end-time 1672534799'
    },
    security: 'Supports KMS encryption at rest. Does not capture sensitive payload bodies unless explicitly instrumented by the developer.',
    costDrivers: 'Traces recorded ($5.00 per million traces) and traces retrieved/scanned ($0.50 per million traces). First 100,000 recorded traces free per month.',
    limitations: [
      'Requires code instrumentation or runtime SDK agent integration',
      'Trace data retention is fixed at 30 days and cannot be extended'
    ],
    commonMistakes: [
      'Recording 100% of production traces without tuning sampling rules, leading to high X-Ray costs on high-throughput APIs',
      'Failing to propagate the `X-Amzn-Trace-Id` HTTP header in custom downstream microservice HTTP clients',
      'Forgetting to enable active tracing on AWS Lambda functions or API Gateway stages'
    ],
    alternatives: [
      { service: 'otel', reason: 'OpenTelemetry standard for vendor-neutral instrumentation across multiple clouds and backends' },
      { service: 'jaeger', reason: 'Self-hosted open-source distributed tracing engine' }
    ],
    relatedServices: ['lambda', 'api-gateway', 'cloudwatch', 'otel'],
    scenarioQuestion: {
      id: 'q-xr-01',
      question: 'A microservices application spanning API Gateway, Lambda, and DynamoDB is experiencing sporadic 5-second latency on the user checkout endpoint. Developers cannot determine whether the delay originates in the Lambda logic, DynamoDB query, or downstream HTTP API. Which service provides a visual map and latency breakdown?',
      type: 'single',
      options: [
        'AWS X-Ray with active tracing enabled across services.',
        'Amazon CloudWatch Logs Insights searching for error strings.',
        'Amazon CloudWatch Synthetics canary tests.',
        'AWS Systems Manager Application Manager.'
      ],
      correctAnswers: [0],
      explanation: 'AWS X-Ray generates visual service maps and subsegment timing breakdowns across distributed calls, revealing exact latency bottlenecks for individual requests.',
      whyOthersWrong: [
        'CloudWatch Logs Insights queries textual logs but does not natively stitch together distributed request timelines across disparate services without manual correlation.',
        'Synthetics canaries test endpoints from the outside, showing total latency but not internal microservice subsegment breakdowns.',
        'Application Manager shows resource groupings, not distributed runtime request tracing.'
      ],
      decisiveClue: 'Visual service maps and subsegment latency breakdowns across distributed microservices specifies AWS X-Ray.',
      difficulty: 'intermediate',
      isOriginal: true
    },
    quickRevision: [
      'Propagates `X-Amzn-Trace-Id` across service headers.',
      'Generates interactive Service Maps highlighting latency and error rates.',
      'Tune Sampling Rules (Reservoir and Fixed Rate) to control ingestion costs.',
      'Built-in 1-click active tracing toggle in API Gateway and AWS Lambda.'
    ],
    sources: [
      { title: 'AWS X-Ray Developer Guide', url: 'https://docs.aws.amazon.com/xray/latest/devguide/aws-xray.html' },
      { title: 'X-Ray Concepts', url: 'https://docs.aws.amazon.com/xray/latest/devguide/xray-concepts.html' }
    ],
    searchTerms: ['x-ray', 'distributed tracing', 'service map', 'trace id', 'sampling rules', 'latency analysis']
  },
  {
    id: 'otel',
    name: 'AWS Distro for OpenTelemetry',
    shortName: 'ADOT',
    category: 'monitoring',
    difficulty: 'advanced',
    importance: 'supporting',
    icon: 'Monitoring',
    tagline: 'Secure, production-ready open source telemetry collection distribution',
    mentalModel: 'A universal telemetry adapter that collects standard open-source metrics, logs, and traces from your applications and exports them to AWS or third-party backends.',
    problemItSolves: 'Prevents vendor lock-in by implementing the Cloud Native Computing Foundation (CNCF) OpenTelemetry open standard across telemetry pipelines.',
    howItWorks: 'Provides tested, optimized OpenTelemetry SDKs, auto-instrumentation agents, and the ADOT Collector binary to collect and export traces/metrics to X-Ray, CloudWatch, Prometheus, and third-party tools.',
    components: [
      { name: 'ADOT Collector', description: 'High-performance proxy process receiving, processing, and exporting telemetry data via OpenTelemetry protocol (OTLP).' },
      { name: 'Language SDKs', description: 'AWS-tested distributions of OpenTelemetry API/SDK for Java, Python, Go, Node.js, and .NET.' },
      { name: 'EKS Add-on', description: 'Managed Kubernetes operator deploying ADOT collectors as Sidecars or DaemonSets seamlessly.' }
    ],
    realWorldExample: 'An enterprise running containerized microservices on Amazon EKS using OpenTelemetry auto-instrumentation to send traces to X-Ray and metrics to Amazon Managed Prometheus.',
    whenToUse: [
      'Standardizing on open-source, vendor-neutral CNCF OpenTelemetry standards',
      'Dual-routing telemetry data simultaneously to AWS services (X-Ray/CloudWatch) and third-party observability backends',
      'Instrumenting Kubernetes workloads on Amazon EKS using the managed ADOT add-on'
    ],
    whenNotToUse: [
      'Simple serverless workloads where native 1-click AWS X-Ray integration requires zero setup',
      'Teams without experience in OpenTelemetry pipelines preferring fully managed zero-config solutions'
    ],
    practicalImplementation: {
      cli: 'aws eks create-addon --cluster-name prod-cluster --addon-name adot --addon-version v0.88.0-eksbuild.1'
    },
    security: 'Hardened and vetted by AWS security teams; supports IAM Roles for Service Accounts (IRSA) for secure AWS authentication.',
    costDrivers: 'ADOT software is 100% free open-source; you pay only for compute hosting the collector and backend destination storage fees (CloudWatch/X-Ray/AMP).',
    limitations: [
      'Requires operational configuration of collector pipelines (receivers, processors, exporters)',
      'Logging specifications in OpenTelemetry community are newer compared to mature tracing specifications'
    ],
    commonMistakes: [
      'Over-configuring batch processors in the collector causing excessive memory usage and collector pod OOM kills',
      'Failing to configure proper IRSA IAM permissions for the ADOT service account',
      'Writing custom telemetry code when auto-instrumentation agents already exist'
    ],
    alternatives: [
      { service: 'xray', reason: 'Proprietary AWS X-Ray SDK (legacy approach before OpenTelemetry standardization)' },
      { service: 'cloudwatch', reason: 'Using the native CloudWatch Unified Agent for host metrics' }
    ],
    relatedServices: ['xray', 'cloudwatch', 'amp', 'eks'],
    scenarioQuestion: {
      id: 'q-adot-01',
      question: 'An enterprise adopting CNCF standards requires an open-source instrumentation standard for Amazon EKS container workloads that can send distributed traces to AWS X-Ray while simultaneously exporting Prometheus metrics to an external monitoring cluster without changing code. What should they use?',
      type: 'single',
      options: [
        'AWS Distro for OpenTelemetry (ADOT) Collector deployed on the EKS cluster.',
        'Legacy AWS X-Ray daemon with CloudWatch Unified Agent.',
        'Amazon CloudWatch Synthetics canaries.',
        'AWS Systems Manager Inventory.'
      ],
      correctAnswers: [0],
      explanation: 'ADOT provides a production-ready OpenTelemetry implementation capable of dual-routing telemetry to AWS services and open-source Prometheus/OTLP backends.',
      whyOthersWrong: [
        'The legacy X-Ray daemon is proprietary, does not conform to OpenTelemetry standards, and cannot export to external Prometheus endpoints.',
        'Synthetics canaries test endpoints externally; they do not collect in-application telemetry.',
        'Systems Manager Inventory tracks OS software metadata, not runtime application telemetry.'
      ],
      decisiveClue: 'CNCF open standard telemetry routing simultaneously to X-Ray and external Prometheus specifies ADOT.',
      difficulty: 'advanced',
      isOriginal: true
    },
    quickRevision: [
      'Based on CNCF OpenTelemetry (OTel) open standards.',
      '100% free open-source distribution maintained and backed by AWS.',
      'Supports auto-instrumentation for Java, Python, Node.js, and .NET.',
      'Managed EKS Add-on for seamless Kubernetes deployment.'
    ],
    sources: [
      { title: 'AWS Distro for OpenTelemetry Documentation', url: 'https://aws-otel.github.io/' },
      { title: 'ADOT on Amazon EKS', url: 'https://docs.aws.amazon.com/eks/latest/userguide/opentelemetry.html' }
    ],
    searchTerms: ['adot', 'opentelemetry', 'otel', 'open-source telemetry', 'collector', 'cncf']
  },
  {
    id: 'amp',
    name: 'Amazon Managed Service for Prometheus',
    shortName: 'AMP',
    category: 'monitoring',
    difficulty: 'advanced',
    importance: 'supporting',
    icon: 'Monitoring',
    tagline: 'Secure, highly available, and serverless Prometheus-compatible monitoring service',
    mentalModel: 'A serverless, infinite Prometheus timeseries database in the cloud that auto-scales storage and ingestion without managing complex Prometheus server clusters.',
    problemItSolves: 'Removes the heavy operational burden of managing, sharding, and scaling self-hosted Prometheus servers and Thanos long-term storage clusters.',
    howItWorks: 'Provides a serverless Prometheus workspace endpoint that ingests open-source Prometheus metrics via `remote_write`, executes PromQL queries, and triggers alerts.',
    components: [
      { name: 'Prometheus Workspace', description: 'Logical serverless unit for metric ingestion, storage, and PromQL query execution.' },
      { name: 'Scraper / Collector', description: 'Fully managed agentless Prometheus scraper that discovers and collects metrics from EKS clusters.' },
      { name: 'Alerting & Recording Rules', description: 'Executes standard Prometheus rule YAML definitions, routing alert notifications to Amazon SNS.' }
    ],
    realWorldExample: 'Monitoring 200 Kubernetes microservices on Amazon EKS ingesting 50 million metrics per minute with zero Prometheus server infrastructure to manage.',
    whenToUse: [
      'Large-scale container and Kubernetes monitoring standardizing on Prometheus metrics and PromQL',
      'Eliminating self-hosted Prometheus storage limits and long-term retention issues',
      'Pairing with Amazon Managed Grafana for operational dashboards'
    ],
    whenNotToUse: [
      'General AWS infrastructure monitoring that is already served by native CloudWatch Metrics',
      'Log indexing and full-text search (use OpenSearch or CloudWatch Logs)'
    ],
    practicalImplementation: {
      cli: 'aws amp create-workspace --alias production-eks-metrics'
    },
    security: 'Secured by IAM authorization with SigV4 signing for PromQL queries and remote write ingestion; encrypted at rest with KMS.',
    costDrivers: 'Metrics ingested (per million metric samples ingested), metric samples stored (GB-month), and PromQL queries executed.',
    limitations: [
      'Requires SigV4 request signing proxy (e.g. AWS SigV4 Proxy) when querying from non-native tools',
      'Standard retention is 150 days (longer retention requires exporting data)'
    ],
    commonMistakes: [
      'Not configuring metric drop/relabeling rules, ingesting millions of unneeded ephemeral Kubernetes metrics and spiking costs',
      'Forgetting that tools connecting to AMP workspaces must authenticate using AWS SigV4',
      'Self-hosting Prometheus scrapers when the managed agentless AMP scraper is available'
    ],
    alternatives: [
      { service: 'cloudwatch', reason: 'Native AWS metrics service without requiring Prometheus or PromQL knowledge' },
      { service: 'thanos', reason: 'Self-hosted open-source clustering for Prometheus on S3' }
    ],
    relatedServices: ['amg', 'eks', 'otel', 'sns'],
    scenarioQuestion: {
      id: 'q-amp-01',
      question: 'A DevOps platform team runs dozens of production Amazon EKS clusters. The team standardizes on PromQL queries and Prometheus alerting rules, but spends hours every week maintaining self-hosted Prometheus servers and storage disks. What managed AWS service eliminates this server management while retaining 100% PromQL compatibility?',
      type: 'single',
      options: [
        'Amazon Managed Service for Prometheus (AMP)',
        'Amazon CloudWatch Logs Insights',
        'Amazon OpenSearch Service',
        'Amazon Managed Streaming for Apache Kafka'
      ],
      correctAnswers: [0],
      explanation: 'Amazon Managed Service for Prometheus (AMP) provides a fully managed, serverless Prometheus-compatible monitoring service supporting native PromQL and remote write.',
      whyOthersWrong: [
        'CloudWatch Logs Insights queries textual log events, not Prometheus time-series metric data using PromQL.',
        'OpenSearch is a search and analytics engine, not a native PromQL-compatible metrics database.',
        'MSK is a streaming message broker, not a metrics monitoring engine.'
      ],
      decisiveClue: 'Serverless Prometheus compatibility supporting native PromQL and remote write specifies Amazon Managed Service for Prometheus (AMP).',
      difficulty: 'advanced',
      isOriginal: true
    },
    quickRevision: [
      'Fully managed, serverless Prometheus-compatible time series database.',
      'Supports standard PromQL queries and alerting/recording rules.',
      'Ingests metrics via standard Prometheus `remote_write`.',
      'Secured with AWS IAM SigV4 signing; pairs seamlessly with Amazon Managed Grafana.'
    ],
    sources: [
      { title: 'Amazon Managed Service for Prometheus User Guide', url: 'https://docs.aws.amazon.com/prometheus/latest/userguide/what-is-service.html' },
      { title: 'AMP Pricing and Scrapers', url: 'https://aws.amazon.com/prometheus/pricing/' }
    ],
    searchTerms: ['amp', 'managed prometheus', 'promql', 'remote write', 'kubernetes metrics', 'serverless prometheus']
  },
  {
    id: 'amg',
    name: 'Amazon Managed Grafana',
    shortName: 'AMG',
    category: 'monitoring',
    difficulty: 'advanced',
    importance: 'supporting',
    icon: 'Monitoring',
    tagline: 'Fully managed, secure data visualization and dashboarding service for open source Grafana',
    mentalModel: 'A turnkey, cloud-hosted Grafana dashboard service where engineers visualize data from Prometheus, CloudWatch, OpenSearch, and databases without maintaining Grafana servers.',
    problemItSolves: 'Eliminates the operational overhead of installing, patching, scaling, and securing self-hosted Grafana servers and plugins.',
    howItWorks: 'Provisions fully managed, high-availability Grafana workspaces with built-in integrations for AWS data sources, secured by IAM Identity Center (AWS SSO) authentication.',
    components: [
      { name: 'Grafana Workspace', description: 'Dedicated, managed Grafana server environment running enterprise-grade Grafana software.' },
      { name: 'AWS Data Source Plugins', description: 'Pre-installed native plugins for CloudWatch, X-Ray, AMP, OpenSearch, Timestream, and Athena.' },
      { name: 'SSO & Role Mapping', description: 'Direct integration with IAM Identity Center (or SAML) mapping corporate groups to Viewer, Editor, or Admin roles.' },
      { name: 'Grafana Enterprise Features', description: 'Optional upgrade unlocking premium third-party plugins (Datadog, Splunk, ServiceNow, AppDynamics).' }
    ],
    realWorldExample: 'A unified operations center dashboard visualizing EKS metrics from AMP, AWS resource metrics from CloudWatch, and traces from X-Ray on a single pane of glass.',
    whenToUse: [
      'Unified visualization combining multiple disparate data sources (CloudWatch, AMP, Athena, RDS) in one place',
      'Standardizing on open-source Grafana dashboards without managing server upgrades and patching',
      'Securing corporate Grafana access using IAM Identity Center enterprise SSO'
    ],
    whenNotToUse: [
      'Simple environments where native AWS CloudWatch Dashboards meet all operational needs',
      'Non-visual headless data processing pipelines'
    ],
    practicalImplementation: {
      cli: 'aws grafana create-workspace --workspace-name "Ops-Dashboard" --account-access-type CURRENT_ACCOUNT --authentication-providers AWS_SSO --permission-type SERVICE_MANAGED'
    },
    security: 'Authentication managed via IAM Identity Center. Fine-grained dashboard and folder permissions; encrypted at rest and in transit.',
    costDrivers: 'Active user licenses per month ($9.00/month per active Editor, $5.00/month per active Viewer). Zero charge for inactive users.',
    limitations: [
      'Requires IAM Identity Center (AWS SSO) or an enterprise SAML 2.0 Identity Provider for user login',
      'Cannot install arbitrary unverified third-party community plugins outside the approved AWS catalog'
    ],
    commonMistakes: [
      'Attempting to deploy AMG without configuring IAM Identity Center first',
      'Paying for self-hosted EC2 Grafana instances when managed AMG active-user pricing is more cost-effective',
      'Granting all developers Editor licenses instead of Viewer licenses, increasing monthly costs'
    ],
    alternatives: [
      { service: 'cloudwatch', reason: 'Native CloudWatch Dashboards have zero user-license fees and require no SSO setup' },
      { service: 'quicksight', reason: 'Business Intelligence and executive reporting rather than operational telemetry dashboards' }
    ],
    relatedServices: ['amp', 'cloudwatch', 'xray', 'iam-identity-center'],
    scenarioQuestion: {
      id: 'q-amg-01',
      question: 'An operations team needs a centralized dashboard displaying Prometheus metrics from AMP, CloudWatch metrics, and X-Ray traces on a single screen. Corporate policy requires authentication through Okta single sign-on and mandates zero infrastructure patching overhead. Which service satisfies these requirements?',
      type: 'single',
      options: [
        'Amazon Managed Grafana integrated with IAM Identity Center.',
        'Amazon CloudWatch Dashboards shared via public URLs.',
        'Amazon QuickSight connected to CloudWatch.',
        'A self-hosted Grafana instance running on Amazon EC2.'
      ],
      correctAnswers: [0],
      explanation: 'Amazon Managed Grafana provides fully managed Grafana workspaces with pre-installed plugins for AMP, CloudWatch, and X-Ray, integrating natively with IAM Identity Center / Okta SSO.',
      whyOthersWrong: [
        'CloudWatch Dashboards do not natively query Amazon Managed Service for Prometheus using PromQL.',
        'Amazon QuickSight is a BI tool for business reporting, not an operational telemetry and trace visualization tool.',
        'Self-hosted Grafana on EC2 requires OS patching, server management, and custom SSO configuration overhead.'
      ],
      decisiveClue: 'Managed Grafana with native AMP/CloudWatch/X-Ray plugins and corporate SSO points directly to Amazon Managed Grafana.',
      difficulty: 'advanced',
      isOriginal: true
    },
    quickRevision: [
      'Fully managed Grafana developed in partnership with Grafana Labs.',
      'Native plugins for CloudWatch, AMP, X-Ray, OpenSearch, Athena.',
      'Pricing model: Pay per active user per month ($9 Editor, $5 Viewer; $0 if inactive).',
      'Requires IAM Identity Center or SAML 2.0 for user authentication.'
    ],
    sources: [
      { title: 'Amazon Managed Grafana User Guide', url: 'https://docs.aws.amazon.com/grafana/latest/userguide/what-is-amazon-managed-grafana.html' },
      { title: 'Grafana Supported Data Sources', url: 'https://docs.aws.amazon.com/grafana/latest/userguide/AMG-datasource-plugins.html' }
    ],
    searchTerms: ['amg', 'managed grafana', 'grafana', 'dashboards', 'telemetry visualization', 'promql dashboard']
  },
  {
    id: 'systems-manager',
    name: 'AWS Systems Manager',
    shortName: 'SSM',
    category: 'monitoring',
    difficulty: 'intermediate',
    importance: 'essential',
    icon: 'Monitoring',
    tagline: 'Operations hub for managing and automating AWS and hybrid cloud infrastructure at scale',
    mentalModel: 'The ultimate IT administrator Swiss Army knife, giving you remote shell access, automated patching, script execution, and inventory across thousands of servers without SSH keys.',
    problemItSolves: 'Removes the need for SSH bastion hosts, manual patching, configuration drift, and decentralized server maintenance across EC2 and on-premises fleets.',
    howItWorks: 'Uses the lightweight SSM Agent running on instances to communicate outbound to Systems Manager endpoints over HTTPS (port 443), executing commands and enforcing configurations.',
    components: [
      { name: 'Session Manager', description: 'Provides secure, audited browser and CLI shell access to EC2 without open inbound ports or SSH keys.' },
      { name: 'Patch Manager', description: 'Automates scanning and applying operating system security patches against custom or predefined Patch Baselines.' },
      { name: 'Run Command', description: 'Executes scripts (bash, PowerShell) across hundreds of instances simultaneously with rate control and logging.' },
      { name: 'State Manager', description: 'Enforces configuration drift management (e.g., ensuring antivirus or logging agents remain installed and active).' }
    ],
    realWorldExample: 'Logging into private EC2 instances in an isolated subnet with one click via Session Manager, and patching 500 servers during a maintenance window with zero SSH access.',
    whenToUse: [
      'Secure remote shell access to EC2 instances without bastion hosts or open port 22/3389',
      'Automated fleet-wide OS patch management and compliance reporting',
      'Running automated ad-hoc administrative commands across EC2 fleets via Run Command'
    ],
    whenNotToUse: [
      'Managing application source code deployments (use AWS CodeDeploy or CI/CD pipelines)',
      'Complex multi-tier container orchestration (use Amazon ECS or EKS)'
    ],
    practicalImplementation: {
      cli: 'aws ssm start-session --target i-0123456789abcdef0'
    },
    security: 'Zero open inbound ports required; all traffic is outbound HTTPS (port 443). Full session logging to CloudWatch Logs and S3 with KMS encryption.',
    costDrivers: 'Core features (Session Manager, Run Command, Patch Manager, standard Parameter Store) are 100% free. Advanced on-premise managed instances incur small hourly fees.',
    limitations: [
      'Requires SSM Agent installed and running on the target machine (pre-installed on Amazon Linux, Ubuntu, Windows AMIs)',
      'Instance must have IAM instance profile permissions (`AmazonSSMManagedInstanceCore`)'
    ],
    commonMistakes: [
      'Opening inbound port 22 in Security Groups when Session Manager eliminates the need for open SSH ports',
      'Forgetting to attach the `AmazonSSMManagedInstanceCore` IAM policy to the EC2 instance role',
      'Blocking outbound HTTPS port 443 in private subnets without deploying SSM VPC Interface Endpoints'
    ],
    alternatives: [
      { service: 'ec2-instance-connect', reason: 'Ephemeral SSH key push into instance metadata (still requires inbound port 22)' },
      { service: 'ansible', reason: 'Third-party agentless configuration management engine over SSH' }
    ],
    relatedServices: ['ec2', 'parameter-store', 'cloudwatch', 'kms'],
    scenarioQuestion: {
      id: 'q-ssm-01',
      question: 'A security policy strictly prohibits opening any inbound ports (including SSH port 22) to EC2 instances located in private subnets. Administrators still need terminal shell access to troubleshoot issues, and all session activity must be logged for compliance. What is the AWS best practice?',
      type: 'single',
      options: [
        'Attach the AmazonSSMManagedInstanceCore policy to the instances and use AWS Systems Manager Session Manager with logging enabled to CloudWatch.',
        'Deploy an SSH Bastion host in a public subnet with an Elastic IP and dynamic security group whitelisting.',
        'Use EC2 Instance Connect with an Internet Gateway route table.',
        'Configure an AWS Client VPN endpoint and open port 22 in the instance security group.'
      ],
      correctAnswers: [0],
      explanation: 'SSM Session Manager connects outbound over TLS via the SSM Agent, requiring ZERO open inbound ports, and automatically streams command history and logs to CloudWatch Logs.',
      whyOthersWrong: [
        'Bastion hosts require inbound port 22, public subnets, and key management, violating the policy.',
        'EC2 Instance Connect requires an open inbound port 22.',
        'Client VPN requires opening inbound SSH port 22 in security groups, violating the strict prohibition.'
      ],
      decisiveClue: 'Zero inbound ports with audited terminal shell access specifies AWS Systems Manager Session Manager.',
      difficulty: 'intermediate',
      isOriginal: true
    },
    quickRevision: [
      'Session Manager eliminates SSH keys and bastion hosts (zero open inbound ports).',
      'Requires `AmazonSSMManagedInstanceCore` IAM policy on the instance profile.',
      'Patch Manager automates OS patching against Patch Baselines.',
      'Run Command executes scripts across hundreds of instances with rate controls.'
    ],
    sources: [
      { title: 'AWS Systems Manager User Guide', url: 'https://docs.aws.amazon.com/systems-manager/latest/userguide/what-is-systems-manager.html' },
      { title: 'Session Manager Overview', url: 'https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager.html' }
    ],
    searchTerms: ['systems manager', 'ssm', 'session manager', 'patch manager', 'run command', 'ssm agent']
  },
  {
    id: 'aws-health',
    name: 'AWS Health',
    shortName: 'AWS Health',
    category: 'monitoring',
    difficulty: 'beginner',
    importance: 'supporting',
    icon: 'Monitoring',
    tagline: 'Real-time visibility into AWS service health, maintenance events, and resource impacts',
    mentalModel: 'Your personalized status bulletin board in AWS, telling you when specific hardware your EC2 runs on is scheduled for maintenance or when an AWS service has an outage.',
    problemItSolves: 'Provides customized, relevant operational health alerts impacting your specific AWS resources rather than generic global service status.',
    howItWorks: 'AWS Health Dashboard publishes events categorized as Open issues, Scheduled changes, and Other notifications. Events trigger Amazon EventBridge rules for automated response.',
    components: [
      { name: 'AWS Health Dashboard', description: 'Personalized console view showing health events affecting your specific AWS account.' },
      { name: 'AWS Health API', description: 'Programmatic API available to Business and Enterprise Support customers to integrate events into IT tools.' },
      { name: 'Organizational Health View', description: 'Aggregated view of health events across all accounts in an AWS Organization.' },
      { name: 'EventBridge Integration', description: 'Emits event notifications when maintenance or outages are scheduled to trigger automated workflows.' }
    ],
    realWorldExample: 'Receiving an automated Slack alert 7 days before AWS retires an underlying physical hardware host running your production database EC2 instance.',
    whenToUse: [
      'Tracking upcoming scheduled maintenance (EC2 hardware retirement, RDS OS upgrades)',
      'Automating proactive instance failover prior to scheduled maintenance windows using EventBridge',
      'Investigating whether an application outage is caused by an underlying AWS regional service disruption'
    ],
    whenNotToUse: [
      'Monitoring your own internal application performance and HTTP status codes (use CloudWatch)',
      'Real-time network packet loss and intrusion detection (use GuardDuty or Network Firewall)'
    ],
    practicalImplementation: {
      cli: 'aws health describe-events --filter "eventStatusCodes=open"'
    },
    security: 'Provides notifications regarding security advisories, compromised account notifications, and urgent vulnerability alerts.',
    costDrivers: 'Viewing the console dashboard and EventBridge events is free; the AWS Health API requires Business or Enterprise Support plan.',
    limitations: [
      'AWS Health API requires paid Business or Enterprise Support tier',
      'Notifications indicate events after AWS detects them; does not replace active application health checks'
    ],
    commonMistakes: [
      'Relying on the generic public status page (status.aws.amazon.com) instead of the personalized AWS Health Dashboard for account-specific impacts',
      'Ignoring EC2 scheduled retirement notifications until AWS forces instance stop/start',
      'Not integrating AWS Health with EventBridge to automate maintenance notifications to Slack or PagerDuty'
    ],
    alternatives: [
      { service: 'cloudwatch', reason: 'Focuses on your own workload metrics and alarms rather than AWS infrastructure maintenance' },
      { service: 'trusted-advisor', reason: 'Provides optimization and security recommendations rather than operational service health status' }
    ],
    relatedServices: ['eventbridge', 'cloudwatch', 'ec2', 'organizations'],
    scenarioQuestion: {
      id: 'q-health-01',
      question: 'A DevOps engineer needs to receive automated alerts in Slack whenever AWS schedules hardware retirement maintenance for any EC2 instances across their multi-account organization. What architecture provides this automation?',
      type: 'single',
      options: [
        'Configure an Amazon EventBridge rule matching AWS Health events from the Organizational Health view that triggers an AWS Lambda function sending Slack notifications.',
        'Create a CloudWatch Metric Alarm for EC2 CPU utilization exceeding 90%.',
        'Write a Python script polling the public AWS status page RSS feed every minute.',
        'Use AWS Config rules to monitor EC2 uptime.'
      ],
      correctAnswers: [0],
      explanation: 'AWS Health emits personalized scheduled maintenance events to Amazon EventBridge, which can trigger Lambda functions to post alerts directly to Slack.',
      whyOthersWrong: [
        'CPU alarms monitor instance load, not AWS planned physical hardware maintenance.',
        'The public status RSS feed reports broad multi-tenant outages, not specific instance hardware maintenance events in your account.',
        'AWS Config monitors resource configuration drift, not AWS infrastructure maintenance schedules.'
      ],
      decisiveClue: 'Automating alerts for planned EC2 hardware retirement events specifies AWS Health integrated with EventBridge.',
      difficulty: 'beginner',
      isOriginal: true
    },
    quickRevision: [
      'Personalized health alerts specific to your account\'s resources.',
      'Categories: Open Issues, Scheduled Changes, Notifications.',
      'AWS Health API requires Business or Enterprise Support.',
      'Native EventBridge integration allows automated proactive instance reboot/failover.'
    ],
    sources: [
      { title: 'AWS Health User Guide', url: 'https://docs.aws.amazon.com/health/latest/ug/what-is-aws-health.html' },
      { title: 'AWS Health with EventBridge', url: 'https://docs.aws.amazon.com/health/latest/ug/cloudwatch-events-health.html' }
    ],
    searchTerms: ['aws health', 'health dashboard', 'scheduled maintenance', 'hardware retirement', 'service health']
  },
  {
    id: 'service-quotas',
    name: 'AWS Service Quotas',
    shortName: 'Service Quotas',
    category: 'monitoring',
    difficulty: 'beginner',
    importance: 'supporting',
    icon: 'Monitoring',
    tagline: 'View and manage your quotas (limits) easily and at scale as your workloads grow',
    mentalModel: 'The account capacity meter that shows your limits (like max VPCs or running EC2 instances) and lets you request limit increases with a single click before hitting a wall.',
    problemItSolves: 'Prevents unexpected deployment and scaling failures caused by hitting default AWS account service limits (formerly known as service limits).',
    howItWorks: 'Centralizes viewing default and applied quotas across all AWS services, and automates quota increase requests with integrated CloudWatch alarms when utilization nears thresholds.',
    components: [
      { name: 'Applied Quotas', description: 'The current active quota value for a service in a specific region for your account.' },
      { name: 'Quota Request History', description: 'Tracks pending, approved, and denied limit increase requests submitted to AWS Support.' },
      { name: 'Quota Request Templates', description: 'Automatically applies standard quota increase requests to new accounts created in AWS Organizations.' }
    ],
    realWorldExample: 'Configuring a CloudWatch alarm to alert the team when Elastic IP utilization hits 80% of the quota, and requesting an increase from 5 to 20 before a major launch.',
    whenToUse: [
      'Checking regional limits before deploying new enterprise infrastructure',
      'Requesting service quota increases programmatically or via console',
      'Applying automatic quota increase templates across new accounts in AWS Organizations'
    ],
    whenNotToUse: [
      'Performance tuning and auto-scaling compute workloads (use EC2 Auto Scaling)',
      'Cost and budget limit enforcement (use AWS Budgets)'
    ],
    practicalImplementation: {
      cli: 'aws service-quotas request-service-quota-increase --service-code vpc --quota-code L-F678F142 --desired-value 10'
    },
    security: 'Managed via IAM permissions; allows granular restriction over who can request capacity increases.',
    costDrivers: 'Service Quotas is completely free to use.',
    limitations: [
      'Some quota increases require manual human review by AWS Support and are not instantaneous',
      'Certain architectural limits are hard limits that cannot be increased under any circumstances'
    ],
    commonMistakes: [
      'Waiting until launch day to request quota increases for vCPUs or Elastic IPs, risking deployment delays',
      'Not setting CloudWatch alarms on critical quotas to get early warnings before hitting limits',
      'Assuming service quotas are global when most are strictly enforced per-region'
    ],
    alternatives: [
      { service: 'trusted-advisor', reason: 'Provides checks for service limits near 80% utilization across core services' },
      { service: 'budgets', reason: 'Focuses on financial spending limits rather than resource capacity quotas' }
    ],
    relatedServices: ['organizations', 'cloudwatch', 'trusted-advisor'],
    scenarioQuestion: {
      id: 'q-sq-01',
      question: 'An enterprise plans to launch a new product that requires 50 Elastic IP addresses in us-east-1. The default account quota is 5 Elastic IPs per region. How should the team prepare for the launch to prevent resource creation failures?',
      type: 'single',
      options: [
        'Use AWS Service Quotas to submit a quota increase request for Elastic IPs well in advance of the launch.',
        'Create 10 separate AWS accounts and peer their VPCs together.',
        'Use AWS Trusted Advisor to automatically override the account limit.',
        'Deploy a NAT Gateway with dynamic port allocation to bypass Elastic IP requirements.'
      ],
      correctAnswers: [0],
      explanation: 'AWS Service Quotas allows customers to view active quotas and submit requests to increase adjustable limits before reaching capacity boundaries.',
      whyOthersWrong: [
        'Creating 10 separate accounts to work around an adjustable quota is completely unnecessary and adds severe operational complexity.',
        'Trusted Advisor only alerts on quota utilization; it cannot automatically approve or override service quotas.',
        'NAT Gateways still require Elastic IP addresses to operate.'
      ],
      decisiveClue: 'Requesting an increase for service limits well in advance of launch points directly to AWS Service Quotas.',
      difficulty: 'beginner',
      isOriginal: true
    },
    quickRevision: [
      'Formerly known as "Service Limits".',
      'Quotas are typically regional; increases must be requested per region.',
      'Integrates with CloudWatch to alarm when quota utilization approaches 80%.',
      'Quota Request Templates apply standard limit increases automatically to new accounts in AWS Organizations.'
    ],
    sources: [
      { title: 'AWS Service Quotas User Guide', url: 'https://docs.aws.amazon.com/servicequotas/latest/userguide/intro.html' },
      { title: 'Viewing Service Quotas', url: 'https://docs.aws.amazon.com/servicequotas/latest/userguide/view-service-quotas.html' }
    ],
    searchTerms: ['service quotas', 'service limits', 'quota increase', 'capacity limits', 'quota template']
  },
  {
    id: 'trusted-advisor',
    name: 'AWS Trusted Advisor',
    shortName: 'Trusted Advisor',
    category: 'monitoring',
    difficulty: 'beginner',
    importance: 'important',
    icon: 'Monitoring',
    tagline: 'Real-time guidance to help you provision resources following AWS best practices',
    mentalModel: 'An automated cloud architect consultant continuously reviewing your account against 5 pillars: cost, performance, security, fault tolerance, and service limits.',
    problemItSolves: 'Identifies wasted cloud spending, security misconfigurations, performance bottlenecks, and service quotas approaching capacity.',
    howItWorks: 'Scans your AWS resources against established best practice checks and provides categorized recommendations with green (OK), yellow (investigate), or red (action required) status.',
    components: [
      { name: 'Cost Optimization Checks', description: 'Flags idle RDS instances, unattached EBS volumes, and underutilized EC2 instances; recommends Savings Plans.' },
      { name: 'Security Checks', description: 'Checks for open S3 bucket permissions, MFA on root account, security groups with unrestricted ports, and IAM password policies.' },
      { name: 'Fault Tolerance Checks', description: 'Verifies EBS snapshot recency, Multi-AZ RDS deployments, and Auto Scaling group health.' },
      { name: 'Performance & Service Limits', description: 'Checks high utilization and alerts when resources exceed 80% of service quota limits.' }
    ],
    realWorldExample: 'Saving $15,000 monthly after Trusted Advisor flags 40 unattached EBS volumes and 12 idle development RDS instances running over weekends.',
    whenToUse: [
      'Regular cloud hygiene reviews to identify idle resources and cost savings',
      'Auditing basic security posture (unrestricted ports, root MFA, open S3 buckets)',
      'Checking service limits approaching 80% threshold across multiple services'
    ],
    whenNotToUse: [
      'Comprehensive regulatory compliance benchmarks like CIS or PCI-DSS (use AWS Security Hub)',
      'In-depth real-time behavioral threat detection (use Amazon GuardDuty)'
    ],
    practicalImplementation: {
      cli: 'aws support describe-trusted-advisor-checks --language en'
    },
    security: 'Checks critical baseline security configurations; free tier includes essential security checks, full suite requires Business or Enterprise Support.',
    costDrivers: 'Basic checks are free for all customers; the full suite of 100+ checks requires an AWS Business or Enterprise Support plan.',
    limitations: [
      'Only 7 core checks are available on Basic and Developer support tiers; remaining 100+ checks require Business or Enterprise Support',
      'Checks are refreshed periodically rather than streaming in real time'
    ],
    commonMistakes: [
      'Assuming all Trusted Advisor checks are free, when the full check suite requires Business or Enterprise Support',
      'Ignoring high-severity red security warnings such as S3 buckets with public read/write permissions',
      'Confusing Trusted Advisor with AWS Well-Architected Tool (Trusted Advisor is automated scans; Well-Architected Tool is an architectural questionnaire framework)'
    ],
    alternatives: [
      { service: 'security-hub', reason: 'Deeper continuous security and compliance benchmark auditing' },
      { service: 'compute-optimizer', reason: 'Machine-learning driven right-sizing recommendations for EC2, EBS, and Lambda' }
    ],
    relatedServices: ['compute-optimizer', 'cost-explorer', 'security-hub', 'service-quotas'],
    scenarioQuestion: {
      id: 'q-ta-01',
      question: 'A company with AWS Business Support wants automated recommendations on underutilized resources, unattached EBS volumes, unrestricted Security Group ingress rules, and service quotas nearing capacity. Which service provides this comprehensive review out of the box?',
      type: 'single',
      options: [
        'AWS Trusted Advisor',
        'AWS Systems Manager Quick Setup',
        'AWS Health Dashboard',
        'AWS Budgets'
      ],
      correctAnswers: [0],
      explanation: 'AWS Trusted Advisor evaluates environments across Cost Optimization, Security, Fault Tolerance, Performance, and Service Limits, providing actionable recommendations.',
      whyOthersWrong: [
        'Systems Manager Quick Setup deploys common management agents, but does not provide multi-pillar best practice optimization checks.',
        'AWS Health Dashboard tracks infrastructure maintenance events and outages, not resource optimization recommendations.',
        'AWS Budgets tracks cost thresholds and alerts on spend, but does not evaluate security groups or fault tolerance.'
      ],
      decisiveClue: 'Automated best practice checks across Cost, Security, Fault Tolerance, Performance, and Quotas specifies AWS Trusted Advisor.',
      difficulty: 'beginner',
      isOriginal: true
    },
    quickRevision: [
      '5 Pillars: Cost Optimization, Security, Fault Tolerance, Performance, Service Limits.',
      'Basic/Developer support receives 7 core checks; Business/Enterprise unlocks 100+ checks.',
      'Flags unattached EBS volumes, idle RDS instances, and open security group ports.',
      'Trusted Advisor Priority provides curated recommendations for Enterprise Support customers.'
    ],
    sources: [
      { title: 'AWS Trusted Advisor User Guide', url: 'https://docs.aws.amazon.com/awssupport/latest/user/trusted-advisor.html' },
      { title: 'Trusted Advisor Check Reference', url: 'https://aws.amazon.com/premiumsupport/technology/trusted-advisor/best-practice-checklist/' }
    ],
    searchTerms: ['trusted advisor', 'best practices', 'cost optimization', 'fault tolerance', 'service limit checks', 'idle resources']
  },
  {
    id: 'organizations',
    name: 'AWS Organizations',
    shortName: 'Organizations',
    category: 'enterprise',
    difficulty: 'intermediate',
    importance: 'essential',
    icon: 'Enterprise',
    tagline: 'Centrally govern and manage multiple AWS accounts across your enterprise',
    mentalModel: 'A corporate company tree structure that groups hundreds of AWS accounts into departments (OUs) and enforces strict guardrails that even account root users cannot bypass.',
    problemItSolves: 'Eliminates security drift, unmanaged billing, and fragmented policy enforcement across multi-account enterprise cloud footprints.',
    howItWorks: 'Organizes accounts into an hierarchical tree of Organizational Units (OUs), provides Consolidated Billing with volume discounts, and enforces Service Control Policies (SCPs).',
    components: [
      { name: 'Management Account', description: 'The root billing account that creates the organization, pays consolidated bills, and defines top-level policies.' },
      { name: 'Organizational Units (OU)', description: 'Logical folders containing member accounts to which policies are applied hierarchically.' },
      { name: 'Service Control Policies (SCP)', description: 'Guardrail policies specifying the maximum available permissions for accounts or OUs (acts as permission filters).' },
      { name: 'Consolidated Billing', description: 'Aggregates usage across all accounts for volume tiering discounts and issues a single unified monthly bill.' }
    ],
    realWorldExample: 'Preventing any developer or root user in 100 sandbox accounts from deleting CloudTrail logs or creating resources in unauthorized regions via a single SCP.',
    whenToUse: [
      'Managing multiple AWS accounts across development, staging, production, and shared services',
      'Enforcing organization-wide guardrails via Service Control Policies (SCPs)',
      'Consolidated billing across business units for aggregated volume pricing discounts'
    ],
    whenNotToUse: [
      'Granting individual user permissions within a single account (use IAM policies; SCPs only define maximum boundaries)',
      'Running application workloads directly inside the Management Account (best practice: keep Management Account empty of workloads)'
    ],
    practicalImplementation: {
      cli: 'aws organizations create-organization --feature-set ALL'
    },
    security: 'SCPs apply to all principals in member accounts INCLUDING THE ROOT USER. SCPs do not affect the Management Account.',
    costDrivers: 'AWS Organizations is completely free of charge. Consolidated billing saves costs through aggregated volume tiering discounts.',
    limitations: [
      'SCPs do not grant permissions; they only set the maximum boundary. Users still need an IAM allow policy to perform actions',
      'SCPs do NOT apply to the Management Account',
      'Maximum OU nesting depth is 5 levels'
    ],
    commonMistakes: [
      'Deploying operational application workloads inside the Management Account',
      'Thinking an SCP grants permissions (if an SCP allows an action, the IAM policy must still explicitly allow it)',
      'Accidentally removing the `FullAWSAccess` SCP without a replacement allow policy, locking all accounts out of AWS services'
    ],
    alternatives: [
      { service: 'control-tower', reason: 'Automated framework that sets up a Well-Architected multi-account landing zone using AWS Organizations' },
      { service: 'iam', reason: 'Manages user/role identities within individual accounts' }
    ],
    relatedServices: ['control-tower', 'iam', 'cloudtrail', 'firewall-manager', 'security-hub'],
    scenarioQuestion: {
      id: 'q-org-01',
      question: 'A company\'s security policy requires that no member account in the enterprise can ever disable AWS CloudTrail or launch resources outside of the `us-east-1` and `us-west-2` regions, even if an engineer has the root user credentials for that member account. What mechanism enforces this?',
      type: 'single',
      options: [
        'Attach a Service Control Policy (SCP) at the Root or OU level in AWS Organizations that denies these actions.',
        'Deploy an IAM Permission Boundary on all IAM roles in the member accounts.',
        'Configure an AWS Config rule with automated remediation in the member accounts.',
        'Use an Amazon EventBridge rule that alerts security if CloudTrail is modified.'
      ],
      correctAnswers: [0],
      explanation: 'Service Control Policies (SCPs) in AWS Organizations set the maximum boundary for member accounts and apply to all users and roles, including the account root user.',
      whyOthersWrong: [
        'IAM Permission Boundaries do not apply to the account root user, so root could still bypass them.',
        'AWS Config evaluates and remediates after the fact; it cannot prevent an action pre-execution like an SCP.',
        'EventBridge alerts notify after the action has already occurred and does not block root execution.'
      ],
      decisiveClue: 'Enforcing guardrails that cannot be bypassed even by the root user of a member account requires a Service Control Policy (SCP).',
      difficulty: 'intermediate',
      isOriginal: true
    },
    quickRevision: [
      'Consolidated Billing combines usage across all accounts for volume discounts.',
      'Service Control Policies (SCPs) restrict the maximum allowable permissions (even for root).',
      'SCPs NEVER restrict actions in the Management Account.',
      'Never deploy active application workloads in the Management Account.'
    ],
    sources: [
      { title: 'AWS Organizations User Guide', url: 'https://docs.aws.amazon.com/organizations/latest/userguide/orgs_introduction.html' },
      { title: 'Service Control Policies (SCPs)', url: 'https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps.html' }
    ],
    searchTerms: ['organizations', 'scp', 'service control policies', 'consolidated billing', 'ou', 'landing zone', 'management account']
  },
  {
    id: 'control-tower',
    name: 'AWS Control Tower',
    shortName: 'Control Tower',
    category: 'enterprise',
    difficulty: 'advanced',
    importance: 'important',
    icon: 'Enterprise',
    tagline: 'Set up and govern a secure, multi-account AWS environment based on best practices',
    mentalModel: 'An automated general contractor that builds a fully plumbed, wired, and code-compliant enterprise cloud skyscraper (Landing Zone) in just a few clicks.',
    problemItSolves: 'Automates the complex, multi-week process of setting up and governing a multi-account AWS environment adhering to the AWS Well-Architected framework.',
    howItWorks: 'Orchestrates AWS Organizations, IAM Identity Center, AWS Config, and CloudTrail to provision an automated Landing Zone with built-in preventive and detective guardrails.',
    components: [
      { name: 'Landing Zone', description: 'Well-Architected multi-account baseline environment including Log Archive and Security Audit accounts.' },
      { name: 'Controls (Guardrails)', description: 'Preventive controls (implemented via SCPs) and Detective controls (implemented via AWS Config rules).' },
      { name: 'Account Factory', description: 'Automated self-service account vending machine that provisions standardized, pre-configured accounts via Service Catalog.' },
      { name: 'Dashboard', description: 'Continuous compliance view displaying account provisioning status and guardrail adherence across the organization.' }
    ],
    realWorldExample: 'An enterprise deploying a compliant financial multi-account landing zone with mandatory logging, encryption guardrails, and automated account creation.',
    whenToUse: [
      'Setting up a new multi-account AWS environment from scratch using AWS best practices',
      'Automating standardized account vending (Account Factory) for development teams',
      'Enforcing mandatory preventive and detective governance guardrails at scale'
    ],
    whenNotToUse: [
      'Simple single-account hobbyist or small startup architectures',
      'Organizations requiring fully customized bespoke Terraform scaffolding who prefer not to use managed AWS Landing Zones'
    ],
    practicalImplementation: {
      cli: 'aws controltower list-enabled-controls --target-identifier arn:aws:organizations::123456789012:ou/o-example/ou-1234'
    },
    security: 'Creates dedicated Log Archive and Audit accounts with restricted access. Enforces baseline encryption, MFA, and audit logging automatically.',
    costDrivers: 'Control Tower itself is free; you pay for underlying resources created (AWS Config rules, CloudTrail trails, S3 storage, Service Catalog).',
    limitations: [
      'Setup and modifications take substantial time (Landing Zone setup can take 60-90 minutes)',
      'Modifying underlying provisioned resources directly can cause Landing Zone drift'
    ],
    commonMistakes: [
      'Manually deleting Control Tower managed resources (Config rules, S3 buckets), causing Landing Zone state corruption',
      'Attempting to deploy Control Tower on an existing complex organization without planning account enrollment and OU alignment',
      'Disabling detective controls directly in AWS Config instead of managing them through the Control Tower console'
    ],
    alternatives: [
      { service: 'organizations', reason: 'Low-level primitive service without automated landing zone or account factory templates' },
      { service: 'terraform', reason: 'Building bespoke multi-account landing zones using open-source Terraform frameworks' }
    ],
    relatedServices: ['organizations', 'iam-identity-center', 'aws-config', 'cloudtrail', 'service-catalog'],
    scenarioQuestion: {
      id: 'q-ctower-01',
      question: 'An enterprise cloud architecture team needs to establish a multi-account cloud environment for 200 developers. The solution must provide automated account vending with pre-configured baseline security, enforce preventive guardrails against unencrypted data, and centralize logs in a dedicated audit account. What is the fastest and most managed AWS solution?',
      type: 'single',
      options: [
        'Deploy an AWS Control Tower Landing Zone and utilize the Account Factory.',
        'Manually create accounts in AWS Organizations and write custom Python scripts for baseline setups.',
        'Deploy AWS Systems Manager on every instance across all accounts.',
        'Use AWS CloudFormation StackSets from a single IAM user.'
      ],
      correctAnswers: [0],
      explanation: 'AWS Control Tower automates the creation of a well-architected multi-account landing zone with dedicated audit/log accounts, Account Factory account vending, and pre-configured controls.',
      whyOthersWrong: [
        'Manual scripting in Organizations is slow, error-prone, and requires ongoing custom maintenance.',
        'Systems Manager operates at the instance/OS level and does not vend or govern cloud accounts.',
        'CloudFormation StackSets alone do not provide account lifecycle vending, guardrail governance dashboards, or automated audit account baselining.'
      ],
      decisiveClue: 'Automated Landing Zone setup with Account Factory and built-in preventive guardrails specifies AWS Control Tower.',
      difficulty: 'advanced',
      isOriginal: true
    },
    quickRevision: [
      'Sets up a Well-Architected Landing Zone in ~60 minutes.',
      'Creates Core accounts: Management, Log Archive, and Audit (Security).',
      'Controls (Guardrails): Preventive (SCPs) and Detective (AWS Config).',
      'Account Factory enables self-service compliant account vending.'
    ],
    sources: [
      { title: 'AWS Control Tower User Guide', url: 'https://docs.aws.amazon.com/controltower/latest/userguide/what-is-control-tower.html' },
      { title: 'Control Tower Controls Reference', url: 'https://docs.aws.amazon.com/controltower/latest/userguide/controls-reference.html' }
    ],
    searchTerms: ['control tower', 'landing zone', 'account factory', 'guardrails', 'multi-account governance', 'well-architected']
  }
];
