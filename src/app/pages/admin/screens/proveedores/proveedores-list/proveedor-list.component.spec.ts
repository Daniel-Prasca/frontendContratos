import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { ProveedorListComponent } from './proveedor-list.component';
import { ProveedorService } from '../../../services/proveedores.service';
import { AuthService } from '../../../../../auth/services/auth.service';
import { ProveedorDto } from '../../../../../core/interfaces/proveedor';
import { environment } from '../../../../../../environments/environments';

describe('ProveedorListComponent - integración', () => {
  let fixture: ComponentFixture<ProveedorListComponent>;
  let component: ProveedorListComponent;
  let httpMock: HttpTestingController;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  const BASE = `${environment.apiUrl}/proveedores`;

  const proveedoresMock: ProveedorDto[] = [
    { id: 1, nit: '900100200-1', nombre: 'Empresa A', representanteLegal: 'Juan' },
    { id: 2, nit: '900200300-2', nombre: 'Empresa B', representanteLegal: 'Pedro' },
  ];

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getToken']);
    authServiceSpy.getToken.and.returnValue('token-prueba');

    await TestBed.configureTestingModule({
      imports: [ProveedorListComponent, HttpClientTestingModule, RouterTestingModule, FormsModule],
      providers: [
        ProveedorService,
        { provide: AuthService, useValue: authServiceSpy },
      ],
    }).compileComponents();

    fixture   = TestBed.createComponent(ProveedorListComponent);
    component = fixture.componentInstance;
    httpMock  = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('debe crearse el componente', fakeAsync(() => {
    fixture.detectChanges();
    httpMock.expectOne(BASE).flush(proveedoresMock);
    tick();
    expect(component).toBeTruthy();
  }));

  it('debe cargar proveedores al iniciar', fakeAsync(() => {
    fixture.detectChanges();
    httpMock.expectOne(BASE).flush(proveedoresMock);
    tick();
    expect(component.proveedores.length).toBe(2);
  }));

  it('debe mostrar errorMessage si falla la carga', fakeAsync(() => {
    fixture.detectChanges();
    httpMock.expectOne(BASE).flush('Error', { status: 500, statusText: 'Server Error' });
    tick();
    expect(component.errorMessage).toBe('Error al cargar proveedores ❌');
  }));

  it('editarProveedor debe activar el modo edición', fakeAsync(() => {
    fixture.detectChanges();
    httpMock.expectOne(BASE).flush(proveedoresMock);
    tick();
    component.editarProveedor(1);
    expect(component.editIndex).toBe(1);
  }));

  it('cancelarEdicion debe desactivar edición y recargar', fakeAsync(() => {
    fixture.detectChanges();
    httpMock.expectOne(BASE).flush(proveedoresMock);
    tick();
    component.editarProveedor(0);
    component.cancelarEdicion();
    httpMock.expectOne(BASE).flush(proveedoresMock);
    tick();
    expect(component.editIndex).toBeNull();
  }));

  it('guardarEdicion debe hacer PUT y recargar la lista', fakeAsync(() => {
    fixture.detectChanges();
    httpMock.expectOne(BASE).flush(proveedoresMock);
    tick();
    component.guardarEdicion(proveedoresMock[0], 0);
    const put = httpMock.expectOne(`${BASE}/1`);
    expect(put.request.method).toBe('PUT');
    put.flush({});
    tick();
    httpMock.expectOne(BASE).flush(proveedoresMock);
    tick();
    expect(component.editIndex).toBeNull();
  }));

  it('guardarEdicion debe mostrar error si el PUT falla', fakeAsync(() => {
    fixture.detectChanges();
    httpMock.expectOne(BASE).flush(proveedoresMock);
    tick();
    component.guardarEdicion(proveedoresMock[0], 0);
    httpMock.expectOne(`${BASE}/1`).flush('Error', { status: 500, statusText: 'Error' });
    tick();
    expect(component.errorMessage).toBe('Error al actualizar proveedor');
  }));

  it('eliminarProveedor debe hacer DELETE si el usuario confirma', fakeAsync(() => {
    spyOn(window, 'confirm').and.returnValue(true);
    fixture.detectChanges();
    httpMock.expectOne(BASE).flush(proveedoresMock);
    tick();
    component.eliminarProveedor(1);
    const del = httpMock.expectOne(`${BASE}/1`);
    expect(del.request.method).toBe('DELETE');
    del.flush({});
    tick();
    httpMock.expectOne(BASE).flush([proveedoresMock[1]]);
    tick();
    expect(component.successMessage).toBe('Proveedor eliminado');
  }));

  it('eliminarProveedor no debe hacer DELETE si cancela', fakeAsync(() => {
    spyOn(window, 'confirm').and.returnValue(false);
    fixture.detectChanges();
    httpMock.expectOne(BASE).flush(proveedoresMock);
    tick();
    component.eliminarProveedor(1);
    httpMock.expectNone(`${BASE}/1`);
  }));
});
