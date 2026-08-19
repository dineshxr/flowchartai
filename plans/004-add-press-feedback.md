# 004 — Add press feedback to every pressable surface

- **Status**: TODO
- **Commit**: 8707150
- **Severity**: HIGH
- **Category**: 3. Physicality & origin
- **Estimated scope**: 5 files, one class-string edit each.

## Problem

**There is not a single `:active` state in this entire codebase.** Verified:

```bash
grep -rn 'active:scale\|:active' src --include='*.tsx' --include='*.css'
# → no output
```

The one apparent exception is a cursor change, not an element response:

```tsx
/* src/components/blocks/infogiph-home/animated-preview.tsx:2838 — current */
(editable ? 'cursor-grab active:cursor-grabbing ' : '') +
```

AUDIT.md §3: "**Press feedback**: `transform: scale(0.97)` on `:active` with
`transition: transform 160ms ease-out`. Keep it subtle (0.95–0.98)."

Every button in the product is dead under the finger — canvas toolbar, save,
export, dashboard actions, marketing CTAs. The shared primitive defines only
`hover:` and `focus-visible:` states:

```tsx
/* src/components/ui/button.tsx:8 — current (base) */
"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 ...",
```

```tsx
/* src/components/ui/button.tsx:12-14 — current (variants, abridged) */
default: "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
destructive: "bg-destructive text-white shadow-xs hover:bg-destructive/90 ...",
outline: "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground ...",
```

Several high-traffic canvas surfaces bypass the `Button` primitive entirely with
raw `<button>` elements, so fixing `button.tsx` alone does not reach them:

```tsx
/* src/components/canvas/element-inspector.tsx:36 — current */
className="group flex h-12 items-center justify-center rounded-lg border border-border bg-white transition-colors hover:border-foreground/40 hover:bg-[#fafafa]"
```
This is the icon-picker grid — hundreds of swatches, the most rapid-fire click
surface in the editor, with nothing at all happening under the pointer.

Same pattern at `src/components/canvas/flowviz-architect.tsx:2225` and `:2269`
(template picker cards) and `src/components/canvas/text-to-visual-panel.tsx:542`
and `:604` (AI suggestion cards and category rows).

Note this is *not* a §4 asymmetric-timing finding — there are zero
press-and-release animations to be asymmetric about. The category is vacuously
clean rather than actually correct.

## Target

Add a subtle scale on `:active` to the shared button primitive and to the raw
canvas buttons. Values are from AUDIT.md §3 — 0.97 scale, 160ms, ease-out.

**Shared primitive** — `src/components/ui/button.tsx:8`, base string. Add
`active:scale-[0.97]` and ensure the transition covers `transform`:

```tsx
/* target — src/components/ui/button.tsx:8 */
"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[color,background-color,border-color,transform] duration-150 ease-out active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
```

`duration-150` sits inside the audit's 100–160ms press-feedback budget, and
`ease-out` resolves to the strong `cubic-bezier(0.23, 1, 0.32, 1)` token added
by plan `003`.

**Raw canvas buttons** — append `active:scale-[0.97]` and widen the transition to
include `transform`, at each of these five sites:

| File:line | Current transition class | Target |
| --- | --- | --- |
| `src/components/canvas/element-inspector.tsx:36` | `transition-colors` | `transition-[color,background-color,border-color,transform] duration-150 ease-out active:scale-[0.97]` |
| `src/components/canvas/flowviz-architect.tsx:2225` | `transition-all` (→ plan 003) | append ` active:scale-[0.97]` to plan 003's replacement, and add `transform` to its property list |
| `src/components/canvas/flowviz-architect.tsx:2269` | `transition-all` (→ plan 003) | same |
| `src/components/canvas/text-to-visual-panel.tsx:542` | `transition-all` (→ plan 003) | same |
| `src/components/canvas/text-to-visual-panel.tsx:604` | `transition-all` (→ plan 003) | same |

Concretely, for the four sites that plan `003` converts, the final class fragment
on each element must read:

```
transition-[border-color,box-shadow,transform] duration-150 ease-out active:scale-[0.97]
```

**Drag handles get a lift, not a press.** At
`src/components/blocks/infogiph-home/animated-preview.tsx:2838`, a node tile
being grabbed should grow slightly rather than shrink — a press pushes *in*, a
grab picks *up*:

```tsx
/* target — src/components/blocks/infogiph-home/animated-preview.tsx:2838 */
(editable
  ? 'cursor-grab active:cursor-grabbing transition-transform duration-150 ease-out active:scale-[1.03] '
  : '') +
```

## Repo conventions to follow

- Tailwind utility classes in single-line strings; `cva` for variant-bearing
  components (`src/components/ui/button.tsx:7-40`). Keep strings single-line.
