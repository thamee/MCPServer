/// <reference types="jasmine" />
import { TestBed } from '@angular/core/testing';
import { OpenGraphService } from './opengraph.service';

describe('OpenGraphService', () => {
  let service: OpenGraphService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OpenGraphService);
  });

  // ─── scrape() ────────────────────────────────────────────────────────────────

  describe('scrape()', () => {
    describe('happy path — valid URLs', () => {
      it('should return the normalized url', async () => {
        const result = await service.scrape('https://example.com');
        expect(result.url).toBe('https://example.com');
      });

      it('should prepend https:// when the scheme is missing', async () => {
        const result = await service.scrape('example.com');
        expect(result.url).toBe('https://example.com');
      });

      it('should strip www. from the siteName', async () => {
        const result = await service.scrape('https://www.example.com');
        expect(result.siteName).toBe('example.com');
      });

      it('should use the hostname as description when pathname is "/"', async () => {
        const result = await service.scrape('https://www.example.com/');
        expect(result.description).toBe('example.com');
      });

      it('should use the pathname as description when it is not "/"', async () => {
        const result = await service.scrape('https://example.com/some/path');
        expect(result.description).toBe('/some/path');
      });

      it('should build a Google favicon thumbnail URL using the domain', async () => {
        const result = await service.scrape('https://www.example.com');
        expect(result.thumbnail).toBe(
          'https://www.google.com/s2/favicons?domain=example.com&sz=64'
        );
      });

      it('should preserve the raw URL (trimmed) as displayUrl', async () => {
        const result = await service.scrape('  https://example.com  ');
        expect(result.displayUrl).toBe('https://example.com');
      });
    });

    describe('edge cases — invalid URLs', () => {
      it('should return a fallback result for a completely invalid URL', async () => {
        const result = await service.scrape('not a url at all!!!');
        expect(result.url).toBeDefined();
        expect(result.displayUrl).toBe('not a url at all!!!');
        expect(result.siteName).toBe('not a url at all!!!');
        expect(result.description).toBe('');
        expect(result.thumbnail).toBe('');
      });

      it('should handle an empty string without throwing', async () => {
        const result = await service.scrape('');
        expect(result).toBeTruthy();
        expect(result.displayUrl).toBe('');
      });

      it('should handle a whitespace-only string without throwing', async () => {
        const result = await service.scrape('   ');
        expect(result).toBeTruthy();
      });
    });
  });

  // ─── normalizeUrl() ───────────────────────────────────────────────────────────

  describe('normalizeUrl()', () => {
    it('should leave an https:// URL unchanged', () => {
      expect(service.normalizeUrl('https://example.com')).toBe('https://example.com');
    });

    it('should leave an http:// URL unchanged', () => {
      expect(service.normalizeUrl('http://example.com')).toBe('http://example.com');
    });

    it('should prepend https:// when no scheme is present', () => {
      expect(service.normalizeUrl('example.com')).toBe('https://example.com');
    });

    it('should trim leading and trailing whitespace', () => {
      expect(service.normalizeUrl('  https://example.com  ')).toBe('https://example.com');
    });

    it('should trim whitespace before prepending the scheme', () => {
      expect(service.normalizeUrl('  example.com  ')).toBe('https://example.com');
    });
  });
});
