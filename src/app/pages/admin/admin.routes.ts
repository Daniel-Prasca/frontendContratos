import { Routes } from '@angular/router';
import { RoleGuard } from '../../core/guards/role.guard';
import { UserListComponent } from './screens/user-list/user-list.component';
import { ProveedorListComponent } from './screens/proveedores/proveedores-list/proveedor-list.component';
import { RegistrarProveedoresComponent } from './screens/proveedores/regitrar-proveedores/registrar-proveedores.component';
import { ContratoListComponent } from './screens/contratos/contrato-list/contrato-list.component';
import { RegistrarContratosComponent } from './screens/contratos/registrar-contrato/registrar-contratos.component';
import { ServicioListComponent } from '../user/screens/servicios/servicio-list/servicio-list.component';
import { RoleRedirectComponent } from '../../core/components/role-redirect.component';
import { AuthGuard } from '../../core/guards/auth.guard';
import { RegistrarServiciosComponent } from '../user/screens/servicios/registrar-servicio/registrar-servicios.component';
import { LiquidacionListComponent } from '../user/screens/liquidaciones/liquidacion-list/liquidacion-list.component';
import { RegistrarLiquidacionesComponent } from '../user/screens/liquidaciones/registrar-liquidacion/registrar-liquidaciones.component';
import { PolizasListComponent } from './screens/poliza/polizas-list/polizas-list.component';
import { RegistrarPolizasComponent } from './screens/poliza/registrar-polizas/registrar-polizas.component';
import { AlertasListComponent } from './screens/alertas/alertas-list.component';

export default [
  {
    path: '',
        component: RoleRedirectComponent,
        canActivate: [AuthGuard]
  },

  {
    path: 'user-list',
    canActivate: [RoleGuard],
    data: { roles: ['Admin'] },
    component: UserListComponent
  },
  {
    path: 'proveedores-list',
    canActivate: [RoleGuard],
    data: { roles: ['Admin'] },
    component: ProveedorListComponent
  },
  {
    path: 'registrar-proveedores',
    canActivate: [RoleGuard],
    data: { roles: ['Admin'] },
    component: RegistrarProveedoresComponent
  },

  {
    path: 'contratos-list',
    canActivate: [RoleGuard],
    data: { roles: ['Admin', 'User'] },
    component: ContratoListComponent
  },
  
  {
    path: 'registrar-contratos',
    canActivate: [RoleGuard],
    data: { roles: ['Admin', 'User'] },
    component: RegistrarContratosComponent
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
    
  {
    path: 'polizas-list',
    canActivate: [RoleGuard],
    data: { roles: ['Admin', 'User'] },
    component: PolizasListComponent  
  },

  {
    path: 'registrar-polizas',
    canActivate: [RoleGuard],
    data: { roles: ['Admin', 'User'] },
    component: RegistrarPolizasComponent 
  },

  {
    path: 'alertas-list',
    canActivate: [RoleGuard],
    data: { roles: ['Admin', 'User'] },
    component: AlertasListComponent
  }

] as Routes;