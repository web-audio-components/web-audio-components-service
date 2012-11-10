module.exports = function ( mongoose ) {
  var Packages = new mongoose.Schema({
    name : { type: String, required: true },
    source : { type: String, required: true },

    description : { type: String, required: true },
    keywords : { type: Array },
    ui : { type: Boolean }
  });

  Packages.search = function ( query, callback ) {
    this.find({}).or([
      { name : query },
      { keywords : query },
      { description : query }
    ]).exec( callback );
  };

  return Packages;
};
