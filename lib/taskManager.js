var schedule = require( 'node-schedule' );
var updateTask = require( './updateTask' );

// Update entries every 30 minutes
schedule.scheduleJob( '0,30 * * * *', updateTask );
