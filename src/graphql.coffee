graphql = require "graphql-client"

module.exports = (state) ->
  graphql
    url: "api/v1"
    headers: Authorization: "Bearer #{state.auth.token}"
