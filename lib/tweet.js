var
  config  = require('../config'),
  tConfig = config.twitter || {},
  Twitter = require('./twitter'),
  gitio   = require('./gitio'),
  twitter = new Twitter({
    consumer_key : tConfig.consumerKey,
    consumer_secret : tConfig.consumerSecret,
    access_token : tConfig.accessToken,
    access_token_secret : tConfig.accessTokenSecret
  }),
  MAX_CHARS = 140;

function tweet (model, callback) {
  format(model, function (err, message) {
    if (!err) {
      twitter.post('statuses/update', { status: message }, callback);
    } else {
      callback(err);
    }
  });
}

function format (model, callback) {
  var
    type = model.type || '',
    repo = model.repo,
    version = model.version,
    desc = model.description || '',
    stars = model.stars || 0,
    keywords = model.keywords || [],
    url = 'https://github.com/' + repo,
    message, endMessage;

  gitio(url, function (err, shortUrl) {
    endMessage = '... ★' + stars;
    message  = 'new ' + type + ': ' + repo + ' - ' + shortUrl;
    message += ' [' + version + '] ' + desc;
    keywords.forEach(function (keyword) {
      message += ' #' + keyword;
    });
    message = message.substr(0, MAX_CHARS - endMessage.length);
    message += endMessage;

    callback(err, message);
  });
}

module.exports = tweet;
