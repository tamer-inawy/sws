const adsService = require('./ads.service');

const adsController = {

  create: (req, res, next) => {

    req.body.users_id = req.user.id;
    // handle validation 
    const validate = adsService.validate(req.body);
    if (!validate.isValid) {
      if (req.file)
        adsService.clearMedia(req.file.path);
      const err = new Error('Please provide a valid data!');
      err.field = validate.field;
      err.rule = validate.rule;
      return next(err);
    }

    adsService.create(req.body)
      .then((ad) => {
        res.locals.data = ad;
        next();
      })
      .catch(err => {
        err.message = err.message || 'Can\'t retrieve the data!';
        return next(err);
      });
  },

  getAll: (req, res, next) => {
    return adsService.getAll()
      .then((ads) => {
        res.locals.data = ads;
        next();
      })
      .catch((err) => {
        err.message = err.message || 'Can\'t retrieve the data!';
        return next(err);
      });
  },

  get: (req, res, next) => {
    const adId = +req.params.adId;

    // handle validation
    if (!adId) {
      const err = new Error('Please provide a valid data!');
      return next(err);
    }

    return adsService.get(adId)
      .then((ad) => {
        if (!ad) {
          const err = new Error('Can\'t retrieve the data!');
          throw err;
        }

        res.locals.data = ad;
        next();
      })
      .catch(err => {
        err.message = err.message || 'Can\'t retrieve the data!';
        return next(err);
      });

  },

  update(req, res, next) {
    const adId = +req.params.adId;

    // TODO: handle validation 
    let valid = true;
    if (!valid) {
      if (req.file)
        adsService.clearMedia(req.file.path);
      const err = new Error('Please provide a valid data!');
      throw err;
    }

    adsService.update(adId, req.body)
      .then((ad) => {
        if(!ad) {
          err = new Error('Wrong ad!');
          return next(err);
        }
        res.locals.data = ad;
        next();
      })
      .catch(err => {
        console.log(err);
        err.message = err.message || 'Can\'t retrieve the data!';
        return next(err);
      });
  },

};

module.exports = adsController;
