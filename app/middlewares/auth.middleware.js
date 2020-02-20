'user strict';

const jwt = require('jsonwebtoken');

const config = require(`../config/${process.env.ENV}.config`);
const { dataFormatHelper } = require('../helpers');

const auth = role => (req, res, next) => {
  try {
    if (!req.headers.authorization)
      throw new Error();

    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, config.jwt.secrit);
    if (decoded.role !== role && decoded.role !== 'Admin') {
      err = new Error('Forbidden request!');
      err.status = 403;
      throw err;
    }
    req.user = { ...decoded };
  } catch (err) {
    err.message = err.message || 'Unauthorized request!';
    err.status = err.status || 401;
    next(err);
  }
  next();
};

module.exports = auth;
