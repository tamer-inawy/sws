const express = require('express');
// Import utilities
const { authMiddleware } = require('../../middlewares');
// Import controller
const ordersController = require('./orders.controller');

const router = express.Router();

/**
 * @api {get} /orders List all orders
 * @apiVersion 0.1.0
 * @apiGroup Orders
 * @apiPermission none
 * @apiSuccess {String} status The request status (success|failed)
 * @apiSuccess {Object[]} data Order's list (Array of objects)
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {
 *      "status": "success",
 *      "data": [
 *        {
 *          "id": 1,
 *          "urgent": 1,
 *          "price": 888.99,
 *          "request_type": "videos",
 *          "created_at": "2020-02-22T16:36:36.000Z"
 *        },
 *        {
 *          "id": 2,
 *          "urgent": 0,
 *          "price": 560.75,
 *          "request_type": "ads",
 *          "created_at": "2020-02-22T21:36:56.000Z"
 *        }
 *      ]
 *    }
 */
router.get('/', ordersController.getAll);

/**
 * @api {post} /orders Create new order
 * @apiVersion 0.1.0
 * @apiGroup Orders
 * @apiPermission Admin
 * @apiParam {String} [urgent] Send 1 if the request is urgent
 * @apiParam {Number} price Price
 * @apiParam {String} request_type The order type. Send videos, ads, or events
 * @apiSuccess {String} status The request status (success|failed)
 * @apiSuccess {Object} data The created order details
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {
 *      "status": "success",
 *      "data": {
 *        "id": 1,
 *        "urgent": 1,
 *        "price": 888.99,
 *        "request_type": "videos",
 *        "created_at": "2020-02-22T16:36:36.000Z"
 *        }
 *    }
 */
router.post('/',
  authMiddleware('User'),
  ordersController.create);

/**
 * @api {get} /orders/:id Get order's details
 * @apiVersion 0.1.0
 * @apiGroup Orders
 * @apiPermission User, Celebrity
 * @apiSuccess {String} status The request status (success|failed)
 * @apiSuccess {Object} data The order details
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {
 *      "status": "success",
 *      "data": {
 *        "id": 1,
 *        "urgent": 1,
 *        "price": 888.99,
 *        "request_type": "videos",
 *        "created_at": "2020-02-22T16:36:36.000Z"
 *        }
 *    }
 */
router.get('/:orderId',
  authMiddleware(['User', 'Celebrity']),
  ordersController.get);

/**
 * @api {patch} /orders/:id Update the order's details
 * @apiVersion 0.1.0
 * @apiGroup Orders
 * @apiPermission User, Celebrity
 * @apiSuccess {String} status The request status (success|failed)
 * @apiSuccess {Object} data The updated order details
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {
 *      "status": "success",
 *      "data": {
 *        "id": 1,
 *        "name": "John Doe",
 *        "email": "john.doe@test.com",
 *        "video_price": 25.99,
 *        "urgent_price": 45.45,
 *        "event_price": 999.75,
 *        "short_desc": "This is the short description.",
 *        "desc": "This is the full description.",
 *        "video": "1582407425907_SampleVideo_640x360_1mb.mp4",
 *        "created_at": "2020-02-22T16:36:36.000Z"
 *        }
 *    }
  * @apiErrorExample {json} List error
 *    HTTP/1.1 401 Unauthorized
 *    {
 *      "status": "failed",
 *      "error": {
 *        "message": "Unauthorized request!"
 *      }
 *    }
 */
router.patch('/:orderId',
  authMiddleware(['User', 'Celebrity']),
  ordersController.update);

// TODO: implement delete order
router.delete('/:orderId',
  authMiddleware('User'),
  (req, res, next) => {
    res.status(401).json({
      message: 'Orders can\'t be deleted!'
    });
  });

module.exports = router;