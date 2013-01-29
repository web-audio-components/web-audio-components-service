var config = require('../config');

module.exports = config.useMockRepository ?
  require('../mocks/component') :
  require('component') ;
