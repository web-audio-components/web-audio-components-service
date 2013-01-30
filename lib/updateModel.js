var
  _           = require('underscore'),
  async       = require('async'),
  curry       = require('curry'),
  Dependency  = require('../models').Dependency,
  build       = require('./componentHelper').build;
  install     = require('./componentHelper').install;

var mongoose = require('mongoose');

module.exports = function updateModel (model, data, callback) {
  _.each(data, function (val, prop) {
    if (prop === 'dependencies') {
      model.dependencies = new mongoose.Schema.Types.Array();
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
 
  console.log('installing ' + model.repo);

  // TODO move this back to async currying if successful
  install(model, function (err) {
    console.log('installed ' + model.repo);
    console.log(err);
    build(model, function (err, js) {
      console.log('built ' + model.repo);
        console.log(err);
      if (err) {
        return callback(err);
      } 
      model.build = new Buffer(js);
      model.save(callback);
    });
  });
};
