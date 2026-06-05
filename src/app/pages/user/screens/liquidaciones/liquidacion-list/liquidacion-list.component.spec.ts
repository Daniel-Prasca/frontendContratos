import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { LiquidacionListComponent } from './liquidacion-list.component';
import { LiquidacionService } from '../../../services/liquidacion.service';
import { ServicioService } from '../../../services/servicio.service';
import { AuthService } from '../../../../../auth/services/auth.service';
import { UserAuthService } from '../../../../../auth/services/user.service';
import { AuthStateService } from '../../../../../shared/services/auth-state.service';
import { LiquidacionDto } from '../../../../../core/interfaces/liquidacion';
import { ServicioDto } from '../../../../../core/interfaces/servicio';
import { UserDto } from '../../../../../core/interfaces/auth.models';
import { environment } from '../../../../../../environments/environments';

describe('LiquidacionListComponent - integración', () => {
  let fixture: ComponentFixture<LiquidacionListComponent>;
  let component: LiquidacionListComponent;
  let httpMock: HttpTestingController;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let userAuthServiceSpy: jasmine.SpyObj<UserAuthService>;
  let authStateSpy: jasmine.SpyObj<AuthStateService>;

  const LIQ_BASE  = `${environment.apiUrl}/liquidaciones`;
  const SERV_BASE = `${environment.apiUrl}/servicios`;

  const usuarioAdmin: UserDto = { id: 1, nombre: 'Admin', email: 'admin@test.com', role: 'Admin' };
  const usuarioUser:  UserDto = { id: 2, nombre: 'User',  email: 'user@test.com',  role: 'User'  };

  const serviciosMock: ServicioDto[] = [
    { id: 1, nombre: 'Serv A', precio: 100, contratoId: 1, contratoObjeto: 'Contrato A' },
  ];

  const liquidacionesMock: LiquidacionDto[] = [
    { id: 1, contratoId: 1, contratoObjeto: 'Objeto A', servicioId: 1, servicioNombre: 'Serv A',
      usuarioId: 1, usuarioNombre: 'Admin', cantidad: 2, total: 200, estado: 'Pendiente', fecha: '2025-01-01' },
  ];

  const setupTest = async (usuario: UserDto) => {
    const userSubject = new BehaviorSubject<UserDto | null>(null);
    authServiceSpy     = jasmine.createSpyObj('AuthService',     ['getToken', 'getUser']);
    userAuthServiceSpy = jasmine.createSpyObj('UserAuthService', ['getAllUsers', 'obtenerUsuarioPorId']);
    authStateSpy       = jasmine.createSpyObj('AuthStateService', ['getToken', 'logout'], {
      user$: userSubject.asObservable(),
    });

    authServiceSpy.getToken.and.returnValue('token-prueba');
    authServiceSpy.getUser.and.returnValue(usuario);

    await TestBed.configureTestingModule({
      imports: [LiquidacionListComponent, HttpClientTestingModule, RouterTestingModule, FormsModule],
      providers: [
        LiquidacionService,
        ServicioService,
        { provide: AuthService,      useValue: authServiceSpy     },
        { provide: UserAuthService,  useValue: userAuthServiceSpy },
        { provide: AuthStateService, useValue: authStateSpy       },
      ],
    }).compileComponents();

    fixture   = TestBed.createComponent(LiquidacionListComponent);
    component = fixture.componentInstance;
    httpMock  = TestBed.inject(HttpTestingController);
  };

  afterEach(() => {
    httpMock.verify();
    TestBed.resetTestingModule();
  });

  it('debe crearse el componente', fakeAsync(async () => {
    await setupTest(usuarioAdmin);
    fixture.detectChanges();
    httpMock.expectOne(SERV_BASE).flush(serviciosMock);
    httpMock.expectOne(LIQ_BASE).flush(liquidacionesMock);
    tick();
    expect(component).toBeTruthy();
  }));

  it('Admin debe cargar todas las liquidaciones', fakeAsync(async () => {
    await setupTest(usuarioAdmin);
    fixture.detectChanges();
    httpMock.expectOne(SERV_BASE).flush(serviciosMock);
    httpMock.expectOne(LIQ_BASE).flush(liquidacionesMock);
    tick();
    expect(component.liquidaciones.length).toBe(1);
  }));

  it('User debe cargar sus liquidaciones por usuario', fakeAsync(async () => {
    await setupTest(usuarioUser);
    fixture.detectChanges();
    httpMock.expectOne(SERV_BASE).flush(serviciosMock);
    httpMock.expectOne(`${LIQ_BASE}/usuario/2`).flush(liquidacionesMock);
    tick();
    expect(component.liquidaciones.length).toBe(1);
  }));

  it('debe mostrar errorMessage si no hay usuario autenticado', fakeAsync(async () => {
    await setupTest(usuarioAdmin);
    authServiceSpy.getUser.and.returnValue(null);
    fixture.detectChanges();
    httpMock.expectOne(SERV_BASE).flush(serviciosMock);
    tick();
    expect(component.errorMessage).toBe('Usuario no autenticado');
  }));

  it('editarLiquidacion debe activar el modo edición', fakeAsync(async () => {
    await setupTest(usuarioAdmin);
    fixture.detectChanges();
    httpMock.expectOne(SERV_BASE).flush(serviciosMock);
    httpMock.expectOne(LIQ_BASE).flush(liquidacionesMock);
    tick();
    component.editarLiquidacion(0);
    expect(component.editIndex).toBe(0);
  }));

  it('cancelarEdicion debe desactivar edición y recargar liquidaciones', fakeAsync(async () => {
    await setupTest(usuarioAdmin);
    fixture.detectChanges();
    httpMock.expectOne(SERV_BASE).flush(serviciosMock);
    httpMock.expectOne(LIQ_BASE).flush(liquidacionesMock);
    tick();
    component.editarLiquidacion(0);
    component.cancelarEdicion();
    httpMock.expectOne(LIQ_BASE).flush(liquidacionesMock);
    tick();
    expect(component.editIndex).toBeNull();
  }));

  it('recalcularTotal debe actualizar el total de la liquidación', fakeAsync(async () => {
    await setupTest(usuarioAdmin);
    fixture.detectChanges();
    httpMock.expectOne(SERV_BASE).flush(serviciosMock);
    httpMock.expectOne(LIQ_BASE).flush(liquidacionesMock);
    tick();
    component.servicios = serviciosMock;
    const liq = { ...liquidacionesMock[0], cantidad: 3 };
    component.recalcularTotal(liq);
    expect(liq.total).toBe(300);
  }));

  it('guardarEdicion debe hacer PUT y recargar', fakeAsync(async () => {
    await setupTest(usuarioAdmin);
    fixture.detectChanges();
    httpMock.expectOne(SERV_BASE).flush(serviciosMock);
    httpMock.expectOne(LIQ_BASE).flush(liquidacionesMock);
    tick();
    component.servicios = serviciosMock;
    component.guardarEdicion(liquidacionesMock[0], 0);
    const put = httpMock.expectOne(`${LIQ_BASE}/1`);
    expect(put.request.method).toBe('PUT');
    put.flush({});
    tick();
    httpMock.expectOne(LIQ_BASE).flush(liquidacionesMock);
    tick();
    expect(component.editIndex).toBeNull();
  }));

  it('eliminarLiquidacion debe hacer DELETE si el usuario confirma', fakeAsync(async () => {
    spyOn(window, 'confirm').and.returnValue(true);
    await setupTest(usuarioAdmin);
    fixture.detectChanges();
    httpMock.expectOne(SERV_BASE).flush(serviciosMock);
    httpMock.expectOne(LIQ_BASE).flush(liquidacionesMock);
    tick();
    component.eliminarLiquidacion(1);
    httpMock.expectOne(`${LIQ_BASE}/1`).flush({});
    tick();
    httpMock.expectOne(LIQ_BASE).flush([]);
    tick();
    expect(component.successMessage).toBe('Liquidación eliminada');
  }));
});
