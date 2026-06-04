import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ServicioService } from './servicio.service';
import { AuthService } from '../../../auth/services/auth.service';
import { UserAuthService } from '../../../auth/services/user.service';
import { ServicioDto, ServicioCreateDto, ServicioUpdateDto } from '../../../core/interfaces/servicio';
import { environment } from '../../../../environments/environments';

describe('ServicioService - integración HTTP', () => {
  let service: ServicioService;
  let httpMock: HttpTestingController;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  const BASE = `${environment.apiUrl}/servicios`;

  const serviciosMock: ServicioDto[] = [
    { id: 1, nombre: 'Servicio A', precio: 100, contratoId: 1, contratoObjeto: 'Contrato A' },
    { id: 2, nombre: 'Servicio B', precio: 250, contratoId: 2, contratoObjeto: 'Contrato B' },
  ];

  const servicioNuevo: ServicioCreateDto = { nombre: 'Servicio C', precio: 300, contratoId: 1 };
  const servicioActualizado: ServicioUpdateDto = { nombre: 'Servicio A v2', precio: 150, contratoId: 1 };

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getToken']);
    authServiceSpy.getToken.and.returnValue('token-de-prueba');

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ServicioService,
        UserAuthService,
        { provide: AuthService, useValue: authServiceSpy },
      ],
    });

    service  = TestBed.inject(ServicioService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('obtenerServicios: GET /servicios retorna la lista completa', () => {
    service.obtenerServicios().subscribe((res) => {
      expect(res.length).toBe(2);
      expect(res[0].nombre).toBe('Servicio A');
    });

    const req = httpMock.expectOne(BASE);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe('Bearer token-de-prueba');
    req.flush(serviciosMock);
  });

  it('obtenerServicioPorId: GET /servicios/1 retorna el servicio correcto', () => {
    service.obtenerServicioPorId(1).subscribe((res) => {
      expect(res.id).toBe(1);
      expect(res.precio).toBe(100);
    });

    const req = httpMock.expectOne(`${BASE}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(serviciosMock[0]);
  });

  it('crearServicio: POST /servicios envía el body correcto', () => {
    service.crearServicio(servicioNuevo).subscribe((res) => {
      expect(res.id).toBe(3);
      expect(res.nombre).toBe('Servicio C');
    });

    const req = httpMock.expectOne(BASE);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(servicioNuevo);
    req.flush({ id: 3, ...servicioNuevo, contratoObjeto: 'Contrato A' });
  });

  it('actualizarServicio: PUT /servicios/1 envía los datos correctos', () => {
    service.actualizarServicio(1, servicioActualizado).subscribe();

    const req = httpMock.expectOne(`${BASE}/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(servicioActualizado);
    req.flush({});
  });

  it('eliminarServicio: DELETE /servicios/1', () => {
    service.eliminarServicio(1).subscribe();

    const req = httpMock.expectOne(`${BASE}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('sin token no incluye cabecera Authorization', () => {
    authServiceSpy.getToken.and.returnValue(null);
    service.obtenerServicios().subscribe();

    const req = httpMock.expectOne(BASE);
    expect(req.request.headers.get('Authorization')).toBeNull();
    req.flush([]);
  });
});
