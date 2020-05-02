const videosService = require('./videos.service');

const videosController = {

  create: (req, res, next) => {
    let filePath = false;
    if (req.file) {
      req.body.video = req.file.filename;
      filePath = req.file.path;
    }

    req.body.users_id = req.user.id;
    // handle validation 
    const validate = videosService.validate(req.body);
    if (!validate.isValid) {
      if (req.file)
        videosService.clearMedia(req.file.path);
      const err = new Error('Please provide a valid data!');
      err.field = validate.field;
      err.rule = validate.rule;
      next(err);
    }

    videosService.create(req.body, filePath)
      .then((video) => {
        res.locals.data = video;
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
    return videosService.getAll()
      .then((videos) => {
        res.locals.data = videos;
        next();
      })
      .catch((err) => {
        err.message = err.message || 'Can\'t retrieve the data!';
        next(err);
      });
  },

  get: (req, res, next) => {
    const videoId = +req.params.videoId;

    // handle validation
    if (!videoId) {
      const err = new Error('Please provide a valid data!');
      next(err);
    }

    return videosService.get(videoId)
      .then((video) => {
        if (!video) {
          const err = new Error('Can\'t retrieve the data!');
          throw err;
        }

        res.locals.data = video;
        next();
      })
      .catch(err => {
        err.message = err.message || 'Can\'t retrieve the data!';
        next(err);
      });

  },

  update(req, res, next) {
    const videoId = +req.params.videoId;

    // TODO: handle validation 
    let valid = true;
    if (!valid) {
      if (req.file)
        videosService.clearMedia(req.file.path);
      const err = new Error('Please provide a valid data!');
      throw err;
    }

    videosService.get(videoId)
      .then(results => {
        console.log(results)
        // TODO: Validate celebrity id
        if (+req.user.id !== results.celebrities_id) {
          if (req.file)
            videosService.clearMedia(req.file.path);
          const err = new Error('Unauthorized request!');
          err.status = 403;
          throw err;
        }

        let filePath = false;
        if (req.file) {
          req.body.video = req.file.filename;
          filePath = req.file.path;
          req.body.status = 'APPROVED';
        }

        videosService.update(videoId, req.body, filePath)
          .then((video) => {
            if (!video) {
              err = new Error('Wrong video!');
              next(err);
            }
            res.locals.data = video;
            next();
          })
          .catch(err => {
            console.log(err);
            err.message = err.message || 'Can\'t retrieve the data!';
            next(err);
          });
      })
  },

};

module.exports = videosController;
