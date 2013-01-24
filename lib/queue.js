var
  async = require('async');

var
  CONCURRENT = 5;

module.exports = function queueCreator (collection, fn, callback) {
  var queue = async.queue(fn, CONCURRENT);

  queue.drain = function () {
    callback && callback();
  };

  (collection || []).forEach(function (item) {
    queue.push(item, function (err) {
      // necessary?
    });
  });
};
