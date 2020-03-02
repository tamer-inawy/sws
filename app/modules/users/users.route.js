const express = require('express');
// Import utilities
const config = require(`../../config/${process.env.NODE_ENV}.config`);
const { fileUploadHelper } = require('../../helpers');
const { authMiddleware } = require('../../middlewares');
// Import controller
const usersController = require('./users.controller');

const router = express.Router();
const imageUploaderConfis = [
  'image',
  config.users.uploadsPath,
  config.image.allowedTypes,
  config.image.maxFileSize
];

router.get('/',
  usersController.getAll);

router.post('/',
  fileUploadHelper.getSingleUploader(...imageUploaderConfis),
  usersController.create);

router.get('/:userId',
usersController.get);

router.patch('/:userId',
  authMiddleware('User'),
  fileUploadHelper.getSingleUploader(...imageUploaderConfis),
  usersController.update);

// TODO: implement delete user
router.delete('/:userId',
  authMiddleware('User'),
  (req, res, next) => {
    res.status(401).json({
      message: 'Users can\'t be deleted!'
    });
  });

router.post('/login', usersController.login);

module.exports = router;