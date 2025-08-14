describe('Authentication Flow', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should display login form', () => {
    cy.get('[data-cy=login-button]').click();
    cy.url().should('include', '/auth');
    
    cy.get('[data-cy=email-input]').should('be.visible');
    cy.get('[data-cy=password-input]').should('be.visible');
    cy.get('[data-cy=submit-button]').should('be.visible');
  });

  it('should show validation errors for invalid input', () => {
    cy.get('[data-cy=login-button]').click();
    
    // Try to submit without input
    cy.get('[data-cy=submit-button]').click();
    
    // Should show validation errors
    cy.get('[data-cy=email-error]').should('be.visible');
    cy.get('[data-cy=password-error]').should('be.visible');
  });

  it('should handle successful login', () => {
    // This test would require a test user in your database
    cy.get('[data-cy=login-button]').click();
    
    cy.get('[data-cy=email-input]').type('test@example.com');
    cy.get('[data-cy=password-input]').type('password123');
    cy.get('[data-cy=submit-button]').click();
    
    // Wait for authentication to complete
    cy.waitForSupabase();
    
    // Should redirect to dashboard
    cy.url().should('include', '/dashboard');
    cy.get('[data-cy=user-menu]').should('be.visible');
  });

  it('should handle login failure', () => {
    cy.get('[data-cy=login-button]').click();
    
    cy.get('[data-cy=email-input]').type('invalid@example.com');
    cy.get('[data-cy=password-input]').type('wrongpassword');
    cy.get('[data-cy=submit-button]').click();
    
    // Should show error message
    cy.get('[data-cy=error-message]').should('be.visible');
    cy.get('[data-cy=error-message]').should('contain', 'Invalid credentials');
  });

  it('should maintain authentication state on page refresh', () => {
    // Login first
    cy.login('test@example.com', 'password123');
    
    // Refresh the page
    cy.reload();
    
    // Should still be authenticated
    cy.isAuthenticated();
  });

  it('should logout successfully', () => {
    // Login first
    cy.login('test@example.com', 'password123');
    
    // Logout
    cy.logout();
    
    // Should redirect to home page
    cy.url().should('eq', Cypress.config().baseUrl + '/');
    
    // Should show login button
    cy.get('[data-cy=login-button]').should('be.visible');
  });
});
