// Capture any animated web page element as a genuinely animated MP4, in any
// aspect ratio. Project-agnostic: the page it renders and the element it
// captures come from config, so this works for any app that can display one
// animation per URL.
//
// WHY IT WORKS THIS WAY — read before "simplifying":
//
//   1. Automation/MCP browser tabs run BACKGROUNDED. `document.hidden` is true
//      and requestAnimationFrame fires ZERO times, so CSS/SMIL animation never
//      advances. Anything captured through them is static by construction.
//   2. Frameworks that "seek" an animation and bake its state onto a serialized
//      clone are easy to get wrong and fail silently — they emit N identical
//      frames, which encode to a perfectly valid video that looks completely
//      static, at a suspiciously small file size.
//
// So: render live in HEADLESS Chrome (which actually paints), screenshot while
// the animation genuinely plays, and PROVE the frames differ before encoding.
//
// Usage:
//   node <skill>/scripts/render.mjs [--format linkedin] [--only <slug>]
//                                   [--config <path>] [--list-formats]
import { execFileSync } from 'child_process';
import { promises as fs } from 'fs';
import { createRequire } from 'module';
import os from 'os';
import path from 'path';
import { pathToFileURL } from 'url';

// ── format presets ──────────────────────────────────────────────────────────
// `stage` is what the browser renders; `out` is the encoded size. Render the
// stage SMALLER than the output on purpose — per-screenshot cost sets the
// capture frame rate, so a full-size stage halves fps and motion turns choppy.
const FORMATS = {
  linkedin:  { stage: [960, 540], out: [1280, 720],  label: '16:9 landscape' },
  landscape: { stage: [960, 540], out: [1280, 720],  label: '16:9 landscape' },
  // Stage is shorter than true 9:16 on purpose: ffmpeg pads ~128px top/bottom,
  // pushing the in-stage title/content out of TikTok's tab/caption overlay zones.
  vertical:  { stage: [540, 832], out: [1080, 1920], label: '9:16 vertical'  },
  square:    { stage: [720, 720], out: [1080, 1080], label: '1:1 square'     },
  portrait:  { stage: [720, 900], out: [1080, 1350], label: '4:5 portrait'   },
  // Animated GIF (looping, two-pass palette). Stage == out so pixels are 1:1
  // crisp; GIFs balloon fast, so keep dimensions modest.
  gif:       { stage: [640, 640], out: [640, 640],   label: '1:1 GIF'        },
};

const argv = process.argv.slice(2);
const has = (n) => argv.includes(`--${n}`);
const arg = (n, d) => {
  const i = argv.indexOf(`--${n}`);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : d;
};

if (has('list-formats')) {
  for (const [k, v] of Object.entries(FORMATS)) {
    console.log(`${k.padEnd(10)} ${v.label.padEnd(16)} stage ${v.stage.join('x')} → out ${v.out.join('x')}`);
  }
  process.exit(0);
}

// ── config resolution ───────────────────────────────────────────────────────
const CANDIDATES = [
  arg('config'),
  'campaign.config.json',
  '.claude/campaign.config.json',
].filter(Boolean);

let cfg, cfgPath;
for (const p of CANDIDATES) {
  try {
    cfg = JSON.parse(await fs.readFile(p, 'utf8'));
    cfgPath = p;
    break;
  } catch {}
}
if (!cfg) {
  console.error(
    `No campaign config found. Looked for:\n  ${CANDIDATES.join('\n  ')}\n\n` +
    `Copy campaign.config.example.json from this skill into your project root ` +
    `as campaign.config.json and edit it.`
  );
  process.exit(1);
}
console.log(`→ config: ${cfgPath}`);

const need = (v, name) => {
  if (!v) {
    console.error(`config is missing required field: ${name}`);
    process.exit(1);
  }
  return v;
};

const FORMAT_KEY = arg('format', cfg.format || 'linkedin');
const FORMAT = FORMATS[FORMAT_KEY];
if (!FORMAT) {
  console.error(`unknown --format "${FORMAT_KEY}". one of: ${Object.keys(FORMATS).join(', ')}`);
  process.exit(1);
}
const ONLY = arg('only');

