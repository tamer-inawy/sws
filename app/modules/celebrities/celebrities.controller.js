const celebritiesService = require('./celebrities.service');

const celebritiesController = {

  create: (req, res, next) => {
    let filePath = false;
    if (req.file) {
      req.body.video = req.file.filename;
      filePath = req.file.path;
    }

    // handle validation 
    const validate = celebritiesService.validate(req.body);
    if (!validate.isValid) {
      if (req.file)
        celebritiesService.clearMedia(req.file.path);
      const err = new Error('Please provide a valid data!');
      err.field = validate.field;
      err.rule = validate.rule;
      next(err);
    }

    celebritiesService.create(req.body, filePath)
      .then((celebrity) => {
        res.locals.data = celebrity;
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
    return celebritiesService.getAll()
      .then((celebrities) => {
        res.locals.data = celebrities;
        next();
      })
      .catch((err) => {
        err.message = err.message || 'Can\'t retrieve the data!';
        next(err);
      });
  },

  get: (req, res, next) => {
    const celebrityId = +req.params.celebrityId;

    // handle validation
    if (!celebrityId) {
      const err = new Error('Please provide a valid data!');
      next(err);
    }

    return celebritiesService.get(celebrityId)
      .then((celebrity) => {
        if (!celebrity) {
          const err = new Error('Can\'t retrieve the data!');
          throw err;
        }

        res.locals.data = celebrity;
        next();
      })
      .catch(err => {
        err.message = err.message || 'Can\'t retrieve the data!';
        next(err);
      });

  },

  update(req, res, next) {
    const celebrityId = +req.params.celebrityId;

    // TODO: handle validation 
    let valid = true;
    if (!valid) {
      if (req.file)
        celebritiesService.clearMedia(req.file.path);
      const err = new Error('Please provide a valid data!');
      throw err;
    }
    if (+req.user.id !== celebrityId) {
      if (req.file)
        celebritiesService.clearMedia(req.file.path);
      const err = new Error('Unauthorized request!');
      err.status = 403;
      throw err;
    }

    let filePath = false;
    if (req.file) {
      req.body.video = req.file.filename;
      filePath = req.file.path;
    }

    celebritiesService.update(celebrityId, req.body, filePath)
      .then((celebrity) => {
        res.locals.data = celebrity;
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

  login(req, res, next) {
    const password = req.body.password;
    const email = req.body.email;

    // Validate credentials
    celebritiesService.authenticate(email, password)
      .then((results) => {
        if (!results) {
          const err = new Error('Invalid email or password!');
          err.status = 401;
          throw err;
        }

        res.locals.data = results;
        next();
      })
      .catch(err => {
        console.log(err);
        err.message = err.message || 'Can\'t retrieve the data!';
        next(err);
      });
  },

  getVideos(req, res, next) {
    const celebrityId = +req.params.celebrityId;
    return celebritiesService.getVideos(celebrityId)
      .then((results) => {
        res.locals.data = results;
        next();
      })
  },

};

module.exports = celebritiesController;
