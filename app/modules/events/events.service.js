// Import model
const Event = require('./event.model');

// Import utilities
const config = require(`../../config/${process.env.NODE_ENV}.config`);
const { validationHelper, fileUploadHelper } = require('../../helpers');
const orderService = require('../orders/orders.service');
const Order = require('../orders/order.model');

const eventsService = {
  // TODO: Check the price before creating the event
  create: data => {
    console.log(data);
    return orderService.create(new Order(data))
      .then(order => {
        console.log(order);
        return Event.create(
          new Event({
            orders_id: order.id,
            ...data
          })
        )
      });
  },

  validate: data => validationHelper.validate(Event.getSchema(), new Event(data)),

  getAll: () => Event.getAll(),

  get: id => Event.get(id),

  update(eventId, data) {
    return Event.update(eventId, new Event(data))
      .then(results => {
        return results ? this.get(results.id) : false;
      })
      .catch(err => {
        throw err;
      });
  },

  getByCelebrity(celebrityId) {
    return Event.getByCelebrity(celebrityId);
  },

  getByUser(userId) {
    return Event.getByUser(userId);
  },

  clearMedia(filePath) {
    fileUploadHelper.deleteFile(filePath);
  },

};

module.exports = eventsService;
