/**
 * @file        auth.middleware.js
 * @description A middleware to handle authentication
 * @author      Tamer Inawy <tamer.inawy@gmail.com>
 * 
 */
const jwt = require('jsonwebtoken');

const config = require(`../config/${process.env.NODE_ENV}.config`);
const { dataFormatHelper } = require('../helpers');

const auth = role => (req, res, next) => {
  try {
    if (!req.headers.authorization)
      throw new Error();

    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, config.jwt.secrit);
    console.log('decoded', decoded);
    role = typeof role !== 'array' ? role : [role];
    if (role.indexOf(decoded.role) === -1 && decoded.role !== 'Admin') {
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
