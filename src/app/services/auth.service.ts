import { Injectable, signal } from '@angular/core';

export interface User {
  id: string;
  username: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly STORAGE_KEY = 'urlist_user';

  currentUser = signal<User | null>(this.loadUser());

  private loadUser(): User | null {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  signIn(username: string): void {
    const user: User = {
      id: username.toLowerCase().replace(/[^a-z0-9]/g, '_'),
      username,
    };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
    this.currentUser.set(user);
  }

  signOut(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this.currentUser.set(null);
  }
}
