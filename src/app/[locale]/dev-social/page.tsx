'use client';

// Dev-only batch renderer for social exports. Renders each concept from the
// scratchpad calendar as a real <AnimatedPreview> and streams SMIL-seeked
// frames to /api/dev-social (which writes them to disk for ffmpeg encoding).
// Drive headlessly via /en/dev-social?run=1. Not linked from the app; delete
// alongside src/app/api/dev-social when the campaign assets are generated.

import {
  AnimatedPreview,
  type Dims,
} from '@/components/blocks/infogiph-home/animated-preview';
import { analyzeSmilTiming, createSmilFrameSource } from '@/lib/export-frames';
import { derivePreviewSpec } from '@/lib/templates/preview';
import type { PreviewSpec } from '@/components/blocks/infogiph-home/animated-preview';
import type { Template, TemplateLayout } from '@/lib/templates/types';
import { useEffect, useRef, useState } from 'react';

const DIMS: Dims = {
  W: 960,
  H: 540,
  tileBase: 44,
  tileLarge: 72,
  margin: 130,
  labelSize: 13,
};

/**
 * Stage size from `?w=` / `?h=`, so one harness can render landscape (16:9),
 * vertical (9:16) and square. Tile and label sizing scale with the SHORTER
 * edge — scaling on width alone makes vertical frames render tiny tiles
 * stranded in a tall box.
 */
function dimsFromQuery(search: string): Dims {
  const p = new URLSearchParams(search);
  const W = Number(p.get('w')) || DIMS.W;
  const H = Number(p.get('h')) || DIMS.H;
  const k = Math.min(W, H) / 540;
  return {
    W,
    H,
    tileBase: Math.round(DIMS.tileBase * k),
    tileLarge: Math.round(DIMS.tileLarge * k),
    margin: Math.round(DIMS.margin * k),
    labelSize: Math.max(11, Math.round(DIMS.labelSize * k)),
  };
}

// hub-lr stacks 3 tiles per side column; at margin 130 the vertical pitch
// (70px) is less than a tile + its label (~95px) and rows collide. A smaller
// margin only for that layout restores breathing room.
const dimsForLayout = (layout: TemplateLayout, base: Dims): Dims =>
  layout === 'hub-lr'
    ? { ...base, margin: Math.round(base.margin * 0.49) }
    : base;
const FPS = 30;
const SCALE = 2; // 960x540 -> 1920x1080 output

interface ConceptItem {
  label: string;
  sub?: string;
  /** Explicit icon-registry key (brand logo, 3D squircle or concept glyph).
   *  Without it resolveIcon can only guess from the label, and anything it
   *  can't match renders as a plain letter tile. */
  icon?: string;
}
interface Concept {
  slug: string;
  title: string;
  theme: 'ai' | 'tech';
  shape?: string;
  layout?: TemplateLayout;
  accent?: string;
  center?: string;
  /** Explicit icon key for the centre tile (overrides CENTER_ICON3D). */
  centerIcon?: string;
  items: ConceptItem[];
  hub?: { center: string; left: ConceptItem[]; right: ConceptItem[] };
  tree?: { root: string; children: ConceptItem[] };
}

const PALETTE = [
  '#6366f1',
  '#0ea5e9',
  '#10b981',
  '#8b5cf6',
  '#f59e0b',
  '#14b8a6',
  '#ec4899',
  '#3b82f6',
];

const SHAPE_TO_LAYOUT: Record<string, TemplateLayout> = {
  linear: 'pipeline',
  cycle: 'cycle',
  branch: 'hub-lr',
  funnel: 'funnel',
};

// Deliberate layout variety for the AI track (its JSON only carries shapes).
const LAYOUT_OVERRIDES: Record<string, TemplateLayout> = {
  'transformer-in-6-steps': 'steps',
  'how-llms-are-trained': 'timeline',
  'what-is-mcp': 'orbit',
  tokenization: 'steps',
  'lora-finetuning': 'steps',
  quantization: 'steps',
  'diffusion-models': 'steps',
  'cnn-pipeline': 'steps',
  'llm-evals': 'steps',
  'ai-inference-request': 'timeline',
};

