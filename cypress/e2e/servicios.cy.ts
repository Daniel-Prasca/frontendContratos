describe('Flujo de Servicios - Admin', () => {
  beforeEach(() => {
    cy.loginComoAdmin();
    cy.visit('/admin/servicios-list');
  });

  it('debe mostrar la lista de servicios', () => {
    cy.contains('Lista de Servicios').should('be.visible');
  });

  it('debe mostrar la tabla con cabeceras correctas', () => {
    cy.get('table thead').within(() => {
      cy.contains('Nombre').should('exist');
      cy.contains('Precio').should('exist');
    });
  });

  it('debe navegar al formulario de crear servicio', () => {
    cy.contains('Crear Servicio').click();
    cy.url().should('include', '/registrar-servicios');
  });

  it('debe mostrar errores si se envía el formulario vacío', () => {
    cy.visit('/admin/registrar-servicios');
    cy.contains('Guardar').click();
    cy.contains('Este campo es requerido').should('be.visible');
  });
});

describe('Flujo de Servicios - User', () => {
  beforeEach(() => {
    cy.loginComoUser();
    cy.visit('/user/servicios-list');
  });

  it('User puede ver la lista de servicios', () => {
    cy.contains('Lista de Servicios').should('be.visible');
  });

  it('User puede navegar al formulario de crear servicio', () => {
    cy.contains('Crear Servicio').click();
    cy.url().should('include', '/registrar-servicios');
  });
});
