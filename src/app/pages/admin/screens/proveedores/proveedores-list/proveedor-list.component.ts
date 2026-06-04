import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProveedorService } from '../../../services/proveedores.service';
import { ProveedorDto } from '../../../../../core/interfaces/proveedor';
import { toast } from 'ngx-sonner';
import { Router } from '@angular/router';

@Component({
  selector: 'app-proveedores-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './proveedor-list.component.html'
})
export class ProveedorListComponent implements OnInit {
  proveedores: ProveedorDto[] = [];
  editIndex: number | null = null;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(private proveedorService: ProveedorService, private router: Router) {}

    irACrearProveedor(): void {
    this.router.navigate(['/admin/registrar-proveedores']);
  }

  ngOnInit(): void {
    this.cargarProveedores();
  }

  cargarProveedores(): void {
    this.proveedorService.obtenerProveedores().subscribe({
      next: (data) => this.proveedores = data,
      error: () => {
        this.errorMessage = 'Error al cargar proveedores ❌';
        this.successMessage = null;
      }
    });
  }

  editarProveedor(index: number): void {
    this.editIndex = index;
  }

  cancelarEdicion(): void {
    this.editIndex = null;
    this.cargarProveedores(); // recarga para descartar cambios locales
  }

  guardarEdicion(proveedor: ProveedorDto, index: number): void {
    this.proveedorService.actualizarProveedor(proveedor.id, {
      nit: proveedor.nit ?? '',
      nombre: proveedor.nombre ?? '',
      representanteLegal: proveedor.representanteLegal ?? ''
    }).subscribe({
      next: () => {
        toast.success('Proveedor actualizado');
        this.errorMessage = null;
        this.editIndex = null;
        this.cargarProveedores();
      },
      error: () => {
        toast.error('Error al actualizar proveedor');
        this.errorMessage = 'Error al actualizar proveedor';
        this.successMessage = null;
      }
    });
  }

  eliminarProveedor(id: number): void {
    if (confirm('¿Seguro que deseas eliminar este proveedor?')) {
      this.proveedorService.eliminarProveedor(id).subscribe({
        next: () => {
          toast.success('Proveedor eliminado');
          this.successMessage = 'Proveedor eliminado';
          this.errorMessage = null;
          this.cargarProveedores();
        },
        error: () => {
          this.errorMessage = 'Error al eliminar proveedor';
          this.successMessage = null;
        }
      });
    }
  }

 
}
