var
  github = require( './github' ),
  async = require( 'async' ),
  curry = require( 'curry' ),
  utils = require( './utils' ),
  _ = require( 'underscore' ),
  models = require( '../models' );

var
  CONCURRENT = 5;

module.exports = queueTask;

// Queues up `checkRepo` for all packages
function queueTask ( callback ) {
  var queue = async.queue( checkRepo, CONCURRENT );
  queue.drain = function () {
    callback();
  };

  models.Packages.find({}, function ( err, pkgs ) {
    queue.push( pkgs, function ( err ) {
    });
  });
}

// Checks repo for changes
function checkRepo ( pkg, callback ) {
  github.getRepo( pkg, function ( err, res, body ) {
    var updated = new Date( body.updated_at );

    // Check if repo has been updated since last check
    // update properties accordingly if so
    if ( updated > pkg.updated ) {
      // parallel so we can use a new script if the wapm.json
      // has a changed script property
      async.parallel([
        curry([ pkg ], updateManifest ),
        curry([ pkg ], updateScript ),
        curry([ pkg, body ], updateInfo ),
        curry( pkg.save, pkg )
      ], function ( err, results ) {
        callback( err, results );
      });
    } else {
      // just update watchers count and last updated
      updateInfo( pkg, body, function () {
        pkg.save( callback );
      });
    }
  });
}

// Updates package with changes in wapm.json
function updateManifest ( pkg, callback ) {
  github.getContent( pkg, 'wapm.json', function ( err, req, body ) {
    if ( err ) {
      callback( err );
      return;
    }

    // Merge latest wapm.json changes with database records
    var manifest;
    try {
      manifest = JSON.parse( utils.base64ToString( body.content ));
    } catch ( e ) {
      callback( e );
      return;
    }
    _.extend( pkg, manifest );
    callback( null, manifest );
  });
}

// Updates package with latest script from GH
function updateScript ( pkg, callback ) {
  github.getContent( pkg, pkg.script, function ( err, req, body ) {
    if ( err ) {
      callback( err );
      return;
    }

    // Store script buffer with database records
    pkg.scriptFile = utils.base64ToBuffer( body.content );
    callback( null, pkg.scriptFile );
  });
}

// Updates `updated` and `watchers` count in package
function updateInfo ( pkg, content, callback ) {
  pkg.updated = content.updated_at;
  pkg.watchers = content.watchers_count;
  callback( null );
}
