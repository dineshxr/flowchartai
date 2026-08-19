// Client helpers for the svgl.app logo catalog (665+ real brand SVGs), always
// through our cached same-origin proxy at /api/svgl. Two consumers:
//
//   1. AI generation — after a diagram is generated, node labels are matched
//      against the catalog and confident matches become image icon-overrides
//      (data: URLs, so they survive SVG serialization + PNG/MP4 export).
//   2. The element inspector's logo picker — popular logos + search.

export interface SvglThemed {
  light: string;
  dark: string;
}

export interface SvglItem {
  id?: number;
  title: string;
  category: string | string[];
  route: string | SvglThemed;
  wordmark?: string | SvglThemed;
}

/** The svg file URL for a catalog item (light variant — tiles are white). */
export function svglRouteUrl(item: SvglItem): string {
  return typeof item.route === 'string' ? item.route : item.route.light;
}

/** Same-origin URL serving the sanitized SVG — safe as a plain <img> src. */
export function svglProxyUrl(routeUrl: string): string {
  return `/api/svgl?svg=${encodeURIComponent(routeUrl)}`;
}

// ---- catalog index ----------------------------------------------------------

let indexPromise: Promise<SvglItem[]> | null = null;

/** Fetch (once per session) the full svgl catalog. Resolves [] on failure. */
export function getSvglIndex(): Promise<SvglItem[]> {
  if (!indexPromise) {
    indexPromise = fetch('/api/svgl')
      .then((r) => (r.ok ? r.json() : []))
      .then((items) => (Array.isArray(items) ? (items as SvglItem[]) : []))
      .catch(() => {
        // Let a later call retry instead of pinning a failed empty index.
        indexPromise = null;
        return [] as SvglItem[];
      });
  }
  return indexPromise;
}

// ---- label -> logo matching -------------------------------------------------

const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/gi, '');

// Common shorthand -> normalized svgl title. Matching is otherwise EXACT on the
// normalized title, so a diagram node only gets a logo when its label really is
// that product ("Postgres" -> PostgreSQL, but "User DB" matches nothing).
const SVGL_ALIASES: Record<string, string> = {
  postgres: 'postgresql',
  mongo: 'mongodb',
  k8s: 'kubernetes',
  aws: 'amazonwebservices',
  amazon: 'amazonwebservices',
  azure: 'microsoftazure',
  gcp: 'googlecloud',
  googlecloudplatform: 'googlecloud',
  vscode: 'visualstudiocode',
  js: 'javascript',
  ts: 'typescript',
  golang: 'go',
  claude: 'claudeai',
  chatgpt: 'openai',
  gpt: 'openai',
  gpt4: 'openai',
  mistral: 'mistralai',
  perplexity: 'perplexityai',
  twitter: 'xformerlytwitter',
  x: 'xformerlytwitter',
  kafka: 'apachekafka',
  dotnet: 'microsoftnet',
  sqlserver: 'microsoftsqlserver',
  excel: 'microsoftexcel',
  word: 'microsoftword',
  powerpoint: 'microsoftpowerpoint',
  teams: 'microsoftteams',
  outlook: 'microsoftoutlook',
  onedrive: 'microsoftonedrive',
  sharepoint: 'microsoftsharepoint',
  copilot: 'githubcopilot',
  hf: 'huggingface',
  nextjs: 'nextjs',
  shadcn: 'shadcnui',
  tailwind: 'tailwindcss',
  wordpresscom: 'wordpress',
};

let titleLookup: { source: SvglItem[]; map: Map<string, SvglItem> } | null =
  null;

function lookupFor(items: SvglItem[]): Map<string, SvglItem> {
  if (titleLookup?.source === items) return titleLookup.map;
  const map = new Map<string, SvglItem>();
  for (const item of items) {
    const key = normalize(item.title ?? '');
    // Duplicate titles exist in the catalog (e.g. "Arc") — first one wins.
    if (key && !map.has(key)) map.set(key, item);
  }
  titleLookup = { source: items, map };
  return map;
}

/** Exact (normalized, alias-aware) title match for a node label, else null. */
export function findSvglByLabel(
  label: string | undefined,
  items: SvglItem[]
): SvglItem | null {
  const n = normalize(label ?? '');
  if (!n) return null;
  // Alias first, THEN the length guard — so "X" (aliased to the X/Twitter
  // entry) matches while stray single letters still bail out.
  const target = SVGL_ALIASES[n] ?? n;
  if (target.length < 2) return null;
  return lookupFor(items).get(target) ?? null;
}

// ---- SVG -> data: URL -------------------------------------------------------

