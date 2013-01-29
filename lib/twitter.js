var config = require('../config');

module.exports = config.tweet ?
  require('twit') :
  require('../mocks/twitter');
