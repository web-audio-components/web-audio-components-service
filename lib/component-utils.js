var
  fs         = require('fs-extra'),
  Builder    = require('component-builder'),
  config     = require('../config'),
  utils      = require('./utils'),
  component  = require('./modules/component'),
  defer      = require('when').defer,
  options = {
    dest: config.componentInstallDir
  };

/**
 * Installs `model`s component from registry
 * into the install dir
 *
 * @param {Model} model
 * @returns {Promise}
 */

exports.install = function (model) {
  var deferred = defer();
  var pkg = component.install(model.repo, '*', options);
  pkg.on('end', function (err) {
    if (err) deferred.reject(err);
    else deferred.resolve();
  });
  pkg.install();
  return deferred.promise;
};

/**
 * Builds component from model's attributes,
 * resolves with built js in UTF-8
 *
 * @param {Model} model
 * @returns {Promise}
 */

exports.build = function (model) {
  var deferred = defer();
  var builder = new Builder(utils.getInstallDir(model.repo));
  builder.addLookup(config.componentInstallDir);
  builder.build(function (err, res) {
    if (err || (res && !res.js))
      deferred.reject(err);
    else
      deferred.resolve(res.js);
  });
  return deferred.promise;
};

/**
 * Deletes all components in the install dir
 *
 * @returns {Promise}
 */
exports.clearInstall = function () {
  var deferred = defer();
  fs.remove(config.componentInstallDir, function (err) {
    if (err) deferred.reject(err);
    else deferred.resolve();
  });
  return deferred.promise;
};
