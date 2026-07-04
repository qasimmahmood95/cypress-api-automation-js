import authService from '../../support/api/auth.service';
import bookingService from '../../support/api/booking.service';
import { BookingBuilder } from '../../support/builders/booking.builder';
import { STATUS } from '../../support/constants';
import {
  bookingSchema,
  bookingIdListSchema,
  createBookingResponseSchema,
} from '../../support/schemas/booking.schemas';

describe('Booking API — CRUD', () => {
  let token;

  before(() => {
    authService.getToken().then((authToken) => {
      token = authToken;
    });
  });

  it('lists booking ids', () => {
    bookingService
      .getBookingIds()
      .validateSchema(bookingIdListSchema)
      .then((response) => {
        expect(response.status).to.eq(STATUS.OK);
        expect(response.body).to.not.be.empty;
      });
  });

  it('filters bookings by guest name', () => {
    const booking = new BookingBuilder().withFirstName('UniqueFilterName').build();

    bookingService.createBookingAndGetId(booking).then((bookingId) => {
      bookingService
        .getBookingIds({ firstname: booking.firstname, lastname: booking.lastname })
        .then((response) => {
          expect(response.status).to.eq(STATUS.OK);
          const ids = response.body.map((entry) => entry.bookingid);
          expect(ids).to.include(bookingId);
        });
    });
  });

  it('creates a booking and echoes the payload back', () => {
    const booking = new BookingBuilder().build();

    bookingService
      .createBooking(booking)
      .validateSchema(createBookingResponseSchema)
      .then((response) => {
        expect(response.status).to.eq(STATUS.OK);
        expect(response.body.bookingid).to.be.a('number');
        expect(response.body.booking).to.deep.equal(booking);
      });
  });

  it('retrieves a booking by id', () => {
    const booking = new BookingBuilder().build();

    bookingService.createBookingAndGetId(booking).then((bookingId) => {
      bookingService
        .getBooking(bookingId)
        .validateSchema(bookingSchema)
        .then((response) => {
          expect(response.status).to.eq(STATUS.OK);
          expect(response.body).to.deep.equal(booking);
        });
    });
  });

  it('fully updates a booking with PUT', () => {
    const original = new BookingBuilder().build();
    const updated = new BookingBuilder().withFirstName('Updated').withTotalPrice(1).build();

    bookingService.createBookingAndGetId(original).then((bookingId) => {
      bookingService.updateBooking(bookingId, updated, token).then((response) => {
        expect(response.status).to.eq(STATUS.OK);
        expect(response.body).to.deep.equal(updated);
      });
    });
  });

  it('partially updates a booking with PATCH', () => {
    const original = new BookingBuilder().build();
    const patch = { firstname: 'Patched', totalprice: 42 };

    bookingService.createBookingAndGetId(original).then((bookingId) => {
      bookingService.partialUpdateBooking(bookingId, patch, token).then((response) => {
        expect(response.status).to.eq(STATUS.OK);
        expect(response.body).to.deep.equal({ ...original, ...patch });
      });
    });
  });

  it('deletes a booking', () => {
    const booking = new BookingBuilder().build();

    bookingService.createBookingAndGetId(booking).then((bookingId) => {
      bookingService.deleteBooking(bookingId, token).then((response) => {
        // Quirk of the demo API: successful DELETE returns 201, not 204
        expect(response.status).to.eq(STATUS.CREATED);
      });

      bookingService.getBooking(bookingId, { failOnStatusCode: false }).then((response) => {
        expect(response.status).to.eq(STATUS.NOT_FOUND);
      });
    });
  });
});
