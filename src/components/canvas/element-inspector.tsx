'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  ALL_ICON_KEYS,
  ICON_PICKER_GROUPS,
  resolveIcon,
} from '@/lib/templates/icon-registry';
import { motion } from 'framer-motion';
import { ImagePlus, Loader2, Trash2, X } from 'lucide-react';
import { type ChangeEvent, useMemo, useRef, useState } from 'react';

export interface InspectorNode {
  key: string;
  label: string;
  isCenter: boolean;
}

interface ElementInspectorProps {
  node: InspectorNode | null;
  uploading?: boolean;
  onClose: () => void;
  onLabelChange: (label: string) => void;
  onIconChange: (iconKey: string) => void;
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

/**
 * Right-docked inspector for the selected canvas element. Swaps icon/logo,
 * uploads a custom logo, edits the label, and deletes (non-center) nodes.
 * Purely presentational — all edits are reported up to FlowVizArchitect, which
 * stores them as overrides applied to the rendered spec.
 */
export function ElementInspector({
  node,
  uploading,
  onClose,
  onLabelChange,
  onIconChange,
  onUploadLogo,
  onDelete,
}: ElementInspectorProps) {
  const [query, setQuery] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null;
    return ALL_ICON_KEYS.filter((k) => k.includes(q));
  }, [query]);

  if (!node) return null;

  const onFile = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) onUploadLogo(f);
    e.target.value = '';
  };

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
            placeholder="Search icons & logos"
            className="h-9 text-sm"
          />
          {filtered ? (
            <div className="grid grid-cols-5 gap-1.5">
              {filtered.map((k) => (
                <Swatch key={k} iconKey={k} onPick={() => onIconChange(k)} />
              ))}
              {filtered.length === 0 && (
                <p className="col-span-5 py-3 text-center text-xs text-muted-foreground">
                  No matches
                </p>
              )}
            </div>
          ) : (
            ICON_PICKER_GROUPS.map((g) => (
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
            ))
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
