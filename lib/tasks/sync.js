var
  fetch        = require('./../fetch'),
  queue        = require('./../queue'),
  updateModel  = require('../updateModel'),
  clearInstall = require('../componentHelper').clearInstall,
  logger       = require('../logger'),
  Task         = require('./task'),
  Component    = require('../../models').Component;

/**
 * Update task fetches all WACs from registry,
 * clears current components from install dir, and
 * queues up each WAC from registry to be updated
 */

var task = new Task(function updateTask (callback) {
  var that = this;
  fetch(function (err, data) {
    if (!err) {
      clearInstall(function (err) {
        if (!err) {
          queue(data, function () {
            that.compareModel.apply(that, arguments);
          }, callback);
        } else {
          callback(err);
        }
      });
    } else {
      callback(err);
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
          logger.debug.info('NEW COMPONENT: ' + savedModel.repo + ' has been updated');
        }
        callback.apply(null, savedModel);
      });
    // Component updated
    } else if (model && !err) {
      logger.debug.info('UPDATED COMPONENT: ' + component.repo + ' has been updated');
      updateModel(model, component, callback);
    } else {
      callback(err);
    }
  });
}

module.exports = task;
