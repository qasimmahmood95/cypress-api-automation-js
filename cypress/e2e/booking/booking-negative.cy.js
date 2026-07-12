import authService from '../../support/api/auth.service';
import bookingService from '../../support/api/booking.service';
import { BookingBuilder } from '../../support/builders/booking.builder';
import { STATUS } from '../../support/constants';

const NON_EXISTENT_BOOKING_ID = 999999999;
const INVALID_TOKEN = 'not-a-valid-token';

describe('Booking API — negative scenarios', () => {
  it('returns 404 for a booking that does not exist', () => {
    bookingService
      .getBooking(NON_EXISTENT_BOOKING_ID, { failOnStatusCode: false })
      .its('status')
      .should('eq', STATUS.NOT_FOUND);
  });

  it('rejects booking creation when a required field is missing', () => {
    const missingDates = new BookingBuilder().withoutField('bookingdates').build();

    // Quirk of the demo API: invalid payloads surface as 500, not 400
    bookingService
      .createBooking(missingDates, { failOnStatusCode: false })
      .its('status')
      .should('eq', STATUS.SERVER_ERROR);
  });

  it('rejects booking creation when name fields have invalid types', () => {
    const invalidName = new BookingBuilder().withFirstName(12345).withLastName(false).build();

    // Quirk of the demo API: invalid payloads surface as 500, not 400
    bookingService
      .createBooking(invalidName, { failOnStatusCode: false })
      .its('status')
      .should('eq', STATUS.SERVER_ERROR);
  });

  it('forbids updating a booking without a token', () => {
    const booking = new BookingBuilder().build();

    bookingService.createBookingAndGetId(booking).then((bookingId) => {
      bookingService
        .updateBooking(bookingId, booking, '', { failOnStatusCode: false })
        .its('status')
        .should('eq', STATUS.FORBIDDEN);
    });
  });

  it('forbids updating a booking with an invalid token', () => {
    const booking = new BookingBuilder().build();

    bookingService.createBookingAndGetId(booking).then((bookingId) => {
      bookingService
        .updateBooking(bookingId, booking, INVALID_TOKEN, { failOnStatusCode: false })
        .its('status')
        .should('eq', STATUS.FORBIDDEN);
    });
  });

  it('forbids deleting a booking with an invalid token', () => {
    const booking = new BookingBuilder().build();

    bookingService.createBookingAndGetId(booking).then((bookingId) => {
      bookingService
        .deleteBooking(bookingId, INVALID_TOKEN, { failOnStatusCode: false })
        .its('status')
        .should('eq', STATUS.FORBIDDEN);
    });
  });

  it('cannot delete a booking that does not exist', () => {
    authService.getToken().then((token) => {
      // Quirk of the demo API: deleting a missing booking yields 405, not 404
      bookingService
        .deleteBooking(NON_EXISTENT_BOOKING_ID, token, { failOnStatusCode: false })
        .its('status')
        .should('eq', STATUS.METHOD_NOT_ALLOWED);
    });
  });
});
