var github = require( './github' );

module.exports = function () {
}

function task ( pkg, callback ) {
  github.getRepo( pkg, function ( err, res, body ) {
    var updated = new Date( body.updated_at );
    
    // Check if repo has been updated since last check
    // update properties accordingly if so
    if ( updated > pkg.updated ) {
      github.getContent( pkg, 'wapm.json', function ( err, res, body ) {

      });
    } else {
      // just update watchers count
      pkg.watchers = body.watchers_count;
    }

    
  });
}
