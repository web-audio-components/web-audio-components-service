process.env.NODE_ENV = 'test';

var
  chai       = require('chai'),
  should     = chai.should(),
  expect     = chai.expect,
  fs         = require('fs'),
  server     = require('../server'),
  config     = require('../config'),
  installDir = config.componentInstallDir + '/',
  utils      = require('../lib/utils'),
  clear      = require('./helpers/clear'),
  helper     = require('../lib/componentHelper');

var
  overdrive  = require('../mocks/components/web-audio-components-overdrive/component.json'),
  delay      = require('../mocks/components/web-audio-components-delay/component.json'),
  builtDelay = fs.readFileSync(__dirname + '/testData/builtDelay.js', 'utf-8');

describe('Component Helper', function () {

  beforeEach(clear);
  afterEach(clear);

  describe('Install', function () {
    it('should pull down the component.json', function (done) {
      helper.install(overdrive, function (err) {
        expect(err).to.not.be.ok;
        fs.exists(utils.getInstallDir(overdrive.repo) + 'component.json', function (exists) {
          expect(exists).to.be.ok;
          done();
        });
      });
    });
  });

  describe('Build', function () {
    it('should build component and return the built js string in callback', function (done) {
      helper.install(delay, function (err) {
        helper.build(delay, function (err, js) {
          expect(err).to.not.be.ok;
          expect(js).to.equal(builtDelay);
          done();
        });
      });
    });
    it('returns an error if invalid repo', function (done) {
      helper.install(delay, function (err) {
        helper.build({ repo: 'not/real', version: '*' }, function (err, js) {
          expect(err).to.be.ok;
          expect(js).to.not.be.ok;
          done();
        });
      });
    });
  });
});
