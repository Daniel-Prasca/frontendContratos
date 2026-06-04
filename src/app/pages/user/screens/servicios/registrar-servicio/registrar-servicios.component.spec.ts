import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { RegistrarServiciosComponent } from './registrar-servicios.component';
import { ServicioService } from '../../../services/servicio.service';
import { ContratoService } from '../../../../admin/services/contrato.service';
import { ContratoDto } from '../../../../../core/interfaces/contrato';
import { Router } from '@angular/router';

describe('RegistrarServiciosComponent - unitaria', () => {
  let fixture: ComponentFixture<RegistrarServiciosComponent>;
  let component: RegistrarServiciosComponent;
  let servicioServiceSpy: jasmine.SpyObj<ServicioService>;
  let contratoServiceSpy: jasmine.SpyObj<ContratoService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const contratosMock: ContratoDto[] = [
    { id: 1, proveedorId: 10, objeto: 'Contrato A', fechaInicio: '2025-01-01', fechaFin: '2025-12-31' },
  ];

  const formValido = { nombre: 'Servicio de prueba', precio: 500, contratoId: 1 };

  beforeEach(async () => {
    servicioServiceSpy  = jasmine.createSpyObj('ServicioService',  ['crearServicio']);
    contratoServiceSpy  = jasmine.createSpyObj('ContratoService',  ['obtenerContratos']);
    routerSpy           = jasmine.createSpyObj('Router', ['navigate']);

    contratoServiceSpy.obtenerContratos.and.returnValue(of(contratosMock));

    await TestBed.configureTestingModule({
      imports: [RegistrarServiciosComponent, ReactiveFormsModule, HttpClientTestingModule, RouterTestingModule],
      providers: [
        { provide: ServicioService,  useValue: servicioServiceSpy  },
        { provide: ContratoService,  useValue: contratoServiceSpy  },
        { provide: Router,           useValue: routerSpy           },
      ],
    }).compileComponents();

    fixture   = TestBed.createComponent(RegistrarServiciosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crearse el componente', () => expect(component).toBeTruthy());

  it('debe cargar contratos al iniciar', () => {
    expect(contratoServiceSpy.obtenerContratos).toHaveBeenCalled();
    expect(component.contratos.length).toBe(1);
  });

  it('el formulario es inválido cuando está vacío', () => expect(component.form.invalid).toBeTrue());

  it('el formulario es válido con todos los campos completos', () => {
    component.form.setValue(formValido);
    expect(component.form.valid).toBeTrue();
  });

  it('campo nombre es requerido', () => {
    component.form.patchValue({ nombre: '' });
    expect(component.form.get('nombre')?.hasError('required')).toBeTrue();
  });

  it('campo precio es requerido', () => {
    component.form.patchValue({ precio: '' });
    expect(component.form.get('precio')?.hasError('required')).toBeTrue();
  });

  it('campo contratoId es requerido', () => {
    component.form.patchValue({ contratoId: '' });
    expect(component.form.get('contratoId')?.hasError('required')).toBeTrue();
  });

  it('precio negativo es inválido', () => {
    component.form.patchValue({ precio: -1 });
    expect(component.form.get('precio')?.hasError('min')).toBeTrue();
  });

  it('NO llama al servicio si el formulario es inválido', () => {
    component.guardarServicio();
    expect(servicioServiceSpy.crearServicio).not.toHaveBeenCalled();
  });

  it('debe llamar a crearServicio con el formulario válido', () => {
    servicioServiceSpy.crearServicio.and.returnValue(of({ id: 1, ...formValido, contratoObjeto: 'A' }));
    component.form.setValue(formValido);
    component.guardarServicio();
    expect(servicioServiceSpy.crearServicio).toHaveBeenCalledWith(formValido);
  });

  it('debe navegar a servicios-list tras crear exitosamente', () => {
    servicioServiceSpy.crearServicio.and.returnValue(of({ id: 1, ...formValido, contratoObjeto: 'A' }));
    component.form.setValue(formValido);
    component.guardarServicio();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/user/servicios-list']);
  });

  it('debe mostrar errorMessage si falla la creación', () => {
    servicioServiceSpy.crearServicio.and.returnValue(throwError(() => new Error('Error')));
    component.form.setValue(formValido);
    component.guardarServicio();
    expect(component.errorMessage).toBe('Error al crear servicio');
  });
});
