const errorHandler = (error, req, res, next) => {
  console.log(error);
  res.status(error.status || 400);

  const response = {
    status: 'failed',
    error: { message: error.message }
  };

  if (process.env.ENV === 'develop')
    response.debug = error;

  res.json(response);
};

module.exports = errorHandler;
