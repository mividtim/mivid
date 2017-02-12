graphql = require "graphql-client"

apiBase = apiBase

module.exports =
  init: (apiBaseIn) -> apiBase = apiBase
  graphql: (state) ->
    graphql(url: apiBase, headers: Authorization: "Bearer #{state.auth.token}").query
