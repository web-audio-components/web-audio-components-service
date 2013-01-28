var
  fetch       = require('./../fetch'),
  queue       = require('./../queue'),
  updateModel = require('../updateModel'),
  logger      = require('../logger'),
  Task        = require('./task'),
  Component   = require('../../models').Component;

// Fetches data, pushes it to queue to perform compareModel
var task = new Task(function updateTask (callback) {
  var that = this;
  fetch(function (err, data) {
    if (!err) {
      queue(data, function () {
        that.compareModel.apply(that, arguments);
      }, callback);
    }
  });
});

// Determines if a component model needs to be created or updated
task.compareModel = function (component, callback) {
  var that = this;
  Component.findOne({ repo: component.repo }, function (err, model) {
    // New component
    if (!model && !err) {
      updateModel(new Component(component), component, function (err, savedModel) {
        if (!err) {
          that.emit('new component', savedModel);
        }
        logger.debug.info('NEW COMPONENT: ' + savedModel.repo + ' has been updated');
        callback.apply(null, arguments);
      });
    // Component updated
    } else if (model && model.version !== component.version) {
      logger.debug.info('UPDATED COMPONENT: ' + savedModel.repo + ' has been updated');
      updateModel(model, component, callback);
    // Component not updated
    } else {
      callback(err);
    }
  });
}

module.exports = task;
