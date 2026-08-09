# 002 — Fix the dead `animate-pulse` token that freezes every skeleton

- **Status**: TODO
- **Commit**: 8707150
- **Severity**: HIGH
- **Category**: 2. Easing & duration / 5. Performance
- **Estimated scope**: 1 file, ~6 lines.

## Problem

`src/styles/globals.css:85` overrides Tailwind's built-in `animate-pulse` with a
custom token whose duration variable is never defined at the call site:

```css
/* src/styles/globals.css:85 — current */
  --animate-pulse: pulse var(--duration) ease-out infinite;
```

Two things go wrong.

**1. The animation never runs.** `--duration` is set in exactly one place in the
entire repo — `src/components/ui/orbiting-circles.tsx:52` — and that component
has zero importers, so it never renders. Everywhere else `var(--duration)` has
no value and no fallback, which makes the `animation` shorthand invalid at
computed-value time. The whole declaration is dropped. Note the neighbouring
`--animate-ripple` on line 83 does this correctly with `var(--duration, 2s)`;
line 85 has no fallback.

**2. It shadows Tailwind core.** `node_modules/tailwindcss/theme.css:383` ships
`--animate-pulse: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite`, and the local
`@keyframes pulse` at `src/styles/globals.css:156-164` replaces core's opacity
pulse with a `box-shadow` ring:

```css
/* src/styles/globals.css:156-164 — current */
  @keyframes pulse {
    0%, 100% { box-shadow: 0 0 0 0 var(--pulse-color); }
    50% { box-shadow: 0 0 0 8px var(--pulse-color); }
  }
```

So every consumer of `animate-pulse` is a **static grey rectangle** with no
loading indication at all:

- `src/components/ui/skeleton.tsx:7` — the shared skeleton primitive
- `src/components/settings/profile/plan-credits-card.tsx:59`
- `src/components/shared/ai-usage-indicator.tsx:94`
- `src/components/blocks/infogiph-how-it-works/infogiph-how-it-works.tsx:63` — the typewriter caret on the homepage
- `src/components/layout/navbar.tsx` and the dashboard loading states, via `Skeleton`

There is a latent hazard on top of the dead animation: `--duration` **inherits**.
If any ancestor ever sets it, every descendant skeleton silently switches to an
infinite `box-shadow` loop — a paint-only property that cannot be composited,
with no reduced-motion gate.

Per AUDIT.md §1, a loading skeleton's purpose is *state indication*; that is
exactly the case where an animation is justified, and here it does not play.

## Target

Stop shadowing the core token. Rename the custom box-shadow pulse to its own
token so nothing collides, and give it a duration fallback so it is valid
standalone.

```css
/* target — src/styles/globals.css, inside the @theme block */
/* DELETE line 85 entirely:
     --animate-pulse: pulse var(--duration) ease-out infinite;
   and REPLACE with: */
  --animate-pulse-ring: pulse-ring var(--duration, 2s) ease-out infinite;
```

```css
/* target — src/styles/globals.css, replacing the @keyframes pulse block at 156-164 */
  @keyframes pulse-ring {
    0%,
    100% {
      box-shadow: 0 0 0 0 var(--pulse-color);
    }
    50% {
      box-shadow: 0 0 0 8px var(--pulse-color);
    }
  }
```

With the override gone, `animate-pulse` falls back to Tailwind core's
`pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite` (an opacity ramp), and all five
consumers listed above start pulsing correctly with no component edits.

Infinite duration is correct here and is **not** a violation of the "UI
animations stay under 300ms" budget — that budget governs discrete state
transitions, not continuous loading indicators.

## Repo conventions to follow

- Tailwind CSS 4, CSS-first config. Animation tokens are declared as
  `--animate-<name>: <keyframe-name> <duration> <easing> <iteration>;` inside
  the `@theme` block of `src/styles/globals.css` (lines 76–87), with the
  matching `@keyframes` immediately below inside the same block (lines 89–190).
- **Exemplar to imitate**: `src/styles/globals.css:83` —
  `--animate-ripple: ripple var(--duration, 2s) ease calc(var(--i, 0) * .2s) infinite;`
  This is the same pattern done right: a `var()` with a sensible fallback so the
  shorthand stays valid when no ancestor sets the variable.
- Token names are kebab-case and describe the effect, not the consumer.

## Steps

1. In `src/styles/globals.css`, delete line 85:
   ```css
     --animate-pulse: pulse var(--duration) ease-out infinite;
   ```
   and in its place write:
   ```css
     --animate-pulse-ring: pulse-ring var(--duration, 2s) ease-out infinite;
   ```

2. In the same file, find the `@keyframes pulse { … }` block (lines 156–164) and
   rename it to `@keyframes pulse-ring`. Leave its two keyframe steps byte-for-byte
   unchanged — only the name on the `@keyframes` line changes.

3. Search the repo for consumers of the renamed utility:
   ```bash
   grep -rn 'animate-pulse' src --include='*.tsx'
   ```
   Every hit should be a **loading skeleton or caret** that wants the core
   opacity pulse — leave all of them exactly as they are. If (and only if) you
   find a hit that is clearly meant to be the box-shadow ring effect (it will be
   paired with a `--pulse-color` style), change that one class to
   `animate-pulse-ring`. At commit 8707150 there are no such hits, so the
   expected outcome of this step is **no file changes**.

4. Make no other edits.

## Boundaries

- Do NOT touch any file under `src/components/`. Expected diff is
  `src/styles/globals.css` only.
- Do NOT delete or modify `src/components/ui/orbiting-circles.tsx`, even though
  it is currently unimported. Removing dead components is out of scope.
- Do NOT change any other `--animate-*` token or `@keyframes` block. Several of
  them (`shiny-text`, `rainbow`, `marquee`, `meteor`, `gradient`, `orbit`) have
  no consumers today; leaving them is correct and they cost nothing at runtime.
- Do NOT add a `prefers-reduced-motion` gate here — plan `005` owns reduced
  motion across the whole codebase and will cover the skeletons.
- Do NOT add new dependencies.
- If `src/styles/globals.css:85` is not exactly
  `  --animate-pulse: pulse var(--duration) ease-out infinite;` when you open it
  (drift since commit 8707150), STOP and report instead of improvising.

## Verification

- **Mechanical**:
  - `pnpm lint` — expect no new errors.
  - `pnpm build` — expect a clean build.
  - `grep -n 'animate-pulse:' src/styles/globals.css` should return **nothing**
    (the shadowing token is gone).
  - `grep -n 'keyframes pulse' src/styles/globals.css` should return exactly one
    line, and it should read `@keyframes pulse-ring {`.

- **Feel check**: run `pnpm dev` (port 3001) and confirm:
  - Load `/dashboard` on a throttled connection (DevTools → Network → Slow 4G).
    The skeleton placeholders must now **breathe** — a slow opacity ramp between
    roughly 100% and 50% over 2 seconds. Before this change they were completely
    static.
  - On the homepage, the typewriter caret in the "how it works" section
    (`infogiph-how-it-works.tsx:63`) should now blink rather than sit solid.
  - In DevTools → Animations panel, trigger a dashboard load and confirm exactly
    one animation named `pulse` is running per skeleton, with a 2s duration —
    and that it animates `opacity`, not `box-shadow`.
  - Confirm no element anywhere shows an expanding ring shadow (that would mean
    the rename did not take and the box-shadow keyframe is still bound to
    `animate-pulse`).

- **Done when**: dashboard and settings skeletons visibly pulse on opacity at a
  2-second cadence, and `grep -n 'animate-pulse:' src/styles/globals.css` is empty.
