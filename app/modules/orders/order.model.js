const { ormHelper } = require('../../helpers');

// Set database schema
const schema = {
  table: 'orders',
  fields: [
    {
      name: 'id'
    },
    {
      name: 'urgent'
    },
    {
      name: 'price',
      required: true,
    },
    {
      name: 'created_at'
    },
  ]

}

// Order object constructor
const Order = function (order) {
  for (const field of schema.fields) {
    if (order[field.name])
      this[field.name] = order[field.name];
  }
};

// Order Methods
Order.getSchema = () => [...schema.fields];

Order.create = (newOrder) => {
  return ormHelper.create(schema.table, newOrder);
};

Order.getAll = () => {
  return ormHelper.getAll(schema.table);
};

Order.get = (orderId) => {
  return ormHelper.getOne(schema.table, orderId);
};

Order.update = (orderId, data) => {
  return ormHelper.updateOne(schema.table, orderId, data);
}

Order.getByCelebrity = (celebrityId) => {
  return ormHelper.findMulti('orders', { celebrities_id: celebrityId });
};

Order.getByUser = (userId) => {
  return ormHelper.findOrdersByUser(userId);
};

module.exports = Order;
