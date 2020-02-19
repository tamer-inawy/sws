'user strict';

const routers = require('express').Router();

const celebrityRoutes = require('./celebrities.route');
const { responseMiddleware, errorHandlerMiddleware } = require('../middlewares');

// Routers list
routers.use('/celebrities', celebrityRoutes, responseMiddleware);

// Helthcheck router
routers.get('/healthcheck', (req, res, next) => {
  res.locals.data = {
    message: 'The server is up!'
  };
  next();
}, responseMiddleware);

// Error handling
routers.use((req, res, next) => {
  const error = new Error('Request not found');
  error.status = 404;
  next(error);
})

routers.use(errorHandlerMiddleware);

module.exports = routers;
