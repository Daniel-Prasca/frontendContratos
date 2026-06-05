import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideRouter } from '@angular/router';
import { RoleRedirectComponent } from './role-redirect.component';
import { AuthService } from '../../auth/services/auth.service';
import { UserDto } from '../interfaces/auth.models';

describe('RoleRedirectComponent - unitaria', () => {
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let router: Router;

  const adminUser: UserDto = { id: 1, nombre: 'Admin', email: 'admin@test.com', role: 'Admin' };
  const normalUser: UserDto = { id: 2, nombre: 'User',  email: 'user@test.com',  role: 'User'  };

  const setup = (user: UserDto | null) => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getUser', 'getToken', 'isLoggedIn']);
    authServiceSpy.getUser.and.returnValue(user);

    TestBed.configureTestingModule({
      imports: [RoleRedirectComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authServiceSpy },
      ],
    });

    router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
    const fixture = TestBed.createComponent(RoleRedirectComponent);
    fixture.detectChanges();
    return router;
  };

  afterEach(() => TestBed.resetTestingModule());

  it('navega a /admin/user-list si el rol es Admin', () => {
    const r = setup(adminUser);
    expect(r.navigate).toHaveBeenCalledWith(['/admin/user-list']);
  });

  it('navega a /user/servicios-list si el rol es User', () => {
    const r = setup(normalUser);
    expect(r.navigate).toHaveBeenCalledWith(['/user/servicios-list']);
  });

  it('navega a /login si no hay usuario', () => {
    const r = setup(null);
    expect(r.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('navega a /login si el rol es desconocido', () => {
    const r = setup({ ...adminUser, role: 'SuperUser' });
    expect(r.navigate).toHaveBeenCalledWith(['/login']);
  });
});
