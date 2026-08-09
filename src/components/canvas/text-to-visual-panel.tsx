'use client';

// "Text to visuals" — the Napkin-style long-form flow, living in the canvas
// sidebar. Paste a passage → the AI proposes several structurally different
// visuals (AI Suggestions) → pick one (live-previews on the canvas) → tune
// Orientation / Illustration / Detail → Save and Apply commits it.

import {
  AnimatedPreview,
  type Dims,
  type PreviewNode,
  type PreviewSpec,
  type TreeNode,
} from '@/components/blocks/infogiph-home/animated-preview';
import { UpgradeDialog } from '@/components/pricing/upgrade-dialog';
import { CreditsCounter } from '@/components/shared/credits-counter';
import { AgentThinkingOrb } from '@/components/shared/thinking-orb';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useAIUsageLimit } from '@/hooks/use-ai-usage-limit';
import { useLocalePathname } from '@/i18n/navigation';
import { resolveIcon, resolveSvgIcon } from '@/lib/templates/icon-registry';
import type {
  DiagramData,
  TemplateLayout,
  TemplateMode,
} from '@/lib/templates/types';
import {
  VISUAL_CATEGORIES,
  type VisualCategoryKey,
  type VisualDetail,
  type VisualIllustration,
  type VisualOrientation,
  type VisualSuggestion,
  assignVariantLayouts,
  getVisualCategory,
  modeForLayout,
  suggestionToDiagramData,
} from '@/lib/text-to-visual';
import {
  ArrowRight,
  CheckCircle2,
  Loader2,
  RefreshCw,
  Search,
  Sparkles,
  Wand2,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

// Everything the canvas needs to render, persist and export a chosen visual.
export interface AppliedVisual {
  data: DiagramData;
  spec: PreviewSpec;
  title: string;
  category: VisualCategoryKey;
  layout: TemplateLayout;
  mode: TemplateMode;
  accent: string;
  orientation: VisualOrientation;
}

interface TextToVisualPanelProps {
  /** Fired when a suggestion is selected — live-preview it on the canvas. */
  onPreview: (visual: AppliedVisual) => void;
  /** Fired by Save and Apply — commit the visual (title, save, orientation). */
  onApply: (visual: AppliedVisual) => void;
  /**
   * Text handed over from the floating canvas composer. Seeds the box and
   * runs one generation, so a user who pasted at the bottom of the screen
   * doesn't have to paste again in the sidebar.
   */
  seedText?: string | null;
  /** Called once the seed has been taken, so the parent can clear it. */
  onSeedConsumed?: () => void;
}

const MIN_TEXT_CHARS = 40;

const SAMPLE_TEXT =
  'GPT-5.5 understands what you’re trying to do faster and can carry more of the work itself. It excels at writing and debugging code, researching online, analyzing data, creating documents and spreadsheets, operating software, and moving across tools until a task is finished. Instead of carefully managing every step, you can give GPT-5.5 a messy, multi-part task and trust it to plan, use tools, check its work, navigate through ambiguity, and keep going. The gains are especially strong in agentic coding, computer use, knowledge work, and early scientific research. GPT-5.5 delivers this step up in intelligence without compromising on speed, matching GPT-5.4 per-token latency while using significantly fewer tokens for the same tasks. It ships with the strongest set of safeguards to date, evaluated across a full suite of safety frameworks with internal and external redteamers and nearly 200 trusted early-access partners.';

/**
 * Native coordinate frame for suggestion thumbnails (labels off). Matches the
 * ~150px-wide cards in the 340px sidebar so tiles keep their intended
 * proportions — AnimatedPreview sizes tiles in px but positions them in % of
 * this frame.
 */
const THUMB_DIMS: Dims = {
  W: 150,
  H: 112,
  tileBase: 17,
  tileLarge: 24,
  margin: 24,
  labelSize: 0,
};

/**
 * Build the renderable spec for a suggestion. The category dictates the layout;
 * node keys follow the same center/sat-N (and root/cN) convention as
 * derivePreviewSpec, so element edits and reloads keep working.
 */
export function specFromSuggestion(
  s: VisualSuggestion,
  layoutOverride?: TemplateLayout
): PreviewSpec {
  const cat = getVisualCategory(s.category) || VISUAL_CATEGORIES[0];
  const layout = layoutOverride ?? cat.layout;
  const ci = resolveIcon(s.center.icon, s.center.label, true);
  const center: PreviewNode = {
    key: 'center',
    label: s.center.label,
    icon: ci.node,
    flush: ci.flush || ci.kind === 'brand',
  };
  const sats: PreviewNode[] = s.satellites.map((sat, i) => {
    const r = resolveIcon(sat.icon, sat.label);
    // SVG-embeddable variant for the orbit layout (satellites render inside
    // the animated <svg>, where HTML icons can't go).
    const sv = resolveSvgIcon(sat.icon, sat.label);
    return {
      key: `sat-${i}`,
      label: sat.label,
      icon: r.node,
      flush: r.flush,
      svgIcon: sv.node,
      letter: sv.letter,
      tint: sv.tint,
    };
  });
  const base = { mode: modeForLayout(cat, layout), accent: cat.accent };

  switch (layout) {
    case 'hub-lr': {
      const mid = Math.ceil(sats.length / 2);
      return {
        ...base,
        layout: 'hub-lr',
        left: sats.slice(0, mid),
        right: sats.slice(mid),
        center,
      };
    }
    case 'pipeline': {
      // Same convention as derivePreviewSpec: the subject sits mid-flow, so a
      // saved visual reloads exactly as it was applied.
      const nodes = [...sats];
      nodes.splice(Math.floor(sats.length / 2), 0, center);
      return { ...base, layout: 'pipeline', nodes };
    }
    case 'tree': {
      const children: TreeNode[] = s.satellites.slice(0, 4).map((sat, i) => {
        const r = resolveIcon(sat.icon, sat.label);
        return {
          key: `c${i}`,
          label: sat.label,
          icon: r.node,
          flush: r.flush,
          children: (sat.children || []).slice(0, 3).map((g, j) => {
            const gi = resolveIcon(g.icon, g.label);
            return {
              key: `c${i}-${j}`,
              label: g.label,
              icon: gi.node,
              flush: gi.flush,
            };
          }),
        };
      });
      return {
        ...base,
        layout: 'tree',
        root: { ...center, key: 'root', children },
      };
    }
    case 'orbit':
      return { ...base, layout: 'orbit', center, satellites: sats };
    case 'cycle':
      return { ...base, layout: 'cycle', center, satellites: sats };
    case 'steps':
      return { ...base, layout: 'steps', center, satellites: sats };
    case 'funnel':
      return { ...base, layout: 'funnel', center, satellites: sats };
    case 'pyramid':
      // Pyramid layers are BASE-first; text order is surface/top-first.
      return {
        ...base,
        layout: 'pyramid',
        center,
        satellites: [...sats].reverse(),
      };
    case 'quadrant':
      return { ...base, layout: 'quadrant', center, satellites: sats };
    case 'columns':
      return { ...base, layout: 'columns', center, satellites: sats };
    case 'timeline':
      return { ...base, layout: 'timeline', center, satellites: sats };
    case 'iceberg':
      return { ...base, layout: 'iceberg', center, satellites: sats };
    default:
      return { ...base, layout: 'radial', center, satellites: sats };
  }
}

/** Slimmed copy of a spec for the small thumbnail frame (fewer nodes). */
function thumbSpec(spec: PreviewSpec): PreviewSpec {
  switch (spec.layout) {
    case 'radial':
      return { ...spec, satellites: spec.satellites.slice(0, 6) };
    case 'orbit':
      return { ...spec, satellites: spec.satellites.slice(0, 6) };
    case 'cycle':
      return { ...spec, satellites: spec.satellites.slice(0, 6) };
    case 'steps':
    case 'funnel':
    case 'pyramid':
      return { ...spec, satellites: spec.satellites.slice(0, 4) };
    case 'timeline':
    case 'iceberg':
      return { ...spec, satellites: spec.satellites.slice(0, 5) };
    case 'quadrant':
    case 'columns':
      return { ...spec, satellites: spec.satellites.slice(0, 6) };
    case 'pipeline':
      return { ...spec, nodes: spec.nodes.slice(0, 5) };
    case 'hub-lr':
      return {
        ...spec,
        left: spec.left.slice(0, 3),
        right: spec.right.slice(0, 3),
      };
    case 'tree':
      return {
        ...spec,
        root: {
          ...spec.root,
          children: (spec.root.children || []).slice(0, 3).map((c) => ({
            ...c,
            children: (c.children || []).slice(0, 2),
          })),
        },
      };
  }
}

/** Compact three-way toggle row for one Brand-Studio-style parameter. */
function ParamRow<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: Array<{ value: T; label: string }>;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-[72px] shrink-0 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <ToggleGroup
        type="single"
        value={value}
        onValueChange={(v) => v && onChange(v as T)}
        variant="outline"
        size="sm"
        className="w-full flex-1 rounded-lg border border-border bg-white p-0.5"
      >
        {options.map((o) => (
          <ToggleGroupItem
            key={o.value}
            value={o.value}
            className="h-6 flex-1 rounded-md px-1 text-[10px] data-[state=on]:bg-foreground data-[state=on]:text-background"
          >
            {o.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
}

export function TextToVisualPanel({
  onPreview,
  onApply,
  seedText,
  onSeedConsumed,
}: TextToVisualPanelProps) {
  const [text, setText] = useState('');
  const [orientation, setOrientation] = useState<VisualOrientation>('auto');
  const [illustration, setIllustration] = useState<VisualIllustration>('auto');
  const [detail, setDetail] = useState<VisualDetail>('auto');

  const [suggestions, setSuggestions] = useState<VisualSuggestion[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const currentPath = useLocalePathname();
  const [loadingCategory, setLoadingCategory] =
    useState<VisualCategoryKey | null>(null);
  const [categoryQuery, setCategoryQuery] = useState('');
  const [showUpgrade, setShowUpgrade] = useState(false);
  const { usageData, refreshUsageData } = useAIUsageLimit();

  // Each suggestion in a batch gets its own shape variant (Napkin-style:
  // same content, genuinely different structures across the cards).
  const layoutById = useMemo(
    () => assignVariantLayouts(suggestions),
    [suggestions]
  );
  // Specs are derived once per suggestion batch; thumbnails and the canvas
  // preview share them so what you click is what you get.
  const specs = useMemo(() => {
    const map = new Map<string, PreviewSpec>();
    for (const s of suggestions)
      map.set(s.id, specFromSuggestion(s, layoutById.get(s.id)));
    return map;
  }, [suggestions, layoutById]);

  const filteredCategories = useMemo(() => {
    const q = categoryQuery.trim().toLowerCase();
    if (!q) return VISUAL_CATEGORIES;
    return VISUAL_CATEGORIES.filter(
      (c) =>
        c.label.toLowerCase().includes(q) || c.tagline.toLowerCase().includes(q)
    );
  }, [categoryQuery]);

  const buildVisual = (
    s: VisualSuggestion,
    orient: VisualOrientation = orientation,
    layoutOverride?: TemplateLayout
  ): AppliedVisual => {
    const cat = getVisualCategory(s.category) || VISUAL_CATEGORIES[0];
    const layout = layoutOverride ?? layoutById.get(s.id) ?? cat.layout;
    const spec =
      (!layoutOverride && specs.get(s.id)) || specFromSuggestion(s, layout);
    return {
      data: suggestionToDiagramData(s),
      spec,
      title: s.title,
      category: s.category,
      layout,
      mode: modeForLayout(cat, layout),
      accent: cat.accent,
      orientation: orient,
    };
  };

  const selectSuggestion = (s: VisualSuggestion) => {
    setSelectedId(s.id);
    onPreview(buildVisual(s));
  };

  // Take text handed over from the floating composer and run it once. Keyed on
  // the seed value itself; the parent clears it via onSeedConsumed so the same
  // text can be sent again later.
  useEffect(() => {
    if (!seedText) return;
    setText(seedText);
    onSeedConsumed?.();
    void generate(undefined, seedText);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seedText]);

  // Orientation is a live parameter: re-preview the current selection with it.
  const changeOrientation = (o: VisualOrientation) => {
    setOrientation(o);
    const sel = suggestions.find((s) => s.id === selectedId);
    if (sel) onPreview(buildVisual(sel, o));
  };

  const generate = async (
    category?: VisualCategoryKey,
    sourceOverride?: string
  ) => {
    const source = (sourceOverride ?? text).trim();
    if (source.length < MIN_TEXT_CHARS) {
      toast.error(
        'Paste a longer text — at least a full paragraph — to get meaningful visuals.'
      );
      return;
    }
    if (loading || loadingCategory) return;
    setLoading(true);
    setLoadingCategory(category ?? null);
    try {
      const response = await fetch('/api/ai/text-to-visual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: source,
          category,
          orientation,
          illustration,
          detail,
        }),
      });
      if (response.status === 401) {
        toast.error('Please sign in to use this feature');
        return;
      }
      if (response.status === 429) {
        // Out of credits — upsell instead of a dead-end error.
        refreshUsageData();
        setShowUpgrade(true);
        return;
      }
      if (!response.ok) {
        const data = await response.json().catch(() => null);
        toast.error(data?.message || 'Could not generate visual suggestions');
        return;
      }
      const data = await response.json();
      const next: VisualSuggestion[] = data.suggestions || [];
      if (next.length === 0) {
        toast.error(
          'No visual structures found in this text — try a richer passage.'
        );
        return;
      }
      setSuggestions(next);
      refreshUsageData(); // keep the credits counter honest after a spend
      // Auto-preview the best fit so the canvas responds immediately.
      // (The memos haven't recomputed in this tick — assign + build directly.)
      const assigned = assignVariantLayouts(next);
      setSelectedId(next[0].id);
      onPreview(buildVisual(next[0], orientation, assigned.get(next[0].id)));
    } catch (err: any) {
      toast.error(err.message || 'Could not generate visual suggestions');
    } finally {
      setLoading(false);
      setLoadingCategory(null);
    }
  };

  const applySelected = () => {
    const sel = suggestions.find((s) => s.id === selectedId);
    if (!sel) return;
    onApply(buildVisual(sel));
  };

  const selected = suggestions.find((s) => s.id === selectedId) || null;
  const busy = loading || loadingCategory !== null;

  return (
    // min-h-0 lets this flex child (sharing the sidebar column with the tab
    // bar) actually constrain, so the ScrollArea scrolls and the Save and
    // Apply footer stays pinned instead of overflowing off-screen.
    <div className="flex min-h-0 flex-1 flex-col">
      <ScrollArea className="min-h-0 flex-1">
        <div className="space-y-4 px-4 pb-4 pt-4">
          {/* Source text */}
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Wand2 className="h-3.5 w-3.5 text-foreground" />
                <span className="text-xs font-semibold text-foreground">
                  Your text
                </span>
              </div>
              <button
                type="button"
                onClick={() => setText(SAMPLE_TEXT)}
                className="text-[10px] font-medium text-foreground/50 transition-colors hover:text-foreground"
              >
                Try a sample
              </button>
            </div>
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste a paragraph, notes or an article — the AI reads it and suggests visuals that fit its structure…"
              rows={7}
              className="mt-2 resize-none rounded-lg border-border bg-white text-xs leading-relaxed focus-visible:border-foreground/40 focus-visible:ring-0"
            />
            <div className="mt-1 text-right text-[10px] text-muted-foreground">
              {text.trim().length.toLocaleString()} characters
            </div>
          </div>

          {/* Brand-Studio-style parameters */}
          <div className="space-y-1.5 rounded-xl border border-border bg-white p-2.5">
            <ParamRow
              label="Orientation"
              value={orientation}
              onChange={changeOrientation}
              options={[
                { value: 'portrait', label: 'Portrait' },
                { value: 'auto', label: 'Auto' },
                { value: 'landscape', label: 'Landscape' },
              ]}
            />
            <ParamRow
              label="Illustration"
              value={illustration}
              onChange={setIllustration}
              options={[
                { value: 'abstract', label: 'Abstract' },
                { value: 'auto', label: 'Auto' },
                { value: 'concrete', label: 'Concrete' },
              ]}
            />
            <ParamRow
              label="Detail"
              value={detail}
              onChange={setDetail}
              options={[
                { value: 'summary', label: 'Summary' },
                { value: 'auto', label: 'Auto' },
                { value: 'detailed', label: 'Detailed' },
              ]}
            />
          </div>

          <Button
            type="button"
            onClick={() => generate()}
            disabled={busy || text.trim().length < MIN_TEXT_CHARS}
            className="h-9 w-full gap-2 rounded-lg bg-foreground text-xs text-background hover:bg-neutral-800 disabled:opacity-50"
            size="sm"
          >
            {loading && loadingCategory === null ? (
              <AgentThinkingOrb size={20} label="Suggesting visuals" />
            ) : (
              <Sparkles className="h-3.5 w-3.5" />
            )}
            {suggestions.length > 0 ? 'New suggestions' : 'Suggest visuals'}
          </Button>

          {/* Credits counter — visible where credits are spent */}
          <div className="flex justify-center">
            <CreditsCounter onUpgrade={() => setShowUpgrade(true)} />
          </div>

          {/* AI Suggestions */}
          {suggestions.length > 0 && (
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  AI Suggestions
                </span>
                <button
                  type="button"
                  onClick={() => generate()}
                  disabled={busy}
                  className="flex items-center gap-1 text-[10px] font-medium text-foreground/50 transition-colors hover:text-foreground disabled:opacity-50"
                >
                  <RefreshCw className="h-3 w-3" /> Refresh
                </button>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {suggestions.map((s) => {
                  const cat = getVisualCategory(s.category);
                  const spec = specs.get(s.id);
                  const isSelected = s.id === selectedId;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => selectSuggestion(s)}
                      className={`group overflow-hidden rounded-xl border bg-white text-left transition-all hover:shadow-sm ${
                        isSelected
                          ? 'border-foreground shadow-sm ring-1 ring-foreground'
                          : 'border-border'
                      }`}
                    >
                      <div className="pointer-events-none relative aspect-[4/3] w-full overflow-hidden border-b border-border/60">
                        {spec && (
                          <AnimatedPreview
                            {...(thumbSpec(spec) as any)}
                            dims={THUMB_DIMS}
                            showModeChip={false}
                          />
                        )}
                        {isSelected && (
                          <span className="absolute right-1.5 top-1.5 rounded-full bg-foreground p-0.5 text-background">
                            <CheckCircle2 className="h-3 w-3" />
                          </span>
                        )}
                      </div>
                      <div className="p-2">
                        <span
                          className="inline-block rounded-full px-1.5 py-0.5 text-[9px] font-semibold"
                          style={{
                            background: `${cat?.accent || '#8b5cf6'}1a`,
                            color: cat?.accent || '#8b5cf6',
                          }}
                        >
                          {cat?.label || s.category}
                        </span>
                        <div className="mt-1 line-clamp-2 text-[11px] font-medium leading-tight text-foreground">
                          {s.title}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Categories — targeted generation */}
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Categories
            </span>
            <div className="relative mt-2">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={categoryQuery}
                onChange={(e) => setCategoryQuery(e.target.value)}
                placeholder="Search (e.g. Mindmap…)"
                className="h-8 rounded-lg border-border bg-white pl-8 text-xs focus-visible:border-foreground/40 focus-visible:ring-0"
              />
            </div>
            <div className="mt-2 space-y-1">
              {filteredCategories.map((cat) => (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => generate(cat.key)}
                  disabled={busy}
                  className="group flex w-full items-center gap-2.5 rounded-lg border border-transparent bg-white px-2.5 py-2 text-left transition-all hover:border-border hover:shadow-sm disabled:opacity-60"
                >
                  <span
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{ background: cat.accent }}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-xs font-medium text-foreground">
                      {cat.label}
                    </span>
                    <span className="block truncate text-[10px] text-muted-foreground">
                      {cat.tagline}
                    </span>
                  </span>
                  {loadingCategory === cat.key ? (
                    <AgentThinkingOrb
                      size={20}
                      label={`Generating a ${cat.label} visual`}
                      className="shrink-0"
                    />
                  ) : (
                    <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                  )}
                </button>
              ))}
              {filteredCategories.length === 0 && (
                <p className="px-2 py-3 text-center text-xs text-muted-foreground">
                  No category matches “{categoryQuery.trim()}”.
                </p>
              )}
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* Save and Apply */}
      <div className="border-t border-border bg-white p-3">
        <Button
          type="button"
          onClick={applySelected}
          disabled={!selected || busy}
          className="h-9 w-full gap-2 rounded-lg bg-foreground text-xs text-background hover:bg-neutral-800 disabled:opacity-50"
          size="sm"
        >
          <CheckCircle2 className="h-3.5 w-3.5" />
          Save and Apply
        </Button>
        <p className="mt-1.5 text-center text-[10px] text-muted-foreground">
          {selected
            ? `Applies “${selected.title}” to your canvas`
            : 'Pick a suggestion to apply it to the canvas'}
        </p>
      </div>

      {/* Out-of-credits upsell */}
      <UpgradeDialog
        open={showUpgrade}
        onOpenChange={(o) => {
          setShowUpgrade(o);
          if (!o) refreshUsageData();
        }}
        reason={
          usageData?.subscriptionStatus === 'hobby'
            ? "You've used this month's 500 generations. Max removes the cap entirely."
            : "You've used your free AI generations. Upgrade for 500 a month."
        }
        returnTo={currentPath}
      />
    </div>
  );
}
