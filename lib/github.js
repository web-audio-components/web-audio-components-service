var
  request = require( 'request' ),
  config = require( '../config' ),
  githubMock = require( './githubMock' );

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


module.exports = {
  getRepo : config.isTest ? githubMock.getRepo : getRepo,
  getContent : config.isTest ? githubMock.getContent : getContent
};

