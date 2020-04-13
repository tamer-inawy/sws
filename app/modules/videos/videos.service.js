
// Import utilities
const config = require(`../../config/${process.env.NODE_ENV}.config`);
const { dataFormatHelper, validationHelper, fileUploadHelper } = require('../../helpers');
// Import model
const Video = require('./video.model');
const Order = require('../orders/order.model');
const orderService = require('../orders/orders.service');

const videosService = {
  create: data => {
    return orderService.create(new Order(data))
      .then(order => {
        console.log(order);
        const video = new Video({
          orders_id: order.id,
          ...data
        });
        return Video.create(video)
      })
  },

  validate: data => validationHelper.validate(Video.getSchema(), new Video(data)),

  getAll: () => Video.getAll(),

  get: id => Video.get(id),

  update(videoId, data, filePath) {
    return Video.update(videoId, new Video(data))
      .then(results => {
        if (filePath)
          fileUploadHelper.moveFile(filePath, `${config.celebrities.mediaPath}/${results.celebrities_id}/videos/`);
        return results ? this.get(results.id) : false;
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
