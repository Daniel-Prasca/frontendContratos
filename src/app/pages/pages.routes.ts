import { Routes } from '@angular/router';
import { RoleGuard } from '../core/guards/role.guard';
import { RoleRedirectComponent } from '../core/components/role-redirect.component';
import { AuthGuard } from '../core/guards/auth.guard';

export default [
  {
    path: '',
    component: RoleRedirectComponent,
    canActivate: [AuthGuard] // protege la ruta para usuarios autenticados
  },
  {
    canActivate: [RoleGuard],
    data: { roles: ['Admin'] },
    path: 'admin',
    loadChildren: () => import('./admin/admin.routes'),
  },

  {
     canActivate: [RoleGuard],
      data: { roles: ['Admin', 'User'] },
    path: 'user',
    loadChildren: () => import('./user/user.routes'),
  },
];