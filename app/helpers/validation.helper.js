'user strict';

const bcrypt = require('bcrypt');

const validationHelper = {
  validate(schema, data) {
    const result = {isValid: true};

    for(field of schema) {
      if (field.required && !data.hasOwnProperty(field.name)) {
        result.isValid = false;
        result.field = field.name;
        result.rule = 'required';
        return result;
      }
      if(field.match && !field.match.test(data[field.name])) {
        result.isValid = false;
        result.field = field.name;
        result.rule = 'match';
        return result;
      }
    }

    return result;
  },

  comparePassword: (pass, hashedPass) => bcrypt.compareSync(pass, hashedPass)

}

module.exports = validationHelper;