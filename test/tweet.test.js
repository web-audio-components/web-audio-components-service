process.env.NODE_ENV = 'test';

var
  chai    = require('chai'),
  should  = chai.should(),
  expect  = chai.expect,
  service = require('../server'),
  tweet   = require('../lib/tweet');

var model = {
  "name": "comb",
  "repo": "web-audio-components/comb",
  "description": "A comb filter effect module for the Web Audio API.",
  "version": "0.0.1",
  "twitter": "ncthom91",
  "author": "Nick Thompson <ncthom91@gmail.com>",
  "keywords": [
    "filter",
    "comb",
    "MOCK"
  ],
  "dependencies": {},
  "license": "MIT",
  "scripts": [
    "index.js"
  ],
  "type": "effect"
};

var expected = "new effect: web-audio-components/comb - http://git.io/xxxxxx [0.0.1] A comb filter effect module for the Web Audio API. #filter #comb ... ★0";

describe('Tweets', function () {
  it('should accept a model and post a message', function (done) {
    tweet(model, function (err, res) {
      expect(err).to.not.be.ok;
      expect(res.text).to.equal(expected);
      done();
    });
  });
});
