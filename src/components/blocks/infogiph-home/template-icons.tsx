'use client';

import {
  AlgoliaIcon,
  Auth0Icon,
  CloudflareIcon,
  DbtIcon,
  GitHubIcon,
  GoogleAnalyticsIcon,
  GoogleDriveIcon,
  InstagramIcon,
  LetterIcon,
  MailchimpIcon,
  NotionIcon,
  OpenAIIcon,
  PineconeIcon,
  PostgresIcon,
  RedisIcon,
  SalesforceIcon,
  ShopifyIcon,
  SlackIcon,
  SnowflakeIcon,
  StripeIcon,
  TableauIcon,
  TikTokIcon,
  UPSIcon,
  WhatsAppIcon,
  YouTubeIcon,
} from '@/components/canvas/brand-icons';
import {
  type Dims,
  type PreviewSpec,
  SQUARE_DIMS,
  TALL_DIMS,
  WIDE_DIMS,
} from './animated-preview';
import {
  Bag3D,
  Bolt3D,
  Brain3D,
  Chart3D,
  Cloud3D,
  Cube3D,
  Database3D,
  Dollar3D,
  Funnel3D,
  Gear3D,
  Globe3D,
  Heart3D,
  Megaphone3D,
  Rocket3D,
  Shield3D,
  Spark3D,
  Users3D,
} from './icons-3d';

// A showcase item pairs an animated diagram spec with the card metadata and the
// native frame it should render in. Collectively the set exercises every layout
// (hub-lr, pipeline, radial, tree) and every animation mode (beams, dots,
// arrows, pulses), and mixes real company logos with the chunky 3D icons.
export interface ShowcaseItem {
  key: string;
  title: string;
  desc: string;
  /** Real /templates detail page this card opens. */
  href: string;
  /** Bento role: feature band vs. masonry cell shape. */
  size: 'hero' | 'wide' | 'square' | 'tall';
  dims: Dims;
  spec: PreviewSpec;
}

const ic = 'h-full w-full';

// ---- Featured "key examples" (large landscape band) ------------------------

const aiAgent: ShowcaseItem = {
  key: 'ai-agent',
  title: 'AI Agent Architecture',
  desc: 'Autonomous agent with tools, memory & retrieval',
  href: '/templates/ai-ml/ai-agent-architecture-diagram',
  size: 'hero',
  dims: WIDE_DIMS,
  spec: {
    layout: 'radial',
    mode: 'beams',
    accent: '#6366f1',
    bg: 'linear-gradient(135deg,#eef2ff 0%,#faf5ff 100%)',
    center: { key: 'agent', icon: <Spark3D />, flush: true },
    satellites: [
      { key: 'llm', icon: <OpenAIIcon className={ic} /> },
      { key: 'vec', icon: <PineconeIcon className={ic} /> },
      { key: 'brain', icon: <Brain3D />, flush: true },
      { key: 'gh', icon: <GitHubIcon className={ic} /> },
      { key: 'nt', icon: <NotionIcon className={ic} /> },
      { key: 'rd', icon: <RedisIcon className={ic} /> },
    ],
  },
};

const microservices: ShowcaseItem = {
  key: 'microservices',
  title: 'Microservices System',
  desc: 'API gateway, services, data stores & message bus',
  href: '/templates/architecture/microservices-architecture-diagram',
  size: 'hero',
  dims: WIDE_DIMS,
  spec: {
    layout: 'hub-lr',
    mode: 'beams',
    accent: '#8b5cf6',
    bg: 'linear-gradient(135deg,#faf5ff 0%,#f5f3ff 100%)',
    left: [
      { key: 'auth', icon: <Auth0Icon className={ic} /> },
      { key: 'pg', icon: <PostgresIcon className={ic} /> },
      { key: 'rd', icon: <RedisIcon className={ic} /> },
    ],
    right: [
      { key: 'gh', icon: <GitHubIcon className={ic} /> },
      { key: 'cf', icon: <CloudflareIcon className={ic} /> },
      {
        key: 'st',
        icon: <StripeIcon className={ic} style={{ color: '#635BFF' }} />,
      },
    ],
    center: { key: 'core', icon: <Cube3D />, flush: true },
  },
};

