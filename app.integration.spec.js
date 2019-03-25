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
          it('responds with error', async done => {
            await agent
              .post('/messages')
              .send(
                "content=test&personalWebsiteURL=javascript:alert('Hacked!');"
              )
              .expect('Content-Type', 'application/json; charset=utf-8')
              .expect(400);
            done();
          });
        });

        describe('with HTTP URL in personalWebsiteURL', () => {
          it('responds with success', async done => {
            await agent
              .post('/messages')
              .send(
                'content=test&personalWebsiteURL=https://fr.wikipedia.org/wiki/Cross-site_scripting'
              )
              .expect('Content-Type', 'application/json; charset=utf-8')
              .expect(201);
            done();
          });
        });
      });
    });
  });
});
