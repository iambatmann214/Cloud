import { LearningPath } from '../types';

export const foundationsPath: LearningPath = {
  id: 'foundations',
  title: 'Computing & Cloud Fundamentals',
  description: 'Master core computing principles, hardware abstraction, virtualization, client-server models, and foundational cloud economics.',
  icon: 'Cpu',
  order: 1,
  prerequisites: [],
  estimatedHours: 3,
  lessons: [
    {
      id: 'foundations-1',
      pathId: 'foundations',
      title: 'What is Computing: Input, Processing, Storage, Output',
      description: 'Understand the von Neumann computing model and how modern computer systems execute instructions.',
      difficulty: 'beginner',
      estimatedMinutes: 15,
      order: 1,
      content: {
        sections: [
          {
            id: 'foundations-1-s1',
            title: 'The Universal Model of Computing',
            type: 'text',
            content: 'At its core, every computational device—from a tiny IoT microcontroller to an AWS Graviton-powered EC2 instance—follows the foundational IPO (Input, Processing, Output) cycle governed by the von Neumann architecture. Data enters via input streams, central processing units manipulate data using registers and arithmetic logic units (ALU), memory stores state temporarily, and secondary storage preserves persistent state.'
          },
          {
            id: 'foundations-1-s2',
            title: 'Core Hardware Architecture Components',
            type: 'table',
            content: 'How hardware elements map from physical hardware to cloud abstractions:',
            tableData: {
              headers: ['Physical Component', 'Role in Processing', 'AWS Cloud Equivalent'],
              rows: [
                ['CPU (Processor)', 'Executes machine instructions and control flow', 'vCPU / EC2 Compute Units / Lambda vCPU'],
                ['RAM (Volatile Memory)', 'Stores runtime code and working datasets at high speeds', 'EC2 Instance Memory (GiB)'],
                ['Storage (SSD/NVMe)', 'Non-volatile long-term persistence for block and file data', 'EBS Volumes / Instance Store NVMe'],
                ['NIC (Network Controller)', 'Sends and receives packets across physical ethernet links', 'Elastic Network Interface (ENI)']
              ]
            }
          },
          {
            id: 'foundations-1-s3',
            title: 'Key Takeaway for Cloud Engineers',
            type: 'callout',
            content: 'Cloud computing does not eliminate hardware; it virtualizes it behind programmatic APIs. Sizing instances in AWS requires understanding whether your application workload is bottlenecked by CPU, Memory, Disk I/O, or Network throughput.'
          }
        ]
      }
    },
    {
      id: 'foundations-2',
      pathId: 'foundations',
      title: 'Servers & Operating Systems: The Host Environment',
      description: 'Explore the role of host operating systems, Linux and Windows kernels, system calls, and headless server environments.',
      difficulty: 'beginner',
      estimatedMinutes: 20,
      order: 2,
      content: {
        sections: [
          {
            id: 'foundations-2-s1',
            title: 'What Makes a Server Different From a PC?',
            type: 'text',
            content: 'A server is fundamentally a software-driven appliance optimized for continuous uptime, concurrent request handling, headless operation (no display or GUI), and high throughput. Enterprise server OS distributions like Amazon Linux 2023, Ubuntu Server, and Red Hat Enterprise Linux run stripped-down kernels stripped of desktop rendering overhead.'
          },
          {
            id: 'foundations-2-s2',
            title: 'The Operating System Stack',
            type: 'steps',
            content: 'How user applications interact with physical silicon through the OS layers:',
            steps: [
              { title: 'User Space', description: 'Web servers (Nginx), runtime environments (Node.js, JVM), and business logic execute here with restricted hardware access.' },
              { title: 'System Calls (syscalls)', description: 'The boundary interface that software uses to request privileged hardware actions (read file, open network socket, allocate memory).' },
              { title: 'Kernel Space', description: 'Core OS layer managing processes, scheduling threads, handling interrupts, and interfacing with device drivers.' },
              { title: 'Hardware', description: 'CPU execution rings (Ring 0 for Kernel, Ring 3 for Userland), RAM addresses, and device controllers.' }
            ]
          },
          {
            id: 'foundations-2-s3',
            title: 'Essential Linux Server CLI Inspection',
            type: 'code',
            language: 'bash',
            content: '# Check host CPU cores and architecture\nlscpu\n\n# Check total, free, and cached RAM\nfree -h\n\n# Inspect mounted block storage devices\nlsblk -f\n\n# Check running processes and CPU/memory consumers\ntop -b -n 1 | head -n 15'
          }
        ]
      }
    },
    {
      id: 'foundations-3',
      pathId: 'foundations',
      title: 'CPU, RAM, & Storage: The Latency Hierarchy',
      description: 'Understand latency numbers every cloud architect must know, from CPU L1 cache to network and cloud disk storage.',
      difficulty: 'beginner',
      estimatedMinutes: 20,
      order: 3,
      content: {
        sections: [
          {
            id: 'foundations-3-s1',
            title: 'The Memory & Latency Hierarchy',
            type: 'text',
            content: 'Latency dictates software performance. CPU cycles execute in fractions of a nanosecond, RAM registers in tens of nanoseconds, local NVMe drives in microseconds, and network/remote cloud storage in milliseconds. Designing resilient cloud applications requires minimizing round-trips to distant storage tiers.'
          },
          {
            id: 'foundations-3-s2',
            title: 'Latency Orders of Magnitude',
            type: 'table',
            content: 'Representative latency times across hardware and network boundaries:',
            tableData: {
              headers: ['Operation', 'Typical Latency', 'Human Analogy (1 CPU cycle = 1 sec)'],
              rows: [
                ['CPU L1 Cache Reference', '0.5 - 1 ns', '1 second'],
                ['RAM Access', '50 - 100 ns', '1.5 minutes'],
                ['NVMe Local SSD Read', '10 - 50 µs', '12 hours'],
                ['Remote EBS Volume (gp3)', '1 - 3 ms', '1 month'],
                ['Same-Region Network RTT', '0.5 - 1.5 ms', '2 weeks'],
                ['Cross-Region (US-East to EU-West)', '70 - 90 ms', '2.5 years']
              ]
            }
          },
          {
            id: 'foundations-3-s3',
            title: 'Architectural Lesson',
            type: 'callout',
            content: 'Never make synchronous cross-region calls within tight transaction loops. Keep caching layers (ElastiCache Redis) close to compute, and leverage local SSDs (Instance Store) when extreme IOPS are required.'
          }
        ]
      }
    },
    {
      id: 'foundations-4',
      pathId: 'foundations',
      title: 'Virtualization & Virtual Machines: The Cloud Foundation',
      description: 'Learn how Type 1 and Type 2 hypervisors partition physical bare-metal hardware into isolated virtual machines.',
      difficulty: 'beginner',
      estimatedMinutes: 20,
      order: 4,
      content: {
        sections: [
          {
            id: 'foundations-4-s1',
            title: 'Why Virtualization Changed Everything',
            type: 'text',
            content: 'Before virtualization, running one application per dedicated physical server led to catastrophic resource under-utilization (typically 5-15% CPU usage). Virtualization introduces an abstraction layer—the Hypervisor—allowing multiple isolated guest Operating Systems to safely share one physical host.'
          },
          {
            id: 'foundations-4-s2',
            title: 'Hypervisor Classifications & The AWS Nitro System',
            type: 'table',
            content: 'Evolution of virtualization architectures:',
            tableData: {
              headers: ['Model', 'Implementation', 'Characteristics', 'AWS Context'],
              rows: [
                ['Type 2 (Hosted)', 'Runs inside host OS (VirtualBox, VMware Workstation)', 'High overhead, unsuitable for production', 'Development laptops only'],
                ['Type 1 (Bare Metal)', 'Directly boots on hardware (Xen, KVM, ESXi)', 'High performance, direct hardware virtualization', 'Legacy EC2 (Xen-based instances)'],
                ['Offloaded Hypervisor', 'Dedicated PCIe hardware cards offload I/O, security, networking', 'Near 100% compute power dedicated to guest VM', 'AWS Nitro System (modern EC2 instances)']
              ]
            }
          },
          {
            id: 'foundations-4-s3',
            title: 'Why Nitro Matters',
            type: 'callout',
            content: 'AWS Nitro isolates security enforcement, VPC networking, and EBS volume handling onto dedicated Nitro hardware ASIC cards, liberating virtually 100% of host CPU and RAM directly for customer workloads.'
          }
        ]
      }
    },
    {
      id: 'foundations-5',
      pathId: 'foundations',
      title: 'Client-Server Architecture: The Blueprint of Distributed Systems',
      description: 'Deconstruct request-response cycles, statelessness, stateful backends, and multi-tier application patterns.',
      difficulty: 'beginner',
      estimatedMinutes: 15,
      order: 5,
      content: {
        sections: [
          {
            id: 'foundations-5-s1',
            title: 'The Multi-Tier Application Model',
            type: 'text',
            content: 'Modern web architectures separate concerns across discrete layers: the Presentation Tier (browsers/mobile clients), Logic/Application Tier (API servers, microservices), and Persistence/Data Tier (relational databases, object stores). Decoupling these tiers allows independent scaling, deployment, and security hardening.'
          },
          {
            id: 'foundations-5-s2',
            title: 'Stateful vs Stateless Design',
            type: 'table',
            content: 'Comparing state management strategies in cloud backends:',
            tableData: {
              headers: ['Attribute', 'Stateful Architecture', 'Stateless Architecture'],
              rows: [
                ['Session Storage', 'Stored locally in server RAM/local disk', 'Stored in external cache (Redis) or JWT token on client'],
                ['Horizontal Scaling', 'Difficult; requires sticky sessions and session replication', 'Trivial; any server can process any incoming request'],
                ['Failure Recovery', 'Server crash loses active user sessions', 'Server termination has zero impact on user experience'],
                ['AWS Best Practice', 'Avoid for web tiers; confine to database layers', 'Standard for EC2 Auto Scaling, ECS, and Lambda']
              ]
            }
          }
        ]
      }
    },
    {
      id: 'foundations-6',
      pathId: 'foundations',
      title: 'Cloud Computing Introduction: The NIST Definition & Value Proposition',
      description: 'Explore the 5 essential characteristics of cloud computing: on-demand self-service, broad network access, resource pooling, rapid elasticity, and measured service.',
      difficulty: 'beginner',
      estimatedMinutes: 15,
      order: 6,
      content: {
        sections: [
          {
            id: 'foundations-6-s1',
            title: 'NIST 5 Essential Characteristics',
            type: 'steps',
            content: 'The official criteria defining true cloud computing according to the National Institute of Standards and Technology (NIST):',
            steps: [
              { title: '1. On-Demand Self-Service', description: 'Provision compute, storage, and networking via APIs or console instantly without requiring human intervention from the provider.' },
              { title: '2. Broad Network Access', description: 'Capabilities are available over standard IP networks and accessible through standard platforms (laptops, mobile, APIs).' },
              { title: '3. Resource Pooling', description: 'Provider multi-tenant hardware resources are dynamically allocated and reassigned according to consumer demand.' },
              { title: '4. Rapid Elasticity', description: 'Capabilities can be elastically provisioned and released, scaling automatically outwards or inwards in real time.' },
              { title: '5. Measured Service', description: 'Resource usage is monitored, controlled, and billed based on exact consumption (per second, per GB-month).' }
            ]
          },
          {
            id: 'foundations-6-s2',
            title: 'The Strategic Cloud Advantage',
            type: 'callout',
            content: 'Cloud computing transforms IT from a slow procurement barrier into an agile software development feedback loop. Infrastructure is treated as software code, not static real estate.'
          }
        ]
      }
    },
    {
      id: 'foundations-7',
      pathId: 'foundations',
      title: 'Cloud Service Models: IaaS, PaaS, & SaaS',
      description: 'Differentiate between Infrastructure as a Service, Platform as a Service, and Software as a Service responsibility boundaries.',
      difficulty: 'beginner',
      estimatedMinutes: 20,
      order: 7,
      content: {
        sections: [
          {
            id: 'foundations-7-s1',
            title: 'The Shared Control Spectrum',
            type: 'table',
            content: 'Comparing customer management duties across cloud service models:',
            tableData: {
              headers: ['Model', 'You Manage', 'AWS Manages', 'AWS Example Services'],
              rows: [
                ['IaaS (Infrastructure)', 'OS, patches, runtime, app logic, scaling rules, data', 'Physical hardware, virtualization, facility, network cables', 'EC2, EBS, VPC'],
                ['PaaS (Platform)', 'Application code, environment configuration, database schemas', 'OS patching, server provisioning, runtime runtime engine', 'Elastic Beanstalk, App Runner, RDS'],
                ['SaaS (Software)', 'User access, permissions, application data', 'Everything from application code down to data center iron', 'Amazon QuickSight, AWS WorkMail, Slack']
              ]
            }
          },
          {
            id: 'foundations-7-s2',
            title: 'Selecting the Right Model',
            type: 'text',
            content: 'Modern engineering teams shift rightward along the spectrum toward PaaS and Serverless whenever possible to eliminate the undifferentiated heavy lifting of patching OS kernels and managing VM instances.'
          }
        ]
      }
    },
    {
      id: 'foundations-8',
      pathId: 'foundations',
      title: 'Scalability & High Availability: Vertical, Horizontal, and Redundancy',
      description: 'Master the core architectural principles that prevent outages and enable elastic growth under surge traffic.',
      difficulty: 'beginner',
      estimatedMinutes: 20,
      order: 8,
      content: {
        sections: [
          {
            id: 'foundations-8-s1',
            title: 'Vertical vs Horizontal Scalability',
            type: 'table',
            content: 'Understanding scale-up vs scale-out trade-offs:',
            tableData: {
              headers: ['Dimension', 'Vertical Scaling (Scale-Up)', 'Horizontal Scaling (Scale-Out)'],
              rows: [
                ['Mechanism', 'Upgrade instance type (e.g., t3.medium to r6g.8xlarge)', 'Add more identical instances behind an Application Load Balancer'],
                ['Downtime', 'Usually requires instance stop/restart downtime', 'Zero downtime; instances are added/removed elastically'],
                ['Hardware Limit', 'Hard physical ceiling (maximum CPU/RAM supported)', 'Practically unlimited cloud scale'],
                ['Cost Efficiency', 'Exponentially expensive at high hardware tiers', 'Linear, cost-effective pay-as-you-grow economics']
              ]
            }
          },
          {
            id: 'foundations-8-s2',
            title: 'High Availability vs Fault Tolerance',
            type: 'callout',
            content: 'High Availability (HA) ensures a system remains accessible with minimal acceptable degradation (e.g., 99.99% uptime). Fault Tolerance (FT) ensures zero interruption and zero state loss even during unexpected hardware failure, usually at significantly higher architectural cost.'
          }
        ]
      }
    },
    {
      id: 'foundations-9',
      pathId: 'foundations',
      title: 'CapEx vs OpEx: Cloud Financial Mechanics',
      description: 'Analyze capital expenditures vs operational expenditures, Total Cost of Ownership (TCO), and the financial levers of AWS.',
      difficulty: 'beginner',
      estimatedMinutes: 15,
      order: 9,
      content: {
        sections: [
          {
            id: 'foundations-9-s1',
            title: 'Financial Transition: On-Premises to Cloud',
            type: 'text',
            content: 'Capital Expenditure (CapEx) involves heavy upfront spending on physical hardware, real estate, cooling, generators, and multi-year licensing that depreciates over 3-5 years. Operational Expenditure (OpEx) represents pay-as-you-go day-to-day operational costs directly correlated to real-time business usage.'
          },
          {
            id: 'foundations-9-s2',
            title: 'The TCO Equation',
            type: 'table',
            content: 'Hidden costs in traditional on-premise infrastructure often omitted from naive comparisons:',
            tableData: {
              headers: ['Cost Category', 'Traditional On-Premises (CapEx)', 'AWS Cloud (OpEx)'],
              rows: [
                ['Server Hardware', 'Purchased for peak traffic 3 years ahead; depreciated', 'Billed per second or hour; scaled dynamically'],
                ['Data Center Facilities', 'Power, HVAC, physical security guards, fire suppression', 'Included transparently in service pricing'],
                ['Maintenance Personnel', 'Rack-and-stack engineers, SAN admins, hardware techs', 'Engineers focus on high-value business application code'],
                ['Over-provisioning', 'Massive idle capacity sitting at 80% waste', 'Auto Scaling spins down instances during off-peak hours']
              ]
            }
          }
        ]
      }
    },
    {
      id: 'foundations-10',
      pathId: 'foundations',
      title: 'AWS Global Overview: History, Scale, & Philosophy',
      description: 'Discover how Amazon Web Services pioneered the modern public cloud, and understand its foundational infrastructure philosophy.',
      difficulty: 'beginner',
      estimatedMinutes: 15,
      order: 10,
      content: {
        sections: [
          {
            id: 'foundations-10-s1',
            title: 'From S3 and SQS to Global Cloud Leader',
            type: 'text',
            content: 'AWS launched publicly in 2006 with SQS, S3, and EC2. The guiding philosophy was enabling two engineers in a garage to possess the exact same global compute, storage, and networking firepower as Fortune 500 enterprises. Today AWS operates hundreds of services spanning compute, machine learning, databases, and quantum computing.'
          },
          {
            id: 'foundations-10-s2',
            title: 'Core Architectural Tenets of AWS',
            type: 'steps',
            content: 'Key operational philosophies embedded across AWS design:',
            steps: [
              { title: 'Everything Fails All The Time', description: 'Quote by CTO Werner Vogels. Systems must be engineered with automatic failure recovery at every tier.' },
              { title: 'Primacy of APIs', description: 'Every AWS action is an authenticated, encrypted, and logged REST API call over HTTPS.' },
              { title: 'Security as Job Zero', description: 'No feature or speed improvement ever takes precedence over customer security and data isolation.' }
            ]
          }
        ]
      }
    }
  ]
};