const urlTemplate = need(cfg.source?.urlTemplate, 'source.urlTemplate');
const selector = need(cfg.source?.selector, 'source.selector');
const itemsFile = need(cfg.source?.itemsFile, 'source.itemsFile');

const WORK =
  cfg.workDir ||
  path.join(os.tmpdir(), 'social-campaign', path.basename(process.cwd()));
const CHROME =
  cfg.chromePath ||
  (process.platform === 'darwin'
    ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
    : '/usr/bin/google-chrome');
const FRAMES = cfg.framesPerClip || 56;
const SETTLE = cfg.settleMs ?? 2500;
const OUT = path.join(WORK, 'clips', FORMAT_KEY);
const [SW, SH] = FORMAT.stage;
const [OW, OH] = FORMAT.out;

// puppeteer-core is resolved from the PROJECT, not the skill — install it there
// (`pnpm add -D puppeteer-core`). It drives the Chrome you already have.
// createRequire resolves through the project's node_modules, which matters
// under pnpm where packages live in a .pnpm store rather than a flat tree.
let puppeteer;
try {
  const require = createRequire(path.join(process.cwd(), '/'));
  const mod = await import(pathToFileURL(require.resolve('puppeteer-core')).href);
  puppeteer = mod.default ?? mod;
} catch (e) {
  console.error(
    'puppeteer-core not found in this project. Run:\n  pnpm add -D puppeteer-core\n' +
      `(resolution error: ${String(e).slice(0, 120)})`
  );
  process.exit(1);
}

// ── watermark (scales with output height so it reads the same everywhere) ────
const wmText = (cfg.watermark?.text || '').trim();
const wmFont =
  cfg.watermark?.fontFile || '/System/Library/Fonts/Supplemental/Arial Bold.ttf';
const wmSize = Math.round(OH * 0.028);
const WM = wmText
  ? `,drawtext=fontfile=${wmFont}:text='${wmText.replace(/'/g, "\\'")}'` +
    `:fontcolor=white:fontsize=${wmSize}:box=1:boxcolor=0x0f172ac4` +
    `:boxborderw=${Math.round(wmSize * 0.55)}` +
    `:x=w-tw-${Math.round(wmSize * 1.3)}:y=h-th-${Math.round(wmSize * 1.15)}`
  : '';

await fs.mkdir(OUT, { recursive: true });
const itemsPath = path.isAbsolute(itemsFile)
  ? itemsFile
  : path.join(WORK, itemsFile);
const items = JSON.parse(await fs.readFile(itemsPath, 'utf8'));
const targets = ONLY ? items.filter((c) => c.slug === ONLY) : items;
if (!targets.length) {
  console.error(`no items matched${ONLY ? ` --only ${ONLY}` : ''} in ${itemsPath}`);
  process.exit(1);
}

console.log(`→ ${targets.length} item(s), ${FORMAT.label} (${OW}x${OH}) → ${OUT}`);

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'shell',
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
  defaultViewport: {
    width: SW + 240,
    height: SH + 220,
    deviceScaleFactor: cfg.deviceScaleFactor || 1,
  },
});

const manifest = [];
const failures = [];

