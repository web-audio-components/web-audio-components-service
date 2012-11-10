// GET /packages
exports.index = function ( req, res ) {
  req.models.Packages.find( {}, function ( err, packages ) {
    if ( !err ) { res.json( packages ); }
  });
};

// POST /packages
exports.create = function ( req, res ) {


};

// GET /packages/:name
exports.show = function ( req, res ) {
  req.models.Packages.findOne({ name: req.params.name }, function ( err, pkg ) {
    if ( !err ) { res.json( pkg ); }
  });
};

// GET /packages/search/:name
exports.search = function ( req, res ) {
  req.models.Packages.search( req.params.name, function ( err, packages ) {
    if ( !err ) { res.json( packages ); }
  });
}
