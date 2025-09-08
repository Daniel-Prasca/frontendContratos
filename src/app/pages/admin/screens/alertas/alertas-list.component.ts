import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { toast } from 'ngx-sonner';
import { ContratoService } from '../../services/contrato.service';
import { PolizaService } from '../../services/poliza.service';

interface Alerta {
  tipo: 'Contrato' | 'Póliza';
  id: number;
  fechaVencimiento: Date;
  diasRestantes: number;
  descripcion: string;  
}

@Component({
  selector: 'app-alertas-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alertas-list.component.html'
})
export class AlertasListComponent implements OnInit {
  alertas: Alerta[] = [];
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private contratoService: ContratoService,
    private polizaService: PolizaService
  ) {}

  ngOnInit(): void {
    this.cargarAlertas();
  }

 cargarAlertas(): void {
  const limiteDias = 14;
  const hoy = new Date();

  this.contratoService.obtenerContratos().subscribe({
    next: (contratos) => {
      this.polizaService.obtenerPolizas().subscribe({
        next: (polizas) => {
          const contratosAlertas: Alerta[] = contratos
            .filter(c => {
              const fechaFin = new Date(c.fechaFin);
              return fechaFin >= hoy && (fechaFin.getTime() - hoy.getTime()) / (1000*60*60*24) <= limiteDias;
            })
            .map(c => {
              const fechaFin = new Date(c.fechaFin);
              const diffDays = Math.ceil((fechaFin.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
              return {
                tipo: 'Contrato',
                id: c.id,
                fechaVencimiento: fechaFin,
                diasRestantes: diffDays,
                descripcion: c.proveedorNombre ?? 'Proveedor desconocido'  // Mostrar nombre proveedor aquí
              };
            });

          const polizasAlertas: Alerta[] = polizas
            .filter(p => {
              const fechaVen = new Date(p.fechaVencimiento);
              return fechaVen >= hoy && (fechaVen.getTime() - hoy.getTime()) / (1000*60*60*24) <= limiteDias;
            })
            .map(p => {
              const fechaVen = new Date(p.fechaVencimiento);
              const diffDays = Math.ceil((fechaVen.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
              return {
                tipo: 'Póliza',
                id: p.id,
                fechaVencimiento: fechaVen,
                diasRestantes: diffDays,
                descripcion: p.tipo  // Mostrar tipo póliza aquí
              };
            });

          this.alertas = [...contratosAlertas, ...polizasAlertas]
            .sort((a, b) => a.fechaVencimiento.getTime() - b.fechaVencimiento.getTime());

          this.errorMessage = null;
        },
        error: () => {
          this.errorMessage = 'Error al cargar pólizas';
          this.alertas = [];
        }
      });
    },
    error: () => {
      this.errorMessage = 'Error al cargar contratos';
      this.alertas = [];
    }
  });
}
}
