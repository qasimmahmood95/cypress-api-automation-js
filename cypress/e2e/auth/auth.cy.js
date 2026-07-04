import authService from '../../support/api/auth.service';
import { authTokenSchema } from '../../support/schemas/booking.schemas';
import invalidCredentials from '../../fixtures/invalid-credentials.json';

describe('Auth API', () => {
  it('issues a token for valid credentials', () => {
    authService
      .createToken()
      .validateSchema(authTokenSchema)
      .then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.token).to.be.a('string').and.not.be.empty;
      });
  });

  it('rejects invalid credentials', () => {
    // Quirk of the demo API: bad credentials return HTTP 200 with a
    // reason in the body rather than a 401
    authService.createToken(invalidCredentials).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.deep.equal({ reason: 'Bad credentials' });
    });
  });
});
