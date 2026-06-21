'use client';

import { DotLottieReact } from '@lottiefiles/dotlottie-react';

// Shown on the canvas while a diagram is being generated. Plays the
// "Playful shapes scale" dotLottie over a translucent veil of the previous
// diagram, with a "Generating your diagram…" caption.
const LOTTIE_SRC = '/Playful%20shapes%20scale.lottie';

export function ProcessingOverlay({
  accent = '#6366f1',
  label = 'Generating your diagram',
}: {
  accent?: string;
  label?: string;
}) {
  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-2 bg-white/65 backdrop-blur-[2px]">
      <DotLottieReact
        src={LOTTIE_SRC}
        loop
        autoplay
        style={{ width: 220, height: 220 }}
      />

      <div className="-mt-3 flex items-center gap-1 text-sm font-medium text-foreground/80">
        <span>{label}</span>
        <span className="inline-flex">
          {[0, 1, 2].map((d) => (
            <span
              key={d}
              className="ig-proc-dot"
              style={{ animationDelay: `${d * 0.18}s`, color: accent }}
            >
              .
            </span>
          ))}
        </span>
      </div>

      <style>{`
        @keyframes ig-proc-bounce { 0%,80%,100% { opacity: 0.25 } 40% { opacity: 1 } }
        .ig-proc-dot { animation: ig-proc-bounce 1.2s infinite both; }
      `}</style>
    </div>
  );
}
