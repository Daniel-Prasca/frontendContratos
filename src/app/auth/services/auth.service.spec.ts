import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { AuthStateService } from '../../shared/services/auth-state.service';
import { UserDto } from '../../core/interfaces/auth.models';
import { environment } from '../../../environments/environments';

const BASE = environment.apiUrl;

const usuarioMock: UserDto = {
  id: 1,
  nombre: 'Test User',
  email: 'test@test.com',
  role: 'Admin',
};

const loginResponse = { token: 'tok-abc', user: usuarioMock };

// ─────────────────────────────────────────────────────────────────────────────
// Suite 1 — lógica local (sin HTTP)
// ─────────────────────────────────────────────────────────────────────────────
describe('AuthService - lógica local (unitaria)', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService, AuthStateService],
    });

    service = TestBed.inject(AuthService);
    localStorage.clear();
  });

  afterEach(() => localStorage.clear());

  it('debe crearse el servicio', () => {
    expect(service).toBeTruthy();
  });

  // ── isLoggedIn ────────────────────────────────────────────
  it('isLoggedIn retorna false cuando no hay token', () => {
    expect(service.isLoggedIn()).toBeFalse();
  });

  it('isLoggedIn retorna true cuando hay token en localStorage', () => {
    localStorage.setItem('authToken', 'mi-token-falso');
    expect(service.isLoggedIn()).toBeTrue();
  });

  // ── getToken ──────────────────────────────────────────────
  it('getToken retorna null si no hay token', () => {
    expect(service.getToken()).toBeNull();
  });

  it('getToken retorna el token guardado', () => {
    localStorage.setItem('authToken', 'abc123');
    expect(service.getToken()).toBe('abc123');
  });

  // ── getUser ───────────────────────────────────────────────
  it('getUser retorna null si no hay usuario en localStorage', () => {
    expect(service.getUser()).toBeNull();
  });

  it('getUser retorna el usuario si está en localStorage al iniciar', () => {
    localStorage.setItem('user', JSON.stringify(usuarioMock));

    const http      = TestBed.inject(HttpClient);
    const authState = TestBed.inject(AuthStateService);
    const nuevo     = new AuthService(http, authState);

    expect(nuevo.getUser()?.email).toBe('test@test.com');
    expect(nuevo.getUser()?.role).toBe('Admin');
  });

  // ── logout ────────────────────────────────────────────────
  it('logout limpia token y usuario del localStorage', () => {
    localStorage.setItem('authToken', 'mi-token-falso');
    localStorage.setItem('user', JSON.stringify(usuarioMock));

    service.logout();

    expect(localStorage.getItem('authToken')).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
  });

  it('logout actualiza isLoggedIn a false', () => {
    localStorage.setItem('authToken', 'mi-token-falso');
    service.logout();
    expect(service.isLoggedIn()).toBeFalse();
  });

  it('logout actualiza getUser a null', () => {
    localStorage.setItem('user', JSON.stringify(usuarioMock));
    service.logout();
    expect(service.getUser()).toBeNull();
  });

  it('logout emite false en loggedIn$', (done) => {
    localStorage.setItem('authToken', 'tok');
    service.logout();
    service.loggedIn$.subscribe((v) => {
      expect(v).toBeFalse();
      done();
    });
  });

  it('logout emite null en user$', (done) => {
    service.logout();
    service.user$.subscribe((u) => {
      expect(u).toBeNull();
      done();
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Suite 2 — integración HTTP (login y register)
// Estas pruebas matan los mutantes del tap() que la suite 1 no puede detectar
// ─────────────────────────────────────────────────────────────────────────────
describe('AuthService - integración HTTP', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let authStateSpy: jasmine.SpyObj<AuthStateService>;

  beforeEach(() => {
    authStateSpy = jasmine.createSpyObj('AuthStateService', ['setUser', 'logout']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: AuthStateService, useValue: authStateSpy },
      ],
    });

    service  = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  // ── login: efectos secundarios del tap() ─────────────────
  it('login guarda el token en localStorage', () => {
    service.login({ email: 'a@a.com', password: '123' }).subscribe();
    httpMock.expectOne(`${BASE}/auth/login`).flush(loginResponse);
    expect(localStorage.getItem('authToken')).toBe('tok-abc');
  });

  it('login guarda el usuario en localStorage', () => {
    service.login({ email: 'a@a.com', password: '123' }).subscribe();
    httpMock.expectOne(`${BASE}/auth/login`).flush(loginResponse);
    const guardado = JSON.parse(localStorage.getItem('user')!);
    expect(guardado.email).toBe('test@test.com');
    expect(guardado.role).toBe('Admin');
  });

  it('login actualiza isLoggedIn a true', () => {
    service.login({ email: 'a@a.com', password: '123' }).subscribe();
    httpMock.expectOne(`${BASE}/auth/login`).flush(loginResponse);
    expect(service.isLoggedIn()).toBeTrue();
  });

  it('login actualiza getUser con el usuario recibido', () => {
    service.login({ email: 'a@a.com', password: '123' }).subscribe();
    httpMock.expectOne(`${BASE}/auth/login`).flush(loginResponse);
    expect(service.getUser()?.nombre).toBe('Test User');
    expect(service.getUser()?.id).toBe(1);
  });

  it('login emite true en loggedIn$', () => {
    let emitido = false;
    service.loggedIn$.subscribe((v) => { if (v) emitido = true; });
    service.login({ email: 'a@a.com', password: '123' }).subscribe();
    httpMock.expectOne(`${BASE}/auth/login`).flush(loginResponse);
    expect(emitido).toBeTrue();
  });

  it('login emite el usuario en user$', () => {
    let emitido: UserDto | null = null;
    service.user$.subscribe((u) => { emitido = u as UserDto | null; });
    service.login({ email: 'a@a.com', password: '123' }).subscribe();
    httpMock.expectOne(`${BASE}/auth/login`).flush(loginResponse);
    expect((emitido as UserDto | null)?.email).toBe('test@test.com');
  });

  it('login llama a authState.setUser con el usuario recibido', () => {
    service.login({ email: 'a@a.com', password: '123' }).subscribe();
    httpMock.expectOne(`${BASE}/auth/login`).flush(loginResponse);
    expect(authStateSpy.setUser).toHaveBeenCalledWith(usuarioMock);
  });

  it('login hace POST a /auth/login con las credenciales', () => {
    const creds = { email: 'a@a.com', password: '123' };
    service.login(creds).subscribe();
    const req = httpMock.expectOne(`${BASE}/auth/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(creds);
    req.flush(loginResponse);
  });

  // ── register ──────────────────────────────────────────────
  it('register hace POST a /auth/register con los datos', () => {
    const datos = { nombre: 'Juan', email: 'j@j.com', password: '123' };
    service.register(datos).subscribe();
    const req = httpMock.expectOne(`${BASE}/auth/register`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(datos);
    req.flush({});
  });

  // ── logout sincroniza authState ───────────────────────────
  it('logout llama a authState.logout()', () => {
    service.logout();
    expect(authStateSpy.logout).toHaveBeenCalled();
  });
});
