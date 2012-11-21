var
  mongoose = require( 'mongoose' );
  db = mongoose.connection;
 
module.exports = {
  'Packages' : db.model( 'Packages', require( './models/packages' )( mongoose ))
};
