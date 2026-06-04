import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ContratoService } from '../../../services/contrato.service';
import { ProveedorService } from '../../../services/proveedores.service';
import { ProveedorDto } from '../../../../../core/interfaces/proveedor';
import { toast } from 'ngx-sonner';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registrar-contratos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registrar-contratos.component.html'
})
export class RegistrarContratosComponent implements OnInit {
  form!: FormGroup;
  proveedores: ProveedorDto[] = [];
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private contratoService: ContratoService,
    private proveedorService: ProveedorService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      proveedorId: ['', Validators.required],
      objeto: ['', Validators.required],
      fechaInicio: ['', Validators.required],
      fechaFin: ['', Validators.required],
    });
    this.cargarProveedores();
  }

  cargarProveedores(): void {
    this.proveedorService.obtenerProveedores().subscribe({
      next: (data) => this.proveedores = data,
      error: () => {
        this.proveedores = [];
        toast.error('Error cargando proveedores');
      }
    });
  }

  isRequired(control: string): boolean {
    const field = this.form.get(control);
    return !!field?.touched && field.hasError('required');
  }

  guardarContrato(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.contratoService.crearContrato(this.form.value).subscribe({
      next: () => {
        toast.success('Contrato creado');
        this.successMessage = 'Contrato creado';
        this.errorMessage = null;
        this.form.reset();
        this.router.navigate(['/admin/contratos-list']);
      },
      error: () => {
        toast.error('Error al crear contrato');
        this.errorMessage = 'Error al crear contrato';
        this.successMessage = null;
      },
    });
  }
}
