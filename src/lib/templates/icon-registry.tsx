'use client';

// Single source of truth for turning a template icon "key" (and/or a node
// label) into a renderable icon. Used by EVERY render path so the homepage
// showcase, the /templates detail hero, the catalog grid thumbnails and the
// /canvas editor all draw the exact same icon for the same template — no more
// "the thumbnail doesn't match the real template" mismatch.
//
// Resolution precedence (first match wins):
//   1. explicit 3D key   -> chunky "app-icon" squircle, rendered edge-to-edge
//   2. explicit brand key -> real company logo (in a white tile)
//   3. label -> brand     -> logo inferred from the node's text (e.g. "Claude")
//   4. concept key        -> tinted lucide glyph (bot, database, cloud, …)
//   5. fallback           -> tinted letter tile from the label's initial
//
// `flush` means "this icon brings its own background + depth, render it with no
// white tile chrome" — true for the 3D squircles only.

import {
  Bag3D,
  Bolt3D,
  Bot3D,
  Box3D,
  Brain3D,
  Chart3D,
  Cloud3D,
  Cpu3D,
  Cube3D,
  Database3D,
  Dollar3D,
  Factory3D,
  Funnel3D,
  Gear3D,
  Globe3D,
  Heart3D,
  Layers3D,
  Lock3D,
  Megaphone3D,
  Rocket3D,
  Shield3D,
  Spark3D,
  Store3D,
  Terminal3D,
  Truck3D,
  Users3D,
  Workflow3D,
} from '@/components/blocks/infogiph-home/icons-3d';
import {
  AWSIcon,
  AirflowIcon,
  AlgoliaIcon,
  AmazonIcon,
  AnthropicIcon,
  AppleIcon,
  Auth0Icon,
  ClaudeIcon,
  CloudflareIcon,
  DHLIcon,
  DbtIcon,
  DockerIcon,
  FedExIcon,
  FigmaIcon,
  GeminiIcon,
  GitHubIcon,
  GoogleAnalyticsIcon,
  GoogleCloudIcon,
  GoogleDriveIcon,
  GoogleIcon,
  GrafanaIcon,
  HuggingFaceIcon,
  InstagramIcon,
  KafkaIcon,
  KubernetesIcon,
  LangChainIcon,
  LetterIcon,
  LinearIcon,
  MailchimpIcon,
  MetaIcon,
  MicrosoftIcon,
  MongoDBIcon,
  NotionIcon,
  NpmIcon,
  NvidiaIcon,
  OpenAIIcon,
  OracleIcon,
  PineconeIcon,
  PostgresIcon,
  PyTorchIcon,
  PythonIcon,
  RedisIcon,
  SalesforceIcon,
  SapIcon,
  ShopifyIcon,
  SlackIcon,
  SnowflakeIcon,
  StripeIcon,
  TableauIcon,
  TerraformIcon,
  TikTokIcon,
  UPSIcon,
  VSCodeIcon,
  VercelIcon,
  WalmartIcon,
  WhatsAppIcon,
  YouTubeIcon,
} from '@/components/canvas/brand-icons';
import {
  Bot,
  Cloud,
  Code,
  CreditCard,
  Database,
  Globe,
  HardDrive,
  Layers,
  LineChart,
  Mail,
  MessageSquare,
  Search,
  Share2,
  Shield,
  Smartphone,
  Workflow,
  Zap,
} from 'lucide-react';
import type { CSSProperties, ComponentType, ReactNode } from 'react';

const ic = 'h-full w-full';

export interface ResolvedIcon {
  node: ReactNode;
  /** Render edge-to-edge with no white tile chrome (3D app-icon glyphs). */
  flush: boolean;
  /** What matched — lets callers treat a brand `center` specially (a colored
   *  logo shouldn't sit on the dark center tile). */
  kind: 'threed' | 'brand' | 'concept' | 'letter';
}

