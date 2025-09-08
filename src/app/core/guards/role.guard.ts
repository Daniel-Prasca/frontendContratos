import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';


@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRoles: string[] = route.data['roles'];
    const user = this.auth.getUser();

    if (!user || !expectedRoles.includes(user.role)) {
      this.router.navigate(['/auth/register']); // ruta para acceso no autorizado
      return false;
    }
    return true;
  }
}
