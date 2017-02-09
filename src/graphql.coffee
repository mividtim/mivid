apiBase = require "./api-base"
graphql = require "graphql-client"

module.exports = ->
  graphql url: apiBase, headers: {}
