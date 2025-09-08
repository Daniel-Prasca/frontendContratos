import { Routes } from '@angular/router';
import { RoleGuard } from '../../core/guards/role.guard';
import { ServicioListComponent } from './screens/servicios/servicio-list/servicio-list.component';
import { RegistrarServiciosComponent } from './screens/servicios/registrar-servicio/registrar-servicios.component';
import { RegistrarLiquidacionesComponent } from './screens/liquidaciones/registrar-liquidacion/registrar-liquidaciones.component';
import { LiquidacionListComponent } from './screens/liquidaciones/liquidacion-list/liquidacion-list.component';

export default [
  {
    
    path: '',
    loadComponent: () => import('./screens/servicios/servicio-list/servicio-list.component').then(m => m.ServicioListComponent),
  },

  {
    path: 'servicios-list',
    canActivate: [RoleGuard],
    data: { roles: ['Admin', 'User'] },
    component: ServicioListComponent
  },
  {
    path: 'registrar-servicios',
    canActivate: [RoleGuard],
    data: { roles: ['Admin', 'User'] },
    component: RegistrarServiciosComponent
  },
  {
    path: 'liquidaciones-list',
    canActivate: [RoleGuard],
    data: { roles: ['Admin', 'User'] },
    component: LiquidacionListComponent
  },
  {
    path: 'registrar-liquidaciones',
    canActivate: [RoleGuard],
    data: { roles: ['Admin', 'User'] },
    component: RegistrarLiquidacionesComponent
  },

] as Routes;