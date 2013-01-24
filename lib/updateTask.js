var
  async       = require('async'),
  curry       = require('curry'),
  _           = require('underscore'),
  fetch       = require('./fetch'),
  queue       = require('./queue'),
  Component   = require('../models').Component,
  compHelper  = require('./componentHelper'),
  compInstall = compHelper.install,
  compBuild   = compHelper.build;

// Fetches data, pushes it to queue to perform compareModel
function updateTask (callback) {
  fetch(function (err, data) {
    if (!err) {
      queue(data, checkModels, callback);
    }
  });
}

// Determines if a component model needs to be created or updated
function compareModel (component, callback) {
  Component.find({ repo: component.repo }, function (err, model) {
    // New component
    if (!model && !err) {
      updateModel(new Component(component), component, callback);
    // Component updated
    } else if (model && model.version !== component.version) {
      updateModel(model, component, callback);
    // Component not updated
    } else {
      callback(err);
    }
  });
}

function updateAudioProperties (model, data, callback) {
  var props = data['web-audio'];
  if (!props) { return; }
  model.type = props.type;
}

function updateModel (model, data, callback) {
  _.extend(model, data);
  model.updated = new Date();
  updateAudioProperties(model, data);
  async.parallel([
    curry([data], compInstall),
    curry([data], compBuild),
    curry([], model.save)
  ], callback);
}

module.exports = updateTask;
