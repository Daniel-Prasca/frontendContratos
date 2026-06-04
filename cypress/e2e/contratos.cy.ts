describe('Flujo de Contratos (Admin)', () => {

  beforeEach(() => {
    // Login programático: más rápido que pasar por la UI en cada test
    cy.loginComoAdmin();
    cy.visit('/admin/contratos-list');
  });

  // ── Lista de contratos ────────────────────────────────────
  it('debe mostrar la página de lista de contratos', () => {
    cy.contains('Lista de Contratos').should('be.visible');
    cy.contains('Crear Contrato').should('be.visible');
  });

  it('debe mostrar la tabla con al menos una columna de cabecera', () => {
    cy.get('table thead').within(() => {
      cy.contains('Proveedor').should('exist');
      cy.contains('Objeto').should('exist');
      cy.contains('Fecha Inicio').should('exist');
      cy.contains('Fecha Fin').should('exist');
      cy.contains('Acciones').should('exist');
    });
  });

  // ── Navegación al formulario ──────────────────────────────
  it('debe navegar al formulario al hacer clic en "Crear Contrato"', () => {
    cy.contains('Crear Contrato').click();
    cy.url().should('include', '/registrar-contratos');
    cy.contains('Registrar Contrato').should('be.visible');
  });

  // ── Validación del formulario ─────────────────────────────
  it('debe mostrar errores de validación si se envía el formulario vacío', () => {
    cy.visit('/admin/registrar-contratos');
    cy.contains('Guardar Contrato').click();
    cy.contains('Este campo es requerido').should('be.visible');
  });

  // ── Crear contrato ────────────────────────────────────────
  it('debe crear un contrato nuevo y redirigir a la lista', () => {
    cy.visit('/admin/registrar-contratos');

    // Espera a que carguen los proveedores en el select
    cy.get('#proveedorId').should('not.be.disabled');
    cy.get('#proveedorId option').should('have.length.greaterThan', 1);
    cy.get('#proveedorId').select(1); // selecciona el primer proveedor real

    cy.get('#objeto').type('Contrato E2E de prueba');
    cy.get('#fechaInicio').type('2025-01-01');
    cy.get('#fechaFin').type('2025-12-31');

    cy.contains('Guardar Contrato').click();

    cy.url().should('include', '/contratos-list');
  });

  // ── Editar contrato ───────────────────────────────────────
  it('debe activar el modo edición al hacer clic en "Editar"', () => {
    // solo si hay al menos un contrato en la tabla
    cy.get('table tbody tr').should('have.length.greaterThan', 0);
    cy.get('table tbody tr').first().within(() => {
      cy.contains('Editar').click();
      // aparecen los botones Guardar y Cancelar
      cy.contains('Guardar').should('be.visible');
      cy.contains('Cancelar').should('be.visible');
    });
  });

  it('debe cancelar la edición y volver a la vista normal', () => {
    cy.get('table tbody tr').first().within(() => {
      cy.contains('Editar').click();
      cy.contains('Cancelar').click();
      // vuelven los botones originales
      cy.contains('Editar').should('be.visible');
      cy.contains('Eliminar').should('be.visible');
    });
  });

});
