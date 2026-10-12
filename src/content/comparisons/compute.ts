import { Comparison } from '../../types';

export const computeComparisons: Comparison[] = [
  {
    id: 'ec2-vs-lambda',
    title: 'EC2 vs Lambda',
    category: 'Compute',
    serviceA: 'Amazon EC2',
    serviceB: 'AWS Lambda',
    problem: 'Selecting the appropriate compute model for application workloads balancing operational overhead, execution duration, and resource utilization patterns.',
    decisiveDifferences: [
      'Execution duration: EC2 supports continuously running processes indefinitely, whereas Lambda enforces a maximum execution timeout of 15 minutes (900 seconds) per invocation.',
      'Pricing model: EC2 bills for provisioned instance capacity per second/hour regardless of CPU utilization, while Lambda charges strictly for invocations and compute duration in milliseconds.',
      'Management model: EC2 requires OS patching, AMI maintenance, and scaling configurations; Lambda is fully serverless with AWS managing OS, runtime, and infrastructure scaling.',
      'Statefulness: EC2 instances can maintain in-memory state and persistent local disk attachments (EBS), whereas Lambda functions are stateless and spin up ephemeral runtime sandboxes.'
    ],
    whenToChooseA: [
      'Workloads require persistent long-running background daemons, websockets, or processes running beyond 15 minutes.',
      'Applications need legacy software requiring specific OS kernels, GPU drivers, or custom hypervisor-level tweaks.',
      'Predictable, high-throughput sustained traffic where provisioned reserved/savings plan EC2 instances yield lower per-request unit costs.'
    ],
    whenToChooseB: [
      'Spiky, unpredictable, or event-driven workloads such as S3 object upload triggers, API Gateway backends, or queue consumers.',
      'Microservices where zero management overhead and rapid scale-to-zero capability are prioritized.',
      'Short-lived tasks, automation scripts, and scheduled Cron triggers (EventBridge rules).'
    ],
    workTogether: 'An architecture can run high-volume, low-latency stateful web traffic on an EC2 Auto Scaling group while offloading asynchronous batch jobs, image resizing, and audit logging to AWS Lambda triggers via Amazon SQS or S3.',
    tradeoffs: [
      {
        dimension: 'Operational Overhead',
        optionA: 'High: OS patching, security hardening, scaling policies, and instance health checks managed by user.',
        optionB: 'Minimal: AWS manages the underlying compute fleet, OS, runtime execution environment, and patching.'
      },
      {
        dimension: 'Scaling Latency',
        optionA: 'Minutes: Auto Scaling must launch instances, boot OS, and initialize user data scripts.',
        optionB: 'Milliseconds to Seconds: Lambda scales concurrency automatically within seconds, subject to cold starts.'
      },
      {
        dimension: 'Maximum Execution Limit',
        optionA: 'Indefinite: Instances can run continuously 24/7 without interruption.',
        optionB: 'Hard limit of 15 minutes (900 seconds) per function invocation.'
      },
      {
        dimension: 'Cost at Zero Traffic',
        optionA: 'Non-zero: Incur hourly costs for running instances and attached storage unless stopped.',
        optionB: 'Zero: No charges incurred when there are no incoming invocations.'
      }
    ],
    scenario: 'An e-commerce platform runs its core storefront API on EC2 instances with predictable baseline load, but uses Lambda functions to process asynchronous events like sending transactional emails, generating PDF receipts, and updating inventory caches upon payment confirmation.',
    question: {
      id: 'quiz-ec2-vs-lambda-1',
      question: 'A data engineering team needs to run a video processing job that takes approximately 45 minutes to transcode large media files uploaded by users. Which AWS compute architecture is most appropriate?',
      type: 'single',
      options: [
        'AWS Lambda with maximum memory configuration',
        'Amazon EC2 instances orchestrated by an Auto Scaling Group or AWS Batch',
        'Amazon API Gateway triggering synchronous Lambda functions',
        'AWS Lambda integrated with Amazon S3 direct event notifications'
      ],
      correctAnswers: [1],
      explanation: 'AWS Lambda has a hard execution limit of 15 minutes (900 seconds). A transcoding task that runs for 45 minutes cannot complete within Lambda; it requires EC2 instances (either standalone, in an ASG, or via AWS Batch) which have no execution duration limits.',
      whyOthersWrong: [
        'AWS Lambda cannot run longer than 15 minutes regardless of allocated memory.',
        'API Gateway has an integration timeout limit of 29 seconds, making it unsuitable for a 45-minute task.',
        'Direct S3 event notifications invoking Lambda still face the 15-minute Lambda execution ceiling.'
      ],
      decisiveClue: 'Job takes approximately 45 minutes to transcode, exceeding the 15-minute Lambda limit.',
      difficulty: 'beginner',
      isOriginal: true,
      source: 'Original AWS certification-style practice question'
    },
    sources: [
      { title: 'AWS Lambda FAQs', url: 'https://aws.amazon.com/lambda/faqs/' },
      { title: 'Amazon EC2 User Guide', url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/concepts.html' }
    ]
  },
  {
    id: 'ec2-vs-ecs',
    title: 'EC2 vs ECS',
    category: 'Compute',
    serviceA: 'Amazon EC2 (Direct)',
    serviceB: 'Amazon ECS',
    problem: 'Choosing between traditional virtual machine deployment and containerized workload orchestration for enterprise applications.',
    decisiveDifferences: [
      'Workload isolation: EC2 isolates applications at the virtual machine hypervisor boundary (Nitro/Xen), while ECS runs containerized tasks isolated at the Linux namespace and cgroup level.',
      'Deployment density: EC2 typically hosts one or few monolithic services per VM with dedicated OS overhead; ECS packs multiple heterogeneous microservice containers efficiently onto underlying compute.',
      'Lifecycle and orchestration: Direct EC2 requires custom provisioning scripts, AMIs, or configuration managers; ECS provides declarative task definitions, rolling updates, health checks, and service discovery out of the box.'
    ],
    whenToChooseA: [
      'Monolithic legacy applications that cannot be containerized or rely on specialized kernel extensions.',
      'Workloads requiring direct bare-metal or hypervisor-level performance tuning and dedicated hardware peripherals.',
      'Applications where VM-level hardware isolation is mandated by compliance policies.'
    ],
    whenToChooseB: [
      'Microservices architectures packaged as OCI/Docker container images requiring automated deployment and rollbacks.',
      'Environments requiring high bin-packing density to minimize idle compute costs across multiple services.',
      'Teams transitioning from monoliths to containerized CI/CD pipelines without wanting Kubernetes operational complexity.'
    ],
    workTogether: 'Amazon ECS can use EC2 instances as its underlying container capacity provider (ECS EC2 launch type), allowing operators to maintain control over instance types, GPU acceleration, and OS AMIs while delegating container orchestration to ECS.',
    tradeoffs: [
      {
        dimension: 'Deployment Unit',
        optionA: 'Virtual Machine Image (AMI) or configuration management state.',
        optionB: 'Docker / OCI container image referenced in task definitions.'
      },
      {
        dimension: 'Resource Utilization',
        optionA: 'Lower density; each VM carries full operating system overhead.',
        optionB: 'Higher density; multiple containerized tasks share the host kernel.'
      },
      {
        dimension: 'Deployment Speed',
        optionA: 'Minutes to launch and boot an AMI-based instance.',
        optionB: 'Seconds to pull image layers and start task containers.'
      }
    ],
    scenario: 'A company modernizing a legacy retail application converts individual services into Docker containers and registers them as Amazon ECS services, allowing fast canary deployments and granular service auto-scaling instead of managing individual EC2 web instances.',
    question: {
      id: 'quiz-ec2-vs-ecs-1',
      question: 'A development team manages 15 lightweight microservices. Currently, each microservice runs on its own t3.small EC2 instance, resulting in average CPU utilization under 5% and high infrastructure costs. What is the most effective architectural improvement?',
      type: 'single',
      options: [
        'Upgrade all instances to c6g compute-optimized instances',
        'Migrate services to Docker containers and deploy them onto an Amazon ECS cluster',
        'Combine all microservices back into a single monolithic codebase on an EC2 instance',
        'Place an Application Load Balancer in front of each individual t3.small instance'
      ],
      correctAnswers: [1],
      explanation: 'Migrating microservices to Docker containers and running them on Amazon ECS allows multiple services to share compute resources (bin-packing), dramatically increasing density and reducing overall EC2 instance costs.',
      whyOthersWrong: [
        'Upgrading to c6g instances would increase costs without solving low utilization.',
        'Regressing to a monolithic codebase sacrifices decoupled deployment velocity and microservice architectural benefits.',
        'Adding ALBs in front of each low-utilization instance adds additional load balancer fees without improving compute density.'
      ],
      decisiveClue: '15 microservices running on dedicated EC2 instances with under 5% CPU utilization needing better resource efficiency.',
      difficulty: 'intermediate',
      isOriginal: true,
      source: 'Original AWS certification-style practice question'
    },
    sources: [
      { title: 'Amazon ECS Overview', url: 'https://docs.aws.amazon.com/AmazonECS/latest/developerguide/Welcome.html' },
      { title: 'Amazon EC2 Documentation', url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/' }
    ]
  },
  {
    id: 'ecs-vs-eks',
    title: 'ECS vs EKS',
    category: 'Compute',
    serviceA: 'Amazon ECS',
    serviceB: 'Amazon EKS',
    problem: 'Deciding between AWS-native container orchestration and upstream Kubernetes-compatible orchestration for containerized workloads.',
    decisiveDifferences: [
      'Ecosystem & Portability: ECS uses proprietary AWS task definitions and tight AWS API integrations; EKS runs upstream Kubernetes, enabling portable Helm charts, CRDs, and multi-cloud compatibility.',
      'Operational Complexity: ECS has no control plane to configure, patch, or maintain; EKS requires managing Kubernetes version upgrades, etcd dependencies, and K8s API deprecations.',
      'Control Plane Cost: ECS control plane is free (charges only for compute); EKS charges $0.10/hour per cluster for the managed Kubernetes control plane.',
      'Extensibility: EKS supports the vast Cloud Native Computing Foundation (CNCF) ecosystem (Operators, Istio, ArgoCD); ECS is streamlined for AWS service primitives (IAM, CloudWatch, ALB).'
    ],
    whenToChooseA: [
      'Teams seeking container orchestration with low operational overhead and simple AWS service integrations.',
      'Organizations committed solely to AWS without requirements for open-source Kubernetes tooling or on-premises parity.',
      'Small to mid-sized teams without dedicated Site Reliability Engineers (SREs) specialized in Kubernetes.'
    ],
    whenToChooseB: [
      'Teams already standardizing on Kubernetes tooling (Kubectl, Helm, Kustomize, Operators, Prometheus).',
      'Hybrid or multi-cloud strategies requiring identical deployment manifests across AWS, on-premises, and other clouds.',
      'Complex workloads requiring advanced Kubernetes primitives like DaemonSets, Custom Resource Definitions (CRDs), and service meshes.'
    ],
    workTogether: 'While organizations rarely run the same application on both, an enterprise may run simple internal APIs and batch workers on ECS for minimal overhead while running core platform services and complex distributed systems on EKS.',
    tradeoffs: [
      {
        dimension: 'Learning Curve',
        optionA: 'Low: Simple JSON/YAML task definitions and native AWS console integration.',
        optionB: 'High: Requires deep knowledge of Kubernetes architecture, networking (CNI), and RBAC.'
      },
      {
        dimension: 'Cluster Base Cost',
        optionA: '$0.00/hour for cluster control plane.',
        optionB: '$0.10/hour (~$72/month) per cluster for Kubernetes control plane.'
      },
      {
        dimension: 'Ecosystem & Third-Party Tooling',
        optionA: 'AWS-centric; limited open-source operator ecosystem.',
        optionB: 'Massive CNCF ecosystem with thousands of compatible tools and operators.'
      }
    ],
    scenario: 'A fintech startup chooses Amazon ECS for their initial MVP to ship containers quickly without needing a dedicated Kubernetes administrator. As the company scales and adopts GitOps with ArgoCD across hybrid data centers, their platform team provisions Amazon EKS.',
    question: {
      id: 'quiz-ecs-vs-eks-1',
      question: 'A company plans to migrate its containerized microservices to AWS. The operations team has extensive expertise with Helm charts, Istio service mesh, and Kubernetes CRDs, and requires portability to their private data center. Which service should they choose?',
      type: 'single',
      options: [
        'Amazon ECS with Fargate',
        'Amazon EKS',
        'AWS Elastic Beanstalk with Multi-container Docker',
        'AWS App Runner'
      ],
      correctAnswers: [1],
      explanation: 'Amazon EKS runs upstream Kubernetes, allowing direct reuse of Helm charts, Istio, CRDs, and standard Kubernetes manifests, ensuring portability between on-premises clusters and AWS.',
      whyOthersWrong: [
        'Amazon ECS does not support native Kubernetes CRDs, Helm charts, or Istio service mesh manifests.',
        'Elastic Beanstalk multi-container does not support Kubernetes manifests or Helm charts.',
        'AWS App Runner is a simplified PaaS for container deployment and does not expose Kubernetes APIs.'
      ],
      decisiveClue: 'Operations team has expertise with Helm, Istio, and Kubernetes CRDs and requires private data center portability.',
      difficulty: 'intermediate',
      isOriginal: true,
      source: 'Original AWS certification-style practice question'
    },
    sources: [
      { title: 'Amazon ECS Features', url: 'https://aws.amazon.com/ecs/features/' },
      { title: 'Amazon EKS User Guide', url: 'https://docs.aws.amazon.com/eks/latest/userguide/what-is-eks.html' }
    ]
  },
  {
    id: 'ecs-ec2-vs-fargate',
    title: 'ECS on EC2 vs ECS on Fargate',
    category: 'Compute',
    serviceA: 'ECS on EC2',
    serviceB: 'ECS on Fargate',
    problem: 'Determining the optimal compute launch type for Amazon ECS container workloads based on infrastructure control and administrative overhead.',
    decisiveDifferences: [
      'Infrastructure Management: ECS on EC2 requires provisioning, patching, scaling, and managing the host EC2 cluster instances; Fargate is serverless and provisions ephemeral compute per task.',
      'Pricing Model: EC2 launch type charges for the provisioned EC2 instances regardless of task packing; Fargate charges per vCPU and memory allocated per second for running tasks.',
      'Hardware & Configuration Control: EC2 allows GPU instances, custom AMIs, specific storage volume types, and host networking; Fargate abstracts all underlying OS and hardware configurations.',
      'Cold Start Latency: EC2 tasks launch almost instantaneously if capacity exists on the cluster instances; Fargate tasks have a brief provisioning delay while AWS allocates task infrastructure.'
    ],
    whenToChooseA: [
      'Workloads requiring specialized hardware such as GPUs, Inferentia, or custom network interfaces.',
      'Consistently high-density container environments where maximized EC2 bin-packing and Reserved Instances/Savings Plans offer lower unit costs than Fargate.',
      'Containers requiring privileged mode or custom kernel parameters on the host OS.'
    ],
    whenToChooseB: [
      'Teams wanting to eliminate VM patching, cluster capacity planning, and OS vulnerability maintenance.',
      'Bursty, spiky, or variable workloads where scaling tasks dynamically without managing underlying EC2 autoscaling pools is beneficial.',
      'Security-sensitive environments where strict hypervisor-level microVM isolation between tasks is required.'
    ],
    workTogether: 'An ECS cluster can define multiple capacity providers using both EC2 and Fargate simultaneously. Base steady-state traffic can run on heavily discounted EC2 Reserved Instances, while unpredictable traffic spikes spill over seamlessly to Fargate tasks.',
    tradeoffs: [
      {
        dimension: 'Underlying Host Management',
        optionA: 'Customer manages AMI updates, host patching, and cluster auto-scaling.',
        optionB: 'Fully managed by AWS; no EC2 instances visible or manageable.'
      },
      {
        dimension: 'Privileged Container Support',
        optionA: 'Supported (can run Docker in Docker, inspect host sockets).',
        optionB: 'Not supported (strict microVM isolation prevents privileged access).'
      },
      {
        dimension: 'Task Isolation',
        optionA: 'Shared host OS kernel among containers running on the same EC2 instance.',
        optionB: 'Dedicated microVM hypervisor isolation for every individual task.'
      }
    ],
    scenario: 'A media company runs machine learning video encoding on an ECS EC2 cluster using G5 GPU instances, while running their public REST API tasks on ECS Fargate to ensure zero server patching and automatic task-level scaling.',
    question: {
      id: 'quiz-ecs-ec2-vs-fargate-1',
      question: 'A security officer mandates that each running container task in a shared cluster must be isolated at the hypervisor level, and the engineering team wants to eliminate all server maintenance and AMI patching. Which launch type satisfies these requirements?',
      type: 'single',
      options: [
        'ECS with EC2 Launch Type using Amazon Linux 2023',
        'ECS with Fargate Launch Type',
        'ECS with EC2 Launch Type using Bottlerocket OS',
        'ECS with EC2 Launch Type using Spot Instances'
      ],
      correctAnswers: [1],
      explanation: 'AWS Fargate runs each task in its own dedicated single-tenant microVM boundary, providing hypervisor-level isolation, while eliminating all server maintenance, patching, and AMI management.',
      whyOthersWrong: [
        'ECS on EC2 shares the host operating system kernel across tasks on the same instance unless running only one task per instance, and still requires AMI maintenance.',
        'Bottlerocket OS reduces maintenance but still requires managing and updating EC2 cluster instances.',
        'EC2 Spot instances still require host management and share host kernels.'
      ],
      decisiveClue: 'Hypervisor-level isolation per task and complete elimination of server maintenance and AMI patching.',
      difficulty: 'intermediate',
      isOriginal: true,
      source: 'Original AWS certification-style practice question'
    },
    sources: [
      { title: 'AWS Fargate for Amazon ECS', url: 'https://docs.aws.amazon.com/AmazonECS/latest/developerguide/AWS_Fargate.html' },
      { title: 'Amazon ECS Launch Types', url: 'https://docs.aws.amazon.com/AmazonECS/latest/developerguide/launch_types.html' }
    ]
  },
  {
    id: 'lambda-vs-containers',
    title: 'Lambda vs Containers',
    category: 'Compute',
    serviceA: 'AWS Lambda',
    serviceB: 'Containers (ECS / EKS)',
    problem: 'Choosing between event-driven function-as-a-service (FaaS) and container-based architectures for application code deployment.',
    decisiveDifferences: [
      'Execution Runtime & Constraints: Lambda restricts execution time to 15 minutes, 10 GB memory, and 10 GB ephemeral disk; containers can run indefinitely with up to hundreds of gigabytes of RAM and multiple terabytes of disk.',
      'Scaling Mechanism: Lambda scales instantly per concurrent request; containers scale tasks/pods based on resource thresholds (CPU/memory utilization or custom metrics).',
      'Portability: Lambda code is often tied to AWS Lambda runtime event handler signatures; container images adhere to standard OCI formats and can run in any standard container runtime.',
      'Cold Starts: Lambda can introduce cold start latency during initial container initialization; long-running container tasks maintain warm persistent state with zero per-request startup latency.'
    ],
    whenToChooseA: [
      'Event-driven applications processing S3 uploads, DynamoDB streams, Kinesis records, or EventBridge buses.',
      'APIs with low, sporadic, or unpredictable traffic profiles where scale-to-zero yields significant cost savings.',
      'Small modular backend tasks and webhook handlers requiring minimal configuration.'
    ],
    whenToChooseB: [
      'Applications with long-running connections (WebSockets, gRPC streaming, database pooling daemons).',
      'Workloads exceeding 15 minutes execution duration or requiring persistent local storage caches.',
      'Complex monolithic or legacy codebases with large binaries and extensive system dependencies.'
    ],
    workTogether: 'Lambda can package container images (up to 10 GB) using Lambda Container Image support, unifying the container build pipeline while maintaining the serverless billing and execution model of Lambda.',
    tradeoffs: [
      {
        dimension: 'Maximum Runtime',
        optionA: '15 minutes per invocation.',
        optionB: 'Continuous / Indefinite.'
      },
      {
        dimension: 'Protocol Flexibility',
        optionA: 'Primarily HTTP(S) via API Gateway/ALB or AWS SDK/Event triggers.',
        optionB: 'Any TCP/UDP protocol, gRPC, raw sockets, WebSockets, or custom network ports.'
      },
      {
        dimension: 'Concurrency Scaling',
        optionA: 'Automatic scaling up to thousands of concurrent executions in seconds.',
        optionB: 'Horizontal Pod/Task Autoscaling based on metrics, typically taking 30-180 seconds.'
      }
    ],
    scenario: 'A SaaS platform handles synchronous REST API calls and persistent WebSocket client connections using ECS containers, while using Lambda to process background asynchronous events generated when users export heavy CSV reports.',
    question: {
      id: 'quiz-lambda-vs-containers-1',
      question: 'An engineering team needs to run a persistent WebSocket server that maintains continuous stateful bi-directional TCP connections with thousands of IoT devices 24/7. Which compute architecture is best suited?',
      type: 'single',
      options: [
        'A single AWS Lambda function configured with 10 GB of memory',
        'Amazon ECS or EKS running containerized WebSocket server tasks behind a Network Load Balancer',
        'AWS Lambda triggered directly by an Amazon SNS topic',
        'AWS Step Functions invoking Lambda functions on a continuous loop'
      ],
      correctAnswers: [1],
      explanation: 'Maintaining persistent 24/7 stateful bi-directional TCP connections requires a long-running process, which is naturally handled by containers on ECS or EKS. Lambda cannot run continuously beyond 15 minutes.',
      whyOthersWrong: [
        'Lambda functions timeout at 15 minutes and cannot maintain continuous 24/7 persistent server connections directly.',
        'SNS is a publish-subscribe push notification service and does not maintain bi-directional stateful TCP connections.',
        'Looping Step Functions with Lambda is anti-pattern, cost-inefficient, and breaks persistent TCP state between client and server.'
      ],
      decisiveClue: 'Persistent WebSocket server maintaining continuous stateful bi-directional TCP connections 24/7.',
      difficulty: 'intermediate',
      isOriginal: true,
      source: 'Original AWS certification-style practice question'
    },
    sources: [
      { title: 'AWS Lambda Developer Guide', url: 'https://docs.aws.amazon.com/lambda/latest/dg/welcome.html' },
      { title: 'Containers on AWS', url: 'https://aws.amazon.com/containers/' }
    ]
  },
  {
    id: 'beanstalk-vs-ec2',
    title: 'Elastic Beanstalk vs Manually Managed EC2',
    category: 'Compute',
    serviceA: 'AWS Elastic Beanstalk',
    serviceB: 'Manually Managed EC2',
    problem: 'Deciding between an automated Platform-as-a-Service (PaaS) orchestration tool and direct infrastructure management for web applications.',
    decisiveDifferences: [
      'Abstraction Level: Elastic Beanstalk automates provisioning, load balancing, auto-scaling, OS updates, and application deployment (PaaS); direct EC2 requires manually creating and wiring VPCs, ASGs, ALBs, and deployment pipelines.',
      'Customization Freedom: Direct EC2 gives total control over operating system configuration, networking topologies, and custom software stacks; Beanstalk standardizes around supported platform stacks (.NET, Node, Java, Python, Go, Docker).',
      'Cost: Elastic Beanstalk has no additional service charge (you pay only for the underlying EC2, ALB, and S3 resources it creates); direct EC2 has identical resource costs but requires higher engineering hours to maintain.'
    ],
    whenToChooseA: [
      'Development teams wanting to deploy standard web applications quickly without writing infrastructure code or managing ASG health checks.',
      'Prototyping, small business websites, and standard multi-tier web apps using standard runtimes.',
      'Teams wanting automated blue/green or rolling deployment strategies built-in with zero configuration overhead.'
    ],
    whenToChooseB: [
      'Complex architectures requiring custom network topologies, advanced multi-VPC routing, or specialized third-party monitoring agents.',
      'Enterprise teams leveraging standardized Infrastructure as Code (Terraform/OpenTofu/CloudFormation) across unified platform pipelines.',
      'Non-standard server configurations, distributed caching nodes, or specialized non-HTTP daemons.'
    ],
    workTogether: 'Developers can use Elastic Beanstalk to rapidly spin up staging and development environments for web apps, while the production environment is gradually codified into granular Terraform EC2/ECS infrastructure as complexity grows.',
    tradeoffs: [
      {
        dimension: 'Setup Velocity',
        optionA: 'Rapid: Deploy code ZIP or Dockerfile in minutes with automatic infrastructure wiring.',
        optionB: 'Slower: Requires configuring VPC, subnets, route tables, security groups, ALBs, and ASGs manually.'
      },
      {
        dimension: 'Control & Flexibility',
        optionA: 'Constrained by Beanstalk platform versions, hooks (.ebextensions), and opinionated architecture.',
        optionB: 'Unlimited: Complete control over OS, systemd daemons, networking, and custom tooling.'
      },
      {
        dimension: 'Deployment Automation',
        optionA: 'Built-in rolling, immutable, and blue/green deployments managed automatically.',
        optionB: 'Must be engineered manually using CodeDeploy, custom AMI baking pipelines, or ASG lifecycle hooks.'
      }
    ],
    scenario: 'A startup development team deploys their Node.js web portal using AWS Elastic Beanstalk so they can focus on shipping features. Elastic Beanstalk automatically manages their Auto Scaling Group, Application Load Balancer, and SSL certificate binding.',
    question: {
      id: 'quiz-beanstalk-vs-ec2-1',
      question: 'A software team with no dedicated DevOps engineers needs to deploy a Python Flask web application. They need rolling updates, automated capacity scaling, health monitoring, and an ALB, but want to avoid writing complex IaC scripts. What is the most suitable AWS service?',
      type: 'single',
      options: [
        'Direct EC2 instances configured manually with bash scripts in User Data',
        'AWS Elastic Beanstalk',
        'Amazon EKS with custom Helm charts',
        'AWS Direct Connect with bare-metal EC2'
      ],
      correctAnswers: [1],
      explanation: 'AWS Elastic Beanstalk is a PaaS that automatically provisions the EC2 instances, Application Load Balancers, Auto Scaling groups, and handles rolling deployments without requiring complex custom infrastructure code.',
      whyOthersWrong: [
        'Direct EC2 instances require manual infrastructure setup, ongoing maintenance, and custom scripting for scaling and rolling updates.',
        'Amazon EKS requires significant Kubernetes operational expertise and overhead.',
        'AWS Direct Connect is a dedicated network connection service, not an application deployment platform.'
      ],
      decisiveClue: 'No dedicated DevOps engineers, needs rolling updates, automated scaling, and wants to avoid writing complex IaC scripts.',
      difficulty: 'beginner',
      isOriginal: true,
      source: 'Original AWS certification-style practice question'
    },
    sources: [
      { title: 'AWS Elastic Beanstalk Developer Guide', url: 'https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/Welcome.html' },
      { title: 'Amazon EC2 Getting Started', url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EC2_GetStarted.html' }
    ]
  },
  {
    id: 'lb-vs-autoscaling',
    title: 'Load Balancing vs Auto Scaling',
    category: 'Compute',
    serviceA: 'Elastic Load Balancing (ELB)',
    serviceB: 'EC2 Auto Scaling',
    problem: 'Understanding the distinct roles of traffic distribution and horizontal capacity management in resilient web architectures.',
    decisiveDifferences: [
      'Core Function: Elastic Load Balancing distributes incoming network or application traffic evenly across multiple healthy targets; Auto Scaling dynamically adjusts the quantity of compute instances based on demand.',
      'Direction of Action: ELB works horizontally across existing targets to route requests; Auto Scaling works vertically or horizontally to expand or contract the compute target fleet.',
      'Failure Handling: ELB stops routing traffic to failed instances as soon as health checks fail; Auto Scaling actively terminates unhealthy instances and launches new replacement instances to restore desired capacity.'
    ],
    whenToChooseA: [
      'Distributing client traffic across multiple EC2 instances, ECS containers, or IP targets in multiple Availability Zones.',
      'Terminating SSL/TLS certificates and handling path-based or host-based routing.',
      'Performing health checks to prevent routing requests to degraded targets.'
    ],
    whenToChooseB: [
      'Maintaining high availability by automatically replacing unhealthy or terminated EC2 instances.',
      'Dynamically scaling capacity up or down based on CloudWatch metrics (CPU, request count, network I/O).',
      'Optimizing costs by mixing Spot, On-Demand, and Savings Plans across multiple instance types.'
    ],
    workTogether: 'ELB and Auto Scaling are tightly coupled architectural partners: ELB health check signals inform the Auto Scaling group to replace failing instances, while the Auto Scaling group automatically registers newly launched instances directly into the ELB Target Group.',
    tradeoffs: [
      {
        dimension: 'Primary Responsibility',
        optionA: 'Even request distribution and protocol termination (Layer 4/7).',
        optionB: 'Fleet size adjustment, lifecycle management, and target provisioning.'
      },
      {
        dimension: 'Response to Instance Crash',
        optionA: 'Ceases sending new requests to the crashed instance.',
        optionB: 'Terminates the dead instance and spins up a fresh replacement instance.'
      },
      {
        dimension: 'Pricing Metric',
        optionA: 'Billed per load balancer hour plus Load Balancer Capacity Units (LCUs).',
        optionB: 'No service charge; you pay only for the EC2 resources launched.'
      }
    ],
    scenario: 'During a Black Friday flash sale, an Application Load Balancer distributes millions of concurrent HTTP requests across 40 EC2 instances. When the sale ends and CPU utilization drops below 30%, the EC2 Auto Scaling group smoothly terminates 32 instances to save costs.',
    question: {
      id: 'quiz-lb-vs-autoscaling-1',
      question: 'An application is experiencing unexpected latency spikes during high traffic. The existing 2 EC2 instances are healthy but saturated at 100% CPU utilization. Traffic is currently evenly split between them. Which AWS component directly resolves the capacity constraint?',
      type: 'single',
      options: [
        'Elastic Load Balancing (ELB)',
        'EC2 Auto Scaling',
        'Amazon Route 53 latency routing',
        'AWS Shield Advanced'
      ],
      correctAnswers: [1],
      explanation: 'EC2 Auto Scaling is responsible for launching additional compute instances when existing instances become saturated. ELB only distributes traffic among existing targets; if all targets are saturated, Auto Scaling is needed to add more targets.',
      whyOthersWrong: [
        'ELB distributes traffic across existing instances but cannot create new instances to relieve CPU saturation.',
        'Route 53 latency routing routes DNS queries based on geographical latency, but does not scale instance capacity within a region.',
        'AWS Shield Advanced protects against DDoS attacks, not compute capacity scaling.'
      ],
      decisiveClue: 'Existing instances are saturated at 100% CPU and need additional compute capacity provisioned.',
      difficulty: 'beginner',
      isOriginal: true,
      source: 'Original AWS certification-style practice question'
    },
    sources: [
      { title: 'Elastic Load Balancing User Guide', url: 'https://docs.aws.amazon.com/elasticloadbalancing/latest/userguide/what-is-load-balancing.html' },
      { title: 'Amazon EC2 Auto Scaling User Guide', url: 'https://docs.aws.amazon.com/autoscaling/ec2/userguide/what-is-amazon-ec2-auto-scaling.html' }
    ]
  }
];
