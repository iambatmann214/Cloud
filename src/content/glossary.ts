import type { GlossaryEntry } from '../types';

export const allGlossaryEntries: GlossaryEntry[] = [
  // --- CLOUD CONCEPTS & BASICS ---
  {
    id: 'cloud-computing',
    term: 'Cloud Computing',
    definition: 'The on-demand delivery of IT resources and computing power over the internet with pay-as-you-go pricing.',
    category: 'cloud',
    relatedTerms: ['high-availability', 'scalability', 'elasticity', 'on-demand'],
    learnMoreLink: 'https://aws.amazon.com/what-is-cloud-computing/'
  },
  {
    id: 'region',
    term: 'Region',
    definition: 'A physical, isolated geographic location in the world where AWS clusters data centers into multiple Availability Zones.',
    category: 'cloud',
    relatedTerms: ['availability-zone', 'edge-location', 'resilience'],
    learnMoreLink: 'https://aws.amazon.com/about-aws/global-infrastructure/regions_az/'
  },
  {
    id: 'availability-zone',
    term: 'Availability Zone (AZ)',
    definition: 'One or more discrete, physically separated data centers within an AWS Region, engineered with redundant power, networking, and low-latency interconnects.',
    category: 'cloud',
    relatedTerms: ['region', 'high-availability', 'fault-tolerance', 'multi-az'],
    learnMoreLink: 'https://aws.amazon.com/about-aws/global-infrastructure/regions_az/'
  },
  {
    id: 'edge-location',
    term: 'Edge Location',
    definition: 'A global point-of-presence site used by services like Amazon CloudFront and Route 53 to cache and deliver content closer to end users.',
    category: 'cloud',
    relatedTerms: ['cloudfront', 'route-53', 'latency'],
    learnMoreLink: 'https://aws.amazon.com/cloudfront/features/'
  },
  {
    id: 'high-availability',
    term: 'High Availability (HA)',
    definition: 'A system design approach that ensures operational performance and uptime higher than normal standards by eliminating single points of failure.',
    category: 'cloud',
    relatedTerms: ['fault-tolerance', 'multi-az', 'resilience', 'auto-scaling'],
    learnMoreLink: 'https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/welcome.html'
  },
  {
    id: 'fault-tolerance',
    term: 'Fault Tolerance',
    definition: 'The property enabling a system to continue functioning without interruption or performance degradation even when one or more components fail.',
    category: 'cloud',
    relatedTerms: ['high-availability', 'resilience', 'multi-az'],
    learnMoreLink: 'https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/welcome.html'
  },
  {
    id: 'scalability',
    term: 'Scalability',
    definition: 'The capacity of a system to handle growing amounts of workload by adding hardware resources (vertical or horizontal scaling).',
    category: 'cloud',
    relatedTerms: ['elasticity', 'auto-scaling', 'load-balancer'],
    learnMoreLink: 'https://docs.aws.amazon.com/wellarchitected/latest/performance-efficiency-pillar/welcome.html'
  },
  {
    id: 'elasticity',
    term: 'Elasticity',
    definition: 'The ability of cloud infrastructure to automatically acquire and shed compute or storage resources in dynamic response to fluctuating workload demands.',
    category: 'cloud',
    relatedTerms: ['auto-scaling', 'scalability', 'on-demand'],
    learnMoreLink: 'https://aws.amazon.com/what-is-cloud-computing/'
  },
  {
    id: 'resilience',
    term: 'Resilience',
    definition: 'The ability of a workload to withstand or quickly recover from infrastructure failures, disruptions, and unexpected spikes in demand.',
    category: 'cloud',
    relatedTerms: ['fault-tolerance', 'rpo', 'rto', 'high-availability'],
    learnMoreLink: 'https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/welcome.html'
  },
  {
    id: 'rpo',
    term: 'Recovery Point Objective (RPO)',
    definition: 'The maximum acceptable period of data loss measured in time backward from a disruption event that an organization can tolerate.',
    category: 'cloud',
    relatedTerms: ['rto', 'backup', 'disaster-recovery'],
    learnMoreLink: 'https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/disaster-recovery-dr-objectives.html'
  },
  {
    id: 'rto',
    term: 'Recovery Time Objective (RTO)',
    definition: 'The maximum acceptable duration of time elapsed between a service outage and the complete restoration of normal system operations.',
    category: 'cloud',
    relatedTerms: ['rpo', 'backup', 'disaster-recovery'],
    learnMoreLink: 'https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/disaster-recovery-dr-objectives.html'
  },
  {
    id: 'shared-responsibility-model',
    term: 'Shared Responsibility Model',
    definition: 'A fundamental cloud framework defining that AWS is responsible for security OF the cloud, while the customer is responsible for security IN the cloud.',
    category: 'cloud',
    relatedTerms: ['iam', 'security-group', 'encryption', 'compliance'],
    learnMoreLink: 'https://aws.amazon.com/compliance/shared-responsibility-model/'
  },
  {
    id: 'serverless',
    term: 'Serverless',
    definition: 'An execution and operations model where cloud providers automatically manage server provisioning, patching, and scaling, billing strictly for consumed resources.',
    category: 'cloud',
    relatedTerms: ['lambda', 'dynamodb', 'api-gateway', 'fargate'],
    learnMoreLink: 'https://aws.amazon.com/serverless/'
  },
  {
    id: 'microservices',
    term: 'Microservices',
    definition: 'An architectural approach where complex applications are composed of small, independently deployable services communicating over lightweight APIs.',
    category: 'cloud',
    relatedTerms: ['api-gateway', 'ecs', 'docker', 'eventbridge'],
    learnMoreLink: 'https://aws.amazon.com/microservices/'
  },
  {
    id: 'well-architected-framework',
    term: 'AWS Well-Architected Framework',
    definition: 'A set of best-practice principles and architectural guidance structured into six pillars: Operational Excellence, Security, Reliability, Performance Efficiency, Cost Optimization, and Sustainability.',
    category: 'cloud',
    relatedTerms: ['trusted-advisor', 'resilience', 'high-availability'],
    learnMoreLink: 'https://aws.amazon.com/architecture/well-architected/'
  },

  // --- AWS CORE SERVICES & COMPUTE ---
  {
    id: 'ec2',
    term: 'Amazon EC2 (Elastic Compute Cloud)',
    definition: 'A web service providing secure, resizable compute capacity and virtual machines in the cloud for running application workloads.',
    category: 'aws',
    relatedTerms: ['ami', 'instance', 'ebs', 'auto-scaling'],
    learnMoreLink: 'https://aws.amazon.com/ec2/'
  },
  {
    id: 'instance',
    term: 'Instance',
    definition: 'A virtual server running in the AWS Cloud provisioned with specific CPU, memory, storage, and networking capacity based on instance family and size.',
    category: 'aws',
    relatedTerms: ['ec2', 'ami', 'hypervisor', 'ebs'],
    learnMoreLink: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/Instances.html'
  },
  {
    id: 'ami',
    term: 'Amazon Machine Image (AMI)',
    definition: 'A pre-configured virtual machine template containing the operating system, server software, and initial configuration required to launch EC2 instances.',
    category: 'aws',
    relatedTerms: ['ec2', 'instance', 'ebs'],
    learnMoreLink: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AMIs.html'
  },
  {
    id: 'auto-scaling',
    term: 'Auto Scaling',
    definition: 'A feature that dynamically adds or removes compute resources such as EC2 instances or ECS tasks in response to changing application traffic demands.',
    category: 'aws',
    relatedTerms: ['ec2', 'load-balancer', 'cloudwatch', 'elasticity'],
    learnMoreLink: 'https://aws.amazon.com/autoscaling/'
  },
  {
    id: 'lambda',
    term: 'AWS Lambda',
    definition: 'A serverless, event-driven compute service that runs application code in response to events and triggers without provisioning or managing servers.',
    category: 'aws',
    relatedTerms: ['serverless', 'api-gateway', 'eventbridge', 'step-functions'],
    learnMoreLink: 'https://aws.amazon.com/lambda/'
  },
  {
    id: 'step-functions',
    term: 'AWS Step Functions',
    definition: 'A visual serverless state machine orchestrator that coordinates distributed services, Lambda functions, and long-running workflows with built-in retry handling.',
    category: 'aws',
    relatedTerms: ['lambda', 'serverless', 'eventbridge'],
    learnMoreLink: 'https://aws.amazon.com/step-functions/'
  },
  {
    id: 'eventbridge',
    term: 'Amazon EventBridge',
    definition: 'A serverless event bus service that routes events between AWS services, custom applications, and SaaS partners using declarative rules.',
    category: 'aws',
    relatedTerms: ['lambda', 'sqs', 'sns', 'serverless'],
    learnMoreLink: 'https://aws.amazon.com/eventbridge/'
  },
  {
    id: 'arn',
    term: 'Amazon Resource Name (ARN)',
    definition: 'A standardized, unique string identifier used to unambiguously reference any AWS resource across regions, accounts, and services.',
    category: 'aws',
    relatedTerms: ['iam', 'policy', 'role'],
    learnMoreLink: 'https://docs.aws.amazon.com/general/latest/gr/aws-arns-and-namespaces.html'
  },
  {
    id: 'aws-cli',
    term: 'AWS CLI',
    definition: 'A unified open-source command-line tool that enables developers and engineers to manage and automate AWS cloud services using terminal shell commands.',
    category: 'aws',
    relatedTerms: ['boto3', 'iam', 'cloudformation'],
    learnMoreLink: 'https://aws.amazon.com/cli/'
  },
  {
    id: 'boto3',
    term: 'Boto3',
    definition: 'The official AWS Software Development Kit (SDK) for Python, allowing developers to create, configure, and manage AWS services programmatically.',
    category: 'aws',
    relatedTerms: ['aws-cli', 'lambda', 'api'],
    learnMoreLink: 'https://boto3.amazonaws.com/v1/documentation/api/latest/index.html'
  },
  {
    id: 'systems-manager',
    term: 'AWS Systems Manager (SSM)',
    definition: 'An operations management hub that provides visibility and control of cloud and on-premises infrastructure, offering tools like Session Manager and Run Command.',
    category: 'aws',
    relatedTerms: ['parameter-store', 'ec2', 'patch-management'],
    learnMoreLink: 'https://aws.amazon.com/systems-manager/'
  },
  {
    id: 'parameter-store',
    term: 'AWS Systems Manager Parameter Store',
    definition: 'A secure, scalable hierarchical storage capability for configuration data and secrets management with native AWS KMS encryption and IAM access control.',
    category: 'aws',
    relatedTerms: ['secrets-manager', 'kms', 'systems-manager'],
    learnMoreLink: 'https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html'
  },
  {
    id: 'secrets-manager',
    term: 'AWS Secrets Manager',
    definition: 'A managed security service designed to protect, store, and automatically rotate database credentials, API keys, and sensitive tokens throughout their lifecycle.',
    category: 'aws',
    relatedTerms: ['parameter-store', 'kms', 'rds'],
    learnMoreLink: 'https://aws.amazon.com/secrets-manager/'
  },
  {
    id: 'organizations',
    term: 'AWS Organizations',
    definition: 'An account management service that enables administrators to consolidate multiple AWS accounts, centrally govern policies with SCPs, and simplify billing.',
    category: 'aws',
    relatedTerms: ['control-tower', 'iam-identity-center', 'scp'],
    learnMoreLink: 'https://aws.amazon.com/organizations/'
  },
  {
    id: 'control-tower',
    term: 'AWS Control Tower',
    definition: 'A managed service that automates the setup of a secure, compliant multi-account AWS environment based on best-practice blueprints and automated guardrails.',
    category: 'aws',
    relatedTerms: ['organizations', 'aws-config', 'landing-zone'],
    learnMoreLink: 'https://aws.amazon.com/controltower/'
  },
  {
    id: 'aws-config',
    term: 'AWS Config',
    definition: 'A service that continuously monitors, records, and evaluates the configurations of AWS resources against desired compliance baselines.',
    category: 'aws',
    relatedTerms: ['cloudtrail', 'compliance', 'organizations'],
    learnMoreLink: 'https://aws.amazon.com/config/'
  },
  {
    id: 'trusted-advisor',
    term: 'AWS Trusted Advisor',
    definition: 'An online advisory tool providing real-time recommendations to help optimize AWS environments across cost, performance, security, fault tolerance, and quotas.',
    category: 'aws',
    relatedTerms: ['well-architected-framework', 'cloudwatch', 'cost-optimization'],
    learnMoreLink: 'https://aws.amazon.com/premiumsupport/technology/trusted-advisor/'
  },
  {
    id: 'tags',
    term: 'Tags',
    definition: 'Key-value metadata pairs assigned to AWS resources to facilitate operational organization, automated resource discovery, and granular cost allocation.',
    category: 'aws',
    relatedTerms: ['cost-allocation', 'iam', 'automation'],
    learnMoreLink: 'https://docs.aws.amazon.com/general/latest/gr/aws_tagging.html'
  },
  {
    id: 'on-demand',
    term: 'On-Demand Instances',
    definition: 'A cloud compute pricing model where instances are paid for per second or hour with no upfront commitments or long-term contracts.',
    category: 'aws',
    relatedTerms: ['spot-instance', 'reserved-instance', 'savings-plan'],
    learnMoreLink: 'https://aws.amazon.com/ec2/pricing/on-demand/'
  },
  {
    id: 'spot-instance',
    term: 'Spot Instance',
    definition: 'Spare EC2 compute capacity available at steep discounts of up to 90% compared to On-Demand, subject to reclamation by AWS with a 2-minute interruption warning.',
    category: 'aws',
    relatedTerms: ['ec2', 'on-demand', 'fault-tolerance'],
    learnMoreLink: 'https://aws.amazon.com/ec2/spot/'
  },
  {
    id: 'reserved-instance',
    term: 'Reserved Instance (RI)',
    definition: 'A billing commitment discount offering significant savings compared to On-Demand rates in exchange for a 1-year or 3-year usage commitment.',
    category: 'aws',
    relatedTerms: ['savings-plan', 'on-demand', 'cost-optimization'],
    learnMoreLink: 'https://aws.amazon.com/ec2/pricing/reserved-instances/'
  },
  {
    id: 'savings-plan',
    term: 'AWS Savings Plans',
    definition: 'A flexible pricing commitment model offering lower prices on AWS compute usage across EC2, Fargate, and Lambda in exchange for a committed $/hour spend.',
    category: 'aws',
    relatedTerms: ['reserved-instance', 'on-demand', 'cost-optimization'],
    learnMoreLink: 'https://aws.amazon.com/savingsplans/'
  },

  // --- STORAGE ---
  {
    id: 's3',
    term: 'Amazon S3 (Simple Storage Service)',
    definition: 'An object storage service offering industry-leading scalability, data availability, security, and 99.999999999% (11 9s) durability for storing any volume of data.',
    category: 'aws',
    relatedTerms: ['object-storage', 's3-glacier', 'cloudfront', 'backup'],
    learnMoreLink: 'https://aws.amazon.com/s3/'
  },
  {
    id: 's3-glacier',
    term: 'Amazon S3 Glacier',
    definition: 'A secure, durable, and extremely low-cost S3 storage class designed for long-term data archiving, historical compliance, and backup storage.',
    category: 'aws',
    relatedTerms: ['s3', 'backup', 'rpo'],
    learnMoreLink: 'https://aws.amazon.com/s3/storage-classes/glacier/'
  },
  {
    id: 'ebs',
    term: 'Amazon EBS (Elastic Block Store)',
    definition: 'A high-performance block-level storage volume designed for use with EC2 instances for workloads requiring persistent, low-latency disk storage.',
    category: 'aws',
    relatedTerms: ['block-storage', 'ec2', 'iops', 'snapshot'],
    learnMoreLink: 'https://aws.amazon.com/ebs/'
  },
  {
    id: 'efs',
    term: 'Amazon EFS (Elastic File System)',
    definition: 'A serverless, fully elastic network file system supporting NFSv4 that can be mounted concurrently across thousands of EC2 instances, containers, and Lambda functions.',
    category: 'aws',
    relatedTerms: ['file-storage', 'ec2', 'fargate'],
    learnMoreLink: 'https://aws.amazon.com/efs/'
  },
  {
    id: 'object-storage',
    term: 'Object Storage',
    definition: 'A data storage architecture that manages data as discrete objects containing data, customizable metadata, and a globally unique identifier.',
    category: 'aws',
    relatedTerms: ['s3', 'block-storage', 'file-storage'],
    learnMoreLink: 'https://aws.amazon.com/what-is/object-storage/'
  },
  {
    id: 'block-storage',
    term: 'Block Storage',
    definition: 'A storage architecture that splits data into raw, unformatted fixed-size blocks accessed directly by an operating system as virtual hard disks.',
    category: 'aws',
    relatedTerms: ['ebs', 'object-storage', 'iops'],
    learnMoreLink: 'https://aws.amazon.com/what-is/block-storage/'
  },
  {
    id: 'file-storage',
    term: 'File Storage',
    definition: 'A storage architecture that organizes data into a hierarchical directory tree of folders and files accessible over network protocols like NFS or SMB.',
    category: 'aws',
    relatedTerms: ['efs', 'block-storage', 'object-storage'],
    learnMoreLink: 'https://aws.amazon.com/what-is/file-storage/'
  },
  {
    id: 'backup',
    term: 'AWS Backup',
    definition: 'A cost-effective, policy-driven managed backup service that centralizes and automates data protection across AWS storage, compute, and database services.',
    category: 'aws',
    relatedTerms: ['s3', 'ebs', 'rds', 'rpo', 'rto'],
    learnMoreLink: 'https://aws.amazon.com/backup/'
  },
  {
    id: 'iops',
    term: 'IOPS (Input/Output Operations Per Second)',
    definition: 'A standard benchmark metric measuring the performance and maximum throughput frequency of read and write operations supported by storage drives.',
    category: 'aws',
    relatedTerms: ['ebs', 'throughput', 'block-storage'],
    learnMoreLink: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ebs-volume-types.html'
  },
  {
    id: 'throughput',
    term: 'Throughput',
    definition: 'The rate at which data is successfully transferred from one location to another, typically quantified in megabytes per second (MB/s).',
    category: 'aws',
    relatedTerms: ['iops', 'bandwidth', 'latency'],
    learnMoreLink: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ebs-volume-types.html'
  },

  // --- NETWORKING ---
  {
    id: 'vpc',
    term: 'Amazon VPC (Virtual Private Cloud)',
    definition: 'A logically isolated virtual network dedicated to an AWS account that provides complete control over IP addressing, subnets, route tables, and gateways.',
    category: 'networking',
    relatedTerms: ['subnet', 'internet-gateway', 'nat-gateway', 'cidr'],
    learnMoreLink: 'https://aws.amazon.com/vpc/'
  },
  {
    id: 'subnet',
    term: 'Subnet',
    definition: 'A segmented sub-range of IP addresses inside a VPC bound to a single specific Availability Zone, categorized as either public or private.',
    category: 'networking',
    relatedTerms: ['vpc', 'cidr', 'route-table', 'availability-zone'],
    learnMoreLink: 'https://docs.aws.amazon.com/vpc/latest/userguide/configure-subnets.html'
  },
  {
    id: 'cidr',
    term: 'CIDR (Classless Inter-Domain Routing)',
    definition: 'A method for allocating IP addresses and IP routing where a prefix and slash notation define the network portion and available host IP count.',
    category: 'networking',
    relatedTerms: ['vpc', 'subnet', 'ipv4'],
    learnMoreLink: 'https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Subnets.html'
  },
  {
    id: 'route-table',
    term: 'Route Table',
    definition: 'A set of routing rules used to determine where network traffic directed from subnets or gateways should be forwarded.',
    category: 'networking',
    relatedTerms: ['vpc', 'subnet', 'internet-gateway', 'nat-gateway'],
    learnMoreLink: 'https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Route_Tables.html'
  },
  {
    id: 'internet-gateway',
    term: 'Internet Gateway (IGW)',
    definition: 'A horizontally scaled, redundant VPC component that enables direct two-way IPv4/IPv6 communication between public subnet resources and the internet.',
    category: 'networking',
    relatedTerms: ['vpc', 'subnet', 'nat-gateway', 'elastic-ip'],
    learnMoreLink: 'https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Internet_Gateway.html'
  },
  {
    id: 'nat-gateway',
    term: 'NAT Gateway',
    definition: 'A managed Network Address Translation service that enables outbound internet connectivity for private subnet instances while blocking inbound connections.',
    category: 'networking',
    relatedTerms: ['vpc', 'internet-gateway', 'subnet', 'elastic-ip'],
    learnMoreLink: 'https://docs.aws.amazon.com/vpc/latest/userguide/vpc-nat-gateway.html'
  },
  {
    id: 'elastic-ip',
    term: 'Elastic IP (EIP)',
    definition: 'A static, public IPv4 address designed for dynamic cloud computing that can be rapidly remapped between instances or attached to NAT Gateways.',
    category: 'networking',
    relatedTerms: ['ec2', 'nat-gateway', 'ipv4'],
    learnMoreLink: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/elastic-ip-addresses-eip.html'
  },
  {
    id: 'load-balancer',
    term: 'Elastic Load Balancing (ALB/NLB)',
    definition: 'A service that automatically distributes incoming application traffic across multiple targets (EC2 instances, containers, IP addresses) in multiple AZs.',
    category: 'networking',
    relatedTerms: ['auto-scaling', 'high-availability', 'health-check'],
    learnMoreLink: 'https://aws.amazon.com/elasticloadbalancing/'
  },
  {
    id: 'route-53',
    term: 'Amazon Route 53',
    definition: 'A highly available and scalable cloud Domain Name System (DNS) web service offering domain registration, DNS routing, and health checking.',
    category: 'networking',
    relatedTerms: ['dns', 'latency', 'health-check', 'failover'],
    learnMoreLink: 'https://aws.amazon.com/route53/'
  },
  {
    id: 'cloudfront',
    term: 'Amazon CloudFront',
    definition: 'A fast, secure Content Delivery Network (CDN) service that caches and delivers data, videos, applications, and APIs to users globally with low latency.',
    category: 'networking',
    relatedTerms: ['edge-location', 's3', 'acm', 'waf'],
    learnMoreLink: 'https://aws.amazon.com/cloudfront/'
  },
  {
    id: 'vpc-peering',
    term: 'VPC Peering',
    definition: 'A direct networking connection between two VPCs that enables bidirectional routing using private IP addresses as if they were in the same network.',
    category: 'networking',
    relatedTerms: ['vpc', 'transit-gateway', 'privatelink'],
    learnMoreLink: 'https://docs.aws.amazon.com/vpc/latest/peering/what-is-vpc-peering.html'
  },
  {
    id: 'transit-gateway',
    term: 'AWS Transit Gateway',
    definition: 'A central network transit hub that interconnects thousands of VPCs and on-premises networks across accounts through a simplified star topology.',
    category: 'networking',
    relatedTerms: ['vpc', 'vpc-peering', 'direct-connect', 'vpn'],
    learnMoreLink: 'https://aws.amazon.com/transit-gateway/'
  },
  {
    id: 'privatelink',
    term: 'AWS PrivateLink',
    definition: 'A high-performance technology that enables private connectivity between VPCs and AWS services or SaaS applications without exposing traffic to the internet.',
    category: 'networking',
    relatedTerms: ['vpc-endpoint', 'vpc', 'security'],
    learnMoreLink: 'https://aws.amazon.com/privatelink/'
  },
  {
    id: 'vpc-endpoint',
    term: 'VPC Endpoint',
    definition: 'A private virtual device enabling instances in a private subnet to connect privately to supported AWS services without requiring an Internet or NAT Gateway.',
    category: 'networking',
    relatedTerms: ['privatelink', 'vpc', 's3'],
    learnMoreLink: 'https://docs.aws.amazon.com/vpc/latest/privatelink/vpc-endpoints.html'
  },
  {
    id: 'direct-connect',
    term: 'AWS Direct Connect',
    definition: 'A cloud service solution that establishes a dedicated, private, physical fiber connection from an on-premises data center directly into AWS.',
    category: 'networking',
    relatedTerms: ['vpn', 'transit-gateway', 'latency'],
    learnMoreLink: 'https://aws.amazon.com/directconnect/'
  },
  {
    id: 'vpn',
    term: 'AWS Site-to-Site VPN',
    definition: 'An encrypted IPsec tunnel connecting an on-premises network or branch office securely to an Amazon VPC or Transit Gateway over the public internet.',
    category: 'networking',
    relatedTerms: ['direct-connect', 'transit-gateway', 'ipsec'],
    learnMoreLink: 'https://docs.aws.amazon.com/vpn/latest/s2svpn/VPC_VPN.html'
  },
  {
    id: 'dns',
    term: 'DNS (Domain Name System)',
    definition: 'The fundamental internet directory service that translates human-friendly domain names (e.g. aws.amazon.com) into machine-readable IP addresses.',
    category: 'networking',
    relatedTerms: ['route-53', 'ipv4', 'latency'],
    learnMoreLink: 'https://aws.amazon.com/route53/what-is-dns/'
  },
  {
    id: 'http-https',
    term: 'HTTP / HTTPS',
    definition: 'Hypertext Transfer Protocol and its encrypted counterpart (HTTPS via TLS), serving as the foundational application protocol for web communication.',
    category: 'networking',
    relatedTerms: ['ssl-tls', 'acm', 'port', 'tcp'],
    learnMoreLink: 'https://aws.amazon.com/what-is/https/'
  },
  {
    id: 'tcp',
    term: 'TCP (Transmission Control Protocol)',
    definition: 'A connection-oriented, reliable transport layer network protocol that guarantees in-order, error-checked delivery of a stream of data packets.',
    category: 'networking',
    relatedTerms: ['udp', 'port', 'load-balancer'],
    learnMoreLink: 'https://en.wikipedia.org/wiki/Transmission_Control_Protocol'
  },
  {
    id: 'udp',
    term: 'UDP (User Datagram Protocol)',
    definition: 'A connectionless, lightweight transport protocol that prioritizes low-latency transmission over packet reliability and ordering guarantees.',
    category: 'networking',
    relatedTerms: ['tcp', 'port', 'latency'],
    learnMoreLink: 'https://en.wikipedia.org/wiki/User_Datagram_Protocol'
  },
  {
    id: 'port',
    term: 'Port',
    definition: 'A standardized 16-bit numerical identifier in network protocols (e.g., 80 for HTTP, 443 for HTTPS, 22 for SSH) designating specific application services.',
    category: 'networking',
    relatedTerms: ['tcp', 'udp', 'security-group', 'nacl'],
    learnMoreLink: 'https://en.wikipedia.org/wiki/Port_(computer_networking)'
  },
  {
    id: 'ipv4',
    term: 'IPv4',
    definition: 'The fourth version of the Internet Protocol utilizing 32-bit addresses written as four decimal octets (e.g. 192.168.1.1) to identify networked hosts.',
    category: 'networking',
    relatedTerms: ['cidr', 'subnet', 'vpc'],
    learnMoreLink: 'https://docs.aws.amazon.com/vpc/latest/userguide/vpc-ip-addressing.html'
  },
  {
    id: 'latency',
    term: 'Latency',
    definition: 'The time delay experienced in a system or network between the transmission of a request and the receipt of its corresponding response.',
    category: 'networking',
    relatedTerms: ['throughput', 'edge-location', 'cloudfront'],
    learnMoreLink: 'https://aws.amazon.com/what-is/latency/'
  },
  {
    id: 'gateway',
    term: 'Gateway',
    definition: 'A network node that connects two different networks or communication protocols together, serving as an entry and exit point for data packets.',
    category: 'networking',
    relatedTerms: ['internet-gateway', 'nat-gateway', 'api-gateway'],
    learnMoreLink: 'https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Internet_Gateway.html'
  },
  {
    id: 'health-check',
    term: 'Health Check',
    definition: 'A periodic automated probe sent to an application endpoint to verify responsiveness and operational status before routing traffic to it.',
    category: 'networking',
    relatedTerms: ['load-balancer', 'route-53', 'auto-scaling'],
    learnMoreLink: 'https://docs.aws.amazon.com/elasticloadbalancing/latest/application/target-group-health-checks.html'
  },

  // --- SECURITY & COMPLIANCE ---
  {
    id: 'iam',
    term: 'AWS IAM (Identity and Access Management)',
    definition: 'A foundational security service providing fine-grained access control, authentication, and authorization to AWS services and resources.',
    category: 'security',
    relatedTerms: ['role', 'policy', 'iam-identity-center', 'arn'],
    learnMoreLink: 'https://aws.amazon.com/iam/'
  },
  {
    id: 'role',
    term: 'IAM Role',
    definition: 'An IAM identity with specific permissions that is intended to be assumed dynamically by trusted entities, users, or AWS services via temporary credentials.',
    category: 'security',
    relatedTerms: ['iam', 'policy', 'arn'],
    learnMoreLink: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles.html'
  },
  {
    id: 'policy',
    term: 'IAM Policy',
    definition: 'A formal JSON document defining permissions by explicitly allowing or denying actions against specific resources under designated conditions.',
    category: 'security',
    relatedTerms: ['iam', 'role', 'arn', 'json'],
    learnMoreLink: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies.html'
  },
  {
    id: 'iam-identity-center',
    term: 'IAM Identity Center (AWS SSO)',
    definition: 'A centralized authentication service that connects corporate identity providers (e.g. Okta, Entra ID) to manage single sign-on access across all AWS accounts.',
    category: 'security',
    relatedTerms: ['iam', 'organizations', 'control-tower'],
    learnMoreLink: 'https://aws.amazon.com/iam/identity-center/'
  },
  {
    id: 'security-group',
    term: 'Security Group',
    definition: 'A virtual, stateful firewall that controls inbound and outbound network traffic at the elastic network interface (ENI) level for EC2 instances.',
    category: 'security',
    relatedTerms: ['nacl', 'firewall', 'vpc', 'port'],
    learnMoreLink: 'https://docs.aws.amazon.com/vpc/latest/userguide/vpc-security-groups.html'
  },
  {
    id: 'nacl',
    term: 'Network ACL (NACL)',
    definition: 'An optional, stateless layer of security operating at the subnet boundary that acts as a numbered rule firewall for controlling traffic entering and leaving subnets.',
    category: 'security',
    relatedTerms: ['security-group', 'firewall', 'subnet', 'vpc'],
    learnMoreLink: 'https://docs.aws.amazon.com/vpc/latest/userguide/vpc-network-acls.html'
  },
  {
    id: 'firewall',
    term: 'Firewall',
    definition: 'A security mechanism that monitors and filters incoming and outgoing network traffic based on predetermined organizational security rules.',
    category: 'security',
    relatedTerms: ['security-group', 'nacl', 'waf'],
    learnMoreLink: 'https://aws.amazon.com/network-firewall/'
  },
  {
    id: 'kms',
    term: 'AWS KMS (Key Management Service)',
    definition: 'A managed service that makes it easy to create, manage, and control cryptographic keys used to encrypt data across AWS services and custom apps.',
    category: 'security',
    relatedTerms: ['encryption', 's3', 'ebs', 'secrets-manager'],
    learnMoreLink: 'https://aws.amazon.com/kms/'
  },
  {
    id: 'encryption',
    term: 'Encryption (At Rest & In Transit)',
    definition: 'The cryptographic process of encoding plain text information into ciphertext, preventing unauthorized parties from accessing sensitive data in storage or transmission.',
    category: 'security',
    relatedTerms: ['kms', 'ssl-tls', 'acm'],
    learnMoreLink: 'https://docs.aws.amazon.com/wellarchitected/latest/security-pillar/protect-data-at-rest.html'
  },
  {
    id: 'ssl-tls',
    term: 'SSL / TLS',
    definition: 'Cryptographic transport protocols that provide authentication and end-to-end encryption for internet communications, safeguarding data against eavesdropping.',
    category: 'security',
    relatedTerms: ['acm', 'http-https', 'encryption'],
    learnMoreLink: 'https://aws.amazon.com/what-is/ssl-certificate/'
  },
  {
    id: 'acm',
    term: 'AWS Certificate Manager (ACM)',
    definition: 'A service that provisions, manages, and automatically renews public and private SSL/TLS certificates for use with AWS integrated services like CloudFront and ALB.',
    category: 'security',
    relatedTerms: ['ssl-tls', 'cloudfront', 'load-balancer'],
    learnMoreLink: 'https://aws.amazon.com/certificate-manager/'
  },
  {
    id: 'waf',
    term: 'AWS WAF (Web Application Firewall)',
    definition: 'A web application firewall monitoring HTTP/HTTPS requests forwarded to API Gateway, CloudFront, or ALB, protecting against SQL injection, XSS, and DDoS bots.',
    category: 'security',
    relatedTerms: ['ddos', 'cloudfront', 'api-gateway', 'load-balancer'],
    learnMoreLink: 'https://aws.amazon.com/waf/'
  },
  {
    id: 'shield',
    term: 'AWS Shield',
    definition: 'A managed Distributed Denial of Service (DDoS) protection service providing automatic inline mitigation against common layer 3 and 4 attacks.',
    category: 'security',
    relatedTerms: ['ddos', 'waf', 'cloudfront', 'route-53'],
    learnMoreLink: 'https://aws.amazon.com/shield/'
  },
  {
    id: 'ddos',
    term: 'DDoS (Distributed Denial of Service)',
    definition: 'A cyberattack technique attempting to disrupt the normal availability of a targeted server or network by overwhelming it with a flood of malicious internet traffic.',
    category: 'security',
    relatedTerms: ['shield', 'waf', 'cloudfront'],
    learnMoreLink: 'https://aws.amazon.com/shield/ddos-attack-protection/'
  },
  {
    id: 'guardduty',
    term: 'Amazon GuardDuty',
    definition: 'An intelligent, agentless threat detection service that continuously monitors AWS accounts, CloudTrail logs, VPC flow logs, and DNS queries using machine learning.',
    category: 'security',
    relatedTerms: ['security-hub', 'cloudtrail', 'macie'],
    learnMoreLink: 'https://aws.amazon.com/guardduty/'
  },
  {
    id: 'security-hub',
    term: 'AWS Security Hub',
    definition: 'A cloud security posture management (CSPM) service providing a comprehensive view of security alerts and automated compliance checks across accounts.',
    category: 'security',
    relatedTerms: ['guardduty', 'macie', 'aws-config'],
    learnMoreLink: 'https://aws.amazon.com/security-hub/'
  },
  {
    id: 'macie',
    term: 'Amazon Macie',
    definition: 'A fully managed data security and privacy service using machine learning to discover, classify, and protect sensitive data like PII and credentials in Amazon S3.',
    category: 'security',
    relatedTerms: ['s3', 'guardduty', 'security-hub'],
    learnMoreLink: 'https://aws.amazon.com/macie/'
  },
  {
    id: 'ssh',
    term: 'SSH (Secure Shell)',
    definition: 'A cryptographic network protocol operating on port 22 enabling secure, encrypted command-line operating system access and file transfers over insecure networks.',
    category: 'security',
    relatedTerms: ['ec2', 'systems-manager', 'port'],
    learnMoreLink: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AccessingInstancesLinux.html'
  },

  // --- DATABASES & CACHING ---
  {
    id: 'rds',
    term: 'Amazon RDS (Relational Database Service)',
    definition: 'A managed service making it easy to set up, operate, and scale relational databases (PostgreSQL, MySQL, MariaDB, Oracle, SQL Server) in the cloud.',
    category: 'databases',
    relatedTerms: ['multi-az', 'read-replica', 'aurora', 'crud'],
    learnMoreLink: 'https://aws.amazon.com/rds/'
  },
  {
    id: 'aurora',
    term: 'Amazon Aurora',
    definition: 'A MySQL and PostgreSQL-compatible relational database built for the cloud, offering up to 5x MySQL throughput with distributed, fault-tolerant storage.',
    category: 'databases',
    relatedTerms: ['rds', 'multi-az', 'read-replica'],
    learnMoreLink: 'https://aws.amazon.com/rds/aurora/'
  },
  {
    id: 'dynamodb',
    term: 'Amazon DynamoDB',
    definition: 'A fully managed, serverless NoSQL key-value and document database offering single-digit millisecond performance at any scale with built-in encryption.',
    category: 'databases',
    relatedTerms: ['serverless', 'nosql', 'crud', 'lambda'],
    learnMoreLink: 'https://aws.amazon.com/dynamodb/'
  },
  {
    id: 'elasticache',
    term: 'Amazon ElastiCache',
    definition: 'A fully managed in-memory data store and caching service compatible with Redis and Memcached, delivering sub-millisecond response times.',
    category: 'databases',
    relatedTerms: ['rds', 'latency', 'caching'],
    learnMoreLink: 'https://aws.amazon.com/elasticache/'
  },
  {
    id: 'redshift',
    term: 'Amazon Redshift',
    definition: 'A fast, petabyte-scale cloud data warehouse service that analyzes structured and semi-structured data across data lakes and operational databases using standard SQL.',
    category: 'databases',
    relatedTerms: ['s3', 'database', 'olap'],
    learnMoreLink: 'https://aws.amazon.com/redshift/'
  },
  {
    id: 'multi-az',
    term: 'Multi-AZ Deployment',
    definition: 'A database deployment model that synchronously replicates data to a standby instance in a different Availability Zone for automatic failover resilience.',
    category: 'databases',
    relatedTerms: ['rds', 'aurora', 'high-availability', 'fault-tolerance'],
    learnMoreLink: 'https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZ.html'
  },
  {
    id: 'read-replica',
    term: 'Read Replica',
    definition: 'An asynchronous copy of a primary database instance used to offload read-heavy query workloads and improve overall read scaling.',
    category: 'databases',
    relatedTerms: ['rds', 'aurora', 'scalability'],
    learnMoreLink: 'https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_ReadRepl.html'
  },
  {
    id: 'crud',
    term: 'CRUD (Create, Read, Update, Delete)',
    definition: 'The four fundamental operations performed on persistent database storage and REST APIs representing the full lifecycle of data entities.',
    category: 'databases',
    relatedTerms: ['api', 'dynamodb', 'rds'],
    learnMoreLink: 'https://en.wikipedia.org/wiki/Create,_read,_update_and_delete'
  },

  // --- CONTAINERS & SERVERLESS COMPUTE ---
  {
    id: 'container',
    term: 'Container',
    definition: 'A standardized, lightweight executable software package containing application code, runtime, system tools, and libraries isolated from other processes.',
    category: 'containers',
    relatedTerms: ['docker', 'dockerfile', 'ecs', 'eks', 'fargate'],
    learnMoreLink: 'https://aws.amazon.com/what-is/containers/'
  },
  {
    id: 'docker',
    term: 'Docker',
    definition: 'An open-source container engine platform that enables developers to build, package, ship, and run applications inside lightweight containers.',
    category: 'containers',
    relatedTerms: ['container', 'dockerfile', 'ecr', 'ecs'],
    learnMoreLink: 'https://www.docker.com/'
  },
  {
    id: 'dockerfile',
    term: 'Dockerfile',
    definition: 'A plain text instruction script containing sequential build commands used by Docker to assemble and compile a container image.',
    category: 'containers',
    relatedTerms: ['docker', 'container', 'ecr'],
    learnMoreLink: 'https://docs.docker.com/engine/reference/builder/'
  },
  {
    id: 'ecs',
    term: 'Amazon ECS (Elastic Container Service)',
    definition: 'A highly scalable, fast container orchestration service designed by AWS that simplifies running, stopping, and managing Docker containers on clusters.',
    category: 'containers',
    relatedTerms: ['fargate', 'ecr', 'eks', 'container'],
    learnMoreLink: 'https://aws.amazon.com/ecs/'
  },
  {
    id: 'fargate',
    term: 'AWS Fargate',
    definition: 'A serverless compute engine for containers that works with Amazon ECS and EKS, eliminating the need to provision, configure, or scale EC2 instances.',
    category: 'containers',
    relatedTerms: ['ecs', 'eks', 'container', 'serverless'],
    learnMoreLink: 'https://aws.amazon.com/fargate/'
  },
  {
    id: 'ecr',
    term: 'Amazon ECR (Elastic Container Registry)',
    definition: 'A fully managed, secure container image registry that makes it easy to store, manage, share, and deploy Docker container images globally.',
    category: 'containers',
    relatedTerms: ['docker', 'ecs', 'fargate', 'container-registry'],
    learnMoreLink: 'https://aws.amazon.com/ecr/'
  },
  {
    id: 'container-registry',
    term: 'Container Registry',
    definition: 'A centralized catalog and repository service for storing, versioning, scanning, and distributing container images across development and production environments.',
    category: 'containers',
    relatedTerms: ['ecr', 'docker', 'container'],
    learnMoreLink: 'https://aws.amazon.com/what-is/container-registry/'
  },
  {
    id: 'eks',
    term: 'Amazon EKS (Elastic Kubernetes Service)',
    definition: 'A managed Kubernetes service that simplifies running and operating upstream Kubernetes clusters on AWS without needing to maintain control plane nodes.',
    category: 'containers',
    relatedTerms: ['kubernetes', 'pod', 'fargate', 'ecs'],
    learnMoreLink: 'https://aws.amazon.com/eks/'
  },
  {
    id: 'kubernetes',
    term: 'Kubernetes (K8s)',
    definition: 'An open-source container orchestration platform for automating deployment, scaling, networking, and lifecycle management of containerized applications.',
    category: 'containers',
    relatedTerms: ['eks', 'pod', 'container'],
    learnMoreLink: 'https://kubernetes.io/'
  },
  {
    id: 'pod',
    term: 'Pod',
    definition: 'The smallest deployable computing unit in Kubernetes, representing a single instance of a running process consisting of one or more co-located containers.',
    category: 'containers',
    relatedTerms: ['kubernetes', 'eks', 'container'],
    learnMoreLink: 'https://kubernetes.io/docs/concepts/workloads/pods/'
  },

  // --- MESSAGING & INTEGRATION ---
  {
    id: 'sqs',
    term: 'Amazon SQS (Simple Queue Service)',
    definition: 'A fully managed message queuing service that decouples and coordinates microservices, distributed systems, and serverless applications asynchronously.',
    category: 'aws',
    relatedTerms: ['dead-letter-queue', 'sns', 'lambda', 'eventbridge'],
    learnMoreLink: 'https://aws.amazon.com/sqs/'
  },
  {
    id: 'sns',
    term: 'Amazon SNS (Simple Notification Service)',
    definition: 'A fully managed publish/subscribe messaging service enabling fan-out communications from publishers to subscribers such as SQS, Lambda, HTTP, and SMS.',
    category: 'aws',
    relatedTerms: ['sqs', 'eventbridge', 'cloudwatch'],
    learnMoreLink: 'https://aws.amazon.com/sns/'
  },
  {
    id: 'dead-letter-queue',
    term: 'Dead Letter Queue (DLQ)',
    definition: 'A specialized queue destination where messages that fail to be processed successfully after maximum retry attempts are routed for diagnostic debugging.',
    category: 'aws',
    relatedTerms: ['sqs', 'sns', 'lambda'],
    learnMoreLink: 'https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-dead-letter-queues.html'
  },
  {
    id: 'api-gateway',
    term: 'Amazon API Gateway',
    definition: 'A managed service that makes it easy for developers to create, publish, maintain, monitor, and secure RESTful and WebSocket APIs at any scale.',
    category: 'aws',
    relatedTerms: ['lambda', 'api', 'http-https', 'waf'],
    learnMoreLink: 'https://aws.amazon.com/api-gateway/'
  },
  {
    id: 'api',
    term: 'API (Application Programming Interface)',
    definition: 'A programmatic interface and communication protocol that defines the rules, data formats, and methods that different software components use to interact.',
    category: 'cloud',
    relatedTerms: ['api-gateway', 'crud', 'http-https', 'json'],
    learnMoreLink: 'https://aws.amazon.com/what-is/api/'
  },

  // --- DEVOPS & CI/CD ---
  {
    id: 'ci-cd',
    term: 'CI/CD (Continuous Integration / Continuous Delivery)',
    definition: 'A software engineering practice and automated pipeline that frequently integrates code changes, runs automated test suites, and deploys builds to production.',
    category: 'devops',
    relatedTerms: ['codepipeline', 'codebuild', 'iac'],
    learnMoreLink: 'https://aws.amazon.com/devops/continuous-integration/'
  },
  {
    id: 'codepipeline',
    term: 'AWS CodePipeline',
    definition: 'A fully managed continuous delivery workflow service that models, visualizes, and automates software release pipeline stages from code to production.',
    category: 'devops',
    relatedTerms: ['ci-cd', 'codebuild', 'cloudformation'],
    learnMoreLink: 'https://aws.amazon.com/codepipeline/'
  },
  {
    id: 'codebuild',
    term: 'AWS CodeBuild',
    definition: 'A fully managed serverless build service that compiles source code, runs automated tests, and produces deployable software packages inside isolated containers.',
    category: 'devops',
    relatedTerms: ['ci-cd', 'codepipeline', 'ecr'],
    learnMoreLink: 'https://aws.amazon.com/codebuild/'
  },
  {
    id: 'codedeploy',
    term: 'AWS CodeDeploy',
    definition: 'A fully managed deployment service that automates software deployments to compute services such as EC2, Fargate, Lambda, and on-premises servers.',
    category: 'devops',
    relatedTerms: ['ci-cd', 'codepipeline', 'ecs'],
    learnMoreLink: 'https://aws.amazon.com/codedeploy/'
  },

  // --- INFRASTRUCTURE AS CODE (IaC) ---
  {
    id: 'iac',
    term: 'Infrastructure as Code (IaC)',
    definition: 'The architectural practice of managing and provisioning computing infrastructure through version-controlled, declarative machine-readable configuration files.',
    category: 'iac',
    relatedTerms: ['cloudformation', 'terraform', 'cdk', 'ci-cd'],
    learnMoreLink: 'https://aws.amazon.com/what-is/iac/'
  },
  {
    id: 'cloudformation',
    term: 'AWS CloudFormation',
    definition: 'An AWS service that allows you to model, provision, and version cloud infrastructure resources using declarative JSON or YAML code templates.',
    category: 'iac',
    relatedTerms: ['iac', 'terraform', 'cdk', 'yaml', 'json'],
    learnMoreLink: 'https://aws.amazon.com/cloudformation/'
  },
  {
    id: 'terraform',
    term: 'HashiCorp Terraform',
    definition: 'An open-source, cloud-agnostic Infrastructure as Code tool that provisions cloud and on-premises infrastructure using HashiCorp Configuration Language (HCL).',
    category: 'iac',
    relatedTerms: ['iac', 'cloudformation', 'cdk'],
    learnMoreLink: 'https://www.terraform.io/'
  },
  {
    id: 'cdk',
    term: 'AWS CDK (Cloud Development Kit)',
    definition: 'An open-source software development framework to define cloud application resources using familiar programming languages like TypeScript, Python, or Go.',
    category: 'iac',
    relatedTerms: ['iac', 'cloudformation', 'terraform'],
    learnMoreLink: 'https://aws.amazon.com/cdk/'
  },
  {
    id: 'json',
    term: 'JSON (JavaScript Object Notation)',
    definition: 'A lightweight, language-independent, human-readable text data interchange format widely used in REST APIs, IAM policies, and cloud configurations.',
    category: 'iac',
    relatedTerms: ['yaml', 'api', 'policy'],
    learnMoreLink: 'https://www.json.org/'
  },
  {
    id: 'yaml',
    term: 'YAML (YAML Ain\'t Markup Language)',
    definition: 'A human-readable data serialization standard commonly used in configuration files, Kubernetes manifests, and AWS CloudFormation templates.',
    category: 'iac',
    relatedTerms: ['json', 'cloudformation', 'kubernetes'],
    learnMoreLink: 'https://yaml.org/'
  },

  // --- MONITORING & OBSERVABILITY ---
  {
    id: 'cloudwatch',
    term: 'Amazon CloudWatch',
    definition: 'A comprehensive monitoring and observability service that collects metrics, aggregates logs, sets metric alarms, and visualizes AWS cloud operations.',
    category: 'monitoring',
    relatedTerms: ['cloudtrail', 'metrics', 'sns', 'x-ray'],
    learnMoreLink: 'https://aws.amazon.com/cloudwatch/'
  },
  {
    id: 'cloudtrail',
    term: 'AWS CloudTrail',
    definition: 'A governance and compliance auditing service that records AWS API calls, user actions, and account changes across all services into tamper-proof logs.',
    category: 'monitoring',
    relatedTerms: ['cloudwatch', 'guardduty', 'compliance'],
    learnMoreLink: 'https://aws.amazon.com/cloudtrail/'
  },
  {
    id: 'x-ray',
    term: 'AWS X-Ray',
    definition: 'A distributed tracing service that helps developers analyze, debug, and profile distributed microservices and serverless architectures to identify bottlenecks.',
    category: 'monitoring',
    relatedTerms: ['opentelemetry', 'cloudwatch', 'lambda'],
    learnMoreLink: 'https://aws.amazon.com/xray/'
  },
  {
    id: 'opentelemetry',
    term: 'OpenTelemetry (ADOT)',
    definition: 'A vendor-neutral, open-source observability framework providing standardized APIs, libraries, and agents to collect and export traces, metrics, and logs.',
    category: 'monitoring',
    relatedTerms: ['x-ray', 'cloudwatch', 'metrics'],
    learnMoreLink: 'https://aws.amazon.com/otel/'
  },
  {
    id: 'metrics',
    term: 'Metrics',
    definition: 'Numerical time-series measurement data points (such as CPU utilization, disk reads, network throughput) representing system operational behavior.',
    category: 'monitoring',
    relatedTerms: ['cloudwatch', 'opentelemetry', 'health-check'],
    learnMoreLink: 'https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/working_with_metrics.html'
  },

  // --- LINUX & HARDWARE FUNDAMENTALS ---
  {
    id: 'cpu',
    term: 'CPU (Central Processing Unit)',
    definition: 'The primary electronic circuitry within a computer system that executes instructions comprising programs and performs fundamental arithmetic operations.',
    category: 'linux',
    relatedTerms: ['ram', 'instance', 'ec2'],
    learnMoreLink: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/instance-types.html'
  },
  {
    id: 'ram',
    term: 'RAM (Random Access Memory)',
    definition: 'High-speed volatile computer storage used by the operating system and active applications to store instructions and data requiring instantaneous access.',
    category: 'linux',
    relatedTerms: ['cpu', 'instance', 'ec2'],
    learnMoreLink: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/instance-types.html'
  },
  {
    id: 'hypervisor',
    term: 'Hypervisor',
    definition: 'A software, firmware, or hardware layer (such as the AWS Nitro System or Xen) that creates and runs virtual machines by abstracting host physical hardware.',
    category: 'linux',
    relatedTerms: ['ec2', 'instance', 'cpu'],
    learnMoreLink: 'https://aws.amazon.com/ec2/nitro/'
  },
  {
    id: 'nitro-system',
    term: 'AWS Nitro System',
    definition: 'The underlying hardware virtualization platform for modern EC2 instances that offloads virtualization functions to dedicated hardware for near bare-metal speed.',
    category: 'linux',
    relatedTerms: ['hypervisor', 'ec2', 'instance'],
    learnMoreLink: 'https://aws.amazon.com/ec2/nitro/'
  },
  {
    id: 'kernel',
    term: 'Operating System Kernel',
    definition: 'The core computer program at the heart of an OS that holds complete control over everything in the system, managing CPU, memory, and device drivers.',
    category: 'linux',
    relatedTerms: ['hypervisor', 'container', 'linux'],
    learnMoreLink: 'https://en.wikipedia.org/wiki/Kernel_(operating_system)'
  },
  {
    id: 'bash',
    term: 'Bash (Bourne Again Shell)',
    definition: 'A Unix shell and command language commonly used as the default command line interface and scripting language in Linux distributions and EC2 user data scripts.',
    category: 'linux',
    relatedTerms: ['ssh', 'aws-cli', 'linux'],
    learnMoreLink: 'https://www.gnu.org/software/bash/'
  },
  {
    id: 'systemd',
    term: 'systemd',
    definition: 'A software suite providing a system and service manager for Linux operating systems, responsible for initializing user space and managing daemon processes.',
    category: 'linux',
    relatedTerms: ['kernel', 'linux', 'bash'],
    learnMoreLink: 'https://systemd.io/'
  },
  {
    id: 'posix',
    term: 'POSIX (Portable Operating System Interface)',
    definition: 'A family of IEEE standards specifying the application programming interface, shell, and utility interfaces for maintaining operating system software compatibility.',
    category: 'linux',
    relatedTerms: ['efs', 'linux', 'file-storage'],
    learnMoreLink: 'https://en.wikipedia.org/wiki/POSIX'
  },

  // --- ADDITIONAL ESSENTIAL CLOUD & SECURITY TERMS ---
  {
    id: 'scp',
    term: 'Service Control Policy (SCP)',
    definition: 'An organization policy used to centrally manage and enforce maximum permissible permissions across all accounts in an AWS Organization.',
    category: 'security',
    relatedTerms: ['organizations', 'iam', 'policy'],
    learnMoreLink: 'https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps.html'
  },
  {
    id: 'principal',
    term: 'IAM Principal',
    definition: 'A human user, workload, federated identity, or AWS service entity that can make a request to perform an action or access a resource.',
    category: 'security',
    relatedTerms: ['iam', 'role', 'policy'],
    learnMoreLink: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements_principal.html'
  },
  {
    id: 'least-privilege',
    term: 'Principle of Least Privilege',
    definition: 'The fundamental security concept of granting users, applications, and services only the minimum permissions necessary to complete their intended tasks.',
    category: 'security',
    relatedTerms: ['iam', 'policy', 'role'],
    learnMoreLink: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html#grant-least-privilege'
  },
  {
    id: 'bastion-host',
    term: 'Bastion Host (Jump Box)',
    definition: 'A hardened, publicly accessible server used as an intermediary proxy to securely access internal instances located inside private subnets.',
    category: 'security',
    relatedTerms: ['systems-manager', 'ssh', 'vpc'],
    learnMoreLink: 'https://aws.amazon.com/quickstart/architecture/linux-bastion/'
  },
  {
    id: 'flow-logs',
    term: 'VPC Flow Logs',
    definition: 'A feature enabling the capture of information about IP traffic going to and from network interfaces in a VPC for network diagnostics and security analysis.',
    category: 'networking',
    relatedTerms: ['vpc', 'cloudwatch', 'guardduty'],
    learnMoreLink: 'https://docs.aws.amazon.com/vpc/latest/userguide/flow-logs.html'
  },
  {
    id: 'nlb',
    term: 'Network Load Balancer (NLB)',
    definition: 'An ultra-high-performance load balancer operating at OSI Layer 4 capable of handling millions of requests per second with ultra-low latencies.',
    category: 'networking',
    relatedTerms: ['alb', 'load-balancer', 'tcp', 'udp'],
    learnMoreLink: 'https://docs.aws.amazon.com/elasticloadbalancing/latest/network/introduction.html'
  },
  {
    id: 'alb',
    term: 'Application Load Balancer (ALB)',
    definition: 'A feature-rich load balancer operating at OSI Layer 7 providing advanced request routing based on HTTP headers, paths, hostnames, and query parameters.',
    category: 'networking',
    relatedTerms: ['nlb', 'load-balancer', 'http-https'],
    learnMoreLink: 'https://docs.aws.amazon.com/elasticloadbalancing/latest/application/introduction.html'
  },
  {
    id: 'egress-only-internet-gateway',
    term: 'Egress-Only Internet Gateway',
    definition: 'A horizontally scaled VPC component that allows outbound IPv6 communication from a VPC to the internet while preventing inbound internet connections.',
    category: 'networking',
    relatedTerms: ['internet-gateway', 'vpc', 'ipv4'],
    learnMoreLink: 'https://docs.aws.amazon.com/vpc/latest/userguide/egress-only-internet-gateway.html'
  },
  {
    id: 'customer-gateway',
    term: 'Customer Gateway',
    definition: 'An AWS resource representing the physical customer router or software appliance on the customer side of an AWS Site-to-Site VPN connection.',
    category: 'networking',
    relatedTerms: ['vpn', 'virtual-private-gateway', 'transit-gateway'],
    learnMoreLink: 'https://docs.aws.amazon.com/vpn/latest/s2svpn/your-cgw.html'
  },
  {
    id: 'virtual-private-gateway',
    term: 'Virtual Private Gateway (VGW)',
    definition: 'The VPN concentrator on the Amazon VPC side of a Site-to-Site VPN or Direct Connect connection.',
    category: 'networking',
    relatedTerms: ['vpn', 'customer-gateway', 'vpc'],
    learnMoreLink: 'https://docs.aws.amazon.com/vpn/latest/s2svpn/vpn-categories.html'
  },
  {
    id: 'iam-instance-profile',
    term: 'IAM Instance Profile',
    definition: 'A container for an IAM role that you can use to pass role credentials to an EC2 instance upon startup.',
    category: 'security',
    relatedTerms: ['ec2', 'role', 'iam'],
    learnMoreLink: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_use_switch-role-ec2_instance-profiles.html'
  },
  {
    id: 'blue-green-deployment',
    term: 'Blue/Green Deployment',
    definition: 'A deployment strategy where two identical environments (blue for active, green for staging) alternate to provide zero-downtime updates and instant rollbacks.',
    category: 'devops',
    relatedTerms: ['canary-deployment', 'codedeploy', 'high-availability'],
    learnMoreLink: 'https://docs.aws.amazon.com/whitepapers/latest/overview-deployment-options/bluegreen-deployments.html'
  },
  {
    id: 'canary-deployment',
    term: 'Canary Deployment',
    definition: 'A progressive deployment technique where new software versions are initially rolled out to a small subset of traffic to validate stability before full rollout.',
    category: 'devops',
    relatedTerms: ['blue-green-deployment', 'codedeploy', 'route-53'],
    learnMoreLink: 'https://docs.aws.amazon.com/whitepapers/latest/overview-deployment-options/canary-deployments.html'
  },
  {
    id: 'configuration-drift',
    term: 'Configuration Drift',
    definition: 'The unintended divergence over time between the declared Infrastructure as Code templates and the actual live runtime configuration of resources.',
    category: 'iac',
    relatedTerms: ['cloudformation', 'iac', 'terraform'],
    learnMoreLink: 'https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/detect-drift-stack.html'
  },
  {
    id: 'stack',
    term: 'CloudFormation Stack',
    definition: 'A collection of related AWS resources that are created, updated, or deleted as a single unified unit defined in a CloudFormation template.',
    category: 'iac',
    relatedTerms: ['cloudformation', 'iac', 'stackset'],
    learnMoreLink: 'https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/stacks.html'
  },
  {
    id: 'stackset',
    term: 'CloudFormation StackSet',
    definition: 'An extension of CloudFormation stacks that lets you create, update, or delete stacks across multiple accounts and regions with a single operation.',
    category: 'iac',
    relatedTerms: ['cloudformation', 'organizations', 'stack'],
    learnMoreLink: 'https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/what-is-cfnstacksets.html'
  },
  {
    id: 'cloudwatch-alarms',
    term: 'CloudWatch Alarms',
    definition: 'A feature that watches a single metric or math expression over time and automatically initiates actions based on threshold evaluation.',
    category: 'monitoring',
    relatedTerms: ['cloudwatch', 'sns', 'auto-scaling'],
    learnMoreLink: 'https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/AlarmThatSendsEmail.html'
  },
  {
    id: 'cloudwatch-logs',
    term: 'CloudWatch Logs',
    definition: 'A centralized log management service that enables ingestion, search, monitoring, analysis, and retention of system and application log streams.',
    category: 'monitoring',
    relatedTerms: ['cloudwatch', 'cloudtrail', 'metrics'],
    learnMoreLink: 'https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/WhatIsCloudWatchLogs.html'
  },
  {
    id: 'cross-region-replication',
    term: 'Cross-Region Replication (CRR)',
    definition: 'An automated feature of Amazon S3 that replicates newly uploaded objects across buckets located in different geographic AWS Regions for disaster recovery.',
    category: 'cloud',
    relatedTerms: ['s3', 'rpo', 'disaster-recovery'],
    learnMoreLink: 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/replication.html'
  },
  {
    id: 'point-in-time-recovery',
    term: 'Point-In-Time Recovery (PITR)',
    definition: 'An automated continuous backup capability that allows restoring a database to any specific second within a configured retention period.',
    category: 'databases',
    relatedTerms: ['rds', 'dynamodb', 'backup'],
    learnMoreLink: 'https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_PIT.html'
  },
  {
    id: 'nosql',
    term: 'NoSQL Database',
    definition: 'A non-relational database design model that stores and retrieves data using structures other than tabular relations (such as document, key-value, or graph).',
    category: 'databases',
    relatedTerms: ['dynamodb', 'crud', 'rds'],
    learnMoreLink: 'https://aws.amazon.com/nosql/'
  },
  {
    id: 'athena',
    term: 'Amazon Athena',
    definition: 'An interactive serverless query service that makes it easy to analyze data directly in Amazon S3 using standard SQL without managing clusters.',
    category: 'aws',
    relatedTerms: ['s3', 'redshift', 'serverless'],
    learnMoreLink: 'https://aws.amazon.com/athena/'
  },
  {
    id: 'glue',
    term: 'AWS Glue',
    definition: 'A serverless data integration service that makes it easy to discover, prepare, move, and integrate data from multiple sources with an automated data catalog.',
    category: 'aws',
    relatedTerms: ['athena', 's3', 'redshift'],
    learnMoreLink: 'https://aws.amazon.com/glue/'
  },
  {
    id: 'kinesis',
    term: 'Amazon Kinesis',
    definition: 'A managed suite of services designed to collect, process, and analyze real-time streaming data at scale with low latencies.',
    category: 'aws',
    relatedTerms: ['sqs', 'lambda', 'eventbridge'],
    learnMoreLink: 'https://aws.amazon.com/kinesis/'
  },
  {
    id: 'cognito',
    term: 'Amazon Cognito',
    definition: 'A customer identity and access management service that provides user sign-up, sign-in, and access control for web and mobile applications.',
    category: 'security',
    relatedTerms: ['iam', 'api-gateway', 'jwt'],
    learnMoreLink: 'https://aws.amazon.com/cognito/'
  },
  {
    id: 'jwt',
    term: 'JWT (JSON Web Token)',
    definition: 'A compact, URL-safe cryptographic token format used to securely transmit claims and identity assertions between parties in web applications.',
    category: 'security',
    relatedTerms: ['cognito', 'api-gateway', 'json'],
    learnMoreLink: 'https://jwt.io/introduction'
  },
  {
    id: 'saml',
    term: 'SAML 2.0 (Security Assertion Markup Language)',
    definition: 'An open standard XML-based data format for exchanging authentication and authorization data between an identity provider and a service provider.',
    category: 'security',
    relatedTerms: ['iam-identity-center', 'iam', 'cognito'],
    learnMoreLink: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_providers_saml.html'
  },
  {
    id: 'cost-explorer',
    term: 'AWS Cost Explorer',
    definition: 'A reporting tool enabling users to visualize, understand, and manage AWS costs and usage trends over time with custom filters and forecasting.',
    category: 'cloud',
    relatedTerms: ['budgets', 'savings-plan', 'cost-allocation'],
    learnMoreLink: 'https://aws.amazon.com/aws-cost-management/aws-cost-explorer/'
  },
  {
    id: 'budgets',
    term: 'AWS Budgets',
    definition: 'A cost management service that allows users to set custom spending and usage limits and receive automated notifications when budgets are exceeded.',
    category: 'cloud',
    relatedTerms: ['cost-explorer', 'sns', 'cost-allocation'],
    learnMoreLink: 'https://aws.amazon.com/aws-cost-management/aws-budgets/'
  },
  {
    id: 'disaster-recovery',
    term: 'Disaster Recovery (DR)',
    definition: 'A set of policies, tools, and procedures enabling the recovery and continuation of vital business systems and infrastructure following a catastrophic disaster.',
    category: 'cloud',
    relatedTerms: ['rpo', 'rto', 'backup', 'cross-region-replication'],
    learnMoreLink: 'https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/disaster-recovery-workloads-on-aws.html'
  },
  {
    id: 'pilot-light',
    term: 'Pilot Light DR Strategy',
    definition: 'A disaster recovery approach where core critical components (such as databases) are continuously running and replicated, while compute fleets remain stopped until failover.',
    category: 'cloud',
    relatedTerms: ['disaster-recovery', 'rpo', 'rto', 'warm-standby'],
    learnMoreLink: 'https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/disaster-recovery-options-in-the-cloud.html'
  },
  {
    id: 'warm-standby',
    term: 'Warm Standby DR Strategy',
    definition: 'A disaster recovery strategy where a scaled-down but fully functional copy of the production environment is always running in a secondary region.',
    category: 'cloud',
    relatedTerms: ['disaster-recovery', 'pilot-light', 'rpo', 'rto'],
    learnMoreLink: 'https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/disaster-recovery-options-in-the-cloud.html'
  },
  {
    id: 'hot-standby',
    term: 'Multi-Region Active-Active (Hot Standby)',
    definition: 'A zero-downtime architecture where production traffic is actively served from two or more geographically disparate AWS regions simultaneously.',
    category: 'cloud',
    relatedTerms: ['disaster-recovery', 'high-availability', 'route-53'],
    learnMoreLink: 'https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/disaster-recovery-options-in-the-cloud.html'
  },
  {
    id: 'vpc-endpoint-service',
    term: 'VPC Endpoint Service',
    definition: 'A service hosted behind a Network Load Balancer that other AWS customers or VPCs can connect to privately via AWS PrivateLink.',
    category: 'networking',
    relatedTerms: ['privatelink', 'vpc-endpoint', 'nlb'],
    learnMoreLink: 'https://docs.aws.amazon.com/vpc/latest/privatelink/privatelink-share-your-services.html'
  },
  {
    id: 'placement-group',
    term: 'EC2 Placement Group',
    definition: 'A logical placement configuration that determines how instances are physically positioned on underlying server hardware (cluster, spread, or partition).',
    category: 'aws',
    relatedTerms: ['ec2', 'latency', 'high-availability'],
    learnMoreLink: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/placement-groups.html'
  },
  {
    id: 'launch-template',
    term: 'EC2 Launch Template',
    definition: 'An instance configuration template specifying AMI, instance type, key pair, security groups, and user data used repeatedly by Auto Scaling and EC2.',
    category: 'aws',
    relatedTerms: ['ec2', 'auto-scaling', 'ami'],
    learnMoreLink: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-launch-templates.html'
  },
  {
    id: 'user-data',
    term: 'EC2 User Data',
    definition: 'A startup bootstrap shell script or cloud-init configuration passed to an EC2 instance that runs automatically during its initial boot sequence.',
    category: 'linux',
    relatedTerms: ['ec2', 'bash', 'launch-template'],
    learnMoreLink: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/user-data.html'
  },
  {
    id: 'instance-metadata',
    term: 'Instance Metadata Service (IMDS)',
    definition: 'An on-instance HTTP endpoint (169.254.169.254) providing data about the running EC2 instance, including temporary IAM role security credentials.',
    category: 'security',
    relatedTerms: ['ec2', 'iam', 'iam-instance-profile'],
    learnMoreLink: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-instance-metadata.html'
  },
  {
    id: 'imds-v2',
    term: 'IMDSv2 (Instance Metadata Service Version 2)',
    definition: 'A hardened session-oriented version of the instance metadata service requiring a PUT request token header to mitigate Server-Side Request Forgery (SSRF) risks.',
    category: 'security',
    relatedTerms: ['instance-metadata', 'ec2', 'security'],
    learnMoreLink: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/configuring-instance-metadata-service.html'
  },
  {
    id: 'kms-cmk',
    term: 'Customer Managed Key (CMK)',
    definition: 'An encryption key in AWS KMS that you create, own, rotate, and manage policies for, offering complete governance over cryptographic access.',
    category: 'security',
    relatedTerms: ['kms', 'encryption'],
    learnMoreLink: 'https://docs.aws.amazon.com/kms/latest/developerguide/concepts.html#customer-cmk'
  },
  {
    id: 'envelope-encryption',
    term: 'Envelope Encryption',
    definition: 'A cryptographic practice of encrypting plaintext data with a unique data key, and then encrypting the data key with a root Key Management Service key.',
    category: 'security',
    relatedTerms: ['kms', 'encryption'],
    learnMoreLink: 'https://docs.aws.amazon.com/kms/latest/developerguide/concepts.html#enveloping'
  },
  {
    id: 's3-versioning',
    term: 'S3 Versioning',
    definition: 'A means of keeping multiple variants of an object in the same S3 bucket, enabling recovery from accidental overwrites or deletions.',
    category: 'aws',
    relatedTerms: ['s3', 'backup', 's3-object-lock'],
    learnMoreLink: 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/Versioning.html'
  },
  {
    id: 's3-object-lock',
    term: 'S3 Object Lock',
    definition: 'A Write Once, Read Many (WORM) storage protection model that prevents objects in S3 from being deleted or overwritten for a fixed retention period.',
    category: 'security',
    relatedTerms: ['s3', 'compliance', 's3-versioning'],
    learnMoreLink: 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lock.html'
  },
  {
    id: 's3-lifecycle',
    term: 'S3 Lifecycle Management',
    definition: 'Automated rules that manage object retention by transitioning objects between storage tiers or deleting expired data to optimize storage costs.',
    category: 'aws',
    relatedTerms: ['s3', 's3-glacier', 'cost-optimization'],
    learnMoreLink: 'https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lifecycle-mgmt.html'
  },
  {
    id: 'synthetic-monitoring',
    term: 'CloudWatch Synthetics Canaries',
    definition: 'Configurable scripts that monitor software endpoints and APIs from external points-of-presence 24/7 to catch issues before customers do.',
    category: 'monitoring',
    relatedTerms: ['cloudwatch', 'health-check'],
    learnMoreLink: 'https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Canaries.html'
  },
  {
    id: 'composite-alarms',
    term: 'CloudWatch Composite Alarms',
    definition: 'An alarm structure that combines multiple CloudWatch alarms using Boolean logic (AND/OR/NOT) to suppress noise and reduce alarm fatigue.',
    category: 'monitoring',
    relatedTerms: ['cloudwatch-alarms', 'cloudwatch', 'sns'],
    learnMoreLink: 'https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Create_Composite_Alarm.html'
  },
  {
    id: 'iam-boundary',
    term: 'IAM Permissions Boundary',
    definition: 'An advanced IAM feature that uses a managed policy to set the maximum permissions that an identity-based policy can grant to an IAM entity.',
    category: 'security',
    relatedTerms: ['iam', 'policy', 'role'],
    learnMoreLink: 'https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_boundaries.html'
  },
  {
    id: 'ssm-session-manager',
    term: 'SSM Session Manager',
    definition: 'A fully managed AWS Systems Manager capability that allows you to manage EC2 instances through an interactive one-click browser-based shell without opening SSH port 22.',
    category: 'security',
    relatedTerms: ['systems-manager', 'ec2', 'ssh'],
    learnMoreLink: 'https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager.html'
  },
  {
    id: 'aws-appconfig',
    term: 'AWS AppConfig',
    definition: 'A feature of AWS Systems Manager that enables teams to deploy application configurations dynamically at runtime without restarting code or redeploying.',
    category: 'devops',
    relatedTerms: ['systems-manager', 'ci-cd'],
    learnMoreLink: 'https://docs.aws.amazon.com/appconfig/latest/userguide/what-is-appconfig.html'
  },
  {
    id: 'codeartifact',
    term: 'AWS CodeArtifact',
    definition: 'A fully managed artifact repository service that makes it easy for organizations to securely store, publish, and share software packages (npm, PyPI, Maven).',
    category: 'devops',
    relatedTerms: ['ci-cd', 'codebuild'],
    learnMoreLink: 'https://aws.amazon.com/codeartifact/'
  },
  {
    id: 'amazon-inspector',
    term: 'Amazon Inspector',
    definition: 'An automated vulnerability management service that continually scans AWS workloads (EC2, container images in ECR, and Lambda functions) for software vulnerabilities.',
    category: 'security',
    relatedTerms: ['ecr', 'security-hub', 'ec2'],
    learnMoreLink: 'https://aws.amazon.com/inspector/'
  },
  {
    id: 'amazon-vpc-lattice',
    term: 'Amazon VPC Lattice',
    definition: 'An application networking service that connects, monitors, and secures service-to-service communication across VPCs and accounts without network-level complexity.',
    category: 'networking',
    relatedTerms: ['vpc', 'transit-gateway', 'privatelink'],
    learnMoreLink: 'https://aws.amazon.com/vpc/lattice/'
  },
  {
    id: 'aws-direct-connect-gateway',
    term: 'Direct Connect Gateway',
    definition: 'A globally available network grouping resource that links an on-premises Direct Connect connection to multiple VPCs or Transit Gateways across different AWS regions.',
    category: 'networking',
    relatedTerms: ['direct-connect', 'transit-gateway', 'vpc'],
    learnMoreLink: 'https://docs.aws.amazon.com/directconnect/latest/UserGuide/direct-connect-gateways-intro.html'
  },
  {
    id: 'prefix-list',
    term: 'Managed Prefix List',
    definition: 'A set of one or more CIDR blocks that can be referenced in VPC security groups, route tables, and transit gateways for centralized IP management.',
    category: 'networking',
    relatedTerms: ['cidr', 'security-group', 'route-table'],
    learnMoreLink: 'https://docs.aws.amazon.com/vpc/latest/userguide/managed-prefix-lists.html'
  },
  {
    id: 'aurora-serverless',
    term: 'Amazon Aurora Serverless',
    definition: 'An on-demand, autoscaling configuration for Amazon Aurora where the database automatically adjusts compute capacity up or down based on workload demand.',
    category: 'databases',
    relatedTerms: ['aurora', 'rds', 'serverless'],
    learnMoreLink: 'https://aws.amazon.com/rds/aurora/serverless/'
  },
  {
    id: 'dynamodb-dax',
    term: 'DynamoDB Accelerator (DAX)',
    definition: 'A fully managed, highly available, in-memory cache for Amazon DynamoDB that delivers up to a 10-times performance improvement from milliseconds to microseconds.',
    category: 'databases',
    relatedTerms: ['dynamodb', 'elasticache', 'latency'],
    learnMoreLink: 'https://aws.amazon.com/dynamodb/dax/'
  },
  {
    id: 'amazon-memorydb',
    term: 'Amazon MemoryDB for Redis',
    definition: 'A Redis-compatible, durable, in-memory database service designed for ultra-fast performance with multi-AZ transactional log persistence.',
    category: 'databases',
    relatedTerms: ['elasticache', 'dynamodb', 'latency'],
    learnMoreLink: 'https://aws.amazon.com/memorydb/'
  },
  {
    id: 'sqs-fifo',
    term: 'Amazon SQS FIFO Queue',
    definition: 'A message queue type that guarantees strict First-In-First-Out ordering and exactly-once processing with deduplication support.',
    category: 'aws',
    relatedTerms: ['sqs', 'sns', 'dead-letter-queue'],
    learnMoreLink: 'https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/FIFO-queues.html'
  },
  {
    id: 'sns-fifo',
    term: 'Amazon SNS FIFO Topic',
    definition: 'A publish/subscribe topic type providing strict message ordering and deduplicated message delivery to subscribed SQS FIFO queues.',
    category: 'aws',
    relatedTerms: ['sns', 'sqs-fifo', 'sqs'],
    learnMoreLink: 'https://docs.aws.amazon.com/sns/latest/dg/sns-fifo-topics.html'
  },
  {
    id: 'aws-app-runner',
    term: 'AWS App Runner',
    definition: 'A fully managed service that makes it easy for developers to quickly deploy containerized web applications and APIs at scale without managing infrastructure.',
    category: 'containers',
    relatedTerms: ['ecs', 'fargate', 'container'],
    learnMoreLink: 'https://aws.amazon.com/apprunner/'
  },
  {
    id: 'aws-copilot',
    term: 'AWS Copilot CLI',
    definition: 'An open-source command-line interface that developers use to build, release, and operate production-ready containerized apps on Amazon ECS and Fargate.',
    category: 'devops',
    relatedTerms: ['ecs', 'fargate', 'aws-cli'],
    learnMoreLink: 'https://aws.github.io/copilot-cli/'
  },
  {
    id: 'cloudwatch-container-insights',
    term: 'Container Insights',
    definition: 'A CloudWatch feature providing automated monitoring, metrics collection, and diagnostic dashboards for containerized applications on ECS, EKS, and Fargate.',
    category: 'monitoring',
    relatedTerms: ['cloudwatch', 'ecs', 'eks'],
    learnMoreLink: 'https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ContainerInsights.html'
  },
  {
    id: 'elastic-fabric-adapter',
    term: 'Elastic Fabric Adapter (EFA)',
    definition: 'A specialized network interface for Amazon EC2 instances designed to accelerate High Performance Computing (HPC) and machine learning workloads.',
    category: 'networking',
    relatedTerms: ['ec2', 'latency', 'nitro-system'],
    learnMoreLink: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/efa.html'
  },
  {
    id: 'route-53-resolver',
    term: 'Route 53 Resolver',
    definition: 'A hybrid cloud DNS service that automatically answers recursive DNS queries between local Amazon VPCs and on-premises networks.',
    category: 'networking',
    relatedTerms: ['route-53', 'dns', 'direct-connect'],
    learnMoreLink: 'https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/resolving-your-domain-names.html'
  },
  {
    id: 'route-53-latency-routing',
    term: 'Route 53 Latency-Based Routing',
    definition: 'A DNS routing policy that automatically routes end user requests to the AWS Region that provides the lowest network latency for that user.',
    category: 'networking',
    relatedTerms: ['route-53', 'latency', 'dns'],
    learnMoreLink: 'https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-policy-latency.html'
  },
  {
    id: 'route-53-geolocation-routing',
    term: 'Route 53 Geolocation Routing',
    definition: 'A DNS routing policy that routes traffic based on the geographic location of the DNS query origin, enabling localized content delivery.',
    category: 'networking',
    relatedTerms: ['route-53', 'dns', 'edge-location'],
    learnMoreLink: 'https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-policy-geo.html'
  },
  {
    id: 'origin-access-control',
    term: 'Origin Access Control (OAC)',
    definition: 'A CloudFront security feature that signs requests to Amazon S3 origins to ensure users can only access private S3 bucket objects via CloudFront URLs.',
    category: 'security',
    relatedTerms: ['cloudfront', 's3', 'encryption'],
    learnMoreLink: 'https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-s3.html'
  },
  {
    id: 'cloudwatch-embedded-metric-format',
    term: 'CloudWatch Embedded Metric Format (EMF)',
    definition: 'An open JSON logging specification that enables asynchronous ingestion of complex custom metrics embedded directly within CloudWatch Logs payloads.',
    category: 'monitoring',
    relatedTerms: ['cloudwatch-logs', 'metrics', 'json'],
    learnMoreLink: 'https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Embedded_Metric_Format.html'
  },
  {
    id: 'aws-fault-injection-simulator',
    term: 'AWS FIS (Fault Injection Simulator)',
    definition: 'A fully managed chaos engineering service for running controlled fault injection experiments on AWS to build system resilience and stress-test failovers.',
    category: 'devops',
    relatedTerms: ['resilience', 'fault-tolerance', 'high-availability'],
    learnMoreLink: 'https://aws.amazon.com/fis/'
  },
  {
    id: 'aws-xray-daemon',
    term: 'AWS X-Ray Daemon',
    definition: 'A background software application listening for UDP traffic that buffers and batches segment data gathered from SDK tracers before dispatching to AWS X-Ray.',
    category: 'monitoring',
    relatedTerms: ['x-ray', 'udp', 'daemon'],
    learnMoreLink: 'https://docs.aws.amazon.com/xray/latest/devguide/xray-daemon.html'
  },
  {
    id: 'ephemeral-storage',
    term: 'Ephemeral Storage',
    definition: 'Temporary non-persistent disk space attached to compute instances or containers that is automatically wiped and discarded when the instance or task terminates.',
    category: 'cloud',
    relatedTerms: ['ec2', 'lambda', 'ebs'],
    learnMoreLink: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/InstanceStorage.html'
  },
  {
    id: 'caching',
    term: 'Caching',
    definition: 'The performance optimization technique of storing copies of data in high-speed, temporary storage tiers to serve future identical requests faster.',
    category: 'cloud',
    relatedTerms: ['elasticache', 'cloudfront', 'latency'],
    learnMoreLink: 'https://aws.amazon.com/caching/'
  },
  {
    id: 'compliance',
    term: 'Compliance & Governance',
    definition: 'The adherence to legal, regulatory, and industry standards (e.g. SOC2, HIPAA, PCI-DSS) governing data security, privacy, and operational integrity in the cloud.',
    category: 'security',
    relatedTerms: ['aws-config', 'security-hub', 'cloudtrail'],
    learnMoreLink: 'https://aws.amazon.com/compliance/'
  },
  {
    id: 'cost-allocation',
    term: 'Cost Allocation Tags',
    definition: 'Tags activated in the AWS Billing console that categorize and track resource costs on detailed cost allocation reports for internal departmental chargebacks.',
    category: 'cloud',
    relatedTerms: ['tags', 'cost-explorer', 'budgets'],
    learnMoreLink: 'https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/cost-alloc-tags.html'
  },
  {
    id: 'cost-optimization',
    term: 'Cost Optimization',
    definition: 'The ongoing architectural process of continually refining and improving cloud resource utilization to achieve maximum business value at the lowest price point.',
    category: 'cloud',
    relatedTerms: ['savings-plan', 'spot-instance', 'well-architected-framework'],
    learnMoreLink: 'https://docs.aws.amazon.com/wellarchitected/latest/cost-optimization-pillar/welcome.html'
  },
  {
    id: 'landing-zone',
    term: 'Landing Zone',
    definition: 'A well-architected, multi-account AWS environment baseline that provides initial identity, network, security, and governance infrastructure setup.',
    category: 'cloud',
    relatedTerms: ['control-tower', 'organizations', 'iam-identity-center'],
    learnMoreLink: 'https://aws.amazon.com/solutions/implementations/aws-landing-zone/'
  },
  {
    id: 'ipsec',
    term: 'IPsec (Internet Protocol Security)',
    definition: 'A suite of network cryptographic protocols that authenticates and encrypts packets of data to provide secure encrypted communication across IP networks.',
    category: 'networking',
    relatedTerms: ['vpn', 'encryption', 'ssl-tls'],
    learnMoreLink: 'https://en.wikipedia.org/wiki/IPsec'
  },
  {
    id: 'olap',
    term: 'OLAP (Online Analytical Processing)',
    definition: 'A category of software and database systems designed to facilitate multi-dimensional analysis and fast complex queries on massive historical datasets.',
    category: 'databases',
    relatedTerms: ['redshift', 'athena', 'crud'],
    learnMoreLink: 'https://aws.amazon.com/what-is/olap/'
  },
  {
    id: 'patch-management',
    term: 'Patch Management',
    definition: 'The systematic process of scanning, acquiring, testing, and installing software updates and security patches across operating systems and packages.',
    category: 'security',
    relatedTerms: ['systems-manager', 'ec2', 'compliance'],
    learnMoreLink: 'https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-patch.html'
  },
  {
    id: 'daemon',
    term: 'Daemon',
    definition: 'A background computer program or process running continuously in an operating system without direct user interaction, providing system or application services.',
    category: 'linux',
    relatedTerms: ['systemd', 'linux', 'container'],
    learnMoreLink: 'https://en.wikipedia.org/wiki/Daemon_(computing)'
  },
  {
    id: 'linux',
    term: 'Linux',
    definition: 'An open-source Unix-like operating system kernel and family of distributions that serves as the primary foundational OS powering cloud infrastructure and containers.',
    category: 'linux',
    relatedTerms: ['kernel', 'bash', 'container'],
    learnMoreLink: 'https://aws.amazon.com/what-is/linux/'
  },
  {
    id: 'snapshot',
    term: 'EBS Snapshot',
    definition: 'A point-in-time incremental backup of an Amazon EBS block volume stored durably in Amazon S3 for disaster recovery and volume migration.',
    category: 'aws',
    relatedTerms: ['ebs', 'backup', 's3'],
    learnMoreLink: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EBSSnapshots.html'
  },
  {
    id: 'bandwidth',
    term: 'Bandwidth',
    definition: 'The maximum capacity or rate of data transfer across a given network path, typically measured in bits per second (e.g. Gbps).',
    category: 'networking',
    relatedTerms: ['throughput', 'latency', 'direct-connect'],
    learnMoreLink: 'https://aws.amazon.com/what-is/bandwidth/'
  },
  {
    id: 'failover',
    term: 'Failover',
    definition: 'An automated operational procedure where control and traffic seamlessly switch to a redundant standby system upon failure of the primary component.',
    category: 'cloud',
    relatedTerms: ['high-availability', 'multi-az', 'route-53'],
    learnMoreLink: 'https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/dns-failover.html'
  }
];
