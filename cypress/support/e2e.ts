// Import commands.js using ES2015 syntax:
import './commands';

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Hide fetch/XHR requests from command log
const app = window.top;
if (app) {
  app.document.addEventListener('DOMContentLoaded', () => {
    const style = app.document.createElement('style');
    style.innerHTML = '.command-name-http-request { display: none }';
    app.document.head.appendChild(style);
  });
}

// Global error handling
Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from failing the test
  if (err.message.includes('ResizeObserver loop limit exceeded')) {
    return false;
  }
  if (err.message.includes('Non-Error promise rejection captured')) {
    return false;
  }
  return true;
});

// Custom command for waiting for Supabase operations
Cypress.Commands.add('waitForSupabase', () => {
  cy.wait(1000); // Adjust based on your Supabase response times
});

// Custom command for login
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.visit('/auth');
  cy.get('[data-cy=email-input]').type(email);
  cy.get('[data-cy=password-input]').type(password);
  cy.get('[data-cy=login-button]').click();
  cy.url().should('not.include', '/auth');
});

// Custom command for logout
Cypress.Commands.add('logout', () => {
  cy.get('[data-cy=user-menu]').click();
  cy.get('[data-cy=logout-button]').click();
  cy.url().should('include', '/');
});

// Custom command for checking if user is authenticated
Cypress.Commands.add('isAuthenticated', () => {
  cy.get('body').should('not.contain', 'Sign In');
  cy.get('body').should('contain', 'Dashboard');
});
