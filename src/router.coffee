riot = require "riot"
router = require "riot-route"

types = route: "ROUTE"

actions =
  route: (route) -> {
    type: types.route
    route
  }

reducer = (state = "home", action) ->
  if action.type is types.route
    if action.route.length < 1 then "home" else action.route
  else state

triggerRoute = (tag) ->
  tag.trigger? "route"
  triggerRoute tag.tags[key] for key of tag.tags

# You have to pass the Redux store into the router on startup
init = (bootstrap) ->
  redux = require "./redux"
  riot.mixin init: ->
    route = ""
    @on "mount", ->
      state = redux.store.getState()
      triggerRoute @ if state.route is @root.localName
      route = state.route
    @on "update", ->
      state = redux.store.getState()
      routed = state.route is @root.localName and state.route isnt route
      route = state.route
      triggerRoute @ if routed
  # Dispatch a route action to the Redux store whenever the URI hash changes
  router (route) ->
    if route.startsWith "access_token"
      token = route.split("id_token=")[1].split("&")[0]
      localStorage.setItem "authToken", token
      redux.store.dispatch redux.actions.auth.loggedIn token
      window.location.hash = ""
    else
      redux.store.dispatch actions.route route
  # Now that the action is dispatching, subscribe to the store, and re-route on change
  currentPage = null
  currentRoute = null
  redux.store.subscribe ->
    main = document.getElementById "layoutMain"
    if main? and (not bootstrap? or bootstrap redux.store, redux.actions)
      bootstrap = null
      route = redux.store.getState().route
      if currentRoute isnt route
        currentRoute = route
        currentPage?.unmount? yes
        currentPage = riot.mount main, route
  # Now that we're wired up the event to the Redux action, start up the router
  router.start()

start = -> router.exec()

module.exports = {
  actions
  reducer
  init
  start
}
