var
  express = require( 'express' ),
  mongoose = require( 'mongoose' ),
  reqExtend = require( 'request-extend' ),
  config = require( './config' ),
  app = express();

var
  db = mongoose.connect( config.db.URL ),
  models = require( './models' )({ mongoose: mongoose, db: db });

app
  .use( express.bodyParser() )
  .use( reqExtend( 'models', models ))
  .use( reqExtend( 'config', config ));

require( './router' )( app );

app.listen( config.port );

console.log( 'WAPM listening on port ' + app.port );

module.exports = app;
