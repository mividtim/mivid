riot = require "riot"
router = require "riot-route"

actionTypes = route: "ROUTE"

actions =
  route: (route) -> {
    type: actionTypes.route
    route
  }

reducer = (state = "", action) ->
  if action.type is actionTypes.route
    if action.route.length < 1 then @defaultRoute else action.route
  else state

triggerRoute = (tag) ->
  tag.trigger? "route"
  triggerRoute tag.tags[key] for key of tag.tags

# You have to pass the Redux store into the router on startup
init = (bootstrap, defaultRoute) ->
  @defaultRoute = defaultRoute or "home"
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
  tags = {}
  # Dispatch a route action to the Redux store whenever the URI hash changes
  router (route) ->
    if route.length < 1 then route = @defaultRoute
    if route.startsWith "access_token"
      token = route.split("id_token=")[1].split("&")[0]
      localStorage.setItem "authToken", token
      redux.store.dispatch redux.actions.auth.loggedIn token
      window.location.hash = ""
    else
      redux.store.dispatch actions.route route
  # Now that the action is dispatching, subscribe to the store, and re-route on change
  redux.store.subscribe ->
    state = redux.store.getState()
    if not bootstrap? or bootstrap redux.store, redux.actions
      bootstrap = null
      # Get the route from the current state in the Redux store
      route = state.route
      # Make sure the document is done loading
      main = document.getElementById "layoutMain"
      # If we haven't shown this card before...
      if main? and not tags[route]?
        # Create a new route tag
        tag = tags[route] = document.createElement "route"
        tag.setAttribute "tag", route
        # Add the route tag to the layout
        main.appendChild tag
        riot.mount "route"
  # Now that we're wired up the event to the Redux action, start up the router
  router.start()

start = -> router.exec()

module.exports = {
  actions
  reducer
  init
  start
}
