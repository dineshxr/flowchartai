# 006 — Stop animating layout in the canvas chrome, and fix its easing

- **Status**: TODO
- **Commit**: 8707150
- **Severity**: HIGH
- **Category**: 1. Purpose & frequency / 2. Easing & duration / 5. Performance
- **Estimated scope**: 4 files, small targeted edits.

## Problem

The `/canvas` editor is the product's core surface — every element here is in the
audit's 100+/day frequency bucket, where AUDIT.md §1 says animation must be
removed or drastically reduced. Instead it carries the repo's worst combination:
`ease-in-out` on enter/exit transitions, and layout properties being tweened
while Excalidraw and up to 46 SMIL loops render alongside.

**1. The canvas container tweens `width` with the wrong curve.**

```tsx
/* src/components/canvas/excalidraw-wrapper.tsx:593-599 — current */
      <div
        className={`relative h-full ${
          isResizing ? '' : 'transition-all duration-300 ease-in-out'
        }`}
        style={{
          width: isSidebarOpen ? `calc(100% - ${sidebarWidth}px)` : '100%',
        }}
      >
```

Three faults at once: `transition-all` (§5, "always a finding"), animating
`width` (§5, "`width`/`height`/… trigger layout + paint + composite" — with the
Excalidraw canvas re-measuring for all 300ms), and `ease-in-out` on a pure
enter/exit (§2, "Entering or exiting → **`ease-out`**"). The sibling
`AIChatSidebar` already does this correctly with `transition-transform` +
`translate-x-full`.

**The `isResizing ? ''` conditional is correct and must be preserved** — it
strips the transition during a drag so the panel tracks the pointer 1:1.

**2. The AI chat sidebar slides with `ease-in-out`.**

```tsx
/* src/components/canvas/ai-chat-sidebar.tsx:1375-1377 — current */
      className={`fixed top-0 right-0 h-full bg-white shadow-lg transition-transform duration-300 ease-in-out z-40 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
