const { ormHelper } = require('../../helpers');

// Set database schema
const schema = {
  table: 'events',
  fields: [
    {
      name: 'id'
    },
    {
      name: 'name',
      required: true,
    },
    {
      name: 'event_date',
      required: true,
    },
    {
      name: 'description',
      required: true,
    },
    {
      name: 'celebrities_id',
      required: true,
    },
    {
      name: 'locations_id',
      required: true,
    },
    {
      name: 'status'
    },
    {
      name: 'users_id'
    },
    {
      name: 'orders_id'
    },
  ]

}

// Event object constructor
const Event = function (event) {
  for (const field of schema.fields) {
    if (event[field.name])
      this[field.name] = event[field.name];
  }
};

// Event Methods
Event.getSchema = () => [...schema.fields];

Event.create = (newEvent) => {
  return ormHelper.create(schema.table, newEvent);
};

Event.getAll = () => {
  return ormHelper.getAll(schema.table);
};

Event.get = (eventId) => {
  return ormHelper.getOne(schema.table, eventId);
};

Event.update = (eventId, data) => {
  return ormHelper.updateOne(schema.table, eventId, data);
}

Event.getByCelebrity = (celebrityId) => {
  return ormHelper.findMulti(schema.table, { celebrities_id: celebrityId });
};

Event.getByUser = (userId) => {
  return ormHelper.findEventsByUser(userId);
};

module.exports = Event;
