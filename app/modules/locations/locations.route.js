const express = require('express');
// Import utilities
const config = require(`../../config/${process.env.NODE_ENV}.config`);
const { fileUploadHelper } = require('../../helpers');
const { authMiddleware } = require('../../middlewares');
// Import controller
const locationsController = require('./locations.controller');

const router = express.Router();

/**
 * @api {get} /locations List all locations
 * @apiVersion 0.1.0
 * @apiGroup Ads
 * @apiPermission none
 * 
 * @apiSuccess {String} status The request status (success|failed)
 * @apiSuccess {Object[]} data Ad's list (Array of objects)
 * 
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {
 *      "status": "success",
 *      "data": [
 *        {
 *          "id": 1,
 *          "location": "28.499970, 34.499702",
 *          "name": "Fancy Hotel",
 *          "website": "https://fancyhotel.com",
 *          "address": "#1, Fancy hotel street."
 *        }
 *      ]
 *    }
 */
router.get('/', locationsController.getAll);

/**
 * @api {post} /locations Create new location
 * @apiVersion 0.1.0
 * @apiGroup Ads
 * @apiPermission User
 * @apiParam {String} [urgent] Send 1 if the request is urgent
 * @apiParam {Number} price Price
 * @apiParam {String} request_type The location type. Send videos, locations, or events
 * @apiSuccess {String} status The request status (success|failed)
 * @apiSuccess {Object} data The created location details
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {
 *      "status": "success",
 *      "data": {
 *        "id": 1,
 *        "location": "28.499970, 34.499702",
 *        "name": "Fancy Hotel",
 *        "website": "https://fancyhotel.com",
 *        "address": "#1, Fancy hotel street."
 *      }
 *    }
 */
router.post('/',
  authMiddleware('User'),
  locationsController.create);

/**
 * @api {get} /locations/:id Get location's details
 * @apiVersion 0.1.0
 * @apiGroup Ads
 * @apiPermission User, Celebrity
 * @apiSuccess {String} status The request status (success|failed)
 * @apiSuccess {Object} data The location details
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {
 *      "status": "success",
 *      "data": {
 *        "id": 1,
 *        "location": "28.499970, 34.499702",
 *        "name": "Fancy Hotel",
 *        "website": "https://fancyhotel.com",
 *        "address": "#1, Fancy hotel street."
 *        }
 *    }
 */
router.get('/:locationId', locationsController.get);

/**
 * @api {patch} /locations/:id Update the location's details
 * @apiVersion 0.1.0
 * @apiGroup Ads
 * @apiPermission User, Celebrity
 * @apiSuccess {String} status The request status (success|failed)
 * @apiSuccess {Object} data The updated location details
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {
 *      "status": "success",
 *      "data": {
 *        "id": 1,
 *        "location": "28.499970, 34.499702",
 *        "name": "Fancy Hotel",
 *        "website": "https://fancyhotel.com",
 *        "address": "#1, Fancy hotel street."
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
router.patch('/:locationId',
  authMiddleware('User'),
  locationsController.update);

// TODO: implement delete location
router.delete('/:locationId',
  authMiddleware('User'),
  (req, res, next) => {
    res.status(401).json({
      message: 'Celebrities can\'t be deleted!'
    });
  });

module.exports = router;