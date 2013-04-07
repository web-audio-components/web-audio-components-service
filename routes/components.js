var
  fs          = require('fs'),
  Component   = require('../models').Component,
  config      = require('../config'),
  utils       = require('../lib/utils'),
  logger      = require('../lib/logger');

var
  RETURN_FIELDS = [
    'name', 'repo', 'main', 'description', 'scripts',
    'dependencies', 'keywords', 'updated', 'type',
    'twitter', 'license', 'version', 'stars', 'author',
    'dependents'
  ].join(' ');

// GET /components
// GET /components/?=query
// TODO Probably can cache the entire result
exports.index = function (req, res, next) {
  var query = req.query.q;
  Component[query ? 'search' : 'find'](query || {}, RETURN_FIELDS, function (err, components) {
    if (!err) {
      res.json(components);
    } else {
      next(err);
    }
  });
};

// GET /components/:owner/:name
exports.show = function (req, res, next) {
  var name = req.params.owner + '/' + req.params.name;
  Component.findOne({ repo: name }, RETURN_FIELDS, function (err, pkg) {
    if (!err && pkg) {
      res.json(pkg);
    } else if (!err && !pkg) {
      res.status(400).json({});
    } else {
      next(err);
    }
  });
};

// GET /components/:owner/:name/build.js
exports.getBuild = function (req, res, next) {
  var repo = req.params.owner + '/' + req.params.name;
  Component.findOne({ repo: repo }, 'build', function (err, pkg) {
    if (!err && pkg) {
      res.send(pkg.build);
    } else if (!err && !pkg) {
      res.status(400).send();
    } else {
      next(err);
    }
  });
};
