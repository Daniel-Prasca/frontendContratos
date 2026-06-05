import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserListComponent } from './user-list.component';
import { UserAuthService } from '../../../../auth/services/user.service';
import { ContratoService } from '../../services/contrato.service';
import { PolizaService } from '../../services/poliza.service';
import { AuthService } from '../../../../auth/services/auth.service';
import { environment } from '../../../../../environments/environments';

describe('UserListComponent - integración', () => {
  let fixture: ComponentFixture<UserListComponent>;
  let component: UserListComponent;
  let httpMock: HttpTestingController;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  const USERS_URL     = `${environment.apiUrl}/users`;
  const CONTRATOS_URL = `${environment.apiUrl}/contratos`;
  const POLIZAS_URL   = `${environment.apiUrl}/polizas`;

  const usersMock     = [
    { id: 1, firstName: 'Admin', email: 'admin@test.com', role: 'Admin' },
    { id: 2, firstName: 'Juan',  email: 'juan@test.com',  role: 'User'  },
  ];
  const contratosMock = [{ id: 1, proveedorId: 1, objeto: 'A', fechaInicio: '2025-01-01', fechaFin: '2025-01-01', proveedorNombre: 'X' }];
  const polizasMock   = [{ id: 1, tipo: 'Vida', fechaVencimiento: '2025-01-01', estado: 'Activa', contratoId: 1 }];

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getToken', 'getUser', 'isLoggedIn']);
    authServiceSpy.getToken.and.returnValue('token-prueba');

    await TestBed.configureTestingModule({
      imports: [UserListComponent, HttpClientTestingModule],
      providers: [
        UserAuthService,
        ContratoService,
        PolizaService,
        { provide: AuthService, useValue: authServiceSpy },
      ],
    }).compileComponents();

    fixture   = TestBed.createComponent(UserListComponent);
    component = fixture.componentInstance;
    httpMock  = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('debe crearse el componente', fakeAsync(() => {
    fixture.detectChanges();
    httpMock.expectOne(USERS_URL).flush(usersMock);
    httpMock.expectOne(CONTRATOS_URL).flush(contratosMock);
    httpMock.expectOne(POLIZAS_URL).flush(polizasMock);
    tick();
    expect(component).toBeTruthy();
  }));

  it('debe cargar la lista de usuarios en ngOnInit', fakeAsync(() => {
    fixture.detectChanges();
    httpMock.expectOne(USERS_URL).flush(usersMock);
    httpMock.expectOne(CONTRATOS_URL).flush(contratosMock);
    httpMock.expectOne(POLIZAS_URL).flush(polizasMock);
    tick();
    expect(component.users.length).toBe(2);
    expect(component.loading).toBeFalse();
  }));

  it('debe asignar error si falla la carga de usuarios', fakeAsync(() => {
    fixture.detectChanges();
    httpMock.expectOne(USERS_URL).flush('err', { status: 500, statusText: 'Error' });
    httpMock.expectOne(CONTRATOS_URL).flush(contratosMock);
    httpMock.expectOne(POLIZAS_URL).flush(polizasMock);
    tick();
    expect(component.error).toBe('Error cargando usuarios');
    expect(component.loading).toBeFalse();
  }));

  it('debe manejar error en contratos sin lanzar excepción', fakeAsync(() => {
    fixture.detectChanges();
    httpMock.expectOne(USERS_URL).flush(usersMock);
    httpMock.expectOne(CONTRATOS_URL).flush('err', { status: 500, statusText: 'Error' });
    tick();
    expect(component).toBeTruthy();
  }));

  it('debe manejar error en pólizas sin lanzar excepción', fakeAsync(() => {
    fixture.detectChanges();
    httpMock.expectOne(USERS_URL).flush(usersMock);
    httpMock.expectOne(CONTRATOS_URL).flush(contratosMock);
    httpMock.expectOne(POLIZAS_URL).flush('err', { status: 500, statusText: 'Error' });
    tick();
    expect(component).toBeTruthy();
  }));
});
