assign = require "lodash.assign"
axios = require "axios"
require "bluebird"
{graphql} = require "./graphql"
jwtDecode = require "jwt-decode"

types =
  register:
    request: "AUTH_REGISTER_REQUEST"
    success: "AUTH_REGISTER_SUCCESS"
    fail: "AUTH_REGISTER_FAIL"
  login:
    request: "AUTH_LOGIN_REQUEST"
    success: "AUTH_LOGIN_SUCCESS"
    fail: "AUTH_LOGIN_FAIL"
  getUser:
    request: "AUTH_USER_REQUEST"
    success: "AUTH_USER_SUCCESS"
    fail: "AUTH_USER_FAIL"
  logout: "AUTH_LOGOUT"

token = localStorage.getItem "authToken"
href = null
if token?
  decoded = jwtDecode token
  if not decoded? or not decoded.sub? or Date.now() / 1000 > decoded.exp
    localStorage.removeItem "authToken"
    token = null
  else
    href = decoded.sub

initialState = {
  registering: no
  loggingIn: no
  gettingUser: no
  authenticated: token?
  token
  href
  user: null
  error: null
}

reducer = (state = initialState, action) ->
  switch action.type
    when types.register.request
      assign {}, state,
        registering: yes
        authenticated: no
        token: null
        href: null
        error: null
    when types.register.success
      assign {}, state,
        registering: no
        authenticated: yes
        token: action.user.token
        href: action.user.href
        user: action.user
        error: null
    when types.register.fail
      console.error action.error
      assign {}, state,
        registering: no
        authenticated: no
        error: action.error
    when types.login.request
      assign {}, state,
        loggingIn: yes
        authenticated: no
        token: null
        href: null
        error: null
    when types.login.success
      assign {}, state,
        loggingIn: no
        authenticated: yes
        token: action.user.token
        href: action.user.href
        user: action.user
    when types.login.fail
      console.error action.error
      assign {}, state,
        loggingIn: no
        error: action.error
    when types.getUser.request
      assign {}, state,
        gettingUser: yes
        user: null
        error: null
    when types.getUser.success
      assign {}, state,
        gettingUser: no
        user: action.user
    when types.getUser.fail
      console.error action.error
      assign {}, state,
        gettingUser: no
        error: action.error
    else state

apiBase = null

actions =
  register: =>
    (dispatch, getState) =>
      state = getState()
      if not state.auth.registering
        dispatch type: types.register.request
        axios.post apiBase + "register", info
        .then (response) ->
          localStorage.setItem "authToken", response.data.token
          dispatch type: types.register.success, user: response.data
          window.location.hash = ""
  login: (authRequest) ->
    (dispatch, getState) ->
      if not getState().auth.loggingIn
        dispatch type: types.login.request
        axios.post apiBase + "login", authRequest
        .then (response) ->
          localStorage.setItem "authToken", response.data.token
          dispatch type: types.login.success, user: response.data
        .catch (error) ->
          console.error error
          dispatch {type: types.login.fail, error}
          throw error
  loggedIn: (token) -> {
    type: types.login.success
    token
    href: jwtDecode(token).sub
  }
  getUser: ->
    (dispatch, getState) ->
      state = getState()
      if not state.gettingUser
        dispatch type: types.getUser.request
        graphql(getState()).query """
          query user($href: String) {
            user(href: $href) {
              id
              href
              person {
                givenName
                surname
                email
                mobile
                pictureURL
              }
            }
          }
          """,
          href: state.auth.href
        .then (response) ->
          dispatch
            type: types.getUser.success
            user: response.data.user
        .catch (error) ->
          console.error error
          dispatch {type: types.getUser.fail, error}
          throw error

module.exports = {
  init: (apiBaseIn) -> apiBase = apiBaseIn
  actions
  reducer
}
