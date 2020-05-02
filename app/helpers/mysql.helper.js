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
          data.id = data.id ? data.id : results.insertId;
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

          this.getOne(table, id)
            .then(updatedRow => {
              console.log('updatedRow', updatedRow)
              resolve(updatedRow);
            });
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

  // TODO: Refactor with more generic method
  findOneCelebrity(table1, table2, search) {
    return new Promise((resolve, reject) => {
      // prepare the params
      const series = `${Object.keys(search).join(' = ? AND ')} = ? `;
      const params = Object.values(search);
      const query = `SELECT ${table1}.*, ${table2}.*, ${table2}.id as celebrity_id FROM ${table1}
                            INNER JOIN ${table2} ON ${table1}.id = ${table2}.id WHERE ${series}`;

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
      console.log(conn.sql);
    });
  },

  // TODO: Refactor with more generic method
  findLeftJoin(table1, table2, search) {
    return new Promise((resolve, reject) => {
      // prepare the params
      const series = `${Object.keys(search).join(' = ? AND ')} = ? `;
      const params = Object.values(search);
      const query = `SELECT ${table2}.*, ${table1}.*, ${table2}.id as celebrity_id FROM ${table1}
                            LEFT JOIN ${table2} ON ${table1}.id = ${table2}.id WHERE ${series}`;

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

  // TODO: Refactor with more generic method
  findCelebrities(
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
        `SELECT ${selectText}, \`users\`.* FROM \`${primaryTable}\` 
        LEFT JOIN \`${secondaryTable}\` ON \`${primaryTable}\`.\`${primaryField}\` = \`${secondaryTable}\`.\`${secondaryField}\` 
        LEFT JOIN \`${thirdTable}\` ON \`${secondaryTable}\`.\`${secondaryRelationField}\` = \`${thirdTable}\`.\`${thirdField}\` 
        INNER JOIN \`users\` on \`users\`.id = celebrities.id
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
      console.log(conn.sql);
    });
  },

  // TODO: Refactor with more generic method
  // TODO: Add events and ads tables
  findOrdersByUser(id) {
    return new Promise((resolve, reject) => {
      connection.query(`SELECT 
                          videos.id as video_id,
                          videos.name as user_name,
                          videos.other_name,
                          videos.users_id,
                          videos.celebrities_id,
                          videos.status,
                          orders.id as order_id,
                          orders.price,
                          orders.created_at,
                          orders.urgent,
                          users.name as celebrity_name,
                          users.image
                        FROM orders
                        INNER JOIN videos ON
                          videos.orders_id = orders.id
                        INNER JOIN celebrities ON
                          videos.celebrities_id = celebrities.id
                        INNER JOIN users ON
                          celebrities.id = users.id
                        WHERE videos.users_id = ${id}
                        ORDER BY orders.created_at DESC`,
        (err, results) => {
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

  // TODO: Refactor with more generic method
  // TODO: Add events and ads tables
  findOrdersByCelebrity(id) {
    return new Promise((resolve, reject) => {
      connection.query(`SELECT 
                          videos.id as video_id,
                          videos.name as user_name,
                          videos.other_name,
                          videos.users_id,
                          videos.celebrities_id,
                          videos.status,
                          videos.instructions,
                          orders.id as order_id,
                          orders.price,
                          orders.created_at,
                          orders.urgent,
                          users.name as celebrity_name,
                          users.image
                        FROM orders
                        INNER JOIN videos ON
                          videos.orders_id = orders.id
                        INNER JOIN celebrities ON
                          videos.celebrities_id = celebrities.id
                        INNER JOIN users ON
                          videos.users_id = users.id
                        WHERE videos.celebrities_id = ${id}
                          AND videos.status = 'PENDING'
                        ORDER BY orders.urgent DESC, orders.created_at DESC`,
        (err, results) => {
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

};

module.exports = mysqlHelper;
