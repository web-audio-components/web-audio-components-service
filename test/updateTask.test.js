var
  async = require( 'async' ),
  curry = require( 'curry' ),
  _ = require( 'underscore' ),
  utils = require( '../lib/utils' ),
  config = require( '../config' ),
  githubMock = require( '../lib/githubMock' ),
  helpers = require( './helpers/helpers' ),
  chai    = require( 'chai' ),
  should  = chai.should(),
  expect  = chai.expect,
  postManifest = helpers.postManifest,
  getPackage = helpers.getPackage,
  getScript = helpers.getScript,
  searchPackages = helpers.searchPackages,
  updateTask = require( '../lib/updateTask' ),
  models;

// Clear out test database before start
before(function ( done ) {
  models = require( '../models' );
  models.Packages.find({ name: /update/ }).remove(function ( err, pkg ) {
    async.parallel([
      curry([ 'update-test-module-1' ], postManifest ),
      curry([ 'update-test-module-2' ], postManifest ),
      curry([ 'update-test-module-3' ], postManifest )
    ], function ( err ) {
      // After test modules submitted, run update task
      updateTask(function () {
        done();
      });
    });
  });
});

after(function ( done ) {
  models.Packages.find({ name: /update/ }).remove(function ( err, pkg ) {
    if ( !err ) { done(); }
    else { console.log( err ); }
  });
});

describe( 'Updating info from GitHub', function () {

  it( 'updates watcher count', function ( done ) {
    getPackage( 'update-test-module-1', function ( err, res, body ) {
      body.watchers.should.equal( 5 );
      done();
    });
  });

  it( 'updates "updated" time', function ( done ) {
    var newTime = (new Date()).toISOString();
    githubMock.repoCache[ 'wapm/update-test-module-1' ].updated_at = newTime;
    updateTask(function () {
      getPackage( 'update-test-module-1', function ( err, res, body ) {
        body.updated.should.equal( newTime );
        done();
      });
    });
  });

});

describe( 'Updates properties', function () {

  // This should not happen -- mainly testing not querying when GH
  // hasn't been updated after the databases changes
  it( 'does not update properties when the GH repo hasn\'t been updated', function ( done ) {
    var
      wapm = githubMock.contentCache[ 'wapm/update-test-module-1/wapm.json' ];

    wapm.content = mergeWithBase64Json( wapm.content, { description: 'new desc' });
    updateTask(function () {
      getPackage( 'update-test-module-1', function ( err, res, body ) {
        body.description.should.not.equal( 'new desc' );
        done();
      });
    });
  });
  
  it( 'updates properties when GH repo changed', function ( done ) {
    var
      wapm = githubMock.contentCache[ 'wapm/update-test-module-1/wapm.json' ],
      newTime = (new Date()).toISOString();

    githubMock.repoCache[ 'wapm/update-test-module-1' ].updated_at = newTime;
    wapm.content = mergeWithBase64Json( wapm.content, { keywords: [ 'test_key', 'test_key2' ] });
    updateTask(function () {
      getPackage( 'update-test-module-1', function ( err, res, body ) {
        body.keywords.should.include( 'test_key' );
        body.keywords.should.include( 'test_key2' );
        body.keywords.should.have.length( 2 );
        done();
      });
    });
  });

  it( 'does not update "reserved" properties such as watchers, updated', function ( done ) {
    var
      wapm = githubMock.contentCache[ 'wapm/update-test-module-3/wapm.json' ],
      newTime = (new Date()).toISOString();

    githubMock.repoCache[ 'wapm/update-test-module-3' ].updated_at = newTime;
    wapm.content = mergeWithBase64Json( wapm.content, {
      description: 'some new desc',
      watchers: 500,
      updated: '1970-01-01T00:00:00.000Z'
    });

    updateTask(function () {
      getPackage( 'update-test-module-3', function ( err, res, body ) {
        body.watchers.should.not.equal( 500 );
        body.updated.should.not.equal( '1970-01-01T00:00:00.000Z' );
        body.description.should.equal( 'some new desc' );
        done();
      });
    });
  });
});

describe( 'Updates scriptFile', function () {
  
  it( 'should update scriptFile when changed', function ( done ) {
    var
      script = githubMock.contentCache[ 'wapm/update-test-module-2/update-module-2.js' ],
      newTime = (new Date()).toISOString();

    githubMock.repoCache[ 'wapm/update-test-module-2' ].updated_at = newTime;
    script.content = utils.stringToBase64( '//my test script' );
    updateTask(function () {
      getScript( 'update-test-module-2', function ( err, res, body ) {
        body.toString('base64').should.equal( '//my test script' );
        done();
      });
    });
  });

});

function mergeWithBase64Json ( json, addition ) {
  json = JSON.parse( utils.base64ToString( json ));
  _.extend( json, addition );
  return utils.stringToBase64( JSON.stringify( json ));
}
