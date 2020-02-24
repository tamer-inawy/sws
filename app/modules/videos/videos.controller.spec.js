const { expect } = require('chai');
const sinon = require('sinon');

const celebritiesService = require('./videos.service');
const celebritiesController = require('./videos.controller');

describe.only('celebritiesController', () => {
  
  const sandbox = sinon.createSandbox();
  let req;
  let res;
  let next;
  let celebrityMockup;
  beforeEach(() => {
    req = { params: {} };
    res = { locals: {} };
    next = sandbox.spy();
    celebrityMockup = { name: 'Tamer Inawy' };
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('Get all celebrities', () => {
    it('getAll', () => {
      sandbox.stub(celebritiesService, 'getAll').returns(Promise.resolve([celebrityMockup]));

      return celebritiesController.getAll(req, res, next).then(() => {
        expect(res.locals).to.has.key('data');
        expect(res.locals.data[0].name).to.equals(celebrityMockup.name);
        expect(next.called).to.be.ok;
      });
    });
  });

  describe('Get one celebrity', () => {
    it('get', () => {
      sandbox.stub(celebritiesService, 'get').returns(Promise.resolve(celebrityMockup));
      req.params.celebrityId = 1;

      return celebritiesController.get(req, res, next)
        .then(() => {
          expect(res.locals).to.has.key('data');
          expect(res.locals.data.name).to.equals(celebrityMockup.name);
          expect(next.called).to.be.ok;

        });
    });
  });

  describe('Get videos list', () => {
    it('getVideos', () => {
      sandbox.stub(celebritiesService, 'getVideos').returns(Promise.resolve([{ id: 1, name: 'mockup video' }]));
      req.params.celebrityId = 1;

      return celebritiesController.getVideos(req, res, next)
        .then(() => {
          expect(res.locals).to.has.key('data');
console.log(res.locals.data);
          // expect(res.locals.data[0].id).to.equals(1);
          expect(next.called).to.be.ok;

        });
    })
  })

});
