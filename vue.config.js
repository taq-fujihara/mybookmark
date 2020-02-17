const package = require("./package.json");
process.env.VUE_APP_REPOSITORY_URL = package.repository.url;
process.env.VUE_APP_VERSION = package.version;

module.exports = {
  // options...
};
