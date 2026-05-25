import { Injectable } from '@angular/core';
import { LinkList } from '../models/link-list.model';

@Injectable({ providedIn: 'root' })
export class ListService {
  private readonly STORAGE_KEY = 'urlist_lists';

  private loadLists(): LinkList[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private saveLists(lists: LinkList[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(lists));
  }

  getListById(id: string): LinkList | null {
    return this.loadLists().find((l) => l.id === id) ?? null;
  }

  getListBySlug(slug: string): LinkList | null {
    return this.loadLists().find((l) => l.slug === slug && l.published) ?? null;
  }

  getListsByOwner(ownerId: string): LinkList[] {
    return this.loadLists().filter((l) => l.ownerId === ownerId);
  }

  isSlugTaken(slug: string, excludeId?: string): boolean {
    return this.loadLists().some((l) => l.slug === slug && l.id !== excludeId);
  }

  generateSlug(): string {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let slug: string;
    do {
      slug = Array.from(
        { length: 8 },
        () => chars[Math.floor(Math.random() * chars.length)]
      ).join('');
    } while (this.isSlugTaken(slug));
    return slug;
  }

  createList(partial: Partial<LinkList>): LinkList {
    const lists = this.loadLists();
    const list: LinkList = {
      id: crypto.randomUUID(),
      slug: '',
      description: '',
      links: [],
      published: false,
      ownerId: partial.ownerId ?? null,
      createdAt: new Date().toISOString(),
      ...partial,
    };
    lists.push(list);
    this.saveLists(lists);
    return list;
  }

  updateList(id: string, changes: Partial<LinkList>): LinkList | null {
    const lists = this.loadLists();
    const idx = lists.findIndex((l) => l.id === id);
    if (idx === -1) return null;
    lists[idx] = { ...lists[idx], ...changes };
    this.saveLists(lists);
    return lists[idx];
  }

  publishList(id: string): LinkList | null {
    const lists = this.loadLists();
    const idx = lists.findIndex((l) => l.id === id);
    if (idx === -1) return null;
    if (!lists[idx].slug) {
      lists[idx].slug = this.generateSlug();
    }
    lists[idx].published = true;
    this.saveLists(lists);
    return lists[idx];
  }

  deleteList(id: string): void {
    this.saveLists(this.loadLists().filter((l) => l.id !== id));
  }
}
