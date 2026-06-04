import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { RoleGuard } from './role.guard';
import { AuthService } from '../../auth/services/auth.service';
import { UserDto } from '../interfaces/auth.models';

describe('RoleGuard', () => {
  let guard: RoleGuard;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const buildRoute = (roles: string[]): ActivatedRouteSnapshot => {
    const route = new ActivatedRouteSnapshot();
    (route as any).data = { roles };
    return route;
  };

  const usuarioAdmin: UserDto = { id: 1, nombre: 'Admin', email: 'admin@test.com', role: 'Admin' };
  const usuarioUser: UserDto  = { id: 2, nombre: 'Juan',  email: 'juan@test.com',  role: 'User'  };

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getUser']);
    routerSpy      = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        RoleGuard,
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router,      useValue: routerSpy },
      ],
    });

    guard = TestBed.inject(RoleGuard);
  });

  it('debe crearse el guard', () => {
    expect(guard).toBeTruthy();
  });

  it('Admin puede acceder a ruta con rol Admin', () => {
    authServiceSpy.getUser.and.returnValue(usuarioAdmin);
    expect(guard.canActivate(buildRoute(['Admin']))).toBeTrue();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it('User puede acceder a ruta con roles Admin y User', () => {
    authServiceSpy.getUser.and.returnValue(usuarioUser);
    expect(guard.canActivate(buildRoute(['Admin', 'User']))).toBeTrue();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it('User NO puede acceder a ruta exclusiva de Admin', () => {
    authServiceSpy.getUser.and.returnValue(usuarioUser);
    expect(guard.canActivate(buildRoute(['Admin']))).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/auth/register']);
  });

  it('sin usuario logueado debe bloquear y redirigir', () => {
    authServiceSpy.getUser.and.returnValue(null);
    expect(guard.canActivate(buildRoute(['Admin']))).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/auth/register']);
  });
});
