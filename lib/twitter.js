var config = require('../config');

module.exports = config.env === 'production' ?
  require('twit') :
  require('../mocks/twitter');