export const networkingFundamentalsPath: LearningPath = {
  id: 'networking-fundamentals',
  title: 'Networking Fundamentals',
  description: 'Grasp foundational computer networking: IPv4/IPv6, CIDR blocks, packet routing, DNS, HTTP/HTTPS, TCP/UDP sockets, firewalls, and proxying.',
  icon: 'Network',
  order: 2,
  prerequisites: ['foundations'],
  estimatedHours: 3,
  lessons: [
    {
      id: 'networking-fundamentals-1',
      pathId: 'networking-fundamentals',
      title: 'IP Addresses & CIDR Notation: Addressing the Internet',
      description: 'Master 32-bit IPv4 addresses, subnet masks, slash notation, and calculating IP ranges.',
      difficulty: 'beginner',
      estimatedMinutes: 20,
      order: 1,
      content: {
        sections: [
          {
            id: 'networking-fundamentals-1-s1',
            title: 'The Structure of an IPv4 Address',
            type: 'text',
            content: 'An IPv4 address consists of 32 binary bits divided into four 8-bit octets represented in decimal (e.g., 192.168.1.1). CIDR (Classless Inter-Domain Routing) uses prefix notation (/N) to specify how many leading bits represent the network prefix, leaving the remaining bits (32 - N) for host addresses.'
          },
          {
            id: 'networking-fundamentals-1-s2',
            title: 'CIDR Subnet Math Reference',
            type: 'table',
            content: 'Common CIDR block sizes used in VPCs and cloud networking:',
            tableData: {
              headers: ['CIDR Notation', 'Subnet Mask', 'Total Addresses (2^(32-N))', 'Usable in standard LAN', 'Usable in AWS Subnet (-5)'],
              rows: [
                ['/16', '255.255.0.0', '65,536', '65,534', '65,531'],
                ['/20', '255.255.240.0', '4,096', '4,094', '4,091'],
                ['/24', '255.255.255.0', '256', '254', '251'],
                ['/28', '255.255.255.240', '16', '14', '11'],
                ['/32', '255.255.255.255', '1', '1 (single host)', 'N/A (single IP)']
              ]
            }
          },
          {
            id: 'networking-fundamentals-1-s3',
            title: 'Critical AWS Subnet Quirk',
            type: 'callout',
            content: 'In every AWS VPC subnet, AWS reserves exactly 5 IP addresses: .0 (Network address), .1 (VPC Router), .2 (Amazon Provided DNS / Route 53 Resolver), .3 (Future use), and .255 (Broadcast address). A /24 subnet provides 251 usable IPs, not 254!'
          }
        ]
      }
    },
    {
      id: 'networking-fundamentals-2',
      pathId: 'networking-fundamentals',
      title: 'Public vs Private IPs & RFC 1918',
      description: 'Understand globally routable public IPs vs non-routable private address spaces and NAT mechanisms.',
      difficulty: 'beginner',
      estimatedMinutes: 15,
      order: 2,
      content: {
        sections: [
          {
            id: 'networking-fundamentals-2-s1',
            title: 'RFC 1918 Private Address Ranges',
            type: 'text',
            content: 'Because IPv4 space is scarce (only ~4.3 billion possible IPs), RFC 1918 established three private address ranges that are never routed on the public internet. Organizations use these private addresses internally within local networks and cloud VPCs.'
          },
          {
            id: 'networking-fundamentals-2-s2',
            title: 'RFC 1918 IP Ranges',
            type: 'table',
            content: 'Private CIDR allocations:',
            tableData: {
              headers: ['Class / Range', 'CIDR Block', 'IP Range', 'Total IP Count'],
              rows: [
                ['Class A', '10.0.0.0/8', '10.0.0.0 – 10.255.255.255', '16,777,216'],
                ['Class B', '172.16.0.0/12', '172.16.0.0 – 172.31.255.255', '1,048,576'],
                ['Class C', '192.168.0.0/16', '192.168.0.0 – 192.168.255.255', '65,536']
              ]
            }
          },
          {
            id: 'networking-fundamentals-2-s3',
            title: 'Network Address Translation (NAT)',
            type: 'callout',
            content: 'When an instance on a private IP (e.g., 10.0.1.50) needs to download a security patch from the public internet, a NAT Gateway translates the private source IP to its own public IP before routing the packet across the Internet Gateway.'
          }
        ]
      }
    },
    {
      id: 'networking-fundamentals-3',
      pathId: 'networking-fundamentals',
      title: 'Routes, Default Gateways, & Packet Switching',
      description: 'Learn how routing tables match destination IPs to determine the next-hop interface for network packets.',
      difficulty: 'beginner',
      estimatedMinutes: 20,
      order: 3,
      content: {
        sections: [
          {
            id: 'networking-fundamentals-3-s1',
            title: 'The Mechanics of Routing Tables',
            type: 'text',
            content: 'Routers maintain routing tables containing pairs of Destination CIDRs and Targets (next hops). When a packet arrives, the router evaluates its destination IP against all entries and routes it using Longest Prefix Matching (the most specific CIDR rule wins).'
          },
          {
            id: 'networking-fundamentals-3-s2',
            title: 'Typical Cloud Subnet Route Table',
            type: 'table',
            content: 'Example routing rules for a public subnet:',
            tableData: {
              headers: ['Destination', 'Target', 'Purpose'],
              rows: [
                ['10.0.0.0/16', 'local', 'Direct internal routing between all subnets in the VPC'],
                ['0.0.0.0/0', 'igw-01a2b3c4d', 'Default gateway route directing all internet traffic to Internet Gateway']
              ]
            }
          },
          {
            id: 'networking-fundamentals-3-s3',
            title: 'The Default Route (0.0.0.0/0)',
            type: 'callout',
            content: '0.0.0.0/0 represents all possible IPv4 addresses (quad-zero). In a route table, it serves as the catch-all "default route" used when no more specific local network rule matches the destination IP.'
          }
        ]
      }
    },
    {
      id: 'networking-fundamentals-4',
      pathId: 'networking-fundamentals',
      title: 'DNS Resolution & Record Types: The Phonebook of the Web',
      description: 'Trace recursive and authoritative DNS queries and understand A, AAAA, CNAME, ALIAS, MX, and TXT records.',
      difficulty: 'beginner',
      estimatedMinutes: 20,
      order: 4,
      content: {
        sections: [
          {
            id: 'networking-fundamentals-4-s1',
            title: 'DNS Resolution Step-by-Step',
            type: 'steps',
            content: 'The journey of resolving api.example.com into an IP address:',
            steps: [
              { title: '1. Local DNS Cache', description: 'Client browser and OS cache are checked for active unexpired records.' },
              { title: '2. Recursive Resolver', description: 'Query hits ISP or VPC DNS resolver (e.g., 10.0.0.2 / 8.8.8.8).' },
              { title: '3. Root Nameserver', description: 'Resolver queries Root (.) nameservers which direct to the .com TLD nameserver.' },
              { title: '4. TLD Nameserver', description: '.com nameserver returns the authoritative nameservers for example.com (e.g., Route 53 NS).' },
              { title: '5. Authoritative Nameserver', description: 'Route 53 returns the final A record IP address with a defined TTL (Time-to-Live).' }
            ]
          },
          {
            id: 'networking-fundamentals-4-s2',
            title: 'Common DNS Record Types',
            type: 'table',
            content: 'Key DNS records every engineer must recognize:',
            tableData: {
              headers: ['Record Type', 'Target Value', 'Primary Use Case'],
              rows: [
                ['A', 'IPv4 Address (e.g. 54.210.12.3)', 'Map hostname to an IPv4 endpoint'],
                ['AAAA', 'IPv6 Address', 'Map hostname to an IPv6 endpoint'],
                ['CNAME', 'Canonical Hostname (e.g. app.cdn.net)', 'Alias one domain name to another domain name (cannot be at zone apex)'],
                ['ALIAS (AWS)', 'AWS Resource DNS (ALB, CloudFront, S3)', 'Route 53 specific pseudo-record supporting zone apex mapping with zero fee queries'],
                ['TXT', 'Text string', 'Domain ownership verification (SSL/TLS validation, SPF, DKIM)']
              ]
            }
          }
        ]
      }
    },
    {
      id: 'networking-fundamentals-5',
      pathId: 'networking-fundamentals',
      title: 'HTTP/HTTPS Flow: Request Methods, Headers, & Status Codes',
      description: 'Inspect the anatomy of HTTP/1.1 and HTTP/2 requests, response codes, statelessness, and caching headers.',
      difficulty: 'beginner',
      estimatedMinutes: 20,
      order: 5,
      content: {
        sections: [
          {
            id: 'networking-fundamentals-5-s1',
            title: 'The HTTP Request-Response Lifecycle',
            type: 'text',
            content: 'Hypertext Transfer Protocol (HTTP) is the application-layer protocol powering the web. Clients initiate TCP connections to port 80 (HTTP) or port 443 (HTTPS), transmit ASCII request headers with methods (GET, POST, PUT, DELETE), and receive structured status codes and payloads.'
          },
          {
            id: 'networking-fundamentals-5-s2',
            title: 'HTTP Status Code Families',
            type: 'table',
            content: 'Standard status codes and operational significance:',
            tableData: {
              headers: ['Range', 'Category', 'Examples & Significance'],
              rows: [
                ['2xx', 'Success', '200 OK, 201 Created, 204 No Content'],
                ['3xx', 'Redirection', '301 Moved Permanently (SEO redirect), 304 Not Modified (cached)'],
                ['4xx', 'Client Error', '400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 429 Too Many Requests'],
                ['5xx', 'Server Error', '500 Internal Error, 502 Bad Gateway (upstream failed), 503 Service Unavailable, 504 Gateway Timeout']
              ]
            }
          },
          {
            id: 'networking-fundamentals-5-s3',
            title: 'Inspecting HTTP Headers with cURL',
            type: 'code',
            language: 'bash',
            content: '# Inspect response headers, HTTP version, and timing\ncurl -Iv https://aws.amazon.com\n\n# Test API POST request with JSON payload\ncurl -X POST https://api.example.com/v1/orders \\\n  -H "Content-Type: application/json" \\\n  -H "Authorization: Bearer my-jwt-token" \\\n  -d \'{"itemId": "xyz", "quantity": 2}\''
          }
        ]
      }
    },
    {
      id: 'networking-fundamentals-6',
      pathId: 'networking-fundamentals',
      title: 'TCP vs UDP & Standard Port Numbers',
      description: 'Compare connection-oriented reliable TCP with connectionless low-latency UDP and memorize standard port allocations.',
      difficulty: 'beginner',
      estimatedMinutes: 20,
      order: 6,
      content: {
        sections: [
          {
            id: 'networking-fundamentals-6-s1',
            title: 'Transport Layer Protocols Compared',
            type: 'table',
            content: 'TCP vs UDP design characteristics:',
            tableData: {
              headers: ['Feature', 'TCP (Transmission Control Protocol)', 'UDP (User Datagram Protocol)'],
              rows: [
                ['Connection', '3-Way Handshake (SYN -> SYN-ACK -> ACK)', 'Connectionless; sends datagrams directly'],
                ['Reliability', 'Guaranteed delivery; retransmits lost packets', 'Best-effort; drops packets silently without retransmit'],
                ['Ordering', 'Sequenced; packets reassembled in order', 'No ordering guarantees'],
                ['Overhead', 'Higher (20-byte header, flow control, ACK tracking)', 'Minimal (8-byte header, low latency)'],
                ['Use Cases', 'Web (HTTP/HTTPS), SSH, Databases, APIs', 'DNS queries, Video streaming, VoIP, Gaming, DHCP']
              ]
            }
          },
          {
            id: 'networking-fundamentals-6-s2',
            title: 'Must-Know Standard Ports',
            type: 'table',
            content: 'Ports frequently referenced in AWS Security Groups:',
            tableData: {
              headers: ['Port', 'Protocol', 'Service / Cloud Application'],
              rows: [
                ['22', 'TCP', 'SSH (Linux Secure Shell management)'],
                ['53', 'UDP/TCP', 'DNS (Domain Name System)'],
                ['80', 'TCP', 'HTTP (Unencrypted web traffic)'],
                ['443', 'TCP', 'HTTPS / TLS (Encrypted web traffic)'],
                ['3389', 'TCP', 'RDP (Windows Remote Desktop Protocol)'],
                ['3306', 'TCP', 'MySQL / Aurora MySQL database port'],
                ['5432', 'TCP', 'PostgreSQL / Aurora PostgreSQL database port']
              ]
            }
          }
        ]
      }
    },
    {
      id: 'networking-fundamentals-7',
      pathId: 'networking-fundamentals',
      title: 'TLS & Digital Certificates: Securing Traffic in Transit',
      description: 'Understand symmetric vs asymmetric cryptography, certificate authorities (CAs), and TLS 1.3 handshake optimization.',
      difficulty: 'intermediate',
      estimatedMinutes: 20,
      order: 7,
      content: {
        sections: [
          {
            id: 'networking-fundamentals-7-s1',
            title: 'How TLS Encryption Protects Web Data',
            type: 'text',
            content: 'Transport Layer Security (TLS) combines asymmetric cryptography (public/private key pairs used during authentication and key exchange) with symmetric cryptography (fast AES session keys used for actual payload bulk data encryption). Digital certificates issued by trusted Certificate Authorities (CAs) prove domain ownership.'
          },
          {
            id: 'networking-fundamentals-7-s2',
            title: 'The TLS Handshake Flow',
            type: 'steps',
            content: 'How a secure TLS 1.3 session is negotiated:',
            steps: [
              { title: '1. Client Hello', description: 'Client sends supported cipher suites and a key share random parameter.' },
              { title: '2. Server Hello & Certificate', description: 'Server picks cipher suite, returns CA-signed X.509 certificate and server key share.' },
              { title: '3. Authentication & Key Derivation', description: 'Client verifies certificate against OS root trust store; both derive shared symmetric session key.' },
              { title: '4. Encrypted Application Data', description: 'All further requests and responses travel fully encrypted using the negotiated session key.' }
            ]
          },
          {
            id: 'networking-fundamentals-7-s3',
            title: 'AWS Certificate Manager (ACM) Advantage',
            type: 'callout',
            content: 'AWS Certificate Manager provides free public SSL/TLS certificates for integration with ALBs, CloudFront distributions, and API Gateways, complete with automatic annual renewal.'
          }
        ]
      }
    },
    {
      id: 'networking-fundamentals-8',
      pathId: 'networking-fundamentals',
      title: 'Firewalls & Packet Filtering: Stateful vs Stateless',
      description: 'Analyze perimeter defense mechanisms, state tables, and how cloud firewalls filter ingress and egress packets.',
      difficulty: 'intermediate',
      estimatedMinutes: 15,
      order: 8,
      content: {
        sections: [
          {
            id: 'networking-fundamentals-8-s1',
            title: 'Stateful vs Stateless Packet Filtering',
            type: 'table',
            content: 'The core technical difference between AWS Security Groups and Network ACLs:',
            tableData: {
              headers: ['Dimension', 'Stateful Firewall (Security Groups)', 'Stateless Firewall (NACLs)'],
              rows: [
                ['Connection Tracking', 'Tracks connection state in a connection state table', 'Evaluates every inbound and outbound packet independently'],
                ['Return Traffic', 'Automatically allows return traffic regardless of outbound rules', 'Requires explicit outbound rule opening ephemeral ports (1024-65535)'],
                ['Evaluation Order', 'All rules evaluated; union of all ALLOW rules', 'Evaluated in numerical order; lowest rule number matching wins'],
                ['Deny Rules', 'Only ALLOW rules supported (implicit deny everything else)', 'Supports explicit ALLOW and explicit DENY rules']
              ]
            }
          },
          {
            id: 'networking-fundamentals-8-s2',
            title: 'Ephemeral Port Trap',
            type: 'callout',
            content: 'When configuring stateless firewalls like AWS NACLs, you must explicitly permit outbound response traffic on high-numbered ephemeral ports (typically 1024-65535), otherwise responses to inbound HTTP requests will be silently dropped.'
          }
        ]
      }
    },
    {
      id: 'networking-fundamentals-9',
      pathId: 'networking-fundamentals',
      title: 'Load Balancing Concepts & Algorithms: Layer 4 vs Layer 7',
      description: 'Compare Layer 4 TCP/UDP pass-through routing with Layer 7 HTTP/HTTPS reverse-proxy application load balancing.',
      difficulty: 'intermediate',
      estimatedMinutes: 20,
      order: 9,
      content: {
        sections: [
          {
            id: 'networking-fundamentals-9-s1',
            title: 'OSI Layer 4 vs Layer 7 Load Balancing',
            type: 'table',
            content: 'Key architectural distinctions:',
            tableData: {
              headers: ['Capability', 'Layer 4 (Transport / NLB)', 'Layer 7 (Application / ALB)'],
              rows: [
                ['Inspection Level', 'IP header and TCP/UDP ports only', 'Full HTTP/HTTPS payload, path, host headers, cookies'],
                ['TLS Termination', 'Can pass-through raw TLS or terminate', 'Terminates TLS; can inspect and modify HTTP headers'],
                ['Routing Logic', 'IP/Port hash or round robin', 'Host-based, path-based (/api/*), query parameters, HTTP headers'],
                ['Performance & Latency', 'Ultra-low sub-millisecond latency; millions of RPS', 'Millisecond latency; rich application routing capabilities'],
                ['AWS Service', 'Network Load Balancer (NLB)', 'Application Load Balancer (ALB)']
              ]
            }
          },
          {
            id: 'networking-fundamentals-9-s2',
            title: 'Load Balancing Algorithms',
            type: 'steps',
            content: 'How load balancers distribute connections:',
            steps: [
              { title: 'Round Robin', description: 'Sequentially distributes each incoming request to the next healthy backend target in rotation.' },
              { title: 'Least Outstanding Requests (LOR)', description: 'Routes traffic to the instance currently processing the fewest active concurrent requests.' },
              { title: 'Flow Hash', description: 'Uses 5-tuple hash (source IP/port, dest IP/port, protocol) to consistently pin a TCP stream to one target.' }
            ]
          }
        ]
      }
    },
    {
      id: 'networking-fundamentals-10',
      pathId: 'networking-fundamentals',
      title: 'Network Troubleshooting Basics: Ping, Traceroute, & Dig',
      description: 'Master diagnostic utilities to isolate DNS, routing, port blocking, and firewall connectivity failures.',
      difficulty: 'intermediate',
      estimatedMinutes: 20,
      order: 10,
      content: {
        sections: [
          {
            id: 'networking-fundamentals-10-s1',
            title: 'The Layered Troubleshooting Methodology',
            type: 'text',
            content: 'When diagnosing network connectivity issues in the cloud, always troubleshoot from bottom to top: 1) Physical/VPC Route Tables, 2) Security Groups & NACLs, 3) DNS resolution, 4) Port accessibility and process binding, 5) Application SSL/TLS and HTTP responses.'
          },
          {
            id: 'networking-fundamentals-10-s2',
            title: 'Essential CLI Diagnostics Toolset',
            type: 'code',
            language: 'bash',
            content: '# 1. Check DNS resolution and query latency\ndig +short api.production.aws.internal\nnslookup www.amazon.com\n\n# 2. Check TCP port reachability (avoids ICMP ping which is often blocked)\nnc -zv 10.0.1.25 443\ncurl -v telnet://10.0.1.25:5432\n\n# 3. Trace network hop progression and latency\ntraceroute -n -T -p 443 1.1.1.1\n\n# 4. Check local listening ports on the instance\nsudo ss -tulpn | grep -E "80|443|3000"'
          },
          {
            id: 'networking-fundamentals-10-s3',
            title: 'Golden Rule of AWS Network Debugging',
            type: 'callout',
            content: 'Never rely solely on "ping" (ICMP). Most AWS Security Groups drop ICMP Echo Request packets by default. Always test the specific target protocol and port using curl, nc (netcat), or test-netconnection.'
          }
        ]
      }
    }
  ]
};


