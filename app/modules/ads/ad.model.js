const { ormHelper } = require('../../helpers');

// Set database schema
const schema = {
  table: 'ads',
  fields: [
    {
      name: 'id'
    },
    {
      name: 'company',
      required: true
    },
    {
      name: 'instructions',
      required: true
    },
    {
      name: 'photo',
    },
    {
      name: 'users_id',
      required: true
    },
    {
      name: 'celebrities_id',
      required: true
    },
    {
      name: 'status',
    },
    {
      name: 'type',
      required: true
    },
    {
      name: 'working_days',
      required: true
    },
    {
      name: 'date_from',
      required: true
    },
    {
      name: 'date_to',
      required: true
    },
    {
      name: 'director',
    },
    {
      name: 'locations_id',
      required: true
    },
    {
      name: 'orders_id',
      required: true
    },
  ]

}

// Ad object constructor
const Ad = function (ad) {
  for (const field of schema.fields) {
    if (ad[field.name])
      this[field.name] = ad[field.name];
  }
};

// Ad Methods
Ad.getSchema = () => [...schema.fields];

Ad.create = (newAd) => {
  return ormHelper.create(schema.table, newAd);
};

Ad.getAll = () => {
  return ormHelper.getAll(schema.table);
};

Ad.get = (adId) => {
  return ormHelper.getOne(schema.table, adId);
};

Ad.update = (adId, data) => {
  return ormHelper.updateOne(schema.table, adId, data);
}

Ad.getByCelebrity = (celebrityId) => {
  return ormHelper.findMulti(schema.table, { celebrities_id: celebrityId });
};

Ad.getByUser = (userId) => {
  return ormHelper.findMulti(schema.table, { users_id: userId });
};

module.exports = Ad;
