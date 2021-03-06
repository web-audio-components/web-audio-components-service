var
  express = require('express'),
  mongoose = require('mongoose'),
  config = require('./config'),
  db = mongoose.connect(config.db.URL),
  app = express(),
  models = require('./models');

app
  .use(express.bodyParser());

require('./router')(app);

app.listen(config.port);

console.log('Web Audio Components Service');
console.log('   port : ' + config.port);
console.log('   env  : ' + config.env);

// Run task manager when not testing
if (!config.isTest) {
  require('./lib/tasks/manager');
}

module.exports = app;
