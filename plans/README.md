# Animation improvement plans

Produced by the `improve-animations` skill against commit `8707150`
(branch `feat/seo-paa-mrr-funnel`), audited at `standard` effort across all
eight categories of the skill's `AUDIT.md`.

Every plan is self-contained: exact file paths, current-code excerpts, exact
target values, and a feel-check. They can be handed to any agent — including a
cheaper model — without further context.

## Plans

| # | Title | Severity | Category | Scope | Status |
| --- | --- | --- | --- | --- | --- |
| [001](001-restore-missing-animation-utilities.md) | Restore the missing Tailwind animation utilities | HIGH | Purpose / Easing | 2 files | TODO |
| [002](002-fix-dead-animate-pulse-token.md) | Fix the dead `animate-pulse` token that freezes every skeleton | HIGH | Easing / Performance | 1 file | TODO |
| [003](003-easing-tokens-and-transition-all.md) | Add easing tokens and replace all 34 `transition-all` declarations | HIGH | Performance / Cohesion | 22 files | TODO |
| [004](004-add-press-feedback.md) | Add press feedback to every pressable surface | HIGH | Physicality | 5 files | TODO |
| [005](005-reduced-motion-and-offscreen-pause.md) | Honour reduced motion, and stop animating 18 off-screen previews | HIGH | Accessibility / Performance | 3 files | TODO |
| [006](006-canvas-chrome-easing-and-layout.md) | Stop animating layout in the canvas chrome, and fix its easing | HIGH | Purpose / Easing / Performance | 4 files | TODO |

## Recommended execution order

Run in numeric order. The ordering is not arbitrary — see dependencies below.

```
001 ──► 002 ──► 003 ──► 004
                  │
                  ├──► 005
                  └──► 006
```

**001 and 002 first.** Both are two-line changes that unfreeze motion which is
already correctly authored but currently dead. They give the largest visible
change for the least risk, and 001 makes the Radix surfaces observable so later
feel-checks are meaningful.

**003 before 004, 005 and 006.** It introduces the `--ease-out` /
`--ease-in-out` / `--ease-drawer` tokens that the other three reference. Running
them first means their `ease-out` classes silently resolve to Tailwind's weaker
built-in curve, and the result will feel wrong without any obvious cause.

**004, 005 and 006 are independent of each other** and can run in parallel or
any order once 003 has landed.

## Dependencies and shared edit sites

| Plan | Depends on | Why |
| --- | --- | --- |
| 003 | — | but see 001: sheets/dialogs are inert until 001 lands, so 003's feel-checks on those surfaces need 001 first |
| 004 | 003 | needs the `--ease-out` token; 003 pre-adds `transform` to `button.tsx`'s transition list specifically so 004 only appends the `active:` class |
| 005 | 003 | its global reduced-motion block is the safety net for the transitions 003 normalises |
| 006 | 003 | needs the `--ease-out` token |

**Overlapping files** — if you run plans out of order or in parallel, these are
the collision points:

- `src/components/ui/button.tsx:8` — touched by **003** (row 1) and **004**
  (step 1). 004's target string is the final state and supersedes 003's.
- `src/components/canvas/flowviz-architect.tsx:2225`, `:2269` and
  `src/components/canvas/text-to-visual-panel.tsx:542`, `:604` — touched by
  **003** (rows 14–17) and **004** (step 3). 004's target string is final.
- `src/components/canvas/excalidraw-wrapper.tsx:595` and
  `flowviz-architect.tsx:2458` — **006** owns these two `transition-all` sites;
  003 explicitly excludes them.
- `src/styles/globals.css` — **002** edits the `@theme` block, **003** adds
  easing tokens to it, **005** appends a media query at end of file. Three
  non-overlapping regions, but do not run them concurrently against the same
  working tree.

## What this audit deliberately did not report

Verified as correct or by-design, so they are not findings:

