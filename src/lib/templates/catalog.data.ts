// AUTO-GENERATED — do not edit by hand.
//
// Produced by scripts/gen-template-catalog.mjs from the
// `infogiph-template-catalog` workflow output. Re-run that workflow and the
// script to regenerate.
//
// 98 templates across 14 categories.

import type { RawTemplate } from './types';

export const rawTemplates: RawTemplate[] = [
  {
    slug: 'microservices-architecture-diagram',
    title: 'Microservices Architecture Diagram',
    shortDescription:
      'Map independent services, an API gateway, databases and a message bus in a microservices system',
    longDescription:
      'A microservices architecture diagram maps how a large application is split into small, independently deployable services that each own their data and communicate over the network. Core parts include an API gateway routing client traffic, business services such as Auth, Orders and Payments, a per-service database, a message broker for async events, and a service discovery or caching layer that ties everything together.\n\nBackend engineers, platform teams and architects reach for this diagram during system design reviews, onboarding and migration planning. It is the clearest way to explain service boundaries, data ownership and inter-service communication when moving off a monolith or documenting an existing distributed system for new team members.',
    tags: [
      'microservices',
      'architecture',
      'backend',
      'api gateway',
      'distributed systems',
      'system design',
      'services',
    ],
    keywords: [
      'microservices architecture diagram',
      'microservices diagram template',
      'microservices system design',
      'service oriented architecture diagram',
      'how to draw microservices architecture',
      'microservices components',
    ],
    layout: 'hub',
    centerLabel: 'API Gateway',
    centerIcon: 'cloud',
    satellites: [
      {
        label: 'Auth Service',
        icon: 'process',
      },
      {
        label: 'Orders Service',
        icon: 'process',
      },
      {
        label: 'Payments Service',
        icon: 'process',
      },
      {
        label: 'PostgreSQL',
        icon: 'database',
      },
      {
        label: 'Kafka Message Bus',
        icon: 'automation',
      },
      {
        label: 'Redis Cache',
        icon: 'database',
      },
      {
        label: 'Service Discovery',
        icon: 'search',
      },
    ],
    faqs: [
      {
        q: 'What is a microservices architecture diagram?',
        a: 'It is a visual map of an application broken into small, independently deployable services that communicate over the network. It shows the API gateway, each service, its database and the messaging layer between them.',
      },
      {
        q: 'What are the main components of a microservices architecture?',
        a: 'Typical components are an API gateway, multiple business services, a database per service, a message broker for async events, service discovery and a caching layer.',
      },
      {
        q: 'How is microservices different from a monolith?',
        a: 'A monolith ships as one deployable unit with a shared database, while microservices split functionality into many services that deploy and scale independently and own their own data.',
      },
      {
        q: 'Why use an API gateway in microservices?',
        a: 'The API gateway gives clients a single entry point and handles routing, authentication, rate limiting and aggregation so services stay decoupled from external callers.',
      },
    ],
    useCases: [
      'System design reviews',
      'Engineering onboarding docs',
      'Monolith-to-microservices migration',
      'Architecture decision records',
      'Technical interviews',
    ],
    category: 'architecture',
    categoryName: 'System & Software Architecture',
  },
  {
    slug: 'serverless-architecture-template',
    title: 'Serverless Architecture Template',
    shortDescription:
      'Map API Gateway, Lambda functions, managed databases and event triggers in a serverless app',
    longDescription:
      'A serverless architecture template shows how an application runs on fully managed cloud services with no servers to provision. The diagram centers on an event-driven compute layer of functions, fed by an API gateway and event sources, with managed data stores, object storage and authentication wired in around it. Nothing runs continuously; every component scales on demand and bills per request.\n\nCloud developers, solution architects and startups use this template to plan AWS Lambda, Azure Functions or Cloudflare Workers deployments. It clarifies how triggers invoke functions and which managed services back them, making it ideal for cost discussions, proof-of-concepts and serverless onboarding for teams new to function-as-a-service.',
    tags: [
      'serverless',
      'lambda',
      'faas',
      'cloud',
      'aws',
      'event-driven',
      'architecture',
    ],
    keywords: [
      'serverless architecture template',
      'serverless architecture diagram',
      'aws lambda architecture',
      'faas diagram',
      'serverless app design',
      'serverless components',
    ],
    layout: 'hub',
    centerLabel: 'Lambda Functions',
    centerIcon: 'process',
    satellites: [
      {
        label: 'API Gateway',
        icon: 'cloud',
      },
      {
        label: 'DynamoDB',
        icon: 'database',
      },
      {
        label: 'S3 Object Storage',
        icon: 'drive',
      },
      {
        label: 'Cognito Auth',
        icon: 'process',
      },
      {
        label: 'EventBridge Triggers',
        icon: 'automation',
      },
      {
        label: 'SQS Queue',
        icon: 'automation',
      },
      {
        label: 'CloudWatch Monitoring',
        icon: 'search',
      },
    ],
    faqs: [
      {
        q: 'What is a serverless architecture?',
        a: 'Serverless architecture runs application code as managed functions that scale automatically and bill per execution, with no servers for you to provision or maintain.',
      },
      {
        q: 'What are the components of a serverless architecture?',
        a: 'Common pieces are an API gateway, functions like AWS Lambda, managed databases such as DynamoDB, object storage, an authentication service and event sources or queues that trigger the functions.',
      },
      {
        q: 'Is serverless really server-free?',
        a: 'Servers still exist, but the cloud provider fully manages them. You only deploy code and configure triggers, so you never patch or scale infrastructure yourself.',
      },
      {
        q: 'When should I use serverless?',
        a: 'Serverless fits event-driven workloads, spiky or unpredictable traffic, and teams that want to minimize operations overhead and pay only for actual usage.',
      },
    ],
    useCases: [
      'Cloud cost planning',
      'Proof-of-concept design',
      'AWS architecture reviews',
      'Startup MVP blueprints',
      'Developer onboarding',
    ],
    category: 'architecture',
    categoryName: 'System & Software Architecture',
  },
  {
    slug: 'event-driven-architecture-diagram',
    title: 'Event-Driven Architecture Diagram',
    shortDescription:
      'Visualize producers, an event broker, consumers and event stores in an async system',
    longDescription:
      'An event-driven architecture diagram shows how components communicate asynchronously by publishing and subscribing to events instead of calling each other directly. At the center sits an event broker or streaming platform: producers emit events into it, consumers react to those events, and an event store keeps an immutable log for replay and auditing. This decoupling lets services evolve and scale independently.\n\nArchitects, data engineers and backend teams use this diagram to design pub/sub systems, streaming pipelines and reactive microservices. It is especially useful for explaining eventual consistency, fan-out behavior, and how Kafka or a message queue routes events between many producers and consumers without tight coupling.',
    tags: [
      'event-driven',
      'pub-sub',
      'kafka',
      'streaming',
      'messaging',
      'async',
      'architecture',
    ],
    keywords: [
      'event-driven architecture diagram',
      'pub sub architecture diagram',
      'kafka architecture diagram',
      'event streaming diagram',
      'eda diagram template',
      'event broker design',
    ],
    layout: 'hub',
    centerLabel: 'Event Broker',
    centerIcon: 'automation',
    satellites: [
      {
        label: 'Producer Services',
        icon: 'process',
      },
      {
        label: 'Kafka Topics',
        icon: 'automation',
      },
      {
        label: 'Consumer Services',
        icon: 'process',
      },
      {
        label: 'Event Store',
        icon: 'database',
      },
      {
        label: 'Schema Registry',
        icon: 'layers',
      },
      {
        label: 'Dead Letter Queue',
        icon: 'automation',
      },
      {
        label: 'Stream Processor',
        icon: 'search',
      },
    ],
    faqs: [
      {
        q: 'What is event-driven architecture?',
        a: 'It is a design where components communicate by producing and consuming events through a broker, instead of calling each other directly, which lets services stay loosely coupled.',
      },
      {
        q: 'What are the components of an event-driven architecture?',
        a: 'Key parts are event producers, an event broker or streaming platform like Kafka, consumers that react to events, an event store for replay, and often a schema registry and stream processor.',
      },
      {
        q: 'What is the difference between events and messages?',
        a: 'An event is a notification that something happened and may have many subscribers, while a message is often a directed command to a specific consumer. Brokers can carry both.',
      },
      {
        q: 'Why use a dead letter queue?',
        a: 'A dead letter queue captures events that fail processing so they can be inspected and retried later without blocking or losing the rest of the stream.',
      },
    ],
    useCases: [
      'Streaming pipeline design',
      'Pub/sub system planning',
      'Microservices decoupling',
      'Data engineering docs',
      'Architecture reviews',
    ],
    category: 'architecture',
    categoryName: 'System & Software Architecture',
  },
  {
    slug: 'api-gateway-architecture-diagram',
    title: 'API Gateway Architecture Diagram',
    shortDescription:
      'Show how an API gateway routes, authenticates and rate-limits traffic to backend services',
    longDescription:
      'An API gateway architecture diagram illustrates the single entry point that sits between clients and backend services. The gateway handles routing, authentication, rate limiting, request transformation and response aggregation, then forwards calls to the right upstream services. Around it sit identity providers, backend microservices, a cache layer and observability tooling that the gateway integrates with.\n\nBackend engineers, API platform teams and architects use this diagram to document edge traffic flow and security policies. It is the clearest way to show how clients reach internal services, where cross-cutting concerns like auth and throttling live, and how the gateway protects and decouples the backend from external consumers.',
    tags: [
      'api gateway',
      'api',
      'edge',
      'routing',
      'authentication',
      'backend',
      'architecture',
    ],
    keywords: [
      'api gateway diagram',
      'api gateway architecture',
      'api gateway design pattern',
      'how api gateway works',
      'kong nginx gateway diagram',
      'api management diagram',
    ],
    layout: 'hub',
    centerLabel: 'API Gateway',
    centerIcon: 'cloud',
    satellites: [
      {
        label: 'Web & Mobile Clients',
        icon: 'web',
      },
      {
        label: 'Auth / OAuth Provider',
        icon: 'process',
      },
      {
        label: 'Rate Limiter',
        icon: 'process',
      },
      {
        label: 'Backend Services',
        icon: 'process',
      },
      {
        label: 'Response Cache',
        icon: 'database',
      },
      {
        label: 'Request Router',
        icon: 'automation',
      },
      {
        label: 'Logging & Metrics',
        icon: 'search',
      },
    ],
    faqs: [
      {
        q: 'What is an API gateway?',
        a: 'An API gateway is a single entry point that receives client requests, applies cross-cutting policies like authentication and rate limiting, and routes them to the correct backend services.',
      },
      {
        q: 'What does an API gateway do?',
        a: 'It handles routing, authentication, rate limiting, request and response transformation, caching, and aggregation, so backend services do not have to implement these concerns individually.',
      },
      {
        q: 'What is the difference between an API gateway and a load balancer?',
        a: 'A load balancer distributes traffic across identical servers, while an API gateway understands API requests and applies routing, security and transformation logic per endpoint.',
      },
      {
        q: 'Why use an API gateway?',
        a: 'It centralizes security, monitoring and routing, decouples clients from internal services, and lets you change the backend without breaking external consumers.',
      },
    ],
    useCases: [
      'API platform documentation',
      'Security policy reviews',
      'Edge architecture planning',
      'Engineering onboarding',
      'Vendor evaluation',
    ],
    category: 'architecture',
    categoryName: 'System & Software Architecture',
  },
  {
    slug: 'cdn-architecture-diagram',
    title: 'CDN Architecture Diagram',
    shortDescription:
      'Map edge servers, origin, caching and DNS routing in a content delivery network',
    longDescription:
      'A CDN architecture diagram shows how a content delivery network speeds up websites by caching content at edge locations close to users. DNS or anycast routing directs each request to the nearest edge server, which serves cached assets or fetches them from the origin on a cache miss. Edge caching, origin shielding, TLS termination and a web application firewall round out the path from user to content.\n\nFrontend engineers, DevOps teams and architects use this diagram to explain latency reduction, cache invalidation and origin offload. It is ideal for documenting how static assets, media and even dynamic content are delivered globally, and how the edge layer both protects and accelerates the origin server.',
    tags: [
      'cdn',
      'edge',
      'caching',
      'content delivery',
      'dns',
      'performance',
      'infrastructure',
    ],
    keywords: [
      'cdn architecture diagram',
      'content delivery network diagram',
      'how cdn works diagram',
      'edge caching architecture',
      'cloudflare cdn diagram',
      'cdn design',
    ],
    layout: 'hub',
    centerLabel: 'Edge Servers',
    centerIcon: 'cloud',
    satellites: [
      {
        label: 'End Users',
        icon: 'web',
      },
      {
        label: 'DNS / Anycast Routing',
        icon: 'search',
      },
      {
        label: 'Edge Cache',
        icon: 'drive',
      },
      {
        label: 'Origin Server',
        icon: 'cloud',
      },
      {
        label: 'Origin Shield',
        icon: 'process',
      },
      {
        label: 'Web Application Firewall',
        icon: 'process',
      },
      {
        label: 'TLS Termination',
        icon: 'layers',
      },
    ],
    faqs: [
      {
        q: 'What is a CDN architecture?',
        a: 'A CDN architecture is a network of geographically distributed edge servers that cache content close to users, reducing latency and offloading traffic from the origin server.',
      },
      {
        q: 'How does a CDN work?',
        a: 'DNS or anycast routing sends each request to the nearest edge server. If the content is cached there it is served instantly; otherwise the edge fetches it from the origin and caches it for next time.',
      },
      {
        q: 'What is the origin server in a CDN?',
        a: 'The origin is the authoritative source where your real content lives. Edge servers pull from it on cache misses, and an origin shield can reduce how often that happens.',
      },
      {
        q: 'What can a CDN cache?',
        a: 'CDNs cache static assets like images, CSS, JavaScript and video, and modern CDNs can also cache and accelerate dynamic and API responses at the edge.',
      },
    ],
    useCases: [
      'Performance optimization docs',
      'Infrastructure reviews',
      'Latency troubleshooting',
      'DevOps onboarding',
      'Vendor comparison',
    ],
    category: 'architecture',
    categoryName: 'System & Software Architecture',
  },
  {
    slug: 'three-tier-web-application-architecture-diagram',
    title: 'Three-Tier Web Application Architecture Diagram',
    shortDescription:
      'Show presentation, application and data tiers with load balancer and database layers',
    longDescription:
      'A three-tier web application architecture diagram separates a system into a presentation tier, an application tier and a data tier. The presentation tier is the browser-facing frontend, the application tier holds business logic on web and app servers behind a load balancer, and the data tier stores persistent state in a database, often with caching and read replicas. Clear boundaries between tiers make the system easier to scale and secure.\n\nFull-stack developers, architects and students use this diagram to document classic web apps and plan deployments. It is a foundational template for explaining separation of concerns, where load balancing fits, and how requests flow from the browser through application servers to the database and back.',
    tags: [
      'three-tier',
      'web application',
      'n-tier',
      'load balancer',
      'frontend',
      'backend',
      'architecture',
    ],
    keywords: [
      'three tier architecture diagram',
      '3 tier web application architecture',
      'n-tier architecture diagram',
      'web app architecture diagram',
      'presentation application data tier',
      'three layer architecture',
    ],
    layout: 'hub',
    centerLabel: 'Application Tier',
    centerIcon: 'cloud',
    satellites: [
      {
        label: 'Browser Frontend',
        icon: 'web',
      },
      {
        label: 'Load Balancer',
        icon: 'process',
      },
      {
        label: 'App Servers',
        icon: 'cloud',
      },
      {
        label: 'Business Logic',
        icon: 'process',
      },
      {
        label: 'Primary Database',
        icon: 'database',
      },
      {
        label: 'Read Replica',
        icon: 'database',
      },
      {
        label: 'Cache Layer',
        icon: 'database',
      },
    ],
    faqs: [
      {
        q: 'What is three-tier architecture?',
        a: 'Three-tier architecture organizes an application into a presentation tier for the UI, an application tier for business logic, and a data tier for storage, each able to scale independently.',
      },
      {
        q: 'What are the three tiers in a web application?',
        a: 'The presentation tier is the frontend or browser, the application tier runs the server-side business logic, and the data tier is the database and storage layer.',
      },
      {
        q: 'Why use a three-tier architecture?',
        a: 'Separating tiers improves scalability, security and maintainability because each layer can be developed, deployed and scaled without tightly coupling to the others.',
      },
      {
        q: 'Where does the load balancer fit?',
        a: 'A load balancer sits in front of the application tier, distributing incoming requests across multiple app servers for higher availability and throughput.',
      },
    ],
    useCases: [
      'Web app documentation',
      'Deployment planning',
      'Computer science teaching',
      'Architecture reviews',
      'Cloud migration design',
    ],
    category: 'architecture',
    categoryName: 'System & Software Architecture',
  },
  {
    slug: 'kubernetes-cluster-architecture-diagram',
    title: 'Kubernetes Cluster Architecture Diagram',
    shortDescription:
      'Lay out the control plane, worker nodes, pods and core components in a K8s cluster',
    longDescription:
      'A Kubernetes cluster architecture diagram lays out the control plane and worker nodes that run containerized workloads. The control plane includes the API server, scheduler, controller manager and etcd, while each worker node runs a kubelet, kube-proxy and a container runtime that host the pods. This hierarchy shows how Kubernetes schedules, networks and keeps containers running at scale.\n\nDevOps engineers, platform teams and SREs use this diagram for onboarding, capacity planning and incident troubleshooting. It is the clearest way to explain which components live on the control plane versus the worker nodes, how the API server orchestrates everything, and where your pods actually execute inside the cluster.',
    tags: [
      'kubernetes',
      'k8s',
      'containers',
      'control plane',
      'devops',
      'orchestration',
      'architecture',
    ],
    keywords: [
      'kubernetes architecture diagram',
      'kubernetes cluster diagram',
      'k8s components diagram',
      'kubernetes control plane diagram',
      'how kubernetes works',
      'kubernetes node architecture',
    ],
    layout: 'tree',
    centerLabel: 'Kubernetes Cluster',
    centerIcon: 'cloud',
    satellites: [
      {
        label: 'API Server',
        icon: 'cloud',
      },
      {
        label: 'etcd',
        icon: 'database',
      },
      {
        label: 'Scheduler',
        icon: 'process',
      },
      {
        label: 'Controller Manager',
        icon: 'automation',
      },
      {
        label: 'Worker Node',
        icon: 'cloud',
      },
      {
        label: 'kubelet',
        icon: 'process',
      },
      {
        label: 'Pods',
        icon: 'layers',
      },
    ],
    treeChildren: [
      {
        label: 'Control Plane',
        icon: 'cloud',
        children: [
          {
            label: 'API Server',
            icon: 'cloud',
          },
          {
            label: 'etcd',
            icon: 'database',
          },
          {
            label: 'Scheduler',
            icon: 'process',
          },
          {
            label: 'Controller Manager',
            icon: 'automation',
          },
        ],
      },
      {
        label: 'Worker Node',
        icon: 'cloud',
        children: [
          {
            label: 'kubelet',
            icon: 'process',
          },
          {
            label: 'kube-proxy',
            icon: 'automation',
          },
          {
            label: 'Pods',
            icon: 'layers',
          },
        ],
      },
    ],
    faqs: [
      {
        q: 'What is Kubernetes cluster architecture?',
        a: 'It is the structure of a Kubernetes cluster, made up of a control plane that manages the cluster and worker nodes that run your containerized applications in pods.',
      },
      {
        q: 'What are the main components of Kubernetes?',
        a: 'The control plane has the API server, etcd, scheduler and controller manager, while each worker node runs a kubelet, kube-proxy and a container runtime hosting pods.',
      },
      {
        q: 'What is the role of the API server?',
        a: 'The API server is the front end of the control plane. Every command and component talks to it, and it validates and stores cluster state in etcd.',
      },
      {
        q: 'What is the difference between a node and a pod?',
        a: 'A node is a worker machine in the cluster, while a pod is the smallest deployable unit that runs one or more containers and is scheduled onto a node.',
      },
    ],
    useCases: [
      'DevOps onboarding',
      'Cluster capacity planning',
      'Incident troubleshooting',
      'Platform documentation',
      'Certification study (CKA)',
    ],
    category: 'architecture',
    categoryName: 'System & Software Architecture',
  },
  {
    slug: 'etl-pipeline-diagram',
    title: 'ETL Pipeline Diagram Template',
    shortDescription:
      'Visualize how raw data is extracted, transformed, and loaded into a data warehouse',
    longDescription:
      'An ETL pipeline diagram maps the journey of data from operational source systems through a transformation layer into an analytical store. The core stages are extraction from databases, APIs and files, a staging area where raw records land, transformation logic that cleans, joins and aggregates data, and the final load into a warehouse. An orchestrator schedules and monitors every run.\n\nData engineers and analytics teams reach for this diagram during architecture reviews, onboarding and incident debugging. When you are documenting a batch integration job or explaining how records move from source to warehouse, it makes dependencies and failure points immediately clear to both technical and business stakeholders.',
    tags: [
      'etl',
      'data pipeline',
      'data engineering',
      'data integration',
      'warehouse',
      'batch processing',
    ],
    keywords: [
      'etl pipeline diagram',
      'etl process flow',
      'data pipeline architecture',
      'extract transform load diagram',
      'etl workflow template',
      'data integration diagram',
    ],
    layout: 'hub',
    centerLabel: 'ETL Orchestrator',
    centerIcon: 'automation',
    satellites: [
      {
        label: 'Source Databases',
        icon: 'database',
      },
      {
        label: 'API Extractors',
        icon: 'cloud',
      },
      {
        label: 'Staging Area',
        icon: 'drive',
      },
      {
        label: 'Transform Engine',
        icon: 'process',
      },
      {
        label: 'Data Quality Checks',
        icon: 'search',
      },
      {
        label: 'Data Warehouse',
        icon: 'database',
      },
      {
        label: 'Airflow Scheduler',
        icon: 'automation',
      },
    ],
    faqs: [
      {
        q: 'What is an ETL pipeline?',
        a: 'An ETL pipeline is a sequence of steps that extracts data from source systems, transforms it into a clean, consistent shape, and loads it into a target store such as a data warehouse for analytics.',
      },
      {
        q: 'What are the main components of an ETL pipeline?',
        a: 'The key components are data sources, an extraction layer, a staging area, a transformation engine with data quality checks, a load step into the warehouse, and an orchestrator like Airflow that schedules and monitors runs.',
      },
      {
        q: 'How is ETL different from ELT?',
        a: 'In ETL, data is transformed before loading into the warehouse. In ELT, raw data is loaded first and transformed inside the warehouse using its compute, which suits cloud platforms like Snowflake or BigQuery.',
      },
      {
        q: 'How do you handle failures in an ETL pipeline?',
        a: 'Orchestrators retry failed tasks, alert on errors, and support idempotent loads so a re-run does not duplicate data. Staging areas let you reprocess a batch without re-extracting from the source.',
      },
    ],
    useCases: [
      'Data engineering onboarding docs',
      'Architecture review decks',
      'Pipeline incident runbooks',
      'Vendor and tooling evaluations',
      'Data platform design proposals',
    ],
    category: 'data',
    categoryName: 'Data & Analytics',
  },
  {
    slug: 'data-warehouse-architecture-diagram',
    title: 'Data Warehouse Architecture Diagram',
    shortDescription:
      'Show how sources, staging, storage layers and BI tools fit a modern warehouse',
    longDescription:
      'A data warehouse architecture diagram shows the layered design of a central analytical repository. It includes source systems feeding an ingestion layer, a staging zone, core warehouse storage organized into fact and dimension tables, a semantic or metrics layer, and downstream BI and reporting tools. A query engine and metadata service sit at the center, coordinating storage and access.\n\nData architects, analytics engineers and platform teams use this diagram when designing or modernizing a warehouse on Snowflake, BigQuery or Redshift. It is ideal for explaining the architecture to stakeholders, planning a star schema, or showing how raw inputs become governed, query-ready tables for business intelligence.',
    tags: [
      'data warehouse',
      'snowflake',
      'bigquery',
      'redshift',
      'star schema',
      'analytics',
      'olap',
    ],
    keywords: [
      'data warehouse architecture',
      'data warehouse diagram',
      'warehouse architecture template',
      'snowflake architecture diagram',
      'olap data warehouse',
      'star schema diagram',
    ],
    layout: 'hub',
    centerLabel: 'Data Warehouse',
    centerIcon: 'database',
    satellites: [
      {
        label: 'Source Systems',
        icon: 'cloud',
      },
      {
        label: 'Ingestion Layer',
        icon: 'automation',
      },
      {
        label: 'Staging Schema',
        icon: 'drive',
      },
      {
        label: 'Fact & Dimension Tables',
        icon: 'database',
      },
      {
        label: 'Semantic Layer',
        icon: 'layers',
      },
      {
        label: 'Query Engine',
        icon: 'process',
      },
      {
        label: 'BI & Reporting Tools',
        icon: 'search',
      },
    ],
    faqs: [
      {
        q: 'What is a data warehouse architecture?',
        a: 'It is the layered design of a centralized analytical database, covering how data is ingested, staged, stored in fact and dimension tables, modeled in a semantic layer, and served to BI tools.',
      },
      {
        q: 'What are the components of a data warehouse?',
        a: 'Core components include source systems, an ingestion and staging layer, the warehouse storage with a star or snowflake schema, a semantic/metrics layer, a query engine, and BI and reporting tools.',
      },
      {
        q: 'What is the difference between a data warehouse and a data lake?',
        a: 'A data warehouse stores structured, modeled data optimized for SQL analytics, while a data lake stores raw data of any format. Many teams combine both in a lakehouse architecture.',
      },
      {
        q: 'What is a star schema?',
        a: 'A star schema organizes data into a central fact table containing measurements, surrounded by dimension tables that describe the context, making analytical queries fast and intuitive.',
      },
    ],
    useCases: [
      'Data platform design proposals',
      'Analytics engineering docs',
      'Cloud migration planning',
      'Stakeholder architecture reviews',
      'Schema modeling discussions',
    ],
    category: 'data',
    categoryName: 'Data & Analytics',
  },
  {
    slug: 'streaming-data-pipeline-diagram',
    title: 'Streaming Data Pipeline Diagram',
    shortDescription:
      'Map real-time event flow from producers through a broker to stream processors and sinks',
    longDescription:
      'A streaming data pipeline diagram illustrates how events move in real time from producers into a message broker, through stream processing, and out to sinks. Key parts include event producers, a broker such as Kafka, stream processing engines like Flink, a schema registry that enforces data contracts, and downstream sinks including warehouses, search indexes and dashboards.\n\nReal-time data engineers and platform architects use this diagram when designing event-driven systems, fraud detection or live analytics. It is the go-to reference for explaining a streaming pipeline, planning a Kafka architecture, or showing how low-latency events are processed and delivered compared with a scheduled batch ETL job.',
    tags: [
      'streaming',
      'kafka',
      'real-time',
      'event-driven',
      'flink',
      'data pipeline',
      'stream processing',
    ],
    keywords: [
      'streaming data pipeline',
      'real-time data pipeline diagram',
      'kafka architecture diagram',
      'stream processing diagram',
      'event streaming architecture',
      'real time analytics pipeline',
    ],
    layout: 'hub',
    centerLabel: 'Kafka Broker',
    centerIcon: 'process',
    satellites: [
      {
        label: 'Event Producers',
        icon: 'cloud',
      },
      {
        label: 'Schema Registry',
        icon: 'layers',
      },
      {
        label: 'Flink Stream Processor',
        icon: 'process',
      },
      {
        label: 'Stream Consumers',
        icon: 'automation',
      },
      {
        label: 'Real-Time Dashboard',
        icon: 'search',
      },
      {
        label: 'Warehouse Sink',
        icon: 'database',
      },
      {
        label: 'Search Index Sink',
        icon: 'search',
      },
    ],
    faqs: [
      {
        q: 'What is a streaming data pipeline?',
        a: 'It is an architecture that ingests and processes data continuously as events occur, rather than in scheduled batches, enabling real-time analytics, alerting and event-driven applications.',
      },
      {
        q: 'What are the components of a streaming pipeline?',
        a: 'The main components are event producers, a message broker like Kafka, a schema registry, stream processors such as Flink or Kafka Streams, and sinks like warehouses, dashboards or search indexes.',
      },
      {
        q: 'How is streaming different from batch ETL?',
        a: 'Batch ETL processes large chunks of data on a schedule, while streaming processes individual events with low latency as they arrive, supporting use cases like fraud detection and live metrics.',
      },
      {
        q: 'Why use a schema registry?',
        a: 'A schema registry enforces data contracts between producers and consumers, validating event structure and managing schema evolution so changes do not break downstream processors.',
      },
    ],
    useCases: [
      'Event-driven architecture design',
      'Real-time analytics planning',
      'Fraud detection system docs',
      'Kafka platform onboarding',
      'Latency and throughput reviews',
    ],
    category: 'data',
    categoryName: 'Data & Analytics',
  },
  {
    slug: 'data-lake-architecture-diagram',
    title: 'Data Lake Architecture Diagram',
    shortDescription:
      'Show raw, refined and curated zones of a data lake feeding analytics and ML',
    longDescription:
      'A data lake architecture diagram shows how raw data of any format is ingested into low-cost object storage and progressively refined. The central object store is surrounded by ingestion connectors, zoned layers for raw, refined and curated data, a catalog for metadata and discovery, a processing engine like Spark, and consumers including analytics, machine learning and lakehouse query engines.\n\nData engineers and ML platform teams use this diagram when designing scalable storage for structured and unstructured data on S3, ADLS or GCS. It clearly communicates a data lake or lakehouse design, the medallion zone strategy, and how raw inputs become governed datasets for analytics and model training.',
    tags: [
      'data lake',
      'lakehouse',
      'object storage',
      's3',
      'spark',
      'medallion',
      'big data',
    ],
    keywords: [
      'data lake architecture',
      'data lake diagram',
      'lakehouse architecture diagram',
      'medallion architecture',
      's3 data lake diagram',
      'data lake zones',
    ],
    layout: 'hub',
    centerLabel: 'Object Storage Lake',
    centerIcon: 'drive',
    satellites: [
      {
        label: 'Ingestion Connectors',
        icon: 'automation',
      },
      {
        label: 'Raw Zone',
        icon: 'drive',
      },
      {
        label: 'Refined Zone',
        icon: 'layers',
      },
      {
        label: 'Curated Zone',
        icon: 'database',
      },
      {
        label: 'Data Catalog',
        icon: 'search',
      },
      {
        label: 'Spark Processing',
        icon: 'process',
      },
      {
        label: 'ML & Analytics Consumers',
        icon: 'bot',
      },
    ],
    faqs: [
      {
        q: 'What is a data lake?',
        a: 'A data lake is a centralized repository, usually on cloud object storage, that stores raw structured, semi-structured and unstructured data at scale until it is needed for analytics or machine learning.',
      },
      {
        q: 'What are the zones in a data lake?',
        a: 'A common medallion design uses a raw (bronze) zone for unprocessed data, a refined (silver) zone for cleaned data, and a curated (gold) zone for business-ready datasets.',
      },
      {
        q: 'What is the difference between a data lake and a lakehouse?',
        a: 'A lakehouse adds warehouse-like features such as ACID transactions, schema enforcement and SQL performance on top of data lake storage using formats like Delta Lake or Iceberg.',
      },
      {
        q: 'Why do you need a data catalog?',
        a: 'A catalog stores metadata and lineage so users can discover, understand and trust datasets, preventing the lake from becoming an unusable data swamp.',
      },
    ],
    useCases: [
      'Big data platform design',
      'ML data infrastructure docs',
      'Cloud storage cost planning',
      'Medallion architecture proposals',
      'Data governance onboarding',
    ],
    category: 'data',
    categoryName: 'Data & Analytics',
  },
  {
    slug: 'data-mesh-architecture-diagram',
    title: 'Data Mesh Architecture Diagram',
    shortDescription:
      'Show domain-owned data products connected by a self-serve platform and governance',
    longDescription:
      'A data mesh architecture diagram represents a decentralized approach where business domains own and serve their data as products. At the center sits a self-serve data platform, surrounded by domain-owned data products, a federated governance layer, a discovery and catalog service, data contracts between domains, and observability tooling that monitors quality across the mesh.\n\nData leaders, platform teams and domain owners use this diagram when scaling analytics beyond a single central team. It is the clearest way to explain the four data mesh principles, show how domain ownership and a self-serve platform fit together, and contrast a federated mesh with a centralized warehouse or lake.',
    tags: [
      'data mesh',
      'data products',
      'domain ownership',
      'federated governance',
      'self-serve platform',
      'decentralized data',
    ],
    keywords: [
      'data mesh architecture',
      'data mesh diagram',
      'data mesh principles',
      'domain oriented data',
      'data product architecture',
      'federated data governance',
    ],
    layout: 'hub',
    centerLabel: 'Self-Serve Data Platform',
    centerIcon: 'cloud',
    satellites: [
      {
        label: 'Marketing Data Product',
        icon: 'database',
      },
      {
        label: 'Sales Data Product',
        icon: 'database',
      },
      {
        label: 'Finance Data Product',
        icon: 'database',
      },
      {
        label: 'Federated Governance',
        icon: 'layers',
      },
      {
        label: 'Data Catalog & Discovery',
        icon: 'search',
      },
      {
        label: 'Data Contracts',
        icon: 'process',
      },
      {
        label: 'Observability & Quality',
        icon: 'search',
      },
    ],
    faqs: [
      {
        q: 'What is a data mesh?',
        a: 'A data mesh is a decentralized data architecture where individual business domains own, build and serve their data as products, supported by a shared self-serve platform and federated governance.',
      },
      {
        q: 'What are the four principles of data mesh?',
        a: 'The principles are domain-oriented ownership, data as a product, a self-serve data platform, and federated computational governance applied consistently across domains.',
      },
      {
        q: 'How is data mesh different from a data warehouse?',
        a: 'A warehouse centralizes data and ownership in one team, while a data mesh distributes ownership to domains that publish interoperable data products, reducing central bottlenecks.',
      },
      {
        q: 'What is a data product in a mesh?',
        a: 'A data product is a discoverable, trustworthy, well-documented dataset owned by a domain team, complete with clear contracts, quality metrics and access controls.',
      },
    ],
    useCases: [
      'Data strategy presentations',
      'Org scaling proposals',
      'Domain team onboarding',
      'Governance model reviews',
      'Executive data roadmaps',
    ],
    category: 'data',
    categoryName: 'Data & Analytics',
  },
  {
    slug: 'bi-dashboard-architecture-diagram',
    title: 'BI Dashboard Architecture Diagram',
    shortDescription:
      'Map how warehouse data, a semantic layer and caching power business dashboards',
    longDescription:
      'A BI dashboard architecture diagram shows how analytical data becomes interactive business reports. The BI server sits at the center, connected to a data warehouse, a semantic or metrics layer that defines KPIs, a caching and query acceleration tier, the dashboard front end, scheduled report delivery, and access controls that enforce row-level security.\n\nBI developers, analytics engineers and data teams use this diagram when implementing tools like Tableau, Power BI or Looker. It is ideal for explaining how dashboards connect to the warehouse, where metrics are defined, and how caching and permissions keep reports fast, governed and consistent across the organization.',
    tags: [
      'business intelligence',
      'bi dashboard',
      'tableau',
      'power bi',
      'looker',
      'semantic layer',
      'reporting',
    ],
    keywords: [
      'bi dashboard architecture',
      'business intelligence architecture diagram',
      'bi tool architecture',
      'tableau architecture diagram',
      'looker semantic layer',
      'reporting architecture template',
    ],
    layout: 'hub',
    centerLabel: 'BI Server',
    centerIcon: 'search',
    satellites: [
      {
        label: 'Data Warehouse',
        icon: 'database',
      },
      {
        label: 'Semantic / Metrics Layer',
        icon: 'layers',
      },
      {
        label: 'Query Cache',
        icon: 'process',
      },
      {
        label: 'Dashboard Frontend',
        icon: 'web',
      },
      {
        label: 'Scheduled Reports',
        icon: 'mail',
      },
      {
        label: 'Row-Level Security',
        icon: 'cloud',
      },
      {
        label: 'Self-Serve Explore',
        icon: 'search',
      },
    ],
    faqs: [
      {
        q: 'What is a BI dashboard architecture?',
        a: 'It is the design of how data flows from a warehouse through a semantic layer and BI server into interactive dashboards, including caching, scheduling and access controls that keep reports fast and governed.',
      },
      {
        q: 'What are the components of a BI system?',
        a: 'Key components include the data warehouse, a semantic or metrics layer, the BI server, a query cache, the dashboard front end, report scheduling, and security controls like row-level permissions.',
      },
      {
        q: 'What is a semantic layer in BI?',
        a: 'A semantic layer centrally defines metrics, dimensions and business logic so every dashboard uses consistent KPI definitions, avoiding conflicting numbers across reports.',
      },
      {
        q: 'How do BI tools keep dashboards fast?',
        a: 'They use query caching, aggregate tables and extracts to avoid hitting the warehouse on every load, returning frequently requested results quickly.',
      },
    ],
    useCases: [
      'BI tool rollout planning',
      'Analytics team onboarding',
      'Dashboard governance reviews',
      'Metrics layer design docs',
      'Stakeholder reporting demos',
    ],
    category: 'data',
    categoryName: 'Data & Analytics',
  },
  {
    slug: 'data-governance-framework-diagram',
    title: 'Data Governance Framework Diagram',
    shortDescription:
      'Map governance roles, policies and controls from council down to data assets',
    longDescription:
      'A data governance framework diagram lays out the hierarchy that keeps organizational data trustworthy and compliant. At the top sits a governance council, branching into policies and standards, roles such as data owners and stewards, and control domains covering data quality, security and privacy, metadata and lineage. Each branch breaks down into concrete responsibilities and controls applied to data assets.\n\nChief data officers, governance leads and compliance teams use this diagram to formalize accountability and meet regulations like GDPR. It is the clearest way to present a governance operating model, show how stewardship roles and policies cascade, and map which controls protect sensitive data across the organization.',
    tags: [
      'data governance',
      'data stewardship',
      'compliance',
      'data quality',
      'metadata',
      'gdpr',
      'data policy',
    ],
    keywords: [
      'data governance framework',
      'data governance diagram',
      'data stewardship roles',
      'data governance operating model',
      'data governance structure',
      'governance roles and responsibilities',
    ],
    layout: 'tree',
    centerLabel: 'Data Governance Council',
    centerIcon: 'layers',
    satellites: [
      {
        label: 'Policies & Standards',
        icon: 'process',
      },
      {
        label: 'Data Owners',
        icon: 'cloud',
      },
      {
        label: 'Data Stewards',
        icon: 'search',
      },
      {
        label: 'Data Quality',
        icon: 'search',
      },
      {
        label: 'Security & Privacy',
        icon: 'cloud',
      },
      {
        label: 'Metadata & Lineage',
        icon: 'database',
      },
      {
        label: 'Compliance & Audit',
        icon: 'process',
      },
    ],
    treeChildren: [
      {
        label: 'Policies & Standards',
        icon: 'process',
        children: [
          {
            label: 'Data Classification',
            icon: 'layers',
          },
          {
            label: 'Retention Rules',
            icon: 'drive',
          },
        ],
      },
      {
        label: 'Roles & Accountability',
        icon: 'cloud',
        children: [
          {
            label: 'Data Owners',
            icon: 'cloud',
          },
          {
            label: 'Data Stewards',
            icon: 'search',
          },
        ],
      },
      {
        label: 'Control Domains',
        icon: 'process',
        children: [
          {
            label: 'Data Quality',
            icon: 'search',
          },
          {
            label: 'Security & Privacy',
            icon: 'cloud',
          },
          {
            label: 'Metadata & Lineage',
            icon: 'database',
          },
          {
            label: 'Compliance & Audit',
            icon: 'process',
          },
        ],
      },
    ],
    faqs: [
      {
        q: 'What is a data governance framework?',
        a: 'It is a structured set of policies, roles and controls that defines how an organization manages the availability, quality, security and compliance of its data assets.',
      },
      {
        q: 'What are the key roles in data governance?',
        a: 'Typical roles include a governance council that sets direction, data owners accountable for domains, and data stewards who manage day-to-day quality, definitions and access for specific datasets.',
      },
      {
        q: 'What are the components of data governance?',
        a: 'Core components are policies and standards, clear roles and accountability, and control domains covering data quality, security and privacy, metadata and lineage, and compliance and audit.',
      },
      {
        q: 'Why is data governance important?',
        a: 'It ensures data is accurate, secure and compliant with regulations like GDPR, building trust in analytics and reducing risk from misuse or breaches.',
      },
    ],
    useCases: [
      'Governance program kickoff',
      'Compliance and audit reviews',
      'Stewardship role definition',
      'Executive data strategy decks',
      'GDPR readiness documentation',
    ],
    category: 'data',
    categoryName: 'Data & Analytics',
  },
  {
    slug: 'rag-architecture-diagram',
    title: 'RAG Architecture Diagram',
    shortDescription:
      'Map how retrieval-augmented generation grounds an LLM in your data with a vector database',
    longDescription:
      'A RAG architecture diagram shows how a retrieval-augmented generation system grounds an LLM in your own data. It traces the flow from a user query through an embedding model, a similarity search against a vector database, retrieval of relevant document chunks, and prompt assembly that feeds context plus the question into the LLM to produce a cited answer.\n\nML engineers, AI application developers, and solutions architects reach for this RAG diagram when designing chatbots over private knowledge bases, internal documentation assistants, or support copilots. It is a go-to reference for explaining retrieval-augmented generation in design docs, technical reviews, and stakeholder presentations.',
    tags: [
      'rag',
      'llm',
      'vector database',
      'embeddings',
      'retrieval',
      'ai architecture',
      'generative ai',
    ],
    keywords: [
      'rag architecture diagram',
      'retrieval augmented generation diagram',
      'rag pipeline diagram',
      'llm rag architecture',
      'vector database rag diagram',
      'how rag works diagram',
    ],
    layout: 'hub',
    centerLabel: 'RAG Pipeline',
    centerIcon: 'bot',
    satellites: [
      {
        label: 'User Query',
        icon: 'chat',
      },
      {
        label: 'Embedding Model',
        icon: 'process',
      },
      {
        label: 'Vector Database',
        icon: 'database',
      },
      {
        label: 'Document Chunks',
        icon: 'drive',
      },
      {
        label: 'Retriever',
        icon: 'search',
      },
      {
        label: 'Prompt Assembly',
        icon: 'layers',
      },
      {
        label: 'LLM',
        icon: 'bot',
      },
    ],
    faqs: [
      {
        q: 'What is a RAG architecture diagram?',
        a: 'It is a visual map of a retrieval-augmented generation system, showing how a user query is embedded, matched against a vector database, and combined with retrieved context before being sent to an LLM for a grounded answer.',
      },
      {
        q: 'What are the components of a RAG pipeline?',
        a: 'The core components are an embedding model, a vector database, a retriever, the original document chunks, a prompt assembly step, and the LLM that generates the final response.',
      },
      {
        q: 'How does RAG reduce hallucinations?',
        a: 'By retrieving relevant source passages and injecting them into the prompt, RAG grounds the LLM in factual context instead of relying solely on its training data, which lowers hallucination and enables citations.',
      },
      {
        q: 'What is the difference between RAG and fine-tuning?',
        a: 'RAG retrieves external knowledge at query time without changing model weights, while fine-tuning bakes new knowledge into the model. RAG is easier to update and cite, fine-tuning is better for style and behavior.',
      },
    ],
    useCases: [
      'AI engineering design docs',
      'Technical architecture reviews',
      'Knowledge base chatbot planning',
      'Stakeholder presentations',
      'Onboarding new ML engineers',
    ],
    category: 'ai-ml',
    categoryName: 'AI & Machine Learning',
  },
  {
    slug: 'ai-agent-architecture-diagram',
    title: 'AI Agent Architecture Diagram',
    shortDescription:
      'Visualize the reasoning loop, tools, and memory that let an AI agent plan and act',
    longDescription:
      'An AI agent architecture diagram illustrates how an autonomous agent perceives a goal, reasons, and acts. It centers on an LLM-powered reasoning core that orchestrates a plan-act-observe loop, calling external tools and APIs, reading and writing memory, and iterating until the task is complete.\n\nDevelopers building agentic applications, automation engineers, and AI product teams use this agent diagram to design assistants that book meetings, run code, or query systems autonomously. It clarifies how planning, tool use, and short- and long-term memory fit together when explaining AI agent architecture to teammates or investors.',
    tags: [
      'ai agent',
      'agentic',
      'llm',
      'tool use',
      'autonomous agent',
      'orchestration',
      'planning',
    ],
    keywords: [
      'ai agent architecture',
      'ai agent architecture diagram',
      'autonomous agent diagram',
      'llm agent diagram',
      'agentic ai architecture',
      'ai agent workflow diagram',
    ],
    layout: 'hub',
    centerLabel: 'Agent Core',
    centerIcon: 'bot',
    satellites: [
      {
        label: 'Planner / Reasoning',
        icon: 'process',
      },
      {
        label: 'Tool Calling',
        icon: 'automation',
      },
      {
        label: 'Short-Term Memory',
        icon: 'layers',
      },
      {
        label: 'Long-Term Memory',
        icon: 'database',
      },
      {
        label: 'External APIs',
        icon: 'cloud',
      },
      {
        label: 'Action Executor',
        icon: 'process',
      },
      {
        label: 'User Goal',
        icon: 'chat',
      },
    ],
    faqs: [
      {
        q: 'What is AI agent architecture?',
        a: 'It is the design that lets an LLM act autonomously by combining a reasoning core, planning, tool calling, and memory in a loop that observes results and decides the next action toward a goal.',
      },
      {
        q: 'What are the components of an AI agent?',
        a: 'Key components are a reasoning or planning core, a set of callable tools and APIs, short-term working memory, long-term persistent memory, and an executor that performs actions and feeds results back.',
      },
      {
        q: 'How does an AI agent use tools?',
        a: "The agent's reasoning core decides which tool to invoke, formats a structured call, executes it against an API or function, then incorporates the returned result into its next reasoning step.",
      },
      {
        q: 'What is the difference between an AI agent and a chatbot?',
        a: 'A chatbot responds turn by turn, while an AI agent plans multi-step tasks, calls tools, and loops autonomously until a goal is achieved with minimal human input.',
      },
      {
        q: 'How do you draw an AI agent architecture diagram?',
        a: 'Put the reasoning core (the LLM) in the center, then connect it to planning, tool calling, short-term and long-term memory, and the executor, with a feedback loop from results back into reasoning. This template gives you that structure ready-made — rename the nodes to match your agent and export.',
      },
      {
        q: 'What should an agentic AI architecture diagram include?',
        a: 'At minimum: the model, the planner or control loop, the tools and APIs the agent can call, memory stores, guardrails or evaluators, and the environment it acts on. Add data flows between them so reviewers can trace one full observe–plan–act cycle.',
      },
    ],
    useCases: [
      'Agentic app design',
      'Automation workflow planning',
      'AI product roadmaps',
      'Investor pitch decks',
      'Engineering onboarding docs',
    ],
    category: 'ai-ml',
    categoryName: 'AI & Machine Learning',
  },
  {
    slug: 'ml-training-pipeline-diagram',
    title: 'ML Training Pipeline Diagram',
    shortDescription:
      'Chart every stage from raw data to a trained, validated machine learning model',
    longDescription:
      'An ML training pipeline diagram lays out the end-to-end stages of turning raw data into a trained model. It follows data ingestion, preprocessing and feature engineering, dataset splitting, model training, hyperparameter tuning, and evaluation, with a model registry capturing the validated artifact ready for deployment.\n\nData scientists and ML engineers use this training pipeline diagram to standardize experiments, document reproducible workflows, and align teams on each stage. It is useful when planning an ML training pipeline, reviewing experiment tracking, or onboarding new contributors to a modeling project.',
    tags: [
      'machine learning',
      'ml pipeline',
      'model training',
      'feature engineering',
      'data science',
      'model evaluation',
      'mlops',
    ],
    keywords: [
      'ml training pipeline',
      'ml training pipeline diagram',
      'machine learning pipeline diagram',
      'model training workflow diagram',
      'data to model pipeline',
      'ml model lifecycle diagram',
    ],
    layout: 'hub',
    centerLabel: 'Training Pipeline',
    centerIcon: 'automation',
    satellites: [
      {
        label: 'Data Ingestion',
        icon: 'database',
      },
      {
        label: 'Preprocessing',
        icon: 'process',
      },
      {
        label: 'Feature Engineering',
        icon: 'layers',
      },
      {
        label: 'Train/Test Split',
        icon: 'process',
      },
      {
        label: 'Model Training',
        icon: 'bot',
      },
      {
        label: 'Hyperparameter Tuning',
        icon: 'search',
      },
      {
        label: 'Model Registry',
        icon: 'drive',
      },
    ],
    faqs: [
      {
        q: 'What is an ML training pipeline?',
        a: 'It is the sequence of automated stages that transforms raw data into a trained, evaluated machine learning model, covering ingestion, preprocessing, feature engineering, training, tuning, and validation.',
      },
      {
        q: 'What are the stages of a machine learning pipeline?',
        a: 'Typical stages are data ingestion, preprocessing, feature engineering, dataset splitting, model training, hyperparameter tuning, evaluation, and registration of the final model artifact.',
      },
      {
        q: 'Why use a training pipeline instead of ad hoc scripts?',
        a: 'A pipeline makes experiments reproducible, automates repetitive steps, tracks data and parameters, and makes it easy to retrain models reliably as new data arrives.',
      },
      {
        q: 'How is a training pipeline different from an MLOps pipeline?',
        a: 'A training pipeline focuses on producing a model from data, while an MLOps pipeline adds deployment, monitoring, and automated retraining around that trained model in production.',
      },
    ],
    useCases: [
      'Data science workflow docs',
      'Experiment standardization',
      'ML project planning',
      'Team onboarding',
      'Reproducibility reviews',
    ],
    category: 'ai-ml',
    categoryName: 'AI & Machine Learning',
  },
  {
    slug: 'llm-application-architecture-diagram',
    title: 'LLM Application Architecture Diagram',
    shortDescription:
      'See how a production LLM app wires frontend, orchestration, model APIs, and guardrails',
    longDescription:
      'An LLM application architecture diagram shows how a production app built on large language models fits together. It connects a frontend client to an API gateway, an orchestration layer that manages prompts and context, the model provider API, caching, and safety guardrails, plus logging and analytics for observability.\n\nFull-stack and AI engineers use this LLM architecture diagram when designing chat products, copilots, and AI features that must be reliable and cost-aware. It is ideal for documenting how prompt management, model routing, and guardrails integrate when explaining LLM application architecture in technical reviews.',
    tags: [
      'llm',
      'ai application',
      'prompt orchestration',
      'model api',
      'guardrails',
      'ai architecture',
      'production ai',
    ],
    keywords: [
      'llm application architecture',
      'llm app architecture diagram',
      'llm architecture diagram',
      'production llm system design',
      'generative ai app architecture',
      'llm stack diagram',
    ],
    layout: 'hub',
    centerLabel: 'Orchestration Layer',
    centerIcon: 'process',
    satellites: [
      {
        label: 'Frontend Client',
        icon: 'web',
      },
      {
        label: 'API Gateway',
        icon: 'cloud',
      },
      {
        label: 'Prompt Management',
        icon: 'layers',
      },
      {
        label: 'LLM Provider API',
        icon: 'bot',
      },
      {
        label: 'Semantic Cache',
        icon: 'database',
      },
      {
        label: 'Safety Guardrails',
        icon: 'process',
      },
      {
        label: 'Logging & Analytics',
        icon: 'search',
      },
    ],
    faqs: [
      {
        q: 'What is LLM application architecture?',
        a: 'It is the system design behind a product built on large language models, covering the frontend, API gateway, prompt orchestration, model provider, caching, guardrails, and observability.',
      },
      {
        q: 'What are the components of an LLM app?',
        a: 'Common components include a frontend client, an API gateway, a prompt and context orchestration layer, the LLM provider API, a semantic cache, safety guardrails, and logging or analytics.',
      },
      {
        q: 'Why do LLM apps need guardrails?',
        a: 'Guardrails validate inputs and outputs to block unsafe, off-topic, or sensitive content, enforce formatting, and reduce prompt injection risk before responses reach users.',
      },
      {
        q: 'How does caching help an LLM application?',
        a: 'A semantic cache returns stored answers for similar queries, cutting latency and model API costs while improving consistency for frequently asked questions.',
      },
    ],
    useCases: [
      'AI product architecture docs',
      'Technical design reviews',
      'Cost and latency planning',
      'Copilot feature design',
      'Engineering onboarding',
    ],
    category: 'ai-ml',
    categoryName: 'AI & Machine Learning',
  },
  {
    slug: 'recommendation-system-diagram',
    title: 'Recommendation System Architecture Diagram',
    shortDescription:
      'Show how candidate generation, ranking, and filtering produce personalized recommendations',
    longDescription:
      'A recommendation system diagram visualizes how personalized suggestions are generated at scale. It centers on a recommendation engine that pulls user and item features from a feature store, runs candidate generation, applies a ranking model, and filters results with business rules before serving the final ranked list to the user.\n\nML engineers and data scientists use this recommendation system diagram to design product, content, or media recommenders and to explain the difference between candidate generation and ranking. It is helpful for system design interviews, architecture docs, and aligning teams on a personalization stack.',
    tags: [
      'recommendation system',
      'personalization',
      'ranking',
      'collaborative filtering',
      'feature store',
      'machine learning',
      'recommender',
    ],
    keywords: [
      'recommendation system diagram',
      'recommender system architecture',
      'recommendation engine diagram',
      'candidate generation ranking diagram',
      'personalization system design',
      'recsys architecture diagram',
    ],
    layout: 'hub',
    centerLabel: 'Recommendation Engine',
    centerIcon: 'bot',
    satellites: [
      {
        label: 'User Profile',
        icon: 'web',
      },
      {
        label: 'Feature Store',
        icon: 'database',
      },
      {
        label: 'Candidate Generation',
        icon: 'search',
      },
      {
        label: 'Ranking Model',
        icon: 'process',
      },
      {
        label: 'Business Rules Filter',
        icon: 'layers',
      },
      {
        label: 'Item Catalog',
        icon: 'drive',
      },
      {
        label: 'Served Recommendations',
        icon: 'social',
      },
    ],
    faqs: [
      {
        q: 'What is a recommendation system?',
        a: 'It is a machine learning system that predicts which items a user is most likely to engage with, then generates and ranks personalized suggestions from a large catalog.',
      },
      {
        q: 'What are the stages of a recommender system?',
        a: 'Typical stages are candidate generation to narrow millions of items to a shortlist, a ranking model to score them precisely, and filtering with business rules before serving the final list.',
      },
      {
        q: 'What is the difference between candidate generation and ranking?',
        a: 'Candidate generation cheaply retrieves a few hundred relevant items from the full catalog, while the ranking model applies a heavier scoring function to order that shortlist precisely.',
      },
      {
        q: 'What is a feature store in recommendations?',
        a: 'A feature store centralizes user and item features so they are computed consistently and served with low latency to both training and real-time inference.',
      },
    ],
    useCases: [
      'Recsys system design interviews',
      'Personalization architecture docs',
      'Product recommendation planning',
      'ML team alignment',
      'Engineering onboarding',
    ],
    category: 'ai-ml',
    categoryName: 'AI & Machine Learning',
  },
  {
    slug: 'mlops-pipeline-diagram',
    title: 'MLOps Pipeline Diagram',
    shortDescription:
      'Trace the flow from training and CI/CD to deployment, monitoring, and retraining',
    longDescription:
      'An MLOps pipeline diagram shows how machine learning models move from development into reliable production operation. It centers on an automation orchestrator linking data and model versioning, CI/CD, a model registry, deployment to a serving layer, production monitoring, and a feedback loop that triggers automated retraining when drift is detected.\n\nML engineers, platform teams, and DevOps practitioners use this MLOps diagram to standardize model delivery, govern releases, and keep models accurate over time. It is a strong reference for designing an MLOps pipeline, planning CI/CD for ML, or explaining continuous training to stakeholders.',
    tags: [
      'mlops',
      'model deployment',
      'ci/cd',
      'model monitoring',
      'continuous training',
      'model registry',
      'automation',
    ],
    keywords: [
      'mlops pipeline',
      'mlops pipeline diagram',
      'mlops architecture diagram',
      'ml model deployment diagram',
      'continuous training pipeline',
      'ci cd for machine learning diagram',
    ],
    layout: 'hub',
    centerLabel: 'MLOps Orchestrator',
    centerIcon: 'automation',
    satellites: [
      {
        label: 'Data & Model Versioning',
        icon: 'database',
      },
      {
        label: 'CI/CD Pipeline',
        icon: 'automation',
      },
      {
        label: 'Model Registry',
        icon: 'drive',
      },
      {
        label: 'Model Serving',
        icon: 'cloud',
      },
      {
        label: 'Monitoring & Drift',
        icon: 'search',
      },
      {
        label: 'Feedback Loop',
        icon: 'process',
      },
      {
        label: 'Automated Retraining',
        icon: 'bot',
      },
    ],
    faqs: [
      {
        q: 'What is an MLOps pipeline?',
        a: 'It is an automated workflow that takes machine learning models from training through CI/CD, deployment, and monitoring, with a feedback loop that retrains models as data changes.',
      },
      {
        q: 'What are the components of MLOps?',
        a: 'Core components include data and model versioning, CI/CD automation, a model registry, a serving layer, production monitoring with drift detection, and an automated retraining loop.',
      },
      {
        q: 'How is MLOps different from a training pipeline?',
        a: 'A training pipeline produces a model from data, while MLOps wraps deployment, monitoring, governance, and continuous retraining around that model to keep it reliable in production.',
      },
      {
        q: 'What is model drift monitoring?',
        a: 'It tracks how production data and predictions diverge from training conditions, alerting teams or triggering retraining when accuracy degrades due to changing data.',
      },
    ],
    useCases: [
      'MLOps platform design',
      'CI/CD for ML planning',
      'Model governance reviews',
      'Continuous training docs',
      'Engineering onboarding',
    ],
    category: 'ai-ml',
    categoryName: 'AI & Machine Learning',
  },
  {
    slug: 'neural-network-architecture-diagram',
    title: 'Neural Network Architecture Diagram',
    shortDescription:
      'Break down a feedforward neural network from input through hidden layers to output',
    longDescription:
      "A neural network architecture diagram maps how a feedforward network transforms inputs into predictions layer by layer. It traces the input layer through one or more hidden layers with activation functions, into the output layer, while the loss function and backpropagation drive optimizer-based weight updates during training.\n\nStudents, ML practitioners, and educators use this neural network diagram to teach deep learning fundamentals, document a model's structure, or explain how forward passes and backpropagation work. It is ideal for course materials, research papers, and design notes that need a clear neural network architecture overview.",
    tags: [
      'neural network',
      'deep learning',
      'hidden layers',
      'backpropagation',
      'activation function',
      'model architecture',
      'machine learning',
    ],
    keywords: [
      'neural network architecture diagram',
      'neural network diagram',
      'deep learning architecture diagram',
      'feedforward neural network diagram',
      'neural network layers diagram',
      'how neural networks work diagram',
    ],
    layout: 'tree',
    centerLabel: 'Neural Network',
    centerIcon: 'bot',
    satellites: [
      {
        label: 'Input Layer',
        icon: 'layers',
      },
      {
        label: 'Hidden Layer 1',
        icon: 'process',
      },
      {
        label: 'Hidden Layer 2',
        icon: 'process',
      },
      {
        label: 'Activation Functions',
        icon: 'process',
      },
      {
        label: 'Output Layer',
        icon: 'layers',
      },
      {
        label: 'Loss Function',
        icon: 'search',
      },
      {
        label: 'Backpropagation',
        icon: 'automation',
      },
    ],
    treeChildren: [
      {
        label: 'Input Layer',
        icon: 'layers',
        children: [
          {
            label: 'Feature Vector',
            icon: 'database',
          },
        ],
      },
      {
        label: 'Hidden Layers',
        icon: 'process',
        children: [
          {
            label: 'Hidden Layer 1',
            icon: 'process',
          },
          {
            label: 'Hidden Layer 2',
            icon: 'process',
          },
          {
            label: 'Activation Functions',
            icon: 'process',
          },
        ],
      },
      {
        label: 'Output Layer',
        icon: 'layers',
        children: [
          {
            label: 'Prediction',
            icon: 'social',
          },
        ],
      },
      {
        label: 'Training',
        icon: 'automation',
        children: [
          {
            label: 'Loss Function',
            icon: 'search',
          },
          {
            label: 'Backpropagation',
            icon: 'automation',
          },
        ],
      },
    ],
    faqs: [
      {
        q: 'What is a neural network architecture diagram?',
        a: 'It is a layered visualization of a neural network showing the input layer, hidden layers, activation functions, and output layer, plus how loss and backpropagation update weights during training.',
      },
      {
        q: 'What are the layers of a neural network?',
        a: 'A typical feedforward network has an input layer that receives features, one or more hidden layers that learn representations, and an output layer that produces the prediction.',
      },
      {
        q: 'What is backpropagation?',
        a: 'Backpropagation computes how much each weight contributed to the loss and propagates that error backward through the layers so the optimizer can adjust weights and improve accuracy.',
      },
      {
        q: 'Why are activation functions needed?',
        a: 'Activation functions introduce non-linearity, letting the network learn complex patterns that a stack of purely linear layers could never represent.',
      },
    ],
    useCases: [
      'Deep learning course materials',
      'Research paper figures',
      'Model documentation',
      'Teaching neural network basics',
      'Technical explainer slides',
    ],
    category: 'ai-ml',
    categoryName: 'AI & Machine Learning',
  },
  {
    slug: 'business-model-canvas-template',
    title: 'Business Model Canvas Template',
    shortDescription:
      'Map how a company creates, delivers, and captures value on one page',
    longDescription:
      'A Business Model Canvas is a one-page strategic map that breaks a company into nine interlocking building blocks: Customer Segments, Value Propositions, Channels, Customer Relationships, Revenue Streams, Key Resources, Key Activities, Key Partnerships, and Cost Structure. Together they show exactly how the business creates value, delivers it to customers, and earns money in return.\n\nFounders, product managers, and consultants reach for the canvas during early validation, pivots, and investor conversations. It is far faster than a full business plan and ideal for testing assumptions, comparing strategic options, and aligning a team on how the model actually works before committing real resources.',
    tags: [
      'business model',
      'canvas',
      'strategy',
      'startup',
      'value proposition',
      'lean',
      'bmc',
    ],
    keywords: [
      'business model canvas',
      'business model canvas template',
      'bmc template',
      'lean canvas vs business model canvas',
      'how to fill out a business model canvas',
      'startup business model template',
    ],
    layout: 'hub',
    centerLabel: 'Business Model',
    centerIcon: 'process',
    satellites: [
      {
        label: 'Customer Segments',
        icon: 'social',
      },
      {
        label: 'Value Propositions',
        icon: 'layers',
      },
      {
        label: 'Channels',
        icon: 'web',
      },
      {
        label: 'Revenue Streams',
        icon: 'database',
      },
      {
        label: 'Key Resources',
        icon: 'drive',
      },
      {
        label: 'Key Activities',
        icon: 'automation',
      },
      {
        label: 'Cost Structure',
        icon: 'search',
      },
    ],
    faqs: [
      {
        q: 'What is a business model canvas?',
        a: 'It is a one-page visual template, created by Alexander Osterwalder, that describes a company across nine building blocks covering customers, value, infrastructure, and finances.',
      },
      {
        q: 'What are the nine components of a business model canvas?',
        a: 'Customer Segments, Value Propositions, Channels, Customer Relationships, Revenue Streams, Key Resources, Key Activities, Key Partnerships, and Cost Structure.',
      },
      {
        q: 'How is it different from a lean canvas?',
        a: 'The lean canvas swaps Key Partnerships, Key Activities, Key Resources, and Customer Relationships for Problem, Solution, Key Metrics, and Unfair Advantage, making it more startup-focused.',
      },
      {
        q: 'How do you fill out a business model canvas?',
        a: 'Start with Customer Segments and Value Propositions, then work outward to channels, revenue, and the cost side, validating each assumption with real customer evidence.',
      },
    ],
    useCases: [
      'Startup pitch decks',
      'Investor updates',
      'Product strategy workshops',
      'Business plan summaries',
      'Pivot planning',
      'Consulting engagements',
    ],
    category: 'business',
    categoryName: 'Business & Strategy',
  },
  {
    slug: 'value-chain-diagram',
    title: "Value Chain Diagram (Porter's Framework)",
    shortDescription:
      "Porter's primary and support activities that build a product's competitive margin",
    longDescription:
      "A value chain diagram visualizes Michael Porter's framework for the activities a company performs to deliver a product and create margin. It splits work into five primary activities: Inbound Logistics, Operations, Outbound Logistics, Marketing and Sales, and Service. These are supported by Firm Infrastructure, Human Resource Management, Technology Development, and Procurement that run across the whole chain.\n\nStrategy teams, operations leaders, and MBA students use the value chain diagram to find where cost advantage or differentiation is created. Mapping each activity reveals bottlenecks, outsourcing candidates, and the steps that genuinely add value versus those that only add cost.",
    tags: [
      'value chain',
      'porter',
      'strategy',
      'operations',
      'competitive advantage',
      'margin',
    ],
    keywords: [
      'value chain diagram',
      'porter value chain',
      'value chain analysis template',
      'primary and support activities',
      'value chain example',
      'competitive advantage diagram',
    ],
    layout: 'hub',
    centerLabel: 'Value Chain',
    centerIcon: 'process',
    satellites: [
      {
        label: 'Inbound Logistics',
        icon: 'drive',
      },
      {
        label: 'Operations',
        icon: 'automation',
      },
      {
        label: 'Outbound Logistics',
        icon: 'cloud',
      },
      {
        label: 'Marketing & Sales',
        icon: 'social',
      },
      {
        label: 'Service',
        icon: 'chat',
      },
      {
        label: 'Technology Development',
        icon: 'search',
      },
      {
        label: 'Procurement',
        icon: 'database',
      },
    ],
    faqs: [
      {
        q: 'What is a value chain diagram?',
        a: 'It is a strategic map of the activities a business performs to design, produce, market, deliver, and support its product, used to locate sources of competitive advantage.',
      },
      {
        q: "What are the components of Porter's value chain?",
        a: 'Five primary activities (inbound logistics, operations, outbound logistics, marketing and sales, service) plus four support activities (firm infrastructure, HR, technology development, procurement).',
      },
      {
        q: 'How is a value chain different from a supply chain?',
        a: 'A supply chain tracks the physical flow of goods between organizations, while a value chain focuses on the internal activities that add value and margin within one firm.',
      },
      {
        q: 'Why use value chain analysis?',
        a: 'It pinpoints where you can cut cost or differentiate, guiding decisions on outsourcing, investment, and process improvement.',
      },
    ],
    useCases: [
      'Strategy reviews',
      'Cost reduction analysis',
      'MBA coursework',
      'Operations audits',
      'Competitive analysis',
    ],
    category: 'business',
    categoryName: 'Business & Strategy',
  },
  {
    slug: 'go-to-market-strategy-diagram',
    title: 'Go-To-Market Strategy Diagram',
    shortDescription:
      'Take a product from positioning to first customers and revenue',
    longDescription:
      'A go-to-market strategy diagram lays out how a company launches a product and reaches its first customers. Core elements include the Target Market and ideal customer profile, Positioning and Messaging, Pricing and Packaging, the Sales Motion, Marketing Channels, and the Success Metrics that define what a winning launch looks like.\n\nProduct marketers, founders, and growth leaders build a GTM diagram before a launch or market expansion. It aligns sales, marketing, and product on who the buyer is, how they will be reached, and how the team will measure traction across the critical first 90 days.',
    tags: [
      'go-to-market',
      'gtm',
      'product launch',
      'marketing',
      'sales',
      'positioning',
      'growth',
    ],
    keywords: [
      'go-to-market strategy',
      'gtm strategy template',
      'product launch plan diagram',
      'go to market framework',
      'gtm motion',
      'product launch strategy',
    ],
    layout: 'hub',
    centerLabel: 'GTM Strategy',
    centerIcon: 'process',
    satellites: [
      {
        label: 'Target Market & ICP',
        icon: 'social',
      },
      {
        label: 'Positioning & Messaging',
        icon: 'chat',
      },
      {
        label: 'Pricing & Packaging',
        icon: 'database',
      },
      {
        label: 'Sales Motion',
        icon: 'process',
      },
      {
        label: 'Marketing Channels',
        icon: 'web',
      },
      {
        label: 'Launch Metrics',
        icon: 'search',
      },
      {
        label: 'Customer Onboarding',
        icon: 'automation',
      },
    ],
    faqs: [
      {
        q: 'What is a go-to-market strategy?',
        a: 'A GTM strategy is a plan for how a company will reach target customers and gain competitive advantage when launching a product or entering a new market.',
      },
      {
        q: 'What are the components of a GTM strategy?',
        a: 'Typically the target market and ICP, positioning and messaging, pricing, the sales motion, marketing channels, and success metrics.',
      },
      {
        q: 'What is the difference between a GTM strategy and a marketing plan?',
        a: 'A GTM strategy covers the whole launch including sales, pricing, and product, while a marketing plan focuses specifically on demand generation and channels.',
      },
      {
        q: 'How do you measure GTM success?',
        a: 'Track pipeline created, conversion rate, customer acquisition cost, time to first revenue, and activation among new customers.',
      },
    ],
    useCases: [
      'Product launches',
      'Market expansion plans',
      'Investor updates',
      'Sales and marketing alignment',
      'Quarterly planning',
    ],
    category: 'business',
    categoryName: 'Business & Strategy',
  },
  {
    slug: 'supply-chain-diagram',
    title: 'Supply Chain Diagram',
    shortDescription:
      'The flow of goods from suppliers through production and distribution to customers',
    longDescription:
      'A supply chain diagram maps the end-to-end flow of materials, information, and money from raw suppliers to the final customer. Typical stages include Suppliers, Procurement, Manufacturing, Warehousing, Distribution, Retail or Fulfillment, and the End Customer, with reverse logistics handling returns and recalls.\n\nOperations managers, logistics planners, and procurement teams use a supply chain diagram to spot bottlenecks, single points of failure, and lead-time risks. It is especially useful when sourcing new suppliers, planning inventory levels, or stress-testing resilience against disruption.',
    tags: [
      'supply chain',
      'logistics',
      'operations',
      'procurement',
      'distribution',
      'inventory',
      'manufacturing',
    ],
    keywords: [
      'supply chain diagram',
      'supply chain flow chart',
      'supply chain management diagram',
      'logistics flow diagram',
      'supply chain stages',
      'end to end supply chain',
    ],
    layout: 'hub',
    centerLabel: 'Supply Chain',
    centerIcon: 'process',
    satellites: [
      {
        label: 'Suppliers',
        icon: 'database',
      },
      {
        label: 'Procurement',
        icon: 'process',
      },
      {
        label: 'Manufacturing',
        icon: 'automation',
      },
      {
        label: 'Warehousing',
        icon: 'drive',
      },
      {
        label: 'Distribution',
        icon: 'cloud',
      },
      {
        label: 'Retail & Fulfillment',
        icon: 'web',
      },
      {
        label: 'End Customer',
        icon: 'social',
      },
    ],
    faqs: [
      {
        q: 'What is a supply chain diagram?',
        a: 'It is a visual map of how products move from raw material suppliers through manufacturing and distribution to the end customer, including the flow of information and payments.',
      },
      {
        q: 'What are the main stages of a supply chain?',
        a: 'Sourcing and suppliers, procurement, manufacturing, warehousing, distribution, retail or fulfillment, and delivery to the customer, plus returns.',
      },
      {
        q: 'What is the difference between a supply chain and logistics?',
        a: 'Logistics is the movement and storage of goods, which is one part of the broader supply chain that also covers sourcing, production, and demand planning.',
      },
      {
        q: 'Why map your supply chain?',
        a: 'Mapping reveals bottlenecks, lead-time risks, and single points of failure so you can build resilience and reduce cost.',
      },
    ],
    useCases: [
      'Operations planning',
      'Supplier risk reviews',
      'Inventory strategy',
      'Procurement onboarding',
      'Logistics audits',
    ],
    category: 'business',
    categoryName: 'Business & Strategy',
  },
  {
    slug: 'okr-map-template',
    title: 'OKR Map Template',
    shortDescription:
      'How a company objective cascades into key results and team initiatives',
    longDescription:
      'An OKR map shows how a single Objective connects to its measurable Key Results and the Initiatives that drive them. The center holds the company or team objective, while satellites represent the three to five key results that define success and the projects and owners responsible for moving each metric.\n\nFounders, team leads, and people-ops teams use an OKR map during quarterly planning to align everyone on what matters most and how progress is measured. Visualizing the cascade keeps key results outcome-based rather than a list of tasks, and makes ownership and dependencies obvious at a glance.',
    tags: [
      'okr',
      'objectives',
      'key results',
      'goal setting',
      'alignment',
      'planning',
      'performance',
    ],
    keywords: [
      'okr map',
      'okr template',
      'objectives and key results diagram',
      'okr framework',
      'how to write okrs',
      'quarterly okr planning',
    ],
    layout: 'hub',
    centerLabel: 'Objective',
    centerIcon: 'process',
    satellites: [
      {
        label: 'Key Result 1',
        icon: 'search',
      },
      {
        label: 'Key Result 2',
        icon: 'search',
      },
      {
        label: 'Key Result 3',
        icon: 'search',
      },
      {
        label: 'Initiatives',
        icon: 'automation',
      },
      {
        label: 'Owners',
        icon: 'social',
      },
      {
        label: 'Check-in Cadence',
        icon: 'chat',
      },
    ],
    faqs: [
      {
        q: 'What is an OKR map?',
        a: 'It is a visual that links an objective to its key results and the initiatives and owners driving them, showing how goals cascade across a team or company.',
      },
      {
        q: 'What is the difference between an objective and a key result?',
        a: 'An objective is a qualitative, inspiring goal, while key results are measurable outcomes that prove the objective was achieved.',
      },
      {
        q: 'How many key results should an objective have?',
        a: 'Most teams use three to five key results per objective to stay focused and avoid spreading effort too thin.',
      },
      {
        q: 'How are OKRs different from KPIs?',
        a: 'KPIs are ongoing health metrics you monitor continuously, while OKRs are time-bound goals set to drive a specific change in a quarter.',
      },
    ],
    useCases: [
      'Quarterly planning',
      'Team alignment',
      'Company all-hands',
      'Performance reviews',
      'Strategy cascades',
    ],
    category: 'business',
    categoryName: 'Business & Strategy',
  },
  {
    slug: 'business-process-diagram',
    title: 'Business Process Diagram',
    shortDescription:
      'The steps, decisions, and roles that complete a repeatable workflow',
    longDescription:
      'A business process diagram maps a repeatable workflow as a clear sequence of steps, decisions, and handoffs between roles or systems. It usually starts with a trigger, moves through tasks and approval or decision points, branches on conditions, and ends with a defined outcome, often using swimlanes to show who owns each step.\n\nOperations analysts, process owners, and teams documenting standard operating procedures use a business process diagram to remove ambiguity, find bottlenecks, and prepare work for automation. It is the foundation for onboarding new staff and for any process-improvement or BPMN modeling effort.',
    tags: [
      'business process',
      'workflow',
      'bpmn',
      'process mapping',
      'sop',
      'operations',
      'automation',
    ],
    keywords: [
      'business process diagram',
      'business process flow chart',
      'process mapping template',
      'bpmn diagram',
      'workflow diagram',
      'standard operating procedure diagram',
    ],
    layout: 'hub',
    centerLabel: 'Process Workflow',
    centerIcon: 'process',
    satellites: [
      {
        label: 'Trigger Event',
        icon: 'automation',
      },
      {
        label: 'Task Steps',
        icon: 'process',
      },
      {
        label: 'Decision Point',
        icon: 'layers',
      },
      {
        label: 'Approval',
        icon: 'chat',
      },
      {
        label: 'System Update',
        icon: 'database',
      },
      {
        label: 'Notification',
        icon: 'mail',
      },
      {
        label: 'End Outcome',
        icon: 'search',
      },
    ],
    faqs: [
      {
        q: 'What is a business process diagram?',
        a: 'It is a visual representation of the steps, decisions, and roles involved in completing a repeatable business workflow from trigger to outcome.',
      },
      {
        q: 'What are the components of a business process diagram?',
        a: 'A start trigger, sequential tasks, decision points, approvals, system actions, notifications, and a clear end state, often organized into swimlanes by role.',
      },
      {
        q: 'What is the difference between a flowchart and a BPMN diagram?',
        a: 'A flowchart is a general step-by-step visual, while BPMN is a standardized notation with specific symbols for events, gateways, and pools designed for business processes.',
      },
      {
        q: 'How do you create a business process diagram?',
        a: 'Identify the trigger and outcome, list each step in order, mark decision branches and owners, then validate the flow with the people who do the work.',
      },
    ],
    useCases: [
      'SOP documentation',
      'Employee onboarding',
      'Process improvement',
      'Automation planning',
      'Compliance audits',
    ],
    category: 'business',
    categoryName: 'Business & Strategy',
  },
  {
    slug: 'company-org-chart-template',
    title: 'Company Org Chart Template',
    shortDescription:
      'The reporting hierarchy from leadership down through departments and teams',
    longDescription:
      'A company org chart is a hierarchical diagram showing reporting relationships from the top leader down through departments and individual teams. The root is usually the CEO, branching into functional leaders such as Engineering, Sales, Marketing, Finance, and Operations, each of which expands into its own teams and roles.\n\nHR teams, founders, and managers use an org chart template to clarify who reports to whom, plan headcount, and onboard new hires. Visualizing the structure exposes gaps, overloaded managers, and unclear ownership, making it essential during reorganizations and periods of rapid scaling.',
    tags: [
      'org chart',
      'organizational chart',
      'hierarchy',
      'reporting structure',
      'hr',
      'team structure',
      'company structure',
    ],
    keywords: [
      'org chart template',
      'company organizational chart',
      'organization structure diagram',
      'reporting hierarchy chart',
      'team org chart',
      'how to make an org chart',
    ],
    layout: 'tree',
    centerLabel: 'CEO',
    centerIcon: 'social',
    satellites: [
      {
        label: 'Engineering',
        icon: 'cloud',
      },
      {
        label: 'Sales',
        icon: 'social',
      },
      {
        label: 'Marketing',
        icon: 'web',
      },
      {
        label: 'Finance',
        icon: 'database',
      },
      {
        label: 'Operations',
        icon: 'process',
      },
      {
        label: 'People & HR',
        icon: 'chat',
      },
      {
        label: 'Customer Success',
        icon: 'mail',
      },
    ],
    treeChildren: [
      {
        label: 'Engineering',
        icon: 'cloud',
        children: [
          {
            label: 'Frontend Team',
            icon: 'web',
          },
          {
            label: 'Backend Team',
            icon: 'cloud',
          },
          {
            label: 'Platform & DevOps',
            icon: 'automation',
          },
        ],
      },
      {
        label: 'Sales',
        icon: 'social',
        children: [
          {
            label: 'Account Executives',
            icon: 'social',
          },
          {
            label: 'Sales Development',
            icon: 'chat',
          },
        ],
      },
      {
        label: 'Marketing',
        icon: 'web',
        children: [
          {
            label: 'Demand Gen',
            icon: 'search',
          },
          {
            label: 'Content',
            icon: 'drive',
          },
        ],
      },
      {
        label: 'Finance',
        icon: 'database',
        children: [
          {
            label: 'Accounting',
            icon: 'database',
          },
          {
            label: 'FP&A',
            icon: 'search',
          },
        ],
      },
      {
        label: 'Operations',
        icon: 'process',
        children: [
          {
            label: 'IT',
            icon: 'cloud',
          },
          {
            label: 'Facilities',
            icon: 'drive',
          },
        ],
      },
    ],
    faqs: [
      {
        q: 'What is an org chart?',
        a: 'An organizational chart is a diagram that shows the reporting hierarchy and structure of a company, from leadership down to individual teams and roles.',
      },
      {
        q: 'What are the types of org charts?',
        a: 'Common types are hierarchical (top-down), flat, matrix, and divisional, each reflecting a different way of grouping people and reporting lines.',
      },
      {
        q: 'How do you make a company org chart?',
        a: 'Start with the top leader, add each direct report, then expand departments into their teams and roles, keeping reporting lines clear and one manager per role.',
      },
      {
        q: 'Why is an org chart useful?',
        a: 'It clarifies who reports to whom, supports headcount and succession planning, speeds up onboarding, and reveals structural gaps during reorganizations.',
      },
    ],
    useCases: [
      'Employee onboarding',
      'Headcount planning',
      'Reorganizations',
      'Investor due diligence',
      'Internal directories',
    ],
    category: 'business',
    categoryName: 'Business & Strategy',
  },
  {
    slug: 'marketing-funnel-diagram',
    title: 'Marketing Funnel Diagram',
    shortDescription:
      'Map the buyer journey from awareness to advocacy across every funnel stage',
    longDescription:
      'A marketing funnel diagram visualizes how prospects move from first hearing about your brand to becoming paying, loyal customers. The core stages are Awareness, Interest, Consideration, Conversion, and Retention, often extended with Advocacy for customers who refer others. Each stage maps to specific channels, content, and metrics, so teams can see exactly where leads enter and where they drop off.\n\nGrowth marketers, demand-gen teams, and founders use a marketing funnel diagram to align campaigns, plan budgets, and diagnose leaky stages. It works well for sales-and-marketing alignment reviews, board decks, and onboarding new hires who need a shared picture of the conversion funnel and the customer journey behind it.',
    tags: [
      'marketing funnel',
      'sales funnel',
      'buyer journey',
      'conversion',
      'demand generation',
      'growth marketing',
      'aida',
    ],
    keywords: [
      'marketing funnel diagram',
      'sales funnel template',
      'buyer journey funnel',
      'conversion funnel stages',
      'aida funnel diagram',
      'tofu mofu bofu funnel',
    ],
    layout: 'hub',
    centerLabel: 'Marketing Funnel',
    centerIcon: 'process',
    satellites: [
      {
        label: 'Awareness (TOFU)',
        icon: 'search',
      },
      {
        label: 'Interest',
        icon: 'web',
      },
      {
        label: 'Consideration (MOFU)',
        icon: 'mail',
      },
      {
        label: 'Conversion (BOFU)',
        icon: 'process',
      },
      {
        label: 'Retention',
        icon: 'chat',
      },
      {
        label: 'Advocacy / Referral',
        icon: 'social',
      },
    ],
    faqs: [
      {
        q: 'What is a marketing funnel diagram?',
        a: 'It is a visual model showing the stages a prospect passes through, from first awareness to becoming a paying and loyal customer. Each stage narrows as fewer people advance, forming a funnel shape.',
      },
      {
        q: 'What are the stages of a marketing funnel?',
        a: 'The classic stages are Awareness, Interest, Consideration, Conversion, and Retention, often extended with Advocacy. They are sometimes grouped as TOFU (top), MOFU (middle), and BOFU (bottom).',
      },
      {
        q: 'How is a marketing funnel different from a sales funnel?',
        a: 'A marketing funnel covers the full journey including brand awareness and post-purchase retention, while a sales funnel usually focuses on the later stages where leads convert into deals.',
      },
      {
        q: 'How do you find a leaky funnel stage?',
        a: 'Track the conversion rate between each stage and look for the largest percentage drop-off. That stage is where messaging, offers, or friction most need fixing.',
      },
    ],
    useCases: [
      'Demand-gen strategy reviews',
      'Board and investor decks',
      'Sales and marketing alignment',
      'New marketer onboarding',
      'Campaign budget planning',
    ],
    category: 'marketing',
    categoryName: 'Marketing & Growth',
  },
  {
    slug: 'content-marketing-workflow-diagram',
    title: 'Content Marketing Workflow Diagram',
    shortDescription:
      'Show the end-to-end content pipeline from ideation through distribution and analysis',
    longDescription:
      'A content marketing workflow diagram lays out the repeatable pipeline a team follows to turn ideas into published, promoted content. Typical steps include keyword and topic research, content briefs, drafting, editing and SEO review, design, publishing in the CMS, multi-channel distribution, and performance analysis that feeds the next cycle. It clarifies the handoffs and approval gates between writers, editors, designers, and SEO leads.\n\nContent managers, editorial calendar owners, and agencies use this workflow to standardize quality and speed up production. It is useful for onboarding freelancers, documenting a content operations process, and pinpointing the bottlenecks that slow your editorial and content production pipeline.',
    tags: [
      'content marketing',
      'editorial workflow',
      'content production',
      'content ops',
      'seo content',
      'publishing pipeline',
      'content strategy',
    ],
    keywords: [
      'content marketing workflow',
      'content production process',
      'editorial workflow diagram',
      'content pipeline template',
      'content ops workflow',
      'content creation process',
    ],
    layout: 'hub',
    centerLabel: 'Content Workflow',
    centerIcon: 'automation',
    satellites: [
      {
        label: 'Keyword & Topic Research',
        icon: 'search',
      },
      {
        label: 'Content Brief',
        icon: 'drive',
      },
      {
        label: 'Drafting',
        icon: 'process',
      },
      {
        label: 'Edit & SEO Review',
        icon: 'search',
      },
      {
        label: 'Design & Assets',
        icon: 'layers',
      },
      {
        label: 'Publish in CMS',
        icon: 'web',
      },
      {
        label: 'Distribute & Analyze',
        icon: 'social',
      },
    ],
    faqs: [
      {
        q: 'What is a content marketing workflow?',
        a: 'It is the documented, repeatable sequence of steps a team uses to plan, create, publish, and promote content. It defines who does what and in what order.',
      },
      {
        q: 'What are the stages of a content production process?',
        a: 'Common stages are research, briefing, drafting, editing and SEO review, design, publishing, distribution, and performance analysis that loops back into new ideas.',
      },
      {
        q: 'Why document a content workflow?',
        a: 'A written workflow reduces bottlenecks, keeps quality consistent, makes onboarding freelancers faster, and helps everyone see where a piece is stuck.',
      },
      {
        q: 'How does SEO fit into the content workflow?',
        a: 'SEO appears at both the research stage, where keywords and topics are chosen, and the review stage, where titles, headings, and metadata are optimized before publishing.',
      },
    ],
    useCases: [
      'Editorial process documentation',
      'Freelancer onboarding',
      'Content ops audits',
      'Agency client SOPs',
      'Editorial calendar planning',
    ],
    category: 'marketing',
    categoryName: 'Marketing & Growth',
  },
  {
    slug: 'email-automation-flow-diagram',
    title: 'Email Automation Flow Diagram',
    shortDescription:
      'Map a triggered email sequence with branches, delays, and conditional sends',
    longDescription:
      'An email automation flow diagram shows how an automated email sequence runs from a trigger event through timed steps, conditional branches, and exit points. Core elements include the entry trigger, wait or delay steps, individual emails, decision splits based on opens or clicks, goal and conversion checks, and unsubscribe or exit conditions. It makes the logic of a drip or nurture campaign visible at a glance.\n\nLifecycle and email marketers use this diagram to design welcome series, abandoned-cart flows, and re-engagement campaigns in tools like Klaviyo, Mailchimp, or HubSpot. It is ideal for planning an email automation flow before you build it, reviewing the logic with stakeholders, and debugging why a drip campaign sends the wrong message.',
    tags: [
      'email automation',
      'drip campaign',
      'email marketing',
      'nurture flow',
      'lifecycle marketing',
      'marketing automation',
      'welcome series',
    ],
    keywords: [
      'email automation flow',
      'drip campaign diagram',
      'email nurture flow template',
      'welcome email sequence',
      'abandoned cart email flow',
      'marketing automation workflow',
    ],
    layout: 'hub',
    centerLabel: 'Email Automation',
    centerIcon: 'mail',
    satellites: [
      {
        label: 'Entry Trigger',
        icon: 'automation',
      },
      {
        label: 'Wait / Delay',
        icon: 'process',
      },
      {
        label: 'Welcome Email',
        icon: 'mail',
      },
      {
        label: 'Opened? Branch',
        icon: 'process',
      },
      {
        label: 'Follow-up Email',
        icon: 'mail',
      },
      {
        label: 'Goal / Conversion',
        icon: 'search',
      },
      {
        label: 'Exit / Unsubscribe',
        icon: 'chat',
      },
    ],
    faqs: [
      {
        q: 'What is an email automation flow?',
        a: 'It is an automated sequence of emails sent based on a trigger and timing rules, with branches that change what a subscriber receives based on their behavior.',
      },
      {
        q: 'What are the components of an email automation flow?',
        a: 'The key parts are a trigger, delay or wait steps, individual emails, conditional branches based on opens or clicks, goal checks, and exit conditions like unsubscribing or converting.',
      },
      {
        q: 'How do you build a drip campaign?',
        a: 'Start by defining the entry trigger and goal, map the emails and the delays between them, then add branches for engaged versus unengaged subscribers before building it in your email platform.',
      },
      {
        q: 'What is a common email automation example?',
        a: 'A welcome series, an abandoned-cart recovery flow, a post-purchase upsell, and a win-back re-engagement campaign are the most common automated email flows.',
      },
    ],
    useCases: [
      'Welcome series design',
      'Abandoned-cart flows',
      'Lifecycle campaign reviews',
      'Marketing automation onboarding',
      'Drip logic debugging',
    ],
    category: 'marketing',
    categoryName: 'Marketing & Growth',
  },
  {
    slug: 'growth-loop-diagram',
    title: 'Growth Loop Diagram',
    shortDescription:
      'Show a self-reinforcing loop where user actions drive new user acquisition',
    longDescription:
      'A growth loop diagram illustrates a closed, self-reinforcing cycle where the output of one user action becomes the input that acquires the next user. Unlike a linear funnel, a loop reinvests its outputs: new users take an action that produces a result, which is distributed and converts more new users. Common loops include viral referral loops, content loops, and paid reinvestment loops, each defined by an input, an action, an output, and reinvestment.\n\nGrowth teams and product-led companies use a growth loop diagram to model compounding acquisition and find the lever that drives sustainable growth. It is valuable for growth strategy workshops, investor narratives about defensibility, and comparing viral loops against a traditional acquisition funnel.',
    tags: [
      'growth loop',
      'viral loop',
      'product-led growth',
      'growth model',
      'acquisition loop',
      'flywheel',
      'referral loop',
    ],
    keywords: [
      'growth loop diagram',
      'viral loop template',
      'product led growth loop',
      'growth flywheel diagram',
      'referral loop model',
      'acquisition loop diagram',
    ],
    layout: 'hub',
    centerLabel: 'Growth Loop',
    centerIcon: 'automation',
    satellites: [
      {
        label: 'New Users (Input)',
        icon: 'web',
      },
      {
        label: 'Core Action',
        icon: 'process',
      },
      {
        label: 'Value Created (Output)',
        icon: 'layers',
      },
      {
        label: 'Distribution / Sharing',
        icon: 'social',
      },
      {
        label: 'Conversion to New Users',
        icon: 'search',
      },
      {
        label: 'Reinvest into Loop',
        icon: 'automation',
      },
    ],
    faqs: [
      {
        q: 'What is a growth loop?',
        a: "A growth loop is a self-reinforcing cycle where the output of existing users' actions feeds back in to acquire new users, creating compounding rather than linear growth.",
      },
      {
        q: 'How is a growth loop different from a funnel?',
        a: 'A funnel is a one-way path where users drop off at each stage, while a growth loop reinvests its output back into the top so each cycle fuels the next.',
      },
      {
        q: 'What are the types of growth loops?',
        a: 'The main types are viral or referral loops, content and SEO loops, and paid loops that reinvest revenue into acquisition. Many products combine several.',
      },
      {
        q: 'What makes a growth loop work?',
        a: 'A loop compounds when each new user reliably produces an output, such as a referral or indexed content, that converts more users than it cost to acquire them.',
      },
    ],
    useCases: [
      'Growth strategy workshops',
      'Product-led growth planning',
      'Investor defensibility narratives',
      'Acquisition channel modeling',
      'Viral feature design',
    ],
    category: 'marketing',
    categoryName: 'Marketing & Growth',
  },
  {
    slug: 'seo-process-diagram',
    title: 'SEO Process Diagram',
    shortDescription:
      'Outline the search engine optimization workflow from research to reporting',
    longDescription:
      "An SEO process diagram maps the recurring steps that improve a site's organic search visibility. Core phases include keyword research, technical SEO and site audits, on-page optimization, content creation, link building and off-page work, and measurement through analytics and rank tracking. Together they form a continuous loop where reporting insights feed the next round of priorities.\n\nSEO specialists, content marketers, and agencies use an SEO process diagram to standardize their methodology and explain the work to clients or executives. It is useful for SEO strategy pitches, onboarding junior team members, and showing how technical SEO, content, and link building combine into one search optimization workflow.",
    tags: [
      'seo process',
      'search engine optimization',
      'technical seo',
      'on-page seo',
      'keyword research',
      'link building',
      'organic search',
    ],
    keywords: [
      'seo process diagram',
      'seo workflow template',
      'search engine optimization process',
      'seo strategy steps',
      'technical seo process',
      'on-page seo workflow',
    ],
    layout: 'hub',
    centerLabel: 'SEO Process',
    centerIcon: 'search',
    satellites: [
      {
        label: 'Keyword Research',
        icon: 'search',
      },
      {
        label: 'Technical Audit',
        icon: 'process',
      },
      {
        label: 'On-Page Optimization',
        icon: 'web',
      },
      {
        label: 'Content Creation',
        icon: 'drive',
      },
      {
        label: 'Link Building',
        icon: 'social',
      },
      {
        label: 'Analytics & Rank Tracking',
        icon: 'search',
      },
    ],
    faqs: [
      {
        q: 'What is the SEO process?',
        a: 'It is the repeatable workflow of researching keywords, auditing and fixing technical issues, optimizing pages, creating content, earning links, and measuring results to improve organic rankings.',
      },
      {
        q: 'What are the main components of SEO?',
        a: 'SEO is usually divided into technical SEO, on-page optimization, content, and off-page link building, all guided by keyword research and tracked through analytics.',
      },
      {
        q: 'How do you start an SEO project?',
        a: 'Begin with keyword research and a technical audit to understand opportunities and problems, then prioritize on-page fixes and content before investing in link building.',
      },
      {
        q: 'Is SEO a one-time task?',
        a: 'No. SEO is an ongoing loop because rankings, competitors, and algorithms change, so reporting continually feeds new priorities back into the process.',
      },
    ],
    useCases: [
      'SEO strategy pitches',
      'Agency client onboarding',
      'Junior SEO training',
      'Quarterly SEO planning',
      'Cross-team methodology docs',
    ],
    category: 'marketing',
    categoryName: 'Marketing & Growth',
  },
  {
    slug: 'campaign-workflow-diagram',
    title: 'Marketing Campaign Workflow Diagram',
    shortDescription:
      'Map a marketing campaign from planning and approval through launch and review',
    longDescription:
      'A campaign workflow diagram shows the stages and approval gates a marketing campaign passes through from concept to retrospective. Typical steps are goal and brief setting, creative and asset production, stakeholder approval, channel scheduling, launch, live monitoring, and a post-campaign review that captures learnings. It clarifies the handoffs between strategy, creative, and media teams and pinpoints where sign-off is required.\n\nMarketing managers, project managers, and agencies use a campaign workflow to coordinate multi-channel launches and avoid missed deadlines. It is ideal for documenting a repeatable campaign process, aligning cross-functional teams, and onboarding new coordinators who need to see the full campaign management workflow at a glance.',
    tags: [
      'campaign workflow',
      'marketing campaign',
      'campaign management',
      'campaign planning',
      'marketing operations',
      'go to market',
      'approval workflow',
    ],
    keywords: [
      'campaign workflow diagram',
      'marketing campaign process',
      'campaign management template',
      'campaign planning workflow',
      'marketing campaign steps',
      'campaign approval process',
    ],
    layout: 'hub',
    centerLabel: 'Campaign Workflow',
    centerIcon: 'process',
    satellites: [
      {
        label: 'Brief & Goals',
        icon: 'drive',
      },
      {
        label: 'Creative Production',
        icon: 'layers',
      },
      {
        label: 'Stakeholder Approval',
        icon: 'chat',
      },
      {
        label: 'Channel Scheduling',
        icon: 'automation',
      },
      {
        label: 'Launch',
        icon: 'social',
      },
      {
        label: 'Monitor & Optimize',
        icon: 'search',
      },
      {
        label: 'Post-Campaign Review',
        icon: 'process',
      },
    ],
    faqs: [
      {
        q: 'What is a campaign workflow?',
        a: 'It is the defined sequence of steps a marketing campaign moves through, from setting goals and producing creative to approval, launch, monitoring, and review.',
      },
      {
        q: 'What are the stages of a marketing campaign?',
        a: 'Common stages are briefing and goal-setting, creative production, approval, scheduling, launch, live optimization, and a post-campaign review of results.',
      },
      {
        q: 'Why use a campaign workflow diagram?',
        a: 'It coordinates cross-functional teams, makes approval gates explicit, prevents missed deadlines, and gives everyone a shared view of where a campaign stands.',
      },
      {
        q: 'Who owns the campaign workflow?',
        a: 'A marketing manager or campaign lead usually owns the overall workflow, coordinating creative, media, and stakeholder approvals across the stages.',
      },
    ],
    useCases: [
      'Multi-channel launch planning',
      'Marketing ops documentation',
      'Cross-functional alignment',
      'Coordinator onboarding',
      'Go-to-market planning',
    ],
    category: 'marketing',
    categoryName: 'Marketing & Growth',
  },
  {
    slug: 'marketing-team-org-chart',
    title: 'Marketing Team Org Chart',
    shortDescription:
      'Hierarchy of marketing roles from CMO down to specialists across each function',
    longDescription:
      'A marketing team org chart shows the reporting hierarchy and functional structure of a marketing department. At the top sits the CMO or VP of Marketing, branching into core functions such as demand generation, content and brand, product marketing, and marketing operations, each with managers and individual specialists beneath them. The chart makes clear who reports to whom and how responsibilities are divided across teams.\n\nMarketing leaders, HR, and founders use a marketing team org chart for headcount planning, restructuring, and onboarding. It is ideal for visualizing a growth marketing team structure, explaining the department to executives, and spotting gaps or overlaps before hiring into the marketing organization.',
    tags: [
      'marketing org chart',
      'marketing team structure',
      'team hierarchy',
      'marketing department',
      'headcount planning',
      'marketing roles',
      'org structure',
    ],
    keywords: [
      'marketing team org chart',
      'marketing department structure',
      'marketing org chart template',
      'growth marketing team structure',
      'marketing roles hierarchy',
      'cmo org chart',
    ],
    layout: 'tree',
    centerLabel: 'CMO / VP Marketing',
    centerIcon: 'process',
    satellites: [
      {
        label: 'Demand Generation',
        icon: 'search',
      },
      {
        label: 'Content & Brand',
        icon: 'drive',
      },
      {
        label: 'Product Marketing',
        icon: 'layers',
      },
      {
        label: 'Marketing Operations',
        icon: 'automation',
      },
      {
        label: 'Performance / Paid Media',
        icon: 'social',
      },
      {
        label: 'Lifecycle & Email',
        icon: 'mail',
      },
      {
        label: 'Marketing Analytics',
        icon: 'search',
      },
    ],
    treeChildren: [
      {
        label: 'Demand Generation',
        icon: 'search',
        children: [
          {
            label: 'Performance / Paid Media',
            icon: 'social',
          },
          {
            label: 'Lifecycle & Email',
            icon: 'mail',
          },
        ],
      },
      {
        label: 'Content & Brand',
        icon: 'drive',
        children: [
          {
            label: 'SEO & Content Writers',
            icon: 'web',
          },
          {
            label: 'Design & Creative',
            icon: 'layers',
          },
        ],
      },
      {
        label: 'Product Marketing',
        icon: 'layers',
        children: [
          {
            label: 'Messaging & Positioning',
            icon: 'chat',
          },
        ],
      },
      {
        label: 'Marketing Operations',
        icon: 'automation',
        children: [
          {
            label: 'Marketing Analytics',
            icon: 'search',
          },
        ],
      },
    ],
    faqs: [
      {
        q: 'What is a marketing team org chart?',
        a: 'It is a diagram showing the reporting structure of a marketing department, from the CMO down through functional leads and specialists, clarifying who reports to whom.',
      },
      {
        q: 'How is a marketing team typically structured?',
        a: 'Most teams organize around functions like demand generation, content and brand, product marketing, and marketing operations, each led by a manager reporting to the CMO or VP.',
      },
      {
        q: 'What roles belong on a marketing org chart?',
        a: 'Common roles include the CMO, demand-gen and growth leads, content and SEO writers, product marketers, paid media and lifecycle specialists, and marketing operations or analytics.',
      },
      {
        q: 'Why create a marketing org chart?',
        a: 'It supports headcount and budget planning, clarifies ownership, helps onboard new hires, and reveals gaps or overlaps before you restructure or hire.',
      },
    ],
    useCases: [
      'Headcount planning',
      'Department restructuring',
      'New hire onboarding',
      'Executive reporting',
      'Hiring gap analysis',
    ],
    category: 'marketing',
    categoryName: 'Marketing & Growth',
  },
  {
    slug: 'sales-pipeline-diagram',
    title: 'Sales Pipeline Diagram',
    shortDescription:
      'Visualize every stage a deal moves through from prospect to closed-won',
    longDescription:
      'A sales pipeline diagram maps the sequential stages a deal travels through as a rep works it toward revenue. The central pipeline connects discrete stages such as prospecting, qualification, discovery, proposal, and negotiation, each carrying its own conversion rate, deal value, and average time-in-stage.\n\nSales managers, RevOps teams, and founders lean on a pipeline diagram during forecasting, weekly reviews, and onboarding. It clarifies where deals stall, exposes bottlenecks between qualification and proposal, and gives leadership a shared model of the funnel for accurate revenue forecasting and quota planning.',
    tags: [
      'sales pipeline',
      'crm',
      'sales funnel',
      'revops',
      'forecasting',
      'deal flow',
      'sales process',
    ],
    keywords: [
      'sales pipeline diagram',
      'sales pipeline stages',
      'sales funnel diagram',
      'crm pipeline template',
      'sales process flow',
      'pipeline stages chart',
    ],
    layout: 'hub',
    centerLabel: 'Sales Pipeline',
    centerIcon: 'process',
    satellites: [
      {
        label: 'Prospecting',
        icon: 'search',
      },
      {
        label: 'Lead Qualification',
        icon: 'process',
      },
      {
        label: 'Discovery Call',
        icon: 'chat',
      },
      {
        label: 'Proposal Sent',
        icon: 'mail',
      },
      {
        label: 'Negotiation',
        icon: 'process',
      },
      {
        label: 'Closed-Won',
        icon: 'database',
      },
      {
        label: 'Closed-Lost',
        icon: 'layers',
      },
    ],
    faqs: [
      {
        q: 'What is a sales pipeline diagram?',
        a: 'It is a visual map of the stages a deal passes through from first contact to close. Each stage shows conversion likelihood and helps teams forecast revenue.',
      },
      {
        q: 'What are the main stages of a sales pipeline?',
        a: 'Common stages are prospecting, qualification, discovery, proposal, negotiation, and closed-won or closed-lost. Teams adapt these to match their own sales motion.',
      },
      {
        q: 'How is a pipeline different from a sales funnel?',
        a: "A funnel shows volume narrowing across stages from the buyer's perspective, while a pipeline tracks the seller's active deals and the actions needed to advance each one.",
      },
      {
        q: 'How do you use a sales pipeline diagram for forecasting?',
        a: 'Multiply the deal value at each stage by its historical close rate, then sum across the pipeline to project weighted revenue for the period.',
      },
    ],
    useCases: [
      'Weekly pipeline reviews',
      'Revenue forecasting',
      'Sales team onboarding',
      'Board and investor updates',
      'RevOps process design',
    ],
    category: 'sales-crm',
    categoryName: 'Sales & CRM',
  },
  {
    slug: 'lead-generation-flow-diagram',
    title: 'Lead Generation Flow Diagram',
    shortDescription:
      'Trace how leads enter, get scored, and route from first touch to sales-ready',
    longDescription:
      'A lead generation flow diagram shows how a prospect becomes a qualified, sales-ready lead. The central flow connects acquisition channels and the steps that follow: a landing page capture form, lead scoring, list segmentation, nurture emails, and the MQL-to-SQL handoff into the CRM.\n\nDemand gen marketers and growth teams use this flow when designing campaigns, auditing conversion drop-off, and aligning marketing with sales. It clarifies which channels feed the funnel, where automation rules fire, and the exact threshold at which a marketing-qualified lead is handed to a rep, reducing leakage between teams.',
    tags: [
      'lead generation',
      'demand gen',
      'marketing automation',
      'lead scoring',
      'mql',
      'inbound marketing',
      'lead nurturing',
    ],
    keywords: [
      'lead generation flow diagram',
      'lead gen funnel',
      'lead scoring flow',
      'mql to sql process',
      'lead nurturing diagram',
      'demand generation flow',
    ],
    layout: 'hub',
    centerLabel: 'Lead Generation Flow',
    centerIcon: 'automation',
    satellites: [
      {
        label: 'Acquisition Channels',
        icon: 'social',
      },
      {
        label: 'Landing Page Form',
        icon: 'web',
      },
      {
        label: 'Lead Scoring',
        icon: 'process',
      },
      {
        label: 'List Segmentation',
        icon: 'database',
      },
      {
        label: 'Nurture Emails',
        icon: 'mail',
      },
      {
        label: 'MQL to SQL Handoff',
        icon: 'process',
      },
      {
        label: 'CRM Sync',
        icon: 'cloud',
      },
    ],
    faqs: [
      {
        q: 'What is a lead generation flow?',
        a: 'It is the end-to-end path a prospect takes from first touch through capture, scoring, and nurturing until they become a sales-qualified lead handed to a rep.',
      },
      {
        q: 'What are the components of a lead gen flow?',
        a: 'Key parts include acquisition channels, a capture form, lead scoring rules, segmentation, automated nurture, and the MQL-to-SQL handoff into the CRM.',
      },
      {
        q: 'What is the difference between an MQL and an SQL?',
        a: 'A marketing-qualified lead has shown engagement that meets a scoring threshold, while a sales-qualified lead has been validated by sales as worth active pursuit.',
      },
      {
        q: 'How do you reduce drop-off in a lead generation flow?',
        a: 'Simplify capture forms, tighten scoring thresholds, and automate timely follow-up so hot leads reach a rep before interest cools.',
      },
    ],
    useCases: [
      'Campaign planning',
      'Marketing-sales alignment',
      'Conversion rate audits',
      'Marketing automation setup',
      'Growth strategy decks',
    ],
    category: 'sales-crm',
    categoryName: 'Sales & CRM',
  },
  {
    slug: 'customer-journey-map-diagram',
    title: 'Customer Journey Map Diagram',
    shortDescription:
      'Map every stage a customer moves through from awareness to advocacy',
    longDescription:
      'A customer journey map diagram visualizes the full experience a buyer has with a brand across stages like awareness, consideration, purchase, onboarding, retention, and advocacy. The central journey connects each phase to the touchpoints, emotions, and channels a customer encounters along the way.\n\nProduct, marketing, and customer success teams use a journey map during experience design, churn analysis, and lifecycle planning. It surfaces friction points and moments of delight, aligns cross-functional teams on a single view of the customer, and pinpoints where to invest in content, support, or product to lift conversion and loyalty.',
    tags: [
      'customer journey',
      'cx',
      'lifecycle',
      'customer experience',
      'touchpoints',
      'retention',
      'advocacy',
    ],
    keywords: [
      'customer journey map diagram',
      'customer journey stages',
      'cx journey map template',
      'buyer journey diagram',
      'customer lifecycle map',
      'journey mapping template',
    ],
    layout: 'hub',
    centerLabel: 'Customer Journey',
    centerIcon: 'process',
    satellites: [
      {
        label: 'Awareness',
        icon: 'search',
      },
      {
        label: 'Consideration',
        icon: 'web',
      },
      {
        label: 'Purchase',
        icon: 'database',
      },
      {
        label: 'Onboarding',
        icon: 'process',
      },
      {
        label: 'Retention',
        icon: 'chat',
      },
      {
        label: 'Advocacy',
        icon: 'social',
      },
      {
        label: 'Support Touchpoints',
        icon: 'mail',
      },
    ],
    faqs: [
      {
        q: 'What is a customer journey map?',
        a: 'It is a visual representation of the stages, touchpoints, and emotions a customer experiences with a brand from first awareness through long-term advocacy.',
      },
      {
        q: 'What are the stages of a customer journey?',
        a: 'Typical stages are awareness, consideration, purchase, onboarding, retention, and advocacy, though teams tailor them to their specific product and audience.',
      },
      {
        q: 'Why is customer journey mapping important?',
        a: 'It reveals friction and gaps across touchpoints, aligns teams on one view of the customer, and shows where to invest to improve conversion and retention.',
      },
      {
        q: 'How is a journey map different from a sales funnel?',
        a: 'A funnel focuses on conversion volume toward a purchase, while a journey map covers the entire experience, including post-purchase onboarding, support, and advocacy.',
      },
    ],
    useCases: [
      'CX design workshops',
      'Churn and friction analysis',
      'Lifecycle marketing planning',
      'Onboarding improvement',
      'Cross-team alignment',
    ],
    category: 'sales-crm',
    categoryName: 'Sales & CRM',
  },
  {
    slug: 'crm-architecture-diagram',
    title: 'CRM Architecture Diagram',
    shortDescription:
      'Show how a CRM connects data, integrations, automation, and reporting layers',
    longDescription:
      'A CRM architecture diagram illustrates how a customer relationship management system is structured technically. The central platform connects to its contact and deal database, an integration layer for email and marketing tools, a workflow automation engine, an analytics and reporting layer, and external APIs that sync data with billing and support systems.\n\nRevOps engineers, solutions architects, and admins use this diagram when implementing or migrating a CRM, scoping integrations, and documenting data flow. It clarifies where customer data lives, how systems exchange records, and which automations and webhooks keep the platform in sync across the stack.',
    tags: [
      'crm',
      'architecture',
      'integrations',
      'revops',
      'data model',
      'automation',
      'system design',
    ],
    keywords: [
      'crm architecture diagram',
      'crm system design',
      'crm integration diagram',
      'crm data flow',
      'salesforce architecture',
      'crm tech stack diagram',
    ],
    layout: 'hub',
    centerLabel: 'CRM Platform',
    centerIcon: 'cloud',
    satellites: [
      {
        label: 'Contacts & Deals DB',
        icon: 'database',
      },
      {
        label: 'Email & Marketing Integration',
        icon: 'mail',
      },
      {
        label: 'Workflow Automation',
        icon: 'automation',
      },
      {
        label: 'Analytics & Reporting',
        icon: 'search',
      },
      {
        label: 'REST API & Webhooks',
        icon: 'cloud',
      },
      {
        label: 'Billing Sync',
        icon: 'process',
      },
      {
        label: 'Support Desk Integration',
        icon: 'chat',
      },
    ],
    faqs: [
      {
        q: 'What is a CRM architecture diagram?',
        a: 'It is a technical map showing how a CRM platform connects its data store, integrations, automation engine, and reporting layer to surrounding business systems.',
      },
      {
        q: 'What are the components of a CRM architecture?',
        a: 'Core parts include the contact and deal database, integration layer, workflow automation, analytics and reporting, and APIs or webhooks that sync external systems.',
      },
      {
        q: 'How does a CRM sync data with other tools?',
        a: 'Through APIs and webhooks, the CRM pushes and pulls records with email, marketing, billing, and support systems so customer data stays consistent across the stack.',
      },
      {
        q: 'Why document CRM architecture before a migration?',
        a: 'A clear diagram exposes every integration and data dependency, reducing the risk of broken automations or lost records when switching or upgrading platforms.',
      },
    ],
    useCases: [
      'CRM implementations',
      'System migrations',
      'Integration scoping',
      'RevOps documentation',
      'Solution architecture reviews',
    ],
    category: 'sales-crm',
    categoryName: 'Sales & CRM',
  },
  {
    slug: 'sales-funnel-conversion-diagram',
    title: 'Sales Funnel Conversion Diagram',
    shortDescription:
      'Track volume and conversion rate at every funnel stage from visitor to customer',
    longDescription:
      'A sales funnel conversion diagram shows how raw traffic narrows into paying customers and the conversion rate at each step. The central funnel connects stages such as visitors, leads, marketing-qualified leads, sales-qualified leads, opportunities, and customers, each labeled with volume and the percentage that advances.\n\nGrowth marketers, RevOps, and founders use a conversion funnel to find the leakiest stage, model the impact of a lift in any single conversion rate, and benchmark performance over time. By exposing where prospects drop off, it turns a vague pipeline into a measurable system that pinpoints exactly where to invest to grow revenue.',
    tags: [
      'sales funnel',
      'conversion rate',
      'funnel analysis',
      'growth',
      'revops',
      'conversion optimization',
      'funnel metrics',
    ],
    keywords: [
      'sales funnel conversion diagram',
      'conversion funnel chart',
      'funnel conversion rates',
      'sales funnel stages',
      'funnel drop-off analysis',
      'conversion funnel template',
    ],
    layout: 'hub',
    centerLabel: 'Conversion Funnel',
    centerIcon: 'layers',
    satellites: [
      {
        label: 'Website Visitors',
        icon: 'web',
      },
      {
        label: 'Leads Captured',
        icon: 'search',
      },
      {
        label: 'Marketing Qualified',
        icon: 'process',
      },
      {
        label: 'Sales Qualified',
        icon: 'chat',
      },
      {
        label: 'Opportunities',
        icon: 'process',
      },
      {
        label: 'Customers Won',
        icon: 'database',
      },
    ],
    faqs: [
      {
        q: 'What is a sales funnel conversion diagram?',
        a: 'It is a stage-by-stage view of how traffic converts into customers, showing the volume and conversion rate at each step from visitor to closed deal.',
      },
      {
        q: 'What conversion rates should a funnel track?',
        a: 'Track visitor-to-lead, lead-to-MQL, MQL-to-SQL, SQL-to-opportunity, and opportunity-to-customer rates to see where prospects drop off most.',
      },
      {
        q: 'How is a conversion funnel different from a pipeline?',
        a: 'A funnel emphasizes aggregate volume and percentage conversion between stages, while a pipeline tracks individual active deals and the actions to advance each.',
      },
      {
        q: 'How do you improve a leaky funnel?',
        a: 'Find the stage with the steepest drop, then test targeted fixes like better qualification, faster follow-up, or clearer offers, and remeasure the rate.',
      },
    ],
    useCases: [
      'Funnel performance reviews',
      'Conversion rate optimization',
      'Growth modeling and benchmarking',
      'Marketing-sales reporting',
      'Board and investor updates',
    ],
    category: 'sales-crm',
    categoryName: 'Sales & CRM',
  },
  {
    slug: 'account-based-marketing-flow-diagram',
    title: 'Account-Based Marketing Flow Diagram',
    shortDescription:
      'Map the ABM process from target account selection to sales handoff',
    longDescription:
      'An account-based marketing flow diagram maps how teams target, engage, and convert high-value accounts. The central flow connects steps including ideal customer profile definition, target account selection, buying-committee mapping, personalized multichannel campaigns, sales and marketing orchestration, and pipeline measurement.\n\nABM marketers and enterprise sales teams use this flow to coordinate one-to-few and one-to-one programs, align messaging across the buying committee, and prove account-level ROI. It clarifies who owns each step, how marketing and sales hand off engaged accounts, and which intent signals trigger personalized outreach, replacing spray-and-pray tactics with focused, revenue-aligned campaigns.',
    tags: [
      'account-based marketing',
      'abm',
      'enterprise sales',
      'demand gen',
      'icp',
      'buying committee',
      'marketing strategy',
    ],
    keywords: [
      'account-based marketing flow diagram',
      'abm process diagram',
      'abm strategy framework',
      'target account flow',
      'abm campaign workflow',
      'account based selling diagram',
    ],
    layout: 'hub',
    centerLabel: 'ABM Flow',
    centerIcon: 'automation',
    satellites: [
      {
        label: 'Define ICP',
        icon: 'process',
      },
      {
        label: 'Select Target Accounts',
        icon: 'search',
      },
      {
        label: 'Map Buying Committee',
        icon: 'layers',
      },
      {
        label: 'Personalized Campaigns',
        icon: 'social',
      },
      {
        label: 'Sales & Marketing Orchestration',
        icon: 'chat',
      },
      {
        label: 'Intent Signals',
        icon: 'search',
      },
      {
        label: 'Pipeline Measurement',
        icon: 'database',
      },
    ],
    faqs: [
      {
        q: 'What is an account-based marketing flow?',
        a: 'It is the structured process of selecting high-value target accounts, mapping their buying committee, and running coordinated personalized campaigns to convert them.',
      },
      {
        q: 'What are the steps in an ABM process?',
        a: 'Define your ICP, select target accounts, map the buying committee, run personalized campaigns, orchestrate sales and marketing, and measure account-level pipeline.',
      },
      {
        q: 'How is ABM different from traditional lead generation?',
        a: 'Lead gen casts a wide net to capture many leads, while ABM focuses resources on a defined list of high-value accounts with tailored, multi-stakeholder outreach.',
      },
      {
        q: 'How do sales and marketing align in ABM?',
        a: 'They share a target account list and agree on roles, with marketing warming accounts and signaling intent so sales engages the right contacts at the right time.',
      },
    ],
    useCases: [
      'Enterprise campaign planning',
      'Sales and marketing alignment',
      'Target account strategy',
      'ABM program rollout',
      'Pipeline ROI reporting',
    ],
    category: 'sales-crm',
    categoryName: 'Sales & CRM',
  },
  {
    slug: 'sales-team-org-chart-diagram',
    title: 'Sales Team Org Chart Diagram',
    shortDescription:
      'Show the reporting structure of a sales organization from CRO to reps',
    longDescription:
      'A sales team org chart diagram lays out the reporting hierarchy of a sales organization. The root is the chief revenue officer, branching into functions such as sales development, account executives, sales engineering, RevOps, and customer success, each with managers and the individual contributors who report to them.\n\nSales leaders, HR, and operations teams use a sales org chart when planning headcount, designing territories, and onboarding new hires. It clarifies who owns each segment, how SDRs hand off to AEs, and where support functions like RevOps and enablement sit, giving the whole company a clear picture of how the revenue team is structured and scaled.',
    tags: [
      'sales org chart',
      'org structure',
      'sales team',
      'reporting hierarchy',
      'cro',
      'revops',
      'headcount planning',
    ],
    keywords: [
      'sales team org chart diagram',
      'sales organization structure',
      'sales department hierarchy',
      'cro org chart',
      'sales team structure template',
      'revenue org chart',
    ],
    layout: 'tree',
    centerLabel: 'Chief Revenue Officer',
    centerIcon: 'process',
    satellites: [
      {
        label: 'VP of Sales',
        icon: 'process',
      },
      {
        label: 'Sales Development (SDR)',
        icon: 'chat',
      },
      {
        label: 'Account Executives',
        icon: 'process',
      },
      {
        label: 'Sales Engineering',
        icon: 'cloud',
      },
      {
        label: 'RevOps',
        icon: 'automation',
      },
      {
        label: 'Customer Success',
        icon: 'social',
      },
      {
        label: 'Sales Enablement',
        icon: 'search',
      },
    ],
    treeChildren: [
      {
        label: 'VP of Sales',
        icon: 'process',
        children: [
          {
            label: 'Sales Development (SDR)',
            icon: 'chat',
          },
          {
            label: 'Account Executives',
            icon: 'process',
          },
          {
            label: 'Sales Engineering',
            icon: 'cloud',
          },
        ],
      },
      {
        label: 'VP of Revenue Operations',
        icon: 'automation',
        children: [
          {
            label: 'RevOps',
            icon: 'automation',
          },
          {
            label: 'Sales Enablement',
            icon: 'search',
          },
        ],
      },
      {
        label: 'VP of Customer Success',
        icon: 'social',
        children: [
          {
            label: 'Customer Success',
            icon: 'social',
          },
        ],
      },
    ],
    faqs: [
      {
        q: 'What is a sales team org chart?',
        a: 'It is a hierarchy diagram showing how a sales organization is structured, from the CRO down through managers to individual reps and support functions.',
      },
      {
        q: 'What roles belong in a sales org chart?',
        a: 'Common roles include the CRO, VP of Sales, SDRs, account executives, sales engineers, RevOps, sales enablement, and customer success.',
      },
      {
        q: 'How are SDRs and AEs related in the structure?',
        a: 'SDRs typically generate and qualify leads, then hand them to account executives who own the deal through to close, often reporting under the same VP of Sales.',
      },
      {
        q: 'Why use an org chart for sales planning?',
        a: 'It clarifies ownership and reporting lines, making it easier to plan headcount, design territories, and onboard new hires into the right team.',
      },
    ],
    useCases: [
      'Headcount planning',
      'Territory design',
      'New hire onboarding',
      'Org restructuring',
      'Company-wide alignment decks',
    ],
    category: 'sales-crm',
    categoryName: 'Sales & CRM',
  },
  {
    slug: 'product-roadmap-diagram',
    title: 'Product Roadmap Diagram',
    shortDescription:
      'A timeline view of product themes, releases, and milestones across upcoming quarters',
    longDescription:
      'A product roadmap diagram lays out where a product is headed, organizing planned work into time horizons and strategic themes. Its core parts include a Now/Next/Later structure or quarterly columns, prioritized epics, target release milestones, dependencies between initiatives, and the goals each bet is meant to drive.\n\nProduct managers, founders, and design leads use a product roadmap to align engineering, sales, and leadership on priorities and timing. It anchors quarterly planning sessions, stakeholder reviews, and investor updates, turning a backlog of ideas into a clear, shareable roadmap that communicates sequence and intent.',
    tags: [
      'product roadmap',
      'roadmap',
      'product management',
      'planning',
      'quarterly',
      'milestones',
      'strategy',
    ],
    keywords: [
      'product roadmap diagram',
      'product roadmap template',
      'now next later roadmap',
      'quarterly roadmap chart',
      'product planning diagram',
    ],
    layout: 'hub',
    centerLabel: 'Product Roadmap',
    centerIcon: 'process',
    satellites: [
      {
        label: 'Now (Current Quarter)',
        icon: 'process',
      },
      {
        label: 'Next (Q2)',
        icon: 'layers',
      },
      {
        label: 'Later (H2)',
        icon: 'search',
      },
      {
        label: 'Prioritized Epics',
        icon: 'layers',
      },
      {
        label: 'Release Milestones',
        icon: 'automation',
      },
      {
        label: 'Dependencies',
        icon: 'process',
      },
      {
        label: 'Goals & OKRs',
        icon: 'search',
      },
    ],
    faqs: [
      {
        q: 'What is a product roadmap diagram?',
        a: 'It is a visual plan that maps product initiatives across time horizons or quarters, showing what is being built, when, and why. It connects strategic goals to specific releases and epics.',
      },
      {
        q: 'What are the components of a product roadmap?',
        a: 'Common components are time horizons (Now/Next/Later or quarters), prioritized epics or features, release milestones, dependencies, and the goals or OKRs each initiative supports.',
      },
      {
        q: 'How do I make a product roadmap?',
        a: 'Start with your strategic goals, group planned work into themes, place each theme into a time horizon based on priority and capacity, then mark milestones and dependencies between items.',
      },
      {
        q: 'What is the difference between Now/Next/Later and a quarterly roadmap?',
        a: 'Now/Next/Later avoids hard dates and signals relative priority, which suits uncertain plans. A quarterly roadmap commits work to specific time windows and is better for coordinated cross-team delivery.',
      },
    ],
    useCases: [
      'Quarterly planning',
      'Stakeholder alignment',
      'Investor updates',
      'Sprint kickoff decks',
      'Customer-facing roadmaps',
    ],
    category: 'product',
    categoryName: 'Product & UX',
  },
  {
    slug: 'user-onboarding-flow-diagram',
    title: 'User Onboarding Flow Diagram',
    shortDescription:
      'The step-by-step path new users take from signup to their first activation moment',
    longDescription:
      'A user onboarding flow diagram maps the journey a new user takes from landing or signup through to their first meaningful win, often called the activation or aha moment. Its key parts include the signup screen, email or account verification, a guided setup or product tour, the first core action, and the prompts or nudges that reduce friction along the way.\n\nProduct designers, growth teams, and PMs use a user onboarding flow to find drop-off points, lift activation rates, and shorten time-to-value. It is essential when designing a new signup experience, running onboarding experiments, or documenting the flow for engineering and support so everyone shares one source of truth.',
    tags: [
      'onboarding',
      'user onboarding',
      'activation',
      'signup flow',
      'ux',
      'growth',
      'user flow',
    ],
    keywords: [
      'user onboarding flow',
      'user onboarding diagram',
      'signup flow template',
      'onboarding flow chart',
      'new user activation flow',
    ],
    layout: 'hub',
    centerLabel: 'User Onboarding Flow',
    centerIcon: 'process',
    satellites: [
      {
        label: 'Signup Screen',
        icon: 'web',
      },
      {
        label: 'Email Verification',
        icon: 'mail',
      },
      {
        label: 'Welcome / Profile Setup',
        icon: 'process',
      },
      {
        label: 'Guided Product Tour',
        icon: 'bot',
      },
      {
        label: 'First Core Action',
        icon: 'automation',
      },
      {
        label: 'Activation Moment',
        icon: 'search',
      },
      {
        label: 'Re-engagement Nudges',
        icon: 'chat',
      },
    ],
    faqs: [
      {
        q: 'What is a user onboarding flow?',
        a: 'It is the sequence of screens and steps a new user moves through from signup to their first successful use of the product. The goal is to reach the activation moment as quickly and clearly as possible.',
      },
      {
        q: 'What are the stages of user onboarding?',
        a: 'Typical stages are signup, verification, profile or product setup, a guided tour or empty-state prompts, the first core action, and the activation moment, followed by re-engagement nudges.',
      },
      {
        q: 'How do I improve my onboarding flow?',
        a: 'Track where users drop off, remove non-essential steps before the first value moment, add contextual guidance, and run A/B tests on the order and copy of each step.',
      },
      {
        q: 'What is the activation moment?',
        a: 'It is the point where a new user first experiences the core value of the product, such as creating their first project or sending their first message. It strongly predicts retention.',
      },
    ],
    useCases: [
      'Onboarding redesign',
      'Activation experiments',
      'Engineering specs',
      'Support documentation',
      'Growth reviews',
    ],
    category: 'product',
    categoryName: 'Product & UX',
  },
  {
    slug: 'user-journey-map-diagram',
    title: 'User Journey Map Diagram',
    shortDescription:
      'A stage-by-stage map of user actions, thoughts, and pain points across an experience',
    longDescription:
      "A user journey map diagram visualizes the end-to-end experience a customer has with a product or service, broken into stages such as Awareness, Consideration, Onboarding, Usage, and Advocacy. At each stage it captures the user's actions, touchpoints, emotions, and pain points, plus the opportunities a team can act on to improve the experience.\n\nUX researchers, designers, and product teams use a journey map to build empathy, surface friction, and align stakeholders around real user needs. It is created during discovery, after research interviews, or before a redesign, connecting qualitative insight to concrete product decisions across the whole experience.",
    tags: [
      'user journey',
      'journey map',
      'customer journey',
      'ux research',
      'experience map',
      'touchpoints',
      'personas',
    ],
    keywords: [
      'user journey map',
      'customer journey map template',
      'user journey diagram',
      'experience map',
      'journey mapping stages',
    ],
    layout: 'hub',
    centerLabel: 'User Journey Map',
    centerIcon: 'search',
    satellites: [
      {
        label: 'Awareness',
        icon: 'social',
      },
      {
        label: 'Consideration',
        icon: 'search',
      },
      {
        label: 'Onboarding',
        icon: 'process',
      },
      {
        label: 'Active Usage',
        icon: 'web',
      },
      {
        label: 'Touchpoints',
        icon: 'chat',
      },
      {
        label: 'Pain Points',
        icon: 'layers',
      },
      {
        label: 'Advocacy',
        icon: 'social',
      },
    ],
    faqs: [
      {
        q: 'What is a user journey map?',
        a: "It is a visualization of the stages a user goes through when interacting with a product, capturing their actions, emotions, touchpoints, and pain points at each step. It helps teams see the experience from the user's perspective.",
      },
      {
        q: 'What are the components of a journey map?',
        a: 'A journey map usually includes stages or phases, user actions, touchpoints, thoughts and emotions, pain points, and improvement opportunities, often tied to a specific persona.',
      },
      {
        q: 'How is a journey map different from a user flow?',
        a: 'A journey map is broad and experience-focused, covering emotions and multiple channels across stages. A user flow is narrower and screen-by-screen, focused on the steps to complete a specific task.',
      },
      {
        q: 'When should I create a user journey map?',
        a: 'Create one during discovery or after user research, before a redesign, or whenever a team needs a shared understanding of the customer experience and its biggest friction points.',
      },
    ],
    useCases: [
      'UX research synthesis',
      'Redesign discovery',
      'Stakeholder workshops',
      'Service design',
      'Persona alignment',
    ],
    category: 'product',
    categoryName: 'Product & UX',
  },
  {
    slug: 'design-system-diagram',
    title: 'Design System Diagram',
    shortDescription:
      'How design tokens, components, and patterns connect across a shared UI library',
    longDescription:
      "A design system diagram shows how the building blocks of a product's interface fit together, from low-level foundations up to shipped patterns. Its core parts include design tokens for color, typography, and spacing, reusable components like buttons and inputs, composite patterns, documentation guidelines, and the shared library that syncs design tools with production code.\n\nDesign system teams, frontend engineers, and product designers use this diagram to communicate structure, governance, and the relationship between Figma and code. It is invaluable when onboarding contributors, planning a component library, or explaining how tokens cascade into components so teams stay consistent.",
    tags: [
      'design system',
      'design tokens',
      'component library',
      'ui library',
      'figma',
      'frontend',
      'ux',
    ],
    keywords: [
      'design system diagram',
      'design system architecture',
      'component library structure',
      'design tokens diagram',
      'design system template',
    ],
    layout: 'hub',
    centerLabel: 'Design System',
    centerIcon: 'layers',
    satellites: [
      {
        label: 'Design Tokens',
        icon: 'layers',
      },
      {
        label: 'Core Components',
        icon: 'web',
      },
      {
        label: 'Composite Patterns',
        icon: 'process',
      },
      {
        label: 'Figma Library',
        icon: 'drive',
      },
      {
        label: 'Code Component Library',
        icon: 'cloud',
      },
      {
        label: 'Documentation Site',
        icon: 'search',
      },
      {
        label: 'Governance & Contribution',
        icon: 'automation',
      },
    ],
    faqs: [
      {
        q: 'What is a design system diagram?',
        a: 'It is a visual map of how a design system is structured, showing how tokens feed into components, components into patterns, and how design tools stay in sync with production code.',
      },
      {
        q: 'What are the components of a design system?',
        a: 'A design system typically includes design tokens, reusable components, composite patterns, usage documentation, a Figma library, a code library, and a governance or contribution process.',
      },
      {
        q: 'What are design tokens?',
        a: 'Design tokens are named values for visual properties like colors, spacing, and typography. They act as a single source of truth that cascades into components in both design tools and code.',
      },
      {
        q: 'How do design and code stay in sync?',
        a: 'Teams keep a shared library where tokens and component specs map one-to-one between Figma and the code library, often automated with token pipelines so a change updates both sides.',
      },
    ],
    useCases: [
      'Design system onboarding',
      'Component library planning',
      'Engineering and design alignment',
      'Governance documentation',
      'Architecture reviews',
    ],
    category: 'product',
    categoryName: 'Product & UX',
  },
  {
    slug: 'ab-testing-workflow-diagram',
    title: 'A/B Testing Workflow Diagram',
    shortDescription:
      'The experiment lifecycle from hypothesis to traffic split to statistical decision',
    longDescription:
      'An A/B testing workflow diagram outlines the lifecycle of a controlled experiment, from forming a hypothesis to shipping a winning variant. Its key steps include defining a hypothesis and success metric, building control and variant experiences, splitting traffic, collecting data through an analytics pipeline, checking statistical significance, and deciding whether to roll out, iterate, or roll back.\n\nGrowth teams, PMs, and experimentation engineers use an A/B testing workflow to make evidence-based product decisions instead of shipping on gut feel. It is the backbone of conversion optimization programs and feature launches, keeping experiments rigorous and results trustworthy from one run to the next.',
    tags: [
      'a/b testing',
      'experimentation',
      'conversion optimization',
      'split testing',
      'analytics',
      'growth',
      'statistics',
    ],
    keywords: [
      'a/b testing workflow',
      'a/b test diagram',
      'experimentation process',
      'split testing flow',
      'conversion testing workflow',
    ],
    layout: 'hub',
    centerLabel: 'A/B Testing Workflow',
    centerIcon: 'automation',
    satellites: [
      {
        label: 'Hypothesis & Metric',
        icon: 'search',
      },
      {
        label: 'Control (A)',
        icon: 'web',
      },
      {
        label: 'Variant (B)',
        icon: 'web',
      },
      {
        label: 'Traffic Split',
        icon: 'process',
      },
      {
        label: 'Analytics Pipeline',
        icon: 'database',
      },
      {
        label: 'Significance Check',
        icon: 'search',
      },
      {
        label: 'Ship / Rollback',
        icon: 'automation',
      },
    ],
    faqs: [
      {
        q: 'What is an A/B testing workflow?',
        a: 'It is the repeatable process for running a controlled experiment: form a hypothesis, build a control and variant, split traffic between them, measure results, and decide based on statistical significance.',
      },
      {
        q: 'What are the steps of an A/B test?',
        a: 'The steps are defining a hypothesis and success metric, creating the control and variant, randomly splitting traffic, collecting data, checking for statistical significance, and shipping or rolling back the change.',
      },
      {
        q: 'What is statistical significance in A/B testing?',
        a: 'It is the confidence that an observed difference between variants is real and not due to random chance, commonly judged with a p-value below 0.05 or a confidence interval that excludes zero.',
      },
      {
        q: 'How long should an A/B test run?',
        a: 'Run a test until it reaches a pre-calculated sample size and covers full business cycles, typically at least one to two weeks, to avoid stopping early on noisy results.',
      },
    ],
    useCases: [
      'Conversion optimization',
      'Feature launch validation',
      'Growth experiments',
      'Pricing tests',
      'Experimentation onboarding',
    ],
    category: 'product',
    categoryName: 'Product & UX',
  },
  {
    slug: 'feature-prioritization-matrix-diagram',
    title: 'Feature Prioritization Matrix Diagram',
    shortDescription:
      'How candidate features rank by impact, effort, and confidence in a scoring framework',
    longDescription:
      'A feature prioritization matrix diagram shows how a team decides what to build next by scoring candidate features against shared criteria. Its core parts include the inputs of reach, impact, confidence, and effort, scoring frameworks like RICE or value-versus-effort, the resulting priority ranking, and the cut line that separates committed work from the backlog.\n\nProduct managers and product leaders use a prioritization matrix to defend roadmap choices with logic instead of opinion and to keep stakeholders aligned. It is used during backlog grooming, quarterly planning, and trade-off discussions, turning a long wish list into a focused, defensible build order.',
    tags: [
      'prioritization',
      'feature prioritization',
      'rice scoring',
      'product management',
      'backlog',
      'roadmap',
      'impact effort',
    ],
    keywords: [
      'feature prioritization matrix',
      'rice scoring diagram',
      'impact effort matrix',
      'prioritization framework template',
      'product prioritization diagram',
    ],
    layout: 'hub',
    centerLabel: 'Prioritization Matrix',
    centerIcon: 'search',
    satellites: [
      {
        label: 'Reach',
        icon: 'social',
      },
      {
        label: 'Impact',
        icon: 'search',
      },
      {
        label: 'Confidence',
        icon: 'process',
      },
      {
        label: 'Effort',
        icon: 'automation',
      },
      {
        label: 'RICE Score',
        icon: 'layers',
      },
      {
        label: 'Priority Ranking',
        icon: 'layers',
      },
      {
        label: 'Backlog vs Committed',
        icon: 'database',
      },
    ],
    faqs: [
      {
        q: 'What is a feature prioritization matrix?',
        a: 'It is a framework that scores candidate features against criteria like reach, impact, confidence, and effort, producing a ranked order so teams can decide what to build first with shared logic.',
      },
      {
        q: 'What is RICE scoring?',
        a: 'RICE scores each feature on Reach, Impact, and Confidence, then divides by Effort. The resulting number lets you rank features objectively and compare very different ideas on one scale.',
      },
      {
        q: 'What is an impact-effort matrix?',
        a: 'It is a simple 2x2 grid that plots features by their expected impact against the effort required, highlighting high-impact, low-effort quick wins versus low-value time sinks.',
      },
      {
        q: 'When should I use a prioritization matrix?',
        a: 'Use one during backlog grooming, quarterly planning, or any trade-off discussion where you have more ideas than capacity and need a transparent way to choose.',
      },
    ],
    useCases: [
      'Backlog grooming',
      'Quarterly planning',
      'Roadmap trade-offs',
      'Stakeholder alignment',
      'Sprint planning',
    ],
    category: 'product',
    categoryName: 'Product & UX',
  },
  {
    slug: 'information-architecture-diagram',
    title: 'Information Architecture Diagram',
    shortDescription:
      "The hierarchy of pages and sections that organizes a product or website's navigation",
    longDescription:
      'An information architecture diagram, sometimes called a site map, shows how content and screens are organized into a navigable hierarchy. Starting from the home or root, it branches into top-level sections like Dashboard, Products, Account, and Support, each containing nested pages and views that define how users find and move between content.\n\nUX designers, content strategists, and product teams use an information architecture diagram to plan navigation, validate findability with card sorting, and align engineering on routing structure. It is built early in a project or before a redesign, turning scattered content into a clear, intuitive structure.',
    tags: [
      'information architecture',
      'site map',
      'navigation',
      'ux',
      'content strategy',
      'hierarchy',
      'wireframe',
    ],
    keywords: [
      'information architecture diagram',
      'site map template',
      'website navigation diagram',
      'ia diagram',
      'app structure diagram',
    ],
    layout: 'tree',
    centerLabel: 'Home / Root',
    centerIcon: 'web',
    satellites: [
      {
        label: 'Dashboard',
        icon: 'search',
      },
      {
        label: 'Products',
        icon: 'layers',
      },
      {
        label: 'Account',
        icon: 'process',
      },
      {
        label: 'Support',
        icon: 'chat',
      },
      {
        label: 'Settings',
        icon: 'automation',
      },
      {
        label: 'Product Detail',
        icon: 'web',
      },
      {
        label: 'Billing',
        icon: 'database',
      },
    ],
    treeChildren: [
      {
        label: 'Dashboard',
        icon: 'search',
        children: [
          {
            label: 'Overview',
            icon: 'search',
          },
          {
            label: 'Reports',
            icon: 'layers',
          },
        ],
      },
      {
        label: 'Products',
        icon: 'layers',
        children: [
          {
            label: 'Catalog',
            icon: 'layers',
          },
          {
            label: 'Product Detail',
            icon: 'web',
          },
        ],
      },
      {
        label: 'Account',
        icon: 'process',
        children: [
          {
            label: 'Profile',
            icon: 'process',
          },
          {
            label: 'Settings',
            icon: 'automation',
          },
          {
            label: 'Billing',
            icon: 'database',
          },
        ],
      },
      {
        label: 'Support',
        icon: 'chat',
        children: [
          {
            label: 'Help Center',
            icon: 'search',
          },
          {
            label: 'Contact',
            icon: 'mail',
          },
        ],
      },
    ],
    faqs: [
      {
        q: 'What is an information architecture diagram?',
        a: "It is a hierarchical map of a product or website's pages and sections, showing how content is grouped and how users navigate from the home screen down to detailed views.",
      },
      {
        q: 'What is the difference between IA and a site map?',
        a: 'A site map is one common output of information architecture, focusing on the page hierarchy. Information architecture is the broader practice of organizing, labeling, and structuring content for findability.',
      },
      {
        q: 'How do I create an information architecture?',
        a: 'Inventory your content, group related items into top-level sections, label them in user-friendly terms, then validate the structure with techniques like card sorting and tree testing.',
      },
      {
        q: 'Why does information architecture matter?',
        a: 'Good IA makes content easy to find and navigation intuitive, which reduces user confusion and support load. Poor IA leads to dead ends, duplicated pages, and frustrated users.',
      },
    ],
    useCases: [
      'Site map planning',
      'Navigation redesign',
      'Card sorting synthesis',
      'Routing specs',
      'Content audits',
    ],
    category: 'product',
    categoryName: 'Product & UX',
  },
  {
    slug: 'ci-cd-pipeline-diagram',
    title: 'CI/CD Pipeline Diagram',
    shortDescription:
      'Visualize code flowing from commit through build, test, and automated deployment stages',
    longDescription:
      'A CI/CD pipeline diagram maps the automated path code takes from a developer commit to production. It shows source control triggers, a build step that compiles and packages artifacts, automated test suites, a registry that stores container images, and the deploy stages that ship to staging and production. Arrows make the gates and feedback loops between each stage explicit.\n\nPlatform engineers, DevOps teams, and backend developers reach for this diagram to document delivery flow, onboard new engineers, and debug failing builds. It anchors architecture reviews, runbooks, and continuous delivery docs for teams running GitHub Actions, Jenkins, or GitLab CI.',
    tags: [
      'ci/cd',
      'pipeline',
      'devops',
      'deployment',
      'automation',
      'continuous delivery',
      'build',
    ],
    keywords: [
      'ci/cd pipeline diagram',
      'continuous integration diagram',
      'deployment pipeline diagram',
      'github actions pipeline',
      'ci cd workflow diagram',
    ],
    layout: 'hub',
    centerLabel: 'CI/CD Pipeline',
    centerIcon: 'automation',
    satellites: [
      {
        label: 'Git Commit / Push',
        icon: 'process',
      },
      {
        label: 'Build & Compile',
        icon: 'automation',
      },
      {
        label: 'Automated Tests',
        icon: 'search',
      },
      {
        label: 'Container Registry',
        icon: 'drive',
      },
      {
        label: 'Deploy to Staging',
        icon: 'cloud',
      },
      {
        label: 'Deploy to Production',
        icon: 'cloud',
      },
      {
        label: 'Slack Notification',
        icon: 'chat',
      },
    ],
    faqs: [
      {
        q: 'What is a CI/CD pipeline?',
        a: 'A CI/CD pipeline is an automated workflow that builds, tests, and deploys code every time a change is committed, removing manual steps from software delivery.',
      },
      {
        q: 'What are the stages of a CI/CD pipeline?',
        a: 'Typical stages are source/commit, build, automated test, artifact storage, and deploy to staging then production, often with manual approval gates between environments.',
      },
      {
        q: 'What is the difference between CI and CD?',
        a: 'Continuous Integration focuses on merging and testing code frequently, while Continuous Delivery/Deployment automates releasing that tested code to environments.',
      },
      {
        q: 'Which tools run CI/CD pipelines?',
        a: 'Common tools include GitHub Actions, GitLab CI, Jenkins, CircleCI, and Argo CD, often paired with a container registry like Docker Hub or ECR.',
      },
    ],
    useCases: [
      'Engineering onboarding docs',
      'Architecture review decks',
      'DevOps runbooks',
      'Release process documentation',
      'Incident postmortems',
    ],
    category: 'devops-cloud',
    categoryName: 'DevOps & Cloud',
  },
  {
    slug: 'kubernetes-architecture-diagram',
    title: 'Kubernetes Architecture Diagram',
    shortDescription:
      'Show the Kubernetes control plane and worker node components and how they connect',
    longDescription:
      "A Kubernetes architecture diagram lays out the cluster's control plane and worker nodes. The control plane includes the API server, etcd key-value store, scheduler, and controller manager, while worker nodes run the kubelet, container runtime, and kube-proxy to host pods. The diagram clarifies how scheduling decisions and cluster state flow between these components.\n\nCloud architects, SREs, and engineers learning Kubernetes use it to explain cluster internals, plan capacity, and onboard teams to container orchestration. It is common in platform documentation, certification study guides, and architecture proposals for managed clusters like EKS, GKE, or AKS.",
    tags: [
      'kubernetes',
      'k8s',
      'container orchestration',
      'cloud native',
      'architecture',
      'control plane',
      'devops',
    ],
    keywords: [
      'kubernetes architecture diagram',
      'k8s cluster diagram',
      'kubernetes control plane diagram',
      'container orchestration diagram',
      'kubernetes components diagram',
    ],
    layout: 'hub',
    centerLabel: 'Kubernetes Cluster',
    centerIcon: 'cloud',
    satellites: [
      {
        label: 'API Server',
        icon: 'cloud',
      },
      {
        label: 'etcd',
        icon: 'database',
      },
      {
        label: 'Scheduler',
        icon: 'process',
      },
      {
        label: 'Controller Manager',
        icon: 'process',
      },
      {
        label: 'Kubelet (Worker Node)',
        icon: 'automation',
      },
      {
        label: 'Pods / Containers',
        icon: 'layers',
      },
      {
        label: 'kube-proxy',
        icon: 'process',
      },
    ],
    faqs: [
      {
        q: 'What is Kubernetes architecture?',
        a: 'Kubernetes architecture is a control plane that manages cluster state plus worker nodes that run application pods, coordinated through the API server.',
      },
      {
        q: 'What are the main components of Kubernetes?',
        a: 'The core components are the API server, etcd, scheduler, controller manager on the control plane, and kubelet, kube-proxy, and a container runtime on each worker node.',
      },
      {
        q: 'What does etcd do in Kubernetes?',
        a: 'etcd is the distributed key-value store that holds all cluster state and configuration, acting as the single source of truth for the control plane.',
      },
      {
        q: 'How do pods get scheduled?',
        a: 'The scheduler watches for unassigned pods and selects a suitable worker node based on resource requests, constraints, and affinity rules, then the kubelet starts them.',
      },
    ],
    useCases: [
      'Cloud architecture proposals',
      'Kubernetes certification study',
      'Platform onboarding',
      'SRE documentation',
      'Technical training slides',
    ],
    category: 'devops-cloud',
    categoryName: 'DevOps & Cloud',
  },
  {
    slug: 'gitops-workflow-diagram',
    title: 'GitOps Workflow Diagram',
    shortDescription:
      'Map the Git-driven deployment loop where a repo is the source of truth for infrastructure',
    longDescription:
      'A GitOps workflow diagram shows how a Git repository becomes the single source of truth for declarative infrastructure and deployments. It traces a developer pull request, the merge into the main branch, a GitOps operator like Argo CD or Flux detecting the change, and the reconciliation loop that syncs live cluster state to match the repo. Drift detection and rollback paths are included.\n\nPlatform and DevOps teams use it to explain pull-based delivery, audit deployment history, and justify reconciliation over manual kubectl. It is valuable in cloud-native migration plans, internal platform docs, and reliability reviews where the deployment model itself needs to be communicated.',
    tags: [
      'gitops',
      'argo cd',
      'flux',
      'declarative',
      'deployment',
      'kubernetes',
      'devops',
      'automation',
    ],
    keywords: [
      'gitops workflow diagram',
      'argo cd diagram',
      'gitops deployment diagram',
      'flux gitops diagram',
      'pull based deployment diagram',
    ],
    layout: 'hub',
    centerLabel: 'GitOps Reconciliation Loop',
    centerIcon: 'automation',
    satellites: [
      {
        label: 'Pull Request',
        icon: 'process',
      },
      {
        label: 'Git Repository (Source of Truth)',
        icon: 'drive',
      },
      {
        label: 'Merge to Main',
        icon: 'process',
      },
      {
        label: 'GitOps Operator (Argo CD)',
        icon: 'automation',
      },
      {
        label: 'Kubernetes Cluster',
        icon: 'cloud',
      },
      {
        label: 'Drift Detection',
        icon: 'search',
      },
      {
        label: 'Automated Rollback',
        icon: 'process',
      },
    ],
    faqs: [
      {
        q: 'What is GitOps?',
        a: 'GitOps is a deployment practice where the desired state of infrastructure is stored in Git, and an automated operator continuously syncs the live environment to match it.',
      },
      {
        q: 'How does a GitOps workflow work?',
        a: 'Developers commit declarative manifests to Git, an operator like Argo CD or Flux detects the change, and a reconciliation loop applies it to the cluster, correcting any drift.',
      },
      {
        q: 'What is the difference between GitOps and CI/CD?',
        a: 'CI/CD pushes changes out from a pipeline, while GitOps uses a pull model where an in-cluster operator pulls the desired state from Git and reconciles it.',
      },
      {
        q: 'What tools are used for GitOps?',
        a: 'The most common GitOps tools are Argo CD and Flux, usually paired with Kubernetes and a Git provider like GitHub or GitLab.',
      },
    ],
    useCases: [
      'Cloud-native migration plans',
      'Platform engineering docs',
      'Reliability reviews',
      'DevOps training',
      'Deployment audit trails',
    ],
    category: 'devops-cloud',
    categoryName: 'DevOps & Cloud',
  },
  {
    slug: 'monitoring-observability-stack-diagram',
    title: 'Monitoring & Observability Stack Diagram',
    shortDescription:
      'Show how metrics, logs, and alerts flow from services into dashboards and on-call paging',
    longDescription:
      'A monitoring stack diagram illustrates how observability data moves from running services to actionable insight. It shows exporters and agents scraping metrics, a time-series database like Prometheus storing them, a log pipeline, dashboards in Grafana, distributed tracing, and an alerting layer that pages on-call engineers. The flow makes the path from raw telemetry to alert clear.\n\nSREs, DevOps engineers, and platform teams use it to document observability tooling, plan alerting strategy, and onboard on-call rotations. It appears in reliability runbooks, observability proposals, and incident-readiness reviews built on stacks like Prometheus, Grafana, and Loki.',
    tags: [
      'monitoring',
      'observability',
      'prometheus',
      'grafana',
      'alerting',
      'metrics',
      'devops',
      'sre',
    ],
    keywords: [
      'monitoring stack diagram',
      'observability architecture diagram',
      'prometheus grafana diagram',
      'metrics pipeline diagram',
      'alerting stack diagram',
    ],
    layout: 'hub',
    centerLabel: 'Monitoring & Observability Stack',
    centerIcon: 'search',
    satellites: [
      {
        label: 'Metrics Exporters',
        icon: 'process',
      },
      {
        label: 'Prometheus (Time-Series DB)',
        icon: 'database',
      },
      {
        label: 'Log Pipeline (Loki)',
        icon: 'drive',
      },
      {
        label: 'Grafana Dashboards',
        icon: 'search',
      },
      {
        label: 'Alertmanager',
        icon: 'automation',
      },
      {
        label: 'PagerDuty On-Call',
        icon: 'chat',
      },
      {
        label: 'Distributed Tracing',
        icon: 'layers',
      },
    ],
    faqs: [
      {
        q: 'What is a monitoring stack?',
        a: 'A monitoring stack is the set of tools that collect, store, visualize, and alert on metrics, logs, and traces from your systems to keep them observable.',
      },
      {
        q: 'What are the components of an observability stack?',
        a: 'Common components are metric exporters, a time-series database like Prometheus, a log store like Loki, dashboards in Grafana, and an alerting layer such as Alertmanager or PagerDuty.',
      },
      {
        q: 'What is the difference between monitoring and observability?',
        a: 'Monitoring tracks known signals against thresholds, while observability lets you ask new questions about system state using metrics, logs, and traces together.',
      },
      {
        q: 'How do alerts reach on-call engineers?',
        a: 'Alerting rules fire on metric thresholds, route through tools like Alertmanager, and page on-call staff via PagerDuty, Opsgenie, or Slack.',
      },
    ],
    useCases: [
      'Reliability runbooks',
      'Observability proposals',
      'On-call onboarding',
      'Incident readiness reviews',
      'SRE documentation',
    ],
    category: 'devops-cloud',
    categoryName: 'DevOps & Cloud',
  },
  {
    slug: 'microservices-architecture-diagram-devops-cloud',
    title: 'Microservices Architecture Diagram',
    shortDescription:
      'Map independent services linked by an API gateway, message bus, and per-service data stores',
    longDescription:
      'A microservices architecture diagram shows how an application is split into small, independently deployable services. It centers on an API gateway routing client requests to discrete services like auth, orders, and payments, with a message broker for async events and each service owning its own database. The diagram exposes service boundaries and communication paths at a glance.\n\nBackend architects, engineering leads, and cloud teams use it to plan decomposition, document service ownership, and review scaling and resilience. It is a staple of design docs, architecture decision records, and onboarding for distributed systems built on Kubernetes or serverless platforms.',
    tags: [
      'microservices',
      'architecture',
      'api gateway',
      'distributed systems',
      'backend',
      'cloud',
      'event driven',
    ],
    keywords: [
      'microservices architecture diagram',
      'microservice diagram',
      'api gateway architecture diagram',
      'distributed system diagram',
      'service architecture diagram',
    ],
    layout: 'hub',
    centerLabel: 'API Gateway',
    centerIcon: 'cloud',
    satellites: [
      {
        label: 'Auth Service',
        icon: 'process',
      },
      {
        label: 'Orders Service',
        icon: 'process',
      },
      {
        label: 'Payments Service',
        icon: 'process',
      },
      {
        label: 'Message Broker (Kafka)',
        icon: 'automation',
      },
      {
        label: 'Postgres per Service',
        icon: 'database',
      },
      {
        label: 'Redis Cache',
        icon: 'database',
      },
      {
        label: 'Web / Mobile Clients',
        icon: 'web',
      },
    ],
    faqs: [
      {
        q: 'What is microservices architecture?',
        a: 'Microservices architecture structures an application as a set of small, independently deployable services that each own a business capability and communicate over the network.',
      },
      {
        q: 'What are the components of a microservices architecture?',
        a: 'Typical components include an API gateway, individual services, a message broker for async events, per-service databases, and shared infrastructure like caching and service discovery.',
      },
      {
        q: 'Why use an API gateway in microservices?',
        a: 'An API gateway gives clients a single entry point, handling routing, authentication, rate limiting, and aggregation so services stay focused on business logic.',
      },
      {
        q: 'How do microservices communicate?',
        a: 'Services communicate synchronously over HTTP/gRPC through the gateway and asynchronously through a message broker like Kafka or RabbitMQ for event-driven workflows.',
      },
    ],
    useCases: [
      'Architecture design docs',
      'Decomposition planning',
      'Engineering onboarding',
      'Architecture decision records',
      'System design interviews',
    ],
    category: 'devops-cloud',
    categoryName: 'DevOps & Cloud',
  },
  {
    slug: 'aws-cloud-architecture-diagram',
    title: 'AWS Cloud Architecture Diagram',
    shortDescription:
      'Show a typical AWS web app stack from CloudFront and ALB to compute, RDS, and S3',
    longDescription:
      'An AWS cloud architecture diagram visualizes how a web application is deployed across AWS services. It shows edge delivery through CloudFront, traffic distributed by an Application Load Balancer, compute on EC2 or ECS, a managed RDS database, S3 for object storage, and IAM controlling access. The layout clarifies how requests traverse the stack inside a VPC.\n\nCloud architects, solutions engineers, and DevOps teams use it to plan deployments, estimate costs, and pass well-architected reviews. It is essential in client proposals, infrastructure documentation, and migration planning for workloads moving to Amazon Web Services.',
    tags: [
      'aws',
      'cloud architecture',
      'infrastructure',
      'vpc',
      'ec2',
      'rds',
      's3',
      'devops',
    ],
    keywords: [
      'aws architecture diagram',
      'aws cloud architecture diagram',
      'aws infrastructure diagram',
      'aws web app architecture',
      'aws vpc diagram',
    ],
    layout: 'hub',
    centerLabel: 'AWS VPC',
    centerIcon: 'cloud',
    satellites: [
      {
        label: 'CloudFront CDN',
        icon: 'social',
      },
      {
        label: 'Application Load Balancer',
        icon: 'cloud',
      },
      {
        label: 'EC2 / ECS Compute',
        icon: 'process',
      },
      {
        label: 'RDS Database',
        icon: 'database',
      },
      {
        label: 'S3 Object Storage',
        icon: 'drive',
      },
      {
        label: 'IAM Access Control',
        icon: 'layers',
      },
      {
        label: 'CloudWatch Monitoring',
        icon: 'search',
      },
    ],
    faqs: [
      {
        q: 'What is an AWS architecture diagram?',
        a: 'An AWS architecture diagram is a visual map of the AWS services and how they connect to host an application, such as CloudFront, load balancers, compute, databases, and storage.',
      },
      {
        q: 'What are the components of an AWS web app architecture?',
        a: 'A common stack includes CloudFront for edge delivery, an Application Load Balancer, EC2 or ECS compute, RDS for databases, S3 for storage, and IAM for access control, all inside a VPC.',
      },
      {
        q: 'What is a VPC in AWS?',
        a: 'A VPC, or Virtual Private Cloud, is an isolated network where you launch AWS resources with control over subnets, routing, and security groups.',
      },
      {
        q: 'How do I draw an AWS architecture diagram?',
        a: 'Start with the VPC boundary, place edge and load-balancing layers, then compute, databases, and storage, and connect them following the request path.',
      },
    ],
    useCases: [
      'Client proposals',
      'Infrastructure documentation',
      'Cloud migration planning',
      'Well-architected reviews',
      'Cost estimation decks',
    ],
    category: 'devops-cloud',
    categoryName: 'DevOps & Cloud',
  },
  {
    slug: 'incident-response-decision-tree',
    title: 'Incident Response Decision Tree',
    shortDescription:
      'Guide on-call engineers from alert detection through severity triage to resolution and review',
    longDescription:
      'An incident response decision tree branches an on-call engineer through the steps of handling a production incident. The root is alert detection, branching into severity triage, then into paths for declaring an incident, assigning a commander, mitigating the issue, and communicating to stakeholders, ending in resolution and a postmortem. Each branch represents a decision based on impact.\n\nSRE teams, DevOps engineers, and incident commanders use it to standardize on-call behavior, reduce mean time to resolution, and train new responders. It anchors runbooks, on-call playbooks, and reliability training for teams adopting formal incident management.',
    tags: [
      'incident response',
      'on-call',
      'sre',
      'decision tree',
      'runbook',
      'reliability',
      'devops',
      'triage',
    ],
    keywords: [
      'incident response decision tree',
      'incident management flowchart',
      'on-call runbook diagram',
      'incident triage diagram',
      'sre incident process',
    ],
    layout: 'tree',
    centerLabel: 'Alert Detected',
    centerIcon: 'search',
    satellites: [
      {
        label: 'Triage Severity',
        icon: 'process',
      },
      {
        label: 'Declare Incident',
        icon: 'chat',
      },
      {
        label: 'Assign Incident Commander',
        icon: 'process',
      },
      {
        label: 'Mitigate & Roll Back',
        icon: 'automation',
      },
      {
        label: 'Communicate to Stakeholders',
        icon: 'mail',
      },
      {
        label: 'Resolve & Verify',
        icon: 'process',
      },
      {
        label: 'Postmortem Review',
        icon: 'search',
      },
    ],
    treeChildren: [
      {
        label: 'Triage Severity',
        icon: 'process',
        children: [
          {
            label: 'Declare Incident',
            icon: 'chat',
          },
          {
            label: 'Assign Incident Commander',
            icon: 'process',
          },
        ],
      },
      {
        label: 'Mitigate & Roll Back',
        icon: 'automation',
        children: [
          {
            label: 'Communicate to Stakeholders',
            icon: 'mail',
          },
          {
            label: 'Resolve & Verify',
            icon: 'process',
          },
        ],
      },
      {
        label: 'Postmortem Review',
        icon: 'search',
        children: [
          {
            label: 'Action Items & Follow-up',
            icon: 'layers',
          },
        ],
      },
    ],
    faqs: [
      {
        q: 'What is an incident response decision tree?',
        a: 'It is a branching flowchart that guides on-call engineers through detecting, triaging, mitigating, and resolving a production incident based on its severity.',
      },
      {
        q: 'What are the steps of incident response?',
        a: 'The core steps are detection, severity triage, declaring an incident, mitigation, stakeholder communication, resolution, and a postmortem review.',
      },
      {
        q: 'How is incident severity decided?',
        a: 'Severity is set by impact on users and revenue, with higher severities triggering an incident commander, broader paging, and formal communication.',
      },
      {
        q: 'Why run a postmortem after an incident?',
        a: 'A blameless postmortem captures root cause and action items so the team can prevent recurrence and improve mean time to resolution.',
      },
    ],
    useCases: [
      'On-call playbooks',
      'Incident runbooks',
      'Reliability training',
      'SRE onboarding',
      'Process standardization',
    ],
    category: 'devops-cloud',
    categoryName: 'DevOps & Cloud',
  },
  {
    slug: 'oauth-2-flow-diagram',
    title: 'OAuth 2.0 Authorization Code Flow Diagram',
    shortDescription:
      'Visualize the OAuth 2.0 authorization code grant between client, server, and resource API',
    longDescription:
      'This diagram maps the OAuth 2.0 authorization code flow, the most common pattern for delegated access. It shows how a user grants a client application limited access to their data without sharing a password. The key actors are the resource owner, the client application, the authorization server that issues codes and tokens, and the resource server that validates access tokens before returning protected data.\n\nDevelopers, security architects, and API teams reach for this OAuth flow diagram when designing third-party login, building API integrations, or documenting token exchange for audits. It is ideal for onboarding engineers, clarifying the authorization code grant during design reviews, and explaining how access tokens and refresh tokens move through the system.',
    tags: [
      'oauth',
      'authentication',
      'authorization',
      'api security',
      'access token',
      'sso',
      'identity',
    ],
    keywords: [
      'oauth flow diagram',
      'oauth 2.0 authorization code flow',
      'oauth authentication diagram',
      'how oauth works diagram',
      'access token flow',
      'authorization code grant diagram',
    ],
    layout: 'hub',
    centerLabel: 'Authorization Server',
    centerIcon: 'cloud',
    satellites: [
      {
        label: 'Resource Owner (User)',
        icon: 'web',
      },
      {
        label: 'Client Application',
        icon: 'web',
      },
      {
        label: 'Authorization Endpoint',
        icon: 'process',
      },
      {
        label: 'Token Endpoint',
        icon: 'process',
      },
      {
        label: 'Access Token',
        icon: 'layers',
      },
      {
        label: 'Refresh Token',
        icon: 'automation',
      },
      {
        label: 'Resource Server / API',
        icon: 'cloud',
      },
    ],
    faqs: [
      {
        q: 'What is the OAuth 2.0 authorization code flow?',
        a: 'It is a token-based flow where a user authorizes a client app at the authorization server, which returns a short-lived code. The client exchanges that code for an access token used to call protected APIs.',
      },
      {
        q: 'What are the main components of an OAuth flow diagram?',
        a: 'The resource owner (user), the client application, the authorization server (with authorization and token endpoints), and the resource server that validates access tokens before serving data.',
      },
      {
        q: 'What is the difference between an access token and a refresh token?',
        a: 'An access token is short-lived and grants API access. A refresh token is longer-lived and lets the client obtain new access tokens without prompting the user to log in again.',
      },
      {
        q: 'Why use the authorization code grant instead of implicit flow?',
        a: 'The authorization code grant keeps tokens off the browser URL and supports PKCE, making it far more secure. The implicit flow is now discouraged for most applications.',
      },
    ],
    useCases: [
      'API integration design docs',
      'Engineering onboarding',
      'Security architecture reviews',
      'Developer documentation',
      'Auth compliance audits',
    ],
    category: 'security',
    categoryName: 'Security & Identity',
  },
  {
    slug: 'zero-trust-architecture-diagram',
    title: 'Zero Trust Architecture Diagram',
    shortDescription:
      'Show how zero trust enforces identity, device, and policy checks on every access request',
    longDescription:
      'This diagram illustrates a zero trust architecture, where no user or device is trusted by default and every request is verified. It centers on a policy engine and enforcement point that evaluate identity, device posture, and context before granting access to resources. The supporting elements include the identity provider, device trust signals, the policy decision point, micro-segmented resources, and continuous monitoring that re-evaluates trust over time.\n\nSecurity architects, CISOs, and platform teams use this zero trust architecture diagram to plan migrations away from perimeter-based security, justify investments to leadership, and document a NIST-aligned design. It works well for board presentations, vendor evaluations, and onboarding teams to least-privilege access principles.',
    tags: [
      'zero trust',
      'network security',
      'identity',
      'least privilege',
      'ztna',
      'access control',
      'nist',
    ],
    keywords: [
      'zero trust architecture diagram',
      'zero trust network diagram',
      'ztna architecture',
      'zero trust security model',
      'nist zero trust diagram',
      'zero trust components',
    ],
    layout: 'hub',
    centerLabel: 'Policy Decision Engine',
    centerIcon: 'process',
    satellites: [
      {
        label: 'Identity Provider (IdP)',
        icon: 'cloud',
      },
      {
        label: 'Device Trust / Posture',
        icon: 'mobile',
      },
      {
        label: 'Policy Enforcement Point',
        icon: 'process',
      },
      {
        label: 'Micro-Segmented Resources',
        icon: 'layers',
      },
      {
        label: 'Continuous Verification',
        icon: 'search',
      },
      {
        label: 'Multi-Factor Authentication',
        icon: 'automation',
      },
      {
        label: 'Logging & Analytics',
        icon: 'database',
      },
    ],
    faqs: [
      {
        q: 'What is zero trust architecture?',
        a: 'Zero trust is a security model that assumes no implicit trust based on network location. Every access request is authenticated, authorized, and continuously validated using identity, device, and contextual signals.',
      },
      {
        q: 'What are the core components of a zero trust architecture?',
        a: 'A policy decision engine, a policy enforcement point, an identity provider, device posture signals, micro-segmented resources, and continuous monitoring and analytics.',
      },
      {
        q: 'How is zero trust different from a traditional perimeter model?',
        a: 'Perimeter security trusts anything inside the network. Zero trust verifies every request regardless of location, applying least-privilege access and ongoing validation instead of a one-time gate.',
      },
      {
        q: 'Does zero trust require multi-factor authentication?',
        a: 'MFA is a foundational signal in most zero trust designs because strong identity verification is central. It is combined with device trust and policy context for each access decision.',
      },
    ],
    useCases: [
      'CISO board presentations',
      'Security architecture planning',
      'Vendor evaluations',
      'Compliance documentation',
      'Team onboarding',
    ],
    category: 'security',
    categoryName: 'Security & Identity',
  },
  {
    slug: 'sso-architecture-diagram',
    title: 'SSO Architecture Diagram (SAML & OIDC)',
    shortDescription:
      'Map single sign-on between identity provider, service providers, and the user browser',
    longDescription:
      "This diagram explains single sign-on architecture, where one set of credentials grants access to many applications. It shows the trust relationship between an identity provider and multiple service providers, with the user's browser relaying assertions or tokens. The building blocks include the IdP, the SAML or OIDC protocol exchange, the assertion or ID token, the user directory, and the downstream service providers that consume the authenticated session.\n\nIT admins, identity engineers, and SaaS vendors use this SSO architecture diagram to design federated login, document SAML and OIDC integrations, and explain session flow to stakeholders. It is useful for enterprise onboarding, security reviews, and troubleshooting authentication issues across connected apps.",
    tags: [
      'sso',
      'saml',
      'oidc',
      'single sign-on',
      'identity provider',
      'federation',
      'authentication',
    ],
    keywords: [
      'sso architecture diagram',
      'single sign-on diagram',
      'saml flow diagram',
      'sso vs oidc diagram',
      'identity provider architecture',
      'federated authentication diagram',
    ],
    layout: 'hub',
    centerLabel: 'Identity Provider (IdP)',
    centerIcon: 'cloud',
    satellites: [
      {
        label: 'User Browser',
        icon: 'web',
      },
      {
        label: 'Service Provider App',
        icon: 'web',
      },
      {
        label: 'SAML / OIDC Exchange',
        icon: 'process',
      },
      {
        label: 'SAML Assertion / ID Token',
        icon: 'layers',
      },
      {
        label: 'User Directory (LDAP)',
        icon: 'database',
      },
      {
        label: 'Session Cookie',
        icon: 'automation',
      },
      {
        label: 'Multi-Factor Authentication',
        icon: 'mobile',
      },
    ],
    faqs: [
      {
        q: 'What is SSO architecture?',
        a: 'Single sign-on lets a user authenticate once with an identity provider and access multiple applications without logging in again. The IdP issues assertions or tokens that service providers trust.',
      },
      {
        q: 'What is the difference between SAML and OIDC for SSO?',
        a: 'SAML is an XML-based standard common in enterprise apps, while OIDC is a JSON and OAuth 2.0 based protocol popular for modern web and mobile apps. Both establish federated trust.',
      },
      {
        q: 'What are the components of an SSO system?',
        a: 'An identity provider, one or more service providers, the user browser, a user directory, and the protocol exchange that passes a SAML assertion or OIDC ID token.',
      },
      {
        q: 'How does SSO improve security?',
        a: 'It centralizes authentication, reduces password reuse, and lets organizations enforce MFA and policy in one place rather than across every individual app.',
      },
    ],
    useCases: [
      'Enterprise SaaS onboarding',
      'Identity integration docs',
      'Security reviews',
      'IT admin runbooks',
      'Vendor integration guides',
    ],
    category: 'security',
    categoryName: 'Security & Identity',
  },
  {
    slug: 'incident-response-flow-diagram',
    title: 'Incident Response Flow Diagram',
    shortDescription:
      'Outline the incident response lifecycle from detection through recovery and lessons learned',
    longDescription:
      'This diagram represents the incident response lifecycle that security operations teams follow to handle breaches and outages. It walks through the established phases that turn a chaotic event into a coordinated process. The stages include preparation, detection and analysis, containment, eradication, recovery, and a post-incident review, each tied to the central coordination of the response team.\n\nSOC analysts, security managers, and compliance officers use this incident response flow diagram to document runbooks, train responders, and satisfy frameworks like NIST and SANS. It is ideal for tabletop exercises, audit evidence, and aligning stakeholders on who acts at each phase of an incident.',
    tags: [
      'incident response',
      'security operations',
      'soc',
      'nist',
      'runbook',
      'cybersecurity',
      'breach',
    ],
    keywords: [
      'incident response flow diagram',
      'incident response lifecycle diagram',
      'nist incident response process',
      'security incident workflow',
      'soc incident response steps',
      'incident response plan diagram',
    ],
    layout: 'hub',
    centerLabel: 'Incident Response Team',
    centerIcon: 'process',
    satellites: [
      {
        label: 'Preparation',
        icon: 'layers',
      },
      {
        label: 'Detection & Analysis',
        icon: 'search',
      },
      {
        label: 'Containment',
        icon: 'process',
      },
      {
        label: 'Eradication',
        icon: 'automation',
      },
      {
        label: 'Recovery',
        icon: 'cloud',
      },
      {
        label: 'Post-Incident Review',
        icon: 'chat',
      },
      {
        label: 'Stakeholder Communication',
        icon: 'mail',
      },
    ],
    faqs: [
      {
        q: 'What is an incident response flow?',
        a: 'It is the structured sequence a security team follows when handling an incident, moving from preparation and detection through containment, eradication, recovery, and a final review to limit damage and improve defenses.',
      },
      {
        q: 'What are the phases of incident response?',
        a: 'The common NIST phases are preparation, detection and analysis, containment, eradication and recovery, and post-incident activity. SANS uses a similar six-step model.',
      },
      {
        q: 'Why document incident response as a diagram?',
        a: 'A visual flow clarifies who acts at each phase, speeds up decision-making during a real event, and provides audit-ready evidence for compliance frameworks.',
      },
      {
        q: 'What is the goal of the post-incident review?',
        a: 'It captures lessons learned, updates runbooks, and feeds improvements back into the preparation phase so the team responds faster next time.',
      },
    ],
    useCases: [
      'Security runbooks',
      'Tabletop exercises',
      'Compliance audits',
      'SOC training',
      'Executive briefings',
    ],
    category: 'security',
    categoryName: 'Security & Identity',
  },
  {
    slug: 'threat-model-diagram',
    title: 'Threat Model Diagram (STRIDE)',
    shortDescription:
      "Map assets, trust boundaries, and STRIDE threats across a system's data flows",
    longDescription:
      'This diagram captures a threat model, showing how an attacker might target a system and where defenses belong. Built around a central application or data flow, it maps trust boundaries, entry points, assets, and the STRIDE threat categories of spoofing, tampering, repudiation, information disclosure, denial of service, and elevation of privilege. Each element connects to the controls that mitigate the identified risks.\n\nSecurity engineers, developers, and architects use this threat model diagram during design reviews and secure development lifecycles to find weaknesses before code ships. It supports STRIDE workshops, risk assessments, and documentation for auditors who want evidence that security was considered by design.',
    tags: [
      'threat model',
      'stride',
      'security',
      'data flow diagram',
      'risk assessment',
      'sdlc',
      'attack surface',
    ],
    keywords: [
      'threat model diagram',
      'stride threat model',
      'threat modeling diagram',
      'data flow threat model',
      'security threat model template',
      'attack surface diagram',
    ],
    layout: 'hub',
    centerLabel: 'System Under Analysis',
    centerIcon: 'process',
    satellites: [
      {
        label: 'Trust Boundaries',
        icon: 'layers',
      },
      {
        label: 'Entry Points',
        icon: 'web',
      },
      {
        label: 'Assets / Data Stores',
        icon: 'database',
      },
      {
        label: 'STRIDE Threats',
        icon: 'search',
      },
      {
        label: 'Attacker / Threat Agent',
        icon: 'bot',
      },
      {
        label: 'Mitigating Controls',
        icon: 'automation',
      },
      {
        label: 'Data Flows',
        icon: 'cloud',
      },
    ],
    faqs: [
      {
        q: 'What is a threat model diagram?',
        a: "It is a visual map of a system's assets, trust boundaries, and data flows annotated with potential threats and mitigations, used to identify and reduce security risks during design.",
      },
      {
        q: 'What does STRIDE stand for?',
        a: 'STRIDE covers Spoofing, Tampering, Repudiation, Information disclosure, Denial of service, and Elevation of privilege, six categories used to classify threats against a system.',
      },
      {
        q: 'When should you create a threat model?',
        a: 'Ideally during the design phase of the secure development lifecycle and again when architecture changes significantly, so weaknesses are caught before they reach production.',
      },
      {
        q: 'What are trust boundaries in a threat model?',
        a: 'Trust boundaries mark where data crosses between zones of differing trust, such as between the internet and your backend, and are prime locations for threats and controls.',
      },
    ],
    useCases: [
      'Secure design reviews',
      'STRIDE workshops',
      'Risk assessments',
      'SDLC documentation',
      'Security audits',
    ],
    category: 'security',
    categoryName: 'Security & Identity',
  },
  {
    slug: 'siem-architecture-diagram',
    title: 'SIEM Architecture Diagram',
    shortDescription:
      'Show how a SIEM ingests, correlates, and alerts on log data from across the environment',
    longDescription:
      'This diagram depicts a SIEM architecture, the platform that aggregates and analyzes security data for threat detection. It centers on a correlation and analytics engine that ingests logs from many sources, normalizes them, and applies rules to surface threats. The surrounding pieces include log sources and collectors, a normalization pipeline, the correlation engine, threat intelligence feeds, alerting, and dashboards for analysts.\n\nSecurity engineers, SOC teams, and IT architects use this SIEM architecture diagram to plan deployments, justify log source coverage, and explain detection workflows to stakeholders. It is well suited to platform design, vendor comparisons, and onboarding analysts to how alerts move from raw logs to triaged incidents.',
    tags: [
      'siem',
      'security monitoring',
      'log management',
      'soc',
      'threat detection',
      'correlation',
      'analytics',
    ],
    keywords: [
      'siem architecture diagram',
      'siem data flow diagram',
      'how siem works diagram',
      'siem components diagram',
      'security log pipeline architecture',
      'soc siem architecture',
    ],
    layout: 'hub',
    centerLabel: 'Correlation & Analytics Engine',
    centerIcon: 'process',
    satellites: [
      {
        label: 'Log Sources / Endpoints',
        icon: 'cloud',
      },
      {
        label: 'Log Collectors / Forwarders',
        icon: 'automation',
      },
      {
        label: 'Normalization Pipeline',
        icon: 'process',
      },
      {
        label: 'Data Store / Index',
        icon: 'database',
      },
      {
        label: 'Threat Intelligence Feeds',
        icon: 'search',
      },
      {
        label: 'Alerting & Notifications',
        icon: 'chat',
      },
      {
        label: 'Analyst Dashboards',
        icon: 'web',
      },
    ],
    faqs: [
      {
        q: 'What is a SIEM architecture?',
        a: 'A SIEM architecture describes how a security information and event management platform collects logs, normalizes and stores them, correlates events, and generates alerts and dashboards for analysts.',
      },
      {
        q: 'What are the main components of a SIEM?',
        a: 'Log sources and collectors, a normalization pipeline, a data store or index, a correlation and analytics engine, threat intelligence feeds, and alerting with dashboards.',
      },
      {
        q: 'How does a SIEM detect threats?',
        a: 'It correlates events across many log sources using rules, statistical baselines, and threat intelligence to surface patterns that indicate an attack, then raises prioritized alerts.',
      },
      {
        q: 'Why is log normalization important in a SIEM?',
        a: 'Normalization converts logs from diverse systems into a common schema so the correlation engine can compare and analyze events consistently across the environment.',
      },
    ],
    useCases: [
      'SOC platform design',
      'Vendor comparisons',
      'Log coverage planning',
      'Analyst onboarding',
      'Security operations docs',
    ],
    category: 'security',
    categoryName: 'Security & Identity',
  },
  {
    slug: 'rbac-permission-model-diagram',
    title: 'RBAC Permission Model Diagram',
    shortDescription:
      'Break down how users inherit permissions through roles in a role-based access control model',
    longDescription:
      'This diagram models role-based access control, the standard way of granting permissions through roles rather than to individuals directly. As a hierarchy, it shows users assigned to roles, roles granted permissions, and permissions acting on protected resources. The tree structure makes inheritance and least-privilege boundaries clear, with broader roles building on the permissions of more limited ones.\n\nApplication developers, security engineers, and platform teams use this RBAC diagram to design authorization, document who can do what, and review access for audits. It is ideal for SaaS permission design, compliance reviews like SOC 2, and onboarding engineers to how roles and permissions map to real resources.',
    tags: [
      'rbac',
      'access control',
      'permissions',
      'roles',
      'authorization',
      'least privilege',
      'iam',
    ],
    keywords: [
      'rbac diagram',
      'role based access control diagram',
      'rbac permission model',
      'rbac roles and permissions diagram',
      'authorization model diagram',
      'rbac hierarchy diagram',
    ],
    layout: 'tree',
    centerLabel: 'Access Control System',
    centerIcon: 'process',
    satellites: [
      {
        label: 'Users',
        icon: 'web',
      },
      {
        label: 'Admin Role',
        icon: 'layers',
      },
      {
        label: 'Editor Role',
        icon: 'layers',
      },
      {
        label: 'Viewer Role',
        icon: 'layers',
      },
      {
        label: 'Permissions',
        icon: 'automation',
      },
      {
        label: 'Protected Resources',
        icon: 'database',
      },
      {
        label: 'Policy Enforcement',
        icon: 'cloud',
      },
    ],
    treeChildren: [
      {
        label: 'Users',
        icon: 'web',
        children: [
          {
            label: 'Admin Role',
            icon: 'layers',
          },
          {
            label: 'Editor Role',
            icon: 'layers',
          },
          {
            label: 'Viewer Role',
            icon: 'layers',
          },
        ],
      },
      {
        label: 'Permissions',
        icon: 'automation',
        children: [
          {
            label: 'Read',
            icon: 'search',
          },
          {
            label: 'Write',
            icon: 'process',
          },
          {
            label: 'Delete',
            icon: 'automation',
          },
        ],
      },
      {
        label: 'Protected Resources',
        icon: 'database',
        children: [
          {
            label: 'Records / Tables',
            icon: 'database',
          },
          {
            label: 'API Endpoints',
            icon: 'cloud',
          },
        ],
      },
    ],
    faqs: [
      {
        q: 'What is an RBAC permission model?',
        a: 'Role-based access control grants permissions to roles rather than individual users. Users are assigned roles, and roles carry the permissions needed to act on protected resources.',
      },
      {
        q: 'What are the core elements of RBAC?',
        a: 'Users, roles, permissions, and resources. Users receive roles, roles aggregate permissions, and permissions define allowed actions on specific resources.',
      },
      {
        q: 'How does RBAC support least privilege?',
        a: 'By assigning users only the roles they need, RBAC limits access to the minimum required, reducing the blast radius if an account is compromised.',
      },
      {
        q: 'How is RBAC different from ABAC?',
        a: 'RBAC grants access based on assigned roles, while attribute-based access control evaluates dynamic attributes like department, location, or time for finer-grained decisions.',
      },
    ],
    useCases: [
      'SaaS permission design',
      'SOC 2 compliance reviews',
      'Access audits',
      'Engineering onboarding',
      'Authorization documentation',
    ],
    category: 'security',
    categoryName: 'Security & Identity',
  },
  {
    slug: 'payment-processing-flow-diagram',
    title: 'Payment Processing Flow Diagram (Checkout to Settlement)',
    shortDescription:
      'Map how a card payment moves from checkout to settlement through the payment gateway, processor, and banks',
    longDescription:
      "A payment processing flow diagram maps the journey of a single transaction from the moment a customer enters card details to final settlement in the merchant's bank. The key parts include the checkout frontend, the payment gateway, the processor, the acquiring bank, card networks like Visa and Mastercard, the issuing bank that authorizes funds, and the webhook that confirms the result back to your system.\n\nProduct managers, fintech engineers, and solutions architects use this diagram when integrating Stripe, Adyen, or a custom processor, or when explaining authorization, capture, and settlement to stakeholders. It is ideal for onboarding docs, compliance reviews, and debugging declined-transaction issues across the full payment stack.",
    tags: [
      'payment processing',
      'fintech',
      'stripe',
      'checkout',
      'card payments',
      'transaction flow',
      'gateway',
    ],
    keywords: [
      'payment processing flow diagram',
      'how does card payment work',
      'payment gateway flow chart',
      'stripe payment flow',
      'authorization capture settlement diagram',
    ],
    layout: 'hub',
    centerLabel: 'Payment Processor',
    centerIcon: 'process',
    satellites: [
      {
        label: 'Checkout Frontend',
        icon: 'web',
      },
      {
        label: 'Payment Gateway',
        icon: 'cloud',
      },
      {
        label: 'Acquiring Bank',
        icon: 'process',
      },
      {
        label: 'Card Networks (Visa/MC)',
        icon: 'social',
      },
      {
        label: 'Issuing Bank',
        icon: 'process',
      },
      {
        label: 'Stripe Webhooks',
        icon: 'automation',
      },
      {
        label: 'Ledger Database',
        icon: 'database',
      },
    ],
    faqs: [
      {
        q: 'What is a payment processing flow?',
        a: "It is the sequence of steps a transaction takes from a customer's checkout to authorization, capture, and final settlement of funds into the merchant account, passing through the gateway, processor, card networks, and banks.",
      },
      {
        q: 'What are the components of a payment processing system?',
        a: 'Core components include the checkout frontend, payment gateway, processor, acquiring bank, card networks, issuing bank, and a webhook plus ledger for recording outcomes.',
      },
      {
        q: 'What is the difference between authorization and capture?',
        a: 'Authorization checks and reserves funds with the issuing bank, while capture actually moves the reserved money. Settlement then transfers the captured funds to the merchant, often a day or two later.',
      },
      {
        q: 'How do webhooks fit into payment processing?',
        a: 'Webhooks let the processor asynchronously notify your backend of events like payment success, failure, or refund, so your ledger and order system stay in sync.',
      },
      {
        q: 'What is a payment gateway process flow diagram?',
        a: 'It is a diagram centered on the gateway’s role: how checkout data is tokenized and passed to the gateway, forwarded to the processor and card networks, authorized by the issuing bank, and returned as an approve/decline result. This template covers that full gateway path end to end.',
      },
      {
        q: 'How do you draw a payment flow diagram?',
        a: 'List the actors (customer, checkout, gateway, processor, card network, issuing bank, merchant account), then connect them in transaction order with arrows for requests and responses. Or skip the manual work: open this template, rename the nodes to match your stack (Stripe, Adyen, custom), and export.',
      },
      {
        q: 'What is the difference between a payment gateway and a payment processor?',
        a: 'The gateway is the front door — it securely captures and tokenizes card data from your checkout. The processor is the engine behind it that routes the transaction to card networks and banks for authorization and settlement. Providers like Stripe bundle both roles.',
      },
    ],
    useCases: [
      'Engineering onboarding docs',
      'Fintech architecture reviews',
      'Compliance and audit documentation',
      'Investor and stakeholder explainers',
      'Debugging declined transactions',
    ],
    category: 'finance',
    categoryName: 'Finance & Fintech',
  },
  {
    slug: 'fintech-architecture-diagram',
    title: 'Fintech Architecture Diagram (Neobank System Design)',
    shortDescription:
      'Reference architecture for a modern fintech app with KYC, ledger, and banking APIs',
    longDescription:
      'A fintech architecture diagram lays out the core systems behind a regulated financial product. It typically centers on an API backend connected to a KYC and identity service, a double-entry ledger, a banking-as-a-service or core banking integration, a payments processor, a fraud and risk engine, and a data warehouse for reporting and reconciliation.\n\nCTOs, platform engineers, and compliance leads reach for this diagram when scoping a neobank, lending product, or wallet, and when communicating system boundaries to auditors and investors. It clarifies where money state lives, how third-party banking APIs plug in, and which components handle sensitive customer data.',
    tags: [
      'fintech architecture',
      'banking',
      'kyc',
      'ledger',
      'system design',
      'baas',
      'backend',
    ],
    keywords: [
      'fintech architecture diagram',
      'neobank architecture',
      'banking app system design',
      'fintech tech stack diagram',
      'ledger and kyc architecture',
    ],
    layout: 'hub',
    centerLabel: 'Fintech API Backend',
    centerIcon: 'cloud',
    satellites: [
      {
        label: 'KYC / Identity Service',
        icon: 'search',
      },
      {
        label: 'Double-Entry Ledger',
        icon: 'database',
      },
      {
        label: 'Banking-as-a-Service API',
        icon: 'cloud',
      },
      {
        label: 'Payments Processor',
        icon: 'process',
      },
      {
        label: 'Fraud & Risk Engine',
        icon: 'bot',
      },
      {
        label: 'Data Warehouse',
        icon: 'database',
      },
      {
        label: 'Mobile Banking App',
        icon: 'mobile',
      },
    ],
    faqs: [
      {
        q: 'What is a fintech architecture diagram?',
        a: 'It is a high-level map of the services and integrations that make up a financial application, showing how the backend connects to ledgers, KYC, banking APIs, payments, and risk systems.',
      },
      {
        q: 'What are the components of a fintech architecture?',
        a: 'Common components are the API backend, KYC/identity service, a double-entry ledger, a banking-as-a-service integration, a payments processor, a fraud engine, and a data warehouse.',
      },
      {
        q: 'Why do fintech apps use a double-entry ledger?',
        a: 'A double-entry ledger guarantees that every movement of money has a balancing debit and credit, making balances auditable and reconciliation reliable, which regulators and auditors expect.',
      },
      {
        q: 'What is banking-as-a-service in this architecture?',
        a: 'Banking-as-a-service providers expose APIs for accounts, cards, and transfers so a fintech can offer banking features without holding its own banking charter.',
      },
    ],
    useCases: [
      'System design reviews',
      'Investor pitch decks',
      'Compliance and audit prep',
      'Engineering onboarding',
      'Vendor and BaaS evaluation',
    ],
    category: 'finance',
    categoryName: 'Finance & Fintech',
  },
  {
    slug: 'invoicing-workflow-diagram',
    title: 'Invoicing Workflow Diagram (Draft to Reconciliation)',
    shortDescription:
      'End-to-end invoice lifecycle from draft to payment reconciliation',
    longDescription:
      'An invoicing workflow diagram shows the lifecycle of an invoice from creation to cash collection. Its steps usually include drafting the invoice, internal approval, sending it to the client, tracking due dates, recording payment, sending reminders for overdue balances, and reconciling the payment against the accounting ledger.\n\nFinance teams, accounts-receivable staff, and ops managers use this diagram to standardize billing, reduce late payments, and onboard new bookkeepers. It is also useful when automating invoicing with tools like QuickBooks, Xero, or Stripe Invoicing and mapping where reminders and approvals trigger.',
    tags: [
      'invoicing',
      'accounts receivable',
      'billing',
      'finance workflow',
      'reconciliation',
      'payments',
    ],
    keywords: [
      'invoicing workflow diagram',
      'invoice process flow chart',
      'accounts receivable workflow',
      'billing process diagram',
      'invoice approval flow',
    ],
    layout: 'hub',
    centerLabel: 'Invoice Lifecycle',
    centerIcon: 'process',
    satellites: [
      {
        label: 'Draft Invoice',
        icon: 'drive',
      },
      {
        label: 'Internal Approval',
        icon: 'process',
      },
      {
        label: 'Send to Client',
        icon: 'mail',
      },
      {
        label: 'Track Due Date',
        icon: 'search',
      },
      {
        label: 'Record Payment',
        icon: 'process',
      },
      {
        label: 'Overdue Reminders',
        icon: 'chat',
      },
      {
        label: 'Ledger Reconciliation',
        icon: 'database',
      },
    ],
    faqs: [
      {
        q: 'What is an invoicing workflow?',
        a: 'It is the standardized sequence of steps a business follows to create, approve, send, track, collect, and reconcile invoices so that billing is consistent and cash is collected on time.',
      },
      {
        q: 'What are the steps in an invoice process?',
        a: 'Typical steps are drafting the invoice, internal approval, sending it to the client, tracking the due date, recording payment, chasing overdue balances, and reconciling against the ledger.',
      },
      {
        q: 'How do you automate an invoicing workflow?',
        a: 'Tools like Stripe Invoicing, QuickBooks, or Xero can auto-generate invoices, send scheduled reminders, capture online payments, and sync reconciled entries to your accounting ledger.',
      },
      {
        q: 'What is invoice reconciliation?',
        a: 'Reconciliation matches received payments to their corresponding invoices and accounting entries, ensuring the books accurately reflect which invoices are paid, partial, or outstanding.',
      },
    ],
    useCases: [
      'Finance team SOPs',
      'Bookkeeper onboarding',
      'Billing automation planning',
      'Accounts receivable training',
      'Process documentation',
    ],
    category: 'finance',
    categoryName: 'Finance & Fintech',
  },
  {
    slug: 'expense-approval-flow-diagram',
    title: 'Expense Approval Flow Diagram (Tiered Sign-Off Tree)',
    shortDescription:
      'Decision tree for routing employee expense claims through approval tiers',
    longDescription:
      'An expense approval flow diagram is a decision tree showing how an employee expense claim is reviewed and approved based on amount and policy. It branches from claim submission through policy checks, manager approval for smaller amounts, finance or director sign-off for larger ones, and rejection or reimbursement outcomes.\n\nFinance controllers, HR teams, and operations leads use this diagram to enforce spend policy, set approval thresholds, and configure tools like Expensify, Ramp, or SAP Concur. It clarifies who approves what, when escalation kicks in, and how reimbursements get paid out.',
    tags: [
      'expense approval',
      'spend management',
      'finance policy',
      'reimbursement',
      'decision tree',
      'workflow',
    ],
    keywords: [
      'expense approval flow diagram',
      'expense approval process',
      'expense claim workflow',
      'approval threshold flow chart',
      'reimbursement process diagram',
    ],
    layout: 'tree',
    centerLabel: 'Expense Claim Submitted',
    centerIcon: 'process',
    satellites: [
      {
        label: 'Policy & Receipt Check',
        icon: 'search',
      },
      {
        label: 'Under $500: Manager Approval',
        icon: 'process',
      },
      {
        label: '$500-$5000: Finance Approval',
        icon: 'process',
      },
      {
        label: 'Over $5000: Director Sign-off',
        icon: 'process',
      },
      {
        label: 'Rejected: Return to Employee',
        icon: 'chat',
      },
      {
        label: 'Approved: Reimbursement',
        icon: 'process',
      },
      {
        label: 'Payout to Employee',
        icon: 'mail',
      },
    ],
    treeChildren: [
      {
        label: 'Policy & Receipt Check',
        icon: 'search',
        children: [
          {
            label: 'Under $500: Manager Approval',
            icon: 'process',
          },
          {
            label: '$500-$5000: Finance Approval',
            icon: 'process',
          },
          {
            label: 'Over $5000: Director Sign-off',
            icon: 'process',
          },
        ],
      },
      {
        label: 'Approved: Reimbursement',
        icon: 'process',
        children: [
          {
            label: 'Payout to Employee',
            icon: 'mail',
          },
        ],
      },
      {
        label: 'Rejected: Return to Employee',
        icon: 'chat',
      },
    ],
    faqs: [
      {
        q: 'What is an expense approval flow?',
        a: 'It is the routing logic that sends an employee expense claim to the right approver based on amount and policy, ending in either reimbursement or rejection.',
      },
      {
        q: 'How do approval thresholds work?',
        a: 'Thresholds set spending tiers so small claims need only manager sign-off, mid-size claims require finance review, and large claims escalate to a director or executive.',
      },
      {
        q: 'What are the components of an expense approval process?',
        a: 'Key elements are claim submission, policy and receipt validation, tiered approvers, rejection handling, and the reimbursement payout step.',
      },
      {
        q: 'How do you automate expense approvals?',
        a: 'Platforms like Ramp, Expensify, and SAP Concur let you encode policy rules and thresholds so claims route automatically to the correct approver and reimburse on approval.',
      },
    ],
    useCases: [
      'Finance policy documentation',
      'Employee handbook diagrams',
      'Spend tool configuration',
      'Controller and AP training',
      'Audit and compliance reviews',
    ],
    category: 'finance',
    categoryName: 'Finance & Fintech',
  },
  {
    slug: 'trading-system-architecture-diagram',
    title: 'Trading System Architecture Diagram (Order to Execution)',
    shortDescription:
      'Components of a low-latency trading platform from order entry to execution',
    longDescription:
      'A trading system architecture diagram maps the components of an electronic trading platform from order entry to execution. It centers on a matching or order management engine connected to market data feeds, an order gateway, a risk and compliance check layer, the exchange or liquidity venue, a position and P&L ledger, and a low-latency messaging bus.\n\nQuant developers, trading-infra engineers, and fintech architects use this diagram when designing or documenting an exchange connection, OMS, or algo platform. It highlights latency-critical paths, pre-trade risk gates, and where market data and execution reports flow.',
    tags: [
      'trading system',
      'order management',
      'low latency',
      'market data',
      'exchange',
      'architecture',
      'fintech',
    ],
    keywords: [
      'trading system architecture diagram',
      'order management system design',
      'low latency trading architecture',
      'algo trading platform diagram',
      'exchange connectivity diagram',
    ],
    layout: 'hub',
    centerLabel: 'Order Matching Engine',
    centerIcon: 'process',
    satellites: [
      {
        label: 'Market Data Feed',
        icon: 'search',
      },
      {
        label: 'Order Gateway / FIX',
        icon: 'cloud',
      },
      {
        label: 'Pre-Trade Risk Checks',
        icon: 'bot',
      },
      {
        label: 'Exchange / Liquidity Venue',
        icon: 'social',
      },
      {
        label: 'Position & P&L Ledger',
        icon: 'database',
      },
      {
        label: 'Messaging Bus',
        icon: 'automation',
      },
      {
        label: 'Trader Frontend',
        icon: 'web',
      },
    ],
    faqs: [
      {
        q: 'What is a trading system architecture?',
        a: 'It is the design of an electronic trading platform showing how orders, market data, risk checks, and execution flow between the order management engine, gateways, and exchanges.',
      },
      {
        q: 'What are the components of a trading system?',
        a: 'Core components include market data feeds, an order gateway, a matching or order management engine, pre-trade risk checks, exchange connectivity, a position ledger, and a low-latency messaging bus.',
      },
      {
        q: 'Why is low latency important in trading systems?',
        a: 'In electronic markets, faster order entry and market data processing can mean better fills and price advantage, so the critical path is engineered to minimize delay.',
      },
      {
        q: 'What are pre-trade risk checks?',
        a: 'Pre-trade risk checks validate orders against limits like position size, buying power, and fat-finger rules before they reach the exchange, preventing costly erroneous trades.',
      },
    ],
    useCases: [
      'Trading infra design docs',
      'Quant team onboarding',
      'Regulatory and risk reviews',
      'Vendor evaluation',
      'Architecture interviews',
    ],
    category: 'finance',
    categoryName: 'Finance & Fintech',
  },
  {
    slug: 'budgeting-process-diagram',
    title: 'Budgeting Process Diagram (Annual FP&A Cycle)',
    shortDescription:
      'The annual budgeting cycle from forecasting to variance review',
    longDescription:
      'A budgeting process diagram shows the recurring cycle a company follows to plan and control spending. It centers on the budget cycle and connects forecasting and goal setting, departmental budget submissions, finance consolidation, executive review and approval, allocation to teams, and ongoing actual-versus-budget variance analysis.\n\nFP&A analysts, finance managers, and department heads use this diagram to align teams on the annual planning timeline and clarify hand-offs. It is helpful for onboarding finance staff, documenting the planning calendar, and improving the accuracy of forecasts against actuals each period.',
    tags: [
      'budgeting',
      'fp&a',
      'financial planning',
      'forecasting',
      'variance analysis',
      'finance process',
    ],
    keywords: [
      'budgeting process diagram',
      'annual budgeting cycle',
      'fp&a process flow chart',
      'financial planning process',
      'budget vs actual workflow',
    ],
    layout: 'hub',
    centerLabel: 'Budget Cycle',
    centerIcon: 'process',
    satellites: [
      {
        label: 'Forecast & Goal Setting',
        icon: 'search',
      },
      {
        label: 'Department Submissions',
        icon: 'drive',
      },
      {
        label: 'Finance Consolidation',
        icon: 'database',
      },
      {
        label: 'Executive Review',
        icon: 'process',
      },
      {
        label: 'Budget Approval',
        icon: 'process',
      },
      {
        label: 'Allocation to Teams',
        icon: 'layers',
      },
      {
        label: 'Variance Analysis',
        icon: 'search',
      },
    ],
    faqs: [
      {
        q: 'What is the budgeting process?',
        a: 'It is the repeating cycle of forecasting, collecting departmental plans, consolidating, reviewing, approving, allocating funds, and then comparing actuals to budget throughout the year.',
      },
      {
        q: 'What are the steps in a budgeting process?',
        a: 'Typical steps are forecasting and goal setting, department submissions, finance consolidation, executive review and approval, allocation to teams, and ongoing variance analysis.',
      },
      {
        q: 'What is variance analysis in budgeting?',
        a: 'Variance analysis compares actual spending and revenue against the approved budget to explain differences and inform corrective action or reforecasting.',
      },
      {
        q: 'Who owns the budgeting process?',
        a: 'FP&A and finance leadership typically own the cycle and timeline, while department heads submit and defend their own budgets and report on actuals.',
      },
    ],
    useCases: [
      'FP&A planning calendars',
      'Finance team onboarding',
      'Department budget kickoffs',
      'Board and executive reviews',
      'Process standardization',
    ],
    category: 'finance',
    categoryName: 'Finance & Fintech',
  },
  {
    slug: 'loan-origination-process-diagram',
    title: 'Loan Origination Process Diagram (Application to Funding)',
    shortDescription:
      'Stages of a loan from application through underwriting to funding',
    longDescription:
      'A loan origination process diagram outlines how a lender takes a borrower from application to funded loan. It centers on the origination workflow and connects application intake, document collection and verification, credit and KYC checks, underwriting and risk scoring, decisioning and offer, document signing, and disbursement of funds.\n\nLending product managers, credit-risk teams, and fintech engineers use this diagram when building or auditing a loan origination system (LOS). It clarifies decision gates, compliance touchpoints, and where automation or manual review applies across consumer or business lending.',
    tags: [
      'loan origination',
      'lending',
      'underwriting',
      'credit risk',
      'fintech',
      'kyc',
      'los',
    ],
    keywords: [
      'loan origination process diagram',
      'loan origination system flow',
      'underwriting process flow chart',
      'lending workflow diagram',
      'credit decisioning process',
    ],
    layout: 'hub',
    centerLabel: 'Loan Origination System',
    centerIcon: 'process',
    satellites: [
      {
        label: 'Application Intake',
        icon: 'web',
      },
      {
        label: 'Document Verification',
        icon: 'drive',
      },
      {
        label: 'Credit & KYC Checks',
        icon: 'search',
      },
      {
        label: 'Underwriting Engine',
        icon: 'bot',
      },
      {
        label: 'Decision & Offer',
        icon: 'process',
      },
      {
        label: 'E-Signature',
        icon: 'mail',
      },
      {
        label: 'Fund Disbursement',
        icon: 'database',
      },
    ],
    faqs: [
      {
        q: 'What is loan origination?',
        a: 'Loan origination is the end-to-end process a lender uses to take a borrower from application through verification, underwriting, and decisioning to a funded loan.',
      },
      {
        q: 'What are the stages of loan origination?',
        a: 'The main stages are application intake, document collection and verification, credit and KYC checks, underwriting, decisioning and offer, signing, and fund disbursement.',
      },
      {
        q: 'What is a loan origination system?',
        a: 'A loan origination system (LOS) is the software platform that manages and automates each origination stage, coordinating data, credit checks, underwriting rules, and funding.',
      },
      {
        q: 'Where does automation fit in loan origination?',
        a: 'Automation commonly handles document parsing, credit and KYC lookups, and rules-based underwriting, while complex or borderline cases route to manual review.',
      },
    ],
    useCases: [
      'Lending product design',
      'Credit risk documentation',
      'LOS vendor evaluation',
      'Compliance and audit prep',
      'Engineering onboarding',
    ],
    category: 'finance',
    categoryName: 'Finance & Fintech',
  },
  {
    slug: 'org-chart-template',
    title: 'Org Chart Template',
    shortDescription:
      'Map your company reporting hierarchy from CEO down to individual contributors',
    longDescription:
      "An org chart maps a company's reporting hierarchy as a tree, starting with the CEO and branching down through executives, department heads, managers, and individual contributors. Each node names a role and the person filling it, while the connecting lines reveal who reports to whom and how teams roll up into the wider organization.\n\nHR teams, founders, and people managers reach for this template during onboarding, fundraising, and reorganizations to communicate structure at a glance. It is ideal for explaining team makeup, clarifying reporting lines, and giving new hires a fast mental model of how the company fits together.",
    tags: [
      'org chart',
      'organizational chart',
      'company structure',
      'hierarchy',
      'reporting lines',
      'hr',
      'team structure',
    ],
    keywords: [
      'org chart template',
      'organizational chart template',
      'company org chart',
      'reporting structure chart',
      'org chart maker',
      'team hierarchy diagram',
    ],
    layout: 'tree',
    centerLabel: 'CEO',
    centerIcon: 'process',
    satellites: [
      {
        label: 'VP Engineering',
        icon: 'process',
      },
      {
        label: 'VP Sales',
        icon: 'process',
      },
      {
        label: 'VP Marketing',
        icon: 'process',
      },
      {
        label: 'Engineering Managers',
        icon: 'layers',
      },
      {
        label: 'Software Engineers',
        icon: 'layers',
      },
      {
        label: 'Account Executives',
        icon: 'layers',
      },
      {
        label: 'Marketing Specialists',
        icon: 'layers',
      },
    ],
    treeChildren: [
      {
        label: 'VP Engineering',
        icon: 'process',
        children: [
          {
            label: 'Engineering Managers',
            icon: 'layers',
          },
          {
            label: 'Software Engineers',
            icon: 'layers',
          },
        ],
      },
      {
        label: 'VP Sales',
        icon: 'process',
        children: [
          {
            label: 'Account Executives',
            icon: 'layers',
          },
        ],
      },
      {
        label: 'VP Marketing',
        icon: 'process',
        children: [
          {
            label: 'Marketing Specialists',
            icon: 'layers',
          },
        ],
      },
    ],
    faqs: [
      {
        q: 'What is an org chart?',
        a: "An org chart, or organizational chart, is a diagram that shows a company's internal structure and reporting relationships. It places leadership at the top and branches downward to teams and individual roles.",
      },
      {
        q: 'What are the components of an org chart?',
        a: 'The core components are roles or job titles, the people who hold them, and the connecting lines that show reporting relationships between superiors and subordinates.',
      },
      {
        q: 'How do I make an org chart?',
        a: 'Start with the highest role such as the CEO, add direct reports beneath it, then keep branching down through managers and individual contributors until every role is placed and connected by reporting lines.',
      },
      {
        q: 'What types of org charts are there?',
        a: 'Common types include hierarchical (top-down), matrix (dual reporting), flat (few management layers), and functional (grouped by department).',
      },
    ],
    useCases: [
      'Employee onboarding docs',
      'Investor and board decks',
      'Company handbooks',
      'Reorganization planning',
      'HR and headcount reviews',
    ],
    category: 'org-people',
    categoryName: 'Org & People',
  },
  {
    slug: 'hiring-pipeline-diagram',
    title: 'Hiring Pipeline Diagram Template',
    shortDescription:
      'Visualize your recruitment funnel from sourcing through offer and final hire',
    longDescription:
      'A hiring pipeline diagram visualizes the recruitment funnel as candidates move through distinct stages, from initial sourcing and application screening to interviews, the offer, and the final hire. Each stage acts as a filter, making drop-off, bottlenecks, and conversion between steps easy to spot at a glance.\n\nRecruiters, hiring managers, and talent operations teams use this diagram to standardize their process, report on funnel health, and align interviewers on what happens at every step. It is especially useful when onboarding new recruiters or presenting hiring metrics to leadership.',
    tags: [
      'hiring pipeline',
      'recruitment funnel',
      'talent acquisition',
      'candidate stages',
      'ats',
      'hiring process',
    ],
    keywords: [
      'hiring pipeline diagram',
      'recruitment funnel template',
      'hiring process flow',
      'candidate pipeline stages',
      'recruiting workflow diagram',
    ],
    layout: 'hub',
    centerLabel: 'Hiring Pipeline',
    centerIcon: 'process',
    satellites: [
      {
        label: 'Sourcing',
        icon: 'search',
      },
      {
        label: 'Application Screen',
        icon: 'process',
      },
      {
        label: 'Recruiter Call',
        icon: 'chat',
      },
      {
        label: 'Technical Interview',
        icon: 'process',
      },
      {
        label: 'Onsite / Panel',
        icon: 'layers',
      },
      {
        label: 'Offer',
        icon: 'mail',
      },
      {
        label: 'Hired',
        icon: 'social',
      },
    ],
    faqs: [
      {
        q: 'What is a hiring pipeline?',
        a: 'A hiring pipeline is the sequence of stages a candidate passes through during recruitment, from being sourced to being hired. It functions like a funnel that narrows applicants down to a final hire.',
      },
      {
        q: 'What are the stages of a hiring pipeline?',
        a: 'Typical stages are sourcing, application screening, a recruiter call, one or more interviews, an onsite or panel round, the offer, and finally the hire.',
      },
      {
        q: 'How do you measure a hiring pipeline?',
        a: 'Track conversion rates between each stage, time-to-hire, and the number of candidates at each step to identify bottlenecks and forecast hiring outcomes.',
      },
    ],
    useCases: [
      'Recruiting process docs',
      'Talent acquisition reviews',
      'Interviewer training',
      'Hiring metrics dashboards',
      'Recruiter onboarding',
    ],
    category: 'org-people',
    categoryName: 'Org & People',
  },
  {
    slug: 'employee-onboarding-flow',
    title: 'Employee Onboarding Flow Template',
    shortDescription:
      'Map the new-hire journey from offer acceptance through the first 90 days',
    longDescription:
      'An employee onboarding flow maps the new-hire journey as a sequence of steps, beginning with offer acceptance and pre-boarding paperwork, then moving through first-day setup, role training, team introductions, and 30-60-90 day check-ins. The diagram shows the order of activities and which team owns each one.\n\nHR teams, people operations, and managers use this flow to keep onboarding consistent, reduce the chance of missed steps, and give new hires a clear picture of what to expect. It works well inside employee handbooks, onboarding checklists, and process documentation.',
    tags: [
      'employee onboarding',
      'new hire flow',
      'people ops',
      'onboarding process',
      'hr workflow',
      'first 90 days',
    ],
    keywords: [
      'employee onboarding flow',
      'new hire onboarding process',
      'onboarding workflow template',
      'employee onboarding checklist diagram',
      'onboarding journey map',
    ],
    layout: 'hub',
    centerLabel: 'Employee Onboarding',
    centerIcon: 'process',
    satellites: [
      {
        label: 'Offer Accepted',
        icon: 'mail',
      },
      {
        label: 'Pre-boarding Paperwork',
        icon: 'drive',
      },
      {
        label: 'Day 1 Setup',
        icon: 'process',
      },
      {
        label: 'Role Training',
        icon: 'layers',
      },
      {
        label: 'Team Introductions',
        icon: 'chat',
      },
      {
        label: '30-60-90 Check-ins',
        icon: 'search',
      },
      {
        label: 'Full Productivity',
        icon: 'social',
      },
    ],
    faqs: [
      {
        q: 'What is an employee onboarding flow?',
        a: 'It is a structured sequence of steps that guides a new employee from accepting an offer through becoming a fully productive team member, covering paperwork, setup, training, and check-ins.',
      },
      {
        q: 'What should an onboarding flow include?',
        a: 'A strong flow includes pre-boarding paperwork, first-day equipment and account setup, role-specific training, team introductions, and scheduled 30-60-90 day check-ins.',
      },
      {
        q: 'How long should employee onboarding take?',
        a: 'Effective onboarding typically spans the first 90 days, with the most intensive activities concentrated in week one and structured check-ins at 30, 60, and 90 days.',
      },
    ],
    useCases: [
      'Employee handbooks',
      'People ops process docs',
      'Onboarding checklists',
      'Manager enablement',
      'New hire welcome guides',
    ],
    category: 'org-people',
    categoryName: 'Org & People',
  },
  {
    slug: 'matrix-organization-diagram',
    title: 'Matrix Organization Diagram Template',
    shortDescription:
      'Show dual reporting where staff answer to both functional and project leaders',
    longDescription:
      'A matrix organization diagram shows a dual-reporting structure where employees answer to two managers at once: a functional manager who owns their discipline and a project or product manager who owns their current initiative. The grid layout makes the intersection of functions and projects explicit, clarifying shared accountability.\n\nProgram managers, COOs, and team leads use this diagram to explain cross-functional staffing, resolve reporting ambiguity, and plan resource allocation across projects. It is common in consulting, engineering, and product-led companies where people work across several teams at the same time.',
    tags: [
      'matrix organization',
      'dual reporting',
      'cross functional',
      'org structure',
      'program management',
      'resource allocation',
    ],
    keywords: [
      'matrix organization diagram',
      'matrix org structure',
      'dual reporting structure',
      'cross functional team chart',
      'matrix management diagram',
    ],
    layout: 'hub',
    centerLabel: 'Matrix Structure',
    centerIcon: 'layers',
    satellites: [
      {
        label: 'Functional Manager',
        icon: 'process',
      },
      {
        label: 'Project Manager',
        icon: 'process',
      },
      {
        label: 'Engineering Function',
        icon: 'layers',
      },
      {
        label: 'Design Function',
        icon: 'layers',
      },
      {
        label: 'Project Alpha Team',
        icon: 'layers',
      },
      {
        label: 'Project Beta Team',
        icon: 'layers',
      },
      {
        label: 'Shared Contributors',
        icon: 'social',
      },
    ],
    faqs: [
      {
        q: 'What is a matrix organization?',
        a: 'A matrix organization is a structure where employees report to two managers simultaneously, usually a functional manager and a project or product manager, sharing accountability across both.',
      },
      {
        q: 'What are the components of a matrix org structure?',
        a: 'The key components are functional managers who own disciplines, project managers who own initiatives, and the shared employees who sit at the intersection of both reporting lines.',
      },
      {
        q: 'When should you use a matrix organization?',
        a: 'Matrix structures fit companies that run many cross-functional projects and need to share specialized talent across initiatives, such as consulting, engineering, and product organizations.',
      },
    ],
    useCases: [
      'Program management planning',
      'Resource allocation reviews',
      'Cross-functional team docs',
      'Operations strategy decks',
      'Reorganization proposals',
    ],
    category: 'org-people',
    categoryName: 'Org & People',
  },
  {
    slug: 'performance-review-process',
    title: 'Performance Review Process Diagram',
    shortDescription:
      'Lay out the review cycle from goal setting through feedback and calibration',
    longDescription:
      'A performance review process diagram lays out the recurring review cycle, beginning with goal setting and continuing through ongoing feedback, employee self-assessment, manager evaluation, calibration across teams, and the final review conversation and development plan. The diagram clarifies the order of steps and who is responsible at each stage.\n\nHR teams, managers, and people operations use this process to standardize evaluations, ensure fairness through calibration, and communicate timelines to the whole company. It is valuable for performance management documentation and for manager training during review season.',
    tags: [
      'performance review',
      'performance management',
      'review cycle',
      'employee evaluation',
      'calibration',
      'feedback process',
      'hr',
    ],
    keywords: [
      'performance review process',
      'performance review cycle diagram',
      'employee evaluation process',
      'performance management workflow',
      'annual review process template',
    ],
    layout: 'hub',
    centerLabel: 'Performance Review Cycle',
    centerIcon: 'process',
    satellites: [
      {
        label: 'Goal Setting',
        icon: 'process',
      },
      {
        label: 'Ongoing Feedback',
        icon: 'chat',
      },
      {
        label: 'Self-Assessment',
        icon: 'web',
      },
      {
        label: 'Manager Evaluation',
        icon: 'process',
      },
      {
        label: 'Peer Reviews',
        icon: 'social',
      },
      {
        label: 'Calibration',
        icon: 'search',
      },
      {
        label: 'Review Conversation',
        icon: 'chat',
      },
    ],
    faqs: [
      {
        q: 'What is a performance review process?',
        a: 'It is the structured cycle organizations use to evaluate employee performance, typically including goal setting, feedback, self and manager assessment, calibration, and a final review meeting.',
      },
      {
        q: 'What are the steps in a performance review?',
        a: "Common steps are setting goals, gathering ongoing and peer feedback, completing a self-assessment, the manager's evaluation, cross-team calibration, and the review conversation with a development plan.",
      },
      {
        q: 'What is calibration in performance reviews?',
        a: 'Calibration is a meeting where managers compare ratings across employees to ensure consistency and fairness, reducing bias before final reviews are delivered.',
      },
    ],
    useCases: [
      'Performance management docs',
      'Manager training',
      'HR process guides',
      'Review season planning',
      'Employee development frameworks',
    ],
    category: 'org-people',
    categoryName: 'Org & People',
  },
  {
    slug: 'raci-responsibility-matrix',
    title: 'RACI Responsibility Matrix Template',
    shortDescription:
      'Map who is Responsible, Accountable, Consulted, and Informed for every task',
    longDescription:
      'A RACI responsibility matrix maps tasks against roles to clarify ownership, marking each person as Responsible, Accountable, Consulted, or Informed for every activity. The grid removes ambiguity about who does the work, who owns the outcome, who provides input, and who simply needs to be kept in the loop.\n\nProject managers, team leads, and operations teams use this matrix to assign clear ownership at project kickoff, prevent duplicated effort, and resolve decision-making confusion. It is a staple of project charters, process documentation, and cross-team initiatives where roles can easily blur.',
    tags: [
      'raci',
      'responsibility matrix',
      'raci matrix',
      'accountability',
      'project roles',
      'ownership',
      'team responsibilities',
    ],
    keywords: [
      'raci matrix template',
      'responsibility assignment matrix',
      'raci chart diagram',
      'raci responsibility matrix',
      'who does what project matrix',
    ],
    layout: 'hub',
    centerLabel: 'RACI Matrix',
    centerIcon: 'layers',
    satellites: [
      {
        label: 'Responsible',
        icon: 'process',
      },
      {
        label: 'Accountable',
        icon: 'process',
      },
      {
        label: 'Consulted',
        icon: 'chat',
      },
      {
        label: 'Informed',
        icon: 'mail',
      },
      {
        label: 'Task Owner',
        icon: 'layers',
      },
      {
        label: 'Project Sponsor',
        icon: 'process',
      },
      {
        label: 'Stakeholders',
        icon: 'social',
      },
    ],
    faqs: [
      {
        q: 'What is a RACI matrix?',
        a: 'A RACI matrix is a chart that assigns each role one of four responsibilities for a task: Responsible, Accountable, Consulted, or Informed, clarifying who does what on a project.',
      },
      {
        q: 'What do the letters in RACI stand for?',
        a: 'Responsible is who does the work, Accountable is who owns the outcome, Consulted is who provides input, and Informed is who is kept updated on progress.',
      },
      {
        q: 'How do you create a RACI matrix?',
        a: 'List project tasks down one axis and roles across the other, then assign R, A, C, or I to each cell, ensuring every task has exactly one Accountable owner.',
      },
    ],
    useCases: [
      'Project charters',
      'Cross-team initiatives',
      'Process documentation',
      'Project kickoffs',
      'Operations playbooks',
    ],
    category: 'org-people',
    categoryName: 'Org & People',
  },
  {
    slug: 'team-structure-diagram',
    title: 'Team Structure Diagram Template',
    shortDescription:
      "Show one cross-functional squad's roles and how they collaborate day to day",
    longDescription:
      "A team structure diagram shows how a single cross-functional team is composed, mapping the central squad to its constituent roles such as a product manager, engineers, a designer, QA, and a delivery lead. Unlike a full org chart, it focuses on one team's makeup and how those roles work together day to day.\n\nEngineering leaders, product managers, and team leads use this diagram to communicate squad composition, onboard new members, and propose new teams during planning. It is ideal for team charters, staffing proposals, and explaining how a product pod is organized.",
    tags: [
      'team structure',
      'squad composition',
      'cross functional team',
      'product team',
      'team roles',
      'engineering team',
    ],
    keywords: [
      'team structure diagram',
      'squad structure template',
      'cross functional team diagram',
      'product team structure',
      'team composition chart',
    ],
    layout: 'hub',
    centerLabel: 'Product Squad',
    centerIcon: 'layers',
    satellites: [
      {
        label: 'Product Manager',
        icon: 'process',
      },
      {
        label: 'Tech Lead',
        icon: 'process',
      },
      {
        label: 'Backend Engineers',
        icon: 'cloud',
      },
      {
        label: 'Frontend Engineers',
        icon: 'web',
      },
      {
        label: 'Product Designer',
        icon: 'layers',
      },
      {
        label: 'QA Engineer',
        icon: 'search',
      },
      {
        label: 'Delivery Lead',
        icon: 'process',
      },
    ],
    faqs: [
      {
        q: 'What is a team structure diagram?',
        a: 'It is a diagram that shows how a single team is composed, mapping its roles and how members collaborate, rather than the whole company hierarchy.',
      },
      {
        q: 'What roles are in a cross-functional product team?',
        a: 'A typical product squad includes a product manager, a tech lead, backend and frontend engineers, a designer, a QA engineer, and often a delivery or scrum lead.',
      },
      {
        q: 'How is a team structure different from an org chart?',
        a: 'An org chart shows company-wide reporting lines, while a team structure diagram zooms into one team to show its specific roles and how they work together.',
      },
    ],
    useCases: [
      'Team charters',
      'Staffing proposals',
      'Squad onboarding',
      'Sprint planning docs',
      'Product pod design',
    ],
    category: 'org-people',
    categoryName: 'Org & People',
  },
  {
    slug: 'approval-workflow-diagram',
    title: 'Approval Workflow Diagram Template',
    shortDescription:
      'Map a multi-step request, review, and sign-off flow with escalation and rejection paths',
    longDescription:
      'An approval workflow diagram maps how a request moves from submission to final sign-off. It shows the requester, automated validation checks, one or more reviewer or approver stages, escalation routes for high-value or stalled items, and the terminal outcomes of approved, rejected, or returned for revision. Conditional branches make the routing rules explicit so nothing slips through unreviewed.\n\nOperations leads, finance teams, and HR managers use this template to document policies, configure automation tools, and onboard staff. It is ideal for building a purchase approval workflow, expense sign-off process, or document approval chain, and it helps teams spot bottlenecks and unclear ownership before they cause costly delays.',
    tags: [
      'approval workflow',
      'sign-off',
      'process',
      'escalation',
      'review',
      'business process',
    ],
    keywords: [
      'approval workflow diagram',
      'approval process flowchart',
      'purchase approval workflow',
      'expense approval process',
      'document approval chain',
      'sign-off workflow template',
    ],
    layout: 'hub',
    centerLabel: 'Approval Workflow',
    centerIcon: 'process',
    satellites: [
      {
        label: 'Request Submitted',
        icon: 'web',
      },
      {
        label: 'Auto Validation',
        icon: 'automation',
      },
      {
        label: 'Manager Review',
        icon: 'chat',
      },
      {
        label: 'Finance Approval',
        icon: 'process',
      },
      {
        label: 'Escalation',
        icon: 'mail',
      },
      {
        label: 'Approved',
        icon: 'layers',
      },
      {
        label: 'Rejected',
        icon: 'layers',
      },
    ],
    faqs: [
      {
        q: 'What is an approval workflow diagram?',
        a: 'It is a visual map of how a request travels from submission through review and approval to a final decision. It captures every approver, conditional branch, and escalation path in one diagram.',
      },
      {
        q: 'What are the components of an approval workflow?',
        a: 'Core components include the request submission, validation checks, one or more approver stages, escalation rules, and the final approved or rejected outcomes. Notification steps are often added between stages.',
      },
      {
        q: 'How do I create an approval workflow?',
        a: 'Start by listing the trigger that begins the request, then map each reviewer in order, add the conditions that route between them, and end with the possible outcomes. Keep approver responsibilities and escalation thresholds explicit.',
      },
      {
        q: 'When should requests be escalated?',
        a: 'Escalate when an approval exceeds a value threshold, an approver is unavailable, or an item stalls beyond an SLA. The diagram should show exactly which conditions trigger escalation.',
      },
    ],
    useCases: [
      'Finance policy docs',
      'Procurement onboarding',
      'HR sign-off process',
      'Internal SOPs',
      'Audit and compliance',
    ],
    category: 'process',
    categoryName: 'Process & Workflow',
  },
  {
    slug: 'order-fulfillment-process-diagram',
    title: 'Order Fulfillment Process Diagram',
    shortDescription:
      'Visualize the end-to-end flow from order placement through picking, packing, and delivery',
    longDescription:
      'An order fulfillment process diagram shows the full journey of a customer order from the moment it is placed to the moment it arrives. It typically includes order capture, payment authorization, inventory allocation, warehouse picking and packing, carrier handoff, shipment tracking, and post-delivery handling such as returns. Each step exposes a clear handoff between systems and teams.\n\nE-commerce operators, logistics managers, and warehouse leads use this template to design their fulfillment pipeline, integrate an order management system, and reduce shipping errors. It is valuable when scaling operations, onboarding 3PL partners, or troubleshooting where orders get stuck between checkout and delivery.',
    tags: [
      'order fulfillment',
      'ecommerce',
      'logistics',
      'warehouse',
      'shipping',
      'supply chain',
    ],
    keywords: [
      'order fulfillment process',
      'order fulfillment flowchart',
      'ecommerce fulfillment diagram',
      'order to delivery process',
      'warehouse fulfillment workflow',
      'shipping process map',
    ],
    layout: 'hub',
    centerLabel: 'Order Fulfillment',
    centerIcon: 'process',
    satellites: [
      {
        label: 'Order Placed',
        icon: 'web',
      },
      {
        label: 'Payment Authorized',
        icon: 'process',
      },
      {
        label: 'Inventory Allocated',
        icon: 'database',
      },
      {
        label: 'Pick & Pack',
        icon: 'drive',
      },
      {
        label: 'Carrier Handoff',
        icon: 'automation',
      },
      {
        label: 'Shipment Tracking',
        icon: 'search',
      },
      {
        label: 'Returns Handling',
        icon: 'layers',
      },
    ],
    faqs: [
      {
        q: 'What is the order fulfillment process?',
        a: 'It is the set of steps that move a customer order from checkout to delivery, including payment, inventory allocation, picking, packing, and shipping. The diagram links each step into one pipeline.',
      },
      {
        q: 'What are the stages of order fulfillment?',
        a: 'The main stages are order capture, payment authorization, inventory allocation, picking and packing, carrier handoff, and delivery, with returns as a follow-on flow.',
      },
      {
        q: 'How does inventory allocation fit into fulfillment?',
        a: 'After payment is authorized, the system reserves stock from a warehouse or fulfillment center so the order can be picked. Allocation also prevents overselling across channels.',
      },
      {
        q: 'Why diagram the fulfillment process?',
        a: 'A diagram reveals handoffs, system integrations, and bottlenecks, making it easier to onboard staff, integrate a 3PL, and find where orders stall.',
      },
    ],
    useCases: [
      'Ecommerce operations',
      'Warehouse onboarding',
      '3PL integration',
      'Process improvement',
      'Investor or partner decks',
    ],
    category: 'process',
    categoryName: 'Process & Workflow',
  },
  {
    slug: 'customer-support-flow-diagram',
    title: 'Customer Support Flow Diagram',
    shortDescription:
      'Chart ticket intake, triage, routing, and resolution across support tiers',
    longDescription:
      'A customer support flow diagram visualizes how a customer issue moves from first contact to resolution. It covers multi-channel intake such as chat, email, and phone, automated triage, tier-1 self-service or agent handling, escalation to tier-2 or engineering, resolution, and a follow-up satisfaction check. Branching shows when tickets deflect to a knowledge base or escalate to specialists.\n\nSupport managers, CX leads, and operations teams use this template to design their helpdesk, configure routing rules, and set service-level expectations. It is especially useful when launching a support team, integrating a ticketing tool, or mapping escalation paths so customers reach the right resolver quickly.',
    tags: [
      'customer support',
      'helpdesk',
      'ticketing',
      'escalation',
      'cx',
      'service desk',
    ],
    keywords: [
      'customer support flow',
      'support ticket workflow',
      'helpdesk process diagram',
      'customer service flowchart',
      'ticket escalation process',
      'support triage workflow',
    ],
    layout: 'hub',
    centerLabel: 'Support Flow',
    centerIcon: 'chat',
    satellites: [
      {
        label: 'Multichannel Intake',
        icon: 'chat',
      },
      {
        label: 'Auto Triage',
        icon: 'bot',
      },
      {
        label: 'Knowledge Base',
        icon: 'search',
      },
      {
        label: 'Tier 1 Agent',
        icon: 'process',
      },
      {
        label: 'Tier 2 Escalation',
        icon: 'mail',
      },
      {
        label: 'Resolution',
        icon: 'layers',
      },
      {
        label: 'CSAT Survey',
        icon: 'web',
      },
    ],
    faqs: [
      {
        q: 'What is a customer support flow?',
        a: 'It is the path a customer issue follows from first contact through triage and resolution. The diagram shows intake channels, routing rules, escalation tiers, and follow-up.',
      },
      {
        q: 'What are the components of a support workflow?',
        a: 'Typical components are multichannel intake, automated triage, self-service deflection, tier-1 and tier-2 handling, resolution, and a satisfaction survey.',
      },
      {
        q: 'How does ticket escalation work?',
        a: 'When a tier-1 agent cannot resolve an issue, the ticket is routed to a specialist or engineering tier based on category, priority, or SLA breach. The diagram makes those rules explicit.',
      },
      {
        q: 'How do I reduce support volume?',
        a: 'Route common questions to a knowledge base or chatbot before reaching an agent. The deflection branch in the diagram shows where self-service intercepts tickets.',
      },
    ],
    useCases: [
      'Support team onboarding',
      'Helpdesk setup',
      'CX process docs',
      'SLA planning',
      'Tooling integration',
    ],
    category: 'process',
    categoryName: 'Process & Workflow',
  },
  {
    slug: 'incident-management-process-diagram',
    title: 'Incident Management Process Diagram',
    shortDescription:
      'Trace detection through triage, response, resolution, and post-incident review',
    longDescription:
      'An incident management process diagram maps how an operational incident is detected, handled, and closed. It includes automated detection and alerting, on-call paging, severity triage, mitigation and resolution, customer communication, and a post-incident review with action items. Branches separate minor incidents from major ones that require a war room and stakeholder updates.\n\nSRE, DevOps, and IT operations teams use this template to align on response playbooks, define severity levels, and meet uptime commitments. It is essential when adopting an on-call rotation, integrating tools like PagerDuty, or running incidents against an ITIL or SRE framework so response stays fast and consistent.',
    tags: [
      'incident management',
      'sre',
      'on-call',
      'devops',
      'itil',
      'alerting',
    ],
    keywords: [
      'incident management process',
      'incident response workflow',
      'incident management diagram',
      'on-call escalation process',
      'sre incident lifecycle',
      'itil incident flow',
    ],
    layout: 'hub',
    centerLabel: 'Incident Management',
    centerIcon: 'process',
    satellites: [
      {
        label: 'Detection & Alert',
        icon: 'search',
      },
      {
        label: 'On-Call Paging',
        icon: 'mail',
      },
      {
        label: 'Severity Triage',
        icon: 'process',
      },
      {
        label: 'Mitigation',
        icon: 'automation',
      },
      {
        label: 'Status Updates',
        icon: 'chat',
      },
      {
        label: 'Resolution',
        icon: 'layers',
      },
      {
        label: 'Postmortem',
        icon: 'web',
      },
    ],
    faqs: [
      {
        q: 'What is the incident management process?',
        a: 'It is the lifecycle of detecting, responding to, resolving, and reviewing an operational incident. The diagram covers alerting, triage, mitigation, communication, and the postmortem.',
      },
      {
        q: 'What are the stages of incident management?',
        a: 'Detection and alerting, on-call paging, severity triage, mitigation and resolution, stakeholder communication, and a post-incident review with follow-up actions.',
      },
      {
        q: 'How is incident severity decided?',
        a: 'Severity is triaged by customer impact, scope, and urgency, which determines paging, war-room activation, and communication cadence. The diagram routes minor and major incidents differently.',
      },
      {
        q: 'Why run a postmortem?',
        a: 'A blameless postmortem captures the timeline, root cause, and action items so the same failure is less likely to recur. It is the final stage of the process.',
      },
    ],
    useCases: [
      'SRE runbooks',
      'On-call onboarding',
      'Incident response training',
      'Uptime planning',
      'Compliance documentation',
    ],
    category: 'process',
    categoryName: 'Process & Workflow',
  },
  {
    slug: 'change-management-workflow-diagram',
    title: 'Change Management Workflow Diagram',
    shortDescription:
      'Map the request, assessment, approval, and rollout flow for controlled changes',
    longDescription:
      'A change management workflow diagram shows how a proposed change is requested, evaluated, approved, implemented, and reviewed. It includes the change request, impact and risk assessment, Change Advisory Board approval, scheduling within a change window, implementation, validation, and a rollback path if the change fails. Branches distinguish standard, normal, and emergency changes.\n\nIT managers, DevOps engineers, and process owners use this template to control production changes, reduce risk, and satisfy ITIL or audit requirements. It is most useful when formalizing a release process, defining CAB approval, or documenting how emergency changes bypass standard steps while still being recorded.',
    tags: [
      'change management',
      'itil',
      'cab',
      'release',
      'risk assessment',
      'rollback',
    ],
    keywords: [
      'change management workflow',
      'change management process diagram',
      'itil change management',
      'change request flowchart',
      'cab approval process',
      'change control workflow',
    ],
    layout: 'hub',
    centerLabel: 'Change Management',
    centerIcon: 'process',
    satellites: [
      {
        label: 'Change Request',
        icon: 'web',
      },
      {
        label: 'Impact Assessment',
        icon: 'search',
      },
      {
        label: 'CAB Approval',
        icon: 'chat',
      },
      {
        label: 'Schedule Window',
        icon: 'automation',
      },
      {
        label: 'Implementation',
        icon: 'process',
      },
      {
        label: 'Validation',
        icon: 'layers',
      },
      {
        label: 'Rollback Plan',
        icon: 'drive',
      },
    ],
    faqs: [
      {
        q: 'What is a change management workflow?',
        a: 'It is the controlled process for requesting, assessing, approving, and deploying a change to a system or service. The diagram covers the request, CAB approval, implementation, and rollback.',
      },
      {
        q: 'What are the types of changes?',
        a: 'Standard changes are pre-approved and low risk, normal changes go through full assessment and CAB approval, and emergency changes follow an expedited path that is still recorded.',
      },
      {
        q: 'What does the CAB do?',
        a: 'The Change Advisory Board reviews the risk, impact, and scheduling of a proposed change and grants or denies approval before implementation.',
      },
      {
        q: 'Why include a rollback plan?',
        a: 'A rollback plan defines how to revert if a change fails validation, limiting downtime and risk. The diagram branches to rollback when validation does not pass.',
      },
    ],
    useCases: [
      'ITIL process docs',
      'Release management',
      'Audit readiness',
      'DevOps onboarding',
      'Change control SOPs',
    ],
    category: 'process',
    categoryName: 'Process & Workflow',
  },
  {
    slug: 'decision-tree-diagram',
    title: 'Decision Tree Diagram Template',
    shortDescription:
      'Map branching yes/no decision logic that links conditions to clear outcomes',
    longDescription:
      'A decision tree diagram maps a sequence of conditional questions, each branching into outcomes until a final decision is reached. Starting from a root decision, every node poses a condition that splits into yes or no paths, and the branches terminate in leaf nodes representing actions or results. The hierarchy makes complex if-then logic easy to follow at a glance.\n\nAnalysts, product managers, support teams, and data scientists use this template to document business rules, troubleshooting guides, and classification logic. It is ideal for building eligibility checks, customer routing rules, or step-by-step troubleshooting flows where the right answer depends on a chain of conditions.',
    tags: [
      'decision tree',
      'decision logic',
      'branching',
      'if-then',
      'flowchart',
      'rules',
    ],
    keywords: [
      'decision tree diagram',
      'decision tree template',
      'yes no decision flowchart',
      'decision logic diagram',
      'troubleshooting decision tree',
      'business rules tree',
    ],
    layout: 'tree',
    centerLabel: 'Root Decision',
    centerIcon: 'process',
    satellites: [
      {
        label: 'Condition A',
        icon: 'process',
      },
      {
        label: 'Condition B',
        icon: 'process',
      },
      {
        label: 'Outcome: Approve',
        icon: 'layers',
      },
      {
        label: 'Outcome: Review',
        icon: 'layers',
      },
      {
        label: 'Outcome: Reject',
        icon: 'layers',
      },
      {
        label: 'Outcome: Escalate',
        icon: 'layers',
      },
    ],
    treeChildren: [
      {
        label: 'Condition A',
        icon: 'process',
        children: [
          {
            label: 'Outcome: Approve',
            icon: 'layers',
          },
          {
            label: 'Outcome: Review',
            icon: 'layers',
          },
        ],
      },
      {
        label: 'Condition B',
        icon: 'process',
        children: [
          {
            label: 'Outcome: Reject',
            icon: 'layers',
          },
          {
            label: 'Outcome: Escalate',
            icon: 'layers',
          },
        ],
      },
    ],
    faqs: [
      {
        q: 'What is a decision tree diagram?',
        a: 'It is a branching diagram where each node asks a condition that splits into outcomes, ending in leaf nodes that represent final decisions or actions. It models if-then logic visually.',
      },
      {
        q: 'What are the components of a decision tree?',
        a: 'A root decision node, internal condition nodes that branch on yes/no or categorical answers, the branches connecting them, and leaf nodes holding the final outcomes.',
      },
      {
        q: 'How do I build a decision tree?',
        a: 'Start with the core decision at the root, add a condition node for each question, branch on the possible answers, and terminate each path in a clear outcome.',
      },
      {
        q: 'When should I use a decision tree?',
        a: 'Use one when an outcome depends on a chain of conditions, such as eligibility checks, troubleshooting guides, or routing rules.',
      },
    ],
    useCases: [
      'Business rules docs',
      'Troubleshooting guides',
      'Eligibility checks',
      'Customer routing',
      'Training material',
    ],
    category: 'process',
    categoryName: 'Process & Workflow',
  },
  {
    slug: 'employee-onboarding-process-diagram',
    title: 'Employee Onboarding Process Diagram',
    shortDescription:
      'Plan pre-boarding through provisioning, training, and first-week ramp-up',
    longDescription:
      'An employee onboarding process diagram lays out the steps that turn a signed offer into a productive team member. It covers pre-boarding paperwork, account and equipment provisioning, an orientation session, role-specific training, manager check-ins, and a 30-60-90 day review. Each step shows who owns it across HR, IT, and the hiring manager so nothing falls through the cracks.\n\nHR teams, people-ops leads, and managers use this template to standardize the new-hire experience, automate provisioning, and accelerate time-to-productivity. It is valuable when scaling hiring, building an onboarding checklist, or coordinating handoffs between HR and IT for a smooth first week.',
    tags: [
      'employee onboarding',
      'hr',
      'people ops',
      'new hire',
      'provisioning',
      'training',
    ],
    keywords: [
      'employee onboarding process',
      'onboarding workflow diagram',
      'new hire onboarding flowchart',
      'hr onboarding process',
      'onboarding checklist template',
      '30 60 90 day onboarding',
    ],
    layout: 'hub',
    centerLabel: 'Employee Onboarding',
    centerIcon: 'process',
    satellites: [
      {
        label: 'Offer & Paperwork',
        icon: 'mail',
      },
      {
        label: 'Account Provisioning',
        icon: 'automation',
      },
      {
        label: 'Equipment Setup',
        icon: 'drive',
      },
      {
        label: 'Orientation',
        icon: 'web',
      },
      {
        label: 'Role Training',
        icon: 'chat',
      },
      {
        label: 'Manager Check-in',
        icon: 'process',
      },
      {
        label: '30-60-90 Review',
        icon: 'search',
      },
    ],
    faqs: [
      {
        q: 'What is the employee onboarding process?',
        a: 'It is the structured set of steps that integrate a new hire, from pre-boarding paperwork through provisioning, training, and early reviews. The diagram shows each step and its owner.',
      },
      {
        q: 'What are the stages of onboarding?',
        a: 'Pre-boarding and paperwork, account and equipment provisioning, orientation, role-specific training, manager check-ins, and a 30-60-90 day review.',
      },
      {
        q: 'Who is responsible for onboarding?',
        a: 'Onboarding is shared across HR for paperwork and orientation, IT for provisioning, and the hiring manager for training and check-ins. The diagram makes each handoff clear.',
      },
      {
        q: 'How do I improve time-to-productivity?',
        a: 'Automate provisioning before day one, sequence training to the role, and schedule early check-ins. The diagram surfaces handoffs and delays that slow ramp-up.',
      },
    ],
    useCases: [
      'HR process docs',
      'New-hire checklists',
      'IT provisioning runbooks',
      'People-ops scaling',
      'Manager training',
    ],
    category: 'process',
    categoryName: 'Process & Workflow',
  },
  {
    slug: 'learning-path-diagram',
    title: 'Learning Path Diagram Maker',
    shortDescription:
      'Map the ordered stages a learner moves through from beginner to mastery',
    longDescription:
      'A learning path diagram lays out the sequence of stages a learner moves through to reach a goal, linking a central path to milestones such as foundations, core skills, applied practice, and assessment. Each node acts as a checkpoint with prerequisites, resources, and a measurable outcome, so progress stays visible at a glance.\n\nInstructional designers, bootcamps, and L&D teams reach for a learning path diagram when planning onboarding tracks, course roadmaps, or self-study plans. It is ideal for mapping a learning journey, building a training roadmap, or showing employees the exact steps from novice to expert in one clear, shareable visual.',
    tags: [
      'learning path',
      'training roadmap',
      'course planning',
      'onboarding',
      'instructional design',
      'e-learning',
    ],
    keywords: [
      'learning path diagram',
      'learning path template',
      'training roadmap diagram',
      'employee learning journey map',
      'how to create a learning path',
    ],
    layout: 'hub',
    centerLabel: 'Learning Path',
    centerIcon: 'process',
    satellites: [
      {
        label: 'Foundations',
        icon: 'layers',
      },
      {
        label: 'Core Concepts',
        icon: 'search',
      },
      {
        label: 'Hands-On Practice',
        icon: 'process',
      },
      {
        label: 'Capstone Project',
        icon: 'drive',
      },
      {
        label: 'Assessment',
        icon: 'web',
      },
      {
        label: 'Certification',
        icon: 'mail',
      },
    ],
    faqs: [
      {
        q: 'What is a learning path diagram?',
        a: 'It is a visual map of the ordered stages a learner moves through to reach a goal, showing milestones, prerequisites, and outcomes for each step.',
      },
      {
        q: 'How do I create a learning path?',
        a: 'Start with the end goal, break it into sequential milestones, list prerequisites and resources for each, then connect them in order from foundations to certification.',
      },
      {
        q: 'What are the components of a learning path?',
        a: 'Typical components include foundations, core concepts, hands-on practice, a capstone project, assessment, and certification or a completion checkpoint.',
      },
    ],
    useCases: [
      'Employee onboarding tracks',
      'Bootcamp curriculum planning',
      'Self-study roadmaps',
      'Corporate L&D programs',
      'Course landing pages',
    ],
    category: 'education',
    categoryName: 'Education & Learning',
  },
  {
    slug: 'concept-map-template',
    title: 'Concept Map Template',
    shortDescription:
      'Show how key ideas in a topic link together through labeled relationships',
    longDescription:
      'A concept map template visualizes how ideas within a topic relate, placing a central concept at the core and branching to linked sub-concepts with labeled connectors such as causes, includes, or leads to. It emphasizes meaningful relationships between ideas rather than strict hierarchy, helping reveal how knowledge actually connects.\n\nTeachers, students, and researchers use a concept map to study complex subjects, brainstorm essay structures, or summarize a chapter. It works well for active recall, lesson planning, and explaining how the concepts in a domain fit together inside a single connected diagram.',
    tags: [
      'concept map',
      'study notes',
      'brainstorming',
      'knowledge map',
      'teaching',
      'active recall',
    ],
    keywords: [
      'concept map template',
      'concept mapping example',
      'how to make a concept map',
      'study concept map',
      'concept map for students',
    ],
    layout: 'hub',
    centerLabel: 'Core Concept',
    centerIcon: 'bot',
    satellites: [
      {
        label: 'Key Definition',
        icon: 'search',
      },
      {
        label: 'Related Idea',
        icon: 'layers',
      },
      {
        label: 'Example',
        icon: 'drive',
      },
      {
        label: 'Cause & Effect',
        icon: 'process',
      },
      {
        label: 'Supporting Evidence',
        icon: 'database',
      },
      {
        label: 'Application',
        icon: 'web',
      },
    ],
    faqs: [
      {
        q: 'What is a concept map?',
        a: 'A concept map is a diagram that shows relationships between ideas, with a central concept linked to related sub-concepts using labeled connecting lines.',
      },
      {
        q: 'How is a concept map different from a mind map?',
        a: 'A concept map emphasizes labeled relationships between many ideas, while a mind map radiates branches from a single central topic without explicit relationship labels.',
      },
      {
        q: 'How do I make a concept map?',
        a: 'Pick a focus concept, list related ideas, then connect them with labeled links that describe how each idea relates to the others.',
      },
    ],
    useCases: [
      'Study and revision notes',
      'Lesson planning',
      'Essay outlining',
      'Research brainstorming',
      'Knowledge summaries',
    ],
    category: 'education',
    categoryName: 'Education & Learning',
  },
  {
    slug: 'skill-tree-diagram',
    title: 'Skill Tree Diagram Maker',
    shortDescription:
      'Branch skills into prerequisite tiers from basics to advanced specializations',
    longDescription:
      'A skill tree diagram organizes competencies into a branching hierarchy where foundational skills unlock more advanced ones, much like a game progression tree. The root holds entry-level skills, and each branch grows into intermediate and specialized capabilities with clear prerequisite relationships between every tier.\n\nMentors, gamified learning platforms, and career coaches use a skill tree to show learners what to master next and how each skill builds on the last. It is great for visualizing a competency framework, a developer roadmap, or a personal upskilling plan in a motivating, progressive structure.',
    tags: [
      'skill tree',
      'competency framework',
      'upskilling',
      'career development',
      'roadmap',
      'gamification',
    ],
    keywords: [
      'skill tree diagram',
      'skill tree template',
      'competency map',
      'developer skill tree',
      'skill progression chart',
    ],
    layout: 'tree',
    centerLabel: 'Core Skills',
    centerIcon: 'layers',
    satellites: [
      {
        label: 'Fundamentals',
        icon: 'layers',
      },
      {
        label: 'Intermediate Skills',
        icon: 'process',
      },
      {
        label: 'Specialization A',
        icon: 'search',
      },
      {
        label: 'Specialization B',
        icon: 'bot',
      },
      {
        label: 'Advanced Mastery',
        icon: 'web',
      },
      {
        label: 'Expert Track',
        icon: 'automation',
      },
    ],
    treeChildren: [
      {
        label: 'Fundamentals',
        icon: 'layers',
        children: [
          {
            label: 'Intermediate Skills',
            icon: 'process',
          },
        ],
      },
      {
        label: 'Intermediate Skills',
        icon: 'process',
        children: [
          {
            label: 'Specialization A',
            icon: 'search',
          },
          {
            label: 'Specialization B',
            icon: 'bot',
          },
        ],
      },
      {
        label: 'Specialization A',
        icon: 'search',
        children: [
          {
            label: 'Advanced Mastery',
            icon: 'web',
          },
        ],
      },
      {
        label: 'Specialization B',
        icon: 'bot',
        children: [
          {
            label: 'Expert Track',
            icon: 'automation',
          },
        ],
      },
    ],
    faqs: [
      {
        q: 'What is a skill tree diagram?',
        a: 'It is a branching hierarchy of competencies where foundational skills unlock more advanced ones, showing prerequisites and progression paths.',
      },
      {
        q: 'What are the components of a skill tree?',
        a: 'A root of fundamental skills, intermediate skill tiers, branching specializations, and advanced or expert nodes that depend on earlier skills.',
      },
      {
        q: 'How do I build a skill tree for a career?',
        a: 'List the foundational skills, identify which skills depend on others, then branch them into specializations leading to advanced mastery.',
      },
    ],
    useCases: [
      'Developer roadmaps',
      'Competency frameworks',
      'Personal upskilling plans',
      'Gamified learning platforms',
      'Career coaching',
    ],
    category: 'education',
    categoryName: 'Education & Learning',
  },
  {
    slug: 'curriculum-map-diagram',
    title: 'Curriculum Map Diagram Maker',
    shortDescription:
      'Align course units, learning objectives, and assessments across a program',
    longDescription:
      'A curriculum map diagram shows how the units of a course or program connect to learning objectives, content, and assessments. A central program node links to modules, each carrying its objectives, key topics, and the assessments that measure them, making gaps and overlaps in coverage easy to spot.\n\nCurriculum designers, school administrators, and department heads use a curriculum map when planning a semester, aligning standards, or reviewing a degree program. It supports backward design, accreditation reviews, and keeping teaching outcomes aligned across many courses at once.',
    tags: [
      'curriculum map',
      'course design',
      'learning objectives',
      'backward design',
      'education planning',
      'accreditation',
    ],
    keywords: [
      'curriculum map diagram',
      'curriculum mapping template',
      'course curriculum map',
      'how to map a curriculum',
      'program learning objectives map',
    ],
    layout: 'hub',
    centerLabel: 'Program Curriculum',
    centerIcon: 'layers',
    satellites: [
      {
        label: 'Module 1 Objectives',
        icon: 'search',
      },
      {
        label: 'Module 2 Content',
        icon: 'drive',
      },
      {
        label: 'Module 3 Activities',
        icon: 'process',
      },
      {
        label: 'Assessments',
        icon: 'database',
      },
      {
        label: 'Standards Alignment',
        icon: 'web',
      },
      {
        label: 'Capstone',
        icon: 'automation',
      },
    ],
    faqs: [
      {
        q: 'What is a curriculum map?',
        a: 'A curriculum map is a visual that aligns course units with learning objectives, content, and assessments to show how a program fits together.',
      },
      {
        q: 'Why use curriculum mapping?',
        a: 'It reveals gaps, redundancies, and misalignments between what is taught and what is assessed, supporting coherent program and accreditation reviews.',
      },
      {
        q: 'What goes into a curriculum map?',
        a: 'Modules or units, their learning objectives, key content, activities, and the assessments that measure each objective.',
      },
    ],
    useCases: [
      'Semester planning',
      'Degree program reviews',
      'Accreditation documentation',
      'Standards alignment',
      'Backward course design',
    ],
    category: 'education',
    categoryName: 'Education & Learning',
  },
  {
    slug: 'study-workflow-diagram',
    title: 'Study Workflow Diagram',
    shortDescription:
      'Lay out a repeatable cycle for previewing, learning, and reviewing material',
    longDescription:
      'A study workflow diagram captures the repeatable cycle a learner follows to absorb and retain material, linking a central study loop to steps like previewing content, active learning, practice testing, spaced review, and reflection. It turns scattered study habits into a structured, evidence-based routine you can actually stick to.\n\nStudents, tutors, and study-skills coaches use a study workflow to plan exam preparation, build daily revision habits, or teach effective learning techniques. It is ideal for visualizing a study routine, a revision schedule, or a productivity loop grounded in spaced repetition and active recall.',
    tags: [
      'study workflow',
      'study routine',
      'exam preparation',
      'spaced repetition',
      'active recall',
      'productivity',
    ],
    keywords: [
      'study workflow diagram',
      'study routine template',
      'exam study plan diagram',
      'effective study process',
      'revision workflow',
    ],
    layout: 'hub',
    centerLabel: 'Study Loop',
    centerIcon: 'process',
    satellites: [
      {
        label: 'Preview Material',
        icon: 'search',
      },
      {
        label: 'Active Learning',
        icon: 'bot',
      },
      {
        label: 'Practice Tests',
        icon: 'web',
      },
      {
        label: 'Spaced Review',
        icon: 'automation',
      },
      {
        label: 'Flashcards',
        icon: 'drive',
      },
      {
        label: 'Reflection',
        icon: 'chat',
      },
    ],
    faqs: [
      {
        q: 'What is a study workflow?',
        a: 'A study workflow is a repeatable cycle of steps such as previewing, active learning, practice testing, and spaced review that helps learners retain material.',
      },
      {
        q: 'How do I build an effective study routine?',
        a: 'Combine previewing, active recall, practice testing, and spaced review in a loop, and schedule short, consistent sessions instead of cramming.',
      },
      {
        q: 'What study techniques work best?',
        a: 'Active recall, spaced repetition, and self-testing are the most evidence-backed techniques, which is why they anchor most study workflows.',
      },
    ],
    useCases: [
      'Exam preparation plans',
      'Daily revision habits',
      'Tutoring frameworks',
      'Study-skills workshops',
      'Productivity routines',
    ],
    category: 'education',
    categoryName: 'Education & Learning',
  },
  {
    slug: 'course-structure-diagram',
    title: 'Online Course Structure Diagram',
    shortDescription:
      'Break an online course into modules, lessons, and supporting resources',
    longDescription:
      "A course structure diagram outlines how an online or classroom course is organized, linking a central course node to its modules, lessons, assignments, quizzes, and supporting resources. It gives creators a bird's-eye view of pacing, dependencies, and exactly where content or assessments are missing.\n\nCourse creators, educators, and instructional designers use a course structure diagram when outlining a new class, redesigning an e-learning program, or planning a content release schedule. It works well for mapping a course outline, a module breakdown, or a drip-content plan before production begins.",
    tags: [
      'course structure',
      'course outline',
      'e-learning',
      'online course',
      'module planning',
      'instructional design',
    ],
    keywords: [
      'course structure diagram',
      'online course outline template',
      'course module map',
      'how to structure an online course',
      'e-learning course plan',
    ],
    layout: 'hub',
    centerLabel: 'Online Course',
    centerIcon: 'web',
    satellites: [
      {
        label: 'Module Overview',
        icon: 'layers',
      },
      {
        label: 'Video Lessons',
        icon: 'drive',
      },
      {
        label: 'Quizzes',
        icon: 'search',
      },
      {
        label: 'Assignments',
        icon: 'process',
      },
      {
        label: 'Discussion',
        icon: 'chat',
      },
      {
        label: 'Final Exam',
        icon: 'database',
      },
    ],
    faqs: [
      {
        q: 'What is a course structure diagram?',
        a: 'It is a visual outline of how a course is organized, linking the course to its modules, lessons, assignments, quizzes, and resources.',
      },
      {
        q: 'How do I structure an online course?',
        a: 'Group content into modules, break each module into lessons, add quizzes and assignments to reinforce learning, and end with a project or exam.',
      },
      {
        q: 'What are the parts of a course?',
        a: 'Modules, video or reading lessons, quizzes, assignments, discussion or community elements, and a final assessment.',
      },
    ],
    useCases: [
      'Online course outlines',
      'E-learning redesigns',
      'Content drip planning',
      'Classroom syllabus design',
      'Course pitch decks',
    ],
    category: 'education',
    categoryName: 'Education & Learning',
  },
  {
    slug: 'blooms-taxonomy-diagram',
    title: "Bloom's Taxonomy Diagram",
    shortDescription:
      'Stack the six levels of learning from remembering up to creating',
    longDescription:
      "A Bloom's taxonomy diagram illustrates the six cognitive levels of learning, progressing from lower-order skills like remembering and understanding up through applying, analyzing, evaluating, and creating. Each level builds on the one below, with action verbs that guide how objectives and questions are written.\n\nTeachers, curriculum designers, and trainers use Bloom's taxonomy to write learning objectives, design assessments that target higher-order thinking, and scaffold lessons. It is ideal for explaining the cognitive levels of learning, planning question difficulty, or aligning activities to specific thinking skills.",
    tags: [
      'blooms taxonomy',
      'learning objectives',
      'cognitive levels',
      'assessment design',
      'education theory',
      'higher-order thinking',
    ],
    keywords: [
      'blooms taxonomy diagram',
      'blooms taxonomy levels',
      'blooms taxonomy template',
      'cognitive levels of learning',
      'blooms taxonomy verbs chart',
    ],
    layout: 'tree',
    centerLabel: 'Cognitive Learning Levels',
    centerIcon: 'layers',
    satellites: [
      {
        label: 'Remember',
        icon: 'database',
      },
      {
        label: 'Understand',
        icon: 'search',
      },
      {
        label: 'Apply',
        icon: 'process',
      },
      {
        label: 'Analyze',
        icon: 'web',
      },
      {
        label: 'Evaluate',
        icon: 'chat',
      },
      {
        label: 'Create',
        icon: 'bot',
      },
    ],
    treeChildren: [
      {
        label: 'Remember',
        icon: 'database',
        children: [
          {
            label: 'Understand',
            icon: 'search',
          },
        ],
      },
      {
        label: 'Understand',
        icon: 'search',
        children: [
          {
            label: 'Apply',
            icon: 'process',
          },
        ],
      },
      {
        label: 'Apply',
        icon: 'process',
        children: [
          {
            label: 'Analyze',
            icon: 'web',
          },
        ],
      },
      {
        label: 'Analyze',
        icon: 'web',
        children: [
          {
            label: 'Evaluate',
            icon: 'chat',
          },
        ],
      },
      {
        label: 'Evaluate',
        icon: 'chat',
        children: [
          {
            label: 'Create',
            icon: 'bot',
          },
        ],
      },
    ],
    faqs: [
      {
        q: "What is Bloom's taxonomy?",
        a: "Bloom's taxonomy is a framework that classifies learning into six cognitive levels, from remembering and understanding up to evaluating and creating.",
      },
      {
        q: "What are the six levels of Bloom's taxonomy?",
        a: 'Remember, Understand, Apply, Analyze, Evaluate, and Create, ordered from lower-order to higher-order thinking skills.',
      },
      {
        q: "How is Bloom's taxonomy used?",
        a: 'Educators use it to write learning objectives, design assessments at varying difficulty, and scaffold lessons toward higher-order thinking.',
      },
    ],
    useCases: [
      'Writing learning objectives',
      'Assessment design',
      'Lesson scaffolding',
      'Teacher training',
      'Question difficulty planning',
    ],
    category: 'education',
    categoryName: 'Education & Learning',
  },
  {
    slug: 'patient-journey-map',
    title: 'Patient Journey Map Template',
    shortDescription:
      'Map every touchpoint a patient experiences from awareness through follow-up care',
    longDescription:
      "A patient journey map visualizes the end-to-end experience a patient has with a healthcare provider, from first symptom awareness and appointment scheduling through intake, diagnosis, treatment, billing, and post-visit follow-up. Each stage captures the patient's actions, emotions, and the systems they touch, exposing friction points like long wait times or confusing discharge instructions.\n\nPatient experience teams, clinical operations leaders, and product managers use these maps to redesign care delivery and lift satisfaction scores. They prove especially valuable when launching a new service line, evaluating a digital front door, or building a CAHPS improvement plan, where seeing the entire journey at once is what surfaces the real opportunities.",
    tags: [
      'patient journey',
      'patient experience',
      'healthcare cx',
      'care delivery',
      'journey map',
      'patient touchpoints',
    ],
    keywords: [
      'patient journey map',
      'patient journey map template',
      'patient experience diagram',
      'healthcare customer journey',
      'patient journey stages',
    ],
    layout: 'hub',
    centerLabel: 'Patient Journey',
    centerIcon: 'process',
    satellites: [
      {
        label: 'Awareness & Symptoms',
        icon: 'search',
      },
      {
        label: 'Appointment Scheduling',
        icon: 'web',
      },
      {
        label: 'Intake & Registration',
        icon: 'process',
      },
      {
        label: 'Diagnosis & Treatment',
        icon: 'process',
      },
      {
        label: 'Billing & Payment',
        icon: 'process',
      },
      {
        label: 'Discharge Instructions',
        icon: 'mail',
      },
      {
        label: 'Follow-Up Care',
        icon: 'chat',
      },
    ],
    faqs: [
      {
        q: 'What is a patient journey map?',
        a: 'A patient journey map is a visual diagram of every stage and touchpoint a patient moves through when receiving care, capturing their actions, emotions, and the systems involved at each step.',
      },
      {
        q: 'What are the stages of a patient journey?',
        a: 'Common stages include awareness, scheduling, intake and registration, diagnosis and treatment, billing, discharge, and follow-up care. The exact stages vary by service line.',
      },
      {
        q: 'How do you create a patient journey map?',
        a: 'Start by defining a patient persona, list each touchpoint in chronological order, then annotate the actions, emotions, and pain points at each stage to reveal opportunities for improvement.',
      },
    ],
    useCases: [
      'Patient experience redesign',
      'Service line launches',
      'CAHPS improvement plans',
      'Digital front door planning',
      'Clinical operations reviews',
    ],
    category: 'healthcare',
    categoryName: 'Healthcare & Life Sciences',
  },
  {
    slug: 'clinical-workflow-diagram',
    title: 'Clinical Workflow Diagram Template',
    shortDescription:
      'Show the sequence of clinical tasks from patient check-in through visit documentation',
    longDescription:
      'A clinical workflow diagram maps the operational steps a care team follows during a patient encounter: check-in, rooming and vitals, the provider exam, orders for labs or imaging, treatment, and visit documentation in the EHR. It clarifies who owns each task, where handoffs happen, and how information moves between the front desk, nursing staff, and providers.\n\nPractice managers, nurse leaders, and informatics analysts rely on these diagrams to standardize care, remove bottlenecks, and onboard new staff faster. They are also central to EHR implementations and process improvement work, where charting the current-state and future-state workflow side by side is what drives measurable efficiency gains.',
    tags: [
      'clinical workflow',
      'care team',
      'practice operations',
      'patient encounter',
      'clinical process',
      'rooming',
    ],
    keywords: [
      'clinical workflow diagram',
      'clinical workflow template',
      'patient visit workflow',
      'clinic process flow',
      'clinical workflow mapping',
    ],
    layout: 'hub',
    centerLabel: 'Patient Encounter',
    centerIcon: 'process',
    satellites: [
      {
        label: 'Patient Check-In',
        icon: 'web',
      },
      {
        label: 'Rooming & Vitals',
        icon: 'process',
      },
      {
        label: 'Provider Exam',
        icon: 'process',
      },
      {
        label: 'Labs & Imaging Orders',
        icon: 'search',
      },
      {
        label: 'Treatment & Procedures',
        icon: 'process',
      },
      {
        label: 'EHR Documentation',
        icon: 'database',
      },
      {
        label: 'Checkout & Scheduling',
        icon: 'process',
      },
    ],
    faqs: [
      {
        q: 'What is a clinical workflow diagram?',
        a: 'It is a visual map of the sequential tasks a care team performs during a patient visit, from check-in through documentation, showing responsibilities and handoffs at each step.',
      },
      {
        q: 'Why are clinical workflow diagrams important?',
        a: 'They standardize care delivery, expose bottlenecks and redundant steps, and serve as a shared reference for training staff and configuring EHR systems.',
      },
      {
        q: 'What are the components of a clinical workflow?',
        a: 'Typical components include check-in, rooming and vitals, provider examination, orders for labs or imaging, treatment, documentation, and checkout.',
      },
    ],
    useCases: [
      'EHR implementation',
      'Staff onboarding',
      'Process improvement',
      'Practice standardization',
      'Workflow audits',
    ],
    category: 'healthcare',
    categoryName: 'Healthcare & Life Sciences',
  },
  {
    slug: 'telehealth-architecture-diagram',
    title: 'Telehealth System Architecture Diagram',
    shortDescription:
      'Illustrate the components powering a secure video-based virtual care platform',
    longDescription:
      'A telehealth architecture diagram shows the technical components that deliver a virtual care visit: the patient-facing mobile and web apps, the video conferencing service, the scheduling and EHR integration layer, identity and authentication, and the HIPAA-compliant backend that stores encounter data. It maps how a video stream, patient records, and e-prescriptions move securely between systems.\n\nHealthcare engineers, solution architects, and compliance officers use these diagrams to design scalable virtual care platforms and document data flows for security reviews. They are essential during vendor evaluation, HIPAA risk assessments, and integration projects that connect a new telehealth product to existing clinical and pharmacy systems.',
    tags: [
      'telehealth',
      'virtual care',
      'telemedicine architecture',
      'video visit',
      'hipaa',
      'system architecture',
    ],
    keywords: [
      'telehealth architecture',
      'telehealth architecture diagram',
      'telemedicine system design',
      'virtual care platform diagram',
      'telehealth system architecture',
    ],
    layout: 'hub',
    centerLabel: 'Telehealth Platform',
    centerIcon: 'cloud',
    satellites: [
      {
        label: 'Patient Mobile App',
        icon: 'mobile',
      },
      {
        label: 'Provider Web Portal',
        icon: 'web',
      },
      {
        label: 'Video Conferencing Service',
        icon: 'chat',
      },
      {
        label: 'Identity & Auth',
        icon: 'process',
      },
      {
        label: 'EHR Integration (HL7/FHIR)',
        icon: 'database',
      },
      {
        label: 'E-Prescribing Service',
        icon: 'process',
      },
      {
        label: 'Encrypted Data Store',
        icon: 'drive',
      },
    ],
    faqs: [
      {
        q: 'What is a telehealth architecture diagram?',
        a: 'It is a technical diagram showing how the apps, video service, authentication, EHR integration, and data storage components connect to deliver a secure virtual care visit.',
      },
      {
        q: 'What components make up a telehealth platform?',
        a: 'Core components include patient and provider apps, a video conferencing service, identity and authentication, EHR integration via HL7 or FHIR, e-prescribing, and an encrypted data store.',
      },
      {
        q: 'How is telehealth data kept HIPAA compliant?',
        a: 'Data is encrypted in transit and at rest, access is controlled through authentication and audit logging, and integrations use secure standards like FHIR with signed BAAs between parties.',
      },
    ],
    useCases: [
      'Platform architecture design',
      'HIPAA risk assessments',
      'Vendor evaluation',
      'Security reviews',
      'Integration planning',
    ],
    category: 'healthcare',
    categoryName: 'Healthcare & Life Sciences',
  },
  {
    slug: 'ehr-system-diagram',
    title: 'EHR System Architecture Diagram',
    shortDescription:
      'Show the modules and data integrations that make up an electronic health record',
    longDescription:
      'An EHR system diagram maps the core modules of an electronic health record platform and how they exchange data, including patient demographics, clinical documentation, computerized provider order entry, the pharmacy and medication module, lab and imaging interfaces, billing, and the patient portal. It shows how interface engines using HL7 and FHIR connect the EHR to external labs, billing systems, and health information exchanges.\n\nHealth IT analysts, integration engineers, and clinical informaticists use these diagrams to plan implementations, troubleshoot interfaces, and document how data flows across the system. They are particularly useful during an EHR migration, an interoperability project, or when onboarding technical staff to a complex clinical platform for the first time.',
    tags: [
      'ehr',
      'emr',
      'health it',
      'clinical systems',
      'hl7',
      'fhir',
      'interoperability',
    ],
    keywords: [
      'ehr system diagram',
      'ehr architecture diagram',
      'electronic health record diagram',
      'emr system components',
      'ehr integration diagram',
    ],
    layout: 'hub',
    centerLabel: 'EHR Core',
    centerIcon: 'database',
    satellites: [
      {
        label: 'Patient Demographics',
        icon: 'database',
      },
      {
        label: 'Clinical Documentation',
        icon: 'process',
      },
      {
        label: 'CPOE Order Entry',
        icon: 'process',
      },
      {
        label: 'Pharmacy & Medications',
        icon: 'process',
      },
      {
        label: 'Lab & Imaging Interfaces',
        icon: 'search',
      },
      {
        label: 'Patient Portal',
        icon: 'web',
      },
      {
        label: 'Billing & Claims',
        icon: 'process',
      },
    ],
    faqs: [
      {
        q: 'What is an EHR system diagram?',
        a: 'It is a diagram showing the modules of an electronic health record platform, such as documentation, order entry, and pharmacy, and how they exchange data with each other and external systems.',
      },
      {
        q: 'What are the main components of an EHR?',
        a: 'Key components include patient demographics, clinical documentation, computerized provider order entry, a pharmacy module, lab and imaging interfaces, a patient portal, and billing.',
      },
      {
        q: 'How do EHR systems share data?',
        a: 'EHRs exchange data through interface engines using standards like HL7 v2 and FHIR, connecting to external labs, pharmacies, billing systems, and health information exchanges.',
      },
    ],
    useCases: [
      'EHR implementation',
      'Interoperability projects',
      'Interface troubleshooting',
      'Technical onboarding',
      'System migration planning',
    ],
    category: 'healthcare',
    categoryName: 'Healthcare & Life Sciences',
  },
  {
    slug: 'care-coordination-flow',
    title: 'Care Coordination Flow Diagram',
    shortDescription:
      'Map how providers, care managers, and services collaborate around one patient',
    longDescription:
      "A care coordination flow diagram shows how multiple providers and services work together to manage a patient's care, especially for those with chronic or complex conditions. It centers on the patient and connects the primary care provider, specialists, the care manager, pharmacy, behavioral health, and community or home health services, mapping referrals, shared care plans, and the communication paths between them.\n\nCare managers, population health teams, and ACO leaders use these diagrams to close care gaps, prevent duplicate services, and smooth transitions between settings. They are central to value-based care programs, chronic care management, and post-discharge planning, where tight coordination is what drives better outcomes and lower total cost of care.",
    tags: [
      'care coordination',
      'care management',
      'population health',
      'value-based care',
      'chronic care',
      'care team',
    ],
    keywords: [
      'care coordination flow',
      'care coordination diagram',
      'care coordination model',
      'care management workflow',
      'patient care coordination',
    ],
    layout: 'hub',
    centerLabel: 'Patient Care Plan',
    centerIcon: 'process',
    satellites: [
      {
        label: 'Primary Care Provider',
        icon: 'process',
      },
      {
        label: 'Specialists',
        icon: 'process',
      },
      {
        label: 'Care Manager',
        icon: 'chat',
      },
      {
        label: 'Pharmacy',
        icon: 'process',
      },
      {
        label: 'Behavioral Health',
        icon: 'process',
      },
      {
        label: 'Home & Community Services',
        icon: 'social',
      },
      {
        label: 'Shared Care Plan',
        icon: 'drive',
      },
    ],
    faqs: [
      {
        q: 'What is care coordination?',
        a: "Care coordination is the deliberate organization of patient care activities and information sharing among all participants involved in a patient's care to achieve safer, more effective treatment.",
      },
      {
        q: 'What does a care coordination flow diagram show?',
        a: 'It shows the patient at the center connected to providers, care managers, pharmacy, behavioral health, and community services, mapping referrals, shared plans, and communication paths.',
      },
      {
        q: 'Why is care coordination important in value-based care?',
        a: 'Strong coordination reduces care gaps, prevents duplicate services, and improves transitions between settings, which lowers costs and improves outcomes in value-based and ACO programs.',
      },
    ],
    useCases: [
      'Value-based care programs',
      'Chronic care management',
      'Post-discharge planning',
      'ACO care models',
      'Population health design',
    ],
    category: 'healthcare',
    categoryName: 'Healthcare & Life Sciences',
  },
  {
    slug: 'lab-workflow-diagram',
    title: 'Clinical Lab Workflow Diagram',
    shortDescription:
      'Trace a lab specimen from order and collection through testing to result reporting',
    longDescription:
      'A lab workflow diagram traces a laboratory specimen through its full lifecycle across the pre-analytical, analytical, and post-analytical phases. It covers test ordering, specimen collection and labeling, accessioning in the LIS, analyzer testing, result validation, and reporting back to the ordering provider and EHR, with quality control checkpoints built in along the way.\n\nLab managers, medical technologists, and LIS analysts use these diagrams to find turnaround-time bottlenecks, cut specimen errors, and meet CLIA and CAP accreditation requirements. They are especially valuable during lab automation projects, instrument onboarding, and process improvement work focused on tightening the total testing process from order to result.',
    tags: [
      'lab workflow',
      'laboratory',
      'lis',
      'specimen processing',
      'clinical lab',
      'diagnostics',
    ],
    keywords: [
      'lab workflow diagram',
      'laboratory workflow',
      'clinical lab process flow',
      'lab testing workflow',
      'specimen processing diagram',
    ],
    layout: 'hub',
    centerLabel: 'Lab Testing Process',
    centerIcon: 'process',
    satellites: [
      {
        label: 'Test Order Entry',
        icon: 'process',
      },
      {
        label: 'Specimen Collection',
        icon: 'process',
      },
      {
        label: 'Accessioning (LIS)',
        icon: 'database',
      },
      {
        label: 'Analyzer Testing',
        icon: 'process',
      },
      {
        label: 'Result Validation',
        icon: 'search',
      },
      {
        label: 'Quality Control',
        icon: 'search',
      },
      {
        label: 'Result Reporting to EHR',
        icon: 'database',
      },
    ],
    faqs: [
      {
        q: 'What is a lab workflow diagram?',
        a: 'It is a diagram tracing a specimen through the laboratory, from test ordering and collection through accessioning, analysis, validation, and result reporting back to the provider.',
      },
      {
        q: 'What are the three phases of lab workflow?',
        a: 'The total testing process has three phases: pre-analytical (ordering and collection), analytical (testing on analyzers), and post-analytical (validation and result reporting).',
      },
      {
        q: 'How do you reduce lab turnaround time?',
        a: 'Map the workflow to find bottlenecks, automate accessioning and specimen routing, reduce manual handoffs, and add quality control checkpoints to catch errors early.',
      },
    ],
    useCases: [
      'Lab automation projects',
      'Turnaround-time improvement',
      'CLIA/CAP accreditation',
      'Instrument onboarding',
      'Specimen error reduction',
    ],
    category: 'healthcare',
    categoryName: 'Healthcare & Life Sciences',
  },
  {
    slug: 'drug-development-pipeline-diagram',
    title: 'Drug Development Pipeline Diagram',
    shortDescription:
      'Outline the stages a new drug moves through from discovery to market approval',
    longDescription:
      'A drug development pipeline diagram outlines the sequential stages a candidate compound moves through on its way to becoming an approved therapy: discovery and target identification, preclinical research, the three phases of clinical trials, FDA review, and post-market surveillance. It highlights the gates and attrition between phases along with regulatory milestones such as the IND and NDA filings.\n\nBiotech and pharma teams, regulatory affairs professionals, and investors use these diagrams to communicate program status, plan timelines, and explain risk. They appear constantly in investor decks, R&D portfolio reviews, and partnership discussions, where a clear, single-glance view of the development pipeline is essential to the conversation.',
    tags: [
      'drug development',
      'pharma pipeline',
      'clinical trials',
      'preclinical',
      'fda approval',
      'life sciences',
    ],
    keywords: [
      'drug development pipeline',
      'drug development pipeline diagram',
      'drug discovery process',
      'clinical trial phases diagram',
      'pharma pipeline template',
    ],
    layout: 'tree',
    centerLabel: 'Drug Development Pipeline',
    centerIcon: 'process',
    satellites: [
      {
        label: 'Discovery & Target ID',
        icon: 'search',
      },
      {
        label: 'Preclinical Research',
        icon: 'process',
      },
      {
        label: 'Phase I Trials',
        icon: 'process',
      },
      {
        label: 'Phase II Trials',
        icon: 'process',
      },
      {
        label: 'Phase III Trials',
        icon: 'process',
      },
      {
        label: 'FDA Review (NDA)',
        icon: 'process',
      },
      {
        label: 'Post-Market Surveillance',
        icon: 'search',
      },
    ],
    treeChildren: [
      {
        label: 'Discovery & Target ID',
        icon: 'search',
        children: [
          {
            label: 'Target Identification',
            icon: 'search',
          },
          {
            label: 'Lead Compound Screening',
            icon: 'process',
          },
        ],
      },
      {
        label: 'Preclinical Research',
        icon: 'process',
        children: [
          {
            label: 'In Vitro & In Vivo Testing',
            icon: 'process',
          },
          {
            label: 'IND Filing',
            icon: 'process',
          },
        ],
      },
      {
        label: 'Clinical Trials',
        icon: 'process',
        children: [
          {
            label: 'Phase I (Safety)',
            icon: 'process',
          },
          {
            label: 'Phase II (Efficacy)',
            icon: 'process',
          },
          {
            label: 'Phase III (Confirmatory)',
            icon: 'process',
          },
        ],
      },
      {
        label: 'Regulatory & Market',
        icon: 'process',
        children: [
          {
            label: 'FDA Review (NDA)',
            icon: 'process',
          },
          {
            label: 'Post-Market Surveillance',
            icon: 'search',
          },
        ],
      },
    ],
    faqs: [
      {
        q: 'What is a drug development pipeline?',
        a: 'It is the sequence of stages a drug candidate passes through, from discovery and preclinical research through clinical trial phases, FDA review, and post-market surveillance.',
      },
      {
        q: 'What are the phases of clinical trials?',
        a: 'Phase I tests safety in small healthy groups, Phase II evaluates efficacy and dosing in patients, and Phase III confirms efficacy and monitors side effects in large populations before approval.',
      },
      {
        q: 'How long does drug development take?',
        a: 'Bringing a new drug from discovery to approval typically takes 10 to 15 years, with significant attrition at each phase of the pipeline.',
      },
      {
        q: 'What is an IND and NDA?',
        a: 'An Investigational New Drug (IND) application is filed before human trials begin, and a New Drug Application (NDA) is submitted to the FDA seeking approval to market the drug.',
      },
    ],
    useCases: [
      'Investor decks',
      'R&D portfolio reviews',
      'Partnership discussions',
      'Regulatory planning',
      'Program status updates',
    ],
    category: 'healthcare',
    categoryName: 'Healthcare & Life Sciences',
  },
];
