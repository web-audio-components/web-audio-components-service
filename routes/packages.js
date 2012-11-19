var handleError = require( '../lib/handleError' );
var github = require( '../lib/github' );

// GET /packages
exports.index = function ( req, res, next ) {
  req.models.Packages.find( {}, function ( err, packages ) {
    if ( !err ) {
      res.json( packages );
    } else {
      handleError( err, next );
    }
  });
};

// POST /packages
exports.create = function ( req, res, next ) {
  var pkg = new req.models.Packages( req.body );
  github.getContent( pkg, pkg.script, function ( err, response, body ) {
    if ( err || !body || !body.content ) { handleError( err, next ); }
    pkg.scriptFile = github.base64ToBuffer( body.content );
    pkg.save(function ( err ) {
      if ( !err ) {
        res.json({ success: true, message: 'Package added' });
      } else {
        handleError( err, next );
      }
    });
  });
};

// GET /packages/:name
exports.show = function ( req, res, next ) {
  req.models.Packages.findOne({ name: req.params.name }, function ( err, pkg ) {
    if ( !err ) {
      res.json( pkg ? pkg : {}); 
    } else {
      handleError( err, next );
    }
  });
};

// GET /packages/search/:name
exports.search = function ( req, res, next ) {
  req.models.Packages.search( req.params.name, function ( err, packages ) {
    if ( !err ) {
      res.json( packages );
    } else {
      handleError( err, next );
    }
  });
};

// GET /packages/:name/script.js
exports.getScript = function ( req, res, next ) {
  req.models.Packages.findOne({ name: req.params.name }, function ( err, pkg ) {
    if ( !err ) {
      res.send( pkg.scriptFile );
    } else {
      handleError( err, next );
    }
  });
};
