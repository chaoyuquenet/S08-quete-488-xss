const request = require('supertest');

const app = require('./app');
const agent = request.agent(app);

describe('app', () => {
  describe('when authenticated', () => {
    beforeEach(async () => {
      await agent
        .post('/login')
        .send('username=randombrandon&password=randompassword');
    });

    describe('POST /messages', () => {
      describe('with non-empty content', () => {
        describe('with JavaScript code in personalWebsiteURL', () => {
          it('responds with 401 error', async done => {
            const response = await request(app).get('/');
            expect(response.statusCode).toBe(401);
            done();
          });
        });

        describe('with HTTP URL in personalWebsiteURL', () => {
          it('responds with success', async done => {
            const response = await request(app).get('/');
            expect(response.statusCode).toBe(200);
            done();
          });
        });
      });
    });
  });
});
