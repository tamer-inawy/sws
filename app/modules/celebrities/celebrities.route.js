const express = require('express');
// Import utilities
const config = require(`../../config/${process.env.NODE_ENV}.config`);
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

/**
 * @api {get} /celebrities List all celebrities
 * @apiVersion 0.1.0
 * @apiGroup Celebrities
 * @apiPermission none
 * 
 * @apiSuccess {String} status The request status (success|failed)
 * @apiSuccess {Object[]} data Celebrity's list (Array of objects)
 * 
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {
 *      "status": "success",
 *      "data": [
 *        {
 *          "id": 1,
 *          "name": "John Doe",
 *          "email": "john.doe@test.com",
 *          "video_price": 25.99,
 *          "urgent_price": 45.45,
 *          "event_price": 999.75,
 *          "short_desc": "This is the short description.",
 *          "desc": "This is the full description.",
 *          "video": "1582407425907_SampleVideo_640x360_1mb.mp4",
 *          "created_at": "2020-02-22T16:36:36.000Z",
 *          "categories": [1,2]
 *        },
 *        {
 *          "id": 2,
 *          "name": "Jane Doe",
 *          "email": "jane.doe@test.com",
 *          "video_price": 25,
 *          "urgent_price": 45,
 *          "event_price": 55.75,
 *          "short_desc": "This is the short description",
 *          "desc": "This is the full description.",
 *          "video": "1582407416363_SampleVideo_640x360_1mb.mp4",
 *          "created_at": "2020-02-22T21:36:56.000Z"
 *          "categories": []
 *        }
 *      ]
 *    }
 */
router.get('/', celebritiesController.getAll);

/**
 * @api {post} /celebrities Create new celebrity
 * @apiVersion 0.1.0
 * @apiGroup Celebrities
 * @apiPermission Admin
 * 
 * @apiParam {String} name Celebrity's name
 * @apiParam {String} email Celebrity's email
 * @apiParam {String} password Celebrity's password
 * @apiParam {Number} video_price Video price
 * @apiParam {Number} urgent_price Urgent video price
 * @apiParam {Number} event_price Event price
 * @apiParam {String} short_desc Short description
 * @apiParam {String} desc Full description
 * @apiParam {File} video Celebrity's introduction video
 * @apiParam {Array} categories Celebrity's categories list
 * 
 * @apiSuccess {String} status The request status (success|failed)
 * @apiSuccess {Object} data The created celebrity details
 * 
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
 */
router.post('/',
  authMiddleware('Admin'),
  fileUploadHelper.getSingleUploader(...videoUploaderConfis),
  celebritiesController.create);

/**
 * @api {get} /celebrities/videos/:id List all celebrity's videos
 * @apiVersion 0.1.0
 * @apiGroup Celebrities
 * @apiPermission none
 * 
 * @apiSuccess {String} status The request status (success|failed)
 * @apiSuccess {Object} data Celebrity's videos list (Array of objects)
 * 
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {
 *      "status": "success",
 *      "data": [
 *        {
 *          "id": 1,
 *          "name": "John Doe",
 *          "other_name": "Someone",
 *          "instructions": "Please provide a video for someone's birthday",
 *          "video": "1582833072871_SampleVideo_640x360_1mb.mp4",
 *          "celebrities_id": 1,
 *          "status": "PENDING",
 *          "uploaded_at": "2020-02-22T16:36:36.000Z"
 *        }
 *      ]
 *    }
 */
router.get('/videos/:celebrityId', celebritiesController.getVideos);

/**
 * @api {get} /celebrities/:id Get celebrity's details
 * @apiVersion 0.1.0
 * @apiGroup Celebrities
 * @apiPermission none
 * 
 * @apiSuccess {String} status The request status (success|failed)
 * @apiSuccess {Object} data The celebrity details
 * 
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
 *        "categories": [3]
 *        "created_at": "2020-02-22T16:36:36.000Z"
 *        }
 *    }
 */
router.get('/:celebrityId', celebritiesController.get);

/**
 * @api {patch} /celebrities/:id Update the celebrity's details
 * @apiVersion 0.1.0
 * @apiGroup Celebrities
 * @apiPermission Celebrity
 * 
 * @apiParam {String} [name] Celebrity's name
 * @apiParam {String} [password] Celebrity's password
 * @apiParam {Number} [video_price] Video price
 * @apiParam {Number} [urgent_price] Urgent video price
 * @apiParam {Number} [event_price] Event price
 * @apiParam {String} [short_desc] Short description
 * @apiParam {String} [desc] Full description
 * @apiParam {File} [video] Celebrity's introduction video
 * 
 * @apiSuccess {String} status The request status (success|failed)
 * @apiSuccess {Object} data The updated celebrity details
 * 
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
router.patch('/:celebrityId',
  authMiddleware('Celebrity'),
  fileUploadHelper.getSingleUploader(...videoUploaderConfis),
  celebritiesController.update);

// TODO: implement delete celebrity
router.delete('/:celebrityId',
  authMiddleware('Celebrity'),
  (req, res, next) => {
    res.status(401).json({
      message: 'Celebrities can\'t be deleted!'
    });
  });

/**
 * @api {post} /celebrities/login Login the celebrity's account
 * @apiVersion 0.1.0
 * @apiGroup Celebrities
 * @apiPermission none
 * 
 * @apiParam {String} email Celebrity's email address
 * @apiParam {String} password Celebrity's password
 * 
 * @apiSuccess {String} status The request status (success|failed)
 * @apiSuccess {Object} data The celebrity's details
 * 
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {
 *      "status": "success",
 *      "data": {
 *        "id": 1,
 *        "name": "John Doe",
 *        "email": "john.doe@test.com",
 *        "role": "Celebrity",
 *        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6IlRhbWVyIEluYXd5IiwiZW1haWwiOiJ0YW1lci0xQHRlc3QuY29tIiwicm9sZSI6IkNlbGVicml0eSIsImlhdCI6MTU4MjgzNjU2MiwiZXhwIjoxNTgzNDQxMzYyfQ.f-p3a5F30K12dG_FW5Hkm7kAWjTK6WjoJJ25t6glboM"
 *    }
 *        }
 *    }
  * @apiErrorExample {json} List error
 *    HTTP/1.1 401 Unauthorized
 *    {
 *      "status": "failed",
 *      "error": {
 *        "message": "Invalid email or password!"
 *      }
 *    }
 */
router.post('/login', celebritiesController.login);

module.exports = router;