// ---- 1. 3D "app-icon" squircles (rendered flush) ---------------------------
const THREE_D: Record<string, () => ReactNode> = {
  cube3d: () => <Cube3D />,
  bot3d: () => <Bot3D />,
  brain3d: () => <Brain3D />,
  spark3d: () => <Spark3D />,
  rocket3d: () => <Rocket3D />,
  chart3d: () => <Chart3D />,
  database3d: () => <Database3D />,
  db3d: () => <Database3D />,
  cloud3d: () => <Cloud3D />,
  shield3d: () => <Shield3D />,
  gear3d: () => <Gear3D />,
  bolt3d: () => <Bolt3D />,
  globe3d: () => <Globe3D />,
  layers3d: () => <Layers3D />,
  funnel3d: () => <Funnel3D />,
  heart3d: () => <Heart3D />,
  dollar3d: () => <Dollar3D />,
  mega3d: () => <Megaphone3D />,
  bag3d: () => <Bag3D />,
  lock3d: () => <Lock3D />,
  users3d: () => <Users3D />,
  flow3d: () => <Workflow3D />,
  box3d: () => <Box3D />,
  truck3d: () => <Truck3D />,
  factory3d: () => <Factory3D />,
  store3d: () => <Store3D />,
  terminal3d: () => <Terminal3D />,
  cpu3d: () => <Cpu3D />,
};

// ---- 2. Brand logos --------------------------------------------------------
const BRAND: Record<string, () => ReactNode> = {
  // AI / LLM
  openai: () => <OpenAIIcon className={ic} />,
  gpt: () => <OpenAIIcon className={ic} />,
  codex: () => <OpenAIIcon className={ic} />,
  anthropic: () => <AnthropicIcon className={ic} />,
  claude: () => <ClaudeIcon className={ic} />,
  gemini: () => <GeminiIcon className={ic} />,
  google: () => <GoogleIcon className={ic} />,
  meta: () => <MetaIcon className={ic} />,
  llama: () => <MetaIcon className={ic} />,
  huggingface: () => <HuggingFaceIcon className={ic} />,
  nvidia: () => <NvidiaIcon className={ic} />,
  pytorch: () => <PyTorchIcon className={ic} />,
  langchain: () => <LangChainIcon className={ic} />,
  pinecone: () => <PineconeIcon className={ic} />,
  // Dev / DevOps / cloud
  github: () => <GitHubIcon className={ic} />,
  vscode: () => <VSCodeIcon className={ic} />,
  python: () => <PythonIcon className={ic} />,
  npm: () => <NpmIcon className={ic} />,
  vercel: () => <VercelIcon className={ic} />,
  docker: () => <DockerIcon className={ic} />,
  kubernetes: () => <KubernetesIcon className={ic} />,
  terraform: () => <TerraformIcon className={ic} />,
  aws: () => <AWSIcon className={ic} />,
  gcp: () => <GoogleCloudIcon className={ic} />,
  googlecloud: () => <GoogleCloudIcon className={ic} />,
  cloudflare: () => <CloudflareIcon className={ic} />,
  grafana: () => <GrafanaIcon className={ic} />,
  kafka: () => <KafkaIcon className={ic} />,
  airflow: () => <AirflowIcon className={ic} />,
  dbt: () => <DbtIcon className={ic} />,
  snowflake: () => <SnowflakeIcon className={ic} />,
  tableau: () => <TableauIcon className={ic} />,
  // Data stores
  postgres: () => <PostgresIcon className={ic} />,
  postgresql: () => <PostgresIcon className={ic} />,
  redis: () => <RedisIcon className={ic} />,
  mongodb: () => <MongoDBIcon className={ic} />,
  algolia: () => <AlgoliaIcon className={ic} />,
  // SaaS / business
  stripe: () => <StripeIcon className={ic} style={{ color: '#635BFF' }} />,
  shopify: () => <ShopifyIcon className={ic} style={{ color: '#95BF47' }} />,
  salesforce: () => <SalesforceIcon className={ic} />,
  mailchimp: () => <MailchimpIcon className={ic} />,
  notion: () => <NotionIcon className={ic} />,
  slack: () => <SlackIcon className={ic} />,
  figma: () => <FigmaIcon className={ic} />,
  linear: () => <LinearIcon className={ic} />,
  auth0: () => <Auth0Icon className={ic} />,
  googleanalytics: () => <GoogleAnalyticsIcon className={ic} />,
  googledrive: () => <GoogleDriveIcon className={ic} />,
  gdrive: () => <GoogleDriveIcon className={ic} />,
  // Social
  whatsapp: () => <WhatsAppIcon className={ic} style={{ color: '#25D366' }} />,
  instagram: () => (
    <InstagramIcon className={ic} style={{ color: '#E4405F' }} />
  ),
  tiktok: () => <TikTokIcon className={ic} />,
  youtube: () => <YouTubeIcon className={ic} style={{ color: '#FF0000' }} />,
  // Enterprise / supply chain / retail
  sap: () => <SapIcon className={ic} />,
  oracle: () => <OracleIcon className={ic} />,
  fedex: () => <FedExIcon className={ic} />,
  dhl: () => <DHLIcon className={ic} />,
  ups: () => <UPSIcon className={ic} />,
  amazon: () => <AmazonIcon className={ic} />,
  walmart: () => <WalmartIcon className={ic} />,
  microsoft: () => <MicrosoftIcon className={ic} />,
  azure: () => <MicrosoftIcon className={ic} />,
  apple: () => <AppleIcon className={ic} />,
};