- **Radix trigger-anchored origins.** `dropdown-menu.tsx:45,233`, `popover.tsx:33`,
  `tooltip.tsx:49`, `select.tsx:64`, `hover-card.tsx:35`, `context-menu.tsx:88,105`,
  `menubar.tsx:82,251` all correctly bind
  `origin-(--radix-*-content-transform-origin)`. They are compliant — they just
  need plan 001 to make it visible.
- **Modal `transform-origin: center`** in `dialog.tsx`, `alert-dialog.tsx`,
  `sheet.tsx` — explicitly exempt per AUDIT.md §3.
- **`excalidraw-wrapper.tsx:595`'s `isResizing ? ''` conditional** — correctly
  strips the transition mid-drag so the divider tracks the pointer 1:1. Plan 006
  preserves it.
- **`toast.tsx:28`** — dead code. `src/components/ui/toaster.tsx` is never
  mounted; the app uses sonner's `<Toaster/>` at `src/app/[locale]/layout.tsx:74`.
- **`.ig-bounce-soft`** on the marketing feature demo — a playful bounce on a
  playful surface is correct placement. Plan 005 only adds a reduced-motion gate.
- **`--animate-shiny-text`, `-rainbow`, `-marquee`, `-meteor`, `-gradient`,
  `-orbit`** — declared in `@theme` with zero consumers. No runtime cost; not
  worth churn.
- **`src/lib/export-frames.ts`'s frame-capture timing** — deliberate off-screen
  SMIL capture, not a naive rAF performance bug.

## Deferred backlog (audited and confirmed, no plan written)

Real findings that lost on leverage. Promote them once 001–006 land.

| Severity | Location | Finding |
| --- | --- | --- |
| HIGH | `flowviz-architect.tsx:2757` | `<AnimatePresence>` keyed on `` `${JSON.stringify(data)}-${mode}` `` remounts the whole `<g>` on every Dots/Beams/Pulses/Arrows toggle, replaying ~1.5s of staggered build-in. §4: reversible UI must use transitions or springs, not remounts. |
| HIGH | `flowviz-architect.tsx:2626`, `:2787`, `:2834`, `:2863`; `gallery-diagram.tsx:222`, `:350` | Framer Motion writes a CSS custom property every frame to drive `offset-distance` — style recalc + non-composited motion-path re-resolve, `repeat: Infinity`, ~15 concurrent below the homepage fold. §5: predetermined motion belongs in CSS/SMIL. |
| MEDIUM | `flowviz-architect.tsx:2649`, `:2882`, `:2915`; `gallery-diagram.tsx:235`, `:358`, `:378`; `template-preview.tsx:245`; `mode-switcher.tsx:34-35` | `scale: 0` / `scale-0` entrances. §3: "Never `scale(0)`" — target `scale(0.9–0.97)` + `opacity: 0`. |
| MEDIUM | 7 distinct hand-typed spring configs across 9 sites | `damping` 12/14/16/18/20/36, `stiffness` 240/260/300/420, no shared constant. §7 consolidation — target Apple-style `{ type: "spring", duration: 0.5, bounce: 0.2 }`. |
| MEDIUM | `gallery-diagram.tsx` vs `flowviz-architect.tsx` | The diagram renderer is forked between marketing and `/canvas` with seven near-identical transition pairs, two of which have drifted for no stated reason. §7. |
| MEDIUM | `animated-preview.tsx:1399-1420` | Drag release has no velocity carry — a flicked tile stops dead. §4: gesture motion should use springs; dismiss on `Math.abs(distance)/elapsedMs > ~0.11`. |
| MEDIUM | `resizable-divider.tsx:45` | Hard clamp at 300/500px. §4: rising friction, not a hard stop. |
| MEDIUM | `accordion.tsx:58` + `globals.css:110-127` | Expand/collapse driven by `@keyframes`, so closing mid-open snaps to full height first. §4: keyframes restart from zero. Live on the marketing FAQ. |
| MEDIUM | `hero.tsx:173`, `:236` | Two hand-rolled (non-Radix) dropdowns on the homepage prompt bar with no `transform-origin` at their trigger. §3. |
| MEDIUM | `element-inspector.tsx:78`; `infogiph-how-it-works.tsx` ×8 | Framer Motion `x`/`y`/`scale` shorthands are not hardware-accelerated. §5: use the full transform string. |
| MEDIUM | `template-search.tsx:101`, `templates.tsx:57`, `flowcharts-dashboard.tsx:272`, `text-to-visual-panel.tsx:532` | Four list/grid surfaces render everything at once. §7: a 30–80ms stagger belongs here. Note 6 of the repo's 10 existing staggers use 100ms, outside the band. |
| LOW | 18 sites incl. `infogiph-use-cases.tsx:17,32,55,68,84,99,122,135` | `:hover` motion with no `@media (hover: hover) and (pointer: fine)` gate — sticks after a tap on touch. §6. |
| LOW | `input-otp.tsx:62` | `animate-caret-blink` has no token and no keyframe anywhere; the OTP caret never blinks. Plan 001 does not fix this one — it needs its own keyframe. |
| LOW | `infogiph-testimonials.tsx:130`, `blog-card.tsx:38` | Dead `transition-opacity duration-300` declarations on elements whose opacity never changes. |
| LOW | `package.json:101,108` | Both `framer-motion` and `motion` (its successor) are dependencies; `motion` has zero imports. Dependency hygiene — unimported, so no bundle cost today. |

