// @/lib/ffmpeg-export (and the heavy ffmpeg.wasm encoder it pulls in) is imported
// DYNAMICALLY inside the GIF/MP4 handlers below. A static import lands @ffmpeg in
// every page bundle that touches this hook — the homepage Hero imports
// EXPORT_PRESETS from here — and @ffmpeg's `new Worker(new URL(...))` can't be
// resolved by `next dev`, which crashed every route. Loading it on demand keeps
// it out of page bundles entirely until the user actually exports a GIF/MP4.
//
// GIF/MP4 exports stream frames straight into the encoder from a layered
// off-screen capture (see @/lib/export-frames): the live diagram never pauses,
// per-frame cost is a small SVG rasterization instead of a full DOM capture,
// memory stays flat (one reused composite + target canvas), and the frame
// window is the animation's real SMIL loop period, so exports loop seamlessly.
// MP4 uses hardware WebCodecs H.264 when available (@/lib/webcodecs-export)
// and falls back to ffmpeg.wasm otherwise.
import {
  type SmilTiming,
  analyzeSmilTiming,
  createSmilFrameSource,
} from '@/lib/export-frames';
import { domToCanvas, domToDataUrl } from 'modern-screenshot';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

// ─── size presets ─────────────────────────────────────────────────────────────

export type ExportPreset =
  | 'original'
  | 'square'
  | 'story'
  | 'portrait'
  | 'landscape'
  | 'widescreen';

export const EXPORT_PRESETS: Record<
  ExportPreset,
  { label: string; w?: number; h?: number }
> = {
  original: { label: 'Original size' },
  square: { label: '1:1 Square (1080×1080)', w: 1080, h: 1080 },
  story: { label: '9:16 Story (1080×1920)', w: 1080, h: 1920 },
  portrait: { label: '4:5 Portrait (1080×1350)', w: 1080, h: 1350 },
  landscape: { label: '16:9 Landscape (1920×1080)', w: 1920, h: 1080 },
  widescreen: { label: '4:3 Widescreen (1440×1080)', w: 1440, h: 1080 },
};

// ─── watermark ────────────────────────────────────────────────────────────────

function drawWatermark(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const fontSize = Math.max(14, Math.round(Math.min(w, h) * 0.022));
  const pad = Math.round(fontSize * 1.1);
  const text = 'infogiph.com';
  ctx.save();
  ctx.font = `600 ${fontSize}px Geist, -apple-system, "Segoe UI", Roboto, sans-serif`;
  ctx.textBaseline = 'alphabetic';
  ctx.textAlign = 'right';
  const tw = ctx.measureText(text).width;
  const bw = tw + pad;
  const bh = fontSize + pad * 0.5;
  const bx = w - bw - pad * 0.6;
  const by = h - bh - pad * 0.6;
  const r = Math.min(bh / 2, 10);
  ctx.fillStyle = 'rgba(15,23,42,0.72)';
  ctx.beginPath();
  ctx.moveTo(bx + r, by);
  ctx.lineTo(bx + bw - r, by);
  ctx.quadraticCurveTo(bx + bw, by, bx + bw, by + r);
  ctx.lineTo(bx + bw, by + bh - r);
  ctx.quadraticCurveTo(bx + bw, by + bh, bx + bw - r, by + bh);
  ctx.lineTo(bx + r, by + bh);
  ctx.quadraticCurveTo(bx, by + bh, bx, by + bh - r);
  ctx.lineTo(bx, by + r);
  ctx.quadraticCurveTo(bx, by, bx + r, by);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.fillText(text, bx + bw - pad * 0.5, by + bh - pad * 0.25);
  ctx.restore();
}

// ─── finalise (preset + resolution + watermark) ───────────────────────────────

/**
 * Per-export options. The watermark and the HD (2×) resolution tier are the
 * plan-gated axes (see PlanLimits.watermark / PlanLimits.hdExport); callers
 * clamp `scale` to what the user's plan allows before invoking an export.
 */
export interface ExportOptions {
  /** Whether to stamp the infogiph.com watermark. */
  watermark: boolean;
  /**
   * Output resolution multiplier applied to the fixed size presets
   * (1 = standard 1080-class, 2 = HD/4K-class). 'original' ignores it for
   * video; PNG/SVG bump their capture scale so HD stays genuinely sharp.
   */
  scale?: number;
  /** Transparent background — PNG/SVG only (video needs an opaque canvas). */
  transparent?: boolean;
}

const DEFAULT_EXPORT_OPTIONS: ExportOptions = {
  watermark: true,
};

