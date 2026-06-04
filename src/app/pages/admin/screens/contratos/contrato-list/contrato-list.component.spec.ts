import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { ContratoListComponent } from './contrato-list.component';
import { ContratoService } from '../../../services/contrato.service';
import { AuthService } from '../../../../../auth/services/auth.service';
import { UserAuthService } from '../../../../../auth/services/user.service';
import { ContratoDto } from '../../../../../core/interfaces/contrato';
import { environment } from '../../../../../../environments/environments';

describe('ContratoListComponent - integración (componente + servicio + HTTP)', () => {
  let fixture: ComponentFixture<ContratoListComponent>;
  let component: ContratoListComponent;
  let httpMock: HttpTestingController;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  const BASE = `${environment.apiUrl}/contratos`;

  const contratosMock: ContratoDto[] = [
    { id: 1, proveedorId: 10, objeto: 'Contrato Alpha', fechaInicio: '2025-01-01', fechaFin: '2025-12-31', proveedorNombre: 'Empresa X' },
    { id: 2, proveedorId: 11, objeto: 'Contrato Beta',  fechaInicio: '2025-03-01', fechaFin: '2025-09-30', proveedorNombre: 'Empresa Y' },
  ];

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getToken']);
    authServiceSpy.getToken.and.returnValue('token-de-prueba');

    await TestBed.configureTestingModule({
      imports: [
        ContratoListComponent,
        HttpClientTestingModule,
        RouterTestingModule,
        FormsModule,
      ],
      providers: [
        ContratoService,   // ← servicio REAL, no spy
        UserAuthService,
        { provide: AuthService, useValue: authServiceSpy },
      ],
    }).compileComponents();

    fixture   = TestBed.createComponent(ContratoListComponent);
    component = fixture.componentInstance;
    httpMock  = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  // ── Carga inicial ────────────────────────────────────────
  it('debe cargar los contratos al iniciar (ngOnInit → service → HTTP)', fakeAsync(() => {
    fixture.detectChanges(); // dispara ngOnInit → llama al servicio → hace GET

    const req = httpMock.expectOne(BASE);
    expect(req.request.method).toBe('GET');
    req.flush(contratosMock); // simulamos la respuesta del back

    tick(); // procesa el Observable
    fixture.detectChanges();

    expect(component.contratos.length).toBe(2);
    expect(component.contratos[0].objeto).toBe('Contrato Alpha');
  }));

  it('debe mostrar errorMessage si el back falla al cargar', fakeAsync(() => {
    fixture.detectChanges();

    const req = httpMock.expectOne(BASE);
    req.flush('Error del servidor', { status: 500, statusText: 'Internal Server Error' });

    tick();
    fixture.detectChanges();

    expect(component.errorMessage).toBe('Error al cargar contratos ❌');
  }));

  // ── Edición inline ───────────────────────────────────────
  it('editarContrato debe activar el modo edición para la fila correcta', fakeAsync(() => {
    fixture.detectChanges();
    httpMock.expectOne(BASE).flush(contratosMock);
    tick();

    component.editarContrato(0);
    expect(component.editIndex).toBe(0);
  }));

  it('cancelarEdicion debe desactivar el modo edición y recargar contratos', fakeAsync(() => {
    fixture.detectChanges();
    httpMock.expectOne(BASE).flush(contratosMock);
    tick();

    component.editarContrato(0);
    component.cancelarEdicion();

    // cancelar vuelve a cargar — se espera una segunda petición GET
    const req2 = httpMock.expectOne(BASE);
    req2.flush(contratosMock);
    tick();

    expect(component.editIndex).toBeNull();
  }));

  // ── Guardar edición ──────────────────────────────────────
  it('guardarEdicion: PUT al back y recarga la lista', fakeAsync(() => {
    fixture.detectChanges();
    httpMock.expectOne(BASE).flush(contratosMock);
    tick();

    const contratoEditado = { ...contratosMock[0], objeto: 'Contrato Modificado' };
    component.guardarEdicion(contratoEditado, 0);

    // PUT al back
    const putReq = httpMock.expectOne(`${BASE}/1`);
    expect(putReq.request.method).toBe('PUT');
    putReq.flush({});
    tick();

    // recarga la lista después de guardar
    const getReq = httpMock.expectOne(BASE);
    getReq.flush(contratosMock);
    tick();

    expect(component.editIndex).toBeNull();
  }));

  it('guardarEdicion: muestra error si el PUT falla', fakeAsync(() => {
    fixture.detectChanges();
    httpMock.expectOne(BASE).flush(contratosMock);
    tick();

    component.guardarEdicion(contratosMock[0], 0);

    const putReq = httpMock.expectOne(`${BASE}/1`);
    putReq.flush('Error', { status: 500, statusText: 'Server Error' });
    tick();

    expect(component.errorMessage).toBe('Error al actualizar contrato');
  }));

  // ── Eliminar ─────────────────────────────────────────────
  it('eliminarContrato: DELETE al back y recarga la lista', fakeAsync(() => {
    spyOn(window, 'confirm').and.returnValue(true); // simula click en "Aceptar"

    fixture.detectChanges();
    httpMock.expectOne(BASE).flush(contratosMock);
    tick();

    component.eliminarContrato(1);

    const deleteReq = httpMock.expectOne(`${BASE}/1`);
    expect(deleteReq.request.method).toBe('DELETE');
    deleteReq.flush({});
    tick();

    // recarga la lista después de eliminar
    const getReq = httpMock.expectOne(BASE);
    getReq.flush([contratosMock[1]]);
    tick();

    expect(component.successMessage).toBe('Contrato eliminado');
  }));

  it('eliminarContrato: no hace DELETE si el usuario cancela el confirm', fakeAsync(() => {
    spyOn(window, 'confirm').and.returnValue(false); // simula click en "Cancelar"

    fixture.detectChanges();
    httpMock.expectOne(BASE).flush(contratosMock);
    tick();

    component.eliminarContrato(1);

    // la lista no cambia y no hay mensaje de éxito
    expect(component.contratos.length).toBe(2);
    expect(component.successMessage).toBeNull();
    httpMock.expectNone(`${BASE}/1`);
  }));
});
