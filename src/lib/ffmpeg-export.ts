'use client';

import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

// Single-thread ffmpeg.wasm core — no SharedArrayBuffer, so it works without
// COOP/COEP cross-origin-isolation headers. Runs entirely in the browser.
const CORE_VERSION = '0.12.6';
const CORE_BASE = `https://unpkg.com/@ffmpeg/core@${CORE_VERSION}/dist/umd`;

let ffmpeg: FFmpeg | null = null;
let loadPromise: Promise<FFmpeg> | null = null;

/** Lazily create + load the ffmpeg.wasm instance (downloads core once). */
export async function getFFmpeg(): Promise<FFmpeg> {
  if (ffmpeg) return ffmpeg;
  if (!loadPromise) {
    loadPromise = (async () => {
      const instance = new FFmpeg();
      await instance.load({
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
    await ff.writeFile(frameName(i), await fetchFile(frames[i]));
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