export const appFundamentalsPath: LearningPath = {
  id: 'app-fundamentals',
  title: 'Application & Data Fundamentals',
  description: 'Understand modern software architecture: monolithic vs microservice designs, block vs file vs object storage, relational vs NoSQL databases, API styles, containers, and IaC.',
  icon: 'Layers',
  order: 3,
  prerequisites: ['foundations'],
  estimatedHours: 2.5,
  lessons: [
    {
      id: 'app-fundamentals-1',
      pathId: 'app-fundamentals',
      title: 'Application Architecture: Monoliths to Microservices',
      description: 'Explore the trade-offs between tightly-coupled monolithic codebases and independently-deployable distributed microservices.',
      difficulty: 'beginner',
      estimatedMinutes: 25,
      order: 1,
      content: {
        sections: [
          {
            id: 'app-fundamentals-1-s1',
            title: 'Monolith vs Microservices Architecture',
            type: 'text',
            content: 'A monolithic architecture packages all business domains (users, billing, inventory, notifications) into a single unified binary or codebase. While simple to develop and deploy initially, monoliths present scaling bottlenecks and deploy friction. Microservices decompose systems into independent, single-responsibility services communicating over lightweight network APIs.'
          },
          {
            id: 'app-fundamentals-1-s2',
            title: 'Architectural Comparison',
            type: 'table',
            content: 'Detailed comparison of architecture characteristics:',
            tableData: {
              headers: ['Dimension', 'Monolithic Architecture', 'Microservices Architecture'],
              rows: [
                ['Deployment', 'All-or-nothing deployment; single release pipeline', 'Independent deployment per service; continuous delivery'],
                ['Scaling', 'Vertical or entire fleet duplication (inefficient)', 'Surgically scale only high-load services (e.g., checkout)'],
                ['Failure Domain', 'A memory leak or bug can crash the entire system', 'Faults are isolated; blast radius is contained'],
                ['Operational Complexity', 'Low (single database, single log stream)', 'High (distributed tracing, service discovery, API contracts)']
              ]
            }
          },
          {
            id: 'app-fundamentals-1-s3',
            title: 'Cloud Decomposition Strategy',
            type: 'callout',
            content: 'When moving to AWS, decouple monolithic components using asynchronous message queues (SQS) and pub/sub topics (SNS) rather than direct synchronous HTTP calls. This eliminates cascading failures.'
          }
        ]
      }
    },
    {
      id: 'app-fundamentals-2',
      pathId: 'app-fundamentals',
      title: 'Storage Types: Block vs File vs Object Storage',
      description: 'Master the fundamental distinctions between raw disk blocks, shared file systems, and key-value object stores.',
      difficulty: 'beginner',
      estimatedMinutes: 25,
      order: 2,
      content: {
        sections: [
          {
            id: 'app-fundamentals-2-s1',
            title: 'The Three Storage Paradigms',
            type: 'table',
            content: 'Comparing block, file, and object cloud storage mechanics:',
            tableData: {
              headers: ['Storage Model', 'How Data is Stored', 'Access Protocol', 'AWS Service', 'Best Use Case'],
              rows: [
                ['Block Storage', 'Raw unformatted blocks (512B/4KB sectors)', 'SCSI / NVMe (direct block I/O)', 'Amazon EBS', 'Boot drives, databases (Postgres, Oracle, SQL Server)'],
                ['File Storage', 'Hierarchical directories and files with POSIX permissions', 'NFS / SMB network file share', 'Amazon EFS / FSx', 'Shared application mounts, WordPress content, legacy NAS'],
                ['Object Storage', 'Flat namespace of immutable objects (Data + Metadata + Key)', 'REST API over HTTP/S (GET, PUT)', 'Amazon S3', 'Static web assets, backups, data lakes, analytics']
              ]
            }
          },
          {
            id: 'app-fundamentals-2-s2',
            title: 'Critical Distinction: EBS vs S3',
            type: 'callout',
            content: 'You cannot boot an EC2 operating system directly off Amazon S3, nor can you mount S3 as a high-performance transactional POSIX filesystem. EBS is virtual hard drives attached to one instance; S3 is internet-accessible distributed object storage.'
          }
        ]
      }
    },
    {
      id: 'app-fundamentals-3',
      pathId: 'app-fundamentals',
      title: 'Database Concepts: SQL vs NoSQL vs In-Memory',
      description: 'Deconstruct relational ACID guarantees, NoSQL flexible schemas, and sub-millisecond in-memory caching.',
      difficulty: 'beginner',
      estimatedMinutes: 25,
      order: 3,
      content: {
        sections: [
          {
            id: 'app-fundamentals-3-s1',
            title: 'Database Paradigms Compared',
            type: 'table',
            content: 'Choosing the right database engine based on access patterns:',
            tableData: {
              headers: ['Paradigm', 'Characteristics', 'Data Model', 'AWS Engine', 'When to Choose'],
              rows: [
                ['Relational (SQL)', 'ACID transactions, rigid schema, complex joins', 'Rows & Columns', 'Amazon Aurora / RDS', 'Transactional commerce, financial records, complex reporting'],
                ['Key-Value (NoSQL)', 'Single-digit ms latency, unlimited scale, flexible schema', 'Key -> JSON Document', 'Amazon DynamoDB', 'High-volume user sessions, gaming leaderboards, cart checkout'],
                ['Document (NoSQL)', 'Hierarchical documents, nested collections', 'BSON / JSON', 'Amazon DocumentDB', 'Content management, product catalogs'],
                ['In-Memory Cache', 'Sub-millisecond latency, volatile RAM persistence', 'Key-Value / Data structures', 'Amazon ElastiCache (Redis)', 'Session caching, hot query caching, rate limiting']
              ]
            }
          },
          {
            id: 'app-fundamentals-3-s2',
            title: 'The CAP Theorem & DynamoDB',
            type: 'callout',
            content: 'In distributed systems, the CAP Theorem dictates you can only guarantee two out of Consistency, Availability, and Partition Tolerance. DynamoDB defaults to Eventual Consistency for ultra-high availability, but allows Strongly Consistent reads at twice the read unit cost.'
          }
        ]
      }
    },
    {
      id: 'app-fundamentals-4',
      pathId: 'app-fundamentals',
      title: 'APIs & Protocols: REST, GraphQL, gRPC, & WebSockets',
      description: 'Understand synchronous and asynchronous inter-service communication paradigms and API gateway integrations.',
      difficulty: 'intermediate',
      estimatedMinutes: 25,
      order: 4,
      content: {
        sections: [
          {
            id: 'app-fundamentals-4-s1',
            title: 'Modern Communication Protocols',
            type: 'table',
            content: 'Evaluation of API protocols:',
            tableData: {
              headers: ['Protocol', 'Data Format', 'Transport', 'AWS Gateway Integration', 'Primary Use Case'],
              rows: [
                ['REST', 'JSON / XML', 'HTTP/1.1 or HTTP/2', 'API Gateway (REST / HTTP API)', 'Public web APIs, CRUD microservices'],
                ['GraphQL', 'JSON with client query schema', 'HTTP POST', 'AWS AppSync', 'Mobile backends with flexible data fetching needs'],
                ['gRPC', 'Protocol Buffers (Protobuf binary)', 'HTTP/2 multiplexing', 'Application Load Balancer', 'Internal microservice-to-microservice low latency calls'],
                ['WebSockets', 'Raw text / binary frames', 'Bidirectional TCP upgrade', 'API Gateway WebSocket API', 'Real-time chats, financial tickers, live collaboration']
              ]
            }
          },
          {
            id: 'app-fundamentals-4-s2',
            title: 'Why Binary Protocols Matter for Internal Services',
            type: 'callout',
            content: 'JSON parsing carries substantial CPU serialization overhead. For high-throughput internal microservice meshes, binary protocols like Protocol Buffers (gRPC) reduce payload sizes by up to 70% and lower CPU parsing overhead.'
          }
        ]
      }
    },
    {
      id: 'app-fundamentals-5',
      pathId: 'app-fundamentals',
      title: 'Containers Introduction: cgroups, Namespaces, & Images',
      description: 'Discover how Linux kernel features enable process isolation and immutable software packaging without hypervisor overhead.',
      difficulty: 'intermediate',
      estimatedMinutes: 25,
      order: 5,
      content: {
        sections: [
          {
            id: 'app-fundamentals-5-s1',
            title: 'What is a Container?',
            type: 'text',
            content: 'Unlike a virtual machine which boots an entire guest OS kernel atop a hypervisor, a container is simply an isolated Linux process running directly on the host kernel. Isolation is achieved via Linux Namespaces (isolating PID, Network, Mounts) and Control Groups / cgroups (metering CPU, RAM, and Disk I/O limits).'
          },
          {
            id: 'app-fundamentals-5-s2',
            title: 'VM vs Container Architecture',
            type: 'table',
            content: 'Resource comparison between virtual machines and containers:',
            tableData: {
              headers: ['Attribute', 'Virtual Machines (EC2)', 'Containers (Docker / ECS)'],
              rows: [
                ['Kernel', 'Own dedicated guest OS kernel', 'Shares host Linux kernel'],
                ['Startup Time', 'Minutes (full OS boot)', 'Seconds to sub-second'],
                ['Footprint', 'Gigabytes (OS image + libraries)', 'Megabytes (app binary + stripped runtime)'],
                ['Density', 'Dozens of VMs per physical host', 'Hundreds of containers per host']
              ]
            }
          },
          {
            id: 'app-fundamentals-5-s3',
            title: 'Container Layering Anatomy',
            type: 'callout',
            content: 'Container images are composed of immutable, read-only filesystem layers cached on disk. When a container runs, a thin, ephemeral writable layer is mounted on top. Changes to container storage are lost upon termination unless backed by persistent volumes.'
          }
        ]
      }
    },
    {
      id: 'app-fundamentals-6',
      pathId: 'app-fundamentals',
      title: 'Infrastructure as Code (IaC) Concepts & Declarative Models',
      description: 'Learn why production cloud environments forbid manual console configuration in favor of version-controlled declarative templates.',
      difficulty: 'beginner',
      estimatedMinutes: 25,
      order: 6,
      content: {
        sections: [
          {
            id: 'app-fundamentals-6-s1',
            title: 'Declarative vs Imperative Infrastructure',
            type: 'table',
            content: 'Understanding how IaC tools state goals vs steps:',
            tableData: {
              headers: ['Paradigm', 'Approach', 'Example Tools', 'Trade-offs'],
              rows: [
                ['Declarative', 'State the desired end-state; the engine determines the delta actions to achieve it', 'AWS CloudFormation, Terraform', 'Idempotent, self-healing, auditable, predictable state transitions'],
                ['Imperative', 'Write step-by-step scripts detailing each API call to execute sequentially', 'AWS CLI scripts, Python Boto3 scripts', 'Prone to failure if steps fail halfway; difficult to track drifts and state rollback']
              ]
            }
          },
          {
            id: 'app-fundamentals-6-s2',
            title: 'Key Benefits of IaC',
            type: 'steps',
            content: 'Why engineering teams treat infrastructure as code:',
            steps: [
              { title: 'Repeatability & Consistency', description: 'Spin up identical Staging, QA, and Production environments across multiple AWS regions in minutes.' },
              { title: 'Version Control & Auditability', description: 'Every infrastructure modification is recorded in Git pull requests with code reviews and automated linting.' },
              { title: 'Automated Rollbacks', description: 'If a CloudFormation stack update fails, the engine safely rolls back all resources to their previous healthy state.' }
            ]
          }
        ]
      }
    }
  ]
};

export const awsCorePath: LearningPath = {
  id: 'aws-core',
  title: 'AWS Global Infrastructure & IAM',
  description: 'Master the backbone of AWS: Regions, Availability Zones, Edge Locations, and the critical Identity and Access Management (IAM) security model.',
  icon: 'ShieldCheck',
  order: 4,
  prerequisites: ['foundations'],
  estimatedHours: 3,
  lessons: [
    {
      id: 'aws-core-1',
      pathId: 'aws-core',
      title: 'AWS Global Infrastructure: Regions, AZs, & Edge Locations',
      description: 'Explore the global physical footprint of AWS and understand data sovereignty, latency, and fault isolation boundaries.',
      difficulty: 'beginner',
      estimatedMinutes: 25,
      order: 1,
      content: {
        sections: [
          {
            id: 'aws-core-1-s1',
            title: 'Regions and Availability Zones Explained',
            type: 'text',
            content: 'An AWS Region is a separate geographic area (e.g., us-east-1 in N. Virginia, eu-west-1 in Ireland). Each Region contains multiple, physically separated and isolated Availability Zones (AZs). Each AZ consists of one or more discrete data centers with redundant power, networking, and connectivity, located miles apart to protect against natural disasters while maintaining single-digit millisecond latency between AZs.'
          },
          {
            id: 'aws-core-1-s2',
            title: 'Global Infrastructure Components',
            type: 'table',
            content: 'The tiers of AWS global presence:',
            tableData: {
              headers: ['Infrastructure Type', 'Description', 'Primary Purpose', 'Examples'],
              rows: [
                ['AWS Region', 'Geographic cluster of 3+ AZs', 'Data residency, regulatory compliance, close to user base', 'us-east-1, eu-central-1, ap-southeast-1'],
                ['Availability Zone (AZ)', '1+ isolated data centers with private fiber', 'High availability and fault tolerance within a region', 'us-east-1a, us-east-1b, us-east-1c'],
                ['Edge Location / CloudFront PoP', 'Global network of 400+ caching points of presence', 'Content caching, DDoS protection, low latency termination', 'Worldwide major metropolitan cities'],
                ['Local Zones & Wavelength', 'AWS compute extended close to metros or 5G telecom towers', 'Single-digit millisecond latency for AR/VR, gaming, 5G apps', 'Los Angeles, Dallas, Tokyo 5G']
              ]
            }
          },
          {
            id: 'aws-core-1-s3',
            title: 'AZ Physical vs Logical Mapping',
            type: 'callout',
            content: 'To distribute resources evenly across physical data centers, AWS maps AZ names randomly for each account. Your "us-east-1a" may map to physical AZ ID "use1-az1" while another account\'s "us-east-1a" maps to "use1-az2". Always reference AZ IDs for coordinated low latency cross-account architectures.'
          }
        ]
      }
    },
    {
      id: 'aws-core-2',
      pathId: 'aws-core',
      title: 'AWS Management Console, AWS CLI, & CloudShell',
      description: 'Learn the primary administrative interfaces to AWS, authentication keys, and configuring the AWS Command Line Interface.',
      difficulty: 'beginner',
      estimatedMinutes: 25,
      order: 2,
      content: {
        sections: [
          {
            id: 'aws-core-2-s1',
            title: 'Interacting with the AWS Control Plane',
            type: 'text',
            content: 'The AWS Management Console provides a web UI ideal for visual exploration and learning. For repeatable operations, automation, and DevOps scripting, the AWS CLI v2 and SDKs allow direct programmatic interaction with the unified AWS REST API using Access Key ID and Secret Access Key pairs.'
          },
          {
            id: 'aws-core-2-s2',
            title: 'Configuring the AWS CLI',
            type: 'code',
            language: 'bash',
            content: '# Configure AWS credentials interactively\naws configure\n# AWS Access Key ID [None]: AKIAIOSFODNN7EXAMPLE\n# AWS Secret Access Key [None]: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY\n# Default region name [None]: us-east-1\n# Default output format [None]: json\n\n# Verify identity and active credentials\naws sts get-caller-identity\n\n# List S3 buckets with JSON query filtering\naws s3api list-buckets --query "Buckets[].Name" --output table'
          },
          {
            id: 'aws-core-2-s3',
            title: 'Security Warning: Never Hardcode Access Keys',
            type: 'callout',
            content: 'Never commit long-lived Access Keys to Git repositories. When running code on EC2 or Lambda, always use IAM Roles and AWS STS temporary credentials instead of static API keys.'
          }
        ]
      }
    },
    {
      id: 'aws-core-3',
      pathId: 'aws-core',
      title: 'IAM Users, Groups, & Root Account Security',
      description: 'Protect the AWS root account with MFA and architect secure human access using IAM users, groups, and IAM Identity Center.',
      difficulty: 'beginner',
      estimatedMinutes: 25,
      order: 3,
      content: {
        sections: [
          {
            id: 'aws-core-3-s1',
            title: 'The AWS Root User: Lock It Down',
            type: 'text',
            content: 'The account root user is created with the email address used to create the AWS account and possesses unrestricted access to all account resources, billing, and permissions. The root user cannot be restricted by IAM policies. Best practice dictates creating individual admin users, locking away the root user credentials, and enabling multi-factor authentication (MFA).'
          },
          {
            id: 'aws-core-3-s2',
            title: 'Root Account Hardening Checklist',
            type: 'steps',
            content: 'Immediate steps required upon creating any new AWS account:',
            steps: [
              { title: '1. Enable Hardware or Virtual MFA', description: 'Attach a FIDO security key (YubiKey) or Authenticator app to the root user.' },
              { title: '2. Delete Root Access Keys', description: 'Never generate or download access keys for the root account; delete them if created.' },
              { title: '3. Create IAM Administrative Users/SSO', description: 'Set up IAM Identity Center (AWS SSO) or an administrative IAM User for everyday work.' },
              { title: '4. Set Up Billing Alarms', description: 'Enable CloudWatch billing alerts and AWS Budgets to prevent unexpected charges.' }
            ]
          }
        ]
      }
    },
    {
      id: 'aws-core-4',
      pathId: 'aws-core',
      title: 'IAM Policies: JSON Structure, Evaluation Logic, & Least Privilege',
      description: 'Deconstruct IAM JSON syntax: Effect, Action, Resource, and Condition blocks, and master the authorization evaluation engine.',
      difficulty: 'intermediate',
      estimatedMinutes: 30,
      order: 4,
      content: {
        sections: [
          {
            id: 'aws-core-4-s1',
            title: 'Anatomy of an IAM Policy Document',
            type: 'code',
            language: 'json',
            content: '{\n  "Version": "2012-10-17",\n  "Statement": [\n    {\n      "Sid": "AllowS3ReadOnlyForDepartment",\n      "Effect": "Allow",\n      "Action": [\n        "s3:GetObject",\n        "s3:ListBucket"\n      ],\n      "Resource": [\n        "arn:aws:s3:::company-analytics-data",\n        "arn:aws:s3:::company-analytics-data/*"\n      ],\n      "Condition": {\n        "Bool": {\n          "aws:MultiFactorAuthPresent": "true"\n        }\n      }\n    }\n  ]\n}'
          },
          {
            id: 'aws-core-4-s2',
            title: 'IAM Policy Evaluation Flow',
            type: 'steps',
            content: 'How AWS evaluates every incoming API request:',
            steps: [
              { title: '1. Default Deny', description: 'By default, all requests are implicitly denied.' },
              { title: '2. Check Explicit Deny', description: 'If ANY matching policy statement contains "Effect": "Deny", the request is immediately rejected (Deny overrides everything).' },
              { title: '3. Check Explicit Allow', description: 'If no explicit deny exists, AWS checks for at least one statement containing "Effect": "Allow".' },
              { title: '4. Final Verdict', description: 'If an explicit allow exists and no explicit deny exists, access is granted. Otherwise, denied.' }
            ]
          },
          {
            id: 'aws-core-4-s3',
            title: 'The Principle of Least Privilege',
            type: 'callout',
            content: 'Grant only the minimum permissions necessary to perform the designated task. Avoid wildcard "Action": "*" and "Resource": "*" statements in production policies.'
          }
        ]
      }
    },
    {
      id: 'aws-core-5',
      pathId: 'aws-core',
      title: 'IAM Roles & Temporary Credentials (STS)',
      description: 'Learn how IAM Roles grant short-lived credentials to EC2 instances, Lambda functions, and cross-account principals via AWS STS.',
      difficulty: 'intermediate',
      estimatedMinutes: 30,
      order: 5,
      content: {
        sections: [
          {
            id: 'aws-core-5-s1',
            title: 'How IAM Roles Work',
            type: 'text',
            content: 'An IAM Role is an identity that does not have permanent credentials (no password or long-lived access keys). Instead, trusted entities (like an EC2 instance or an external AWS account) assume the role and receive temporary security credentials with an expiration time (15 minutes to 12 hours) via AWS Security Token Service (STS).'
          },
          {
            id: 'aws-core-5-s2',
            title: 'Role Components: Trust Policy vs Permissions Policy',
            type: 'table',
            content: 'The two required policy documents attached to every IAM Role:',
            tableData: {
              headers: ['Policy Type', 'Who/What It Defines', 'Key Statement'],
              rows: [
                ['Trust Policy (AssumeRolePolicyDocument)', 'WHO is allowed to assume this role (Principals like ec2.amazonaws.com or another AWS Account ID)', '"Principal": { "Service": "ec2.amazonaws.com" }, "Action": "sts:AssumeRole"'],
                ['Permissions Policy (Identity-based)', 'WHAT permissions the principal receives once they assume the role', '"Action": "s3:PutObject", "Resource": "arn:aws:s3:::my-bucket/*"']
              ]
            }
          },
          {
            id: 'aws-core-5-s3',
            title: 'Instance Profiles for EC2',
            type: 'callout',
            content: 'When attaching an IAM Role to an EC2 instance, AWS wraps the role in an "Instance Profile". The EC2 instance metadata service (IMDSv2 at 169.254.169.254) automatically provides rotated temporary credentials to the AWS SDK running on the VM.'
          }
        ]
      }
    },
    {
      id: 'aws-core-6',
      pathId: 'aws-core',
      title: 'AWS Shared Responsibility Model & Security Boundaries',
      description: 'Define the boundary between "Security OF the Cloud" (AWS responsibility) and "Security IN the Cloud" (Customer responsibility).',
      difficulty: 'beginner',
      estimatedMinutes: 20,
      order: 6,
      content: {
        sections: [
          {
            id: 'aws-core-6-s1',
            title: 'Security OF the Cloud vs Security IN the Cloud',
            type: 'table',
            content: 'Division of security obligations:',
            tableData: {
              headers: ['Responsibility Tier', 'Managed By', 'Includes'],
              rows: [
                ['Security OF the Cloud', 'AWS', 'Physical data centers, server hardware, virtualization hypervisor, fiber lines, facility biometric access, hardware decommissioning'],
                ['Security IN the Cloud', 'Customer', 'Customer data encryption (at rest & in transit), OS patching on EC2, Security Groups & firewalls, IAM user management, application vulnerability patching']
              ]
            }
          },
          {
            id: 'aws-core-6-s2',
            title: 'Service Model Shift',
            type: 'callout',
            content: 'The division shifts depending on the service model: For EC2 (IaaS), you patch the OS and configure firewall ports. For RDS or Lambda (Serverless/Managed), AWS patches the OS and database runtime; you only manage database users, queries, and IAM triggers.'
          }
        ]
      }
    },
    {
      id: 'aws-core-7',
      pathId: 'aws-core',
      title: 'AWS Organizations & Multi-Account Governance Intro',
      description: 'Understand multi-account architectures, Consolidated Billing, Organizational Units (OUs), and Service Control Policies (SCPs).',
      difficulty: 'intermediate',
      estimatedMinutes: 25,
      order: 7,
      content: {
        sections: [
          {
            id: 'aws-core-7-s1',
            title: 'Why Multiple AWS Accounts?',
            type: 'text',
            content: 'Using a single AWS account for everything creates security blast radius risks, shared quota exhaustion, and billing confusion. Modern enterprise cloud architecture isolates workloads into multiple accounts: Security Tooling, Log Archive, Shared Services, Development, Staging, and Production.'
          },
          {
            id: 'aws-core-7-s2',
            title: 'Service Control Policies (SCPs)',
            type: 'callout',
            content: 'SCPs are organization guardrails applied at the OU or account level. An SCP specifies the maximum available permissions for member accounts. Crucially, SCPs even restrict the root user of member accounts! If an SCP denies s3:DeleteBucket, even the member account root user cannot delete a bucket.'
          }
        ]
      }
    }
  ]
};


