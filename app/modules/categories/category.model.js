/**
 * @file        category.model.js
 * @description A model file for categories
 * @author      Tamer Inawy <tamer.inawy@gmail.com>
 * 
 */
const { ormHelper } = require('../../helpers');

// Set database schema
const schema = {
  table: 'categories',
  fields: [
    {
      name: 'id'
    },
    {
      name: 'category',
      required: true
    },
  ]

}

// Category object constructor
const Category = function (category) {
  for (const field of schema.fields) {
    if (category[field.name])
      this[field.name] = category[field.name];
  }
};

// Category Methods
Category.getSchema = () => [...schema.fields];

Category.create = (newCategory) => {
  return ormHelper.create(schema.table, newCategory);
};

Category.getAll = () => {
  return ormHelper.getAll(schema.table);
};

Category.get = (categoryId) => {
  return ormHelper.getOne(schema.table, categoryId);
};

Category.update = (categoryId, data) => {
  return ormHelper.updateOne(schema.table, categoryId, data);
}

Category.getByCelebrity = (celebrityId) => {
  return ormHelper.findMulti(schema.table, {celebrities_id: celebrityId});
};

module.exports = Category;
