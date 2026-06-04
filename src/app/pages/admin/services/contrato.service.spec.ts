import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ContratoService } from './contrato.service';
import { AuthService } from '../../../auth/services/auth.service';
import { UserAuthService } from '../../../auth/services/user.service';
import { ContratoDto, ContratoCreateDto, ContratoUpdateDto } from '../../../core/interfaces/contrato';
import { environment } from '../../../../environments/environments';

describe('ContratoService - integración HTTP', () => {
  let service: ContratoService;
  let httpMock: HttpTestingController;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  const BASE = `${environment.apiUrl}/contratos`;

  const contratosMock: ContratoDto[] = [
    { id: 1, proveedorId: 10, objeto: 'Contrato A', fechaInicio: '2025-01-01', fechaFin: '2025-12-31', proveedorNombre: 'Empresa X' },
    { id: 2, proveedorId: 11, objeto: 'Contrato B', fechaInicio: '2025-03-01', fechaFin: '2025-09-30', proveedorNombre: 'Empresa Y' },
  ];

  const contratoNuevo: ContratoCreateDto = {
    proveedorId: 10,
    objeto: 'Nuevo contrato',
    fechaInicio: '2025-01-01',
    fechaFin: '2025-06-01',
  };

  const contratoActualizado: ContratoUpdateDto = {
    proveedorId: 10,
    objeto: 'Actualizado',
    fechaInicio: '2025-01-01',
    fechaFin: '2025-12-31',
  };

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getToken']);
    authServiceSpy.getToken.and.returnValue('token-de-prueba');

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ContratoService,
        UserAuthService,
        { provide: AuthService, useValue: authServiceSpy },
      ],
    });

    service  = TestBed.inject(ContratoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('obtenerContratos: GET /contratos retorna la lista completa', () => {
    service.obtenerContratos().subscribe((res) => {
      expect(res.length).toBe(2);
      expect(res[0].objeto).toBe('Contrato A');
      expect(res[1].proveedorNombre).toBe('Empresa Y');
    });

    const req = httpMock.expectOne(BASE);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe('Bearer token-de-prueba');
    req.flush(contratosMock);
  });

  it('obtenerContratoPorId: GET /contratos/1 retorna el contrato correcto', () => {
    service.obtenerContratoPorId(1).subscribe((res) => {
      expect(res.id).toBe(1);
      expect(res.objeto).toBe('Contrato A');
    });

    const req = httpMock.expectOne(`${BASE}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(contratosMock[0]);
  });

  it('crearContrato: POST /contratos envía el body correcto y retorna el contrato creado', () => {
    service.crearContrato(contratoNuevo).subscribe((res) => {
      expect(res.id).toBe(3);
      expect(res.objeto).toBe('Nuevo contrato');
    });

    const req = httpMock.expectOne(BASE);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(contratoNuevo);
    expect(req.request.headers.get('Authorization')).toBe('Bearer token-de-prueba');
    req.flush({ id: 3, ...contratoNuevo, proveedorNombre: 'Empresa X' });
  });

  it('actualizarContrato: PUT /contratos/1 envía los datos actualizados', () => {
    service.actualizarContrato(1, contratoActualizado).subscribe();

    const req = httpMock.expectOne(`${BASE}/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(contratoActualizado);
    req.flush({});
  });

  it('eliminarContrato: DELETE /contratos/1', () => {
    service.eliminarContrato(1).subscribe();

    const req = httpMock.expectOne(`${BASE}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('sin token no incluye cabecera Authorization', () => {
    authServiceSpy.getToken.and.returnValue(null);

    service.obtenerContratos().subscribe();

    const req = httpMock.expectOne(BASE);
    expect(req.request.headers.get('Authorization')).toBeNull();
    req.flush([]);
  });
});
