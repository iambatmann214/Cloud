import { Comparison } from '../../types';

export const networkingComparisons: Comparison[] = [
  {
    id: 'igw-vs-nat',
    title: 'Internet Gateway vs NAT Gateway',
    category: 'Networking',
    serviceA: 'Internet Gateway (IGW)',
    serviceB: 'NAT Gateway',
    problem: 'Connecting VPC resources to the internet while controlling inbound versus outbound traffic directions.',
    decisiveDifferences: [
      'Traffic Direction: An Internet Gateway enables bi-directional traffic (both internet-inbound and internet-outbound); a NAT Gateway enables egress-only traffic (outbound to internet only, blocking all unsolicited inbound connections from the internet).',
      'Address Translation: IGW performs 1:1 public-to-private IP mapping for instances assigned public IPv4 addresses; NAT Gateway translates private IPv4 addresses from many private subnet instances into a single Elastic IP (1:many Source NAT).',
      'Subnet Placement & Routing: IGW is attached to the VPC at the VPC edge; NAT Gateway is deployed inside a public subnet (with a route to IGW) and serves private subnets via their route tables.',
      'Pricing: IGW is completely free of hourly or data processing charges; NAT Gateway incurs an hourly charge (~$0.045/hour per AZ) plus per-GB data processing fees (~$0.045/GB).'
    ],
    whenToChooseA: [
      'Public-facing resources that must receive unsolicited inbound connections from the internet (e.g., Public ALBs, bastion hosts).',
      'Architectures where resources have public IPv4 or IPv6 (GUA) addresses and handle their own security boundaries.',
      'Cost-sensitive architectures where public subnets with direct IGW routes avoid NAT Gateway data processing fees.'
    ],
    whenToChooseB: [
      'Backend EC2 instances, containers, or RDS databases in private subnets that need outbound internet access for OS patches, external API calls, or package downloads.',
      'Preventing direct inbound internet reachability to critical workload instances.',
      'Satisfying compliance mandates that prohibit public IP addresses on application and database tiers.'
    ],
    workTogether: 'A NAT Gateway cannot function without an Internet Gateway. The NAT Gateway sits in a public subnet with a default route (0.0.0.0/0) pointing to the Internet Gateway, while private subnet instances point their default route (0.0.0.0/0) to the NAT Gateway.',
    tradeoffs: [
      {
        dimension: 'Inbound Reachability',
        optionA: 'Bi-directional: Allows incoming internet traffic if Security Groups and NACLs permit.',
        optionB: 'Outbound only: Strictly blocks all direct inbound connections initiated from internet.'
      },
      {
        dimension: 'Cost',
        optionA: 'Free (no hourly charge, no processing fee; standard data transfer out applies).',
        optionB: 'Hourly charge (~$0.045/hr) + per-GB data processing charge (~$0.045/GB).'
      },
      {
        dimension: 'Public IP Requirement',
        optionA: 'Instance must have a public IPv4 or Elastic IP attached.',
        optionB: 'Instances keep strictly private IPs; NAT Gateway owns the Elastic IP.'
      }
    ],
    scenario: 'A three-tier web application places its public Application Load Balancer in a public subnet with a route to an Internet Gateway. Its backend application EC2 instances reside in private subnets with routes to a NAT Gateway, allowing them to download security updates from external repos while remaining unreachable from the public internet.',
    question: {
      id: 'quiz-igw-vs-nat-1',
      question: 'A company has backend application instances in a private subnet that must download security patches from public Linux repositories. The instances must never accept inbound connections from the internet. How should the network be configured?',
      type: 'single',
      options: [
        'Assign Elastic IPs directly to the backend instances and route 0.0.0.0/0 to an Internet Gateway',
        'Deploy a NAT Gateway in a public subnet, route the private subnet 0.0.0.0/0 traffic to the NAT Gateway, and route the public subnet 0.0.0.0/0 traffic to an Internet Gateway',
        'Attach an Internet Gateway directly to the private subnet route table',
        'Deploy a NAT Gateway directly inside the private subnet with an attached Elastic IP'
      ],
      correctAnswers: [1],
      explanation: 'A NAT Gateway must reside in a public subnet (with a route to an Internet Gateway). Private subnet route tables route 0.0.0.0/0 to the NAT Gateway, providing outbound-only internet connectivity without exposing backend instances.',
      whyOthersWrong: [
        'Assigning Elastic IPs and routing directly to an IGW makes instances public, exposing them to inbound internet traffic.',
        'Internet Gateways are VPC-wide attachments, and routing a private subnet directly to an IGW makes it a public subnet.',
        'A NAT Gateway deployed in a private subnet cannot reach the internet because it needs a path to an Internet Gateway.'
      ],
      decisiveClue: 'Private subnet instances must download external patches but strictly reject all inbound internet connections.',
      difficulty: 'beginner',
      isOriginal: true,
      source: 'Original AWS certification-style practice question'
    },
    sources: [
      { title: 'AWS Internet Gateways', url: 'https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Internet_Gateway.html' },
      { title: 'AWS NAT Gateways', url: 'https://docs.aws.amazon.com/vpc/latest/userguide/vpc-nat-gateway.html' }
    ]
  },
  {
    id: 'nat-vs-vpc-endpoints',
    title: 'NAT Gateway vs VPC Endpoints',
    category: 'Networking',
    serviceA: 'NAT Gateway',
    serviceB: 'VPC Endpoints (AWS PrivateLink / Gateway)',
    problem: 'Accessing AWS APIs (such as S3, DynamoDB, SQS, Secrets Manager) from private subnets without exposing traffic to the public internet.',
    decisiveDifferences: [
      'Traffic Path: NAT Gateway routes traffic out through the public internet to reach public AWS service endpoints; VPC Endpoints keep traffic entirely within the AWS private global network backbone.',
      'Scope of Destinations: NAT Gateway can route to ANY external IP address or third-party API across the entire internet; VPC Endpoints connect strictly to specific AWS services or PrivateLink partner services.',
      'Cost Structure: NAT Gateway charges an hourly fee plus $0.045/GB data processing; Gateway Endpoints (for S3 and DynamoDB) are 100% free with no data processing fees, making S3/DynamoDB traffic vastly cheaper.',
      'Security Posture: NAT Gateway requires outbound internet routing; VPC Endpoints allow total internet isolation (no IGW or NAT needed in the VPC) and support Endpoint Policies to restrict access to specific AWS accounts or resources.'
    ],
    whenToChooseA: [
      'Private instances need to reach external third-party APIs, SaaS providers (Stripe, GitHub, Salesforce), or public package repositories (npm, PyPI).',
      'The VPC has varied outbound internet requirements that cannot be fulfilled by AWS-managed services alone.'
    ],
    whenToChooseB: [
      'Private instances need to access AWS services (S3, DynamoDB, SQS, SNS, KMS, Secrets Manager, ECR).',
      'Optimizing costs when transferring terabytes of data between private EC2/containers and S3 or DynamoDB (using free Gateway Endpoints).',
      'High-security compliance environments where outbound internet access (0.0.0.0/0) is strictly prohibited.'
    ],
    workTogether: 'A private subnet routes generic outbound traffic (0.0.0.0/0) to a NAT Gateway for third-party SaaS APIs, while routing S3 and DynamoDB traffic directly through free VPC Gateway Endpoints to bypass the NAT Gateway and eliminate NAT data processing charges.',
    tradeoffs: [
      {
        dimension: 'Destination Scope',
        optionA: 'Any public IPv4 internet destination (AWS + 3rd-party).',
        optionB: 'Specific AWS services or PrivateLink endpoint services only.'
      },
      {
        dimension: 'S3 / DynamoDB Traffic Cost',
        optionA: 'Expensive: $0.045/GB NAT data processing fee on every gigabyte.',
        optionB: 'Free: $0.00/GB data processing fee for Gateway Endpoints.'
      },
      {
        dimension: 'Network Perimeter Security',
        optionA: 'Requires maintaining egress route to internet.',
        optionB: 'Enables complete air-gapped isolation with zero outbound internet routes.'
      }
    ],
    scenario: 'An analytics cluster in a private VPC processes 50 TB of data per month from Amazon S3. By adding an S3 Gateway VPC Endpoint instead of routing through the existing NAT Gateway, the company eliminates over $2,250 per month in NAT data processing charges.',
    question: {
      id: 'quiz-nat-vs-vpc-endpoints-1',
      question: 'A fleet of private EC2 instances transfers 20 TB of data monthly to Amazon S3. The VPC currently routes all outbound traffic to a NAT Gateway, resulting in high monthly AWS bills. What is the most cost-effective and secure architectural change?',
      type: 'single',
      options: [
        'Provision a second NAT Gateway in another Availability Zone',
        'Create a Gateway VPC Endpoint for Amazon S3 and update the private route table',
        'Assign Elastic IP addresses directly to all EC2 instances to bypass the NAT Gateway',
        'Create an Interface VPC Endpoint for Amazon S3 with 10 ENIs'
      ],
      correctAnswers: [1],
      explanation: 'A Gateway VPC Endpoint for Amazon S3 is provided at no additional charge, and traffic routing to S3 through a Gateway Endpoint incurs no data processing fees, completely eliminating the $0.045/GB NAT Gateway fee for that 20 TB.',
      whyOthersWrong: [
        'A second NAT Gateway doubles hourly charges without reducing the $0.045/GB data transfer charge.',
        'Assigning Elastic IPs to private instances violates security boundaries and requires an IGW.',
        'Interface VPC Endpoints for S3 incur hourly and data processing charges ($0.01/GB), whereas Gateway Endpoints for S3 are completely free.'
      ],
      decisiveClue: 'Private EC2 instances transferring 20 TB monthly to S3 incurring high NAT Gateway bills.',
      difficulty: 'intermediate',
      isOriginal: true,
      source: 'Original AWS certification-style practice question'
    },
    sources: [
      { title: 'VPC Endpoints Documentation', url: 'https://docs.aws.amazon.com/vpc/latest/privatelink/vpc-endpoints.html' },
      { title: 'Reduce NAT Gateway Costs using VPC Endpoints', url: 'https://aws.amazon.com/blogs/networking-and-content-delivery/reduce-nat-gateway-costs-with-vpc-endpoints/' }
    ]
  },
  {
    id: 'gateway-vs-interface-endpoints',
    title: 'Gateway Endpoints vs Interface Endpoints',
    category: 'Networking',
    serviceA: 'Gateway VPC Endpoints',
    serviceB: 'Interface VPC Endpoints (AWS PrivateLink)',
    problem: 'Selecting the appropriate VPC endpoint type for private AWS service communication based on supported services, routing mechanisms, and cost.',
    decisiveDifferences: [
      'Supported Services: Gateway Endpoints ONLY support two AWS services: Amazon S3 and Amazon DynamoDB; Interface Endpoints support nearly all other AWS services (ECR, SQS, SNS, KMS, Secrets Manager, CloudWatch, etc.) as well as S3 and custom PrivateLink services.',
      'Implementation Mechanism: Gateway Endpoints function as route table entries (prefix lists) pointing to an endpoint target; Interface Endpoints create an Elastic Network Interface (ENI) with a private IP address directly inside your subnet.',
      'Pricing: Gateway Endpoints are 100% free with no hourly or data processing costs; Interface Endpoints charge $0.01/hour per AZ plus $0.01/GB data processing.',
      'Cross-Network Reachability: Gateway Endpoints cannot be reached from on-premises over AWS Direct Connect or VPN, nor from peered VPCs; Interface Endpoints have private IPs that ARE reachable from on-premises and peered VPCs.'
    ],
    whenToChooseA: [
      'Connecting VPC subnets to Amazon S3 or Amazon DynamoDB from within the same VPC.',
      'Cost-sensitive architectures moving massive data volumes to/from S3 and DynamoDB without paying endpoint fees.',
      'Architectures using standard VPC route tables without needing dedicated subnet IP addresses.'
    ],
    whenToChooseB: [
      'Connecting to AWS services other than S3 and DynamoDB (e.g., KMS, SQS, ECR, Athena, Secrets Manager).',
      'Accessing S3 from on-premises environments across AWS Direct Connect or Site-to-Site VPN.',
      'Connecting to private services hosted in another VPC or SaaS partner VPC across PrivateLink.'
    ],
    workTogether: 'A VPC can use a free Gateway Endpoint for its internal EC2-to-S3 bulk data pipeline, while simultaneously deploying an Interface Endpoint for S3 so that on-premises corporate servers can access the same S3 buckets privately over Direct Connect.',
    tradeoffs: [
      {
        dimension: 'Services Supported',
        optionA: 'Only Amazon S3 and Amazon DynamoDB.',
        optionB: 'Over 140+ AWS services, third-party SaaS, and custom VPC endpoint services.'
      },
      {
        dimension: 'Pricing',
        optionA: 'Completely free ($0.00/hr, $0.00/GB).',
        optionB: '$0.01/hr per AZ + $0.01/GB data processed.'
      },
      {
        dimension: 'On-Premises / Peering Access',
        optionA: 'Not accessible from on-premises via VPN/Direct Connect or VPC peering.',
        optionB: 'Fully accessible from on-premises, Transit Gateway, and peered VPCs via private ENI IPs.'
      }
    ],
    scenario: 'An enterprise connects to AWS Secrets Manager using an Interface Endpoint because Secrets Manager does not support Gateway Endpoints. For their 100 TB S3 data warehouse ingestion, they use a free S3 Gateway Endpoint to avoid data processing charges.',
    question: {
      id: 'quiz-gateway-vs-interface-endpoints-1',
      question: 'A company needs to allow on-premises servers connected via AWS Direct Connect to securely write backup files directly to an Amazon S3 bucket without traversing the public internet. Which endpoint type must be deployed?',
      type: 'single',
      options: [
        'Gateway VPC Endpoint for Amazon S3',
        'Interface VPC Endpoint for Amazon S3',
        'Internet Gateway with Direct Connect Public VIF',
        'NAT Gateway with Direct Connect Private VIF'
      ],
      correctAnswers: [1],
      explanation: 'Gateway Endpoints cannot be accessed from outside the VPC (e.g., across Direct Connect or VPN). Interface Endpoints for S3 create ENIs with private IP addresses in the VPC subnets, which on-premises servers can reach directly over Direct Connect.',
      whyOthersWrong: [
        'Gateway Endpoints cannot be extended to on-premises networks across Direct Connect or VPN.',
        'A Public VIF routes traffic over public AWS IPs, not private VPC endpoint connections.',
        'A NAT Gateway does not accept incoming connections from Direct Connect to route to S3.'
      ],
      decisiveClue: 'On-premises servers over Direct Connect needing private access to S3 without traversing the public internet.',
      difficulty: 'advanced',
      isOriginal: true,
      source: 'Original AWS certification-style practice question'
    },
    sources: [
      { title: 'Gateway Endpoints Guide', url: 'https://docs.aws.amazon.com/vpc/latest/privatelink/gateway-endpoints.html' },
      { title: 'Interface Endpoints (AWS PrivateLink)', url: 'https://docs.aws.amazon.com/vpc/latest/privatelink/interface-endpoints.html' }
    ]
  },
  {
    id: 'sg-vs-nacl',
    title: 'Security Groups vs Network ACLs',
    category: 'Networking',
    serviceA: 'Security Groups (SG)',
    serviceB: 'Network Access Control Lists (NACL)',
    problem: 'Enforcing network traffic filtering and security boundaries at instance versus subnet layers.',
    decisiveDifferences: [
      'Level of Enforcement: Security Groups operate at the individual network interface (ENI) level; Network ACLs operate at the subnet boundary level.',
      'Statefulness: Security Groups are stateful (if inbound traffic is allowed, return outbound traffic is automatically allowed regardless of outbound rules); NACLs are stateless (inbound and outbound rules must be explicitly configured, including ephemeral return ports).',
      'Rule Evaluation: Security Groups evaluate all rules before deciding to allow traffic (permissive-only, cannot define explicit DENY rules); NACLs process numbered rules sequentially from lowest to highest, stopping at the first match, and explicitly support both ALLOW and DENY rules.',
      'Scope: Security Groups apply only to instances/ENIs assigned to that group; NACLs automatically apply to every single resource placed in the associated subnet.'
    ],
    whenToChooseA: [
      'Standard micro-segmentation between application tiers (e.g., allowing port 3306 on DB SG only from App SG ID).',
      'Workloads where automatic state tracking of return traffic simplifies configuration without managing ephemeral ports (1024-65535).',
      'Granular per-instance firewall rules.'
    ],
    whenToChooseB: [
      'Blocking specific malicious IP addresses or offending CIDR ranges immediately (explicit DENY rules).',
      'Enforcing a blanket security baseline or compliance boundary across an entire subnet regardless of instance configurations.',
      'Adding defense-in-depth perimeter filtering at the subnet border.'
    ],
    workTogether: 'Security Groups and NACLs provide two layers of defense-in-depth: a NACL guards the subnet perimeter and blocks known malicious IPs with explicit DENY rules, while Security Groups tightly control access between application tiers referencing each other by Security Group ID.',
    tradeoffs: [
      {
        dimension: 'State Tracking',
        optionA: 'Stateful: Return traffic automatically permitted.',
        optionB: 'Stateless: Outbound ephemeral return ports (1024-65535) must be explicitly permitted.'
      },
      {
        dimension: 'Rule Logic',
        optionA: 'Allow rules only; implicit deny all unlisted traffic.',
        optionB: 'Explicit Allow AND Deny rules; evaluated in numerical order.'
      },
      {
        dimension: 'Attachment Scope',
        optionA: 'Attached to Elastic Network Interfaces (ENIs) / EC2 instances.',
        optionB: 'Associated with entire subnets (1 NACL per subnet).'
      }
    ],
    scenario: 'A web server receives a distributed attack from a known malicious IP subnet (`203.0.113.0/24`). Because Security Groups cannot deny specific IPs, the administrator adds an explicit rule `100 DENY 203.0.113.0/24` to the subnet Network ACL, instantly dropping all packets at the subnet perimeter.',
    question: {
      id: 'quiz-sg-vs-nacl-1',
      question: 'A security engineer discovers an external botnet IP address (198.51.100.25) conducting brute force SSH attacks on public instances. The engineer needs to immediately block all traffic from this single IP address across an entire subnet. What is the quickest and most effective way?',
      type: 'single',
      options: [
        'Add a DENY rule for 198.51.100.25/32 in the Security Group inbound rules',
        'Add a low-numbered DENY rule for 198.51.100.25/32 in the subnet Network ACL inbound rules',
        'Delete the default route in the subnet route table',
        'Enable AWS WAF on the subnet route table'
      ],
      correctAnswers: [1],
      explanation: 'Network ACLs support explicit DENY rules and are evaluated in numbered order. Adding a low-numbered DENY rule immediately blocks the IP at the subnet perimeter. Security Groups do not support DENY rules.',
      whyOthersWrong: [
        'Security Groups do not support explicit DENY rules; they only support ALLOW rules.',
        'Deleting the default route in the route table would sever internet connectivity for all instances in the subnet.',
        'AWS WAF cannot be attached to subnet route tables; it attaches to CloudFront, ALB, API Gateway, or AppSync.'
      ],
      decisiveClue: 'Immediately block a specific IP address using an explicit DENY rule across an entire subnet.',
      difficulty: 'beginner',
      isOriginal: true,
      source: 'Original AWS certification-style practice question'
    },
    sources: [
      { title: 'Amazon VPC Security Groups', url: 'https://docs.aws.amazon.com/vpc/latest/userguide/VPC_SecurityGroups.html' },
      { title: 'Amazon VPC Network ACLs', url: 'https://docs.aws.amazon.com/vpc/latest/userguide/vpc-network-acls.html' }
    ]
  },
  {
    id: 'alb-vs-nlb',
    title: 'ALB vs NLB',
    category: 'Networking',
    serviceA: 'Application Load Balancer (ALB)',
    serviceB: 'Network Load Balancer (NLB)',
    problem: 'Choosing between Layer 7 content-aware application routing and Layer 4 ultra-low latency high-throughput packet forwarding.',
    decisiveDifferences: [
      'OSI Layer: ALB operates at Layer 7 (Application Layer - HTTP/HTTPS, HTTP/2, gRPC, WebSockets); NLB operates at Layer 4 (Transport Layer - raw TCP, UDP, and TLS).',
      'IP Addressing: ALB uses dynamic DNS names resolving to changing AWS IP addresses; NLB provides static IP addresses per Availability Zone and can assign Elastic IPs directly to the load balancer.',
      'Performance & Latency: NLB processes millions of requests per second with ultra-low sub-millisecond latencies and handles sudden volatile traffic spikes without pre-warming; ALB has single-digit millisecond latency and scales progressively.',
      'Routing Capabilities: ALB supports advanced Layer 7 routing rules (host headers, path patterns, query strings, HTTP headers, method types); NLB routes purely based on IP protocol and port.'
    ],
    whenToChooseA: [
      'Microservices web applications requiring path-based (`/api/*`, `/images/*`) or host-based (`api.example.com`) routing.',
      'Workloads requiring native AWS WAF integration, user authentication (OIDC / Cognito), or redirect rules (HTTP to HTTPS).',
      'Containerized applications on ECS requiring dynamic host port mapping across multiple tasks.'
    ],
    whenToChooseB: [
      'Non-HTTP protocols (raw TCP, UDP, gaming servers, IoT MQTT, VoIP, Syslog, DNS).',
      'Workloads requiring static IP addresses for client firewall allowlisting.',
      'Ultra-high performance applications demanding extreme throughput, sub-millisecond latency, or instant scaling against sudden traffic bursts.',
      'PrivateLink endpoint service architectures (NLB is required as the service backend).'
    ],
    workTogether: 'An architecture can place a Network Load Balancer with static Elastic IPs at the front edge to satisfy third-party IP allowlisting, forwarding traffic directly to an Application Load Balancer target group to perform complex Layer 7 path routing and SSL certificate management.',
    tradeoffs: [
      {
        dimension: 'OSI Layer & Protocols',
        optionA: 'Layer 7 (HTTP, HTTPS, HTTP/2, gRPC, WebSockets).',
        optionB: 'Layer 4 (TCP, UDP, TLS).'
      },
      {
        dimension: 'Public IP Stability',
        optionA: 'Dynamic IPs (must use DNS CNAME / Alias).',
        optionB: 'Static IP addresses (can assign Elastic IPs per AZ).'
      },
      {
        dimension: 'Routing Logic',
        optionA: 'Rich Layer 7 rules (paths, headers, query params, cookies).',
        optionB: 'Layer 4 port and protocol forwarding only.'
      },
      {
        dimension: 'Latency Profile',
        optionA: 'Low single-digit milliseconds.',
        optionB: 'Ultra-low sub-millisecond.'
      }
    ],
    scenario: 'A financial trading platform uses an NLB to terminate TCP connections with sub-millisecond latency and static IP allowlists for partner brokerages. Meanwhile, their customer web portal uses an ALB to route `/orders` and `/dashboard` to different microservices.',
    question: {
      id: 'quiz-alb-vs-nlb-1',
      question: 'A gaming company requires a load balancer for an online multiplayer game running on raw UDP protocol. The load balancer must handle sudden bursts of 10 million concurrent connections with sub-millisecond latency and provide a single static IP per AZ for client hardcoding. Which load balancer meets these requirements?',
      type: 'single',
      options: [
        'Application Load Balancer (ALB)',
        'Network Load Balancer (NLB)',
        'Classic Load Balancer (CLB)',
        'Gateway Load Balancer (GWLB)'
      ],
      correctAnswers: [1],
      explanation: 'Network Load Balancer (NLB) operates at Layer 4, supports UDP and TCP protocols, offers sub-millisecond latency, handles sudden extreme traffic spikes without pre-warming, and provides static IPs per AZ.',
      whyOthersWrong: [
        'ALB operates at Layer 7 and only supports HTTP, HTTPS, and gRPC, not raw UDP, and does not provide static IPs.',
        'Classic Load Balancer is legacy, does not support UDP, and cannot scale as rapidly as NLB.',
        'Gateway Load Balancer is designed for deploying third-party virtual network appliances (firewalls, IDS/IPS), not general game traffic balancing.'
      ],
      decisiveClue: 'Raw UDP protocol, sub-millisecond latency, sudden 10M spikes, and static IP addresses per AZ.',
      difficulty: 'intermediate',
      isOriginal: true,
      source: 'Original AWS certification-style practice question'
    },
    sources: [
      { title: 'Elastic Load Balancing Features', url: 'https://aws.amazon.com/elasticloadbalancing/features/' },
      { title: 'Network Load Balancers Guide', url: 'https://docs.aws.amazon.com/elasticloadbalancing/latest/network/introduction.html' }
    ]
  },
  {
    id: 'route53-vs-cloudfront',
    title: 'Route 53 vs CloudFront',
    category: 'Networking',
    serviceA: 'Amazon Route 53',
    serviceB: 'Amazon CloudFront',
    problem: 'Distinguishing between global domain name resolution and edge content delivery/caching.',
    decisiveDifferences: [
      'Core Function: Route 53 is a highly available and scalable Domain Name System (DNS) web service that translates domain names into IP addresses or AWS resource records; CloudFront is a Content Delivery Network (CDN) that caches and serves web content from hundreds of global edge locations.',
      'Traffic Intermediation: Route 53 directs the client WHERE to send packets (the client connects directly to the resolved target IP); CloudFront sits as a reverse proxy directly in the data path between the client and the origin server, terminating TLS and caching responses.',
      'Content Caching: Route 53 caches only DNS records at resolver TTL levels; CloudFront caches full HTTP responses, images, HTML, API payloads, and video streams close to users.',
      'Security & Modification: Route 53 performs DNSSEC and DNS-level health checks; CloudFront inspects and modifies HTTP requests/responses using CloudFront Functions or Lambda@Edge, and integrates directly with AWS WAF.'
    ],
    whenToChooseA: [
      'Registering domain names, hosting public and private DNS zones, and managing DNS records.',
      'Routing traffic using intelligent DNS routing policies: Geolocation, Geoproximity, Latency-based, Failover, Weighted, or Multi-Value Answer.',
      'Internal VPC service discovery and split-horizon private DNS resolution.'
    ],
    whenToChooseB: [
      'Accelerating global content delivery of static and dynamic web content to reduce latency for end users.',
      'Offloading origin traffic loads by caching HTTP responses at the edge.',
      'DDoS mitigation and web application firewall protection (AWS Shield Standard, AWS WAF) at the edge.',
      'Customizing HTTP headers and request paths on the fly with edge compute (CloudFront Functions).'
    ],
    workTogether: 'Route 53 and CloudFront work in tandem: Route 53 uses an Alias record (e.g., `example.com` -> `d123.cloudfront.net`) to direct users to the nearest CloudFront edge location, which then serves cached content or proxies requests back to an S3 or ALB origin.',
    tradeoffs: [
      {
        dimension: 'Primary Role',
        optionA: 'DNS resolution (translates domain names to IP addresses/endpoints).',
        optionB: 'Content delivery and reverse proxy caching (delivers HTTP/HTTPS content).'
      },
      {
        dimension: 'Network Data Path',
        optionA: 'Control plane: DNS lookup only; does not proxy application payload data.',
        optionB: 'Data plane: Sits directly in the request path proxying and caching traffic.'
      },
      {
        dimension: 'DDoS & WAF Filtering',
        optionA: 'Protects DNS infrastructure (AWS Shield protects Route 53 nameservers).',
        optionB: 'Inspects HTTP traffic payloads directly with AWS WAF and Shield at edge.'
      }
    ],
    scenario: 'A media website registers its domain with Amazon Route 53. Route 53 Alias records resolve traffic to an Amazon CloudFront distribution. CloudFront caches video clips and images at edge locations globally, drastically reducing latency for users and reducing S3 origin egress costs.',
    question: {
      id: 'quiz-route53-vs-cloudfront-1',
      question: 'A global web application hosted in eu-west-1 suffers from slow loading times for users located in Australia and Japan. The application serves static images and CSS files that rarely change. What is the most effective way to decrease latency for these users?',
      type: 'single',
      options: [
        'Configure Amazon Route 53 Latency-based routing to the eu-west-1 web servers',
        'Deploy an Amazon CloudFront distribution in front of the eu-west-1 origin',
        'Enable Route 53 Geolocation routing pointing to eu-west-1',
        'Deploy an Internet Gateway in an Australian AWS Local Zone'
      ],
      correctAnswers: [1],
      explanation: 'Amazon CloudFront caches static assets at hundreds of global Points of Presence (PoPs) close to users in Australia and Japan, delivering assets locally with low latency instead of forcing round-trips to eu-west-1.',
      whyOthersWrong: [
        'Route 53 Latency routing can only route users to different backend server regions; if all servers are in eu-west-1, DNS routing cannot overcome physical speed-of-light latency across the globe.',
        'Route 53 Geolocation routing simply routes users based on location, but with only one origin in Ireland, it does not accelerate delivery.',
        'An Internet Gateway cannot be attached cross-region or to standalone Local Zones without local compute resources.'
      ],
      decisiveClue: 'Slow loading times globally for static assets hosted in a single AWS Region.',
      difficulty: 'beginner',
      isOriginal: true,
      source: 'Original AWS certification-style practice question'
    },
    sources: [
      { title: 'Amazon Route 53 Concepts', url: 'https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/Welcome.html' },
      { title: 'Amazon CloudFront Developer Guide', url: 'https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Introduction.html' }
    ]
  },
  {
    id: 'vpc-peering-vs-tgw',
    title: 'VPC Peering vs Transit Gateway',
    category: 'Networking',
    serviceA: 'VPC Peering',
    serviceB: 'AWS Transit Gateway (TGW)',
    problem: 'Connecting multiple VPCs and on-premises networks together at scale.',
    decisiveDifferences: [
      'Topology & Scalability: VPC Peering requires point-to-point 1:1 connections between each pair of VPCs (creating an `[N * (N - 1)] / 2` mesh that becomes unmanageable beyond a handful of VPCs); Transit Gateway is a centralized hub-and-spoke router supporting up to 5,000 VPC attachments.',
      'Transitive Routing: VPC Peering DOES NOT support transitive routing (if VPC A peers with B, and B peers with C, A cannot reach C through B); Transit Gateway natively supports transitive routing across all attached VPCs and VPN/Direct Connect gateways.',
      'Cost Structure: VPC Peering has zero hourly connection fees (you pay only standard inter-AZ/inter-region data transfer); Transit Gateway charges an hourly fee per attachment (~$0.05/hour) PLUS $0.02/GB data processing fee.',
      'Bandwidth Limits: VPC Peering has no bandwidth bottleneck or aggregate bandwidth ceiling (traffic traverses the AWS backbone at EC2 instance speeds); Transit Gateway limits each VPC attachment to 50 Gbps maximum burst throughput.'
    ],
    whenToChooseA: [
      'Connecting a small number of VPCs (e.g., 2 to 5 VPCs) where mesh management is trivial.',
      'Workloads transferring extreme volumes of data (hundreds of terabytes) where avoiding Transit Gateway per-GB processing fees yields major savings.',
      'Applications needing maximum raw throughput without any intermediate gateway hops.'
    ],
    whenToChooseB: [
      'Large multi-VPC enterprise environments (tens, hundreds, or thousands of VPCs) under AWS Organizations.',
      'Hub-and-spoke architectures routing traffic between VPCs and on-premises networks (Direct Connect / VPN) through a central network inspection VPC.',
      'Requirements for centralized route tables, network segmentation via route domain tables, and centralized firewall appliances.'
    ],
    workTogether: 'An enterprise uses Transit Gateway as the central hub for general corporate traffic, shared services, and on-premises connectivity across 50 VPCs, but sets up a direct VPC Peering connection between two specific big-data VPCs that transfer petabytes of nightly analytics data to avoid Transit Gateway data processing fees.',
    tradeoffs: [
      {
        dimension: 'Network Topology',
        optionA: 'Full mesh point-to-point (complex at scale).',
        optionB: 'Hub-and-spoke central router (scales to thousands of VPCs).'
      },
      {
        dimension: 'Transitive Routing',
        optionA: 'Not supported (strict non-transitive 1:1 peering).',
        optionB: 'Fully supported across all attached VPCs and VPNs.'
      },
      {
        dimension: 'Cost Overhead',
        optionA: 'No hourly fee; no data processing fee (data transfer out only).',
        optionB: 'Hourly fee per attachment + $0.02/GB data processing fee.'
      }
    ],
    scenario: 'An enterprise with 80 AWS accounts and 150 VPCs connects all VPCs to a central AWS Transit Gateway. This enables any authorized VPC to communicate with shared authentication services and on-premises data centers without managing thousands of point-to-point peering connections.',
    question: {
      id: 'quiz-vpc-peering-vs-tgw-1',
      question: 'A cloud architect manages 40 VPCs that all require private network access to a shared services VPC and an on-premises data center via Direct Connect. The network team cannot manage the operational complexity of hundreds of individual peerings. Which architecture should be deployed?',
      type: 'single',
      options: [
        'A full mesh of 780 VPC Peering connections',
        'AWS Transit Gateway acting as a central hub with attachments to each VPC and Direct Connect Gateway',
        'VPC Peering with transitive routing enabled on the shared services VPC',
        'NAT Gateways deployed in each VPC pointing to public IP addresses of the shared services'
      ],
      correctAnswers: [1],
      explanation: 'AWS Transit Gateway simplifies network topology by acting as a cloud router in a hub-and-spoke model. It natively supports transitive routing across VPCs and Direct Connect, avoiding the complexity of hundreds of peerings.',
      whyOthersWrong: [
        'Managing 780 individual VPC Peering connections creates massive operational overhead and route table limit issues.',
        'AWS VPC Peering does NOT support transitive routing under any configuration.',
        'NAT Gateways route over the public internet, which violates private network requirements and increases costs.'
      ],
      decisiveClue: '40 VPCs needing connectivity to shared services and on-premises without managing hundreds of individual peerings.',
      difficulty: 'intermediate',
      isOriginal: true,
      source: 'Original AWS certification-style practice question'
    },
    sources: [
      { title: 'AWS Transit Gateway Documentation', url: 'https://docs.aws.amazon.com/vpc/latest/tgw/what-is-transit-gateway.html' },
      { title: 'VPC Peering Basics', url: 'https://docs.aws.amazon.com/vpc/latest/peering/what-is-vpc-peering.html' }
    ]
  },
  {
    id: 'vpc-peering-vs-privatelink',
    title: 'VPC Peering vs PrivateLink',
    category: 'Networking',
    serviceA: 'VPC Peering',
    serviceB: 'AWS PrivateLink',
    problem: 'Exposing specific backend services between VPCs or across AWS accounts while addressing CIDR overlap and security boundary constraints.',
    decisiveDifferences: [
      'CIDR Overlap Handling: VPC Peering strictly REQUIRES non-overlapping CIDR blocks between VPCs (cannot peer `10.0.0.0/16` with `10.0.0.0/16`); PrivateLink works seamlessly across overlapping or identical CIDR blocks because communication occurs via private endpoint ENIs.',
      'Exposure Granularity: VPC Peering connects entire network address spaces (all instances in peered subnets can potentially route to each other subject to security groups); PrivateLink exposes ONLY a single specific service (TCP port) behind an NLB, keeping the rest of the VPC invisible.',
      'Directionality & Model: VPC Peering establishes bi-directional IP network routing; PrivateLink is a unidirectional client-server model (the consumer initiates connections to the provider service; the provider cannot initiate connections to consumer instances).',
      'Cost: VPC Peering incurs no hourly fee and standard data transfer rates; PrivateLink charges an hourly fee per endpoint ($0.01/hr) plus data processing ($0.01/GB).'
    ],
    whenToChooseA: [
      'Internal VPCs managed by the same organization with carefully coordinated, non-overlapping IP address plans.',
      'Distributed systems requiring bi-directional communication across multiple ports and protocols (e.g., Active Directory, Cassandra clusters, microservice meshes).',
      'High-throughput internal data pipelines where lowest cost and zero endpoint hourly fees are required.'
    ],
    whenToChooseB: [
      'Sharing a service with external third-party customers, SaaS clients, or acquired companies whose VPC CIDRs overlap with yours.',
      'Zero-trust security architectures where consumers should have access only to a specific API port, with zero exposure of the underlying host network.',
      'SaaS providers selling multi-tenant services to AWS customer VPCs without setting up complex VPNs or peerings.'
    ],
    workTogether: 'An enterprise uses VPC Peering for core internal backend microservices that share non-overlapping IP space, while offering their internal billing service to subsidiary business units with conflicting CIDRs via AWS PrivateLink.',
    tradeoffs: [
      {
        dimension: 'IP Address Overlap',
        optionA: 'Strictly prohibited; CIDRs must not overlap.',
        optionB: 'Fully supported; works even if consumer and provider have identical CIDRs.'
      },
      {
        dimension: 'Attack Surface / Blast Radius',
        optionA: 'Full subnet IP routing accessible across VPC boundary.',
        optionB: 'Restricted strictly to the single TCP port and service exposed behind the NLB.'
      },
      {
        dimension: 'Connection Direction',
        optionA: 'Bi-directional network routing.',
        optionB: 'Unidirectional (consumer reaches provider service only).'
      }
    ],
    scenario: 'A B2B SaaS analytics company hosts their reporting engine in AWS. Their enterprise clients need private access from their corporate AWS VPCs, but several clients use the exact same `10.0.0.0/16` CIDR. The SaaS provider uses AWS PrivateLink, allowing clients to connect without any IP conflicts.',
    question: {
      id: 'quiz-vpc-peering-vs-privatelink-1',
      question: 'A SaaS vendor hosts an application in VPC A (CIDR 10.0.0.0/16). A corporate customer wants to access this application privately from VPC B (also CIDR 10.0.0.0/16). The customer must not have access to any other resources in VPC A. Which solution should be implemented?',
      type: 'single',
      options: [
        'Establish an inter-VPC Peering connection between VPC A and VPC B',
        'Configure AWS PrivateLink with an NLB in VPC A and an Interface Endpoint in VPC B',
        'Connect both VPCs to an AWS Transit Gateway',
        'Deploy a Site-to-Site VPN between the two VPCs'
      ],
      correctAnswers: [1],
      explanation: 'VPC Peering and Transit Gateway cannot connect VPCs with overlapping CIDR blocks (both are 10.0.0.0/16). AWS PrivateLink solves IP overlap by exposing only the specific service behind an NLB via an Interface VPC Endpoint.',
      whyOthersWrong: [
        'VPC Peering fails immediately when CIDR blocks overlap.',
        'AWS Transit Gateway cannot route traffic between VPCs with conflicting overlapping CIDRs without complex NAT workarounds, and it exposes broader subnets rather than a single service.',
        'Site-to-Site VPN would still suffer from overlapping IP routing collisions without extensive Source/Destination NAT mapping.'
      ],
      decisiveClue: 'Overlapping CIDR blocks (both 10.0.0.0/16) and requirement to expose only a specific application privately.',
      difficulty: 'intermediate',
      isOriginal: true,
      source: 'Original AWS certification-style practice question'
    },
    sources: [
      { title: 'AWS PrivateLink Concepts', url: 'https://docs.aws.amazon.com/vpc/latest/privatelink/what-is-privatelink.html' },
      { title: 'VPC Peering Limitations', url: 'https://docs.aws.amazon.com/vpc/latest/peering/vpc-peering-basics.html#vpc-peering-limitations' }
    ]
  },
  {
    id: 'vpn-vs-direct-connect',
    title: 'Site-to-Site VPN vs Direct Connect',
    category: 'Networking',
    serviceA: 'AWS Site-to-Site VPN',
    serviceB: 'AWS Direct Connect (DX)',
    problem: 'Connecting on-premises enterprise data centers to AWS VPCs over the public internet versus dedicated physical circuits.',
    decisiveDifferences: [
      'Transport Medium: Site-to-Site VPN traverses the public internet using encrypted IPsec tunnels; Direct Connect provides a dedicated physical fiber-optic connection (1 Gbps, 10 Gbps, 100 Gbps, or sub-1G hosted) directly from the customer data center to an AWS Direct Connect location.',
      'Latency & Consistency: VPN latency fluctuates due to internet weather, congestion, and ISP routing changes; Direct Connect delivers consistent, ultra-low, deterministic network latency.',
      'Deployment Time: VPN can be provisioned and operational in under an hour; Direct Connect takes weeks to months to provision physical cross-connects and telecommunications circuits.',
      'Encryption: VPN is encrypted in transit by default via IPsec (AES-256); standard Direct Connect is unencrypted physical Ethernet (though customers can configure MACsec on supported ports or run an IPsec VPN over Direct Connect).'
    ],
    whenToChooseA: [
      'Quick setup for hybrid connectivity, proofs-of-concept, or immediate migration projects.',
      'Low to moderate throughput requirements (< 1.25 Gbps per tunnel) where internet transport is acceptable.',
      'Cost-sensitive environments where dedicated fiber cross-connect fees are not justified.',
      'Providing an automatic encrypted backup path for an existing AWS Direct Connect connection.'
    ],
    whenToChooseB: [
      'High-throughput workloads transferring large datasets (hundreds of terabytes to petabytes) continuously.',
      'Mission-critical workloads requiring SLAs, consistent sub-millisecond network jitter, and predictable latency (e.g., real-time trading, core banking).',
      'Significantly lower per-gigabyte data egress costs (Direct Connect egress rates are discounted compared to internet egress rates).'
    ],
    workTogether: 'Enterprises commonly use AWS Direct Connect as their primary high-speed physical link, and configure an AWS Site-to-Site VPN as an automated, cost-effective secondary failover connection in the event of fiber cuts or carrier outages.',
    tradeoffs: [
      {
        dimension: 'Physical Connectivity',
        optionA: 'Encrypted IPsec tunnel over public internet.',
        optionB: 'Dedicated physical Ethernet circuit via AWS DX partner/location.'
      },
      {
        dimension: 'Provisioning Timeline',
        optionA: 'Minutes to hours.',
        optionB: 'Days to several weeks/months for physical circuit installation.'
      },
      {
        dimension: 'Data Transfer Out Cost',
        optionA: 'Standard internet egress rates (~$0.09/GB).',
        optionB: 'Discounted Direct Connect egress rates (~$0.02/GB).'
      },
      {
        dimension: 'Throughput per Link',
        optionA: 'Max 1.25 Gbps per IPsec tunnel (can aggregate with ECMP).',
        optionB: '1 Gbps, 10 Gbps, 100 Gbps dedicated ports.'
      }
    ],
    scenario: 'A national hospital network transfers 150 TB of patient telemetry data daily to AWS. They install two 10 Gbps Direct Connect circuits for primary low-latency bandwidth, while maintaining an AWS Site-to-Site VPN tunnel as an automated disaster recovery backup.',
    question: {
      id: 'quiz-vpn-vs-direct-connect-1',
      question: 'A financial institution requires a private, high-bandwidth (10 Gbps) connection between its corporate data center and AWS. The connection must offer consistent, predictable network latency and heavily discounted data transfer egress rates for petabyte-scale data transfers. Which AWS service is required?',
      type: 'single',
      options: [
        'AWS Site-to-Site VPN with accelerated VPN',
        'AWS Direct Connect dedicated connection',
        'Amazon Route 53 Resolver with DNS forwarding',
        'AWS Transit Gateway with software VPN appliances'
      ],
      correctAnswers: [1],
      explanation: 'AWS Direct Connect provides dedicated physical 10 Gbps connections that bypass the public internet, delivering deterministic latency, high throughput, and reduced data egress pricing.',
      whyOthersWrong: [
        'Site-to-Site VPN runs over the public internet, caps individual tunnels at 1.25 Gbps, and incurs standard public internet egress fees.',
        'Route 53 Resolver handles hybrid DNS resolution, not high-speed data payload transmission.',
        'Software VPN appliances over Transit Gateway still ride internet bandwidth and cannot provide dedicated physical 10 Gbps links.'
      ],
      decisiveClue: 'Dedicated 10 Gbps connection, predictable latency, discounted egress rates for petabyte-scale transfers.',
      difficulty: 'intermediate',
      isOriginal: true,
      source: 'Original AWS certification-style practice question'
    },
    sources: [
      { title: 'AWS Direct Connect User Guide', url: 'https://docs.aws.amazon.com/directconnect/latest/UserGuide/Welcome.html' },
      { title: 'AWS Site-to-Site VPN User Guide', url: 'https://docs.aws.amazon.com/vpn/latest/s2svpn/VPC_VPN.html' }
    ]
  },
  {
    id: 'waf-vs-shield',
    title: 'AWS WAF vs AWS Shield',
    category: 'Networking',
    serviceA: 'AWS WAF',
    serviceB: 'AWS Shield',
    problem: 'Protecting cloud applications against Layer 7 application exploits versus Layer 3/4 Distributed Denial of Service (DDoS) attacks.',
    decisiveDifferences: [
      'OSI Layer & Attack Types: AWS WAF inspects Layer 7 (Application Layer) HTTP/HTTPS traffic to prevent exploits like SQL injection (SQLi), Cross-Site Scripting (XSS), rate limiting, and bot scrapers; AWS Shield mitigates Layer 3 (Network) and Layer 4 (Transport) DDoS attacks like SYN floods, UDP reflection attacks, and HTTP floods.',
      'Rule Engine & Customization: AWS WAF allows deep custom inspection rules (HTTP headers, query strings, request bodies, regex matches, rate limits); AWS Shield operates autonomously using automated baseline anomaly detection.',
      'Tiers & Cost: AWS WAF charges per Web ACL, per rule, and per million requests analyzed; AWS Shield Standard is automatically included for free for all AWS customers; AWS Shield Advanced costs $3,000/month flat fee plus data transfer, providing 24/7 Shield Response Team (SRT) support and DDoS cost protection.'
    ],
    whenToChooseA: [
      'Protecting web applications against OWASP Top 10 vulnerabilities (SQL injection, XSS, SSRF).',
      'Implementing custom IP allowlists/blocklists, geographical request blocking, or HTTP rate limits (e.g., max 500 requests per 5 minutes per IP).',
      'Preventing web scraping and credential stuffing using AWS Managed Rules for Bot Control and Account Takeover Prevention.'
    ],
    whenToChooseB: [
      'Automatic defense against network-level and transport-level DDoS attacks (Shield Standard is active by default).',
      'Enterprise protection against severe, sustained DDoS attacks with financial protection against EC2/ALB scaling cost spikes during an attack (Shield Advanced).',
      'Requiring direct 24/7 engagement with the AWS Shield Response Team (SRT) during active attacks.'
    ],
    workTogether: 'AWS Shield Advanced includes AWS WAF at no extra cost. In an enterprise security posture, Shield mitigates massive volumetric Layer 3/4 SYN floods automatically, while AWS WAF inspects individual HTTP payloads to block malicious SQL injection queries.',
    tradeoffs: [
      {
        dimension: 'Attack Vectors Defended',
        optionA: 'Layer 7 application vulnerabilities (SQLi, XSS, bot attacks, rate abuse).',
        optionB: 'Layer 3 & 4 volumetric DDoS attacks (SYN floods, UDP reflection, NTP amplification).'
      },
      {
        dimension: 'Base Pricing',
        optionA: 'Pay-per-use ($5/ACL + $1/rule + $0.60/million requests).',
        optionB: 'Standard: Free. Advanced: $3,000/month + 1-year commitment.'
      },
      {
        dimension: 'Cost Spike Protection',
        optionA: 'None; auto-scaled backend resources during attacks incur standard bills.',
        optionB: 'Shield Advanced provides financial cost spike protection against scaling fees during DDoS.'
      }
    ],
    scenario: 'An e-commerce portal deploys AWS WAF on its Application Load Balancer to block SQL injection and rate-limit bot scrapers. To safeguard against multi-gigabit volumetric DDoS attacks that could take the site down during Cyber Monday, they subscribe to AWS Shield Advanced.',
    question: {
      id: 'quiz-waf-vs-shield-1',
      question: 'A public web application is being targeted by malicious actors attempting SQL injection attacks and cross-site scripting (XSS) through form submissions. Which AWS service is specifically designed to inspect HTTP payloads and block these threats?',
      type: 'single',
      options: [
        'AWS Shield Standard',
        'AWS WAF (Web Application Firewall)',
        'Amazon GuardDuty',
        'AWS Network Firewall'
      ],
      correctAnswers: [1],
      explanation: 'AWS WAF operates at Layer 7 to inspect HTTP and HTTPS request headers, query strings, and body payloads, allowing rules that detect and block SQL injection, XSS, and other application-layer exploits.',
      whyOthersWrong: [
        'AWS Shield Standard protects against Layer 3/4 volumetric DDoS attacks (such as SYN floods), not Layer 7 SQLi or XSS exploits.',
        'Amazon GuardDuty is an intelligent threat detection service that analyzes log files (CloudTrail, VPC Flow Logs), but does not sit in the traffic path to block HTTP requests.',
        'AWS Network Firewall operates primarily at Layers 3-5 and stateful SNORT inspection, not dedicated Layer 7 OWASP top 10 HTTP WAF rules.'
      ],
      decisiveClue: 'SQL injection and cross-site scripting (XSS) HTTP payload inspection and blocking.',
      difficulty: 'beginner',
      isOriginal: true,
      source: 'Original AWS certification-style practice question'
    },
    sources: [
      { title: 'AWS WAF Developer Guide', url: 'https://docs.aws.amazon.com/waf/latest/developerguide/what-is-aws-waf.html' },
      { title: 'AWS Shield Developer Guide', url: 'https://docs.aws.amazon.com/waf/latest/developerguide/shield-chapter.html' }
    ]
  },
  {
    id: 'public-vs-private-subnets',
    title: 'Public vs Private Subnets',
    category: 'Networking',
    serviceA: 'Public Subnet',
    serviceB: 'Private Subnet',
    problem: 'Structuring VPC subnets to isolate critical database and application tiers from direct internet exposure.',
    decisiveDifferences: [
      'Route Table Configuration: A public subnet has a route table entry directing default internet traffic (`0.0.0.0/0`) directly to an Internet Gateway (`igw-xxxx`); a private subnet has NO route to an Internet Gateway (its `0.0.0.0/0` route points to a NAT Gateway, Virtual Private Gateway, or has no default route at all).',
      'IP Addressing: Instances in a public subnet can be assigned public IPv4 addresses and are directly reachable from the internet; instances in a private subnet possess only private IP addresses (`10.x.x.x`, `172.16.x.x`, `192.168.x.x`) and cannot be reached directly from the internet.',
      'Architectural Role: Public subnets act as the DMZ holding load balancers, bastion hosts, and NAT gateways; private subnets host business logic, backend microservices, and databases.'
    ],
    whenToChooseA: [
      'Internet-facing Application Load Balancers (ALB) and Network Load Balancers (NLB).',
      'NAT Gateways that provide outbound translation for private subnets.',
      'Public bastion hosts or jump boxes (though AWS Systems Manager Session Manager is now preferred over public bastions).'
    ],
    whenToChooseB: [
      'Relational and non-relational database clusters (RDS, Aurora, DocumentDB).',
      'Backend application servers, microservice containers (ECS/EKS), and internal worker instances.',
      'Any workload storing sensitive business data or confidential customer information.'
    ],
    workTogether: 'The multi-tier VPC architecture places public ALBs in public subnets to receive user HTTP traffic; the ALB forwards requests over private IP space to application servers in private subnets, which in turn query databases in even more isolated private subnets.',
    tradeoffs: [
      {
        dimension: 'Default Route Target',
        optionA: 'Points to an Internet Gateway (`0.0.0.0/0 -> igw-xxxx`).',
        optionB: 'Points to a NAT Gateway (`0.0.0.0/0 -> nat-xxxx`) or no internet route.'
      },
      {
        dimension: 'Inbound Internet Reachability',
        optionA: 'Directly reachable if security group and NACL allow.',
        optionB: 'Strictly unreachable from the public internet.'
      },
      {
        dimension: 'Typical Tier Placed Here',
        optionA: 'Load balancers, public proxies, NAT gateways.',
        optionB: 'Application compute, backend microservices, databases.'
      }
    ],
    scenario: 'A company implements a secure three-tier VPC: Public subnets contain only the public ALB and NAT Gateways. Application EC2 instances reside in private subnets routing outbound to the NAT Gateway. RDS PostgreSQL instances reside in dedicated isolated private subnets with no internet route at all.',
    question: {
      id: 'quiz-public-vs-private-subnets-1',
      question: 'What technically makes a subnet within an Amazon VPC classified as a "public subnet"?',
      type: 'single',
      options: [
        'The subnet CIDR block must be registered with public IANA IP addresses',
        'The subnet route table has an explicit route for 0.0.0.0/0 pointing directly to an Internet Gateway',
        'Every instance launched in the subnet is automatically assigned a public IP address',
        'The subnet Network ACL allows all traffic from 0.0.0.0/0 on port 80 and 443'
      ],
      correctAnswers: [1],
      explanation: 'In AWS networking terminology, a subnet is defined as a public subnet if its route table contains a route that directs default internet traffic (0.0.0.0/0) directly to an attached Internet Gateway (IGW).',
      whyOthersWrong: [
        'VPC subnets always use private RFC 1918 CIDR blocks (e.g., 10.0.0.0/16), never public IANA blocks.',
        'Automatic public IP assignment is an optional subnet setting, not the defining condition of a public subnet.',
        'Network ACL rules control packet filtering, but without a route to an Internet Gateway in the route table, the subnet cannot route traffic to the internet.'
      ],
      decisiveClue: 'Technical definition of what makes an Amazon VPC subnet "public".',
      difficulty: 'beginner',
      isOriginal: true,
      source: 'Original AWS certification-style practice question'
    },
    sources: [
      { title: 'VPC Subnets Overview', url: 'https://docs.aws.amazon.com/vpc/latest/userguide/configure-subnets.html' },
      { title: 'VPC Route Tables Guide', url: 'https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Route_Tables.html' }
    ]
  }
];
