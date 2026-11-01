# Iris

A reusable Svelte 5 site shell for independent open-source projects. Iris provides a responsive header, footer, sticky status pill, semantic theme tokens, and small theme helpers.

## Requirements

- Node.js 26 or newer
- pnpm 12 or newer
- Svelte 5 in applications using the component entry point
- Tailwind CSS 4 in applications that consume the utility-class components

## Install

```sh
pnpm add @weluvabid/iris
```

Import the theme stylesheet once in your application CSS:

```css
@import 'tailwindcss';
@import '@weluvabid/iris/theme.css';
```

The stylesheet defines semantic colour and typography tokens plus the small amount of CSS that Tailwind cannot express cleanly: the masked perimeter gradient, its external glow, and small animation keyframes. The header surface itself remains theme-controlled. The optional `iris-page-enter` class adds a staggered entrance to its three direct children and respects `prefers-reduced-motion`.

## Fonts

Atkinson Hyperlegible Regular and Bold are included as original, unmodified OpenType files. The theme stylesheet references them using relative URLs, so Vite and other CSS-aware bundlers can emit the font assets into the consuming application's build. If you serve the stylesheet directly without a bundler, keep the `fonts/` directory beside `theme.css`.

The font assets are distributed under the Atkinson Hyperlegible Font License. Its full notice is included at `src/styles/fonts/LICENSE.txt`; the font files are not relicensed under Iris's MIT license. Iris does not make requests to Google Fonts or any other external font host.

## Theme tokens

Iris exposes shadcn-compatible semantic tokens in light and dark modes. Add or remove `.dark` on the document root to switch palettes.

| Token          | Light     | Dark      |
| -------------- | --------- | --------- |
| `--background` | `#FAFAF8` | `#090906` |
| `--foreground` | `#20201E` | `#E8E7E3` |
| `--primary`    | `#D96C16` | `#FC8B24` |
| `--border`     | `#E8E7E1` | `#27271F` |

## Components

```svelte
<script lang="ts">
  import { SiteHeader, SiteFooter, StickyPill } from '@weluvabid/iris/components';
  import type { SiteFooterLink, SiteHeaderLink } from '@weluvabid/iris/components';

  let darkMode = $state(false);

  const headerLinks: SiteHeaderLink[] = [
    { label: 'Documentation', href: '/docs' },
    { label: 'API', href: '/api' },
  ];

  const footerLinks: SiteFooterLink[] = [
    { label: 'GitHub', href: 'https://github.com/owner/repository', external: true },
    { label: 'Issues', href: 'https://github.com/owner/repository/issues', external: true },
  ];
</script>

<div class="mx-auto w-full max-w-6xl px-4 sm:px-6">
  <SiteHeader
    brand="My Project"
    homeHref="/"
    githubUrl="https://github.com/owner/repository"
    links={headerLinks}
    {darkMode}
    onToggleTheme={() => (darkMode = !darkMode)}
  />

  <StickyPill label="OPEN SOURCE PROJECT" />

  <main><!-- Project-owned content. --></main>

  <SiteFooter brand="My Project" links={footerLinks} />
</div>
```

### `SiteHeader`

- `brand` (required): accessible brand link text.
- `homeHref`, `logoSrc`, `logoAlt`: brand destination and optional logo.
- `links`: `{ label, href, external?, title?, ariaLabel?, icon? }[]`.
- `githubUrl`: optional GitHub icon link.
- `darkMode`: current theme state.
- `onToggleTheme`: theme toggle callback.

### `SiteFooter`

- `brand` (required): accessible brand link text.
- `homeHref`, `logoSrc`: optional brand destination and logo.
- `links`: `{ label, href, external?, title?, ariaLabel?, icon? }[]`.

### `StickyPill`

- `label` (required): text displayed in the pill.
- `compactOnScroll` (default `true`): observe a one-pixel sentinel and compact the pill after it crosses the header threshold.
- `children`: optional Svelte snippet to replace the label content.

Icon-only links use accessible names and shared tooltips. Keyboard focus is visible; hover surfaces remain neutral. The perimeter gradient is limited to the header outline, while the wordmark remains monochrome.

## Theme helpers

Import framework-independent helpers from the dedicated subpath:

```ts
import {
  applyTheme,
  createThemeScript,
  getInitialTheme,
  toggleTheme,
  toggleThemeValue,
} from '@weluvabid/iris/theme';

const theme = getInitialTheme();
applyTheme(theme);

// In an event handler, this applies and persists the opposite theme.
theme = toggleTheme(theme);

// Pure state transition for Svelte state or other application state.
const nextTheme = toggleThemeValue(theme);

// Add this returned script to the document head before styles to avoid a theme flash.
const bootstrapScript = createThemeScript();
```

`getInitialTheme` prefers a valid stored preference, then `prefers-color-scheme`. `applyTheme` updates the root class, `color-scheme`, and optional theme-colour meta tag. Storage failures never prevent the visual theme update. The default storage key is `iris-theme`; pass `{ storageKey: 'your-project-theme' }` to use another key.

## Demo and development

The `demo/` directory contains the long-form page used to exercise scrolling, sticky positioning, responsive layout, and both themes. It is not included in the published package.

```sh
pnpm install
pnpm dev
```

Open the local Vite URL to inspect the demo.

Run all quality gates with:

```sh
pnpm check
```

The check runs ESLint, Prettier, Svelte/TypeScript diagnostics, unit tests, a demo build, and package-content validation. Git hooks enforce the fast quality gates and Conventional Commit subjects.

## Package contents

The npm package contains only `src/lib`, `src/styles`, theme helpers and declarations, the README, and the MIT license. Demo files, repository scripts, tests, workflows, and configuration are excluded.

## Release

Publishing is a deliberate maintainer action after reviewing the packed artifact:

```sh
pnpm pack
npm publish --access public
```

## License

MIT. The project code is MIT-licensed. The bundled Atkinson Hyperlegible font files retain their separate license in `src/styles/fonts/LICENSE.txt`.
