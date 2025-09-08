import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PolizaService } from '../../../services/poliza.service';
import { ContratoService } from '../../../services/contrato.service';  // Importar servicio contratos
import { ContratoDto } from '../../../../../core/interfaces/contrato';  // Importar interfaz contrato
import { toast } from 'ngx-sonner';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registrar-polizas',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registrar-polizas.component.html'
})
export class RegistrarPolizasComponent implements OnInit {
  form!: FormGroup;
  contratos: ContratoDto[] = [];  // Arreglo para contratos
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private polizaService: PolizaService,
    private contratoService: ContratoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      contratoId: ['', Validators.required],
      tipo: ['', Validators.required],
      fechaVencimiento: ['', Validators.required],
      estado: ['', Validators.required],
    });

    this.cargarContratos();
  }

  cargarContratos(): void {
    this.contratoService.obtenerContratos().subscribe({
      next: (data) => this.contratos = data,
      error: () => {
        this.contratos = [];
        toast.error('Error al cargar contratos');
      }
    });
  }

  isRequired(control: string): boolean {
    const field = this.form.get(control);
    return !!field?.touched && field.hasError('required');
  }

  guardarPoliza(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.polizaService.crearPoliza(this.form.value).subscribe({
      next: () => {
        toast.success('Póliza creada');
        this.successMessage = 'Póliza creada';
        this.errorMessage = null;
        this.form.reset();
        this.router.navigate(['/admin/polizas-list']);
      },
      error: () => {
        toast.error('Error al crear póliza');
        this.errorMessage = 'Error al crear póliza';
        this.successMessage = null;
      }
    });
  }
}
