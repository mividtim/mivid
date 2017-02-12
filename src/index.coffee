auth = require "./auth"
graphql = require "./graphql"
mixin = require "./mixin"
redux = require "./redux"
window.riot = require "riot"
router = require "./router"
sound = require "./sound"

module.exports = init: ({apiBase, actionsAndReducers, bootstrap, layoutTagName, mixins, sounds}) ->
  auth.init apiBase
  graphql.init apiBase
  redux.init actionsAndReducers or {}
  sound.init sounds if sounds?
  mixin.init mixins
  riot.mount layoutTagName or "layout"
  router.init bootstrap
  router.start()
