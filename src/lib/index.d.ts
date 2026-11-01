import type { Component, Snippet } from 'svelte';

export type SiteHeaderLink = {
  label: string;
  href: string;
  external?: boolean;
  title?: string;
  ariaLabel?: string;
  icon?: Component;
};

export type SiteFooterLink = SiteHeaderLink;

export type SiteHeaderProps = {
  brand: string;
  homeHref?: string;
  logoSrc?: string;
  logoAlt?: string;
  links?: SiteHeaderLink[];
  githubUrl?: string;
  darkMode: boolean;
  onToggleTheme: () => void;
};

export type SiteFooterProps = {
  brand: string;
  homeHref?: string;
  logoSrc?: string;
  links?: SiteFooterLink[];
};

export type StickyPillProps = {
  label: string;
  compactOnScroll?: boolean;
  children?: Snippet;
};

export declare const SiteHeader: Component<SiteHeaderProps>;
export declare const SiteFooter: Component<SiteFooterProps>;
export declare const StickyPill: Component<StickyPillProps>;

export * as Badge from './components/ui/badge/index.js';
export * as Tooltip from './components/ui/tooltip/index.js';
