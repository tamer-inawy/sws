'user strict';

const mysql = require('mysql');

const config = require(`../config/${process.env.ENV}`);

//local mysql db connection
const connection = mysql.createConnection(config.mysql);

connection.connect(err => {
    if (err) throw err;
});

module.exports = connection;
