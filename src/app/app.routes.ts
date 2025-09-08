import { Routes } from '@angular/router';
// import { privateGuard, publicGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    // canActivateChild: [publicGuard()],
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes'),
    loadComponent: () => import('./auth/layout/layout.component'),
  },
  {
    // canActivateChild: [privateGuard()],
    path: '',
    loadChildren: () => import('./pages/pages.routes'),
    loadComponent: () => import('./shared/layout/layout.component'),
  },

  {
    path: '**',
    redirectTo: '/auth',
  },
];