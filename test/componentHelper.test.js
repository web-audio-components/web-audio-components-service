process.env.NODE_ENV = 'test';

var
  chai       = require('chai'),
  should     = chai.should(),
  expect     = chai.expect,
  fs         = require('fs'),
  config     = require('../config'),
  installDir = config.componentInstallDir,
  buildDir   = config.componentBuildDir,
  utils      = require('../lib/utils'),
  clear      = require('./helpers/clear'),
  helper     = require('../lib/componentHelper');

var
  overdrive = require('../mocks/components/web-audio-components-overdrive/component.json'),
  delay     = require('../mocks/components/web-audio-components-delay/component.json');

describe('Component Helper', function () {

  before(clear);
  after(clear);

  describe('Install', function () {
    // Maybe a better way to test implementation rather than use mock?
    // Don't want to hammer components service
    it('should call install and fire the callback', function (done) {
      helper.install({ repo: 'what/ever', version: '*' }, function () {
        done();
      });
    });
  });

  describe('Build', function () {
    it('should build component to build directory', function (done) {
      helper.build(delay, function (err) {
        var build = utils.getBuildScriptPath(delay.repo);
        expect(err).to.not.be.ok;
        fs.stat(build, function (err, stats) {
          expect(stats.size).to.equal(3222);
          done();
        });
      });
    });
    it('returns an error if invalid repo', function (done) {
      helper.build({ repo: 'not/real', version: '*' }, function (err) {
        expect(err).to.be.ok;
        done();
      });
    });
  });
});
