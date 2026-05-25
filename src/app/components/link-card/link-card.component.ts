import { Component, input, output } from '@angular/core';
import { LinkItem } from '../../models/link-item.model';

@Component({
  selector: 'app-link-card',
  standalone: true,
  imports: [],
  templateUrl: './link-card.component.html',
  styleUrl: './link-card.component.css',
})
export class LinkCardComponent {
  link = input.required<LinkItem>();
  removable = input(false);
  clickable = input(false);
  remove = output<void>();

  onRemove(event: Event): void {
    event.stopPropagation();
    this.remove.emit();
  }

  openUrl(): void {
    if (this.clickable()) {
      window.open(this.link().url, '_blank', 'noopener,noreferrer');
    }
  }
}