export const computeStoragePath: LearningPath = {
  id: 'compute-storage',
  title: 'Core Compute & Storage',
  description: 'Master Amazon EC2, EBS block storage, S3 object tiers, EFS network file systems, Elastic Load Balancing, and Auto Scaling fleets.',
  icon: 'HardDrive',
  order: 5,
  prerequisites: ['foundations', 'aws-core'],
  estimatedHours: 4,
  lessons: [
    {
      id: 'compute-storage-1',
      pathId: 'compute-storage',
      title: 'EC2 Fundamentals: Instances, Virtualization, and Lifecycle',
      description: 'Understand Elastic Compute Cloud instances, virtualization under Nitro, lifecycle states, and billing increments.',
      difficulty: 'beginner',
      estimatedMinutes: 20,
      order: 1,
      content: {
        sections: [
          {
            id: 'compute-storage-1-s1',
            title: 'What is Amazon Elastic Compute Cloud (EC2)?',
            type: 'text',
            content: 'Amazon EC2 provides resizable virtual computing capacity in the cloud. Instances can be launched on demand, configured with custom operating systems, attached to network interfaces and block volumes, and resized as computing needs evolve.'
          },
          {
            id: 'compute-storage-1-s2',
            title: 'EC2 Instance Lifecycle States',
            type: 'table',
            content: 'Instance lifecycle transitions and their billing/storage impact:',
            tableData: {
              headers: ['State', 'Billing Status', 'Instance Store Data', 'EBS Root Volume', 'Public IP Behavior'],
              rows: [
                ['Pending', 'No compute charge', 'Allocating', 'Preserved', 'Assigned upon running'],
                ['Running', 'Per-second compute charge', 'Active and accessible', 'Preserved and attached', 'Active'],
                ['Stopping / Stopped', 'Compute charges cease; EBS volume charges continue', 'LOST PERMANENTLY', 'Preserved on EBS', 'Public IPv4 released (unless Elastic IP)'],
                ['Terminated', 'All billing ceases', 'LOST PERMANENTLY', 'Deleted by default (DeleteOnTermination=true)', 'Released permanently']
              ]
            }
          },
          {
            id: 'compute-storage-1-s3',
            title: 'Critical Lifecycle Note',
            type: 'callout',
            content: 'When an EC2 instance is stopped and started again, it typically moves to a different physical host hardware blade. Its private IP remains constant, but its dynamic public IPv4 address changes unless an Elastic IP address is associated.'
          }
        ]
      }
    },
    {
      id: 'compute-storage-2',
      pathId: 'compute-storage',
      title: 'EC2 Instance Families & Right-Sizing',
      description: 'Navigate General Purpose, Compute Optimized, Memory Optimized, Storage Optimized, and Accelerated Computing instance types.',
      difficulty: 'intermediate',
      estimatedMinutes: 20,
      order: 2,
      content: {
        sections: [
          {
            id: 'compute-storage-2-s1',
            title: 'EC2 Instance Family Classifications',
            type: 'table',
            content: 'Understanding naming nomenclature (e.g., m7g.2xlarge = Family: General [m], Gen: 7, Processor: Graviton [g], Size: 2xlarge):',
            tableData: {
              headers: ['Family', 'Prefix', 'Ratio (RAM to vCPU)', 'Typical Target Workloads'],
              rows: [
                ['General Purpose', 'M, T (burstable)', '4 GiB per vCPU', 'Web servers, development environments, microservices'],
                ['Compute Optimized', 'C (c6i, c7g)', '2 GiB per vCPU', 'Batch processing, video encoding, gaming servers, high-performance web apps'],
                ['Memory Optimized', 'R, X, z1d', '8-16 GiB per vCPU', 'High-performance databases, in-memory caches (Redis/Memcached), SAP HANA'],
                ['Storage Optimized', 'I (NVMe), D, H', 'High local storage', 'NoSQL databases (Cassandra, MongoDB), data warehouses, Kafka clusters'],
                ['Accelerated Computing', 'P, G, Inf, Trn', 'Hardware GPUs/TPUs', 'Machine learning training & inference, 3D graphics rendering']
              ]
            }
          },
          {
            id: 'compute-storage-2-s2',
            title: 'AWS Graviton Processor Advantage',
            type: 'callout',
            content: 'AWS Graviton instances (indicated by the "g" suffix, like c7g, m7g, r7g) use custom 64-bit ARM Neoverse cores designed by AWS. They deliver up to 40% better price-performance over comparable x86-64 processors.'
          }
        ]
      }
    },
    {
      id: 'compute-storage-3',
      pathId: 'compute-storage',
      title: 'AMIs & EC2 User Data Bootstrapping',
      description: 'Create immutable machine images and automate instance configuration at first boot using Cloud-Init shell scripts.',
      difficulty: 'beginner',
      estimatedMinutes: 20,
      order: 3,
      content: {
        sections: [
          {
            id: 'compute-storage-3-s1',
            title: 'Amazon Machine Images (AMIs)',
            type: 'text',
            content: 'An AMI provides the information required to launch an instance: a root volume template (operating system, preinstalled software, configurations), launch permissions, and block device mapping. AMIs are regional resources that can be copied across regions or shared with other AWS accounts.'
          },
          {
            id: 'compute-storage-3-s2',
            title: 'Bootstrapping with User Data Script',
            type: 'code',
            language: 'bash',
            content: '#!/bin/bash\n# User Data script executes as root only once during the very first boot\nyum update -y\nyum install -y httpd\nsystemctl start httpd\nsystemctl enable httpd\n\n# Query EC2 Instance Metadata Service (IMDSv2) for Availability Zone\nTOKEN=$(curl -s -X PUT "http://169.254.169.254/latest/api/token" -H "X-aws-ec2-metadata-token-ttl-seconds: 21600")\nAZ=$(curl -s -H "X-aws-ec2-metadata-token: $TOKEN" http://169.254.169.254/latest/meta-data/placement/availability-zone)\n\necho "<h1>Hello from EC2 instance in ${AZ}!</h1>" > /var/www/html/index.html'
          },
          {
            id: 'compute-storage-3-s3',
            title: 'User Data Execution Rules',
            type: 'callout',
            content: 'User Data scripts execute with root privileges and run automatically at the end of the initial boot sequence. By default, they do not run again upon instance reboot or stop/start cycles.'
          }
        ]
      }
    },
    {
      id: 'compute-storage-4',
      pathId: 'compute-storage',
      title: 'EBS Volumes: gp3, io2, st1, sc1 & Multi-Attach',
      description: 'Choose the optimal block storage type based on IOPS, throughput, latency, and volume attachment architecture.',
      difficulty: 'intermediate',
      estimatedMinutes: 20,
      order: 4,
      content: {
        sections: [
          {
            id: 'compute-storage-4-s1',
            title: 'EBS Volume Types Compared',
            type: 'table',
            content: 'Specifications and cost-performance profiles:',
            tableData: {
              headers: ['Volume Type', 'API Name', 'Max IOPS', 'Max Throughput', 'Key Use Case'],
              rows: [
                ['General Purpose SSD', 'gp3', '16,000 IOPS', '1,000 MB/s', 'Standard boot volumes, dev/test, balanced database workloads (20% cheaper than gp2)'],
                ['Provisioned IOPS SSD', 'io2 Block Express', '256,000 IOPS', '4,000 MB/s', 'Mission-critical I/O intensive databases (Oracle, SAP HANA, SQL Server) with 99.999% durability'],
                ['Throughput Optimized HDD', 'st1', '500 IOPS', '500 MB/s', 'Frequently accessed big data, log processing, data warehouses, streaming'],
                ['Cold HDD', 'sc1', '250 IOPS', '250 MB/s', 'Lowest-cost block storage for infrequently accessed sequential workloads']
              ]
            }
          },
          {
            id: 'compute-storage-4-s2',
            title: 'EBS Multi-Attach',
            type: 'callout',
            content: 'EBS io2 and io1 volumes support Multi-Attach, allowing multiple EC2 instances within the same Availability Zone to concurrently attach to the same volume. Applications must use a cluster-aware filesystem (e.g., GFS2) to prevent data corruption.'
          }
        ]
      }
    },
    {
      id: 'compute-storage-5',
      pathId: 'compute-storage',
      title: 'EBS Snapshots, Data Lifecycle Manager, & Fast Snapshot Restore',
      description: 'Manage point-in-time point backups of EBS volumes, incremental snapshot chains, and automate retention policies.',
      difficulty: 'intermediate',
      estimatedMinutes: 20,
      order: 5,
      content: {
        sections: [
          {
            id: 'compute-storage-5-s1',
            title: 'Incremental Snapshot Mechanics',
            type: 'text',
            content: 'EBS snapshots are point-in-time backups stored durability in Amazon S3. Snapshots are incremental: the first snapshot saves the full block dataset, while subsequent snapshots save only the specific 512KB blocks that changed since the preceding snapshot. Deleting an intermediate snapshot only removes blocks not referenced by other snapshots.'
          },
          {
            id: 'compute-storage-5-s2',
            title: 'AWS Data Lifecycle Manager (DLM)',
            type: 'steps',
            content: 'Automating enterprise backup compliance:',
            steps: [
              { title: '1. Tag Resources', description: 'Tag target EC2 instances or EBS volumes with standard keys (e.g., Environment=Production, BackupPolicy=Daily).' },
              { title: '2. Create DLM Policy', description: 'Configure an Amazon Data Lifecycle Manager snapshot policy targeting matching resource tags.' },
              { title: '3. Schedule & Retention', description: 'Define execution frequency (every 12 hours) and retention schedules (keep 14 daily, 4 weekly snapshots).' },
              { title: '4. Cross-Region Copy', description: 'Enable automatic cross-region snapshot replication for disaster recovery compliance.' }
            ]
          }
        ]
      }
    },
    {
      id: 'compute-storage-6',
      pathId: 'compute-storage',
      title: 'S3 Fundamentals: Buckets, Keys, and Object Immutability',
      description: 'Master Amazon Simple Storage Service: bucket naming, object URI structures, metadata, and strong read-after-write consistency.',
      difficulty: 'beginner',
      estimatedMinutes: 20,
      order: 6,
      content: {
        sections: [
          {
            id: 'compute-storage-6-s1',
            title: 'S3 Architecture & Strong Consistency',
            type: 'text',
            content: 'Amazon S3 is an object store offering 99.999999999% (11 9s) of data durability. S3 stores data as objects within buckets. Objects consist of data, a unique Key name, metadata, and version IDs. S3 delivers strong read-after-write consistency for PUT and DELETE requests across all AWS regions.'
          },
          {
            id: 'compute-storage-6-s2',
            title: 'Working with AWS S3 CLI',
            type: 'code',
            language: 'bash',
            content: '# Create a globally uniquely named bucket\naws s3 mb s3://enterprise-data-lake-2026-prod --region us-east-1\n\n# Upload an object with server-side encryption (SSE-S3)\naws s3 cp report.pdf s3://enterprise-data-lake-2026-prod/reports/2026/report.pdf \\\n  --sse AES256\n\n# Sync local directory to S3\naws s3 sync ./dist s3://enterprise-data-lake-2026-prod/web/ --delete'
          },
          {
            id: 'compute-storage-6-s3',
            title: 'Bucket Namespace Rules',
            type: 'callout',
            content: 'S3 bucket names are globally unique across all AWS accounts worldwide. Names must be between 3 and 63 characters, contain only lowercase letters, numbers, and hyphens, and cannot resemble IP addresses.'
          }
        ]
      }
    },
    {
      id: 'compute-storage-7',
      pathId: 'compute-storage',
      title: 'S3 Storage Classes, Lifecycle Rules, & Intelligent-Tiering',
      description: 'Optimize storage costs using S3 Standard, S3 Standard-IA, One Zone-IA, Glacier Flexible, Glacier Deep Archive, and automated lifecycle policies.',
      difficulty: 'intermediate',
      estimatedMinutes: 25,
      order: 7,
      content: {
        sections: [
          {
            id: 'compute-storage-7-s1',
            title: 'S3 Storage Class Matrix',
            type: 'table',
            content: 'Durability, availability, and retrieval times across tiers:',
            tableData: {
              headers: ['Storage Class', 'Durability', 'Availability Zones', 'Min Storage Duration', 'Retrieval Latency / Cost'],
              rows: [
                ['S3 Standard', '11 9s', '>= 3 AZs', 'None', 'Milliseconds / No retrieval fee'],
                ['S3 Intelligent-Tiering', '11 9s', '>= 3 AZs', 'None', 'Milliseconds / Automatic auto-tiering fee, zero retrieval fee'],
                ['S3 Standard-IA', '11 9s', '>= 3 AZs', '30 days', 'Milliseconds / Per-GB retrieval fee'],
                ['S3 One Zone-IA', '11 9s', '1 AZ (no disaster protection)', '30 days', 'Milliseconds / Lower cost, 20% cheaper than Standard-IA'],
                ['S3 Glacier Flexible', '11 9s', '>= 3 AZs', '90 days', 'Minutes to hours (Expedited: 1-5m, Standard: 3-5h)'],
                ['S3 Glacier Deep Archive', '11 9s', '>= 3 AZs', '180 days', '12-48 hours / Lowest cloud storage cost (~$0.00099/GB/mo)']
              ]
            }
          },
          {
            id: 'compute-storage-7-s2',
            title: 'S3 Lifecycle Transition Rule Example',
            type: 'callout',
            content: 'A typical enterprise lifecycle policy moves objects from S3 Standard -> S3 Standard-IA after 30 days -> S3 Glacier Flexible after 90 days -> S3 Glacier Deep Archive after 180 days -> permanently expires objects after 365 days.'
          }
        ]
      }
    },
    {
      id: 'compute-storage-8',
      pathId: 'compute-storage',
      title: 'Amazon EFS: Managed Elastic POSIX File System',
      description: 'Configure serverless elastic network file systems mountable concurrently by thousands of EC2 instances and containers via NFSv4.',
      difficulty: 'intermediate',
      estimatedMinutes: 20,
      order: 8,
      content: {
        sections: [
          {
            id: 'compute-storage-8-s1',
            title: 'Amazon EFS Architecture',
            type: 'text',
            content: 'Amazon Elastic File System (EFS) provides a simple, serverless, set-and-forget elastic file system adhering to POSIX standards. EFS automatically grows and shrinks as files are added and removed. EFS creates Mount Targets in each VPC subnet, allowing hundreds or thousands of EC2 instances and ECS containers across multiple Availability Zones to mount the filesystem simultaneously over NFSv4.'
          },
          {
            id: 'compute-storage-8-s2',
            title: 'EFS vs EBS Comparison',
            type: 'table',
            content: 'Key differences between AWS file and block storage:',
            tableData: {
              headers: ['Feature', 'Amazon EBS', 'Amazon EFS'],
              rows: [
                ['Protocol', 'Block level (SCSI/NVMe)', 'File level (NFSv4.1)'],
                ['Scope', 'Single Availability Zone (tied to 1 AZ)', 'Regional (replicated across 3+ AZs)'],
                ['Concurrent Access', '1 EC2 instance (Multi-Attach: max 16 io2)', 'Thousands of EC2 instances & Lambda concurrently'],
                ['Capacity Management', 'Must pre-provision size upfront (e.g., 500 GB)', 'Serverless elastic auto-scaling; pay only for data stored'],
                ['Relative Cost', 'Lower baseline cost per GB ($0.08/GB for gp3)', 'Higher per GB ($0.30/GB Standard, $0.025/GB Infrequent Access)']
              ]
            }
          }
        ]
      }
    },
    {
      id: 'compute-storage-9',
      pathId: 'compute-storage',
      title: 'Elastic Load Balancing: ALB vs NLB vs GLB Deep Dive',
      description: 'Architect resilient high-throughput traffic distribution using Application, Network, and Gateway Load Balancers.',
      difficulty: 'intermediate',
      estimatedMinutes: 25,
      order: 9,
      content: {
        sections: [
          {
            id: 'compute-storage-9-s1',
            title: 'ELB Family Selection Guide',
            type: 'table',
            content: 'Matching application needs to the right load balancer:',
            tableData: {
              headers: ['Type', 'Layer', 'Protocols', 'IP Address Type', 'Special Features'],
              rows: [
                ['Application Load Balancer (ALB)', 'Layer 7', 'HTTP, HTTPS, gRPC', 'Dynamic DNS names (IPs change)', 'Path/Host routing, redirect HTTP->HTTPS, OIDC auth, WAF integration'],
                ['Network Load Balancer (NLB)', 'Layer 4', 'TCP, UDP, TLS', 'Static Elastic IPs per AZ', 'Ultra-low latency, millions of RPS, preserve source client IP, PrivateLink targets'],
                ['Gateway Load Balancer (GLB)', 'Layer 3/4', 'GENEVE protocol', 'Private IP appliance', 'Transparently scales and routes traffic through third-party firewalls & virtual appliances']
              ]
            }
          },
          {
            id: 'compute-storage-9-s2',
            title: 'Target Groups & Health Checks',
            type: 'callout',
            content: 'Load balancers forward traffic to Target Groups. Regular health check probes (e.g., GET /health HTTP 200) monitor target instance health. Traffic is immediately redirected away from instances that fail consecutive health checks.'
          }
        ]
      }
    },
    {
      id: 'compute-storage-10',
      pathId: 'compute-storage',
      title: 'EC2 Auto Scaling: Launch Templates & Dynamic Scaling',
      description: 'Automate fleet provisioning and elastic scaling policies based on CloudWatch metrics and predictive machine learning models.',
      difficulty: 'intermediate',
      estimatedMinutes: 25,
      order: 10,
      content: {
        sections: [
          {
            id: 'compute-storage-10-s1',
            title: 'Auto Scaling Core Components',
            type: 'steps',
            content: 'The three pillars of EC2 Auto Scaling Groups (ASG):',
            steps: [
              { title: '1. Launch Template', description: 'Defines WHAT to launch: AMI ID, instance type, key pair, security groups, IAM instance profile, and User Data script.' },
              { title: '2. Auto Scaling Group', description: 'Defines WHERE to launch (VPC subnets across multiple AZs) and CAPACITY (Min, Desired, Max instance counts).' },
              { title: '3. Scaling Policies', description: 'Defines WHEN to scale: Target Tracking (maintain 60% CPU), Step Scaling, or Scheduled Scaling.' }
            ]
          },
          {
            id: 'compute-storage-10-s2',
            title: 'Target Tracking vs Step Scaling',
            type: 'table',
            content: 'Comparing scaling policy mechanisms:',
            tableData: {
              headers: ['Policy Type', 'Behavior', 'Configuration Example'],
              rows: [
                ['Target Tracking', 'Acts like a thermostat; adds/removes instances automatically to hold a metric at target', 'Maintain ASG Average CPU Utilization at exactly 50%'],
                ['Step Scaling', 'Applies graduated steps based on metric breach thresholds', 'If CPU > 70% add 2 instances; if CPU > 85% add 4 instances'],
                ['Predictive Scaling', 'Forecasts daily/weekly recurring traffic using machine learning', 'Spin up instances 15 minutes before 9:00 AM rush hour traffic']
              ]
            }
          }
        ]
      }
    },
    {
      id: 'compute-storage-11',
      pathId: 'compute-storage',
      title: 'AWS Lambda Intro: The Serverless Execution Model',
      description: 'Run code without provisioning or managing servers, billed down to the millisecond of compute duration.',
      difficulty: 'beginner',
      estimatedMinutes: 20,
      order: 11,
      content: {
        sections: [
          {
            id: 'compute-storage-11-s1',
            title: 'How Serverless Functions Work',
            type: 'text',
            content: 'AWS Lambda lets you run backend code in response to events (HTTP requests via API Gateway, file uploads to S3, messages on SQS) without provisioning, patching, or scaling virtual machines. Lambda automatically handles scaling from zero to thousands of concurrent executions.'
          },
          {
            id: 'compute-storage-11-s2',
            title: 'Lambda Limitations and Constraints',
            type: 'table',
            content: 'Hard limits every cloud engineer must know:',
            tableData: {
              headers: ['Resource Parameter', 'Lambda Limit', 'Design Consequence'],
              rows: [
                ['Maximum Execution Timeout', '15 minutes (900 seconds)', 'Long-running batch jobs must use ECS Fargate or AWS Batch'],
                ['Memory Allocation', '128 MB to 10,240 MB (10 GB)', 'CPU scales proportionally with allocated memory'],
                ['Ephemeral Storage (/tmp)', '512 MB to 10,240 MB (10 GB)', 'For larger persistent needs, attach an Amazon EFS mount'],
                ['Deployment Package Size', '50 MB (zipped), 250 MB (unzipped)', 'For larger machine learning packages, package as a Container Image (up to 10 GB)']
              ]
            }
          }
        ]
      }
    },
    {
      id: 'compute-storage-12',
      pathId: 'compute-storage',
      title: 'AWS Elastic Beanstalk: Managed Platform Deployments',
      description: 'Deploy and scale web applications and services developed with Java, .NET, Node.js, Python, and Docker without managing underlying infrastructure.',
      difficulty: 'beginner',
      estimatedMinutes: 15,
      order: 12,
      content: {
        sections: [
          {
            id: 'compute-storage-12-s1',
            title: 'What is Elastic Beanstalk?',
            type: 'text',
            content: 'AWS Elastic Beanstalk is a Platform as a Service (PaaS) that handles application deployment, capacity provisioning, load balancing, auto-scaling, and health monitoring. You simply upload your code archive or Docker container, and Beanstalk provisions and configures the required EC2 instances, ALBs, ASGs, and databases.'
          },
          {
            id: 'compute-storage-12-s2',
            title: 'Elastic Beanstalk Deployment Strategies',
            type: 'table',
            content: 'Comparing deployment update mechanisms:',
            tableData: {
              headers: ['Strategy', 'Downtime', 'Fleet Capacity Impact', 'Rollback Speed'],
              rows: [
                ['All at Once', 'Yes (brief)', 'Takes all instances offline simultaneously', 'Slow; requires full redeploy of old version'],
                ['Rolling', 'Zero downtime', 'Reduces active capacity while updating batch by batch', 'Slow; requires rolling rollback'],
                ['Rolling with Additional Batch', 'Zero downtime', 'Maintains 100% capacity by launching an extra batch first', 'Moderate'],
                ['Immutable', 'Zero downtime', 'Spins up entirely new ASG alongside old one; swaps ALB traffic', 'Fast; simply terminate new ASG if health checks fail']
              ]
            }
          }
        ]
      }
    }
  ]
};

