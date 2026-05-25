import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  CdkDragDrop,
  CdkDrag,
  CdkDropList,
  CdkDragHandle,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { AuthService } from '../../services/auth.service';
import { ListService } from '../../services/list.service';
import { OpenGraphService } from '../../services/opengraph.service';
import { UIStateService } from '../../services/ui-state.service';
import { LinkItem } from '../../models/link-item.model';
import { LinkCardComponent } from '../link-card/link-card.component';

@Component({
  selector: 'app-list-compose',
  standalone: true,
  imports: [FormsModule, CdkDrag, CdkDropList, CdkDragHandle, LinkCardComponent],
  templateUrl: './list-compose.component.html',
  styleUrl: './list-compose.component.css',
})
export class ListComposeComponent implements OnInit {
  auth = inject(AuthService);
  listService = inject(ListService);
  ogService = inject(OpenGraphService);
  uiState = inject(UIStateService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  listId = '';
  slug = '';
  description = '';
  urlInput = '';
  isPublished = false;
  isAddingLink = false;
  slugFocused = false;

  links = signal<LinkItem[]>([]);
  slugError = signal('');
  slugValid = signal(true);

  canPublish = computed(() => this.slugValid() && this.links().length > 0);

  private slugCheckTimeout: ReturnType<typeof setTimeout> | null = null;

  async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');
    const pendingUrl = this.uiState.pendingUrl;
    this.uiState.pendingUrl = null;

    if (id) {
      const existing = this.listService.getListById(id);
      if (!existing) {
        this.router.navigate(['/']);
        return;
      }
      // Redirect anonymous published lists to public view
      if (existing.published && existing.ownerId === null) {
        this.router.navigate(['/list', existing.slug]);
        return;
      }
      // Redirect if authenticated but not the owner
      const userId = this.auth.currentUser()?.id;
      if (existing.published && existing.ownerId && existing.ownerId !== userId) {
        this.router.navigate(['/list', existing.slug]);
        return;
      }
      this.listId = existing.id;
      this.slug = existing.slug;
      this.description = existing.description;
      this.isPublished = existing.published;
      this.links.set([...existing.links]);
    } else {
      const ownerId = this.auth.currentUser()?.id ?? null;
      const newList = this.listService.createList({ ownerId });
      this.listId = newList.id;
      this.router.navigate(['/compose', newList.id], { replaceUrl: true });
    }

    if (pendingUrl) {
      await this.addLink(pendingUrl);
    }
  }

  onSlugChange(value: string): void {
    this.slug = value;
    if (this.slugCheckTimeout) clearTimeout(this.slugCheckTimeout);

    if (!value) {
      this.slugError.set('');
      this.slugValid.set(true);
      return;
    }
    if (!/^[a-zA-Z0-9\-_/]+$/.test(value)) {
      this.slugError.set('Only letters, numbers, hyphens, underscores, and slashes allowed');
      this.slugValid.set(false);
      return;
    }
    this.slugCheckTimeout = setTimeout(() => {
      const taken = this.listService.isSlugTaken(value, this.listId);
      if (taken) {
        this.slugError.set('This URL is already taken');
        this.slugValid.set(false);
      } else {
        this.slugError.set('');
        this.slugValid.set(true);
      }
    }, 400);
  }

  async addLink(rawUrl?: string): Promise<void> {
    const url = (rawUrl ?? this.urlInput).trim();
    if (!url || this.isAddingLink) return;
    this.isAddingLink = true;
    try {
      const data = await this.ogService.scrape(url);
      const item: LinkItem = {
        id: crypto.randomUUID(),
        url: data.url!,
        displayUrl: data.displayUrl!,
        siteName: data.siteName!,
        description: data.description!,
        thumbnail: data.thumbnail!,
      };
      this.links.update((links) => [...links, item]);
      this.urlInput = '';
      this.save();
    } finally {
      this.isAddingLink = false;
    }
  }

  removeLink(id: string): void {
    this.links.update((links) => links.filter((l) => l.id !== id));
    this.save();
  }

  onDrop(event: CdkDragDrop<LinkItem[]>): void {
    const links = [...this.links()];
    moveItemInArray(links, event.previousIndex, event.currentIndex);
    this.links.set(links);
    this.save();
  }

  save(): void {
    if (!this.listId) return;
    this.listService.updateList(this.listId, {
      slug: this.slug,
      description: this.description,
      links: this.links(),
    });
  }

  publish(): void {
    if (!this.canPublish()) return;
    this.save();
    const published = this.listService.publishList(this.listId);
    if (published) {
      this.router.navigate(['/list', published.slug]);
    }
  }
}
