const { ormHelper } = require('../../helpers');

// Set database schema
const schema = {
  table: 'users',
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
      name: 'phone',
      required: true
    },
    {
      name: 'image'
    },
    {
      name: 'created_at'
    }
  ]

}

// User object constructor
const User = function (user) {
  for (const field of schema.fields) {
    if (user[field.name])
      this[field.name] = user[field.name];
  }
};

// User Methods
User.getSchema = () => [...schema.fields];

User.create = (newUser) => {
  return ormHelper.create(schema.table, newUser);
};

User.getAll = () => {
  return ormHelper.getAll(schema.table);
};

User.get = (userId) => {
  return ormHelper.getOne(schema.table, userId);
};

User.update = (userId, data) => {
  return ormHelper.updateOne(schema.table, userId, data);
}

User.findByEmail = (email) => {
  return ormHelper.findOne(schema.table, {email: email});
};

module.exports = User;
