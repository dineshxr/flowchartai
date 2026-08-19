# 005 — Honour reduced motion, and stop animating 18 off-screen previews

- **Status**: TODO
- **Commit**: 8707150
- **Severity**: HIGH
- **Category**: 6. Accessibility / 5. Performance
- **Estimated scope**: 3 files (1 new hook, 1 component, 1 CSS block).

## Problem

**`prefers-reduced-motion` does not appear anywhere in this codebase.** Verified
across every `.tsx`, `.ts` and `.css` file under `src/`: `prefers-reduced-motion`
= 0 hits, `motion-safe:` = 0 hits, `motion-reduce:` = 0 hits. The single
`useReducedMotion()` import gates one typewriter effect and nothing else:

```tsx
/* src/components/blocks/infogiph-how-it-works/infogiph-how-it-works.tsx:26,32 — current */
  const reduce = useReducedMotion();
  ...
    if (reduce) { setTyped(full); return; }
```

Eight movement animations in that same file ignore it entirely — `:78`
(`scale: [1, 1.08, 1]`), `:104-105` (`y: -4`), `:144-145` (`y: 12`, ×4 chips),
`:165-166` (`scale: 0.8`, ×4 badges), `:225-226` (`x: ±30`, ×3 steps),
`:258-259` (`y: 24`, ×3 steps).

**Meanwhile the homepage runs an enormous unconditional SMIL load.**
`src/components/blocks/infogiph-home/animated-preview.tsx` contains **46**
`repeatCount="indefinite"` declarations:

```jsx
/* src/components/blocks/infogiph-home/animated-preview.tsx:1699 — current */
<animateTransform
  attributeName="transform" type="rotate" additive="sum"
  from="0 0 0" to={`${ring.dir * 360} 0 0`}
  dur={sm(ring.period * 0.45)} repeatCount="indefinite"
/>
```

`src/app/[locale]/(home)/page.tsx:28` renders `<Templates />`, which mounts
`AnimatedPreview` **18 times** — 3 `showcaseHeroes` + 15 `showcaseGallery`
(`src/components/blocks/infogiph-home/template-icons.tsx:79-103`). There is no
`IntersectionObserver`, no `useInView`, no `pauseAnimations()` and no
`content-visibility` anywhere in `animated-preview.tsx`,
`template-showcase-card.tsx` or `templates.tsx` — verified by grep. **Every
one of those 18 previews animates forever, including the ~15 that are below the
fold and never seen.**

The one infinite CSS animation that actually renders is also ungated:

```css
/* src/styles/globals.css:503-504 — current */
.ig-bounce-soft {
  animation: ig-bounce-soft 2.8s ease-in-out infinite;
```
(applied at `src/components/blocks/infogiph-home/feature-demo.tsx:69`, rendered
via `features.tsx:31`.)

AUDIT.md §6: "Hunt for: movement with no `prefers-reduced-motion` handling" and
"Reduced motion means fewer and gentler animations, **not zero** — keep
transitions that aid comprehension, remove position changes."

SMIL cannot be reached by a CSS `@media` block, so it needs a JS `matchMedia`
branch plus the `SVGSVGElement.pauseAnimations()` API.

## Target

### 1. A shared reduced-motion hook

New file `src/hooks/use-prefers-reduced-motion.ts`:

```ts
'use client';

import { useEffect, useState } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

/**
 * Tracks the user's reduced-motion preference and updates if they change it
 * mid-session. Returns false during SSR and on the first client render so the
 * markup matches the server.
 */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(QUERY);
    setReduced(mql.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  return reduced;
}
```

### 2. Pause SMIL when off-screen or when reduced motion is on

`src/components/blocks/infogiph-home/animated-preview.tsx` already has both refs
this needs — `containerRef` on the wrapper div (line 1374, attached at 1417) and
`svgRef` on the root `<svg>` (line 1375, attached at 1432). Add one effect
inside `AnimatedPreview` (declared at line 1329), placed immediately after the
existing ref declarations at lines 1374–1377:

