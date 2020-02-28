const express = require('express');
// Import utilities
const config = require(`../../config/${process.env.NODE_ENV}.config`);
const { authMiddleware } = require('../../middlewares');
// Import controller
const ordersController = require('./orders.controller');

const router = express.Router();

router.get('/', ordersController.getAll);

router.post('/',
  authMiddleware('User'),
  ordersController.create);

router.get('/:orderId',
  authMiddleware(['User', 'Celebrity']),
  ordersController.get);

router.patch('/:orderId',
  authMiddleware('Celebrity'),
  ordersController.update);

// TODO: implement delete order
router.delete('/:orderId',
  authMiddleware('User'),
  (req, res, next) => {
    res.status(401).json({
      message: 'Celebrities can\'t be deleted!'
    });
  });

module.exports = router;