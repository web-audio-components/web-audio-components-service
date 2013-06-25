var
  sync = require('../../lib/tasks/sync');

// Current sync implementation would seed with 
// mock registry
module.exports = function (callback) {
  sync.run().then(callback.bind(null, null), callback);
};
