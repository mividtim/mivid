graphql = require "graphql-client"

apiBase = apiBase

module.exports =
  init: (apiBaseIn) -> apiBase = apiBaseIn
  graphql: (state) -> graphql
    url: apiBase
    headers: Authorization: "Bearer #{state.auth.token}"
