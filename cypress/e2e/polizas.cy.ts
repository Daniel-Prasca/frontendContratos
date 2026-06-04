describe('Flujo de Pólizas - Admin', () => {
  beforeEach(() => {
    cy.loginComoAdmin();
    cy.visit('/admin/polizas-list');
  });

  it('debe mostrar la lista de pólizas', () => {
    cy.contains('Lista de Pólizas').should('be.visible');
  });

  it('debe mostrar la tabla con cabeceras correctas', () => {
    cy.get('table thead').within(() => {
      cy.contains('Tipo').should('exist');
      cy.contains('Estado').should('exist');
    });
  });

  it('debe navegar al formulario de crear póliza', () => {
    cy.contains('Crear Póliza').click();
    cy.url().should('include', '/registrar-polizas');
  });

  it('debe mostrar errores si se envía el formulario vacío', () => {
    cy.visit('/admin/registrar-polizas');
    cy.contains('Guardar').click();
    cy.contains('Este campo es requerido').should('be.visible');
  });

  it('debe crear una póliza nueva y redirigir a la lista', () => {
    cy.visit('/admin/registrar-polizas');

    cy.get('#contratoId').should('not.be.disabled');
    cy.get('#contratoId option').should('have.length.greaterThan', 1);
    cy.get('#contratoId').select(1);

    cy.get('#tipo').type('Cumplimiento');
    cy.get('#fechaVencimiento').type('2026-12-31');
    cy.get('#estado').type('Activa');

    cy.contains('Guardar').click();
    cy.url().should('include', '/polizas-list');
  });
});
