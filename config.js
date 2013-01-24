var
  env = process.env.NODE_ENV,
  config;

config = {
  production : {
    db : {
      URL : process.env['wapm_service_mongodb_url']
    },
    componentInstallDir : 'components',
    componentBuildDir : 'build',
    componentsURL : 'http://50.116.26.197/components/all',
    github_client_id : process.env['wapm_github_client_id'],
    github_client_secret : process.env['wapm_github_client_secret'],
    port : 80
  },
  development : {
    db : {
      URL : 'mongodb://localhost:27017/wapm-service'
    },
    componentsURL : 'http://50.116.26.197/components/all',
    componentInstallDir : 'components',
    componentBuildDir : 'build',
    github_client_id : process.env['wapm_github_client_id'],
    github_client_secret : process.env['wapm_github_client_secret'],
    port : 8000
  },
  test : {
    db : {
      URL : 'mongodb://localhost:27017/wapm-service-test'
    },
    componentsURL : 'http://localhost:8000/mock/registry',
    componentInstallDir : 'test/components',
    componentBuildDir : 'test/build',
    github_client_id : process.env['wapm_github_client_id'],
    github_client_secret : process.env['wapm_github_client_secret'],
    port : 8000
  } 
};

config = config[ env || 'development' ];
config.isTest = env === 'test';

module.exports = config;
