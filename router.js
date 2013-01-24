var
  config = require('./config'),
  mocks = require('./routes/mocks'),
  components = require('./routes/components');

module.exports = function (app) {

  app.get('/', function (req, res) {
    res.json({ message: 'WAPM home' });
  });

  app.get('/components', components.index);
  app.post('/components', components.create);
  app.get('/components/:repo', components.show);
  app.get('/components/search/:query', components.search);
  app.get('/components/:repo/script.js', components.getScript);
  app.get('/components/:repo/build.js', components.getBuild);

  app.use(function (err, req, res, next) {
    res.send(err.code || 500, { error: err.message });
  });

  if (config.isTest) {
    app.get('/mock/registry', mocks.registry);
  }
};
