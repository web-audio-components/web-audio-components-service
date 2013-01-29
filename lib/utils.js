var
  config = require('../config');

module.exports = {
  getInstallDir : function (repo) {
    return config.componentInstallDir + '/' + repo.replace('/', '-') + '/';
  }
}
