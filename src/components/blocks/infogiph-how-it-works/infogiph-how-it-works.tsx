'use client';

import { motion, useInView, useReducedMotion } from 'framer-motion';
import {
  Code2,
  Download,
  Palette,
  Shapes,
  Sparkles,
  Type,
  Wand2,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import {
  GALLERY_DIAGRAMS,
  GalleryDiagram,
} from '../infogiph-testimonials/gallery-diagram';

// Warm orange→pink→purple — the Infogiph brand accent (see .ig-gradient).
const WARM = 'linear-gradient(90deg, #ff8a5c, #ff6b9d 58%, #c74bb5)';

/* ── Step 1 visual: a prompt that types itself, like the Hero input ── */
function PromptVisual() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const reduce = useReducedMotion();
  const full = 'SaaS architecture with auth, billing, and analytics';
  const [typed, setTyped] = useState('');

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setTyped(full);
      return;
    }
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setTyped(full.slice(0, i));
      if (i >= full.length) clearInterval(id);
    }, 34);
    return () => clearInterval(id);
  }, [inView, reduce]);

  const done = typed.length >= full.length;

  return (
    <div ref={ref} className="relative mx-auto w-full max-w-[420px]">
      <div
        className="absolute -inset-6 -z-10 rounded-[32px] opacity-70 blur-2xl"
        style={{
          background:
            'radial-gradient(60% 60% at 50% 40%, rgba(255,138,92,0.18), transparent 70%)',
        }}
      />
      <div className="rounded-2xl border border-border bg-white p-5 shadow-xl">
        <div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5" /> Describe your diagram
        </div>
        <div className="min-h-[52px] text-[15px] leading-relaxed text-foreground">
          {typed}
          {!done && (
            <span className="ml-0.5 inline-block h-[1.1em] w-[2px] translate-y-[0.2em] animate-pulse bg-foreground" />
          )}
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="rounded-full border border-border px-3 py-1 text-xs font-medium">
              AI Mode
            </span>
            <span className="rounded-full border border-border px-3 py-1 text-xs font-medium">
              Landscape
            </span>
          </div>
          <motion.span
            className="rounded-full px-4 py-1.5 text-xs font-semibold text-white"
            style={{ backgroundImage: WARM }}
            animate={done ? { scale: [1, 1.08, 1] } : {}}
            transition={{ duration: 0.5 }}
          >
            Create
          </motion.span>
        </div>
      </div>
    </div>
  );
}

/* ── Step 2 visual: a real animated diagram building itself ── */
function GenerateVisual() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <div ref={ref} className="relative mx-auto w-full max-w-[460px]">
      <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          </div>
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.7 }}
            className="flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1 text-[11px] font-medium text-foreground/70"
          >
            <Wand2 className="h-3 w-3" /> Generated in 8s
          </motion.div>
        </div>
        <div className="h-[300px] w-full bg-[#fcfcfc]">
          <GalleryDiagram {...GALLERY_DIAGRAMS[2]} />
        </div>
      </div>
    </div>
  );
}

/* ── Step 3 visual: edit controls + export formats popping in ── */
function EditExportVisual() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const chips = [
    { icon: Shapes, label: 'Icons' },
    { icon: Palette, label: 'Colors' },
    { icon: Type, label: 'Fonts' },
    { icon: Code2, label: 'Layout' },
  ];
  const formats = ['GIF', 'MP4', 'PNG'];

  return (
    <div ref={ref} className="mx-auto w-full max-w-[440px]">
      <div className="rounded-2xl border border-border bg-white p-5 shadow-xl">
        <div className="mb-4 flex items-center gap-2 text-xs text-muted-foreground">
          <Wand2 className="h-3.5 w-3.5" /> Make it yours
        </div>
        <div className="grid grid-cols-2 gap-3">
          {chips.map((c, i) => {
            const Icon = c.icon;
            return (
              <motion.div
                key={c.label}
                initial={{ opacity: 0, y: 12 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.1 + i * 0.1 }}
                className="flex items-center gap-2.5 rounded-xl border border-border bg-secondary/60 px-3 py-2.5"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-white">
                  <Icon className="h-4 w-4 text-foreground/70" />
                </span>
                <span className="text-sm font-medium">{c.label}</span>
              </motion.div>
            );
          })}
        </div>
        <div className="mt-5 border-t border-border pt-4">
          <div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
            <Download className="h-3.5 w-3.5" /> Export anywhere
          </div>
          <div className="flex flex-wrap gap-2">
            {formats.map((f, i) => (
              <motion.span
                key={f}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{
                  delay: 0.5 + i * 0.08,
                  type: 'spring',
                  stiffness: 300,
                  damping: 18,
                }}
                className="rounded-lg px-3 py-1.5 text-xs font-semibold text-white"
                style={{ backgroundImage: WARM }}
              >
                {f}
              </motion.span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const STEPS = [
  {
    highlight: 'Describe',
    title: 'it in plain English',
    body: 'Type a sentence or pick a template — no prompting tricks, no design tools. "SaaS architecture with auth, billing, and analytics" is all Infogiph needs.',
    Visual: PromptVisual,
  },
  {
    highlight: 'AI',
    title: 'builds it in seconds',
    body: 'Infogiph lays out the nodes, draws every connection, matches icons, and animates the flow — a polished, on-brand diagram in 5–15 seconds.',
    Visual: GenerateVisual,
  },
  {
    highlight: 'Edit',
    title: 'and export anywhere',
    body: 'Everything stays editable. Adjust any node, swap colors, icons, and fonts, then export to GIF, MP4, or PNG — ready for decks, docs, and social.',
    Visual: EditExportVisual,
  },
] as const;

function Step({
  step,
  index,
}: {
  step: (typeof STEPS)[number];
  index: number;
}) {
  const { Visual } = step;
  const reverse = index % 2 === 1;

  return (
    <div
      className={`flex flex-col items-center gap-10 md:gap-16 ${
        reverse ? 'md:flex-row-reverse' : 'md:flex-row'
      }`}
    >
      <motion.div
        className="w-full md:w-1/2"
        initial={{ opacity: 0, x: reverse ? 30 : -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-4 flex items-center gap-3">
          <span
            className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white"
            style={{ backgroundImage: WARM }}
          >
            {index + 1}
          </span>
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Step {index + 1}
          </span>
        </div>
        <h3 className="text-3xl font-bold leading-[1.15] tracking-tight text-foreground md:text-4xl">
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: WARM }}
          >
            {step.highlight}
          </span>{' '}
          {step.title}
        </h3>
        <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground md:text-lg">
          {step.body}
        </p>
      </motion.div>

      <motion.div
        className="w-full md:w-1/2"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Visual />
      </motion.div>
    </div>
  );
}

export function InfogiphHowItWorks() {
  return (
    <section className="w-full overflow-hidden border-y border-border bg-[#fafafa] py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="mx-auto mb-16 max-w-2xl text-center md:mb-24">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            How it works
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-5xl">
            From idea to diagram in three steps
          </h2>
          <p className="mt-4 text-base text-muted-foreground md:text-lg">
            No design skills. No fiddling with boxes and arrows. Describe what
            you want and Infogiph does the rest.
          </p>
        </div>

        <div className="flex flex-col gap-20 md:gap-28">
          {STEPS.map((step, i) => (
            <Step key={step.highlight} step={step} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
