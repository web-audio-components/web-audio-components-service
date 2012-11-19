module.exports = {
  production : {
    db : {
      URL : process.env['wapm_service_mongodb_url']
    },
    github_token : process.env['wapm_github_token'],
    port : 80
  },
  development : {
    db : {
      URL : 'mongodb://localhost:27017/wapm-service'
    },
    github_token : process.env['wapm_github_token'],
    port : 8000
  },
  test : {
    db : {
      URL : 'mongodb://localhost:27017/wapm-service-test'
    },
    github_token : process.env['wapm_github_token'],
    port : 8000
  } 
};
