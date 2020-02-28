const { expect } = require('chai');
const sinon = require('sinon');

const videosService = require('./videos.service');
const videosController = require('./videos.controller');

describe.only('videosController', () => {
  
  const sandbox = sinon.createSandbox();
  let req;
  let res;
  let next;
  let videoMockup;
  beforeEach(() => {
    req = { params: {} };
    res = { locals: {} };
    next = sandbox.spy();
    videoMockup = { name: 'Tamer Inawy' };
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('Get all videos', () => {
    it('getAll', () => {
      sandbox.stub(videosService, 'getAll').returns(Promise.resolve([videoMockup]));

      return videosController.getAll(req, res, next).then(() => {
        expect(res.locals).to.has.key('data');
        expect(res.locals.data[0].name).to.equals(videoMockup.name);
        expect(next.called).to.be.ok;
      });
    });
  });

  describe('Get one video', () => {
    it('get', () => {
      sandbox.stub(videosService, 'get').returns(Promise.resolve(videoMockup));
      req.params.videoId = 1;

      return videosController.get(req, res, next)
        .then(() => {
          expect(res.locals).to.has.key('data');
          expect(res.locals.data.name).to.equals(videoMockup.name);
          expect(next.called).to.be.ok;

        });
    });
  });

});
