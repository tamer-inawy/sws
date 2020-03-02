
const resFormat = (req, res, next) => {
  res.status(200).json({ status: 'success', data: res.locals.data ? res.locals.data : {} });
};

module.exports = resFormat;