// ---- 3. Label -> brand inference (for the generic catalog templates) -------
// Ordered: more specific patterns first.
const LABEL_BRAND: Array<[RegExp, string]> = [
  [/claude|anthropic/i, 'claude'],
  [/codex|openai|gpt|chatgpt/i, 'openai'],
  [/gemini|bard|vertex/i, 'gemini'],
  [/llama|meta ai/i, 'meta'],
  [/hugging\s?face/i, 'huggingface'],
  [/nvidia|cuda|gpu/i, 'nvidia'],
  [/pytorch/i, 'pytorch'],
  [/langchain/i, 'langchain'],
  [/pinecone|vector\s?db|vector\s?store/i, 'pinecone'],
  [/whats\s?app/i, 'whatsapp'],
  [/instagram|insta\b/i, 'instagram'],
  [/tiktok|tik\s?tok/i, 'tiktok'],
  [/youtube|you\s?tube/i, 'youtube'],
  [/slack/i, 'slack'],
  [/notion/i, 'notion'],
  [/figma/i, 'figma'],
  [/linear\b/i, 'linear'],
  [/salesforce/i, 'salesforce'],
  [/mailchimp/i, 'mailchimp'],
  [/shopify/i, 'shopify'],
  [/stripe/i, 'stripe'],
  [/auth0/i, 'auth0'],
  [/cloudflare/i, 'cloudflare'],
  [/algolia/i, 'algolia'],
  [/snowflake/i, 'snowflake'],
  [/\bdbt\b/i, 'dbt'],
  [/airflow/i, 'airflow'],
  [/tableau/i, 'tableau'],
  [/grafana/i, 'grafana'],
  [/kafka/i, 'kafka'],
  [/terraform/i, 'terraform'],
  [/kubernetes|k8s/i, 'kubernetes'],
  [/docker|container/i, 'docker'],
  [/vercel/i, 'vercel'],
  [/\bnpm\b/i, 'npm'],
  [/vs\s?code|visual studio code/i, 'vscode'],
  [/python/i, 'python'],
  [/github|git\b/i, 'github'],
  [/postgre|postgres/i, 'postgres'],
  [/redis/i, 'redis'],
  [/mongo/i, 'mongodb'],
  [/google analytics/i, 'googleanalytics'],
  [/google drive|gdrive/i, 'googledrive'],
  [/google cloud|gcp\b/i, 'gcp'],
  [/\baws\b|amazon web|s3\b|ec2|lambda|dynamodb|cloudfront/i, 'aws'],
  [/azure/i, 'azure'],
  [/microsoft/i, 'microsoft'],
  [/\bsap\b/i, 'sap'],
  [/oracle/i, 'oracle'],
  [/fedex|fed ex/i, 'fedex'],
  [/\bdhl\b/i, 'dhl'],
  [/\bups\b/i, 'ups'],
  [/walmart/i, 'walmart'],
  [/amazon/i, 'amazon'],
  [/apple\b/i, 'apple'],
];

// ---- 4. Concept glyphs (tinted lucide) -------------------------------------
const CONCEPT: Record<
  string,
  {
    Icon: ComponentType<{ className?: string; style?: CSSProperties }>;
    color: string;
  }
> = {
  bot: { Icon: Bot, color: '#8b5cf6' },
  database: { Icon: Database, color: '#0ea5e9' },
  storage: { Icon: HardDrive, color: '#0ea5e9' },
  cloud: { Icon: Cloud, color: '#38bdf8' },
  web: { Icon: Globe, color: '#3b82f6' },
  api: { Icon: Code, color: '#6366f1' },
  code: { Icon: Code, color: '#6366f1' },
  chat: { Icon: MessageSquare, color: '#10b981' },
  drive: { Icon: HardDrive, color: '#f59e0b' },
  mobile: { Icon: Smartphone, color: '#ec4899' },
  mail: { Icon: Mail, color: '#ef4444' },
  search: { Icon: Search, color: '#14b8a6' },
  process: { Icon: Workflow, color: '#a855f7' },
  automation: { Icon: Zap, color: '#f59e0b' },
  social: { Icon: Share2, color: '#ec4899' },
  payment: { Icon: CreditCard, color: '#635BFF' },
  analytics: { Icon: LineChart, color: '#10b981' },
  security: { Icon: Shield, color: '#06b6d4' },
  layers: { Icon: Layers, color: '#64748b' },
};

