import Common from '../pages/common.page';
import userDetails from '../../test-data/valid/user_details.json';
import tokenAuthCredentials from '../../test-data/valid/token_auth_credentials.json';
import partialUpdate from '../../test-data/valid/partial_update_body.json';
import update from '../../test-data/valid/update_body.json';

describe('Positive API testing', () => {
  const common = new Common();
  let token = '';

  beforeEach(() => {
    cy.request('/booking').as('booking');
    common.createToken(tokenAuthCredentials).then((auth) => {
      token = auth;
      return token;
    });
  });

  it('Health Check', () => {
    cy.request('/ping').then((ping) => {
      expect(ping.status).to.eq(201);
    });
  });

  it('Get Booking IDs', () => {
    cy.get('@booking').then((booking) => {
      expect(booking.status).to.eq(200);
    });
  });

  it('Create Booking', () => {
    cy.request('POST', '/booking', userDetails).then((booking) => {
      expect(booking.status).to.eq(200);
      expect(booking.body.booking).to.contain({
        firstname: userDetails.firstname,
      });
    });
  });

  it('Get Newly Created Booking', () => {
    common.createNewBooking().then((id) => {
      const bookingId = id;
      cy.request('/booking/' + bookingId).then((booking) => {
        expect(booking.status).to.eq(200);
        expect(booking.body).to.contain({
          firstname: userDetails.firstname,
        });
      });
    });
  });

  it('Update Booking', () => {
    common.createNewBooking().then((id) => {
      const bookingId = id;
      cy.request({
        method: 'PUT',
        form: true,
        url: '/booking/' + bookingId,
        headers: { Cookie: 'token=' + token },
        body: update,
      }).then((booking) => {
        expect(booking.status).to.eq(200);
        expect(booking.body).to.contain({
          firstname: userDetails.firstname,
        });
      });
    });
  });

  it('Partially Update Booking', () => {
    common.createNewBooking().then((id) => {
      const bookingId = id;
      cy.request({
        method: 'PATCH',
        form: true,
        url: '/booking/' + bookingId,
        headers: { Cookie: 'token=' + token },
        body: { partialUpdate },
      }).then((booking) => {
        expect(booking.status).to.eq(200);
        expect(booking.body).to.contain({
          firstname: userDetails.firstname,
        });
      });
    });
  });

  it('Delete Booking', () => {
    common.createNewBooking().then((id) => {
      const bookingId = id;
      cy.request({
        method: 'DELETE',
        form: true,
        url: '/booking/' + bookingId,
        headers: { Cookie: 'token=' + token },
      }).then((booking) => {
        expect(booking.status).to.eq(201);
      });
    });
  });
});
