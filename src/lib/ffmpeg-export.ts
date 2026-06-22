'use client';

// The @ffmpeg/ffmpeg wrapper is loaded at RUNTIME from a self-hosted UMD bundle
// (public/ffmpeg/*) via a <script> tag — it is NOT bundled. Its
// `new Worker(new URL(..., import.meta.url))` + dynamic `import()` can't be
// resolved by the dev bundler: webpack-dev left an undefined module factory
// ("Cannot read properties of undefined (reading 'call')") on every route, and
// Turbopack failed with "Can't resolve <dynamic>". Loading the prebuilt UMD
// keeps @ffmpeg out of the webpack/turbopack graph entirely, and same-origin
// files let the worker blob resolve. Behaves the same in the production build.
import type { FFmpeg } from '@ffmpeg/ffmpeg';

// Self-hosted @ffmpeg/ffmpeg UMD (wrapper + 814 worker chunk) — see public/ffmpeg/.
const FFMPEG_BASE = '/ffmpeg';
// Single-thread ffmpeg.wasm core — no SharedArrayBuffer, so it works without
// COOP/COEP cross-origin-isolation headers. Runs entirely in the browser.
const CORE_VERSION = '0.12.6';
const CORE_BASE = `https://unpkg.com/@ffmpeg/core@${CORE_VERSION}/dist/umd`;

// Inlined @ffmpeg/util helpers, so no @ffmpeg/* package is bundled at all.
async function toBlobURL(url: string, mimeType: string): Promise<string> {
  const buf = await (await fetch(url)).arrayBuffer();
  return URL.createObjectURL(new Blob([buf], { type: mimeType }));
}
async function fileData(blob: Blob): Promise<Uint8Array> {
  return new Uint8Array(await blob.arrayBuffer());
}

let ffmpeg: FFmpeg | null = null;
let loadPromise: Promise<FFmpeg> | null = null;
let classPromise: Promise<{ new (): FFmpeg }> | null = null;

/** Inject the self-hosted UMD wrapper once and resolve its FFmpeg constructor. */
function loadFFmpegClass(): Promise<{ new (): FFmpeg }> {
  if (classPromise) return classPromise;
  classPromise = new Promise((resolve, reject) => {
    const w = window as unknown as {
      FFmpegWASM?: { FFmpeg: { new (): FFmpeg } };
    };
    if (w.FFmpegWASM?.FFmpeg) {
      resolve(w.FFmpegWASM.FFmpeg);
      return;
    }
    const script = document.createElement('script');
    script.src = `${FFMPEG_BASE}/ffmpeg.js`;
    script.onload = () => {
      if (w.FFmpegWASM?.FFmpeg) {
        resolve(w.FFmpegWASM.FFmpeg);
      } else {
        reject(new Error('FFmpeg global missing after script load'));
      }
    };
    script.onerror = () => reject(new Error('Failed to load ffmpeg.js'));
    document.head.appendChild(script);
  });
  return classPromise;
}

/** Lazily create + load the ffmpeg.wasm instance (downloads core once). */
export async function getFFmpeg(): Promise<FFmpeg> {
  if (ffmpeg) return ffmpeg;
  if (!loadPromise) {
    loadPromise = (async () => {
      const FFmpegClass = await loadFFmpegClass();
      const instance = new FFmpegClass();
      await instance.load({
        classWorkerURL: await toBlobURL(
          `${FFMPEG_BASE}/814.ffmpeg.js`,
          'text/javascript'
        ),
        coreURL: await toBlobURL(
          `${CORE_BASE}/ffmpeg-core.js`,
          'text/javascript'
        ),
        wasmURL: await toBlobURL(
          `${CORE_BASE}/ffmpeg-core.wasm`,
          'application/wasm'
        ),
      });
      ffmpeg = instance;
      return instance;
    })();
  }
  return loadPromise;
}

function frameName(i: number) {
  return `f${String(i).padStart(4, '0')}.png`;
}

async function writeFrames(ff: FFmpeg, frames: Blob[]) {
  for (let i = 0; i < frames.length; i++) {
    await ff.writeFile(frameName(i), await fileData(frames[i]));
  }
}

async function cleanup(ff: FFmpeg, count: number, extra: string[]) {
  for (let i = 0; i < count; i++) {
    try {
      await ff.deleteFile(frameName(i));
    } catch {
      // ignore
    }
  }
  for (const f of extra) {
    try {
      await ff.deleteFile(f);
    } catch {
      // ignore
    }
  }
}

/**
 * Encode PNG frames into a looping GIF using a generated palette
 * (palettegen → paletteuse) for far better quality than naive quantization.
 */
export async function encodeGif(frames: Blob[], fps: number): Promise<Blob> {
  const ff = await getFFmpeg();
  const f = Math.max(1, Math.round(fps));
  await writeFrames(ff, frames);
  try {
    await ff.exec([
      '-framerate',
      String(f),
      '-i',
      'f%04d.png',
      '-vf',
      'palettegen=stats_mode=diff',
      '-y',
      'palette.png',
    ]);
    await ff.exec([
      '-framerate',
      String(f),
      '-i',
      'f%04d.png',
      '-i',
      'palette.png',
      '-lavfi',
      'paletteuse=dither=bayer:bayer_scale=5:diff_mode=rectangle',
      '-loop',
      '0',
      '-y',
      'out.gif',
    ]);
    const data = await ff.readFile('out.gif');
    return new Blob([data as Uint8Array], { type: 'image/gif' });
  } finally {
    await cleanup(ff, frames.length, ['palette.png', 'out.gif']);
  }
}

/**
 * Encode PNG frames into an H.264 MP4 (yuv420p + faststart) — broadly playable
 * across browsers, players, and social platforms.
 */
export async function encodeMp4(frames: Blob[], fps: number): Promise<Blob> {
  const ff = await getFFmpeg();
  const f = Math.max(1, Math.round(fps));
  await writeFrames(ff, frames);
  try {
    await ff.exec([
      '-framerate',
      String(f),
      '-i',
      'f%04d.png',
      // even dimensions required by yuv420p; force a standard pixel format
      '-vf',
      'pad=ceil(iw/2)*2:ceil(ih/2)*2,format=yuv420p',
      '-c:v',
      'libx264',
      '-preset',
      'veryfast',
      '-crf',
      '20',
      '-movflags',
      '+faststart',
      '-y',
      'out.mp4',
    ]);
    const data = await ff.readFile('out.mp4');
    return new Blob([data as Uint8Array], { type: 'video/mp4' });
  } finally {
    await cleanup(ff, frames.length, ['out.mp4']);
  }
}
