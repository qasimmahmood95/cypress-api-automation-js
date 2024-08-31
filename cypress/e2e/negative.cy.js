import Common from '../pages/common.page';
import userDetailsInvalidName from '../../test-data/invalid/user_details_invalid_name.json';
import userDetailsInvalidJson from '../../test-data/invalid/user_details_invalid_json.json';
import userDetailsMissingDate from '../../test-data/invalid/user_details_missing_date.json';
import invalidTokenAuthCredentials from '../../test-data/invalid/invalid_token_auth_credentials.json';
import update from '../../test-data/valid/update_body.json';

describe('Negative API testing', () => {
  const common = new Common();

  it('Cannot Create Booking with Invalid Name', () => {
    cy.request({
      method: 'POST',
      failOnStatusCode: false,
      form: true,
      url: '/booking',
      body: { userDetailsInvalidName },
    }).then((booking) => {
      expect(booking.status).to.eq(500);
    });
  });

  it('Cannot Create Booking with Invalid JSON', () => {
    cy.request({
      method: 'POST',
      failOnStatusCode: false,
      form: true,
      url: '/booking',
      body: { userDetailsInvalidJson },
    }).then((booking) => {
      expect(booking.status).to.eq(500);
    });
  });
  it('Cannot Create Booking with Missing Date', () => {
    cy.request({
      method: 'POST',
      failOnStatusCode: false,
      form: true,
      url: '/booking',
      body: { userDetailsMissingDate },
    }).then((booking) => {
      expect(booking.status).to.eq(500);
    });
  });

  it('Cannot Create Token with Invalid Credentials', () => {
    common.createToken(invalidTokenAuthCredentials).then((auth) => {
      expect(auth.status).to.eq(200);
      expect(auth.body).to.contain({
        reason: 'Bad credentials',
      });
    });
  });

  it('Cannot Update Booking with Invalid Token', () => {
    cy.request({
      method: 'PUT',
      failOnStatusCode: false,
      form: true,
      url: '/booking/1',
      headers: { Cookie: 'token=123abc' },
      body: { update },
    }).then((booking) => {
      expect(booking.status).to.eq(403);
    });
  });

  it('Cannot Delete Booking with Invalid Token', () => {
    cy.request({
      method: 'DELETE',
      failOnStatusCode: false,
      form: true,
      url: '/booking/1',
      headers: { Cookie: 'token=123abc' },
    }).then((booking) => {
      expect(booking.status).to.eq(403);
    });
  });
});
