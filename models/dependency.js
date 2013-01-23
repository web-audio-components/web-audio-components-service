var
  mongoose = require( 'mongoose' );

var Dependency = new mongoose.Schema({
  name : { type: String, required: true },
  version : { type: String, require: true }
});

module.exports = Dependency;
