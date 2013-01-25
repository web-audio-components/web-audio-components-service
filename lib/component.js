var config = require('../config');

module.exports = config.useMocks ?
  require('../mocks/component') :
  require('component') ;
