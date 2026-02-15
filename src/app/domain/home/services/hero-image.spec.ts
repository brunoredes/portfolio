import { DOCUMENT } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { HeroImage } from './hero-image';

function createMockDocument(viewportWidth: number, dpr: number): Document {
  return {
    defaultView: {
      innerWidth: viewportWidth,
      devicePixelRatio: dpr,
    },
  } as unknown as Document;
}

describe('HeroImage', () => {
  function setup(platformId: string, viewportWidth = 1280, dpr = 1): HeroImage {
    TestBed.configureTestingModule({
      providers: [
        { provide: PLATFORM_ID, useValue: platformId },
        { provide: DOCUMENT, useValue: createMockDocument(viewportWidth, dpr) },
      ],
    });
    return TestBed.inject(HeroImage);
  }

  describe('Server-side rendering', () => {
    it('should return the smallest variant as fallback', () => {
      const service = setup('server');

      const result = service.resolve();

      expect(result.url).toBe('/hero/donatelli-400w.avif');
      expect(result.width).toBe(400);
      expect(result.height).toBe(600);
    });
  });

  describe('Browser — 1x DPR', () => {
    it('should select 400w for mobile viewport (≤768px)', () => {
      const service = setup('browser', 480, 1);
      expect(service.resolve().url).toBe('/hero/donatelli-400w.avif');
    });

    it('should select 400w for tablet viewport (≤1024px)', () => {
      const service = setup('browser', 900, 1);
      expect(service.resolve().url).toBe('/hero/donatelli-400w.avif');
    });

    it('should select 400w for desktop viewport (>1024px)', () => {
      const service = setup('browser', 1440, 1);
      expect(service.resolve().url).toBe('/hero/donatelli-400w.avif');
    });
  });

  describe('Browser — 2x DPR', () => {
    it('should select 600w for mobile viewport (≤768px) at 2x', () => {
      const service = setup('browser', 480, 2);
      expect(service.resolve().url).toBe('/hero/donatelli-600w.avif');
    });

    it('should select 800w for tablet viewport (≤1024px) at 2x', () => {
      const service = setup('browser', 900, 2);
      expect(service.resolve().url).toBe('/hero/donatelli-800w.avif');
    });

    it('should select 800w for desktop viewport (>1024px) at 2x', () => {
      const service = setup('browser', 1440, 2);
      expect(service.resolve().url).toBe('/hero/donatelli-800w.avif');
    });
  });

  describe('Browser — 3x DPR', () => {
    it('should select 800w (largest available) for any viewport at 3x', () => {
      const service = setup('browser', 1440, 3);
      expect(service.resolve().url).toBe('/hero/donatelli-800w.avif');
    });
  });

  describe('Edge cases', () => {
    it('should select 400w at exact 768px breakpoint boundary', () => {
      const service = setup('browser', 768, 1);
      expect(service.resolve().url).toBe('/hero/donatelli-400w.avif');
    });

    it('should select 400w at exact 1024px breakpoint boundary', () => {
      const service = setup('browser', 1024, 1);
      expect(service.resolve().url).toBe('/hero/donatelli-400w.avif');
    });

    it('should handle viewport just above 1024px', () => {
      const service = setup('browser', 1025, 1);
      expect(service.resolve().url).toBe('/hero/donatelli-400w.avif');
    });

    it('should return fallback when defaultView is null', () => {
      TestBed.configureTestingModule({
        providers: [
          { provide: PLATFORM_ID, useValue: 'browser' },
          { provide: DOCUMENT, useValue: { defaultView: null } },
        ],
      });
      const service = TestBed.inject(HeroImage);

      expect(service.resolve().url).toBe('/hero/donatelli-400w.avif');
    });
  });

  describe('Image dimensions', () => {
    it('should always return 2:3 portrait dimensions', () => {
      const service = setup('browser', 1440, 2);
      const result = service.resolve();

      expect(result.width).toBe(400);
      expect(result.height).toBe(600);
    });
  });
});
