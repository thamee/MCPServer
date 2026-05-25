import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ListService } from '../../services/list.service';
import { LinkList } from '../../models/link-list.model';

@Component({
  selector: 'app-my-links',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './my-links.component.html',
  styleUrl: './my-links.component.css',
})
export class MyLinksComponent implements OnInit {
  auth = inject(AuthService);
  listService = inject(ListService);
  router = inject(Router);

  lists = signal<LinkList[]>([]);
  confirmDeleteId = signal<string | null>(null);

  ngOnInit(): void {
    const user = this.auth.currentUser();
    if (!user) {
      this.router.navigate(['/']);
      return;
    }
    this.loadLists(user.id);
  }

  loadLists(ownerId: string): void {
    this.lists.set(this.listService.getListsByOwner(ownerId));
  }

  editList(id: string): void {
    this.router.navigate(['/compose', id]);
  }

  confirmDelete(id: string): void {
    this.confirmDeleteId.set(id);
  }

  deleteList(id: string): void {
    this.listService.deleteList(id);
    const user = this.auth.currentUser();
    if (user) this.loadLists(user.id);
    this.confirmDeleteId.set(null);
  }

  cancelDelete(): void {
    this.confirmDeleteId.set(null);
  }
}
