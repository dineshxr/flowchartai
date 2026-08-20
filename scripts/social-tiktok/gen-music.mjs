// Synthesizes 6 original lo-fi / chill-synth background tracks as 16-bit
// stereo WAVs (44.1kHz). Pure Node, no deps, fully original compositions —
// no licensing concerns. Each ~33-38s, longer than any clip; the mux pass
// trims with -shortest.
import fs from 'fs';
import path from 'path';

const SR = 44100;
const OUT = path.join(process.cwd(), 'tiktok', 'music');
fs.mkdirSync(OUT, { recursive: true });

const f = (midi) => 440 * 2 ** ((midi - 69) / 12);

// Deterministic PRNG so re-runs produce identical files.
let seed = 42;
const rand = () => {
  seed = (seed * 1664525 + 1013904223) >>> 0;
  return seed / 4294967296;
};

function makeBuffers(seconds) {
  const n = Math.ceil(seconds * SR);
  return { L: new Float64Array(n), R: new Float64Array(n), n };
}

// Soft electric-piano note: sine + gentle harmonics, struck, exp decay.
function key(buf, t0, freq, dur, amp, pan, tau) {
  const s0 = Math.floor(t0 * SR);
  const ns = Math.min(Math.floor(dur * SR), buf.n - s0);
  const w = 2 * Math.PI * freq;
  const gl = amp * (1 - pan) * 0.5 + amp * 0.5;
  const gr = amp * (1 + pan) * 0.5 + amp * 0.5;
  for (let i = 0; i < ns; i++) {
    const t = i / SR;
    const env = Math.min(1, t / 0.012) * Math.exp(-t / tau);
    const v =
      (Math.sin(w * t) +
        0.32 * Math.sin(2 * w * t) * Math.exp(-t * 2.2) +
        0.11 * Math.sin(3 * w * t) * Math.exp(-t * 4)) *
      env;
    buf.L[s0 + i] += v * gl * 0.5;
    buf.R[s0 + i] += v * gr * 0.5;
  }
}

// Warm pad: two detuned sines, slow attack.
function pad(buf, t0, freq, dur, amp, pan) {
  const s0 = Math.floor(t0 * SR);
  const ns = Math.min(Math.floor(dur * SR), buf.n - s0);
  const w1 = 2 * Math.PI * freq * 0.9985;
  const w2 = 2 * Math.PI * freq * 1.0015;
  for (let i = 0; i < ns; i++) {
    const t = i / SR;
    const env =
      Math.min(1, t / 0.5) *
      Math.min(1, Math.max(0, (dur - t) / 0.8)) *
      (0.85 + 0.15 * Math.sin(2 * Math.PI * 0.7 * t));
    const v = (Math.sin(w1 * t) + Math.sin(w2 * t)) * 0.5 * env;
    buf.L[s0 + i] += v * amp * (1 - pan * 0.5);
    buf.R[s0 + i] += v * amp * (1 + pan * 0.5);
  }
}

function bass(buf, t0, freq, dur, amp) {
  const s0 = Math.floor(t0 * SR);
  const ns = Math.min(Math.floor(dur * SR), buf.n - s0);
  const w = 2 * Math.PI * freq;
  for (let i = 0; i < ns; i++) {
    const t = i / SR;
    const env = Math.min(1, t / 0.02) * Math.exp(-t / (dur * 0.55));
    const v = (Math.sin(w * t) + 0.18 * Math.sin(2 * w * t)) * env;
    buf.L[s0 + i] += v * amp;
    buf.R[s0 + i] += v * amp;
  }
}

function pluck(buf, t0, freq, amp, pan) {
  const s0 = Math.floor(t0 * SR);
  const ns = Math.min(Math.floor(0.34 * SR), buf.n - s0);
  const w = 2 * Math.PI * freq;
  for (let i = 0; i < ns; i++) {
    const t = i / SR;
    const env = Math.min(1, t / 0.004) * Math.exp(-t / 0.09);
    const v = (Math.sin(w * t) + 0.4 * Math.sin(2 * w * t)) * env;
    buf.L[s0 + i] += v * amp * (1 - pan * 0.6) * 0.5;
    buf.R[s0 + i] += v * amp * (1 + pan * 0.6) * 0.5;
  }
}

function kick(buf, t0, amp = 0.85) {
  const s0 = Math.floor(t0 * SR);
  const ns = Math.min(Math.floor(0.26 * SR), buf.n - s0);
  let phase = 0;
  for (let i = 0; i < ns; i++) {
    const t = i / SR;
    const freq = 44 + 120 * Math.exp(-t * 30);
    phase += (2 * Math.PI * freq) / SR;
    const v = Math.sin(phase) * Math.exp(-t * 15) * amp;
    buf.L[s0 + i] += v;
    buf.R[s0 + i] += v;
  }
}

