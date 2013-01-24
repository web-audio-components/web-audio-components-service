var
  fetch       = require('./../fetch'),
  queue       = require('./../queue'),
  updateModel = require('../updateModel'),
  Component   = require('../../models').Component;

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

module.exports = updateTask;
