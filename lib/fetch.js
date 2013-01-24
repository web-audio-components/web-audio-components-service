var
  request = require('request'),
  config = require('../config'),
  _ = require('underscore');

module.exports = function fetch (callback) {
  request({
    url : config.componentsURL,
    json : true
  }, function (err, res, body) {
    var audioComponents = [];
    if (!err) {
      audioComponents = _.filter(body, function (component) {
        return component && component['web-audio'];
      });
    }

    callback(err, audioComponents);
  });
};
