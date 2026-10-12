import { Comparison } from '../../types';

export const observabilityComparisons: Comparison[] = [
  {
    id: 'cw-metrics-vs-logs',
    title: 'CloudWatch Metrics vs CloudWatch Logs',
    category: 'Observability & Ops',
    serviceA: 'CloudWatch Metrics',
    serviceB: 'CloudWatch Logs',
    problem: 'Distinguishing between aggregated numerical time-series performance data and granular textual event streams for system observability.',
    decisiveDifferences: [
      'Data Representation: CloudWatch Metrics are structured numerical time-series data points (e.g., CPUUtilization = 72.4%) indexed by timestamp, namespace, and dimensions; CloudWatch Logs are unstructured or semi-structured textual log events (e.g., `[ERROR] 2026-10-12 14:00 Database connection failed: timeout`) with timestamps.',
      'Retention & Granularity: Metrics have predefined retention tiers (1-second metrics retained 3 hours, 1-minute metrics retained 15 days, downsampled to 1-hour metrics up to 15 months); Logs retention can be set indefinitely or customized from 1 day to 10 years per log group.',
      'Querying Capability: Metrics are queried using metric math, anomaly detection, and statistical rollups (Average, Sum, p99, Maximum); Logs are queried using CloudWatch Logs Insights with SQL-like regex text searching, string parsing, and filtering.',
      'Cost Drivers: Metrics are billed per custom metric per month plus API query calls; Logs are billed per GB of data ingested, per GB of data stored, and per GB scanned by Logs Insights queries.'
    ],
    whenToChooseA: [
      'Triggering real-time alarms and auto-scaling events based on numerical thresholds (e.g., CPU > 80%, 5xx errors > 5%).',
      'Displaying operational dashboards showing system health, latency percentiles (p95, p99), and throughput graphs over time.',
      'Long-term historical trend analysis of resource utilization and capacity planning.'
    ],
    whenToChooseB: [
      'Debugging root-cause application failures, stack traces, unhandled exceptions, and error context.',
      'Storing security audit trails, web access logs (Nginx/Apache), and compliance event histories.',
      'Searching for specific transaction IDs or user IDs across distributed microservice stdout/stderr outputs.'
    ],
    workTogether: 'CloudWatch Metric Filters bridge the two: An engineer configures a Metric Filter on a CloudWatch Logs group to search for `"ERROR 500"`, converting occurrences into a numerical CloudWatch Metric that increments with each error, allowing an automated CloudWatch Alarm to trigger when errors spike.',
    tradeoffs: [
      {
        dimension: 'Data Format',
        optionA: 'Numerical time-series floating-point values.',
        optionB: 'Raw text, JSON, or unstructured log event records.'
      },
      {
        dimension: 'Alarm Triggering',
        optionA: 'Direct; evaluates mathematical thresholds and statistical anomalies.',
        optionB: 'Indirect; requires Metric Filters or Logs Insights query rules.'
      },
      {
        dimension: 'Cost Model',
        optionA: 'Per active metric ($0.30/metric/mo) + metric API calls.',
        optionB: 'Per GB ingested ($0.50/GB) + per GB stored ($0.03/GB/mo).'
      }
    ],
    scenario: 'An operations team monitors an e-commerce checkout service. CloudWatch Metrics tracks the p99 response time and error count on a live dashboard. When an error spike occurs, engineers use CloudWatch Logs Insights to query the application log stream and inspect the exact Java stack trace.',
    question: {
      id: 'quiz-cw-metrics-vs-logs-1',
      question: 'A development team needs to configure an automated alarm that notifies an on-call engineer when an application emits more than 20 "PaymentGatewayTimeout" errors within a 5-minute window. The application outputs standard text logs to stdout. What is the most efficient configuration?',
      type: 'single',
      options: [
        'Stream logs to Amazon S3 and run hourly Amazon Athena SQL queries',
        'Configure a CloudWatch Logs Metric Filter to increment a custom metric on "PaymentGatewayTimeout", and create a CloudWatch Alarm on that metric',
        'Export all logs to an EC2 instance running Elasticsearch with custom bash scripts',
        'Create a CloudWatch Metric Alarm directly monitoring the raw CloudWatch Log Stream text'
      ],
      correctAnswers: [1],
      explanation: 'CloudWatch Logs Metric Filters parse log events matching specific patterns (such as "PaymentGatewayTimeout") and convert them into numerical CloudWatch Metrics. A CloudWatch Alarm can then evaluate the metric threshold and notify engineers immediately.',
      whyOthersWrong: [
        'Athena queries on S3 logs are asynchronous and run on batch schedules, which cannot provide near real-time 5-minute alerting.',
        'Running a dedicated EC2 Elasticsearch cluster introduces high operational overhead and maintenance compared to native CloudWatch features.',
        'CloudWatch Metric Alarms can only evaluate numerical metrics, not raw text strings directly in log streams.'
      ],
      decisiveClue: 'Convert text log errors into an automated real-time alarm within a 5-minute window.',
      difficulty: 'intermediate',
      isOriginal: true,
      source: 'Original AWS certification-style practice question'
    },
    sources: [
      { title: 'Amazon CloudWatch Metrics Concepts', url: 'https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/working_with_metrics.html' },
      { title: 'CloudWatch Logs Metric Filters', url: 'https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/MonitoringLogData.html' }
    ]
  },
  {
    id: 'cloudwatch-vs-xray',
    title: 'CloudWatch vs X-Ray',
    category: 'Observability & Ops',
    serviceA: 'Amazon CloudWatch',
    serviceB: 'AWS X-Ray',
    problem: 'Monitoring macro system resource health and aggregate logs versus analyzing microservice distributed request traces and latency bottlenecks.',
    decisiveDifferences: [
      'Observability Pillar: CloudWatch focuses on Metrics and Logs (system-level resource utilization, aggregate throughput, textual logs); AWS X-Ray focuses on Distributed Tracing (end-to-end request journeys across distributed microservices).',
      'Trace Context & Propagation: X-Ray injects and propagates trace headers (`X-Amzn-Trace-Id`) across HTTP request chains, correlating subsegments, database calls, and downstream API invocations into a coherent timeline; CloudWatch records isolated events per service.',
      'Service Map Visualization: X-Ray generates an interactive Service Map showing interconnected microservices, downstream dependencies, latencies, and error rates per edge; CloudWatch dashboards display graphs of pre-configured metrics.',
      'Instrumentation: CloudWatch collects metrics and logs out of the box via agent or service integration; X-Ray requires instrumenting application code with the AWS X-Ray SDK or AWS Distro for OpenTelemetry (ADOT).'
    ],
    whenToChooseA: [
      'Monitoring host-level and service-level infrastructure metrics (EC2 CPU, RDS IOPS, Lambda duration, ALB 5xx count).',
      'Setting alarms to trigger automated scaling policies or PagerDuty alerts.',
      'Aggregating, searching, and retaining application error logs.'
    ],
    whenToChooseB: [
      'Identifying the exact microservice or downstream database query causing a 2-second latency spike in a distributed architecture.',
      'Visualizing the dependency graph and traffic flow between dozens of decoupled microservices (Service Map).',
      'Analyzing request call trees to see time spent in individual internal method calls and external API requests.'
    ],
    workTogether: 'CloudWatch ServiceLens unifies CloudWatch Metrics, CloudWatch Logs, and AWS X-Ray Traces into a single interface. An operator spots an elevated latency metric in CloudWatch, clicks into the X-Ray trace to identify the faulty microservice, and seamlessly views the corresponding CloudWatch logs for that exact request ID.',
    tradeoffs: [
      {
        dimension: 'Observability Focus',
        optionA: 'Metrics & Logs (macro-level operational health and system events).',
        optionB: 'Distributed Tracing (micro-level per-request path and latency breakdown).'
      },
      {
        dimension: 'Code Instrumentation',
        optionA: 'Minimal: AWS services emit metrics automatically; agents collect logs.',
        optionB: 'SDK Required: Application code must be instrumented to propagate trace IDs.'
      },
      {
        dimension: 'Visualization Paradigm',
        optionA: 'Time-series graphs, single-metric widgets, log query tables.',
        optionB: 'Dynamic distributed Service Map and hierarchical trace waterfall charts.'
      }
    ],
    scenario: 'A user checkout request spans API Gateway, an Authentication Lambda, an Orders ECS task, and an Amazon DynamoDB table. When checkouts take 4 seconds instead of 200 ms, engineers use AWS X-Ray to pinpoint that a slow DynamoDB table scan in the Orders service is responsible for 3.8 seconds of the delay.',
    question: {
      id: 'quiz-cloudwatch-vs-xray-1',
      question: 'A distributed e-commerce application consists of 25 microservices communicating via HTTP APIs. Customers report intermittent checkout delays. The development team needs to trace individual user requests across all 25 services to identify the specific downstream component causing the latency bottleneck. Which service should they use?',
      type: 'single',
      options: [
        'Amazon CloudWatch Logs Insights',
        'AWS CloudTrail Insights',
        'AWS X-Ray',
        'Amazon Inspector'
      ],
      correctAnswers: [2],
      explanation: 'AWS X-Ray is purpose-built for distributed tracing. By propagating trace IDs across microservices, X-Ray collects trace data, creates a service map, and generates waterfall timelines to pinpoint the exact downstream component causing latency.',
      whyOthersWrong: [
        'CloudWatch Logs Insights queries text logs within individual log groups, but does not provide distributed trace visualization or cross-service latency waterfall trees out of the box.',
        'CloudTrail Insights detects anomalies in AWS API call volume, not internal application microservice latency.',
        'Amazon Inspector scans workloads for software vulnerabilities, not request latency.'
      ],
      decisiveClue: 'Trace individual requests across 25 microservices to identify the downstream component causing latency.',
      difficulty: 'beginner',
      isOriginal: true,
      source: 'Original AWS certification-style practice question'
    },
    sources: [
      { title: 'AWS X-Ray Developer Guide', url: 'https://docs.aws.amazon.com/xray/latest/devguide/aws-xray.html' },
      { title: 'Amazon CloudWatch ServiceLens', url: 'https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ServiceLens.html' }
    ]
  },
  {
    id: 'xray-vs-otel',
    title: 'X-Ray vs OpenTelemetry-Based Tracing',
    category: 'Observability & Ops',
    serviceA: 'AWS X-Ray SDK (Proprietary)',
    serviceB: 'AWS Distro for OpenTelemetry (ADOT)',
    problem: 'Selecting between AWS proprietary tracing SDKs and vendor-neutral open-source OpenTelemetry standards for application instrumentation.',
    decisiveDifferences: [
      'Standard & Portability: AWS X-Ray SDK uses proprietary AWS data formats and SDK APIs, binding the code to AWS; OpenTelemetry (OTel / ADOT) is a CNCF open-source industry standard, allowing code instrumentation to remain portable across any backend (Datadog, Dynatrace, New Relic, Jaeger, or AWS X-Ray).',
      'Telemetry Scope: The legacy X-Ray SDK only collects traces; OpenTelemetry is a unified standard covering Traces, Metrics, and Logs under a single instrumentation framework.',
      'AWS Strategic Direction: AWS actively recommends AWS Distro for OpenTelemetry (ADOT) as the preferred path for all modern application instrumentation, putting the legacy X-Ray SDK in maintenance mode.',
      'Collector Architecture: X-Ray SDK sends traces directly to an X-Ray daemon; ADOT utilizes the OpenTelemetry Collector, which can filter, sample, enrich, and fan out telemetry to multiple backends simultaneously.'
    ],
    whenToChooseA: [
      'Maintaining existing legacy AWS applications already instrumented with `aws-xray-sdk`.',
      'Simple, AWS-only projects requiring minimal setup with zero external collector infrastructure.',
      'Environments where adopting new open-source standards is restricted by legacy corporate governance.'
    ],
    whenToChooseB: [
      'New greenfield applications building modern cloud-native observability pipelines.',
      'Multi-cloud or hybrid environments where code must run on AWS and on-premises without vendor lock-in.',
      'Organizations wanting to send telemetry to multiple destinations simultaneously (e.g., AWS X-Ray AND Datadog/Jaeger) from a single instrumentation library.',
      'Unified instrumentation across metrics, traces, and logs.'
    ],
    workTogether: 'Applications are instrumented with the vendor-neutral OpenTelemetry API. The AWS Distro for OpenTelemetry (ADOT) Collector receives these vendor-neutral traces and exports them seamlessly into AWS X-Ray and Amazon CloudWatch as their storage and visualization backend.',
    tradeoffs: [
      {
        dimension: 'Vendor Lock-in',
        optionA: 'High: Code uses AWS-proprietary SDK classes and methods.',
        optionB: 'Zero: Code uses open-source CNCF OpenTelemetry interfaces.'
      },
      {
        dimension: 'Supported Signals',
        optionA: 'Tracing only.',
        optionB: 'Unified Traces, Metrics, and Logs.'
      },
      {
        dimension: 'Export Flexibility',
        optionA: 'Sends data strictly to AWS X-Ray backend.',
        optionB: 'Can simultaneously export to X-Ray, CloudWatch, Prometheus, Jaeger, and Datadog.'
      }
    ],
    scenario: 'An enterprise modernizes its microservices. To ensure their code remains vendor-agnostic and portable across clouds, they instrument services using AWS Distro for OpenTelemetry (ADOT). The ADOT collector exports traces to AWS X-Ray while simultaneously sending metrics to an on-premises Prometheus server.',
    question: {
      id: 'quiz-xray-vs-otel-1',
      question: 'A company wants to instrument its containerized applications for distributed tracing. The architecture team mandates that application code must remain open-source, vendor-neutral, and capable of exporting traces to both AWS X-Ray and third-party observability platforms without code changes. Which tool should they adopt?',
      type: 'single',
      options: [
        'The legacy AWS X-Ray SDK',
        'AWS Distro for OpenTelemetry (ADOT)',
        'Amazon CloudWatch unified agent',
        'AWS Systems Manager AppConfig'
      ],
      correctAnswers: [1],
      explanation: 'AWS Distro for OpenTelemetry (ADOT) is an AWS-supported distribution of the CNCF OpenTelemetry project. It provides vendor-neutral instrumentation and uses the OTel collector to export traces to AWS X-Ray and external third-party backends without changing code.',
      whyOthersWrong: [
        'The legacy AWS X-Ray SDK is proprietary, tightly coupled to AWS, and cannot export to non-AWS backends without complex custom pipelines.',
        'The CloudWatch unified agent collects OS metrics and logs from virtual machines, not application-level distributed tracing.',
        'Systems Manager AppConfig manages application runtime configuration feature flags, not distributed tracing.'
      ],
      decisiveClue: 'Vendor-neutral, open-source instrumentation capable of exporting to both AWS X-Ray and third-party platforms.',
      difficulty: 'intermediate',
      isOriginal: true,
      source: 'Original AWS certification-style practice question'
    },
    sources: [
      { title: 'AWS Distro for OpenTelemetry Documentation', url: 'https://aws-otel.github.io/docs/introduction' },
      { title: 'AWS X-Ray and OpenTelemetry', url: 'https://docs.aws.amazon.com/xray/latest/devguide/xray-services-otel.html' }
    ]
  },
  {
    id: 'session-manager-vs-ssh',
    title: 'Systems Manager Session Manager vs SSH',
    category: 'Observability & Ops',
    serviceA: 'AWS Systems Manager Session Manager',
    serviceB: 'Traditional SSH (Port 22)',
    problem: 'Providing secure administrative terminal shell access to Amazon EC2 instances.',
    decisiveDifferences: [
      'Inbound Network Exposure: Traditional SSH requires opening inbound port 22 in Security Groups and Network ACLs, and often requires a public IP address or public bastion host; Session Manager requires NO open inbound ports (port 22 closed), works with instances in completely private subnets without public IPs, and initiates outbound HTTPS (port 443) connections to the SSM endpoint.',
      'Key Management: SSH requires generating, distributing, rotating, and managing static RSA/ED25519 public/private `.pem` key pairs; Session Manager eliminates SSH keys entirely, authenticating users via standard AWS IAM policies and IAM Identity Center (SSO).',
      'Auditability & Logging: SSH offers minimal centralized auditing without third-party software; Session Manager natively records every keystroke and command output, streaming immutable session logs directly to Amazon S3 and CloudWatch Logs.',
      'Access Control: SSH access is binary (either you have the key or you don\'t); Session Manager supports fine-grained IAM conditions, session duration limits, and MFA requirements.'
    ],
    whenToChooseA: [
      'Enterprise security best practice for administrative terminal access to EC2 instances and on-premises servers.',
      'Instances running in private subnets with no public IPs, no Internet Gateways, and no bastion jump boxes.',
      'Mandates requiring centralized keystroke auditing and logging in CloudWatch/S3 for compliance (SOC2, PCI).',
      'Environments wanting to eliminate SSH key rotation and credential leakage risks.'
    ],
    whenToChooseB: [
      'Quick local testing or temporary sandbox development environments.',
      'Legacy network environments where the SSM Agent cannot be installed or cannot reach AWS endpoints.',
      'Third-party software tools that strictly require traditional raw SSH protocol hooks (though Session Manager plugin supports tunneling SSH over SSM).'
    ],
    workTogether: 'Engineers can use the Session Manager AWS CLI plugin to tunnel standard SSH and SCP commands over the secure Session Manager connection (`ssh -i key ec2-user@i-xxxx`), getting native SSH tooling while keeping port 22 completely closed in Security Groups.',
    tradeoffs: [
      {
        dimension: 'Inbound Security Group Rules',
        optionA: 'No open inbound ports required (0 inbound rules).',
        optionB: 'Requires opening inbound TCP Port 22.'
      },
      {
        dimension: 'Authentication Mechanism',
        optionA: 'AWS IAM credentials, IAM Identity Center (SSO), MFA.',
        optionB: 'Static SSH key pairs (.pem files) stored on user laptops.'
      },
      {
        dimension: 'Centralized Keystroke Logging',
        optionA: 'Built-in automatic logging to S3 and CloudWatch Logs.',
        optionB: 'Requires custom syslog configuration or third-party bastion software.'
      },
      {
        dimension: 'Bastion Host Need',
        optionA: 'Eliminated; connect directly to private instances via AWS console or CLI.',
        optionB: 'Mandatory for accessing instances in private subnets from internet.'
      }
    ],
    scenario: 'A company closes port 22 across all EC2 Security Groups and terminates its public bastion hosts. Developers connect to private backend Linux instances via AWS Systems Manager Session Manager. Every bash session and command executed is automatically logged to an encrypted, locked S3 bucket for security audits.',
    question: {
      id: 'quiz-session-manager-vs-ssh-1',
      question: 'A security officer discovers that developers are storing private SSH keys on personal laptops to access EC2 instances in private subnets via a public bastion host. The officer mandates that port 22 must be closed in all security groups, bastion hosts must be removed, and all shell commands executed by administrators must be logged. Which solution satisfies these requirements?',
      type: 'single',
      options: [
        'Deploy AWS Client VPN and require developers to connect with certificates',
        'Use AWS Systems Manager Session Manager with logging enabled to S3 and CloudWatch',
        'Enable EC2 Instance Connect with an open port 22 security group',
        'Configure AWS CloudTrail Insights on SSH daemon logs'
      ],
      correctAnswers: [1],
      explanation: 'AWS Systems Manager Session Manager provides secure shell access via the SSM agent over outbound HTTPS, eliminating open inbound port 22, bastion hosts, and SSH keys. It natively logs all session keystrokes and outputs to S3 and CloudWatch Logs.',
      whyOthersWrong: [
        'AWS Client VPN provides network routing, but developers would still need SSH keys and port 22 open on instances.',
        'EC2 Instance Connect pushes temporary SSH keys, but still requires open inbound port 22 and bastion hosts or public IPs.',
        'CloudTrail Insights detects account API anomalies, but cannot inspect or log terminal shell sessions inside an OS.'
      ],
      decisiveClue: 'Close port 22, eliminate bastion hosts and SSH keys, and log all shell commands.',
      difficulty: 'beginner',
      isOriginal: true,
      source: 'Original AWS certification-style practice question'
    },
    sources: [
      { title: 'AWS Systems Manager Session Manager', url: 'https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager.html' },
      { title: 'Session Manager Security Best Practices', url: 'https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager-security.html' }
    ]
  },
  {
    id: 'run-command-vs-automation',
    title: 'Systems Manager Run Command vs Automation',
    category: 'Observability & Ops',
    serviceA: 'SSM Run Command',
    serviceB: 'SSM Automation',
    problem: 'Executing targeted commands inside operating systems versus orchestrating complex multi-step workflows across AWS cloud resources.',
    decisiveDifferences: [
      'Execution Domain: Run Command executes scripts and commands INSIDE the operating system of managed instances via the SSM Agent (e.g., executing a bash script, restarting a systemd service, checking disk usage); Automation executes multi-step workflows across AWS cloud API resources and services (e.g., creating an AMI, updating an Auto Scaling group, invoking a Lambda function, rebooting instances).',
      'Workflow Capabilities: Run Command is a single command/document execution across a fleet of instances with rate-limiting and error thresholds; Automation provides stateful multi-step orchestration (runbooks) with branching logic, manual approval steps, rollbacks, and error-handling steps.',
      'Permission Model: Run Command requires instances to have the SSM managed instance core IAM role; Automation requires an Automation assume role with IAM permissions across the various AWS services orchestrated in the runbook.'
    ],
    whenToChooseA: [
      'Running ad-hoc bash or PowerShell scripts across a fleet of 500 EC2 instances simultaneously without SSH.',
      'Deploying an emergency configuration patch or restarting an application service (Apache, Nginx) on multiple servers.',
      'Collecting diagnostic log files or checking installed package versions across instance fleets.'
    ],
    whenToChooseB: [
      'Automated end-to-end Golden AMI creation pipelines (launch EC2, install software, run sysprep, create AMI, terminate instance).',
      'Automated disaster recovery runbooks (failover databases, update DNS, scale up standby ASGs).',
      'Remediating non-compliant AWS Config findings (e.g., an unencrypted S3 bucket triggers an Automation runbook that applies bucket encryption).',
      'Workflows requiring human approval steps before continuing.'
    ],
    workTogether: 'An SSM Automation runbook can call SSM Run Command as one of its internal workflow steps: The Automation runbook coordinates spinning up a test instance, invokes Run Command to execute test scripts inside the OS, and if successful, triggers the AWS API to create an AMI.',
    tradeoffs: [
      {
        dimension: 'Execution Scope',
        optionA: 'In-guest operating system shell execution (bash / PowerShell).',
        optionB: 'AWS Cloud API resource orchestration and cross-service actions.'
      },
      {
        dimension: 'Workflow Complexity',
        optionA: 'Single-action command execution with rate and concurrency controls.',
        optionB: 'Multi-step runbooks with branching, error catching, and approval gates.'
      },
      {
        dimension: 'Triggering by AWS Config',
        optionA: 'Cannot be used directly as a Config automated remediation target.',
        optionB: 'Standard target for AWS Config automated remediation rules.'
      }
    ],
    scenario: 'A company uses SSM Run Command to run a monthly security hardening script across 200 Linux instances. For their monthly AMI baking pipeline, they use SSM Automation to launch an instance, execute hardening, bake the AMI, share it with subsidiary accounts, and terminate the instance.',
    question: {
      id: 'quiz-run-command-vs-automation-1',
      question: 'A DevOps engineer needs to create an automated monthly workflow that launches an EC2 instance from base Amazon Linux, runs a custom hardening script inside the instance, creates an Amazon Machine Image (AMI), and then terminates the instance. Which AWS capability is purpose-built to orchestrate this multi-step cloud process?',
      type: 'single',
      options: [
        'AWS Systems Manager Run Command',
        'AWS Systems Manager Automation',
        'Amazon CloudWatch Metric Alarms',
        'AWS Systems Manager Parameter Store'
      ],
      correctAnswers: [1],
      explanation: 'AWS Systems Manager Automation runbooks are designed to orchestrate complex multi-step AWS workflows across services (such as launching instances, executing actions, creating AMIs, and terminating resources).',
      whyOthersWrong: [
        'Run Command executes scripts only inside already running instances; it cannot orchestrate AWS API lifecycle actions like creating AMIs or terminating instances.',
        'CloudWatch Metric Alarms monitor performance metrics and trigger simple actions, but cannot orchestrate multi-step build pipelines.',
        'Parameter Store is a configuration value storage service, not a workflow engine.'
      ],
      decisiveClue: 'Orchestrating a multi-step workflow: launch instance, run script, create AMI, and terminate instance.',
      difficulty: 'intermediate',
      isOriginal: true,
      source: 'Original AWS certification-style practice question'
    },
    sources: [
      { title: 'AWS Systems Manager Automation', url: 'https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-automation.html' },
      { title: 'AWS Systems Manager Run Command', url: 'https://docs.aws.amazon.com/systems-manager/latest/userguide/execute-remote-commands.html' }
    ]
  }
];
