'user strict';

const jwt = require('jsonwebtoken');

const config = require(`../config/${process.env.ENV}.config`);
const dataFormatHelper = require('../helpers/dataFormat.helper');

const auth = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, config.jwt.secrit);
    req.userData = {
      email: decoded.email,
      name: decoded.name,
    };
  } catch (e) {
    console.log(e);
    res.status(401);
    err = new Error();
    err.message = 'You are not authorized to visit this page!';
    return res.json(dataFormatHelper.errorFormat(err));
  }
  next();
}

module.exports = auth;
