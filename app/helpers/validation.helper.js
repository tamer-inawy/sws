/**
 * @file        validation.helper.js
 * @description A helper library for data validation
 * @author      Tamer Inawy <tamer.inawy@gmail.com>
 * 
 */
const validationHelper = {
  validate(schema, data) {
    const results = {isValid: true};

    for(field of schema) {
      if (field.required && !data.hasOwnProperty(field.name)) {
        results.isValid = false;
        results.field = field.name;
        results.rule = 'required';
        return results;
      }
      if(field.match && !field.match.test(data[field.name])) {
        results.isValid = false;
        results.field = field.name;
        results.rule = 'match';
        return results;
      }
    }

    return results;
  },

}

module.exports = validationHelper;