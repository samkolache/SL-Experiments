import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'sam', pathMatch: 'full' },
  {
    path: 'sam',
    loadChildren: () =>
      import('./sandboxes/sam/sam.routes').then(m => m.SAM_ROUTES),
  },
];
