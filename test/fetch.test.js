process.env.NODE_ENV = 'test';

var
  chai    = require( 'chai' ),
  should  = chai.should(),
  expect  = chai.expect,
  service = require( '../server' ),
  fetch   = require('../lib/fetch');

describe('Registry Fetch', function () {
  it('should fetch and return array of only audio components', function (done) {
    fetch().then(function (data) {
      expect(data).to.have.length(3);
      done();
    });
  });
});
