const API = 'http://localhost:8080/api';

describe('Flujo de Liquidaciones - User', () => {

  // Crea contrato + servicio para los selects del formulario
  before(() => {
    cy.request('POST', `${API}/auth/login`, {
      email: 'admin@contratos.com',
      password: '12345',
    }).then((login) => {
      const headers = { Authorization: `Bearer ${login.body.token}` };

      cy.request({
        method: 'POST', url: `${API}/proveedores`, headers,
        body: { nit: '900300400-3', nombre: 'Proveedor Liquidacion', representanteLegal: 'Legal' },
        failOnStatusCode: false,
      }).then((prov) => {
        cy.request({
          method: 'POST', url: `${API}/contratos`, headers,
          body: { proveedorId: prov.body.id, objeto: 'Contrato Liquidacion', fechaInicio: '2025-01-01', fechaFin: '2025-12-31' },
          failOnStatusCode: false,
        }).then((cont) => {
          cy.request({
            method: 'POST', url: `${API}/servicios`, headers,
            body: { nombre: 'Servicio Test', precio: 100, contratoId: cont.body.id },
            failOnStatusCode: false,
          });
        });
      });
    });
  });

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
    cy.contains('Guardar Liquidación').click();
    cy.url().should('include', '/liquidaciones-list');
  });

});

describe('Flujo de Liquidaciones - Admin', () => {

  // Crea proveedor + contrato + servicio + liquidacion para los tests de edición
  before(() => {
    cy.request('POST', `${API}/auth/login`, {
      email: 'admin@contratos.com',
      password: '12345',
    }).then((login) => {
      const token = login.body.token;
      const adminId = login.body.user.id;
      const headers = { Authorization: `Bearer ${token}` };

      cy.request({
        method: 'POST', url: `${API}/proveedores`, headers,
        body: { nit: '900400500-4', nombre: 'Proveedor Admin Liq', representanteLegal: 'Legal' },
        failOnStatusCode: false,
      }).then((prov) => {
        cy.request({
          method: 'POST', url: `${API}/contratos`, headers,
          body: { proveedorId: prov.body.id, objeto: 'Contrato Admin Liq', fechaInicio: '2025-01-01', fechaFin: '2025-12-31' },
          failOnStatusCode: false,
        }).then((cont) => {
          cy.request({
            method: 'POST', url: `${API}/servicios`, headers,
            body: { nombre: 'Servicio Admin', precio: 200, contratoId: cont.body.id },
            failOnStatusCode: false,
          }).then((serv) => {
            cy.request({
              method: 'POST', url: `${API}/liquidaciones`, headers,
              body: { contratoId: cont.body.id, servicioId: serv.body.id, usuarioId: adminId, cantidad: 1, total: 200, estado: 'Pendiente' },
              failOnStatusCode: false,
            });
          });
        });
      });
    });
  });

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
