import { AWSService } from '../../types';

export const iacDevopsServices: AWSService[] = [
  {
    id: 'cloudformation',
    name: 'AWS CloudFormation',
    shortName: 'CloudFormation',
    category: 'iac',
    difficulty: 'intermediate',
    importance: 'essential',
    icon: 'IaC',
    tagline: 'Model, provision, and manage AWS and third-party resources with infrastructure as code',
    mentalModel: 'An automated architectural blueprint and construction crew that reads your JSON/YAML instructions and builds or dismantles entire cloud environments reliably.',
    problemItSolves: 'Eliminates manual click-ops errors, configuration drift, and unrepeatable deployments by providing deterministic Infrastructure as Code (IaC).',
    howItWorks: 'You declare resources in declarative YAML/JSON templates. CloudFormation analyzes dependencies, calculates change sets, and provisions or updates stacks in topological order.',
    components: [
      { name: 'Templates', description: 'Declarative JSON or YAML files defining desired AWS resources, parameters, mappings, outputs, and conditions.' },
      { name: 'Stacks', description: 'A single management unit of provisioned resources created, updated, or deleted collectively.' },
      { name: 'Change Sets', description: 'Point-in-time previews showing proposed resource additions, replacements, or deletions before applying changes.' },
      { name: 'StackSets', description: 'Extends stacks across multiple AWS accounts and multiple AWS regions with a single operation.' }
    ],
    realWorldExample: 'Deploying a 3-tier production VPC with subnets, NAT gateways, ALB, and auto-scaling groups deterministically across dev, staging, and prod.',
    whenToUse: [
      'Standardizing automated repeatable infrastructure provisioning on native AWS declarative IaC',
      'Multi-account, multi-region infrastructure rollouts using CloudFormation StackSets',
      'Detecting and remediating infrastructure drift from baseline template definitions'
    ],
    whenNotToUse: [
      'Multi-cloud infrastructure management spanning Azure, GCP, and AWS (use HashiCorp Terraform)',
      'Complex procedural logic requiring full general-purpose programming languages (use AWS CDK)'
    ],
    practicalImplementation: {
      cli: 'aws cloudformation deploy --template-file template.yaml --stack-name prod-network-stack --capabilities CAPABILITY_IAM'
    },
    security: 'IAM Service Roles allow CloudFormation to manage resources with least privilege without granting users broad direct cloud permissions.',
    costDrivers: 'CloudFormation is completely free for native AWS resources; charges apply only for custom third-party resource registry handlers.',
    limitations: [
      'Template size limits (51 KB for direct template body; 1 MB via S3 bucket upload)',
      'Stack limit of 500 resources per template (use nested stacks to break up large architectures)',
      'Complex circular dependencies can cause stack creation or rollback failures'
    ],
    commonMistakes: [
      'Applying updates directly without creating and reviewing a Change Set first, causing accidental replacement of stateful resources like RDS',
      'Modifying cloud resources manually in the AWS Console, causing drift and subsequent stack update failures',
      'Failing to use `DeletionPolicy: Retain` on critical stateful resources (DynamoDB, RDS, S3)'
    ],
    alternatives: [
      { service: 'terraform', reason: 'Industry-standard open-source IaC supporting multi-cloud and vast provider ecosystems' },
      { service: 'cdk', reason: 'High-level programmatic IaC using TypeScript, Python, and Go compiled down to CloudFormation' }
    ],
    relatedServices: ['cdk', 'terraform', 'systems-manager', 'service-catalog'],
    scenarioQuestion: {
      id: 'q-cfn-01',
      question: 'A DevOps engineer needs to deploy a security logging baseline across 50 AWS accounts and 4 regions in an enterprise organization. The deployment must execute from a centralized management account and automatically apply to newly created member accounts. Which feature achieves this?',
      type: 'single',
      options: [
        'AWS CloudFormation StackSets with automatic deployment enabled.',
        'Nested CloudFormation Stacks created in the management account.',
        'AWS Systems Manager Run Command executed across accounts.',
        'AWS CodeBuild executing parallel AWS CLI commands.'
      ],
      correctAnswers: [0],
      explanation: 'CloudFormation StackSets allows deploying stacks across multiple AWS accounts and regions in an AWS Organization, with automatic deployment to new accounts joining target OUs.',
      whyOthersWrong: [
        'Nested Stacks are confined to a single account and single region for modularizing local templates.',
        'SSM Run Command manages OS-level commands, not multi-account cloud infrastructure resource lifecycle provisioning.',
        'Writing parallel CLI scripts in CodeBuild is custom, unmanaged, and lacks stack rollback and drift detection features.'
      ],
      decisiveClue: 'Centralized deployment across multiple accounts and regions with automatic provisioning for new accounts specifies CloudFormation StackSets.',
      difficulty: 'intermediate',
      isOriginal: true
    },
    quickRevision: [
      'Declarative JSON/YAML infrastructure as code.',
      'Always use Change Sets to preview updates before execution.',
      'StackSets enable multi-account and multi-region rollouts.',
      'Protect stateful databases with `DeletionPolicy: Retain`.'
    ],
    sources: [
      { title: 'AWS CloudFormation User Guide', url: 'https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/Welcome.html' },
      { title: 'Working with CloudFormation StackSets', url: 'https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/what-is-cfnstacksets.html' }
    ],
    searchTerms: ['cloudformation', 'iac', 'stacks', 'stacksets', 'change sets', 'templates', 'drift detection']
  },
  {
    id: 'cdk',
    name: 'AWS Cloud Development Kit',
    shortName: 'CDK',
    category: 'iac',
    difficulty: 'intermediate',
    importance: 'important',
    icon: 'IaC',
    tagline: 'Define cloud infrastructure using familiar programming languages like TypeScript, Python, and Go',
    mentalModel: 'Writing object-oriented software code (classes, loops, inheritance) that compiles and synthesizes down into massive, robust CloudFormation templates.',
    problemItSolves: 'Eliminates repetitive boilerplate and brittle JSON/YAML templates by allowing developers to use expressive programming languages, autocomplete, and reusable abstractions.',
    howItWorks: 'Developers write constructs in TypeScript, Python, Java, or C#. Running `cdk synth` synthesizes the code into CloudFormation templates; `cdk deploy` provisions the stack.',
    components: [
      { name: 'Constructs', description: 'Building blocks of CDK apps. Layer 1 (Cfn primitives), Layer 2 (AWS curated with sensible defaults), and Layer 3 (high-level patterns like `ApplicationLoadBalancedFargateService`).' },
      { name: 'CDK App & Stacks', description: 'The root container defining one or more deployable stacks and environments (account/region).' },
      { name: 'CDK CLI', description: 'Command-line tool used to initialize projects (`cdk init`), synthesize templates (`cdk synth`), diff changes (`cdk diff`), and deploy (`cdk deploy`).' },
      { name: 'cdk-nag', description: 'Static analysis tool validating CDK applications against enterprise security rules and compliance standards at synth time.' }
    ],
    realWorldExample: 'Deploying a production VPC, Fargate cluster, ALB, and ACM certificate in 25 lines of TypeScript using Layer 3 constructs instead of 600 lines of raw YAML.',
    whenToUse: [
      'Engineering teams proficient in programming languages (TypeScript, Python) building AWS-native architectures',
      'Creating reusable, shared organizational infrastructure component libraries',
      'Complex architectures requiring loops, conditionals, dynamic naming, and programmatic unit testing'
    ],
    whenNotToUse: [
      'Multi-cloud infrastructure spanning AWS, Azure, and Google Cloud equally (use Terraform)',
      'Teams that strictly mandate pure declarative configuration files without compiling code'
    ],
    practicalImplementation: {
      cli: 'cdk diff && cdk deploy --require-approval broadening'
    },
    security: 'Generates least-privilege IAM roles automatically for integrated constructs. Supports `cdk-nag` to enforce compliance and security standards during build.',
    costDrivers: 'CDK is free and open-source; you pay only for underlying provisioned AWS resources.',
    limitations: [
      'Build step required before deployment (synth to CloudFormation)',
      'Subject to underlying CloudFormation limits (500 resources per stack, template size limits)'
    ],
    commonMistakes: [
      'Modifying the generated `cdk.out` CloudFormation templates manually instead of editing source construct code',
      'Hardcoding accounts and regions inside constructs, preventing multi-environment reusability',
      'Forgetting to run `cdk bootstrap` in target accounts/regions before initial deployment'
    ],
    alternatives: [
      { service: 'cloudformation', reason: 'Low-level native YAML/JSON without needing a programming language runtime' },
      { service: 'terraform', reason: 'Multi-cloud HCL tool with direct API providers bypassing CloudFormation' },
      { service: 'pulumi', reason: 'Code-based IaC alternative using programming languages with its own engine rather than CloudFormation' }
    ],
    relatedServices: ['cloudformation', 'iam', 's3'],
    scenarioQuestion: {
      id: 'q-cdk-01',
      question: 'A software engineering team wants to manage AWS infrastructure using TypeScript. They want automated sensible security defaults, type-checking, autocomplete in IDEs, and pre-built high-level architectural patterns like ECS Fargate with an ALB in minimal lines of code. What tool should they select?',
      type: 'single',
      options: [
        'AWS Cloud Development Kit (AWS CDK)',
        'AWS CloudFormation writing raw YAML templates',
        'AWS Elastic Beanstalk using .ebextensions',
        'AWS Systems Manager State Manager'
      ],
      correctAnswers: [0],
      explanation: 'AWS CDK allows defining infrastructure using TypeScript with Layer 2 and Layer 3 constructs providing sensible security defaults, auto-wiring IAM roles, and IDE type safety.',
      whyOthersWrong: [
        'Raw CloudFormation YAML lacks TypeScript autocomplete, type safety, and requires hundreds of lines of boilerplate.',
        'Elastic Beanstalk .ebextensions are procedural YAML hooks for Beanstalk servers, not general-purpose programmable IaC.',
        'Systems Manager State Manager manages OS-level configuration drift, not cloud resource definition.'
      ],
      decisiveClue: 'Defining AWS infrastructure in TypeScript with high-level constructs and type safety specifies AWS CDK.',
      difficulty: 'intermediate',
      isOriginal: true
    },
    quickRevision: [
      'Synthesizes into standard AWS CloudFormation templates (`cdk synth`).',
      'Construct levels: L1 (raw Cfn), L2 (AWS curated defaults), L3 (architectural solutions/patterns).',
      'Requires bootstrapping target environments (`cdk bootstrap`).',
      'Enables standard software testing frameworks (Jest, PyTest) for infrastructure unit tests.'
    ],
    sources: [
      { title: 'AWS Cloud Development Kit Developer Guide', url: 'https://docs.aws.amazon.com/cdk/v2/guide/home.html' },
      { title: 'AWS CDK Construct Library', url: 'https://docs.aws.amazon.com/cdk/api/v2/' }
    ],
    searchTerms: ['cdk', 'aws cdk', 'constructs', 'infrastructure as code', 'typescript iac', 'cdk synth', 'cdk deploy']
  },
  {
    id: 'terraform',
    name: 'HashiCorp Terraform',
    shortName: 'Terraform',
    category: 'iac',
    difficulty: 'intermediate',
    importance: 'essential',
    icon: 'IaC',
    tagline: 'Industry-standard open-source Infrastructure as Code tool using declarative HCL syntax',
    mentalModel: 'A universal cloud constructor that uses HashiCorp Configuration Language (HCL) and state files to build and track infrastructure across AWS and hundreds of other providers.',
    problemItSolves: 'Provides a unified, provider-agnostic declarative workflow to provision, update, and manage resources across AWS, multi-cloud, and third-party SaaS platforms.',
    howItWorks: 'Uses the AWS Provider plugin to communicate directly with AWS APIs. Maintains a state file (`terraform.tfstate`) representing real-world infrastructure, performing diffs during `terraform plan` and applies during `terraform apply`.',
    components: [
      { name: 'HashiCorp Configuration Language (HCL)', description: 'Human-readable declarative language defining resources, variables, locals, data sources, and outputs.' },
      { name: 'State File (`terraform.tfstate`)', description: 'The source of truth mapping your declared configuration code to actual cloud resource IDs.' },
      { name: 'Remote Backend (S3 + DynamoDB)', description: 'Stores state files remotely in Amazon S3 with DynamoDB state locking to prevent concurrent deployment conflicts.' },
      { name: 'Modules', description: 'Reusable self-contained packages of Terraform configurations promoting architectural consistency.' }
    ],
    realWorldExample: 'A multi-cloud enterprise provisioning AWS VPCs, Datadog monitoring monitors, and GitHub repository branches in a single automated pipeline.',
    whenToUse: [
      'Multi-cloud or hybrid infrastructure management across AWS, Azure, GCP, and third-party SaaS',
      'Direct API execution bypassing CloudFormation resource limits and deployment speed bottlenecks',
      'Teams standardizing on the global industry standard HCL ecosystem and public Terraform Registry'
    ],
    whenNotToUse: [
      'Teams wanting zero state file management (CloudFormation manages state automatically in the cloud engine)',
      'Environments requiring native AWS Service Catalog or AWS Control Tower Account Factory integrations'
    ],
    practicalImplementation: {
      cli: 'terraform init && terraform plan -out=tfplan && terraform apply tfplan'
    },
    security: 'Protect state files: they may contain plaintext secrets. Store state in encrypted S3 buckets with restricted IAM policies and enforce state locking.',
    costDrivers: 'Open-source CLI is 100% free; commercial costs apply for Terraform Cloud / Enterprise if selected.',
    limitations: [
      'State management overhead: losing or corrupting the state file creates significant infrastructure drift issues',
      'External tool not owned or natively hosted by AWS (requires running execution runners or CI/CD)'
    ],
    commonMistakes: [
      'Storing Terraform state in local git repositories instead of a remote encrypted S3 backend with DynamoDB locking',
      'Running concurrent `terraform apply` commands without state locking, corrupting the state file',
      'Committing hardcoded secrets or API tokens inside `.tf` configuration files'
    ],
    alternatives: [
      { service: 'cloudformation', reason: 'Native AWS managed service with zero state file management overhead' },
      { service: 'cdk', reason: 'Native AWS programmatic IaC using real programming languages (TypeScript/Python)' },
      { service: 'opentofu', reason: 'Open-source community-driven fork of Terraform' }
    ],
    relatedServices: ['cloudformation', 'cdk', 's3', 'dynamodb'],
    scenarioQuestion: {
      id: 'q-tf-01',
      question: 'A DevOps team uses Terraform to manage AWS resources. When multiple engineers run deployments simultaneously, state file corruption occurs due to race conditions. What backend architecture resolves this issue?',
      type: 'single',
      options: [
        'Configure a remote S3 backend with an Amazon DynamoDB table for state locking.',
        'Store the state file inside an AWS CodeCommit Git repository.',
        'Use an Amazon EFS mount point shared across engineer laptops.',
        'Migrate from Terraform to AWS Systems Manager Run Command.'
      ],
      correctAnswers: [0],
      explanation: 'Terraform natively supports storing state in an encrypted Amazon S3 bucket paired with an Amazon DynamoDB table with a `LockID` primary key for distributed state locking.',
      whyOthersWrong: [
        'Git repositories cannot provide distributed runtime locking during active Terraform apply commands.',
        'Shared EFS does not provide Terraform native state locking mechanisms and introduces file system concurrency issues.',
        'Systems Manager Run Command is an ad-hoc command executor, not an Infrastructure as Code engine.'
      ],
      decisiveClue: 'Preventing concurrent Terraform state write race conditions requires an S3 backend with DynamoDB state locking.',
      difficulty: 'intermediate',
      isOriginal: true
    },
    quickRevision: [
      'External open-source tool; uses HashiCorp Configuration Language (HCL).',
      'Always configure remote backend: S3 (storage + encryption) + DynamoDB (state locking).',
      'Key commands: `init`, `plan`, `apply`, `destroy`.',
      'Bypasses CloudFormation, calling AWS APIs directly via the AWS Provider.'
    ],
    sources: [
      { title: 'Terraform AWS Provider Documentation', url: 'https://registry.terraform.io/providers/hashicorp/aws/latest/docs' },
      { title: 'Terraform S3 Backend Configuration', url: 'https://developer.hashicorp.com/terraform/language/settings/backends/s3' }
    ],
    searchTerms: ['terraform', 'hcl', 'state file', 'dynamodb lock', 'remote backend', 'iac', 'provider']
  },
  {
    id: 'aws-cli',
    name: 'AWS Command Line Interface',
    shortName: 'AWS CLI',
    category: 'tools',
    difficulty: 'beginner',
    importance: 'essential',
    icon: 'Tools',
    tagline: 'Unified tool to manage your AWS services from the command line and scripts',
    mentalModel: 'A universal terminal steering wheel for your entire AWS cloud, allowing you to invoke any AWS API directly from terminal shells or automated scripts.',
    problemItSolves: 'Eliminates repetitive manual clicks in the web management console, enabling automation, quick troubleshooting, and scriptable operations.',
    howItWorks: 'Translates terminal commands into signed HTTP REST API requests sent to AWS service endpoints using the AWS Signature Version 4 protocol.',
    components: [
      { name: 'CLI v2', description: 'Modern major version of the AWS CLI with built-in auto-prompting, SSO integration, and bundled installers.' },
      { name: 'Named Profiles', description: 'Configurations in `~/.aws/credentials` and `~/.aws/config` defining IAM credentials, default regions, and output formats.' },
      { name: 'JMESPath Queries (`--query`)', description: 'Client-side query language filtering JSON output directly within the CLI.' },
      { name: 'AWS SSO Integration', description: 'Direct authentication integration with IAM Identity Center via `aws sso login`.' }
    ],
    realWorldExample: 'Querying all stopped EC2 instances across a region and terminating them using a single shell one-liner: `aws ec2 describe-instances --query ...`',
    whenToUse: [
      'Interactive command-line administration, inspection, and ad-hoc troubleshooting',
      'Writing bash/zsh/PowerShell automation scripts for system administrators',
      'Executing commands inside CI/CD deployment pipelines (GitHub Actions, GitLab CI, CodeBuild)'
    ],
    whenNotToUse: [
      'Managing massive complex production infrastructure lifecycles (use IaC tools like Terraform or CDK)',
      'Complex application code integration in Python (use Boto3 SDK instead)'
    ],
    practicalImplementation: {
      cli: 'aws ec2 describe-instances --filters "Name=instance-state-name,Values=running" --query "Reservations[*].Instances[*].[InstanceId,PrivateIpAddress]" --output table'
    },
    security: 'Never store static long-term access keys on local machines when IAM Identity Center SSO or IAM roles can be used. Enforce IMDSv2.',
    costDrivers: 'The AWS CLI tool is 100% free to download and use; charges derive only from AWS services invoked.',
    limitations: [
      'Client-side filters (`--query`) download all results before filtering; use server-side filters (`--filter`) for large datasets to save bandwidth',
      'API rate-limiting (throttling) can occur when looping through large volumes of CLI requests'
    ],
    commonMistakes: [
      'Running client-side JMESPath queries instead of server-side `--filters`, downloading gigabytes of unneeded JSON',
      'Hardcoding AWS access keys in shell scripts rather than using IAM instance profiles or environment variables',
      'Using outdated AWS CLI v1 instead of AWS CLI v2'
    ],
    alternatives: [
      { service: 'boto3', reason: 'Python SDK with native exceptions, data structures, and programmatic control' },
      { service: 'cloudshell', reason: 'Browser-based pre-authenticated terminal shell with AWS CLI pre-installed' }
    ],
    relatedServices: ['iam', 'iam-identity-center', 'boto3'],
    scenarioQuestion: {
      id: 'q-cli-01',
      question: 'A DevOps engineer needs to retrieve only the Instance IDs and Private IP addresses of running EC2 instances using the AWS CLI, while minimizing network payload and filtering efficiently. What command combination achieves this?',
      type: 'single',
      options: [
        'Use server-side `--filters` for `instance-state-name=running` and client-side `--query` to project InstanceId and PrivateIpAddress.',
        'Use client-side `--query` only and parse the entire unfiltered JSON payload with jq.',
        'Run `aws ec2 get-instances` with raw grep commands.',
        'Use AWS CloudTrail Lake to query running instance logs.'
      ],
      correctAnswers: [0],
      explanation: 'Combining server-side `--filters` (reducing payload sent from AWS servers) with client-side `--query` (JMESPath extraction) is the AWS CLI best practice for performance and clarity.',
      whyOthersWrong: [
        'Client-side filtering alone requires downloading all stopped and running instances across the region, wasting bandwidth and time.',
        '`get-instances` is not a valid AWS CLI command (the command is `describe-instances`).',
        'CloudTrail Lake is an audit log query service, not a live resource state retrieval CLI command.'
      ],
      decisiveClue: 'Combining server-side `--filters` with client-side `--query` is the standard optimal AWS CLI design pattern.',
      difficulty: 'beginner',
      isOriginal: true
    },
    quickRevision: [
      'AWS CLI v2 includes native SSO support (`aws sso login`) and interactive auto-prompting.',
      'Server-side `--filters` reduce network payload; client-side `--query` uses JMESPath to extract fields.',
      'Outputs available: `json`, `yaml`, `text`, `table`.',
      'Configure named profiles in `~/.aws/config` and `~/.aws/credentials`.'
    ],
    sources: [
      { title: 'AWS CLI v2 User Guide', url: 'https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-welcome.html' },
      { title: 'Filtering AWS CLI Output', url: 'https://docs.aws.amazon.com/cli/latest/userguide/cli-usage-filter.html' }
    ],
    searchTerms: ['aws cli', 'cli v2', 'jmespath', 'named profiles', 'command line', 'aws sso login']
  },
  {
    id: 'boto3',
    name: 'AWS SDK for Python (Boto3)',
    shortName: 'Boto3',
    category: 'tools',
    difficulty: 'intermediate',
    importance: 'important',
    icon: 'Tools',
    tagline: 'Python software development kit to integrate Python apps with AWS services',
    mentalModel: 'The official Python library that gives your Python scripts and applications full programmatic control over all AWS cloud services.',
    problemItSolves: 'Enables developers to programmatically create, configure, query, and manage AWS resources directly inside Python code with native object models.',
    howItWorks: 'Provides two levels of service access: low-level Client interfaces (1:1 mapping to AWS HTTP service APIs returning raw dicts) and high-level Resource interfaces (object-oriented abstractions).',
    components: [
      { name: 'Client Interface', description: 'Low-level API client representing service endpoints; returns raw dictionary responses and supports paginators and waiters.' },
      { name: 'Resource Interface', description: 'Higher-level object-oriented abstraction representing resources (e.g. `s3.Bucket("my-bucket")`).' },
      { name: 'Paginators', description: 'Automates iterating through multi-page API responses without manual `NextToken` handling.' },
      { name: 'Waiters', description: 'Polls AWS services until a specific resource state is reached (e.g., `wait_until_running()`).' }
    ],
    realWorldExample: 'A Lambda function running Python code that downloads an image from S3, parses metadata, and writes an item into DynamoDB using Boto3.',
    whenToUse: [
      'Developing AWS Lambda functions using the Python runtime (Boto3 is pre-installed in Lambda)',
      'Building backend web applications (Django, FastAPI, Flask) integrating with AWS services',
      'Writing Python automation scripts for data engineering pipelines and cloud operations'
    ],
    whenNotToUse: [
      'Simple shell command line interactions where the AWS CLI is faster and requires no code',
      'Declarative multi-service infrastructure provisioning (use CDK or Terraform)'
    ],
    practicalImplementation: {
      python: 'import boto3\ns3 = boto3.client("s3")\nresponse = s3.list_buckets()\nfor bucket in response["Buckets"]:\n    print(bucket["Name"])'
    },
    security: 'Automatically resolves credentials using the standard AWS credential provider chain (Environment variables -> IAM role / IMDSv2). Never hardcode keys.',
    costDrivers: 'Boto3 library is free open-source software; costs derive from AWS API requests executed by the script.',
    limitations: [
      'Resource interface is not available for all AWS services (new services only receive Client interface support)',
      'API rate-limiting requires implementing exponential backoff (handled automatically in standard client config)'
    ],
    commonMistakes: [
      'Hardcoding AWS access keys inside `boto3.client("s3", aws_access_key_id="...")` instead of using IAM roles',
      'Writing manual loops with `NextToken` instead of using native Boto3 Paginators (`client.get_paginator(...)`)',
      'Writing busy-wait sleep loops instead of using Boto3 Waiters'
    ],
    alternatives: [
      { service: 'aws-cli', reason: 'For command-line shell scripts without writing Python code' },
      { service: 'cdk', reason: 'For declarative Infrastructure as Code rather than procedural operational logic' }
    ],
    relatedServices: ['lambda', 'ec2', 's3', 'dynamodb', 'iam'],
    scenarioQuestion: {
      id: 'q-boto3-01',
      question: 'A Python script using Boto3 needs to list all 50,000 objects in an Amazon S3 bucket. The `list_objects_v2` API returns a maximum of 1,000 objects per call. What is the most Pythonic and efficient Boto3 mechanism to retrieve all objects?',
      type: 'single',
      options: [
        'Use the Boto3 S3 Paginator (`s3.get_paginator("list_objects_v2")`) and iterate over `page_iterator`.',
        'Write a custom recursive function that manually checks for `ContinuationToken` in a while loop.',
        'Use a Boto3 Waiter configured for S3 object availability.',
        'Call `s3.list_all_objects()` with batch size set to 50000.'
      ],
      correctAnswers: [0],
      explanation: 'Boto3 Paginators abstract away pagination tokens and automatically make repeated API calls under the hood, yielding pages cleanly.',
      whyOthersWrong: [
        'While manual while-loops work, they are error-prone, verbose, and unpythonic compared to native Paginators.',
        'Waiters poll for state transitions (e.g. instance running), not for paginating data collections.',
        'There is no `s3.list_all_objects()` API; S3 hard-caps listings at 1,000 objects per call.'
      ],
      decisiveClue: 'Iterating cleanly through multi-page API responses in Boto3 specifies Boto3 Paginators.',
      difficulty: 'intermediate',
      isOriginal: true
    },
    quickRevision: [
      'Pre-installed out of the box in AWS Lambda Python runtimes.',
      'Client = Low-level, 1:1 API mapping, returns Python dicts; Resource = High-level object model.',
      'Use Paginators for multi-page lists (`get_paginator`).',
      'Use Waiters for state polling (`get_waiter("instance_running")`).'
    ],
    sources: [
      { title: 'Boto3 Documentation', url: 'https://boto3.amazonaws.com/v1/documentation/api/latest/index.html' },
      { title: 'Boto3 Pagination Guide', url: 'https://boto3.amazonaws.com/v1/documentation/api/latest/guide/paginators.html' }
    ],
    searchTerms: ['boto3', 'python sdk', 'paginators', 'waiters', 'aws python', 'botocore']
  },
  {
    id: 'codebuild',
    name: 'AWS CodeBuild',
    shortName: 'CodeBuild',
    category: 'devops',
    difficulty: 'intermediate',
    importance: 'important',
    icon: 'DevOps',
    tagline: 'Fully managed continuous integration service that compiles code, runs tests, and produces packages',
    mentalModel: 'A fleet of disposable, serverless build servers that spin up on demand in seconds, compile your code, run unit tests, build Docker images, and vanish.',
    problemItSolves: 'Eliminates the maintenance, patching, scaling, and cost of managing dedicated continuous integration (CI) build servers (like self-hosted Jenkins).',
    howItWorks: 'Spins up isolated Docker build containers defined by a build specification file (`buildspec.yml`), executes phases (install, pre_build, build, post_build), and pushes artifacts to S3 or ECR.',
    components: [
      { name: 'Build Project', description: 'Defines source code repository, compute environment, IAM service role, and buildspec location.' },
      { name: 'Buildspec (`buildspec.yml`)', description: 'YAML file with commands run across 4 distinct phases: install, pre_build, build, and post_build.' },
      { name: 'Build Environment', description: 'Standard AWS-managed container images (Ubuntu, Amazon Linux) or custom Docker images with chosen CPU/RAM.' },
      { name: 'Build Cache', description: 'Caches dependencies (e.g. node_modules, maven, pip) in Amazon S3 or local Docker cache to accelerate builds.' }
    ],
    realWorldExample: 'A CI pipeline building a Docker container image, running Jest unit tests, and pushing the verified image to Amazon ECR on every git commit.',
    whenToUse: [
      'Compiling source code and executing automated unit/integration tests in CI pipelines',
      'Building and scanning Docker container images before pushing to Amazon ECR',
      'Serverless, elastic build runner needs where you pay only for active build minutes'
    ],
    whenNotToUse: [
      'Full CI/CD release workflow pipeline orchestration (use AWS CodePipeline with CodeBuild as an action)',
      'Executing long-running background batch processing jobs over 8 hours (use AWS Batch)'
    ],
    practicalImplementation: {
      cli: 'aws codebuild start-build --project-name my-web-app-build'
    },
    security: 'Build containers run in single-tenant isolation. Builds can run inside private VPCs to access private databases or cache endpoints securely.',
    costDrivers: 'Compute build minutes based on instance size (General Purpose small, medium, large, GPU). Billed per second of active build execution.',
    limitations: [
      'Maximum single build execution timeout is 8 hours',
      'Cold start overhead of spinning up the container environment (typically 15-45 seconds)'
    ],
    commonMistakes: [
      'Not enabling dependency caching in `buildspec.yml`, re-downloading thousands of npm/pip packages on every single build',
      'Hardcoding credentials in `buildspec.yml` instead of pulling from Secrets Manager or Parameter Store using native syntax',
      'Running privileged commands (Docker build) without enabling the "Privileged" container flag in CodeBuild project settings'
    ],
    alternatives: [
      { service: 'github-actions', reason: 'Native CI/CD runners integrated directly inside GitHub repositories' },
      { service: 'jenkins', reason: 'Self-hosted open-source CI platform with extensive community plugin ecosystem' }
    ],
    relatedServices: ['codepipeline', 'codecommit', 'ecr', 's3'],
    scenarioQuestion: {
      id: 'q-cb-01',
      question: 'A DevOps engineer is configuring an AWS CodeBuild project to build a Docker container image and push it to Amazon ECR. When the build runs, the `docker build` command fails with an error: "Cannot connect to the Docker daemon". What is the cause of this failure?',
      type: 'single',
      options: [
        'The "Privileged" flag is not enabled in the CodeBuild project environment settings.',
        'CodeBuild does not support Docker builds natively.',
        'The buildspec.yml file must be named Dockerfile.',
        'The ECR repository does not exist in the same AWS region.'
      ],
      correctAnswers: [0],
      explanation: 'In AWS CodeBuild, building Docker images requires running Docker commands inside the build container (Docker-in-Docker), which requires enabling the Privileged flag in the project settings.',
      whyOthersWrong: [
        'CodeBuild fully supports Docker builds natively when privileged mode is turned on.',
        'The buildspec file must remain `buildspec.yml`; Dockerfile is referenced within the buildspec commands.',
        'ECR region mismatch would cause a push/authentication error, not a local Docker daemon connection error.'
      ],
      decisiveClue: 'Docker daemon connection errors during Docker container builds in CodeBuild require enabling the Privileged flag.',
      difficulty: 'intermediate',
      isOriginal: true
    },
    quickRevision: [
      'Serverless CI build service; pay per build minute.',
      'Phases in `buildspec.yml`: `install`, `pre_build`, `build`, `post_build`.',
      'Must check "Privileged" flag to build Docker images (Docker-in-Docker).',
      'Enable S3 or Local Cache to avoid redownloading dependencies.'
    ],
    sources: [
      { title: 'AWS CodeBuild User Guide', url: 'https://docs.aws.amazon.com/codebuild/latest/userguide/welcome.html' },
      { title: 'Buildspec Reference for CodeBuild', url: 'https://docs.aws.amazon.com/codebuild/latest/userguide/build-spec-ref.html' }
    ],
    searchTerms: ['codebuild', 'ci', 'continuous integration', 'buildspec', 'docker build', 'privileged mode']
  },
  {
    id: 'codepipeline',
    name: 'AWS CodePipeline',
    shortName: 'CodePipeline',
    category: 'devops',
    difficulty: 'intermediate',
    importance: 'important',
    icon: 'DevOps',
    tagline: 'Automate continuous delivery pipelines for fast and reliable application updates',
    mentalModel: 'An automated assembly line conveyor belt carrying your code changes through Source, Build, Test, Approval, and Production Deployment stages.',
    problemItSolves: 'Automates end-to-end software release processes, eliminating manual handoffs and ensuring consistent automated testing before production cutovers.',
    howItWorks: 'Orchestrates workflow stages (Source -> Build -> Test -> Deploy). Passes artifacts between stages via Amazon S3, triggering downstream actions on success.',
    components: [
      { name: 'Stages', description: 'Logical workflow phases (e.g. Source, Build, DeployToDev, ManualApproval, DeployToProd).' },
      { name: 'Actions', description: 'Individual tasks within a stage (e.g. CodeBuild build action, CodeDeploy deploy action, S3 source action).' },
      { name: 'Artifacts', description: 'Input and output zip files passed between stages stored in an S3 artifact bucket.' },
      { name: 'Manual Approval', description: 'Gates a stage until an authorized user reviews changes and clicks Approve (with optional SNS notifications).' }
    ],
    realWorldExample: 'A pipeline pulling commits from GitHub, triggering CodeBuild tests, deploying to staging ECS, pausing for QA manual approval, and deploying to prod ECS.',
    whenToUse: [
      'Orchestrating end-to-end CI/CD release pipelines across AWS services',
      'Enforcing multi-stage release gates with manual approval steps for production releases',
      'Coordinating cross-account or cross-region deployments'
    ],
    whenNotToUse: [
      'Executing individual compile/build script tasks (use CodeBuild inside CodePipeline)',
      'Teams standardizing entirely on third-party CI/CD ecosystems like GitHub Actions or GitLab CI'
    ],
    practicalImplementation: {
      cli: 'aws codepipeline start-pipeline-execution --name production-release-pipeline'
    },
    security: 'IAM Service Roles govern pipeline actions. Artifacts stored in S3 are encrypted with AWS KMS keys (Customer Managed Keys required for cross-account pipelines).',
    costDrivers: '$1.00 per active pipeline per month (a pipeline is active if it has at least one code change run during the month). Free tier includes 1 active pipeline/month.',
    limitations: [
      'Pipelines are strictly linear workflows with sequential or parallel actions within stages (does not support complex DAG branching loops)',
      'Cross-account deployments require configuring cross-account IAM roles and customer-managed KMS keys on the artifact bucket'
    ],
    commonMistakes: [
      'Using the default AWS-managed KMS key for S3 artifacts in cross-account pipelines (cross-account pipelines strictly require a Customer Managed Key)',
      'Failing to specify output artifacts in source or build stages, causing downstream deployment actions to fail',
      'Not configuring EventBridge triggers for instant pipeline execution on source repository commits'
    ],
    alternatives: [
      { service: 'github-actions', reason: 'Unified code hosting and CI/CD workflow platform' },
      { service: 'gitlab-ci', reason: 'Integrated enterprise DevOps platform' }
    ],
    relatedServices: ['codebuild', 'codedeploy', 's3', 'kms', 'sns'],
    scenarioQuestion: {
      id: 'q-cp-01',
      question: 'A company wants to set up a continuous delivery pipeline in Account A that deploys application updates to an ECS cluster in Account B. What configuration is strictly required for the pipeline artifact bucket in Account A to permit cross-account deployment?',
      type: 'single',
      options: [
        'Encrypt the S3 artifact bucket with a Customer Managed KMS Key (CMK) whose key policy grants access to Account B.',
        'Encrypt the S3 artifact bucket with the default aws/s3 AWS-managed key.',
        'Make the S3 artifact bucket publicly accessible using S3 Block Public Access exceptions.',
        'Use an Amazon EFS file system instead of an S3 bucket.'
      ],
      correctAnswers: [0],
      explanation: 'Default AWS-managed KMS keys cannot be shared across AWS accounts. Cross-account CodePipeline deployments strictly require a Customer Managed Key (CMK) whose key policy permits the target account.',
      whyOthersWrong: [
        'AWS-managed keys (aws/s3) have non-editable policies that forbid cross-account sharing.',
        'Making artifact buckets public is a catastrophic security violation and forbidden by AWS.',
        'CodePipeline only supports Amazon S3 as an artifact repository, not EFS.'
      ],
      decisiveClue: 'Cross-account CodePipeline artifact bucket access strictly requires a Customer Managed KMS Key (CMK).',
      difficulty: 'intermediate',
      isOriginal: true
    },
    quickRevision: [
      'Orchestrates stages: Source -> Build -> Test -> Deploy.',
      'Passes input and output zip artifacts via an Amazon S3 artifact bucket.',
      'Cross-account pipelines strictly require Customer Managed KMS keys (CMKs).',
      'Cost: $1.00 per active pipeline per month (1 free per month).'
    ],
    sources: [
      { title: 'AWS CodePipeline User Guide', url: 'https://docs.aws.amazon.com/codepipeline/latest/userguide/welcome.html' },
      { title: 'Cross-Account CodePipeline Walkthrough', url: 'https://docs.aws.amazon.com/codepipeline/latest/userguide/pipelines-create-cross-account.html' }
    ],
    searchTerms: ['codepipeline', 'cd', 'continuous delivery', 'pipeline', 'cross-account pipeline', 'manual approval', 'artifacts']
  },
  {
    id: 'codedeploy',
    name: 'AWS CodeDeploy',
    shortName: 'CodeDeploy',
    category: 'devops',
    difficulty: 'intermediate',
    importance: 'important',
    icon: 'DevOps',
    tagline: 'Automate code deployments to EC2, on-premises instances, Lambda, and Amazon ECS',
    mentalModel: 'A specialized deployment conductor that orchestrates rolling updates, blue/green cutovers, and traffic shifting while automatically rolling back if errors spike.',
    problemItSolves: 'Eliminates deployment downtime, human deployment errors, and slow manual rollbacks across server fleets, ECS containers, and Lambda functions.',
    howItWorks: 'Uses `appspec.yml` to execute deployment lifecycle hooks across target compute fleets. Supports In-place and Blue/Green deployment configurations with automated rollbacks.',
    components: [
      { name: 'Application & Deployment Group', description: 'Defines the targets (EC2 tags, Auto Scaling groups, ECS services, Lambda aliases) and deployment configuration.' },
      { name: 'AppSpec File (`appspec.yml`)', description: 'Defines files to copy and lifecycle hook scripts (e.g. `ApplicationStop`, `BeforeInstall`, `ValidateService`).' },
      { name: 'CodeDeploy Agent', description: 'Lightweight daemon installed on EC2/on-prem instances polling CodeDeploy for deployment jobs.' },
      { name: 'Deployment Configurations', description: 'Traffic shifting policies: Canary (e.g. Canary10Percent5Minutes), Linear, or AllAtOnce.' }
    ],
    realWorldExample: 'Deploying a new version of a Lambda microservice with 10% traffic shifted for 10 minutes (Canary10Percent10Minutes), rolling back instantly if 5XX errors trigger an alarm.',
    whenToUse: [
      'Automated deployments to EC2 fleets or Auto Scaling groups with rolling or blue/green updates',
      'Canary or linear traffic shifting deployments for AWS Lambda functions and Amazon ECS services',
      'Automated deployment rollbacks triggered by CloudWatch metric alarms'
    ],
    whenNotToUse: [
      'Compiling code or running unit tests (use AWS CodeBuild)',
      'Provisioning new cloud infrastructure resources (use Terraform or CloudFormation)'
    ],
    practicalImplementation: {
      cli: 'aws deploy create-deployment --application-name my-app --deployment-group-name my-asg-dg --s3-location bucket=my-deploy-bucket,key=app.zip,bundleType=zip'
    },
    security: 'Uses IAM service roles to interact with Auto Scaling and ALBs. EC2 instances require an IAM role with S3 read permissions to download bundles.',
    costDrivers: 'Deployments to EC2, Lambda, and ECS are 100% free of charge. Deployments to on-premises servers cost $0.02 per on-premises instance update.',
    limitations: [
      'EC2 and on-premises deployments require the CodeDeploy Agent installed and running',
      'AppSpec file structure differences: EC2 uses YAML with `hooks`, while Lambda/ECS use specialized JSON/YAML structures'
    ],
    commonMistakes: [
      'Forgetting to install or start the CodeDeploy Agent service on custom EC2 AMIs',
      'Failing to define a `ValidateService` hook in `appspec.yml`, missing early deployment failure detection',
      'Not configuring CloudWatch alarms for automated rollback in the Deployment Group'
    ],
    alternatives: [
      { service: 'elastic-beanstalk', reason: 'High-level PaaS that manages compute provisioning, load balancing, and deployments together' },
      { service: 'argocd', reason: 'GitOps deployment engine specialized for Kubernetes clusters' }
    ],
    relatedServices: ['codepipeline', 'codebuild', 'ec2', 'lambda', 'ecs', 'auto-scaling'],
    scenarioQuestion: {
      id: 'q-cd-01',
      question: 'A DevOps team needs to update an AWS Lambda function handling critical financial payments. The deployment must shift 10% of traffic to the new version, wait 10 minutes, and then shift the remaining 90% if no errors occur. If error alarms fire, it must instantly roll back. Which service and configuration achieve this?',
      type: 'single',
      options: [
        'AWS CodeDeploy using the `LambdaCanary10Percent10Minutes` deployment configuration with CloudWatch alarm rollback.',
        'AWS Elastic Beanstalk using Immutable deployments.',
        'Amazon Route 53 with weighted DNS records manually adjusted after 10 minutes.',
        'AWS Systems Manager Run Command updating the Lambda function configuration.'
      ],
      correctAnswers: [0],
      explanation: 'AWS CodeDeploy provides pre-defined Lambda deployment configurations like `LambdaCanary10Percent10Minutes` with automated CloudWatch alarm rollbacks.',
      whyOthersWrong: [
        'Elastic Beanstalk manages EC2 web apps, not standalone serverless Lambda function traffic shifting.',
        'Route 53 weighted DNS is subject to DNS TTL caching, lacks canary automation, and requires manual adjustment.',
        'Systems Manager Run Command manages EC2 instances, not Lambda function traffic shifting aliases.'
      ],
      decisiveClue: 'Canary traffic shifting (10% for 10 min) with automated rollback for AWS Lambda specifies AWS CodeDeploy.',
      difficulty: 'intermediate',
      isOriginal: true
    },
    quickRevision: [
      'EC2 deployments require the CodeDeploy Agent running on instances.',
      'Deployment file: `appspec.yml` (hooks: ApplicationStop, BeforeInstall, AfterInstall, ApplicationStart, ValidateService).',
      'Deployments to EC2, Lambda, and ECS are completely FREE (pay only for on-prem).',
      'Traffic shifting types for Lambda/ECS: Canary, Linear, AllAtOnce.'
    ],
    sources: [
      { title: 'AWS CodeDeploy User Guide', url: 'https://docs.aws.amazon.com/codedeploy/latest/userguide/welcome.html' },
      { title: 'AppSpec File Reference', url: 'https://docs.aws.amazon.com/codedeploy/latest/userguide/reference-appspec-file.html' }
    ],
    searchTerms: ['codedeploy', 'appspec', 'canary deployment', 'blue green', 'traffic shifting', 'automated rollback']
  },
  {
    id: 'github-actions',
    name: 'GitHub Actions for AWS',
    shortName: 'GitHub Actions',
    category: 'devops',
    difficulty: 'intermediate',
    importance: 'important',
    icon: 'DevOps',
    tagline: 'Automate build, test, and deployment workflows directly from GitHub to AWS using OIDC authentication',
    mentalModel: 'An automated CI/CD engine built directly into your GitHub repository that uses secure OpenID Connect (OIDC) badges to deploy into AWS without static secret keys.',
    problemItSolves: 'Eliminates the major security risk of generating and storing long-lived AWS IAM access keys inside third-party CI/CD repository secrets.',
    howItWorks: 'Workflows defined in `.github/workflows/*.yml` execute on hosted or self-hosted runners. Connects to AWS via OpenID Connect (OIDC) to assume an IAM role dynamically.',
    components: [
      { name: 'Workflow YAML', description: 'YAML files in `.github/workflows/` defining jobs, runners, steps, and triggers (push, pull_request).' },
      { name: 'OIDC Identity Provider', description: 'IAM OpenID Connect entity trusting GitHub\'s token endpoint (`token.actions.githubusercontent.com`).' },
      { name: 'IAM Role with Trust Policy', description: 'Role assumed by GitHub Actions restricted to specific repositories and branches via token conditions.' },
      { name: '`aws-actions/configure-aws-credentials`', description: 'Official GitHub Action obtaining temporary short-lived STS credentials from AWS.' }
    ],
    realWorldExample: 'A GitHub pull request automatically triggering unit tests, building a container, assuming an IAM role via OIDC, and deploying to AWS Fargate.',
    whenToUse: [
      'Modern CI/CD pipelines where source code is hosted in GitHub repositories',
      'Deploying to AWS securely using OIDC without managing static IAM access keys',
      'Running comprehensive linting, testing, and multi-environment deployments in one place'
    ],
    whenNotToUse: [
      'Enterprises strictly restricted to AWS-native developer tooling (use CodePipeline/CodeBuild)',
      'Environments with zero internet egress where external GitHub runners cannot access private endpoints'
    ],
    practicalImplementation: {
      cli: 'aws iam create-open-id-connect-provider --url https://token.actions.githubusercontent.com --client-id-list sts.amazonaws.com --thumbprint-list 6938fd4d98bab03faadb97b34396831e3780aea1'
    },
    security: 'Best practice: ALWAYS use OIDC federation instead of static IAM user access keys. Restrict the IAM role trust policy to specific repository names and branches.',
    costDrivers: 'External tool; GitHub Actions includes free minutes based on account tier. On AWS side, STS token generation is completely free.',
    limitations: [
      'External SaaS platform; third-party runner outages can block deployments',
      'GitHub hosted runners cannot access private AWS VPC resources without self-hosted runners or VPN/Direct Connect'
    ],
    commonMistakes: [
      'Storing long-term static AWS access keys (`AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY`) in GitHub Secrets instead of using modern OIDC',
      'Writing loose OIDC IAM trust policies allowing any GitHub repository to assume the deployment role',
      'Forgetting to grant `id-token: write` permission in the GitHub Actions workflow file'
    ],
    alternatives: [
      { service: 'codepipeline', reason: 'Native AWS managed continuous delivery service' },
      { service: 'gitlab-ci', reason: 'GitLab-native CI/CD alternative' }
    ],
    relatedServices: ['iam', 'ecr', 'ecs', 's3', 'codebuild'],
    scenarioQuestion: {
      id: 'q-gha-01',
      question: 'A DevOps security team mandates that continuous deployment workflows running on GitHub Actions must authenticate to AWS without using any long-lived IAM access keys or static secrets stored in repository settings. How should authentication be configured?',
      type: 'single',
      options: [
        'Configure an IAM OIDC Identity Provider for GitHub and use `aws-actions/configure-aws-credentials` to assume an IAM Role with a scoped trust policy.',
        'Generate an IAM user access key and rotate it daily using an AWS Lambda cron job.',
        'Place GitHub Actions runners inside the VPC and use an EC2 Instance Profile.',
        'Store AWS credentials in an S3 bucket and download them using a pre-signed URL.'
      ],
      correctAnswers: [0],
      explanation: 'Configuring OpenID Connect (OIDC) between GitHub Actions and AWS IAM enables runners to assume IAM roles and exchange short-lived tokens, eliminating static access keys.',
      whyOthersWrong: [
        'Daily rotated keys are still static credentials and introduce unnecessary maintenance overhead compared to native OIDC.',
        'GitHub-hosted runners run in GitHub infrastructure and cannot inherit EC2 instance profiles without complex self-hosted runners.',
        'Pre-signed S3 URLs still require a mechanism to authenticate the download and don\'t solve credential leakage.'
      ],
      decisiveClue: 'Authenticating GitHub Actions to AWS without static access keys specifies OpenID Connect (OIDC) federation.',
      difficulty: 'intermediate',
      isOriginal: true
    },
    quickRevision: [
      'External CI/CD tool hosted by GitHub.',
      'Always use OIDC federation; NEVER store static IAM access keys in GitHub Secrets.',
      'Trust policy condition: Restrict to `repo:octocat/my-repo:ref:refs/heads/main`.',
      'Workflow must include `permissions: id-token: write` to request OIDC tokens.'
    ],
    sources: [
      { title: 'Configuring OpenID Connect in AWS', url: 'https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/about-security-hardening-with-openid-connect' },
      { title: 'AWS OIDC with GitHub Actions', url: 'https://aws.amazon.com/blogs/security/use-iam-roles-to-connect-github-actions-to-actions-in-aws/' }
    ],
    searchTerms: ['github actions', 'oidc', 'openid connect', 'ci/cd', 'configure-aws-credentials', 'sts assume role']
  },
  {
    id: 'ansible',
    name: 'Red Hat Ansible',
    shortName: 'Ansible',
    category: 'iac',
    difficulty: 'intermediate',
    importance: 'supporting',
    icon: 'IaC',
    tagline: 'Agentless IT automation and configuration management engine using declarative YAML playbooks',
    mentalModel: 'An automated systems administrator that connects to your servers over SSH or WinRM, executes configuration playbooks, and ensures all servers match your desired state.',
    problemItSolves: 'Automates software installation, OS configuration, and continuous compliance across server fleets without requiring agent daemons installed on targets.',
    howItWorks: 'Uses declarative YAML Playbooks. The control machine connects to target hosts over SSH (Linux) or WinRM (Windows), pushes small Python modules, executes them, and removes them.',
    components: [
      { name: 'Playbooks', description: 'Declarative YAML files defining plays and tasks executed sequentially on target host groups.' },
      { name: 'Inventory & Dynamic Inventory', description: 'Lists of target servers; AWS Dynamic Inventory discovers EC2 instances automatically based on tags.' },
      { name: 'Modules', description: 'Discrete units of code (e.g. `ansible.builtin.package`, `amazon.aws.ec2_instance`) that do the actual work.' },
      { name: 'Roles', description: 'Reusable, structured file trees bundling tasks, handlers, variables, and templates.' }
    ],
    realWorldExample: 'Configuring 200 newly launched EC2 instances by installing Nginx, hardened security baselines, and application configuration files in parallel over SSH.',
    whenToUse: [
      'Operating system configuration management and software provisioning on EC2 and hybrid servers',
      'Agentless server automation across mixed cloud and on-premises environments',
      'Orchestrating complex multi-tier server upgrades with rolling task steps'
    ],
    whenNotToUse: [
      'Provisioning complex cloud infrastructure primitives like VPCs, subnets, and IAM (Terraform or CDK are far superior)',
      'Serverless application deployments (use SAM, Serverless Framework, or CDK)'
    ],
    practicalImplementation: {
      cli: 'ansible-playbook -i aws_ec2.yaml site.yml'
    },
    security: 'Connects over SSH keys or AWS SSM Session Manager plugin. Sensitive playbook variables are encrypted at rest using Ansible Vault.',
    costDrivers: 'Ansible Core open-source software is 100% free; Red Hat Ansible Automation Platform is an enterprise paid subscription.',
    limitations: [
      'Requires SSH/WinRM or SSM connectivity to target nodes',
      'Slower execution than compiled agent-based solutions for massive fleets (thousands of servers)'
    ],
    commonMistakes: [
      'Using static inventory files with hardcoded IP addresses instead of the AWS Dynamic Inventory plugin (`aws_ec2`)',
      'Using Ansible to provision foundational cloud infrastructure instead of using specialized IaC tools like Terraform',
      'Committing plaintext passwords inside playbooks instead of encrypting them with Ansible Vault'
    ],
    alternatives: [
      { service: 'systems-manager', reason: 'AWS-native agent-based configuration management via SSM State Manager and Run Command' },
      { service: 'puppet', reason: 'Agent-based declarative configuration management engine' }
    ],
    relatedServices: ['ec2', 'systems-manager', 'terraform'],
    scenarioQuestion: {
      id: 'q-ans-01',
      question: 'A systems engineering team manages 150 EC2 instances and needs to automate application configuration and OS security hardening without installing third-party management agent daemons on the instances. They want to dynamically discover instances based on environment tags. Which tool fits this requirement?',
      type: 'single',
      options: [
        'Red Hat Ansible using the AWS EC2 Dynamic Inventory plugin (`aws_ec2`).',
        'AWS CloudFormation using cfn-init helper scripts.',
        'AWS Systems Manager with third-party agents.',
        'Docker Compose with local shell scripts.'
      ],
      correctAnswers: [0],
      explanation: 'Ansible is an agentless configuration management tool that connects over standard SSH/WinRM and features an official AWS Dynamic Inventory plugin to discover instances automatically via tags.',
      whyOthersWrong: [
        'CloudFormation cfn-init runs during instance creation and does not provide ongoing ad-hoc multi-server orchestration.',
        'Systems Manager requires the SSM Agent installed and running on instances (not agentless).',
        'Docker Compose manages local multi-container applications, not multi-node EC2 operating system configuration.'
      ],
      decisiveClue: 'Agentless configuration management discovering instances dynamically via tags points directly to Ansible.',
      difficulty: 'intermediate',
      isOriginal: true
    },
    quickRevision: [
      'External open-source tool; completely AGENTLESS (uses SSH for Linux, WinRM for Windows).',
      'AWS Dynamic Inventory plugin (`aws_ec2.yaml`) discovers instances via EC2 tags automatically.',
      'Written in declarative YAML (Playbooks).',
      'Encrypt secrets in playbooks using Ansible Vault.'
    ],
    sources: [
      { title: 'Ansible Amazon AWS Collection Documentation', url: 'https://docs.ansible.com/ansible/latest/collections/amazon/aws/' },
      { title: 'Ansible EC2 Dynamic Inventory', url: 'https://docs.ansible.com/ansible/latest/collections/amazon/aws/aws_ec2_inventory.html' }
    ],
    searchTerms: ['ansible', 'playbook', 'agentless', 'dynamic inventory', 'configuration management', 'ansible vault']
  },
  {
    id: 'git',
    name: 'Git Source Control',
    shortName: 'Git',
    category: 'tools',
    difficulty: 'beginner',
    importance: 'essential',
    icon: 'Tools',
    tagline: 'Distributed version control system tracking changes in source code and infrastructure',
    mentalModel: 'A digital time-traveling ledger for your codebase, recording every commit, branching timelines for features, and merging collaboration safely.',
    problemItSolves: 'Prevents code loss, conflicts during team collaboration, and unverified changes by maintaining a complete historical audit trail of all source code.',
    howItWorks: 'Tracks changes as snapshots in a local directed acyclic graph (DAG) of commits. Synchronizes with remote repositories (GitHub, GitLab, AWS CodeCommit) via push and pull.',
    components: [
      { name: 'Repository', description: 'The `.git` data directory containing all commit snapshots, branches, tags, and history.' },
      { name: 'Branches & Merging', description: 'Parallel development lines merged via fast-forward, merge commits, or rebase.' },
      { name: 'Staging Area (Index)', description: 'Intermediate holding area where changes are prepared before committing.' },
      { name: 'GitOps Workflow', description: 'Using Git as the single source of truth for declaratively managed cloud infrastructure.' }
    ],
    realWorldExample: 'A team collaborating on Terraform code using feature branches, pull request code reviews, and automated CI tests before merging to `main`.',
    whenToUse: [
      'Every software engineering and cloud infrastructure project (mandatory foundational skill)',
      'GitOps infrastructure automation where commits automatically trigger deployments',
      'Collaborative peer review processes via pull requests and merge requests'
    ],
    whenNotToUse: [
      'Storing large binary assets, database backups, or video files (use S3 or Git LFS)',
      'Storing secrets, API keys, or private certificates (never commit credentials to Git)'
    ],
    practicalImplementation: {
      cli: 'git checkout -b feature/new-vpc && git add . && git commit -m "Add VPC module" && git push origin feature/new-vpc'
    },
    security: 'Never commit `.env` files, private keys, or AWS credentials. Use `.gitignore` and pre-commit hooks (like `git-secrets` or `trufflehog`) to block leaks.',
    costDrivers: 'Git is 100% free open-source software.',
    limitations: [
      'Struggles with large binary files (repo size explodes without Git Large File Storage / LFS)',
      'Merge conflicts require manual human resolution when concurrent edits touch the same lines'
    ],
    commonMistakes: [
      'Accidentally committing AWS access keys (`AKIA...`) to public or private Git repositories',
      'Failing to configure a proper `.gitignore` file, polluting repositories with `node_modules` or `.terraform` directories',
      'Force pushing (`git push --force`) to shared main branches, destroying colleague commit histories'
    ],
    alternatives: [
      { service: 'codecommit', reason: 'AWS-managed private Git repository service' },
      { service: 'github', reason: 'Popular web-based Git repository hosting and collaboration platform' }
    ],
    relatedServices: ['codebuild', 'codepipeline', 'github-actions', 'terraform'],
    scenarioQuestion: {
      id: 'q-git-01',
      question: 'A developer accidentally commits an AWS access key and secret access key into a local Git commit, but has NOT yet pushed the commit to the remote repository. What is the most immediate and secure action to take?',
      type: 'single',
      options: [
        'Immediately invalidate/delete the exposed IAM access key in the AWS IAM console, then amend or reset the Git commit locally.',
        'Simply run `git rm credentials.txt` and make a new commit before pushing.',
        'Push the commit and let AWS GuardDuty handle key invalidation automatically.',
        'Add the file name to `.gitignore` and push the commit.'
      ],
      correctAnswers: [0],
      explanation: 'Security best practice is to immediately revoke the credential in IAM because the commit history could accidentally be pushed. Then clean up the Git history using `git reset` or `git commit --amend`.',
      whyOthersWrong: [
        'Running `git rm` in a new commit leaves the secret permanently visible in the previous commit\'s Git history.',
        'Pushing compromised credentials to a remote repository exposes them to risk; GuardDuty detects threats but does not auto-delete keys by default.',
        '`.gitignore` only ignores untracked files; it does not remove files already committed in history.'
      ],
      decisiveClue: 'Immediate key invalidation in IAM followed by local commit rewrite is the required security response.',
      difficulty: 'beginner',
      isOriginal: true
    },
    quickRevision: [
      'External open-source distributed version control system.',
      'Foundation of modern GitOps: Git is the single source of truth for infrastructure.',
      'NEVER commit AWS credentials or secrets to a Git repository.',
      'Use `.gitignore` to exclude build artifacts, dependencies, and local state files.'
    ],
    sources: [
      { title: 'Official Git Documentation', url: 'https://git-scm.com/doc' },
      { title: 'AWS Best Practices for Git Credentials', url: 'https://docs.aws.amazon.com/general/latest/gr/aws-access-keys-best-practices.html' }
    ],
    searchTerms: ['git', 'version control', 'source control', 'commit', 'branch', 'gitops', 'gitignore']
  },
  {
    id: 'aws-backup',
    name: 'AWS Backup',
    shortName: 'AWS Backup',
    category: 'reliability',
    difficulty: 'intermediate',
    importance: 'important',
    icon: 'Reliability',
    tagline: 'Centrally manage and automate data protection across AWS services and hybrid workloads',
    mentalModel: 'A central enterprise backup administrator that schedules, automates, and audits backups across EBS, RDS, S3, DynamoDB, and EFS into immutable compliance vaults.',
    problemItSolves: 'Replaces custom disparate snapshot scripts across individual services with centralized, automated, compliance-audited backup policies.',
    howItWorks: 'You define Backup Plans with backup schedules and lifecycle rules. Backups are stored in encrypted Backup Vaults and can be locked with AWS Backup Vault Lock.',
    components: [
      { name: 'Backup Plan', description: 'Policy defining backup frequency, backup window, lifecycle transitions (to cold storage), and retention periods.' },
      { name: 'Backup Vault', description: 'Encrypted logical container storing recovery points, secured by vault access policies.' },
      { name: 'Vault Lock', description: 'Enforces WORM (Write Once, Read Many) compliance locking, preventing deletion of backups even by root accounts.' },
      { name: 'Legal Hold', description: 'Prevents deletion of recovery points during active legal discovery investigations regardless of retention policies.' }
    ],
    realWorldExample: 'Enforcing a corporate-wide backup policy automatically creating daily backups of all RDS databases, S3 buckets, and EBS volumes tagged `Environment=Production`.',
    whenToUse: [
      'Centralized, automated multi-service data protection (RDS, EBS, EFS, DynamoDB, S3, EC2)',
      'Cross-account and cross-region automated backup replication for disaster recovery',
      'Regulatory compliance requiring immutable backups protected by AWS Backup Vault Lock'
    ],
    whenNotToUse: [
      'Continuous sub-second replication between live active databases (use Aurora Global Database or DMS)',
      'Ad-hoc manual one-time file copying (use AWS DataSync or S3 sync)'
    ],
    practicalImplementation: {
      cli: 'aws backup create-backup-vault --backup-vault-name ComplianceVault --encryption-key-arn arn:aws:kms:us-east-1:123456789012:key/1234'
    },
    security: 'Vault access policies restrict restore permissions. Vault Lock prevents deletion of backups by any user, defending against ransomware and rogue insiders.',
    costDrivers: 'Backup storage consumed per GB-month (Warm vs Cold storage tiers), restore data volume, and cross-region data transfer.',
    limitations: [
      'Transition to cold storage is only supported for specific services (e.g. EFS, DynamoDB, S3)',
      'Vault Lock in compliance mode has a cooling-off period after which it cannot be deleted or modified by anyone'
    ],
    commonMistakes: [
      'Writing custom Lambda snapshot scripts instead of using managed AWS Backup',
      'Not enabling Vault Lock, leaving backups vulnerable to deletion if root or admin credentials are compromised by ransomware',
      'Forgetting to tag resources, preventing tag-based backup plan assignment'
    ],
    alternatives: [
      { service: 'dlm', reason: 'Amazon Data Lifecycle Manager (limited strictly to EBS volumes and snapshots)' },
      { service: 's3', reason: 'Native S3 Lifecycle rules for simple object expiration within buckets' }
    ],
    relatedServices: ['ebs', 'rds', 'efs', 'dynamodb', 's3', 'kms'],
    scenarioQuestion: {
      id: 'q-bkup-01',
      question: 'A financial institution must implement a ransomware defense strategy ensuring that daily backups of EBS volumes and RDS databases cannot be deleted or altered by any user, including the AWS account root user, for a retention period of 365 days. Which solution satisfies this requirement?',
      type: 'single',
      options: [
        'AWS Backup with a Backup Plan configured with AWS Backup Vault Lock in Compliance mode.',
        'Amazon Data Lifecycle Manager (DLM) with an IAM policy denying ec2:DeleteSnapshot.',
        'S3 bucket with S3 Versioning and MFA Delete enabled.',
        'AWS Systems Manager Automation runbook taking weekly snapshots.'
      ],
      correctAnswers: [0],
      explanation: 'AWS Backup Vault Lock in Compliance mode enforces immutable WORM storage that strictly prevents deletion or alteration of recovery points by any user, including the root user.',
      whyOthersWrong: [
        'DLM only covers EBS volumes, not RDS, and standard IAM policies can be overridden by the root account.',
        'MFA Delete only protects S3 objects, not native EBS or RDS database snapshots.',
        'Systems Manager runbooks create standard snapshots that can be deleted by compromised administrative credentials.'
      ],
      decisiveClue: 'Immutable backups that cannot be deleted even by root across EBS and RDS specifies AWS Backup Vault Lock in Compliance mode.',
      difficulty: 'intermediate',
      isOriginal: true
    },
    quickRevision: [
      'Centralized backup management for 15+ AWS services (RDS, EBS, EFS, DynamoDB, S3).',
      'Vault Lock (Compliance Mode) prevents deletion even by the ROOT account (Ransomware defense).',
      'Tag-based resource assignment automates backup enrollment.',
      'Supports automated cross-account and cross-region backup copy.'
    ],
    sources: [
      { title: 'AWS Backup Developer Guide', url: 'https://docs.aws.amazon.com/aws-backup/latest/devguide/whatisbackup.html' },
      { title: 'AWS Backup Vault Lock', url: 'https://docs.aws.amazon.com/aws-backup/latest/devguide/vault-lock.html' }
    ],
    searchTerms: ['aws backup', 'backup vault', 'vault lock', 'ransomware protection', 'backup plan', 'disaster recovery']
  }
];
