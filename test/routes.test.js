process.env.NODE_ENV = 'test';
var
  service = require( '../server' ),
  mongoose = require( 'mongoose' ),
  config = require( '../config' ),
  helpers = require( './helpers/helpers' ),
  curry = require( 'curry' ),
  async = require( 'async' ),
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
  models = require( '../models' );
  models.Packages.find({ name: /simple/ }).remove(function ( err, pkg ) {
    if ( !err ) { done(); }
  });
});

after(function ( done ) {
  models.Packages.find({ name: /simple/ }).remove(function ( err, pkg ) {
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
      invalidRepoError( err, res, body, done );
    });
  });

  it( 'adds valid packages to the repo', function ( done ) {
    async.parallel([
      curry([ 'valid-simple-reverb' ], postManifestSuccess ),
      curry([ 'valid-simple-gain' ], postManifestSuccess ),
      curry([ 'valid-simple-delay' ], postManifestSuccess )
    ], function ( err ) {
      helpers.isSeeded = true;
      done();
    });
  });

  // TODO probably should return a 400 with a better message!!
  it( 'rejects a manifest with the same name as an existing one', function ( done ) {
    postManifest( 'valid-simple-reverb', function ( err, res, body ) {
      res.statusCode.should.equal( 400 );
      body.error.should.contain( 'duplicate' );
      done();
    });
  });
});

describe( 'GET /packages', function () {

  it( 'returns all available packages', function ( done ) {
    getPackage(function ( err, res, body ) {
      expect( err ).to.be.falsey;
      // Should return atleast 3 packages
      body.length.should.be.above( 2 );
      done();
    });
  });

  it( 'does not include scriptFile and other mongoose properties', function ( done ) {
    getPackage(function ( err, res, body ) {
      expect( body[ 0 ]._id ).to.be.falsey;
      expect( body[ 0 ].__v ).to.be.falsey;
      expect( body[ 0 ].scriptFile ).to.be.falsey;
      done();
    });
  });

  // TODO
  it( 'returns available packages in alphabetical order', function ( done ) {
    done();
  });
});


describe( 'GET /packages/:name', function () {

  it( 'returns one package of the correct name', function ( done ) {
    getPackage( 'simple-reverb', function ( err, res, body ) {
      body.name.should.equal( 'simple-reverb' );
      body.repo.should.equal( 'wapm/simple-reverb' );
      done();
    });
  });

  it( 'does not include scriptFile and other mongoose properties', function ( done ) {
    getPackage( 'simple-reverb', function ( err, res, body ) {
      expect( body._id ).to.be.falsey;
      expect( body.__v ).to.be.falsey;
      expect( body.scriptFile ).to.be.falsey;
      done();
    });
  });
});

describe( 'GET /packages/search/:name', function () {

  it( 'searches the name for query, exact', function ( done ) {
    searchPackages( 'simple-gain', function ( err, res, body ) {
      expect( !!err ).to.be.equal( false );
      body.should.have.length( 1 );
      body[ 0 ].name.should.equal( 'simple-gain' );
      done();
    });
  });

  it( 'searches the name for query, fuzzy', function ( done ) {
    searchPackages( 'simple-', function ( err, res, body ) {
      expect( !!err ).to.be.equal( false );
      body.should.have.length( 3 );
      done();
    });
  });

  it( 'searches the description for query, case-insensitive', function ( done ) {
    searchPackages( 'mt-2', function ( err, res, body ) {
      expect( !!err ).to.be.equal( false );
      body.should.have.length( 1 );
      body[ 0 ].name.should.equal( 'simple-gain' );
      done();
    });
  });
  
  it( 'searches the keywords for query', function ( done ) {
    searchPackages( 'chorus', function ( err, res, body ) {
      expect( !!err ).to.be.equal( false );
      body.should.have.length( 1 );
      body[ 0 ].name.should.equal( 'simple-delay' );
      done();
    });
  });

  it( 'does not include scriptFile and other mongoose properties', function ( done ) {
    getPackage(function ( err, res, body ) {
      expect( body[ 0 ]._id ).to.be.falsey;
      expect( body[ 0 ].__v ).to.be.falsey;
      expect( body[ 0 ].scriptFile ).to.be.falsey;
      done();
    });
  });
});

function invalidRepoError ( err, res, body, done ) {
  res.statusCode.should.equal( 400 );
  body.error.should.match(/ENOENT/);
  done();
}

function validatorError ( err, res, body, done ) {
  res.statusCode.should.equal( 400 );
  body.error.should.match(/ValidatorError/);
  done();
}

function postManifestSuccess ( manifest, callback ) {
  postManifest( manifest, function ( err, res, body ) {
    res.statusCode.should.equal( 200 );
    callback();
  });
}
