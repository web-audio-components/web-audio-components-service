var
  request = require('request'),
  config = require('../config'),
  defer = require('when').defer;
  _ = require('underscore');

module.exports = function fetch () {
  var deferred = defer();

  request({
    url : config.componentsURL,
    json : true
  }, function (err, res, body) {
    var audioComponents = [];
    if (err) return deferred.reject(err);

    audioComponents = _.filter(body, function (component) {
      return component && component['web-audio'];
    });

    deferred.resolve(audioComponents);
  });

  return deferred.promise;
};
