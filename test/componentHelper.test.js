process.env.NODE_ENV = 'test';

var
  chai       = require('chai'),
  should     = chai.should(),
  expect     = chai.expect,
  fs         = require('fs'),
  rimraf     = require('rimraf'),
  config     = require('../config'),
  installDir = config.componentInstallDir,
  buildDir   = config.componentBuildDir,
  helper     = require('../lib/componentHelper');

var
  overdrive = require('./components/web-audio-components/overdrive/component.json'),
  delay     = require('./components/web-audio-components/delay/component.json');

// Clear out test builds
after(function (done) {
  rimraf(buildDir, function (err) {
    done();
  });
});

describe('Component Helper: Install', function () {
  it('should install the component locally');
});

describe('Component Helper: Build', function () {
  it('should build component to build directory', function (done) {
    helper.build(delay, function (err) {
      expect(err).to.not.be.ok;
      fs.stat(buildDir + '/' + delay.repo + '/' + 'build.js', function (err, stats) {
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
