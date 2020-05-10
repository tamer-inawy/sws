const express = require('express');
// Import utilities
const config = require(`../../config/${process.env.NODE_ENV}.config`);
const { fileUploadHelper } = require('../../helpers');
const { authMiddleware } = require('../../middlewares');
// Import controller
const adsController = require('./ads.controller');

const router = express.Router();

/**
 * @api {get} /ads List all ads
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
 *          "company": "Big Company",
 *          "instructions": "We need an ad.",
 *          "photo": null,
 *          "users_id": 1,
 *          "celebrities_id": 1,
 *          "status": "PENDING",
 *          "type": "TV",
 *          "working_days": 2,
 *          "date_from": "0000-00-00",
 *          "date_to": "2020-05-01T00:00:00.000Z",
 *          "director": "Big Director",
 *          "locations_id": 1,
 *          "orders_id": 1
 *      },
 *      {
 *          "id": 2,
 *          "company": "Big Company",
 *          "instructions": "We need an ad.",
 *          "photo": null,
 *          "users_id": 1,
 *          "celebrities_id": 1,
 *          "status": "PENDING",
 *          "type": "TV",
 *          "working_days": 2,
 *          "date_from": "0000-00-00",
 *          "date_to": "2020-05-01T00:00:00.000Z",
 *          "director": "Big Director",
 *          "locations_id": 1,
 *          "orders_id": 1
 *      },
 *      {
 *          "id": 3,
 *          "company": "Big Company",
 *          "instructions": "We need an ad.",
 *          "photo": null,
 *          "users_id": 1,
 *          "celebrities_id": 1,
 *          "status": "PENDING",
 *          "type": "TV",
 *          "working_days": 2,
 *          "date_from": "2020-04-01T00:00:00.000Z",
 *          "date_to": "2020-05-01T00:00:00.000Z",
 *          "director": "Big Director",
 *          "locations_id": 1,
 *          "orders_id": 1
 *        }
 *      ]
 *    }
 */
router.get('/', adsController.getAll);

/**
 * @api {post} /ads Create new ad
 * @apiVersion 0.1.0
 * @apiGroup Ads
 * @apiPermission Admin
 * 
 * @apiParam {String} company The company's name
 * @apiParam {String} instructions The ad instructions
 * @apiParam {String} [photo] Photo
 * @apiParam {String} users_id The user's id
 * @apiParam {String} celebrities_id The celebrity's id
 * @apiParam {String} type The ad's type
 * @apiParam {String} working_days The number of required working days
 * @apiParam {String} date_from The starting of the suggested date
 * @apiParam {String} date_to The end of the suggested date
 * @apiParam {String} [director] The director's name
 * @apiParam {String} locations_id The location's id
 * @apiParam {String} orders_id The order's id
 * 
 * @apiSuccess {String} status The request status (success|failed)
 * @apiSuccess {Object} data The created ad details
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {
 *      "status": "success",
 *      "data": {
 *        "id": 1,
 *        "company": "Big Company",
 *        "instructions": "We need an ad.",
 *        "photo": null,
 *        "users_id": 1,
 *        "celebrities_id": 1,
 *        "status": "PENDING",
 *        "type": "TV",
 *        "working_days": 2,
 *        "date_from": "0000-00-00",
 *        "date_to": "2020-05-01T00:00:00.000Z",
 *        "director": "Big Director",
 *        "locations_id": 1,
 *        "orders_id": 1
 *       }
 *    }
 */
router.post('/',
  authMiddleware('User'),
  adsController.create);

/**
 * @api {get} /ads/:id Get ad's details
 * @apiVersion 0.1.0
 * @apiGroup Ads
 * @apiPermission User, Celebrity
 * 
 * @apiParam {String} [company] The company's name
 * @apiParam {String} [instructions] The ad instructions
 * @apiParam {String} [photo] Photo
 * @apiParam {String} [users_id] The user's id
 * @apiParam {String} [celebrities_id] The celebrity's id
 * @apiParam {String} [type] The ad's type
 * @apiParam {String} [working_days] The number of required working days
 * @apiParam {String} [date_from] The starting of the suggested date
 * @apiParam {String} [date_to] The end of the suggested date
 * @apiParam {String} [director] The director's name
 * @apiParam {String} [locations_id] The location's id
 * @apiParam {String} [orders_id] The order's id
 * 
 * @apiSuccess {String} status The request status (success|failed)
 * @apiSuccess {Object} data The ad details
 * 
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {
 *      "status": "success",
 *      "data": {
 *        "id": 1,
 *        "company": "Big Company",
 *        "instructions": "We need an ad.",
 *        "photo": null,
 *        "users_id": 1,
 *        "celebrities_id": 1,
 *        "status": "PENDING",
 *        "type": "TV",
 *        "working_days": 2,
 *        "date_from": "0000-00-00",
 *        "date_to": "2020-05-01T00:00:00.000Z",
 *        "director": "Big Director",
 *        "locations_id": 1,
 *        "orders_id": 1
 *        }
 *    }
 */
router.get('/:adId', adsController.get);

/**
 * @api {patch} /ads/:id Update the ad's details
 * @apiVersion 0.1.0
 * @apiGroup Ads
 * @apiPermission User, Celebrity
 * @apiSuccess {String} status The request status (success|failed)
 * @apiSuccess {Object} data The updated ad details
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {
 *      "status": "success",
 *      "data": {
 *        "id": 1,
 *        "company": "Big Company",
 *        "instructions": "We need an ad.",
 *        "photo": null,
 *        "users_id": 1,
 *        "celebrities_id": 1,
 *        "status": "PENDING",
 *        "type": "TV",
 *        "working_days": 2,
 *        "date_from": "0000-00-00",
 *        "date_to": "2020-05-01T00:00:00.000Z",
 *        "director": "Big Director",
 *        "locations_id": 1,
 *        "orders_id": 1
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
router.patch('/:adId',
  authMiddleware(['User', 'Celebrity']),
  adsController.update);

// TODO: implement delete ad
router.delete('/:adId',
  authMiddleware('Celebrity'),
  (req, res, next) => {
    res.status(401).json({
      message: 'Celebrities can\'t be deleted!'
    });
  });

module.exports = router;