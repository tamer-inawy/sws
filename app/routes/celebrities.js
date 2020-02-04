'user strict';

const express = require('express');

const config = require(`../config/${process.env.ENV}`);
const fileUploadHelper = require('../helpers/fileUploadHelper');
const celebritiesController = require('../controllers/celebrities');

const router = express.Router();

router.get('/', celebritiesController.getAllCelebrities);
router.post('/', fileUploadHelper.getSingleUploader('video', config.celebrities.uploadsPath, config.allowedVideoTypes), celebritiesController.createCelebrity);
router.get('/:celebrityId', celebritiesController.getCelebrity);

router.patch('/:celebrityId', (req, res, next) => {
  res.status(200).json({
    message: 'Updated celebrity!'
  });
});

router.delete('/:celebrityId', (req, res, next) => {
  res.status(200).json({
    message: 'Deleted celebrity!'
  });
});

module.exports = router;