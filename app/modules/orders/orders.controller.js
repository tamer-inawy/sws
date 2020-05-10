const ordersService = require('./orders.service');

const ordersController = {

  create: (req, res, next) => {

    // handle validation 
    const validate = ordersService.validate(req.body);
    if (!validate.isValid) {
      const err = new Error('Please provide a valid data!');
      err.field = validate.field;
      err.rule = validate.rule;
      return next(err);
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

        return next(err);
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
        return next(err);
      });
  },

  get: (req, res, next) => {
    const orderId = +req.params.orderId;

    // handle validation
    if (!orderId) {
      const err = new Error('Please provide a valid data!');
      return next(err);
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
        return next(err);
      });

  },

  getByUser: (req, res, next) => {
    const userId = +req.params.userId;

    // handle validation
    if (!userId) {
      const err = new Error('Please provide a valid data!');
      return next(err);
    }

    if (req.user.id !== userId) {
      const err = new Error('Not Authorized');
      err.status = 401;
      return next(err);
    }

    return ordersService.getByUser(userId)
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
        return next(err);
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
        if (!order) {
          err = new Error('Wrong order!');
          return next(err);
        }
        res.locals.data = order;
        next();
      })
      .catch(err => {
        console.log(err);
        err.message = err.message || 'Can\'t retrieve the data!';
        return next(err);
      });
  },

  getByCelebrity: (req, res, next) => {
    const celebrityId = +req.params.celebrityId;

    // handle validation
    if (!celebrityId) {
      const err = new Error('Please provide a valid data!');
      return next(err);
    }

    if (req.user.id !== celebrityId) {
      const err = new Error('Not Authorized');
      err.status = 401;
      return next(err);
    }

    return ordersService.getByCelebrity(celebrityId)
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
        return next(err);
      });

  },

};

module.exports = ordersController;
