import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';

@Component({
  selector: 'app-role-redirect',
  template: ''
})
export class RoleRedirectComponent implements OnInit {
  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {
    const user = this.auth.getUser();
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }

    if (user.role === 'Admin') {
      this.router.navigate(['/admin/user-list']);  // Ruta lista de usuarios
    } else if (user.role === 'User') {
      this.router.navigate(['/user/servicios-list']);  // Ruta para usuario normal
    } else {
      this.router.navigate(['/login']);  // En caso de rol desconocido
    }
  }
}
