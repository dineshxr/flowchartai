'use client';

import { AgentThinkingOrb } from '@/components/shared/thinking-orb';

// Shown on the canvas while a diagram is being generated — a translucent veil
// over the previous diagram, the shared thinking orb, and a caption.
export function ProcessingOverlay({
  accent = '#6366f1',
  label = 'Generating your diagram',
}: {
  accent?: string;
  label?: string;
}) {
  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 bg-white/65 backdrop-blur-[2px]">
      {/* The orb sits wherever the diagram's centre node happens to be, so it
          needs its own ground to read against — otherwise the dotted outline
          fights the node art showing through the veil. */}
      <span className="flex h-24 w-24 items-center justify-center rounded-2xl border border-border/60 bg-white/90 shadow-sm">
        <AgentThinkingOrb size={64} label={label} />
      </span>

      <div className="flex items-center gap-1 text-sm font-medium text-foreground/80">
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
        @media (prefers-reduced-motion: reduce) {
          .ig-proc-dot { animation: none; opacity: 1; }
        }
      `}</style>
    </div>
  );
}
