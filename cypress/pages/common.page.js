import userDetails from '../../test-data/valid/user_details.json';

export default class Common {
  createNewBooking() {
    let bookingId = '';
    return cy.request('POST', '/booking', userDetails).then((booking) => {
      expect(booking.status).to.eq(200);
      expect(booking.body.booking).to.contain({
        firstname: userDetails.firstname,
      });
      bookingId = booking.body.bookingid;
      return bookingId;
    });
  }

  createToken(data) {
    let token = '';
    return cy.request('POST', '/auth', data).then((response) => {
      expect(response.status).to.eq(200);
      token = response.body.token;
      return token;
    });
  }
}