const etlPipeline: ShowcaseItem = {
  key: 'etl-pipeline',
  title: 'ETL Data Pipeline',
  desc: 'Extract, transform & load into your warehouse',
  href: '/templates/data/etl-pipeline-diagram',
  size: 'hero',
  dims: WIDE_DIMS,
  spec: {
    layout: 'pipeline',
    mode: 'arrows',
    accent: '#14b8a6',
    bg: 'linear-gradient(135deg,#f0fdfa 0%,#ecfeff 100%)',
    nodes: [
      { key: 'sn', icon: <SnowflakeIcon className={ic} /> },
      { key: 'dbt', icon: <DbtIcon className={ic} /> },
      { key: 'db', icon: <Database3D />, flush: true },
      { key: 'ai', icon: <OpenAIIcon className={ic} /> },
      { key: 'tab', icon: <TableauIcon className={ic} /> },
    ],
  },
};

// ---- Masonry gallery (varied sizes) ----------------------------------------

const orgChart: ShowcaseItem = {
  key: 'org-chart',
  title: 'Org Chart',
  desc: 'Reporting lines across the whole company',
  href: '/templates/org-people/org-chart-template',
  size: 'tall',
  dims: TALL_DIMS,
  spec: {
    layout: 'tree',
    mode: 'pulses',
    accent: '#f97316',
    bg: 'linear-gradient(135deg,#fff7ed 0%,#fffbeb 100%)',
    root: {
      key: 'ceo',
      icon: <Users3D />,
      flush: true,
      children: [
        {
          key: 'cmo',
          icon: <LetterIcon className={ic} letter="M" color="#ec4899" />,
        },
        {
          key: 'cto',
          icon: <LetterIcon className={ic} letter="T" color="#8b5cf6" />,
          children: [
            {
              key: 'e1',
              icon: <LetterIcon className={ic} letter="E" color="#f59e0b" />,
            },
            {
              key: 'e2',
              icon: <LetterIcon className={ic} letter="E" color="#f59e0b" />,
            },
          ],
        },
        {
          key: 'coo',
          icon: <LetterIcon className={ic} letter="O" color="#f97316" />,
        },
      ],
    },
  },
};

const salesPipeline: ShowcaseItem = {
  key: 'sales-pipeline',
  title: 'Sales Pipeline',
  desc: 'Move deals from lead to closed-won',
  href: '/templates/sales-crm/sales-pipeline-diagram',
  size: 'wide',
  dims: WIDE_DIMS,
  spec: {
    layout: 'pipeline',
    mode: 'dots',
    accent: '#ef4444',
    bg: 'linear-gradient(135deg,#fef2f2 0%,#fff7ed 100%)',
    nodes: [
      { key: 'sf', icon: <SalesforceIcon className={ic} /> },
      { key: 'mc', icon: <MailchimpIcon className={ic} /> },
      { key: 'funnel', icon: <Funnel3D />, flush: true },
      {
        key: 'st',
        icon: <StripeIcon className={ic} style={{ color: '#635BFF' }} />,
      },
      { key: 'ga', icon: <GoogleAnalyticsIcon className={ic} /> },
    ],
  },
};

const zeroTrust: ShowcaseItem = {
  key: 'zero-trust',
  title: 'Zero-Trust Security',
  desc: 'Verify every request, trust no network',
  href: '/templates/security/zero-trust-architecture-diagram',
  size: 'square',
  dims: SQUARE_DIMS,
  spec: {
    layout: 'radial',
    mode: 'pulses',
    accent: '#06b6d4',
    bg: 'linear-gradient(135deg,#ecfeff 0%,#eff6ff 100%)',
    center: { key: 'shield', icon: <Shield3D />, flush: true },
    satellites: [
      { key: 'auth', icon: <Auth0Icon className={ic} /> },
      { key: 'cf', icon: <CloudflareIcon className={ic} /> },
      { key: 'gh', icon: <GitHubIcon className={ic} /> },
      { key: 'pg', icon: <PostgresIcon className={ic} /> },
      { key: 'bolt', icon: <Bolt3D />, flush: true },
      { key: 'rd', icon: <RedisIcon className={ic} /> },
    ],
  },
};

