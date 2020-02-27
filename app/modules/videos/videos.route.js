const express = require('express');
// Import utilities
const config = require(`../../config/${process.env.NODE_ENV}.config`);
const { fileUploadHelper } = require('../../helpers');
const { authMiddleware } = require('../../middlewares');
// Import controller
const videosController = require('./videos.controller');

const router = express.Router();
const videoUploaderConfis = [
  'video',
  config.celebrities.uploadsPath,
  config.video.allowedTypes,
  config.video.maxFileSize
];

router.get('/', videosController.getAll);

router.post('/',
  authMiddleware('User'),
  fileUploadHelper.getSingleUploader(...videoUploaderConfis),
  videosController.create);

router.get('/:videoId', videosController.get);

router.patch('/:videoId',
  authMiddleware('Celebrity'),
  fileUploadHelper.getSingleUploader(...videoUploaderConfis),
  videosController.update);

// TODO: implement delete video
router.delete('/:videoId',
  authMiddleware('Celebrity'),
  (req, res, next) => {
    res.status(401).json({
      message: 'Celebrities can\'t be deleted!'
    });
  });

module.exports = router;