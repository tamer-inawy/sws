const config = require(`../config/${process.env.ENV}.config`);
const Celebrity = require('../models/celebrity.model');
const dataFormatHelper = require('../helpers/dataFormat.helper');
const validationHelper = require('../helpers/validation.helper');
const fileUploadHelper = require('../helpers/fileUpload.helper');

const celebritiesService = {
  createCelebrity(data, filePath) {
    data.password = dataFormatHelper.passwordHash(data.password, config.saltRound);
    const newCelebrity = new Celebrity(data);

    return Celebrity.createCelebrity(newCelebrity)
      .then(result => {
        if (filePath)
          fileUploadHelper.moveFile(filePath, `${config.celebrities.mediaPath}/${result.id}/`);
        return result;
      })
      .catch(err => {
        if (filePath)
          fileUploadHelper.deleteFile(filePath);
        throw err;
      });
  },

  validateCelebrity(data) {
    const newCelebrity = new Celebrity(data);
    return validationHelper.validate(Celebrity.getSchema(), newCelebrity);
  },

  getAllCelebrities: () => Celebrity.getAllCelebrities(),

  getCelebrity: id => Celebrity.getCelebrity(id),

  findCelebrityByEmail: email => Celebrity.findCelebrityByEmail(email),

  updateCelebrity(celebrityId, data, filePath) {
    if (data.password)
      data.password = dataFormatHelper.passwordHash(data.password, config.saltRound);

    const updatedCelebrity = new Celebrity(data);

    // Prevent email update
    delete updatedCelebrity.email;

    return Celebrity.updateCelebrity(celebrityId, updatedCelebrity)
      .then(result => {
        if (filePath)
          fileUploadHelper.moveFile(filePath, `${config.celebrities.mediaPath}/${celebrityId}/`);
        return Celebrity.getCelebrity(result.id)
      })
      .catch(err => {
        if (filePath)
          fileUploadHelper.deleteFile(filePath);
        throw err;
      });
  },

  validateCelebrityCredintials: function(email, password) { return this.findCelebrityByEmail(email).then(result => {
    // validate email
    if (!result)
      return false;
    // Validate password
    if (!validationHelper.comparePassword(password, result.password))
      return false;

    return result;

  })},

  clearMedia(filePath) {
    fileUploadHelper.deleteFile(filePath);
  },

};

module.exports = celebritiesService;
