# @weluvabid/iris

A minimal CSS theme layer for projects using shadcn-style CSS variables.

## Install

```sh
pnpm add @weluvabid/iris
```

```css
@import "@weluvabid/iris";
```

## Theme selection

Light mode is the default. Add the `dark` class to the root element to enable dark mode:

```html
<html class="dark">
```

Iris overrides these CSS variables only:

- `--background`
- `--foreground`
- `--accent`
- `--accent-foreground`
- `--font-sans`
- `--font-mono`

The light background is warm ivory (`#FDFBF7`), the dark background is pure black (`#000000`), and the accent is coral (`oklch(0.74 0.16 34.71)`).