// Centers for layouts where the center is a hub/theme rather than a step.
const CENTER_OVERRIDES: Record<string, string> = {
  'ai-agent-loop': 'Agent',
  'prompt-engineering-loop': 'Iterate',
  'gradient-descent': 'Training',
  'how-gans-work': 'The duel',
  'mlops-lifecycle': 'MLOps',
  'how-llms-are-trained': 'LLM lifecycle',
  'ai-inference-request': 'One API call',
  'what-is-mcp': 'AI app (MCP host)',
  'cache-invalidation': 'Cache-aside',
  'rate-limiting': 'Token bucket',
  idempotency: 'Idempotency',
  'url-to-pixels': '~300 ms',
  'git-branching-flow': 'main stays green',
  websockets: 'One socket',
  'caching-layers': 'Your request',
};

// Hub structures for AI-track comparison concepts (flat items in the JSON).
const HUB_OVERRIDES: Record<string, Concept['hub']> = {
  'finetuning-vs-rag': {
    center: 'Teach the model',
    left: [
      { label: 'RAG: retrieve live' },
      { label: 'Fresh facts, cited' },
      { label: 'No retraining' },
    ],
    right: [
      { label: 'Fine-tune: bake in' },
      { label: 'New style & skills' },
      { label: 'Stable knowledge' },
    ],
  },
  'supervised-vs-unsupervised': {
    center: 'Got labels?',
    left: [
      { label: 'Supervised' },
      { label: 'Learns input to answer' },
      { label: 'Predict & classify' },
    ],
    right: [
      { label: 'Unsupervised' },
      { label: 'Finds structure' },
      { label: 'Cluster & compress' },
    ],
  },
  'what-is-mcp': {
    // unused (orbit) — kept so a layout fallback still renders sensibly
    center: 'MCP',
    left: [{ label: 'AI apps' }],
    right: [{ label: 'Tools' }],
  },
};

// Explicit 3D center icons: label-based brand inference misfires at flush
// center size (e.g. "Search vector DB" -> giant Pinecone silhouette), so every
// concept pins a colorful squircle from the THREE_D registry.
const CENTER_ICON3D: Record<string, string> = {
  // ai track
  'how-rag-works': 'database3d',
  'transformer-in-6-steps': 'brain3d',
  'how-llms-are-trained': 'brain3d',
  'attention-qkv': 'spark3d',
  'vector-databases': 'database3d',
  'finetuning-vs-rag': 'brain3d',
  'ai-agent-loop': 'bot3d',
  'what-is-mcp': 'bot3d',
  'prompt-engineering-loop': 'spark3d',
  tokenization: 'cube3d',
  'embeddings-explained': 'layers3d',
  'why-llms-hallucinate': 'brain3d',
  'context-window-budget': 'box3d',
  'temperature-sampling': 'spark3d',
  'lora-finetuning': 'gear3d',
  quantization: 'cpu3d',
  'kv-cache': 'bolt3d',
  'speculative-decoding': 'rocket3d',
  'diffusion-models': 'spark3d',
  'how-gans-work': 'users3d',
  'cnn-pipeline': 'layers3d',
  'supervised-vs-unsupervised': 'chart3d',
  overfitting: 'chart3d',
  'gradient-descent': 'chart3d',
  backpropagation: 'flow3d',
  'mlops-lifecycle': 'gear3d',
  'llm-evals': 'chart3d',
  'ai-guardrails': 'shield3d',
  'multimodal-models': 'layers3d',
  'ai-inference-request': 'bolt3d',
  // tech track
  'url-to-pixels': 'globe3d',
  'how-dns-works': 'globe3d',
  'tls-handshake': 'lock3d',
  'oauth-flow': 'shield3d',
  'jwt-auth': 'lock3d',
  'rest-vs-graphql': 'cloud3d',
  'how-cdns-work': 'globe3d',
  'load-balancing': 'flow3d',
  'caching-layers': 'layers3d',
  'cache-invalidation': 'bolt3d',
  'database-indexing': 'database3d',
  'sql-vs-nosql': 'database3d',
  'database-sharding': 'database3d',
  'database-replication': 'layers3d',
  'cap-theorem': 'cube3d',
  'message-queues': 'box3d',
  'pubsub-vs-queues': 'mega3d',
  'webhooks-vs-polling': 'bolt3d',
  websockets: 'bolt3d',
  'monolith-vs-microservices': 'cube3d',
  'api-gateway': 'cloud3d',
  'rate-limiting': 'funnel3d',
  'cicd-pipeline': 'rocket3d',
  'git-branching-flow': 'flow3d',
  'docker-containers': 'box3d',
  'kubernetes-basics': 'gear3d',
  serverless: 'cloud3d',
  'event-driven-architecture': 'bolt3d',
  idempotency: 'shield3d',
  observability: 'chart3d',
};

