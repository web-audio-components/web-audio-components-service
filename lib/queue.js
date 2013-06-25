var
  defer = require('when').defer,
  async = require('async');

var
  CONCURRENT = 5;

module.exports = function queueCreator (collection, fn) {
  var deferred = defer();
  var queue = async.queue(processor.bind(null, fn), CONCURRENT);

  if (!collection.length) {
    deferred.resolve();
  }

  queue.drain = deferred.resolve;

  (collection || []).forEach(function (item) {
    queue.push(item, function (err) {
      if (err) deferred.reject(err);
    });
  });

  return deferred.promise;
};

function processor (fn, item, callback) {
  fn(item).then(callback.bind(null, null), callback);
}
