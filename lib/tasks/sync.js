var
  defer        = require('when').defer,
  resolve      = require('when').resolve,
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
 *
 * @returns {Promise}
 */

var task = new Task(function updateTask () {
  var emitter = this;

  return clearInstall()
    .then(fetch)
    .then(function (data) {
      return queue(data, process.bind(null, emitter));
    });
});

module.exports = task;

/**
 * Takes an emitter (Task instance) and component data
 * and updates the model if its needed.
 *
 * @params {Task} emitter
 * @params {Object} component
 * @returns {Promise}
 */

function process (emitter, component) {
  var model, isNew;
  return getModel(component).then(function (result) {
    if (!result) {
      isNew = true;
      model = new Component(component);
    } else {
      model = result;
    }
    return isNew || model.version !== component.version;
  }).then(function (shouldUpdate) {
    if (shouldUpdate)
      return updateModel(model, component);
    return null;
  }).then(function (saved) {
    if (!saved) return;
    if (isNew) {
      emitter.emit('new component', saved);
      logger.debug.info('NEW COMPONENT: ' + component.repo); 
    } else {
      logger.debug.info('UPDATED COMPONENT: ' + component.repo); 
    }
  });
}

/**
 * Fetches the corresponding model from the DB. Returns a promise
 * that resolves to the model (can be null)
 *
 * @params {Object} component
 * @returns {Promise}
 */

function getModel (component) {
  return Component.findOne({ repo: component.repo }).exec();
}
