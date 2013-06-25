var
  defer        = require('when').defer,
  fetch        = require('./../fetch'),
  queue        = require('./../queue'),
  updateModel  = require('../updateModel'),
  clearInstall = require('../component-utils').clearInstall,
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

  clearInstall()
  .then(fetch)
  .then(function (data) {
    return queue(data, compareModel.bind(null, that));
  })
  .then(callback.bind(null), callback);
});

// Determines if a component model needs to be created or updated
function compareModel (task, component) {
  var deferred = defer();
  Component.findOne({ repo: component.repo }).exec()
  .then(function (model) {
    var isNew = !model;
    var isDiff = (model || {}).version !== component.version;
    model = isNew ? new Component(component) : model;

    if (isNew || isDiff) {
      return updateModel(model, component).then(function (saved) {
        if (isNew) {
          task.emit('new component', saved);
          logger.debug.info('NEW COMPONENT: ' + component.repo); 
        } else {
          logger.debug.info('UPDATED COMPONENT: ' + component.repo); 
        }
      });
    }
    else
      deferred.resolve();
  }).then(deferred.resolve, deferred.reject);

  return deferred.promise;
}

module.exports = task;
