import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LiquidacionService } from './liquidacion.service';
import { AuthService } from '../../../auth/services/auth.service';
import { LiquidacionDto, LiquidacionCreateDto, LiquidacionUpdateDto } from '../../../core/interfaces/liquidacion';
import { environment } from '../../../../environments/environments';

describe('LiquidacionService - integración HTTP', () => {
  let service: LiquidacionService;
  let httpMock: HttpTestingController;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  const BASE = `${environment.apiUrl}/liquidaciones`;

  const liquidacionesMock: LiquidacionDto[] = [
    { id: 1, contratoId: 1, contratoObjeto: 'Contrato A', servicioId: 1, servicioNombre: 'Serv A', usuarioId: 5, usuarioNombre: 'Juan', cantidad: 2, total: 200, estado: 'Pendiente', fecha: '2025-01-01' },
    { id: 2, contratoId: 2, contratoObjeto: 'Contrato B', servicioId: 2, servicioNombre: 'Serv B', usuarioId: 5, usuarioNombre: 'Juan', cantidad: 1, total: 100, estado: 'Aprobada', fecha: '2025-02-01' },
  ];

  const liquidacionNueva: LiquidacionCreateDto = {
    contratoId: 1, servicioId: 1, usuarioId: 5, cantidad: 3, total: 300, estado: 'Pendiente',
  };

  const liquidacionActualizada: LiquidacionUpdateDto = { cantidad: 5, total: 500, estado: 'Aprobada' };

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getToken']);
    authServiceSpy.getToken.and.returnValue('token-de-prueba');

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        LiquidacionService,
        { provide: AuthService, useValue: authServiceSpy },
      ],
    });

    service  = TestBed.inject(LiquidacionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('obtenerLiquidaciones: GET /liquidaciones retorna la lista completa', () => {
    service.obtenerLiquidaciones().subscribe((res) => {
      expect(res.length).toBe(2);
      expect(res[0].estado).toBe('Pendiente');
      expect(res[1].estado).toBe('Aprobada');
    });

    const req = httpMock.expectOne(BASE);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe('Bearer token-de-prueba');
    req.flush(liquidacionesMock);
  });

  it('obtenerLiquidacionPorId: GET /liquidaciones/1 retorna la liquidación correcta', () => {
    service.obtenerLiquidacionPorId(1).subscribe((res) => {
      expect(res.id).toBe(1);
      expect(res.total).toBe(200);
    });

    const req = httpMock.expectOne(`${BASE}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(liquidacionesMock[0]);
  });

  it('obtenerLiquidacionesPorUsuario: GET /liquidaciones/usuario/5', () => {
    service.obtenerLiquidacionesPorUsuario(5).subscribe((res) => {
      expect(res.length).toBe(2);
    });

    const req = httpMock.expectOne(`${BASE}/usuario/5`);
    expect(req.request.method).toBe('GET');
    req.flush(liquidacionesMock);
  });

  it('crearLiquidacion: POST /liquidaciones envía el body correcto', () => {
    service.crearLiquidacion(liquidacionNueva).subscribe((res) => {
      expect(res.id).toBe(3);
    });

    const req = httpMock.expectOne(BASE);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(liquidacionNueva);
    req.flush({ id: 3, ...liquidacionNueva, contratoObjeto: 'A', servicioNombre: 'S', usuarioNombre: 'Juan', fecha: '2025-01-01' });
  });

  it('actualizarLiquidacion: PUT /liquidaciones/1 envía los datos correctos', () => {
    service.actualizarLiquidacion(1, liquidacionActualizada).subscribe();

    const req = httpMock.expectOne(`${BASE}/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(liquidacionActualizada);
    req.flush({});
  });

  it('eliminarLiquidacion: DELETE /liquidaciones/1', () => {
    service.eliminarLiquidacion(1).subscribe();

    const req = httpMock.expectOne(`${BASE}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('sin token no incluye cabecera Authorization', () => {
    authServiceSpy.getToken.and.returnValue(null);
    service.obtenerLiquidaciones().subscribe();

    const req = httpMock.expectOne(BASE);
    expect(req.request.headers.get('Authorization')).toBeNull();
    req.flush([]);
  });
});
