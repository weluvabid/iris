# Iris

A shared UI foundation for my Svelte projects.

I got tired of configuring shadcn-svelte every time I started a project, then carrying the same refinements and conventions back into each one. The setup was repetitive, and improvements made in one project did not naturally make their way into the others.

Iris is where that shared work lives. It brings together the components, theme, utilities, icons, and small interaction details I use repeatedly, so each application can spend its time on its own product rather than rebuilding the same foundation.

## Install

```sh
pnpm add @weluvabid/iris
```

Iris is built for Svelte 5 and Tailwind CSS 4.

Import the theme stylesheet once in the application's CSS, after Tailwind:

```css
@import 'tailwindcss';
@import '@weluvabid/iris/theme.css';
```

The stylesheet registers Iris's packaged component sources with Tailwind. A separate `@source` directive is not required.

## What belongs in Iris

Iris owns reusable UI foundations and conventions:

- The shadcn-svelte component collection and shared utilities.
- Semantic light and dark theme tokens, plus theme helpers.
- A small site header and footer shell.
- Lucide and Simple Icons exports.
- Data-table filtering components and helpers.
- Optional motion and interaction primitives.
- Locally bundled Atkinson Hyperlegible fonts.

Application-specific navigation, content, business logic, page composition, and product identity stay in the consuming project. The boundary is intentional: shared foundations should reduce repetition without making independent projects look or behave like the same application.

## Components

Import the shared shell from the components entry point and compose its contents in the application:

```svelte
<script lang="ts">
  import { SiteHeader, SiteFooter } from '@weluvabid/iris/components';
  import { Menu, Search } from '@weluvabid/iris/lucide';
</script>

<div class="mx-auto w-full max-w-6xl px-4 sm:px-6">
  <SiteHeader>
    <a href="/" aria-label="My Project home">My Project</a>
    <nav aria-label="Primary navigation" class="flex items-center gap-3">
      <a href="/docs">Documentation</a>
      <a href="/api">API</a>
      <button aria-label="Search"><Search /></button>
      <button aria-label="Open menu"><Menu /></button>
    </nav>
  </SiteHeader>

  <main><!-- Application-owned content. --></main>

  <SiteFooter>
    <span>© My Project</span>
    <nav aria-label="Footer navigation">
      <a href="/privacy">Privacy</a>
      <a href="/terms">Terms</a>
    </nav>
  </SiteFooter>
</div>
```

`SiteHeader` supplies the sticky, translucent outer shell. `SiteFooter` supplies the footer shell and border. Both accept a required Svelte 5 `children` snippet; the application controls everything inside them, including navigation, actions, and responsive layout.

The underlying shadcn-svelte components are also available through their component paths. For example:

```svelte
<script lang="ts">
  import { Button } from '@weluvabid/iris/components/ui/button';
  import { Card, CardContent } from '@weluvabid/iris/components/ui/card';
</script>

<Card>
  <CardContent>
    <Button>Continue</Button>
  </CardContent>
</Card>
```

## Theme

Iris provides shadcn-compatible semantic tokens for light and dark themes. The default palettes are deliberately neutral; applications can extend or override the CSS variables to establish their own identity.

Add or remove `.dark` on the document root to switch palettes. The theme helpers are framework-independent:

```ts
import {
  applyTheme,
  createThemeScript,
  getInitialTheme,
  toggleTheme,
  toggleThemeValue,
} from '@weluvabid/iris/theme';

let theme = getInitialTheme();
applyTheme(theme);

// Apply and persist the opposite theme.
theme = toggleTheme(theme);

// Calculate the next value without touching the DOM or storage.
const nextTheme = toggleThemeValue(theme);

// Place this script in the document head before styles to avoid a theme flash.
const bootstrapScript = createThemeScript();
```

`getInitialTheme` prefers a valid stored preference, then the operating-system preference. `applyTheme` updates the root class and `color-scheme`, and can update the theme-colour meta tag. Storage failures do not prevent the visual theme from being applied. The default storage key is `iris-theme`; pass `{ storageKey: 'your-project-theme' }` to use a different key.