export const vpcNetworkingPath: LearningPath = {
  id: 'vpc-networking',
  title: 'VPC & Networking',
  description: 'Design isolated software-defined networks with Amazon VPC, subnets, route tables, internet & NAT gateways, security groups, endpoints, peering, and Transit Gateway.',
  icon: 'GitFork',
  order: 6,
  prerequisites: ['networking-fundamentals', 'aws-core'],
  estimatedHours: 3.5,
  lessons: [
    {
      id: 'vpc-networking-1',
      pathId: 'vpc-networking',
      title: 'VPC Fundamentals & CIDR Allocation',
      description: 'Create an isolated virtual network in the AWS cloud with custom IPv4 CIDR blocks and IP planning.',
      difficulty: 'beginner',
      estimatedMinutes: 20,
      order: 1,
      content: {
        sections: [
          {
            id: 'vpc-networking-1-s1',
            title: 'What is an Amazon VPC?',
            type: 'text',
            content: 'Amazon Virtual Private Cloud (VPC) lets you provision a logically isolated section of the AWS Cloud where you can launch AWS resources in a virtual network you define. You have complete control over IP address ranges, subnets, route tables, and network gateways.'
          },
          {
            id: 'vpc-networking-1-s2',
            title: 'VPC Sizing Best Practices',
            type: 'callout',
            content: 'A standard production VPC CIDR block is a /16 prefix (e.g., 10.0.0.0/16 providing 65,536 IP addresses). Never overlap CIDR blocks between VPCs or on-premises networks if you plan to peer them or connect via AWS Transit Gateway or Direct Connect.'
          }
        ]
      }
    },
    {
      id: 'vpc-networking-2',
      pathId: 'vpc-networking',
      title: 'Subnets & Availability Zone Placement',
      description: 'Segment VPC IP ranges into public and private subnets mapped across multiple physical Availability Zones.',
      difficulty: 'beginner',
      estimatedMinutes: 20,
      order: 2,
      content: {
        sections: [
          {
            id: 'vpc-networking-2-s1',
            title: 'Subnet Architecture: Public vs Private',
            type: 'table',
            content: 'Distinguishing subnet types and purposes:',
            tableData: {
              headers: ['Subnet Classification', 'Default Route (0.0.0.0/0)', 'Public IP Assignment', 'Typical Workloads'],
              rows: [
                ['Public Subnet', 'Routes to an Internet Gateway (igw-xxx)', 'Yes (Auto-assign public IP enabled)', 'Internet-facing ALBs, Bastion hosts, NAT Gateways'],
                ['Private Subnet (with NAT)', 'Routes to a NAT Gateway (nat-xxx)', 'No (Private IPs only)', 'Application servers (EC2/ECS), microservice containers, Lambda'],
                ['Isolated Private Subnet', 'No route to 0.0.0.0/0 (local VPC route only)', 'No', 'Databases (RDS/Aurora), ElastiCache Redis, KMS keys']
              ]
            }
          },
          {
            id: 'vpc-networking-2-s2',
            title: 'High Availability Subnet Layout',
            type: 'text',
            content: 'To achieve High Availability, cloud engineers create matching pairs of Public and Private subnets across at least 2 or 3 Availability Zones (e.g., Public-Subnet-AZ-A, Public-Subnet-AZ-B, Private-Subnet-AZ-A, Private-Subnet-AZ-B).'
          }
        ]
      }
    },
    {
      id: 'vpc-networking-3',
      pathId: 'vpc-networking',
      title: 'Internet Gateway (IGW) & Egress Routing',
      description: 'Attach a horizontally-scaled, redundant Internet Gateway to enable bidirectional communication between VPC instances and the internet.',
      difficulty: 'beginner',
      estimatedMinutes: 15,
      order: 3,
      content: {
        sections: [
          {
            id: 'vpc-networking-3-s1',
            title: 'How Internet Gateways Work',
            type: 'text',
            content: 'An Internet Gateway (IGW) is a VPC component that allows communication between your VPC and the internet. It is highly available, managed, and horizontally scaled by AWS with zero bandwidth constraints. It performs 1-to-1 Network Address Translation (NAT) between private instance IPs and assigned public IPv4 addresses.'
          },
          {
            id: 'vpc-networking-3-s2',
            title: 'Requirements for an Instance to Access the Internet',
            type: 'steps',
            content: 'All four criteria must be satisfied simultaneously:',
            steps: [
              { title: '1. Attach IGW to VPC', description: 'Create and attach an Internet Gateway to the parent VPC.' },
              { title: '2. Configure Route Table', description: 'Add a route in the subnet route table: 0.0.0.0/0 -> igw-xxxxxxxxx.' },
              { title: '3. Assign Public IP', description: 'The instance must have a Public IPv4 or Elastic IP assigned.' },
              { title: '4. Security Group & NACL', description: 'Security Group and NACL rules must permit outbound traffic (and return traffic).' }
            ]
          }
        ]
      }
    },
    {
      id: 'vpc-networking-4',
      pathId: 'vpc-networking',
      title: 'NAT Gateway & Private Subnet Internet Access',
      description: 'Enable private subnet instances to initiate outbound connections to the internet while blocking inbound unsolicited traffic.',
      difficulty: 'intermediate',
      estimatedMinutes: 20,
      order: 4,
      content: {
        sections: [
          {
            id: 'vpc-networking-4-s1',
            title: 'Managed NAT Gateway Architecture',
            type: 'text',
            content: 'A NAT Gateway enables instances in a private subnet to connect to the internet (for software patches or external API calls) but prevents hosts outside the VPC from initiating connections to those private instances. A NAT Gateway must be deployed into a PUBLIC subnet and associated with an Elastic IP.'
          },
          {
            id: 'vpc-networking-4-s2',
            title: 'High Availability NAT Gateway Best Practice',
            type: 'callout',
            content: 'NAT Gateways are Availability Zone specific! If the AZ hosting your NAT Gateway fails, private subnets in other AZs routed through it lose internet connectivity. In production, deploy one NAT Gateway per Availability Zone for complete zone fault isolation.'
          }
        ]
      }
    },
    {
      id: 'vpc-networking-5',
      pathId: 'vpc-networking',
      title: 'VPC Route Tables & Custom Routing',
      description: 'Direct packets between subnets, gateways, and endpoints using prioritized routing table rules.',
      difficulty: 'beginner',
      estimatedMinutes: 15,
      order: 5,
      content: {
        sections: [
          {
            id: 'vpc-networking-5-s1',
            title: 'Main vs Custom Route Tables',
            type: 'text',
            content: 'Every VPC comes with a default "Main" route table. Best practice is to leave the Main route table locked down with only local routes, and create dedicated custom Route Tables explicitly associated with specific subnets (Public Route Table for public subnets, Private Route Tables for private subnets).'
          },
          {
            id: 'vpc-networking-5-s2',
            title: 'Longest Prefix Match Rule',
            type: 'callout',
            content: 'When evaluating routes, AWS always prioritizes the most specific match (longest subnet prefix). For example, a route destined for 10.0.2.0/24 targets local routing even if 0.0.0.0/0 points to an internet gateway.'
          }
        ]
      }
    },
    {
      id: 'vpc-networking-6',
      pathId: 'vpc-networking',
      title: 'Security Groups: Stateful Instance Firewalls',
      description: 'Configure instance-level stateful firewalls, security group referencing, and port filtering rules.',
      difficulty: 'intermediate',
      estimatedMinutes: 20,
      order: 6,
      content: {
        sections: [
          {
            id: 'vpc-networking-6-s1',
            title: 'Security Group Mechanics',
            type: 'text',
            content: 'A Security Group acts as a virtual stateful firewall controlling inbound and outbound network traffic at the Elastic Network Interface (ENI) level. By default, new security groups deny all inbound traffic and allow all outbound traffic.'
          },
          {
            id: 'vpc-networking-6-s2',
            title: 'Security Group Referencing Pattern',
            type: 'callout',
            content: 'Instead of whitelisting static IP addresses in database security groups, reference the Web Tier Security Group ID directly (e.g., Allow port 5432 from sg-0a1b2c3d). Any EC2 instance attached to sg-0a1b2c3d is automatically granted access, regardless of dynamic auto-scaling IP changes!'
          }
        ]
      }
    },
    {
      id: 'vpc-networking-7',
      pathId: 'vpc-networking',
      title: 'Network ACLs: Stateless Subnet Firewalls',
      description: 'Implement subnet boundary security with numbered rule priorities, explicit ALLOW/DENY statements, and ephemeral port management.',
      difficulty: 'intermediate',
      estimatedMinutes: 20,
      order: 7,
      content: {
        sections: [
          {
            id: 'vpc-networking-7-s1',
            title: 'Network Access Control Lists (NACLs)',
            type: 'text',
            content: 'A Network ACL is an optional stateless layer of defense operating at the subnet boundary. All instances within a subnet inherit the subnet NACL. Rules are evaluated in strict numerical order from lowest to highest. Once a rule matches a packet, evaluation stops.'
          },
          {
            id: 'vpc-networking-7-s2',
            title: 'Blocking Malicious IPs with NACLs',
            type: 'callout',
            content: 'Security Groups cannot have explicit DENY rules. If an attacker IP (e.g., 203.0.113.45) is launching an attack, you can immediately block that IP by adding an explicit DENY rule with priority 50 in your subnet Network ACL.'
          }
        ]
      }
    },
    {
      id: 'vpc-networking-8',
      pathId: 'vpc-networking',
      title: 'VPC Endpoints: Gateway vs Interface (PrivateLink)',
      description: 'Connect VPC instances privately to AWS services without traversing the public internet using Gateway and Interface endpoints.',
      difficulty: 'intermediate',
      estimatedMinutes: 25,
      order: 8,
      content: {
        sections: [
          {
            id: 'vpc-networking-8-s1',
            title: 'Gateway Endpoints vs Interface Endpoints',
            type: 'table',
            content: 'Detailed comparison of AWS VPC endpoint architectures:',
            tableData: {
              headers: ['Parameter', 'Gateway Endpoint', 'Interface Endpoint (AWS PrivateLink)'],
              rows: [
                ['Supported Services', 'Amazon S3 and DynamoDB only', 'Virtually all AWS services + 3rd party SaaS endpoints'],
                ['Technology', 'Target in VPC Route Table', 'Elastic Network Interface (ENI) with private IP in subnet'],
                ['Cost', 'FREE (No hourly fee, no data processing fee)', 'Hourly fee per AZ (~$0.01/hr) + per-GB data processing fee'],
                ['On-Premises Access', 'Cannot be reached from on-prem via Direct Connect / VPN', 'Can be reached from on-premises via private IP over VPN / Direct Connect']
              ]
            }
          },
          {
            id: 'vpc-networking-8-s2',
            title: 'S3 Gateway Endpoint Rule',
            type: 'callout',
            content: 'Always configure a free S3 Gateway Endpoint in your VPC route tables so EC2 instances access S3 buckets privately without paying costly NAT Gateway per-GB data transfer charges.'
          }
        ]
      }
    },
    {
      id: 'vpc-networking-9',
      pathId: 'vpc-networking',
      title: 'VPC Peering: Inter-VPC Connectivity',
      description: 'Establish point-to-point private network connections between two VPCs across accounts and regions.',
      difficulty: 'intermediate',
      estimatedMinutes: 15,
      order: 9,
      content: {
        sections: [
          {
            id: 'vpc-networking-9-s1',
            title: 'VPC Peering Rules & Constraints',
            type: 'text',
            content: 'A VPC Peering connection is a networking connection between two VPCs that enables routing using private IPv4/IPv6 addresses. Traffic remains entirely on the private AWS global network backbone without traversing the public internet.'
          },
          {
            id: 'vpc-networking-9-s2',
            title: 'Non-Transitive Routing Limitation',
            type: 'callout',
            content: 'VPC Peering is non-transitive! If VPC A is peered with VPC B, and VPC B is peered with VPC C, VPC A CANNOT communicate with VPC C through VPC B. You must peer A directly with C, or migrate to AWS Transit Gateway.'
          }
        ]
      }
    },
    {
      id: 'vpc-networking-10',
      pathId: 'vpc-networking',
      title: 'AWS Transit Gateway: Hub-and-Spoke Mesh Networking',
      description: 'Scale multi-VPC and hybrid network architectures using a centralized cloud router supporting transitive routing.',
      difficulty: 'advanced',
      estimatedMinutes: 25,
      order: 10,
      content: {
        sections: [
          {
            id: 'vpc-networking-10-s1',
            title: 'The Transit Gateway Hub-and-Spoke Pattern',
            type: 'text',
            content: 'As organizations grow to dozens or hundreds of AWS accounts and VPCs, maintaining point-to-point VPC Peering creates an unmanageable N*(N-1)/2 mesh. AWS Transit Gateway acts as a centralized regional cloud router connecting thousands of VPCs, VPNs, and AWS Direct Connect gateways via a single hub.'
          },
          {
            id: 'vpc-networking-10-s2',
            title: 'Transit Gateway Route Domains',
            type: 'callout',
            content: 'Transit Gateway route tables allow segmenting traffic into isolated virtual routing and forwarding (VRF) domains—for example, isolating Dev VPCs from Prod VPCs while allowing both to access a Shared Services VPC.'
          }
        ]
      }
    },
    {
      id: 'vpc-networking-11',
      pathId: 'vpc-networking',
      title: 'Amazon Route 53: Public & Private Hosted Zones',
      description: 'Configure authoritative global DNS routing, health checks, failover policies, and split-view private zones.',
      difficulty: 'intermediate',
      estimatedMinutes: 20,
      order: 11,
      content: {
        sections: [
          {
            id: 'vpc-networking-11-s1',
            title: 'Route 53 Routing Policies',
            type: 'table',
            content: 'Advanced DNS routing policies available in Amazon Route 53:',
            tableData: {
              headers: ['Routing Policy', 'Mechanism', 'Ideal Use Case'],
              rows: [
                ['Simple', 'Single resource or random multi-value IP response', 'Standard domain resolution without special logic'],
                ['Weighted', 'Distribute traffic across targets by assigned percentage', 'Canary deployments, A/B testing (e.g., 90% v1, 10% v2)'],
                ['Latency-Based', 'Routes client to the AWS region providing lowest network latency', 'Global multi-region web applications'],
                ['Failover', 'Active-Passive failover driven by Route 53 Health Checks', 'Disaster Recovery (primary region to static S3 DR site)'],
                ['Geolocation', 'Routes based on user geographic continent/country', 'Content localization and regional licensing compliance'],
                ['Geoproximity', 'Routes based on geographic distance with configurable biases', 'Fine-tuned traffic shifting between regional data centers']
              ]
            }
          }
        ]
      }
    },
    {
      id: 'vpc-networking-12',
      pathId: 'vpc-networking',
      title: 'Amazon CloudFront: Global Content Delivery & Edge Caching',
      description: 'Accelerate web delivery, protect origins from DDoS attacks, and enforce HTTPS termination at 400+ Edge Locations.',
      difficulty: 'intermediate',
      estimatedMinutes: 20,
      order: 12,
      content: {
        sections: [
          {
            id: 'vpc-networking-12-s1',
            title: 'CloudFront Architecture & Origins',
            type: 'text',
            content: 'Amazon CloudFront is a fast content delivery network (CDN) service that securely delivers data, videos, applications, and APIs to users globally with low latency. Origins can be Amazon S3 buckets, Application Load Balancers, API Gateways, or custom on-premises HTTP servers.'
          },
          {
            id: 'vpc-networking-12-s2',
            title: 'Origin Access Control (OAC)',
            type: 'callout',
            content: 'To prevent users from bypassing CloudFront and accessing backend S3 buckets directly, configure Origin Access Control (OAC). The S3 bucket policy allows read access exclusively to the CloudFront distribution service principal.'
          }
        ]
      }
    },
    {
      id: 'vpc-networking-13',
      pathId: 'vpc-networking',
      title: 'AWS Certificate Manager (ACM) & SSL/TLS Deployment',
      description: 'Provision, manage, and deploy public and private SSL/TLS certificates with automated DNS validation and renewal.',
      difficulty: 'intermediate',
      estimatedMinutes: 15,
      order: 13,
      content: {
        sections: [
          {
            id: 'vpc-networking-13-s1',
            title: 'ACM Overview & Integration Points',
            type: 'text',
            content: 'AWS Certificate Manager handles the complexity of creating, storing, and renewing public SSL/TLS certificates. ACM certificates integrate natively with Application Load Balancers, CloudFront distributions, and API Gateways. Public ACM certificates are completely free of charge.'
          },
          {
            id: 'vpc-networking-13-s2',
            title: 'Regional vs CloudFront Certificate Location',
            type: 'callout',
            content: 'To use an ACM certificate with an ALB or API Gateway, request the certificate in the SAME region as the load balancer. To use an ACM certificate with Amazon CloudFront, you MUST request or import the certificate in the US East (N. Virginia - us-east-1) region.'
          }
        ]
      }
    }
  ]
};


