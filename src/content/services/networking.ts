import { AWSService } from '../../types';

export const networkingServices: AWSService[] = [
  {
    id: 'vpc',
    name: 'Amazon Virtual Private Cloud',
    shortName: 'VPC',
    category: 'networking',
    difficulty: 'intermediate',
    importance: 'essential',
    icon: 'Networking',
    tagline: 'Isolated virtual networks dedicated to your AWS account',
    mentalModel: 'Your own private, software-defined data center inside the AWS cloud where you define the IP ranges, subnets, and routing tables.',
    problemItSolves: 'Provides complete network isolation, granular traffic routing, and private connectivity for AWS workloads.',
    howItWorks: 'Enables creation of a logically isolated section of the AWS cloud where you define IPv4/IPv6 CIDR blocks, partition them into subnets across AZs, and configure route tables.',
    components: [
      { name: 'Subnets', description: 'Segments of VPC IP address ranges assigned to a specific Availability Zone (public or private).' },
      { name: 'Internet Gateway (IGW)', description: 'VPC component that enables communication between public subnets and the internet.' },
      { name: 'NAT Gateway', description: 'Managed service enabling outbound internet access for private subnets while preventing inbound connections.' },
      { name: 'Route Tables', description: 'Sets of routing rules determining where network traffic from subnets is directed.' }
    ],
    realWorldExample: 'A 3-tier web application with public subnets for load balancers, private subnets for application servers, and isolated database subnets.',
    whenToUse: [
      'Every production AWS deployment hosting EC2, RDS, ECS, or private Lambda functions',
      'Establishing secure hybrid cloud connectivity to on-premises enterprise data centers',
      'Isolating environments (dev, staging, prod) within distinct network perimeters'
    ],
    whenNotToUse: [
      'Pure serverless applications running entirely on public S3, DynamoDB, and public Lambda without private resources',
      'Global multi-region backbone mesh without using Transit Gateway or Cloud WAN'
    ],
    practicalImplementation: {
      cli: 'aws ec2 create-vpc --cidr-block 10.0.0.0/16 --tag-specifications "ResourceType=vpc,Tags=[{Key=Name,Value=prod-vpc}]"'
    },
    security: 'Control access using Security Groups (stateful) and Network ACLs (stateless). Enable VPC Flow Logs for comprehensive traffic auditing.',
    costDrivers: 'VPC creation is free; charges apply for NAT Gateways ($/hour + $/GB processed), VPC Endpoints, and inter-AZ data transfer.',
    limitations: [
      'CIDR block cannot be modified once set (though secondary CIDR blocks can be added)',
      'VPC peering cannot have overlapping CIDR blocks and does not support transitive routing',
      'Each subnet is strictly bound to a single Availability Zone'
    ],
    commonMistakes: [
      'Sizing CIDR blocks too small (e.g., /24) leading to IP exhaustion when scaling services',
      'Deploying a single NAT Gateway across multiple AZs creating a single point of failure and cross-AZ data transfer charges',
      'Using public subnets for databases or internal microservices'
    ],
    alternatives: [
      { service: 'transit-gateway', reason: 'Hub-and-spoke connectivity connecting hundreds of VPCs and on-prem networks' },
      { service: 'cloud-wan', reason: 'Centralized global wide area network orchestrating multi-region networks' }
    ],
    relatedServices: ['security-groups-nacls', 'transit-gateway', 'vpc-endpoints', 'direct-connect', 'route53'],
    scenarioQuestion: {
      id: 'q-vpc-01',
      question: 'A company has multiple private subnets in two Availability Zones running EC2 worker nodes. The workers need to download software updates from the internet securely and with high availability. Which architecture satisfies this requirement?',
      type: 'single',
      options: [
        'Deploy one NAT Gateway in each AZ\'s public subnet and update private route tables to route 0.0.0.0/0 to the AZ-specific NAT Gateway.',
        'Deploy a single NAT Gateway in us-east-1a public subnet and route all private traffic through it.',
        'Attach an Internet Gateway directly to the private subnets and assign public IP addresses.',
        'Create a VPC Peering connection directly to the public internet.'
      ],
      correctAnswers: [0],
      explanation: 'Deploying redundant NAT Gateways across both AZs ensures multi-AZ high availability and prevents cross-AZ data transfer charges.',
      whyOthersWrong: [
        'A single NAT Gateway creates a single point of failure if that AZ goes down and adds inter-AZ data transfer costs.',
        'Attaching an IGW directly to private subnets exposes instances directly to inbound internet traffic if public IPs are assigned.',
        'VPC Peering connects two VPCs together; it cannot peer with the public internet.'
      ],
      decisiveClue: 'High availability across two AZs for outbound private traffic requires one NAT Gateway per Availability Zone.',
      difficulty: 'intermediate',
      isOriginal: true
    },
    quickRevision: [
      'Subnets are tied to single AZs; VPCs span all AZs in a Region.',
      'Public subnet: route table has a route `0.0.0.0/0` -> Internet Gateway (igw-xxxx).',
      'Private subnet: route table has a route `0.0.0.0/0` -> NAT Gateway (nat-xxxx).',
      'VPC Peering does NOT support transitive routing (A <-> B <-> C does not mean A <-> C).'
    ],
    sources: [
      { title: 'Amazon VPC Documentation', url: 'https://docs.aws.amazon.com/vpc/' },
      { title: 'VPC Networking Best Practices', url: 'https://docs.aws.amazon.com/vpc/latest/userguide/vpc-subnets-commands-example.html' }
    ],
    searchTerms: ['vpc', 'virtual private cloud', 'cidr', 'subnet', 'nat gateway', 'internet gateway']
  },
  {
    id: 'route53',
    name: 'Amazon Route 53',
    shortName: 'Route 53',
    category: 'networking',
    difficulty: 'intermediate',
    importance: 'essential',
    icon: 'Networking',
    tagline: 'Highly available and scalable cloud Domain Name System (DNS) web service',
    mentalModel: 'The global phonebook of the internet, mapping human-readable names like example.com to IP addresses or AWS resource endpoints.',
    problemItSolves: 'Provides reliable, low-latency DNS resolution and flexible traffic routing strategies with automated health check failovers.',
    howItWorks: 'Operates as an authoritative DNS service globally distributed across AWS edge locations with 100% SLA, resolving queries and monitoring endpoint health.',
    components: [
      { name: 'Hosted Zones', description: 'Containers for DNS records for a domain (Public for internet, Private for internal VPCs).' },
      { name: 'Routing Policies', description: 'Simple, Weighted, Latency-based, Failover, Geolocation, Geoproximity, and Multivalue answer.' },
      { name: 'Alias Records', description: 'AWS-specific DNS extension routing top-level domain apex (e.g. example.com) directly to AWS resources for free.' },
      { name: 'Health Checks', description: 'Monitors endpoint reachability and triggers automated DNS failover when servers fail.' }
    ],
    realWorldExample: 'Routing users to the closest regional application endpoint using latency-based routing while failing over to a backup region if health checks fail.',
    whenToUse: [
      'Domain registration and global authoritative DNS hosting',
      'Active-Passive disaster recovery failover architectures',
      'Internal service discovery across multiple VPCs using Private Hosted Zones'
    ],
    whenNotToUse: [
      'Microservice-level dynamic mesh discovery within Kubernetes (use AWS Cloud Map or CoreDNS)',
      'Ultra-high frequency state updates requiring sub-second failover without DNS caching (use Global Accelerator)'
    ],
    practicalImplementation: {
      cli: 'aws route53 create-hosted-zone --name example.com --caller-reference 2026-10-12-001'
    },
    security: 'Supports DNSSEC (DNS Security Extensions) signing to prevent DNS spoofing and cache poisoning attacks.',
    costDrivers: 'Hosted zone fees ($0.50/month per zone), DNS queries (per million queries), and health checks.',
    limitations: [
      'DNS failover speed is subject to client and ISP DNS resolver TTL caching',
      'Alias records can only point to AWS-supported resources, not arbitrary external domains'
    ],
    commonMistakes: [
      'Using CNAME records for root/apex domains (e.g. `example.com`), which violates DNS RFC standards; use Alias records instead',
      'Setting excessively high TTL on records that need rapid failover',
      'Forgetting to associate private hosted zones with all required VPCs'
    ],
    alternatives: [
      { service: 'global-accelerator', reason: 'Provides instant failover without being hindered by client DNS caching' },
      { service: 'cloudfront', reason: 'Handles edge caching and CDN routing rather than pure DNS resolution' }
    ],
    relatedServices: ['cloudfront', 'elb', 'vpc', 'route53-arc'],
    scenarioQuestion: {
      id: 'q-route53-01',
      question: 'A company wants to map its zone apex domain (example.com) to an Application Load Balancer. Standard DNS specifications forbid CNAME records at the zone apex. What is the recommended AWS solution?',
      type: 'single',
      options: [
        'Create a Route 53 Alias record targeting the ALB DNS name.',
        'Create a CNAME record with TTL set to 0 seconds.',
        'Assign a static Elastic IP to the ALB and create an A record.',
        'Use an EC2 instance as a reverse proxy with an Elastic IP.'
      ],
      correctAnswers: [0],
      explanation: 'Route 53 Alias records allow mapping zone apex (root domain) names to AWS resources like ALBs and CloudFront distributions while responding as standard A records.',
      whyOthersWrong: [
        'CNAME records at the apex violate DNS RFC specifications regardless of TTL.',
        'ALBs do not support static Elastic IP assignments directly.',
        'Setting up a reverse proxy adds unnecessary operational burden, cost, and a single point of failure.'
      ],
      decisiveClue: 'Zone apex mapping to an AWS load balancer without violating DNS standards requires an Alias record.',
      difficulty: 'intermediate',
      isOriginal: true
    },
    quickRevision: [
      'Route 53 offers a 100% SLA for authoritative DNS uptime.',
      'Alias records are free of charge for DNS queries when pointing to AWS resources (S3, ALB, CloudFront).',
      'Failover routing requires Route 53 Health Checks.',
      'Private Hosted Zones are only accessible within designated associated VPCs.'
    ],
    sources: [
      { title: 'Amazon Route 53 Documentation', url: 'https://docs.aws.amazon.com/route53/' },
      { title: 'Route 53 Routing Policies', url: 'https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-policy.html' }
    ],
    searchTerms: ['route53', 'dns', 'hosted zone', 'alias record', 'failover', 'latency routing']
  },
  {
    id: 'cloudfront',
    name: 'Amazon CloudFront',
    shortName: 'CloudFront',
    category: 'networking',
    difficulty: 'intermediate',
    importance: 'essential',
    icon: 'Networking',
    tagline: 'Fast, secure, programmable Content Delivery Network (CDN)',
    mentalModel: 'A fleet of worldwide caching proxy servers positioned close to your end users to serve content at lightning speed.',
    problemItSolves: 'Reduces latency by caching static and dynamic web content at edge locations near users, while protecting backend origins from traffic spikes.',
    howItWorks: 'Caches content across hundreds of Points of Presence (PoPs) globally. Incoming requests are served from edge cache or fetched over AWS backbone from origin.',
    components: [
      { name: 'Distribution', description: 'The configuration unit representing your CDN instance with an assigned domain name.' },
      { name: 'Origins', description: 'The source of truth for your content (e.g., S3 bucket, EC2, ALB, or custom HTTP server).' },
      { name: 'Behaviors', description: 'Path-based routing rules defining caching TTLs, allowed HTTP methods, and edge compute functions.' },
      { name: 'Origin Access Control (OAC)', description: 'Secure mechanism restricting S3 bucket access exclusively to your CloudFront distribution.' }
    ],
    realWorldExample: 'Accelerating global video streaming and static SPA delivery with sub-10ms response times worldwide.',
    whenToUse: [
      'Distributing static frontend assets (HTML, CSS, JS, images, videos) globally',
      'Accelerating dynamic API responses using AWS edge network routing and connection reuse',
      'Implementing edge compute (CloudFront Functions, Lambda@Edge) for URL rewrites and header manipulation'
    ],
    whenNotToUse: [
      'Internal intranet applications restricted strictly to private corporate VPCs',
      'High-throughput internal inter-service data transfer between backend containers'
    ],
    practicalImplementation: {
      cli: 'aws cloudfront create-invalidation --distribution-id EDFDVBD6EXAMPLE --paths "/*"'
    },
    security: 'Seamless integration with AWS WAF, native AWS Shield Standard DDoS protection, and HTTPS termination using ACM certificates.',
    costDrivers: 'Data transfer out from CloudFront edge locations, number of HTTP/HTTPS requests, and invalidation requests.',
    limitations: [
      'Origin Access Control is required for secure S3 access (legacy OAI is deprecated)',
      'Cache invalidations beyond the first 1,000 paths per month incur extra charges',
      'CloudFront Functions have strict execution memory (2 MB) and runtime (sub-millisecond) limits'
    ],
    commonMistakes: [
      'Leaving S3 buckets publicly readable instead of locking them down with Origin Access Control (OAC)',
      'Using invalidations for every release instead of cache-busting versioned file hashes (e.g. app.a1b2c3.js)',
      'Not configuring proper Cache-Control response headers on backend origins'
    ],
    alternatives: [
      { service: 'global-accelerator', reason: 'For non-HTTP TCP/UDP acceleration or where caching is not required' },
      { service: 'elb', reason: 'Regional load balancer without worldwide edge caching' }
    ],
    relatedServices: ['s3', 'waf', 'acm', 'route53', 'elb'],
    scenarioQuestion: {
      id: 'q-cf-01',
      question: 'A company hosts a static website on Amazon S3 behind CloudFront. Security mandates that end users must NEVER be able to access the S3 bucket directly via S3 URLs, only via CloudFront. What is the current AWS best practice?',
      type: 'single',
      options: [
        'Configure Origin Access Control (OAC) on CloudFront and attach an S3 bucket policy allowing only the CloudFront distribution.',
        'Enable S3 Block Public Access and configure Origin Access Identity (OAI) with an S3 bucket ACL.',
        'Place the S3 bucket inside a private VPC and connect CloudFront via a VPC peering connection.',
        'Deploy a Lambda@Edge function to sign all requests using S3 pre-signed URLs.'
      ],
      correctAnswers: [0],
      explanation: 'Origin Access Control (OAC) is the recommended best practice to restrict S3 bucket access exclusively to designated CloudFront distributions with SSE-KMS support.',
      whyOthersWrong: [
        'Origin Access Identity (OAI) is the legacy mechanism and lacks support for newer S3 features and KMS encryption.',
        'S3 buckets do not exist inside VPCs and CloudFront does not connect to S3 via VPC peering.',
        'Using Lambda@Edge for pre-signed URLs adds unnecessary latency and cost compared to native OAC.'
      ],
      decisiveClue: 'Restricting S3 access exclusively to CloudFront using current best practices points directly to Origin Access Control (OAC).',
      difficulty: 'intermediate',
      isOriginal: true
    },
    quickRevision: [
      'Origin Access Control (OAC) replaces legacy Origin Access Identity (OAI).',
      'CloudFront Functions = lightweight sub-millisecond edge compute (URL rewrites, header modifications).',
      'Lambda@Edge = full Node.js/Python edge compute with network access and external API calls.',
      'Data transfer from AWS origins (S3/EC2) to CloudFront is completely free.'
    ],
    sources: [
      { title: 'Amazon CloudFront Developer Guide', url: 'https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Introduction.html' },
      { title: 'Restricting S3 Access with OAC', url: 'https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-s3.html' }
    ],
    searchTerms: ['cloudfront', 'cdn', 'edge locations', 'oac', 'caching', 'invalidation']
  },
  {
    id: 'acm',
    name: 'AWS Certificate Manager',
    shortName: 'ACM',
    category: 'security',
    difficulty: 'beginner',
    importance: 'important',
    icon: 'Security',
    tagline: 'Provision, manage, and deploy public and private SSL/TLS certificates',
    mentalModel: 'An automated security locksmith that issues and automatically renews SSL/TLS certificates for AWS services for free.',
    problemItSolves: 'Eliminates the manual, error-prone overhead of purchasing, verifying, and renewing SSL/TLS encryption certificates before they expire.',
    howItWorks: 'Issues domain-validated SSL/TLS certificates through DNS or email validation, and integrates directly with ALB, CloudFront, and API Gateway for automatic certificate renewal.',
    components: [
      { name: 'Public Certificates', description: 'Free publicly trusted SSL/TLS certificates for AWS integrated services.' },
      { name: 'DNS Validation', description: 'Automated validation method using Route 53 CNAME records that enables perpetual automatic renewal.' },
      { name: 'Private Certificate Authority (AWS Private CA)', description: 'Paid service for issuing enterprise internal certificates for corporate intranets and IoT.' }
    ],
    realWorldExample: 'Securing an e-commerce website with free HTTPS certificates bound to CloudFront and Application Load Balancers with zero renewal downtime.',
    whenToUse: [
      'Securing web applications on Application Load Balancer, CloudFront, or API Gateway with HTTPS',
      'Wildcard domain encryption (e.g., `*.example.com`)',
      'Internal microservice mutual TLS (mTLS) via AWS Private CA'
    ],
    whenNotToUse: [
      'Installing certificates directly onto self-hosted EC2 operating systems or on-prem servers (ACM public certificate private keys cannot be exported)',
      'Extended Validation (EV) or Organization Validation (OV) certificates requiring corporate legal vetting'
    ],
    practicalImplementation: {
      cli: 'aws acm request-certificate --domain-name example.com --validation-method DNS --subject-alternative-names "*.example.com"'
    },
    security: 'Private keys are securely stored and rotated within AWS KMS hardware security modules, completely inaccessible to users.',
    costDrivers: 'Public SSL/TLS certificates used with AWS integrated services are 100% free; AWS Private CA incurs monthly CA fees.',
    limitations: [
      'Private keys for public ACM certificates cannot be exported or downloaded for use outside integrated AWS services',
      'Certificates for CloudFront distributions must be requested in the `us-east-1` (N. Virginia) region'
    ],
    commonMistakes: [
      'Requesting CloudFront certificates in regional locations instead of us-east-1',
      'Choosing Email validation instead of DNS validation, requiring manual email clicks for every renewal',
      'Attempting to export private keys to install on Apache/Nginx on EC2'
    ],
    alternatives: [
      { service: 'lets-encrypt', reason: 'Free open source automated certs when certificates must be installed directly on EC2 OS' },
      { service: 'private-ca', reason: 'Enterprise internal PKI with exportable private certificates' }
    ],
    relatedServices: ['cloudfront', 'elb', 'route53', 'api-gateway'],
    scenarioQuestion: {
      id: 'q-acm-01',
      question: 'A DevOps engineer wants to attach an ACM SSL/TLS certificate to an Amazon CloudFront distribution. In which AWS region must the certificate be requested in ACM?',
      type: 'single',
      options: [
        'us-east-1 (N. Virginia)',
        'The region where the S3 origin bucket resides',
        'The region closest to the majority of users',
        'Any region, as ACM certificates automatically replicate globally'
      ],
      correctAnswers: [0],
      explanation: 'CloudFront is a global service managed out of the us-east-1 region; all ACM certificates associated with CloudFront must be created in us-east-1.',
      whyOthersWrong: [
        'Origin bucket region does not affect CloudFront edge certificate location.',
        'User proximity does not dictate where ACM certificates are provisioned for CloudFront.',
        'ACM certificates are regional resources and do not automatically replicate across regions.'
      ],
      decisiveClue: 'CloudFront requires ACM certificates to reside in the us-east-1 (N. Virginia) region.',
      difficulty: 'beginner',
      isOriginal: true
    },
    quickRevision: [
      'Public certificates are free for AWS integrated services (ALB, API Gateway, CloudFront).',
      'Private keys cannot be exported from ACM public certificates.',
      'Always use DNS validation with Route 53 for seamless automatic certificate renewal.',
      'CloudFront requires certificates to be provisioned in us-east-1.'
    ],
    sources: [
      { title: 'AWS Certificate Manager User Guide', url: 'https://docs.aws.amazon.com/acm/latest/userguide/acm-overview.html' },
      { title: 'ACM DNS Validation', url: 'https://docs.aws.amazon.com/acm/latest/userguide/dns-validation.html' }
    ],
    searchTerms: ['acm', 'certificate manager', 'ssl', 'tls', 'https', 'dns validation']
  },
  {
    id: 'transit-gateway',
    name: 'AWS Transit Gateway',
    shortName: 'Transit Gateway',
    category: 'networking',
    difficulty: 'advanced',
    importance: 'important',
    icon: 'Networking',
    tagline: 'Connect thousands of VPCs and on-premises networks through a central hub',
    mentalModel: 'A massive cloud cloud-router acting as a central hub connecting hundreds of VPCs and corporate data centers in a star topology.',
    problemItSolves: 'Eliminates complex, unmanageable point-to-point mesh networks created by dozens of individual VPC peering connections.',
    howItWorks: 'Acts as a regional network transit hub. VPCs, Direct Connect gateways, and VPNs attach to the Transit Gateway, routing traffic via route tables.',
    components: [
      { name: 'Attachments', description: 'Connections between the Transit Gateway and VPCs, VPNs, or Direct Connect gateways.' },
      { name: 'Route Tables', description: 'TGW-level routing tables controlling traffic flow and network segmentation between attachments.' },
      { name: 'Transit Gateway Peering', description: 'Inter-region peering links connecting Transit Gateways across different AWS regions.' },
      { name: 'Multicast Domain', description: 'Allows routing multicast traffic between instances in attached VPCs.' }
    ],
    realWorldExample: 'An enterprise interconnecting 150 application VPCs with shared service VPCs and corporate headquarters via Direct Connect.',
    whenToUse: [
      'Scale network architectures exceeding tens or hundreds of VPCs',
      'Centralizing outbound internet inspection or shared services in a dedicated egress VPC',
      'Interconnecting multiple VPCs with on-premises VPN or Direct Connect via a single gateway'
    ],
    whenNotToUse: [
      'Small environments with only 2 or 3 VPCs (simple VPC Peering is cheaper and incurs no hourly gateway fee)',
      'High-bandwidth data transfer between two specific VPCs where VPC Peering has zero processing fees'
    ],
    practicalImplementation: {
      cli: 'aws ec2 create-transit-gateway --description "Enterprise Core Transit Hub" --options AmazonSideAsn=64512'
    },
    security: 'Supports network segmentation via separate route tables (e.g. keeping Dev VPCs isolated from Prod VPCs). Enables inspection VPC routing.',
    costDrivers: 'Hourly rate per Transit Gateway attachment plus data processing charges per GB.',
    limitations: [
      'Data processing fee ($0.02/GB) can become costly for ultra-high throughput data pipelines',
      'Maximum bandwidth per VPC attachment is up to 50 Gbps per AZ burst'
    ],
    commonMistakes: [
      'Using Transit Gateway for only two VPCs instead of VPC Peering, adding unnecessary attachment and processing costs',
      'Failing to implement multiple TGW route tables to segment dev and production traffic',
      'Forgetting that VPC subnets still need local route table entries pointing to the Transit Gateway ID'
    ],
    alternatives: [
      { service: 'vpc-peering', reason: 'Direct 1:1 connection with zero gateway cost and no per-GB processing fee' },
      { service: 'cloud-wan', reason: 'Global policy-driven wide area network across multiple regions' }
    ],
    relatedServices: ['vpc', 'direct-connect', 'network-firewall'],
    scenarioQuestion: {
      id: 'q-tgw-01',
      question: 'An enterprise has 80 VPCs across two regions and an on-premises data center. The networking team needs a scalable architecture that avoids full mesh peering, supports transitive routing, and enforces network isolation between environments. What should they deploy?',
      type: 'single',
      options: [
        'AWS Transit Gateway in each region with inter-region peering and separate route tables for environment isolation.',
        'Full mesh VPC Peering across all 80 VPCs with customer gateway IPsec tunnels to each VPC.',
        'AWS Direct Connect connections provisioned separately to every individual VPC.',
        'NAT Gateways in every VPC connected to an Internet Gateway hub.'
      ],
      correctAnswers: [0],
      explanation: 'AWS Transit Gateway simplifies network topology to a hub-and-spoke model, supports transitive routing, and isolates environments using multiple route tables.',
      whyOthersWrong: [
        'Full mesh VPC peering requires N*(N-1)/2 connections (over 3,000 links) and does not support transitive routing.',
        'Provisioning Direct Connect to each VPC individually is unscalable and cost-prohibitive.',
        'NAT Gateways only facilitate outbound internet access, not private VPC-to-VPC routing.'
      ],
      decisiveClue: 'Hub-and-spoke multi-VPC routing with transitive connectivity requires AWS Transit Gateway.',
      difficulty: 'advanced',
      isOriginal: true
    },
    quickRevision: [
      'Solves the N*(N-1)/2 mesh complexity of VPC Peering.',
      'Supports transitive routing (VPC A -> TGW -> VPC B -> on-premises).',
      'Route table isolation allows true network multi-tenancy and perimeter inspection.',
      'Incurs hourly attachment charges and data processing fees per GB.'
    ],
    sources: [
      { title: 'AWS Transit Gateway User Guide', url: 'https://docs.aws.amazon.com/vpc/latest/tgw/what-is-tgw.html' },
      { title: 'Transit Gateway Best Practices', url: 'https://aws.amazon.com/blogs/networking-and-content-delivery/' }
    ],
    searchTerms: ['transit gateway', 'tgw', 'hub and spoke', 'transitive routing', 'cloud router']
  },
  {
    id: 'network-firewall',
    name: 'AWS Network Firewall',
    shortName: 'Network Firewall',
    category: 'security',
    difficulty: 'advanced',
    importance: 'supporting',
    icon: 'Security',
    tagline: 'Stateful, managed network firewall and intrusion detection and prevention service for VPC',
    mentalModel: 'A dedicated high-speed security inspection checkpoint stationed at your VPC perimeter inspecting all network packets up to Layer 7.',
    problemItSolves: 'Provides deep packet inspection (DPI), URL/domain filtering, and intrusion prevention (IPS) without managing third-party firewall appliances.',
    howItWorks: 'Deploys managed Suricata-compatible firewall endpoints into dedicated firewall subnets inside your VPC, routing traffic through them before reaching destinations.',
    components: [
      { name: 'Firewall Policy', description: 'Defines the stateless and stateful rule groups that evaluate network traffic.' },
      { name: 'Stateless Rule Groups', description: 'Fast packet inspection based on 5-tuple (source/destination IP, port, protocol).' },
      { name: 'Stateful Rule Groups', description: 'Suricata-compatible deep packet inspection, domain list filtering, and intrusion prevention rules.' },
      { name: 'Firewall Endpoints', description: 'VPC endpoints placed in dedicated subnets where traffic is routed for inspection.' }
    ],
    realWorldExample: 'Blocking outbound egress traffic to all internet destinations except an approved list of corporate partner API domains.',
    whenToUse: [
      'Enterprise environments needing deep packet inspection (DPI) and Layer 7 intrusion prevention (IPS)',
      'Enforcing strict domain-name whitelisting for outbound HTTP/HTTPS traffic',
      'Fulfilling compliance mandates (PCI-DSS, HIPAA) requiring dedicated network firewalls'
    ],
    whenNotToUse: [
      'Simple IP and port restrictions (use native Security Groups and Network ACLs)',
      'Web application Layer 7 HTTP exploits like SQL injection and XSS (use AWS WAF on ALB or CloudFront)'
    ],
    practicalImplementation: {
      cli: 'aws network-firewall create-firewall --firewall-name inspection-fw --firewall-policy-arn arn:aws:network-firewall:us-east-1:123456789012:firewall-policy/my-policy --vpc-id vpc-0123456789 --subnet-mappings SubnetId=subnet-12345'
    },
    security: 'Maintains stateful session tables, detects malicious intrusion signatures, and logs alerts directly to CloudWatch Logs or S3.',
    costDrivers: 'Hourly fee per firewall endpoint per AZ plus GB of traffic processed through the firewall.',
    limitations: [
      'Requires dedicated subnets and careful route table manipulation (e.g. ingress routing)',
      'Higher baseline cost than Security Groups, making it less suitable for small startups'
    ],
    commonMistakes: [
      'Placing firewall endpoints in the same subnet as workloads instead of dedicated firewall subnets',
      'Routing traffic directly to NAT Gateway or IGW without directing VPC route tables through the firewall endpoint',
      'Confusing AWS Network Firewall with AWS WAF'
    ],
    alternatives: [
      { service: 'waf', reason: 'Focuses on application layer HTTP/S attacks on ALB, CloudFront, and API Gateway' },
      { service: 'security-groups-nacls', reason: 'Free, simple Layer 4 IP/port filtering' }
    ],
    relatedServices: ['vpc', 'transit-gateway', 'firewall-manager', 'waf'],
    scenarioQuestion: {
      id: 'q-anf-01',
      question: 'A financial company needs to inspect all outbound traffic from private EC2 instances to the internet, enforcing deep packet inspection (DPI) and blocking any connection attempts not matching an approved domain whitelist. Which service provides this capability?',
      type: 'single',
      options: [
        'AWS Network Firewall deployed in an inspection VPC.',
        'AWS WAF associated with an internet-facing Application Load Balancer.',
        'Network ACLs applied to private subnets with deny rules.',
        'Amazon GuardDuty with automated Lambda remediation.'
      ],
      correctAnswers: [0],
      explanation: 'AWS Network Firewall provides stateful deep packet inspection (DPI), Suricata-compatible rules, and domain list filtering for VPC egress traffic.',
      whyOthersWrong: [
        'AWS WAF inspects inbound HTTP/HTTPS traffic to load balancers, not general outbound VPC network egress.',
        'NACLs are stateless and operate only on IP CIDRs and ports, incapable of domain-name inspection or DPI.',
        'GuardDuty detects anomalous behavior passively after the fact; it does not perform inline deep packet filtering.'
      ],
      decisiveClue: 'Deep packet inspection (DPI) and domain list filtering for VPC egress points to AWS Network Firewall.',
      difficulty: 'advanced',
      isOriginal: true
    },
    quickRevision: [
      'Built-in integration with open-source Suricata rule specifications.',
      'Requires dedicated subnets and route table redirection.',
      'AWS WAF = Web Application Layer (ALB/CloudFront/APIGW); Network Firewall = VPC Network Layer (L3-L7 packets).',
      'Can be managed across hundreds of accounts using AWS Firewall Manager.'
    ],
    sources: [
      { title: 'AWS Network Firewall Documentation', url: 'https://docs.aws.amazon.com/network-firewall/' },
      { title: 'Deployment Models for AWS Network Firewall', url: 'https://aws.amazon.com/blogs/networking-and-content-delivery/' }
    ],
    searchTerms: ['network firewall', 'dpi', 'suricata', 'ips', 'ids', 'domain filtering']
  },
  {
    id: 'direct-connect',
    name: 'AWS Direct Connect',
    shortName: 'Direct Connect / DX',
    category: 'networking',
    difficulty: 'advanced',
    importance: 'important',
    icon: 'Networking',
    tagline: 'Dedicated, private physical network connection from your premises to AWS',
    mentalModel: 'A private physical fiber-optic cable plugged directly from your on-premises data center into an AWS facility, bypassing the public internet completely.',
    problemItSolves: 'Eliminates the unpredictability, high jitter, and potential security exposures of sending corporate traffic over the public internet.',
    howItWorks: 'Establishes a dedicated 1 Gbps, 10 Gbps, or 100 Gbps physical Ethernet connection between your router and an AWS Direct Connect location.',
    components: [
      { name: 'Direct Connect Location', description: 'Co-location facility where your equipment interconnects with AWS network infrastructure.' },
      { name: 'Virtual Interfaces (VIF)', description: 'Private VIF (for VPC access), Public VIF (for public AWS services like S3), and Transit VIF (for Transit Gateway).' },
      { name: 'Direct Connect Gateway', description: 'Globally available resource that allows connecting one DX connection to VPCs across multiple regions.' },
      { name: 'MACsec (802.1AE)', description: 'Point-to-point Layer 2 encryption available on dedicated 10 Gbps and 100 Gbps ports.' }
    ],
    realWorldExample: 'A bank transferring hundreds of gigabytes of real-time trading data daily between private on-premises mainframes and AWS VPCs.',
    whenToUse: [
      'High-throughput, consistent data transfers requiring predictable low latency',
      'Workloads handling sensitive compliance data that cannot traverse the public internet',
      'Massive data migrations where public internet bandwidth is insufficient or cost-prohibitive'
    ],
    whenNotToUse: [
      'Small offices needing quick setup with low bandwidth (use AWS Site-to-Site VPN)',
      'Backup connectivity that must be provisioned instantly in minutes (DX takes weeks to physically cable)'
    ],
    practicalImplementation: {
      cli: 'aws directconnect describe-connections --region us-east-1'
    },
    security: 'Traffic is physically isolated from the public internet. Can overlay IPsec VPN or utilize MACsec for wire-speed encryption.',
    costDrivers: 'Port hours (based on connection speed) plus significantly reduced outbound data transfer rates compared to standard internet egress.',
    limitations: [
      'Lead time to provision dedicated cross-connects can take days to weeks',
      'Direct Connect does NOT encrypt traffic natively by default; MACsec or IPsec VPN over DX must be configured for in-flight encryption',
      'Requires redundant physical connections for high availability resilience'
    ],
    commonMistakes: [
      'Assuming Direct Connect encrypts traffic automatically over the wire',
      'Deploying a single connection for production without a redundant DX link or backup Site-to-Site VPN',
      'Not configuring BGP bidirectional forwarding detection (BFD) for fast failover'
    ],
    alternatives: [
      { service: 'site-to-site-vpn', reason: 'Fast setup over public internet with IPsec encryption within minutes' },
      { service: 'transit-gateway', reason: 'Centralized network router coordinating DX and VPN attachments' }
    ],
    relatedServices: ['transit-gateway', 'vpc', 'site-to-site-vpn'],
    scenarioQuestion: {
      id: 'q-dx-01',
      question: 'An enterprise requires a dedicated private connection between its on-premises headquarters and multiple VPCs across different AWS regions. The connection must offer consistent latency and reduce internet egress data transfer costs. What is the recommended architecture?',
      type: 'single',
      options: [
        'AWS Direct Connect with a Direct Connect Gateway attached to a Transit VIF or Private VIFs.',
        'AWS Site-to-Site VPN with multiple customer gateways.',
        'AWS Transit Gateway peering with public VPC Internet Gateways.',
        'VPC Peering over public internet using Route 53 latency routing.'
      ],
      correctAnswers: [0],
      explanation: 'AWS Direct Connect with a Direct Connect Gateway enables private, dedicated connectivity to multiple VPCs across any AWS region (except China) with reduced egress rates.',
      whyOthersWrong: [
        'Site-to-Site VPN traverses the public internet, suffering from variable latency and higher standard egress charges.',
        'Transit Gateway cannot peer directly with public Internet Gateways.',
        'VPC Peering connects VPCs inside AWS; it cannot connect to on-premises networks.'
      ],
      decisiveClue: 'Dedicated private physical connection spanning multiple regions with reduced egress costs specifies Direct Connect Gateway.',
      difficulty: 'advanced',
      isOriginal: true
    },
    quickRevision: [
      'Connection speeds: 1 Gbps, 10 Gbps, 100 Gbps (or 50M-10G hosted connections via APN partners).',
      'Traffic is NOT encrypted by default; use MACsec or IPsec VPN on top of DX.',
      'Direct Connect Gateway enables multi-region VPC connectivity from a single connection.',
      'Significant data transfer discount compared to standard internet data transfer out.'
    ],
    sources: [
      { title: 'AWS Direct Connect User Guide', url: 'https://docs.aws.amazon.com/directconnect/latest/UserGuide/Welcome.html' },
      { title: 'Direct Connect Resiliency Recommendations', url: 'https://aws.amazon.com/directconnect/resiliency-recommendation/' }
    ],
    searchTerms: ['direct connect', 'dx', 'vif', 'dedicated connection', 'macsec', 'hybrid cloud']
  },
  {
    id: 'global-accelerator',
    name: 'AWS Global Accelerator',
    shortName: 'Global Accelerator',
    category: 'networking',
    difficulty: 'advanced',
    importance: 'supporting',
    icon: 'Networking',
    tagline: 'Improve global application availability and performance using the AWS global network backbone',
    mentalModel: 'An express VIP lane on the AWS global private fiber network that onboard client traffic at the nearest edge location directly to your backend.',
    problemItSolves: 'Overcomes public internet packet loss, routing congestion, and DNS caching delays for both TCP and UDP workloads.',
    howItWorks: 'Provides two static anycast IP addresses. Traffic enters the AWS global network at the closest edge location and travels over AWS high-speed fiber directly to regional endpoints.',
    components: [
      { name: 'Static Anycast IP Addresses', description: 'Two globally unique IP addresses that serve as the single entry point for client traffic worldwide.' },
      { name: 'Accelerator', description: 'The resource that directs traffic to optimal regional endpoints based on health, geography, and routing policies.' },
      { name: 'Listeners', description: 'Processes that route inbound connections based on port and protocol (TCP/UDP).' },
      { name: 'Endpoint Groups', description: 'Collections of endpoints (ALBs, NLBs, EC2, or Elastic IPs) in one or more AWS Regions.' }
    ],
    realWorldExample: 'Multi-player gaming platform or financial trading API requiring sub-second regional failover and static IP allowlisting without DNS delay.',
    whenToUse: [
      'TCP/UDP non-HTTP applications (gaming, VoIP, IoT, financial protocols)',
      'Instant disaster recovery failover across multiple AWS regions without waiting for DNS TTL propagation',
      'Clients that require whitelisting static IPs that do not change during failover'
    ],
    whenNotToUse: [
      'HTTP web applications requiring static edge caching and CDN features (use CloudFront)',
      'Pure regional workloads confined to a single geographic area'
    ],
    practicalImplementation: {
      cli: 'aws globalaccelerator create-accelerator --name prod-accelerator --ip-address-type IPV4'
    },
    security: 'Protects backend endpoints by hiding origin IPs behind AWS global edge infrastructure and absorbs DDoS attacks at edge.',
    costDrivers: 'Fixed hourly fee per accelerator plus data transfer premium (Dominant Direction data transfer).',
    limitations: [
      'Does not cache content at edge locations (unlike CloudFront)',
      'Higher baseline hourly cost compared to simple Route 53 DNS routing'
    ],
    commonMistakes: [
      'Using Global Accelerator instead of CloudFront for static website caching',
      'Confusing Global Accelerator with Route 53 Latency routing (Global Accelerator bypasses DNS caching entirely using anycast IPs)',
      'Forgetting that endpoint health checks must be enabled in endpoint groups'
    ],
    alternatives: [
      { service: 'cloudfront', reason: 'Better suited for HTTP caching and static web delivery' },
      { service: 'route53', reason: 'Lower cost DNS-based routing when clients can tolerate DNS TTL caching during failovers' }
    ],
    relatedServices: ['elb', 'ec2', 'route53', 'cloudfront'],
    scenarioQuestion: {
      id: 'q-ga-01',
      question: 'A real-time multiplayer gaming company uses custom UDP and TCP protocols across servers in Europe and North America. Client devices have strict firewalls that require two fixed static IP addresses. Failover between regions must happen within seconds without depending on DNS TTL updates. Which service should they choose?',
      type: 'single',
      options: [
        'AWS Global Accelerator',
        'Amazon CloudFront',
        'Amazon Route 53 with Multivalue Answer routing',
        'Application Load Balancer with Elastic IPs'
      ],
      correctAnswers: [0],
      explanation: 'AWS Global Accelerator provides 2 static Anycast IP addresses, supports TCP/UDP, routes traffic over the AWS private global backbone, and fails over within seconds without DNS caching.',
      whyOthersWrong: [
        'Amazon CloudFront supports only HTTP/HTTPS/WebSocket protocols and does not provide static IPs for UDP.',
        'Route 53 relies on client DNS resolvers respecting TTLs, which frequently delays failover by minutes or hours.',
        'ALBs do not support static Elastic IPs directly and are regional HTTP/HTTPS load balancers.'
      ],
      decisiveClue: 'Static anycast IPs, UDP support, and sub-minute failover bypassing DNS point directly to Global Accelerator.',
      difficulty: 'advanced',
      isOriginal: true
    },
    quickRevision: [
      'Provides 2 static Anycast IPv4 addresses.',
      'Supports both TCP and UDP protocols (CloudFront only supports HTTP/HTTPS).',
      'Instant health-check failover bypassing DNS TTL delays.',
      'Routes traffic over the private AWS global fiber backbone rather than the public internet.'
    ],
    sources: [
      { title: 'AWS Global Accelerator Developer Guide', url: 'https://docs.aws.amazon.com/global-accelerator/latest/dg/what-is-global-accelerator.html' },
      { title: 'Global Accelerator vs CloudFront', url: 'https://aws.amazon.com/global-accelerator/faqs/' }
    ],
    searchTerms: ['global accelerator', 'anycast ip', 'udp acceleration', 'instant failover', 'aws backbone']
  },
  {
    id: 'vpc-endpoints',
    name: 'AWS VPC Endpoints',
    shortName: 'VPC Endpoints / PrivateLink',
    category: 'networking',
    difficulty: 'intermediate',
    importance: 'important',
    icon: 'Networking',
    tagline: 'Privately connect your VPC to supported AWS and third-party services',
    mentalModel: 'A private tunnel entrance inside your VPC that connects directly to AWS services like S3 or DynamoDB without passing through an Internet Gateway or NAT Gateway.',
    problemItSolves: 'Enables private subnets to communicate with AWS services without requiring expensive NAT Gateways or exposing traffic to the public internet.',
    howItWorks: 'Creates private routing constructs or Elastic Network Interfaces (ENIs) with private IPs inside your VPC subnets that route directly to AWS service endpoints.',
    components: [
      { name: 'Gateway Endpoints', description: 'Free routing table targets supported exclusively for Amazon S3 and Amazon DynamoDB.' },
      { name: 'Interface Endpoints (AWS PrivateLink)', description: 'Paid Elastic Network Interfaces (ENIs) with private IP addresses supporting 100+ AWS services and custom SaaS.' },
      { name: 'Gateway Load Balancer Endpoints', description: 'Dedicated endpoints directing traffic transparently to third-party security appliances.' },
      { name: 'Endpoint Policies', description: 'Resource-based IAM policies attached to endpoints restricting what actions and users can traverse the endpoint.' }
    ],
    realWorldExample: 'Allowing private EC2 instances without internet access to download objects from Amazon S3 and write records to Amazon DynamoDB privately and at zero cost.',
    whenToUse: [
      'Connecting to S3 and DynamoDB from private subnets (use Gateway Endpoints - 100% free)',
      'Connecting to KMS, Secrets Manager, CloudWatch, or SQS privately without a NAT Gateway (Interface Endpoints)',
      'Exposing private APIs or services to partner AWS accounts securely via PrivateLink'
    ],
    whenNotToUse: [
      'Accessing arbitrary third-party public web APIs on the internet (requires NAT Gateway or IGW)',
      'Connecting to on-prem databases (use Site-to-Site VPN or Direct Connect)'
    ],
    practicalImplementation: {
      cli: 'aws ec2 create-vpc-endpoint --vpc-id vpc-12345678 --service-name com.amazonaws.us-east-1.s3 --route-table-ids rtb-12345678'
    },
    security: 'Eliminates public internet exposure. Endpoint policies enforce granular authorization on which buckets or resources can be accessed.',
    costDrivers: 'Gateway Endpoints for S3 and DynamoDB are completely free. Interface Endpoints incur an hourly ENI fee plus data processing per GB.',
    limitations: [
      'Gateway endpoints cannot be accessed from on-premises over Direct Connect or VPN (must use Interface endpoints for S3 from on-prem)',
      'Gateway endpoints are limited strictly to S3 and DynamoDB',
      'Interface endpoints require private DNS resolution to be enabled in VPC settings'
    ],
    commonMistakes: [
      'Routing S3 traffic through a NAT Gateway and paying heavy NAT data transfer fees instead of configuring a free S3 Gateway Endpoint',
      'Forgetting to attach the Gateway Endpoint to the relevant subnet route tables',
      'Blocking DNS resolution or security group port 443 to the Interface Endpoint ENI'
    ],
    alternatives: [
      { service: 'nat-gateway', reason: 'Provides general outbound internet connectivity to any public domain, not just AWS services' },
      { service: 'vpc-peering', reason: 'Connects two VPCs rather than connecting to managed AWS API endpoints' }
    ],
    relatedServices: ['s3', 'dynamodb', 'vpc', 'kms', 'secrets-manager'],
    scenarioQuestion: {
      id: 'q-vpce-01',
      question: 'A fleet of EC2 instances in private subnets processes petabytes of data from Amazon S3. The company notices exorbitant monthly NAT Gateway data processing charges on their bill. How can they eliminate these data processing fees while maintaining secure private S3 connectivity?',
      type: 'single',
      options: [
        'Create an S3 Gateway VPC Endpoint and associate it with the private subnets\' route tables.',
        'Deploy an Internet Gateway and assign public Elastic IPs to all private EC2 instances.',
        'Migrate from S3 to an Amazon EFS file system mounted across all instances.',
        'Create an S3 Interface VPC Endpoint in every private subnet.'
      ],
      correctAnswers: [0],
      explanation: 'S3 Gateway VPC Endpoints are completely free of charge and keep all S3 traffic entirely within the AWS private network, bypassing NAT Gateway costs.',
      whyOthersWrong: [
        'Assigning public IPs and an IGW destroys private network isolation and violates security best practices.',
        'Migrating petabytes to EFS would exponentially increase storage costs compared to S3.',
        'While S3 Interface Endpoints work, they incur hourly ENI and per-GB data processing fees, whereas Gateway Endpoints are completely free.'
      ],
      decisiveClue: 'Eliminating NAT Gateway data processing costs for Amazon S3 privately points directly to a Gateway VPC Endpoint.',
      difficulty: 'intermediate',
      isOriginal: true
    },
    quickRevision: [
      'Gateway Endpoints = S3 and DynamoDB only. Completely FREE, no hourly or per-GB charge.',
      'Interface Endpoints = Powered by PrivateLink, creates ENI in subnet, charges hourly + per-GB.',
      'To access S3 privately from on-premises via Direct Connect, use an S3 Interface Endpoint.',
      'Endpoint policies can restrict which S3 buckets or DynamoDB tables can be reached through the endpoint.'
    ],
    sources: [
      { title: 'AWS VPC Endpoints User Guide', url: 'https://docs.aws.amazon.com/vpc/latest/privatelink/vpc-endpoints.html' },
      { title: 'Gateway Endpoints for S3', url: 'https://docs.aws.amazon.com/vpc/latest/privatelink/vpc-endpoints-s3.html' }
    ],
    searchTerms: ['vpc endpoint', 'privatelink', 'gateway endpoint', 'interface endpoint', 's3 private']
  },
  {
    id: 'security-groups-nacls',
    name: 'Security Groups & Network ACLs',
    shortName: 'SG & NACLs',
    category: 'networking',
    difficulty: 'intermediate',
    importance: 'essential',
    icon: 'Networking',
    tagline: 'Virtual firewalls providing defense-in-depth security at instance and subnet levels',
    mentalModel: 'Security Groups are security guards checking IDs at every building doorway (instance level), while NACLs are perimeter border gates checking cars at city borders (subnet level).',
    problemItSolves: 'Controls and filters inbound and outbound IP traffic at both instance ENI and subnet boundaries.',
    howItWorks: 'Security Groups evaluate rules statefully at the ENI level (all allow rules by default). NACLs evaluate numbered allow/deny rules statelessly at subnet boundaries.',
    components: [
      { name: 'Security Groups', description: 'Stateful virtual firewalls operating at the instance/ENI level, supporting allow rules only.' },
      { name: 'Network ACLs (NACL)', description: 'Stateless virtual firewalls operating at the subnet level, supporting numbered allow and deny rules.' },
      { name: 'Ephemeral Ports', description: 'Dynamic port ranges (1024-65535) required in NACL inbound/outbound rules to allow return traffic.' },
      { name: 'Default Rules', description: 'Default SG allows all outbound and blocks inbound; default NACL allows all inbound and outbound.' }
    ],
    realWorldExample: 'Allowing port 443 to web instances via Security Group while blocking a specific malicious IP range using a subnet NACL deny rule.',
    whenToUse: [
      'Security Groups: Every EC2 instance, RDS database, ALB, or Lambda VPC interface for granular instance firewalling',
      'NACLs: Enforcing subnet-wide IP blacklisting (explicit deny) or coarse perimeter controls',
      'Security Groups referencing other Security Groups to permit traffic without hardcoding IP addresses'
    ],
    whenNotToUse: [
      'Deep packet inspection, domain filtering, or Layer 7 inspection (use AWS Network Firewall or AWS WAF)',
      'Blocking a single specific IP address using a Security Group (SGs do not support deny rules; use NACL)'
    ],
    practicalImplementation: {
      cli: 'aws ec2 authorize-security-group-ingress --group-id sg-12345678 --protocol tcp --port 443 --cidr 0.0.0.0/0'
    },
    security: 'Defense-in-depth: Traffic must pass through the subnet NACL first, then the instance Security Group before reaching the operating system.',
    costDrivers: 'Both Security Groups and Network ACLs are completely free features of Amazon VPC.',
    limitations: [
      'Security Groups support ALLOW rules only (cannot explicitly DENY an IP address)',
      'NACLs are stateless; outbound ephemeral port return rules must be explicitly configured',
      'Quota limits on number of rules per Security Group (typically 60 rules) and NACL (typically 20 rules)'
    ],
    commonMistakes: [
      'Opening ephemeral ports in Security Groups (unnecessary because Security Groups are stateful)',
      'Forgetting to add outbound ephemeral port allow rules (1024-65535) in custom NACLs, causing inbound traffic to fail on response',
      'Hardcoding IP addresses in SG rules instead of referencing source Security Groups by ID'
    ],
    alternatives: [
      { service: 'network-firewall', reason: 'For deep packet inspection and intrusion prevention' },
      { service: 'waf', reason: 'For Layer 7 HTTP filtering against SQL injection and XSS' }
    ],
    relatedServices: ['vpc', 'ec2', 'elb', 'rds'],
    scenarioQuestion: {
      id: 'q-sgnacl-01',
      question: 'A security operations team discovers that a known malicious IP address (198.51.100.25) is launching brute-force attacks against servers in a public subnet. How can the team immediately block this specific IP address from reaching any resource in the subnet?',
      type: 'single',
      options: [
        'Add a DENY rule for 198.51.100.25/32 with a low rule number to the subnet\'s inbound Network ACL.',
        'Add a DENY rule for 198.51.100.25/32 to the EC2 instances\' Security Group.',
        'Remove port 80 and 443 from the subnet Route Table.',
        'Configure an IAM policy that denies requests originating from 198.51.100.25.'
      ],
      correctAnswers: [0],
      explanation: 'Security Groups only support ALLOW rules and cannot explicitly deny an IP. Network ACLs support numbered ALLOW and DENY rules evaluated in numerical order.',
      whyOthersWrong: [
        'Security Groups do not support DENY rules.',
        'Route tables control packet routing destinations (CIDRs to gateways), not port-level firewall filtering.',
        'IAM policies govern AWS API calls, not raw network TCP traffic to EC2 instances.'
      ],
      decisiveClue: 'Explicitly blocking (denying) a single specific IP address requires a Network ACL DENY rule.',
      difficulty: 'intermediate',
      isOriginal: true
    },
    quickRevision: [
      'Security Group = Stateful, operates at ENI/instance level, ALLOW rules only.',
      'Network ACL = Stateless, operates at Subnet level, ALLOW and DENY rules evaluated in numerical order.',
      'Stateful means if traffic is allowed inbound, response traffic is automatically allowed outbound regardless of outbound rules.',
      'Stateless means return traffic must explicitly match an outbound rule (requires ephemeral ports 1024-65535).'
    ],
    sources: [
      { title: 'Security Groups for Amazon EC2', url: 'https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-security-groups.html' },
      { title: 'Network ACLs in Amazon VPC', url: 'https://docs.aws.amazon.com/vpc/latest/userguide/vpc-network-acls.html' }
    ],
    searchTerms: ['security groups', 'nacl', 'network acl', 'stateful', 'stateless', 'firewall', 'ephemeral ports']
  }
];
