// githubMock
// Used to mock requests to GitHub with FS
// for testing environment

var fs = require( 'fs' );
var repoCache = {};
var contentCache = {};

module.exports = {
  getRepo : function ( pkg, callback ) {
    // Store the file contents in a cache so it can be accessed,
    // modified in tests to simulate repo changes after seeding from file
    if ( !repoCache[ pkg.repo ] ) {
      fs.readFile( __dirname + '/../test/repos/' + pkg.repo + '/wapm.json', function ( err, data ) {
        if ( !err ) {
          repoCache[ pkg.repo ] = {
            watchers_count : 5,
            updated_at: (new Date()).toISOString()
          };
        }
        callback( err, null, repoCache[ pkg.repo ] );
      });
    } else {
      callback( null, null, repoCache[ pkg.repo ]);
    }
  },

  getContent : function ( pkg, content, callback ) {
    // Store the file contents in a cache so it can be accessed,
    // modified in tests to simulate repo changes after seeding from file
    if ( !contentCache[ pkg.repo + '/' + content ] ) {
      fs.readFile( __dirname + '/../test/repos/' + pkg.repo + '/' + content, function ( err, data ) {
        if ( !err ) {
          contentCache[ pkg.repo + '/' + content ] = {
            content: data.toString('base64'),
            updated_at: (new Date()).toISOString()
          };
        }
        callback( err, null, contentCache[ pkg.repo + '/' + content ]);
      });
    } else {
      callback( null, null, contentCache[ pkg.repo + '/' + content ]);
    }
  },

  repoCache : repoCache,
  contentCache : contentCache
}
