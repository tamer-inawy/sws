/**
 * @file        response.middleware.js
 * @description A middleware to format the respons
 * @author      Tamer Inawy <tamer.inawy@gmail.com>
 * 
 */
const resFormat = (req, res, next) => {
  res.status(200).json({ status: 'success', data: res.locals.data ? res.locals.data : {} });
};

module.exports = resFormat;
