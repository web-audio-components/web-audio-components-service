var config = {
  production : {
    db : {
      URL : process.env['wapm_service_mongodb_url']
    },
    github_client_id : process.env['wapm_github_client_id'],
    github_client_secret : process.env['wapm_github_client_secret'],
    port : 80
  },
  development : {
    db : {
      URL : 'mongodb://localhost:27017/wapm-service'
    },
    github_client_id : process.env['wapm_github_client_id'],
    github_client_secret : process.env['wapm_github_client_secret'],
    port : 8000
  },
  test : {
    db : {
      URL : 'mongodb://localhost:27017/wapm-service-test'
    },
    github_client_id : process.env['wapm_github_client_id'],
    github_client_secret : process.env['wapm_github_client_secret'],
    port : 8000
  } 
};

module.exports = config[ process.env.NODE_ENV || 'development' ];
