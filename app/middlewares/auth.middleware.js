/**
 * @file        auth.middleware.js
 * @description A middleware to handle authentication
 * @author      Tamer Inawy <tamer.inawy@gmail.com>
 * 
 */
const jwt = require('jsonwebtoken');

const config = require(`../config/${process.env.NODE_ENV}.config`);

const auth = roles => (req, res, next) => {
  try {
    // Throw an error if the authoriztion header not available.
    if (!req.headers.authorization)
      throw new Error();

    // Decode and verify the token
    const token = req.headers.authorization.split(' ')[1];
    const decodedUserData = jwt.verify(token, config.jwt.secrit);
    console.log('decoded', decodedUserData);

    // Init a pointer with intial false state
    let isAuthorized = false;
    // Convert the granted roles to array if it's not already array
    roles = typeof roles !== 'array' ? roles : [roles];

    switch (decodedUserData.role) {
      case 'Admin':
        // Authorize the admin anyway. He has access to everything.
        isAuthorized = true;
        break;
      case 'Celebrity':
        // Authorize the celebrity if it's in the roles array
        // and omit the break statment to extend the celebrity with the user permissions.
        isAuthorized = roles.indexOf('Celebrity') !== -1;
      case 'User':
        // Authorize the user if it's in the roles array.
        isAuthorized = roles.indexOf('User') !== -1;
    }

    // Throw an error if it's not authorized.
    if (!isAuthorized) {
      err = new Error('Forbidden request!');
      err.status = 403;
      throw err;
    }

    // Add the user data to the request
    req.user = { ...decodedUserData };

  } catch (err) {
    err.message = err.message || 'Unauthorized request!';
    err.status = err.status || 401;
    next(err);
  }
  next();
};

module.exports = auth;
