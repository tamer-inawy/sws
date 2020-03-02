const { ormHelper } = require('../../helpers');

// Set database schema
const schema = {
  table: 'admins',
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
      name: 'created_at'
    }
  ]

}

// Admin object constructor
const Admin = function (admin) {
  for (const field of schema.fields) {
    if (admin[field.name])
      this[field.name] = admin[field.name];
  }
};

// Admin Methods
Admin.getSchema = () => [...schema.fields];

Admin.create = (newAdmin) => {
  return ormHelper.create(schema.table, newAdmin);
};

Admin.getAll = () => {
  return ormHelper.getAll(schema.table);
};

Admin.get = (adminId) => {
  return ormHelper.getOne(schema.table, adminId);
};

Admin.update = (adminId, data) => {
  return ormHelper.updateOne(schema.table, adminId, data);
}

Admin.findByEmail = (email) => {
  return ormHelper.findOne(schema.table, {email: email});
};

module.exports = Admin;
