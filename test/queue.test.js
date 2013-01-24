process.env.NODE_ENV = 'test';

var
  chai    = require( 'chai' ),
  should  = chai.should(),
  expect  = chai.expect,
  service = require( '../server' ),
  queue   = require('../lib/queue');

describe('Queue Helper', function () {
  it('should execute the function on all items in a collection', function (done) {
    var
      collection = 'abcdefghijklmnopqrstuvwxyz'.split(''),
      counter = 0;
    queue(collection, function (data, callback) {
      ++counter && callback();
    }, function () {
      expect(counter).to.equal(collection.length);
      done();
    });
  });
});
