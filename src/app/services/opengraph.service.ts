import { Injectable } from '@angular/core';
import { LinkItem } from '../models/link-item.model';

@Injectable({ providedIn: 'root' })
export class OpenGraphService {
  normalizeUrl(rawUrl: string): string {
    const trimmed = rawUrl.trim();
    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
      return 'https://' + trimmed;
    }
    return trimmed;
  }

  async scrape(rawUrl: string): Promise<Partial<LinkItem>> {
    const url = this.normalizeUrl(rawUrl);
    try {
      const urlObj = new URL(url);
      const domain = urlObj.hostname.replace(/^www\./, '');
      return {
        url,
        displayUrl: rawUrl.trim(),
        siteName: domain,
        description: urlObj.pathname !== '/' ? urlObj.pathname : domain,
        thumbnail: `https://www.google.com/s2/favicons?domain=${domain}&sz=64`,
      };
    } catch {
      return {
        url,
        displayUrl: rawUrl.trim(),
        siteName: rawUrl.trim(),
        description: '',
        thumbnail: '',
      };
    }
  }
}
