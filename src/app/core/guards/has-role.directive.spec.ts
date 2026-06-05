import { Component } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { HasRoleDirective } from './has-role.directive';
import { AuthStateService } from '../../shared/services/auth-state.service';
import { UserDto, UserRole } from '../interfaces/auth.models';

@Component({
  standalone: true,
  imports: [HasRoleDirective],
  template: `<div *hasRole="rolesRequeridos" id="contenido">visible</div>`,
})
class HostTestComponent {
  rolesRequeridos: UserRole[] = ['Admin'];
}

describe('HasRoleDirective - unitaria', () => {
  let fixture: ComponentFixture<HostTestComponent>;
  let userSubject: BehaviorSubject<UserDto | null>;
  let authStateSpy: jasmine.SpyObj<AuthStateService>;

  const adminUser: UserDto = { id: 1, nombre: 'Admin', email: 'a@a.com', role: 'Admin' };
  const normalUser: UserDto = { id: 2, nombre: 'User',  email: 'u@u.com', role: 'User'  };

  beforeEach(async () => {
    userSubject  = new BehaviorSubject<UserDto | null>(null);
    authStateSpy = jasmine.createSpyObj('AuthStateService', ['getToken'], { user$: userSubject.asObservable() });

    await TestBed.configureTestingModule({
      imports: [HostTestComponent],
      providers: [{ provide: AuthStateService, useValue: authStateSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(HostTestComponent);
    fixture.detectChanges();
  });

  it('debe crearse', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('muestra el contenido cuando el usuario tiene el rol requerido', () => {
    userSubject.next(adminUser);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector('#contenido');
    expect(el).toBeTruthy();
    expect(el.textContent).toContain('visible');
  });

  it('oculta el contenido cuando el usuario no tiene el rol requerido', () => {
    userSubject.next(normalUser);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector('#contenido');
    expect(el).toBeNull();
  });

  it('oculta el contenido cuando no hay usuario autenticado', () => {
    userSubject.next(null);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector('#contenido');
    expect(el).toBeNull();
  });
});
