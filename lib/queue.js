var
  async = require('async');

var
  CONCURRENT = 5;

module.exports = function queueCreator (collection, fn, callback) {
  var queue = async.queue(fn, CONCURRENT);
  var errors = [];

  queue.drain = function () {
    callback && callback(errors.length ? errors : null);
  };

  (collection || []).forEach(function (item) {
    queue.push(item, function (err) {
      if (err) {
        errors.push(err);
      }
    });
  });

  if (!collection.length) {
    callback();
  }
};
