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

/**
 * @api {get} /users List all users
 * @apiVersion 0.1.0
 * @apiGroup Users
 * @apiPermission none
 * 
 * @apiSuccess {String} status The request status (success|failed)
 * @apiSuccess {Object[]} data User's list (Array of objects)
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
 *          "phone": "01111111111",
 *          "image": "avatar.png"
 *        },
 *        {
 *          "id": 2,
 *          "name": "Jane Doe",
 *          "email": "jane.doe@test.com",
 *          "phone": "02222222222",
 *          "image": "avatar.jpg"
 *        }
 *      ]
 *    }
 */
router.get('/',
  usersController.getAll);

/**
 * @api {post} /users Create new user
 * @apiVersion 0.1.0
 * @apiGroup Users
 * @apiPermission none
 * 
 * @apiParam {String} name User's name
 * @apiParam {String} email User's email address
 * @apiParam {String} password User's password
 * @apiParam {String} phone User's phone number
 * @apiParam {File} image User's image avatar
 * 
 * @apiSuccess {String} status The request status (success|failed)
 * @apiSuccess {Object} data The created user details
 * 
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {
 *      "status": "success",
 *      "data": {
 *        "id": 1,
 *        "name": "John Doe",
 *        "email": "john.doe@test.com",
 *        "phone": "01111111111",
 *        "image": "avatar.png"
 *        }
 *    }
 */
router.post('/',
  fileUploadHelper.getMultiFieldsUploader(
    [{ name: 'image' }],
    config.celebrities.uploadsPath,
    { image: config.image.allowedTypes },
    { image: config.image.maxFileSize },
  ),
  usersController.create);

/**
 * @api {get} /users/:id Get user's details
 * @apiVersion 0.1.0
 * @apiGroup Users
 * @apiPermission none
 * 
 * @apiSuccess {String} status The request status (success|failed)
 * @apiSuccess {Object} data The user details
 * 
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {
 *      "status": "success",
 *      "data": {
 *        "id": 1,
 *        "name": "John Doe",
 *        "email": "john.doe@test.com",
 *        "phone": "01111111111",
 *        "image": "avatar.png"
 *        }
 *    }
 */
router.get('/:userId',
  usersController.get);

/**
 * @api {patch} /users/:id Update the user's details
 * @apiVersion 0.1.0
 * @apiGroup Users
 * @apiPermission User
 * 
 * @apiParam {String} [name] User's name
 * @apiParam {String} [password] User's password
 * @apiParam {String} [phone] User's phone number
 * @apiParam {File} [image] User's image avatar
 * 
 * @apiSuccess {String} status The request status (success|failed)
 * @apiSuccess {Object} data The updated user details
 * 
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {
 *      "status": "success",
 *      "data": {
 *        "id": 1,
 *        "name": "John Doe",
 *        "email": "john.doe@test.com",
 *        "phone": "01111111111",
 *        "image": "avatar.png"
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
router.patch('/:userId',
  authMiddleware('User'),
  fileUploadHelper.getMultiFieldsUploader(
    [{ name: 'image' }],
    config.celebrities.uploadsPath,
    { image: config.image.allowedTypes },
    { image: config.image.maxFileSize },
  ),
  usersController.update);

// TODO: implement delete user
router.delete('/:userId',
  authMiddleware('User'),
  (req, res, next) => {
    res.status(401).json({
      message: 'Users can\'t be deleted!'
    });
  });

/**
 * @api {post} /users/login Login the users's account
 * @apiVersion 0.1.0
 * @apiGroup Users
 * @apiPermission none
 * 
 * @apiParam {String} email User's email address
 * @apiParam {String} password User's password
 * 
 * @apiSuccess {String} status The request status (success|failed)
 * @apiSuccess {Object} data The users's details
 * 
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {
 *      "status": "success",
 *      "data": {
 *        "id": 1,
 *        "name": "John Doe",
 *        "email": "john.doe@test.com",
 *        "role": "User",
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
router.post('/login', usersController.login);

module.exports = router;