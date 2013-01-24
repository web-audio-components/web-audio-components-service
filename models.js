var
  mongoose = require('mongoose');
  db = mongoose.connection;

var
  Component = db.model('Component', require('./models/component'));

Component.ensureIndexes(function (err) {
  console.error(err);
});

module.exports = {
  'Component' : Component
};
