var schedule = require('node-schedule');
var syncTask = require('./tasks/sync');

// Update entries every 30 minutes
schedule.scheduleJob('0,30 * * * *', syncTask);
