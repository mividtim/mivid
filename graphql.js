var graphql;

graphql = require("graphql-client");

module.exports = {
  init: function(apiBase) {
    return this.query = graphql({
      url: apiBase,
      headers: {}
    }).query;
  }
};
