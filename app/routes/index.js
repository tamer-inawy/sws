'user strict';

const routers = require('express').Router();

// Helthcheck router
routers.get('/', (req, res) => {
  res.status(200)
    .json({
      status: 'success',
      data: {
        message: 'The server is up!'
      }
    });
});

module.exports = routers;
