var
  fs = require( 'fs' ),
  config = require( '../config' ),
  request = require( 'request' );

var
  seedFiles = fs.readdirSync( __dirname + '/../seed' ),
  seeded = 0;

console.log( 'Seeding...' );

seedFiles.forEach(function ( file ) {
  request.post({
    // TODO probably should put url in config
    uri: 'http://localhost:' + config.port + '/packages',
    timeout: 1000,
    form: require( '../seed/' + file ),
    json: true
  }, function ( err, req, body ) {
    if ( body && body.message ) {
      console.log( file + ': ' + body.message );
    }
    if ( ++seeded === seedFiles.length ) {
      console.log( 'Seeding complete' );
    }
  });
});
