# 001 — Restore the missing Tailwind animation utilities

- **Status**: TODO
- **Commit**: 8707150
- **Severity**: HIGH
- **Category**: 1. Purpose & frequency / 2. Easing & duration
- **Estimated scope**: 2 files (1 dependency add, 1 CSS import line). No component changes.

## Problem

Every shadcn/ui overlay component in this repo declares its motion with the
`animate-in` / `animate-out` / `fade-in-0` / `zoom-in-95` / `slide-in-from-*`
utility family. **None of those utilities exist in this project**, so every
dialog, dropdown, select, tooltip, alert-dialog, hover-card and sheet in the
app teleports in and out with zero motion.

Proof:

1. `src/styles/globals.css:1` is a bare Tailwind import with no plugin:

```css
/* src/styles/globals.css:1 — current */
@import "tailwindcss";
```

2. Neither `tailwindcss-animate` nor `tw-animate-css` appears in `package.json`,
   and neither exists in `node_modules/`.
3. `grep -rn '@utility|animate-in|fade-in-0|zoom-in-95|slide-in-from' src/styles/*.css`
   returns nothing — the utilities are not hand-defined either.
4. Tailwind v4 core (`node_modules/tailwindcss/theme.css:381-384`) defines only
   `--animate-spin`, `--animate-ping`, `--animate-pulse`, `--animate-bounce`.

So the following declarations are all inert today:

```tsx
/* src/components/ui/dialog.tsx:60 — current */
"bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
```

```tsx
/* src/components/ui/dropdown-menu.tsx:45 — current */
"bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 ... origin-(--radix-dropdown-menu-content-transform-origin) ...",
```

Every other file carrying dead animation classes:
`src/components/ui/alert-dialog.tsx:39,57`, `popover.tsx:33`,
`hover-card.tsx:35`, `sheet.tsx:39,61`, `drawer.tsx:40`, `tooltip.tsx:49`,
`navigation-menu.tsx:93,94,115,148`, `menubar.tsx:82,251`, `toast.tsx:28`,
`select.tsx:64`, `dropdown-menu.tsx:45,233`, `context-menu.tsx:88,105`,
`src/components/layout/navbar-mobile.tsx:153`.

These are live surfaces, not dead code — `dialog` is imported by 7 files,
`dropdown-menu` by 7, `select` by 5, `drawer` by 3, `tooltip` by 2,
`alert-dialog` by 2, `accordion` by 2, `sheet` by 1, `hover-card` by 1.
(`popover` and `context-menu` currently have no importers; fixing them is free
but changes nothing today.)

Why it matters: these components already bind
`origin-(--radix-*-content-transform-origin)` correctly, so the moment the
utilities resolve, every dropdown and select scales from its trigger exactly as
the audit playbook prescribes. The design intent is already in the code — only
the CSS that implements it is missing.

## Target

Install `tw-animate-css` (the Tailwind v4 successor to the v3-only
`tailwindcss-animate`; it provides the full `animate-in`/`animate-out`,
`fade-*`, `zoom-*`, `slide-in-from-*` family) and import it in the global
stylesheet.

```css
/* target — src/styles/globals.css:1-2 */
@import "tailwindcss";
@import "tw-animate-css";
```

No component markup changes. Do not hand-write the keyframes.

After this change the existing declarations resolve to their intended values,
which are already inside the audit's duration budgets:

| Component | Declared duration | Budget | Verdict |
| --- | --- | --- | --- |
| `dialog.tsx:60` | `duration-200` | Modals 200–500ms | in budget |
| `dropdown-menu.tsx:45` | inherits 150ms default | Dropdowns 150–250ms | in budget |
| `tooltip.tsx:49` | inherits 150ms default | Tooltips 125–200ms | in budget |
| `sheet.tsx:61` | `duration-300` close / `duration-500` open | Drawers 200–500ms | in budget |

The one easing defect this exposes is handled by plan `006` — do not fix it here.

## Repo conventions to follow

- This project is **Tailwind CSS 4** with CSS-first configuration: there is no
  `tailwind.config.js`. All theme configuration lives in the `@theme` block of
  `src/styles/globals.css` (see lines 76–87 for the existing `--animate-*`
  tokens). CSS-side plugins are added as `@import` lines at the top of that
  file, not as JS plugin entries.
- Exemplar of an already-correct import stack: `src/styles/mdx.css:1-6`, which
  chains `@import "tailwindcss";` with two further `@import` lines.
- Package manager is **pnpm** (`pnpm-lock.yaml` at repo root). Use `pnpm add`,
  never `npm install`.

## Steps

1. From the repo root, run:
   ```bash
   pnpm add -D tw-animate-css
   ```
   Confirm it lands in `devDependencies` in `package.json`.

2. Edit `src/styles/globals.css`. Change line 1 from:
   ```css
   @import "tailwindcss";
   ```
   to:
   ```css
   @import "tailwindcss";
   @import "tw-animate-css";
   ```
   Leave the existing `@custom-variant dark (&:is(.dark *));` on the following
   line untouched.

3. Do not change any file in `src/components/ui/`. Their animation classes are
   already correct and become live automatically.

## Boundaries

- Do NOT touch any file under `src/components/`. This plan is a dependency and
  one import line, nothing else.
- Do NOT modify the `@theme` block or any `@keyframes` in `src/styles/globals.css`.
  The dead `--animate-pulse` token on line 85 is a separate defect handled by
  plan `002` — leave it alone here.
- Do NOT change the declared durations or easings on any component. Plan `006`
  owns the `ease-in-out` defect on `sheet.tsx:61`.
- Do NOT add `tailwindcss-animate` — that package targets Tailwind v3 and its
  JS-plugin registration will not work in this CSS-first v4 setup.
- Do NOT add any other dependency.
- If `src/styles/globals.css:1` is not exactly `@import "tailwindcss";` when you
  open it (drift since commit 8707150), STOP and report instead of improvising.

## Verification

- **Mechanical**:
  - `pnpm lint` — expect no new errors.
  - `pnpm build` — expect a clean build. A missing-module error for
    `tw-animate-css` means step 1 did not complete.
  - Confirm the utilities now generate CSS: after `pnpm build`, the emitted
    stylesheet in `.next/static/css/` should contain `@keyframes enter` and
    `@keyframes exit`. `grep -rl 'keyframes enter' .next/static/css/` should
    return at least one file.

- **Feel check**: run `pnpm dev` (this project's dev server runs on port 3001)
  and confirm:
  - Open any dialog (e.g. the dashboard delete-confirmation, or any
    `AlertDialog`): it should fade in while scaling from 95% to 100%, not
    appear instantly.
  - Open a dropdown menu (dashboard user menu / canvas export menu): it should
    scale up **from the corner nearest its trigger**, not from its own center.
    This is the payoff — `origin-(--radix-dropdown-menu-content-transform-origin)`
    is already in the class string and only now takes effect.
  - Open a `Select`: same trigger-anchored scale.
  - In Chrome DevTools → Animations panel, set playback speed to 10% and open a
    dropdown. Confirm the transform origin sits at the trigger edge and the
    element never starts from `scale(0)` (it should start at 95%).
  - Toggle a dropdown open/closed rapidly. It should not visibly stutter.

- **Done when**: opening a dialog, a dropdown menu and a select each shows a
  visible fade + 95%→100% scale, and the dropdown/select scale originates at
  the trigger rather than the element center.
