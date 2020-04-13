
// Import utilities
const config = require(`../../config/${process.env.NODE_ENV}.config`);
const { dataFormatHelper, validationHelper } = require('../../helpers');
// Import model
const Order = require('./order.model');

const ordersService = {
  // TODO: Check the price before creating the order
  create: data => Order.create(new Order(data)),

  validate: data => validationHelper.validate(Order.getSchema(), new Order(data)),

  getAll: () => Order.getAll(),

  get: id => Order.get(id),

  update(orderId, data) {
    return Order.update(orderId, new Order(data))
      .then(results => {
        return results ? this.get(results.id) : false;
      })
      .catch(err => {
        throw err;
      });
  },

  getByCelebrity(celebrityId) {
    return Order.getByCelebrity(celebrityId);
  },

  getByUser(userId) {
    return Order.getByUser(userId);
  }

};

module.exports = ordersService;
