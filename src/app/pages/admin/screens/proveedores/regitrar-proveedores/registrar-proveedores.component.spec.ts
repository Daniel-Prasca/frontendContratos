import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { RegistrarProveedoresComponent } from './registrar-proveedores.component';
import { ProveedorService } from '../../../services/proveedores.service';
import { AuthService } from '../../../../../auth/services/auth.service';

describe('RegistrarProveedoresComponent - unitaria', () => {
  let fixture: ComponentFixture<RegistrarProveedoresComponent>;
  let component: RegistrarProveedoresComponent;
  let proveedorServiceSpy: jasmine.SpyObj<ProveedorService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  const formValido = { nit: '900123456-1', nombre: 'Empresa Test', representanteLegal: 'Juan' };

  beforeEach(async () => {
    proveedorServiceSpy = jasmine.createSpyObj('ProveedorService', ['crearProveedor']);
    routerSpy           = jasmine.createSpyObj('Router', ['navigate']);
    authServiceSpy      = jasmine.createSpyObj('AuthService', ['getToken']);
    authServiceSpy.getToken.and.returnValue('token-prueba');

    await TestBed.configureTestingModule({
      imports: [RegistrarProveedoresComponent, ReactiveFormsModule, RouterTestingModule, HttpClientTestingModule],
      providers: [
        { provide: ProveedorService, useValue: proveedorServiceSpy },
        { provide: Router,           useValue: routerSpy           },
        { provide: AuthService,      useValue: authServiceSpy      },
      ],
    }).compileComponents();

    fixture   = TestBed.createComponent(RegistrarProveedoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crearse el componente', () => {
    expect(component).toBeTruthy();
  });

  it('el formulario debe ser inválido cuando está vacío', () => {
    expect(component.form.invalid).toBeTrue();
  });

  it('el formulario es válido con todos los campos completos', () => {
    component.form.setValue(formValido);
    expect(component.form.valid).toBeTrue();
  });

  it('isRequired retorna true si el campo tiene error required y está tocado', () => {
    const ctrl = component.form.get('nit')!;
    ctrl.markAsTouched();
    expect(component.isRequired('nit')).toBeTrue();
  });

  it('guardarProveedor con formulario inválido no llama al servicio', () => {
    component.guardarProveedor();
    expect(proveedorServiceSpy.crearProveedor).not.toHaveBeenCalled();
  });

  it('guardarProveedor con formulario inválido marca todos los campos como tocados', () => {
    component.guardarProveedor();
    expect(component.form.touched).toBeTrue();
  });

  it('guardarProveedor exitoso debe navegar a proveedores-list', () => {
    proveedorServiceSpy.crearProveedor.and.returnValue(of({ id: 1, ...formValido }));
    component.form.setValue(formValido);
    component.guardarProveedor();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/admin/proveedores-list']);
  });

  it('guardarProveedor fallido debe mostrar errorMessage', () => {
    proveedorServiceSpy.crearProveedor.and.returnValue(throwError(() => new Error('Error')));
    component.form.setValue(formValido);
    component.guardarProveedor();
    expect(component.errorMessage).toBe('Error al crear proveedor');
  });
});
