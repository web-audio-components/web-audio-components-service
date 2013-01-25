var config = require('../config');

module.exports = config.env === 'production' ?
  require('gitio') :
  require('../mocks/gitio');
