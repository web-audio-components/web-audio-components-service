process.env.NODE_ENV = 'test';
var
  service    = require('../server'),
  fs         = require('fs'),
  api        = require('./helpers/api'),
  clear      = require('./helpers/clear'),
  async      = require('async'),
  chai       = require('chai'),
  should     = chai.should(),
  expect     = chai.expect,
  seed       = require('../lib/seed'),
  config     = require('../config'),
  installDir = config.componentInstallDir,
  buildDir   = config.componentBuildDir;

describe('Routes', function () {

  beforeEach(function (done) {
    this.timeout(2000);
    async.series([
      clear,
      seed
    ], done);
  });

  afterEach(clear);

  describe('GET /components', function () {

    it('returns all available components', function (done) {
      api.get(function (err, res, body) {
        expect(err).to.not.be.ok;
        // Should return atleast 3 components
        body.length.should.be.above( 2 );
        done();
      });
    });

    // TODO
    it('returns available components in alphabetical order');
  });


  describe('GET /components/:owner/:name', function () {
    it('returns one package of the correct name', function (done) {
      api.get('web-audio-components/overdrive', function (err, res, body) {
        body.name.should.equal('overdrive');
        body.repo.should.equal('web-audio-components/overdrive');
        done();
      });
    });
  });

  describe('GET /components?q=query', function () {

    it('searches the name for query, exact', function (done) {
      api.search('overdrive', function (err, res, body) {
        expect(err).to.not.be.ok;
        body.should.have.length(1);
        body[0].name.should.equal('overdrive');
        done();
      });
    });

    it('searches the name for query, fuzzy', function (done) {
      api.search('e', function (err, res, body) {
        expect(err).to.not.be.ok;
        body.should.have.length(3);
        done();
      });
    });

    it('searches the description for query, case-insensitive', function (done) {
      api.search('simple', function (err, res, body) {
        expect(err).to.not.be.ok;
        body.should.have.length(1);
        body[0].name.should.equal('delay');
        done();
      });
    });

    it( 'searches the keywords for query', function (done) {
      api.search('feedback', function (err, res, body) {
        expect(err).to.not.be.ok;
        body.should.have.length(1);
        body[0].name.should.equal('comb');
        done();
      });
    });
  });

  describe('GET /components/:owner/:repo/script.js', function () {
    it('returns the script', function (done) {
      api.getScript('web-audio-components/delay', function (err, res, body) {
        expect(err).to.not.be.ok;
        fs.readFile(installDir + '/web-audio-components-delay/index.js', 'utf-8', function (err, data) {
          expect(body).to.equal(data);
          done();
        });
      });
    });
  });

  describe('GET /components/:owner/:repo/build.js', function () {
    it('returns the built script', function (done) {
      api.getBuild('web-audio-components/delay', function (err, res, body) {
        expect(err).to.not.be.ok;
        fs.readFile(buildDir + '/web-audio-components-delay/build.js', 'utf-8', function (err, data) {
          expect(body).to.equal(data);
          done();
        });
      });
    });
  });

});
