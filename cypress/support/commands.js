import { validateSchema } from './utils/schema-validator';

/**
 * Validates the body of a yielded response against a JSON Schema.
 * Chain directly off any request: cy.request(...).validateSchema(schema)
 */
Cypress.Commands.add('validateSchema', { prevSubject: true }, (response, schema) => {
  validateSchema(response.body, schema);
  return cy.wrap(response, { log: false });
});
