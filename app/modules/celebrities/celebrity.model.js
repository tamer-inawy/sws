const { ormHelper } = require('../../helpers');

// Set database schema
const schema = {
  table: 'celebrities',
  fields: [
    {
      name: 'id',
    },
    {
      name: 'video_price',
      required: true
    },
    {
      name: 'urgent_price'
    },
    {
      name: 'event_price'
    },
    {
      name: 'short_desc',
      required: true
    },
    {
      name: 'desc',
      required: true
    },
    {
      name: 'video',
      required: true
    },
    {
      name: 'admins_id',
      required: true
    },
    {
      name: 'created_at'
    },
    {
      name: 'categories'
    }

  ]

}

// Celebrity object constructor
const Celebrity = function (celebrity) {
  for (const field of schema.fields) {
    if (celebrity[field.name])
      this[field.name] = celebrity[field.name];
  }
};

// Celebrity Methods
Celebrity.getSchema = () => [...schema.fields];

Celebrity.create = (newCelebrity) => {
  const { categories, ...celebrity } = newCelebrity;
  return ormHelper.create(schema.table, celebrity)
    .then(results => {
      if (categories && categories.length)
        for (let category of categories)
          ormHelper.create('celebrities_categories', { celebrities_id: results.id, categories_id: category });
      return results;
    });
};

Celebrity.getAll = () => {
  return ormHelper.findCelebrities(
    [schema.table, 'id'],
    ['celebrities_categories', 'celebrities_id', [], 'categories_id'],
    ['categories', 'id', ['category']]
  )
    .then(results => {
      const resultsObj = {};
      for (const celebrity of results) {
        if (!resultsObj[celebrity.id]) {
          resultsObj[celebrity.id] = celebrity;
          resultsObj[celebrity.id].categories = celebrity.category ? [celebrity.category] : [];
          delete resultsObj[celebrity.id].category;
        } else {
          resultsObj[celebrity.id].categories.push(celebrity.category);
        }
      }

      // Convert the results' object to an array and return it
      return Object.keys(resultsObj).map(key => resultsObj[key]);
    });
};

Celebrity.get = (celebrityId) => {
  return ormHelper.findCelebrities(
    [schema.table, 'id'],
    ['celebrities_categories', 'celebrities_id', [], 'categories_id'],
    ['categories', 'id', ['category']],
    `${schema.table}.id=${celebrityId}`
  )
    .then(results => {
      const resultsObj = {};
      for (const celebrity of results) {
        if (!resultsObj[celebrity.id]) {
          resultsObj[celebrity.id] = celebrity;
          resultsObj[celebrity.id].categories = celebrity.category ? [celebrity.category] : [];
          delete resultsObj[celebrity.id].category;
        } else {
          resultsObj[celebrity.id].categories.push(celebrity.category);
        }
      }
      return Object.keys(resultsObj).map(key => resultsObj[key]);
    });
};

Celebrity.update = (celebrityId, data) => {
  const { categories, ...celebrity } = data;
  return ormHelper.updateOne(schema.table, celebrityId, celebrity)
    .then(results => {
      if (categories && categories.length)
        for (let category of categories)
          ormHelper.create('celebrities_categories', { celebrities_id: celebrityId, categories_id: category });
      return results;
    });
}

Celebrity.findByEmail = (email) => {
  return ormHelper.findOneCelebrity('users', schema.table, { email: email });
};

Celebrity.getVideos = (celebrityId) => {
  return ormHelper.findMulti('videos', { celebrities_id: celebrityId });
};

module.exports = Celebrity;
