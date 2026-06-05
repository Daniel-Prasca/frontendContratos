import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { PolizasListComponent } from './polizas-list.component';
import { PolizaService } from '../../../services/poliza.service';
import { AuthService } from '../../../../../auth/services/auth.service';
import { PolizaDto } from '../../../../../core/interfaces/poliza';
import { environment } from '../../../../../../environments/environments';

describe('PolizasListComponent - integración', () => {
  let fixture: ComponentFixture<PolizasListComponent>;
  let component: PolizasListComponent;
  let httpMock: HttpTestingController;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  const BASE = `${environment.apiUrl}/polizas`;

  const polizasMock: PolizaDto[] = [
    { id: 1, tipo: 'Vida', fechaVencimiento: '2025-12-31', estado: 'Activa', contratoId: 1 },
    { id: 2, tipo: 'Salud', fechaVencimiento: '2025-06-30', estado: 'Activa', contratoId: 2 },
  ];

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getToken']);
    authServiceSpy.getToken.and.returnValue('token-prueba');

    await TestBed.configureTestingModule({
      imports: [PolizasListComponent, HttpClientTestingModule, RouterTestingModule, FormsModule],
      providers: [
        PolizaService,
        { provide: AuthService, useValue: authServiceSpy },
      ],
    }).compileComponents();

    fixture   = TestBed.createComponent(PolizasListComponent);
    component = fixture.componentInstance;
    httpMock  = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('debe crearse el componente', fakeAsync(() => {
    fixture.detectChanges();
    httpMock.expectOne(BASE).flush(polizasMock);
    tick();
    expect(component).toBeTruthy();
  }));

  it('debe cargar pólizas al iniciar', fakeAsync(() => {
    fixture.detectChanges();
    httpMock.expectOne(BASE).flush(polizasMock);
    tick();
    expect(component.polizas.length).toBe(2);
  }));

  it('debe mostrar errorMessage si falla la carga', fakeAsync(() => {
    fixture.detectChanges();
    httpMock.expectOne(BASE).flush('Error', { status: 500, statusText: 'Server Error' });
    tick();
    expect(component.errorMessage).toBe('Error al cargar pólizas ❌');
  }));

  it('editarPoliza debe activar el modo edición', fakeAsync(() => {
    fixture.detectChanges();
    httpMock.expectOne(BASE).flush(polizasMock);
    tick();
    component.editarPoliza(0);
    expect(component.editIndex).toBe(0);
  }));

  it('cancelarEdicion debe desactivar edición y recargar', fakeAsync(() => {
    fixture.detectChanges();
    httpMock.expectOne(BASE).flush(polizasMock);
    tick();
    component.editarPoliza(0);
    component.cancelarEdicion();
    httpMock.expectOne(BASE).flush(polizasMock);
    tick();
    expect(component.editIndex).toBeNull();
  }));

  it('guardarEdicion debe hacer PUT y recargar la lista', fakeAsync(() => {
    fixture.detectChanges();
    httpMock.expectOne(BASE).flush(polizasMock);
    tick();
    component.guardarEdicion(polizasMock[0], 0);
    const put = httpMock.expectOne(`${BASE}/1`);
    expect(put.request.method).toBe('PUT');
    put.flush({});
    tick();
    httpMock.expectOne(BASE).flush(polizasMock);
    tick();
    expect(component.editIndex).toBeNull();
  }));

  it('guardarEdicion debe mostrar error si el PUT falla', fakeAsync(() => {
    fixture.detectChanges();
    httpMock.expectOne(BASE).flush(polizasMock);
    tick();
    component.guardarEdicion(polizasMock[0], 0);
    httpMock.expectOne(`${BASE}/1`).flush('Error', { status: 500, statusText: 'Error' });
    tick();
    expect(component.errorMessage).toBe('Error al actualizar póliza');
  }));

  it('eliminarPoliza debe hacer DELETE si el usuario confirma', fakeAsync(() => {
    spyOn(window, 'confirm').and.returnValue(true);
    fixture.detectChanges();
    httpMock.expectOne(BASE).flush(polizasMock);
    tick();
    component.eliminarPoliza(1);
    const del = httpMock.expectOne(`${BASE}/1`);
    expect(del.request.method).toBe('DELETE');
    del.flush({});
    tick();
    httpMock.expectOne(BASE).flush([polizasMock[1]]);
    tick();
    expect(component.successMessage).toBe('Póliza eliminada');
  }));

  it('eliminarPoliza no debe hacer DELETE si el usuario cancela', fakeAsync(() => {
    spyOn(window, 'confirm').and.returnValue(false);
    fixture.detectChanges();
    httpMock.expectOne(BASE).flush(polizasMock);
    tick();
    component.eliminarPoliza(1);
    httpMock.expectNone(`${BASE}/1`);
  }));
});
