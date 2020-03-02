const express = require('express');
// Import utilities
const { authMiddleware } = require('../../middlewares');
// Import controller
const adminsController = require('./admins.controller');

const router = express.Router();

router.get('/',
  adminsController.getAll);

router.post('/',
  authMiddleware('Admin'),
  adminsController.create);

router.get('/:adminId',
  adminsController.get);

router.patch('/:adminId',
  authMiddleware('Admin'),
  adminsController.update);

// TODO: implement delete admin
router.delete('/:adminId',
  authMiddleware('Admin'),
  (req, res, next) => {
    res.status(401).json({
      message: 'Admins can\'t be deleted!'
    });
  });

router.post('/login', adminsController.login);

module.exports = router;