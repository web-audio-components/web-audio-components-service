var request = require( 'request' );
var config = require( '../../config' );

exports.postManifest = function ( manifest, callback ) {
  var options = {
    uri: 'http://localhost:' + config.port + '/packages',
    timeout: 8000,
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

exports.searchPackages = function ( query, callback ) {
  var options = {
    uri: 'http://localhost:' + config.port + '/packages/search/' + query,
    timeout: 3000,
    json: true
  };

  request.get( options, callback );
};

exports.getScript = function ( pkg, callback ) {
  var options = {
    uri: 'http://localhost:' + config.port + '/packages/' + pkg + '/script.js',
    timeout: 3000
  };

  request.get( options, callback );
};
