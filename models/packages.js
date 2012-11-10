module.exports = function ( mongoose ) {
  var Packages = new mongoose.Schema({
    name : { type: String, required: true, unique: true, index: true },
    repo : { type: String, required: true },

    description : { type: String, required: true },
    keywords : { type: Array },
    ui : { type: Boolean }
  });

  Packages.statics.search = function ( query, callback ) {
    this.find({}).or([
      { name : query },
      { keywords : query },
      { description : query }
    ]).exec( callback );
  };

  return Packages;
};
