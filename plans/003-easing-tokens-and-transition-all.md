# 003 — Add easing tokens and replace all 34 `transition-all` declarations

- **Status**: TODO
- **Commit**: 8707150
- **Severity**: HIGH
- **Category**: 5. Performance / 7. Cohesion & tokens
- **Estimated scope**: 1 CSS file + 21 component files, one class-string edit each.

## Problem

**Part 1 — there are no easing tokens.** `grep -rn "cubic-bezier" src` returns
**zero hits repo-wide**. Every curve in the product is a Tailwind built-in, and
AUDIT.md §2 is explicit that "built-in CSS easings are too weak for deliberate
motion". Of ~48 `duration-*` sites, about 44 carry no easing class at all and
fall back to Tailwind's default `ease`. The five distinct durations in use
(`duration-150` ×1, `duration-200` ×21, `duration-300` ×19, `duration-500` ×6,
`duration-1000` ×1) were all hand-typed with no shared scale.

**Part 2 — `transition: all` appears 34 times across 21 files.** AUDIT.md §5:
"**`transition: all`** animates unintended properties off-GPU — always a
finding." The worst consequences:

```tsx
/* src/components/ui/button.tsx:8 — current */
"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 ... focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] ...",
```
The `focus-visible:ring-[3px]` accessibility focus ring is a `box-shadow`, so
`transition-all` makes it **fade in over 150ms** instead of appearing instantly
when a keyboard user tabs to it.

```tsx
/* src/components/canvas/ai-chat-sidebar.tsx:1599 — current */
className="min-h-[80px] max-h-[200px] resize-none border border-gray-200 rounded-lg ... transition-all"
```
An autosizing textarea whose `height` is therefore tweened on every keystroke
that wraps a line.

```tsx
/* src/components/layout/navbar.tsx:62-68 — current */
'sticky inset-x-0 top-0 z-100 py-4 transition-all duration-300',
scroll
  ? scrolled
    ? 'bg-background/80 backdrop-blur-md border-b supports-backdrop-filter:bg-background/60'
    : 'bg-transparent'
  : 'border-b bg-background'
```
Crossing the 50px scroll threshold animates `backdrop-filter: blur(0) → blur(12px)`
over 300ms on a full-width sticky element — the most expensive property to tween,
re-sampling everything behind it every frame — **and** animates
`border-bottom-width: 0 → 1px`, which relayouts the document.

```tsx
/* src/components/blocks/infogiph-testimonials/infogiph-testimonials.tsx:172-176 — current */
'h-2 rounded-full transition-all ' +
(i === currentIndex
  ? 'w-6 bg-gray-800'
  : 'w-2 bg-gray-300 hover:bg-gray-400')
```
The active pagination pill grows via `width`, reflowing every flex sibling in
the dot row on each testimonial change.

## Target

**Part 1 — add three strong easing tokens** to the `@theme` block. In Tailwind 4
these override the weak core curves, so every existing `ease-out` / `ease-in-out`
class in the repo upgrades automatically:

```css
/* target — src/styles/globals.css, inside @theme, immediately above the `/* animate */` comment at line 76 */
  /* easing — strong curves for deliberate motion */
  --ease-out: cubic-bezier(0.23, 1, 0.32, 1);
  --ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);
  --ease-drawer: cubic-bezier(0.32, 0.72, 0, 1);
```

Duration scale to apply (from AUDIT.md §2 — copy these, do not invent others):

| Element | Duration class |
| --- | --- |
| Button press feedback | `duration-150` |
| Tooltips, small popovers | `duration-200` |
| Dropdowns, selects | `duration-200` |
| Modals, drawers | `duration-300` |
| Marketing / explanatory | `duration-300` (may stay longer) |

**Part 2 — replace every `transition-all`** with an explicit property list. Apply
this table exactly. Where a `duration-*` class already exists on the element,
replace it with the duration shown; where none exists, add it. Add `ease-out`
to every one of these (they are all enter/exit or hover/color changes).

