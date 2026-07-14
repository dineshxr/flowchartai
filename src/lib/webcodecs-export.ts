'use client';

/**
 * Hardware-accelerated MP4 export via WebCodecs + mp4-muxer.
 *
 * VideoEncoder uses the platform's H.264 encoder (hardware where available),
 * which turns the 15–40s single-threaded ffmpeg.wasm encode into a ~1–3s one
 * and skips the PNG-per-frame intermediate entirely: composed canvases go
 * straight in as VideoFrames. ffmpeg.wasm remains the fallback for browsers
 * without H.264 WebCodecs support (see use-export.ts).
 *
 * mp4-muxer is deprecated upstream in favor of the much larger "mediabunny",
 * but it is stable, frozen, and zero-dependency — exactly what we need for
 * muxing encoded chunks into a faststart MP4.
 */

// H.264 candidates, highest capability first. High profile up to level 5.2
// covers 4K@30; the lower entries keep older hardware encoders in play.
const AVC_CANDIDATES = [
  'avc1.640034', // High 5.2
  'avc1.64002A', // High 4.2
  'avc1.640028', // High 4.0
  'avc1.4D402A', // Main 4.2
  'avc1.42E01F', // Constrained Baseline 3.1
];

export interface Mp4EncoderConfig {
  width: number; // must be even (yuv420)
  height: number; // must be even
  fps: number;
}

export interface Mp4Encoder {
  /** Encode one frame. `canvas` is copied synchronously — safe to reuse it. */
  addFrame(canvas: HTMLCanvasElement, index: number): Promise<void>;
  /** Flush the encoder and return the finished MP4. */
  finalize(): Promise<Blob>;
  /** Abort: release the encoder without producing output. */
  abort(): void;
}

/** Social-friendly bitrate: scales with pixel rate, capped at 16 Mbps. */
function bitrateFor(width: number, height: number, fps: number): number {
  return Math.min(
    16_000_000,
    Math.max(2_500_000, Math.round(width * height * fps * 0.1))
  );
}

async function pickCodec(cfg: Mp4EncoderConfig): Promise<string | null> {
  if (typeof VideoEncoder === 'undefined') return null;
  for (const codec of AVC_CANDIDATES) {
    try {
      const { supported } = await VideoEncoder.isConfigSupported({
        codec,
        width: cfg.width,
        height: cfg.height,
        framerate: cfg.fps,
        bitrate: bitrateFor(cfg.width, cfg.height, cfg.fps),
      });
      if (supported) return codec;
    } catch {
      // try the next candidate
    }
  }
  return null;
}

/** Whether this browser can do the fast WebCodecs MP4 path for these dimensions. */
export async function canEncodeMp4(cfg: Mp4EncoderConfig): Promise<boolean> {
  return (await pickCodec(cfg)) !== null;
}

export async function createMp4Encoder(
  cfg: Mp4EncoderConfig
): Promise<Mp4Encoder> {
  const codec = await pickCodec(cfg);
  if (!codec) throw new Error('WebCodecs H.264 not supported');

  const { Muxer, ArrayBufferTarget } = await import('mp4-muxer');
  const muxer = new Muxer({
    target: new ArrayBufferTarget(),
    video: {
      codec: 'avc',
      width: cfg.width,
      height: cfg.height,
      frameRate: cfg.fps,
    },
    // Moov atom up front — social platforms and mobile players can start
    // playback before the file fully downloads.
    fastStart: 'in-memory',
  });

  let encodeError: Error | null = null;
  const encoder = new VideoEncoder({
    output: (chunk, meta) => muxer.addVideoChunk(chunk, meta),
    error: (e) => {
      encodeError = e instanceof Error ? e : new Error(String(e));
    },
  });
  encoder.configure({
    codec,
    width: cfg.width,
    height: cfg.height,
    framerate: cfg.fps,
    bitrate: bitrateFor(cfg.width, cfg.height, cfg.fps),
  });

  const usPerFrame = Math.round(1_000_000 / cfg.fps);

  return {
    async addFrame(canvas, index) {
      if (encodeError) throw encodeError;
      const frame = new VideoFrame(canvas, {
        timestamp: index * usPerFrame,
        duration: usPerFrame,
      });
      try {
        // Keyframe every ~2s keeps the file scrubbable without bloating it.
        encoder.encode(frame, { keyFrame: index % (cfg.fps * 2) === 0 });
      } finally {
        frame.close();
      }
      // Backpressure: don't let composed frames pile up faster than the
      // encoder drains them. Polling instead of the `dequeue` event — the
      // event is missing from some WebCodecs implementations.
      while (encoder.encodeQueueSize > 4) {
        await new Promise<void>((r) => setTimeout(r, 5));
        if (encodeError) throw encodeError;
        if (encoder.state === 'closed') throw new Error('Encoder closed');
      }
    },

    async finalize() {
      await encoder.flush();
      if (encodeError) throw encodeError;
      encoder.close();
      muxer.finalize();
      return new Blob([muxer.target.buffer], { type: 'video/mp4' });
    },

    abort() {
      try {
        if (encoder.state !== 'closed') encoder.close();
      } catch {
        // already closed
      }
    },
  };
}
