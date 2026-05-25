import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ListService } from '../../services/list.service';
import { UIStateService } from '../../services/ui-state.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  auth = inject(AuthService);
  listService = inject(ListService);
  uiState = inject(UIStateService);
  router = inject(Router);

  urlInput = '';

  startList(): void {
    const url = this.urlInput.trim();
    if (!url) return;
    const ownerId = this.auth.currentUser()?.id ?? null;
    const list = this.listService.createList({ ownerId });
    this.uiState.pendingUrl = url;
    this.router.navigate(['/compose', list.id]);
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') this.startList();
  }
}