The theme stylesheet also loads the bundled Atkinson Hyperlegible Regular and Bold font files. They are served locally; Iris does not request fonts from Google or another external host. The font files retain their own license, included at `src/styles/fonts/LICENSE.txt`, and are not relicensed under Iris's MIT license.

## Motion

Motion is an optional entry point. It uses Svelte transitions, CSS/Tailwind utilities, and small browser APIs rather than adding a separate animation runtime. Import only the pieces a project needs:

```svelte
<script lang="ts">
  import { ActionButton, NumberTicker, ScrambleText, ThemeToggler } from '@weluvabid/iris/motion';

  let theme = $state<'light' | 'dark'>('light');

  async function copySomething() {
    await navigator.clipboard.writeText('Hello from Iris');
  }
</script>

<ActionButton idleLabel="Copy" successLabel="Copied" onaction={copySomething} />
<NumberTicker value={1284} />
<ScrambleText text="SYSTEM READY" />
<ThemeToggler {theme} onthemechange={(next) => (theme = next)} />
```

The entry point exports:

- `ActionButton` — async action with idle, loading, success, and error feedback.
- `ThemeToggler` — theme control integrated with the theme helpers.
- `NavIndicator` — navigation with an active-link indicator that tracks link position and size; `NavIndicatorItem` is its item type.
- `NumberTicker` and `ScrambleText` — optional text effects.
- `spotlight` — pointer-coordinate action for fine pointers.
- `fade`, `reveal`, and `swap` — Svelte transition helpers.
- `prefersReducedMotion`, `onMotionPreferenceChange`, and `hasFineHoverPointer` — capability utilities.

Motion is progressive enhancement, not a requirement for using the components. The primitives account for reduced-motion preferences, and hover-dependent effects are limited to devices with suitable pointer capabilities. Decorative text effects retain their original text for assistive technology.

## Icons, data tables, and hooks

The icon collections have dedicated entry points and preserve the upstream component APIs:

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

Importing from dedicated subpaths keeps icon exports out of the general component entry point. Consuming projects do not need to install the icon packages separately.

Data-table filters and their Svelte 5 controller are available from `@weluvabid/iris/data-table`. The entry point exports `DataTableFilter`, `createFilters`, the individual filter components, and the associated types and helpers. Shared hook utilities are available from `@weluvabid/iris/hooks`.

## Development

The `demo/` application is used to exercise the shared components in a real Svelte application, including scrolling, sticky positioning, responsive layout, and both themes. It is kept separate from the published library.

```sh
pnpm install
pnpm dev
```

The demo uses `vite.demo.config.ts` and has its own Vite root. The library is packaged independently with the official `svelte-package` tool; the demo's HTML entry point is not part of the library build.

Useful commands:

```sh
pnpm check:svelte # Svelte and TypeScript diagnostics
pnpm test         # Unit tests
pnpm build        # Package the library
pnpm build:demo   # Build the demo application
pnpm check        # Run the complete project checks
```

The full check includes linting, formatting, Svelte/TypeScript diagnostics, unit tests, library packaging, the demo build, and an isolated consumer install, type check, and production build. The consumer check helps catch problems that may not appear when importing the source from inside this repository.

## Package structure

- `src/lib/components/ui/` — shadcn-svelte components.
- `src/lib/components/data-table/` — filter components and supporting logic.
- `src/lib/motion/` — optional motion primitives and capability helpers.
- `src/lib/` — shared shell components, hooks, utilities, and public entry points.
- `src/styles/` — theme stylesheet and locally bundled fonts.
- `demo/` — consuming application used during development.
- `tests/consumer/` — isolated consumer project used to validate package usage.

## License

Iris project code is MIT-licensed. The bundled Atkinson Hyperlegible font files retain their separate license in `src/styles/fonts/LICENSE.txt`.