/**
 * Contain-fit `source` onto `target` (white, or transparent when asked), then
 * stamp the watermark.
 */
function finaliseInto(
  target: HTMLCanvasElement,
  source: HTMLCanvasElement,
  opts: ExportOptions
) {
  const ctx = target.getContext('2d')!;
  ctx.clearRect(0, 0, target.width, target.height);
  if (!opts.transparent) {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, target.width, target.height);
  }
  const scale = Math.min(
    target.width / source.width,
    target.height / source.height
  );
  const dw = source.width * scale;
  const dh = source.height * scale;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(
    source,
    (target.width - dw) / 2,
    (target.height - dh) / 2,
    dw,
    dh
  );
  if (opts.watermark) drawWatermark(ctx, target.width, target.height);
}

/**
 * Target pixel size for a preset (original = the source as captured). The
 * quality `scale` multiplies the FIXED presets only — 'original' already
 * matches the capture resolution, so scaling it would just upsample.
 */
function targetSize(
  preset: ExportPreset,
  sourceW: number,
  sourceH: number,
  evenDims = false,
  scale = 1
): { w: number; h: number } {
  const p = EXPORT_PRESETS[preset];
  let w = Math.round(p.w ? p.w * scale : sourceW);
  let h = Math.round(p.h ? p.h * scale : sourceH);
  if (evenDims) {
    // yuv420 (H.264) requires even dimensions.
    w -= w % 2;
    h -= h % 2;
  }
  return { w: Math.max(2, w), h: Math.max(2, h) };
}

function finaliseCanvas(
  source: HTMLCanvasElement,
  preset: ExportPreset,
  opts: ExportOptions = DEFAULT_EXPORT_OPTIONS
): HTMLCanvasElement {
  const { w, h } = targetSize(
    preset,
    source.width,
    source.height,
    false,
    opts.scale ?? 1
  );
  const target = document.createElement('canvas');
  target.width = w;
  target.height = h;
  finaliseInto(target, source, opts);
  return target;
}

// ─── capture helpers ──────────────────────────────────────────────────────────

async function capture(
  el: HTMLElement,
  scale = 2,
  transparent = false
): Promise<HTMLCanvasElement> {
  return domToCanvas(el, {
    scale,
    backgroundColor: transparent ? undefined : '#ffffff',
    debug: false,
  });
}

/**
 * Temporarily clear the inline backgrounds flagged with `data-export-bg`
 * (the diagram's own bg gradient) so a transparent export is truly
 * transparent instead of keeping the template's backdrop baked in.
 */
function stripExportBackgrounds(root: HTMLElement): () => void {
  const saved: Array<[HTMLElement, string]> = [];
  for (const el of root.querySelectorAll<HTMLElement>('[data-export-bg]')) {
    saved.push([el, el.style.background]);
    el.style.background = 'transparent';
  }
  return () => {
    for (const [el, bg] of saved) el.style.background = bg;
  };
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string,
  quality?: number
): Promise<Blob> {
  return new Promise<Blob>((resolve, reject) =>
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error('toBlob failed'))),
      type,
      quality
    )
  );
}

const abortError = () => new DOMException('Export canceled', 'AbortError');

const isAbort = (err: unknown) =>
  err instanceof DOMException && err.name === 'AbortError';

// ─── frame planning ───────────────────────────────────────────────────────────

// Legacy window for diagrams without a detectable SMIL loop.
const FALLBACK_DURATION = 3.4;
const GIF_FPS = 15;
const MP4_FPS = 30;

interface FramePlan {
  fps: number;
  /** Frames in one seamless loop. */
  perLoop: number;
  /** Total frames to emit (loop repeated so MP4s aren't too short for social). */
  total: number;
  /** SMIL time of frame 0. */
  leadIn: number;
}

function planFrames(timing: SmilTiming, format: 'gif' | 'mp4'): FramePlan {
  const fps = format === 'gif' ? GIF_FPS : MP4_FPS;
  // Clamp so extreme speed-slider values can't produce absurd captures.
  const period = Math.min(8, Math.max(0.8, timing.period));
  const perLoop = Math.max(2, Math.round(period * fps));
  // Social platforms treat sub-3s videos poorly — repeat the seamless loop.
  // GIFs loop natively, so one cycle is enough (and keeps files small).
  const cycles =
    format === 'mp4' ? Math.min(4, Math.max(1, Math.ceil(3 / period))) : 1;
  return { fps, perLoop, total: perLoop * cycles, leadIn: timing.leadIn };
}

