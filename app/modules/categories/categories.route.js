/**
 * @file        categories.route.js
 * @description A route file for categories
 * @author      Tamer Inawy <tamer.inawy@gmail.com>
 * 
 */
const express = require('express');
// Import utilities
const { authMiddleware } = require('../../middlewares');
// Import controller
const categoriesController = require('./categories.controller');

const router = express.Router();

/**
 * @api {get} /categories List all categories
 * @apiVersion 0.1.0
 * @apiGroup Categories
 * @apiPermission none
 * 
 * @apiSuccess {String} status The request status (success|failed)
 * @apiSuccess {Object[]} data Category's list (Array of objects)
 * 
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {
 *      "status": "success",
 *      "data": [
 *        {
 *          "id": 1,
 *          "category": 'actor'
 *        },
 *        {
 *          "id": 2,
 *          "category": 'singer'
 *        }
 *      ]
 *    }
 */
router.get('/', categoriesController.getAll);

/**
 * @api {post} /categories Create new category
 * @apiVersion 0.1.0
 * @apiGroup Categories
 * @apiPermission Celebrity
 * 
 * @apiParam {String} category Category's name
 * 
 * @apiSuccess {String} status The request status (success|failed)
 * @apiSuccess {Object} data The created category details
 * 
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {
 *      "status": "success",
 *      "data": {
 *        "id": 1,
 *        "category": 'actor'
 *        }
 *    }
 */
router.post('/',
  authMiddleware('Celebrity'),
  categoriesController.create);

/**
 * @api {get} /categories/:id Get category's details
 * @apiVersion 0.1.0
 * @apiGroup Categories
 * @apiPermission none
 * 
 * @apiSuccess {String} status The request status (success|failed)
 * @apiSuccess {Object} data The category details
 * 
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {
 *      "status": "success",
 *      "data": {
 *        "id": 1,
 *        "category": 'actor'
 *        }
 *    }
 */
router.get('/:categoryId',
  categoriesController.get);

  /**
 * @api {patch} /categories/:id Update the category's details
 * @apiVersion 0.1.0
 * @apiGroup Categories
 * @apiPermission Admin
 * 
 * @apiSuccess {String} status The request status (success|failed)
 * @apiSuccess {Object} data The updated category details
 * 
 * @apiSuccessExample {json} Success
 *    HTTP/1.1 200 OK
 *    {
 *      "status": "success",
 *      "data": {
 *        "id": 1,
 *        "category": 'actor'
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
router.patch('/:categoryId',
  authMiddleware(['Admin']),
  categoriesController.update);

// TODO: implement delete category
router.delete('/:categoryId',
  authMiddleware('Admin'),
  (req, res, next) => {
    res.status(401).json({
      message: 'Categories can\'t be deleted!'
    });
  });

module.exports = router;