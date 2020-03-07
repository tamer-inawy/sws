const locationsService = require('./locations.service');

const locationsController = {

  create: (req, res, next) => {

    req.body.users_id = req.user.id;
    // handle validation 
    const validate = locationsService.validate(req.body);
    if (!validate.isValid) {
      if (req.file)
        locationsService.clearMedia(req.file.path);
      const err = new Error('Please provide a valid data!');
      err.field = validate.field;
      err.rule = validate.rule;
      next(err);
    }

    locationsService.create(req.body)
      .then((location) => {
        res.locals.data = location;
        next();
      })
      .catch(err => {
        err.message = err.message || 'Can\'t retrieve the data!';
        next(err);
      });
  },

  getAll: (req, res, next) => {
    return locationsService.getAll()
      .then((locations) => {
        res.locals.data = locations;
        next();
      })
      .catch((err) => {
        err.message = err.message || 'Can\'t retrieve the data!';
        next(err);
      });
  },

  get: (req, res, next) => {
    const locationId = +req.params.locationId;

    // handle validation
    if (!locationId) {
      const err = new Error('Please provide a valid data!');
      next(err);
    }

    return locationsService.get(locationId)
      .then((location) => {
        if (!location) {
          const err = new Error('Can\'t retrieve the data!');
          throw err;
        }

        res.locals.data = location;
        next();
      })
      .catch(err => {
        err.message = err.message || 'Can\'t retrieve the data!';
        next(err);
      });

  },

  update(req, res, next) {
    const locationId = +req.params.locationId;

    // TODO: handle validation 
    let valid = true;
    if (!valid) {
      if (req.file)
        locationsService.clearMedia(req.file.path);
      const err = new Error('Please provide a valid data!');
      throw err;
    }

    locationsService.update(locationId, req.body)
      .then((location) => {
        if(!location) {
          err = new Error('Wrong location!');
          next(err);
        }
        res.locals.data = location;
        next();
      })
      .catch(err => {
        console.log(err);
        err.message = err.message || 'Can\'t retrieve the data!';
        next(err);
      });
  },

};

module.exports = locationsController;