```tsx
/* target — src/components/blocks/infogiph-home/animated-preview.tsx, after line 1377 */
  const prefersReduced = usePrefersReducedMotion();

  // Marketing showcase tiles only. The 'canvas' variant feeds the export
  // frame-capture pipeline, which drives SMIL time itself — never pause it.
  useEffect(() => {
    if (variant === 'canvas') return;
    const svg = svgRef.current;
    const el = containerRef.current;
    if (!svg || !el) return;

    if (prefersReduced) {
      svg.setCurrentTime(0);
      svg.pauseAnimations();
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) svg.unpauseAnimations();
        else svg.pauseAnimations();
      },
      { rootMargin: '200px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [prefersReduced, variant]);
```

Add the import at the top of the file:
```ts
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';
```

`rootMargin: '200px'` starts a tile animating just before it scrolls into view,
so nothing is ever caught mid-freeze. `setCurrentTime(0)` before pausing freezes
each diagram at its authored starting layout, which is a complete, correct
still — reduced motion gets a static diagram, not a broken one.

### 3. Branch the framer-motion transform values

In `src/components/blocks/infogiph-how-it-works/infogiph-how-it-works.tsx`, the
`reduce` variable already exists at line 26. Keep every opacity fade; drop only
the position and scale deltas — AUDIT.md §6: "keep opacity/color, drop movement."

| Line | Current | Target |
| --- | --- | --- |
| 78 | `animate={done ? { scale: [1, 1.08, 1] } : {}}` | `animate={done && !reduce ? { scale: [1, 1.08, 1] } : {}}` |
| 104 | `initial={{ opacity: 0, y: -4 }}` | `initial={{ opacity: 0, y: reduce ? 0 : -4 }}` |
| 144 | `initial={{ opacity: 0, y: 12 }}` | `initial={{ opacity: 0, y: reduce ? 0 : 12 }}` |
| 165 | `initial={{ opacity: 0, scale: 0.8 }}` | `initial={{ opacity: 0, scale: reduce ? 1 : 0.94 }}` |
| 225 | `initial={{ opacity: 0, x: reverse ? 30 : -30 }}` | `initial={{ opacity: 0, x: reduce ? 0 : reverse ? 30 : -30 }}` |
| 258 | `initial={{ opacity: 0, y: 24 }}` | `initial={{ opacity: 0, y: reduce ? 0 : 24 }}` |

Line 165 also fixes a §3 violation in passing: `scale: 0.8` sits outside the
prescribed 0.9–0.97 entrance range. Use `0.94`.

### 4. A global CSS reduced-motion block

Append to the very end of `src/styles/globals.css`:

