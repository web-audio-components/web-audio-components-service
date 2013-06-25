var
  _           = require('underscore'),
  defer       = require('when').defer,
  Dependency  = require('../models').Dependency,
  build       = require('./component-utils').build;
  install     = require('./component-utils').install;

/**
 * Merges the properties of `data` onto the
 * Mongoose `model`, reinstalls the component files,
 * builds, stores the built JavaScript file in the model, 
 * and saves `model`. Returns a promise that resolves to
 * `model`.
 *
 * @params {Mongoose#Model} model
 * @params {Object} data
 * @returns {Promise}
 */

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
  .then(build)
  .then(function (js) {
    model.build = new Buffer(js);
    model.save(function (err, saved) {
      if (err) deferred.reject(err);
      else deferred.resolve(saved);
    });
  }, deferred.reject);

  return deferred.promise;
};
