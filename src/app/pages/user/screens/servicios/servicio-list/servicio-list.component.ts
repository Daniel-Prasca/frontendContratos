import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { toast } from 'ngx-sonner';
import { Router } from '@angular/router';
import { ServicioService } from '../../../services/servicio.service';
import { ServicioDto } from '../../../../../core/interfaces/servicio';


@Component({
  selector: 'app-servicio-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './servicio-list.component.html'
})
export class ServicioListComponent implements OnInit {
  servicios: ServicioDto[] = [];
  editIndex: number | null = null;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(private servicioService: ServicioService, private router: Router) {}

  irACrearServicio(): void {
    this.router.navigate(['/user/registrar-servicios']);
  }

  ngOnInit(): void {
    this.cargarServicios();
  }

  cargarServicios(): void {
    this.servicioService.obtenerServicios().subscribe({
      next: (data) => this.servicios = data,
      error: () => {
        this.errorMessage = 'Error al cargar servicios ❌';
        this.successMessage = null;
      }
    });
  }

  editarServicio(index: number): void {
    this.editIndex = index;
  }

  cancelarEdicion(): void {
    this.editIndex = null;
    this.cargarServicios();
  }

  guardarEdicion(servicio: ServicioDto, index: number): void {
    this.servicioService.actualizarServicio(servicio.id, {
      nombre: servicio.nombre,
      precio: servicio.precio,
      contratoId: servicio.contratoId
    }).subscribe({
      next: () => {
        toast.success('Servicio actualizado');
        this.errorMessage = null;
        this.editIndex = null;
        this.cargarServicios();
      },
      error: () => {
        toast.error('Error al actualizar servicio');
        this.errorMessage = 'Error al actualizar servicio';
        this.successMessage = null;
      }
    });
  }

  eliminarServicio(id: number): void {
    if (confirm('¿Seguro que deseas eliminar este servicio?')) {
      this.servicioService.eliminarServicio(id).subscribe({
        next: () => {
          toast.success('Servicio eliminado');
          this.successMessage = 'Servicio eliminado';
          this.errorMessage = null;
          this.cargarServicios();
        },
        error: () => {
          toast.error('No puedes eliminar un servicio asociado a un contrato o liquidación');
          this.successMessage = null;
        }
      });
    }
  }
}
