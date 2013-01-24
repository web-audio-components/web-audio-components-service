// Sloppy mock for component.install in tests

var
  Emitter = require('events').EventEmitter;

function Package () {
}

Package.prototype.__proto__ = Emitter.prototype;

Package.prototype.install = function () {
  this.emit('end');
}

module.exports = {
  install : function (repo, version, options) {
    return new Package();
  }
};
