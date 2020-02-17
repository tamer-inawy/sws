'user strict';

const mysql = require('mysql');

const config = require(`../config/${process.env.ENV}.config`);

//local mysql db connection
const connection = mysql.createPool(config.mysql);

const mysqlHelper = {
  create(table, data, callBack) {
    connection.query(`INSERT INTO ${table} set ?`, data, function (err, results) {

      if (err) {
        console.log('error: ', err);
        callBack(err, null);
      }
      else {
        data.id = results.insertId;
        callBack(null, data);
      }
    });
  },

  getAll(table, callBack) {
    connection.query(`SELECT * FROM ${table}`, (err, results) => {
      if (err) {
        console.log('error: ', err);
        callBack(err, null);
      }
      else {
        callBack(null, results);
      }
    })
  },

  getOne(table, id, callBack) {
    connection.query(`SELECT * FROM ${table} WHERE id = ?`, id, (err, results) => {
      if (err) {
        console.log('error: ', err);
        callBack(err, null);
      }
      else {
        callBack(null, results[0]);
      }
    })
  },

  updateOne(table, id, data, callBack) {
    // Prevent updating the record id
    data.id = id;

    // prepare the params
    const fields = Object.keys(data).join(' = ?, ') + ' = ? ';
    const params = Object.values(data);
    params.push(id);

    connection.query(`UPDATE ${table} SET ${fields} WHERE id = ?`, params, (err, results) => {
      if (err) {
        console.log('error: ', err);
        callBack(err, null);
      }
      else {
        callBack(null, data);
      }
    });
  },

  findOne(table, search, callBack) {
    // prepare the params
    const series = `${Object.keys(search).join(' = ? AND ')} = ? `;
    const params = Object.values(search);
    const query = `SELECT * FROM ${table} WHERE ${series}`;

    connection.query(query, params, (err, results) => {
      if (err) {
        console.log('error: ', err);
        callBack(err, null);
      }
      else {
        callBack(null, results[0]);
      }
    })
  },


};

module.exports = mysqlHelper;
