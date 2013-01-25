// Sloppy mock for component.install in tests

var
  utils   = require('../lib/utils'),
  fs      = require('fs-extra'),
  Emitter = require('events').EventEmitter;

function Package (repo, version, options) {
  this.repo = repo;
  this.version = version;
  this.options = options;
}

Package.prototype.__proto__ = Emitter.prototype;

Package.prototype.install = function () {
  var options = {
    src : __dirname + '/components/' + this.repo.replace('/', '-'),
    dest : utils.getInstallDir(this.repo)
  };
  fs.copy(options, function (err) {
    this.emit('end');
  });
}

module.exports = {
  install : function (repo, version, options) {
    return new Package(repo, version, options);
  }
};
