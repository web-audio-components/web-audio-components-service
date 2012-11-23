var
  express = require( 'express' ),
  mongoose = require( 'mongoose' ),
  reqExtend = require( 'request-extend' ),
  config = require( './config' ),
  db = mongoose.connect( config.db.URL ),
  app = express(),
  models = require( './models' );

app
  .use( express.bodyParser() )
  .use( reqExtend( 'models', models ))
  .use( reqExtend( 'config', config ));

require( './router' )( app );

app.listen( config.port );

console.log( 'WAPM listening on port ' + config.port );

// Seed, run task manager when not testing
if ( process.env.NODE_ENV !== 'test' ) {
  require( './lib/seed' );
  require( './lib/taskManager' );
}

module.exports = app;
