'user strict';

const mysql = require('mysql');

const config = require(`../config/${process.env.NODE_ENV}.config`);

//local mysql db connection
const connection = mysql.createPool(config.mysql);

const mysqlHelper = {
  create(table, data) {
    return new Promise((resolve, reject) => {
      connection.query(`INSERT INTO ${table} set ?`, data, function (err, results) {

        if (err) {
          console.log('error: ', err);
          return reject(err);
        }
        else {
          data.id = results.insertId;
          resolve(data);
        }
      });
    });
  },

  getAll(table) {
    return new Promise((resolve, reject) => {
      connection.query(`SELECT * FROM ${table}`, (err, results) => {
        if (err) {
          console.log('error: ', err);
          return reject(err);
        }
        else {
          resolve(results);
        }
      });
    });
  },

  getOne(table, id) {
    return new Promise((resolve, reject) => {
      connection.query(`SELECT * FROM ${table} WHERE id = ?`, id, (err, results) => {
        if (err) {
          console.log('error: ', err);
          return reject(err);
        }
        else {
          resolve(results[0]);
        }
      });
    });
  },

  updateOne(table, id, data) {
    return new Promise((resolve, reject) => {
      // Prevent updating the record id
      data.id = id;

      // prepare the params
      const fields = Object.keys(data)
        .map(key => `\`${key}\``)
        .join(' = ?, ') + ' = ? ';
      const params = Object.values(data);
      params.push(id);

      connection.query(`UPDATE ${table} SET ${fields} WHERE id = ?`, params, (err, results) => {
        if (err) {
          console.log('error: ', err);
          return reject(err);
        }
        else {
          resolve(data);
        }
      });
    });
  },

  findOne(table, search) {
    return new Promise((resolve, reject) => {
      // prepare the params
      const series = `${Object.keys(search).join(' = ? AND ')} = ? `;
      const params = Object.values(search);
      const query = `SELECT * FROM ${table} WHERE ${series}`;

      connection.query(query, params, (err, results) => {
        if (err) {
          console.log('error: ', err);
          return reject(err);
        }
        else {
          resolve(results[0]);
        }
      });
    });

  },


};

module.exports = mysqlHelper;
