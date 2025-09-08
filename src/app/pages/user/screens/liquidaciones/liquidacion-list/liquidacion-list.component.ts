import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { toast } from 'ngx-sonner';
import { Router } from '@angular/router';
import { LiquidacionService } from '../../../services/liquidacion.service';
import { LiquidacionDto } from '../../../../../core/interfaces/liquidacion';
import { UserAuthService } from '../../../../../auth/services/user.service';
import { AuthService } from '../../../../../auth/services/auth.service';
import { ServicioService } from '../../../services/servicio.service';
import { ServicioDto } from '../../../../../core/interfaces/servicio';
import { HasRoleDirective } from '../../../../../core/guards/has-role.directive';

@Component({
  selector: 'app-liquidacion-list',
  standalone: true,
  imports: [CommonModule, FormsModule, HasRoleDirective],
  templateUrl: './liquidacion-list.component.html',
})
export class LiquidacionListComponent implements OnInit {
  liquidaciones: LiquidacionDto[] = [];
  servicios: ServicioDto[] = [];
  editIndex: number | null = null;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  role: string ='';
  constructor(
    private liquidacionService: LiquidacionService,
    private router: Router,
    private authService: UserAuthService,
    private userAuthService: AuthService,
    private servicioService: ServicioService
  ) {}

  irACrearLiquidacion(): void {
    this.router.navigate(['/user/registrar-liquidaciones']);
  }

  ngOnInit(): void {
    const usuario = this.userAuthService.getUser();
    this.role = usuario?.role || '';
    this.cargarServicios();
    this.cargarLiquidaciones();
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

  cargarLiquidaciones(): void {
    const usuario = this.userAuthService.getUser();

    if (!usuario || !usuario.id) {
      this.errorMessage = 'Usuario no autenticado';
      this.liquidaciones = [];
      return;
    }

    
    if (usuario.role === 'Admin') {
      
      this.liquidacionService.obtenerLiquidaciones().subscribe({
        next: (data) => {
          this.liquidaciones = data;
          this.errorMessage = null;
        },
        error: () => {
          this.errorMessage = 'Error al cargar liquidaciones ❌';
          this.successMessage = null;
        },
      });
    } else {
      this.liquidacionService.obtenerLiquidacionesPorUsuario(usuario.id).subscribe({
        next: (data) => {
          this.liquidaciones = data;
          this.errorMessage = null;
        },
        error: () => {
          this.errorMessage = 'Error al cargar liquidaciones ❌';
          this.successMessage = null;
        },
      });
    }
  }


  editarLiquidacion(index: number): void {
    this.editIndex = index;
  }

  cancelarEdicion(): void {
    this.editIndex = null;
    this.cargarLiquidaciones();
  }

  // Nueva función para recalcular el total al editar cantidad o servicio
  recalcularTotal(liquidacion: LiquidacionDto): void {
    const servicio = this.servicios.find((s) => s.id === liquidacion.servicioId);
    if (servicio) {
      liquidacion.total = +(servicio.precio * liquidacion.cantidad).toFixed(2);
    }
  }

  guardarEdicion(liquidacion: LiquidacionDto, index: number): void {
    // Recalcular total antes de guardar
    this.recalcularTotal(liquidacion);

    this.liquidacionService.actualizarLiquidacion(liquidacion.id, {
      cantidad: liquidacion.cantidad,
      total: liquidacion.total,
      estado: liquidacion.estado,
    }).subscribe({
      next: () => {
        toast.success('Liquidación actualizada');
        this.errorMessage = null;
        this.editIndex = null;
        this.cargarLiquidaciones();
      },
      error: () => {
        toast.error('Error al actualizar liquidación');
        this.errorMessage = 'Error al actualizar liquidación';
        this.successMessage = null;
      },
    });
  }

  eliminarLiquidacion(id: number): void {
    if (confirm('¿Seguro que deseas eliminar esta liquidación?')) {
      this.liquidacionService.eliminarLiquidacion(id).subscribe({
        next: () => {
          toast.success('Liquidación eliminada');
          this.successMessage = 'Liquidación eliminada';
          this.errorMessage = null;
          this.cargarLiquidaciones();
        },
        error: () => {
          this.errorMessage = 'Error al eliminar liquidación';
          this.successMessage = null;
        },
      });
    }
  }
}
