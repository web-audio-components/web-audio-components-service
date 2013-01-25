function MockTwitter (options) {
  this.options = options;
}

MockTwitter.prototype.post = function (route, obj, callback) {
  callback(null, {
    text: obj.status
  });
};

module.exports = MockTwitter;