export const databasesPath: LearningPath = {
  id: 'databases',
  title: 'Databases & Data Services',
  description: 'Design purpose-built data persistence architectures using Amazon RDS, Aurora, DynamoDB, ElastiCache, and Redshift.',
  icon: 'Database',
  order: 7,
  prerequisites: ['app-fundamentals', 'aws-core'],
  estimatedHours: 3,
  lessons: [
    {
      id: 'databases-1',
      pathId: 'databases',
      title: 'Database Selection: Purpose-Built Cloud Databases',
      description: 'Stop forcing relational SQL engines into every problem; select purpose-built databases based on access patterns.',
      difficulty: 'intermediate',
      estimatedMinutes: 20,
      order: 1,
      content: {
        sections: [
          {
            id: 'databases-1-s1',
            title: 'The Purpose-Built Database Philosophy',
            type: 'text',
            content: 'In monolithic applications, a single relational database was used for user auth, full-text search, graph connections, shopping carts, and analytics. Cloud-native architectures use specialized database engines tailored to specific data shapes and query access patterns.'
          },
          {
            id: 'databases-1-s2',
            title: 'AWS Purpose-Built Database Taxonomy',
            type: 'table',
            content: 'Mapping workload models to AWS data services:',
            tableData: {
              headers: ['Data Model', 'AWS Engine', 'Query Latency', 'Typical Use Case'],
              rows: [
                ['Relational (RDBMS)', 'Amazon Aurora / RDS', 'Single-digit ms', 'Complex joins, transactional integrity, ERP, CRM'],
                ['Key-Value', 'Amazon DynamoDB', 'Single-digit ms (sub-ms with DAX)', 'Session state, high-throughput shopping carts, gaming profiles'],
                ['In-Memory Cache', 'Amazon ElastiCache (Redis)', 'Microseconds (sub-ms)', 'Real-time leaderboards, session caching, rate limiting'],
                ['Document', 'Amazon DocumentDB', 'Single-digit ms', 'JSON catalogs, content management systems'],
                ['Graph', 'Amazon Neptune', 'Single-digit ms', 'Fraud detection networks, social graphs, knowledge engines'],
                ['Time-Series', 'Amazon Timestream', 'Single-digit ms to seconds', 'IoT telemetry, operational monitoring metrics'],
                ['Data Warehouse / OLAP', 'Amazon Redshift', 'Seconds to minutes', 'Complex analytical aggregation over terabytes/petabytes']
              ]
            }
          }
        ]
      }
    },
    {
      id: 'databases-2',
      pathId: 'databases',
      title: 'Amazon RDS Fundamentals: Engines, Backups, and Maintenance',
      description: 'Manage relational databases (PostgreSQL, MySQL, MariaDB, Oracle, SQL Server) with automated patching and storage auto-scaling.',
      difficulty: 'beginner',
      estimatedMinutes: 20,
      order: 2,
      content: {
        sections: [
          {
            id: 'databases-2-s1',
            title: 'What is Amazon Relational Database Service (RDS)?',
            type: 'text',
            content: 'Amazon RDS makes it easy to set up, operate, and scale relational databases in the cloud. It automates time-consuming administrative tasks such as hardware provisioning, database setup, patching, and backups, while you retain full control over your schema and SQL queries.'
          },
          {
            id: 'databases-2-s2',
            title: 'Automated Backups vs Manual DB Snapshots',
            type: 'table',
            content: 'Understanding RDS backup mechanisms:',
            tableData: {
              headers: ['Feature', 'Automated Backups', 'Manual DB Snapshots'],
              rows: [
                ['Retention Period', '1 to 35 days (default 7 days)', 'Kept indefinitely until explicitly deleted'],
                ['Point-in-Time Recovery', 'Yes (restore to any specific second within retention window)', 'No (restores to exact snapshot capture timestamp)'],
                ['Deletion on RDS Drop', 'Deleted automatically when RDS instance is deleted', 'Preserved even after DB instance is terminated'],
                ['Storage Destination', 'Amazon S3 (transparently managed)', 'Amazon S3 (managed under your account)']
              ]
            }
          }
        ]
      }
    },
    {
      id: 'databases-3',
      pathId: 'databases',
      title: 'RDS Multi-AZ Deployments & Read Replicas',
      description: 'Differentiate synchronous high availability failover from asynchronous read scaling.',
      difficulty: 'intermediate',
      estimatedMinutes: 25,
      order: 3,
      content: {
        sections: [
          {
            id: 'databases-3-s1',
            title: 'Multi-AZ vs Read Replicas: The Decisive Comparison',
            type: 'table',
            content: 'Essential comparison for cloud architecture exams and production designs:',
            tableData: {
              headers: ['Dimension', 'Multi-AZ Deployment', 'Read Replicas'],
              rows: [
                ['Primary Purpose', 'High Availability & Disaster Recovery', 'Read Scalability & Reporting Performance'],
                ['Replication Type', 'Synchronous physical replication', 'Asynchronous logical replication'],
                ['Standby Accessibility', 'Standby is INACTIVE (cannot execute reads or writes)', 'Replicas are ACTIVE for read-only queries'],
                ['Failover Automation', 'Automatic failover (DNS CNAME switches in 60-120s)', 'Manual or application-managed promotion to standalone DB'],
                ['Geographic Scope', 'Within single region across 2 Availability Zones', 'Cross-AZ or Cross-Region (up to 15 replicas)']
              ]
            }
          },
          {
            id: 'databases-3-s2',
            title: 'Combining Both Patterns',
            type: 'callout',
            content: 'Production architectures routinely combine both: Multi-AZ for primary automated failover resilience, plus multiple Read Replicas to offload read-heavy query traffic from the primary instance.'
          }
        ]
      }
    },
    {
      id: 'databases-4',
      pathId: 'databases',
      title: 'Amazon Aurora Architecture & Serverless v2',
      description: 'Explore Aurora cloud-native distributed storage: 6-way replication across 3 AZs, sub-minute failovers, and dynamic compute scaling.',
      difficulty: 'advanced',
      estimatedMinutes: 25,
      order: 4,
      content: {
        sections: [
          {
            id: 'databases-4-s1',
            title: 'The Cloud-Native Storage Engine',
            type: 'text',
            content: 'Amazon Aurora is a MySQL- and PostgreSQL-compatible relational database built for the cloud. Aurora decouples compute from storage. Storage is distributed across a shared SSD-backed storage fleet that automatically replicates 6 copies of data across 3 Availability Zones. Aurora can lose an entire AZ plus one additional node without losing write availability.'
          },
          {
            id: 'databases-4-s2',
            title: 'Aurora Endpoints Structure',
            type: 'steps',
            content: 'How client applications connect to Aurora clusters:',
            steps: [
              { title: 'Cluster Endpoint (Writer)', description: 'Points to the single current primary Read/Write instance. Swaps automatically during failover.' },
              { title: 'Reader Endpoint', description: 'Load balances incoming read queries across all available Aurora read replicas in the cluster.' },
              { title: 'Custom Endpoints', description: 'Groups specific replica instances together for dedicated analytics or batch reporting queries.' }
            ]
          },
          {
            id: 'databases-4-s3',
            title: 'Aurora Serverless v2',
            type: 'callout',
            content: 'Aurora Serverless v2 scales compute capacity instantly in fine-grained increments of Aurora Capacity Units (ACUs: 0.5 to 128 ACUs) in fractions of a second based on actual query load, without dropping database connections.'
          }
        ]
      }
    },
    {
      id: 'databases-5',
      pathId: 'databases',
      title: 'Amazon DynamoDB Fundamentals: Partition Keys & Items',
      description: 'Master Amazon DynamoDB: tables, items, attributes, primary key design (Partition Key vs Composite Keys), and read/write capacity modes.',
      difficulty: 'intermediate',
      estimatedMinutes: 25,
      order: 5,
      content: {
        sections: [
          {
            id: 'databases-5-s1',
            title: 'DynamoDB Key Anatomy',
            type: 'table',
            content: 'Understanding DynamoDB primary key structures:',
            tableData: {
              headers: ['Primary Key Type', 'Components', 'Internal Hashing Mechanism', 'Query Capability'],
              rows: [
                ['Simple Primary Key', 'Partition Key (PK) only', 'Internal MD5 hash determines exact physical storage partition', 'Can only query with exact equality match on PK (GetItem)'],
                ['Composite Primary Key', 'Partition Key (PK) + Sort Key (SK)', 'PK determines physical partition; items are stored physically sorted by SK', 'Can query PK with equality AND range conditions on SK (begins_with, between, >, <)']
              ]
            }
          },
          {
            id: 'databases-5-s2',
            title: 'On-Demand vs Provisioned Capacity',
            type: 'callout',
            content: 'Use On-Demand Mode for unpredictable, spiky traffic (pay strictly per read/write request). Use Provisioned Mode with Auto Scaling for predictable, steady workloads to save up to 70% in baseline costs.'
          }
        ]
      }
    },
    {
      id: 'databases-6',
      pathId: 'databases',
      title: 'Amazon DynamoDB Advanced: Indexes, Streams, & Global Tables',
      description: 'Scale queries using Global Secondary Indexes (GSI), process change logs with DynamoDB Streams, and configure active-active Global Tables.',
      difficulty: 'advanced',
      estimatedMinutes: 25,
      order: 6,
      content: {
        sections: [
          {
            id: 'databases-6-s1',
            title: 'Local Secondary Index (LSI) vs Global Secondary Index (GSI)',
            type: 'table',
            content: 'Comparing DynamoDB secondary indexes:',
            tableData: {
              headers: ['Feature', 'Local Secondary Index (LSI)', 'Global Secondary Index (GSI)'],
              rows: [
                ['Partition Key', 'Must be IDENTICAL to base table PK', 'Can define completely DIFFERENT PK and SK'],
                ['Creation Time', 'ONLY at table creation time; cannot add later', 'Can be created or deleted dynamically at ANY time'],
                ['Capacity Allocation', 'Shares base table RCU / WCU', 'Has its OWN independent RCU / WCU allocation'],
                ['Consistency', 'Supports eventual and strong consistency', 'Supports eventual consistency only']
              ]
            }
          },
          {
            id: 'databases-6-s2',
            title: 'Global Tables: Active-Active Multi-Region Replication',
            type: 'callout',
            content: 'DynamoDB Global Tables replicate tables across chosen AWS regions with sub-second replication latency. Writes can occur in any region; conflicts are resolved using last-writer-wins timestamp logic.'
          }
        ]
      }
    },
    {
      id: 'databases-7',
      pathId: 'databases',
      title: 'Amazon ElastiCache: Redis vs Memcached',
      description: 'Deploy sub-millisecond in-memory caching layers to slash relational database load and accelerate web application response times.',
      difficulty: 'intermediate',
      estimatedMinutes: 20,
      order: 7,
      content: {
        sections: [
          {
            id: 'databases-7-s1',
            title: 'Redis vs Memcached Feature Matrix',
            type: 'table',
            content: 'Choosing the right in-memory cache engine:',
            tableData: {
              headers: ['Feature', 'Amazon ElastiCache for Redis', 'Amazon ElastiCache for Memcached'],
              rows: [
                ['Data Structures', 'Rich (Strings, Hashes, Lists, Sets, Sorted Sets, Bitmaps)', 'Simple Key-Value strings only'],
                ['Multi-AZ & Replication', 'Yes (Replication, Multi-AZ automated failover)', 'No (No replication; multi-node sharding only)'],
                ['Persistence / Backups', 'Yes (RDB snapshots and AOF append logs)', 'No (Pure RAM volatile; data lost on restart)'],
                ['Pub/Sub Messaging', 'Yes (Built-in Publish/Subscribe primitives)', 'No'],
                ['Multi-Threading', 'Single-threaded event loop per core', 'Multi-threaded (scales well on large multi-core instances)']
              ]
            }
          },
          {
            id: 'databases-7-s2',
            title: 'Caching Strategies: Cache-Aside vs Write-Through',
            type: 'callout',
            content: 'In Cache-Aside (Lazy Loading), the application reads cache first; if cache miss, reads database and writes result to cache. In Write-Through, the application writes data to both cache and database simultaneously, ensuring fresh data at the cost of write latency.'
          }
        ]
      }
    },
    {
      id: 'databases-8',
      pathId: 'databases',
      title: 'Amazon Redshift Overview & Cloud Data Warehousing',
      description: 'Execute analytical complex queries across petabytes of structured and semi-structured data with columnar storage and Massively Parallel Processing (MPP).',
      difficulty: 'intermediate',
      estimatedMinutes: 20,
      order: 8,
      content: {
        sections: [
          {
            id: 'databases-8-s1',
            title: 'OLTP vs OLAP Architecture',
            type: 'text',
            content: 'Relational databases like RDS and PostgreSQL are optimized for OLTP (Online Transaction Processing): frequent single-row reads and writes. Amazon Redshift is an OLAP (Online Analytical Processing) data warehouse optimized for complex aggregated queries across millions of rows using columnar data storage and parallel compute nodes.'
          },
          {
            id: 'databases-8-s2',
            title: 'Redshift Spectrum: Querying the S3 Data Lake',
            type: 'callout',
            content: 'With Redshift Spectrum, analytical queries can directly query exabytes of open data formats (Parquet, ORC, CSV) residing directly inside Amazon S3 buckets without loading data into Redshift local disk storage first.'
          }
        ]
      }
    }
  ]
};