function svgToDataUrl(svg: string): string {
  const bytes = new TextEncoder().encode(svg);
  let bin = '';
  const CHUNK = 8192;
  for (let i = 0; i < bytes.length; i += CHUNK) {
    bin += String.fromCharCode(...bytes.subarray(i, i + CHUNK));
  }
  return `data:image/svg+xml;base64,${btoa(bin)}`;
}

const dataUrlCache = new Map<string, Promise<string | null>>();

/**
 * Fetch a logo's SVG through the proxy and return it as a data: URL (null on
 * failure). Data URLs stay same-origin-safe for export rasterization and are
 * persisted verbatim inside saved icon overrides.
 */
export function fetchSvglDataUrl(routeUrl: string): Promise<string | null> {
  const cached = dataUrlCache.get(routeUrl);
  if (cached) return cached;
  const p = fetch(svglProxyUrl(routeUrl))
    .then((r) => (r.ok ? r.text() : null))
    .then((text) =>
      text?.trim().startsWith('<svg') ? svgToDataUrl(text) : null
    )
    .catch(() => null)
    .then((result) => {
      if (result === null) dataUrlCache.delete(routeUrl);
      return result;
    });
  dataUrlCache.set(routeUrl, p);
  return p;
}

// ---- AI-generation enrichment ----------------------------------------------

/**
 * Match diagram nodes' labels against the svgl catalog and return
 * key -> data URL for every confident match. Never rejects; a `timeoutMs`
 * guard returns whatever resolved in time (usually everything — the index and
 * SVGs are small and server-cached) so a slow svgl can't stall generation.
 */
export async function matchLogosForNodes(
  nodes: Array<{ key: string; label?: string }>,
  timeoutMs = 3000
): Promise<Record<string, string>> {
  const run = (async () => {
    const items = await getSvglIndex();
    if (items.length === 0) return {};
    const out: Record<string, string> = {};
    await Promise.all(
      nodes.map(async ({ key, label }) => {
        const item = findSvglByLabel(label, items);
        if (!item) return;
        const dataUrl = await fetchSvglDataUrl(svglRouteUrl(item));
        if (dataUrl) out[key] = dataUrl;
      })
    );
    return out;
  })().catch(() => ({}) as Record<string, string>);

  const timeout = new Promise<Record<string, string>>((resolve) =>
    setTimeout(() => resolve({}), timeoutMs)
  );
  return Promise.race([run, timeout]);
}

// ---- picker catalog ---------------------------------------------------------

// Shown as the "Popular" grid in the canvas logo picker, in this order.
// Filtered against the live catalog at runtime, so a renamed/removed entry
// simply drops out instead of rendering a broken tile.
export const POPULAR_SVGL_TITLES: string[] = [
  'GitHub',
  'Google',
  'Apple',
  'Microsoft',
  'OpenAI',
  'Claude AI',
  'Gemini',
  'Meta',
  'X (formerly Twitter)',
  'Instagram',
  'WhatsApp',
  'TikTok',
  'YouTube',
  'LinkedIn',
  'Discord',
  'Slack',
  'Notion',
  'Figma',
  'Stripe',
  'Shopify',
  'PayPal',
  'Amazon Web Services',
  'Microsoft Azure',
  'Google Cloud',
  'Vercel',
  'Cloudflare',
  'Supabase',
  'Firebase',
  'MongoDB',
  'PostgreSQL',
  'Redis',
  'Docker',
  'Kubernetes',
  'React',
  'Next.js',
  'Tailwind CSS',
  'TypeScript',
  'Python',
  'Node.js',
  'Flutter',
  'Android',
  'Linux',
  'Chrome',
  'Gmail',
  'Zoom',
  'Salesforce',
  'Spotify',
];

/** The popular subset of the catalog, in curated order. */
export function popularSvglItems(items: SvglItem[]): SvglItem[] {
  const map = lookupFor(items);
  const out: SvglItem[] = [];
  for (const title of POPULAR_SVGL_TITLES) {
    const item = map.get(normalize(title));
    if (item) out.push(item);
  }
  return out;
}

/** Simple title search over the catalog for the picker. */
export function searchSvgl(
  items: SvglItem[],
  query: string,
  max = 24
): SvglItem[] {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];
  const starts: SvglItem[] = [];
  const contains: SvglItem[] = [];
  for (const item of items) {
    const t = (item.title ?? '').toLowerCase();
    if (t.startsWith(q)) starts.push(item);
    else if (t.includes(q)) contains.push(item);
    if (starts.length >= max) break;
  }
  return [...starts, ...contains].slice(0, max);
}