function hat(buf, t0, amp = 0.1) {
  const s0 = Math.floor(t0 * SR);
  const ns = Math.min(Math.floor(0.05 * SR), buf.n - s0);
  let prev = 0;
  for (let i = 0; i < ns; i++) {
    const t = i / SR;
    const x = (rand() * 2 - 1) * Math.exp(-t * 80);
    const hp = x - prev; // crude highpass
    prev = x;
    buf.L[s0 + i] += hp * amp;
    buf.R[s0 + i] += hp * amp;
  }
}

function snare(buf, t0, amp = 0.22) {
  const s0 = Math.floor(t0 * SR);
  const ns = Math.min(Math.floor(0.16 * SR), buf.n - s0);
  let prev = 0;
  for (let i = 0; i < ns; i++) {
    const t = i / SR;
    const x = (rand() * 2 - 1) * Math.exp(-t * 24);
    const hp = (x - prev) * 0.8;
    prev = x;
    const tone = Math.sin(2 * Math.PI * 185 * t) * Math.exp(-t * 32) * 0.5;
    const v = (hp + tone) * amp;
    buf.L[s0 + i] += v;
    buf.R[s0 + i] += v;
  }
}

function crackle(buf, seconds, amp = 0.012) {
  const ticks = Math.floor(seconds * 26);
  for (let k = 0; k < ticks; k++) {
    const s0 = Math.floor(rand() * (buf.n - 40));
    const len = 6 + Math.floor(rand() * 20);
    const a = amp * (0.3 + rand() * 0.7);
    for (let i = 0; i < len; i++) {
      const v = (rand() * 2 - 1) * a * Math.exp(-i / 6);
      buf.L[s0 + i] += v;
      buf.R[s0 + i] += v * 0.8;
    }
  }
}

function finalize(buf, seconds) {
  // gentle one-pole lowpass for warmth, soft clip, fades, normalize
  const a = Math.exp((-2 * Math.PI * 7200) / SR);
  let l = 0;
  let r = 0;
  for (let i = 0; i < buf.n; i++) {
    l = (1 - a) * buf.L[i] + a * l;
    r = (1 - a) * buf.R[i] + a * r;
    buf.L[i] = Math.tanh(l * 1.15);
    buf.R[i] = Math.tanh(r * 1.15);
  }
  const fadeIn = Math.floor(0.06 * SR);
  const fadeOut = Math.floor(1.4 * SR);
  for (let i = 0; i < fadeIn; i++) {
    const g = i / fadeIn;
    buf.L[i] *= g;
    buf.R[i] *= g;
  }
  for (let i = 0; i < fadeOut; i++) {
    const g = i / fadeOut;
    buf.L[buf.n - 1 - i] *= g;
    buf.R[buf.n - 1 - i] *= g;
  }
  let peak = 0;
  for (let i = 0; i < buf.n; i++)
    peak = Math.max(peak, Math.abs(buf.L[i]), Math.abs(buf.R[i]));
  const g = peak > 0 ? 0.82 / peak : 1;
  for (let i = 0; i < buf.n; i++) {
    buf.L[i] *= g;
    buf.R[i] *= g;
  }
}

function writeWav(file, buf) {
  const bytes = buf.n * 4;
  const b = Buffer.alloc(44 + bytes);
  b.write('RIFF', 0);
  b.writeUInt32LE(36 + bytes, 4);
  b.write('WAVE', 8);
  b.write('fmt ', 12);
  b.writeUInt32LE(16, 16);
  b.writeUInt16LE(1, 20);
  b.writeUInt16LE(2, 22);
  b.writeUInt32LE(SR, 24);
  b.writeUInt32LE(SR * 4, 28);
  b.writeUInt16LE(4, 32);
  b.writeUInt16LE(16, 34);
  b.write('data', 36);
  b.writeUInt32LE(bytes, 40);
  for (let i = 0; i < buf.n; i++) {
    b.writeInt16LE(Math.round(Math.max(-1, Math.min(1, buf.L[i])) * 32767), 44 + i * 4);
    b.writeInt16LE(Math.round(Math.max(-1, Math.min(1, buf.R[i])) * 32767), 46 + i * 4);
  }
  fs.writeFileSync(file, b);
}

