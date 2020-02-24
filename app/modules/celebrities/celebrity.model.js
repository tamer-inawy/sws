'user strict';

const { ormHelper } = require('../../helpers');

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
      name: 'desc',
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
  for (const field of schema.fields) {
    if (celebrity[field.name])
      this[field.name] = celebrity[field.name];
  }
};

// Celebrity Methods
Celebrity.getSchema = () => [...schema.fields];

Celebrity.create = (newCelebrity) => {
  return ormHelper.create(schema.table, newCelebrity);
};

Celebrity.getAll = () => {
  return ormHelper.getAll(schema.table);
};

Celebrity.get = (celebrityId) => {
  return ormHelper.getOne(schema.table, celebrityId);
};

Celebrity.update = (celebrityId, data) => {
  return ormHelper.updateOne(schema.table, celebrityId, data);
}

Celebrity.findByEmail = (email) => {
  return ormHelper.findOne(schema.table, {email: email});
};

Celebrity.getVideos = (celebrityId) => {
  return ormHelper.findMulti('videos', {celebrities_id: celebrityId});
};

module.exports = Celebrity;
