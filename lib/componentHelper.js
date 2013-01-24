var
  fs         = require('fs'),
  mkdirp     = require('mkdirp'),
  Builder    = require('component-builder'),
  config     = require('../config'),
  installDir = config.componentInstallDir,
  buildDir   = config.componentBuildDir,
  options    = {
    dest : installDir
  },
  component;

component = !config.isTest ? require('component') : require('../mocks/component');

exports.install = function (data, callback) {
  var pkg = component.install(data.repo, data.version, options);
  pkg.on('end', callback);
  pkg.install();
};

exports.build = function (data, callback) {
  var builder = new Builder(installDir + '/' + data.repo);
  builder.build(function (err, res) {
    var path = buildDir + '/' + data.repo;
    if (err || (res && !res.js)) {
      return callback(err);
    }
    mkdirp(path, function (err) {
      if (err) {
        return callback(err);
      }
      fs.writeFile(path + '/build.js', res.js, callback);
    });
  });
};
