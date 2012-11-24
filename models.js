var
  mongoose = require( 'mongoose' );
  db = mongoose.connection;
 
var
  Packages = db.model( 'Packages', require( './models/packages' ));

Packages.ensureIndexes(function ( err ) {
  console.error(err);
});

module.exports = {
  'Packages' : Packages
};
