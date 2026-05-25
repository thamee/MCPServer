import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from './components/header/header.component';
import { AuthService } from './services/auth.service';
import { UIStateService } from './services/ui-state.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  auth = inject(AuthService);
  uiState = inject(UIStateService);

  username = '';

  signIn(): void {
    if (this.username.trim()) {
      this.auth.signIn(this.username.trim());
      this.uiState.closeSignIn();
      this.username = '';
    }
  }
}

