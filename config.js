module.exports = {
  db : {
         URL : process.env['wapm-service-mongodb-url'] || 'mongodb://localhost:27017/wapm-service',
    port : 3000
  },
  port : 8000
}
