var
  env = process.env.NODE_ENV || 'development',
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
    port : 8000,
    test : this.port,
    useMocks : false
  },
  test : {
    db : {
      URL : 'mongodb://localhost:27017/wac-service-test'
    },
    componentsURL : 'http://localhost:8001/mock/registry',
    componentInstallDir : __dirname + '/mocks/components',
    componentBuildDir : __dirname + '/test/build',
    port : 8001,
    useMocks : true
  } 
};

config = config[env];

// Helper environment methods
config.env = env;
config.isTest = env === 'test';
config.isDevelopment = env === 'development';

// If in development, using mocks, change componentInstallDir
// Better way to do this?
if (config.isDevelopment && config.useMocks) {
  config.componentInstallDir = __dirname + '/mocks/components';
}

module.exports = config;
