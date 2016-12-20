var graphql;

graphql = require("graphql-client");

module.exports = function(state) {
  return graphql({
    url: "api/v1",
    headers: {
      Authorization: "Bearer " + state.auth.token
    }
  });
};
