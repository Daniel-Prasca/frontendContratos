import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LiquidacionService } from '../../../services/liquidacion.service';
import { ContratoService } from '../../../../admin/services/contrato.service';
import { ServicioService } from '../../../services/servicio.service';
import { ContratoDto } from '../../../../../core/interfaces/contrato';
import { ServicioDto } from '../../../../../core/interfaces/servicio';
import { toast } from 'ngx-sonner';
import { Router } from '@angular/router';
import { UserDto } from '../../../../../core/interfaces/auth.models';
import { UserAuthService } from '../../../../../auth/services/user.service';
import { AuthService } from '../../../../../auth/services/auth.service';

@Component({
  selector: 'app-registrar-liquidaciones',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registrar-liquidaciones.component.html',
})
export class RegistrarLiquidacionesComponent implements OnInit {
  form!: FormGroup;
  contratos: ContratoDto[] = [];
  servicios: ServicioDto[] = [];
  loading = false;
  error = '';
  usuario: UserDto | null = null;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private liquidacionService: LiquidacionService,
    private contratoService: ContratoService,
    private servicioService: ServicioService,
    private userService: UserAuthService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.usuario = this.authService.getUser();
    this.form = this.fb.group({
      contratoId: ['', Validators.required],
      servicioId: ['', Validators.required],
      usuarioId: [this.usuario?.id, Validators.required],
      cantidad: ['', [Validators.required, Validators.min(1)]],
      total: [{ value: '', disabled: true }],  // total deshabilitado
      estado: ['Pendiente', Validators.required],
    });

    this.cargarContratos();
    this.cargarServicios();
    // this.cargarUsuarios();

    this.form.get('cantidad')?.valueChanges.subscribe(() => this.calcularTotal());
    this.form.get('servicioId')?.valueChanges.subscribe(() => this.calcularTotal());
  }

  cargarContratos(): void {
    this.contratoService.obtenerContratos().subscribe({
      next: (data) => (this.contratos = data),
      error: () => {
        this.contratos = [];
        toast.error('Error cargando contratos');
      },
    });
  }

  cargarServicios(): void {
    this.servicioService.obtenerServicios().subscribe({
      next: (data) => (this.servicios = data),
      error: () => {
        this.servicios = [];
        toast.error('Error cargando servicios');
      },
    });
  }

  // cargarUsuarios(): void {
  //   this.loading = true;
  //   this.userService.getAllUsers().subscribe({
  //     next: (usuarios) => {
  //       this.usuarios = usuarios
  //       this.loading = false;},
  //     error: (error) => {
  //       this.error = 'Error cargando usuarios';
  //       this.loading = false;
  //     }
  //   });
  // }

  calcularTotal(): void {
    const servicioId = this.form.get('servicioId')?.value;
    const cantidad = this.form.get('cantidad')?.value;

    if (servicioId && cantidad && cantidad > 0) {
      const servicio = this.servicios.find((s) => s.id === +servicioId);
      if (servicio) {
        const total = servicio.precio * +cantidad;
        this.form.get('total')?.setValue(total.toFixed(2), { emitEvent: false });
        return;
      }
    }
    this.form.get('total')?.setValue(null, { emitEvent: false });
  }

  isRequired(control: string): boolean {
    const field = this.form.get(control);
    return !!field?.touched && field.hasError('required');
  }

  guardarLiquidacion(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    // Usar getRawValue para incluir campos deshabilitados como total
    const liquidacionData = this.form.getRawValue();

    this.liquidacionService.crearLiquidacion(liquidacionData).subscribe({
      next: () => {
        toast.success('Liquidación creada');
        this.successMessage = 'Liquidación creada';
        this.errorMessage = null;
        this.form.reset({ estado: 'Pendiente', total: '' });
        this.router.navigate(['user/liquidaciones-list']);
      },
      error: () => {
        toast.error('Error al crear liquidación');
        this.errorMessage = 'Error al crear liquidación';
        this.successMessage = null;
      },
    });
  }
}
