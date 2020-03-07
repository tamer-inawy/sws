
// Import utilities
const { validationHelper } = require('../../helpers');
// Import model
const Ad = require('./ad.model');

const adsService = {
  create: data => Ad.create(new Ad(data)),

  validate: data => validationHelper.validate(Ad.getSchema(), new Ad(data)),

  getAll: () => Ad.getAll(),

  get: id => Ad.get(id),

  update(adId, data, filePath) {
    return Ad.update(adId, new Ad(data))
      .then(results => {
        return results ? this.get(results.id) : false;
      })
      .catch(err => {
        throw err;
      });
  },

  getAdsByCelebrity(celebrityId) {
    return Ad.getAdsByCelebrity(celebrityId);
  }

};

module.exports = adsService;
