const { ormHelper } = require('../../helpers');

// Set database schema
const schema = {
  table: 'locations',
  fields: [
    {
      name: 'id'
    },
    {
      name: 'location',
      required: true
    },
    {
      name: 'name',
      required: true
    },
    {
      name: 'website',
    },
    {
      name: 'address',
      required: true
    },
  ]

}

// Location object constructor
const Location = function (location) {
  for (const field of schema.fields) {
    if (location[field.name])
      this[field.name] = location[field.name];
  }
};

// Location Methods
Location.getSchema = () => [...schema.fields];

Location.create = (newLocation) => {
  return ormHelper.create(schema.table, newLocation);
};

Location.getAll = () => {
  return ormHelper.getAll(schema.table);
};

Location.get = (locationId) => {
  return ormHelper.getOne(schema.table, locationId);
};

Location.update = (locationId, data) => {
  return ormHelper.updateOne(schema.table, locationId, data);
};

module.exports = Location;
