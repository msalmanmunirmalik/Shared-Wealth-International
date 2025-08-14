/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to wait for Supabase operations
       * @example cy.waitForSupabase()
       */
      waitForSupabase(): Chainable<void>;
      
      /**
       * Custom command to login with email and password
       * @example cy.login('user@example.com', 'password')
       */
      login(email: string, password: string): Chainable<void>;
      
      /**
       * Custom command to logout
       * @example cy.logout()
       */
      logout(): Chainable<void>;
      
      /**
       * Custom command to check if user is authenticated
       * @example cy.isAuthenticated()
       */
      isAuthenticated(): Chainable<void>;
      
      /**
       * Custom command to create test data
       * @example cy.createTestCompany('Test Company')
       */
      createTestCompany(name: string): Chainable<void>;
      
      /**
       * Custom command to clean up test data
       * @example cy.cleanupTestData()
       */
      cleanupTestData(): Chainable<void>;
    }
  }
}

// Custom command for creating test company
Cypress.Commands.add('createTestCompany', (name: string) => {
  // This would interact with your Supabase database
  // Implementation depends on your API structure
  cy.log(`Creating test company: ${name}`);
});

// Custom command for cleaning up test data
Cypress.Commands.add('cleanupTestData', () => {
  // This would clean up test data from your database
  cy.log('Cleaning up test data');
});

export {};
