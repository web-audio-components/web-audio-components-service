var
  schedule = require('node-schedule'),
  syncTask = require('./tasks/sync');

// Tasks to run on startup
syncTask.run();

// Update entries every 30 minutes and boot
schedule.scheduleJob('0,30 * * * *', function () {
  syncTask.run();
});
