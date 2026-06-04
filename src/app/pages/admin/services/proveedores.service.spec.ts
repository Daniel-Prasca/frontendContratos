import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProveedorService } from './proveedores.service';
import { AuthService } from '../../../auth/services/auth.service';
import { UserAuthService } from '../../../auth/services/user.service';
import { ProveedorDto, ProveedorCreateDto, ProveedorUpdateDto } from '../../../core/interfaces/proveedor';
import { environment } from '../../../../environments/environments';

describe('ProveedorService - integración HTTP', () => {
  let service: ProveedorService;
  let httpMock: HttpTestingController;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  const BASE = `${environment.apiUrl}/proveedores`;

  const proveedoresMock: ProveedorDto[] = [
    { id: 1, nit: '900111222-1', nombre: 'Empresa Alpha', representanteLegal: 'Carlos López' },
    { id: 2, nit: '900333444-2', nombre: 'Empresa Beta',  representanteLegal: 'Ana Gómez'   },
  ];

  const proveedorNuevo: ProveedorCreateDto = {
    nit: '900555666-3',
    nombre: 'Empresa Gamma',
    representanteLegal: 'Luis Torres',
  };

  const proveedorActualizado: ProveedorUpdateDto = {
    nit: '900111222-1',
    nombre: 'Empresa Alpha Actualizada',
    representanteLegal: 'Carlos López',
  };

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getToken']);
    authServiceSpy.getToken.and.returnValue('token-de-prueba');

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ProveedorService,
        UserAuthService,
        { provide: AuthService, useValue: authServiceSpy },
      ],
    });

    service  = TestBed.inject(ProveedorService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('obtenerProveedores: GET /proveedores retorna la lista completa', () => {
    service.obtenerProveedores().subscribe((res) => {
      expect(res.length).toBe(2);
      expect(res[0].nombre).toBe('Empresa Alpha');
      expect(res[1].representanteLegal).toBe('Ana Gómez');
    });

    const req = httpMock.expectOne(BASE);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe('Bearer token-de-prueba');
    req.flush(proveedoresMock);
  });

  it('obtenerProveedorPorId: GET /proveedores/1 retorna el proveedor correcto', () => {
    service.obtenerProveedorPorId(1).subscribe((res) => {
      expect(res.id).toBe(1);
      expect(res.nit).toBe('900111222-1');
    });

    const req = httpMock.expectOne(`${BASE}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(proveedoresMock[0]);
  });

  it('crearProveedor: POST /proveedores envía el body correcto y retorna el proveedor creado', () => {
    service.crearProveedor(proveedorNuevo).subscribe((res) => {
      expect(res.id).toBe(3);
      expect(res.nombre).toBe('Empresa Gamma');
    });

    const req = httpMock.expectOne(BASE);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(proveedorNuevo);
    expect(req.request.headers.get('Authorization')).toBe('Bearer token-de-prueba');
    req.flush({ id: 3, ...proveedorNuevo });
  });

  it('actualizarProveedor: PUT /proveedores/1 envía los datos correctos', () => {
    service.actualizarProveedor(1, proveedorActualizado).subscribe();

    const req = httpMock.expectOne(`${BASE}/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(proveedorActualizado);
    req.flush({});
  });

  it('eliminarProveedor: DELETE /proveedores/1', () => {
    service.eliminarProveedor(1).subscribe();

    const req = httpMock.expectOne(`${BASE}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('sin token no incluye cabecera Authorization', () => {
    authServiceSpy.getToken.and.returnValue(null);

    service.obtenerProveedores().subscribe();

    const req = httpMock.expectOne(BASE);
    expect(req.request.headers.get('Authorization')).toBeNull();
    req.flush([]);
  });
});
