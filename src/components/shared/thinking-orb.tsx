'use client';

import { type OrbSize, type OrbState, ThinkingOrb } from 'thinking-orbs';

/**
 * Infogiph's single agent-thinking indicator.
 *
 * `thinking-orbs` ships nine states, but the product uses exactly ONE so that
 * every AI moment — generating a diagram on the canvas, the chat assistant
 * composing a reply, suggesting visuals from pasted text — reads as the same
 * system doing the same kind of work. Import this wrapper rather than
 * `ThinkingOrb` directly; changing the state here changes it everywhere.
 *
 * `shaping` (a dotted outline morphing circle → triangle → square) is the one
 * that matches what Infogiph actually does: a diagram taking form.
 *
 * The library handles reduced motion (static frame), light/dark via the
 * ancestor `data-theme` / `prefers-color-scheme`, and pauses itself off-screen
 * via IntersectionObserver — so none of that is re-implemented here.
 */
const INFOGIPH_ORB_STATE: OrbState = 'shaping';

export function AgentThinkingOrb({
  size = 64,
  label = 'Working',
  className,
  speed,
}: {
  /** 64 for a centred/overlay moment, 20 for inline beside text. */
  size?: OrbSize;
  /** Announced to screen readers — say what the agent is doing. */
  label?: string;
  className?: string;
  speed?: number;
}) {
  return (
    <ThinkingOrb
      state={INFOGIPH_ORB_STATE}
      size={size}
      speed={speed}
      className={className}
      aria-label={label}
    />
  );
}
