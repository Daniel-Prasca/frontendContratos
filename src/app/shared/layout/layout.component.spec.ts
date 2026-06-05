import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject } from 'rxjs';
import LayoutComponent from './layout.component';
import { AuthStateService } from '../services/auth-state.service';
import { UserDto } from '../../core/interfaces/auth.models';

describe('Shared LayoutComponent - unitaria', () => {
  let fixture: ComponentFixture<LayoutComponent>;
  let component: LayoutComponent;
  let authStateSpy: jasmine.SpyObj<AuthStateService>;
  let userSubject: BehaviorSubject<UserDto | null>;

  const adminUser: UserDto = { id: 1, nombre: 'Admin', email: 'a@a.com', role: 'Admin' };

  beforeEach(async () => {
    userSubject  = new BehaviorSubject<UserDto | null>(null);
    authStateSpy = jasmine.createSpyObj('AuthStateService', ['logout', 'getToken', 'setUser', 'getCurrentUser', 'isLoggedIn'], {
      user$: userSubject.asObservable(),
    });

    await TestBed.configureTestingModule({
      imports: [LayoutComponent, RouterTestingModule],
      providers: [
        { provide: AuthStateService, useValue: authStateSpy },
      ],
    }).compileComponents();

    fixture   = TestBed.createComponent(LayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crearse el componente', () => {
    expect(component).toBeTruthy();
  });

  it('user$ emite el usuario actual del AuthStateService', (done) => {
    userSubject.next(adminUser);
    component.user$.subscribe(u => {
      if (u) {
        expect(u.nombre).toBe('Admin');
        done();
      }
    });
  });

  it('logout() llama a authState.logout()', async () => {
    await component.logout();
    expect(authStateSpy.logout).toHaveBeenCalled();
  });
});
