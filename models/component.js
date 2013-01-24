var
  mongoose = require('mongoose'),
  Dependency = require('./dependency'),
  _ = require('underscore');

var Component = new mongoose.Schema({
  // Component attributes
  name : { type: String, required: true },
  repo : { type: String, required: true, index: true, unique: true  },
  description : { type: String },
  author : { type: String },
  version : { type: String, required: true },
  keywords : { type: Array },
  main : { type: String, default: 'index.js' },
  scripts : { type: Array, required: true },
  dependencies : [ Dependency ],
  twitter : { type: String },
  license : { type: String },

  stars : { type: Number, default: 0 },
  updated : { type: Date, default: Date.now, set: isoToDate },
  type: { type: String },
  
  // Not yet implemented
  ui : { type: Boolean }
});

// TODO More efficient querying???
// TODO Better matching???
Component.statics.search = function (query, returnFields, callback) {
  this.find({}, returnFields).or([
      { name : { $regex : query, $options : '-i' }},
      { keywords : query },
      { description : { $regex : query, $options : '-i' }}
      ]).exec(callback);
};

// Takes an ISO6801 string and converts it to a date object
function isoToDate(s) {
  if (s instanceof Date) { return s; }
  if (typeof s === 'string') { return new Date(s); }
}

module.exports = Component;
