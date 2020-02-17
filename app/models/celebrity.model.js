'user strict';

const mySqlHelper = require('../helpers/mysql.helper');

// Set database schema
const schema = {
  table: 'celebrities',
  fields: [
    {
      name: 'id'
    },
    {
      name: 'name',
      required: true
    },
    {
      name: 'email',
      required: true,
      match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    {
      name: 'password',
      required: true
    },
    {
      name: 'video_price',
      required: true
    },
    {
      name: 'urgent_price'
    },
    {
      name: 'event_price'
    },
    {
      name: 'short_desc',
      required: true
    },
    {
      name: 'description',
      required: true
    },
    {
      name: 'video',
      required: true
    },
    {
      name: 'created_at'
    }
  ]

}

// Celebrity object constructor
const Celebrity = function (celebrity) {
  console.log(celebrity);
  for (const field of schema.fields) {
    if (celebrity[field.name])
      this[field.name] = celebrity[field.name];
  }
};

// Celebrity Methods
Celebrity.getSchema = () => [...schema.fields];

Celebrity.createCelebrity = (newCelebrity, callBack) => {
  mySqlHelper.create(schema.table, newCelebrity, callBack);
};

Celebrity.getAllCelebrities = callBack => {
  mySqlHelper.getAll(schema.table, callBack);
};

Celebrity.getCelebrity = (celebrityId, callBack) => {
  mySqlHelper.getOne(schema.table, celebrityId, callBack);
};

Celebrity.updateCelebrity = (celebrityId, data, callBack) => {
  mySqlHelper.updateOne(schema.table, celebrityId, data, callBack);
}

Celebrity.findCelebrityByEmail = (email, callBack) => {
  mySqlHelper.findOne(schema.table, {email: email}, callBack);
};

module.exports = Celebrity;
