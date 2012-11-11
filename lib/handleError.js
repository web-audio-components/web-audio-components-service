var _ = require( 'underscore' );

module.exports = function ( err, next ) {
  var m = '';
  if ( err.errors ) {
    var error = _.values( err.errors )[ 0 ];
    m += error.name + ': ';
    m += error.message;
    err.message = m;
    err.code = 400;
  } else {
    err.code = 500;
  }
  next( err );
};
