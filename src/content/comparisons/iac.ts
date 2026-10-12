import { Comparison } from '../../types';

export const iacComparisons: Comparison[] = [
  {
    id: 'terraform-vs-cloudformation',
    title: 'Terraform vs CloudFormation',
    category: 'IaC & Automation',
    serviceA: 'HashiCorp Terraform / OpenTofu',
    serviceB: 'AWS CloudFormation',
    problem: 'Selecting an Infrastructure as Code (IaC) tool for provisioning and maintaining cloud environments.',
    decisiveDifferences: [
      'Multi-Cloud & Ecosystem: Terraform is multi-cloud and multi-provider, allowing a single workflow to manage AWS, Azure, GCP, GitHub, Datadog, and Snowflake; CloudFormation is native to AWS, managing AWS resources and custom resources within the AWS ecosystem.',
      'State Management: Terraform uses an explicit state file (`terraform.tfstate`) that must be stored, locked (e.g., S3 + DynamoDB), and managed by the operator; CloudFormation manages state implicitly inside AWS with zero customer-managed state files.',
      'Drift Detection & Execution Plan: Terraform generates an explicit dry-run execution plan (`terraform plan`) prior to apply, showing exact additions, updates, and destructions; CloudFormation uses Change Sets to preview changes.',
      'Modularity & Language: Terraform uses HashiCorp Configuration Language (HCL), a concise declarative DSL with rich expressions and module registry; CloudFormation uses raw declarative JSON or YAML templates.'
    ],
    whenToChooseA: [
      'Multi-cloud or hybrid infrastructure strategies requiring consistent IaC tooling across vendors.',
      'Environments requiring non-AWS provider orchestration (e.g., provisioning an AWS VPC alongside Datadog monitors, Auth0 clients, and PagerDuty services).',
      'Teams leveraging advanced HCL language constructs, third-party module registries, and custom provider plugins.'
    ],
    whenToChooseB: [
      'AWS-exclusive environments seeking zero state management overhead and native AWS console integration.',
      'Organizations using AWS Service Catalog, Control Tower, or AWS Organizations CloudFormation StackSets.',
      'Turnkey integration with AWS services without installing external CLI binaries or configuring remote state locking backends.'
    ],
    workTogether: 'An organization can use Terraform to provision core underlying infrastructure (VPCs, EKS clusters, IAM roles) while developers deploy application-specific stacks using CloudFormation or AWS CDK templates published through AWS Service Catalog.',
    tradeoffs: [
      {
        dimension: 'Provider Scope',
        optionA: 'Multi-cloud (AWS, Azure, GCP, SaaS, Kubernetes).',
        optionB: 'AWS-native (with custom resource extensions).'
      },
      {
        dimension: 'State Storage',
        optionA: 'Operator manages remote state backend (S3 bucket + DynamoDB lock).',
        optionB: 'Managed automatically by AWS CloudFormation engine with no state files.'
      },
      {
        dimension: 'Language Syntax',
        optionA: 'HashiCorp Configuration Language (HCL).',
        optionB: 'JSON or YAML.'
      }
    ],
    scenario: 'A DevOps platform team provisions AWS VPCs, Snowflake databases, and Datadog monitoring alerts in a single unified pipeline using Terraform. For customer-facing SaaS deployments inside client AWS accounts, they distribute AWS CloudFormation templates.',
    question: {
      id: 'quiz-terraform-vs-cloudformation-1',
      question: 'A DevOps team needs an Infrastructure as Code solution to provision AWS infrastructure, Datadog monitoring dashboards, and GitHub repository branch protections within a single coordinated execution plan. Which IaC tool is suited for this multi-provider workflow?',
      type: 'single',
      options: [
        'AWS CloudFormation',
        'HashiCorp Terraform / OpenTofu',
        'AWS Elastic Beanstalk',
        'AWS OpsWorks'
      ],
      correctAnswers: [1],
      explanation: 'Terraform is a multi-provider Infrastructure as Code tool that can manage AWS infrastructure, third-party SaaS platforms (Datadog), and developer tools (GitHub) together within a single configuration and execution plan.',
      whyOthersWrong: [
        'AWS CloudFormation is AWS-centric and cannot natively manage GitHub repository protections or Datadog dashboards without complex custom Lambda-backed resource providers.',
        'Elastic Beanstalk is an application deployment platform (PaaS), not a general-purpose multi-provider IaC tool.',
        'AWS OpsWorks is a configuration management service based on Chef/Puppet, not a multi-provider IaC provisioning engine.'
      ],
      decisiveClue: 'Provision AWS, Datadog dashboards, and GitHub branch protections within a single coordinated execution plan.',
      difficulty: 'beginner',
      isOriginal: true,
      source: 'Original AWS certification-style practice question'
    },
    sources: [
      { title: 'Terraform AWS Provider Documentation', url: 'https://registry.terraform.io/providers/hashicorp/aws/latest/docs' },
      { title: 'AWS CloudFormation User Guide', url: 'https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/Welcome.html' }
    ]
  },
  {
    id: 'cloudformation-vs-cdk',
    title: 'CloudFormation vs AWS CDK',
    category: 'IaC & Automation',
    serviceA: 'AWS CloudFormation (YAML/JSON)',
    serviceB: 'AWS Cloud Development Kit (CDK)',
    problem: 'Deciding between declarative static configuration templates and imperative/object-oriented programming languages for defining cloud infrastructure.',
    decisiveDifferences: [
      'Authoring Language: CloudFormation uses static declarative JSON or YAML files; AWS CDK uses standard programming languages (TypeScript, Python, Java, C#, Go) with full support for loops, conditionals, classes, and inheritance.',
      'Abstraction Levels: CloudFormation works at L1 low-level resource specifications, requiring hundreds of lines of boilerplate for networking and IAM; AWS CDK provides Level 2 and Level 3 "Constructs" that encapsulate sensible security defaults, auto-generating complex IAM roles and security groups in a few lines of code.',
      'Synthesis Relationship: AWS CDK does not replace CloudFormation; CDK compiles (synthesizes) down into standard CloudFormation JSON/YAML templates and deploys them via the CloudFormation engine.',
      'Tooling & Testing: CDK allows unit testing infrastructure using familiar software testing frameworks (Jest, PyTest), linting, and package managers (npm, pip, NuGet); CloudFormation relies on JSON/YAML linters (cfn-lint) and guard tools.'
    ],
    whenToChooseA: [
      'Simple, static infrastructure stacks with minimal conditional logic.',
      'Teams without programming language experience (systems administrators familiar with YAML).',
      'Distributing self-contained, portable templates to external customers who can deploy with one click in the AWS Console.'
    ],
    whenToChooseB: [
      'Software engineering teams wanting to use their primary programming language (TypeScript, Python) for infrastructure.',
      'Creating reusable internal organizational infrastructure libraries (Constructs) published to internal package registries.',
      'Complex architectures requiring algorithmic logic, dynamic sizing, or programmatic loops.',
      'Writing rigorous unit and snapshot tests against infrastructure configurations before deployment.'
    ],
    workTogether: 'AWS CDK compiles directly into CloudFormation templates. CDK CLI (`cdk deploy`) creates and updates CloudFormation Stacks behind the scenes, combining modern programming ergonomics with CloudFormation managed state and rollback reliability.',
    tradeoffs: [
      {
        dimension: 'Language Environment',
        optionA: 'Declarative static YAML / JSON text files.',
        optionB: 'Real programming languages (TypeScript, Python, Java, Go, C#).'
      },
      {
        dimension: 'Boilerplate & Defaults',
        optionA: 'High: every IAM role, policy, and security group rule must be explicitly written.',
        optionB: 'Minimal: L2/L3 constructs apply AWS security best practices automatically.'
      },
      {
        dimension: 'Unit Testing Support',
        optionA: 'Limited to static template linters and policy check engines.',
        optionB: 'Native integration with standard testing frameworks (Jest, pytest, assertions).'
      }
    ],
    scenario: 'A company replaces 4,000 lines of repetitive CloudFormation YAML with a 150-line AWS CDK TypeScript project. The CDK code defines an ECS Fargate service with an Application Load Balancer in just 10 lines using high-level L3 constructs (`ApplicationLoadBalancedFargateService`).',
    question: {
      id: 'quiz-cloudformation-vs-cdk-1',
      question: 'A software engineering team wants to define AWS infrastructure using TypeScript, write unit tests with Jest, and build reusable, versioned internal infrastructure libraries published to private npm registries. Which AWS tool directly provides this capability?',
      type: 'single',
      options: [
        'AWS CloudFormation direct templates',
        'AWS Cloud Development Kit (AWS CDK)',
        'AWS Elastic Beanstalk',
        'AWS CodeBuild'
      ],
      correctAnswers: [1],
      explanation: 'AWS Cloud Development Kit (AWS CDK) allows developers to define cloud infrastructure using familiar programming languages like TypeScript, write standard unit tests (e.g., Jest), and package reusable constructs into libraries published to npm.',
      whyOthersWrong: [
        'AWS CloudFormation templates use static YAML or JSON and cannot be authored natively in TypeScript or published as npm libraries.',
        'AWS Elastic Beanstalk is a managed application hosting platform, not an object-oriented infrastructure framework.',
        'AWS CodeBuild is a continuous integration build service, not an Infrastructure as Code authoring framework.'
      ],
      decisiveClue: 'Define infrastructure using TypeScript, unit test with Jest, and publish reusable npm constructs.',
      difficulty: 'beginner',
      isOriginal: true,
      source: 'Original AWS certification-style practice question'
    },
    sources: [
      { title: 'AWS Cloud Development Kit (CDK) Developer Guide', url: 'https://docs.aws.amazon.com/cdk/v2/guide/home.html' },
      { title: 'AWS CloudFormation Documentation', url: 'https://docs.aws.amazon.com/cloudformation/' }
    ]
  },
  {
    id: 'terraform-vs-ansible',
    title: 'Terraform vs Ansible',
    category: 'IaC & Automation',
    serviceA: 'HashiCorp Terraform',
    serviceB: 'Red Hat Ansible',
    problem: 'Distinguishing between infrastructure provisioning (declarative cloud resource creation) and configuration management (in-guest software and OS setup).',
    decisiveDifferences: [
      'Primary Focus: Terraform is an Infrastructure Provisioning tool that creates, modifies, and destroys cloud infrastructure resources (VPCs, subnets, EC2 instances, RDS databases, S3 buckets); Ansible is a Configuration Management tool primarily designed to install software, manage system configurations, deploy code, and orchestrate OS packages inside operating systems.',
      'Paradigm & State: Terraform is strictly declarative (you declare the desired end state, and the engine calculates the diff against its state file); Ansible is primarily procedural/task-based (YAML playbooks execute a sequence of idempotent tasks on target hosts).',
      'Agent & Connection: Terraform talks directly to cloud vendor REST APIs via provider plugins; Ansible connects to running target machines via SSH (Linux) or WinRM (Windows) without requiring agents.',
      'Lifecycle Management: Terraform excels at creating and tearing down complete infrastructure topologies; Ansible excels at maintaining server configurations and patching over long lifecycles.'
    ],
    whenToChooseA: [
      'Provisioning core cloud infrastructure: VPCs, route tables, subnets, ALBs, RDS databases, and IAM policies.',
      'Managing immutable infrastructure where servers are replaced rather than patched in-place.',
      'Tracking cloud resource dependencies, lifecycle hooks, and drift against a state file.'
    ],
    whenToChooseB: [
      'Configuring operating systems, installing packages (Nginx, Docker), managing configuration files (`/etc/nginx.conf`), and starting systemd services on running EC2 instances.',
      'Executing application deployments and rolling updates across fleets of existing on-premises or cloud servers.',
      'Automating network switch and router configurations (Cisco, Arista) via SSH.'
    ],
    workTogether: 'The Golden Image and Provisioning Pipeline: A team uses HashiCorp Packer and Ansible to install software dependencies and configure the OS into a Golden AMI. Then, Terraform provisions the production VPC, Auto Scaling Group, and load balancer using that baked Golden AMI.',
    tradeoffs: [
      {
        dimension: 'Core Discipline',
        optionA: 'Infrastructure Provisioning (creates cloud API resources).',
        optionB: 'Configuration Management (configures software inside hosts).'
      },
      {
        dimension: 'Communication Target',
        optionA: 'Cloud Provider REST APIs (AWS, Azure, GCP).',
        optionB: 'Target virtual machines via SSH / WinRM.'
      },
      {
        dimension: 'State Tracking',
        optionA: 'Maintains central state file (`terraform.tfstate`).',
        optionB: 'Stateless; queries live target host state on each task run.'
      }
    ],
    scenario: 'A company uses Terraform to provision an Amazon VPC, an Application Load Balancer, and three EC2 instances. Once the EC2 instances are online, an Ansible playbook runs via SSH to install Java 17, configure systemd service files, and deploy the application JAR.',
    question: {
      id: 'quiz-terraform-vs-ansible-1',
      question: 'A company is designing its automation strategy. They need a tool to provision cloud resources like VPCs, Internet Gateways, NAT Gateways, and RDS instances declaratively via cloud APIs, and a tool to configure Linux packages, users, and service daemons inside running virtual machines. Which combination represents the industry-standard separation of concerns?',
      type: 'single',
      options: [
        'Use Ansible to provision VPCs and networking; use Terraform to install Linux packages inside instances',
        'Use Terraform for infrastructure provisioning; use Ansible for configuration management inside the instances',
        'Use CloudWatch for infrastructure provisioning; use Route 53 for in-guest software configuration',
        'Use AWS KMS for infrastructure provisioning; use AWS Secrets Manager for in-guest patching'
      ],
      correctAnswers: [1],
      explanation: 'Terraform is purpose-built for declarative infrastructure provisioning (VPCs, networking, RDS, EC2), whereas Ansible is purpose-built for configuration management (installing software, configuring daemons, managing files inside operating systems).',
      whyOthersWrong: [
        'Using Ansible for cloud infrastructure and Terraform for inside-guest software configuration reverses the core strengths and design patterns of both tools.',
        'CloudWatch and Route 53 are monitoring and DNS services, not IaC or configuration management tools.',
        'KMS and Secrets Manager are cryptography and secrets storage services, not infrastructure automation tools.'
      ],
      decisiveClue: 'Separation of concerns between declarative cloud API provisioning and in-guest software configuration.',
      difficulty: 'intermediate',
      isOriginal: true,
      source: 'Original AWS certification-style practice question'
    },
    sources: [
      { title: 'Terraform Introduction', url: 'https://developer.hashicorp.com/terraform/intro' },
      { title: 'Ansible Documentation', url: 'https://docs.ansible.com/ansible/latest/index.html' }
    ]
  },
  {
    id: 'cli-vs-sdk',
    title: 'AWS CLI vs AWS SDK',
    category: 'IaC & Automation',
    serviceA: 'AWS Command Line Interface (AWS CLI)',
    serviceB: 'AWS Software Development Kits (AWS SDK)',
    problem: 'Choosing the appropriate interface for programmatic interaction with AWS services across terminal scripts versus application code.',
    decisiveDifferences: [
      'Execution Environment: AWS CLI is a standalone command-line executable tool written for shells (bash, zsh, PowerShell) using terminal commands (e.g., `aws s3 cp file.txt s3://mybucket`); AWS SDKs are language-specific software libraries (Boto3 for Python, AWS SDK for JavaScript/TypeScript, Go, Java, .NET) imported directly into application source code.',
      'Output & Data Handling: CLI outputs text, table, or JSON strings intended for terminal consumption or shell parsing (via `jq` or `awk`); SDKs return native programming language objects, types, exceptions, and promises/async structures.',
      'Control Flow & Complexity: CLI is suited for linear shell scripts and one-off administration; SDKs enable rich application control flow, complex data transformations, custom error-handling logic, and tight integration with web frameworks.',
      'Credential Resolution: Both adhere to the standard AWS credential provider chain, but SDKs allow runtime dynamic credential providers and in-memory credential caching directly in long-running processes.'
    ],
    whenToChooseA: [
      'Interactive ad-hoc troubleshooting, administration, and querying from developer terminals.',
      'Continuous Integration / Continuous Deployment (CI/CD) shell scripts (e.g., running `aws s3 sync dist/ s3://site-bucket`).',
      'Simple cron jobs and bash maintenance scripts running on Linux instances.'
    ],
    whenToChooseB: [
      'Embedding AWS interactions directly into backend application code (e.g., uploading an image to S3 from an Express.js or FastAPI web server).',
      'High-throughput services requiring native connection pooling, request retries, and asynchronous non-blocking I/O.',
      'Complex data pipelines requiring structured object manipulation and robust exception handling.'
    ],
    workTogether: 'A developer uses the AWS CLI in their terminal to quickly test and inspect an S3 bucket structure and IAM policies, and then uses the AWS SDK (Boto3 / JavaScript SDK) inside their production microservice to programmatically read and write data with robust error handling.',
    tradeoffs: [
      {
        dimension: 'Primary Use Context',
        optionA: 'Shell scripts, terminal commands, CI/CD pipelines.',
        optionB: 'Application source code, microservices, backend APIs.'
      },
      {
        dimension: 'Return Format',
        optionA: 'Text, JSON string, or tab-delimited output parsed by jq.',
        optionB: 'Native language objects, typed models, exceptions, and streams.'
      },
      {
        dimension: 'Concurrency & Integration',
        optionA: 'Process-based invocation; difficult to handle high-throughput concurrency.',
        optionB: 'In-memory asynchronous execution, connection pooling, and SDK middleware.'
      }
    ],
    scenario: 'A DevOps engineer writes a GitHub Actions deployment workflow using the AWS CLI to sync compiled HTML files to Amazon S3. Meanwhile, the Node.js backend running in ECS uses the AWS SDK for JavaScript to read customer records from Amazon DynamoDB.',
    question: {
      id: 'quiz-cli-vs-sdk-1',
      question: 'A software engineer is developing a Python Flask microservice that needs to upload user-submitted profile avatars directly to an Amazon S3 bucket within an asynchronous web request handler. How should the application interact with Amazon S3?',
      type: 'single',
      options: [
        'Invoke the AWS CLI using a Python subprocess.run() shell command',
        'Use the official AWS SDK for Python (Boto3) imported directly into the code',
        'Configure AWS CloudFormation to trigger the upload',
        'Execute a curl command against the local EC2 metadata service'
      ],
      correctAnswers: [1],
      explanation: 'Applications should interact with AWS services using the official AWS SDK (such as Boto3 for Python). Spawning subprocesses to run shell CLI commands in a web server is inefficient, unsafe, and introduces severe latency and security risks.',
      whyOthersWrong: [
        'Spawning CLI subprocesses inside a web server introduces high CPU overhead, process-fork latency, and shell injection vulnerabilities.',
        'CloudFormation is an Infrastructure as Code provisioning tool, not an application-level data upload mechanism.',
        'The EC2 metadata service provides instance credentials and metadata, but does not accept S3 file upload payloads.'
      ],
      decisiveClue: 'Python Flask web application uploading user avatars to S3 within an asynchronous request handler.',
      difficulty: 'beginner',
      isOriginal: true,
      source: 'Original AWS certification-style practice question'
    },
    sources: [
      { title: 'AWS CLI User Guide', url: 'https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-welcome.html' },
      { title: 'AWS SDKs and Tools Overview', url: 'https://aws.amazon.com/developer/tools/' }
    ]
  },
  {
    id: 'codepipeline-vs-github-actions',
    title: 'CodePipeline vs GitHub Actions',
    category: 'IaC & Automation',
    serviceA: 'AWS CodePipeline',
    serviceB: 'GitHub Actions',
    problem: 'Selecting a continuous integration and continuous delivery (CI/CD) orchestration engine for cloud software deployment.',
    decisiveDifferences: [
      'Hosting & Native Ecosystem: AWS CodePipeline is an AWS-native deployment orchestrator deeply integrated with AWS Identity and Access Management (IAM), AWS CloudFormation, AWS CodeDeploy, and AWS Organizations; GitHub Actions is tightly integrated into the GitHub source code repository, pull requests, issues, and developer ecosystem.',
      'Workflow Breadth: GitHub Actions combines both Continuous Integration (CI: linting, unit testing, building) and Continuous Delivery (CD) within a single YAML file (`.github/workflows/*.yml`); AWS CodePipeline is primarily a CD pipeline coordinator that delegates build and test steps to AWS CodeBuild and deployment to AWS CodeDeploy.',
      'Runner Infrastructure: GitHub Actions provides GitHub-hosted runners (Ubuntu, Windows, macOS) and supports self-hosted runners; CodePipeline coordinates managed AWS services (CodeBuild ephemeral containers) within your VPC or AWS account.',
      'IAM & Credentials: CodePipeline executes natively within your AWS account using attached IAM roles with zero external credential sharing; GitHub Actions connecting to AWS requires configuring OpenID Connect (OIDC) federation to assume temporary IAM roles.'
    ],
    whenToChooseA: [
      'AWS-centric enterprises with strict regulatory policies prohibiting external third-party CI/CD access to production VPCs.',
      'Complex multi-account release pipelines governed by AWS Service Catalog, CloudFormation StackSets, or Control Tower.',
      'Pipelines coordinating deployments strictly across AWS native services (ECS, CodeDeploy, Beanstalk, S3).'
    ],
    whenToChooseB: [
      'Teams hosting their source code on GitHub who want a unified developer experience for PR checks, linting, building, and deployments.',
      'Projects requiring broad ecosystem integrations, rich open-source marketplace actions, and multi-platform build matrices (Linux, Windows, macOS).',
      'Modern agile teams seeking simple, repository-versioned YAML workflow files.'
    ],
    workTogether: 'Modern teams often pair them: GitHub Actions runs fast developer CI tasks (linting, testing, Docker image building) on pull requests and pushes the verified container image to Amazon ECR. Once pushed, an Amazon EventBridge rule triggers AWS CodePipeline to orchestrate the secure, multi-account blue/green production deployment.',
    tradeoffs: [
      {
        dimension: 'Developer Ergonomics',
        optionA: 'AWS Console and AWS API-centric; separate services for Build and Deploy.',
        optionB: 'Native GitHub UI; unified workflows directly alongside pull requests and code.'
      },
      {
        dimension: 'AWS IAM Integration',
        optionA: 'Native IAM Service Roles; zero credentials leave AWS.',
        optionB: 'Requires setting up OIDC Federation (AssumeRoleWithWebIdentity) or access keys.'
      },
      {
        dimension: 'Marketplace Ecosystem',
        optionA: 'Limited to AWS-supported action integrations and custom Lambda invocations.',
        optionB: 'Vast GitHub Actions marketplace with tens of thousands of community actions.'
      }
    ],
    scenario: 'A startup uses GitHub Actions to run unit tests and linting on every pull request. When a release tag is pushed to `main`, GitHub Actions authenticates to AWS via OIDC, pushes the image to ECR, and lets AWS CodePipeline execute an automated canary deployment to ECS across staging and production accounts.',
    question: {
      id: 'quiz-codepipeline-vs-github-actions-1',
      question: 'A development team stores its application code in GitHub and wants to run automated unit tests on every pull request. If tests pass upon merging to the main branch, the workflow should build a Docker image, push it to Amazon ECR using short-lived credentials, and deploy to Amazon ECS. The team wants a single tool tightly integrated with GitHub pull requests. Which tool is best suited?',
      type: 'single',
      options: [
        'GitHub Actions using OIDC role federation with AWS IAM',
        'AWS CodePipeline configured without CodeBuild',
        'Amazon CloudWatch Synthetics canary',
        'AWS Systems Manager Run Command'
      ],
      correctAnswers: [0],
      explanation: 'GitHub Actions integrates directly into GitHub pull requests, runs unit tests, and can securely authenticate to AWS using OpenID Connect (OIDC) to assume temporary IAM roles without long-term access keys, deploying container images to ECR and ECS.',
      whyOthersWrong: [
        'CodePipeline requires CodeBuild for unit tests and does not integrate as natively into GitHub pull request review interfaces as GitHub Actions.',
        'CloudWatch Synthetics is an end-user monitoring tool for web endpoints, not a CI/CD build and test pipeline.',
        'SSM Run Command executes scripts on managed EC2 instances, not continuous integration on git pull requests.'
      ],
      decisiveClue: 'Tightly integrated with GitHub pull requests, running unit tests and deploying via OIDC.',
      difficulty: 'intermediate',
      isOriginal: true,
      source: 'Original AWS certification-style practice question'
    },
    sources: [
      { title: 'AWS CodePipeline User Guide', url: 'https://docs.aws.amazon.com/codepipeline/latest/userguide/welcome.html' },
      { title: 'Configuring OpenID Connect in AWS for GitHub Actions', url: 'https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/configuring-openid-connect-in-amazon-web-services' }
    ]
  },
  {
    id: 'codedeploy-vs-codepipeline',
    title: 'CodeDeploy vs CodePipeline',
    category: 'IaC & Automation',
    serviceA: 'AWS CodeDeploy',
    serviceB: 'AWS CodePipeline',
    problem: 'Distinguishing between a specialized application deployment automation service and an end-to-end continuous delivery pipeline orchestrator.',
    decisiveDifferences: [
      'Role in the Delivery Lifecycle: CodeDeploy is a Deployment Agent/Service responsible strictly for deploying software artifacts onto compute targets (EC2 instances, on-premises servers, ECS tasks, or Lambda functions); CodePipeline is an End-to-End Orchestrator that models, visualizes, and coordinates the entire delivery workflow from source checkout to build, test, approval, and deployment.',
      'Deployment Strategies: CodeDeploy manages advanced deployment strategies such as In-Place rolling updates, Blue/Green deployments, Linear and Canary traffic shifting (e.g., `CodeDeployDefault.LambdaCanary10Percent5Minutes`); CodePipeline does not execute deployment commands directly, but triggers CodeDeploy as a deployment stage.',
      'Scope of Execution: CodeDeploy runs lifecycle event hooks (`appspec.yml`: BeforeInstall, AfterInstall, ApplicationStart, ValidateService) inside target compute environments; CodePipeline manages stages, transitions, manual approvals, and cross-stage artifact passing.'
    ],
    whenToChooseA: [
      'Executing rolling or blue/green deployments directly onto fleets of EC2 instances running the CodeDeploy agent.',
      'Gradually shifting production traffic to new Lambda function versions (canary traffic shifting with CloudWatch alarm rollbacks).',
      'Updating Amazon ECS task definitions with blue/green traffic shifting via Application Load Balancer listener rules.'
    ],
    whenToChooseB: [
      'Orchestrating a multi-stage release process (Source -> Build -> Test -> Manual Approval -> Deploy to Staging -> Deploy to Production).',
      'Visualizing and tracking release stages across multiple AWS accounts and regions.',
      'Connecting disparate tools (e.g., pulling code from GitHub, building with CodeBuild, scanning with SonarQube, and deploying with CodeDeploy).'
    ],
    workTogether: 'CodePipeline and CodeDeploy are designed to work together: CodePipeline acts as the director that pulls source code from GitHub, triggers CodeBuild to create compiled binaries, and then invokes CodeDeploy to safely execute a blue/green deployment onto the production EC2 fleet.',
    tradeoffs: [
      {
        dimension: 'Primary Responsibility',
        optionA: 'Deployment execution (blue/green, canary, traffic shifting, hooks).',
        optionB: 'Pipeline orchestration (stages, gates, artifact flow, triggers).'
      },
      {
        dimension: 'Configuration File',
        optionA: '`appspec.yml` (defines lifecycle hooks and scripts).',
        optionB: '`buildspec.yml` (for CodeBuild) or pipeline stage definitions.'
      },
      {
        dimension: 'Traffic Shifting Controls',
        optionA: 'Built-in (linear, canary, all-at-once with automatic alarm rollback).',
        optionB: 'Delegates traffic shifting to deployment action providers like CodeDeploy.'
      }
    ],
    scenario: 'A software company defines a pipeline in AWS CodePipeline. When code is pushed, CodePipeline triggers AWS CodeBuild to package a Java application. Once tests pass, CodePipeline passes the artifact to AWS CodeDeploy, which performs a blue/green deployment across 20 EC2 instances, rolling back automatically if error alarms trigger.',
    question: {
      id: 'quiz-codedeploy-vs-codepipeline-1',
      question: 'A development team needs to deploy updates to an AWS Lambda function. The deployment must shift 10% of traffic to the new Lambda version initially, wait 10 minutes while monitoring CloudWatch Alarms for errors, and roll back automatically if an error occurs. Which AWS service specifically manages this canary traffic shifting and rollback behavior?',
      type: 'single',
      options: [
        'AWS CodePipeline',
        'AWS CodeDeploy',
        'AWS CodeCommit',
        'AWS CloudFormation'
      ],
      correctAnswers: [1],
      explanation: 'AWS CodeDeploy manages advanced deployment strategies such as canary traffic shifting (e.g., Linear or Canary 10% for 10 minutes) for AWS Lambda and Amazon ECS, and automatically triggers rollbacks if associated CloudWatch alarms fire.',
      whyOthersWrong: [
        'AWS CodePipeline orchestrates the overall release workflow between stages, but delegates the actual canary traffic shifting mechanics to CodeDeploy.',
        'AWS CodeCommit is a source code repository service (git), not a deployment engine.',
        'AWS CloudFormation provisions infrastructure stacks; while it can update Lambda code, it does not provide native canary linear traffic shifting with automated alarm rollback timers.'
      ],
      decisiveClue: 'Canary traffic shifting (10% traffic for 10 minutes) with automated CloudWatch alarm rollback for Lambda.',
      difficulty: 'intermediate',
      isOriginal: true,
      source: 'Original AWS certification-style practice question'
    },
    sources: [
      { title: 'AWS CodeDeploy User Guide', url: 'https://docs.aws.amazon.com/codedeploy/latest/userguide/welcome.html' },
      { title: 'AWS CodePipeline Concepts', url: 'https://docs.aws.amazon.com/codepipeline/latest/userguide/concepts.html' }
    ]
  }
];
