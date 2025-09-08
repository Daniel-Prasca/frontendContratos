import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserRegisterDto } from '../../../core/interfaces/auth.models';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registro.component.html',
})
export default class RegistroComponent {
  form: FormGroup;

  errorMessage = '';
  successMessage = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      // lastName: [''],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  isRequired(controlName: string): boolean {
    const control = this.form.get(controlName);
    return !!control && control.hasError('required') && control.touched;
  }

  isEmailError(): boolean {
    const control = this.form.get('email');
    return !!control && control.hasError('email') && control.touched;
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValue = this.form.value;
    const data: UserRegisterDto = {
      nombre: (formValue.firstName ?? ''),
      email: formValue.email ?? '',
      password: formValue.password ?? '',
      role: 'User',
    };

    this.authService.register(data).subscribe({
      next: () => {
        this.successMessage = 'Registro exitoso, por favor ingresa';
        this.errorMessage = '';
         this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Error en el registro';
        this.successMessage = '';
        console.error(err);
      },
    });
  }
}
