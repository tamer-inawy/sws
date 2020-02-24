const chai = require('chai');
const chaiHttp = require('chai-http');
const { expect } = chai;

// const app = require('./celebrities.route');
const app = require('./../../index');

chai.use(chaiHttp);

// Integrated test
describe('celebrities', () => {
  it('Get celebrities list', async () => {
    results = await chai.request(app).get('/celebrities');
    expect(results.body.status).to.equal('success');

  });
});
