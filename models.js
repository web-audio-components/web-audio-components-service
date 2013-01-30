var
  mongoose = require('mongoose'),
  db = mongoose.connection;

var
  Component  = db.model('Component', require('./models/component')),
  Dependency = db.model('Dependency', require('./models/dependency'));

Component.ensureIndexes(function (err) {
  console.error(err);
});

module.exports = {
  'Component' : Component,
  'Dependency' : Dependency
};
