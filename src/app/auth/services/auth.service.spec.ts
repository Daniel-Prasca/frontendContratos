import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { AuthStateService } from '../../shared/services/auth-state.service';
import { UserDto } from '../../core/interfaces/auth.models';

describe('AuthService - lógica local (unitaria)', () => {
  let service: AuthService;

  const usuarioMock: UserDto = {
    id: 1,
    nombre: 'Test User',
    email: 'test@test.com',
    role: 'Admin',
  };

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

    // Instancia nueva para que el constructor lea el localStorage ya poblado
    const http       = TestBed.inject(HttpClient);
    const authState  = TestBed.inject(AuthStateService);
    const nuevoServicio = new AuthService(http, authState);

    const usuario = nuevoServicio.getUser();
    expect(usuario?.email).toBe('test@test.com');
    expect(usuario?.role).toBe('Admin');
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
});
