module.exports = {
  production : {
    db : {
      URL : process.env['wapm-service-mongodb-url']
    },
    port : 80
  },
  development : {
    db : {
      URL : 'mongodb://localhost:27017/wapm-service'
    },
    port : 8000
  },
  test : {
    db : {
      URL : 'mongodb://localhost:27017/wapm-service-test'
    },
    port : 8000
  } 
};
