'user strict';

const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');

const routes = require('./routes');

// Meddlewares
app.use(morgan('dev'));
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  if (req.method === 'OPTIONS') {
      res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
      return res.status(200).json({});
  }
  next();
});

// Routes
app.use('/', routes);

// Error handling
app.use((req, res, next) => {
  const error = new Error('Request not found');
  error.status = 404;
  next(error);
})

app.use((error, req, res, next) => {
  console.log(error);
  res.status(error.status || 500);
  res.json({
    status: 'failed',
    error: {
      message: error.message
    }
  });
});

module.exports = app;
