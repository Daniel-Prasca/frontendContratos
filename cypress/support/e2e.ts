import './commands';

// Evita que Cypress falle por excepciones no capturadas del app Angular
// (zone.js errors, HTTP errors en startup, etc.)
Cypress.on('uncaught:exception', () => false);
