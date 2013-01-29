var
  fs         = require('fs'),
  Builder    = require('component-builder'),
  rimraf     = require('rimraf'),
  config     = require('../config'),
  utils      = require('./utils'),
  component  = require('./component'),
  options = {
    dest: config.componentInstallDir
  };

/**
 * Not used
 */

exports.install = function (model, callback) {
  var pkg = component.install(model.repo, '*', options);
  pkg.on('end', callback);

  // Clear out install directory to get latest
  rimraf(utils.getInstallDir(model.repo), function (err) {
    console.log('Rimrafing ' + options.dest + model.repo);
    console.log(err);
    pkg.install();
  });
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
  builder.build(function (err, res) {
    if (err || (res && !res.js)) {
      return callback(err);
    }
    callback(err, res.js);
  });
};
