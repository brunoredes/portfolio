import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';

interface ImageSource {
  readonly url: string;
  readonly width: number;
}

interface SizeBreakpoint {
  readonly maxWidth: number;
  readonly displaySize: number;
}

export interface ResolvedHeroImage {
  readonly url: string;
  readonly width: number;
  readonly height: number;
}

/**
 * Resolves the correct hero image URL based on viewport width and device pixel ratio.
 *
 * This service mirrors the browser's srcset/sizes selection algorithm
 * to ensure the `<img>` src matches the resource preloaded by the
 * `<link rel="preload">` in index.html — avoiding double downloads.
 *
 * IMPORTANT: The `sources` and `sizeBreakpoints` MUST match the
 * `imagesrcset` and `imagesizes` attributes in the preload link.
 */
@Injectable({
  providedIn: 'root',
})
export class HeroImage {
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);

  /**
   * Must match `imagesrcset` in `<link rel="preload">` from index.html.
   * Sorted ascending by width for the selection algorithm.
   */
  private readonly sources: readonly ImageSource[] = [
    { url: '/hero/donatelli-400w.avif', width: 400 },
    { url: '/hero/donatelli-600w.avif', width: 600 },
    { url: '/hero/donatelli-800w.avif', width: 800 },
  ];

  /**
   * Must match `imagesizes` in `<link rel="preload">` from index.html.
   * Evaluated top-to-bottom — first matching breakpoint wins.
   */
  private readonly sizeBreakpoints: readonly SizeBreakpoint[] = [
    { maxWidth: 768, displaySize: 300 },
    { maxWidth: 1024, displaySize: 350 },
  ];

  private readonly defaultDisplaySize = 400;
  private readonly intrinsicWidth = 400;
  private readonly intrinsicHeight = 600;

  /**
   * Resolves the hero image that the browser would select
   * based on the current viewport width and device pixel ratio.
   *
   * On the server (SSR), returns the default (smallest) variant
   * since viewport dimensions are unavailable.
   */
  resolve(): ResolvedHeroImage {
    if (!isPlatformBrowser(this.platformId)) {
      return this.fallback();
    }

    const window = this.document.defaultView;
    if (!window) {
      return this.fallback();
    }

    const viewportWidth = window.innerWidth;
    const dpr = window.devicePixelRatio;
    const displaySize = this.resolveDisplaySize(viewportWidth);
    const url = this.selectSource(displaySize, dpr);

    return { url, width: this.intrinsicWidth, height: this.intrinsicHeight };
  }

  private fallback(): ResolvedHeroImage {
    return {
      url: this.sources[0].url,
      width: this.intrinsicWidth,
      height: this.intrinsicHeight,
    };
  }

  /**
   * Evaluates CSS `sizes` breakpoints to determine the effective
   * display size for the current viewport width.
   */
  private resolveDisplaySize(viewportWidth: number): number {
    for (const breakpoint of this.sizeBreakpoints) {
      if (viewportWidth <= breakpoint.maxWidth) {
        return breakpoint.displaySize;
      }
    }
    return this.defaultDisplaySize;
  }

  /**
   * Selects the smallest source whose intrinsic width covers the
   * target pixel width (displaySize × DPR).
   *
   * This matches the browser's `w` descriptor selection:
   * pick the candidate whose width ≥ displaySize × devicePixelRatio.
   */
  private selectSource(displaySize: number, dpr: number): string {
    const targetWidth = displaySize * dpr;

    for (const source of this.sources) {
      if (source.width >= targetWidth) {
        return source.url;
      }
    }

    return this.sources[this.sources.length - 1].url;
  }
}
