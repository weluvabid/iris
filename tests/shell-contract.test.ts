import { describe, expect, it } from 'vitest';
import { readFile } from 'node:fs/promises';

const source = (path: string) => readFile(new URL(path, import.meta.url), 'utf8');

describe('Pulse shell fidelity', () => {
  it('keeps the Pulse header positioning and visual classes', async () => {
    const header = await source('../src/lib/SiteHeader.svelte');
    expect(header).toContain('top-3 z-40 mt-3');
    expect(header).toContain('rounded-full border px-4 py-2.5');
    expect(header).toContain('shadow-lg shadow-black/10 backdrop-blur-xl');
  });

  it('uses accessible tooltips for icon links without native title popups', async () => {
    const header = await source('../src/lib/SiteHeader.svelte');
    const footer = await source('../src/lib/SiteFooter.svelte');

    expect(header).toContain('<Tooltip.Provider delayDuration={300}>');
    expect(footer).toContain('<Tooltip.Provider delayDuration={300}>');
    expect(header).not.toContain('title={');
    expect(footer).not.toContain('title={');
    expect(header).toContain('size-11');
    expect(footer).toContain('size-11');
    expect(header).toContain('overflow-x-auto overscroll-x-contain');
    expect(header).toContain('focus-visible:outline-2');
    expect(footer).toContain('focus-visible:outline-2');
  });

  it('keeps the Pulse footer layout classes', async () => {
    const footer = await source('../src/lib/SiteFooter.svelte');
    expect(footer).toContain('flex flex-wrap items-center justify-between gap-4');
    expect(footer).toContain('border-t py-6 text-sm');
  });

  it('keeps the sticky pill content-width and centred', async () => {
    const pill = await source('../src/lib/StickyPill.svelte');
    expect(pill).toContain('top-[5.25rem] z-30 mx-auto mb-8 flex w-fit justify-center py-2');
    expect(pill).toMatch(/rootMargin:\s*['"]-84px 0px 0px 0px['"]/);
  });
});