| # | File:line | Replace `transition-all` (+ its duration) with |
| --- | --- | --- |
| 1 | `src/components/ui/button.tsx:8` | `transition-[color,background-color,border-color,transform] duration-150 ease-out` |
| 2 | `src/components/ui/switch.tsx:16` | `transition-[background-color,border-color] duration-150 ease-out` |
| 3 | `src/components/ui/progress.tsx:24` | `transition-transform duration-200 ease-out` |
| 4 | `src/components/ui/accordion.tsx:38` | `transition-[color,background-color] duration-150 ease-out` |
| 5 | `src/components/ui/input-otp.tsx:54` | `transition-[color,background-color,border-color] duration-150 ease-out` |
| 6 | `src/components/ui/sidebar.tsx:294` | `transition-[background-color] duration-150 ease-out` |
| 7 | `src/components/layout/mode-switcher.tsx:34` | `transition-[transform,opacity] duration-200 ease-out` |
| 8 | `src/components/layout/mode-switcher.tsx:35` | `transition-[transform,opacity] duration-200 ease-out` |
| 9 | `src/components/canvas/excalidraw-wrapper.tsx:641` | `transition-[box-shadow,border-color,background-color] duration-150 ease-out` |
| 10 | `src/components/canvas/excalidraw-wrapper.tsx:820` | `transition-[box-shadow,border-color,background-color] duration-150 ease-out` |
| 11 | `src/components/canvas/save-button.tsx:101` | `transition-[background-color,color] duration-150 ease-out` |
| 12 | `src/components/canvas/resizable-divider.tsx:94` | `transition-[background-color] duration-150 ease-out` |
| 13 | `src/components/canvas/resizable-divider.tsx:118` | `transition-[background-color,opacity] duration-150 ease-out` |
| 14 | `src/components/canvas/flowviz-architect.tsx:2225` | `transition-[border-color,box-shadow] duration-150 ease-out` |
| 15 | `src/components/canvas/flowviz-architect.tsx:2269` | `transition-[border-color,box-shadow] duration-150 ease-out` |
| 16 | `src/components/canvas/text-to-visual-panel.tsx:542` | `transition-[border-color,box-shadow] duration-150 ease-out` |
| 17 | `src/components/canvas/text-to-visual-panel.tsx:604` | `transition-[border-color,box-shadow] duration-150 ease-out` |
| 18 | `src/components/canvas/ai-chat-sidebar.tsx:1599` | `transition-[border-color,box-shadow] duration-150 ease-out` |
| 19 | `src/components/dashboard/flowchart-card.tsx:97` | `transition-[box-shadow] duration-150 ease-out` |
| 20 | `src/components/templates/template-search.tsx:68` | `transition-[background-color,color,border-color] duration-150 ease-out` |
| 21 | `src/components/templates/template-search.tsx:81` | `transition-[background-color,color,border-color] duration-150 ease-out` |
| 22 | `src/components/blocks/infogiph-home/templates.tsx:42` | `transition-[background-color,color] duration-150 ease-out` |
| 23 | `src/components/blocks/infogiph-home/trust-bar.tsx:19` | `transition-[opacity,filter] duration-300 ease-out` |
| 24 | `src/components/blocks/infogiph-home/template-showcase-card.tsx:27` | `transition-[transform,box-shadow,border-color] duration-300 ease-out` |
| 25 | `src/components/blocks/infogiph-testimonials/infogiph-testimonials.tsx:71` | `transition-[transform,box-shadow] duration-300 ease-out` |
| 26 | `src/components/blocks/infogiph-testimonials/infogiph-testimonials.tsx:81` | `transition-[transform,box-shadow] duration-300 ease-out` |
| 27 | `src/components/blocks/infogiph-testimonials/infogiph-testimonials.tsx:114` | `transition-[transform,color] duration-200 ease-out` |
| 28 | `src/components/blocks/infogiph-testimonials/infogiph-testimonials.tsx:123` | `transition-[transform,color] duration-200 ease-out` |
| 29 | `src/app/[locale]/(marketing)/blog/[...slug]/page.tsx:155` | `transition-[border-color] duration-300 ease-out` |

Two sites need a small markup change rather than a class swap:

**Navbar (`src/components/layout/navbar.tsx:62-70`)** — stop tweening
`backdrop-filter` and `border-width`. Keep the border present at all times and
animate its colour instead:

```tsx
/* target */
className={cn(
  'sticky inset-x-0 top-0 z-100 py-4 border-b transition-[background-color,border-color] duration-200 ease-out',
  scroll
    ? scrolled
      ? 'bg-background/80 backdrop-blur-md border-border supports-backdrop-filter:bg-background/60'
      : 'bg-transparent border-transparent'
    : 'border-border bg-background'
)}
```
The blur now snaps on instead of tweening, which is correct — a blur that ramps
is both expensive and reads as a lag.

**Testimonial pagination dots (`infogiph-testimonials.tsx:170-178`)** — animate
`transform` instead of `width`. Give every dot the active width and scale the
inactive ones down, so no sibling ever reflows:

