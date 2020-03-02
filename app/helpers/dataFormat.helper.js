/**
 * @file        dataFormat.helper.js
 * @description A helper library for data formatting
 * @author      Tamer Inawy <tamer.inawy@gmail.com>
 * 
 */
const bcrypt = require("bcrypt");

const formater = {
  successFormat: data => ({ status: 'success', data: data }),
  errorFormat: err => ({ status: 'failed', error: process.env.NODE_ENV === 'develop' ? err : err.message }),
  // TODO: move passwordHash to auth service
  passwordHash: (pass, saltRound) => bcrypt.hashSync(pass, saltRound),
};

module.exports = formater;
