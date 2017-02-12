var actions, assign, axios, decoded, graphql, href, initialState, jwtDecode, reducer, token, types;

assign = require("lodash.assign");

axios = require("axios");

require("bluebird");

graphql = require("./graphql");

jwtDecode = require("jwt-decode");

types = {
  register: {
    request: "AUTH_REGISTER_REQUEST",
    success: "AUTH_REGISTER_SUCCESS",
    fail: "AUTH_REGISTER_FAIL"
  },
  login: {
    request: "AUTH_LOGIN_REQUEST",
    success: "AUTH_LOGIN_SUCCESS",
    fail: "AUTH_LOGIN_FAIL"
  },
  getUser: {
    request: "AUTH_USER_REQUEST",
    success: "AUTH_USER_SUCCESS",
    fail: "AUTH_USER_FAIL"
  },
  logout: "AUTH_LOGOUT"
};

token = localStorage.getItem("authToken");

href = null;

if (token != null) {
  decoded = jwtDecode(token);
  if ((decoded == null) || (decoded.sub == null) || Date.now() / 1000 > decoded.exp) {
    localStorage.removeItem("authToken");
    token = null;
  } else {
    href = decoded.sub;
  }
}

initialState = {
  registering: false,
  loggingIn: false,
  gettingUser: false,
  authenticated: token != null,
  token: token,
  href: href,
  user: null,
  error: null
};

reducer = function(state, action) {
  if (state == null) {
    state = initialState;
  }
  switch (action.type) {
    case types.register.request:
      return assign({}, state, {
        registering: true,
        authenticated: false,
        token: null,
        href: null,
        error: null
      });
    case types.register.success:
      return assign({}, state, {
        registering: false,
        authenticated: true,
        token: action.user.token,
        href: action.user.href,
        user: action.user,
        error: null
      });
    case types.register.fail:
      console.error(action.error);
      return assign({}, state, {
        registering: false,
        authenticated: false,
        error: action.error
      });
    case types.login.request:
      return assign({}, state, {
        loggingIn: true,
        authenticated: false,
        token: null,
        href: null,
        error: null
      });
    case types.login.success:
      return assign({}, state, {
        loggingIn: false,
        authenticated: true,
        token: action.user.token,
        href: action.user.href,
        user: action.user
      });
    case types.login.fail:
      console.error(action.error);
      return assign({}, state, {
        loggingIn: false,
        error: action.error
      });
    case types.getUser.request:
      return assign({}, state, {
        gettingUser: true,
        user: null,
        error: null
      });
    case types.getUser.success:
      return assign({}, state, {
        gettingUser: false,
        user: action.user
      });
    case types.getUser.fail:
      console.error(action.error);
      return assign({}, state, {
        gettingUser: false,
        error: action.error
      });
    default:
      return state;
  }
};

actions = {
  register: (function(_this) {
    return function() {
      return function(dispatch, getState) {
        var state;
        state = getState();
        if (!state.auth.registering) {
          dispatch({
            type: types.register.request
          });
          return axios.post(_this.apiBase + "register", info).then(function(response) {
            localStorage.setItem("authToken", response.data.token);
            dispatch({
              type: types.register.success,
              user: response.data
            });
            return window.location.hash = "";
          });
        }
      };
    };
  })(this),
  login: function(authRequest) {
    return function(dispatch, getState) {
      var state;
      state = getState();
      if (!state.auth.loggingIn) {
        dispatch({
          type: types.login.request
        });
        return axios.post(this.apiBase + "login", authRequest).then(function(response) {
          localStorage.setItem("authToken", response.data.token);
          return dispatch({
            type: types.login.success,
            user: response.data
          });
        })["catch"](function(error) {
          console.error(error);
          dispatch({
            type: types.login.fail,
            error: error
          });
          throw error;
        });
      }
    };
  },
  loggedIn: function(token) {
    return {
      type: types.login.success,
      token: token,
      href: jwtDecode(token).sub
    };
  },
  getUser: function() {
    return function(dispatch, getState) {
      var state;
      state = getState();
      if (!state.gettingUser) {
        dispatch({
          type: types.getUser.request
        });
        return graphql.query("query user($href: String) {\n  user(href: $href) {\n    id\n    href\n    person {\n      name\n      email\n      mobile\n      pictureURL\n    }\n  }\n}", {
          href: state.auth.href
        }).then(function(response) {
          return dispatch({
            type: types.getUser.success,
            user: response.data.user
          });
        })["catch"](function(error) {
          console.error(error);
          dispatch({
            type: types.getUser.fail,
            error: error
          });
          throw error;
        });
      }
    };
  }
};

module.exports = {
  init: function(apiBase) {
    return this.apiBase = apiBase;
  },
  actions: actions,
  reducer: reducer
};
