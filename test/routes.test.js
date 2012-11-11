process.env.NODE_ENV = 'test';
var
  service = require( '../server' ),
  mongoose = require( 'mongoose' ),
  config = require( '../config' ).test,
  helpers = require( './helpers/helpers' ),
  chai    = require( 'chai' ),
  should  = chai.should(),
  expect  = chai.expect,
  postManifest = helpers.postManifest,
  db, models;

// Clear out test database before start
before(function ( done ) {
  db = mongoose.connection;
  models = require( '../models' )({ mongoose: mongoose, db: db });
  models.Packages.find( {} ).remove(function ( err, pkg ) {
    if ( !err ) { done(); }
  });
});

after(function ( done ) {
  models.Packages.find( {} ).remove(function ( err, pkg ) {
    if ( !err ) { done(); }
  });
});

//
// POST /packages
//

describe( 'POST /packages', function () {
  it( 'rejects manifests without a name', function ( done ) {
    postManifest( 'no-name', function ( err, res, body ) {
      res.statusCode.should.equal( 400 );
      body.error.should.contain( 'ValidatorError' );
      done();
    });
  });
  
  it( 'rejects manifests without a repo', function ( done ) {
    postManifest( 'no-repo', function ( err, res, body ) {
      res.statusCode.should.equal( 400 );
      body.error.should.contain( 'ValidatorError' );
      done();
    });  
  });

  it( 'rejects manifests without a description', function ( done ) {
    postManifest( 'no-description', function ( err, res, body ) {
      res.statusCode.should.equal( 400 );
      body.error.should.contain( 'ValidatorError' );
      done();
    });
  });

  it( 'rejects manifests without a script', function ( done ) {
    postManifest( 'no-script', function ( err, res, body ) {
      res.statusCode.should.equal( 400 );
      body.error.should.contain( 'ValidatorError' );
      done();
    });
  });

  it( 'rejects manifests with names containing characters other than alpha, numeric and dashes', function () {
    
  });
  it( 'rejects manifests with names that don\'t start with a letter', function () {
    
  });
  it( 'rejects manifests with names less than 1 or greater than 30 characters', function () {
    
  });

  it( 'some repo validation?', function () {
    
  });

  it( 'adds valid packages to the repo', function () {

  });
});


describe( 'GET /packages/:name', function () {

});

describe( 'GET /packages', function () {

});

describe( 'GET /packages/search/:name', function () {

});
