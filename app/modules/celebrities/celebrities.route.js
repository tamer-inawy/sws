const express = require('express');
// Import utilities
const config = require(`../../config/${process.env.ENV}.config`);
const { fileUploadHelper } = require('../../helpers');
const { authMiddleware } = require('../../middlewares');
// Import controller
const celebritiesController = require('./celebrities.controller');

const router = express.Router();
const videoUploaderConfis = [
  'video',
  config.celebrities.uploadsPath,
  config.video.allowedTypes,
  config.video.maxFileSize
];

router.get('/', celebritiesController.getAllCelebrities);

router.post('/',
  authMiddleware('Celebrity'),
  fileUploadHelper.getSingleUploader(...videoUploaderConfis),
  celebritiesController.createCelebrity);

router.get('/:celebrityId', celebritiesController.getCelebrity);

router.patch('/:celebrityId',
  authMiddleware('Celebrity'),
  fileUploadHelper.getSingleUploader(...videoUploaderConfis),
  celebritiesController.updateCelebrity);

// TODO: implement delete celebrity
router.delete('/:celebrityId',
  authMiddleware('Celebrity'),
  (req, res, next) => {
    res.status(401).json({
      message: 'Celebrities can\'t be deleted!'
    });
  });

router.post('/login', celebritiesController.login);

module.exports = router;