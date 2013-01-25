var
  fs = require('fs');

exports.registry = function (req, res) {
  fs.readFile(__dirname + '/../mocks/registry.json', 'utf-8', function (err, data) {
    res.json(JSON.parse(data));
  });
};
