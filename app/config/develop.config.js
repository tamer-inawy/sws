const config = {
  mysql: {
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'sws'
  },

  saltRound: 10,

  image: {
    maxFileSize: 1024 * 1024 * 25, // in bytes
    allowedTypes: [
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

  users: {
    dir: 'media/users/',
  },

};

config.celebrities.mediaPath = `public/${config.celebrities.dir}`;
config.celebrities.uploadsPath = `${config.celebrities.mediaPath}uploads/`;
config.celebrities.mediaUrl = `${config.celebrities.dir}`;

config.users.mediaPath = `public/${config.users.dir}`;
config.users.uploadsPath = `${config.users.mediaPath}uploads/`;
config.users.mediaUrl = `${config.users.dir}`;

module.exports = config;
