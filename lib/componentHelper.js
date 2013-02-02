var
  fs         = require('fs-extra'),
  Builder    = require('component-builder'),
  config     = require('../config'),
  utils      = require('./utils'),
  component  = require('./component'),
  options = {
    dest: config.componentInstallDir
  };

/**
 * Installs `model`s component from registry
 * into the install dir
 *
 * @param {Model} model
 * @param {Function} callback
 */

exports.install = function (model, callback) {
  var pkg = component.install(model.repo, '*', options);
  pkg.on('end', callback);
  pkg.install();
};

/**
 * Builds component from model's attributes,
 * calls callback with err and built js in UTF-8
 *
 * @param {Model} model
 * @param {Function} callback
 */

exports.build = function (model, callback) {
  var builder = new Builder(utils.getInstallDir(model.repo));
  builder.addLookup(config.componentInstallDir);
  builder.build(function (err, res) {
    if (err || (res && !res.js)) {
      return callback(err);
    }
    callback(err, res.js);
  });
};

/**
 * Deletes all components in the install dir
 * 
 * @param {Function} callback
 */
exports.clearInstall = function (callback) {
  fs.remove(config.componentInstallDir, function (err) {
    console.log('fs-extra remove: ', err, err && err.stack);
    callback(err);
  });
};
