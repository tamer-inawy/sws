
// Import utilities
const config = require(`../../config/${process.env.NODE_ENV}.config`);
const { dataFormatHelper, validationHelper } = require('../../helpers');
// Import model
const Order = require('./order.model');

const ordersService = {
  create: data => Order.create(new Order(data)),

  validate: data => validationHelper.validate(Order.getSchema(), new Order(data)),

  getAll: () => Order.getAll(),

  get: id => Order.get(id),

  update(orderId, data) {
    return Order.update(orderId, new Order(data))
      .then(results => {
        return this.get(results.id)
      })
      .catch(err => {
        throw err;
      });
  },

  getOrdersByCelebrity(celebrityId) {
    return Order.getOrdersByCelebrity(celebrityId);
  }

};

module.exports = ordersService;
