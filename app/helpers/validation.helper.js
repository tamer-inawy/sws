'user strict';

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