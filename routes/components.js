var
  fs          = require('fs'),
  Component   = require('../models').Component,
  config      = require('../config'),
  utils       = require('../lib/utils'),
  handleError = require('../lib/handleError');

var
  RETURN_FIELDS = [
    'name', 'repo', 'main', 'description', 'scripts',
    'dependencies', 'keywords', 'updated', 'type',
    'twitter', 'license', 'version'
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
      handleError(err, next);
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
      handleError(err, next);
    }
  });
};

// GET /components/:owner/:name/script.js
exports.getScript = function (req, res, next) {
  var
    repo = req.params.owner + '/' + req.params.name,
    path = utils.getInstallDir(repo);
  Component.findOne({ repo: repo }, 'main', function (err, pkg) {
    if (!err) {
      fs.readFile(path + pkg.main, function (err, buffer) {
        if (!err) {
          res.send(buffer);
        } else {
          handleError(err, next);
        }
      });
    } else {
      handleError(err, next);
    }
  });
};

// GET /components/:owner/:name/build.js
exports.getBuild = function (req, res, next) {
  var repo = req.params.owner + '/' + req.params.name;
  fs.readFile(utils.getBuildScriptPath(repo), function (err, buffer) {
    if (!err) {
      res.send(buffer);
    } else {
      handleError(err, next);
    }
  });
};
