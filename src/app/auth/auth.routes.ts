import { Routes } from '@angular/router';

export default [
  {
    path: '',
    redirectTo: 'registro',
    pathMatch: 'full',
  },

  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component'),
  },

  {
    path: 'registro',
    loadComponent: () => import('./pages/registro/registro.component'),
  },
] as Routes;