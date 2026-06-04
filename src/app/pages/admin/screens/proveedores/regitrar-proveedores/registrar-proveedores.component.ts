import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProveedorService } from '../../../services/proveedores.service';
import { toast } from 'ngx-sonner';
import { Router } from '@angular/router';


@Component({
  selector: 'app-registrar-proveedores',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registrar-proveedores.component.html'
})
export class RegistrarProveedoresComponent implements OnInit {
  form!: FormGroup;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(private fb: FormBuilder, private proveedorService: ProveedorService, private router: Router) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nit: ['', Validators.required],
      nombre: ['', Validators.required],
      representanteLegal: ['', Validators.required],
    });
  }

  isRequired(control: string): boolean {
    const field = this.form.get(control);
    return !!field?.touched && field.hasError('required');
  }

  guardarProveedor(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.proveedorService.crearProveedor(this.form.value).subscribe({
      next: () => {
        toast.success('Proveedor creado');
        this.successMessage = 'Proveedor creado';
        this.errorMessage = null;
        this.form.reset();
        this.router.navigate(['/admin/proveedores-list'])
      },
      error: () => {
       toast.error('Error al crear proveedor');
        this.errorMessage = 'Error al crear proveedor';
        this.successMessage = null;
      },
    });
  }
}
