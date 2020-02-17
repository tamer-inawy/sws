'user strict';

const bcrypt = require("bcrypt");

const formater = {
  successFormat: data => ({status: 'success', data: data}),
  errorFormat: err => ({status: 'failed', error: err.message}),
  // errorFormat: err => ({status: 'failed', error: {message: err.message}}),
  passwordHash: pass => bcrypt.hashSync(pass, 10),
};

module.exports = formater;
