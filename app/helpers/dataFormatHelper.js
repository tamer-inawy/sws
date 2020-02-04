'user strict';

const formater = {
  successFormat: data => ({status: 'success', data: data}),
  errorFormat: message => ({status: 'failed', error: {message: message}})
};

module.exports = formater;
