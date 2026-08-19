'use client';

import { AgentThinkingOrb } from '@/components/shared/thinking-orb';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { ChevronDown, ImagePlus, Sparkles, Wand2, X } from 'lucide-react';
import { useRef, useState } from 'react';

export type ComposerMode = 'describe' | 'paste';

/** Long text needs a real paragraph before the model has anything to work with. */
const MIN_PASTE_CHARS = 40;

/**
 * The floating composer docked at the bottom of the canvas.
 *
 * Both ways into the product — describe a diagram, or paste a passage and let
 * the AI propose visuals — used to live at the BOTTOM of a scrolling sidebar,
 * below the template list. On a laptop they were under the fold: you had to
 * scroll a panel you had no reason to scroll to find the primary action. This
 * puts them where the eye already is, over the canvas, and lets the user
 * collapse it to a pill once they're working.
 */
export function CanvasComposer({
  mode,
  onModeChange,
  collapsed,
  onCollapsedChange,
  topic,
  onTopicChange,
  onGenerate,
  generating,
  hasImage,
  onPickImage,
  onClearImage,
  examplePrompts,
  onPasteSubmit,
  pasteBusy,
}: {
  mode: ComposerMode;
  onModeChange: (mode: ComposerMode) => void;
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
  topic: string;
  onTopicChange: (topic: string) => void;
  onGenerate: () => void;
  generating: boolean;
  hasImage: boolean;
  onPickImage: (file: File) => void;
  onClearImage: () => void;
  /** Curated starter chips: a short label to show, the full prompt to fill. */
  examplePrompts: { label: string; prompt: string }[];
  /** Hands pasted text to the Text-to-visuals panel and opens it. */
  onPasteSubmit: (text: string) => void;
  pasteBusy: boolean;
}) {
  const [pasted, setPasted] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const busy = generating || pasteBusy;
  const canDescribe = !generating && (topic.trim().length > 0 || hasImage);
  const canPaste = !busy && pasted.trim().length >= MIN_PASTE_CHARS;

  if (collapsed) {
    return (
      <div className="pointer-events-none absolute inset-x-0 bottom-5 z-30 flex justify-center">
        <button
          type="button"
          onClick={() => onCollapsedChange(false)}
          className="ig-gradient pointer-events-auto flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold text-white shadow-[0_8px_30px_rgba(255,107,157,0.35)] transition-transform duration-150 ease-out hover:scale-[1.02] active:scale-[0.97]"
        >
          {busy ? (
            <AgentThinkingOrb size={20} label="Working" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
          {busy ? 'Working…' : 'Generate with AI'}
        </button>
      </div>
    );
  }

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-5 z-30 flex justify-center px-4">
      <div className="pointer-events-auto w-full max-w-[640px] rounded-2xl border border-border bg-white/95 shadow-[0_12px_40px_rgba(15,23,42,0.12)] backdrop-blur">
        {/* Mode switch + collapse */}
        <div className="flex items-center gap-2 border-b border-border px-3 py-2">
          <div className="flex rounded-lg border border-border bg-[#fafafa] p-0.5">
            <button
              type="button"
              onClick={() => onModeChange('describe')}
              className={cn(
                'flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-[color,background-color] duration-150 ease-out',
                mode === 'describe'
                  ? 'bg-foreground text-background'
                  : 'text-foreground/60 hover:text-foreground'
              )}
            >
              <Sparkles size={13} /> Generate with AI
            </button>
            <button
              type="button"
              onClick={() => onModeChange('paste')}
              className={cn(
                'flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-[color,background-color] duration-150 ease-out',
                mode === 'paste'
                  ? 'bg-foreground text-background'
                  : 'text-foreground/60 hover:text-foreground'
              )}
            >
              <Wand2 size={13} /> Text to visuals
            </button>
          </div>

          <span className="ml-auto" />

          <button
            type="button"
            onClick={() => onCollapsedChange(true)}
            aria-label="Collapse the composer"
            className="rounded-md p-1 text-muted-foreground transition-[color,background-color] duration-150 ease-out hover:bg-[#fafafa] hover:text-foreground"
          >
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>

        {mode === 'describe' ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (canDescribe) onGenerate();
            }}
            className="p-3"
          >
            <div className="mb-2 flex flex-wrap gap-1.5">
              {examplePrompts.slice(0, 5).map((ex) => (
                <button
                  key={ex.label}
                  type="button"
                  onClick={() => onTopicChange(ex.prompt)}
                  title={ex.prompt}
                  className="rounded-full border border-border bg-[#fafafa] px-2 py-1 text-[10px] font-medium text-foreground/65 transition-[color,border-color,transform] duration-150 ease-out hover:border-foreground/30 hover:text-foreground active:scale-[0.97]"
                >
                  {ex.label}
                </button>
              ))}
            </div>

            <Textarea
              value={topic}
              onChange={(e) => onTopicChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  if (canDescribe) onGenerate();
                }
              }}
              placeholder="Describe what you want to visualize…"
              rows={2}
              className="resize-none rounded-lg border-border bg-white text-sm focus-visible:border-foreground/40 focus-visible:ring-0"
            />

            <div className="mt-2 flex items-center gap-2">
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) onPickImage(file);
                  e.target.value = '';
                }}
              />
              {hasImage ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={onClearImage}
                  className="h-9 shrink-0 gap-1.5 rounded-lg border-border text-xs hover:bg-[#fafafa]"
                >
                  <X className="h-3.5 w-3.5" /> Image added
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileRef.current?.click()}
                  className="h-9 shrink-0 gap-1.5 rounded-lg border-border text-xs hover:bg-[#fafafa]"
                >
                  <ImagePlus className="h-3.5 w-3.5" /> Image
                </Button>
              )}
              <Button
                type="submit"
                disabled={!canDescribe}
                size="sm"
                className="h-9 flex-1 gap-2 rounded-lg bg-foreground text-sm text-background hover:bg-neutral-800 disabled:opacity-50"
              >
                {generating ? (
                  <AgentThinkingOrb size={20} label="Generating your diagram" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                Generate
              </Button>
            </div>
          </form>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (canPaste) {
                onPasteSubmit(pasted.trim());
                setPasted('');
              }
            }}
            className="p-3"
          >
            <Textarea
              value={pasted}
              onChange={(e) => setPasted(e.target.value)}
              placeholder="Paste a paragraph, doc or article — the AI proposes visuals that fit it…"
              rows={3}
              className="resize-none rounded-lg border-border bg-white text-sm leading-relaxed focus-visible:border-foreground/40 focus-visible:ring-0"
            />
            <div className="mt-2 flex items-center gap-2">
              <span className="text-[11px] tabular-nums text-muted-foreground">
                {pasted.trim().length < MIN_PASTE_CHARS
                  ? `${MIN_PASTE_CHARS - pasted.trim().length} more characters`
                  : `${pasted.trim().length.toLocaleString()} characters`}
              </span>
              <Button
                type="submit"
                disabled={!canPaste}
                size="sm"
                className="ml-auto h-9 gap-2 rounded-lg bg-foreground text-sm text-background hover:bg-neutral-800 disabled:opacity-50"
              >
                {pasteBusy ? (
                  <AgentThinkingOrb size={20} label="Suggesting visuals" />
                ) : (
                  <Wand2 className="h-4 w-4" />
                )}
                Suggest visuals
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
