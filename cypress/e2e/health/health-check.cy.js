describe('Health check', () => {
  it('GET /ping confirms the API is up', () => {
    cy.request('/ping').its('status').should('eq', 201);
  });
});
