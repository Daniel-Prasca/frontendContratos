import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { toast } from 'ngx-sonner';
import { Router } from '@angular/router';
import { ContratoService } from '../../../services/contrato.service';
import { ContratoDto } from '../../../../../core/interfaces/contrato';

@Component({
  selector: 'app-contratos-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contrato-list.component.html'
})
export class ContratoListComponent implements OnInit {
  contratos: ContratoDto[] = [];
  editIndex: number | null = null;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(private contratoService: ContratoService, private router: Router) {}

  irACrearContrato(): void {
    this.router.navigate(['/admin/registrar-contratos']);
  }

  ngOnInit(): void {
    this.cargarContratos();
  }

  cargarContratos(): void {
    this.contratoService.obtenerContratos().subscribe({
      next: (data) => this.contratos = data,
      error: () => {
        this.errorMessage = 'Error al cargar contratos ❌';
        this.successMessage = null;
      }
    });
  }

  editarContrato(index: number): void {
    this.editIndex = index;
  }

  cancelarEdicion(): void {
    this.editIndex = null;
    this.cargarContratos();
  }

  guardarEdicion(contrato: ContratoDto, index: number): void {
    this.contratoService.actualizarContrato(contrato.id, {
      proveedorId: contrato.proveedorId,
      objeto: contrato.objeto ?? '',
      fechaInicio: contrato.fechaInicio,
      fechaFin: contrato.fechaFin
    }).subscribe({
      next: () => {
        toast.success('Contrato actualizado');
        this.errorMessage = null;
        this.editIndex = null;
        this.cargarContratos();
      },
      error: () => {
        toast.error('Error al actualizar contrato');
        this.errorMessage = 'Error al actualizar contrato';
        this.successMessage = null;
      }
    });
  }

  eliminarContrato(id: number): void {
    if (confirm('¿Seguro que deseas eliminar este contrato?')) {
      this.contratoService.eliminarContrato(id).subscribe({
        next: () => {
          toast.success('Contrato eliminado');
          this.successMessage = 'Contrato eliminado';
          this.errorMessage = null;
          this.cargarContratos();
        },
        error: () => {
          this.errorMessage = 'Error al eliminar contrato';
          this.successMessage = null;
        }
      });
    }
  }
}
