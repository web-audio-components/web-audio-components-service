var
  _           = require('underscore'),
  defer       = require('when').defer,
  Dependency  = require('../models').Dependency,
  build       = require('./component-utils').build;
  install     = require('./component-utils').install;

module.exports = function updateModel (model, data) {

  var deferred = defer();

  _.each(data, function (val, prop) {
    if (prop === 'dependencies') {
      model.dependencies = [];
      _.each(val, function (version, name) {
        model.dependencies.push(new Dependency({
          name : name,
          version : version
        }));
      });
    } else if (!_.isFunction(model[prop])) {
      model[prop] = val;
    }
  });
  model.updated = new Date();
  model.type = data['web-audio'].type;

  install(model)
  .then(build.bind(null, model))
  .then(function (js) {
    model.build = new Buffer(js);
    model.save(function (err, saved) {
      if (err) deferred.reject(err);
      else deferred.resolve(saved);
    });
  }, deferred.reject);

  return deferred.promise;
};
