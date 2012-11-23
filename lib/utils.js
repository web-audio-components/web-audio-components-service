exports.base64ToBuffer = function ( data ) {
  return new Buffer( data, 'base64' );
};

exports.base64ToString = function ( data ) {
  return new Buffer( data, 'base64' ).toString();
};

exports.stringToBase64 = function ( data ) {
  return new Buffer( data ).toString( 'base64' );
};
