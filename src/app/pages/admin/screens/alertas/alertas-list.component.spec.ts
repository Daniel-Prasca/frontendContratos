import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AlertasListComponent } from './alertas-list.component';
import { ContratoService } from '../../services/contrato.service';
import { PolizaService } from '../../services/poliza.service';
import { AuthService } from '../../../../auth/services/auth.service';
import { environment } from '../../../../../environments/environments';

describe('AlertasListComponent - integración', () => {
  let fixture: ComponentFixture<AlertasListComponent>;
  let component: AlertasListComponent;
  let httpMock: HttpTestingController;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  const CONTRATOS_URL = `${environment.apiUrl}/contratos`;
  const POLIZAS_URL   = `${environment.apiUrl}/polizas`;

  const hoy = new Date();
  const enDiez = new Date(hoy.getTime() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const enTreinta = new Date(hoy.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const contratosMock = [
    { id: 1, proveedorId: 1, objeto: 'Contrato próximo', fechaInicio: '2025-01-01', fechaFin: enDiez, proveedorNombre: 'Empresa A' },
    { id: 2, proveedorId: 2, objeto: 'Contrato lejano',  fechaInicio: '2025-01-01', fechaFin: enTreinta, proveedorNombre: 'Empresa B' },
  ];

  const polizasMock = [
    { id: 1, tipo: 'Vida', fechaVencimiento: enDiez, estado: 'Activa', contratoId: 1 },
  ];

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getToken']);
    authServiceSpy.getToken.and.returnValue('token-prueba');

    await TestBed.configureTestingModule({
      imports: [AlertasListComponent, HttpClientTestingModule],
      providers: [
        ContratoService,
        PolizaService,
        { provide: AuthService, useValue: authServiceSpy },
      ],
    }).compileComponents();

    fixture   = TestBed.createComponent(AlertasListComponent);
    component = fixture.componentInstance;
    httpMock  = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('debe crearse el componente', fakeAsync(() => {
    fixture.detectChanges();
    httpMock.expectOne(CONTRATOS_URL).flush(contratosMock);
    httpMock.expectOne(POLIZAS_URL).flush(polizasMock);
    tick();
    expect(component).toBeTruthy();
  }));

  it('debe cargar solo contratos que vencen en los próximos 14 días', fakeAsync(() => {
    fixture.detectChanges();
    httpMock.expectOne(CONTRATOS_URL).flush(contratosMock);
    httpMock.expectOne(POLIZAS_URL).flush(polizasMock);
    tick();
    const contratosEnAlertas = component.alertas.filter(a => a.tipo === 'Contrato');
    expect(contratosEnAlertas.length).toBe(1);
    expect(contratosEnAlertas[0].descripcion).toBe('Empresa A');
  }));

  it('debe cargar pólizas que vencen en los próximos 14 días', fakeAsync(() => {
    fixture.detectChanges();
    httpMock.expectOne(CONTRATOS_URL).flush(contratosMock);
    httpMock.expectOne(POLIZAS_URL).flush(polizasMock);
    tick();
    const polizasEnAlertas = component.alertas.filter(a => a.tipo === 'Póliza');
    expect(polizasEnAlertas.length).toBe(1);
  }));

  it('debe mostrar errorMessage si falla la carga de contratos', fakeAsync(() => {
    fixture.detectChanges();
    httpMock.expectOne(CONTRATOS_URL).flush('Error', { status: 500, statusText: 'Server Error' });
    tick();
    expect(component.errorMessage).toBe('Error al cargar contratos');
  }));

  it('debe mostrar errorMessage si falla la carga de pólizas', fakeAsync(() => {
    fixture.detectChanges();
    httpMock.expectOne(CONTRATOS_URL).flush(contratosMock);
    httpMock.expectOne(POLIZAS_URL).flush('Error', { status: 500, statusText: 'Server Error' });
    tick();
    expect(component.errorMessage).toBe('Error al cargar pólizas');
  }));
});
