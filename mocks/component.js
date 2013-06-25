// Sloppy mock for component.install in tests

var
  defer   = require('when').defer,
  utils   = require('../lib/utils'),
  fs      = require('fs-extra'),
  mkdirp  = require('mkdirp'),
  queue   = require('../lib/queue'),
  _       = require('underscore'),
  Emitter = require('events').EventEmitter;

function Package (repo, version, options) {
  this.repo = repo;
  this.version = version;
  this.options = options;
}

Package.prototype.__proto__ = Emitter.prototype;

Package.prototype.install = function () {
  var
    that = this,
    src  = __dirname + '/components/' + this.repo.replace('/', '-'),
    dest = utils.getInstallDir(this.repo),
    json = require(src + '/component.json') || {},
    deps = [];

  _.each(json.dependencies || {}, function (ver, pkg) {
    deps.push(pkg);
  });

  queue(deps, function (dep) {
    var deferred = defer();
    var pkg = new Package(dep, '*');
    pkg.on('end', function (val) {
      deferred.resolve(val);
    });
    pkg.install();
    return deferred.promise;
  }).then(function () {
    copyDir(src, dest, function (err) {
      that.emit('end');
    });
  });

};

function copyDir (src, dest, fn) {
  mkdirp(dest, function (err) {
    fs.copy(src, dest, fn);
  });
};

module.exports = {
  install : function (repo, version, options) {
    return new Package(repo, version, options);
  }
};
