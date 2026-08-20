// Adds the prominent infogiph.com watermark pill + an original music track to
// every rendered TikTok clip. Watermark sits top-right at y≈176 — inside
// TikTok's safe zone (below the For You tabs, clear of the right action rail
// which starts ~40% down). Music rotates across 6 original synthesized tracks.
import { execFileSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const BASE = path.dirname(new URL(import.meta.url).pathname);
const TT = path.join(BASE, 'tiktok');
const CLIPS = path.join(TT, 'clips', 'vertical');
const FINAL = path.join(TT, 'final');
fs.mkdirSync(FINAL, { recursive: true });

const items = JSON.parse(fs.readFileSync(path.join(TT, 'items.json'), 'utf8'));
const TRACKS = ['warm-keys', 'synth-pulse', 'sunny', 'midnight', 'bounce', 'drift'];
const FONT = '/System/Library/Fonts/Supplemental/Arial Bold.ttf';

const probe = (file, sel) =>
  execFileSync('ffprobe', [
    '-v', 'error', '-show_entries', sel, '-of', 'csv=p=0', file,
  ]).toString().trim();

let ok = 0;
const failures = [];
for (const [i, it] of items.entries()) {
  const src = path.join(CLIPS, `${it.slug}.mp4`);
  const out = path.join(FINAL, `${it.slug}.mp4`);
  try {
    if (!fs.existsSync(src)) throw new Error('missing rendered clip');
    const dur = parseFloat(probe(src, 'format=duration'));
    if (!(dur >= 3)) throw new Error(`too short: ${dur}s`);
    const track = path.join(TT, 'music', `${TRACKS[i % TRACKS.length]}.wav`);
    const fadeOutStart = Math.max(0.5, dur - 0.9).toFixed(2);

    execFileSync('ffmpeg', [
      '-y', '-loglevel', 'error',
      '-i', src,
      '-i', track,
      '-filter_complex',
      `[0:v]drawtext=fontfile=${FONT}:text='infogiph.com'` +
        `:fontcolor=white:fontsize=46:box=1:boxcolor=0x4f46e5f0:boxborderw=24` +
        `:x=w-tw-56:y=176,format=yuv420p[v];` +
        `[1:a]volume=0.9,afade=t=in:st=0:d=0.25,afade=t=out:st=${fadeOutStart}:d=0.9[a]`,
      '-map', '[v]', '-map', '[a]',
      '-c:v', 'libx264', '-profile:v', 'high', '-preset', 'medium', '-crf', '20',
      '-c:a', 'aac', '-b:a', '128k', '-ar', '44100',
      '-movflags', '+faststart', '-shortest',
      out,
    ]);

    // verify: audio stream present, sane duration
    const streams = probe(out, 'stream=codec_type');
    if (!streams.includes('audio')) throw new Error('no audio stream in output');
    const fdur = parseFloat(probe(out, 'format=duration'));
    if (!(fdur >= 3 && fdur <= 300)) throw new Error(`bad final duration ${fdur}`);
    const kb = Math.round(fs.statSync(out).size / 1024);
    console.log(`[${i + 1}/${items.length}] ${it.slug}  ✓ ${fdur.toFixed(1)}s ${kb}KB ${TRACKS[i % TRACKS.length]}`);
    ok++;
  } catch (e) {
    failures.push({ slug: it.slug, error: String(e).slice(0, 160) });
    console.log(`[${i + 1}/${items.length}] ${it.slug}  ✗ ${String(e).slice(0, 120)}`);
  }
}
console.log(`\n${ok} ok, ${failures.length} failed`);
if (failures.length) {
  console.log(JSON.stringify(failures, null, 2));
  process.exitCode = 1;
}