// Orbit satellites read better as short ecosystem names than as flow steps.
const ITEM_OVERRIDES: Record<string, ConceptItem[]> = {
  'what-is-mcp': [
    { label: 'GitHub' },
    { label: 'Postgres' },
    { label: 'Slack' },
    { label: 'Browser' },
    { label: 'Search' },
    { label: 'Your API' },
  ],
};

function resolveLayout(c: Concept): TemplateLayout {
  return (
    LAYOUT_OVERRIDES[c.slug] ||
    c.layout ||
    SHAPE_TO_LAYOUT[c.shape || ''] ||
    'pipeline'
  );
}

function buildSpec(c: Concept, idx: number): PreviewSpec {
  const layout = resolveLayout(c);
  const accent = c.accent || PALETTE[idx % PALETTE.length];
  const items = ITEM_OVERRIDES[c.slug] || c.items;

  const centerIcon = CENTER_ICON3D[c.slug] || c.centerIcon;
  let data: Record<string, unknown>;
  if (c.tree && layout === 'tree') {
    data = {
      layout: 'tree',
      root: {
        label: c.tree.root,
        icon: centerIcon,
        children: c.tree.children.map((ch) => ({
          label: ch.label,
          icon: ch.icon,
        })),
      },
    };
  } else {
    const hub = c.hub || (layout === 'hub-lr' ? HUB_OVERRIDES[c.slug] : null);
    let centerLabel: string;
    let sats: ConceptItem[];
    if (hub) {
      centerLabel = hub.center;
      sats = [...hub.left, ...hub.right]; // derivePreviewSpec splits at ceil(n/2)
    } else if (layout === 'steps' || layout === 'funnel') {
      centerLabel = c.center || items[items.length - 1].label;
      sats = items.slice(0, -1);
    } else if (layout === 'iceberg') {
      centerLabel = c.center || items[0].label;
      sats = items.slice(1);
    } else if (layout === 'pipeline') {
      const ci = Math.floor((items.length - 1) / 2);
      centerLabel = items[ci].label;
      sats = items.filter((_, i) => i !== ci);
    } else {
      // cycle, timeline, pyramid, radial, orbit: center is a hub/theme tile
      centerLabel = CENTER_OVERRIDES[c.slug] || c.center || c.title;
      sats = items;
    }
    data = {
      center: { label: centerLabel, icon: centerIcon },
      satellites: sats.map((s) => ({ label: s.label, icon: s.icon })),
    };
  }

  const template = {
    slug: c.slug,
    title: c.title,
    data,
    style: { layout: c.tree ? 'tree' : layout, accent },
  } as unknown as Template;

  return derivePreviewSpec(template, accent);
}

