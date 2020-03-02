/**
 * @file        errorHandler.middleware.js
 * @description A middleware to handle the errors
 * @author      Tamer Inawy <tamer.inawy@gmail.com>
 * 
 */
const errorHandler = (error, req, res, next) => {
  console.log(error);
  res.status(error.status || 400);

  const response = {
    status: 'failed',
    error: { message: error.message }
  };

  if (process.env.NODE_ENV === 'develop')
    response.debug = error;

  res.json(response);
};

module.exports = errorHandler;