try {
  for (const [i, c] of targets.entries()) {
    const tag = `[${i + 1}/${targets.length}] ${c.slug}`;
    const frameDir = path.join(OUT, `_${c.slug}`);
    await fs.rm(frameDir, { recursive: true, force: true });
    await fs.mkdir(frameDir, { recursive: true });
    const page = await browser.newPage();
    try {
      const url = urlTemplate
        .replace('{slug}', encodeURIComponent(c.slug))
        .replace('{w}', String(SW))
        .replace('{h}', String(SH));
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 90000 });

      const stage = await page.waitForSelector(selector, { timeout: 45000 });
      if (!stage) throw new Error(`selector "${selector}" never appeared`);

      // If rAF is dead the capture is static — fail loudly rather than ship it.
      const ticks = await page.evaluate(
        () => new Promise((res) => {
          let n = 0;
          const t = () => { n++; if (n < 4) requestAnimationFrame(t); };
          requestAnimationFrame(t);
          setTimeout(() => res(n), 400);
        })
      );
      if (!ticks) throw new Error('requestAnimationFrame not firing — capture would be static');

      await new Promise((r) => setTimeout(r, SETTLE));

      const t0 = Date.now();
      for (let f = 0; f < FRAMES; f++) {
        await stage.screenshot({
          path: path.join(frameDir, `f${String(f).padStart(4, '0')}.png`),
          type: 'png',
        });
      }
      // Replay at the rate actually captured so motion runs at real speed.
      const fps = Math.max(8, Math.min(24, FRAMES / ((Date.now() - t0) / 1000)));

      const files = (await fs.readdir(frameDir)).filter((f) => f.endsWith('.png'));
      const distinct = new Set(
        files.map((f) =>
          execFileSync(process.platform === 'darwin' ? 'md5' : 'md5sum', [
            ...(process.platform === 'darwin' ? ['-q'] : []),
            path.join(frameDir, f),
          ]).toString().trim()
        )
      ).size;
      // THE check. Never remove it.
      if (distinct < 3) throw new Error(`static capture (${distinct} distinct frames)`);

      // -framerate on the INPUT. An `fps=` filter instead leaves ffmpeg's 25fps
      // image-sequence default in place and plays everything ~2.4x too fast.
      const vf =
        `scale=${OW}:${OH}:force_original_aspect_ratio=decrease,` +
        `pad=${OW}:${OH}:(ow-iw)/2:(oh-ih)/2:${cfg.padColor || 'white'}${WM}`;
      let outFile;
      if (FORMAT_KEY === 'gif') {
        // Looping GIF via the classic two-pass palette (a one-pass GIF encode
        // dithers to the generic 256-color web palette and bands badly).
        outFile = path.join(OUT, `${c.slug}.gif`);
        const palette = path.join(frameDir, 'palette.png');
        const input = [
          '-framerate', fps.toFixed(2),
          '-i', path.join(frameDir, 'f%04d.png'),
        ];
        execFileSync('ffmpeg', [
          '-y', '-loglevel', 'error', ...input,
          '-vf', `${vf},palettegen=stats_mode=diff`, palette,
        ]);
        execFileSync('ffmpeg', [
          '-y', '-loglevel', 'error', ...input, '-i', palette,
          '-lavfi',
          `${vf}[x];[x][1:v]paletteuse=dither=bayer:bayer_scale=4:diff_mode=rectangle`,
          '-loop', '0',
          outFile,
        ]);
      } else {
        outFile = path.join(OUT, `${c.slug}.mp4`);
        execFileSync('ffmpeg', [
          '-y', '-loglevel', 'error',
          '-framerate', fps.toFixed(2),
          '-i', path.join(frameDir, 'f%04d.png'),
          '-vf', `${vf},format=yuv420p`,
          '-c:v', 'libx264', '-profile:v', 'high', '-preset', 'medium',
          '-crf', '20', '-movflags', '+faststart', '-r', '30',
          outFile,
        ]);
      }

      const { size } = await fs.stat(outFile);
      manifest.push({
        slug: c.slug, title: c.title, format: FORMAT_KEY, mp4: outFile,
        distinct, fps: Number(fps.toFixed(2)), sizeKB: Math.round(size / 1024),
      });
      console.log(`${tag}  ✓ ${distinct} distinct, ${Math.round(size / 1024)}KB`);
      await fs.rm(frameDir, { recursive: true, force: true });
    } catch (e) {
      failures.push({ slug: c.slug, error: String(e).slice(0, 200) });
      console.log(`${tag}  ✗ ${String(e).slice(0, 140)}`);
    } finally {
      await page.close();
    }
  }
} finally {
  await browser.close();
}

await fs.writeFile(
  path.join(OUT, 'manifest.json'),
  JSON.stringify({ format: FORMAT_KEY, out: FORMAT.out, manifest, failures }, null, 2)
);
console.log(`\n→ ${manifest.length} ok, ${failures.length} failed`);
console.log(`→ manifest: ${path.join(OUT, 'manifest.json')}`);
if (failures.length) {
  console.log(JSON.stringify(failures, null, 2));
  process.exitCode = 1;
}
