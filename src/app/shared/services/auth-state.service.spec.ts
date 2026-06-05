import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthStateService } from './auth-state.service';
import { UserDto } from '../../core/interfaces/auth.models';

describe('AuthStateService - unitaria', () => {
  let service: AuthStateService;

  const userMock: UserDto = { id: 1, nombre: 'Admin', email: 'admin@test.com', role: 'Admin' };

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthStateService],
    });
    service = TestBed.inject(AuthStateService);
  });

  afterEach(() => localStorage.clear());

  it('debe crearse', () => {
    expect(service).toBeTruthy();
  });

  it('setUser guarda el usuario en localStorage y emite por user$', (done) => {
    service.setUser(userMock);
    service.user$.subscribe(u => {
      expect(u).toEqual(userMock);
      expect(localStorage.getItem('user')).toBe(JSON.stringify(userMock));
      done();
    });
  });

  it('logout limpia localStorage y emite null por user$', (done) => {
    service.setUser(userMock);
    service.logout();
    service.user$.subscribe(u => {
      expect(u).toBeNull();
      expect(localStorage.getItem('authToken')).toBeNull();
      expect(localStorage.getItem('user')).toBeNull();
      done();
    });
  });

  it('getCurrentUser retorna el usuario actual', () => {
    service.setUser(userMock);
    expect(service.getCurrentUser()).toEqual(userMock);
  });

  it('getToken retorna el token del localStorage', () => {
    localStorage.setItem('authToken', 'mi-token');
    expect(service.getToken()).toBe('mi-token');
  });

  it('getToken retorna null si no hay token', () => {
    expect(service.getToken()).toBeNull();
  });

  it('isLoggedIn retorna true cuando hay token', () => {
    localStorage.setItem('authToken', 'tok');
    expect(service.isLoggedIn()).toBeTrue();
  });

  it('isLoggedIn retorna false cuando no hay token', () => {
    expect(service.isLoggedIn()).toBeFalse();
  });
});
