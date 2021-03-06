var
  config  = require('../config'),
  tConfig = config.twitter || {},
  Twitter = require('./modules/twitter'),
  gitio   = require('./modules/gitio'),
  defer   = require('when').defer,
  twitter = new Twitter({
    consumer_key : tConfig.consumerKey,
    consumer_secret : tConfig.consumerSecret,
    access_token : tConfig.accessToken,
    access_token_secret : tConfig.accessTokenSecret
  }),
  MAX_CHARS = 140;

function tweet (model) {
  var deferred = defer();
  format(model, function (err, message) {
    if (err) return deferred.reject(err);
    twitter.post('statuses/update', { status: message }, function (err, reply) {
      if (err) deferred.reject(err);
      else deferred.resolve(reply); 
    });
  });
  return deferred.promise;
}

function format (model, callback) {
  var
    type = model.type || '',
    repo = model.repo,
    version = model.version,
    desc = model.description || '',
    account = model.twitter,
    stars = model.stars || 0,
    keywords = model.keywords || [],
    url = 'https://github.com/' + repo,
    message, endMessage;

  gitio(url, function (err, shortUrl) {
    endMessage = '... ★' + stars;
    message  = 'new' + (type ? ' ' + type : '');
    message += ': ' + repo + ' - ' + shortUrl;
    if (account) {
      message += ' from ';
      message += account[0] === '@' ? account : '@' + account;
    }
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
