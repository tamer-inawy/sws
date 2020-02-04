'user strict';

const routers = require('express').Router();

const celebrityRoutes = require('./celebrities');

// Routers list
routers.use('/celebrities', celebrityRoutes);

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