const hashCode = (s: string) => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h << 5) - h + s.charCodeAt(i);
  return Math.abs(h);
};

const LETTER_PALETTE = [
  '#e63946',
  '#1AC6FF',
  '#8b5cf6',
  '#f59e0b',
  '#10b981',
  '#ef4444',
  '#0ea5e9',
];

const norm = (s?: string) =>
  (s || '')
    .toLowerCase()
    .replace(/[\s_-]+/g, '')
    .trim();

function brandFromLabel(label?: string): string | null {
  if (!label) return null;
  for (const [re, key] of LABEL_BRAND) if (re.test(label)) return key;
  return null;
}

function conceptNode(key: string, white: boolean): ReactNode | null {
  const match =
    CONCEPT[key] ||
    CONCEPT[Object.keys(CONCEPT).find((k) => key.includes(k)) ?? ''];
  if (!match) return null;
  const { Icon, color } = match;
  return white ? (
    <Icon className="h-full w-full text-white" />
  ) : (
    <Icon className="h-full w-full" style={{ color }} />
  );
}

/**
 * Resolve an icon for a node.
 * @param key   explicit icon key from the template (brand / 3D / concept)
 * @param label the node's text label (used to infer a brand logo)
 * @param white render concept glyphs white (for dark center tiles)
 */
export function resolveIcon(
  key?: string,
  label?: string,
  white = false
): ResolvedIcon {
  const k = norm(key);

  // 1. explicit 3D key
  if (k && THREE_D[k])
    return { node: THREE_D[k](), flush: true, kind: 'threed' };

  // 2. explicit brand key
  if (k && BRAND[k]) return { node: BRAND[k](), flush: false, kind: 'brand' };

  // 3. brand inferred from the label
  const labelBrand = brandFromLabel(label);
  if (labelBrand && BRAND[labelBrand])
    return { node: BRAND[labelBrand](), flush: false, kind: 'brand' };

  // 4. concept glyph
  const concept = k ? conceptNode(k, white) : null;
  if (concept) return { node: concept, flush: false, kind: 'concept' };

  // 5. letter-tile fallback
  const text = (label || key || '?').trim();
  const color = LETTER_PALETTE[hashCode(text) % LETTER_PALETTE.length];
  const letter = text.charAt(0).toUpperCase() || '?';
  return {
    node: <LetterIcon className={ic} letter={letter} color={color} />,
    flush: false,
    kind: 'letter',
  };
}

/** Convenience: just the node (used where flush doesn't apply, e.g. legacy). */
export function iconNode(
  key?: string,
  label?: string,
  white = false
): ReactNode {
  return resolveIcon(key, label, white).node;
}

// ---- 6. SVG-embeddable icons (orbit satellites) -----------------------------
// Orbit satellites are drawn INSIDE the preview <svg> — they carry SMIL orbital
// motion, and the export pipeline re-rasterizes only the SVG layer per frame.
// A serialized SVG has no Tailwind/CSS, so nodes returned here must be pure SVG
// with presentation attributes only. The 3D squircles are CSS constructs; map
// them to their closest concept glyph. Anything unresolvable falls back to a
// letter tile the orbit renderer draws itself from `letter` + `tint`.

const THREE_D_CONCEPT: Record<string, string> = {
  cube3d: 'layers',
  bot3d: 'bot',
  brain3d: 'bot',
  spark3d: 'automation',
  rocket3d: 'automation',
  chart3d: 'analytics',
  database3d: 'database',
  db3d: 'database',
  cloud3d: 'cloud',
  shield3d: 'security',
  gear3d: 'process',
  bolt3d: 'automation',
  globe3d: 'web',
  layers3d: 'layers',
  funnel3d: 'analytics',
  heart3d: 'chat',
  dollar3d: 'payment',
  mega3d: 'social',
  bag3d: 'payment',
  lock3d: 'security',
  users3d: 'social',
  flow3d: 'process',
  box3d: 'layers',
  truck3d: 'process',
  factory3d: 'process',
  store3d: 'payment',
  terminal3d: 'code',
  cpu3d: 'code',
};

