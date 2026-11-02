import { describe, expect, it, vi, afterEach } from 'vitest';
import { hasFineHoverPointer } from '../src/lib/motion/utils/pointer-capability.js';
import {
  onMotionPreferenceChange,
  prefersReducedMotion,
} from '../src/lib/motion/utils/motion-preference.js';

describe('motion capability utilities', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('defaults to reduced motion when window is unavailable', () => {
    vi.stubGlobal('window', undefined);
    expect(prefersReducedMotion()).toBe(true);
    expect(hasFineHoverPointer()).toBe(false);
  });

  it('reads the reduced-motion media query', () => {
    vi.stubGlobal('window', {
      matchMedia: vi.fn().mockReturnValue({ matches: true }),
    });

    expect(prefersReducedMotion()).toBe(true);
  });

  it('detects a fine hover pointer', () => {
    vi.stubGlobal('window', {
      matchMedia: vi.fn((query: string) => ({
        matches: query === '(hover: hover) and (pointer: fine)',
      })),
    });

    expect(hasFineHoverPointer()).toBe(true);
  });

  it('notifies and removes the motion preference listener', () => {
    const callback = vi.fn();
    const addEventListener = vi.fn();
    const removeEventListener = vi.fn();
    const query = {
      matches: false,
      addEventListener,
      removeEventListener,
    };

    vi.stubGlobal('window', {
      matchMedia: vi.fn().mockReturnValue(query),
    });

    const dispose = onMotionPreferenceChange(callback);

    expect(callback).toHaveBeenCalledWith(false);
    expect(addEventListener).toHaveBeenCalledWith('change', expect.any(Function));

    dispose();

    expect(removeEventListener).toHaveBeenCalledWith('change', expect.any(Function));
  });
});
