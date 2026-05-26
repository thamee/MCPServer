import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

/**
 * Lightweight markdown-to-HTML pipe.
 * Handles: **bold**, *italic*, `code`, - lists, line breaks, spoiler ||text||
 */
@Pipe({ name: 'markdown', standalone: true })
export class MarkdownPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string): SafeHtml {
    if (!value) return '';

    let html = value
      // Escape HTML entities first
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')

      // Spoiler ||text|| → <s>text</s>
      .replace(/\|\|(.+?)\|\|/g, '<s>$1</s>')

      // Bold **text** or __text__
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/__(.+?)__/g, '<strong>$1</strong>')

      // Italic *text* or _text_
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/_(.+?)_/g, '<em>$1</em>')

      // Inline code `text`
      .replace(/`([^`]+)`/g, '<code>$1</code>')

      // Unordered list items: lines starting with - or •
      .replace(/^[-•]\s+(.+)$/gm, '<li>$1</li>')

      // Wrap consecutive <li> in <ul>
      .replace(/(<li>.*<\/li>(\n|$))+/g, (match) => `<ul>${match}</ul>`)

      // Line breaks
      .replace(/\n/g, '<br>');

    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}
