var
  async      = require('async'),
  config     = require('../../config'),
  installDir = config.componentInstallDir,
  Component  = require('../../models').Component,
  rimraf     = require('rimraf');

var clear = function clear (done) {
  this.timeout && this.timeout(2000);
  async.parallel([
    clear.build,
    clear.db
  ], done);
}

clear.build = function (done) {
  rimraf(installDir, done);
};

clear.db = function (done) {
  Component.find({}).remove(done);
};

module.exports = clear;
