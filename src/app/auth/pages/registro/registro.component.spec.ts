import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { provideRouter } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import RegistroComponent from './registro.component';
import { AuthService } from '../../services/auth.service';

describe('RegistroComponent - unitaria', () => {
  let fixture: ComponentFixture<RegistroComponent>;
  let component: RegistroComponent;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let router: Router;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['register', 'getToken']);

    await TestBed.configureTestingModule({
      imports: [RegistroComponent, ReactiveFormsModule, HttpClientTestingModule],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authServiceSpy },
      ],
    }).compileComponents();

    fixture   = TestBed.createComponent(RegistroComponent);
    component = fixture.componentInstance;
    router    = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('debe crearse el componente', () => {
    expect(component).toBeTruthy();
  });

  it('el formulario debe ser inválido cuando está vacío', () => {
    expect(component.form.invalid).toBeTrue();
  });

  it('el formulario debe ser válido con todos los campos completos', () => {
    component.form.setValue({ firstName: 'Juan', email: 'juan@test.com', password: '12345' });
    expect(component.form.valid).toBeTrue();
  });

  it('isRequired debe retornar true si el campo tiene error required y fue tocado', () => {
    const ctrl = component.form.get('firstName')!;
    ctrl.markAsTouched();
    expect(component.isRequired('firstName')).toBeTrue();
  });

  it('isEmailError debe retornar true si el email es inválido y fue tocado', () => {
    const ctrl = component.form.get('email')!;
    ctrl.setValue('no-es-email');
    ctrl.markAsTouched();
    expect(component.isEmailError()).toBeTrue();
  });

  it('onSubmit con formulario inválido no debe llamar al servicio', () => {
    component.onSubmit();
    expect(authServiceSpy.register).not.toHaveBeenCalled();
  });

  it('onSubmit con formulario inválido debe marcar todos los campos como tocados', () => {
    component.onSubmit();
    expect(component.form.touched).toBeTrue();
  });

  it('registro exitoso debe navegar a /auth/login', async () => {
    authServiceSpy.register.and.returnValue(of({}));
    const navigateSpy = spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
    component.form.setValue({ firstName: 'Juan', email: 'juan@test.com', password: '12345' });
    component.onSubmit();
    expect(navigateSpy).toHaveBeenCalledWith(['/auth/login']);
  });

  it('registro fallido debe mostrar errorMessage', () => {
    authServiceSpy.register.and.returnValue(throwError(() => ({ error: { message: 'Email en uso' } })));
    component.form.setValue({ firstName: 'Juan', email: 'juan@test.com', password: '12345' });
    component.onSubmit();
    expect(component.errorMessage).toBe('Email en uso');
  });
});
