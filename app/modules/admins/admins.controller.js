const adminsService = require('./admins.service');

const adminsController = {

  create: (req, res, next) => {
    // handle validation 
    const validate = adminsService.validate(req.body);
    if (!validate.isValid) {
      const err = new Error('Please provide a valid data!');
      err.field = validate.field;
      err.rule = validate.rule;
      next(err);
    }

    adminsService.create(req.body)
      .then((admin) => {
        res.locals.data = admin;
        next();;
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
    return adminsService.getAll()
      .then((admins) => {
        res.locals.data = admins;
        next();
      })
      .catch((err) => {
        err.message = err.message || 'Can\'t retrieve the data!';
        next(err);
      });
  },

  get: (req, res, next) => {
    const adminId = +req.params.adminId;

    // handle validation
    if (!adminId) {
      const err = new Error('Please provide a valid data!');
      next(err);
    }

    return adminsService.get(adminId)
      .then((admin) => {
        if (!admin) {
          const err = new Error('Can\'t retrieve the data!');
          throw err;
        }

        res.locals.data = admin;
        next();
      })
      .catch(err => {
        err.message = err.message || 'Can\'t retrieve the data!';
        next(err);
      });

  },

  update(req, res, next) {
    const adminId = +req.params.adminId;

    // TODO: handle validation 
    let valid = true;
    if (!valid) {
      const err = new Error('Please provide a valid data!');
      throw err;
    }
    if (+req.user.id !== adminId) {
      const err = new Error('Unauthorized request!');
      err.status = 403;
      throw err;
    }

    adminsService.update(adminId, req.body)
      .then((admin) => {
        res.locals.data = admin;
        next();;
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

  login(req, res, next) {
    const password = req.body.password;
    const email = req.body.email;

    // Validate credentials
    adminsService.authenticate(email, password)
      .then((results) => {
        if (!results) {
          const err = new Error('Invalid email or password!');
          err.status = 401;
          throw err;
        }

        res.locals.data = results;
        next();;
      })
      .catch(err => {
        console.log(err);
        err.message = err.message || 'Can\'t retrieve the data!';
        next(err);
      });
  }

};

module.exports = adminsController;
