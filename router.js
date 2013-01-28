var
  config     = require('./config'),
  help       = require('./lib/routeHelpMessage'),
  components = require('./routes/components'),
  mocks      = require('./routes/mocks'),
  logger     = require('./lib/logger');

module.exports = function (app) {

  app.all('*', function(req, res, next){
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET');
    res.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
    if ('OPTIONS' == req.method) return res.send(200);
    next();
  });

  /**
   * Tracking
   */

  app.all('*', function (req, res, next) {
    console.log(req.host);
    if (/^\/components/.test(req.url)) {
      logger.track(req.method.toUpperCase() + ': ' + req.url);
    }
    next();
  });

  /**
   * Landing page resource
   */

  app.get('/', function (req, res) {
    res.json(help);
  });

  /**
   * API
   */

  app.get('/components', components.index);
  app.get('/components/:owner/:name', components.show);
  app.get('/components/:owner/:name/script.js', components.getScript);
  app.get('/components/:owner/:name/build.js', components.getBuild);

  /**
   * Error handling
   */

  app.use(function (err, req, res, next) {
    res.send(err.code || 500, { error: err.message });
  });

  /**
   * Mocks in test and/or dev
   */

  if (config.useMocks) {
    app.get('/mock/registry', mocks.registry);
  }
};
