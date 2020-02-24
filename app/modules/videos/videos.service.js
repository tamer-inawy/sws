
// Import utilities
const config = require(`../../config/${process.env.NODE_ENV}.config`);
const { dataFormatHelper, validationHelper, fileUploadHelper } = require('../../helpers');
// Import model
const Video = require('./video.model');

const videosService = {
  create: data => Video.create(new Video(data)),

  validate: data => validationHelper.validate(Video.getSchema(), new Video(data)),

  getAll: () => Video.getAll(),

  get: id => Video.get(id),

  update(videoId, data, filePath) {
    return Video.update(videoId, new Video(data))
      .then(results => {
        if (filePath)
          fileUploadHelper.moveFile(filePath, `${config.celebrities.mediaPath}/${results.celebrities_id}/videos/`);
        return this.get(results.id)
      })
      .catch(err => {
        if (filePath)
          fileUploadHelper.deleteFile(filePath);
        throw err;
      });
  },

  clearMedia(filePath) {
    fileUploadHelper.deleteFile(filePath);
  },

  getVideosByCelebrity(celebrityId) {
    return Video.getVideosByCelebrity(celebrityId);
  }

};

module.exports = videosService;
