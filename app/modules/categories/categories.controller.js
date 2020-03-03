/**
 * @file        categories.controller.js
 * @description A controller file for categories
 * @author      Tamer Inawy <tamer.inawy@gmail.com>
 * 
 */
const categoriesService = require('./categories.service');

const categoriesController = {

  create: (req, res, next) => {

    // handle validation 
    const validate = categoriesService.validate(req.body);
    if (!validate.isValid) {
      const err = new Error('Please provide a valid data!');
      err.field = validate.field;
      err.rule = validate.rule;
      next(err);
    }

    categoriesService.create(req.body)
      .then((category) => {
        res.locals.data = category;
        next();
      })
      .catch(err => {
        if (err.errno === 1062) {
          err.message = 'The email is already in use!';
          err.status = 409;
        } else {
          err.message = err.message || 'Can\'t retrieve the data!';
        }

        next(err);
      });
  },

  getAll: (req, res, next) => {
    return categoriesService.getAll()
      .then((categories) => {
        res.locals.data = categories;
        next();
      })
      .catch((err) => {
        err.message = err.message || 'Can\'t retrieve the data!';
        next(err);
      });
  },

  get: (req, res, next) => {
    const categoryId = +req.params.categoryId;

    // handle validation
    if (!categoryId) {
      const err = new Error('Please provide a valid data!');
      next(err);
    }

    return categoriesService.get(categoryId)
      .then((category) => {
        if (!category) {
          const err = new Error('Can\'t retrieve the data!');
          throw err;
        }

        res.locals.data = category;
        next();
      })
      .catch(err => {
        err.message = err.message || 'Can\'t retrieve the data!';
        next(err);
      });

  },

  update(req, res, next) {
    const categoryId = +req.params.categoryId;

    // TODO: handle validation 
    let valid = true;
    if (!valid) {
      const err = new Error('Please provide a valid data!');
      throw err;
    }

    categoriesService.update(categoryId, req.body)
      .then((category) => {
        if(!category) {
          err = new Error('Wrong category!');
          next(err);
        }
        res.locals.data = category;
        next();
      })
      .catch(err => {
        console.log(err);
        err.message = err.message || 'Can\'t retrieve the data!';
        next(err);
      });
  },

};

module.exports = categoriesController;
