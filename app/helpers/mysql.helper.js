/**
 * @file        mysql.helper.js
 * @description A helper library for MySQL (OEM)
 * @author      Tamer Inawy <tamer.inawy@gmail.com>
 * 
 */
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
      connection.query(`SELECT * FROM ${table} WHERE id = ? LIMIT 0, 1`, id, (err, results) => {
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
          if (!results.affectedRows)
            resolve(false);
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

  findMulti(table, search) {
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
          resolve(results);
        }
      });
    });
  },

  findManyToMany(
    [primaryTable, primaryField],
    [secondaryTable, secondaryField, secondarySelectFields, secondaryRelationField],
    [thirdTable, thirdField, thirdSelectFields],
    where
  ) {
    return new Promise((resolve, reject) => {
      let selectText = `\`${primaryTable}\`.*, `;
      secondarySelectFields = secondarySelectFields.map(v => `\`${secondaryTable}\`.\`${v}\``);
      thirdSelectFields = thirdSelectFields.map(v => `\`${thirdTable}\`.\`${v}\``);
      mergedSelectFields = secondarySelectFields.concat(thirdSelectFields);
      selectText += mergedSelectFields.join(', ');

      const conn = connection.query(
        `SELECT ${selectText} FROM \`${primaryTable}\` 
         LEFT JOIN \`${secondaryTable}\` ON \`${primaryTable}\`.\`${primaryField}\` = \`${secondaryTable}\`.\`${secondaryField}\` 
         LEFT JOIN \`${thirdTable}\` ON \`${secondaryTable}\`.\`${secondaryRelationField}\` = \`${thirdTable}\`.\`${thirdField}\` 
         ${where ? 'WHERE ' + where : ''}`,
        (err, results) => {
          if (err) {
            console.log('error: ', err);
            return reject(err);
          }
          else {
            resolve(results);
          }
        });
      // console.log(conn.sql);
    });
  },

};

module.exports = mysqlHelper;
