import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ListService } from '../../services/list.service';
import { LinkList } from '../../models/link-list.model';
import { LinkCardComponent } from '../link-card/link-card.component';

@Component({
  selector: 'app-public-list',
  standalone: true,
  imports: [RouterLink, LinkCardComponent],
  templateUrl: './public-list.component.html',
  styleUrl: './public-list.component.css',
})
export class PublicListComponent implements OnInit {
  listService = inject(ListService);
  auth = inject(AuthService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  list = signal<LinkList | null>(null);
  notFound = signal(false);

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug')!;
    const found = this.listService.getListBySlug(slug);
    if (found) {
      this.list.set(found);
    } else {
      this.notFound.set(true);
    }
  }

  isOwner(): boolean {
    const user = this.auth.currentUser();
    const list = this.list();
    return !!user && !!list && list.ownerId === user.id;
  }

  editList(): void {
    const list = this.list();
    if (list) this.router.navigate(['/compose', list.id]);
  }
}
