assign = require "lodash.assign"
auth = require "./auth"
getModuleExports = require "./getModuleExports"
redux = require "redux"
router = require "./router"
thunk = require "redux-thunk"

module.exports =
  init: (actionsAndReducers) ->
    devTools = window?.devToolsExtension?() or (f) -> f
    middlewares = redux.compose redux.applyMiddleware(thunk.default), devTools
    @actions = assign {},
      getModuleExports(actionsAndReducers, "actions"),
      auth: auth.actions
    @reducer = redux.combineReducers assign {},
      getModuleExports(actionsAndReducers, "reducer"),
      auth: auth.reducer
      route: router.reducer
    @store = redux.createStore @reducer, undefined, middlewares