const kubernetes: ShowcaseItem = {
  key: 'kubernetes',
  title: 'Kubernetes Cluster',
  desc: 'Pods, services & ingress across nodes',
  href: '/templates/devops-cloud/kubernetes-architecture-diagram',
  size: 'square',
  dims: SQUARE_DIMS,
  spec: {
    layout: 'radial',
    mode: 'beams',
    accent: '#22c55e',
    bg: 'linear-gradient(135deg,#f0fdf4 0%,#ecfeff 100%)',
    center: { key: 'cloud', icon: <Cloud3D />, flush: true },
    satellites: [
      { key: 'gh', icon: <GitHubIcon className={ic} /> },
      { key: 'cf', icon: <CloudflareIcon className={ic} /> },
      { key: 'gear', icon: <Gear3D />, flush: true },
      { key: 'pg', icon: <PostgresIcon className={ic} /> },
      { key: 'rd', icon: <RedisIcon className={ic} /> },
      { key: 'ai', icon: <OpenAIIcon className={ic} /> },
    ],
  },
};

const marketingFunnel: ShowcaseItem = {
  key: 'marketing-funnel',
  title: 'Marketing Funnel',
  desc: 'Turn reach into signups across channels',
  href: '/templates/marketing/marketing-funnel-diagram',
  size: 'wide',
  dims: WIDE_DIMS,
  spec: {
    layout: 'hub-lr',
    mode: 'dots',
    accent: '#ec4899',
    bg: 'linear-gradient(135deg,#fdf2f8 0%,#fff1f2 100%)',
    left: [
      {
        key: 'ig',
        icon: <InstagramIcon className={ic} style={{ color: '#E4405F' }} />,
      },
      { key: 'tt', icon: <TikTokIcon className={ic} /> },
      {
        key: 'yt',
        icon: <YouTubeIcon className={ic} style={{ color: '#FF0000' }} />,
      },
    ],
    right: [
      { key: 'mc', icon: <MailchimpIcon className={ic} /> },
      { key: 'ga', icon: <GoogleAnalyticsIcon className={ic} /> },
      { key: 'alg', icon: <AlgoliaIcon className={ic} /> },
    ],
    center: { key: 'mega', icon: <Megaphone3D />, flush: true },
  },
};

const paymentFlow: ShowcaseItem = {
  key: 'payment-flow',
  title: 'Payment Processing',
  desc: 'Checkout, gateway, payout & reconciliation',
  href: '/templates/finance/payment-processing-flow-diagram',
  size: 'square',
  dims: SQUARE_DIMS,
  spec: {
    layout: 'radial',
    mode: 'pulses',
    accent: '#10b981',
    bg: 'linear-gradient(135deg,#ecfdf5 0%,#f0fdfa 100%)',
    center: { key: 'pay', icon: <Dollar3D />, flush: true },
    satellites: [
      {
        key: 'st',
        icon: <StripeIcon className={ic} style={{ color: '#635BFF' }} />,
      },
      {
        key: 'sh',
        icon: <ShopifyIcon className={ic} style={{ color: '#95BF47' }} />,
      },
      { key: 'ups', icon: <UPSIcon className={ic} /> },
      { key: 'bag', icon: <Bag3D />, flush: true },
      { key: 'pg', icon: <PostgresIcon className={ic} /> },
      { key: 'ga', icon: <GoogleAnalyticsIcon className={ic} /> },
    ],
  },
};

