import { Comparison } from '../../types';

export const eventDrivenComparisons: Comparison[] = [
  {
    id: 'sns-vs-sqs',
    title: 'SNS vs SQS',
    category: 'Event-Driven',
    serviceA: 'Amazon SNS',
    serviceB: 'Amazon SQS',
    problem: 'Decoupling distributed microservices using asynchronous messaging patterns (publish/subscribe vs message queuing).',
    decisiveDifferences: [
      'Communication Pattern: SNS is a Publish/Subscribe (Pub/Sub) push notification service (one-to-many fanout); SQS is a point-to-point Message Queue pull/polling service (one-to-one consumer processing).',
      'Message Persistence & Storage: SQS persists messages reliably on disk across multiple AZs for up to 14 days until explicitly processed and deleted by a worker; SNS is an ephemeral push transport that delivers messages immediately and drops them if no subscriber or Dead Letter Queue (DLQ) is listening.',
      'Delivery Mechanism: SNS pushes messages synchronously to multiple endpoints (HTTP/S, email, SMS, Lambda, SQS); SQS requires consumers to poll (long polling or short polling) the queue to retrieve messages.',
      'Consumer Decoupling: In SNS, adding a subscriber notifies that subscriber of future messages; in SQS, multiple consumers reading from the same queue compete for messages, with each message processed by only one worker.'
    ],
    whenToChooseA: [
      'Broadcasting an event to multiple independent downstream systems or microservices simultaneously (Fan-out pattern).',
      'Sending push notifications directly to end-user devices (mobile push, SMS, email).',
      'Immediate delivery where message buffering or persistent queuing is not required.'
    ],
    whenToChooseB: [
      'Buffering workloads to protect downstream databases or APIs from sudden traffic spikes (load leveling / rate smoothing).',
      'Asynchronous task processing where worker pools pull jobs, process them, and delete them upon completion.',
      'Workloads requiring strict sequential ordering (SQS FIFO queues with message deduplication).',
      'Decoupling producer throughput from consumer processing capacity.'
    ],
    workTogether: 'The SNS + SQS Fanout Pattern: A producer publishes an order event to an SNS topic. Multiple SQS queues subscribe to that single SNS topic (e.g., Billing Queue, Shipping Queue, Analytics Queue). Each downstream service independently pulls and processes events from its dedicated SQS queue at its own pace without dropping messages.',
    tradeoffs: [
      {
        dimension: 'Messaging Pattern',
        optionA: 'Publish/Subscribe (one message -> multiple subscribers).',
        optionB: 'Point-to-Point Queue (one message -> single consumer).'
      },
      {
        dimension: 'Message Persistence',
        optionA: 'Ephemeral (delivered immediately; dropped if no subscriber).',
        optionB: 'Persistent (stored reliably up to 14 days; default 4 days).'
      },
      {
        dimension: 'Consumption Mechanism',
        optionA: 'Push (AWS delivers directly to endpoint).',
        optionB: 'Pull (Consumers poll the queue via ReceiveMessage API).'
      }
    ],
    scenario: 'When an e-commerce order is placed, an SNS topic fans out the message to two SQS queues: one consumed by the payment service, and another consumed by the warehouse inventory service. If the warehouse service goes down for 30 minutes, its SQS queue safely buffers the messages without data loss.',
    question: {
      id: 'quiz-sns-vs-sqs-1',
      question: 'A photo-sharing web application receives thousands of uploaded images per minute. A fleet of worker instances must process the images asynchronously. If traffic spikes, image jobs must not be lost, and workers should process images at a steady, sustainable rate. Which messaging service is required?',
      type: 'single',
      options: [
        'Amazon SNS topic with HTTP subscriber',
        'Amazon SQS standard queue',
        'Amazon EventBridge rule triggering Lambda directly',
        'Amazon Kinesis Data Firehose'
      ],
      correctAnswers: [1],
      explanation: 'Amazon SQS persists messages up to 14 days and allows worker pools to pull messages at their own sustainable rate (load leveling), ensuring no image jobs are lost during sudden traffic spikes.',
      whyOthersWrong: [
        'Amazon SNS is an ephemeral push service; if workers are saturated or crash, messages can be lost without a persistent queue.',
        'EventBridge invoking Lambda directly pushes concurrency to Lambda, which can fail if concurrency limits or downstream databases are overwhelmed.',
        'Kinesis Data Firehose is designed to stream data into S3/Redshift/OpenSearch, not coordinate general worker task queues.'
      ],
      decisiveClue: 'Buffer asynchronous image processing jobs so no jobs are lost during spikes and workers pull at a sustainable rate.',
      difficulty: 'beginner',
      isOriginal: true,
      source: 'Original AWS certification-style practice question'
    },
    sources: [
      { title: 'Amazon SQS Developer Guide', url: 'https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/welcome.html' },
      { title: 'Amazon SNS Developer Guide', url: 'https://docs.aws.amazon.com/sns/latest/dg/welcome.html' }
    ]
  },
  {
    id: 'sns-vs-eventbridge',
    title: 'SNS vs EventBridge',
    category: 'Event-Driven',
    serviceA: 'Amazon SNS',
    serviceB: 'Amazon EventBridge',
    problem: 'Choosing between a high-throughput pub/sub topic service and an intelligent event bus with content filtering, schema registry, and SaaS integrations.',
    decisiveDifferences: [
      'Routing & Filtering Intelligence: EventBridge inspects the full JSON event payload body to match complex JSON patterns (wildcards, prefix matching, numeric ranges, content filtering); SNS filtering rules evaluate only message attributes (metadata headers), not the message body.',
      'Target Breadth: EventBridge can route events directly to over 30+ AWS service targets (Step Functions, ECS tasks, Kinesis, CodePipeline, SSM runbooks, API destinations) without code; SNS delivers primarily to Lambda, SQS, HTTP/S webhooks, email, and SMS.',
      'SaaS & Partner Ingestion: EventBridge natively ingests events from third-party SaaS partners (Shopify, Zendesk, Datadog, Auth0, GitHub) and AWS service state changes; SNS relies on custom publisher code.',
      'Throughput & Latency: SNS delivers ultra-high throughput with single-digit millisecond latency (practically unlimited RPS); EventBridge has slightly higher latency (~20-50 ms) and regional default rate quotas (though expandable).'
    ],
    whenToChooseA: [
      'High-throughput, ultra-low latency event fan-out (e.g., tens of thousands of messages per second).',
      'Direct end-user notifications via SMS, email, or mobile Apple/Google APNs push notifications.',
      'Simple pub/sub fanout to SQS queues where message body inspection is unnecessary.'
    ],
    whenToChooseB: [
      'Building decoupled microservice event-driven architectures with schema management (Schema Registry).',
      'Routing events based on attributes inside the JSON event payload body.',
      'Direct integration with third-party SaaS providers (e.g., triggering actions when a Zendesk ticket is created).',
      'Triggering specific AWS actions directly without writing an intermediary Lambda function (e.g., EventBridge -> Step Functions).'
    ],
    workTogether: 'An architecture uses EventBridge as the central corporate event bus routing business domain events based on payload JSON attributes; when an event matches a high-priority customer notification rule, EventBridge targets an Amazon SNS topic to dispatch mobile push notifications and SMS.',
    tradeoffs: [
      {
        dimension: 'Payload Filtering',
        optionA: 'Filtered by message attributes (headers) only.',
        optionB: 'Deep JSON payload body pattern matching and rules.'
      },
      {
        dimension: 'Target Ecosystem',
        optionA: 'Limited: SQS, Lambda, HTTP/S webhooks, SMS, Email.',
        optionB: 'Extensive: 30+ AWS targets, API destinations, third-party SaaS.'
      },
      {
        dimension: 'Latency Profile',
        optionA: 'Ultra-low single-digit milliseconds (<10 ms).',
        optionB: 'Low latency (typically 20 - 50 ms).'
      }
    ],
    scenario: 'A modern SaaS application receives webhooks from Stripe and GitHub. Instead of managing custom webhook listeners, Amazon EventBridge ingests SaaS partner events, parses the JSON payload, and routes invoices over $1,000 directly to an AWS Step Functions workflow.',
    question: {
      id: 'quiz-sns-vs-eventbridge-1',
      question: 'An enterprise microservices platform needs an event router that can inspect the JSON body of order events and route orders with `{"country": "US", "total": {"$gt": 500}}` directly to an AWS Step Functions state machine, while ignoring others. Which AWS service natively supports this deep payload filtering and direct target routing without writing custom Lambda code?',
      type: 'single',
      options: [
        'Amazon SNS',
        'Amazon EventBridge',
        'Amazon SQS FIFO',
        'AWS AppSync'
      ],
      correctAnswers: [1],
      explanation: 'Amazon EventBridge provides sophisticated content-based filtering that inspects the JSON event payload body directly (including numeric ranges like greater than 500) and can route directly to AWS Step Functions without requiring intermediary Lambda code.',
      whyOthersWrong: [
        'Amazon SNS can only filter on message attributes (headers), cannot evaluate numeric ranges within the JSON payload body, and cannot trigger Step Functions directly without a Lambda shim.',
        'Amazon SQS is a pull-based queue, not an event router with payload evaluation rules.',
        'AWS AppSync is a managed GraphQL service, not a general-purpose asynchronous event bus.'
      ],
      decisiveClue: 'Inspect JSON payload body for numeric conditions ($gt: 500) and route directly to Step Functions without code.',
      difficulty: 'intermediate',
      isOriginal: true,
      source: 'Original AWS certification-style practice question'
    },
    sources: [
      { title: 'Amazon EventBridge Features', url: 'https://aws.amazon.com/eventbridge/features/' },
      { title: 'Choosing Between SNS and EventBridge', url: 'https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-choose-event-bus.html' }
    ]
  },
  {
    id: 'sqs-vs-eventbridge',
    title: 'SQS vs EventBridge',
    category: 'Event-Driven',
    serviceA: 'Amazon SQS',
    serviceB: 'Amazon EventBridge',
    problem: 'Balancing guaranteed asynchronous queue buffering and worker pulling against intelligent event routing and declarative fan-out.',
    decisiveDifferences: [
      'Architectural Paradigm: SQS is a durable message buffer/queue where workers pull and delete messages one at a time; EventBridge is an event router/bus that evaluates incoming events and pushes them immediately to configured targets.',
      'Storage & Backpressure: SQS provides backpressure management, storing millions of unprocessed messages for up to 14 days so slow downstream workers are never overwhelmed; EventBridge does not hold or queue messages for worker pulling (though it can send failed events to an SQS DLQ).',
      'Filtering & Routing: EventBridge performs sophisticated JSON pattern matching to route events to over 30 destinations; SQS does not route messages anywhere—it holds them until a client asks for them.',
      'Ordering: SQS FIFO provides strict Exactly-Once processing and First-In-First-Out ordering; EventBridge does not guarantee strict message ordering.'
    ],
    whenToChooseA: [
      'Protecting downstream databases or legacy third-party APIs from being overwhelmed by traffic bursts (rate leveling).',
      'Batch processing jobs where compute instances pull a batch of items, process them, and commit results.',
      'Applications requiring strict message ordering via FIFO queues with message group IDs.'
    ],
    whenToChooseB: [
      'Publishing domain events from multiple microservices onto a unified event bus with declarative routing rules.',
      'Broadcasting state changes to multiple AWS services without managing queue polling worker fleets.',
      'Ingesting events from third-party SaaS applications or AWS service state change notifications.'
    ],
    workTogether: 'EventBridge routes events to Amazon SQS as a destination target. EventBridge evaluates event payloads, matches rules, and pushes matching events into an SQS queue. Worker EC2 instances or ECS tasks then pull messages from the SQS queue safely at their own throttled pace.',
    tradeoffs: [
      {
        dimension: 'Primary Role',
        optionA: 'Durable message buffer and pull queue.',
        optionB: 'Intelligent event router and push dispatcher.'
      },
      {
        dimension: 'Backpressure / Throttling Control',
        optionA: 'Excellent: Workers pull only when capacity is available.',
        optionB: 'Limited: Pushes immediately to targets; targets must handle load.'
      },
      {
        dimension: 'Strict FIFO Ordering',
        optionA: 'Supported (SQS FIFO queues).',
        optionB: 'Not supported.'
      }
    ],
    scenario: 'An insurance portal emits `ClaimSubmitted` events onto an Amazon EventBridge bus. EventBridge routes high-priority claims immediately to a Step Functions workflow, and routes standard claims into an Amazon SQS queue where background workers process them during off-peak hours.',
    question: {
      id: 'quiz-sqs-vs-eventbridge-1',
      question: 'A batch processing application needs to process financial transactions in strict sequential order with guaranteed deduplication, ensuring that slow backend database servers pull transactions only when capacity is available. Which service meets these criteria?',
      type: 'single',
      options: [
        'Amazon EventBridge bus with custom rules',
        'Amazon SQS FIFO queue',
        'Amazon SNS FIFO topic with Lambda subscriber',
        'Amazon Kinesis Data Streams with 1 shard'
      ],
      correctAnswers: [1],
      explanation: 'Amazon SQS FIFO queues guarantee strict First-In-First-Out ordering, message deduplication, and a pull-based model that allows backend database servers to control their consumption rate (backpressure).',
      whyOthersWrong: [
        'EventBridge does not provide strict FIFO ordering or a pull-based queue for backpressure management.',
        'SNS FIFO topics push messages immediately to subscribers rather than allowing the consumer to pull at its own pace.',
        'Kinesis Data Streams requires continuous partition management and is designed for real-time data streaming rather than transactional job queuing.'
      ],
      decisiveClue: 'Strict sequential order, guaranteed deduplication, and pull-based consumption for slow backend databases.',
      difficulty: 'intermediate',
      isOriginal: true,
      source: 'Original AWS certification-style practice question'
    },
    sources: [
      { title: 'Amazon SQS Overview', url: 'https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/welcome.html' },
      { title: 'Amazon EventBridge Rules', url: 'https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-rules.html' }
    ]
  },
  {
    id: 'step-functions-vs-lambda-chain',
    title: 'Step Functions vs Direct Lambda Chaining',
    category: 'Event-Driven',
    serviceA: 'AWS Step Functions',
    serviceB: 'Direct Lambda Chaining',
    problem: 'Orchestrating multi-step serverless workflows, error handling, retries, and state management.',
    decisiveDifferences: [
      'State Management: Step Functions maintains the state machine execution history externally in a managed visual workflow; chaining Lambdas requires each function to pass state to the next or persist intermediate state in DynamoDB/S3.',
      'Error Handling & Retries: Step Functions provides declarative JSON/ASL retry policies, exponential backoff, catch blocks, and fallback states with zero custom code; chained Lambdas require writing complex try/catch, retry, and dead-letter logic in application code.',
      'Execution Duration: Step Functions Standard Workflows can run for up to ONE YEAR, supporting asynchronous human approval gates and long waits; chained Lambdas are capped at 15 minutes per function invocation and incur idle billing if waiting for external responses.',
      'Observability: Step Functions provides visual, real-time graphical execution diagrams highlighting which state failed and the exact input/output payloads; chained Lambdas require stitching together scattered CloudWatch log streams.'
    ],
    whenToChooseA: [
      'Complex multi-step business workflows with branching logic, parallel branches, and error recovery paths.',
      'Long-running workflows that pause for external human approvals, webhooks, or scheduled delays.',
      'Saga patterns requiring automated compensating transactions upon step failure (distributed transactions).',
      'Orchestrating disparate AWS services directly (e.g., Lambda + Batch + ECS + SNS) without glue code.'
    ],
    whenToChooseB: [
      'Simple, linear two-step operations where a single Lambda invokes another asynchronously.',
      'Ultra-high volume, low-latency microservices where Step Functions Standard state transition costs ($0.025/1,000 transitions) would become excessive (though Step Functions Express Workflows mitigates this).',
      'Simple point-to-point event notifications (e.g., Lambda A puts a message in SQS, which triggers Lambda B).'
    ],
    workTogether: 'An AWS Step Functions state machine coordinates the overarching business process, invoking individual focused AWS Lambda functions for specific computing tasks while managing retry policies, parallel execution, and failure branches declaratively.',
    tradeoffs: [
      {
        dimension: 'State & Workflow Logic',
        optionA: 'Declarative state machine (Amazon States Language) managed by AWS.',
        optionB: 'Imperative code written in application handlers; difficult to audit.'
      },
      {
        dimension: 'Maximum Workflow Duration',
        optionA: 'Up to 1 year (Standard Workflows).',
        optionB: '15 minutes per function invocation.'
      },
      {
        dimension: 'Failure Visibility',
        optionA: 'Visual console diagram showing exact failed step and payload.',
        optionB: 'Must parse distributed CloudWatch logs across multiple log groups.'
      }
    ],
    scenario: 'A loan application workflow requires document verification, credit checks, human fraud inspection, and account creation. Using AWS Step Functions, the workflow pauses up to 3 days for a loan officer approval task before resuming and finalizing the loan.',
    question: {
      id: 'quiz-step-functions-vs-lambda-chain-1',
      question: 'A development team needs to build an order processing workflow consisting of 8 distinct steps: credit check, inventory reservation, shipping label creation, customer notification, and rollback actions if any step fails. The workflow must include automated retries with exponential backoff and can take up to 2 hours. What is the recommended AWS architectural approach?',
      type: 'single',
      options: [
        'A monolithic AWS Lambda function configured with a 2-hour timeout',
        'Directly invoke Lambda functions sequentially where each function invokes the next Lambda via AWS SDK',
        'AWS Step Functions Standard Workflow orchestrating individual Lambda functions',
        'Amazon Simple Notification Service (SNS) with 8 topic subscriptions'
      ],
      correctAnswers: [2],
      explanation: 'AWS Step Functions is purpose-built to orchestrate multi-step serverless workflows. It supports executions lasting up to 1 year, visual tracking, declarative retry policies with exponential backoff, and automated rollback logic (Saga pattern).',
      whyOthersWrong: [
        'AWS Lambda has a hard maximum timeout of 15 minutes; a 2-hour function timeout is technically impossible.',
        'Directly chaining Lambdas creates tight coupling, brittle error handling, high operational complexity, and loses execution visibility across failures.',
        'SNS topics broadcast messages concurrently to all subscribers, which does not allow sequential coordination, retries, or conditional rollback logic.'
      ],
      decisiveClue: '8-step order workflow with retries, exponential backoff, rollback actions, and execution up to 2 hours.',
      difficulty: 'beginner',
      isOriginal: true,
      source: 'Original AWS certification-style practice question'
    },
    sources: [
      { title: 'AWS Step Functions Developer Guide', url: 'https://docs.aws.amazon.com/step-functions/latest/dg/welcome.html' },
      { title: 'Serverless Workflow Orchestration', url: 'https://aws.amazon.com/step-functions/features/' }
    ]
  },
  {
    id: 'api-gateway-vs-alb',
    title: 'API Gateway vs ALB',
    category: 'Event-Driven',
    serviceA: 'Amazon API Gateway',
    serviceB: 'Application Load Balancer (ALB)',
    problem: 'Choosing the front-door ingress point for web applications, REST APIs, and serverless compute backends.',
    decisiveDifferences: [
      'Feature Set & Purpose: API Gateway is a fully managed API management platform (supporting API keys, usage plans, request validation, throttling, mock endpoints, and OpenAPI specs); ALB is a high-performance Layer 7 load balancer optimized for distributing HTTP/HTTPS traffic across compute targets.',
      'Protocol Support: API Gateway supports REST APIs, HTTP APIs, and stateful WebSockets; ALB supports HTTP/1.1, HTTP/2, gRPC, and WebSockets.',
      'Authentication & Authorization: API Gateway natively integrates with AWS Cognito, IAM authorization, and custom Lambda Authorizers; ALB supports direct OIDC / OAuth authentication and Amazon Cognito user pool authentication at the listener level.',
      'Pricing Model: API Gateway charges per million requests ($1.00 - $3.50 per million calls) with no base hourly charge; ALB charges an hourly fee (~$0.0225/hr) plus Load Balancer Capacity Units (LCUs), making ALB vastly cheaper for sustained high-volume web traffic.'
    ],
    whenToChooseA: [
      'Serverless REST or WebSocket APIs backed by AWS Lambda functions or direct AWS service integrations.',
      'Monetized or partner APIs requiring rate limiting per client API key, usage plans, and request throttling.',
      'Applications needing schema validation, request/response transformations, or mock API responses.',
      'Low to moderate or spiky API traffic where scale-to-zero and zero fixed hourly cost are beneficial.'
    ],
    whenToChooseB: [
      'High-throughput sustained web applications and microservices running on EC2, ECS, or EKS.',
      'Workloads processing hundreds of millions of requests per month where API Gateway per-request costs would be cost-prohibitive.',
      'Applications requiring gRPC protocol support or direct IP target routing across VPCs.',
      'Integrating with AWS WAF for high-volume enterprise web platforms.'
    ],
    workTogether: 'An enterprise can use API Gateway as the public developer portal fronting external API consumers to enforce client throttling and API keys, and configure API Gateway to forward validated requests privately to an internal Application Load Balancer fronting an ECS microservices cluster.',
    tradeoffs: [
      {
        dimension: 'API Management Features',
        optionA: 'Comprehensive: API keys, usage plans, throttling, SDK generation.',
        optionB: 'None: Standard load balancing and basic path/host routing.'
      },
      {
        dimension: 'High Volume Cost Structure',
        optionA: 'Billed per million requests ($1.00 - $3.50/M); expensive at high sustained scale.',
        optionB: 'Hourly base fee + LCUs; significantly cheaper per-request at scale.'
      },
      {
        dimension: 'Maximum Timeout',
        optionA: 'Hard 29-second integration timeout.',
        optionB: 'Configurable idle timeout up to 4,000 seconds.'
      }
    ],
    scenario: 'A mobile startup uses Amazon API Gateway to authenticate mobile app users via Amazon Cognito and throttle free-tier users to 5 requests per second. As their backend scales to 500 million requests monthly on Amazon EKS, they transition backend microservices behind an Application Load Balancer to slash ingress costs.',
    question: {
      id: 'quiz-api-gateway-vs-alb-1',
      question: 'A SaaS platform exposes a public REST API to external third-party developers. The platform requires client API keys, custom usage plans, per-customer rate throttling (max 100 requests/minute per client), and request payload validation before reaching backend Lambda functions. Which ingress service provides these features out of the box?',
      type: 'single',
      options: [
        'Application Load Balancer (ALB)',
        'Amazon API Gateway (REST API)',
        'Network Load Balancer (NLB)',
        'Amazon CloudFront with Lambda@Edge'
      ],
      correctAnswers: [1],
      explanation: 'Amazon API Gateway REST APIs natively provide full API lifecycle management, including API key management, client usage plans, rate throttling per client, and JSON schema request validation.',
      whyOthersWrong: [
        'Application Load Balancers balance HTTP traffic but do not natively provide API keys, usage plans, per-client tier throttling, or JSON schema validation.',
        'Network Load Balancers operate at Layer 4 and lack all Layer 7 API management features.',
        'CloudFront with Lambda@Edge can inspect requests, but requires building and maintaining extensive custom code for API keys, usage plans, and rate-limiting databases.'
      ],
      decisiveClue: 'Public REST API requiring API keys, usage plans, per-customer rate throttling, and payload validation.',
      difficulty: 'beginner',
      isOriginal: true,
      source: 'Original AWS certification-style practice question'
    },
    sources: [
      { title: 'Amazon API Gateway Overview', url: 'https://docs.aws.amazon.com/apigateway/latest/developerguide/welcome.html' },
      { title: 'Application Load Balancer Guide', url: 'https://docs.aws.amazon.com/elasticloadbalancing/latest/application/introduction.html' }
    ]
  }
];
