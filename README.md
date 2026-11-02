# Iris

A preconfigured Svelte 5 UI foundation for independent projects. Iris bundles the shadcn-svelte component collection, Lucide and Simple Icons, SV Table filters, a reusable site shell, semantic theme tokens, and theme helpers.

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
@source '../node_modules/@weluvabid/iris/dist';
@import '@weluvabid/iris/theme.css';
```

The `@source` directive is important: Tailwind CSS 4 does not automatically scan dependencies in `node_modules`. It makes Iris's component utility classes available without requiring consumers to copy or reconfigure the components.

The stylesheet defines semantic colour and typography tokens, loads the bundled fonts, and includes the optional `iris-page-enter` entrance animation. The animation respects `prefers-reduced-motion`.

## Fonts

Atkinson Hyperlegible Regular and Bold are included as original, unmodified OpenType files. The theme stylesheet references them using relative URLs, so Vite and other CSS-aware bundlers can emit the font assets into the consuming application's build. If you serve the stylesheet directly without a bundler, keep the `fonts/` directory beside `theme.css`.

The font assets are distributed under the Atkinson Hyperlegible Font License. Its full notice is included at `src/styles/fonts/LICENSE.txt`; the font files are not relicensed under Iris's MIT license. Iris does not make requests to Google Fonts or any other external font host.

## Theme tokens

Iris exposes shadcn-compatible semantic tokens in light and dark modes. Add or remove `.dark` on the document root to switch palettes.

| Token          | Light     | Dark      |
| -------------- | --------- | --------- |
| `--background` | `#FAFAF8` | `#090906` |
| `--foreground` | `#20201E` | `#E8E7E3` |
| `--primary`    | `#242424` | `#E8E7E3` |
| `--border`     | `#E8E7E1` | `#27271F` |

## Components

```svelte
<script lang="ts">
  import { SiteHeader, SiteFooter } from '@weluvabid/iris/components';
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

## Icons

Iris exposes the complete icon collections from Lucide and Simple Icons through
separate entry points. Both entry points re-export the upstream Svelte
components and preserve their original component APIs.

Import only the icons your application uses:

```svelte
<script lang="ts">
  import { Search, Menu } from '@weluvabid/iris/lucide';
  import { SiGithub, SiSvelte } from '@weluvabid/iris/simple-icons';
</script>

<Search size={20} />
<Menu size={20} />
<SiGithub size={20} />
<SiSvelte size={20} />
```

The icon collections are deliberately not re-exported from the root
`@weluvabid/iris` entry point. Keeping them on dedicated subpaths prevents icon
exports from becoming part of the general component entry point and allows
consumer bundlers to tree-shake unused named exports.

- `@weluvabid/iris/lucide` — named exports from `@lucide/svelte`.
- `@weluvabid/iris/simple-icons` — named exports from
  `@icons-pack/svelte-simple-icons` (for example, `SiGithub` and `SiSvelte`).

Iris depends on these icon packages and exposes them as part of its public API;
consuming applications do not need to install them separately.

## Data-table filters

Iris includes the SV Table filter components and their Svelte 5 controller. Import them from a dedicated entry point:

```svelte
<script lang="ts">
  import { DataTableFilter, createFilters } from '@weluvabid/iris/data-table';
  import type { ColumnConfig, FilterStrategy } from '@weluvabid/iris/data-table';
</script>
```

The entry point also exports the individual filter pieces (`ActiveFilters`, `FilterActions`, `FilterOperator`, `FilterSelector`, `FilterSubject`, and `FilterValue`) and the column/filter helpers. The supporting hook utilities are available from `@weluvabid/iris/hooks`.

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

The demo uses its own `vite.demo.config.ts`; its Vite root is `demo/`. The library package is generated with the official `svelte-package` tool. Its packaging lifecycle does not depend on the demo's HTML entry point.

Validation and demo building are intentionally separate:

```sh
pnpm check:svelte # Run Svelte and TypeScript diagnostics.
pnpm build:demo   # Build the demo application into dist-demo/.
```

Svelte diagnostics are handled by the official `svelte-check` CLI. Library packaging is handled by `svelte-package`, which resolves SvelteKit `$lib` aliases into package-relative imports. The demo remains an independent Vite application and does not participate in library packaging.

Run all quality gates with:

```sh
pnpm check
```

The check runs ESLint, Prettier, Svelte/TypeScript diagnostics, unit tests, the library package build, the demo production build, and an isolated consumer install, type check, and production build. Git hooks enforce the fast quality gates and Conventional Commit subjects.

## Package contents

The npm package contains generated library files in `dist/`, theme styles and fonts in `src/styles/`, theme helpers and declarations, the README, and the MIT license. Demo files, repository scripts, tests, workflows, and configuration are excluded.

## License

MIT. The project code is MIT-licensed. The bundled Atkinson Hyperlegible font files retain their separate license in `src/styles/fonts/LICENSE.txt`.
