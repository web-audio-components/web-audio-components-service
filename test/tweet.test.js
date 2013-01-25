process.env.NODE_ENV = 'test';

var
  chai    = require('chai'),
  should  = chai.should(),
  expect  = chai.expect,
  service = require('../server'),
  tweet   = require('../lib/tweet');

var fullModel = {
  "name": "comb",
  "repo": "web-audio-components/comb",
  "description": "A comb filter effect.",
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

var minimalModel = {
  "name": "comb",
  "repo": "web-audio-components/comb",
  "description": "A comb filter effect module for the Web Audio API.",
  "version": "0.0.1",
  "author": "Nick Thompson <ncthom91@gmail.com>",
  "dependencies": {},
  "license": "MIT",
  "scripts": [
    "index.js"
  ]
};

var fullExpected = "new effect: web-audio-components/comb - http://git.io/xxxxxx from @ncthom91 [0.0.1] A comb filter effect. #filter #comb #MOCK... ★0";

var minimalExpected = "new: web-audio-components/comb - http://git.io/xxxxxx [0.0.1] A comb filter effect module for the Web Audio API.... ★0";

describe('Tweets', function () {
  it('should post a message with twitter account, type, keywords', function (done) {
    tweet(fullModel, function (err, res) {
      expect(err).to.not.be.ok;
      expect(res.text).to.equal(fullExpected);
      done();
    });
  });
  
  it('should post a message without twitter account, type, keywords', function (done) {
    tweet(minimalModel, function (err, res) {
      expect(err).to.not.be.ok;
      expect(res.text).to.equal(minimalExpected);
      done();
    });
  });
});
