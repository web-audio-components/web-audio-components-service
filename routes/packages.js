var _ = require( 'underscore' );

// GET /packages
exports.index = function ( req, res, next ) {
  req.models.Packages.find( {}, function ( err, packages ) {
    if ( !err ) { res.json( packages ); }
    else next( err );
  });
};

// POST /packages
exports.create = function ( req, res, next ) {
  var pkg = new req.models.Packages( req.body );
  pkg.save(function ( err ) {
    if ( err ) next( err );
    res.json({ success: true, message: 'Package added' });
  });
};

// GET /packages/:name
exports.show = function ( req, res, next ) {
  req.models.Packages.findOne({ name: req.params.name }, function ( err, pkg ) {
    if ( !err ) { res.json( pkg ); }
    else next( err );
  });
};

// GET /packages/search/:name
exports.search = function ( req, res, next ) {
  req.models.Packages.search( req.params.name, function ( err, packages ) {
    if ( !err ) { res.json( packages ); }
    else next( err );
  });
};
