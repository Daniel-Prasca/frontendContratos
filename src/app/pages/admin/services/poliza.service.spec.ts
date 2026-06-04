import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PolizaService } from './poliza.service';
import { AuthService } from '../../../auth/services/auth.service';
import { PolizaDto, PolizaCreateDto, PolizaUpdateDto } from '../../../core/interfaces/poliza';
import { environment } from '../../../../environments/environments';

describe('PolizaService - integración HTTP', () => {
  let service: PolizaService;
  let httpMock: HttpTestingController;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  const BASE = `${environment.apiUrl}/polizas`;

  const polizasMock: PolizaDto[] = [
    { id: 1, contratoId: 10, tipo: 'Cumplimiento', fechaVencimiento: '2025-12-31', estado: 'Activa' },
    { id: 2, contratoId: 11, tipo: 'Calidad',      fechaVencimiento: '2025-06-30', estado: 'Vencida' },
  ];

  const polizaNueva: PolizaCreateDto = {
    contratoId: 10,
    tipo: 'Garantía',
    fechaVencimiento: '2026-01-01',
    estado: 'Activa',
  };

  const polizaActualizada: PolizaUpdateDto = {
    tipo: 'Garantía',
    fechaVencimiento: '2026-06-01',
    estado: 'Activa',
  };

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getToken']);
    authServiceSpy.getToken.and.returnValue('token-de-prueba');

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        PolizaService,
        { provide: AuthService, useValue: authServiceSpy },
      ],
    });

    service  = TestBed.inject(PolizaService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('obtenerPolizas: GET /polizas retorna la lista completa', () => {
    service.obtenerPolizas().subscribe((res) => {
      expect(res.length).toBe(2);
      expect(res[0].tipo).toBe('Cumplimiento');
      expect(res[1].estado).toBe('Vencida');
    });

    const req = httpMock.expectOne(BASE);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe('Bearer token-de-prueba');
    req.flush(polizasMock);
  });

  it('obtenerPolizaPorId: GET /polizas/1 retorna la póliza correcta', () => {
    service.obtenerPolizaPorId(1).subscribe((res) => {
      expect(res.id).toBe(1);
      expect(res.tipo).toBe('Cumplimiento');
    });

    const req = httpMock.expectOne(`${BASE}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(polizasMock[0]);
  });

  it('crearPoliza: POST /polizas envía el body correcto y retorna la póliza creada', () => {
    service.crearPoliza(polizaNueva).subscribe((res) => {
      expect(res.id).toBe(3);
      expect(res.tipo).toBe('Garantía');
    });

    const req = httpMock.expectOne(BASE);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(polizaNueva);
    expect(req.request.headers.get('Authorization')).toBe('Bearer token-de-prueba');
    req.flush({ id: 3, ...polizaNueva });
  });

  it('actualizarPoliza: PUT /polizas/1 envía los datos correctos', () => {
    service.actualizarPoliza(1, polizaActualizada).subscribe();

    const req = httpMock.expectOne(`${BASE}/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(polizaActualizada);
    req.flush({});
  });

  it('eliminarPoliza: DELETE /polizas/1', () => {
    service.eliminarPoliza(1).subscribe();

    const req = httpMock.expectOne(`${BASE}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('sin token no incluye cabecera Authorization', () => {
    authServiceSpy.getToken.and.returnValue(null);

    service.obtenerPolizas().subscribe();

    const req = httpMock.expectOne(BASE);
    expect(req.request.headers.get('Authorization')).toBeNull();
    req.flush([]);
  });
});
