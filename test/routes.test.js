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
  getPackage = helpers.getPackage,
  searchPackages = helpers.searchPackages,
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
      validatorError( err, res, body, done );
    });
  });

  it( 'rejects manifests without a repo', function ( done ) {
    postManifest( 'no-repo', function ( err, res, body ) {
      validatorError( err, res, body, done );
    });
  });

  it( 'rejects manifests without a description', function ( done ) {
    postManifest( 'no-description', function ( err, res, body ) {
      validatorError( err, res, body, done );
    });
  });

  it( 'rejects manifests without a script', function ( done ) {
    postManifest( 'no-script', function ( err, res, body ) {
      validatorError( err, res, body, done );
    });
  });

  // TODO a more robust test
  it( 'rejects manifests with names containing characters other than alpha, numeric and dashes', function ( done ) {
    postManifest( 'invalid-characters-name', function ( err, res, body ) {
      validatorError( err, res, body, done );
    });
  });

  it( 'rejects manifests with names that start with a number', function ( done ) {
    postManifest( 'starts-with-number-name', function ( err, res, body ) {
      validatorError( err, res, body, done );
    });
  });

  it( 'rejects manifests with names that start with a dash', function ( done ) {
    postManifest( 'starts-with-dash-name', function ( err, res, body ) {
      validatorError( err, res, body, done );
    });
  });

  it( 'rejects manifests with names less than 1 characters', function ( done ) {
    postManifest( 'less-than-one-name', function ( err, res, body ) {
      validatorError( err, res, body, done );
    });
  });

  it( 'rejects manifests with more than 30 characters in the name', function ( done ) {
    postManifest( '31-characters-name', function ( err, res, body ) {
      validatorError( err, res, body, done );
    });
  });

  it( 'rejects manifests that don\'t have a valid github repo', function ( done ) {
    postManifest( 'invalid-repo', function ( err, res, body ) {
      validatorError( err, res, body, done );
    });
  });

  it( 'adds valid packages to the repo', function ( done ) {
    var count = 0;
    postManifest( 'valid-simple-reverb', function ( err, res, body ) {
      res.statusCode.should.equal( 200 );
      doneCount();
    });
    postManifest( 'valid-simple-gain', function ( err, res, body ) {
      res.statusCode.should.equal( 200 );
      doneCount();
    });
    postManifest( 'valid-simple-delay', function ( err, res, body ) {
      res.statusCode.should.equal( 200 );
      doneCount();
    });

    // TODO use async module
    function doneCount () { count++; if ( count === 3 ) { done(); } }
  });

  // TODO probably should return a 400 with a better message!!
  it( 'rejects a manifest with the same name as an existing one', function ( done ) {
    postManifest( 'valid-simple-reverb', function ( err, res, body ) {
      res.statusCode.should.equal( 500 );
      body.error.should.contain( 'duplicate' );
      done();
    });
  });
});

describe( 'GET /packages', function () {

  it( 'returns all available packages', function ( done ) {
    getPackage(function ( err, res, body ) {
      expect( err ).to.be.falsey;
      body.should.have.length( 3 );
      done();
    });
  });

  it( 'returns available packages in alphabetical order', function ( done ) {
    done();
  });
});


describe( 'GET /packages/:name', function () {

});

describe( 'GET /packages/search/:name', function () {

  it( 'searches the name for query, exact', function ( done ) {
    searchPackages( 'simple-gain', function ( err, res, body ) {
      expect( err ).to.be.falsey;
      body.should.have.length( 1 );
      body[ 0 ].name.should.equal( 'simple-gain' );
      done();
    });
  });

  it( 'searches the name for query, fuzzy', function ( done ) {
    searchPackages( 'simple-', function ( err, res, body ) {
      expect( err ).to.be.falsey;
      body.should.have.length( 3 );
      done();
    });
  });

  it( 'searches the description for query', function ( done ) {
    searchPackages( 'cool', function ( err, res, body ) {
      expect( err ).to.be.falsey;
      body.should.have.length( 1 );
      body[ 0 ].name.should.equal( 'simple-gain' );
      done();
    });
  });
  
  it( 'searches the keywords for query', function ( done ) {
    searchPackages( 'plate', function ( err, res, body ) {
      expect( err ).to.be.falsey;
      body.should.have.length( 1 );
      body[ 0 ].name.should.equal( 'simple-reverb' );
      done();
    });
  });
});

function validatorError ( err, res, body, done ) {
  res.statusCode.should.equal( 400 );
  body.error.should.contain( 'ValidatorError' );
  done();
}
