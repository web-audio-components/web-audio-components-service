// TODO Use GH API for this?
var
  request = require( 'request' ),
  config = require( '../config' ),
  githubMock = require( './githubMock' ),
  isTest = process.env.NODE_ENV === 'test';

function getRepo ( pkg, callback ) {
  var options = {
    uri : 'https://api.github.com/repos/' + pkg.repo,
    json: true,
    qs : {
      client_id : config.github_client_id,
      client_secret : config.github_client_secret
    }
  };
  request( options, callback );
}

function getContent ( pkg, content, callback ) {
  var options = {
    uri : 'https://api.github.com/repos/' + pkg.repo + '/contents/' + content,
    json : true,
    qs : {
      client_id : config.github_client_id,
      client_secret : config.github_client_secret
    }
  };
  request( options, callback );
}

function base64ToBuffer ( data ) {
  return new Buffer( data, 'base64' );
}

module.exports = {
  getRepo : isTest ? githubMock.getRepo : getRepo,
  getContent : isTest ? githubMock.getContent : getContent,
  base64ToBuffer : base64ToBuffer
};

