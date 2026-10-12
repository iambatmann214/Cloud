import { Comparison } from '../../types';

export const securityComparisons: Comparison[] = [
  {
    id: 'iam-users-vs-roles',
    title: 'IAM Users vs IAM Roles',
    category: 'Identity & Security',
    serviceA: 'IAM Users',
    serviceB: 'IAM Roles',
    problem: 'Authenticating human identities and application workloads while minimizing the risk of credential leakage.',
    decisiveDifferences: [
      'Credential Lifespan: IAM Users have static, long-term credentials (passwords, permanent Access Key ID and Secret Access Key pairs); IAM Roles have short-lived, temporary security credentials automatically rotated via AWS Security Token Service (STS).',
      'Intended Identity: IAM Users represent physical human beings or legacy systems requiring persistent credentials (AWS strongly recommends against creating long-term IAM users today); IAM Roles represent assumed identities for AWS services (EC2, Lambda, ECS), federated users (Okta, Azure AD), or cross-account access.',
      'Security Posture: IAM Users introduce risk of hardcoded secret leakage in code repositories or config files; IAM Roles eliminate hardcoded secrets by allowing instances and runtimes to retrieve dynamic temporary credentials automatically from metadata services.',
      'Assumption & Policies: IAM Users have attached permissions policies directly; IAM Roles require both a Trust Policy (defining WHO can assume the role) and Permissions Policies (defining WHAT actions the assumed role can perform).'
    ],
    whenToChooseA: [
      'Emergency break-glass accounts where identity federation (SSO) might be temporarily unavailable.',
      'Legacy on-premises automated systems that cannot assume roles or federate using AWS IAM Identity Center or STS (though AWS IAM Roles Anywhere is now preferred).',
      'Local development testing when AWS IAM Identity Center / SSO credentials cannot be easily configured.'
    ],
    whenToChooseB: [
      'Granting AWS services (EC2 instances, Lambda functions, ECS tasks) permissions to access other AWS resources (S3, DynamoDB, SQS).',
      'Human single sign-on (SSO) integrated with enterprise identity providers via AWS IAM Identity Center (Okta, Azure AD, Google Workspace).',
      'Cross-account resource access where users in Account A assume a role in Account B to perform administration.',
      'Temporary elevated privileges that expire automatically after a set duration.'
    ],
    workTogether: 'An IAM User or federated workforce identity logs into the AWS Management Console with minimal base permissions, and then assumes an elevated IAM Role (such as `DBAdminRole`) via STS `AssumeRole` to perform maintenance tasks with short-lived temporary credentials.',
    tradeoffs: [
      {
        dimension: 'Credential Longevity',
        optionA: 'Permanent long-term credentials until manually rotated or revoked.',
        optionB: 'Temporary dynamic credentials valid for 15 minutes up to 12 hours.'
      },
      {
        dimension: 'Leakage Blast Radius',
        optionA: 'Severe: Leaked access keys remain valid indefinitely until revoked.',
        optionB: 'Low: Leaked credentials expire quickly; no permanent secret to steal.'
      },
      {
        dimension: 'Required Policy Types',
        optionA: 'Permissions policies (Identity-based policies).',
        optionB: 'Trust Policy (assume role policy) + Permissions policies.'
      }
    ],
    scenario: 'A developer builds a Python application on EC2 that reads objects from Amazon S3. Instead of embedding static IAM user access keys in the code, the developer attaches an IAM Instance Profile (Role) to the EC2 instance, allowing the AWS SDK to retrieve rotating temporary credentials seamlessly.',
    question: {
      id: 'quiz-iam-users-vs-roles-1',
      question: 'A software engineer is building an application running on an Amazon EC2 instance that needs to write records to Amazon DynamoDB. According to AWS security best practices, how should the application obtain AWS credentials?',
      type: 'single',
      options: [
        'Create an IAM User, generate permanent Access Keys, and embed them in the application source code',
        'Store IAM User Access Keys in an S3 bucket and download them during instance startup',
        'Attach an IAM Role to an EC2 Instance Profile and allow the AWS SDK to automatically retrieve temporary credentials',
        'Use the AWS root account credentials stored securely in an environment variable'
      ],
      correctAnswers: [2],
      explanation: 'AWS best practices mandate using IAM Roles for workloads on EC2. The IAM Role is attached via an Instance Profile, enabling the AWS SDK to retrieve short-lived, automatically rotated temporary credentials from the instance metadata service (IMDSv2) without hardcoding secrets.',
      whyOthersWrong: [
        'Embedding static IAM User keys in source code violates security best practices and risks credential leaks in version control.',
        'Storing permanent access keys on S3 still relies on long-term static secrets and introduces unnecessary credential exposure.',
        'Never use AWS root account credentials for application workloads or everyday operations under any circumstance.'
      ],
      decisiveClue: 'AWS security best practice for EC2 instances accessing DynamoDB without hardcoded credentials.',
      difficulty: 'beginner',
      isOriginal: true,
      source: 'Original AWS certification-style practice question'
    },
    sources: [
      { title: 'IAM Roles Documentation', url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles.html' },
      { title: 'Security Best Practices in IAM', url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html' }
    ]
  },
  {
    id: 'identity-vs-resource-policies',
    title: 'Identity-Based vs Resource-Based Policies',
    category: 'Identity & Security',
    serviceA: 'Identity-Based Policies',
    serviceB: 'Resource-Based Policies',
    problem: 'Controlling AWS authorization by attaching JSON policy documents to actors versus target resources.',
    decisiveDifferences: [
      'Attachment Target: Identity-based policies are attached directly to IAM users, groups, or roles; Resource-based policies are attached directly to specific AWS resources (e.g., S3 bucket policy, KMS key policy, SQS queue policy, Lambda resource policy).',
      'Principal Specification: Identity-based policies DO NOT specify a `Principal` element (the principal is implicitly the entity the policy is attached to); Resource-based policies MUST specify a `Principal` element defining who or what is allowed access.',
      'Cross-Account Access: For cross-account access within the same account boundary, either policy works; for cross-account access, a resource-based policy can grant access directly to an external principal without that principal needing to assume an IAM role (unless KMS is involved, which requires both).',
      'Supported Services: Identity-based policies apply to virtually all AWS services and actions; Resource-based policies are supported only on specific services that implement them (S3, SQS, SNS, KMS, Secrets Manager, Lambda, OpenSearch, etc.).'
    ],
    whenToChooseA: [
      'Managing permissions for internal users, developer roles, and operational teams centralized in IAM.',
      'Setting permission boundaries and Service Control Policies (SCPs) within an organization.',
      'Granting consistent outbound permissions across multiple services for a specific microservice role.'
    ],
    whenToChooseB: [
      'Allowing external AWS accounts or public users access to specific resources (e.g., S3 bucket hosting public images or cross-account data ingestion).',
      'Amazon S3, AWS KMS, and Amazon SQS where resource-level defense-in-depth and strict ownership locks are required.',
      'AWS Lambda functions that need to be invoked directly by external triggers (Amazon SNS, API Gateway, Amazon S3).'
    ],
    workTogether: 'In single-account and cross-account authorization evaluation, AWS evaluates both policies: for same-account access, a single `Allow` in either policy permits the action (provided no explicit `Deny` exists); for cross-account access, the resource-based policy in Account B must allow Account A, and the identity policy in Account A must allow the user to make the call.',
    tradeoffs: [
      {
        dimension: 'Attachment Point',
        optionA: 'Attached to IAM Users, Groups, or Roles.',
        optionB: 'Attached directly to the resource (S3 Bucket, SQS Queue, KMS Key).'
      },
      {
        dimension: 'Principal Element',
        optionA: 'Implicit; Principal element is not permitted in JSON.',
        optionB: 'Mandatory; Principal element explicitly defines the allowed caller.'
      },
      {
        dimension: 'Cross-Account Delegation',
        optionA: 'Requires the external entity to assume an IAM Role in the target account.',
        optionB: 'Can directly grant permissions to an external account principal without role assumption.'
      }
    ],
    scenario: 'A company stores compliance files in an S3 bucket in Account B. Rather than forcing Account A developers to constantly switch roles, the administrator attaches a Resource-Based Bucket Policy in Account B allowing `arn:aws:iam::111111111111:role/AnalyticsRole` in Account A direct read access.',
    question: {
      id: 'quiz-identity-vs-resource-policies-1',
      question: 'A security engineer is creating an IAM policy JSON file and encounters an evaluation syntax error because the statement contains a "Principal" block. The policy is being attached to an IAM Role named "DeveloperRole". What is the cause of this error?',
      type: 'single',
      options: [
        'The Principal element is only valid in resource-based policies and trust policies, not identity-based permissions policies',
        'IAM Roles can only accept AWS Managed Policies and cannot take inline JSON policies',
        'The Principal element must specify a wildcard "*" in identity policies',
        'IAM policies require an XML schema, not JSON'
      ],
      correctAnswers: [0],
      explanation: 'Identity-based permissions policies attached to IAM users, groups, or roles cannot include a "Principal" element because the principal is implicitly the identity to which the policy is attached. "Principal" is only valid in resource-based policies and IAM role trust policies.',
      whyOthersWrong: [
        'IAM Roles fully support inline JSON policies as well as customer managed policies.',
        'Adding a wildcard "*" to a Principal element in an identity-based policy is invalid syntax and will fail validation.',
        'IAM policies are written strictly in JSON, not XML.'
      ],
      decisiveClue: 'Syntax error caused by a "Principal" block in an identity-based policy attached to an IAM Role.',
      difficulty: 'intermediate',
      isOriginal: true,
      source: 'Original AWS certification-style practice question'
    },
    sources: [
      { title: 'Identity-Based vs Resource-Based Policies', url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_identities-vs-resources.html' },
      { title: 'Determining Policy Evaluation Logic', url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic.html' }
    ]
  },
  {
    id: 'secrets-manager-vs-param-store',
    title: 'Secrets Manager vs Parameter Store',
    category: 'Identity & Security',
    serviceA: 'AWS Secrets Manager',
    serviceB: 'AWS Systems Manager Parameter Store',
    problem: 'Storing configuration parameters, API keys, database credentials, and certificates securely.',
    decisiveDifferences: [
      'Automatic Secret Rotation: Secrets Manager provides native, out-of-the-box automatic credential rotation using Lambda functions (with turnkey integrations for RDS, Aurora, DocumentDB, and Redshift); Parameter Store does not have native automatic rotation (requires custom EventBridge/Lambda automation).',
      'Cross-Account / Multi-Region Replication: Secrets Manager natively replicates secrets across multiple AWS regions with automatic synchronization; Parameter Store requires manual scripting or custom CI/CD pipelines to duplicate parameters across regions.',
      'Pricing Model: Secrets Manager charges $0.40 per secret per month plus $0.05 per 10,000 API calls; Parameter Store Standard tier is completely FREE for up to 10,000 parameters (Advanced tier costs $0.05 per parameter per month with higher throughput and 8 KB payload limits).',
      'Primary Focus: Secrets Manager is specialized for high-value secrets and database credentials needing rotation; Parameter Store is a general-purpose hierarchical configuration store for environment variables, license keys, and AMI IDs.'
    ],
    whenToChooseA: [
      'Database credentials (RDS, Aurora) requiring scheduled automatic password rotation without application downtime.',
      'Multi-region applications where secrets must automatically replicate across primary and DR regions.',
      'High-security compliance environments requiring built-in secret generation and automated rotation lifecycles.'
    ],
    whenToChooseB: [
      'General application configuration parameters, URLs, feature flags, and environment variables.',
      'Cost-sensitive architectures storing hundreds of non-rotating secrets or configuration strings for free.',
      'Storing latest Golden AMI IDs referenced in EC2 Auto Scaling Launch Templates or CloudFormation templates.',
      'Hierarchical configuration management (e.g., `/prod/app/db_name`, `/dev/app/db_name`).'
    ],
    workTogether: 'An application reads its general configuration settings (endpoints, log levels, retry counts) from AWS Systems Manager Parameter Store at zero cost, and fetches its sensitive, auto-rotating database master credentials from AWS Secrets Manager.',
    tradeoffs: [
      {
        dimension: 'Automated Rotation',
        optionA: 'Native built-in rotation with turnkey AWS database integrations.',
        optionB: 'No native rotation; requires building custom Lambda and EventBridge pipelines.'
      },
      {
        dimension: 'Pricing',
        optionA: '$0.40 per secret per month + $0.05 per 10,000 API calls.',
        optionB: 'Standard tier is completely free ($0.00) for up to 10,000 parameters.'
      },
      {
        dimension: 'Multi-Region Replication',
        optionA: 'Built-in automatic cross-region secret replication.',
        optionB: 'Regional only; cross-region replication must be scripted.'
      }
    ],
    scenario: 'A company deploys an Amazon RDS MySQL database. Compliance rules require the database administrative password to rotate every 30 days. They store the password in AWS Secrets Manager, which automatically invokes a pre-built Lambda rotation function to update both RDS and the secret seamlessly.',
    question: {
      id: 'quiz-secrets-manager-vs-param-store-1',
      question: 'A financial services firm requires an automated solution to store RDS database passwords. The solution must automatically rotate the database password every 30 days without manual intervention and must replicate the secret to a disaster recovery AWS Region. Which service should they choose?',
      type: 'single',
      options: [
        'AWS Systems Manager Parameter Store (Standard Tier)',
        'AWS Key Management Service (AWS KMS) raw keys',
        'AWS Secrets Manager',
        'Amazon S3 with SSE-S3 encryption'
      ],
      correctAnswers: [2],
      explanation: 'AWS Secrets Manager natively supports automatic scheduled secret rotation for Amazon RDS databases using managed Lambda functions and offers turnkey multi-region secret replication.',
      whyOthersWrong: [
        'SSM Parameter Store Standard does not provide built-in automatic rotation for RDS databases and lacks turnkey multi-region secret synchronization.',
        'AWS KMS is an encryption key management service; it encrypts data but does not store or rotate database usernames and passwords.',
        'Amazon S3 is object storage and lacks automated database password rotation functionality.'
      ],
      decisiveClue: 'Automatic password rotation every 30 days for RDS and multi-region secret replication.',
      difficulty: 'beginner',
      isOriginal: true,
      source: 'Original AWS certification-style practice question'
    },
    sources: [
      { title: 'AWS Secrets Manager User Guide', url: 'https://docs.aws.amazon.com/secretsmanager/latest/userguide/intro.html' },
      { title: 'AWS Systems Manager Parameter Store', url: 'https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html' }
    ]
  },
  {
    id: 'kms-vs-secrets-manager',
    title: 'KMS vs Secrets Manager',
    category: 'Identity & Security',
    serviceA: 'AWS Key Management Service (KMS)',
    serviceB: 'AWS Secrets Manager',
    problem: 'Understanding the distinction between cryptographic encryption key management and credential/secret lifecycle management.',
    decisiveDifferences: [
      'Fundamental Purpose: AWS KMS generates, manages, and controls cryptographic keys used to encrypt and decrypt data (envelope encryption, symmetric/asymmetric keys); Secrets Manager is a secure key-value vault for storing and retrieving plaintext secret strings (passwords, tokens, API keys).',
      'Data Storage: KMS DOES NOT store your secret text or application data; it takes plaintext data up to 4 KB and returns ciphertext (or generates data keys for envelope encryption); Secrets Manager stores secret payloads (up to 64 KB of JSON/text) and encrypts them at rest using KMS.',
      'Client Interaction: With KMS, applications call `kms:Encrypt` and `kms:Decrypt` to protect payloads; with Secrets Manager, applications call `GetSecretValue` to retrieve the database credentials or API keys directly.'
    ],
    whenToChooseA: [
      'Encrypting data at rest across AWS services (EBS volumes, S3 buckets, RDS databases, DynamoDB tables).',
      'Generating and managing customer managed KMS keys (CMKs) with annual automated key material rotation.',
      'Digital signing and cryptographic verification using asymmetric RSA or ECC keys.',
      'Performing envelope encryption on large data files using KMS-generated Data Encryption Keys (DEKs).'
    ],
    whenToChooseB: [
      'Storing database connection strings, OAuth tokens, API private keys, and third-party passwords.',
      'Requiring scheduled automated rotation of database credentials (e.g., rotating MySQL admin passwords).',
      'Cross-region synchronization of sensitive configuration secrets.'
    ],
    workTogether: 'Secrets Manager relies directly on AWS KMS under the hood. When a secret is saved in Secrets Manager, the service calls KMS to encrypt the secret payload using either the default AWS-managed KMS key (`aws/secretsmanager`) or a customer managed KMS key (CMK).',
    tradeoffs: [
      {
        dimension: 'Primary Asset Managed',
        optionA: 'Cryptographic encryption keys (never leaves KMS in plaintext).',
        optionB: 'Arbitrary secret strings, database passwords, API tokens.'
      },
      {
        dimension: 'Storage Capability',
        optionA: 'Does not store data; only encrypts/decrypts payloads up to 4 KB.',
        optionB: 'Stores JSON/string secret payloads up to 64 KB.'
      },
      {
        dimension: 'API Action',
        optionA: '`kms:Encrypt`, `kms:Decrypt`, `kms:GenerateDataKey`.',
        optionB: '`secretsmanager:GetSecretValue`, `CreateSecret`, `RotateSecret`.'
      }
    ],
    scenario: 'An application stores third-party payment gateway API keys in AWS Secrets Manager. Secrets Manager secures those keys at rest by encrypting them using a customer managed AWS KMS key with dedicated access policies.',
    question: {
      id: 'quiz-kms-vs-secrets-manager-1',
      question: 'A developer needs to encrypt credit card numbers in an application database column before saving them. The encryption key must be protected by hardware security modules (HSMs) and must support automated annual key material rotation. Which service should handle the cryptographic key generation and encryption?',
      type: 'single',
      options: [
        'AWS Secrets Manager',
        'AWS Key Management Service (AWS KMS)',
        'AWS Systems Manager Parameter Store',
        'Amazon GuardDuty'
      ],
      correctAnswers: [1],
      explanation: 'AWS KMS is designed for cryptographic key management, envelope encryption, and HSM-backed key security (FIPS 140-2/140-3 validated). It supports automated annual key material rotation for Customer Managed Keys.',
      whyOthersWrong: [
        'Secrets Manager is a vault for storing static or rotating credentials/tokens, not an encryption service for column-level cryptographic operations.',
        'Parameter Store is a configuration value store, not an HSM-backed cryptographic key management system.',
        'Amazon GuardDuty is an intelligent threat detection service, not a cryptographic encryption service.'
      ],
      decisiveClue: 'Encrypt data columns using cryptographic keys protected by HSMs with automated key rotation.',
      difficulty: 'intermediate',
      isOriginal: true,
      source: 'Original AWS certification-style practice question'
    },
    sources: [
      { title: 'AWS KMS Cryptographic Details', url: 'https://docs.aws.amazon.com/kms/latest/developerguide/overview.html' },
      { title: 'AWS Secrets Manager Encryption', url: 'https://docs.aws.amazon.com/secretsmanager/latest/userguide/security-encryption.html' }
    ]
  },
  {
    id: 'cloudtrail-vs-cloudwatch',
    title: 'CloudTrail vs CloudWatch',
    category: 'Identity & Security',
    serviceA: 'AWS CloudTrail',
    serviceB: 'Amazon CloudWatch',
    problem: 'Differentiating between governance/auditing of AWS API calls and operational monitoring of resource performance and health.',
    decisiveDifferences: [
      'Core Mission: CloudTrail answers "WHO did WHAT, WHERE, and WHEN" in your AWS account (auditing user and API activity); CloudWatch answers "HOW ARE MY RESOURCES PERFORMING" (collecting operational metrics, system logs, and triggering health alarms).',
      'Event Origin: CloudTrail records AWS control-plane and data-plane API requests (e.g., `RunInstances`, `DeleteBucket`, `AuthorizeSecurityGroupIngress`); CloudWatch collects runtime performance metrics (CPU utilization, disk IOPS, network bytes) and application stdout/stderr logs.',
      'Actionability: CloudTrail provides historical immutable audit trails for compliance, forensic investigation, and security analysis; CloudWatch provides real-time alarming, dashboard graphing, and automated autoscaling triggers.'
    ],
    whenToChooseA: [
      'Investigating who terminated an EC2 instance, modified a Security Group, or changed an IAM policy.',
      'Satisfying compliance audits (SOC2, PCI-DSS, HIPAA, ISO 27001) that mandate logging all administrative API calls.',
      'Detecting unauthorized or unusual API activity across multiple AWS accounts using CloudTrail Insights.'
    ],
    whenToChooseB: [
      'Monitoring real-time CPU, RAM (via agent), disk usage, and network traffic across EC2 fleets.',
      'Setting alarms to trigger Auto Scaling or send SNS notifications when error rates exceed a threshold.',
      'Centralizing and searching application application log streams (CloudWatch Logs / Logs Insights).'
    ],
    workTogether: 'CloudTrail can continuously stream all recorded account API events directly into a CloudWatch Logs group. CloudWatch Logs Metric Filters then monitor for critical security events (such as unauthorized root account logins), immediately firing a CloudWatch Alarm to alert security engineers.',
    tradeoffs: [
      {
        dimension: 'Primary Question Answered',
        optionA: '"Who made what API call, from where, and at what time?"',
        optionB: '"What is the health, performance, and operational status of my systems?"'
      },
      {
        dimension: 'Data Collected',
        optionA: 'AWS API call request and response metadata (JSON records).',
        optionB: 'Numerical time-series metrics and textual log streams.'
      },
      {
        dimension: 'Real-Time Alarming',
        optionA: 'Audit-focused; requires forwarding to CloudWatch or EventBridge for alerts.',
        optionB: 'Native alarms based on metric thresholds and anomaly detection.'
      }
    ],
    scenario: 'When a critical production S3 bucket is accidentally deleted, the security team opens AWS CloudTrail to identify the exact IAM user, IP address, and timestamp of the `DeleteBucket` call. Meanwhile, CloudWatch alarms trigger to alert operations of the sudden spike in HTTP 404 errors.',
    question: {
      id: 'quiz-cloudtrail-vs-cloudwatch-1',
      question: 'A security auditor requires a tamper-evident audit record of every administrative action and API request made across the organization for the past 90 days, including who made the call, their IP address, and the timestamp. Which AWS service satisfies this requirement?',
      type: 'single',
      options: [
        'Amazon CloudWatch Logs',
        'AWS CloudTrail',
        'AWS Config',
        'AWS Trusted Advisor'
      ],
      correctAnswers: [1],
      explanation: 'AWS CloudTrail records an immutable history of AWS account activity and API usage, capturing the caller identity, source IP, timestamp, and request parameters for governance and compliance auditing.',
      whyOthersWrong: [
        'CloudWatch Logs captures application and operating system log files, not native AWS API control plane management events by default.',
        'AWS Config tracks configuration state changes and resource relationships over time, but CloudTrail records the specific API event payloads and caller identities.',
        'AWS Trusted Advisor provides best practice recommendations for cost, performance, and security, not an API audit log.'
      ],
      decisiveClue: 'Audit record of who made every API request, from which IP, and at what timestamp.',
      difficulty: 'beginner',
      isOriginal: true,
      source: 'Original AWS certification-style practice question'
    },
    sources: [
      { title: 'AWS CloudTrail User Guide', url: 'https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-user-guide.html' },
      { title: 'Amazon CloudWatch Concepts', url: 'https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/cloudwatch_concepts.html' }
    ]
  },
  {
    id: 'cloudwatch-vs-config',
    title: 'CloudWatch vs AWS Config',
    category: 'Identity & Security',
    serviceA: 'Amazon CloudWatch',
    serviceB: 'AWS Config',
    problem: 'Monitoring real-time performance and operational metrics versus tracking configuration state changes and compliance rules over time.',
    decisiveDifferences: [
      'Focus & Scope: CloudWatch measures real-time performance metrics (CPU, memory, latency) and system logs; AWS Config records the configuration state, relationships, and history of AWS resources (e.g., EBS volume encryption state, SG open ports).',
      'Compliance Evaluation: AWS Config continuously evaluates resource configurations against compliance rules (e.g., "Is S3 bucket public access blocked?", "Is EBS encrypted?"); CloudWatch evaluates numerical metric values against alarm thresholds (e.g., "Is CPU > 80% for 5 minutes?").',
      'Timeline & Drift: AWS Config maintains a detailed historical timeline of every configuration change made to a resource over its entire lifetime, allowing drift detection and historical rollback audits; CloudWatch retains metric telemetry for up to 15 months.'
    ],
    whenToChooseA: [
      'Real-time observability: graphing server metrics, monitoring API error rates, and tracking application performance.',
      'Triggering auto-scaling actions or operational alerts based on load.',
      'Aggregating and analyzing application runtime logs with CloudWatch Logs Insights.'
    ],
    whenToChooseB: [
      'Auditing whether all provisioned S3 buckets, EBS volumes, and RDS databases adhere to corporate security encryption standards.',
      'Investigating when a security group was modified to open port 22 to 0.0.0.0/0 and which resources were affected.',
      'Automated compliance remediation: triggering Systems Manager Automation runbooks when a non-compliant resource configuration is detected.'
    ],
    workTogether: 'An organization uses CloudWatch to ensure their EC2 instances are healthy, performing well, and not dropping network packets. Simultaneously, AWS Config verifies that every EC2 instance is attached to an approved IAM role and launched from an approved Golden AMI, triggering remediation if drift occurs.',
    tradeoffs: [
      {
        dimension: 'Subject of Analysis',
        optionA: 'Performance telemetry, operational health, and log output.',
        optionB: 'Resource configuration attributes, metadata, and compliance rules.'
      },
      {
        dimension: 'Evaluation Mechanism',
        optionA: 'Metric thresholds and statistical anomalies.',
        optionB: 'Config Rules (managed or custom Lambda rules) checking JSON resource state.'
      },
      {
        dimension: 'Historical Timeline',
        optionA: 'Time-series metric points and log timestamps.',
        optionB: 'Configuration change timeline showing resource relationship changes.'
      }
    ],
    scenario: 'A compliance team deploys an AWS Config rule requiring all S3 buckets to have server-side encryption enabled. When an engineer creates an unencrypted bucket, AWS Config immediately flags it as "Non-Compliant" and records the configuration snapshot in its audit history.',
    question: {
      id: 'quiz-cloudwatch-vs-config-1',
      question: 'A company needs to continuously evaluate whether all Amazon EBS volumes across 20 AWS accounts are encrypted at rest. If an unencrypted volume is detected, the system must record the non-compliant configuration state and trigger an automated remediation action. Which service is designed for this task?',
      type: 'single',
      options: [
        'Amazon CloudWatch Metric Alarms',
        'AWS Config',
        'AWS CloudTrail Insights',
        'Amazon Inspector'
      ],
      correctAnswers: [1],
      explanation: 'AWS Config continuously monitors and records resource configuration states and evaluates them against Config Rules (e.g., `encrypted-volumes`). It natively supports automated remediation via AWS Systems Manager Automation runbooks.',
      whyOthersWrong: [
        'CloudWatch monitors time-series performance metrics and logs, not resource configuration states like EBS encryption flags.',
        'CloudTrail Insights detects unusual API call volume anomalies, but does not evaluate resource configuration compliance against desired state rules.',
        'Amazon Inspector scans EC2 instances and ECR images for software vulnerabilities, not EBS volume encryption configuration states.'
      ],
      decisiveClue: 'Continuously evaluate whether EBS volumes are encrypted and record non-compliant configuration state.',
      difficulty: 'intermediate',
      isOriginal: true,
      source: 'Original AWS certification-style practice question'
    },
    sources: [
      { title: 'AWS Config Developer Guide', url: 'https://docs.aws.amazon.com/config/latest/developerguide/WhatIsConfig.html' },
      { title: 'Amazon CloudWatch Documentation', url: 'https://docs.aws.amazon.com/cloudwatch/' }
    ]
  },
  {
    id: 'guardduty-vs-inspector',
    title: 'GuardDuty vs Inspector',
    category: 'Identity & Security',
    serviceA: 'Amazon GuardDuty',
    serviceB: 'Amazon Inspector',
    problem: 'Detecting active network and credential threats versus identifying static software vulnerabilities and exposures.',
    decisiveDifferences: [
      'Security Domain: GuardDuty is an intelligent Threat Detection service that identifies active malicious activity and unauthorized behavior; Inspector is an automated Vulnerability Management service that scans workloads for known software flaws (CVEs) and unintended network exposure.',
      'Data Ingestion: GuardDuty operates passively by ingesting and analyzing AWS telemetry streams (VPC Flow Logs, DNS Query Logs, CloudTrail Management & S3 Data Events, EKS Audit Logs); Inspector scans running EC2 instances, ECR container images, and Lambda function code for unpatched packages.',
      'Agent Requirement: GuardDuty requires NO agents or software installation on EC2 instances (it analyzes AWS infrastructure telemetry); Inspector uses the AWS Systems Manager (SSM) agent to inventory installed OS packages and dependencies.',
      'Timing of Findings: GuardDuty alerts in near real-time during an active compromise (e.g., EC2 mining cryptocurrency, compromised IAM credentials); Inspector alerts proactively during code builds, container pushes, or routine scheduled package scans.'
    ],
    whenToChooseA: [
      'Detecting compromised AWS credentials being used from anomalous IP addresses or Tor exit nodes.',
      'Identifying EC2 instances communicating with known malware command-and-control (C2) servers.',
      'Monitoring DNS queries for DNS data exfiltration tunnels.',
      'Continuous threat detection across S3, EKS, RDS, and IAM without installing agents.'
    ],
    whenToChooseB: [
      'Scanning container images in Amazon ECR for known software vulnerabilities (CVEs) upon image push.',
      'Auditing EC2 instances to verify all installed Linux packages have the latest security patches applied.',
      'Scanning AWS Lambda function code and dependencies for vulnerable open-source third-party libraries.',
      'Generating vulnerability posture and Common Vulnerabilities and Exposures (CVE) audit reports.'
    ],
    workTogether: 'Amazon Inspector helps prevent breaches proactively by scanning EC2 instances and container images for unpatched CVEs so developers can fix them before deployment; if a zero-day exploit bypasses defenses, Amazon GuardDuty detects the resulting suspicious network traffic in real-time.',
    tradeoffs: [
      {
        dimension: 'Security Function',
        optionA: 'Threat detection: catches active attacks, malicious actors, and credential abuse.',
        optionB: 'Vulnerability assessment: catches unpatched software bugs and CVE exposures.'
      },
      {
        dimension: 'Data Source',
        optionA: 'Passive AWS network and API telemetry (VPC Flow, DNS, CloudTrail).',
        optionB: 'Workload package inventory via SSM agent, ECR container scanning, Lambda code.'
      },
      {
        dimension: 'Nature of Alert',
        optionA: 'Reactive / Behavioral: "EC2 instance is communicating with a Bitcoin mining pool."',
        optionB: 'Proactive / Static: "OpenSSL package has CVE-2023-XXXX vulnerability requiring update."'
      }
    ],
    scenario: 'A company runs containerized microservices on EC2. Amazon Inspector scans every Docker image pushed to Amazon ECR, warning the team about an unpatched OpenSSL vulnerability. Meanwhile, GuardDuty monitors VPC Flow Logs to ensure no running instances make unauthorized outbound connections.',
    question: {
      id: 'quiz-guardduty-vs-inspector-1',
      question: 'A security team wants to automatically scan all container images pushed to Amazon Elastic Container Registry (ECR) for Common Vulnerabilities and Exposures (CVEs) and receive prioritized vulnerability scores. Which AWS service should be enabled?',
      type: 'single',
      options: [
        'Amazon GuardDuty',
        'Amazon Inspector',
        'AWS Shield Advanced',
        'Amazon Macie'
      ],
      correctAnswers: [1],
      explanation: 'Amazon Inspector provides automated vulnerability management that natively scans container images in Amazon ECR upon push and continuously, assessing software packages against known CVE databases.',
      whyOthersWrong: [
        'Amazon GuardDuty detects active threats by analyzing network and API logs, but does not perform static CVE package scanning of container images in ECR.',
        'AWS Shield Advanced provides DDoS protection at Layers 3 and 4.',
        'Amazon Macie discovers and protects sensitive data (PII) in Amazon S3, not container image CVE vulnerabilities.'
      ],
      decisiveClue: 'Scan container images pushed to Amazon ECR for CVE vulnerabilities.',
      difficulty: 'beginner',
      isOriginal: true,
      source: 'Original AWS certification-style practice question'
    },
    sources: [
      { title: 'Amazon GuardDuty User Guide', url: 'https://docs.aws.amazon.com/guardduty/latest/ug/what-is-guardduty.html' },
      { title: 'Amazon Inspector User Guide', url: 'https://docs.aws.amazon.com/inspector/latest/user/what-is-inspector.html' }
    ]
  },
  {
    id: 'guardduty-vs-security-hub',
    title: 'GuardDuty vs Security Hub',
    category: 'Identity & Security',
    serviceA: 'Amazon GuardDuty',
    serviceB: 'AWS Security Hub',
    problem: 'Distinguishing between a specialized threat detection engine and a centralized security posture management and compliance aggregation console.',
    decisiveDifferences: [
      'Role in Security Architecture: GuardDuty is a threat detector (a finding producer) using machine learning and threat intelligence; Security Hub is a centralized Cloud Security Posture Management (CSPM) hub (a finding aggregator and compliance evaluator).',
      'Data Ingestion & Aggregation: GuardDuty ingests raw AWS network/log telemetry (DNS, VPC Flow, CloudTrail); Security Hub ingests normalized security findings in AWS Security Finding Format (ASFF) from GuardDuty, Inspector, Macie, IAM Access Analyzer, AWS Firewall Manager, and 3rd-party tools.',
      'Compliance Standards: Security Hub runs continuous automated compliance checks against industry benchmarks (CIS AWS Foundations Benchmark, PCI-DSS, AWS Foundational Security Best Practices); GuardDuty does not perform compliance benchmarking.',
      'Remediation Automation: Security Hub provides centralized automated workflows to route findings to Jira, PagerDuty, or Lambda remediation scripts across entire AWS Organizations.'
    ],
    whenToChooseA: [
      'Enabling intelligent, ML-driven threat detection for compromised credentials, cryptocurrency mining, and malware.',
      'Detecting suspicious API usage and unusual data access patterns in Amazon S3 without administrative overhead.',
      'Zero-configuration threat detection running quietly at the organization level.'
    ],
    whenToChooseB: [
      'Creating a single-pane-of-glass dashboard consolidating security findings across all AWS accounts and security tools.',
      'Measuring and reporting organization compliance against CIS AWS Foundations Benchmark or PCI-DSS.',
      'Centralizing security incident routing and automated ticketing into enterprise SIEMs (Splunk, Datadog).'
    ],
    workTogether: 'GuardDuty feeds directly into Security Hub: When GuardDuty detects an active compromised credential, it outputs a finding that Security Hub aggregates alongside Inspector vulnerability scans and Config compliance checks, presenting a single prioritized view to the SOC team.',
    tradeoffs: [
      {
        dimension: 'Primary Classification',
        optionA: 'Intelligent Threat Detection Engine (Finding Generator).',
        optionB: 'Cloud Security Posture Management (CSPM) & Finding Aggregator.'
      },
      {
        dimension: 'Benchmark Compliance Checks',
        optionA: 'None; strictly threat and anomaly detection.',
        optionB: 'Built-in CIS Benchmarks, PCI-DSS, NIST, and AWS Foundational standards.'
      },
      {
        dimension: 'Scope of Integration',
        optionA: 'Analyzes raw AWS telemetry streams.',
        optionB: 'Aggregates findings from GuardDuty, Inspector, Macie, Config, and 3rd parties.'
      }
    ],
    scenario: 'A Chief Information Security Officer (CISO) requires a unified compliance score against the CIS AWS Foundations Benchmark across 50 AWS accounts, while centralizing all alerts from GuardDuty and Inspector. The team activates AWS Security Hub as their centralized console.',
    question: {
      id: 'quiz-guardduty-vs-security-hub-1',
      question: 'An enterprise wants a single dashboard to view its compliance score against the CIS AWS Foundations Benchmark and aggregate security alerts generated by Amazon GuardDuty, Amazon Inspector, and Amazon Macie across all accounts. Which service should they enable?',
      type: 'single',
      options: [
        'Amazon GuardDuty',
        'AWS Security Hub',
        'AWS Systems Manager Compliance',
        'AWS Audit Manager'
      ],
      correctAnswers: [1],
      explanation: 'AWS Security Hub aggregates, organizes, and prioritizes security findings from multiple AWS services (GuardDuty, Inspector, Macie) and third-party tools into a single pane of glass, and evaluates accounts against security standards like CIS AWS Foundations.',
      whyOthersWrong: [
        'Amazon GuardDuty generates threat findings, but does not aggregate findings from other services like Inspector or Macie, nor evaluate CIS compliance benchmarks.',
        'Systems Manager Compliance tracks patch compliance on EC2 instances, not overall AWS account security posture.',
        'AWS Audit Manager automates evidence collection for audits, but is not a real-time finding aggregator or CSPM dashboard.'
      ],
      decisiveClue: 'Single dashboard to view CIS compliance score and aggregate alerts from GuardDuty, Inspector, and Macie.',
      difficulty: 'intermediate',
      isOriginal: true,
      source: 'Original AWS certification-style practice question'
    },
    sources: [
      { title: 'AWS Security Hub User Guide', url: 'https://docs.aws.amazon.com/securityhub/latest/userguide/what-is-securityhub.html' },
      { title: 'Amazon GuardDuty Overview', url: 'https://aws.amazon.com/guardduty/' }
    ]
  },
  {
    id: 'macie-vs-inspector',
    title: 'Macie vs Inspector',
    category: 'Identity & Security',
    serviceA: 'Amazon Macie',
    serviceB: 'Amazon Inspector',
    problem: 'Protecting sensitive data at rest versus protecting compute operating systems and container software from vulnerabilities.',
    decisiveDifferences: [
      'Target Asset: Amazon Macie inspects Amazon S3 buckets to discover, classify, and protect sensitive data (Personally Identifiable Information - PII, credit card numbers, financial records, API keys); Amazon Inspector inspects compute resources (EC2 instances, ECR container images, Lambda functions) for software vulnerabilities.',
      'Scanning Methodology: Macie uses machine learning and pattern matching (regex, data identifiers) to inspect the contents of files (CSV, JSON, PDF, Parquet) stored in S3; Inspector inspects installed operating system packages and language runtime dependencies against CVE vulnerability databases.',
      'Primary Risk Addressed: Macie protects against data privacy violations and regulatory compliance breaches (GDPR, CCPA, HIPAA); Inspector protects against remote code execution, privilege escalation, and unpatched system software exploits.'
    ],
    whenToChooseA: [
      'Discovering whether Amazon S3 buckets contain unencrypted sensitive customer data like Social Security numbers, passports, or credit cards.',
      'Auditing S3 bucket security posture (identifying publicly accessible, unencrypted, or shared buckets).',
      'Meeting data privacy compliance mandates requiring visibility into sensitive data repositories.'
    ],
    whenToChooseB: [
      'Scanning EC2 instances for unpatched OS packages and vulnerabilities.',
      'Scanning container images in Amazon ECR pipelines prior to production deployment.',
      'Checking AWS Lambda function code and external package dependencies for known CVEs.'
    ],
    workTogether: 'An enterprise healthcare platform uses Amazon Macie to continuously scan its patient record data lake in Amazon S3 for leaked PII, while using Amazon Inspector to scan the EC2 instances and ECR container images running the patient portal web application for software vulnerabilities.',
    tradeoffs: [
      {
        dimension: 'Resource Protected',
        optionA: 'Amazon S3 object storage content and bucket configurations.',
        optionB: 'EC2 instances, ECR container images, Lambda functions.'
      },
      {
        dimension: 'Inspection Target',
        optionA: 'Sensitive data / PII (credit cards, SSNs, medical records, secrets).',
        optionB: 'Software vulnerabilities (CVEs), unpatched packages, network reachability.'
      },
      {
        dimension: 'Detection Engine',
        optionA: 'Natural language processing, regex, and ML pattern matching.',
        optionB: 'Package version matching against CVE vulnerability databases.'
      }
    ],
    scenario: 'A banking application stores customer loan applications in an S3 data lake. The compliance officer enables Amazon Macie, which automatically discovers that several PDF uploads contain unredacted Social Security numbers and tax forms, allowing the security team to apply tighter S3 bucket policies.',
    question: {
      id: 'quiz-macie-vs-inspector-1',
      question: 'A financial institution needs an automated tool to scan millions of documents stored across 50 Amazon S3 buckets to discover, classify, and report on any sensitive customer data such as credit card numbers and passport IDs. Which AWS service is purpose-built for this task?',
      type: 'single',
      options: [
        'Amazon Inspector',
        'Amazon Macie',
        'AWS CloudTrail',
        'AWS Secrets Manager'
      ],
      correctAnswers: [1],
      explanation: 'Amazon Macie is a data security and data privacy service that uses machine learning and pattern matching to discover, classify, and protect sensitive data (such as PII, credit cards, and passports) stored in Amazon S3.',
      whyOthersWrong: [
        'Amazon Inspector scans compute workloads (EC2, ECR, Lambda) for software vulnerabilities (CVEs), not S3 objects for sensitive data.',
        'AWS CloudTrail logs API calls for auditing, but cannot read or classify the contents of documents inside S3 buckets.',
        'AWS Secrets Manager stores and rotates secrets like database passwords, but does not scan S3 buckets for sensitive PII.'
      ],
      decisiveClue: 'Scan documents in Amazon S3 buckets to discover sensitive data like credit cards and passports.',
      difficulty: 'beginner',
      isOriginal: true,
      source: 'Original AWS certification-style practice question'
    },
    sources: [
      { title: 'Amazon Macie User Guide', url: 'https://docs.aws.amazon.com/macie/latest/user/what-is-macie.html' },
      { title: 'Amazon Inspector Documentation', url: 'https://docs.aws.amazon.com/inspector/' }
    ]
  },
  {
    id: 'waf-vs-security-groups',
    title: 'WAF vs Security Groups',
    category: 'Identity & Security',
    serviceA: 'AWS WAF',
    serviceB: 'Security Groups',
    problem: 'Enforcing web application layer filtering versus network transport layer host access controls.',
    decisiveDifferences: [
      'OSI Layer: AWS WAF operates strictly at Layer 7 (Application Layer - HTTP/HTTPS); Security Groups operate at Layer 3 (Network) and Layer 4 (Transport - TCP, UDP, ICMP).',
      'Inspection Depth: AWS WAF inspects the full HTTP request payload, including URLs, query parameters, HTTP headers, request bodies, and cookies for malicious signatures (SQL injection, XSS); Security Groups inspect only IP addresses, CIDR blocks, port numbers, and protocols.',
      'Deployment Point: AWS WAF attaches to CloudFront distributions, Application Load Balancers, Amazon API Gateway, AWS AppSync, and Amazon Cognito; Security Groups attach to Elastic Network Interfaces (ENIs) of EC2 instances, Lambda VPC interfaces, RDS databases, and ALBs.',
      'Rule Logic: AWS WAF can block, allow, count, CAPTCHA, or challenge requests based on complex boolean conditions and rate limits; Security Groups are permissive-only firewalls that allow specific traffic based on source IP or source Security Group ID.'
    ],
    whenToChooseA: [
      'Protecting public web applications against OWASP Top 10 vulnerabilities (SQL injection, cross-site scripting).',
      'Rate-limiting clients to prevent brute-force login attacks (e.g., limit to 100 requests per 5 minutes per IP on `/login`).',
      'Blocking requests based on geographic origin (geofencing) or known malicious bot signatures.'
    ],
    whenToChooseB: [
      'Restricting inbound traffic to database instances so only backend application servers can connect on port 5432.',
      'Controlling network access to EC2 instances by IP range or between security group tiers in a VPC.',
      'Controlling outbound egress traffic from virtual machines to specific destination subnets or CIDRs.'
    ],
    workTogether: 'An Application Load Balancer is protected by AWS WAF to inspect incoming HTTP requests and block SQL injection attacks; behind the ALB, backend EC2 instances have Security Groups that allow inbound HTTP traffic exclusively from the ALB Security Group ID.',
    tradeoffs: [
      {
        dimension: 'OSI Layer',
        optionA: 'Layer 7 (Application: HTTP/HTTPS payloads).',
        optionB: 'Layer 3 & 4 (Network/Transport: IP addresses and TCP/UDP ports).'
      },
      {
        dimension: 'Inspection Capability',
        optionA: 'Deep payload inspection (headers, cookies, query strings, regex, SQLi).',
        optionB: 'Header-only packet filtering (source/dest IP, port, protocol).'
      },
      {
        dimension: 'Attachment Target',
        optionA: 'CloudFront, ALB, API Gateway, AppSync.',
        optionB: 'Elastic Network Interfaces (ENIs), EC2, RDS, VPC endpoints.'
      }
    ],
    scenario: 'A healthcare portal uses AWS WAF on its public Application Load Balancer to inspect incoming web traffic for malicious cross-site scripting (XSS) payloads. The backend EC2 web servers use Security Groups configured to reject all direct network traffic except packets originating from the ALB Security Group.',
    question: {
      id: 'quiz-waf-vs-security-groups-1',
      question: 'A web application on EC2 behind an Application Load Balancer is being bombarded with HTTP POST requests containing SQL injection payloads in the request body. Port 443 is currently allowed from 0.0.0.0/0 on the ALB. Which mechanism can stop these attacks without blocking legitimate traffic on port 443?',
      type: 'single',
      options: [
        'Modify the ALB Security Group to deny traffic on port 443 from offending IPs',
        'Attach an AWS WAF Web ACL to the ALB with SQL injection match conditions',
        'Add an explicit DENY rule in the subnet Network ACL for port 443',
        'Deploy an Amazon GuardDuty agent inside the EC2 operating system'
      ],
      correctAnswers: [1],
      explanation: 'AWS WAF inspects Layer 7 HTTP payloads and request bodies for malicious patterns like SQL injection, blocking malicious requests while allowing legitimate traffic on port 443 to continue unimpeded.',
      whyOthersWrong: [
        'Security Groups operate at Layer 4 and cannot inspect HTTP request bodies for SQL injection patterns, nor do they support explicit DENY rules.',
        'Network ACLs operate at Layer 4; blocking port 443 drops all HTTPS traffic, shutting down the entire web service.',
        'GuardDuty detects anomalous behavior passively through logs, but does not sit inline to block HTTP payloads on an ALB.'
      ],
      decisiveClue: 'Block HTTP POST requests with SQL injection payloads without blocking legitimate port 443 traffic.',
      difficulty: 'intermediate',
      isOriginal: true,
      source: 'Original AWS certification-style practice question'
    },
    sources: [
      { title: 'AWS WAF Overview', url: 'https://docs.aws.amazon.com/waf/latest/developerguide/what-is-aws-waf.html' },
      { title: 'Amazon EC2 Security Groups', url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-security-groups.html' }
    ]
  },
  {
    id: 'access-analyzer-vs-config',
    title: 'IAM Access Analyzer vs AWS Config',
    category: 'Identity & Security',
    serviceA: 'IAM Access Analyzer',
    serviceB: 'AWS Config',
    problem: 'Validating mathematical least privilege and external resource access versus tracking resource configuration states and compliance rules.',
    decisiveDifferences: [
      'Analytical Approach: IAM Access Analyzer uses automated reasoning (mathematical logic proofs) to analyze resource-based policies and identify any permissions that allow access from outside your zone of trust; AWS Config uses rule-based attribute matching to evaluate resource configuration metadata against desired baselines.',
      'Primary Focus: Access Analyzer specializes exclusively in access control and identity validation (e.g., "Can an external AWS account read this S3 bucket or KMS key?"); AWS Config monitors the complete operational and architectural configuration of resources (e.g., "Is volume encrypted?", "Is instance type approved?").',
      'Policy Validation & Generation: IAM Access Analyzer includes tools to validate JSON IAM policies against AWS best practices and can generate fine-grained IAM policies from CloudTrail access logs; AWS Config focuses on drift detection, historical configuration timelines, and automated remediation.'
    ],
    whenToChooseA: [
      'Verifying that no S3 buckets, KMS keys, SQS queues, Secrets Manager secrets, or IAM roles are unintentionally shared with external AWS accounts or the public internet.',
      'Validating new IAM policies in CI/CD pipelines before deployment to ensure no overly permissive statements exist.',
      'Generating least-privilege IAM policies based on actual historical API calls recorded in CloudTrail.'
    ],
    whenToChooseB: [
      'Tracking the full lifecycle and configuration change history of all AWS infrastructure resources over time.',
      'Enforcing operational governance standards across compute, storage, and networking (e.g., tagging enforcement, encryption, backup retention).',
      'Triggering automated remediation scripts when a resource configuration drifts from the approved architectural baseline.'
    ],
    workTogether: 'An organization uses AWS Config to monitor that IAM Access Analyzer is enabled across all accounts in AWS Organizations. When Access Analyzer identifies that a resource policy grants unintended external access, AWS Config records the compliance event and triggers a remediation workflow.',
    tradeoffs: [
      {
        dimension: 'Underlying Engine',
        optionA: 'Automated reasoning and mathematical logic proofs.',
        optionB: 'Rule-based attribute evaluation and periodic snapshots.'
      },
      {
        dimension: 'Domain of Evaluation',
        optionA: 'Access permissions, trust boundaries, and IAM policy correctness.',
        optionB: 'Comprehensive infrastructure configuration attributes and drift.'
      },
      {
        dimension: 'Policy Authoring Assistance',
        optionA: 'Validates IAM JSON policies and generates policies from CloudTrail.',
        optionB: 'Does not generate IAM policies; evaluates compliance against rules.'
      }
    ],
    scenario: 'A cloud security team configures IAM Access Analyzer for their AWS Organization. The analyzer mathematically evaluates all S3 bucket policies, KMS key policies, and IAM role trust policies, immediately alerting the team when an engineer accidentally adds a wildcard principal granting public access to an internal SQS queue.',
    question: {
      id: 'quiz-access-analyzer-vs-config-1',
      question: 'A security engineer needs to verify whether any resource-based policies in an AWS account (such as S3 bucket policies, KMS key policies, or SQS queue policies) grant access to principals outside the company AWS Organization. Which tool provides automated mathematical verification of these trust boundaries?',
      type: 'single',
      options: [
        'AWS Trusted Advisor',
        'IAM Access Analyzer',
        'Amazon Inspector',
        'AWS Systems Manager Compliance'
      ],
      correctAnswers: [1],
      explanation: 'IAM Access Analyzer uses automated reasoning to mathematically analyze resource-based policies across S3, KMS, SQS, IAM roles, and Secrets Manager to identify any access granted to entities outside the zone of trust (account or organization).',
      whyOthersWrong: [
        'AWS Trusted Advisor provides high-level account check recommendations, but lacks automated mathematical reasoning for comprehensive cross-service trust boundary analysis.',
        'Amazon Inspector scans workloads for software CVE vulnerabilities, not resource policy trust boundaries.',
        'Systems Manager Compliance audits operating system patch levels and software installations on managed instances.'
      ],
      decisiveClue: 'Automated mathematical verification of resource-based policies granting access outside the AWS Organization.',
      difficulty: 'intermediate',
      isOriginal: true,
      source: 'Original AWS certification-style practice question'
    },
    sources: [
      { title: 'IAM Access Analyzer User Guide', url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/what-is-access-analyzer.html' },
      { title: 'AWS Config Documentation', url: 'https://docs.aws.amazon.com/config/' }
    ]
  }
];
