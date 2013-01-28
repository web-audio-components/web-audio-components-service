var
  winston  = require('winston'),
  mongoLog = require('winston-mongodb').MongoDB,
  config   = require('../config'),
  muri     = require('muri'),
  parsed   = muri(config.db.URL),
  _        = require('underscore'),
  logger;

var wConfig = {
  levels: {
    debug: 1,
    warn: 2,
    error: 3
  },
  colors: {
    debug: 'blue',
    warn: 'yellow',
    error: 'red'
  }
};

/**
 * Config to connect to DB for the debug logger
 */

var debugDBConfig = {
  level: wConfig.levels,
  db: parsed.db,
  collection: 'logDebug',
  host: parsed.hosts[0].host,
  port: parsed.hosts[0].port,
  username: parsed.auth
    ? parsed.auth.user
    : '',
  password: parsed.auth
    ? parsed.auth.pass
    : ''
};

/**
 * Config to connect to DB for track logger,
 * same as debug logger but different collection
 */

var trackDBConfig = _.clone(debugDBConfig);
trackDBConfig.collection = 'logTrack';
trackDBConfig.level = 'info';

/**
 * Debug logger, stored in DB and console for error tracking
 */

winston.loggers.add('debug', {
  transports: [
    new (winston.transports.Console)({ level: wConfig.levels }),
    new mongoLog(debugDBConfig)
  ]
});

/**
 * Track logger, used to track API route usage
 */

winston.loggers.add('track', {
  transports: [
    new mongoLog(trackDBConfig)
  ]
});

/**
 * Expose `debug` logger
 */

exports.debug = (function () {
  var ret = {};
  if (config.isTest) {
    ret.warn = ret.debug = ret.error = noop;
  } else {
    ret = winston.loggers.get('debug');
  }

  return ret;

  function noop () {}

})();


/**
 * Expose `track` logger
 */

var track = winston.loggers.get('track');

exports.track = !config.isTest
  ? function () {}
  : function (message, meta) {
      track.info(message, meta);
    };
