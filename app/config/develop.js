module.exports = {
  mysql: {
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'sws'
  },

  celebrities: {
    uploadsPath: 'public/celebrities/uploads/',
    mediaPath: 'public/celebrities/',
  },

  allowedVideoTypes: ['image/jpeg', 'image/png']
};