const cicd: ShowcaseItem = {
  key: 'cicd',
  title: 'CI/CD Pipeline',
  desc: 'Commit → build → test → ship, automatically',
  href: '/templates/devops-cloud/ci-cd-pipeline-diagram',
  size: 'wide',
  dims: WIDE_DIMS,
  spec: {
    layout: 'pipeline',
    mode: 'arrows',
    accent: '#16a34a',
    bg: 'linear-gradient(135deg,#f0fdf4 0%,#f7fee7 100%)',
    nodes: [
      { key: 'gh', icon: <GitHubIcon className={ic} /> },
      { key: 'gear', icon: <Gear3D />, flush: true },
      { key: 'rocket', icon: <Rocket3D />, flush: true },
      { key: 'cf', icon: <CloudflareIcon className={ic} /> },
      { key: 'chart', icon: <Chart3D />, flush: true },
    ],
  },
};

const serverless: ShowcaseItem = {
  key: 'serverless',
  title: 'Serverless App',
  desc: 'Functions, auth & managed data with no servers',
  href: '/templates/architecture/serverless-architecture-template',
  size: 'wide',
  dims: WIDE_DIMS,
  spec: {
    layout: 'hub-lr',
    mode: 'dots',
    accent: '#0ea5e9',
    bg: 'linear-gradient(135deg,#f0f9ff 0%,#ecfeff 100%)',
    left: [
      {
        key: 'st',
        icon: <StripeIcon className={ic} style={{ color: '#635BFF' }} />,
      },
      { key: 'auth', icon: <Auth0Icon className={ic} /> },
      { key: 'pg', icon: <PostgresIcon className={ic} /> },
    ],
    right: [
      { key: 'gd', icon: <GoogleDriveIcon className={ic} /> },
      { key: 'gh', icon: <GitHubIcon className={ic} /> },
      { key: 'nt', icon: <NotionIcon className={ic} /> },
    ],
    center: { key: 'cloud', icon: <Cloud3D />, flush: true },
  },
};

const learningPath: ShowcaseItem = {
  key: 'learning-path',
  title: 'Learning Path',
  desc: 'A structured route from basics to mastery',
  href: '/templates/education/learning-path-diagram',
  size: 'tall',
  dims: TALL_DIMS,
  spec: {
    layout: 'tree',
    mode: 'beams',
    accent: '#3b82f6',
    bg: 'linear-gradient(135deg,#eff6ff 0%,#eef2ff 100%)',
    root: {
      key: 'start',
      icon: <Brain3D />,
      flush: true,
      children: [
        {
          key: 'b1',
          icon: <Globe3D />,
          flush: true,
          children: [
            {
              key: 'l1',
              icon: <LetterIcon className={ic} letter="1" color="#3b82f6" />,
            },
            {
              key: 'l2',
              icon: <LetterIcon className={ic} letter="2" color="#3b82f6" />,
            },
          ],
        },
        { key: 'b2', icon: <Chart3D />, flush: true },
        { key: 'b3', icon: <Rocket3D />, flush: true },
      ],
    },
  },
};

const patientJourney: ShowcaseItem = {
  key: 'patient-journey',
  title: 'Patient Journey',
  desc: 'From first visit through care and follow-up',
  href: '/templates/healthcare/patient-journey-map',
  size: 'wide',
  dims: WIDE_DIMS,
  spec: {
    layout: 'pipeline',
    mode: 'dots',
    accent: '#e11d48',
    bg: 'linear-gradient(135deg,#fff1f2 0%,#fdf2f8 100%)',
    nodes: [
      { key: 'globe', icon: <Globe3D />, flush: true },
      {
        key: 'wa',
        icon: <WhatsAppIcon className={ic} style={{ color: '#25D366' }} />,
      },
      { key: 'heart', icon: <Heart3D />, flush: true },
      { key: 'sl', icon: <SlackIcon className={ic} /> },
      { key: 'chart', icon: <Chart3D />, flush: true },
    ],
  },
};

/** Big, brand-rich "key examples" rendered as a feature band. */
export const showcaseHeroes: ShowcaseItem[] = [
  aiAgent,
  microservices,
  etlPipeline,
];

/** The varied-size animated gallery beneath the heroes. */
export const showcaseGallery: ShowcaseItem[] = [
  orgChart,
  zeroTrust,
  marketingFunnel,
  kubernetes,
  cicd,
  paymentFlow,
  learningPath,
  serverless,
  salesPipeline,
  patientJourney,
];
