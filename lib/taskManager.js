var schedule = require( 'node-schedule' );
var updateTask = require( './updateTask' );

// Update entries every thirty minutes
schedule.scheduleJob( '1-60 * * * *', updateTask );
