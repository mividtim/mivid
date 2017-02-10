var graphql;

graphql = require("graphql-client");

module.exports = {
  init: function(apiBase) {
    return this.apiBase = apiBase;
  },
  query: function() {
    return graphql({
      url: this.apiBase,
      headers: {}
    });
  }
};
