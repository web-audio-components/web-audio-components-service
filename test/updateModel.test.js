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
  cHelper    = require('../lib/component-utils'),
  Component  = require('../models').Component,
  clear      = require('./helpers/clear');

var
  overdrive = require('../mocks/components/web-audio-components-overdrive/component.json'),
  delay     = require('../mocks/components/web-audio-components-delay/component.json'),
  filter    = require('../mocks/components/web-audio-components-filter/component.json'),
  builtOverdrive = fs.readFileSync(__dirname + '/testData/builtOverdrive.js', 'utf-8');

describe('Update Model', function () {
  beforeEach(clear);
  afterEach(clear);

  it('should update a new, unsaved model', function (done) {
    var model = new Component();
    update(model, delay).then(function (saved) {
      expect(saved).to.equal(model);
      expect(model.name).to.equal('delay');
      done();
    });
  });

  it('should add dependencies to model', function (done) {
    var model = new Component();
    update(model, delay).then(function () {
      expect(model.dependencies).to.have.length(1);
      expect(model.dependencies[0].name).to.equal('web-audio-components/filter');
      done();
    });
  });

  it('should store dependents', function (done) {
    var model = new Component();
    update(model, filter).then(function () {
      expect(model.dependents).to.have.length(1);
      expect(model.dependents[0]).to.equal('web-audio-components/delay');
      done();
    });
  });

  it('should update an existing model', function (done) {
    var model = new Component();
    update(model, delay).then(function () {
      return Component.findOne({ name: 'delay' }).exec();
    }).then(function (model) {
      delay.version = '1.0.0';
      return update(model, delay);
    }).then(function (model) {
      expect(model.version).to.equal('1.0.0');
      done();
    });
  });

  it('should build the component', function (done) {
    var model = new Component();
    update(model, overdrive).then(function () {
      return Component.findOne({ name: 'overdrive' }).exec();
    }).then(function () {
      expect(model.build.length).to.equal(builtOverdrive.length);
      done();
    });
  });
});
