var
  env = process.env.NODE_ENV || 'development',
  config;

// Determines whether or not mock data is used in development
var USE_MOCK_REPOSITORY = false;
var USE_MOCK_REGISTRY = true;

config = {
  production : {
    db : {
      URL : process.env['WAC_SERVICE_MONGODB_URL']
    },
    twitter : {
      consumerKey : process.env['WAC_SERVICE_TWITTER_CONSUMER_KEY'],
      consumerSecret : process.env['WAC_SERVICE_TWITTER_CONSUMER_SECRET'],
      accessToken : process.env['WAC_SERVICE_TWITTER_ACCESS_TOKEN'],
      accessTokenSecret : process.env['WAC_SERVICE_TWITTER_ACCESS_TOKEN_SECRET']
    },
    componentsURL : 'http://component.io/components/all',
    componentInstallDir : __dirname + '/components',
    port : 9999
  },
  development : {
    db : {
      URL : 'mongodb://localhost:27017/wac-service'
    },
    componentsURL : USE_MOCK_REGISTRY ?
      'http://localhost:8000/mock/registry' :
      'http://component.io/components/all',
    componentInstallDir : __dirname + '/components',
    port : 8000,
    useMockRegistry : USE_MOCK_REGISTRY,
    useMockRepository : USE_MOCK_REPOSITORY
  },
  test : {
    db : {
      URL : 'mongodb://localhost:27017/wac-service-test'
    },
    componentsURL : 'http://localhost:8001/mock/registry',
    componentInstallDir : __dirname + '/test/components',
    port : 8001,
    useMockRegistry : true,
    useMockRepository : true
  } 
};

config = config[env];

// Helper environment methods
config.env = env;
config.isTest = env === 'test';
config.isDevelopment = env === 'development';

module.exports = config;