export const securityGovernancePath: LearningPath = {
  id: 'security-governance',
  title: 'Security & Governance',
  description: 'Implement defense-in-depth security: KMS encryption, Secrets Manager, CloudTrail auditing, AWS Config compliance, GuardDuty threat detection, WAF, and AWS Control Tower.',
  icon: 'Shield',
  order: 8,
  prerequisites: ['aws-core'],
  estimatedHours: 4,
  lessons: [
    {
      id: 'security-governance-1',
      pathId: 'security-governance',
      title: 'Cloud Security Foundations & Zero Trust Architecture',
      description: 'Implement defense-in-depth principles: least privilege, micro-segmentation, identity verification, and continuous validation.',
      difficulty: 'beginner',
      estimatedMinutes: 20,
      order: 1,
      content: {
        sections: [
          {
            id: 'security-governance-1-s1',
            title: 'The Defense-in-Depth Model',
            type: 'steps',
            content: 'The multiple overlapping defensive rings protecting cloud assets:',
            steps: [
              { title: '1. Edge / Perimeter Tier', description: 'AWS Shield (DDoS) and AWS WAF (Layer 7 web exploits) protect entry points.' },
              { title: '2. Network Tier', description: 'VPC subnets, Route Tables, Network ACLs, and Security Groups isolate packet flows.' },
              { title: '3. Compute Tier', description: 'IMDSv2, EC2 Systems Manager (no open port 22 SSH), hardened AMIs, and Inspector scans.' },
              { title: '4. Identity Tier', description: 'MFA enforcement, IAM least-privilege roles, and short-lived STS tokens.' },
              { title: '5. Data Tier', description: 'AWS KMS encryption at rest, TLS 1.3 in transit, and S3 Block Public Access.' }
            ]
          }
        ]
      }
    },
    {
      id: 'security-governance-2',
      pathId: 'security-governance',
      title: 'AWS KMS: Customer Managed Keys & Envelope Encryption',
      description: 'Protect sensitive data using Key Management Service (KMS), hardware security modules (HSMs), and envelope encryption.',
      difficulty: 'intermediate',
      estimatedMinutes: 25,
      order: 2,
      content: {
        sections: [
          {
            id: 'security-governance-2-s1',
            title: 'How Envelope Encryption Works',
            type: 'steps',
            content: 'KMS uses envelope encryption to encrypt data without transmitting massive payloads across the network:',
            steps: [
              { title: '1. Request Data Key', description: 'Application calls kms:GenerateDataKey with the Customer Master Key (CMK) ARN.' },
              { title: '2. Return Plaintext & Ciphertext Key', description: 'KMS returns two copies of a unique 256-bit symmetric data key: one plaintext, one encrypted.' },
              { title: '3. Encrypt Data Locally', description: 'The application uses the plaintext key to encrypt the local payload (file, database row).' },
              { title: '4. Destroy Plaintext Key', description: 'The application wipes the plaintext key from memory and saves the encrypted ciphertext key alongside the data.' }
            ]
          },
          {
            id: 'security-governance-2-s2',
            title: 'AWS Managed Keys vs Customer Managed Keys (CMKs)',
            type: 'table',
            content: 'Key control differences:',
            tableData: {
              headers: ['Attribute', 'AWS Managed Keys (aws/s3, aws/ebs)', 'Customer Managed Keys (CMKs)'],
              rows: [
                ['Key Policy Control', 'Managed entirely by AWS; cannot edit', 'Full customer control via JSON Key Policy'],
                ['Annual Automatic Rotation', 'Automatically rotated every 1 year', 'Configurable automatic annual rotation or on-demand'],
                ['Cross-Account Access', 'Cannot be shared across accounts', 'Can grant cross-account permissions via key policy'],
                ['Cost', 'Free to create', '$1.00 per month per key + API requests']
              ]
            }
          }
        ]
      }
    },
    {
      id: 'security-governance-3',
      pathId: 'security-governance',
      title: 'AWS Secrets Manager: Automatic Rotation & Credentials',
      description: 'Store database credentials, API keys, and third-party tokens with automated rotation powered by AWS Lambda.',
      difficulty: 'intermediate',
      estimatedMinutes: 20,
      order: 3,
      content: {
        sections: [
          {
            id: 'security-governance-3-s1',
            title: 'Why Secrets Manager?',
            type: 'text',
            content: 'Hardcoding database passwords in application configuration files creates critical security vulnerabilities. AWS Secrets Manager enables programmatic retrieval of encrypted secrets over HTTPS and provides turnkey automatic password rotation for Amazon RDS, Aurora, and DocumentDB without application downtime.'
          },
          {
            id: 'security-governance-3-s2',
            title: 'Fetching Secrets via AWS CLI',
            type: 'code',
            language: 'bash',
            content: '# Retrieve decrypted secret string at application startup\naws secretsmanager get-secret-value \\\n  --secret-id "production/database/postgres" \\\n  --query "SecretString" \\\n  --output text'
          }
        ]
      }
    },
    {
      id: 'security-governance-4',
      pathId: 'security-governance',
      title: 'AWS Systems Manager Parameter Store',
      description: 'Centrally store configuration parameters and encrypted strings with hierarchical path structures and free standard storage.',
      difficulty: 'beginner',
      estimatedMinutes: 20,
      order: 4,
      content: {
        sections: [
          {
            id: 'security-governance-4-s1',
            title: 'Parameter Store vs Secrets Manager',
            type: 'table',
            content: 'Choosing between Parameter Store and Secrets Manager:',
            tableData: {
              headers: ['Feature', 'SSM Parameter Store', 'AWS Secrets Manager'],
              rows: [
                ['Primary Purpose', 'General application configuration & simple secrets', 'High-value database credentials, OAuth tokens, API keys'],
                ['Automatic Rotation', 'Requires custom EventBridge + Lambda logic', 'Native turnkey integration with RDS & custom Lambda rotation'],
                ['Cost', 'Standard tier: FREE (up to 10,000 parameters)', '$0.40 per secret per month + API request fees'],
                ['Cross-Account Access', 'Requires Advanced parameters & Resource Access Manager', 'Supported natively via resource policies']
              ]
            }
          }
        ]
      }
    },
    {
      id: 'security-governance-5',
      pathId: 'security-governance',
      title: 'AWS CloudTrail: Governance, Auditing, & Lake',
      description: 'Record, continuously monitor, and retain account activity related to actions across your AWS infrastructure.',
      difficulty: 'intermediate',
      estimatedMinutes: 20,
      order: 5,
      content: {
        sections: [
          {
            id: 'security-governance-5-s1',
            title: 'What Does CloudTrail Log?',
            type: 'text',
            content: 'AWS CloudTrail records AWS API calls made on your account. Every event captures WHO made the request (IAM identity), WHAT action was called (e.g., ec2:RunInstances), WHEN it occurred (UTC timestamp), WHERE it came from (source IP address), and the API request and response parameters.'
          },
          {
            id: 'security-governance-5-s2',
            title: 'Event Types: Management vs Data Events',
            type: 'table',
            content: 'CloudTrail event classifications:',
            tableData: {
              headers: ['Event Classification', 'Examples', 'Default Status & Cost'],
              rows: [
                ['Management Events', 'CreateBucket, RunInstances, AttachRolePolicy, TerminateInstances', 'Enabled by default on all accounts; 90-day history FREE'],
                ['Data Events', 'S3 GetObject/PutObject, Lambda Invoke, DynamoDB GetItem', 'Disabled by default; incurs per-event data processing fee']
              ]
            }
          },
          {
            id: 'security-governance-5-s3',
            title: 'Multi-Region Trail Best Practice',
            type: 'callout',
            content: 'Always configure an Organizational Multi-Region Trail that logs events across ALL regions into an encrypted, isolated S3 bucket in a dedicated Log Archive account with S3 Object Lock (WORM) enabled.'
          }
        ]
      }
    },
    {
      id: 'security-governance-6',
      pathId: 'security-governance',
      title: 'AWS Config: Compliance Rules & Remediation',
      description: 'Track resource configuration history, evaluate compliance against security baselines, and automate remediation actions.',
      difficulty: 'intermediate',
      estimatedMinutes: 20,
      order: 6,
      content: {
        sections: [
          {
            id: 'security-governance-6-s1',
            title: 'How AWS Config Operates',
            type: 'text',
            content: 'AWS Config continuously records and evaluates configuration changes made to AWS resources against desired compliance rules (e.g., "s3-bucket-public-read-prohibited" or "encrypted-volumes"). If a resource violates a rule, Config flags it as Non-Compliant and can trigger automatic remediation via Systems Manager Automation runbooks.'
          },
          {
            id: 'security-governance-6-s2',
            title: 'CloudTrail vs AWS Config',
            type: 'callout',
            content: 'CloudTrail answers "WHO did WHAT API call and WHEN?". AWS Config answers "WHAT does the resource configuration look like right now, how has it changed over time, and is it compliant with company policy?".'
          }
        ]
      }
    },
    {
      id: 'security-governance-7',
      pathId: 'security-governance',
      title: 'Amazon GuardDuty: Threat Detection & ML Anomalies',
      description: 'Detect unauthorized behavior, compromised IAM credentials, crypto-currency mining, and malicious IP communications.',
      difficulty: 'intermediate',
      estimatedMinutes: 20,
      order: 7,
      content: {
        sections: [
          {
            id: 'security-governance-7-s1',
            title: 'Agentless Threat Intelligence',
            type: 'text',
            content: 'Amazon GuardDuty is an intelligent threat detection service that continuously monitors AWS accounts and workloads for malicious activity. Critically, GuardDuty is 100% agentless: it consumes foundational data streams behind the scenes with zero performance impact on workloads.'
          },
          {
            id: 'security-governance-7-s2',
            title: 'GuardDuty Primary Data Sources',
            type: 'steps',
            content: 'The core telemetry streams analyzed by GuardDuty machine learning models:',
            steps: [
              { title: '1. VPC Flow Logs', description: 'Detects unusual port scanning, outbound communication to known botnet Command & Control servers.' },
              { title: '2. DNS Logs', description: 'Identifies DNS tunneling, malware domain queries, and data exfiltration patterns.' },
              { title: '3. CloudTrail Management & Event Logs', description: 'Detects unusual IAM activity (e.g., API calls from Tor exit nodes, password cracking).' },
              { title: '4. S3 Data Events & EKS Audit Logs', description: 'Monitors anomalous S3 access spikes and compromised Kubernetes clusters.' }
            ]
          }
        ]
      }
    },
    {
      id: 'security-governance-8',
      pathId: 'security-governance',
      title: 'Amazon Inspector: Automated Vulnerability Assessment',
      description: 'Scan EC2 instances, container images in ECR, and Lambda functions for Common Vulnerabilities and Exposures (CVEs).',
      difficulty: 'intermediate',
      estimatedMinutes: 20,
      order: 8,
      content: {
        sections: [
          {
            id: 'security-governance-8-s1',
            title: 'Automated Continuous Vulnerability Scanning',
            type: 'text',
            content: 'Amazon Inspector automatically discovers and scans running Amazon EC2 instances (via SSM Agent), container images in Amazon ECR, and AWS Lambda function code for software vulnerabilities and unintended network exposure against the National Vulnerability Database (NVD).'
          },
          {
            id: 'security-governance-8-s2',
            title: 'Inspector Finding Scoring',
            type: 'callout',
            content: 'Inspector calculates a tailored "Inspector Score" (1 to 10) for each finding by combining standard CVSS vulnerability metrics with environmental context, such as whether an EC2 instance is reachable from the public internet.'
          }
        ]
      }
    },
    {
      id: 'security-governance-9',
      pathId: 'security-governance',
      title: 'Amazon Macie: Sensitive Data Discovery & PII',
      description: 'Discover and protect sensitive data at scale using machine learning and pattern matching to identify PII, credit cards, and credentials in S3.',
      difficulty: 'intermediate',
      estimatedMinutes: 15,
      order: 9,
      content: {
        sections: [
          {
            id: 'security-governance-9-s1',
            title: 'Automated Sensitive Data Discovery',
            type: 'text',
            content: 'Amazon Macie uses machine learning and pattern matching to discover, monitor, and protect sensitive data stored in Amazon S3. Macie automatically scans objects to detect Personally Identifiable Information (PII) like Social Security numbers, credit card details, national IDs, and AWS secret credentials.'
          }
        ]
      }
    },
    {
      id: 'security-governance-10',
      pathId: 'security-governance',
      title: 'AWS Security Hub: Centralized Posture Management',
      description: 'Aggregate and prioritize security alerts across GuardDuty, Inspector, Macie, IAM Access Analyzer, and AWS Firewall Manager.',
      difficulty: 'intermediate',
      estimatedMinutes: 20,
      order: 10,
      content: {
        sections: [
          {
            id: 'security-governance-10-s1',
            title: 'Centralized Cloud Security Posture Management (CSPM)',
            type: 'text',
            content: 'AWS Security Hub gives you a comprehensive view of your security state across all AWS accounts. It normalizes findings from multiple AWS security tools into the AWS Security Finding Format (ASFF) and runs automated compliance checks against frameworks like CIS AWS Foundations Benchmark, PCI DSS, and NIST.'
          }
        ]
      }
    },
    {
      id: 'security-governance-11',
      pathId: 'security-governance',
      title: 'AWS WAF & AWS Shield: Perimeter DDoS Defense',
      description: 'Protect web applications against common web exploits (SQLi, XSS) and Layer 3, 4, and 7 Distributed Denial of Service attacks.',
      difficulty: 'intermediate',
      estimatedMinutes: 20,
      order: 11,
      content: {
        sections: [
          {
            id: 'security-governance-11-s1',
            title: 'AWS Shield Standard vs Shield Advanced',
            type: 'table',
            content: 'DDoS protection comparison:',
            tableData: {
              headers: ['Tier', 'Protection Layer', 'Cost', 'Features'],
              rows: [
                ['AWS Shield Standard', 'Layer 3 & Layer 4 attacks (SYN floods, UDP reflection)', 'FREE (Automatically enabled for all AWS customers)', 'Seamless mitigation against common network layer DDoS attacks'],
                ['AWS Shield Advanced', 'Layer 3, 4, and 7 attacks + Route 53 & CloudFront protection', '$3,000/month + data transfer fees', '24/7 access to AWS DDoS Response Team (DRT), financial DDoS cost protection against scaling surges']
              ]
            }
          },
          {
            id: 'security-governance-11-s2',
            title: 'AWS WAF (Web Application Firewall)',
            type: 'callout',
            content: 'AWS WAF inspects Layer 7 HTTP/HTTPS requests attached to CloudFront, ALBs, or API Gateways. It blocks attacks like SQL Injection (SQLi), Cross-Site Scripting (XSS), rate limits aggressive bot scrapers, and integrates AWS Managed Rule sets.'
          }
        ]
      }
    },
    {
      id: 'security-governance-12',
      pathId: 'security-governance',
      title: 'AWS Organizations & AWS Control Tower Landing Zones',
      description: 'Automate multi-account provisioning with organizational guardrails, centralized identity, and audit account structures.',
      difficulty: 'advanced',
      estimatedMinutes: 25,
      order: 12,
      content: {
        sections: [
          {
            id: 'security-governance-12-s1',
            title: 'AWS Control Tower Architecture',
            type: 'text',
            content: 'AWS Control Tower sets up and governs a secure, multi-account AWS environment called a Landing Zone based on AWS best practices. It configures AWS Organizations, provisions mandatory Security and Log Archive accounts, and enforces detective and preventative Guardrails (using SCPs and AWS Config rules).'
          }
        ]
      }
    }
  ]
};


export const monitoringOpsPath: LearningPath = {
  id: 'monitoring-ops',
  title: 'Monitoring & Operations',
  description: 'Gain full operational visibility with Amazon CloudWatch metrics, logs, alarms, AWS X-Ray distributed tracing, and AWS Systems Manager fleet management.',
  icon: 'Activity',
  order: 9,
  prerequisites: ['aws-core', 'compute-storage'],
  estimatedHours: 3.5,
  lessons: [
    {
      id: 'monitoring-ops-1',
      pathId: 'monitoring-ops',
      title: 'CloudWatch Metrics & Dimensional Filtering',
      description: 'Collect, visualize, and query operational metrics across AWS resources and custom application counters.',
      difficulty: 'beginner',
      estimatedMinutes: 25,
      order: 1,
      content: {
        sections: [
          {
            id: 'monitoring-ops-1-s1',
            title: 'Anatomy of a CloudWatch Metric',
            type: 'text',
            content: 'A CloudWatch metric represents a time-ordered set of data points published to CloudWatch. Metrics belong to Namespaces (e.g., AWS/EC2, AWS/RDS, or Custom/MyApp) and are uniquely identified by a Metric Name and zero or more Dimensions (name/value pairs like InstanceId=i-123).'
          },
          {
            id: 'monitoring-ops-1-s2',
            title: 'Standard vs High-Resolution Metrics',
            type: 'table',
            content: 'Metric granularity options:',
            tableData: {
              headers: ['Type', 'Resolution', 'Retention Window', 'Use Case'],
              rows: [
                ['Standard Resolution', '1-minute intervals', '15 days (gradually aggregates up to 15 months at 1-hour resolution)', 'General health monitoring, ASG scaling triggers'],
                ['High-Resolution', '1-second, 5-second, 10-second intervals', '3 hours (at 1-second resolution)', 'Sub-minute flash-sale spike detection, latency SLAs']
              ]
            }
          }
        ]
      }
    },
    {
      id: 'monitoring-ops-2',
      pathId: 'monitoring-ops',
      title: 'CloudWatch Logs: Insights, Log Groups, & Retention',
      description: 'Ingest, aggregate, monitor, and query application and system logs using CloudWatch Logs Insights syntax.',
      difficulty: 'intermediate',
      estimatedMinutes: 25,
      order: 2,
      content: {
        sections: [
          {
            id: 'monitoring-ops-2-s1',
            title: 'CloudWatch Logs Hierarchy',
            type: 'steps',
            content: 'Structure of log data inside CloudWatch:',
            steps: [
              { title: 'Log Event', description: 'A raw record of activity containing a timestamp and UTF-8 string message.' },
              { title: 'Log Stream', description: 'A sequence of log events originating from the exact same source (e.g., a specific container or EC2 instance).' },
              { title: 'Log Group', description: 'A group of log streams sharing the same retention, monitoring, and access control settings.' }
            ]
          },
          {
            id: 'monitoring-ops-2-s2',
            title: 'Querying Logs with CloudWatch Logs Insights',
            type: 'code',
            language: 'bash',
            content: '# Query top 20 slowest requests in API gateway log group\nfields @timestamp, @message, responseLatency\n| filter @message like /ERROR/\n| sort responseLatency desc\n| limit 20'
          }
        ]
      }
    },
    {
      id: 'monitoring-ops-3',
      pathId: 'monitoring-ops',
      title: 'CloudWatch Alarms & Composite Alarms',
      description: 'Trigger automated actions, SNS notifications, and Auto Scaling policies when operational metrics breach thresholds.',
      difficulty: 'intermediate',
      estimatedMinutes: 20,
      order: 3,
      content: {
        sections: [
          {
            id: 'monitoring-ops-3-s1',
            title: 'Metric Alarms vs Composite Alarms',
            type: 'table',
            content: 'Alarm design patterns:',
            tableData: {
              headers: ['Type', 'Trigger Condition', 'Benefit'],
              rows: [
                ['Metric Alarm', 'Evaluates a single metric threshold (e.g., CPU > 80% for 3 periods)', 'Simple, immediate notification or scaling hook'],
                ['Composite Alarm', 'Evaluates boolean rule logic combining multiple alarms (e.g., ALARM(CPUHigh) AND ALARM(DiskIOPSHigh))', 'Drastically cuts alarm fatigue by alerting only during true systemic outages']
              ]
            }
          }
        ]
      }
    },
    {
      id: 'monitoring-ops-4',
      pathId: 'monitoring-ops',
      title: 'AWS X-Ray Tracing: Traces, Subsegments, & Sampling',
      description: 'Trace distributed requests across microservices, databases, and third-party APIs to identify performance bottlenecks.',
      difficulty: 'intermediate',
      estimatedMinutes: 25,
      order: 4,
      content: {
        sections: [
          {
            id: 'monitoring-ops-4-s1',
            title: 'Distributed Tracing Mechanics',
            type: 'text',
            content: 'In microservice architectures, a single end-user request can trigger dozens of inter-service calls. AWS X-Ray attaches a unique HTTP trace header (X-Amzn-Trace-Id) to each incoming request, tracking its complete execution path through ALBs, API Gateways, Lambda functions, ECS containers, and downstream DynamoDB calls.'
          }
        ]
      }
    },
    {
      id: 'monitoring-ops-5',
      pathId: 'monitoring-ops',
      title: 'AWS Distro for OpenTelemetry & Observability',
      description: 'Adopt vendor-neutral open-source telemetry standards for distributed metrics, logs, and traces in AWS workloads.',
      difficulty: 'advanced',
      estimatedMinutes: 20,
      order: 5,
      content: {
        sections: [
          {
            id: 'monitoring-ops-5-s1',
            title: 'OpenTelemetry (OTel) on AWS',
            type: 'text',
            content: 'AWS Distro for OpenTelemetry (ADOT) is a secure, production-ready distribution of the Cloud Native Computing Foundation (CNCF) OpenTelemetry project. ADOT lets engineers instrument applications once and export traces and metrics to both AWS services (CloudWatch, X-Ray) and third-party APM tools (Datadog, Dynatrace).'
          }
        ]
      }
    },
    {
      id: 'monitoring-ops-6',
      pathId: 'monitoring-ops',
      title: 'AWS Systems Manager: Run Command, Session Manager, & Patch Manager',
      description: 'Manage fleets of EC2 instances securely without opening inbound SSH port 22 or managing bastion hosts.',
      difficulty: 'intermediate',
      estimatedMinutes: 25,
      order: 6,
      content: {
        sections: [
          {
            id: 'monitoring-ops-6-s1',
            title: 'SSM Session Manager: Goodbye Inbound SSH',
            type: 'callout',
            content: 'SSM Session Manager enables browser-based or CLI terminal access to EC2 instances using outbound HTTPS calls from the SSM Agent to the Systems Manager service. You can completely close inbound port 22 in your security groups!'
          },
          {
            id: 'monitoring-ops-6-s2',
            title: 'Starting a Secure SSM Shell Session',
            type: 'code',
            language: 'bash',
            content: '# Start an encrypted interactive bash shell on an EC2 instance without SSH keys\naws ssm start-session --target i-0a1b2c3d4e5f67890'
          }
        ]
      }
    },
    {
      id: 'monitoring-ops-7',
      pathId: 'monitoring-ops',
      title: 'AWS Trusted Advisor: Five Pillars Optimization',
      description: 'Scan your AWS environment for opportunities to reduce costs, improve system performance, close security gaps, and increase fault tolerance.',
      difficulty: 'beginner',
      estimatedMinutes: 20,
      order: 7,
      content: {
        sections: [
          {
            id: 'monitoring-ops-7-s1',
            title: 'Trusted Advisor Five Categories',
            type: 'table',
            content: 'Recommendation categories reviewed by Trusted Advisor:',
            tableData: {
              headers: ['Category', 'What It Scans For', 'Example Finding'],
              rows: [
                ['Cost Optimization', 'Unused or underutilized cloud resources', 'Idle RDS instances, unattached EBS volumes, low CPU EC2 instances'],
                ['Security', 'Permissions loopholes and public data exposures', 'S3 public bucket permissions, open security group ports (0.0.0.0/0 on port 22/3389)'],
                ['Fault Tolerance', 'Single points of failure across infrastructure', 'EBS backup freshness, single-AZ RDS deployments, ASG multi-AZ balance'],
                ['Performance', 'Resource limits and configuration bottlenecks', 'EC2 high utilization, CloudFront cache hits, EBS throughput throttling'],
                ['Service Quotas', 'Usage approaching AWS service limit thresholds', 'VPCs per region, Elastic IPs allocated, Route 53 rules']
              ]
            }
          }
        ]
      }
    },
    {
      id: 'monitoring-ops-8',
      pathId: 'monitoring-ops',
      title: 'Cloud Incident Response: Runbooks & Automated Escalation',
      description: 'Build automated incident response workflows using EventBridge, SSM Incident Manager, and automated PagerDuty/Slack routing.',
      difficulty: 'advanced',
      estimatedMinutes: 20,
      order: 8,
      content: {
        sections: [
          {
            id: 'monitoring-ops-8-s1',
            title: 'Automated Event-Driven Remediation Flow',
            type: 'steps',
            content: 'How modern cloud teams handle operational alerts:',
            steps: [
              { title: '1. Event Trigger', description: 'CloudWatch alarm breaches or GuardDuty generates a High severity finding.' },
              { title: '2. EventBridge Routing', description: 'Amazon EventBridge catches the rule pattern and directs payloads to target integrations.' },
              { title: '3. Automated Runbook', description: 'Systems Manager Automation executes a predefined runbook (e.g., isolate infected instance SG).' },
              { title: '4. Human Escalation', description: 'SSM Incident Manager engages on-call engineers via SMS, mobile push, and initiates a bridge room.' }
            ]
          }
        ]
      }
    }
  ]
};

