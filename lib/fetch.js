var
  request = require('request'),
  config = require('../config'),
  defer = require('when').defer;
  _ = require('underscore');

/**
 * Fetches all audio components from the component API.
 * Resolves to an array of audio component data objects
 *
 * @returns {Promise}
 */

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
