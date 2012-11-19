module.exports = function ( app ) {
  var
    packages = require( './routes/packages' );

  app.get( '/', function ( req, res ) {
    res.json({ message: 'WAPM home' });
  });

  app.get( '/packages', packages.index );
  app.post( '/packages', packages.create );
  app.get( '/packages/:name', packages.show );
  app.get( '/packages/search/:name', packages.search );
  app.get( '/packages/:name/script.js', packages.getScript );

  app.use(function ( err, req, res, next ) {
    res.send( err.code || 500, { error: err.message });
  });
};
