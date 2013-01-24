var
  config     = require('./config'),
  mocks      = require('./routes/mocks'),
  help       = require('./lib/routeHelpMessage'),
  components = require('./routes/components');

module.exports = function (app) {

  app.get('/', function (req, res) {
    res.json(help);
  });

  app.get('/components', components.index);
  app.get('/components/:owner/:name', components.show);
  app.get('/components/:owner/:name/script.js', components.getScript);
  app.get('/components/:owner/:name/build.js', components.getBuild);

  app.use(function (err, req, res, next) {
    res.send(err.code || 500, { error: err.message });
  });

  if (config.isTest) {
    app.get('/mock/registry', mocks.registry);
  }
};
