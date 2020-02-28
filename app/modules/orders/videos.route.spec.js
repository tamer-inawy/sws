const chai = require('chai');
const chaiHttp = require('chai-http');
const { expect } = chai;

// const app = require('./videos.route');
const app = require('../../index');

chai.use(chaiHttp);

// Integrated test
describe('videos', () => {
  it('Get videos list', async () => {
    results = await chai.request(app).get('/videos');
    expect(results.body.status).to.equal('success');

  });
});
