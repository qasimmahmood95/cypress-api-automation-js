import { faker } from '@faker-js/faker';

const toIsoDate = (date) => date.toISOString().split('T')[0];

/**
 * Builds realistic, randomized booking payloads so tests never depend on
 * shared static data or collide with each other. Chain the with* methods
 * to pin any field a test needs to assert on.
 */
export class BookingBuilder {
  constructor() {
    const checkin = faker.date.soon({ days: 30 });
    const checkout = faker.date.soon({ days: 30, refDate: checkin });

    this.booking = {
      firstname: faker.person.firstName(),
      lastname: faker.person.lastName(),
      totalprice: faker.number.int({ min: 50, max: 5000 }),
      depositpaid: faker.datatype.boolean(),
      bookingdates: {
        checkin: toIsoDate(checkin),
        checkout: toIsoDate(checkout),
      },
      additionalneeds: faker.helpers.arrayElement([
        'Breakfast',
        'Late checkout',
        'Airport transfer',
        'Extra towels',
      ]),
    };
  }

  withFirstName(firstname) {
    this.booking.firstname = firstname;
    return this;
  }

  withLastName(lastname) {
    this.booking.lastname = lastname;
    return this;
  }

  withTotalPrice(totalprice) {
    this.booking.totalprice = totalprice;
    return this;
  }

  withDepositPaid(depositpaid) {
    this.booking.depositpaid = depositpaid;
    return this;
  }

  withBookingDates(checkin, checkout) {
    this.booking.bookingdates = { checkin, checkout };
    return this;
  }

  withAdditionalNeeds(additionalneeds) {
    this.booking.additionalneeds = additionalneeds;
    return this;
  }

  withoutField(field) {
    delete this.booking[field];
    return this;
  }

  build() {
    return { ...this.booking, bookingdates: { ...this.booking.bookingdates } };
  }
}
