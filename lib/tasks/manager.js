var
  schedule = require('node-schedule'),
  tweet = require('../tweet'),
  logger = require('../logger'),
  syncTask = require('./sync');

// Tasks to run on startup
runSync();

// Update entries every 30 minutes and boot
schedule.scheduleJob('0,30 * * * *', runSync);

function runSync () {
  logger.debug.info('SYNC: Running');
  syncTask.run().then(function () {
    logger.debug.info('SYNC: Completed');
  }, function (err) {
    console.error(err);
    logger.debug.error('SYNC: Completed with errors', err);
  });
}

// Events
syncTask.on('new component', function (model) {
  tweet(model).then(function (reply) {
    logger.debug.info('TWEET: Tweeted ' + model.repo);
  }, function (err) {
    logger.debug.error('TWEET: Attempted to tweet ' + model.repo, err);
  });
});
