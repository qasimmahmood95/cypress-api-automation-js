/**
 * HTTP status codes used in assertions. The demo API deviates from REST
 * conventions in a few places; those call sites carry a comment naming
 * the quirk so the intent is auditable.
 */
export const STATUS = {
  OK: 200,
  CREATED: 201,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  SERVER_ERROR: 500,
};