// ─── hook ────────────────────────────────────────────────────────────────────

export type ExportStage =
  | 'idle'
  | 'preparing'
  | 'rendering'
  | 'encoding'
  | 'finalizing';

export function useFlowchartExport(
  containerRef: React.RefObject<HTMLDivElement | null>
) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportStage, setExportStage] = useState<ExportStage>('idle');
  const abortRef = useRef<AbortController | null>(null);
  const busyRef = useRef(false);

  const cancelExport = () => abortRef.current?.abort();

  const throwIfAborted = () => {
    if (abortRef.current?.signal.aborted) throw abortError();
  };

  const download = (data: string | Blob, filename: string) => {
    const a = document.createElement('a');
    a.download = filename;
    a.href = typeof data === 'string' ? data : URL.createObjectURL(data);
    a.click();
    if (typeof data !== 'string')
      setTimeout(() => URL.revokeObjectURL(a.href), 60_000);
  };

  // ── PNG ──────────────────────────────────────────────────────────────────────

  const exportPNG = async (
    title: string,
    preset: ExportPreset = 'original',
    opts: ExportOptions = DEFAULT_EXPORT_OPTIONS
  ) => {
    if (!containerRef.current || busyRef.current) return;
    busyRef.current = true;
    setIsExporting(true);
    setExportStage('rendering');
    setExportProgress(20);
    // HD needs a denser capture or the upscale to 2× preset dims goes soft.
    const restoreBg = opts.transparent
      ? stripExportBackgrounds(containerRef.current)
      : null;
    try {
      const raw = await capture(
        containerRef.current,
        (opts.scale ?? 1) >= 2 ? 4 : 3,
        opts.transparent
      );
      const out = finaliseCanvas(raw, preset, opts);
      setExportProgress(100);
      download(out.toDataURL('image/png'), `${title || 'infogiph'}.png`);
      toast.success('PNG exported');
    } catch (err) {
      console.error('[export:png]', err);
      toast.error('Failed to export PNG');
    } finally {
      restoreBg?.();
      busyRef.current = false;
      setIsExporting(false);
      setExportStage('idle');
      setExportProgress(0);
    }
  };

  // ── SVG ──────────────────────────────────────────────────────────────────────

  const exportSVG = async (
    title: string,
    preset: ExportPreset = 'original',
    opts: ExportOptions = DEFAULT_EXPORT_OPTIONS
  ) => {
    if (!containerRef.current || busyRef.current) return;
    busyRef.current = true;
    setIsExporting(true);
    setExportStage('rendering');
    setExportProgress(40);
    const restoreBg = opts.transparent
      ? stripExportBackgrounds(containerRef.current)
      : null;
    try {
      const dataUrl = await domToDataUrl(containerRef.current, {
        scale: (opts.scale ?? 1) >= 2 ? 4 : 2,
        backgroundColor: opts.transparent ? undefined : '#ffffff',
      });
      const img = new Image();
      img.crossOrigin = 'anonymous';
      await new Promise<void>((res, rej) => {
        img.onload = () => res();
        img.onerror = () => rej(new Error('SVG decode failed'));
        img.src = dataUrl;
      });
      const raw = document.createElement('canvas');
      raw.width = img.naturalWidth || containerRef.current.clientWidth * 2;
      raw.height = img.naturalHeight || containerRef.current.clientHeight * 2;
      raw.getContext('2d')?.drawImage(img, 0, 0, raw.width, raw.height);
      const out = finaliseCanvas(raw, preset, opts);

      const wrapper = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${out.width}" height="${out.height}" viewBox="0 0 ${out.width} ${out.height}">
  <image width="${out.width}" height="${out.height}" href="${out.toDataURL('image/png')}" />
</svg>`;
      download(
        new Blob([wrapper], { type: 'image/svg+xml;charset=utf-8' }),
        `${title || 'infogiph'}.svg`
      );
      setExportProgress(100);
      toast.success('SVG exported');
    } catch (err) {
      console.error('[export:svg]', err);
      toast.error('Failed to export SVG');
    } finally {
      restoreBg?.();
      busyRef.current = false;
      setIsExporting(false);
      setExportStage('idle');
      setExportProgress(0);
    }
  };

  // ── Streaming animated export (GIF / MP4) ───────────────────────────────────
  //
  // One pipeline for both formats:
  //   frame source (layered SMIL capture, or realtime fallback)
  //     → finalise into a single reused target canvas (preset + watermark)
  //       → sink (WebCodecs encoder, or PNG/JPEG blobs for ffmpeg.wasm)
  //
  // `onFrame` receives the finalised target canvas for every frame, in order.

  const streamFrames = async (
    format: 'gif' | 'mp4',
    preset: ExportPreset,
    opts: ExportOptions,
    renderProgressEnd: number,
    onFrame: (
      target: HTMLCanvasElement,
      index: number,
      total: number
    ) => Promise<void>
  ): Promise<{ fps: number }> => {
    const container = containerRef.current!;
    const timing = analyzeSmilTiming(container);

    if (timing.seekable) {
      const plan = planFrames(timing, format);
      const rect = container.getBoundingClientRect();
      const { w, h } = targetSize(
        preset,
        rect.width * 2,
        rect.height * 2,
        format === 'mp4',
        opts.scale ?? 1
      );
      // Rasterize the composite at exactly the scale the target needs — the
      // SVG layer is vector, so high-res exports stay crisp.
      const fitScale = Math.min(w / rect.width, h / rect.height);
      const source = await createSmilFrameSource(container, fitScale);
      try {
        const composite = document.createElement('canvas');
        composite.width = source.width;
        composite.height = source.height;
        const compCtx = composite.getContext('2d')!;
        const target = document.createElement('canvas');
        target.width = w;
        target.height = h;

        setExportStage('rendering');
        for (let i = 0; i < plan.total; i++) {
          throwIfAborted();
          // Sample one seamless loop; later cycles reuse the same times.
          const t = plan.leadIn + (i % plan.perLoop) / plan.fps;
          await source.drawFrameAt(t, compCtx);
          finaliseInto(target, composite, opts);
          await onFrame(target, i, plan.total);
          setExportProgress(
            2 + Math.round(((i + 1) / plan.total) * (renderProgressEnd - 2))
          );
        }
        return { fps: plan.fps };
      } finally {
        source.dispose();
      }
    }

    // Realtime fallback (no seekable SMIL — CSS/framer-motion diagrams): grab
    // live captures as fast as possible and measure the true fps so playback
    // speed matches the live animation.
    const fps = format === 'gif' ? GIF_FPS : 24;
    const total = Math.max(1, Math.round(fps * FALLBACK_DURATION));
    setExportStage('rendering');
    const start = performance.now();
    const raws: HTMLCanvasElement[] = [];
    for (let i = 0; i < total; i++) {
      throwIfAborted();
      raws.push(await capture(container, 2));
      setExportProgress(
        2 + Math.round(((i + 1) / total) * (renderProgressEnd - 2) * 0.8)
      );
      const elapsed = performance.now() - start;
      const expected = (i + 1) * (1000 / fps);
      if (elapsed < expected) await delay(expected - elapsed);
    }
    const seconds = (performance.now() - start) / 1000 || 1;
    const realFps = Math.max(
      1,
      Math.min(fps, Math.round(raws.length / seconds))
    );
    for (let i = 0; i < raws.length; i++) {
      throwIfAborted();
      const out = finaliseCanvas(raws[i], preset, opts);
      await onFrame(out, i, raws.length);
    }
    return { fps: realFps };
  };

  const runAnimatedExport = async (
    format: 'gif' | 'mp4',
    title: string,
    preset: ExportPreset,
    opts: ExportOptions
  ) => {
    if (!containerRef.current || busyRef.current) return;
    busyRef.current = true;
    const abort = new AbortController();
    abortRef.current = abort;
    setIsExporting(true);
    setExportStage('preparing');
    setExportProgress(2);
    let usingFfmpeg = false;
    // Cancel must actively kill an in-flight ffmpeg exec — the frame loop's
    // abort checks can't reach inside `await ff.exec(...)`. Terminating the
    // worker rejects the pending exec; the catch below reads signal.aborted
    // and reports it as a cancel, and the next export boots a fresh instance.
    abort.signal.addEventListener('abort', () => {
      if (!usingFfmpeg) return;
      import('@/lib/ffmpeg-export')
        .then(({ resetFFmpeg }) => resetFFmpeg())
        .catch(() => {});
    });
    try {
      let result: Blob;

      if (format === 'mp4') {
        // Probe the fast path with the real target dimensions. WebCodecs
        // requires the deterministic SMIL capture: the realtime fallback only
        // learns its true fps AFTER capturing, but the encoder's timestamps
        // are fixed up front — mismatched fps would speed the video up.
        const seekable = analyzeSmilTiming(containerRef.current).seekable;
        const rect = containerRef.current.getBoundingClientRect();
        const { w, h } = targetSize(
          preset,
          rect.width * 2,
          rect.height * 2,
          true,
          opts.scale ?? 1
        );
        const { canEncodeMp4, createMp4Encoder } = await import(
          '@/lib/webcodecs-export'
        );
        if (
          seekable &&
          (await canEncodeMp4({ width: w, height: h, fps: MP4_FPS }))
        ) {
          // Hardware path: frames stream straight into the encoder.
          const encoder = await createMp4Encoder({
            width: w,
            height: h,
            fps: MP4_FPS,
          });
          try {
            await streamFrames(format, preset, opts, 90, (target, i) =>
              encoder.addFrame(target, i)
            );
            throwIfAborted();
            setExportStage('finalizing');
            setExportProgress(94);
            result = await encoder.finalize();
          } catch (err) {
            encoder.abort();
            throw err;
          }
        } else {
          // ffmpeg.wasm fallback: collect JPEG frames (H.264 is lossy anyway;
          // JPEG en/decode is far cheaper than PNG in single-thread WASM).
          usingFfmpeg = true;
          const blobs: Blob[] = [];
          const { fps } = await streamFrames(
            format,
            preset,
            opts,
            55,
            async (target) => {
              blobs.push(await canvasToBlob(target, 'image/jpeg', 0.92));
            }
          );
          throwIfAborted();
          setExportStage('encoding');
          const { getFFmpeg, encodeMp4 } = await import('@/lib/ffmpeg-export');
          const ff = await getFFmpeg();
          const onProgress = ({ progress }: { progress: number }) =>
            setExportProgress(58 + Math.round(Math.min(progress, 1) * 40));
          ff.on('progress', onProgress);
          try {
            result = await encodeMp4(blobs, fps, 'jpg');
          } finally {
            ff.off('progress', onProgress);
          }
        }
      } else {
        // GIF: ffmpeg's palettegen/paletteuse gives the best-looking GIFs.
        // PNG frames keep the palette exact.
        usingFfmpeg = true;
        const blobs: Blob[] = [];
        const { fps } = await streamFrames(
          format,
          preset,
          opts,
          55,
          async (target) => {
            blobs.push(await canvasToBlob(target, 'image/png'));
          }
        );
        throwIfAborted();
        setExportStage('encoding');
        const { getFFmpeg, encodeGif } = await import('@/lib/ffmpeg-export');
        const ff = await getFFmpeg();
        const onProgress = ({ progress }: { progress: number }) =>
          setExportProgress(58 + Math.round(Math.min(progress, 1) * 40));
        ff.on('progress', onProgress);
        try {
          result = await encodeGif(blobs, fps);
        } finally {
          ff.off('progress', onProgress);
        }
      }

      throwIfAborted();
      setExportProgress(100);
      download(result, `${title || 'infogiph'}.${format}`);
      toast.success(
        format === 'mp4'
          ? 'MP4 exported — loops seamlessly, ready for socials'
          : 'GIF exported — loops seamlessly, ready for socials'
      );
    } catch (err) {
      if (isAbort(err) || abort.signal.aborted) {
        toast.info('Export canceled');
      } else {
        console.error(`[export:${format}]`, err);
        toast.error(`Failed to export ${format.toUpperCase()}`, {
          description: err instanceof Error ? err.message : undefined,
        });
      }
    } finally {
      abortRef.current = null;
      busyRef.current = false;
      setIsExporting(false);
      setExportStage('idle');
      setExportProgress(0);
    }
  };

  const exportGIF = (
    title: string,
    preset: ExportPreset = 'original',
    opts: ExportOptions = DEFAULT_EXPORT_OPTIONS
  ) =>
    // GIFs stay 1× and opaque: a 4K GIF is a payload nobody wants, and GIF
    // transparency is 1-bit (ragged edges) — MOV/WebM would be the right
    // vehicle for transparent motion, not GIF.
    runAnimatedExport('gif', title, preset, {
      ...opts,
      scale: 1,
      transparent: false,
    });

  const exportMP4 = (
    title: string,
    preset: ExportPreset = 'original',
    opts: ExportOptions = DEFAULT_EXPORT_OPTIONS
  ) =>
    // H.264 has no alpha channel — MP4 is always opaque.
    runAnimatedExport('mp4', title, preset, { ...opts, transparent: false });

  return {
    exportPNG,
    exportSVG,
    exportGIF,
    exportMP4,
    isExporting,
    exportProgress,
    exportStage,
    cancelExport,
  };
}

// ─── utils ──────────────────────────────────────────────────────────────────

const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
