assign = require "lodash.assign"
Auth0Lock = require("auth0-lock").default
require "bluebird"
graphql = require "./graphql"
jwt = require "jsonwebtoken"

actionTypes =
  login:
    request: "AUTH_LOGIN_REQUEST"
    success: "AUTH_LOGIN_SUCCESS"
    fail: "AUTH_LOGIN_FAIL"
  getUser:
    request: "AUTH_USER_REQUEST"
    success: "AUTH_USER_SUCCESS"
    fail: "AUTH_USER_FAIL"

init = (auth0ClientId, auth0Domain) ->
  @auth0ClientId = auth0ClientId
  @auth0Domain = auth0Domain

actions =
  login: ->
    redux = require "./redux"
    (dispatch) ->
      dispatch type: actionTypes.login.request
      lock = new Auth0Lock @auth0ClientId, @auth0Domain,
        theme:
          logo: "https://chirptag.herokuapp.com/icon/apple-icon-57x57.png"
          primaryColor: "#86748e"
      lock.show()
      lock.on "authenticated", (authResult) ->
        localStorage.setItem "authToken", token
        dispatch redux.actions.auth.loggedIn authResult.idToken
  loggedIn: (token) -> {
    type: actionTypes.login.success
    token
    clientId: jwt.decode(token).sub
  }
  getUser: ->
    (dispatch, getState) ->
      state = getState()
      if not state.gettingUser
        dispatch type: actionTypes.getUser.request
        graphql(getState()).query """
          query user($clientId: String) {
            user(clientId: $clientId) {
              id
              clientId
              person {
                name
                email
                mobile
                pictureURL
              }
            }
          }
          """,
          clientId: state.auth.clientId
        .then (response) ->
            dispatch
              type: actionTypes.getUser.success
              user: response.data.user
        .catch (error) -> dispatch {type: actionTypes.getUser.fail, error}

token = localStorage.getItem "authToken"
clientId = null
if token?
  decoded = jwt.decode token
  if not decoded? or not decoded.sub? or Date.now() / 1000 > decoded.exp
    localStorage.removeItem "authToken"
    token = null
  else
    clientId = decoded.sub
initialState = {
  loggingIn: no
  authorized: token?
  token
  clientId
  gettingUser: no
  user: null
  error: null
}
reducer = (state = initialState, action) ->
  switch action.type
    when actionTypes.login.request
      assign {}, state,
        loggingIn: yes
        authorized: no
        token: null
        clientId: null
    when actionTypes.login.success
      assign {}, state,
        loggingIn: no
        authorized: yes
        token: action.token
        clientId: action.clientId
    when actionTypes.login.fail
      assign {}, state,
        loggingIn: no
        error: action.error
    when actionTypes.getUser.request
      assign {}, state,
        gettingUser: yes
        user: null
    when actionTypes.getUser.success
      assign {}, state,
        gettingUser: no
        user: action.user
    when actionTypes.getUser.fail
      assign {}, state,
        #gettingUser: no
        error: action.error
    else state

module.exports = {
  init
  actions
  reducer
}
