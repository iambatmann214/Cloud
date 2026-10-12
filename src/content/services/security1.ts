import { AWSService } from '../../types';

export const securityServicesPart1: AWSService[] = [
  {
    id: 'iam',
    name: 'AWS Identity and Access Management',
    shortName: 'IAM',
    category: 'security',
    difficulty: 'beginner',
    importance: 'essential',
    icon: 'Security',
    tagline: 'Securely manage access to AWS services and resources with granular permissions',
    mentalModel: 'The master authentication and authorization gatekeeper of your entire AWS account, verifying who you are and what you can do.',
    problemItSolves: 'Prevents unauthorized access and limits blast radius by implementing least privilege permissions across users, groups, and compute resources.',
    howItWorks: 'Evaluates requests against JSON policies (Identity-based, Resource-based, SCPs, Permission Boundaries) using an explicit deny > explicit allow > default deny evaluation logic.',
    components: [
      { name: 'IAM Users & Groups', description: 'Legacy identity entities representing human operators or collections of operators.' },
      { name: 'IAM Roles', description: 'Temporary credential identities assumed by AWS services (EC2, Lambda) or federated users.' },
      { name: 'IAM Policies', description: 'JSON documents specifying Effect, Principal, Action, Resource, and Condition blocks.' },
      { name: 'Permission Boundaries', description: 'Advanced feature setting maximum permissions an IAM entity can have, preventing privilege escalation.' }
    ],
    realWorldExample: 'Assigning an IAM Role to an EC2 instance so it can read files from a specific S3 bucket without embedding long-term API access keys in code.',
    whenToUse: [
      'Granting fine-grained access permissions to AWS resources across applications and teams',
      'Assigning IAM Roles to EC2 instances, Lambda functions, and ECS tasks for temporary credential generation',
      'Enforcing Multi-Factor Authentication (MFA) and least privilege access principles'
    ],
    whenNotToUse: [
      'Managing workforce human single-sign-on access across multi-account AWS Organizations (use IAM Identity Center)',
      'End-user customer authentication for consumer web and mobile applications (use Amazon Cognito)'
    ],
    practicalImplementation: {
      cli: 'aws iam create-role --role-name LambdaS3Reader --assume-role-policy-document file://trust-policy.json'
    },
    security: 'IAM is the core foundation of AWS security. Never use the AWS root account for daily operations. Mandate MFA on all human credentials.',
    costDrivers: 'AWS IAM is a foundational security service provided completely free of charge.',
    limitations: [
      'IAM is a global service; propagation of changes across regions takes a few seconds',
      'Hard limits on policy size (typically 2 KB to 10 KB depending on policy type)'
    ],
    commonMistakes: [
      'Hardcoding IAM access keys (AKIA...) in application source code or committing them to Git repositories',
      'Using the AWS Root User for routine administrative tasks',
      'Granting wildcard `AdministratorAccess` (`"Action": "*", "Resource": "*"`) to developers or applications'
    ],
    alternatives: [
      { service: 'iam-identity-center', reason: 'Modern recommended single sign-on for corporate workforce identity federation' },
      { service: 'cognito', reason: 'Consumer application user pools and social identity provider federation' }
    ],
    relatedServices: ['iam-identity-center', 'iam-access-analyzer', 'kms', 'organizations'],
    scenarioQuestion: {
      id: 'q-iam-01',
      question: 'An application running on an EC2 instance needs to read and write objects to an Amazon S3 bucket. What is the most secure method to provide AWS API credentials to this application?',
      type: 'single',
      options: [
        'Attach an IAM Role with least-privilege S3 permissions to the EC2 instance via an Instance Profile.',
        'Create an IAM user with S3 permissions and store access keys in an application configuration file.',
        'Pass AWS access keys securely into the EC2 instance user-data launch script as environment variables.',
        'Store access keys in an S3 bucket that only the instance IP address can access.'
      ],
      correctAnswers: [0],
      explanation: 'Attaching an IAM Role via an Instance Profile enables the instance to automatically retrieve short-lived, rotated temporary security credentials from IMDS without managing static keys.',
      whyOthersWrong: [
        'Storing static access keys on the instance risks credential compromise and requires manual key rotation.',
        'User-data scripts are visible in plaintext through instance metadata and console logs.',
        'Storing keys in S3 creates a chicken-and-egg problem and still relies on static credentials.'
      ],
      decisiveClue: 'Eliminating static long-term access keys on EC2 points directly to attaching an IAM Role via an Instance Profile.',
      difficulty: 'beginner',
      isOriginal: true
    },
    quickRevision: [
      'IAM evaluation logic: Explicit Deny beats Explicit Allow; default is Implicit Deny.',
      'IAM Roles provide temporary credentials via AWS STS (Security Token Service) with automatic rotation.',
      'Never create access keys for root; lock root behind MFA.',
      'IAM is a global service with zero usage fee.'
    ],
    sources: [
      { title: 'AWS IAM User Guide', url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/introduction.html' },
      { title: 'IAM Policy Evaluation Logic', url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic.html' }
    ],
    searchTerms: ['iam', 'identity', 'role', 'policy', 'instance profile', 'sts', 'least privilege']
  },
  {
    id: 'iam-identity-center',
    name: 'AWS IAM Identity Center',
    shortName: 'IAM Identity Center / AWS SSO',
    category: 'security',
    difficulty: 'intermediate',
    importance: 'important',
    icon: 'Security',
    tagline: 'Manage workforce single sign-on access to AWS accounts and cloud applications',
    mentalModel: 'A central corporate front desk where employees log in once with their company identity and receive single-click access to all permitted AWS accounts and business apps.',
    problemItSolves: 'Eliminates the chaos of creating and maintaining duplicate IAM users across dozens or hundreds of AWS accounts in an enterprise.',
    howItWorks: 'Connects to your corporate identity provider (Okta, Microsoft Entra ID, Google Workspace) via SAML 2.0 / SCIM, and manages multi-account permissions via Permission Sets.',
    components: [
      { name: 'Permission Sets', description: 'Collections of IAM policies managed centrally in Identity Center and provisioned into target accounts as IAM roles.' },
      { name: 'Multi-Account Permissions', description: 'Assignments binding users or groups to specific AWS accounts with defined Permission Sets.' },
      { name: 'Identity Directory', description: 'Built-in directory or external federated IdP (Entra ID, Okta) synchronized via SCIM protocol.' },
      { name: 'Application Assignments', description: 'SAML 2.0 integrations with SaaS applications like Salesforce, Jira, and Slack.' }
    ],
    realWorldExample: 'A corporate enterprise allowing 500 engineers to log in with Okta MFA and access Dev, Staging, and Production AWS accounts from a single web portal.',
    whenToUse: [
      'Centralized human user access across multiple AWS accounts in an AWS Organization',
      'Federating enterprise workforce identities from Microsoft Entra ID, Okta, or Google Workspace',
      'Replacing individual IAM users in favor of centralized single sign-on with short-lived CLI sessions'
    ],
    whenNotToUse: [
      'Service-to-service machine authentication between AWS compute services (use IAM Roles)',
      'Customer-facing application identity authentication (use Amazon Cognito)'
    ],
    practicalImplementation: {
      cli: 'aws sso login --profile my-enterprise-sso'
    },
    security: 'Enforces corporate MFA, session duration caps, and eliminates long-term static IAM user credentials on developer laptops.',
    costDrivers: 'Provided at no additional charge with AWS Organizations.',
    limitations: [
      'Must be deployed in the management account or a delegated administrator account of an AWS Organization',
      'Configured in a single primary AWS Region for the entire organization'
    ],
    commonMistakes: [
      'Continuing to create manual IAM users in member accounts instead of managing permissions via Permission Sets',
      'Manually creating roles in accounts instead of allowing Identity Center to provision them automatically',
      'Not enabling SCIM automatic user provisioning from external identity providers'
    ],
    alternatives: [
      { service: 'iam', reason: 'For standalone single-account environments or service roles' },
      { service: 'cognito', reason: 'For end-user mobile and web app authentication' }
    ],
    relatedServices: ['iam', 'organizations', 'cloudtrail'],
    scenarioQuestion: {
      id: 'q-sso-01',
      question: 'A multinational company has 60 AWS accounts in AWS Organizations. Developers currently log in using individual IAM users created in each account. The CISO mandates centralizing login with Microsoft Entra ID (Azure AD), enforcing MFA, and removing all individual IAM user accounts. What is the recommended solution?',
      type: 'single',
      options: [
        'Deploy AWS IAM Identity Center, federate with Microsoft Entra ID via SAML/SCIM, and assign access using Permission Sets.',
        'Configure Cross-Account IAM Roles in each account with manual trust policies back to on-prem AD.',
        'Deploy AWS Directory Service for Microsoft AD in every single AWS account.',
        'Create Amazon Cognito User Pools in each account synchronized with Entra ID.'
      ],
      correctAnswers: [0],
      explanation: 'AWS IAM Identity Center is AWS\'s recommended service for workforce single sign-on, providing native integration with external IdPs like Entra ID across all accounts in AWS Organizations.',
      whyOthersWrong: [
        'Manual cross-account roles across 60 accounts require significant maintenance overhead and lack unified portal access.',
        'Deploying Directory Service in 60 accounts is prohibitively expensive and unscalable.',
        'Amazon Cognito is designed for external customer app authentication, not internal AWS console/CLI workforce access.'
      ],
      decisiveClue: 'Centralizing enterprise workforce multi-account access with external IdP federation specifies IAM Identity Center.',
      difficulty: 'intermediate',
      isOriginal: true
    },
    quickRevision: [
      'Formerly known as AWS Single Sign-On (AWS SSO).',
      'Permission Sets define what users can do in target accounts.',
      'CLI v2 integration provides seamless `aws sso login` with automatic token refresh.',
      'Included at zero extra cost in AWS Organizations.'
    ],
    sources: [
      { title: 'AWS IAM Identity Center User Guide', url: 'https://docs.aws.amazon.com/singlesignon/latest/userguide/what-is.html' },
      { title: 'Identity Center Best Practices', url: 'https://docs.aws.amazon.com/singlesignon/latest/userguide/best-practices.html' }
    ],
    searchTerms: ['iam identity center', 'aws sso', 'single sign-on', 'permission sets', 'scim', 'entra id', 'okta']
  },
  {
    id: 'iam-access-analyzer',
    name: 'AWS IAM Access Analyzer',
    shortName: 'Access Analyzer',
    category: 'security',
    difficulty: 'intermediate',
    importance: 'supporting',
    icon: 'Security',
    tagline: 'Identify unintended external resource access and validate IAM policies using mathematical logic',
    mentalModel: 'An automated security inspector that mathematically proves whether your S3 buckets, KMS keys, or IAM roles are accidentally exposed to the outside world.',
    problemItSolves: 'Detects risky resource-based policies that grant public or cross-account access to unintended external entities before a security breach occurs.',
    howItWorks: 'Uses automated reasoning (formal methods) to evaluate resource-based policies and generate findings for resources shared outside your AWS zone of trust.',
    components: [
      { name: 'External Access Analyzer', description: 'Scans S3, KMS, SQS, IAM roles, and Lambda to flag sharing with external accounts or the public.' },
      { name: 'Policy Validation', description: 'Validates IAM policies against AWS best practices and grammar rules during policy creation.' },
      { name: 'Policy Generation', description: 'Generates fine-grained least-privilege IAM policies based on CloudTrail access activity logs.' },
      { name: 'Custom Policy Checks', description: 'CI/CD pipeline automated checks preventing developers from deploying overly permissive policies.' }
    ],
    realWorldExample: 'Alerting a cloud administrator within minutes when an engineer accidentally modifies a KMS key policy granting access to an external AWS account.',
    whenToUse: [
      'Auditing AWS accounts to find resources shared with external accounts or the internet',
      'Generating least-privilege policies based on actual CloudTrail API usage history',
      'Validating IAM policies in CI/CD pipelines before deploying to production'
    ],
    whenNotToUse: [
      'Continuous network intrusion detection and compromised credentials detection (use Amazon GuardDuty)',
      'Scanning EC2 operating system packages for CVE vulnerabilities (use Amazon Inspector)'
    ],
    practicalImplementation: {
      cli: 'aws accessanalyzer create-analyzer --analyzer-name OrgExternalAccessAnalyzer --type ORGANIZATION'
    },
    security: 'Eliminates unintended external exposure and validates IAM policies using formal logic proofs.',
    costDrivers: 'External access findings and policy validation are free; custom policy checks in CI/CD incur small per-analysis fees.',
    limitations: [
      'Only inspects supported AWS resources (S3, IAM Roles, KMS, SQS, Lambda, Secrets Manager, ECR, DynamoDB)',
      'Analyzer must be created per region or enabled at the Organization level'
    ],
    commonMistakes: [
      'Ignoring findings instead of creating archive rules for intentionally shared resources',
      'Not enabling the Organization-level analyzer from the delegated administrator account',
      'Manually guessing IAM policy permissions instead of using the automated Policy Generator'
    ],
    alternatives: [
      { service: 'security-hub', reason: 'Aggregates security findings across all AWS security services into a single dashboard' },
      { service: 'aws-config', reason: 'Evaluates configuration compliance against defined rules over time' }
    ],
    relatedServices: ['iam', 's3', 'kms', 'security-hub', 'organizations'],
    scenarioQuestion: {
      id: 'q-iaa-01',
      question: 'A security auditor needs to verify whether any S3 buckets, KMS keys, or IAM roles across an enterprise organization are accessible by external AWS accounts or the public internet. Which service provides automated mathematical verification of these resource policies at no additional charge?',
      type: 'single',
      options: [
        'AWS IAM Access Analyzer with an Organization-level analyzer.',
        'Amazon GuardDuty with S3 Protection enabled.',
        'AWS WAF associated with Amazon CloudFront.',
        'Amazon Inspector automated package scanner.'
      ],
      correctAnswers: [0],
      explanation: 'IAM Access Analyzer uses automated reasoning to analyze resource-based policies and generate findings for any resource accessible outside the AWS zone of trust.',
      whyOthersWrong: [
        'GuardDuty detects anomalous API calls and threat activities; it does not perform formal policy analysis of resource permissions.',
        'AWS WAF blocks HTTP web attacks; it does not analyze IAM resource policies.',
        'Inspector scans EC2, ECR, and Lambda for software vulnerabilities, not IAM resource-based access policies.'
      ],
      decisiveClue: 'Mathematical verification of resource policies for external access points directly to IAM Access Analyzer.',
      difficulty: 'intermediate',
      isOriginal: true
    },
    quickRevision: [
      'Zone of trust: Current AWS account or entire AWS Organization.',
      'Uses automated reasoning (formal logic) to analyze resource policies.',
      'Policy Generator creates least-privilege IAM policies directly from CloudTrail logs.',
      'Core external access analysis is completely free of charge.'
    ],
    sources: [
      { title: 'AWS IAM Access Analyzer User Guide', url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/what-is-access-analyzer.html' },
      { title: 'Generating Least Privilege Policies', url: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/access-analyzer-policy-generation.html' }
    ],
    searchTerms: ['access analyzer', 'iam access analyzer', 'external access', 'policy generator', 'formal reasoning']
  },
  {
    id: 'kms',
    name: 'AWS Key Management Service',
    shortName: 'KMS',
    category: 'security',
    difficulty: 'intermediate',
    importance: 'essential',
    icon: 'Security',
    tagline: 'Create and control cryptographic keys used to encrypt your data across AWS services',
    mentalModel: 'A bank vault containing master keys that never leave the vault; it creates disposable session keys (data keys) to encrypt your files outside the vault.',
    problemItSolves: 'Provides centralized, hardware-backed envelope encryption, key management, and cryptographic audit logging without managing physical HSMs.',
    howItWorks: 'Uses FIPS 140-2/3 validated Hardware Security Modules (HSMs) to manage Customer Master Keys (KMS keys). Uses Envelope Encryption to generate plaintext and ciphertext data keys.',
    components: [
      { name: 'KMS Keys (KMS Key)', description: 'Logical representation of a master key (Symmetric 256-bit AES or Asymmetric RSA/ECC).' },
      { name: 'Key Policy', description: 'Resource-based policy attached directly to the KMS key; the primary mechanism governing key access.' },
      { name: 'Envelope Encryption', description: 'Encrypting plaintext data with a data key, then encrypting the data key with a KMS master key.' },
      { name: 'Multi-Region Keys', description: 'Keys with identical key material and key IDs replicated across multiple regions for multi-region disaster recovery.' }
    ],
    realWorldExample: 'Encrypting petabytes of S3 data lakes and EBS volumes with automatic annual master key rotation and full CloudTrail audit trails.',
    whenToUse: [
      'Encrypting data at rest across AWS services (S3, EBS, RDS, Secrets Manager, DynamoDB)',
      'Digital signing and code signing using asymmetric KMS keys',
      'Regulatory compliance requiring customer-managed keys (CMK) with automated key rotation'
    ],
    whenNotToUse: [
      'Encrypting gigabytes of data directly inside KMS APIs (KMS `Encrypt` API has a strict 4 KB payload limit; use Envelope Encryption)',
      'Dedicated single-tenant hardware HSM where you control physical firmware (use AWS CloudHSM)'
    ],
    practicalImplementation: {
      cli: 'aws kms create-key --description "Customer Master Key for S3" --origin AWS_KMS'
    },
    security: 'Key material cannot be exported or viewed by anyone including AWS staff. Key policies control access; if key policy deletes root access, key can become orphaned.',
    costDrivers: 'Customer Managed Keys ($1/month per key) and KMS cryptographic API requests ($0.03 per 10,000 requests). AWS managed keys are free.',
    limitations: [
      'Direct API encrypt/decrypt limit is strictly 4 KB (envelope encryption must be used for larger files)',
      'KMS keys cannot be transferred between AWS accounts (must use cross-account key policies)',
      'Scheduled key deletion has a mandatory 7-to-30-day waiting period to prevent accidental permanent loss'
    ],
    commonMistakes: [
      'Locking yourself out of a KMS key by removing all root administrative principals from the Key Policy',
      'Forgetting that cross-account access requires BOTH the KMS Key Policy and the caller\'s IAM policy to grant permission',
      'Calling KMS Encrypt on large files instead of using client-side envelope encryption'
    ],
    alternatives: [
      { service: 'cloudhsm', reason: 'Single-tenant dedicated hardware HSM with PKCS#11 / JCE compliance' },
      { service: 'secrets-manager', reason: 'Storing passwords and connection strings rather than managing raw encryption keys' }
    ],
    relatedServices: ['s3', 'ebs', 'rds', 'secrets-manager', 'cloudtrail'],
    scenarioQuestion: {
      id: 'q-kms-01',
      question: 'An application in Account A needs to decrypt an Amazon S3 object located in Account B that is encrypted with a Customer Managed KMS Key in Account B. What two permissions must be in place for decryption to succeed?',
      type: 'single',
      options: [
        'Account A\'s IAM identity must have kms:Decrypt permissions AND Account B\'s KMS Key Policy must grant kms:Decrypt to Account A.',
        'Only Account B\'s KMS Key Policy needs to permit Account A.',
        'Only Account A\'s IAM policy needs to allow kms:Decrypt on Account B\'s KMS key ARN.',
        'Account A must import Account B\'s KMS key material into Account A\'s local KMS registry.'
      ],
      correctAnswers: [0],
      explanation: 'Cross-account KMS access strictly requires two-way authorization: the resource-based KMS Key Policy in Account B must delegate access to Account A, and Account A\'s IAM policy must authorize the caller.',
      whyOthersWrong: [
        'A resource policy alone in Account B cannot grant access without the calling principal in Account A also having corresponding IAM permissions.',
        'An IAM policy in Account A cannot access resources in Account B without Account B\'s key policy explicitly delegating permission.',
        'KMS key material cannot be exported or imported across existing accounts in this manner.'
      ],
      decisiveClue: 'Cross-account KMS key access requires both the KMS Key Policy and the caller IAM identity policy.',
      difficulty: 'intermediate',
      isOriginal: true
    },
    quickRevision: [
      'KMS direct Encrypt API payload limit is strictly 4 KB (use Envelope Encryption for larger data).',
      'Envelope Encryption: Data encrypted with Data Key; Data Key encrypted with KMS Key.',
      'Customer managed keys support automated annual rotation without changing key ARN.',
      'Key deletion has a mandatory waiting period between 7 and 30 days.'
    ],
    sources: [
      { title: 'AWS KMS Developer Guide', url: 'https://docs.aws.amazon.com/kms/latest/developerguide/overview.html' },
      { title: 'KMS Envelope Encryption Concepts', url: 'https://docs.aws.amazon.com/kms/latest/developerguide/concepts.html#enveloping' }
    ],
    searchTerms: ['kms', 'key management service', 'envelope encryption', 'cmk', 'data key', 'key policy']
  },
  {
    id: 'secrets-manager',
    name: 'AWS Secrets Manager',
    shortName: 'Secrets Manager',
    category: 'security',
    difficulty: 'intermediate',
    importance: 'important',
    icon: 'Security',
    tagline: 'Rotate, manage, and retrieve database credentials, API keys, and other secrets throughout their lifecycle',
    mentalModel: 'A digital credential vault that not only securely locks up passwords, but also automatically changes and rotates database passwords on schedule without downtime.',
    problemItSolves: 'Eliminates hardcoded passwords in code and configuration files, while solving the operational risk of stale, never-rotated credentials.',
    howItWorks: 'Stores encrypted secrets (JSON/text) protected by KMS. Integrates with Lambda to automatically rotate database credentials for RDS, Aurora, and Redshift on schedule.',
    components: [
      { name: 'Secret Value', description: 'Encrypted sensitive payload (key-value JSON or plaintext string) up to 64 KB.' },
      { name: 'Automatic Rotation', description: 'Built-in integration invoking Lambda to update both the database and the stored secret simultaneously.' },
      { name: 'Secret Versioning', description: 'Maintains staging labels (`AWSCURRENT`, `AWSPREVIOUS`, `AWSPENDING`) during rotation to guarantee zero-downtime cutover.' },
      { name: 'Cross-Region Replication', description: 'Replicates secrets across multiple AWS regions with synchronized rotation for disaster recovery.' }
    ],
    realWorldExample: 'Storing database credentials for an Aurora PostgreSQL cluster with automated 30-day credential rotation and zero application downtime.',
    whenToUse: [
      'Storing database passwords requiring automated periodic rotation',
      'OAuth tokens, third-party API keys, and sensitive license keys',
      'Multi-region architectures needing replicated secrets synchronized across regions'
    ],
    whenNotToUse: [
      'Non-sensitive application configuration flags (e.g. `MAX_THREADS=10`) (use Systems Manager Parameter Store)',
      'Cost-sensitive environments storing thousands of static configuration strings (Secrets Manager costs $0.40/secret/month vs Parameter Store standard free tier)'
    ],
    practicalImplementation: {
      cli: 'aws secretsmanager create-secret --name prod/db/mysql --secret-string "{\"username\":\"dbadmin\",\"password\":\"VeryStrongP@ssw0rd!\"}"'
    },
    security: 'Encrypted at rest with KMS. Access is strictly governed via IAM identity policies and Secret resource policies.',
    costDrivers: '$0.40 per secret per month plus $0.05 per 10,000 API calls.',
    limitations: [
      'Maximum secret size is 64 KB',
      'Significantly higher cost than SSM Parameter Store for large volumes of static strings'
    ],
    commonMistakes: [
      'Calling `GetSecretValue` on every single incoming web request instead of caching secrets in application memory for a few minutes',
      'Using Secrets Manager for basic non-secret environment variables, leading to ballooning monthly costs',
      'Misconfiguring Lambda rotation VPC networking, preventing the rotation function from reaching the private database'
    ],
    alternatives: [
      { service: 'parameter-store', reason: 'SSM Parameter Store is free for standard parameters and handles basic encrypted strings' },
      { service: 'kms', reason: 'Directly encrypting data rather than managing credential lifecycles and rotation' }
    ],
    relatedServices: ['rds', 'aurora', 'kms', 'lambda', 'parameter-store'],
    scenarioQuestion: {
      id: 'q-sm-01',
      question: 'A security compliance audit mandates that an enterprise e-commerce platform must automatically rotate all RDS MySQL master database passwords every 30 days without manual operator intervention or application downtime. Which solution satisfies this requirement with least effort?',
      type: 'single',
      options: [
        'Store credentials in AWS Secrets Manager and enable automated rotation using the built-in RDS rotation Lambda function template.',
        'Store credentials in Systems Manager Parameter Store as SecureStrings and run a monthly cron job on an EC2 instance.',
        'Use AWS KMS keys with automated annual key rotation enabled.',
        'Create a weekly CloudWatch alarm that sends an SNS email to administrators to change the password.'
      ],
      correctAnswers: [0],
      explanation: 'AWS Secrets Manager has native out-of-the-box support for automated database password rotation using managed Lambda functions with zero downtime staging labels.',
      whyOthersWrong: [
        'SSM Parameter Store does not have built-in automated rotation mechanisms and requires custom maintenance.',
        'KMS key rotation rotates the underlying master cryptographic key material, not the actual database user password inside MySQL.',
        'SNS manual notification relies on manual intervention and fails the automation requirement.'
      ],
      decisiveClue: 'Automated 30-day database credential rotation without manual intervention points directly to AWS Secrets Manager.',
      difficulty: 'intermediate',
      isOriginal: true
    },
    quickRevision: [
      'Native automatic credential rotation via AWS Lambda for RDS, DocumentDB, and Redshift.',
      'Secrets Manager costs $0.40 per secret/month + $0.05 per 10,000 API calls.',
      'Maintains version staging labels: AWSCURRENT, AWSPREVIOUS, AWSPENDING.',
      'Always cache secrets in application memory to avoid high API costs and latency.'
    ],
    sources: [
      { title: 'AWS Secrets Manager User Guide', url: 'https://docs.aws.amazon.com/secretsmanager/latest/userguide/intro.html' },
      { title: 'Secrets Manager Rotation', url: 'https://docs.aws.amazon.com/secretsmanager/latest/userguide/rotating-secrets.html' }
    ],
    searchTerms: ['secrets manager', 'secret rotation', 'database credentials', 'kms', 'credential vault']
  },
  {
    id: 'parameter-store',
    name: 'AWS Systems Manager Parameter Store',
    shortName: 'Parameter Store',
    category: 'security',
    difficulty: 'beginner',
    importance: 'important',
    icon: 'Security',
    tagline: 'Secure, hierarchical storage for configuration data and secrets management',
    mentalModel: 'A centralized configuration file cabinet in the cloud organizing application settings and passwords in neat folder hierarchies like `/prod/app/db_url`.',
    problemItSolves: 'Decouples application configuration and configuration secrets from source code, enabling centralized management and runtime retrieval.',
    howItWorks: 'Stores key-value parameters as String, StringList, or SecureString (encrypted with KMS) organized in hierarchical paths.',
    components: [
      { name: 'Parameter Types', description: 'String, StringList, and SecureString (encrypted via AWS KMS).' },
      { name: 'Hierarchical Structure', description: 'Namespaces like `/frontend/prod/api_url` enabling bulk retrieval using `GetParametersByPath`.' },
      { name: 'Parameter Tiers', description: 'Standard (Free, up to 4 KB per parameter, 10,000 max) and Advanced (Paid, up to 8 KB, parameter policies).' },
      { name: 'Parameter Policies', description: 'Time-to-Live (TTL) expiration and notification policies available on Advanced parameters.' }
    ],
    realWorldExample: 'Supplying environment configuration, database connection URLs, and encrypted API tokens to microservices at container launch.',
    whenToUse: [
      'Managing application configuration parameters (endpoints, URLs, timeout limits, feature flags)',
      'Storing secrets when automated rotation is NOT required (free standard SecureStrings)',
      'Hierarchical configuration organization across environments (/dev, /staging, /prod)'
    ],
    whenNotToUse: [
      'Database credentials requiring automated out-of-the-box scheduled rotation (use AWS Secrets Manager)',
      'Large binary configuration objects exceeding 8 KB (use Amazon S3)'
    ],
    practicalImplementation: {
      cli: 'aws ssm put-parameter --name "/prod/ecommerce/api-endpoint" --value "https://api.example.com" --type String --overwrite'
    },
    security: 'SecureStrings are automatically encrypted at rest using customer-specified or default KMS keys. Access controlled via IAM path matching.',
    costDrivers: 'Standard parameters are completely FREE. Advanced parameters cost $0.05 per parameter/month plus API interactions over high-throughput threshold.',
    limitations: [
      'Standard tier max parameter size is 4 KB; Advanced tier max size is 8 KB',
      'No native automated password rotation feature (unlike Secrets Manager)'
    ],
    commonMistakes: [
      'Storing thousands of simple configs in Secrets Manager instead of Parameter Store, incurring unnecessary monthly bills',
      'Not using hierarchical naming conventions (e.g. `/app/env/component/param`), making bulk retrieval and IAM policy paths difficult',
      'Forgetting to grant `kms:Decrypt` permission when retrieving `SecureString` parameters'
    ],
    alternatives: [
      { service: 'secrets-manager', reason: 'When automated database credential rotation is required' },
      { service: 'appconfig', reason: 'Feature flagging and dynamic configuration rollout with automated validation and rollback' }
    ],
    relatedServices: ['systems-manager', 'secrets-manager', 'kms', 'iam'],
    scenarioQuestion: {
      id: 'q-ssm-ps-01',
      question: 'A company has 300 non-secret application configuration settings and 20 static API keys across three environments (dev, test, prod). The credentials do not require automated rotation. Which solution provides secure hierarchical storage at the lowest cost?',
      type: 'single',
      options: [
        'AWS Systems Manager Parameter Store using Standard tier String and SecureString parameters.',
        'AWS Secrets Manager with individual secrets created for each configuration setting.',
        'Amazon DynamoDB table encrypted with AWS KMS.',
        'Amazon S3 bucket with separate JSON configuration files for each setting.'
      ],
      correctAnswers: [0],
      explanation: 'SSM Parameter Store Standard tier is completely free for up to 10,000 parameters, supports hierarchical paths, and provides SecureString KMS encryption for API keys.',
      whyOthersWrong: [
        'Storing 320 parameters in Secrets Manager would cost over $128 per month ($0.40/secret/month) unnecessarily.',
        'DynamoDB requires managing schemas, tables, and custom application serialization logic.',
        'S3 bucket files lack native parameter-level IAM path filtering and hierarchical parameter APIs.'
      ],
      decisiveClue: 'Lowest cost hierarchical storage for non-rotating secrets and application settings specifies SSM Parameter Store Standard tier.',
      difficulty: 'beginner',
      isOriginal: true
    },
    quickRevision: [
      'Standard tier is 100% FREE (up to 4 KB, up to 10,000 parameters).',
      'Three types: String, StringList, SecureString (KMS encrypted).',
      'Hierarchical paths allow querying entire trees with `GetParametersByPath`.',
      'Does NOT provide built-in automated rotation (use Secrets Manager for rotation).'
    ],
    sources: [
      { title: 'AWS Systems Manager Parameter Store', url: 'https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html' },
      { title: 'Parameter Store vs Secrets Manager', url: 'https://docs.aws.amazon.com/systems-manager/latest/userguide/parameter-store-secrets-manager.html' }
    ],
    searchTerms: ['parameter store', 'ssm', 'securestring', 'hierarchical configuration', 'configuration management']
  },
  {
    id: 'cloudtrail',
    name: 'AWS CloudTrail',
    shortName: 'CloudTrail',
    category: 'security',
    difficulty: 'intermediate',
    importance: 'essential',
    icon: 'Security',
    tagline: 'Track user activity and API usage across your AWS infrastructure for governance and compliance',
    mentalModel: 'The flight data flight recorder (black box) and CCTV video camera recording every single API call made inside your AWS account.',
    problemItSolves: 'Answers the critical security questions: "Who did what, where, when, and from which IP address?" across your entire AWS environment.',
    howItWorks: 'Records AWS Management Console actions, CLI commands, and SDK API calls as JSON event records and delivers them to Amazon S3, CloudWatch Logs, and EventBridge.',
    components: [
      { name: 'Management Events', description: 'Control plane actions like creating an EC2 instance, attaching an IAM policy, or modifying a VPC route table (first copy is free).' },
      { name: 'Data Events', description: 'High-volume resource operations like S3 `GetObject`/`PutObject` or Lambda `Invoke` (opt-in, paid).' },
      { name: 'CloudTrail Lake', description: 'Managed data lake for running SQL queries on multi-account CloudTrail event history with up to 7-year retention.' },
      { name: 'CloudTrail Insights', description: 'Machine learning anomaly detection that alerts on unusual spikes in API call volume or error rates.' }
    ],
    realWorldExample: 'Investigating an unauthorized security incident by identifying the exact IAM user access key that deleted an RDS production database at 3:14 AM.',
    whenToUse: [
      'Security auditing, compliance attestation, and forensic incident investigation',
      'Triggering automated responses to infrastructure changes via Amazon EventBridge',
      'Tracking operational changes across multi-account AWS Organizations via an Organization Trail'
    ],
    whenNotToUse: [
      'Real-time application performance and server CPU/memory performance monitoring (use CloudWatch)',
      'Operating system inside-the-VM event logging like Windows Event Logs or Linux syslog (use CloudWatch Agent)'
    ],
    practicalImplementation: {
      cli: 'aws cloudtrail create-trail --name OrgSecurityTrail --s3-bucket-name my-audit-bucket-central --is-multi-region-trail --is-organization-trail'
    },
    security: 'Enable CloudTrail Log File Integrity Validation using SHA-256 digital signatures to prove audit logs have not been tampered with or modified.',
    costDrivers: 'First copy of Management Events in an active Trail is free. Data Events incur $0.10 per 100,000 events. CloudTrail Insights and CloudTrail Lake incur ingest/query fees.',
    limitations: [
      'Events typically take 5-15 minutes to be delivered to the S3 bucket destination',
      'Event History in the AWS console only retains the past 90 days of management events unless an S3 trail is configured'
    ],
    commonMistakes: [
      'Relying solely on the default 90-day console Event History without creating an ongoing S3 Trail for permanent archival',
      'Creating single-region trails instead of Multi-Region trails, leaving actions in unmonitored regions invisible',
      'Not enabling Log File Validation, compromising forensic integrity in legal compliance disputes'
    ],
    alternatives: [
      { service: 'cloudwatch', reason: 'Focuses on metrics, logs, and alarms for performance rather than API governance' },
      { service: 'aws-config', reason: 'Focuses on resource configuration state history and compliance rather than API caller identity' }
    ],
    relatedServices: ['s3', 'cloudwatch', 'eventbridge', 'aws-config', 'guardduty'],
    scenarioQuestion: {
      id: 'q-ct-01',
      question: 'A security engineer must ensure that all API activity across 50 member accounts in an AWS Organization is logged to an immutable S3 bucket in a central security account. The solution must guarantee that logs cannot be altered or tampered with by member account root users. What should be configured?',
      type: 'single',
      options: [
        'Create a Multi-Region Organization Trail in the management account delivering to an S3 bucket in the security account with Log File Validation enabled and S3 Object Lock.',
        'Create individual local trails in each member account sending logs to local member account S3 buckets.',
        'Install the CloudWatch agent on all EC2 instances to capture API call history.',
        'Use AWS Config rules in each account to record API access.'
      ],
      correctAnswers: [0],
      explanation: 'An Organization Trail automatically logs API calls across all accounts to a central S3 bucket. Log File Validation provides tamper detection, and S3 Object Lock enforces immutability.',
      whyOthersWrong: [
        'Local trails can be disabled or deleted by member account root or administrative users.',
        'CloudWatch agent logs inside-the-OS system metrics, not AWS control plane API calls.',
        'AWS Config records resource configuration changes over time, not API call caller identities.'
      ],
      decisiveClue: 'Centralized tamper-evident multi-account API logging across an Organization specifies an Organization Trail with Log File Validation.',
      difficulty: 'intermediate',
      isOriginal: true
    },
    quickRevision: [
      'Event History in console retains 90 days free; S3 Trail is needed for long-term retention.',
      'Always configure Multi-Region Trail across all regions.',
      'Log File Validation uses SHA-256 digest files to detect log tampering.',
      'CloudTrail = WHO did WHAT, WHEN, and from WHERE.'
    ],
    sources: [
      { title: 'AWS CloudTrail User Guide', url: 'https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-user-guide.html' },
      { title: 'CloudTrail Event Types', url: 'https://docs.aws.amazon.com/awscloudtrail/latest/userguide/logging-data-events-with-cloudtrail.html' }
    ],
    searchTerms: ['cloudtrail', 'api logging', 'audit log', 'governance', 'log file validation', 'organization trail']
  },
  {
    id: 'aws-config',
    name: 'AWS Config',
    shortName: 'Config',
    category: 'security',
    difficulty: 'intermediate',
    importance: 'important',
    icon: 'Security',
    tagline: 'Record and evaluate configurations of your AWS resources for compliance auditing',
    mentalModel: 'An automated time-machine and compliance building inspector that records every change made to your resources and flags any rule violations.',
    problemItSolves: 'Provides continuous compliance assessment, configuration history tracking, and automated remediation against security baselines.',
    howItWorks: 'Monitors resource configurations, generates configuration items (CIs) on change, evaluates them against managed or custom Config Rules, and records state history in S3.',
    components: [
      { name: 'Configuration Items (CI)', description: 'Point-in-time attributes and relationship maps of an AWS resource.' },
      { name: 'Config Rules', description: 'Compliance rules (e.g. `s3-bucket-public-read-prohibited`) that evaluate resource state as COMPLIANT or NON_COMPLIANT.' },
      { name: 'Automated Remediation', description: 'Integration with Systems Manager Automation documents to automatically fix non-compliant resources (e.g. block public S3 access).' },
      { name: 'Config Conformance Packs', description: 'Collections of Config rules and remediation actions packaged together for standards like CIS AWS Foundations or PCI-DSS.' }
    ],
    realWorldExample: 'Instantly detecting when a developer creates an unencrypted EBS volume, and automatically triggering a Systems Manager document to delete or encrypt it.',
    whenToUse: [
      'Continuous compliance monitoring against security standards (CIS benchmarks, HIPAA, PCI-DSS)',
      'Viewing historical configuration changes and relationship graphs of resources over time',
      'Automating instant remediation for configuration drift'
    ],
    whenNotToUse: [
      'Tracking who made the API call that modified the resource (use AWS CloudTrail)',
      'Real-time CPU and application performance metric monitoring (use CloudWatch)'
    ],
    practicalImplementation: {
      cli: 'aws configservice put-config-rule --config-rule "{\"ConfigRuleName\": \"s3-bucket-ssl-requests-only\", \"Source\": {\"Owner\": \"AWS\", \"SourceIdentifier\": \"S3_BUCKET_SSL_REQUESTS_ONLY\"}}"'
    },
    security: 'Maintains immutable configuration state timelines. Integrates directly with AWS Security Hub and AWS Audit Manager.',
    costDrivers: 'Configuration items recorded ($0.003 per item) and active Config rule evaluations ($0.001 per evaluation).',
    limitations: [
      'High churn in dynamic environments (e.g., rapid autoscaling or ephemeral containers) can generate large volumes of CIs and high costs',
      'Evaluation is not inline pre-deployment blocking (it detects and remediates after resource creation; use CloudFormation hooks for pre-deploy)'
    ],
    commonMistakes: [
      'Recording all resource types including high-churn ephemeral resources without filtering, leading to unexpectedly high monthly Config bills',
      'Confusing AWS Config with CloudTrail (Config records WHAT the resource state looks like; CloudTrail records WHO made the API call)',
      'Not configuring automated remediation on critical security rules'
    ],
    alternatives: [
      { service: 'cloudtrail', reason: 'Focuses on API call auditing rather than resource configuration state' },
      { service: 'security-hub', reason: 'High-level security posture aggregator consuming Config rule findings' }
    ],
    relatedServices: ['cloudtrail', 'security-hub', 'systems-manager', 's3'],
    scenarioQuestion: {
      id: 'q-cfg-01',
      question: 'A company\'s security governance policy mandates that all Amazon EBS volumes must be encrypted at creation. If an unencrypted volume is launched, the team needs an automated record of compliance violation and immediate automated remediation. Which service achieves this?',
      type: 'single',
      options: [
        'AWS Config with the `encrypted-volumes` managed rule and an AWS Systems Manager Automation remediation action.',
        'AWS CloudTrail configured with an SQS queue and an EC2 polling daemon.',
        'Amazon CloudWatch Logs with metric filters monitoring EBS volume attachment.',
        'AWS IAM Access Analyzer configured with an S3 export rule.'
      ],
      correctAnswers: [0],
      explanation: 'AWS Config continuously monitors resource configurations against rules and supports automatic remediation through AWS Systems Manager Automation runbooks.',
      whyOthersWrong: [
        'CloudTrail records the API call but does not continuously evaluate compliance state or provide built-in remediation runbooks.',
        'CloudWatch metric filters do not evaluate EBS encryption configuration state natively.',
        'IAM Access Analyzer inspects resource-based policies for external access, not EBS encryption settings.'
      ],
      decisiveClue: 'Evaluating resource configuration state against compliance rules with automated remediation points directly to AWS Config.',
      difficulty: 'intermediate',
      isOriginal: true
    },
    quickRevision: [
      'AWS Config = WHAT the resource configuration looks like over time.',
      'AWS CloudTrail = WHO made the API call to change the resource.',
      'Conformance Packs bundle rules for regulatory frameworks (PCI-DSS, HIPAA, CIS).',
      'Automated Remediation uses AWS Systems Manager Automation runbooks.'
    ],
    sources: [
      { title: 'AWS Config Developer Guide', url: 'https://docs.aws.amazon.com/config/latest/developerguide/WhatIsConfig.html' },
      { title: 'Config Managed Rules', url: 'https://docs.aws.amazon.com/config/latest/developerguide/managed-rules-by-aws-config.html' }
    ],
    searchTerms: ['aws config', 'compliance', 'config rules', 'conformance packs', 'remediation', 'configuration item']
  }
];
