import { AWSService } from '../../types';

export const securityServicesPart2: AWSService[] = [
  {
    id: 'guardduty',
    name: 'Amazon GuardDuty',
    shortName: 'GuardDuty',
    category: 'security',
    difficulty: 'intermediate',
    importance: 'important',
    icon: 'Security',
    tagline: 'Intelligent threat detection and continuous security monitoring using machine learning',
    mentalModel: 'An automated cybersecurity detective quietly analyzing background logs for signs of compromised accounts, cryptomining, and malware without installing agents.',
    problemItSolves: 'Detects unauthorized behavior, compromised IAM credentials, Trojan communication, and cryptomining activity across your AWS environment.',
    howItWorks: 'Analyzes massive data streams—VPC Flow Logs, DNS logs, CloudTrail management & data events, EKS audit logs, and RDS login activity—using threat intelligence feeds and machine learning.',
    components: [
      { name: 'Data Source Analyzers', description: 'Agentless log stream ingestion covering VPC Flow Logs, DNS query logs, CloudTrail, S3 data events, EKS audit logs, and RDS.' },
      { name: 'Threat Intelligence Feeds', description: 'Curated malicious IP and domain blacklists from AWS Security, CrowdStrike, and Proofpoint.' },
      { name: 'GuardDuty Findings', description: 'Actionable security alerts classified by severity (Low, Medium, High) with detailed evidence JSON.' },
      { name: 'Malware Protection', description: 'Automated agentless scanning of EBS volumes attached to EC2 instances flagged with suspicious behavior.' }
    ],
    realWorldExample: 'Instantly alerting security teams when an IAM access key is used from an unusual Tor exit node IP to launch hundreds of GPU instances for cryptomining.',
    whenToUse: [
      'Continuous threat detection across multi-account AWS environments with one-click enablement',
      'Detecting compromised EC2 instances communicating with known command-and-control (C2) servers',
      'Detecting anomalous S3 access patterns indicative of data exfiltration'
    ],
    whenNotToUse: [
      'Inline real-time blocking of HTTP web application attacks (use AWS WAF)',
      'Scanning container images or OS software for known CVE vulnerabilities (use Amazon Inspector)'
    ],
    practicalImplementation: {
      cli: 'aws guardduty create-detector --enable'
    },
    security: 'Completely agentless; operates out-of-band with zero impact on workload CPU, memory, or network performance.',
    costDrivers: 'Volume of CloudTrail events analyzed, VPC Flow Log / DNS log analysis volume, and number of EKS/RDS audit events analyzed.',
    limitations: [
      'GuardDuty is a detective service, not a preventative inline firewall (it alerts; automated remediation requires EventBridge + Lambda)',
      'DNS logs analyzed are only those routed through the default Amazon VPC DNS resolver (.2 resolver)'
    ],
    commonMistakes: [
      'Thinking GuardDuty requires installing an agent on EC2 instances (it is completely agentless)',
      'Not integrating GuardDuty with EventBridge and SNS to trigger automated alerts or remediation workflows',
      'Not enabling GuardDuty across all AWS regions'
    ],
    alternatives: [
      { service: 'inspector', reason: 'Focuses on software CVE package vulnerability scanning rather than live threat detection' },
      { service: 'waf', reason: 'Inline Layer 7 HTTP traffic blocking' }
    ],
    relatedServices: ['security-hub', 'detective', 'cloudtrail', 'eventbridge'],
    scenarioQuestion: {
      id: 'q-gd-01',
      question: 'A cloud security team receives an alert that an EC2 instance in a private subnet is communicating with a known cryptocurrency mining command-and-control server. Which AWS service natively detected this malicious activity without installing any host software?',
      type: 'single',
      options: [
        'Amazon GuardDuty analyzing VPC Flow Logs and DNS query logs.',
        'AWS WAF analyzing Layer 7 HTTP headers.',
        'Amazon Inspector performing a software inventory check.',
        'AWS Systems Manager Patch Manager.'
      ],
      correctAnswers: [0],
      explanation: 'Amazon GuardDuty analyzes VPC Flow Logs, DNS logs, and CloudTrail events agentlessly to detect known threats such as cryptomining and C2 communication.',
      whyOthersWrong: [
        'AWS WAF inspects inbound HTTP web traffic to load balancers, not outbound EC2 network protocol anomalies.',
        'Amazon Inspector scans for known CVE vulnerabilities in operating system packages, not active live network threat communication.',
        'Systems Manager Patch Manager automates OS patching, not threat detection.'
      ],
      decisiveClue: 'Agentless threat detection of cryptomining and command-and-control communication points directly to Amazon GuardDuty.',
      difficulty: 'intermediate',
      isOriginal: true
    },
    quickRevision: [
      '100% agentless: zero impact on EC2 CPU, memory, or performance.',
      'Data sources: CloudTrail, VPC Flow Logs, DNS logs, S3 data events, EKS audit logs, RDS login logs.',
      'Integrates with EventBridge for automated remediation (e.g. isolate instance SG).',
      'Enables across all accounts in AWS Organizations with a single click.'
    ],
    sources: [
      { title: 'Amazon GuardDuty User Guide', url: 'https://docs.aws.amazon.com/guardduty/latest/ug/what-is-guardduty.html' },
      { title: 'GuardDuty Finding Types', url: 'https://docs.aws.amazon.com/guardduty/latest/ug/guardduty_finding-types-active.html' }
    ],
    searchTerms: ['guardduty', 'threat detection', 'cryptomining', 'c2 communication', 'agentless', 'machine learning']
  },
  {
    id: 'inspector',
    name: 'Amazon Inspector',
    shortName: 'Inspector',
    category: 'security',
    difficulty: 'intermediate',
    importance: 'supporting',
    icon: 'Security',
    tagline: 'Automated vulnerability management for compute workloads and container images',
    mentalModel: 'An automated medical scanner that scans your EC2 instances, Lambda code, and container images for known software diseases (CVEs) and security bugs.',
    problemItSolves: 'Identifies software vulnerabilities (CVEs) and unintended network exposure across EC2 instances, ECR container images, and Lambda functions.',
    howItWorks: 'Uses the AWS Systems Manager (SSM) agent for EC2 vulnerability scanning and scans container images in ECR and Lambda function code repositories automatically on push and continuously thereafter.',
    components: [
      { name: 'EC2 Scanning', description: 'Scans EC2 instances for OS package vulnerabilities and unintended network path exposure.' },
      { name: 'ECR Container Scanning', description: 'Automated continuous vulnerability scanning for container images stored in Amazon ECR.' },
      { name: 'Lambda Code & Dependency Scanning', description: 'Scans Lambda application dependencies and custom code for code security vulnerabilities.' },
      { name: 'Inspector Score', description: 'Contextual risk rating based on CVSS score combined with active exploit availability in the wild.' }
    ],
    realWorldExample: 'Automatically alerting a developer that a recently pushed Docker image in Amazon ECR contains a critical OpenSSL remote code execution vulnerability.',
    whenToUse: [
      'Continuous Common Vulnerabilities and Exposures (CVE) scanning on EC2, ECR, and Lambda',
      'Assessing network reachability to verify whether EC2 ports are exposed to the internet',
      'Enterprise vulnerability management compliance across multi-account AWS Organizations'
    ],
    whenNotToUse: [
      'Detecting live runtime attacks or compromised credentials (use Amazon GuardDuty)',
      'Scanning Amazon S3 buckets for sensitive personal data or PII (use Amazon Macie)'
    ],
    practicalImplementation: {
      cli: 'aws inspector2 enable --resource-types EC2 ECR LAMBDA'
    },
    security: 'Provides contextual vulnerability scores factoring in whether an exploit is known in CISA KEV (Known Exploited Vulnerabilities) catalog.',
    costDrivers: 'Number of active EC2 instances scanned, number of initial container image scans + rescan frequency, and number of Lambda functions evaluated.',
    limitations: [
      'EC2 scanning relies on the AWS Systems Manager (SSM) agent being installed and healthy',
      'Scans application dependencies for supported runtimes; custom binary proprietary code requires specialized SAST tools'
    ],
    commonMistakes: [
      'Confusing Amazon Inspector (software vulnerability/CVE scanning) with Amazon GuardDuty (active behavioral threat detection)',
      'Not installing or maintaining the SSM agent on EC2 instances, leaving them uninspected',
      'Failing to enable continuous ECR scanning on repositories'
    ],
    alternatives: [
      { service: 'guardduty', reason: 'Focuses on runtime behavioral anomalies and compromised accounts rather than static package CVEs' },
      { service: 'security-hub', reason: 'Centralizes Inspector findings alongside findings from other security tools' }
    ],
    relatedServices: ['systems-manager', 'ecr', 'lambda', 'security-hub'],
    scenarioQuestion: {
      id: 'q-insp-01',
      question: 'A DevOps team needs to ensure that container images pushed to Amazon ECR and operating systems running on EC2 instances are continuously evaluated for newly disclosed Common Vulnerabilities and Exposures (CVEs). Which service provides this automated scanning?',
      type: 'single',
      options: [
        'Amazon Inspector with continuous scanning enabled.',
        'Amazon GuardDuty with ECR protection.',
        'AWS Systems Manager Patch Manager with manual baselines.',
        'AWS Config with IAM policy rules.'
      ],
      correctAnswers: [0],
      explanation: 'Amazon Inspector automatically and continuously scans EC2 instances, container images in ECR, and Lambda functions for software package vulnerabilities and CVEs.',
      whyOthersWrong: [
        'GuardDuty detects anomalous runtime threats and compromised behavior, not package CVE vulnerability inventory.',
        'Patch Manager installs operating system updates; it does not provide continuous CVE vulnerability discovery and scoring.',
        'AWS Config evaluates AWS resource configuration states, not internal OS package CVE registries.'
      ],
      decisiveClue: 'Continuous vulnerability scanning for CVEs in ECR containers and EC2 instances points directly to Amazon Inspector.',
      difficulty: 'intermediate',
      isOriginal: true
    },
    quickRevision: [
      'Scans EC2 instances (via SSM Agent), ECR container images, and Lambda functions.',
      'Contextual risk scoring combines CVSS with active exploit intelligence.',
      'Continuous scanning: automatically rescans when new CVEs are published to the National Vulnerability Database.',
      'Inspector = Vulnerability & CVE scanning; GuardDuty = Behavioral threat detection.'
    ],
    sources: [
      { title: 'Amazon Inspector User Guide', url: 'https://docs.aws.amazon.com/inspector/latest/user/what-is-inspector.html' },
      { title: 'Amazon Inspector Scanning Types', url: 'https://docs.aws.amazon.com/inspector/latest/user/scanning-resources.html' }
    ],
    searchTerms: ['inspector', 'vulnerability scanning', 'cve', 'ecr scanning', 'ssm agent', 'cvss score']
  },
  {
    id: 'macie',
    name: 'Amazon Macie',
    shortName: 'Macie',
    category: 'security',
    difficulty: 'intermediate',
    importance: 'supporting',
    icon: 'Security',
    tagline: 'Data security service that discovers and protects sensitive data stored in Amazon S3',
    mentalModel: 'An automated document reader that uses pattern matching and machine learning to scan files inside your S3 buckets for credit card numbers, passwords, and sensitive PII.',
    problemItSolves: 'Prevents data breaches and compliance violations by identifying unencrypted, public, or forgotten S3 buckets containing Personally Identifiable Information (PII).',
    howItWorks: 'Evaluates S3 bucket security posture inventory continuously, and runs automated or scheduled sensitive data discovery jobs to inspect objects using regex and machine learning models.',
    components: [
      { name: 'S3 Bucket Inventory', description: 'Continuous evaluation of bucket access control, encryption status, and public accessibility.' },
      { name: 'Sensitive Data Discovery Jobs', description: 'Configurable discovery jobs that inspect object contents across S3 buckets.' },
      { name: 'Managed Data Identifiers', description: 'Built-in detection patterns for PII (SSNs, credit card numbers, passport IDs, AWS access keys).' },
      { name: 'Custom Data Identifiers', description: 'User-defined regular expressions and proximity keywords for company-specific proprietary data (e.g. employee IDs).' }
    ],
    realWorldExample: 'Alerting compliance officers within an hour when a developer accidentally uploads a customer CSV file containing 10,000 plaintext credit card numbers into a public S3 bucket.',
    whenToUse: [
      'Discovering Personally Identifiable Information (PII) or financial data in Amazon S3 for GDPR/PCI-DSS compliance',
      'Auditing S3 storage across multi-account AWS Organizations for unencrypted or publicly accessible buckets',
      'Locating hardcoded credentials, secret keys, or medical records stored in S3 data lakes'
    ],
    whenNotToUse: [
      'Scanning structured relational databases like RDS or DynamoDB (Macie is strictly dedicated to Amazon S3)',
      'Inline real-time blocking of data uploads to S3 (use S3 bucket policies or Lambda object filters)'
    ],
    practicalImplementation: {
      cli: 'aws macie2 enable'
    },
    security: 'Objects inspected in memory during scanning; Macie never stores or retains customer payload data.',
    costDrivers: 'Number of S3 buckets evaluated for posture, and gigabytes (GB) of object data processed in discovery jobs.',
    limitations: [
      'Only inspects data stored in Amazon S3 (does not inspect EBS, EFS, RDS, or DynamoDB)',
      'Scanning petabyte-scale data lakes can become very costly without targeted job scoping filters'
    ],
    commonMistakes: [
      'Running full discovery jobs across petabytes of raw uncompressed media files instead of using file-type filters (.csv, .json, .parquet)',
      'Confusing Macie with GuardDuty or Inspector',
      'Forgetting to configure automated EventBridge alerts on Macie sensitive data findings'
    ],
    alternatives: [
      { service: 'guardduty', reason: 'Detects anomalous S3 API calls and exfiltration attempts rather than inspecting object content for PII' },
      { service: 'inspector', reason: 'Scans compute software packages for vulnerabilities, not S3 object contents' }
    ],
    relatedServices: ['s3', 'security-hub', 'eventbridge', 'kms'],
    scenarioQuestion: {
      id: 'q-macie-01',
      question: 'A healthcare organization stores millions of diagnostic report files in Amazon S3. For HIPAA compliance, they need to locate any buckets containing unencrypted patient Personally Identifiable Information (PII) and credit card details. Which service should they deploy?',
      type: 'single',
      options: [
        'Amazon Macie with targeted sensitive data discovery jobs.',
        'Amazon GuardDuty with S3 Protection.',
        'Amazon Inspector with S3 integration.',
        'AWS IAM Access Analyzer.'
      ],
      correctAnswers: [0],
      explanation: 'Amazon Macie is specifically designed to discover, classify, and protect sensitive data (PII, financial data, credentials) stored in Amazon S3.',
      whyOthersWrong: [
        'GuardDuty monitors S3 API access logs for anomalous behavior, but does not read or classify object contents for PII.',
        'Amazon Inspector scans EC2, ECR, and Lambda software packages, not S3 object contents.',
        'IAM Access Analyzer validates resource policies for external access, but does not inspect file data within buckets.'
      ],
      decisiveClue: 'Discovering sensitive data (PII, credit cards) stored in Amazon S3 points directly to Amazon Macie.',
      difficulty: 'intermediate',
      isOriginal: true
    },
    quickRevision: [
      'Exclusively dedicated to Amazon S3 data discovery and security posture.',
      'Detects PII, financial info, medical records, and AWS credentials using ML and Regex.',
      'Continuous S3 inventory assessment is enabled automatically upon activation.',
      'Target discovery jobs using prefixes and file types to optimize scanning costs.'
    ],
    sources: [
      { title: 'Amazon Macie User Guide', url: 'https://docs.aws.amazon.com/macie/latest/user/what-is-macie.html' },
      { title: 'Macie Managed Data Identifiers', url: 'https://docs.aws.amazon.com/macie/latest/user/managed-data-identifiers.html' }
    ],
    searchTerms: ['macie', 's3 security', 'pii', 'sensitive data', 'data loss prevention', 'gdpr']
  },
  {
    id: 'security-hub',
    name: 'AWS Security Hub',
    shortName: 'Security Hub',
    category: 'security',
    difficulty: 'intermediate',
    importance: 'important',
    icon: 'Security',
    tagline: 'Cloud security posture management service providing unified security alerts and compliance scorecards',
    mentalModel: 'The master security command center dashboard that collects findings from GuardDuty, Inspector, Macie, IAM Access Analyzer, and AWS Config in a single unified format.',
    problemItSolves: 'Eliminates security alert fatigue and fragmented tooling by normalizing all AWS security findings into the AWS Security Finding Format (ASFF).',
    howItWorks: 'Aggregates findings from AWS services and third-party tools, normalizes them, and continuously evaluates accounts against security standards (CIS AWS Foundations, AWS Foundational Security Best Practices, PCI-DSS).',
    components: [
      { name: 'Security Standards & Benchmarks', description: 'Automated compliance scorecards against CIS, PCI-DSS, and AWS Foundational Security Best Practices (FSBP).' },
      { name: 'AWS Security Finding Format (ASFF)', description: 'Standardized JSON schema normalizing findings across all AWS security services and partner products.' },
      { name: 'Central Configuration', description: 'Centrally enables and configures Security Hub standards across all accounts in an AWS Organization.' },
      { name: 'Automated Response & Remediation', description: 'Custom actions integrating with Amazon EventBridge and Systems Manager to remediate findings with one click.' }
    ],
    realWorldExample: 'A Chief Information Security Officer (CISO) reviewing an organization-wide 84% security score and drilling into critical unencrypted S3 findings across 120 accounts.',
    whenToUse: [
      'Centralized Cloud Security Posture Management (CSPM) across multi-account AWS environments',
      'Benchmarking compliance against CIS AWS Foundations Benchmark or PCI-DSS',
      'Consolidating disparate security alerts from GuardDuty, Inspector, Macie, and AWS Config into a single pane of glass'
    ],
    whenNotToUse: [
      'Performing root-cause graph relationship investigation into complex multi-stage attack campaigns (use Amazon Detective)',
      'Generating low-level network intrusion signatures (use AWS Network Firewall)'
    ],
    practicalImplementation: {
      cli: 'aws securityhub enable-security-hub --enable-default-standards'
    },
    security: 'Provides aggregated posture scores and cross-region finding aggregation into a designated home region.',
    costDrivers: 'Number of security checks evaluated per account per month, plus findings ingested from third-party tools (first 10,000 findings free).',
    limitations: [
      'Security checks rely behind the scenes on AWS Config service recording; AWS Config must be enabled',
      'Remediation is not completely turnkey without configuring EventBridge and Automation runbooks'
    ],
    commonMistakes: [
      'Enabling Security Hub without enabling AWS Config recording in target regions, causing controls to fail evaluation',
      'Failing to designate a central administrator account and home region for multi-region multi-account aggregation',
      'Ignoring findings instead of configuring automated suppression or workflow status updates'
    ],
    alternatives: [
      { service: 'detective', reason: 'Used for deep graph-based root cause investigation once a finding is flagged in Security Hub' },
      { service: 'aws-config', reason: 'Underlying compliance rule engine; Security Hub provides the curated posture dashboard' }
    ],
    relatedServices: ['guardduty', 'inspector', 'macie', 'aws-config', 'detective'],
    scenarioQuestion: {
      id: 'q-sh-01',
      question: 'A security officer needs a single unified dashboard that calculates a cloud security score across all 80 AWS accounts in the organization, checks adherence against the CIS AWS Foundations Benchmark, and aggregates findings from GuardDuty, Inspector, and Macie. Which service should they enable?',
      type: 'single',
      options: [
        'AWS Security Hub with Cross-Account and Cross-Region aggregation.',
        'Amazon CloudWatch ServiceLens with custom dashboards.',
        'Amazon Detective with multi-account integration.',
        'AWS Trusted Advisor Enterprise tier.'
      ],
      correctAnswers: [0],
      explanation: 'AWS Security Hub is AWS\'s Cloud Security Posture Management (CSPM) service that aggregates findings in ASFF format and evaluates compliance against standards like CIS benchmarks.',
      whyOthersWrong: [
        'CloudWatch ServiceLens monitors application performance metrics, traces, and service maps, not security compliance benchmarks.',
        'Amazon Detective is an investigative forensic service for root-cause analysis, not a compliance benchmark scoring dashboard.',
        'Trusted Advisor provides basic best practice recommendations, but does not aggregate findings from GuardDuty, Inspector, and Macie into ASFF format.'
      ],
      decisiveClue: 'Unified security dashboard aggregating GuardDuty, Inspector, and Macie with CIS compliance scorecards points to AWS Security Hub.',
      difficulty: 'intermediate',
      isOriginal: true
    },
    quickRevision: [
      'Normalizes all findings into the standard AWS Security Finding Format (ASFF).',
      'Evaluates compliance against standards: CIS AWS Foundations, PCI-DSS, AWS FSBP.',
      'Aggregates findings across multiple accounts and multiple regions into a Home Region.',
      'Requires AWS Config resource recording to evaluate security checks.'
    ],
    sources: [
      { title: 'AWS Security Hub User Guide', url: 'https://docs.aws.amazon.com/securityhub/latest/userguide/what-is-securityhub.html' },
      { title: 'AWS Security Finding Format (ASFF)', url: 'https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-findings-format.html' }
    ],
    searchTerms: ['security hub', 'cspm', 'asff', 'cis benchmark', 'compliance score', 'unified findings']
  },
  {
    id: 'detective',
    name: 'Amazon Detective',
    shortName: 'Detective',
    category: 'security',
    difficulty: 'advanced',
    importance: 'supporting',
    icon: 'Security',
    tagline: 'Investigate and analyze the root cause of potential security issues using interactive graph models',
    mentalModel: 'A digital forensic lab that automatically pieces together timelines, entity relationship graphs, and visual evidence to uncover how a hacker breached your systems.',
    problemItSolves: 'Saves security analysts hours or days of manual log parsing during incident response by automatically constructing visual investigation graphs.',
    howItWorks: 'Extracts and processes event data from VPC Flow Logs, CloudTrail logs, EKS audit logs, and GuardDuty findings into a graph database to visualize relationships between IPs, IAM roles, and EC2 instances.',
    components: [
      { name: 'Behavior Graph', description: 'Time-series graph model linking entities (IPs, users, instances, VPCs) and their interactions over time.' },
      { name: 'Entity Profiles', description: 'Visual analytical summaries detailing historical activity baselines, IP geographic origins, and resource interactions.' },
      { name: 'Finding Groups', description: 'Correlates multiple disparate findings related to the same attack pattern into a unified incident investigation.' }
    ],
    realWorldExample: 'A security analyst investigating a GuardDuty alert clicks "Investigate in Detective" to visually see the attacker\'s IP address, the assumed IAM role, and every EC2 instance touched over 14 days.',
    whenToUse: [
      'Triaging and performing root-cause analysis on high-severity GuardDuty or Security Hub findings',
      'Visualizing the blast radius and attack timeline of a compromised IAM credential',
      'Forensic investigation across multi-account AWS environments without writing complex log queries'
    ],
    whenNotToUse: [
      'Initial detection of threats or alerting (use Amazon GuardDuty)',
      'Aggregating compliance checklists and CIS scores (use AWS Security Hub)',
      'Inline blocking of web traffic (use AWS WAF)'
    ],
    practicalImplementation: {
      cli: 'aws detective create-graph'
    },
    security: 'Maintains up to 1 year of aggregated behavioral data. Automatically ingests logs without customer infrastructure overhead.',
    costDrivers: 'Volume of log data ingested from VPC Flow Logs, CloudTrail, and EKS audit logs (per gigabyte ingested per month).',
    limitations: [
      'Requires data ingestion over several days to build reliable historical baseline models',
      'Cannot perform direct remediation actions (must use Systems Manager or manual ops)'
    ],
    commonMistakes: [
      'Trying to use Detective as an alerting tool instead of an incident investigation tool',
      'Not integrating Detective directly with GuardDuty and Security Hub for seamless one-click pivoting',
      'Waiting until after an incident occurs to enable Detective, missing historical baselines'
    ],
    alternatives: [
      { service: 'cloudwatch', reason: 'Querying raw logs manually using CloudWatch Logs Insights' },
      { service: 'athena', reason: 'Writing custom SQL queries against raw CloudTrail/VPC Flow logs in S3' }
    ],
    relatedServices: ['guardduty', 'security-hub', 'cloudtrail', 'vpc'],
    scenarioQuestion: {
      id: 'q-det-01',
      question: 'A security incident response team receives an alert that an IAM role was compromised. The team needs to visualize the timeline of all API calls, IP addresses, and EC2 resources accessed by this credential over the past two weeks without manually writing Athena queries against terabytes of raw logs. Which service should they use?',
      type: 'single',
      options: [
        'Amazon Detective using its interactive behavior graph and entity profiles.',
        'AWS CloudTrail console 90-day event history view.',
        'Amazon CloudWatch metric graphs with anomalies filter.',
        'AWS IAM Access Analyzer policy validation tool.'
      ],
      correctAnswers: [0],
      explanation: 'Amazon Detective automatically builds an interactive behavior graph from CloudTrail and VPC Flow Logs, allowing analysts to visualize activity timelines and blast radius instantly.',
      whyOthersWrong: [
        'CloudTrail event history is difficult to correlate across multiple accounts and entities, requiring manual pagination without graph visualization.',
        'CloudWatch metric graphs show numerical telemetry aggregations, not discrete entity relationship forensic timelines.',
        'IAM Access Analyzer validates policy grammar and external access; it does not perform forensic timeline investigations.'
      ],
      decisiveClue: 'Visualizing attack timelines, entity relationships, and behavioral graphs for incident response points directly to Amazon Detective.',
      difficulty: 'advanced',
      isOriginal: true
    },
    quickRevision: [
      'Forensic root-cause analysis tool that builds visual behavior graphs.',
      'Ingests VPC Flow Logs, CloudTrail, EKS audit logs, and GuardDuty findings.',
      'Provides 1-click pivot directly from GuardDuty and Security Hub console.',
      'Retains up to 1 year of aggregated behavioral data for investigations.'
    ],
    sources: [
      { title: 'Amazon Detective User Guide', url: 'https://docs.aws.amazon.com/detective/latest/userguide/what-is-detective.html' },
      { title: 'Detective Finding Groups', url: 'https://docs.aws.amazon.com/detective/latest/userguide/finding-groups.html' }
    ],
    searchTerms: ['detective', 'behavior graph', 'forensic analysis', 'root cause', 'incident response', 'entity profiles']
  },
  {
    id: 'waf',
    name: 'AWS WAF',
    shortName: 'WAF',
    category: 'security',
    difficulty: 'intermediate',
    importance: 'important',
    icon: 'Security',
    tagline: 'Web application firewall to protect web apps and APIs against common web exploits and bots',
    mentalModel: 'A digital bouncer inspecting every HTTP/HTTPS request entering your web door, blocking hackers attempting SQL injection, cross-site scripting, or automated scrapers.',
    problemItSolves: 'Protects internet-facing web applications from Layer 7 exploits, OWASP Top 10 vulnerabilities, and automated bot scraping that bypass network firewalls.',
    howItWorks: 'Evaluates HTTP/HTTPS traffic matching defined Web ACL rules attached directly to Application Load Balancers, Amazon CloudFront, Amazon API Gateway, or AWS AppSync.',
    components: [
      { name: 'Web ACL (Access Control List)', description: 'Container evaluating rules with a default action (Allow or Block).' },
      { name: 'AWS Managed Rules (AMR)', description: 'Pre-configured rules maintained by AWS (Core Rule Set, SQLi, Known Bad Inputs, Bot Control).' },
      { name: 'Custom Rules', description: 'User-defined matching criteria based on IP sets, regex, geographic country, HTTP headers, query strings, or body.' },
      { name: 'Rate-Based Rules', description: 'Automatically blocks or rate-limits IP addresses that exceed a specified request threshold within a 5-minute sliding window.' }
    ],
    realWorldExample: 'Blocking SQL injection attacks and rate-limiting brute force login attempts to 100 requests per 5 minutes on an e-commerce API.',
    whenToUse: [
      'Protecting web applications against OWASP Top 10 vulnerabilities (SQL injection, XSS, CSRF)',
      'Mitigating Layer 7 application DDoS and HTTP flood attacks using rate-based rules',
      'Blocking traffic from specific geographic countries or known malicious IP lists'
    ],
    whenNotToUse: [
      'Protecting non-HTTP protocols like raw TCP or UDP (use AWS Network Firewall or Security Groups)',
      'Subnet-level layer 4 IP packet filtering (use Network ACLs)'
    ],
    practicalImplementation: {
      cli: 'aws wafv2 create-web-acl --name ProductionWebACL --scope REGIONAL --default-action Allow={} --visibility-config SampledRequestsEnabled=true,CloudWatchMetricsEnabled=true,MetricName=ProdWAF'
    },
    security: 'Inspects full HTTP body, headers, cookies, and query strings. Integrates with AWS Shield Advanced for automated layer 7 DDoS mitigation.',
    costDrivers: 'Monthly fee per Web ACL ($5.00), fee per rule ($1.00), and requests processed ($0.60 per million requests). Managed Bot Control incurs additional fees.',
    limitations: [
      'Body inspection limit is up to 16 KB by default for regional resources (up to 64 KB configurable on CloudFront)',
      'Web ACL capacity units (WCU) cap the complexity of rules in a single Web ACL (default 1,500 WCU)'
    ],
    commonMistakes: [
      'Deploying new WAF rules directly in "Block" mode instead of "Count" mode, accidentally taking down production traffic',
      'Confusing Regional WAF (ALB/API Gateway) with CloudFront WAF (`--scope CLOUDFRONT` requires `us-east-1`)',
      'Not enabling sampled requests or full logging to CloudWatch / Kinesis for debugging false positives'
    ],
    alternatives: [
      { service: 'shield', reason: 'Focuses specifically on Layer 3/4 and Layer 7 DDoS attacks with financial protection' },
      { service: 'network-firewall', reason: 'Focuses on VPC network layer deep packet inspection across all protocols' }
    ],
    relatedServices: ['cloudfront', 'elb', 'api-gateway', 'shield', 'firewall-manager'],
    scenarioQuestion: {
      id: 'q-waf-01',
      question: 'An e-commerce login portal behind an Application Load Balancer is experiencing repeated credential stuffing attacks originating from dynamic IP addresses. What is the most effective and managed AWS defense?',
      type: 'single',
      options: [
        'Attach an AWS WAF Web ACL to the ALB containing a Rate-Based Rule and the AWS Managed Rules Bot Control rule group.',
        'Add explicit deny IP rules to the VPC Network ACL for every attacking IP address.',
        'Deploy a Network Load Balancer in front of the Application Load Balancer.',
        'Create a Lambda@Edge function to inspect HTTP basic authentication headers.'
      ],
      correctAnswers: [0],
      explanation: 'AWS WAF rate-based rules automatically throttle IPs exceeding request limits, while AWS Managed Rules Bot Control detects and mitigates automated credential stuffing bots.',
      whyOthersWrong: [
        'NACLs cannot keep up with dynamic rotating IP addresses and do not provide bot detection or rate-limiting.',
        'NLBs operate at Layer 4 and offer no Layer 7 credential stuffing or bot mitigation.',
        'Lambda@Edge works with CloudFront, not directly on an ALB, and requires complex custom bot-signature maintenance compared to native WAF Bot Control.'
      ],
      decisiveClue: 'Mitigating credential stuffing and rate-limiting HTTP requests at Layer 7 on an ALB points directly to AWS WAF.',
      difficulty: 'intermediate',
      isOriginal: true
    },
    quickRevision: [
      'Layer 7 HTTP/HTTPS firewall; attaches to ALB, CloudFront, API Gateway, AppSync.',
      'Always test new rules in COUNT mode before switching to BLOCK mode.',
      'Rate-based rules automatically block IPs exceeding thresholds over 5-minute windows.',
      'AWS Managed Rules (AMR) provide out-of-the-box protection for OWASP Top 10 and Bot Control.'
    ],
    sources: [
      { title: 'AWS WAF Developer Guide', url: 'https://docs.aws.amazon.com/waf/latest/developerguide/what-is-aws-waf.html' },
      { title: 'AWS Managed Rules for WAF', url: 'https://docs.aws.amazon.com/waf/latest/developerguide/aws-managed-rule-groups-list.html' }
    ],
    searchTerms: ['waf', 'web application firewall', 'rate limiting', 'owasp', 'bot control', 'web acl', 'sqli']
  },
  {
    id: 'shield',
    name: 'AWS Shield',
    shortName: 'Shield',
    category: 'security',
    difficulty: 'intermediate',
    importance: 'supporting',
    icon: 'Security',
    tagline: 'Managed Distributed Denial of Service (DDoS) protection service',
    mentalModel: 'A reinforced digital blast shield that automatically absorbs massive volume network DDoS assaults before they can reach your servers.',
    problemItSolves: 'Safeguards applications against Layer 3, 4, and 7 DDoS attacks that attempt to saturate network bandwidth or crash backend servers.',
    howItWorks: 'Operates in two tiers: Shield Standard (automatic, free perimeter defense against SYN floods, UDP reflection) and Shield Advanced (paid, 24/7 Shield Response Team, financial cost protection).',
    components: [
      { name: 'Shield Standard', description: 'Automatically active for all AWS customers at zero cost, defending against common Layer 3 and Layer 4 attacks.' },
      { name: 'Shield Advanced', description: 'Paid enterprise tier ($3,000/month) offering advanced Layer 7 mitigation, 24/7 Shield Response Team (SRT), and DDoS cost protection.' },
      { name: 'DDoS Cost Protection', description: 'Credits for scaling costs incurred by EC2, ALB, CloudFront, or Route 53 during a verified DDoS attack.' },
      { name: 'Shield Response Team (SRT)', description: 'Dedicated AWS security engineers available 24/7 to write custom mitigation rules during active attacks.' }
    ],
    realWorldExample: 'A large fintech bank surviving a 1 Tbps UDP reflection attack and 500k RPS Layer 7 flood with zero application downtime and financial cost reimbursement.',
    whenToUse: [
      'Shield Standard: Always active by default on all AWS public endpoints (Route 53, CloudFront, ELB)',
      'Shield Advanced: Mission-critical enterprise architectures requiring 24/7 human DDoS support, cost protection, and proactive engagement',
      'Shield Advanced: Automatic application layer DDoS mitigation for CloudFront distributions'
    ],
    whenNotToUse: [
      'Small business websites where the $3,000/month Shield Advanced commitment is cost-prohibitive (rely on Shield Standard + AWS WAF)',
      'Internal VPC workloads with no internet-facing endpoints'
    ],
    practicalImplementation: {
      cli: 'aws shield create-protection --name CloudFrontProtection --resource-arn arn:aws:cloudfront::123456789012:distribution/EDFDVBD6EXAMPLE'
    },
    security: 'Shield Standard protects edge endpoints; Shield Advanced provides specialized mitigation algorithms, health-check based engagement, and financial SLA.',
    costDrivers: 'Shield Standard is completely free. Shield Advanced costs $3,000/month per organization (1-year commitment) plus data transfer out fees.',
    limitations: [
      'Shield Advanced requires a 1-year contract commitment and high monthly base fee ($3,000/month)',
      'Shield Standard only covers Layer 3/4 attacks; it does not inspect Layer 7 HTTP exploits'
    ],
    commonMistakes: [
      'Paying for Shield Advanced when standard CloudFront + Route 53 + AWS WAF provides adequate DDoS absorption for small workloads',
      'Failing to associate Route 53 health checks with Shield Advanced protected resources for proactive detection',
      'Not granting permissions to the Shield Response Team (SRT) in advance of an attack'
    ],
    alternatives: [
      { service: 'waf', reason: 'Focuses on granular Layer 7 HTTP application inspection and rate limiting' },
      { service: 'cloudfront', reason: 'Edge network that natively absorbs Layer 3/4 DDoS attacks' }
    ],
    relatedServices: ['waf', 'cloudfront', 'route53', 'elb'],
    scenarioQuestion: {
      id: 'q-shield-01',
      question: 'An enterprise running public services on CloudFront and Route 53 wants financial protection against sudden scaling bills caused by distributed denial of service attacks, along with 24/7 access to AWS specialized DDoS response engineers. Which service tier must they subscribe to?',
      type: 'single',
      options: [
        'AWS Shield Advanced',
        'AWS Shield Standard',
        'AWS WAF with AWS Managed Rules',
        'AWS Network Firewall'
      ],
      correctAnswers: [0],
      explanation: 'AWS Shield Advanced includes 24/7 access to the AWS Shield Response Team (SRT), proactive mitigation, and DDoS cost protection (billing credits for surge scale during attacks).',
      whyOthersWrong: [
        'AWS Shield Standard is free and automatic for L3/L4 attacks, but lacks financial cost protection and access to the SRT.',
        'AWS WAF provides Layer 7 rule filtering, but does not provide DDoS financial reimbursement or dedicated 24/7 SRT engineers.',
        'AWS Network Firewall is an in-VPC inspection firewall and provides no DDoS financial insurance.'
      ],
      decisiveClue: 'DDoS financial cost protection and access to the 24/7 Shield Response Team specifies AWS Shield Advanced.',
      difficulty: 'intermediate',
      isOriginal: true
    },
    quickRevision: [
      'Shield Standard = Free, automatically active for all AWS customers (covers L3/L4 attacks).',
      'Shield Advanced = $3,000/month (1-yr commit), covers L3/L4/L7, includes 24/7 SRT access.',
      'DDoS Cost Protection refunds auto-scaling bills incurred during DDoS attacks.',
      'Combine CloudFront + Route 53 + AWS WAF for maximum architectural DDoS resilience.'
    ],
    sources: [
      { title: 'AWS Shield Developer Guide', url: 'https://docs.aws.amazon.com/waf/latest/developerguide/shield-chapter.html' },
      { title: 'Shield Advanced Features and Pricing', url: 'https://aws.amazon.com/shield/pricing/' }
    ],
    searchTerms: ['shield', 'ddos', 'shield advanced', 'shield response team', 'srt', 'syn flood']
  },
  {
    id: 'firewall-manager',
    name: 'AWS Firewall Manager',
    shortName: 'Firewall Manager',
    category: 'security',
    difficulty: 'advanced',
    importance: 'supporting',
    icon: 'Security',
    tagline: 'Central management of firewall rules across all accounts and applications in AWS Organizations',
    mentalModel: 'A fleet admiral broadcasting security enforcement orders ensuring every ship in the entire corporate fleet deploys the exact same firewalls and security rules.',
    problemItSolves: 'Prevents security blind spots by centrally configuring and enforcing security policies across hundreds of accounts in AWS Organizations.',
    howItWorks: 'Enforces security policies across accounts for AWS WAF, AWS Shield Advanced, Amazon VPC Security Groups, AWS Network Firewall, and Amazon Route 53 Resolver DNS Firewall.',
    components: [
      { name: 'Firewall Manager Policy', description: 'Centrally defined policy specifying which rule set applies to which resources (ALBs, VPCs, CloudFront) across accounts.' },
      { name: 'Security Group Audit Policies', description: 'Detects and remediates overly permissive Security Group rules (e.g. 0.0.0.0/0 on SSH port 22).' },
      { name: 'Network Firewall Policies', description: 'Centrally deploys and configures AWS Network Firewall endpoints across VPCs in member accounts.' },
      { name: 'DNS Firewall Policies', description: 'Distributes Route 53 Resolver DNS domain blocklists across all organization VPCs.' }
    ],
    realWorldExample: 'Automatically attaching a mandatory company-wide AWS WAF Web ACL to every newly created Application Load Balancer across 200 AWS accounts.',
    whenToUse: [
      'Enforcing consistent AWS WAF rules across multiple accounts in AWS Organizations',
      'Centrally managing and auditing Security Groups to prevent developers opening port 22 to the world',
      'Rolling out Route 53 DNS Firewall rules organization-wide to prevent DNS data exfiltration'
    ],
    whenNotToUse: [
      'Single-account AWS setups (manage WAF or Security Groups directly)',
      'Environments not using AWS Organizations (AWS Organizations is a strict prerequisite)'
    ],
    practicalImplementation: {
      cli: 'aws fms associate-admin-account --admin-account 123456789012'
    },
    security: 'Ensures compliance by automatically detecting non-compliant resources and applying remediation policies or alerting security teams.',
    costDrivers: 'Fixed monthly fee per policy per region ($100/policy/region) plus underlying costs of WAF, Shield, or Network Firewall resources created.',
    limitations: [
      'Strict prerequisites: Requires AWS Organizations with "All Features" enabled and an assigned Delegated Administrator account',
      'Config service must be enabled across all member accounts and regions'
    ],
    commonMistakes: [
      'Attempting to use Firewall Manager without enabling AWS Config across all member accounts',
      'Not assigning a Delegated Administrator account and attempting to manage everything from the Organization Management account',
      'Creating redundant policies leading to high monthly policy charges ($100/policy/region)'
    ],
    alternatives: [
      { service: 'waf', reason: 'Direct local management of Web ACLs on specific load balancers' },
      { service: 'security-hub', reason: 'Aggregates posture findings rather than centrally pushing and enforcing firewall policies' }
    ],
    relatedServices: ['organizations', 'waf', 'shield', 'network-firewall', 'aws-config'],
    scenarioQuestion: {
      id: 'q-fms-01',
      question: 'A security operations director mandates that whenever any developer creates an Application Load Balancer in any of the 150 AWS accounts in AWS Organizations, a company-approved AWS WAF Web ACL must be automatically attached. What service provides this centralized cross-account automation?',
      type: 'single',
      options: [
        'AWS Firewall Manager with a centralized WAF policy.',
        'AWS Systems Manager State Manager runbooks.',
        'AWS Control Tower guardrails with Service Catalog.',
        'AWS Security Hub automated finding suppression.'
      ],
      correctAnswers: [0],
      explanation: 'AWS Firewall Manager allows administrators to define a central WAF policy that automatically attaches Web ACLs to newly created ALBs across all accounts in an organization.',
      whyOthersWrong: [
        'SSM State Manager manages OS-level configuration on EC2 instances, not cross-account cloud infrastructure resource attachment.',
        'Control Tower enforces preventive SCPs and detective Config rules, but does not deploy and manage WAF Web ACLs directly.',
        'Security Hub evaluates compliance findings, but does not push and manage firewall rule lifecycles across accounts.'
      ],
      decisiveClue: 'Central cross-account enforcement of WAF rules across all accounts in AWS Organizations specifies AWS Firewall Manager.',
      difficulty: 'advanced',
      isOriginal: true
    },
    quickRevision: [
      'Strict prerequisites: AWS Organizations (All Features enabled) + AWS Config enabled on all accounts.',
      'Centrally manages: AWS WAF, Shield Advanced, Network Firewall, Route 53 DNS Firewall, and Security Groups.',
      'Automatically enforces policies on newly created resources as accounts scale.',
      'Cost: $100 per policy per region plus underlying service costs.'
    ],
    sources: [
      { title: 'AWS Firewall Manager Developer Guide', url: 'https://docs.aws.amazon.com/waf/latest/developerguide/fms-chapter.html' },
      { title: 'Firewall Manager Prerequisites', url: 'https://docs.aws.amazon.com/waf/latest/developerguide/fms-prereq.html' }
    ],
    searchTerms: ['firewall manager', 'fms', 'cross account waf', 'aws organizations', 'security group auditing']
  }
];
