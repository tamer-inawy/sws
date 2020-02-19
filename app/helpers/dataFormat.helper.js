'user strict';

const bcrypt = require("bcrypt");

const formater = {
  successFormat: data => ({ status: 'success', data: data }),
  errorFormat: err => ({ status: 'failed', error: process.env.ENV === 'develop' ? err : err.message }),
  // TODO: move passwordHash to auth service
  passwordHash: (pass, saltRound) => bcrypt.hashSync(pass, saltRound),
};

module.exports = formater;
