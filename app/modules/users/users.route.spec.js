const chai = require('chai');
const chaiHttp = require('chai-http');
const { expect } = chai;

// const app = require('./users.route');
const app = require('./../../index');

chai.use(chaiHttp);

// Integrated test
describe('users', () => {
  it('Get users list', async () => {
    results = await chai.request(app).get('/users');
    expect(results.body.status).to.equal('success');

  });
});
