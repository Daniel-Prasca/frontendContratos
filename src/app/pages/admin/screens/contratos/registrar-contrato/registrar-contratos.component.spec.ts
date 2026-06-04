import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { RegistrarContratosComponent } from './registrar-contratos.component';
import { ContratoService } from '../../../services/contrato.service';
import { ProveedorService } from '../../../services/proveedores.service';
import { ProveedorDto } from '../../../../../core/interfaces/proveedor';
import { Router } from '@angular/router';

describe('RegistrarContratosComponent - unitaria', () => {
  let fixture: ComponentFixture<RegistrarContratosComponent>;
  let component: RegistrarContratosComponent;
  let contratoServiceSpy: jasmine.SpyObj<ContratoService>;
  let proveedorServiceSpy: jasmine.SpyObj<ProveedorService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const proveedoresMock: ProveedorDto[] = [
    { id: 1, nit: '123', nombre: 'Empresa A', representanteLegal: 'Juan' },
    { id: 2, nit: '456', nombre: 'Empresa B', representanteLegal: 'Pedro' },
  ];

  const formValido = {
    proveedorId: 1,
    objeto: 'Contrato de prueba',
    fechaInicio: '2025-01-01',
    fechaFin: '2025-12-31',
  };

  beforeEach(async () => {
    contratoServiceSpy  = jasmine.createSpyObj('ContratoService',  ['crearContrato']);
    proveedorServiceSpy = jasmine.createSpyObj('ProveedorService', ['obtenerProveedores']);
    routerSpy           = jasmine.createSpyObj('Router', ['navigate']);

    proveedorServiceSpy.obtenerProveedores.and.returnValue(of(proveedoresMock));

    await TestBed.configureTestingModule({
      imports: [
        RegistrarContratosComponent,
        ReactiveFormsModule,
        HttpClientTestingModule,
        RouterTestingModule,
      ],
      providers: [
        { provide: ContratoService,  useValue: contratoServiceSpy  },
        { provide: ProveedorService, useValue: proveedorServiceSpy },
        { provide: Router,           useValue: routerSpy           },
      ],
    }).compileComponents();

    fixture   = TestBed.createComponent(RegistrarContratosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // ── Creación ──────────────────────────────────────────────
  it('debe crearse el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe cargar proveedores al iniciar', () => {
    expect(proveedorServiceSpy.obtenerProveedores).toHaveBeenCalled();
    expect(component.proveedores.length).toBe(2);
  });

  // ── Validación del formulario ─────────────────────────────
  it('el formulario debe ser inválido cuando está vacío', () => {
    expect(component.form.invalid).toBeTrue();
  });

  it('el formulario debe ser válido con todos los campos completos', () => {
    component.form.setValue(formValido);
    expect(component.form.valid).toBeTrue();
  });

  it('campo objeto es requerido', () => {
    component.form.patchValue({ objeto: '' });
    expect(component.form.get('objeto')?.hasError('required')).toBeTrue();
  });

  it('campo proveedorId es requerido', () => {
    component.form.patchValue({ proveedorId: '' });
    expect(component.form.get('proveedorId')?.hasError('required')).toBeTrue();
  });

  it('campo fechaInicio es requerido', () => {
    component.form.patchValue({ fechaInicio: '' });
    expect(component.form.get('fechaInicio')?.hasError('required')).toBeTrue();
  });

  it('campo fechaFin es requerido', () => {
    component.form.patchValue({ fechaFin: '' });
    expect(component.form.get('fechaFin')?.hasError('required')).toBeTrue();
  });

  // ── Comportamiento al guardar ─────────────────────────────
  it('NO debe llamar al servicio si el formulario es inválido', () => {
    component.guardarContrato();
    expect(contratoServiceSpy.crearContrato).not.toHaveBeenCalled();
  });

  it('debe marcar todos los campos como tocados si el formulario es inválido', () => {
    component.guardarContrato();
    expect(component.form.touched).toBeTrue();
  });

  it('debe llamar a crearContrato cuando el formulario es válido', () => {
    contratoServiceSpy.crearContrato.and.returnValue(of({ id: 10, ...formValido, proveedorNombre: 'Empresa A' }));
    component.form.setValue(formValido);
    component.guardarContrato();
    expect(contratoServiceSpy.crearContrato).toHaveBeenCalledWith(formValido);
  });

  it('debe navegar a contratos-list después de crear exitosamente', () => {
    contratoServiceSpy.crearContrato.and.returnValue(of({ id: 10, ...formValido, proveedorNombre: 'Empresa A' }));
    component.form.setValue(formValido);
    component.guardarContrato();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/admin/contratos-list']);
  });

  it('debe mostrar errorMessage si falla la creación', () => {
    contratoServiceSpy.crearContrato.and.returnValue(throwError(() => new Error('Error de red')));
    component.form.setValue(formValido);
    component.guardarContrato();
    expect(component.errorMessage).toBe('Error al crear contrato');
  });
});
