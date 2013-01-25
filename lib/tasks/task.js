var
  Emitter = require('events').EventEmitter;

function Task (run) {
  this.run = run;
}

Task.prototype.__proto__ = Emitter.prototype;

module.exports = Task;
