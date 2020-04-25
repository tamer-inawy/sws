const express = require('express');
// Import utilities
const { authMiddleware } = require('../../middlewares');
// Import controller
const eventsController = require('./events.controller');

const router = express.Router();

router.get('/', eventsController.getAll);

router.post('/',
  authMiddleware('User'),
  eventsController.create);


router.get('/user/:userId',
  authMiddleware(['User']),
  eventsController.getByUser);

router.get('/:eventId',
  authMiddleware(['User', 'Celebrity']),
  eventsController.get);

router.patch('/:eventId',
  authMiddleware(['User', 'Celebrity']),
  eventsController.update);

// TODO: implement delete event
router.delete('/:eventId',
  authMiddleware('User'),
  (req, res, next) => {
    res.status(401).json({
      message: 'Events can\'t be deleted!'
    });
  });

module.exports = router;