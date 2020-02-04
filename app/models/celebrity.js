'user strict';

const sql = require('../helpers/mysqlHelper');

//Celebrity object constructor
const Celebrity = function (celebrity) {
  this.name = celebrity.name;
  this.email = celebrity.email;
  this.password = celebrity.password; // TODO: hash the password
  this.video_price = celebrity.videoPrice;
  this.urgent_price = celebrity.urgentPrice;
  this.event_price = celebrity.eventPrice;
  this.short_desc = celebrity.shortDesc;
  this.desc = celebrity.desc;
  this.video = celebrity.video;
  this.created_at = new Date();
};

Celebrity.createCelebrity = (newCelebrity, callBack) => {
  sql.query('INSERT INTO celebrities set ?', newCelebrity, function (err, results) {

    if (err) {
      console.log('error: ', err);
      callBack(err, null);
    }
    else {
      console.log(results);
      callBack(null, { id: results.insertId, ...newCelebrity });
    }
  });
};

Celebrity.getAllCelebrities = callBack => {
  sql.query('SELECT * FROM celebrities', (err, results) => {
    if (err) {
      console.log('error: ', err);
      callBack(err, null);
    }
    else {
      console.log(results);
      callBack(null, results);
    }
  })
};

Celebrity.getCelebrity = (celebrityId, callBack) => {
  sql.query('SELECT * FROM celebrities WHERE id = ?', celebrityId, (err, results) => {
    if (err) {
      console.log('error: ', err);
      callBack(err, null);
    }
    else {
      console.log(results);
      callBack(null, results[0]);
    }
  })
};

module.exports = Celebrity;
