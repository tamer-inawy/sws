const express = require('express');
const routers = express.Router();

const adminsRoutes = require('./modules/admins/admins.route');
const celebritiesRoutes = require('./modules/celebrities/celebrities.route');
const usersRoutes = require('./modules/users/users.route');
const videosRoutes = require('./modules/videos/videos.route');
const adsRoutes = require('./modules/ads/ads.route');
const locationsRoutes = require('./modules/locations/locations.route');
const ordersRoutes = require('./modules/orders/orders.route');
const categoriesRoutes = require('./modules/categories/categories.route');
const eventsRoutes = require('./modules/events/events.route');
const { responseMiddleware, errorHandlerMiddleware } = require('./middlewares');
const corsProxy = require('./proxy');

// Static routes
routers.use(express.static('public'));

// Routers list
routers.use('/admins', adminsRoutes, responseMiddleware);
routers.use('/celebrities', celebritiesRoutes, responseMiddleware);
routers.use('/users', usersRoutes, responseMiddleware);
routers.use('/videos', videosRoutes, responseMiddleware);
routers.use('/ads', adsRoutes, responseMiddleware);
routers.use('/locations', locationsRoutes, responseMiddleware);
routers.use('/orders', ordersRoutes, responseMiddleware);
routers.use('/categories', categoriesRoutes, responseMiddleware);
routers.use('/events', eventsRoutes, responseMiddleware);
routers.use('/maps', corsProxy);

// Helthcheck route
routers.get('/healthcheck', (req, res, next) => {
  res.locals.data = {
    message: 'The server is up!'
  };
  next();
}, responseMiddleware);

// Not found 404 error handling
routers.use((req, res, next) => {
  const error = new Error('Request not found');
  error.status = 404;
  next(error);
})

routers.use(errorHandlerMiddleware);

module.exports = routers;
