import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { RegistrarPolizasComponent } from './registrar-polizas.component';
import { PolizaService } from '../../../services/poliza.service';
import { ContratoService } from '../../../services/contrato.service';
import { ContratoDto } from '../../../../../core/interfaces/contrato';
import { Router } from '@angular/router';

describe('RegistrarPolizasComponent - unitaria', () => {
  let fixture: ComponentFixture<RegistrarPolizasComponent>;
  let component: RegistrarPolizasComponent;
  let polizaServiceSpy: jasmine.SpyObj<PolizaService>;
  let contratoServiceSpy: jasmine.SpyObj<ContratoService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const contratosMock: ContratoDto[] = [
    { id: 1, proveedorId: 10, objeto: 'Contrato A', fechaInicio: '2025-01-01', fechaFin: '2025-12-31' },
  ];

  const formValido = {
    contratoId: 1,
    tipo: 'Cumplimiento',
    fechaVencimiento: '2025-12-31',
    estado: 'Activa',
  };

  beforeEach(async () => {
    polizaServiceSpy   = jasmine.createSpyObj('PolizaService',   ['crearPoliza']);
    contratoServiceSpy = jasmine.createSpyObj('ContratoService', ['obtenerContratos']);
    routerSpy          = jasmine.createSpyObj('Router', ['navigate']);

    contratoServiceSpy.obtenerContratos.and.returnValue(of(contratosMock));

    await TestBed.configureTestingModule({
      imports: [RegistrarPolizasComponent, ReactiveFormsModule, HttpClientTestingModule, RouterTestingModule],
      providers: [
        { provide: PolizaService,   useValue: polizaServiceSpy   },
        { provide: ContratoService, useValue: contratoServiceSpy },
        { provide: Router,          useValue: routerSpy          },
      ],
    }).compileComponents();

    fixture   = TestBed.createComponent(RegistrarPolizasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crearse el componente', () => expect(component).toBeTruthy());

  it('debe cargar contratos al iniciar', () => {
    expect(contratoServiceSpy.obtenerContratos).toHaveBeenCalled();
    expect(component.contratos.length).toBe(1);
  });

  it('el formulario es inválido cuando está vacío', () => expect(component.form.invalid).toBeTrue());

  it('el formulario es válido con todos los campos completos', () => {
    component.form.setValue(formValido);
    expect(component.form.valid).toBeTrue();
  });

  it('campo contratoId es requerido', () => {
    component.form.patchValue({ contratoId: '' });
    expect(component.form.get('contratoId')?.hasError('required')).toBeTrue();
  });

  it('campo tipo es requerido', () => {
    component.form.patchValue({ tipo: '' });
    expect(component.form.get('tipo')?.hasError('required')).toBeTrue();
  });

  it('campo fechaVencimiento es requerido', () => {
    component.form.patchValue({ fechaVencimiento: '' });
    expect(component.form.get('fechaVencimiento')?.hasError('required')).toBeTrue();
  });

  it('campo estado es requerido', () => {
    component.form.patchValue({ estado: '' });
    expect(component.form.get('estado')?.hasError('required')).toBeTrue();
  });

  it('NO llama al servicio si el formulario es inválido', () => {
    component.guardarPoliza();
    expect(polizaServiceSpy.crearPoliza).not.toHaveBeenCalled();
  });

  it('debe llamar a crearPoliza con el formulario válido', () => {
    polizaServiceSpy.crearPoliza.and.returnValue(of({ id: 1, ...formValido }));
    component.form.setValue(formValido);
    component.guardarPoliza();
    expect(polizaServiceSpy.crearPoliza).toHaveBeenCalledWith(formValido);
  });

  it('debe navegar a polizas-list tras crear exitosamente', () => {
    polizaServiceSpy.crearPoliza.and.returnValue(of({ id: 1, ...formValido }));
    component.form.setValue(formValido);
    component.guardarPoliza();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/admin/polizas-list']);
  });

  it('debe mostrar errorMessage si falla la creación', () => {
    polizaServiceSpy.crearPoliza.and.returnValue(throwError(() => new Error('Error')));
    component.form.setValue(formValido);
    component.guardarPoliza();
    expect(component.errorMessage).toBe('Error al crear póliza');
  });
});
