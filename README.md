# Iris

A small visual foundation and reusable site shell for independent OSS projects. Iris provides theme tokens, accessible Svelte 5 shell components, and framework-independent theme helpers without pulling in an icon library, CSS framework, or component toolkit.

## Requirements

- Node.js 26 or newer
- pnpm 12 or newer
- Svelte 5 for the optional component entry point

## Install

```sh
pnpm add @weluvabid/iris
```

Import the CSS once in your application stylesheet:

```css
@import '@weluvabid/iris';
```

The root package export remains CSS-only and has no JavaScript runtime dependency.

## Theme tokens

Iris owns a deliberately small set of design tokens:

| Token           | Light             | Dark              |
| --------------- | ----------------- | ----------------- |
| `--background`  | `#FDFBF7`         | `#000000`         |
| `--foreground`  | `#171717`         | `#F5F5F5`         |
| `--iris-accent` | coral             | coral             |
| `--font-sans`   | Geist/system      | Geist/system      |
| `--font-mono`   | Geist Mono/system | Geist Mono/system |

Add `.dark` to the document root to enable dark mode. Iris intentionally does not redefine shadcn's `--accent` / `--accent-foreground` semantic surface tokens or its neutral palette. The coral brand accent is exposed as `--iris-accent`.

## Site shell components

The Svelte 5 components are available through the optional subpath. Svelte is an optional peer dependency, so CSS-only consumers do not install it:

```svelte
<script lang="ts">
  import { SiteHeader, SiteFooter, StickyPill } from '@weluvabid/iris/components';
  import { getInitialTheme, toggleTheme } from '@weluvabid/iris/theme';

  let theme = $state(getInitialTheme());

  function toggleThemeMode() {
    theme = toggleTheme(theme);
  }
</script>

<div class="iris-container">
  <SiteHeader
    brand="My Project"
    homeHref="/"
    logoSrc="/logo.svg"
    githubUrl="https://github.com/owner/repository"
    navLinks={[
      { label: 'Documentation', href: '/docs' },
      { label: 'API', href: '/api' },
    ]}
    {theme}
    onToggleTheme={toggleThemeMode}
  />

  <StickyPill label="OPEN SOURCE PROJECT" />

  <main>
    <!-- Project-owned content goes here. -->
  </main>

  <SiteFooter
    brand="My Project"
    logoSrc="/logo.svg"
    links={[
      { label: 'GitHub', href: 'https://github.com/owner/repository', external: true },
      { label: 'Issues', href: 'https://github.com/owner/repository/issues', external: true },
    ]}
  />
</div>
```

### SiteHeader props

- `brand` (required): project name shown beside the optional logo.
- `homeHref`, `logoSrc`, `logoAlt`: brand destination and optional logo.
- `navLinks`: `{ label, href, external?, current? }[]`.
- `githubUrl`: optional GitHub destination with an accessible icon link.
- `theme`: current `light` or `dark` value.
- `onToggleTheme`: optional callback; when omitted, no theme control is rendered.
- `actions`: optional Svelte snippet for consumer-owned actions.
- `class`: additional class on the header root.

### SiteFooter props

- `brand`, `homeHref`, `logoSrc`: optional brand identity.
- `links`: `{ label, href, external? }[]`; labels remain visible and accessible.
- `copyright`: optional text when no brand is supplied.
- `class`: additional class on the footer root.

### StickyPill props

- `label`: text to display; omit it to render the default slot.
- `showIndicator`: show the restrained coral status dot (default `true`).
- `compactOnScroll`: observe the sentinel and expose `data-pinned="true"` after it scrolls past the observer threshold.
- `class`: additional class on the pill root.

The pill wrapper itself is `fit-content`, horizontally centred, and constrained to the viewport. It does not create a full-width sticky interception layer.

Iris components use their own small CSS class surface (`iris-header`, `iris-footer`, `iris-sticky-pill`). They do not require Tailwind, shadcn-svelte, Lucide, or an icon package. Consumers can override the classes or pass their own `class` value.

## Theme helpers

The framework-independent helpers are available separately:

```ts
import { applyTheme, createThemeScript, getInitialTheme, toggleTheme } from '@weluvabid/iris/theme';

const theme = getInitialTheme();
applyTheme(theme);

// In an event handler:
toggleTheme(theme);

// Use this in an inline script in <head> to avoid a theme flash before hydration:
const bootstrap = createThemeScript();
```

`getInitialTheme` prefers a valid stored preference and otherwise uses `prefers-color-scheme`. `applyTheme` updates the root class, `color-scheme`, background and optional theme-color meta tag; storage failures do not prevent the visual change. The default storage key is `iris-theme`. Pass `{ storageKey: 'your-project-theme' }` to use a project-specific key.

For a no-flash bootstrap, render the returned script string in the document head before styles and application code. The helper validates the storage key before generating executable source.

## Layout utilities

The CSS entry point includes a few opt-in classes:

- `.iris-container`: centred responsive container using `--iris-content-width` and `--iris-shell-gutter`.
- `.iris-header`: floating translucent sticky header.
- `.iris-footer`: restrained footer layout.
- `.iris-sticky-pill`: content-width sticky pill.

No global line-height, letter-spacing, element reset, or shadcn semantic palette is imposed.

## Development

Run the visual shell preview locally (no Vite or demo dependencies required):

```sh
pnpm dev
```

Open `http://localhost:4173` to inspect the header, centred sticky pill, empty content area, footer, responsive layout, and light/dark theme toggle. The preview is a standalone HTML fixture that mirrors the public component markup; it is excluded from the published npm package.

Run the package quality gates with:

```sh
pnpm install
pnpm check
```

`pnpm check` runs ESLint, Prettier validation, TypeScript declaration checks, tests, Svelte compilation and npm package-content verification. Git hooks are installed automatically on local install and enforce the fast quality gates plus Conventional Commit subjects.

## Release

The package is intentionally a single-package repository. CI runs on Node 26 with a frozen pnpm lockfile. Publishing is a deliberate maintainer action after reviewing the packed artifact:

```sh
pnpm pack
npm publish --access public
```

## License

MIT
