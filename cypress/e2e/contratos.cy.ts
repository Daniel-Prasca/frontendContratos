const API = 'http://localhost:8080/api';

describe('Flujo de Contratos (Admin)', () => {

  // Crea un proveedor y un contrato antes de correr los tests
  // (la BD InMemory arranca vacía, solo con usuarios seed)
  before(() => {
    cy.request('POST', `${API}/auth/login`, {
      email: 'admin@contratos.com',
      password: '12345',
    }).then((login) => {
      const headers = { Authorization: `Bearer ${login.body.token}` };

      cy.request({
        method: 'POST', url: `${API}/proveedores`, headers,
        body: { nit: '900100200-1', nombre: 'Proveedor Test', representanteLegal: 'Test Legal' },
        failOnStatusCode: false,
      }).then((prov) => {
        cy.request({
          method: 'POST', url: `${API}/contratos`, headers,
          body: { proveedorId: prov.body.id, objeto: 'Contrato Test', fechaInicio: '2025-01-01', fechaFin: '2025-12-31' },
          failOnStatusCode: false,
        });
      });
    });
  });

  beforeEach(() => {
    cy.loginComoAdmin();
    cy.visit('/admin/contratos-list');
  });

  it('debe mostrar la página de lista de contratos', () => {
    cy.contains('Lista de Contratos').should('be.visible');
    cy.contains('Crear Contrato').should('be.visible');
  });

  it('debe mostrar la tabla con cabeceras correctas', () => {
    cy.get('table thead').within(() => {
      cy.contains('Proveedor').should('exist');
      cy.contains('Objeto').should('exist');
      cy.contains('Fecha Inicio').should('exist');
      cy.contains('Fecha Fin').should('exist');
      cy.contains('Acciones').should('exist');
    });
  });

  it('debe navegar al formulario de crear contrato', () => {
    cy.contains('Crear Contrato').click();
    cy.url().should('include', '/registrar-contratos');
    cy.contains('Registrar Contrato').should('be.visible');
  });

  it('debe mostrar errores de validación si se envía el formulario vacío', () => {
    cy.visit('/admin/registrar-contratos');
    cy.contains('Guardar Contrato').click();
    cy.contains('Este campo es requerido').should('be.visible');
  });

  it('debe crear un contrato nuevo y redirigir a la lista', () => {
    cy.visit('/admin/registrar-contratos');

    cy.get('#proveedorId').should('not.be.disabled');
    cy.get('#proveedorId option').should('have.length.greaterThan', 1);
    cy.get('#proveedorId').select(1);

    cy.get('#objeto').type('Contrato E2E de prueba');
    cy.get('#fechaInicio').type('2025-01-01');
    cy.get('#fechaFin').type('2025-12-31');

    cy.contains('Guardar Contrato').click();
    cy.url().should('include', '/contratos-list');
  });

  it('debe activar el modo edición al hacer clic en "Editar"', () => {
    cy.get('table tbody tr').should('have.length.greaterThan', 0);
    cy.get('table tbody tr').first().within(() => {
      cy.contains('Editar').click();
      cy.contains('Guardar').should('be.visible');
      cy.contains('Cancelar').should('be.visible');
    });
  });

  it('debe cancelar la edición y volver a la vista normal', () => {
    cy.get('table tbody tr').first().within(() => {
      cy.contains('Editar').click();
      cy.contains('Cancelar').click();
      cy.contains('Editar').should('be.visible');
      cy.contains('Eliminar').should('be.visible');
    });
  });

});
