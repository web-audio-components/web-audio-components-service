var
  defer = require('when').defer,
  async = require('async');

var
  CONCURRENT = 5;

/**
 * Applies `fn` to each item in `collection`, limited by
 * `CONCURRENT` number of items at a time. Resolves
 * on completion of processing all items.
 *
 * @params {Array} collection
 * @params {Function} fn
 * @returns {Promise}
 */

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
