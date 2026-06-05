import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserAuthService } from './user.service';
import { AuthService } from './auth.service';
import { UserDto } from '../../core/interfaces/auth.models';
import { environment } from '../../../environments/environments';

describe('UserAuthService - integración', () => {
  let service: UserAuthService;
  let httpMock: HttpTestingController;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  const BASE = `${environment.apiUrl}/users`;

  const usersMock: UserDto[] = [{ id: 1, nombre: 'Admin', email: 'admin@test.com', role: 'Admin' }];
  const userMock:  UserDto   = { id: 1, nombre: 'Admin', email: 'admin@test.com', role: 'Admin' };
  const registerDto = { nombre: 'Juan', email: 'juan@test.com', password: '12345' };
  const updateDto   = { nombre: 'Juan Updated' };

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getToken']);
    authServiceSpy.getToken.and.returnValue('token-prueba');

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        UserAuthService,
        { provide: AuthService, useValue: authServiceSpy },
      ],
    });

    service  = TestBed.inject(UserAuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('debe crearse', () => {
    expect(service).toBeTruthy();
  });

  it('getAllUsers hace GET a /users', () => {
    service.getAllUsers().subscribe(users => expect(users.length).toBe(1));
    httpMock.expectOne(BASE).flush(usersMock);
  });

  it('obtenerUsuarioPorId hace GET a /users/:id', () => {
    service.obtenerUsuarioPorId(1).subscribe(u => expect(u.nombre).toBe('Admin'));
    httpMock.expectOne(`${BASE}/1`).flush(userMock);
  });

  it('registrarUsuario hace POST a /users/register sin auth', () => {
    service.registrarUsuario(registerDto as any).subscribe(u => expect(u.nombre).toBe('Admin'));
    const req = httpMock.expectOne(`${BASE}/register`);
    expect(req.request.method).toBe('POST');
    req.flush(userMock);
  });

  it('actualizarUsuario hace PUT a /users/:id', () => {
    service.actualizarUsuario(1, updateDto as any).subscribe();
    const req = httpMock.expectOne(`${BASE}/1`);
    expect(req.request.method).toBe('PUT');
    req.flush({});
  });

  it('eliminarUsuario hace DELETE a /users/:id', () => {
    service.eliminarUsuario(1).subscribe();
    const req = httpMock.expectOne(`${BASE}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });
});
