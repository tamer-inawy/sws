'user strict';

const express = require('express');
const routers = express.Router();

const celebritiesRoutes = require('./modules/celebrities/celebrities.route');
const usersRoutes = require('./modules/users/users.route');
const videosRoutes = require('./modules/videos/videos.route');
const ordersRoutes = require('./modules/orders/orders.route');
const { responseMiddleware, errorHandlerMiddleware } = require('./middlewares');

// Static routes
routers.use(express.static('public'));

// Routers list
routers.use('/celebrities', celebritiesRoutes, responseMiddleware);
routers.use('/users', usersRoutes, responseMiddleware);
routers.use('/videos', videosRoutes, responseMiddleware);
routers.use('/orders', ordersRoutes, responseMiddleware);

// Helthcheck route
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
