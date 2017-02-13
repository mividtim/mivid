var apiBase, graphql;

graphql = require("graphql-client");

apiBase = apiBase;

module.exports = {
  init: function(apiBaseIn) {
    return apiBase = apiBaseIn;
  },
  graphql: function(state) {
    return graphql({
      url: apiBase,
      headers: {
        Authorization: "Bearer " + state.auth.token
      }
    });
  }
};
