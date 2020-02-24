'user strict';

const { ormHelper } = require('../../helpers');

// Set database schema
const schema = {
  table: 'videos',
  fields: [
    {
      name: 'id'
    },
    {
      name: 'name',
      required: true
    },
    {
      name: 'other_name',
      required: true,
    },
    {
      name: 'instructions',
      required: true
    },
    {
      name: 'video'
    },
    {
      name: 'celebrities_id',
      required: true
    },
    {
      name: 'status',
    },
    {
      name: 'created_at'
    },
  ]

}

// Video object constructor
const Video = function (video) {
  for (const field of schema.fields) {
    if (video[field.name])
      this[field.name] = video[field.name];
  }
};

// Video Methods
Video.getSchema = () => [...schema.fields];

Video.create = (newVideo) => {
  return ormHelper.create(schema.table, newVideo);
};

Video.getAll = () => {
  return ormHelper.getAll(schema.table);
};

Video.get = (videoId) => {
  return ormHelper.getOne(schema.table, videoId);
};

Video.update = (videoId, data) => {
  return ormHelper.updateOne(schema.table, videoId, data);
}

Video.getByCelebrity = (celebrityId) => {
  return ormHelper.findMulti('videos', {celebrities_id: celebrityId});
};

Video.getByUser = (userId) => {
  return ormHelper.findMulti('videos', {users_id: userId});
};

module.exports = Video;
