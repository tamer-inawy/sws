'user strict';

const mysql = require('mysql');

const config = require(`../config/${process.env.ENV}`);

//local mysql db connection
const connection = mysql.createPool(config.mysql);

module.exports = connection;