- Arbitrary values use bracket syntax, already used widely in this repo — e.g.
  `focus-visible:ring-[3px]` (`button.tsx:8`), `hover:bg-[#fafafa]`
  (`element-inspector.tsx:36`). Write `active:scale-[0.97]`, not `active:scale-97`.
- **Exemplar to imitate**: `src/components/ui/switch.tsx:24` — an explicit
  single-property `transition-transform` on the element that actually moves.
- Formatting is **Biome**, not Prettier.

## Steps

1. Edit `src/components/ui/button.tsx:8`. Replace the base `cva` string with the
   target string from the Target section. Leave lines 12–22 (the variants) and
   lines 24–30 (the sizes) untouched.

2. Edit `src/components/canvas/element-inspector.tsx:36`. Replace
   `transition-colors` with
   `transition-[color,background-color,border-color,transform] duration-150 ease-out active:scale-[0.97]`.
   Leave the `group`, layout and `hover:` classes in place and in order.

3. For `src/components/canvas/flowviz-architect.tsx:2225` and `:2269`, and
   `src/components/canvas/text-to-visual-panel.tsx:542` and `:604` — set the
   transition fragment on each element to exactly:
   ```
   transition-[border-color,box-shadow,transform] duration-150 ease-out active:scale-[0.97]
   ```
   (If plan `003` has already run, you are widening its property list by
   `transform` and appending the `active:` class. If it has not, you are
   replacing `transition-all` outright — either way the end state is identical.)

4. Edit `src/components/blocks/infogiph-home/animated-preview.tsx:2838` to the
   drag-handle target above.

5. Confirm coverage:
   ```bash
   grep -rn 'active:scale' src --include='*.tsx'
   ```
   Expected: 6 hits — button.tsx, element-inspector.tsx, flowviz-architect.tsx ×2,
   text-to-visual-panel.tsx ×2 — plus the `active:scale-[1.03]` in
   animated-preview.tsx.

## Boundaries

- Do NOT add press feedback to non-pressable elements: cards that are not
  clickable, list containers, headings, or the marketing tiles in
  `src/components/blocks/infogiph-use-cases/`.
- Do NOT add press feedback to `src/components/dashboard/flowchart-card.tsx`.
  It is a large surface where a whole-card scale reads as a glitch; its hover
  shadow is sufficient.
- Do NOT change any `hover:` or `focus-visible:` class. In particular do not
  remove `focus-visible:ring-[3px]` — it is the keyboard accessibility ring.
- Do NOT change the `Button` variants or sizes.
- Do NOT introduce a `scale` below 0.95 or above 0.98 for a press. AUDIT.md §3:
  "Keep it subtle (0.95–0.98)."
- Do NOT add `prefers-reduced-motion` handling here — plan `005` owns it, and a
  0.97 press scale is feedback rather than movement, so it should survive
  reduced motion anyway.
- Do NOT add new dependencies.
- If `src/components/ui/button.tsx:8` does not begin with
  `"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md"`
  when you open it (drift since commit 8707150), STOP and report instead of
  improvising.

## Verification

- **Mechanical**:
  - `grep -rn 'active:scale' src --include='*.tsx'` returns the 6 expected hits.
  - `pnpm lint` — expect no new errors.
  - `pnpm build` — expect a clean build.

- **Feel check**: run `pnpm dev` (port 3001) and confirm:
  - Press and **hold** the mouse on any primary button (dashboard "New
    flowchart", canvas "Save"). It must visibly shrink slightly and stay
    shrunk while held, then spring back on release.
  - The shrink must be subtle — if it reads as a "click animation" it is too
    large. Compare against the button's own border radius: the edge should move
    by roughly 1–2px on a standard `h-9` button.
  - Open the canvas element inspector's icon picker and click rapidly across
    several swatches. Each should acknowledge the press individually; none
    should feel dead.
  - Tab to a button with the keyboard and press Enter. The focus ring must still
    appear instantly (plan `003`), and the scale should fire on activation.
  - In DevTools → Animations panel at 10% playback, press a button and confirm
    only `transform` animates — no layout, no `box-shadow`.
  - On the homepage template showcase, grab a draggable node tile: it should
    lift slightly (1.03) rather than shrink, and the cursor should change to
    grabbing.
  - Toggle `prefers-reduced-motion: reduce` in DevTools → Rendering. The press
    scale may remain — it is feedback, not movement, and AUDIT.md §6 says
    reduced motion means "fewer and gentler animations, **not zero**".

- **Done when**: every `<Button>` in the app responds to press-and-hold with a
  visible ~3% shrink, the canvas icon-picker swatches respond individually, and
  no `hover:`/`focus-visible:` behaviour regressed.
