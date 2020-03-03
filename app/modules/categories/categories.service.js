/**
 * @file        categories.service.js
 * @description A service file for categories
 * @author      Tamer Inawy <tamer.inawy@gmail.com>
 * 
 */

// Import utilities
const { validationHelper } = require('../../helpers');
// Import model
const Category = require('./category.model');

const categoriesService = {
  create: data => Category.create(new Category(data)),

  validate: data => validationHelper.validate(Category.getSchema(), new Category(data)),

  getAll: () => Category.getAll(),

  get: id => Category.get(id),

  update(categoryId, data) {
    return Category.update(categoryId, new Category(data))
      .then(results => {
        return results ? this.get(results.id) : false;
      })
      .catch(err => {
        throw err;
      });
  },

  getCategoriesByCelebrity(celebrityId) {
    return Category.getCategoriesByCelebrity(celebrityId);
  }

};

module.exports = categoriesService;
