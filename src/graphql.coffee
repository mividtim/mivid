graphql = require "graphql-client"
module.exports =
  init: (apiBase) -> @query = graphql(url: apiBase, headers: {}).query
