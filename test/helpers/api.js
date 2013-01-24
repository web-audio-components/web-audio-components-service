var
  request = require('request'),
  config = require('../../config');

exports.get = function () {
  var query = arguments.length === 2 ? arguments[0] : null;
  var callback = arguments[arguments.length - 1];
  var options = {
    uri: 'http://localhost:' + config.port + '/packages',
    timeout: 3000,
    json: true
  };

  if (query) {
    options.uri += '/' + query;
  }

  request.get(options, callback);
};

exports.search = function (query, callback) {
  var options = {
    uri: 'http://localhost:' + config.port + '/packages/search/' + query,
    timeout: 3000,
    json: true
  };

  request.get(options, callback);
};

exports.getScript = function (pkg, callback) {
  var options = {
    uri: 'http://localhost:' + config.port + '/packages/' + pkg + '/script.js',
    timeout: 3000
  };

  request.get(options, callback);
};
