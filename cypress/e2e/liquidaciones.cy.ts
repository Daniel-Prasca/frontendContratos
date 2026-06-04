describe('Flujo de Liquidaciones - User', () => {
  beforeEach(() => {
    cy.loginComoUser();
    cy.visit('/user/liquidaciones-list');
  });

  it('debe mostrar la lista de liquidaciones', () => {
    cy.contains('Lista de Liquidaciones').should('be.visible');
  });

  it('debe mostrar la tabla con cabeceras correctas', () => {
    cy.get('table thead').within(() => {
      cy.contains('Estado').should('exist');
      cy.contains('Total').should('exist');
      cy.contains('Contrato').should('exist');
      cy.contains('Servicio').should('exist');
    });
  });

  it('User ve el botón Crear Liquidación', () => {
    cy.contains('Crear Liquidación').should('be.visible');
  });

  it('debe navegar al formulario de crear liquidación', () => {
    cy.contains('Crear Liquidación').click();
    cy.url().should('include', '/registrar-liquidaciones');
  });

  it('debe mostrar errores si se envía el formulario vacío', () => {
    cy.visit('/user/registrar-liquidaciones');
    cy.contains('Guardar Liquidación').click();
    cy.contains('Este campo es requerido').should('be.visible');
  });

  it('debe permitir seleccionar contrato y servicio en el formulario', () => {
    cy.visit('/user/registrar-liquidaciones');

    cy.get('#contratoId option').should('have.length.greaterThan', 1);
    cy.get('#contratoId').select(1);

    cy.get('#servicioId option').should('have.length.greaterThan', 1);
    cy.get('#servicioId').select(1);

    cy.get('#cantidad').type('3');

    // el formulario ya no debe tener el error de requerido
    cy.contains('Guardar Liquidación').click();
    cy.url().should('include', '/liquidaciones-list');
  });
});

describe('Flujo de Liquidaciones - Admin', () => {
  beforeEach(() => {
    cy.loginComoAdmin();
    cy.visit('/admin/liquidaciones-list');
  });

  it('Admin puede ver todas las liquidaciones', () => {
    cy.contains('Lista de Liquidaciones').should('be.visible');
  });

  it('Admin puede activar el modo edición en una liquidación', () => {
    cy.get('table tbody tr').should('have.length.greaterThan', 0);
    cy.get('table tbody tr').first().within(() => {
      cy.contains('Editar').click();
      cy.contains('Guardar').should('be.visible');
      cy.contains('Cancelar').should('be.visible');
    });
  });

  it('Admin puede cancelar la edición', () => {
    cy.get('table tbody tr').first().within(() => {
      cy.contains('Editar').click();
      cy.contains('Cancelar').click();
      cy.contains('Editar').should('be.visible');
    });
  });
});
