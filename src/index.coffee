auth = require "./auth"
mixin = require "./mixin"
redux = require "./redux"
window.riot = require "riot"
router = require "./router"
sound = require "./sound"

module.exports = init: ({auth0ClientId, auth0Domain, actionsAndReducers, bootstrap, defaultRoute, layoutTagName, mixins, sounds}) ->
  auth.init auth0ClientId, auth0Domain
  redux.init actionsAndReducers or {}
  sound.init sounds if sounds?
  mixin.init mixins
  riot.mount layoutTagName or "layout"
  router.init bootstrap
  router.start()
