'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  type SvglItem,
  getSvglIndex,
  popularSvglItems,
  searchSvgl,
  svglProxyUrl,
  svglRouteUrl,
} from '@/lib/svgl';
import {
  ALL_ICON_KEYS,
  ICON_PICKER_GROUPS,
  resolveIcon,
} from '@/lib/templates/icon-registry';
import { motion } from 'framer-motion';
import { ImagePlus, Loader2, Trash2, X } from 'lucide-react';
import { type ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';

export interface InspectorNode {
  key: string;
  label: string;
  isCenter: boolean;
  /** Chart layouts: the node's current numeric value (bar height / share). */
  value?: number;
  unit?: string;
}

interface ElementInspectorProps {
  node: InspectorNode | null;
  /** Whether the canvas currently renders a chart layout (bars/line/donut). */
  isChartLayout?: boolean;
  uploading?: boolean;
  onClose: () => void;
  onLabelChange: (label: string) => void;
  /** Chart layouts: commit a new numeric value for the node. */
  onValueChange?: (value: number) => void;
  onIconChange: (iconKey: string) => void;
  /** A real brand logo picked from the svgl catalog (url = svg route URL). */
  onPickLogo: (logo: { title: string; url: string }) => void;
  onUploadLogo: (file: File) => void;
  onDelete: () => void;
}

function Swatch({ iconKey, onPick }: { iconKey: string; onPick: () => void }) {
  return (
    <button
      type="button"
      onClick={onPick}
      title={iconKey}
      className="group flex h-12 items-center justify-center rounded-lg border border-border bg-white transition-colors hover:border-foreground/40 hover:bg-[#fafafa]"
    >
      <span className="flex h-6 w-6 items-center justify-center">
        {resolveIcon(iconKey).node}
      </span>
    </button>
  );
}

function LogoSwatch({ item, onPick }: { item: SvglItem; onPick: () => void }) {
  return (
    <button
      type="button"
      onClick={onPick}
      title={item.title}
      className="group flex h-12 items-center justify-center rounded-lg border border-border bg-white transition-colors hover:border-foreground/40 hover:bg-[#fafafa]"
    >
      <img
        src={svglProxyUrl(svglRouteUrl(item))}
        alt={item.title}
        loading="lazy"
        decoding="async"
        className="h-6 w-6 object-contain"
      />
    </button>
  );
}

/**
 * Right-docked inspector for the selected canvas element. Swaps icon/logo,
 * uploads a custom logo, edits the label, and deletes (non-center) nodes.
 * Purely presentational — all edits are reported up to FlowVizArchitect, which
 * stores them as overrides applied to the rendered spec.
 */
export function ElementInspector({
  node,
  isChartLayout,
  uploading,
  onClose,
  onLabelChange,
  onValueChange,
  onIconChange,
  onPickLogo,
  onUploadLogo,
  onDelete,
}: ElementInspectorProps) {
  const [query, setQuery] = useState('');
  const [svglItems, setSvglItems] = useState<SvglItem[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  // Local draft for the numeric value so partial input ("4.", "") doesn't
  // thrash the chart; commits on every parseable change.
  const [valueDraft, setValueDraft] = useState('');
  useEffect(() => {
    setValueDraft(
      typeof node?.value === 'number' && Number.isFinite(node.value)
        ? String(node.value)
        : ''
    );
  }, [node?.key, node?.value]);

  // The full svgl catalog (cached module-wide + server-side); powers the
  // "Popular logos" grid and logo search. On failure it stays empty and the
  // inspector simply shows the built-in icon groups.
  useEffect(() => {
    let mounted = true;
    getSvglIndex().then((items) => {
      if (mounted) setSvglItems(items);
    });
    return () => {
      mounted = false;
    };
  }, []);

  const popularLogos = useMemo(
    () => popularSvglItems(svglItems).slice(0, 20),
    [svglItems]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null;
    return {
      keys: ALL_ICON_KEYS.filter((k) => k.includes(q)),
      logos: searchSvgl(svglItems, q),
    };
  }, [query, svglItems]);

  if (!node) return null;

  const onFile = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) onUploadLogo(f);
    e.target.value = '';
  };

  const pick = (item: SvglItem) =>
    onPickLogo({ title: item.title, url: svglRouteUrl(item) });

  return (
    <motion.aside
      initial={{ x: 24, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 420, damping: 36 }}
      className="absolute right-0 top-0 z-20 flex h-full w-72 flex-col border-l border-border bg-white shadow-[-8px_0_30px_rgba(0,0,0,0.05)]"
    >
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="min-w-0">
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            {node.isCenter ? 'Center element' : 'Element'}
          </p>
          <p className="truncate text-sm font-semibold text-foreground">
            {node.label || 'Untitled'}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
          aria-label="Close inspector"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 space-y-5 overflow-y-auto px-4 py-4">
        <div className="space-y-1.5">
          <span className="text-xs font-medium text-foreground/80">Text</span>
          <Input
            value={node.label}
            onChange={(e) => onLabelChange(e.target.value)}
            placeholder="Label"
            className="h-9 text-sm"
          />
        </div>

        {isChartLayout && !node.isCenter && onValueChange ? (
          <div className="space-y-1.5">
            <span className="text-xs font-medium text-foreground/80">
              Value{node.unit ? ` (${node.unit})` : ''}
            </span>
            <Input
              type="number"
              inputMode="decimal"
              min={0}
              value={valueDraft}
              onChange={(e) => {
                setValueDraft(e.target.value);
                const v = Number.parseFloat(e.target.value);
                if (Number.isFinite(v) && v >= 0) onValueChange(v);
              }}
              placeholder="42"
              className="h-9 text-sm"
            />
            <p className="text-[11px] text-muted-foreground">
              Drives the bar height, line point or donut share.
            </p>
          </div>
        ) : null}

        <div className="space-y-1.5">
          <span className="text-xs font-medium text-foreground/80">Logo</span>
          <Button
            type="button"
            variant="outline"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="w-full justify-center gap-2 text-sm"
          >
            {uploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ImagePlus className="h-4 w-4" />
            )}
            {uploading ? 'Uploading…' : 'Upload custom logo'}
          </Button>
          <input
            ref={fileRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={onFile}
            className="hidden"
          />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-medium text-foreground/80">Icon</span>
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search icons & 600+ brand logos"
            className="h-9 text-sm"
          />
          {filtered ? (
            <div className="space-y-3">
              {filtered.logos.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                    Brand logos
                  </p>
                  <div className="grid grid-cols-5 gap-1.5">
                    {filtered.logos.map((item) => (
                      <LogoSwatch
                        key={`${item.id}-${item.title}`}
                        item={item}
                        onPick={() => pick(item)}
                      />
                    ))}
                  </div>
                </div>
              )}
              {filtered.keys.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                    Icons
                  </p>
                  <div className="grid grid-cols-5 gap-1.5">
                    {filtered.keys.map((k) => (
                      <Swatch
                        key={k}
                        iconKey={k}
                        onPick={() => onIconChange(k)}
                      />
                    ))}
                  </div>
                </div>
              )}
              {filtered.keys.length === 0 && filtered.logos.length === 0 && (
                <p className="py-3 text-center text-xs text-muted-foreground">
                  No matches
                </p>
              )}
            </div>
          ) : (
            <>
              {popularLogos.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                    Popular logos
                  </p>
                  <div className="grid grid-cols-5 gap-1.5">
                    {popularLogos.map((item) => (
                      <LogoSwatch
                        key={`${item.id}-${item.title}`}
                        item={item}
                        onPick={() => pick(item)}
                      />
                    ))}
                  </div>
                </div>
              )}
              {ICON_PICKER_GROUPS.map((g) => (
                <div key={g.label} className="space-y-1.5">
                  <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                    {g.label}
                  </p>
                  <div className="grid grid-cols-5 gap-1.5">
                    {g.keys.map((k) => (
                      <Swatch
                        key={k}
                        iconKey={k}
                        onPick={() => onIconChange(k)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>

      {!node.isCenter && (
        <div className="border-t border-border px-4 py-3">
          <Button
            type="button"
            variant="ghost"
            onClick={onDelete}
            className="w-full justify-center gap-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
            Delete element
          </Button>
        </div>
      )}
    </motion.aside>
  );
}
