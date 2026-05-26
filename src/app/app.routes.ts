import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'compose',
    loadComponent: () =>
      import('./components/list-compose/list-compose.component').then(
        (m) => m.ListComposeComponent
      ),
  },
  {
    path: 'compose/:id',
    loadComponent: () =>
      import('./components/list-compose/list-compose.component').then(
        (m) => m.ListComposeComponent
      ),
  },
  {
    path: 'my-links',
    loadComponent: () =>
      import('./components/my-links/my-links.component').then(
        (m) => m.MyLinksComponent
      ),
  },
  {
    path: 'list/:slug',
    loadComponent: () =>
      import('./components/public-list/public-list.component').then(
        (m) => m.PublicListComponent
      ),
  },
  {
    path: 'chat',
    loadComponent: () =>
      import('./components/chat/chat.component').then((m) => m.ChatComponent),
  },
  { path: '**', redirectTo: '' },
];

