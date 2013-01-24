var
  env = process.env.NODE_ENV,
  config;

config = {
  production : {
    db : {
      URL : process.env['wac_service_mongodb_url']
    },
    componentsURL : 'http://50.116.26.197/components/all',
    componentInstallDir : __dirname + '/components',
    componentBuildDir : __dirname + '/build',
    port : 80
  },
  development : {
    db : {
      URL : 'mongodb://localhost:27017/wac-service'
    },
    componentsURL : 'http://50.116.26.197/components/all',
    componentInstallDir : __dirname + '/components',
    componentBuildDir : __dirname + '/build',
    port : 8000
  },
  test : {
    db : {
      URL : 'mongodb://localhost:27017/wac-service-test'
    },
    componentsURL : 'http://localhost:8000/mock/registry',
    componentInstallDir : __dirname + '/test/components',
    componentBuildDir : __dirname + '/test/build',
    port : 8000
  } 
};

config = config[ env || 'development' ];
config.isTest = env === 'test';

module.exports = config;
