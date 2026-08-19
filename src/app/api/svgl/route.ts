// Cached same-origin proxy for the svgl.app logo API (https://svgl.app/docs/api).
//
//   GET /api/svgl                 -> the full svgl index (title/category/route),
//                                    trimmed and cached server-side for a day.
//   GET /api/svgl?svg=<route url> -> the raw SVG markup for one logo, sanitized
//                                    and normalized, served as image/svg+xml.
//
// svgl explicitly asks API consumers to cache responses, and serving the SVGs
// from our own origin means the canvas can embed them as data: URLs without
// CORS-tainting PNG/SVG export rasterization.

const SVGL_API = 'https://api.svgl.app';

// Only ever fetch from svgl itself — this must not become an open proxy.
const ALLOWED_HOSTS = new Set([
  'svgl.app',
  'www.svgl.app',
  'api.svgl.app',
  'cdn.svgl.app',
]);

const INDEX_CACHE =
  'public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400';
const SVG_CACHE =
  'public, max-age=86400, s-maxage=604800, stale-while-revalidate=2592000';

/** Strip scripting vectors from an SVG we re-serve from our origin. */
function sanitizeSvg(svg: string): string {
  return svg
    .replace(/<script[\s\S]*?<\/script\s*>/gi, '')
    .replace(/\son[a-z]+\s*=\s*"[^"]*"/gi, '')
    .replace(/\son[a-z]+\s*=\s*'[^']*'/gi, '')
    .replace(/\s(href|xlink:href)\s*=\s*(["'])\s*javascript:[^"']*\2/gi, '');
}

// Firefox refuses to rasterize an <image href="data:image/svg+xml..."> whose
// inner SVG lacks explicit width/height, so derive them from the viewBox.
function ensureIntrinsicSize(svg: string): string {
  const open = svg.match(/<svg\b[^>]*>/i)?.[0];
  if (!open) return svg;
  const hasW = /\swidth\s*=/i.test(open);
  const hasH = /\sheight\s*=/i.test(open);
  if (hasW && hasH) return svg;
  const vb = open.match(
    /viewBox\s*=\s*["']\s*[-\d.eE+]+[\s,]+[-\d.eE+]+[\s,]+([\d.eE+]+)[\s,]+([\d.eE+]+)/i
  );
  if (!vb) return svg;
  const w = Number.parseFloat(vb[1]);
  const h = Number.parseFloat(vb[2]);
  if (!Number.isFinite(w) || !Number.isFinite(h) || w <= 0 || h <= 0)
    return svg;
  let next = open;
  if (!hasH) next = next.replace(/<svg\b/i, `<svg height="${h}"`);
  if (!hasW) next = next.replace(/<svg\b/i, `<svg width="${w}"`);
  return svg.replace(open, next);
}

async function serveSvg(rawUrl: string): Promise<Response> {
  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    return Response.json({ error: 'Invalid svg url' }, { status: 400 });
  }
  if (url.protocol !== 'https:' || !ALLOWED_HOSTS.has(url.hostname)) {
    return Response.json({ error: 'URL not allowed' }, { status: 400 });
  }

  const upstream = await fetch(url.toString(), {
    next: { revalidate: 604800 },
  });
  if (!upstream.ok) {
    return Response.json({ error: 'Logo not found' }, { status: 404 });
  }
  const text = await upstream.text();
  const trimmed = text.trim();
  if (!(trimmed.startsWith('<svg') || trimmed.startsWith('<?xml'))) {
    return Response.json({ error: 'Not an SVG' }, { status: 415 });
  }

  const svg = ensureIntrinsicSize(sanitizeSvg(trimmed));
  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml; charset=utf-8',
      'Cache-Control': SVG_CACHE,
      'X-Content-Type-Options': 'nosniff',
      // Belt and braces: if the SVG is ever opened as a document, no scripts.
      'Content-Security-Policy':
        "default-src 'none'; style-src 'unsafe-inline'",
    },
  });
}

async function serveIndex(): Promise<Response> {
  const upstream = await fetch(SVGL_API, { next: { revalidate: 86400 } });
  if (!upstream.ok) {
    return Response.json([], {
      status: 502,
      headers: { 'Cache-Control': 'no-store' },
    });
  }
  const items = (await upstream.json()) as Array<Record<string, unknown>>;
  // Keep only what the client index needs — halves the payload.
  const trimmed = (Array.isArray(items) ? items : []).map((i) => ({
    id: i.id,
    title: i.title,
    category: i.category,
    route: i.route,
    wordmark: i.wordmark,
  }));
  return Response.json(trimmed, {
    headers: { 'Cache-Control': INDEX_CACHE },
  });
}

export async function GET(req: Request) {
  const svg = new URL(req.url).searchParams.get('svg');
  if (svg) return serveSvg(svg);
  return serveIndex();
}
