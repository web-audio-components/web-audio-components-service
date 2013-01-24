var
  fs          = require('fs'),
  Component   = require('../models').Component,
  config      = require('../config'),
  buildDir    = config.componentBuildDir,
  installDir  = config.componentInstallDir,
  handleError = require('../lib/handleError');

var
  RETURN_FIELDS = [
    'name', 'repo', 'main', 'description', 'scripts',
    'dependencies', 'keywords', 'updated', 'type',
    'twitter', 'license'
  ].join(' ');

// GET /components
exports.index = function (req, res, next) {
  Component.find({}, RETURN_FIELDS, function (err, components) {
    if ( !err ) {
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
    if (!err) {
      res.json(pkg ? pkg : {}); 
    } else {
      handleError(err, next);
    }
  });
};

// GET /components/search/:query
exports.search = function (req, res, next) {
  Component.search(req.params.query, RETURN_FIELDS, function (err, components) {
    if (!err) {
      res.json(components);
    } else {
      handleError(err, next);
    }
  });
};

// GET /components/:owner/:name/script.js
exports.getScript = function (req, res, next) {
  var name = req.params.owner + '/' + req.params.name;
  Component.findOne({ repo: name }, 'main', function (err, pkg) {
    if (!err) {
      fs.readFile(installDir + '/' + pkg.repo + '/' + pkg.main, function (err, buffer) {
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
  var name = req.params.owner + '/' + req.params.name;
  fs.readFile(buildDir + '/' + name + '/' + 'build.js', function (err, buffer) {
    if (!err) {
      res.send(buffer);
    } else {
      handleError(err, next);
    }
  });
};
