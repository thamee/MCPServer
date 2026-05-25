import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UIStateService {
  showSignInModal = signal(false);
  pendingUrl: string | null = null;

  openSignIn(): void {
    this.showSignInModal.set(true);
  }

  closeSignIn(): void {
    this.showSignInModal.set(false);
  }
}
