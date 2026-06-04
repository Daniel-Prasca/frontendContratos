import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { RegistrarLiquidacionesComponent } from './registrar-liquidaciones.component';
import { LiquidacionService } from '../../../services/liquidacion.service';
import { ContratoService } from '../../../../admin/services/contrato.service';
import { ServicioService } from '../../../services/servicio.service';
import { AuthService } from '../../../../../auth/services/auth.service';
import { UserAuthService } from '../../../../../auth/services/user.service';
import { Router } from '@angular/router';
import { ContratoDto } from '../../../../../core/interfaces/contrato';
import { ServicioDto } from '../../../../../core/interfaces/servicio';

describe('RegistrarLiquidacionesComponent - unitaria', () => {
  let fixture: ComponentFixture<RegistrarLiquidacionesComponent>;
  let component: RegistrarLiquidacionesComponent;
  let liquidacionServiceSpy: jasmine.SpyObj<LiquidacionService>;
  let contratoServiceSpy: jasmine.SpyObj<ContratoService>;
  let servicioServiceSpy: jasmine.SpyObj<ServicioService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const contratosMock: ContratoDto[] = [
    { id: 1, proveedorId: 10, objeto: 'Contrato A', fechaInicio: '2025-01-01', fechaFin: '2025-12-31' },
  ];

  const serviciosMock: ServicioDto[] = [
    { id: 1, nombre: 'Servicio A', precio: 100, contratoId: 1, contratoObjeto: 'Contrato A' },
    { id: 2, nombre: 'Servicio B', precio: 250, contratoId: 1, contratoObjeto: 'Contrato A' },
  ];

  const usuarioMock = { id: 5, nombre: 'Juan', email: 'juan@test.com', role: 'User' };

  beforeEach(async () => {
    liquidacionServiceSpy = jasmine.createSpyObj('LiquidacionService', ['crearLiquidacion']);
    contratoServiceSpy    = jasmine.createSpyObj('ContratoService',    ['obtenerContratos']);
    servicioServiceSpy    = jasmine.createSpyObj('ServicioService',    ['obtenerServicios']);
    authServiceSpy        = jasmine.createSpyObj('AuthService',        ['getUser', 'getToken']);
    routerSpy             = jasmine.createSpyObj('Router', ['navigate']);

    contratoServiceSpy.obtenerContratos.and.returnValue(of(contratosMock));
    servicioServiceSpy.obtenerServicios.and.returnValue(of(serviciosMock));
    authServiceSpy.getUser.and.returnValue(usuarioMock);
    authServiceSpy.getToken.and.returnValue('token');

    await TestBed.configureTestingModule({
      imports: [RegistrarLiquidacionesComponent, ReactiveFormsModule, HttpClientTestingModule, RouterTestingModule],
      providers: [
        { provide: LiquidacionService, useValue: liquidacionServiceSpy },
        { provide: ContratoService,    useValue: contratoServiceSpy    },
        { provide: ServicioService,    useValue: servicioServiceSpy    },
        { provide: AuthService,        useValue: authServiceSpy        },
        { provide: Router,             useValue: routerSpy             },
        UserAuthService,
      ],
    }).compileComponents();

    fixture   = TestBed.createComponent(RegistrarLiquidacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crearse el componente', () => expect(component).toBeTruthy());

  it('debe cargar contratos y servicios al iniciar', () => {
    expect(component.contratos.length).toBe(1);
    expect(component.servicios.length).toBe(2);
  });

  it('debe asignar el usuarioId del usuario logueado', () => {
    expect(component.form.get('usuarioId')?.value).toBe(5);
  });

  it('el formulario es inválido cuando está vacío (sin contratoId ni servicioId)', () => {
    component.form.patchValue({ contratoId: '', servicioId: '', cantidad: '' });
    expect(component.form.invalid).toBeTrue();
  });

  it('campo cantidad debe ser mínimo 1', () => {
    component.form.patchValue({ cantidad: 0 });
    expect(component.form.get('cantidad')?.hasError('min')).toBeTrue();
  });

  it('calcularTotal: calcula correctamente precio × cantidad', () => {
    component.form.patchValue({ servicioId: 1, cantidad: 3 });
    component.calcularTotal();
    expect(component.form.get('total')?.value).toBe('300.00');
  });

  it('calcularTotal: deja total en null si no hay servicio seleccionado', () => {
    component.form.patchValue({ servicioId: null, cantidad: 3 });
    component.calcularTotal();
    expect(component.form.get('total')?.value).toBeNull();
  });

  it('calcularTotal: deja total en null si cantidad es 0', () => {
    component.form.patchValue({ servicioId: 1, cantidad: 0 });
    component.calcularTotal();
    expect(component.form.get('total')?.value).toBeNull();
  });

  it('NO llama al servicio si el formulario es inválido', () => {
    component.form.patchValue({ contratoId: '', servicioId: '' });
    component.guardarLiquidacion();
    expect(liquidacionServiceSpy.crearLiquidacion).not.toHaveBeenCalled();
  });

  it('debe mostrar errorMessage si falla la creación', () => {
    liquidacionServiceSpy.crearLiquidacion.and.returnValue(throwError(() => new Error('Error')));
    component.form.patchValue({ contratoId: 1, servicioId: 1, usuarioId: 5, cantidad: 2, estado: 'Pendiente' });
    component.guardarLiquidacion();
    expect(component.errorMessage).toBe('Error al crear liquidación');
  });

  it('debe navegar a liquidaciones-list tras crear exitosamente', () => {
    liquidacionServiceSpy.crearLiquidacion.and.returnValue(of({
      id: 1, contratoId: 1, contratoObjeto: 'A', servicioId: 1,
      servicioNombre: 'S', usuarioId: 5, usuarioNombre: 'Juan',
      cantidad: 2, total: 200, estado: 'Pendiente', fecha: '2025-01-01'
    }));
    component.form.patchValue({ contratoId: 1, servicioId: 1, usuarioId: 5, cantidad: 2, estado: 'Pendiente' });
    component.guardarLiquidacion();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['user/liquidaciones-list']);
  });
});
