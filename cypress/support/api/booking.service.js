/**
 * Service object encapsulating the /booking endpoints.
 * Methods accept an optional `options` object that is spread into
 * cy.request, so negative tests can pass { failOnStatusCode: false }
 * without duplicating endpoint knowledge.
 */
class BookingService {
  getBookingIds(filters = {}, options = {}) {
    return cy.request({
      method: 'GET',
      url: '/booking',
      qs: filters,
      ...options,
    });
  }

  getBooking(bookingId, options = {}) {
    return cy.request({
      method: 'GET',
      url: `/booking/${bookingId}`,
      ...options,
    });
  }

  createBooking(booking, options = {}) {
    return cy.request({
      method: 'POST',
      url: '/booking',
      body: booking,
      ...options,
    });
  }

  updateBooking(bookingId, booking, token, options = {}) {
    return cy.request({
      method: 'PUT',
      url: `/booking/${bookingId}`,
      headers: this.authHeader(token),
      body: booking,
      ...options,
    });
  }

  partialUpdateBooking(bookingId, partialBooking, token, options = {}) {
    return cy.request({
      method: 'PATCH',
      url: `/booking/${bookingId}`,
      headers: this.authHeader(token),
      body: partialBooking,
      ...options,
    });
  }

  deleteBooking(bookingId, token, options = {}) {
    return cy.request({
      method: 'DELETE',
      url: `/booking/${bookingId}`,
      headers: this.authHeader(token),
      ...options,
    });
  }

  /** Creates a booking and yields its generated id. */
  createBookingAndGetId(booking) {
    return this.createBooking(booking).its('body.bookingid');
  }

  authHeader(token) {
    return { Cookie: `token=${token}` };
  }
}

export default new BookingService();
