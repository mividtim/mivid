graphql = require "graphql-client"

module.exports =
  init: (apiBase) -> @apiBase = apiBase
  query: -> graphql url: @apiBase, headers: {}
