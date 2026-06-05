import { TestBed, ComponentFixture } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { provideRouter, Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import LoginComponent from './login.component';
import { AuthService } from '../../services/auth.service';

describe('LoginComponent - unitaria', () => {
  let fixture: ComponentFixture<LoginComponent>;
  let component: LoginComponent;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let router: Router;

  const loginResponse = {
    token: 'tok123',
    user: { id: 1, nombre: 'Admin', email: 'admin@test.com', role: 'Admin' },
  };

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['login', 'getToken']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent, FormsModule, HttpClientTestingModule],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authServiceSpy },
      ],
    }).compileComponents();

    fixture   = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    router    = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('debe crearse el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe navegar a /admin/user-list si el rol es Admin', () => {
    authServiceSpy.login.and.returnValue(of(loginResponse as any));
    const navigateSpy = spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
    component.email    = 'admin@test.com';
    component.password = '12345';
    component.onSubmit();
    expect(navigateSpy).toHaveBeenCalledWith(['/admin/user-list']);
  });

  it('debe navegar a /user si el rol es User', () => {
    const userResponse = { ...loginResponse, user: { ...loginResponse.user, role: 'User' } };
    authServiceSpy.login.and.returnValue(of(userResponse as any));
    const navigateSpy = spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
    component.email    = 'user@test.com';
    component.password = '12345';
    component.onSubmit();
    expect(navigateSpy).toHaveBeenCalledWith(['/user']);
  });

  it('no debe navegar si el login falla', () => {
    authServiceSpy.login.and.returnValue(throwError(() => new Error('Error')));
    const navigateSpy = spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
    component.email    = 'bad@test.com';
    component.password = 'wrong';
    component.onSubmit();
    expect(navigateSpy).not.toHaveBeenCalled();
  });
});
