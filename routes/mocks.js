var
  registry = require('../mocks/registry');

exports.registry = function (req, res) {
  res.json(registry);
};
