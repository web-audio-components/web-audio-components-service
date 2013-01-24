var
  config = require('../config');

module.exports = {
  getBuildDir : function (repo) {
    return config.componentBuildDir + '/' + repo.replace('/', '-') + '/';
  },

  getInstallDir : function (repo) {
    return config.componentInstallDir + '/' + repo.replace('/', '-') + '/';
  },

  getBuildScriptPath : function (repo) {
    return this.getBuildDir(repo) + '/build.js';
  }
}