export interface SvgSafeIcon {
  /** Pure-SVG node (brand logo or tinted lucide glyph); null → letter tile. */
  node: ReactNode | null;
  /** Fallback initial for the renderer's own letter tile. */
  letter: string;
  /** Tint for the letter tile (or the glyph color when a concept matched). */
  tint: string;
}

/**
 * Resolve an icon to something safe to embed inside a serialized `<svg>`:
 * brand logos and lucide glyphs are SVG components (nested `<svg>` sizes to
 * 100% of its wrapper with no CSS); everything else degrades to letter data.
 */
export function resolveSvgIcon(key?: string, label?: string): SvgSafeIcon {
  const k = norm(key);
  const text = (label || key || '?').trim();
  const letter = text.charAt(0).toUpperCase() || '?';
  const fallbackTint = LETTER_PALETTE[hashCode(text) % LETTER_PALETTE.length];

  const brandKey = (k && BRAND[k] && k) || brandFromLabel(label);
  if (brandKey && BRAND[brandKey])
    return { node: BRAND[brandKey](), letter, tint: fallbackTint };

  const conceptKey = k && THREE_D[k] ? THREE_D_CONCEPT[k] : k;
  const match = conceptKey
    ? CONCEPT[conceptKey] ||
      CONCEPT[Object.keys(CONCEPT).find((c) => conceptKey.includes(c)) ?? '']
    : undefined;
  if (match) {
    // Lucide takes arbitrary SVG props; width/height must be attributes (not
    // classes) so the glyph fills its wrapper in the serialized export SVG.
    const Icon = match.Icon as ComponentType<Record<string, unknown>>;
    return {
      node: <Icon width="100%" height="100%" style={{ color: match.color }} />,
      letter,
      tint: match.color,
    };
  }

  return { node: null, letter, tint: fallbackTint };
}

// ---- Picker catalog --------------------------------------------------------
// Curated, de-duplicated key lists for the in-canvas icon/logo picker. Each key
// renders its swatch via resolveIcon(key) and is stored as the node's icon
// override when chosen, so the picker stays in lockstep with what renders.
export const ICON_PICKER_GROUPS: { label: string; keys: string[] }[] = [
  {
    label: 'Concept',
    keys: [
      'bot',
      'database',
      'storage',
      'cloud',
      'web',
      'api',
      'code',
      'chat',
      'drive',
      'mobile',
      'mail',
      'search',
      'process',
      'automation',
      'social',
      'payment',
      'analytics',
      'security',
      'layers',
    ],
  },
  {
    label: '3D',
    keys: [
      'cube3d',
      'bot3d',
      'brain3d',
      'spark3d',
      'rocket3d',
      'chart3d',
      'database3d',
      'cloud3d',
      'shield3d',
      'gear3d',
      'bolt3d',
      'globe3d',
      'layers3d',
      'funnel3d',
      'heart3d',
      'dollar3d',
      'mega3d',
      'bag3d',
      'lock3d',
      'users3d',
      'flow3d',
      'box3d',
      'truck3d',
      'factory3d',
      'store3d',
      'terminal3d',
      'cpu3d',
    ],
  },
  {
    label: 'Brands',
    keys: [
      'openai',
      'claude',
      'gemini',
      'google',
      'meta',
      'huggingface',
      'nvidia',
      'pytorch',
      'langchain',
      'pinecone',
      'github',
      'vscode',
      'python',
      'npm',
      'vercel',
      'docker',
      'kubernetes',
      'terraform',
      'aws',
      'gcp',
      'cloudflare',
      'grafana',
      'kafka',
      'airflow',
      'dbt',
      'snowflake',
      'tableau',
      'postgres',
      'redis',
      'mongodb',
      'algolia',
      'stripe',
      'shopify',
      'salesforce',
      'mailchimp',
      'notion',
      'slack',
      'figma',
      'linear',
      'auth0',
      'googleanalytics',
      'googledrive',
      'whatsapp',
      'instagram',
      'tiktok',
      'youtube',
      'sap',
      'oracle',
      'fedex',
      'dhl',
      'ups',
      'amazon',
      'walmart',
      'microsoft',
      'apple',
    ],
  },
];

/** Flat list of every pickable icon key (for the picker's search box). */
export const ALL_ICON_KEYS: string[] = ICON_PICKER_GROUPS.flatMap(
  (g) => g.keys
);
