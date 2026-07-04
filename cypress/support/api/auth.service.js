/**
 * Service object encapsulating the /auth endpoint.
 * Every method returns the Cypress chainable so specs can assert on
 * status, body, and schema without re-declaring endpoint details.
 */
class AuthService {
  /**
   * Requests an auth token. Defaults to the configured API credentials;
   * pass explicit credentials (and options like failOnStatusCode) to
   * exercise negative paths.
   */
  createToken(credentials, options = {}) {
    const body = credentials ?? {
      username: Cypress.env('apiUsername'),
      password: Cypress.env('apiPassword'),
    };
    return cy.request({
      method: 'POST',
      url: '/auth',
      body,
      ...options,
    });
  }

  /** Yields just the token string for tests that need an authenticated call. */
  getToken() {
    return this.createToken().its('body.token');
  }
}

export default new AuthService();
