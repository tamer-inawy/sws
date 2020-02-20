'user strict';

const jwt = require('jsonwebtoken');

const config = require(`../config/${process.env.ENV}.config`);
const { dataFormatHelper } = require('../helpers');

const auth = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, config.jwt.secrit);
    console.log(decoded)
    req.user = { ...decoded };
  } catch (e) {
    err = new Error('Unauthorized request!');
    err.status = 401;
    next(err);
  }
  next();
}

module.exports = auth;
