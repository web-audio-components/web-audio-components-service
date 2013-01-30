process.env.NODE_ENV = 'test';

var
  chai       = require('chai'),
  should     = chai.should(),
  expect     = chai.expect,
  service    = require('../server'),
  fs         = require('fs'),
  config     = require('../config'),
  installDir = config.componentInstallDir,
  buildDir   = config.componentBuildDir,
  utils      = require('../lib/utils'),
  update     = require('../lib/updateModel'),
  cHelper    = require('../lib/componentHelper'),
  Component  = require('../models').Component,
  clear      = require('./helpers/clear');

var
  overdrive = require('../mocks/components/web-audio-components-overdrive/component.json'),
  delay     = require('../mocks/components/web-audio-components-delay/component.json'),
  builtOverdrive = fs.readFileSync(__dirname + '/testData/builtOverdrive.js', 'utf-8');

describe('Update Model', function () {
  beforeEach(clear);
  afterEach(clear);
  it('should update a new, unsaved model', function (done) {
    var model = new Component();
    update(model, delay, function (err) {
      expect(err).to.not.be.ok;
      expect(model.name).to.equal('delay');
      done();
    });
  });

  it('should add dependencies to model', function (done) {
    var model = new Component();
    update(model, delay, function (err) {
      expect(err).to.not.be.ok;
      expect(model.dependencies).to.have.length(1);
      expect(model.dependencies[0].name).to.equal('web-audio-components/filter');
      done();
    });
  });

  it('should update an existing model', function (done) {
    var model = new Component();
    update(model, delay, function (err) {
      Component.findOne({ name: 'delay' }, function (err, model) {
        delay.version = '1.0.0';
        update(model, delay, function (err) {
          expect(err).to.not.be.ok;
          expect(model.version).to.equal('1.0.0');
          done();
        });
      });
    });
  });

  it('should build the component', function (done) {
    var model = new Component();
    update(model, overdrive, function (err) {
      Component.findOne({ name: 'overdrive' }, function (err, comp) {
        expect(err).to.not.be.ok;
        expect(model.build.length).to.equal(builtOverdrive.length);
        done();
      });
    });
  });
});
