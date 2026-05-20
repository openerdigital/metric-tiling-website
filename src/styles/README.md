# Styling and Component Guidelines

This guide defines how code and components should be created or updated in this project.

## Core Rules

1. Keep behavior and logic unchanged unless explicitly requested.
2. Treat redesign requests as visual-only refactors by default.
3. Match provided Figma direction closely.
4. Reuse existing project patterns before adding new abstractions.
5. Keep diffs scoped tightly to the requested task.

## Typography Bindings

1. Prefer semantic HTML tags with typography classes over the `Text` primitive for headings.
2. Use `<h3 className="typography-h3">` instead of `<Text as="h3">`.
3. `Headings/h1` -> `<h1 className="typography-h1">`
4. `Headings/h2` -> `<h2 className="typography-h2">`
5. `Headings/h3` -> `<h3 className="typography-h3">`
6. `Headings/h4` -> `<h4 className="typography-h4">`
7. `Headings/h5` -> `<h5 className="typography-h5">`
8. `Headings/h6` -> `<h6 className="typography-h6">`
9. `Body/Large` -> `typography-bodyLarge`
10. `Body/Small` -> `typography-bodySmall`
11. `Body/Footnote` -> `typography-footnote`
12. Eyebrow text -> `<p className="typography-eyebrow">`
13. Base body text can use default body styling with no extra typography class required.
14. Source: `src/styles/typography.css`

## Spacing Bindings

1. Spacing scale uses 8px increments.
2. `spacing-1` = `8px` through `spacing-10` = `80px`.
3. For values larger than `80px` or non-multiples of 8, use arbitrary utilities when needed (example: `mt-124`).
4. Do not use half-spacing utilities like `size-2.5`.
5. Source: `src/styles/theme.css`

## Responsive Breakpoints

1. Build components mobile-first.
2. Bring desktop layout in early, usually at `md`.
3. Only delay to `lg` or above if content is visually squished at `md`.
4. Breakpoint tokens live in `src/styles/theme.css`.
5. Current breakpoints:
6. `sm`: `700px`
7. `md`: `1024px`
8. `lg`: `1280px`
9. `mc`: `1416px`
10. `bg`: `1536px`
11. `vbg`: `1920px`
12. `huge`: `2400px`

## Color System

1. Prefer semantic theme color utilities first.
2. If design references tokenized values, use token utilities.
3. Prefer utilities like `bg-primaryOne` and `text-utilitarianSix` when available.
4. Color token source: `src/styles/colors/tokens.css`
5. Client theme color definitions live in `src/styles/colors/colors.css`.
6. Shared CMS color definitions live in `src/styles/colors/cms.css`.
7. If no semantic/token color exists, use arbitrary values as fallback (example: `bg-[#ccc]`).

## Client Theme Rules

1. When adding a new client theme, update only the client-facing palette in `src/styles/colors/colors.css`.
2. Map components to theme semantics in `src/styles/colors/tokens.css`.
3. Do not change any `--color-cms-*` token for client work.
4. CMS colors are shared across clients and must stay visually consistent.
5. If a client theme diff touches `src/styles/colors/cms.css` or any `--color-cms-*` token, revert that change unless the request is explicitly about CMS styling.
6. Do not point CMS tokens at client brand tokens just to make the CMS match the site theme.

## Form and Interaction UI

1. Inputs and textareas should share consistent radius, border, padding, and focus-ring behavior.
2. Upload and drop zones should clearly communicate empty, uploading, preview, and error states.
3. Drag-and-drop UI should keep obvious handles and affordances without changing reorder logic.
4. Add and remove actions should remain clear and visually distinct.

## Shared UI Starter Template

Use this structure for reusable UI components:

```text
src/components/ui/ComponentName/
  ComponentName.tsx
  index.ts
```

`ComponentName.tsx`:

```tsx
import React from "react";

type ComponentNameProps = {
  className?: string;
};

const ComponentName = ({ className }: ComponentNameProps) => {
  return (
    <section className={className}>
      <p className="typography-eyebrow">Eyebrow</p>
      <h3 className="typography-h3 mt-2">Heading</h3>
      <p className="mt-2">Body copy.</p>
    </section>
  );
};

export default ComponentName;
```

`index.ts`:

```ts
export { default as ComponentName } from "./ComponentName";
```

Add to `src/components/ui/index.ts`:

```ts
export * from "./ComponentName";
```

## PR Quality Gate

Every component PR should include:

1. Formatting pass.
2. Lint pass.
3. Typecheck pass.
4. Build pass.
5. Export wiring verified.
6. Typography, spacing, color, and type rules verified.

## Commands For PR Gate

1. `yarn prettier`
2. `yarn test`

`yarn test` runs prettier check, eslint, typescript no-emit, and build.

## Stack Source Of Truth

Versions come from `package.json`. Current baseline:

1. `next`: `^15.5.7`
2. `react`: `19.1.0`
3. `typescript`: `5.1.3`
4. `tailwindcss`: `^4.1.11`

## Notes

1. This guide is human-facing.
2. A separate AI execution guide can be created later.