function drawWatermark(ctx: CanvasRenderingContext2D, w: number, h: number) {
  // Prominent brand pill (user preference): large indigo badge, bottom-right.
  const text = 'infogiph.com';
  const size = Math.round(h * 0.036);
  ctx.save();
  ctx.font = `700 ${size}px system-ui, -apple-system, sans-serif`;
  const tw = ctx.measureText(text).width;
  const padX = size * 0.85;
  const padY = size * 0.5;
  const bw = tw + padX * 2;
  const bh = size + padY * 2;
  const x = w - bw - h * 0.028;
  const y = h - bh - h * 0.028;
  const r = bh / 2;
  ctx.shadowColor = 'rgba(49, 46, 129, 0.35)';
  ctx.shadowBlur = size * 0.6;
  ctx.shadowOffsetY = size * 0.15;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + bw, y, x + bw, y + bh, r);
  ctx.arcTo(x + bw, y + bh, x, y + bh, r);
  ctx.arcTo(x, y + bh, x, y, r);
  ctx.arcTo(x, y, x + bw, y, r);
  ctx.closePath();
  ctx.fillStyle = 'rgba(79, 70, 229, 0.96)';
  ctx.fill();
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;
  ctx.fillStyle = '#ffffff';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, x + padX, y + bh / 2 + size * 0.06);
  ctx.restore();
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default function DevSocialPage() {
  const stageRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState<{
    concept: Concept;
    spec: PreviewSpec;
  } | null>(null);
  const [log, setLog] = useState('idle');
  const [dims, setDims] = useState<Dims>(DIMS);
  const startedRef = useRef(false);

  // Read the stage size once on mount (server render has no location).
  useEffect(() => {
    setDims(dimsFromQuery(window.location.search));
  }, []);

  useEffect(() => {
    if (startedRef.current) return;
    const params = new URLSearchParams(window.location.search);
    const show = params.get('show'); // render one concept live, no capture
    if (show) {
      startedRef.current = true;
      (async () => {
        const concepts: Concept[] = await (
          await fetch('/api/dev-social?action=concepts')
        ).json();
        const idx = concepts.findIndex((c) => c.slug === show);
        if (idx >= 0) {
          setCurrent({
            concept: concepts[idx],
            spec: buildSpec(concepts[idx], idx),
          });
          setLog(`show ${show}`);
        } else setLog(`unknown slug ${show}`);
      })();
      return;
    }
    if (params.get('run') !== '1') return;
    startedRef.current = true;
    const only = params.get('only'); // optional: comma-separated slug filter

    (async () => {
      const postJson = (kind: string, body: unknown) =>
        fetch(`/api/dev-social?kind=${kind}`, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(body),
        });

      let concepts: Concept[] = await (
        await fetch('/api/dev-social?action=concepts')
      ).json();
      if (only)
        concepts = concepts.filter((c) => only.split(',').includes(c.slug));

      await document.fonts.ready;
      const errors: { slug: string; message: string }[] = [];

      for (let idx = 0; idx < concepts.length; idx++) {
        const c = concepts[idx];
        setLog(`${idx + 1}/${concepts.length} ${c.slug}`);
        try {
          setCurrent({ concept: c, spec: buildSpec(c, idx) });
          await sleep(950); // mount, icon paint, SMIL clock starts
          const el = stageRef.current;
          if (!el) throw new Error('no stage');
          const timing = analyzeSmilTiming(el);
          if (!timing.seekable) throw new Error('SMIL not seekable');
          const period = Math.min(8, Math.max(0.8, timing.period || 3.4));
          const src = await createSmilFrameSource(el, SCALE);
          const canvas = document.createElement('canvas');
          canvas.width = src.width;
          canvas.height = src.height;
          const ctx = canvas.getContext('2d');
          if (!ctx) throw new Error('no 2d ctx');
          const frames = Math.max(FPS, Math.round(period * FPS));
          for (let i = 0; i < frames; i++) {
            await src.drawFrameAt(timing.leadIn + i / FPS, ctx);
            drawWatermark(ctx, canvas.width, canvas.height);
            const blob: Blob = await new Promise((res, rej) =>
              canvas.toBlob(
                (b) => (b ? res(b) : rej(new Error('toBlob failed'))),
                'image/png'
              )
            );
            await fetch(`/api/dev-social?kind=frame&slug=${c.slug}&i=${i}`, {
              method: 'POST',
              body: blob,
            });
          }
          src.dispose();
          await postJson('meta', {
            slug: c.slug,
            title: c.title,
            theme: c.theme,
            layout: resolveLayout(c),
            frames,
            fps: FPS,
            period,
            width: canvas.width,
            height: canvas.height,
          });
        } catch (e) {
          errors.push({ slug: c.slug, message: String(e) });
        }
        await postJson('status', {
          done: false,
          idx: idx + 1,
          total: concepts.length,
          current: c.slug,
          errors,
        });
      }
      await postJson('status', {
        done: true,
        idx: concepts.length,
        total: concepts.length,
        errors,
      });
      setLog(`done, ${errors.length} errors`);
    })();
  }, []);

  return (
    <div className="min-h-screen bg-neutral-100 p-6">
      <p className="mb-3 font-mono text-xs text-neutral-500">
        dev-social batch renderer — {log}
      </p>
      <div
        ref={stageRef}
        className="infogiph-home relative flex items-center justify-center overflow-hidden bg-white"
        style={{ width: dims.W, height: dims.H }}
      >
        {current && (
          <>
            <div
              className="pointer-events-none absolute left-6 top-5 z-10 flex items-center gap-2"
              style={{ maxWidth: dims.W * 0.7 }}
            >
              <span
                className="inline-block size-2.5 shrink-0 rounded-full"
                style={{
                  background:
                    (current.spec as { accent?: string }).accent || '#6366f1',
                }}
              />
              <span className="truncate text-[19px] font-semibold tracking-tight text-slate-800">
                {current.concept.title}
              </span>
            </div>
            <AnimatedPreview
              key={current.concept.slug}
              {...current.spec}
              dims={dimsForLayout(resolveLayout(current.concept), dims)}
              variant="canvas"
              showModeChip={false}
            />
          </>
        )}
      </div>
    </div>
  );
}
