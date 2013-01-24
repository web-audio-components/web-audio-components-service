var
  async       = require('async'),
  dive        = require('dive'),
  fs          = require('fs'),
  Component   = require('../models').Component,
  updateModel = require('./updateModel'),
  mockDir     = __dirname + '/../mocks/components';

function findFiles (callback) {
  var manifests = [];
  dive(mockDir, function (err, file) {
    if (!err && /component.json$/.test(file)) {
      manifests.push(file);
    }
  }, function () {
    async.map(manifests, createComponent, function (err, results) {
      callback(err, manifests.length);
    });
  });
}

function createComponent (path, callback) {
  var model;
  fs.readFile(path, 'utf-8', function (err, json) {
    model = new Component();
    updateModel(model, JSON.parse(json), callback);
  });
}

module.exports = findFiles;
