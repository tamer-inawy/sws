'use strict';

const jwt = require('jsonwebtoken');

const config = require(`../config/${process.env.ENV}.config`);
const { dataFormatHelper } = require('../helpers');
const celebritiesService = require('../services/celebrities.service');

const celebritiesController = {

  createCelebrity: (req, res, next) => {
    let filePath = false;
    if (req.file) {
      req.body.video = req.file.filename;
      filePath = req.file.path;
    }

    // handle validation 
    const validate = celebritiesService.validateCelebrity(req.body);
    if (!validate.isValid) {
      if (req.file)
        celebritiesService.clearMedia(req.file.path);
      const err = new Error('Please provide a valid data!');
      err.field = validate.field;
      err.rule = validate.rule;
      next(err);
    }

    celebritiesService.createCelebrity(req.body, filePath)
      .then((celebrity) => {
        res.locals.data = celebrity;
        next();;
      })
      .catch(err => {
        if (err.errno === 1062) {
          err.message = 'The email is already in use!';
          err.status = 409;
        } else {
          err.message = err.message || 'Error: Can\'t retrieve the data!';
        }

        next(err);
      });
  },

  getAllCelebrities: (req, res, next) => {
    celebritiesService.getAllCelebrities()
      .then((celebrities) => {
        res.locals.data = celebrities;
        next();
      })
      .catch((err) => {
        err.message = err.message || 'Error: Can\'t retrieve the data!';
        next(err);
      });
  },

  getCelebrity: (req, res, next) => {
    const celebrityId = req.params.celebrityId;

    // handle validation
    if (!celebrityId) {
      const err = new Error('Please provide a valid data!');
      next(err);
    }

    celebritiesService.getCelebrity(celebrityId)
      .then((celebrity) => {
        if (!celebrity) {
          const err = new Error('Error: Can\'t retrieve the data!');
          throw err;
        }

        res.locals.data = celebrity;
        next();;
      })
      .catch(err => {
        err.message = err.message || 'Error: Can\'t retrieve the data!';
        next(err);
      });

  },

  updateCelebrity(req, res, next) {
    const celebrityId = req.params.celebrityId;

    // TODO: handle validation 
    let valid = true;
    if (!valid) {
      if (req.file)
        celebritiesService.clearMedia(req.file.path);
      const err = new Error('Please provide a valid data!');
      throw err;
    }

    let filePath = false;
    if (req.file) {
      req.body.video = req.file.filename;
      filePath = req.file.path;
    }

    celebritiesService.updateCelebrity(celebrityId, req.body, filePath)
      .then((celebrity) => {
        res.locals.data = celebrity;
        next();;
      })
      .catch(err => {
        console.log(err);
        if (err.errno === 1062) {
          err.message = 'The email is already in use!';
        } else {
          err.message = err.message || 'Error: Can\'t retrieve the data!';
        }
        next(err);
      });
  },

  login(req, res, next) {
    const password = req.body.password;
    const email = req.body.email;

    // Validate credentials
    celebritiesService.validateCelebrityCredintials(email, password)
      .then((results) => {
        if (!results) {
          const err = new Error('Invalid email or password!');
          err.status = 401;
          throw err;
        }

        const data = {
          id: results.id,
          name: results.name,
          email: results.email
        };
        // TODO: move the token creation to auth service
        data.token = jwt.sign(data, config.jwt.secrit, { expiresIn: config.jwt.expiration });

        res.locals.data = data;
        next();;
      })
      .catch(err => {
        console.log(err);
        err.message = err.message || 'Error: Can\'t retrieve the data!';
        next(err);
      });
  }

};

module.exports = celebritiesController;
