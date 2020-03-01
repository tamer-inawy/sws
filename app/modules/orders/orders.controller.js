const ordersService = require('./orders.service');

const ordersController = {

  create: (req, res, next) => {

    // handle validation 
    const validate = ordersService.validate(req.body);
    if (!validate.isValid) {
      const err = new Error('Please provide a valid data!');
      err.field = validate.field;
      err.rule = validate.rule;
      next(err);
    }

    ordersService.create(req.body)
      .then((order) => {
        res.locals.data = order;
        next();
      })
      .catch(err => {
        if (err.errno === 1062) {
          err.message = 'The email is already in use!';
          err.status = 409;
        } else {
          err.message = err.message || 'Can\'t retrieve the data!';
        }

        next(err);
      });
  },

  getAll: (req, res, next) => {
    return ordersService.getAll()
      .then((orders) => {
        res.locals.data = orders;
        next();
      })
      .catch((err) => {
        err.message = err.message || 'Can\'t retrieve the data!';
        next(err);
      });
  },

  get: (req, res, next) => {
    const orderId = +req.params.orderId;

    // handle validation
    if (!orderId) {
      const err = new Error('Please provide a valid data!');
      next(err);
    }

    return ordersService.get(orderId)
      .then((order) => {
        if (!order) {
          const err = new Error('Can\'t retrieve the data!');
          throw err;
        }

        res.locals.data = order;
        next();
      })
      .catch(err => {
        err.message = err.message || 'Can\'t retrieve the data!';
        next(err);
      });

  },

  update(req, res, next) {
    const orderId = +req.params.orderId;

    // TODO: handle validation 
    let valid = true;
    if (!valid) {
      const err = new Error('Please provide a valid data!');
      throw err;
    }

    ordersService.update(orderId, req.body)
      .then((order) => {
        res.locals.data = order;
        next();
      })
      .catch(err => {
        console.log(err);
        if (err.errno === 1062) {
          err.message = 'The email is already in use!';
        } else {
          err.message = err.message || 'Can\'t retrieve the data!';
        }
        next(err);
      });
  },

};

module.exports = ordersController;
