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
 * @apiGroup Celebrities
 * @apiSuccess {Object[]} celebrities Celebrity's list
 * @apiSuccess {Number} id Celebrity id
 * @apiSuccess {String} name Celebrity name
 * @apiSuccess {String} email Celebrity is email?
 * @apiSuccess {Number} video_price The video price
 * @apiSuccess {Number} urgent_price The urgent price
 * @apiSuccess {Number} event_price The event price
 * @apiSuccess {Date} created_at Register's date
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
 *          "created_at": "2020-02-22T16:36:36.000Z"
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
 *        }
 *      ]
 *    }
 * @apiErrorExample {json} List error
 *    HTTP/1.1 500 Internal Server Error
 */
router.get('/', celebritiesController.getAll);

router.post('/',
  authMiddleware('Celebrity'),
  fileUploadHelper.getSingleUploader(...videoUploaderConfis),
  celebritiesController.create);

router.get('/videos/:celebrityId', celebritiesController.getVideos);

router.get('/:celebrityId', celebritiesController.get);

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

router.post('/login', celebritiesController.login);

module.exports = router;