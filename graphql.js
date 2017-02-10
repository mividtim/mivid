var graphql;

graphql = require("graphql-client");

module.exports = function(apiBase) {
  return graphql({
    url: apiBase,
    headers: {}
  });
};
