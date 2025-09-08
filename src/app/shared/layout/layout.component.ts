import { Component, inject } from "@angular/core";
import { Router, RouterLink, RouterModule } from "@angular/router";
import { AuthStateService } from "../services/auth-state.service";
import { toast } from "ngx-sonner"; 
import { HasRoleDirective } from "../../core/guards/has-role.directive";
import { UserDto } from "../../core/interfaces/auth.models";
import { Observable } from "rxjs";
import { AsyncPipe } from "@angular/common";



@Component({
  standalone: true,
  imports: [RouterModule, RouterLink, HasRoleDirective, AsyncPipe],
  selector: 'app-layout',
  template: `
  <header class="h-[80px] mb-8 w-full max-w-screen-lg mx-auto px-4">
    <nav class="bg-white dark:bg-gray-900 fixed w-full z-20 top-0 start-0 border-b border-gray-200 dark:border-gray-600">
      <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a routerLink="/docente/tasks" class="flex items-center space-x-3 rtl:space-x-reverse">
          <!-- <img src="img/LOGO-UPC.png" class="h-8" alt="Flowbite Logo"> -->
          <span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Gestión</span>
        </a>
        <div class="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          <button (click)="logout()" type="button" class="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Cerrar Sesión</button>
        </div>
        <div class="items-center justify-between hidden w-full md:flex md:w-auto md:order-1">
          <ul class="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            
            <!-- Home con Icono -->
            <li *hasRole="['Admin', 'User']" class="flex items-center space-x-2">
              <a routerLink="/user/dashboard" 
                 routerLinkActive="[&>*]:text-green-400"
                 [routerLinkActiveOptions]="{ exact: true }"
                 class="flex items-center space-x-2 py-2 px-3 text-white hover:text-green-700 md:p-0 md:dark:hover:text-green-500">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" width="24" height="24" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" stroke="currentColor">
                  <path d="M19 8.71l-5.333 -4.148a2.666 2.666 0 0 0 -3.274 0l-5.334 4.148a2.665 2.665 0 0 0 -1.029 2.105v7.2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-7.2c0 -.823 -.38 -1.6 -1.03 -2.105"></path>
                  <path d="M16 15c-2.21 1.333 -5.792 1.333 -8 0"></path>
                </svg>
                <span>Home</span>
              </a>
            </li>
            <!-- Proveedores con Icono -->
            <li *hasRole="['Admin']" class="flex items-center space-x-2">
              <a routerLink="/admin/proveedores-list" 
                 routerLinkActive="[&>*]:text-green-400"
                  [routerLinkActiveOptions]="{ exact: true }"
                  class="flex items-center space-x-2 py-2 px-3 text-white hover:text-green-700 md:p-0 md:dark:hover:text-green-500">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" width="20" height="24" stroke-width="2">
                  <path d="M4 4h16a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-16a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2"></path>
                  <path d="M22 6l-10.5 7l-4.5 -3l-7.5 5"></path>
                  <path d="M14 12v8"></path>
                  <path d="M18 12v8"></path>
                  <path d="M10 12v8"></path>
                </svg>
                <span>Proveedores</span>
              </a>
            </li>
            
            <!-- Contratos con Icono -->
            <li *hasRole="['Admin']" class="flex items-center space-x-2">
              <a routerLink="/admin/contratos-list"
                  routerLinkActive="[&>*]:text-green-400"
                  [routerLinkActiveOptions]="{ exact: true }"
                  class="flex items-center space-x-2 py-2 px-3 text-white hover:text-green-700 md:p-0 md:dark:hover:text-green-500">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" width="20" height="24" stroke-width="2">
                  <path d="M4 4h16a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-16a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2"></path>
                  <path d="M22 6l-10.5 7l-4.5 -3l-7.5 5"></path>
                  <path d="M14 12v8"></path>
                  <path d="M18 12v8"></path>
                  <path d="M10 12v8"></path>
                </svg>
                <span>Contratos</span>
              </a>
            </li>

            <!-- Servicios con Icono-->
            <li *hasRole="['Admin','User']" class="flex items-center space-x-2">
          <a
            [routerLink]="[
              '/', 
              (user$ | async)?.role === 'Admin' ? 'admin' : 'user', 
              'servicios-list'
            ]"
            routerLinkActive="[&>*]:text-green-400"
            [routerLinkActiveOptions]="{ exact: true }"
            class="flex items-center space-x-2 py-2 px-3 text-white hover:text-green-700 md:p-0 md:dark:hover:text-green-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" width="20" height="24" stroke-width="2">
              <path d="M4 4h16a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-16a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2"></path>
              <path d="M22 6l-10.5 7l-4.5 -3l-7.5 5"></path>
              <path d="M14 12v8"></path>
              <path d="M18 12v8"></path>
              <path d="M10 12v8"></path>
            </svg>
            <span>Servicios</span>
          </a>
          </li>


            <!-- Liquidaciones con Icono -->
            <li *hasRole="['Admin', 'User']" class="flex items-center space-x-2">
              <a  [routerLink]="[
                  '/', 
                  (user$ | async)?.role === 'Admin' ? 'admin' : 'user', 
                  'liquidaciones-list'
                  ]"
                  routerLinkActive="[&>*]:text-green-400"
                  [routerLinkActiveOptions]="{ exact: true }"
                  class="flex items-center space-x-2 py-2 px-3 text-white hover:text-green-700 md:p-0 md:dark:hover:text-green-500"
                >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" width="20" height="24" stroke-width="2">
                  <path d="M4 4h16a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-16a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2"></path>
                  <path d="M22 6l-10.5 7l-4.5 -3l-7.5 5"></path>
                  <path d="M14 12v8"></path>
                  <path d="M18 12v8"></path>
                  <path d="M10 12v8"></path>
                </svg>
                <span>Liquidaciones</span>
              </a>
            </li>
            <!-- Polizas con Icono -->
            <li *hasRole="['Admin']" class="flex items-center space-x-2">
              <a  [routerLink]="[
              '/', 
              (user$ | async)?.role === 'Admin' ? 'admin' : 'user', 
              'polizas-list'
            ]"
                  routerLinkActive="[&>*]:text-green-400"
                  [routerLinkActiveOptions]="{ exact: true }"
                  class="flex items-center space-x-2 py-2 px-3 text-white hover:text-green-700 md:p-0 md:dark:hover:text-green-500">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" width="20" height="24" stroke-width="2">
                  <path d="M4 4h16a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-16a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2"></path>
                  <path d="M22 6l-10.5 7l-4.5 -3l-7.5 5"></path>
                  <path d="M14 12v8"></path>
                  <path d="M18 12v8"></path>
                  <path d="M10 12v8"></path>
                </svg>
                <span>Pólizas</span>
              </a>
            </li>

            <!-- Alertas con Icono -->
            <li *hasRole="['Admin']" class="flex items-center space-x-2">
              <a [routerLink]="[
              '/', 
              (user$ | async)?.role === 'Admin' ? 'admin' : 'user', 
              'alertas-list'
            ]"
                  routerLinkActive="[&>*]:text-green-400"
                  [routerLinkActiveOptions]="{ exact: true }"
                  class="flex items-center space-x-2 py-2 px-3 text-white hover:text-green-700 md:p-0 md:dark:hover:text-green-500">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" width="20" height="24" stroke-width="2">
                  <path d="M4 4h16a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-16a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2"></path>
                  <path d="M22 6l-10.5 7l-4.5 -3l-7.5 5"></path>
                  <path d="M14 12v8"></path>
                  <path d="M18 12v8"></path>
                  <path d="M10 12v8"></path>
                </svg>
                <span>Alertas</span>
              </a>
            </li>
            <!-- Administrador con Icono -->
            <!-- <li  class="flex items-center space-x-2">
              <a routerLink="/admin/dashboard" 
                 routerLinkActive="[&>*]:text-green-400"
                 [routerLinkActiveOptions]="{ exact: true }"
                 class="flex items-center space-x-2 py-2 px-3 text-white hover:text-green-700 md:p-0 md:dark:hover:text-green-500">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" width="24" height="24" stroke-width="2">
                  <path d="M4 10a2 2 0 1 0 4 0a2 2 0 0 0 -4 0"></path>
                  <path d="M6 4v4"></path>
                  <path d="M6 12v8"></path>
                  <path d="M10 16a2 2 0 1 0 4 0a2 2 0 0 0 -4 0"></path>
                  <path d="M12 4v10"></path>
                  <path d="M12 18v2"></path>
                  <path d="M16 7a2 2 0 1 0 4 0a2 2 0 0 0 -4 0"></path>
                  <path d="M18 4v1"></path>
                  <path d="M18 9v11"></path>
                </svg>
                <span>Administrador</span>
              </a>
            </li> -->

            
          </ul>
        </div>
      </div>
    </nav>
  </header>
  <router-outlet/>
  `,
})

export default class LayoutComponent {
  private _authState = inject(AuthStateService);
  private _router = inject(Router);
  user$: Observable<UserDto | null> = this._authState.user$;

  async logout() {
    await this._authState.logout();
    toast.success('Sesión cerrada correctamente');
    localStorage.removeItem('selectedCategory');
    this._router.navigateByUrl('/auth/login');
  }
}