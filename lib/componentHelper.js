var
  fs         = require('fs'),
  mkdirp     = require('mkdirp'),
  rimraf     = require('rimraf'),
  Builder    = require('component-builder'),
  config     = require('../config'),
  installDir = config.componentInstallDir,
  utils      = require('./utils'),
  options    = {
    dest : installDir
  },
  component = require('./component');

exports.install = function (data, callback) {
  var pkg = component.install(data.repo, '*', options);
  pkg.on('end', callback);

  // Clear out install directory to get latest
  rimraf(utils.getInstallDir(data.repo), function () {
    pkg.install();
  });
};

exports.build = function (data, callback) {
  var builder = new Builder(utils.getInstallDir(data.repo));
  builder.build(function (err, res) {
    var
      dirPath = utils.getBuildDir(data.repo),
      scriptPath = utils.getBuildScriptPath(data.repo);
    if (err || (res && !res.js)) {
      return callback(err);
    }
    mkdirp(dirPath, function (err) {
      if (err) {
        return callback(err);
      }
      fs.writeFile(scriptPath, res.js, callback);
    });
  });
};
