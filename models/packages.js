var _ = require( 'underscore' );

module.exports = function ( mongoose ) {
  var Packages = new mongoose.Schema({
    name : { type: String, required: true, unique: true, index: true, lowercase: true },
    repo : { type: String, required: true },
    script : { type: String, required: true },
    scriptFile : { type: Buffer, require: true },
    description : { type: String, required: true },
    keywords : { type: Array },
    updated : { type: Date, default: Date.now, set: isoToDate },

    // Not yet implemented
    ui : { type: Boolean },
    instrument : { type: Boolean },
    effect : { type: Boolean }
  });

  // Package name must be between 1 and 30 chars, only letters
  // numbers, dashes and must begin with a letter
  Packages.path('name').validate(function ( v ) {
    return /^[a-zA-Z][a-zA-Z0-9\-]{0,29}$/.test( v );
  }, 'Package names must be between 1 and 30 characters, and contain only letters, numbers and dashes, and must begin with a letter.' );

  // Repo must be of GitHub repo format "account/reponame"
  Packages.path('repo').validate(function ( v ) {
    return /^[a-zA-Z0-9-_]*\/[a-zA-Z0-9-_]*$/.test( v );
  }, 'Repos must be of the GitHub format "owner/reponame"');

  // TODO More efficient querying???
  // TODO Better matching???
  Packages.statics.search = function ( query, returnFields, callback ) {
    this.find({}, returnFields).or([
      { name : { $regex : query, $options : '-i' }},
      { keywords : query },
      { description : { $regex : query, $options : '-i' }}
    ]).exec( callback );
  };

  // This checks validity of model minus the scriptFile being present
  // so we can validate before querying GitHub for the repo's exist and
  // getting the script
  Packages.methods.validateWithoutScript = function ( callback ) {
    this.validate(function ( err ) {
      callback(
        ( !err ||
        _.size( err.errors ) === 1 &&
        err.errors.scriptFile ) ?
          false :
          err
      );
    });
  };


  return Packages;
};

// Takes an ISO6801 string and converts it to a date object
function isoToDate( s ) {
  if ( s instanceof Date ) { return s; }
  if ( typeof s === 'string' ) { return new Date( s ); }
};
