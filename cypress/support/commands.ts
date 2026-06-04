// Comandos reutilizables de login — evitan repetir el flujo de UI en cada test

Cypress.Commands.add('loginComoAdmin', () => {
  cy.request('POST', 'http://localhost:8080/api/auth/login', {
    email: 'admin@contratos.com',
    password: '12345',
  }).then((resp) => {
    localStorage.setItem('authToken', resp.body.token);
    localStorage.setItem('user', JSON.stringify(resp.body.user));
  });
});

Cypress.Commands.add('loginComoUser', () => {
  cy.request('POST', 'http://localhost:8080/api/auth/login', {
    email: 'usuario@contratos.com',
    password: '12345',
  }).then((resp) => {
    localStorage.setItem('authToken', resp.body.token);
    localStorage.setItem('user', JSON.stringify(resp.body.user));
  });
});

declare global {
  namespace Cypress {
    interface Chainable {
      loginComoAdmin(): Chainable<void>;
      loginComoUser(): Chainable<void>;
    }
  }
}
