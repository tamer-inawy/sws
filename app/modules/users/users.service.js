const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
// Import utilities
const config = require(`../../config/${process.env.NODE_ENV}.config`);
const { dataFormatHelper, validationHelper, fileUploadHelper } = require('../../helpers');
// Import model
const User = require('./user.model');

const usersService = {
  create(data, filePath) {
    data.password = dataFormatHelper.passwordHash(data.password, config.saltRound);
    const newUser = new User(data);

    return User.create(newUser)
      .then(results => {
        if (filePath && filePath.image)
          fileUploadHelper.moveFile(filePath.image, `${config.users.mediaPath}/${results.id}/`);
        const { password, ...resultsWitoutPassword } = results;
        return resultsWitoutPassword;
      })
      .catch(err => {
        if (filePath && filePath.image)
          fileUploadHelper.deleteFile(filePath.image);
        throw err;
      });
  },

  validate(data) {
    const newUser = new User(data);
    return validationHelper.validate(User.getSchema(), newUser);
  },

  getAll: () => User.getAll()
    .then(results => results.map(el => {
      const { password, ...restOfEl } = el;
      return restOfEl;
    })),

  get: id => User.get(id)
    .then(results => {
      if (!results)
        return false;
      const { password, ...resultsWitoutPassword } = results;
      return resultsWitoutPassword;
    }),

  findByEmail: email => User.findByEmail(email)
    .then(results => {
      const { password, ...resultsWitoutPassword } = results;
      return resultsWitoutPassword;
    }),

  update(userId, data, filePath) {
    if (data.password)
      data.password = dataFormatHelper.passwordHash(data.password, config.saltRound);

    const updatedUser = new User(data);

    // Prevent email update
    delete updatedUser.email;

    return User.update(userId, updatedUser)
      .then(results => {
        if (filePath)
          fileUploadHelper.moveFile(filePath, `${config.users.mediaPath}/${userId}/`);
        return this.get(results.id)
      })
      .catch(err => {
        if (filePath)
          fileUploadHelper.deleteFile(filePath);
        throw err;
      });
  },

  authenticate(email, password) {
    return User.findByEmail(email).then(results => {
      console.log(results)
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
        image: results.image,
        role: results.celebrity_id ? 'Celebrity' : 'User',
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

module.exports = usersService;
