'use strict';

const config = require(`../config/${process.env.ENV}`);
const fileUploadHelper = require('../helpers/fileUploadHelper');
const dataFormatHelper = require('../helpers/dataFormatHelper');
const Celebrity = require('../models/celebrity');

const celebritiesController = {

  createCelebrity: (req, res) => {
    const newCelebrity = new Celebrity(req.body);

    // TODO: handle validation 
    let valid = true;
    if (!valid) {
      res.status(400).send(dataFormatHelper.errorFormat('Please provide a valid data!'));

    }
    else {
      newCelebrity.video = req.file.filename;
      Celebrity.createCelebrity(newCelebrity, (err, celebrity) => {
        if (err) {
          console.log(err);
          res.status(500);
          return res.json(dataFormatHelper.errorFormat('Error: Can\'t retrieve the data!'));
        }

        fileUploadHelper.moveFile(req.file.path, `${config.celebrities.mediaPath}/${celebrity.id}/`);
        res.json(dataFormatHelper.successFormat(celebrity));
      });
    }
  },

  getAllCelebrities: (req, res) => {
    Celebrity.getAllCelebrities((err, celebrities) => {
      if (err) {
        console.log(err);
        res.status(500);
        return res.json(dataFormatHelper.errorFormat('Error: Can\'t retrieve the data!'));
      }

      res.json(dataFormatHelper.successFormat(celebrities));
    });
  },

  getCelebrity: (req, res) => {
    const celebrityId = req.params.celebrityId;

    // TODO: handle validation 
    let valid = true;
    if (!valid) {
      res.status(400).send(dataFormatHelper.errorFormat('Please provide a valid data!'));

    }
    else {

      Celebrity.getCelebrity(celebrityId, (err, celebrity) => {
        if (err || !celebrity) {
          console.log(err);
          res.status(500);
          return res.json(dataFormatHelper.errorFormat('Error: Can\'t retrieve the data!'));
        }

        res.json(dataFormatHelper.successFormat(celebrity));
      });
    }
  }

};

module.exports = celebritiesController;
