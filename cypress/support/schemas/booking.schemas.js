/**
 * JSON Schemas describing the Restful Booker API contracts.
 * Used with cy.request(...).validateSchema(schema) to catch breaking
 * contract changes, not just wrong values.
 */

export const bookingSchema = {
  type: 'object',
  required: ['firstname', 'lastname', 'totalprice', 'depositpaid', 'bookingdates'],
  properties: {
    firstname: { type: 'string' },
    lastname: { type: 'string' },
    totalprice: { type: 'number' },
    depositpaid: { type: 'boolean' },
    bookingdates: {
      type: 'object',
      required: ['checkin', 'checkout'],
      properties: {
        checkin: { type: 'string', pattern: '^\\d{4}-\\d{2}-\\d{2}$' },
        checkout: { type: 'string', pattern: '^\\d{4}-\\d{2}-\\d{2}$' },
      },
    },
    additionalneeds: { type: 'string' },
  },
};

export const createBookingResponseSchema = {
  type: 'object',
  required: ['bookingid', 'booking'],
  properties: {
    bookingid: { type: 'number' },
    booking: bookingSchema,
  },
};

export const bookingIdListSchema = {
  type: 'array',
  items: {
    type: 'object',
    required: ['bookingid'],
    properties: {
      bookingid: { type: 'number' },
    },
  },
};

export const authTokenSchema = {
  type: 'object',
  required: ['token'],
  properties: {
    token: { type: 'string', minLength: 1 },
  },
};
