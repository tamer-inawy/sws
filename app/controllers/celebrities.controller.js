'use strict';

const jwt = require('jsonwebtoken');

const config = require(`../config/${process.env.ENV}.config`);
const fileUploadHelper = require('../helpers/fileUpload.helper');
const dataFormatHelper = require('../helpers/dataFormat.helper');
const validationHelper = require('../helpers/validation.helper');
const Celebrity = require('../models/celebrity.model');

const celebritiesController = {

  createCelebrity: (req, res) => {
    req.body.password = dataFormatHelper.passwordHash(req.body.password, config.saltRound);
    const newCelebrity = new Celebrity(req.body);
    if (req.file)
      newCelebrity.video = req.file.filename;

    // TODO: handle validation 
    const validate = validationHelper.validate(Celebrity.getSchema(), newCelebrity);
    if (!validate.isValid) {
      if (req.file)
        fileUploadHelper.deleteFile(req.file.path);
      const err = new Error();
      err.message = 'Please provide a valid data!';
      err.field = validate.field;
      err.rule = validate.rule;
      return res.status(400).send(dataFormatHelper.errorFormat(err));
    }

    Celebrity.createCelebrity(newCelebrity, (err, celebrity) => {
      if (err) {
        if (req.file)
          fileUploadHelper.deleteFile(req.file.path);
        console.log(err);
        res.status(500);
        err.message = 'Error: Can\'t retrieve the data!';
        return res.json(dataFormatHelper.errorFormat(err));
      }

      fileUploadHelper.moveFile(req.file.path, `${config.celebrities.mediaPath}/${celebrity.id}/`);
      res.json(dataFormatHelper.successFormat(celebrity));
    });
  },

  getAllCelebrities: (req, res) => {
    Celebrity.getAllCelebrities((err, celebrities) => {
      if (err) {
        console.log(err);
        res.status(500);
        err.message = 'Error: Can\'t retrieve the data!';
        return res.json(dataFormatHelper.errorFormat(err));
      }

      res.json(dataFormatHelper.successFormat(celebrities));
    });
  },

  getCelebrity: (req, res) => {
    const celebrityId = req.params.celebrityId;

    // TODO: handle validation 
    let valid = true;
    if (!valid) {
      const err = err = new Error();;
      err.message = 'Please provide a valid data!';
      res.status(400).send(dataFormatHelper.errorFormat(err));

    }
    else {

      Celebrity.getCelebrity(celebrityId, (err, celebrity) => {
        if (err || !celebrity) {
          res.status(500);
          err = err ? err : new Error();
          err.message = 'Error: Can\'t retrieve the data!';
          console.log(err);
          return res.json(dataFormatHelper.errorFormat(err));
        }

        res.json(dataFormatHelper.successFormat(celebrity));
      });
    }
  },

  updateCelebrity(req, res) {
    const updatedCelebrity = new Celebrity(req.body);
    const celebrityId = req.params.celebrityId;

    // TODO: handle validation 
    let valid = true;
    if (!valid) {
      if (req.file)
        fileUploadHelper.deleteFile(req.file.path);
      const err = err = new Error();;
      err.message = 'Please provide a valid data!';
      res.status(400).send(dataFormatHelper.errorFormat(err));

    }
    else {
      if (req.file)
        updatedCelebrity.video = req.file.filename;
      if (req.body.password)
        updatedCelebrity.password = dataFormatHelper.passwordHash(req.body.password, config.saltRound);

      // Prevent email update
      delete updatedCelebrity.email;

      Celebrity.updateCelebrity(celebrityId, updatedCelebrity, (err, celebrity) => {
        if (err) {
          if (req.file)
            fileUploadHelper.deleteFile(req.file.path);
          console.log(err);
          if (err.errno === 1062) {
            res.status(400);
            err.message = 'The email is already in use!';
          } else {
            res.status(500);
            err.message = 'Error: Can\'t retrieve the data!';
          }
          return res.json(dataFormatHelper.errorFormat(err));
        }

        if (req.file)
          fileUploadHelper.moveFile(req.file.path, `${config.celebrities.mediaPath}/${celebrityId}/`);
        res.json(dataFormatHelper.successFormat(celebrity));
      });
    }
  },

  login(req, res) {
    const password = req.body.password;
    const email = req.body.email;

    // Validate email
    Celebrity.findCelebrityByEmail(email, (err, results) => {
      if (err) {
        res.status(500);
        err = err ? err : new Error();
        err.message = 'Error: Can\'t retrieve the data!';
        console.log(err);
        return res.json(dataFormatHelper.errorFormat(err));
      }

      if (!results) {
        res.status(401);
        err = err ? err : new Error();
        err.message = 'Invalid email or password!';
        return res.json(dataFormatHelper.errorFormat(err));
      }

      // Validate password
      if (!validationHelper.comparePassword(password, results.password)) {
        res.status(401);
        err = err ? err : new Error();
        err.message = 'Invalid email or password!';
        return res.json(dataFormatHelper.errorFormat(err));
      }

      const data = {
        id: results.id,
        name: results.name,
        email: results.email
      };
      data.token = jwt.sign(data, config.jwt.secrit, { expiresIn: config.jwt.expiration });

      res.json(dataFormatHelper.successFormat(data));
    });
  }

};

module.exports = celebritiesController;
