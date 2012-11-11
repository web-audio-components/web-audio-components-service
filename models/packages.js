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

  Packages.path('repo').validate(function ( v ) {
    return /^[a-zA-Z0-9-_]*\/[a-zA-Z0-9-_]*$/.test( v );
  }, 'Repos must be of the GitHub format "owner/reponame"');

  // TODO More efficient querying???
  Packages.statics.search = function ( query, callback ) {
    this.find({}).or([
      { name : { $regex : query, $options : '-i' }},
      { keywords : query },
      { description : { $regex : query, $options : '-i' }}
    ]).exec( callback );
  };

  return Packages;
};