```

The property is right; the curve is wrong. §2: "Entering or exiting →
**`ease-out`** (starts fast, feels responsive)". `ease-in-out` starts slow at
the exact moment the user is watching.

**3. The editor frame tweens `aspect-ratio` and `max-width`.**

```tsx
/* src/components/canvas/flowviz-architect.tsx:2457-2461 — current */
            <div
              className="relative rounded-xl border border-border bg-white shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden transition-all duration-300"
              style={{
                backgroundImage: ...
```

Switching export preset changes `aspectRatio`, `maxWidth` and `maxHeight`
(`:2464-2469`). `transition-all` tweens all three, forcing a full relayout of the
`<AnimatedPreview>` at `:2485` — and its SMIL timeline re-resolves against the
new viewBox — 60 times over 300ms.

**4. The export progress bar animates `width` during the export.**

```tsx
/* src/components/canvas/flowviz-architect.tsx:2439-2441 — current */
                      className="h-full rounded-full bg-foreground transition-[width] duration-200"
                      style={{ width: `${exportProgress}%` }}
```

This relayouts on every progress tick at precisely the moment the main thread is
saturated by the frame-capture pipeline (`src/lib/export-frames.ts:341`
`drawFrameAt` → `cloneNode` + `XMLSerializer` + rasterization per frame). The
frame capture itself is deliberate and correct; the layout-animating progress
indicator on top of it is not.

**5. The app-wide sidebar animates on a keyboard shortcut.**

```tsx
/* src/components/ui/sidebar.tsx:221 — current */
          "relative w-(--sidebar-width) bg-transparent transition-[width] duration-200 ease-linear",
```

`src/components/ui/sidebar.tsx:96-110` registers a global `keydown` handler
firing `toggleSidebar()` on Cmd/Ctrl+B, and the sidebar is mounted app-wide via
`src/app/[locale]/(protected)/layout.tsx:17-28`. This is the exact canonical case
from AUDIT.md §1: "100+ times/day (keyboard shortcuts, command palette toggle) →
**No animation. Ever.**" — "The strongest fix is often **delete the animation**."
It compounds with §2, which reserves `linear` for constant motion like marquees.

## Target

**1. `src/components/canvas/excalidraw-wrapper.tsx:593-599`** — keep the
`isResizing` conditional, narrow the property, fix the curve, shorten to 200ms:

```tsx
/* target */
      <div
        className={`relative h-full ${
          isResizing ? '' : 'transition-[width] duration-200 ease-out'
        }`}
        style={{
          width: isSidebarOpen ? `calc(100% - ${sidebarWidth}px)` : '100%',
        }}
      >
```

`width` is retained deliberately: this element is a flex/absolute sibling of the
Excalidraw canvas, which must re-measure to its final size anyway, so a
transform would leave the canvas mismatched to its box. Narrowing `all` → `width`
removes the unintended properties, and 200ms with a strong `ease-out` keeps the
layout cost inside the budget. This is the one place in the plan where an
animated layout property is the correct trade-off.

**2. `src/components/canvas/ai-chat-sidebar.tsx:1375`** — curve only:

```tsx
/* target */
      className={`fixed top-0 right-0 h-full bg-white shadow-lg transition-transform duration-300 ease-out z-40 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
```

**3. `src/components/canvas/flowviz-architect.tsx:2458`** — stop tweening the
frame's geometry; let the preset change land in one frame:

```tsx
/* target */
              className="relative rounded-xl border border-border bg-white shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden transition-[box-shadow,border-color] duration-150 ease-out"
```

**4. `src/components/canvas/flowviz-architect.tsx:2439-2441`** — drive the
progress bar with `transform: scaleX()` instead of `width`:

```tsx
/* target */
                      className="h-full w-full origin-left rounded-full bg-foreground transition-transform duration-200 ease-out"
                      style={{ transform: `scaleX(${exportProgress / 100})` }}
```

`origin-left` is required — without it the bar grows from its centre.

**5. `src/components/ui/sidebar.tsx`** — delete the animation on the three
keyboard-driven declarations. Replace the transition classes with nothing:

| Line | Current | Target |
| --- | --- | --- |
| 221 | `transition-[width] duration-200 ease-linear` | *(remove all three classes)* |
| 232 | `transition-[left,right,width] duration-200 ease-linear` | *(remove all three classes)* |
| 408 | `transition-[margin,opacity] duration-200 ease-linear` | *(remove all three classes)* |

Also `src/components/dashboard/dashboard-header.tsx:33` — same chain, same fix:
remove `transition-[width,height] ease-linear`.

Keep every other class on those elements exactly as-is, including the
`w-(--sidebar-width)` and the `group-data-[collapsible=icon]` variants. The
sidebar still changes size; it just does so instantly, which is what a
100+/day keyboard toggle should do.

## Repo conventions to follow

- Class strings are template literals or plain strings; keep them single-line.
- The bracket transition syntax is already used in this repo:
  `src/components/ui/sidebar.tsx:221` (`transition-[width]`), `:232`, `:408`,
  `src/components/canvas/flowviz-architect.tsx:2150` and `:2440`. Match it.
- **Exemplar for the correct enter/exit pattern**:
  `src/components/canvas/ai-chat-sidebar.tsx:1375-1377` already uses
  `transition-transform` + `translate-x-full` rather than animating a layout
  property. Only its curve is wrong.
- `ease-out` resolves to the strong `cubic-bezier(0.23, 1, 0.32, 1)` token added
  by plan `003`. Run `003` first or the curve will be Tailwind's weaker built-in.
- Formatting is **Biome**, not Prettier.

## Steps

1. Edit `src/components/canvas/excalidraw-wrapper.tsx:595` per Target 1. Preserve
   the `isResizing ? '' :` conditional exactly.
2. Edit `src/components/canvas/ai-chat-sidebar.tsx:1375` per Target 2 — change
   `ease-in-out` to `ease-out`, nothing else.
3. Edit `src/components/canvas/flowviz-architect.tsx:2458` per Target 3.
4. Edit `src/components/canvas/flowviz-architect.tsx:2439-2441` per Target 4 —
   both the className and the inline `style`.
5. Edit `src/components/ui/sidebar.tsx` lines 221, 232 and 408, and
   `src/components/dashboard/dashboard-header.tsx:33`, per Target 5.
6. Confirm:
   ```bash
   grep -rn 'ease-in-out\|ease-linear' src --include='*.tsx'
   ```
   Expected remaining hits: only `src/components/ui/sheet.tsx:61` (a modal
   surface — see Boundaries) and `src/components/ui/sidebar.tsx:294` if plan
   `003` has not yet run.

## Boundaries

- Do NOT remove the `isResizing ? '' :` conditional in
  `excalidraw-wrapper.tsx:595`. It is correct — it disables the transition
  during a drag so the divider tracks the pointer exactly. Removing it makes the
  resize feel like it is lagging behind the mouse.
- Do NOT convert `excalidraw-wrapper.tsx`'s `width` to a transform. The
  Excalidraw canvas must re-measure to its real box; a transform would leave the
  drawing surface scaled and mis-hit-tested. Narrowing `all` → `width` is the
  whole fix here.
- Do NOT change `src/components/ui/sheet.tsx:61` in this plan. Its `ease-in-out`
  is also wrong, but sheets are an "Occasional" surface per §1 and that file is
  inert until plan `001` installs the animation utilities. Fix it in a follow-up
  once `001` has landed and the behaviour is observable.
- Do NOT touch `src/lib/export-frames.ts` or any part of the frame-capture
  pipeline. Only the progress **indicator** changes, never the capture.
- Do NOT remove `w-(--sidebar-width)` or any `group-data-[…]` variant while
  deleting the sidebar transition classes.
- Do NOT add `prefers-reduced-motion` handling here — plan `005` owns it.
- Do NOT add new dependencies.
- If any cited line does not match the "current" code above (drift since commit
  8707150), STOP and report that site instead of improvising.

## Verification

- **Mechanical**:
  - `pnpm lint` — expect no new errors.
  - `pnpm build` — expect a clean build.
  - `grep -n 'ease-in-out' src/components/canvas/*.tsx` returns nothing.
  - `grep -n 'ease-linear' src/components/ui/sidebar.tsx src/components/dashboard/dashboard-header.tsx`
    returns nothing.

- **Feel check**: run `pnpm dev` (port 3001) and confirm:
  - **Canvas sidebar toggle**: open `/canvas` and toggle the AI chat sidebar.
    The panel should now start moving immediately rather than easing in slowly.
    Open DevTools → Performance and record the toggle: the layout work should be
    confined to the 200ms window and the frame rate should hold.
  - **Drag the resize divider**: it must still track the pointer with zero lag.
    If it feels rubbery, the `isResizing` conditional was broken — revert step 1.
  - **Export preset switch**: change the export aspect-ratio preset. The frame
    should resize in a single frame with no visible reflow shimmer in the
    preview inside it.
  - **Export progress bar**: run a real MP4 export. The bar must fill smoothly
    left-to-right (not from the centre — if it grows from the middle,
    `origin-left` is missing). In DevTools → Performance, confirm the progress
    ticks no longer produce "Layout" entries.
  - **Cmd/Ctrl+B**: on any `/dashboard` route, hit the shortcut repeatedly. The
    sidebar should snap open and closed instantly with no width tween, and the
    header should not visibly settle afterwards. Spamming it must never leave
    the layout mid-animation.
  - In DevTools → Animations panel at 10% playback, toggle the canvas sidebar
    and confirm the curve now starts fast and decelerates (strong ease-out)
    rather than easing in at both ends.

- **Done when**: Cmd+B produces an instant sidebar with no tween, the canvas
  sidebar slide starts fast, the export progress bar animates on `transform`
  with no Layout entries, and the resize divider still tracks the pointer 1:1.
