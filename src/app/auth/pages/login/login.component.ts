import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserLoginDto } from '../../../core/interfaces/auth.models';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
})
export default class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    const credentials: UserLoginDto = {
      email: this.email,
      password: this.password,
    };

    this.authService.login(credentials).subscribe({
      next: (response) => {
        toast.success('Inicio de sesión exitoso');
        if (response.user.role === 'Admin') {
          this.router.navigate(['/admin/user-list']); // o dashboard admin
        } else {
          this.router.navigate(['/user']);
        }
      },
      error: (err) => {
        toast.error('Error al iniciar sesión');
      },
    });

  }
}
