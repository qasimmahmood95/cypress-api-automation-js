import { STATUS } from '../../support/constants';

describe('Health check', () => {
  it('GET /ping confirms the API is up', () => {
    // Quirk of the demo API: the health check responds 201, not 200
    cy.request('/ping').its('status').should('eq', STATUS.CREATED);
  });
});
