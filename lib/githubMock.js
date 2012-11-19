// githubMock
// Used to mock requests to GitHub with FS
// for testing environment

var fs = require( 'fs' );

module.exports = {
  getRepo : function ( pkg, callback ) {
    // Hit the wapm.json instead, mock the repo response
    fs.readFile( __dirname + '/../test/repos/' + pkg.repo + '/wapm.json', function ( err, data ) {
      callback( err, {
        watchers: 0,
        updated_at: '2012-11-11T23:22:47Z'
      });
    });
  },

  getContent : function ( pkg, content, callback ) {
    fs.readFile( __dirname + '/../test/repos/' + pkg.repo + '/' + content, function ( err, data ) {
      callback( err, {
        content: data.toString('base64')
      });
    });
  }

}