```css
/* target — src/styles/globals.css, appended at end of file */
@media (prefers-reduced-motion: reduce) {
  /* Keep opacity and colour feedback; drop movement and infinite loops. */
  .ig-bounce-soft {
    animation: none;
  }

  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

The blanket rule is a deliberate safety net for the ~29 `transition-*`
declarations plan `003` normalises. It leaves colour and opacity end-states
intact — elements still reach their hover/focus/active appearance, they just
arrive instantly.

## Repo conventions to follow

- Hooks live in `src/hooks/` as kebab-case files exporting a named `use*`
  function. **Exemplar**: `src/hooks/use-scroll.ts` — `'use client'` at the top,
  a `useState` + `useEffect` with an `addEventListener`/`removeEventListener`
  pair and a cleanup return. Match that shape exactly.
- Imports use the `@/*` alias mapped to `./src/*` (see `tsconfig.json`).
- `src/styles/globals.css` is Tailwind 4 CSS-first. Plain CSS rules that are not
  theme tokens go **after** the `@theme` block, at the bottom of the file —
  `.scrollbar-hide` (line ~480), `.ig-prompt-shadow` (~490) and `.ig-bounce-soft`
  (~503) are the existing precedent.
- Formatting is **Biome**, not Prettier.

## Steps

1. Create `src/hooks/use-prefers-reduced-motion.ts` with the exact contents from
   Target section 1.

2. In `src/components/blocks/infogiph-home/animated-preview.tsx`:
   a. Add the `usePrefersReducedMotion` import alongside the existing imports.
   b. Confirm `useEffect` is already imported from `react` (line ~9 imports
      `useRef`); add it to that import list if absent.
   c. Insert the effect from Target section 2 immediately after the ref
      declarations at lines 1374–1377.
   d. Confirm `variant` is in scope at that point in the component — it is used
      at line 1419. If it is destructured later, move the effect below it.

3. In `src/components/blocks/infogiph-how-it-works/infogiph-how-it-works.tsx`,
   apply the six edits in the Target section 3 table. Do not touch the existing
   `reduce` gate at lines 32 and 43.

4. Append the `@media (prefers-reduced-motion: reduce)` block from Target
   section 4 to the end of `src/styles/globals.css`.

## Boundaries

- Do NOT pause animations when `variant === 'canvas'`. That path feeds the
  export frame-capture pipeline (`src/lib/export-frames.ts`, and
  `animated-preview.tsx:2722` reads `svgRef.current.getCurrentTime()`). Pausing
  it would silently produce frozen exported MP4s and GIFs. The `variant ===
  'canvas'` early-return in the effect is load-bearing — do not remove it as
  "dead code".
- Do NOT remove or reduce the `repeatCount="indefinite"` attributes. Pausing is
  reversible; editing the SMIL declarations is not, and the export pipeline
  depends on them.
- Do NOT add `useReducedMotion` from framer-motion to new files. The repo should
  have one hook; `infogiph-how-it-works.tsx` keeps its existing framer-motion
  import because it is already there and already works.
- Do NOT gate press feedback (plan `004`) behind reduced motion — a 0.97 press
  scale is feedback, not movement.
- Do NOT touch `src/components/canvas/` in this plan.
- Do NOT add new dependencies.
- If `animated-preview.tsx:1374-1377` does not declare `containerRef` and
  `svgRef` as described (drift since commit 8707150), STOP and report instead of
  improvising.

## Verification

- **Mechanical**:
  - `pnpm lint` — expect no new errors.
  - `pnpm build` — expect a clean build.
  - `grep -rn 'prefers-reduced-motion' src` now returns at least the new hook and
    the new CSS block.

- **Feel check**: run `pnpm dev` (port 3001) and confirm:
  - **Off-screen pause**: load `/`, open DevTools → Performance, and record 5
    seconds while sitting at the top of the page without scrolling. Compare
    against a recording taken before this change: scripting/rendering time
    should drop substantially, because ~15 of the 18 previews are now paused.
    A simpler eye-check: scroll to the bottom of the showcase, scroll back up,
    and confirm the top tiles are still animating (they should never be left
    frozen).
  - **Re-entry**: scroll a tile out of view and back in. Its orbit satellites
    must resume smoothly, not restart from the beginning.
  - **Reduced motion**: in DevTools → Rendering → "Emulate CSS
    prefers-reduced-motion", select `reduce`, then reload `/`. Confirm:
    - Every showcase diagram is a **complete static picture** — no half-drawn
      beams, no satellites stacked at the origin.
    - The "how it works" section still fades its content in (opacity survives)
      but nothing slides horizontally or vertically.
    - The feature demo no longer bounces.
    - Buttons still change colour on hover — reduced motion must not kill
      feedback entirely.
  - **Toggle mid-session**: with the page open, switch the emulation from
    `no-preference` to `reduce`. The previews should freeze without a reload —
    that proves the `matchMedia` change listener is wired.
  - **Export regression check (critical)**: open `/canvas`, generate or load any
    animated diagram, and export an MP4 or GIF. Play the exported file. It must
    be animated. A static export means the `variant === 'canvas'` guard was
    removed or is not matching — revert and re-check step 2d.

- **Done when**: below-the-fold homepage previews are paused (verifiable in a
  Performance recording), `prefers-reduced-motion: reduce` yields static but
  complete diagrams with opacity feedback intact, and a canvas export still
  produces an animated file.
