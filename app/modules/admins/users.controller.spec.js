const { expect } = require('chai');
const sinon = require('sinon');

const usersService = require('./users.service');
const usersController = require('./users.controller');

describe.only('usersController', () => {
  const sandbox = sinon.createSandbox();
  const req = { params: {} };
  const res = { locals: {} };
  const next = sandbox.spy();
  const userMockup = { name: 'Tamer Inawy' };

  beforeEach(() => {
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('Get all users', () => {
    it('getAll', () => {
      sandbox.stub(usersService, 'getAll').returns(Promise.resolve([userMockup]));

      return usersController.getAll(req, res, next).then(() => {
        expect(res.locals).to.has.key('data');
        expect(res.locals.data[0].name).to.equals(userMockup.name);
        expect(next.called).to.be.ok;
      });
    });
  });

  describe('Get one user', () => {
    it('get', () => {
      sandbox.stub(usersService, 'get').returns(Promise.resolve(userMockup));
      req.params.userId = 1;

      return usersController.get(req, res, next)
        .then(() => {
          expect(res.locals).to.has.key('data');
          expect(res.locals.data.name).to.equals(userMockup.name);
          expect(next.called).to.be.ok;

        });
    });
  });
});
