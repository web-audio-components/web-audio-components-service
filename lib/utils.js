exports.base64ToBuffer = function ( data ) {
  return new Buffer( data, 'base64' );
};

exports.base64ToString = function ( data ) {
  return new Buffer( data, 'base64' ).toString();
};
