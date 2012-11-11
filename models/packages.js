module.exports = function ( mongoose ) {
  var Packages = new mongoose.Schema({
    name : { type: String, required: true, unique: true, index: true, lowercase: true },
    repo : { type: String, required: true },
    script : { type: String, required: true },
    description : { type: String, required: true },
    keywords : { type: Array },
    ui : { type: Boolean }
  });

  Packages.path('name').validate(function ( v ) {
    return /^[a-zA-Z][a-zA-Z0-9\-]{0,29}$/.test( v );
  }, 'Package names must be between 1 and 30 characters, and contain only letters, numbers and dashes, and must begin with a letter.' );

  Packages.statics.search = function ( query, callback ) {
    this.find({}).or([
      { name : query },
      { keywords : query },
      { description : query }
    ]).exec( callback );
  };

  return Packages;
};