// ── track definitions ────────────────────────────────────────────────────────
const TRACKS = [
  {
    name: 'warm-keys',
    bpm: 84, bars: 12,
    chords: [[53, 57, 60, 64], [52, 55, 59, 62], [50, 53, 57, 60], [48, 52, 55, 59]],
    bassNotes: [29, 28, 26, 24],
    style: { keys: true, keyHits: [0, 2.5], kicks: [0, 2.5], snares: [1, 3], hats: 0.5, hatAmp: 0.07, crackle: true },
  },
  {
    name: 'synth-pulse',
    bpm: 100, bars: 16,
    chords: [[57, 60, 64], [53, 57, 60], [55, 60, 64], [55, 59, 62]],
    bassNotes: [33, 29, 36, 31],
    style: { pad: true, arp: true, arpDiv: 0.5, kicks: [0, 1, 2, 3], hatsOff: true, hatAmp: 0.09, snares: [] },
  },
  {
    name: 'sunny',
    bpm: 96, bars: 16,
    chords: [[48, 52, 55, 60], [47, 50, 55, 59], [45, 48, 52, 57], [41, 45, 48, 53]],
    bassNotes: [24, 19, 21, 17],
    style: { keys: true, keyHits: [0, 1.5, 3], arp: true, arpDiv: 0.5, kicks: [0, 2], snares: [1, 3], hats: 0.5, hatAmp: 0.06 },
  },
  {
    name: 'midnight',
    bpm: 88, bars: 12,
    chords: [[50, 53, 57, 62], [46, 50, 53, 58], [45, 48, 53, 57], [48, 52, 55, 60]],
    bassNotes: [26, 22, 17, 24],
    style: { pad: true, keys: true, keyHits: [0], kicks: [0, 2.5], snares: [3], hats: 1, hatAmp: 0.05, crackle: true },
  },
  {
    name: 'bounce',
    bpm: 104, bars: 16,
    chords: [[52, 55, 59, 64], [48, 52, 55, 60], [47, 50, 55, 59], [50, 54, 57, 62]],
    bassNotes: [28, 24, 19, 26],
    style: { keys: true, keyHits: [0, 2], arp: true, arpDiv: 0.5, kicks: [0, 1.75, 2.5], snares: [1, 3], hats: 0.5, hatAmp: 0.07 },
  },
  {
    name: 'drift',
    bpm: 76, bars: 12,
    chords: [[48, 52, 55, 59, 62], [41, 45, 48, 52, 57], [45, 48, 52, 55, 62], [43, 47, 50, 55, 60]],
    bassNotes: [24, 17, 21, 19],
    style: { pad: true, kicks: [0], hats: 2, hatAmp: 0.045, snares: [], crackle: true },
  },
];

for (const tr of TRACKS) {
  const beat = 60 / tr.bpm;
  const bar = 4 * beat;
  const seconds = tr.bars * bar + 0.8;
  const buf = makeBuffers(seconds);

  for (let b = 0; b < tr.bars; b++) {
    const t0 = b * bar;
    const chord = tr.chords[b % tr.chords.length];
    const root = tr.bassNotes[b % tr.bassNotes.length];
    const st = tr.style;

    if (st.pad)
      chord.forEach((m, i) =>
        pad(buf, t0, f(m), bar * 1.04, 0.16 / Math.sqrt(chord.length), i % 2 ? 0.35 : -0.35)
      );
    if (st.keys)
      for (const hitBeat of st.keyHits || [0])
        chord.forEach((m, i) =>
          key(buf, t0 + hitBeat * beat, f(m), bar, 0.2 / Math.sqrt(chord.length), (i % 2 ? 0.3 : -0.3), bar * 0.5)
        );
    if (st.arp) {
      const seq = [0, 2, 1, 3, 0, 2, 1, 2];
      for (let s = 0; s < 4 / st.arpDiv; s++) {
        const m = chord[seq[s % seq.length] % chord.length] + 12;
        pluck(buf, t0 + s * st.arpDiv * beat, f(m), 0.13, s % 2 ? 0.4 : -0.4);
      }
    }
    bass(buf, t0, f(root + 12), beat * 1.6, 0.3);
    bass(buf, t0 + 2.5 * beat, f(root + 12), beat * 1.1, 0.22);

    for (const kb of st.kicks || []) kick(buf, t0 + kb * beat, 0.8);
    for (const sb of st.snares || []) snare(buf, t0 + sb * beat, 0.16);
    if (st.hats)
      for (let hb = 0; hb < 4; hb += st.hats)
        hat(buf, t0 + hb * beat, st.hatAmp * (hb % 1 === 0 ? 1 : 0.6));
    if (st.hatsOff) for (let hb = 0.5; hb < 4; hb += 1) hat(buf, t0 + hb * beat, st.hatAmp);
  }

  if (tr.style.crackle) crackle(buf, seconds);
  finalize(buf, seconds);
  const file = path.join(OUT, `${tr.name}.wav`);
  writeWav(file, buf);
  console.log(`${tr.name}.wav  ${seconds.toFixed(1)}s`);
}
console.log('done →', OUT);
