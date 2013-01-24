var
  _           = require('underscore'),
  async       = require('async'),
  curry       = require('curry'),
  Dependency  = require('../models').Dependency,
  compHelper  = require('./componentHelper'),
  compInstall = compHelper.install,
  compBuild   = compHelper.build;

module.exports = function updateModel (model, data, callback) {
  _.each(data, function (val, prop) {
    if (prop === 'dependencies') {
      model.dependencies = [];
      _.each(val, function (version, name) {
        model.dependencies.push(new Dependency({
          name : name,
          version : version
        }));
      })
    } else if (!_.isFunction(model[prop])) {
      model[prop] = val;
    }
  });
  model.updated = new Date();
  model.type = data['web-audio'].type;
  async.parallel([
    curry([data], compInstall),
    curry([data], compBuild),
    curry([], function () {
      model.save.apply(model, arguments);
    })
  ], callback);
}

