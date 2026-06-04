describe('Flujo de Login', () => {

  beforeEach(() => {
    cy.visit('/auth/login'); // /auth redirige a /registro — el login está aquí
  });

  // ── Estructura de la página ───────────────────────────────
  it('debe mostrar el formulario de login', () => {
    cy.contains('Iniciar Sesión').should('be.visible');
    cy.get('#email').should('exist');
    cy.get('#password').should('exist');
    cy.get('button[type="submit"]').should('contain', 'Ingresar');
  });

  // ── Login exitoso como Admin ──────────────────────────────
  it('Admin puede iniciar sesión y es redirigido a /admin', () => {
    cy.get('#email').type('admin@contratos.com');
    cy.get('#password').type('12345');
    cy.get('button[type="submit"]').click();

    cy.url().should('include', '/admin');
  });

  // ── Login exitoso como User ───────────────────────────────
  it('User puede iniciar sesión y es redirigido a /user', () => {
    cy.get('#email').type('usuario@contratos.com');
    cy.get('#password').type('12345');
    cy.get('button[type="submit"]').click();

    cy.url().should('include', '/user');
  });

  // ── Credenciales incorrectas ──────────────────────────────
  it('debe permanecer en /auth/login con credenciales incorrectas', () => {
    cy.get('#email').type('noexiste@test.com');
    cy.get('#password').type('wrongpass');
    cy.get('button[type="submit"]').click();

    // el login falla: la URL no cambia
    cy.url().should('include', '/auth/login');
  });

  // ── Enlace a registro ─────────────────────────────────────
  it('debe navegar a /auth/registro al hacer clic en "Crea tu Cuenta"', () => {
    cy.contains('Crea tu Cuenta').click();
    cy.url().should('include', '/auth/registro');
  });

  // ── Logout ────────────────────────────────────────────────
  it('Admin puede cerrar sesión y es redirigido a /auth/login', () => {
    cy.get('#email').type('admin@contratos.com');
    cy.get('#password').type('12345');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/admin');

    cy.contains('Cerrar Sesión').click();
    cy.url().should('include', '/auth/login');
  });

});
