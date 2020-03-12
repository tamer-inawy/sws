const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
// Import utilities
const config = require(`../../config/${process.env.NODE_ENV}.config`);
const { dataFormatHelper, validationHelper, fileUploadHelper } = require('../../helpers');
// Import model
const Celebrity = require('./celebrity.model');

const celebritiesService = {
  create(data, filePath) {
    data.password = dataFormatHelper.passwordHash(data.password, config.saltRound);
    const newCelebrity = new Celebrity(data);

    return Celebrity.create(newCelebrity)
      .then(results => {
        if (filePath && filePath.image)
          fileUploadHelper.moveFile(filePath.image, `${config.celebrities.mediaPath}/${results.id}/`);
        if (filePath && filePath.video)
          fileUploadHelper.moveFile(filePath.video, `${config.celebrities.mediaPath}/${results.id}/`);
        const { password, ...resultsWitoutPassword } = results;
        return resultsWitoutPassword;
      })
      .catch(err => {
        if (filePath)
          fileUploadHelper.deleteFile(filePath);
        throw err;
      });
  },

  validate(data) {
    const newCelebrity = new Celebrity(data);
    return validationHelper.validate(Celebrity.getSchema(), newCelebrity);
  },

  getAll: () => Celebrity.getAll()
    .then(results => results.map(el => {
      const { password, ...restOfEl } = el;
      return restOfEl;
    })),

  get: id => Celebrity.get(id)
    .then(results => {
      if (!results)
        return false;
      const { password, ...resultsWitoutPassword } = results[0];
      return resultsWitoutPassword;
    }),

  findByEmail: email => Celebrity.findByEmail(email)
    .then(results => {
      const { password, ...resultsWitoutPassword } = results;
      return resultsWitoutPassword;
    }),

  update(celebrityId, data, filePath) {
    if (data.password)
      data.password = dataFormatHelper.passwordHash(data.password, config.saltRound);

    const updatedCelebrity = new Celebrity(data);

    // Prevent email update
    delete updatedCelebrity.email;

    return Celebrity.update(celebrityId, updatedCelebrity)
      .then(results => {
        if (filePath)
          fileUploadHelper.moveFile(filePath, `${config.celebrities.mediaPath}/${celebrityId}/`);
        return this.get(results.id)
      })
      .catch(err => {
        if (filePath)
          fileUploadHelper.deleteFile(filePath);
        throw err;
      });
  },

  authenticate(email, password) {
    return Celebrity.findByEmail(email).then(results => {
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

  getVideos(celebrityId) {
    return Celebrity.getVideos(celebrityId);
  }

};

module.exports = celebritiesService;
