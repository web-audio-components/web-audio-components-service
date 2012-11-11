var request = require( 'request' );
var config = require( '../../config' ).test;

exports.postManifest = function ( manifest, callback ) {
  var options = {
    uri: 'http://localhost:' + config.port + '/packages',
    timeout: 3000,
    form: require( '../manifests/' + manifest + '.json' ),
    json: true
  };
  request.post( options, callback );
};
