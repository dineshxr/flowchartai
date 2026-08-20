import { promises as fs } from 'fs';
import path from 'path';
import { type NextRequest, NextResponse } from 'next/server';

// Dev-only sink for the /dev-social batch renderer: receives captured frames
// and run metadata and writes them outside the repo. Not linked from the app;
// returns 404 in production builds. Safe to delete.

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const OUT_ROOT =
  '/private/tmp/claude-501/-Users-dinesh-Infogiph/f1e81643-0ec1-4c9b-9a8c-7da0b602b958/scratchpad';

const isProd = () => process.env.NODE_ENV === 'production';
const cleanSlug = (s: string | null) =>
  (s || '').replace(/[^a-z0-9-]/g, '').slice(0, 80);

export async function GET(req: NextRequest) {
  if (isProd()) return new NextResponse(null, { status: 404 });
  const read = async (f: string) =>
    JSON.parse(await fs.readFile(path.join(OUT_ROOT, f), 'utf8'));
  // isometric cube-staircase concepts for /dev-iso (animated GIF format)
  if (req.nextUrl.searchParams.get('action') === 'iso')
    return NextResponse.json(await read('iso-concepts.json'));
  if (req.nextUrl.searchParams.get('action') !== 'concepts')
    return new NextResponse(null, { status: 400 });
  const ai = await read('concepts-ai.json');
  const tech = await read('concepts-tech.json');
  // Interleave the two tracks so consecutive posts alternate AI / systems.
  const merged: unknown[] = [];
  for (let i = 0; i < Math.max(ai.length, tech.length); i++) {
    if (ai[i]) merged.push({ ...ai[i], theme: 'ai' });
    if (tech[i]) merged.push({ ...tech[i], theme: 'tech' });
  }
  return NextResponse.json(merged);
}

export async function POST(req: NextRequest) {
  if (isProd()) return new NextResponse(null, { status: 404 });
  const q = req.nextUrl.searchParams;
  const kind = q.get('kind');

  if (kind === 'frame') {
    const slug = cleanSlug(q.get('slug'));
    const i = Number(q.get('i')) || 0;
    if (!slug) return new NextResponse(null, { status: 400 });
    const buf = Buffer.from(await req.arrayBuffer());
    const dir = path.join(OUT_ROOT, 'frames', slug);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(
      path.join(dir, `f${String(i).padStart(4, '0')}.png`),
      buf
    );
    return NextResponse.json({ ok: true });
  }

  if (kind === 'meta') {
    const body = await req.json();
    const slug = cleanSlug(body.slug);
    if (!slug) return new NextResponse(null, { status: 400 });
    const dir = path.join(OUT_ROOT, 'meta');
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(
      path.join(dir, `${slug}.json`),
      JSON.stringify(body, null, 2)
    );
    return NextResponse.json({ ok: true });
  }

  if (kind === 'status') {
    await fs.writeFile(
      path.join(OUT_ROOT, 'status.json'),
      JSON.stringify(await req.json(), null, 2)
    );
    return NextResponse.json({ ok: true });
  }

  return new NextResponse(null, { status: 400 });
}