export const iacAutomationPath: LearningPath = {
  id: 'iac-automation',
  title: 'Infrastructure as Code',
  description: 'Automate reproducible cloud deployments using AWS CloudFormation, AWS CDK, HashiCorp Terraform, Ansible, and Boto3 Python scripts.',
  icon: 'FileCode',
  order: 10,
  prerequisites: ['aws-core', 'vpc-networking'],
  estimatedHours: 3.5,
  lessons: [
    {
      id: 'iac-automation-1',
      pathId: 'iac-automation',
      title: 'IaC Principles: Idempotency, Drift, and State',
      description: 'Master the fundamental theories governing declarative infrastructure engines.',
      difficulty: 'beginner',
      estimatedMinutes: 20,
      order: 1,
      content: {
        sections: [
          {
            id: 'iac-automation-1-s1',
            title: 'Core Concepts of Modern IaC',
            type: 'table',
            content: 'Key terminology every cloud engineer must know:',
            tableData: {
              headers: ['Principle', 'Definition', 'Significance in Production'],
              rows: [
                ['Idempotency', 'Applying the same code multiple times yields the exact same state without unintended side-effects', 'Pipelines can run safely on every commit without duplicating resources'],
                ['Configuration Drift', 'Differences between actual deployed cloud state and the desired state declared in code', 'Caused by engineers making manual changes in the console; IaC detects and fixes drift'],
                ['State Management', 'The recorded mapping between code objects and real AWS resource ARNs/IDs', 'Must be securely locked and encrypted to prevent conflicting concurrent deployments']
              ]
            }
          }
        ]
      }
    },
    {
      id: 'iac-automation-2',
      pathId: 'iac-automation',
      title: 'CloudFormation Basics: Templates, Resources, & Parameters',
      description: 'Write JSON/YAML templates defining AWS resources and deploy managed CloudFormation stacks.',
      difficulty: 'beginner',
      estimatedMinutes: 25,
      order: 2,
      content: {
        sections: [
          {
            id: 'iac-automation-2-s1',
            title: 'CloudFormation YAML Template Anatomy',
            type: 'code',
            language: 'yaml',
            content: 'AWSTemplateFormatVersion: \'2010-09-09\'\nDescription: \'Production S3 Bucket with KMS Encryption\'\n\nParameters:\n  Environment:\n    Type: String\n    Default: prod\n    AllowedValues: [dev, stage, prod]\n\nResources:\n  AppStorageBucket:\n    Type: AWS::S3::Bucket\n    Properties:\n      BucketName: !Sub \'company-data-${Environment}-${AWS::AccountId}\'\n      VersioningConfiguration:\n        Status: Enabled\n      BucketEncryption:\n        ServerSideEncryptionConfiguration:\n          - ServerSideEncryptionByDefault:\n              SSEAlgorithm: AES256\n\nOutputs:\n  BucketArn:\n    Description: \'ARN of created bucket\'\n    Value: !GetAtt AppStorageBucket.Arn\n    Export:\n      Name: !Sub \'${AWS::StackName}-BucketArn\''
          }
        ]
      }
    },
    {
      id: 'iac-automation-3',
      pathId: 'iac-automation',
      title: 'CloudFormation Advanced: Change Sets, StackSets, & Deletion Policies',
      description: 'Preview updates safely using Change Sets, roll out resources across 100+ accounts with StackSets, and protect databases with DeletionPolicy=Retain.',
      difficulty: 'intermediate',
      estimatedMinutes: 25,
      order: 3,
      content: {
        sections: [
          {
            id: 'iac-automation-3-s1',
            title: 'Change Sets & DeletionPolicy',
            type: 'callout',
            content: 'Always generate a Change Set before executing stack updates to see which resources will be modified or recreated. Always attach DeletionPolicy: Retain to critical data resources (RDS, S3, KMS) so accidental stack deletions do not destroy persistent data!'
          }
        ]
      }
    },
    {
      id: 'iac-automation-4',
      pathId: 'iac-automation',
      title: 'AWS CDK: Modern Constructs in TypeScript & Python',
      description: 'Define cloud infrastructure using familiar programming languages (TypeScript, Python) that synthesize into CloudFormation templates.',
      difficulty: 'intermediate',
      estimatedMinutes: 25,
      order: 4,
      content: {
        sections: [
          {
            id: 'iac-automation-4-s1',
            title: 'Writing AWS CDK in TypeScript',
            type: 'code',
            language: 'typescript',
            content: 'import * as cdk from \'aws-cdk-lib\';\nimport * as ec2 from \'aws-cdk-lib/aws-ec2\';\nimport * as s3 from \'aws-cdk-lib/aws-s3\';\nimport { Construct } from \'constructs\';\n\nexport class AcademyStack extends cdk.Stack {\n  constructor(scope: Construct, id: string, props?: cdk.StackProps) {\n    super(scope, id, props);\n\n    // L2 Construct: Automatically builds VPC with public/private subnets across 2 AZs\n    const vpc = new ec2.Vpc(this, \'AcademyVPC\', {\n      maxAzs: 2,\n      natGateways: 1,\n    });\n\n    // Encrypted bucket with auto-delete objects on stack destroy for dev\n    new s3.Bucket(this, \'ArtifactsBucket\', {\n      encryption: s3.BucketEncryption.S3_MANAGED,\n      removalPolicy: cdk.RemovalPolicy.DESTROY,\n      autoDeleteObjects: true,\n    });\n  }\n}'
          }
        ]
      }
    },
    {
      id: 'iac-automation-5',
      pathId: 'iac-automation',
      title: 'Terraform Basics: HCL, Providers, & Resources',
      description: 'Declare multi-cloud infrastructure with HashiCorp Configuration Language (HCL), the AWS provider, and resource blocks.',
      difficulty: 'intermediate',
      estimatedMinutes: 25,
      order: 5,
      content: {
        sections: [
          {
            id: 'iac-automation-5-s1',
            title: 'Basic Terraform HCL Configuration',
            type: 'code',
            language: 'bash',
            content: '# main.tf\nterraform {\n  required_providers {\n    aws = {\n      source  = "hashicorp/aws"\n      version = "~> 5.0"\n    }\n  }\n}\n\nprovider "aws" {\n  region = "us-east-1"\n}\n\nresource "aws_vpc" "main" {\n  cidr_block           = "10.0.0.0/16"\n  enable_dns_hostnames = true\n  tags = {\n    Name = "terraform-vpc"\n  }\n}'
          }
        ]
      }
    },
    {
      id: 'iac-automation-6',
      pathId: 'iac-automation',
      title: 'Terraform Advanced: Remote State, S3 Backend, & DynamoDB Locks',
      description: 'Prevent concurrent pipeline collisions using remote state storage in S3 backed by DynamoDB state locking.',
      difficulty: 'advanced',
      estimatedMinutes: 25,
      order: 6,
      content: {
        sections: [
          {
            id: 'iac-automation-6-s1',
            title: 'Remote State Architecture',
            type: 'text',
            content: 'Never store the terraform.tfstate file on local developer laptops or in Git repositories (where unencrypted secrets could leak). Configure the S3 backend with AES-256 encryption and link a DynamoDB table with a primary key named LockID to enforce distributed mutual exclusion locking during terraform apply operations.'
          }
        ]
      }
    },
    {
      id: 'iac-automation-7',
      pathId: 'iac-automation',
      title: 'Ansible Overview: Configuration Management & Playbooks',
      description: 'Configure software packages, services, and security hardening on EC2 fleets agentlessly over SSH or SSM.',
      difficulty: 'intermediate',
      estimatedMinutes: 20,
      order: 7,
      content: {
        sections: [
          {
            id: 'iac-automation-7-s1',
            title: 'Ansible vs Terraform',
            type: 'table',
            content: 'Comparing Infrastructure Provisioning vs Configuration Management:',
            tableData: {
              headers: ['Tool', 'Primary Domain', 'Execution Model', 'Sweet Spot'],
              rows: [
                ['Terraform / CloudFormation', 'Infrastructure Provisioning', 'Declarative API calls to AWS', 'Creating VPCs, EC2 instances, RDS databases, ALBs'],
                ['Ansible / Chef / Puppet', 'Configuration Management', 'Agentless SSH / WinRM tasks', 'Configuring files, installing packages, hardening Linux OS kernels']
              ]
            }
          }
        ]
      }
    },
    {
      id: 'iac-automation-8',
      pathId: 'iac-automation',
      title: 'AWS CLI & SDK Automation Architecture',
      description: 'Automate repeatable operational scripts and query structured cloud data with JMESPath filter syntax.',
      difficulty: 'beginner',
      estimatedMinutes: 20,
      order: 8,
      content: {
        sections: [
          {
            id: 'iac-automation-8-s1',
            title: 'JMESPath Client-Side Filtering',
            type: 'code',
            language: 'bash',
            content: '# Find all running EC2 instances with their Private IPs\naws ec2 describe-instances \\\n  --filters "Name=instance-state-name,Values=running" \\\n  --query "Reservations[].Instances[].[InstanceId, PrivateIpAddress, Tags[?Key==\'Name\'].Value | [0]]" \\\n  --output table'
          }
        ]
      }
    },
    {
      id: 'iac-automation-9',
      pathId: 'iac-automation',
      title: 'Python & Boto3: Scripting the AWS Cloud',
      description: 'Programmatically interact with AWS services using the official Python Boto3 client and resource interfaces.',
      difficulty: 'intermediate',
      estimatedMinutes: 25,
      order: 9,
      content: {
        sections: [
          {
            id: 'iac-automation-9-s1',
            title: 'Automating AWS with Python Boto3',
            type: 'code',
            language: 'python',
            content: 'import boto3\n\ns3 = boto3.client(\'s3\')\nec2 = boto3.resource(\'ec2\')\n\n# List all buckets\nresponse = s3.list_buckets()\nfor bucket in response[\'Buckets\']:\n    print(f"Bucket: {bucket[\'Name\']}")\n\n# Stop all instances with tag Environment=Development\ninstances = ec2.instances.filter(\n    Filters=[{\'Name\': \'tag:Environment\', \'Values\': [\'Development\']}]\n)\nfor instance in instances:\n    instance.stop()\n    print(f"Stopped {instance.id}")'
          }
        ]
      }
    }
  ]
};

export const containersDevopsPath: LearningPath = {
  id: 'containers-devops',
  title: 'Containers & DevOps',
  description: 'Containerize and orchestrate cloud workloads with Docker, Amazon ECR, Amazon ECS, AWS Fargate, Kubernetes (EKS), and CI/CD pipelines.',
  icon: 'Box',
  order: 11,
  prerequisites: ['app-fundamentals', 'compute-storage'],
  estimatedHours: 4,
  lessons: [
    {
      id: 'containers-devops-1',
      pathId: 'containers-devops',
      title: 'Docker Fundamentals: Images, Containers, & Daemons',
      description: 'Understand the Docker engine architecture, container lifecycle commands, and building reproducible application containers.',
      difficulty: 'beginner',
      estimatedMinutes: 20,
      order: 1,
      content: {
        sections: [
          {
            id: 'containers-devops-1-s1',
            title: 'The Docker Architecture',
            type: 'text',
            content: 'The Docker client communicates with the Docker daemon (dockerd), which builds, runs, and distributes Docker containers. Images are read-only templates used to launch containers. Containers are runnable instances of images isolated by Linux namespaces.'
          }
        ]
      }
    },
    {
      id: 'containers-devops-2',
      pathId: 'containers-devops',
      title: 'Writing Production Dockerfiles & Multi-Stage Builds',
      description: 'Craft slim, secure container images by stripping build dependencies and adhering to the principle of least privilege.',
      difficulty: 'intermediate',
      estimatedMinutes: 25,
      order: 2,
      content: {
        sections: [
          {
            id: 'containers-devops-2-s1',
            title: 'Production Multi-Stage Dockerfile',
            type: 'code',
            language: 'bash',
            content: '# Stage 1: Build\nFROM node:20-alpine AS builder\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci\nCOPY . .\nRUN npm run build\n\n# Stage 2: Minimal Production Runtime\nFROM node:20-alpine\nWORKDIR /app\nENV NODE_ENV=production\nCOPY package*.json ./\nRUN npm ci --only=production\nCOPY --from=builder /app/dist ./dist\nUSER node\nEXPOSE 3000\nCMD ["node", "dist/index.js"]'
          }
        ]
      }
    },
    {
      id: 'containers-devops-3',
      pathId: 'containers-devops',
      title: 'Container Registries & Amazon ECR Deep Dive',
      description: 'Store, manage, and deploy container images with Amazon Elastic Container Registry (ECR) with automated vulnerability scanning.',
      difficulty: 'intermediate',
      estimatedMinutes: 20,
      order: 3,
      content: {
        sections: [
          {
            id: 'containers-devops-3-s1',
            title: 'ECR Authentication and Image Push',
            type: 'code',
            language: 'bash',
            content: '# Log in Docker client to Amazon ECR\naws ecr get-login-password --region us-east-1 | \\\n  docker login --username AWS --password-stdin 123456789012.dkr.ecr.us-east-1.amazonaws.com\n\n# Tag and push container image\ndocker tag my-web-app:latest 123456789012.dkr.ecr.us-east-1.amazonaws.com/my-web-app:v1.0\ndocker push 123456789012.dkr.ecr.us-east-1.amazonaws.com/my-web-app:v1.0'
          }
        ]
      }
    },
    {
      id: 'containers-devops-4',
      pathId: 'containers-devops',
      title: 'Amazon ECS Fundamentals: Clusters, Task Definitions, & Tasks',
      description: 'Master Amazon Elastic Container Service: define task definitions (JSON blueprints), launch tasks, and manage clusters.',
      difficulty: 'intermediate',
      estimatedMinutes: 25,
      order: 4,
      content: {
        sections: [
          {
            id: 'containers-devops-4-s1',
            title: 'ECS Core Concepts',
            type: 'table',
            content: 'The core hierarchy of ECS:',
            tableData: {
              headers: ['Construct', 'Role', 'Analogy'],
              rows: [
                ['ECS Cluster', 'A logical grouping of compute resources and running tasks', 'The virtual data center or container farm'],
                ['Task Definition', 'JSON blueprint specifying container image, memory, CPU, ports, environment variables', 'The blueprint or Docker Compose file'],
                ['Task', 'A single running instance of a Task Definition (one or more containers running together)', 'A running container pod'],
                ['Service', 'Maintains a specified desired count of running tasks, with auto-scaling and load balancing', 'The deployment supervisor']
              ]
            }
          }
        ]
      }
    },
    {
      id: 'containers-devops-5',
      pathId: 'containers-devops',
      title: 'ECS Services, Scheduling, & Load Balancing',
      description: 'Maintain long-running containerized microservices behind an Application Load Balancer with dynamic port mapping.',
      difficulty: 'intermediate',
      estimatedMinutes: 25,
      order: 5,
      content: {
        sections: [
          {
            id: 'containers-devops-5-s1',
            title: 'Dynamic Host Port Mapping',
            type: 'text',
            content: 'When running ECS on EC2, multiple container tasks from the same Task Definition can run on a single host EC2 instance. By specifying container port 80 and host port 0 (dynamic), ECS assigns random ephemeral ports (e.g. 32768) and automatically registers them with the ALB Target Group.'
          }
        ]
      }
    },
    {
      id: 'containers-devops-6',
      pathId: 'containers-devops',
      title: 'AWS Fargate: Serverless Container Compute',
      description: 'Run containers without managing EC2 instances, cluster capacity planning, or OS patching.',
      difficulty: 'intermediate',
      estimatedMinutes: 20,
      order: 6,
      content: {
        sections: [
          {
            id: 'containers-devops-6-s1',
            title: 'ECS EC2 Launch Type vs AWS Fargate',
            type: 'table',
            content: 'Choosing your ECS compute launch type:',
            tableData: {
              headers: ['Dimension', 'ECS on EC2', 'AWS Fargate (Serverless)'],
              rows: [
                ['Server Management', 'You manage, patch, and scale underlying EC2 instances', 'Zero server management; AWS provisions VM microVMs dynamically'],
                ['Billing Model', 'Pay for EC2 instances regardless of container density', 'Pay strictly for vCPU and Memory allocated per second per task'],
                ['Host Access', 'SSH/SSM into host OS possible', 'No host access; completely managed execution environment'],
                ['Networking Mode', 'bridge, host, awsvpc', 'awsvpc ONLY (every task gets its own dedicated ENI and private IP)']
              ]
            }
          }
        ]
      }
    },
    {
      id: 'containers-devops-7',
      pathId: 'containers-devops',
      title: 'Amazon EKS & Kubernetes Architecture',
      description: 'Explore the Kubernetes control plane, worker nodes, Pods, Deployments, and managing production Kubernetes on AWS.',
      difficulty: 'advanced',
      estimatedMinutes: 25,
      order: 7,
      content: {
        sections: [
          {
            id: 'containers-devops-7-s1',
            title: 'EKS Architecture Overview',
            type: 'text',
            content: 'Amazon Elastic Kubernetes Service (EKS) runs a certified conformant upstream Kubernetes control plane across 3 Availability Zones. EKS automates control plane updates, high availability, and etcd backups while allowing you to run worker nodes on Managed Node Groups, Self-Managed EC2 instances, or AWS Fargate.'
          }
        ]
      }
    },
    {
      id: 'containers-devops-8',
      pathId: 'containers-devops',
      title: 'CI/CD Concepts: Continuous Integration vs Continuous Delivery',
      description: 'Implement automated build, test, and release delivery pipelines to reduce deployment lead time and defect rates.',
      difficulty: 'beginner',
      estimatedMinutes: 20,
      order: 8,
      content: {
        sections: [
          {
            id: 'containers-devops-8-s1',
            title: 'CI vs CD vs CD',
            type: 'table',
            content: 'The software delivery evolution:',
            tableData: {
              headers: ['Stage', 'What Happens', 'Automation Extent'],
              rows: [
                ['Continuous Integration (CI)', 'Developers merge code frequently; automated build, unit test, and linting run', 'Automated build & test verification'],
                ['Continuous Delivery (CD)', 'Code is packaged and staged automatically; deployment to production requires manual human approval', 'Automated until production gate'],
                ['Continuous Deployment (CD)', 'Every commit that passes automated test stages is automatically deployed straight to production', '100% end-to-end automated']
              ]
            }
          }
        ]
      }
    },
    {
      id: 'containers-devops-9',
      pathId: 'containers-devops',
      title: 'AWS CodeBuild & Buildspec Execution',
      description: 'Configure serverless build jobs, artifact generation, and unit testing using buildspec.yml configuration files.',
      difficulty: 'intermediate',
      estimatedMinutes: 20,
      order: 9,
      content: {
        sections: [
          {
            id: 'containers-devops-9-s1',
            title: 'Anatomy of a buildspec.yml',
            type: 'code',
            language: 'yaml',
            content: 'version: 0.2\nphases:\n  install:\n    runtime-versions:\n      nodejs: 20\n    commands:\n      - npm ci\n  pre_build:\n    commands:\n      - npm run test\n      - aws ecr get-login-password | docker login --username AWS --password-stdin $ECR_URI\n  build:\n    commands:\n      - docker build -t $ECR_URI:$CODEBUILD_RESOLVED_SOURCE_VERSION .\n  post_build:\n    commands:\n      - docker push $ECR_URI:$CODEBUILD_RESOLVED_SOURCE_VERSION\nartifacts:\n  files:\n    - imagedefinitions.json'
          }
        ]
      }
    },
    {
      id: 'containers-devops-10',
      pathId: 'containers-devops',
      title: 'AWS CodePipeline & CodeDeploy Deployments',
      description: 'Orchestrate multi-stage pipelines with blue/green deployments and automated canary rollbacks.',
      difficulty: 'intermediate',
      estimatedMinutes: 20,
      order: 10,
      content: {
        sections: [
          {
            id: 'containers-devops-10-s1',
            title: 'CodeDeploy Deployment Configurations',
            type: 'table',
            content: 'Traffic shifting deployment types:',
            tableData: {
              headers: ['Configuration', 'Traffic Shift Behavior', 'Safety & Rollback'],
              rows: [
                ['Canary10Percent5Minutes', 'Routes 10% traffic to new version for 5 minutes; shifts remaining 90% if CloudWatch alarms stay green', 'High safety; isolates bugs to small user sample'],
                ['Linear10PercentEvery1Minute', 'Shifts 10% traffic every minute over 10 minutes until 100% is reached', 'Balanced speed and risk mitigation'],
                ['AllAtOnce', 'Swaps 100% traffic immediately to the new deployment fleet', 'Fastest; highest blast radius if defects occur']
              ]
            }
          }
        ]
      }
    },
    {
      id: 'containers-devops-11',
      pathId: 'containers-devops',
      title: 'GitHub Actions CI/CD to AWS Deployments',
      description: 'Authenticate securely from GitHub Actions workflows into AWS using OpenID Connect (OIDC) without static access keys.',
      difficulty: 'intermediate',
      estimatedMinutes: 20,
      order: 11,
      content: {
        sections: [
          {
            id: 'containers-devops-11-s1',
            title: 'OIDC Authentication with GitHub Actions',
            type: 'callout',
            content: 'Never store static AWS_ACCESS_KEY_ID in GitHub secrets! Instead, configure an IAM OIDC Identity Provider for token.actions.githubusercontent.com and let GitHub Actions assume an IAM Role dynamically via AWS STS.'
          }
        ]
      }
    }
  ]
};

export const allLearningPaths: LearningPath[] = [
  foundationsPath,
  networkingFundamentalsPath,
  appFundamentalsPath,
  awsCorePath,
  computeStoragePath,
  vpcNetworkingPath,
  databasesPath,
  securityGovernancePath,
  monitoringOpsPath,
  iacAutomationPath,
  containersDevopsPath,
];

