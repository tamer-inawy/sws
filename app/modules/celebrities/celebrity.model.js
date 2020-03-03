const { ormHelper } = require('../../helpers');

// Set database schema
const schema = {
  table: 'celebrities',
  fields: [
    {
      name: 'id'
    },
    {
      name: 'name',
      required: true
    },
    {
      name: 'email',
      required: true,
      match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    {
      name: 'password',
      required: true
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
  return ormHelper.findJoin([schema.table, 'id'], ['celebrities_categories', 'celebrities_id', 'categories_id'])
    .then(results => {
      const resultsObj = {};
      for (const celebrity of results) {
        if (resultsObj[celebrity.id]) {
          resultsObj[celebrity.id].categories.push(celebrity.categories_id);
        } else {
          resultsObj[celebrity.id] = celebrity;
          resultsObj[celebrity.id].categories = celebrity.categories_id ? [celebrity.categories_id] : [];
          delete resultsObj[celebrity.id].categories_id;
        }
      }
      return Object.keys(resultsObj).map(key => resultsObj[key]);
    });
};

Celebrity.get = (celebrityId) => {
  return ormHelper.findJoin([schema.table, 'id'], ['celebrities_categories', 'celebrities_id', 'categories_id'], `${schema.table}.id=${celebrityId}`)
    .then(results => {
      const resultsObj = {};
      for (const celebrity of results) {
        if (resultsObj[celebrity.id] && celebrity.categories_id) {
          resultsObj[celebrity.id].categories.push(celebrity.categories_id);
        } else {
          resultsObj[celebrity.id] = celebrity;
          resultsObj[celebrity.id].categories = celebrity.categories_id ? [celebrity.categories_id] : [];
          delete resultsObj[celebrity.id].categories_id;
        }
      }
      return Object.keys(resultsObj).map(key => resultsObj[key]);
    });
};

Celebrity.update = (celebrityId, data) => {
  return ormHelper.updateOne(schema.table, celebrityId, data);
}

Celebrity.findByEmail = (email) => {
  return ormHelper.findOne(schema.table, { email: email });
};

Celebrity.getVideos = (celebrityId) => {
  return ormHelper.findMulti('videos', { celebrities_id: celebrityId });
};

module.exports = Celebrity;
