const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
// Import utilities
const config = require(`../../config/${process.env.NODE_ENV}.config`);
const { dataFormatHelper, validationHelper } = require('../../helpers');
// Import model
const Admin = require('./admin.model');

const adminsService = {
  create(data) {
    data.password = dataFormatHelper.passwordHash(data.password, config.saltRound);
    const newAdmin = new Admin(data);

    return Admin.create(newAdmin)
      .then(results => {
        const { password, ...resultsWitoutPassword } = results;
        return resultsWitoutPassword;
      })
      .catch(err => {
        throw err;
      });
  },

  validate(data) {
    const newAdmin = new Admin(data);
    return validationHelper.validate(Admin.getSchema(), newAdmin);
  },

  getAll: () => Admin.getAll()
    .then(results => results.map(el => {
      const { password, ...restOfEl } = el;
      return restOfEl;
    })),

  get: id => Admin.get(id)
    .then(results => {
      if (!results)
        return false;
      const { password, ...resultsWitoutPassword } = results;
      return resultsWitoutPassword;
    }),

  findByEmail: email => Admin.findByEmail(email)
    .then(results => {
      const { password, ...resultsWitoutPassword } = results;
      return resultsWitoutPassword;
    }),

  update(adminId, data) {
    if (data.password)
      data.password = dataFormatHelper.passwordHash(data.password, config.saltRound);

    const updatedAdmin = new Admin(data);

    // Prevent email update
    delete updatedAdmin.email;

    return Admin.update(adminId, updatedAdmin)
      .then(results => {
        return this.get(results.id)
      })
      .catch(err => {
        throw err;
      });
  },

  authenticate(email, password) {
    return Admin.findByEmail(email).then(results => {
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
        role: 'Admin',
      };
      // create token
      data.token = jwt.sign(data, config.jwt.secrit, { expiresIn: config.jwt.expiration });

      return data;

    })
  },

};

module.exports = adminsService;
