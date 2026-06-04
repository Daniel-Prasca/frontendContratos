import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PolizaService } from '../../../services/poliza.service';
import { PolizaDto } from '../../../../../core/interfaces/poliza';
import { toast } from 'ngx-sonner';
import { Router } from '@angular/router';

@Component({
  selector: 'app-polizas-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './polizas-list.component.html'
})
export class PolizasListComponent implements OnInit {
  polizas: PolizaDto[] = [];
  editIndex: number | null = null;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(private polizaService: PolizaService, private router: Router) {}

  irACrearPoliza(): void {
    this.router.navigate(['/admin/registrar-polizas']);
  }

  ngOnInit(): void {
    this.cargarPolizas();
  }

  cargarPolizas(): void {
    this.polizaService.obtenerPolizas().subscribe({
      next: (data) => (this.polizas = data),
      error: () => {
        this.errorMessage = 'Error al cargar pólizas ❌';
        this.successMessage = null;
      }
    });
  }

  editarPoliza(index: number): void {
    this.editIndex = index;
  }

  cancelarEdicion(): void {
    this.editIndex = null;
    this.cargarPolizas();
  }

  guardarEdicion(poliza: PolizaDto, index: number): void {
    this.polizaService.actualizarPoliza(poliza.id, {
      tipo: poliza.tipo ?? '',
      fechaVencimiento: poliza.fechaVencimiento ?? '',
      estado: poliza.estado ?? ''
    }).subscribe({
      next: () => {
        toast.success('Póliza actualizada');
        this.errorMessage = null;
        this.editIndex = null;
        this.cargarPolizas();
      },
      error: () => {
        toast.error('Error al actualizar póliza');
        this.errorMessage = 'Error al actualizar póliza';
        this.successMessage = null;
      }
    });
  }

  eliminarPoliza(id: number): void {
    if (confirm('¿Seguro que deseas eliminar esta póliza?')) {
      this.polizaService.eliminarPoliza(id).subscribe({
        next: () => {
          toast.success('Póliza eliminada');
          this.successMessage = 'Póliza eliminada';
          this.errorMessage = null;
          this.cargarPolizas();
        },
        error: () => {
          this.errorMessage = 'Error al eliminar póliza';
          this.successMessage = null;
        }
      });
    }
  }
}
