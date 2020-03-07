
// Import utilities
const { validationHelper } = require('../../helpers');
// Import model
const Location = require('./location.model');

const locationsService = {
  create: data => Location.create(new Location(data)),

  validate: data => validationHelper.validate(Location.getSchema(), new Location(data)),

  getAll: () => Location.getAll(),

  get: id => Location.get(id),

  update(locationId, data, filePath) {
    return Location.update(locationId, new Location(data))
      .then(results => {
        return results ? this.get(results.id) : false;
      })
      .catch(err => {
        throw err;
      });
  },

};

module.exports = locationsService;
