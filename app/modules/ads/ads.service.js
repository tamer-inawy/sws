
// Import utilities
const { validationHelper } = require('../../helpers');
// Import model
const Ad = require('./ad.model');
const orderService = require('../orders/orders.service');
const Order = require('../orders/order.model');

const adsService = {
  create: data => {
    data.price = '0.00';
    console.log('data', data)
    return orderService.create(new Order(data))
      .then(order => {
        console.log(order);
        return Ad.create(
          new Ad(
            {
              orders_id: order.id,
              ...data
            }
          )
        );
      });

  },

  validate: data => validationHelper.validate(Ad.getSchema(), new Ad(data)),

  getAll: () => Ad.getAll(),

  get: id => Ad.get(id),

  update(adId, data) {
    if (data.price) {
      return Ad.get(adId)
        .then(ad => {
          return Order.update(ad.orders_id, new Order(data))
            .then(order => {
              return Ad.update(adId, new Ad(data))
                .then(results => {
                  return results ? this.get(results.id) : false;
                })
                .catch(err => {
                  throw err;
                });
            });
        });
    } else {
      return Ad.update(adId, new Ad(data))
        .then(results => {
          return results ? this.get(results.id) : false;
        })
        .catch(err => {
          throw err;
        });
    }
  },

  getAdsByCelebrity(celebrityId) {
    return Ad.getAdsByCelebrity(celebrityId);
  }

};

module.exports = adsService;
