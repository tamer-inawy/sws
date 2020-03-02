const express = require('express');
// Import utilities
const { authMiddleware } = require('../../middlewares');
// Import controller
const adminsController = require('./admins.controller');

const router = express.Router();

/**
 * @api {get} /admins List all admins
 * @apiVersion 0.1.0
 * @apiGroup Admins
 * @apiPermission none
 * 
 * @apiSuccess {String} status The request status (success|failed)
 * @apiSuccess {Object[]} data Admin's list (Array of objects)
 * 
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {
 *      "status": "success",
 *      "data": [
 *        {
 *          "id": 1,
 *          "name": "John Doe",
 *          "email": "john.doe@test.com"
 *        },
 *        {
 *          "id": 2,
 *          "name": "Jane Doe",
 *          "email": "jane.doe@test.com",
 *        }
 *      ]
 *    }
 */
router.get('/',
  adminsController.getAll);

/**
 * @api {post} /admins Create new admin
 * @apiVersion 0.1.0
 * @apiGroup Admins
 * @apiPermission Admin
 * 
 * @apiParam {String} name Admin's name
 * @apiParam {String} email Admin's email
 * @apiParam {String} password Admin's password
 * 
 * @apiSuccess {String} status The request status (success|failed)
 * @apiSuccess {Object} data The created admin details
 * 
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {
 *      "status": "success",
 *      "data": {
 *        "id": 1,
 *        "name": "John Doe",
 *        "email": "john.doe@test.com"
 *        }
 *    }
 */
router.post('/',
  authMiddleware('Admin'),
  adminsController.create);

/**
 * @api {get} /admins/:id Get admin's details
 * @apiVersion 0.1.0
 * @apiGroup Admins
 * @apiPermission none
 * 
 * @apiSuccess {String} status The request status (success|failed)
 * @apiSuccess {Object} data The admin details
 * 
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {
 *      "status": "success",
 *      "data": {
 *        "id": 1,
 *        "name": "John Doe",
 *        "email": "john.doe@test.com"
 *        }
 *    }
 */
router.get('/:adminId',
  adminsController.get);

/**
 * @api {patch} /admins/:id Update the admin's details
 * @apiVersion 0.1.0
 * @apiGroup Admins
 * @apiPermission Admin
 * 
 * @apiParam {String} [name] Admin's name
 * @apiParam {String} [password] Admin's password
 * 
 * @apiSuccess {String} status The request status (success|failed)
 * @apiSuccess {Object} data The updated admin details
 * 
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {
 *      "status": "success",
 *      "data": {
 *        "id": 1,
 *        "name": "John Doe",
 *        "email": "john.doe@test.com"
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

/**
 * @api {post} /admins/login Login the admins's account
 * @apiVersion 0.1.0
 * @apiGroup Admins
 * @apiPermission none
 * 
 * @apiParam {String} email Admin's email address
 * @apiParam {String} password Admin's password
 * 
 * @apiSuccess {String} status The request status (success|failed)
 * @apiSuccess {Object} data The admins's details
 * 
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {
 *      "status": "success",
 *      "data": {
 *        "id": 1,
 *        "name": "John Doe",
 *        "email": "john.doe@test.com",
 *        "role": "Admin",
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
router.post('/login', adminsController.login);

module.exports = router;