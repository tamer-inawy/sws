'user strict';

const express = require('express');
const routers = express.Router();

const celebrityRoutes = require('./modules/celebrities/celebrities.route');
const userRoutes = require('./modules/users/users.route');
const videoRoutes = require('./modules/videos/videos.route');
const { responseMiddleware, errorHandlerMiddleware } = require('./middlewares');

// Static routes
routers.use(express.static('public'));

// Routers list
routers.use('/celebrities', celebrityRoutes, responseMiddleware);
routers.use('/users', userRoutes, responseMiddleware);
routers.use('/videos', videoRoutes, responseMiddleware);

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
