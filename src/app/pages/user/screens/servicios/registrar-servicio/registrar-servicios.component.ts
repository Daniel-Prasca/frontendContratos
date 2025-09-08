import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ServicioService } from '../../../services/servicio.service';
import { ContratoDto } from '../../../../../core/interfaces/contrato';
import { toast } from 'ngx-sonner';
import { Router } from '@angular/router';
import { ContratoService } from '../../../../admin/services/contrato.service';

@Component({
  selector: 'app-registrar-servicios',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registrar-servicios.component.html'
})
export class RegistrarServiciosComponent implements OnInit {
  form!: FormGroup;
  contratos: ContratoDto[] = [];
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private servicioService: ServicioService,
    private contratoService: ContratoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      precio: ['', [Validators.required, Validators.min(0)]],
      contratoId: ['', Validators.required],
    });
    this.cargarContratos();
  }

  cargarContratos(): void {
    this.contratoService.obtenerContratos().subscribe({
      next: (data) => this.contratos = data,
      error: () => {
        this.contratos = [];
        toast.error('Error cargando contratos');
      }
    });
  }

  isRequired(control: string): boolean {
    const field = this.form.get(control);
    return !!field?.touched && field.hasError('required');
  }

  guardarServicio(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.servicioService.crearServicio(this.form.value).subscribe({
      next: () => {
        toast.success('Servicio creado');
        this.successMessage = 'Servicio creado';
        this.errorMessage = null;
        this.form.reset();
        this.router.navigate(['/user/servicios-list']);
      },
      error: () => {
        toast.error('Error al crear servicio');
        this.errorMessage = 'Error al crear servicio';
        this.successMessage = null;
      }
    });
  }
}
