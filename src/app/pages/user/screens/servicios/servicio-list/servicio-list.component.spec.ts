import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { ServicioListComponent } from './servicio-list.component';
import { ServicioService } from '../../../services/servicio.service';
import { AuthService } from '../../../../../auth/services/auth.service';
import { ServicioDto } from '../../../../../core/interfaces/servicio';
import { environment } from '../../../../../../environments/environments';

describe('ServicioListComponent - integración', () => {
  let fixture: ComponentFixture<ServicioListComponent>;
  let component: ServicioListComponent;
  let httpMock: HttpTestingController;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  const BASE = `${environment.apiUrl}/servicios`;

  const serviciosMock: ServicioDto[] = [
    { id: 1, nombre: 'Servicio A', precio: 100, contratoId: 1, contratoObjeto: 'Objeto A' },
    { id: 2, nombre: 'Servicio B', precio: 200, contratoId: 2, contratoObjeto: 'Objeto B' },
  ];

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getToken']);
    authServiceSpy.getToken.and.returnValue('token-prueba');

    await TestBed.configureTestingModule({
      imports: [ServicioListComponent, HttpClientTestingModule, RouterTestingModule, FormsModule],
      providers: [
        ServicioService,
        { provide: AuthService, useValue: authServiceSpy },
      ],
    }).compileComponents();

    fixture   = TestBed.createComponent(ServicioListComponent);
    component = fixture.componentInstance;
    httpMock  = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('debe crearse el componente', fakeAsync(() => {
    fixture.detectChanges();
    httpMock.expectOne(BASE).flush(serviciosMock);
    tick();
    expect(component).toBeTruthy();
  }));

  it('debe cargar servicios al iniciar', fakeAsync(() => {
    fixture.detectChanges();
    httpMock.expectOne(BASE).flush(serviciosMock);
    tick();
    expect(component.servicios.length).toBe(2);
  }));

  it('debe mostrar errorMessage si falla la carga', fakeAsync(() => {
    fixture.detectChanges();
    httpMock.expectOne(BASE).flush('Error', { status: 500, statusText: 'Server Error' });
    tick();
    expect(component.errorMessage).toBe('Error al cargar servicios ❌');
  }));

  it('editarServicio debe activar el modo edición', fakeAsync(() => {
    fixture.detectChanges();
    httpMock.expectOne(BASE).flush(serviciosMock);
    tick();
    component.editarServicio(0);
    expect(component.editIndex).toBe(0);
  }));

  it('cancelarEdicion debe desactivar edición y recargar', fakeAsync(() => {
    fixture.detectChanges();
    httpMock.expectOne(BASE).flush(serviciosMock);
    tick();
    component.editarServicio(0);
    component.cancelarEdicion();
    httpMock.expectOne(BASE).flush(serviciosMock);
    tick();
    expect(component.editIndex).toBeNull();
  }));

  it('guardarEdicion debe hacer PUT y recargar la lista', fakeAsync(() => {
    fixture.detectChanges();
    httpMock.expectOne(BASE).flush(serviciosMock);
    tick();
    component.guardarEdicion(serviciosMock[0], 0);
    const put = httpMock.expectOne(`${BASE}/1`);
    expect(put.request.method).toBe('PUT');
    put.flush({});
    tick();
    httpMock.expectOne(BASE).flush(serviciosMock);
    tick();
    expect(component.editIndex).toBeNull();
  }));

  it('guardarEdicion debe mostrar error si el PUT falla', fakeAsync(() => {
    fixture.detectChanges();
    httpMock.expectOne(BASE).flush(serviciosMock);
    tick();
    component.guardarEdicion(serviciosMock[0], 0);
    httpMock.expectOne(`${BASE}/1`).flush('Error', { status: 500, statusText: 'Error' });
    tick();
    expect(component.errorMessage).toBe('Error al actualizar servicio');
  }));

  it('eliminarServicio debe hacer DELETE si el usuario confirma', fakeAsync(() => {
    spyOn(window, 'confirm').and.returnValue(true);
    fixture.detectChanges();
    httpMock.expectOne(BASE).flush(serviciosMock);
    tick();
    component.eliminarServicio(1);
    const del = httpMock.expectOne(`${BASE}/1`);
    expect(del.request.method).toBe('DELETE');
    del.flush({});
    tick();
    httpMock.expectOne(BASE).flush([serviciosMock[1]]);
    tick();
    expect(component.successMessage).toBe('Servicio eliminado');
  }));

  it('eliminarServicio no debe hacer DELETE si cancela', fakeAsync(() => {
    spyOn(window, 'confirm').and.returnValue(false);
    fixture.detectChanges();
    httpMock.expectOne(BASE).flush(serviciosMock);
    tick();
    component.eliminarServicio(1);
    httpMock.expectNone(`${BASE}/1`);
  }));
});