## Missed opportunities (additive, not corrective)

Places that do not animate but should. Each is grounded in a specific UX seam.

1. **`flowviz-architect.tsx:2507-2511` — the product's core "aha" moment.**
   `ProcessingOverlay` is a bare conditional mount, so after a 5–15s generation
   the blur veil and Lottie vanish in a single frame and the finished diagram is
   simply *there*. Suggested: fade the veil out while wiping the diagram in with
   `clip-path: inset(0 100% 0 0)` → `inset(0 0 0 0)` — percentage-based, so it
   scales with any `EXPORT_PRESETS` aspect ratio. **MEDIUM.**
2. **`text-to-visual-panel.tsx:517` — AI suggestions teleport in.** The header,
   Refresh control and a 4–6 card grid all materialise at once and shove the
   Categories list below them down by the block's full height. On Refresh, the
   user cannot tell which cards changed. Suggested: enter with `translateY(-8%)`
   + opacity, children staggered at 60ms (matching the repo's existing 60ms step
   rather than adding an eighth value). **MEDIUM.**
3. **`template-search.tsx:100-105` — the gallery swaps up to 98 cards in one
   frame.** `key={t.slug}` means every outgoing card unmounts and every incoming
   one mounts instantly on a filter click or keystroke. This is the one place in
   the repo where §7's blur mask genuinely applies: a short `filter: blur(2px)` +
   opacity dip on the grid container across the swap. **MEDIUM.**
4. **`flowviz-architect.tsx:2146-2151` — the canvas sidebar has no spatial
   connection to its trigger.** A plain `&&` conditional, so 280–340px appears
   and disappears instantly. The `transition-[width]` on `:2150` is misleading —
   it only covers the 280↔340 tab switch, never open/close. Suggested:
   `translateX(-100%)` (its own width, so it survives the 280/340 variance with
   no hardcoded pixel figure). **MEDIUM.** *Note: plan 006 touches nearby lines
   in this file — coordinate.*
5. **`flowviz-architect.tsx:2418-2422` — a long export ends by blinking out.**
   `use-export.ts:549-568` sets progress to 100, downloads, toasts, then flips
   `isExporting` false — so the card is deleted mid-frame and the 100% state is
   never seen. Because the bar itself animates, the card's instant disappearance
   reads as a glitch. Suggested: hold at 100% with the spinner swapped for a
   check for ~400ms, then exit on `translateY(100%)` + opacity. **LOW.**

## Re-running

`improve-animations reconcile` re-checks these plans against the current code:
marks completed plans DONE, refreshes stale `file:line` references, and retires
findings that have since been fixed.
