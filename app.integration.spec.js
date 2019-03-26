const request = require('supertest');

// const dataInterface = require('./data-interface');
const app = require('./app');
const dataInterface = require('./data-interface');
const { createMessage } = require('./data-interface');
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
            const response = await agent
              .post('/messages')
              .send(
                "content=test&personalWebsiteURL=javascript:alert('Hacked!');"
              );
            expect(response.status).toEqual(400);
            done();
          });

          it('does not call createMessage function', () => {
            dataInterface.createMessage = jest.fn();
            expect(dataInterface.createMessage).toHaveBeenCalledTimes(0);
          });
        });

        describe('with HTTP URL in personalWebsiteURL', () => {
          it('responds with success and create message', async done => {
            const response = await agent
              .post('/messages')
              .send(
                'content=test&personalWebsiteURL=https://fr.wikipedia.org/wiki/Cross-site_scripting'
              );
            expect(response.status).toEqual(201);
            done();
          });

          it('call createMessage function', async done => {
            dataInterface.createMessage = jest.fn();
            const response = await agent
              .post('/messages')
              .send(
                'content=test&personalWebsiteURL=https://fr.wikipedia.org/wiki/Cross-site_scripting'
              );
            expect(dataInterface.createMessage).toHaveBeenCalledTimes(1);
            done();
          });
        });
      });
    });
  });
});
