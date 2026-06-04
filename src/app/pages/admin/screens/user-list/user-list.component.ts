import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../auth/services/auth.service';
import { UserDto } from '../../../../core/interfaces/auth.models';
import { CommonModule } from '@angular/common';
import { UserAuthService } from '../../../../auth/services/user.service';
import { toast } from 'ngx-sonner';
import { ContratoService } from '../../services/contrato.service';
import { PolizaService } from '../../services/poliza.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  standalone: true,
  imports: [CommonModule],
  styles: []
})
export class UserListComponent implements OnInit {
  users: UserDto[] = [];
  loading = false;
  error = '';

  constructor(
    private userAuthService: UserAuthService,
    private contratoService: ContratoService,
    private polizaService: PolizaService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
    this.mostrarAlertasToast();
  }

  loadUsers() {
    this.loading = true;
    this.userAuthService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error cargando usuarios';
        this.loading = false;
      }
    });
  }

  mostrarAlertasToast() {
    const limiteDias = 14;
    const hoy = new Date();

    this.contratoService.obtenerContratos().subscribe({
      next: (contratos) => {
        this.polizaService.obtenerPolizas().subscribe({
          next: (polizas) => {
            const contratosAlertas = contratos.filter(c => {
              const fechaFin = new Date(c.fechaFin);
              return fechaFin >= hoy && (fechaFin.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24) <= limiteDias;
            });
            const polizasAlertas = polizas.filter(p => {
              const fechaVen = new Date(p.fechaVencimiento);
              return fechaVen >= hoy && (fechaVen.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24) <= limiteDias;
            });

            const totalAlertas = contratosAlertas.length + polizasAlertas.length;

            if (totalAlertas > 0) {
              toast.info(`Hay ${totalAlertas} alerta(s) de vencimiento próximas.`, {
                position: 'bottom-center', // Mostrar en la parte inferior centro
                duration: 10000 
              });
            }
          },
          error: () => {
            // Manejo de errores si quieres
          }
        });
      },
      error: () => {
        // Manejo de errores si quieres
      }
    });
  }
}
