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

exports.getPackage = function () {
  var query = arguments.length === 2 ? arguments[ 0 ] : null;
  var callback = arguments[ arguments.length - 1 ];
  var options = {
    uri: 'http://localhost:' + config.port + '/packages',
    timeout: 3000,
    json: true
  };

  if ( query ) {
    options.uri += '/' + query;
  }

  request.get( options, callback );

};
