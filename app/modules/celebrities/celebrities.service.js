const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
// Import utilities
const config = require(`../../config/${process.env.ENV}.config`);
const { dataFormatHelper, validationHelper, fileUploadHelper } = require('../../helpers');
// Import model
const Celebrity = require('./celebrity.model');

const celebritiesService = {
  createCelebrity(data, filePath) {
    data.password = dataFormatHelper.passwordHash(data.password, config.saltRound);
    const newCelebrity = new Celebrity(data);

    return Celebrity.createCelebrity(newCelebrity)
      .then(results => {
        if (filePath)
          fileUploadHelper.moveFile(filePath, `${config.celebrities.mediaPath}/${results.id}/`);
        const { password, ...resultsWitoutPassword } = results;
        return resultsWitoutPassword;
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

  getCelebrity: id => Celebrity.getCelebrity(id)
    .then(results => {
      if (!results)
        return false;
      const { password, ...resultsWitoutPassword } = results;
      return resultsWitoutPassword;
    }),

  findCelebrityByEmail: email => Celebrity.findCelebrityByEmail(email)
    .then(results => {
      const { password, ...resultsWitoutPassword } = results;
      return resultsWitoutPassword;
    }),

  updateCelebrity(celebrityId, data, filePath) {
    if (data.password)
      data.password = dataFormatHelper.passwordHash(data.password, config.saltRound);

    const updatedCelebrity = new Celebrity(data);

    // Prevent email update
    delete updatedCelebrity.email;

    return Celebrity.updateCelebrity(celebrityId, updatedCelebrity)
      .then(results => {
        if (filePath)
          fileUploadHelper.moveFile(filePath, `${config.celebrities.mediaPath}/${celebrityId}/`);
        return this.getCelebrity(results.id)
      })
      .catch(err => {
        if (filePath)
          fileUploadHelper.deleteFile(filePath);
        throw err;
      });
  },

  authenticate(email, password) {
    return Celebrity.findCelebrityByEmail(email).then(results => {
      // validate email
      if (!results)
        return false;
      // Validate password
      if (!bcrypt.compareSync(password, results.password))
        return false;

      const data = {
        id: results.id,
        name: results.name,
        email: results.email,
        role: 'Celebrity',
      };
      // create token
      data.token = jwt.sign(data, config.jwt.secrit, { expiresIn: config.jwt.expiration });

      return data;

    })
  },

  clearMedia(filePath) {
    fileUploadHelper.deleteFile(filePath);
  },

};

module.exports = celebritiesService;
