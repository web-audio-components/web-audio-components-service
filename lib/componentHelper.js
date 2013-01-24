var
  component  = require('component'),
  Builder    = require('component-builder'),
  config     = require('../config'),
  installDir = __dirname + config.componentInstallDir,
  buildDir   = __dirname + config.componentBuildDir,
  options    = {
    dest : installDir
  };

exports.install = function (data, callback) {
  var pkg = component.install(data.repo, data.version, options);
  pkg.on('end', callback);
  pkg.install();
};

exports.build = function (data, callback) {
  var builder = new Builder(installDir + '/' + data.repo);
  builder.build(function (err, res) {
    if (err || (res && !res.js)) { callback(err); }
    fs.writeFile(buildDir + '/' + data.repo + '/build.js', res.js, callback);
  });
};
