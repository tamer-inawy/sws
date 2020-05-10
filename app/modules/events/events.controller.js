const eventsService = require('./events.service');

const eventsController = {

  create: (req, res, next) => {

    // handle validation 
    const validate = eventsService.validate(req.body);
    if (!validate.isValid) {
      const err = new Error('Please provide a valid data!');
      err.field = validate.field;
      err.rule = validate.rule;
      return next(err);
    }

    eventsService.create(req.body)
      .then((event) => {
        res.locals.data = event;
        next();
      })
      .catch(err => {
        err.message = err.message || 'Can\'t retrieve the data!';
        return next(err);
      });
  },

  getAll: (req, res, next) => {
    return eventsService.getAll()
      .then((events) => {
        res.locals.data = events;
        next();
      })
      .catch((err) => {
        err.message = err.message || 'Can\'t retrieve the data!';
        return next(err);
      });
  },

  get: (req, res, next) => {
    const eventId = +req.params.eventId;

    // handle validation
    if (!eventId) {
      const err = new Error('Please provide a valid data!');
      return next(err);
    }

    return eventsService.get(eventId)
      .then((event) => {
        if (!event) {
          const err = new Error('Can\'t retrieve the data!');
          throw err;
        }

        res.locals.data = event;
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

    return eventsService.getByUser(userId)
      .then((event) => {
        if (!event) {
          const err = new Error('Can\'t retrieve the data!');
          throw err;
        }

        res.locals.data = event;
        next();
      })
      .catch(err => {
        err.message = err.message || 'Can\'t retrieve the data!';
        return next(err);
      });

  },

  update(req, res, next) {
    const eventId = +req.params.eventId;

    // TODO: handle validation 
    let valid = true;
    if (!valid) {
      if (req.file)
        eventsService.clearMedia(req.file.path);
      const err = new Error('Please provide a valid data!');
      throw err;
    }

    eventsService.get(eventId)
      .then(results => {
        // Validate celebrity id
        if (+req.user.id !== results.celebrities_id && req.file) {
          eventsService.clearMedia(req.file.path);
          const err = new Error('Unauthorized request!');
          err.status = 403;
          throw err;
        }

        let filePath = false;
        if (req.file) {
          req.body.image = req.file.filename;
          req.body.status = 'DONE';
          filePath = req.file.path;
        }

        eventsService.update(eventId, req.body)
          .then((event) => {
            if (!event) {
              err = new Error('Wrong event!');
              return next(err);
            }
            res.locals.data = event;
            next();
          })
          .catch(err => {
            console.log(err);
            err.message = err.message || 'Can\'t retrieve the data!';
            return next(err);
          });
      })

  },

};

module.exports = eventsController;
