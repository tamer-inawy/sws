const usersService = require('./users.service');

const usersController = {

  create: (req, res, next) => {
    let filePath = false;
    if (req.file) {
      req.body.image = req.file.filename;
      filePath = req.file.path;
    }

    // handle validation 
    const validate = usersService.validate(req.body);
    if (!validate.isValid) {
      if (req.file)
        usersService.clearMedia(req.file.path);
      const err = new Error('Please provide a valid data!');
      err.field = validate.field;
      err.rule = validate.rule;
      next(err);
    }

    usersService.create(req.body, filePath)
      .then((user) => {
        res.locals.data = user;
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
    return usersService.getAll()
      .then((users) => {
        res.locals.data = users;
        next();
      })
      .catch((err) => {
        err.message = err.message || 'Can\'t retrieve the data!';
        next(err);
      });
  },

  get: (req, res, next) => {
    const userId = +req.params.userId;

    // handle validation
    if (!userId) {
      const err = new Error('Please provide a valid data!');
      next(err);
    }

    return usersService.get(userId)
      .then((user) => {
        if (!user) {
          const err = new Error('Can\'t retrieve the data!');
          throw err;
        }

        res.locals.data = user;
        next();
      })
      .catch(err => {
        err.message = err.message || 'Can\'t retrieve the data!';
        next(err);
      });

  },

  update(req, res, next) {
    const userId = +req.params.userId;

    // TODO: handle validation 
    let valid = true;
    if (!valid) {
      if (req.file)
        usersService.clearMedia(req.file.path);
      const err = new Error('Please provide a valid data!');
      throw err;
    }
    if (+req.user.id !== userId) {
      if (req.file)
        usersService.clearMedia(req.file.path);
      const err = new Error('Unauthorized request!');
      err.status = 403;
      throw err;
    }

    let filePath = false;
    if (req.file) {
      req.body.image = req.file.filename;
      filePath = req.file.path;
    }

    usersService.update(userId, req.body, filePath)
      .then((user) => {
        res.locals.data = user;
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
    usersService.authenticate(email, password)
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

module.exports = usersController;
