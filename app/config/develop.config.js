const config = {
  mysql: {
    connectionLimit: 10,
    host: 'mariadb',
    user: 'root',
    password: '',
    database: 'sws'
  },

  saltRound: 10,

  image: {
    maxFileSize: 1024 * 1024 * 25, // in bytes
    allowedImageTypes: [
      'image/jpeg', // .jpg .jpeg .jpe
      'image/png', // .png
      'image/gif', // .gif
    ],
  },

  video: {
    maxFileSize: 1024 * 1024 * 500, // in bytes
    allowedTypes: [
      'video/mp4', // .mp4
      'video/3gpp', // .3gp
      'video/quicktime', // .mov
      'video/x-msvideo', // .avi
      'video/x-ms-wmv', // .wmv
    ],
  },

  jwt: {
    secrit: 'the secrit',
    expiration: '1w'
  },

  celebrities: {
    dir: 'media/celebrities/',
  },

};

config.celebrities.mediaPath = `public/${config.celebrities.dir}`;
config.celebrities.uploadsPath = `${config.celebrities.mediaPath}uploads/`;
config.celebrities.mediaUrl = `${config.celebrities.dir}`;

module.exports = config;