```tsx
/* target */
'h-2 w-6 origin-center rounded-full transition-[transform,background-color] duration-200 ease-out ' +
(i === currentIndex
  ? 'scale-x-100 bg-gray-800'
  : 'scale-x-[0.333] bg-gray-300 hover:bg-gray-400')
```

## Repo conventions to follow

- Tailwind CSS 4, CSS-first config, no `tailwind.config.js`. All theme tokens
  live in the `@theme` block of `src/styles/globals.css` (lines ~30–190).
- **Exemplar of the target pattern already in the repo**:
  `src/components/ui/switch.tsx:24` uses `transition-transform` on the switch
  thumb — an explicit single property, exactly right. The Root on line 16 is the
  one that needs fixing.
  Also `src/components/ui/sidebar.tsx:221` (`transition-[width]`), `:232`
  (`transition-[left,right,width]`) and `:408` (`transition-[margin,opacity]`)
  already use the bracket syntax — match that style.
- Class strings are single-line template/`cva` strings; keep them single-line.
  This project formats with **Biome**, not Prettier.

## Steps

1. Open `src/styles/globals.css`. Inside the `@theme` block, immediately above
   the `/* animate */` comment on line 76, insert the three easing tokens from
   the Target section.

2. Work through rows 1–29 of the table above in order. For each row: open the
   file, locate `transition-all` on the given line, and replace it — along with
   any adjacent `duration-*` and `ease-*` classes on that same element — with
   the replacement string. Do not reorder the surrounding classes.

3. Apply the two markup changes: `navbar.tsx` and the testimonial pagination
   dots, exactly as written in the Target section.

4. Verify nothing was missed:
   ```bash
   grep -rn 'transition-all' src --include='*.tsx' --include='*.css'
   ```
   Expected result: **no output**.

## Boundaries

- Do NOT touch `src/components/ui/toast.tsx:28`. That component is dead code —
  `src/components/ui/toaster.tsx` is never mounted; the app uses sonner's
  `<Toaster/>` at `src/app/[locale]/layout.tsx:74`. Leave it alone.
- Do NOT touch `src/components/canvas/excalidraw-wrapper.tsx:595` or
  `src/components/canvas/flowviz-architect.tsx:2458`. Those two `transition-all`
  sites animate layout properties and are owned by plan `006`. They are the only
  two the `grep` in step 4 is allowed to still return — if you did plan `006`
  first, expect zero.
- Do NOT add `active:` / press-feedback classes. Plan `004` owns those. Row 1
  already includes `transform` in the button's transition list specifically so
  plan `004` only has to add the `active:scale-[0.97]` class.
- Do NOT change any `@keyframes` block or `--animate-*` token.
- Do NOT change component structure beyond the two explicitly specified markup
  changes.
- Do NOT add new dependencies.
- If a line number in the table does not contain `transition-all` when you open
  it (drift since commit 8707150), search the file for `transition-all` and use
  the match whose surrounding classes fit the row. If there is no unambiguous
  match, STOP and report that row instead of guessing.

## Verification

- **Mechanical**:
  - `grep -rn 'transition-all' src --include='*.tsx' --include='*.css'` returns
    nothing (or only the two plan-`006` lines, if `006` has not run yet).
  - `pnpm lint` — expect no new errors.
  - `pnpm build` — expect a clean build.
  - `grep -n 'ease-out\|ease-in-out\|ease-drawer' src/styles/globals.css` shows
    the three new tokens with their cubic-beziers.

- **Feel check**: run `pnpm dev` (port 3001) and confirm:
  - **Tab to any button with the keyboard.** The focus ring must appear
    **instantly**, with no fade. This is the single clearest proof the change
    landed — before it, the ring faded in over 150ms.
  - Hover a dashboard flowchart card: the shadow lift should feel noticeably
    snappier (150ms, strong ease-out) than the previous 300ms linear-ish ramp.
  - Scroll the homepage past 50px: the navbar background tint fades in but the
    blur snaps, and the page content below must **not shift by 1px** as the
    border appears.
  - Click through the testimonial pagination dots: the active pill widens and
    the neighbouring dots must **not shift horizontally**.
  - Type into the canvas AI chat textarea until it wraps to a new line: the box
    should grow **instantly**, not tween its height.
  - In DevTools → Animations panel at 10% playback, open the theme
    mode-switcher: only `transform` and `opacity` should be listed as animating.
  - In DevTools → Performance, record a hover over the dashboard card grid.
    There should be no "Layout" entries attributable to the hover.

- **Done when**: `grep -rn 'transition-all' src` is empty (modulo plan `006`'s
  two lines), the keyboard focus ring appears instantly, and scrolling the
  homepage past the navbar threshold causes no content shift.
