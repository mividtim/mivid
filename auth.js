var Auth0Lock, actionTypes, actions, assign, clientId, decoded, graphql, init, initialState, jwt, reducer, token;

assign = require("lodash.assign");

Auth0Lock = require("auth0-lock")["default"];

require("bluebird");

graphql = require("./graphql");

jwt = require("jsonwebtoken");

actionTypes = {
  login: {
    request: "AUTH_LOGIN_REQUEST",
    success: "AUTH_LOGIN_SUCCESS",
    fail: "AUTH_LOGIN_FAIL"
  },
  getUser: {
    request: "AUTH_USER_REQUEST",
    success: "AUTH_USER_SUCCESS",
    fail: "AUTH_USER_FAIL"
  }
};

init = function(auth0ClientId, auth0Domain) {
  this.auth0ClientId = auth0ClientId;
  return this.auth0Domain = auth0Domain;
};

actions = {
  login: function() {
    var redux;
    redux = require("./redux");
    return function(dispatch) {
      var lock;
      dispatch({
        type: actionTypes.login.request
      });
      lock = new Auth0Lock(this.auth0ClientId, this.auth0Domain, {
        theme: {
          logo: "https://chirptag.herokuapp.com/icon/apple-icon-57x57.png",
          primaryColor: "#86748e"
        }
      });
      lock.show();
      return lock.on("authenticated", function(authResult) {
        localStorage.setItem("authToken", token);
        return dispatch(redux.actions.auth.loggedIn(authResult.idToken));
      });
    };
  },
  loggedIn: function(token) {
    return {
      type: actionTypes.login.success,
      token: token,
      clientId: jwt.decode(token).sub
    };
  },
  getUser: function() {
    return function(dispatch, getState) {
      var state;
      state = getState();
      if (!state.gettingUser) {
        dispatch({
          type: actionTypes.getUser.request
        });
        return graphql(getState()).query("query user($clientId: String) {\n  user(clientId: $clientId) {\n    id\n    clientId\n    person {\n      name\n      email\n      mobile\n      pictureURL\n    }\n  }\n}", {
          clientId: state.auth.clientId
        }).then(function(response) {
          return dispatch({
            type: actionTypes.getUser.success,
            user: response.data.user
          });
        })["catch"](function(error) {
          return dispatch({
            type: actionTypes.getUser.fail,
            error: error
          });
        });
      }
    };
  }
};

token = localStorage.getItem("authToken");

clientId = null;

if (token != null) {
  decoded = jwt.decode(token);
  if ((decoded == null) || (decoded.sub == null) || Date.now() / 1000 > decoded.exp) {
    localStorage.removeItem("authToken");
    token = null;
  } else {
    clientId = decoded.sub;
  }
}

initialState = {
  loggingIn: false,
  authorized: token != null,
  token: token,
  clientId: clientId,
  gettingUser: false,
  user: null,
  error: null
};

reducer = function(state, action) {
  if (state == null) {
    state = initialState;
  }
  switch (action.type) {
    case actionTypes.login.request:
      return assign({}, state, {
        loggingIn: true,
        authorized: false,
        token: null,
        clientId: null
      });
    case actionTypes.login.success:
      return assign({}, state, {
        loggingIn: false,
        authorized: true,
        token: action.token,
        clientId: action.clientId
      });
    case actionTypes.login.fail:
      return assign({}, state, {
        loggingIn: false,
        error: action.error
      });
    case actionTypes.getUser.request:
      return assign({}, state, {
        gettingUser: true,
        user: null
      });
    case actionTypes.getUser.success:
      return assign({}, state, {
        gettingUser: false,
        user: action.user
      });
    case actionTypes.getUser.fail:
      return assign({}, state, {
        error: action.error
      });
    default:
      return state;
  }
};

module.exports = {
  init: init,
  actions: actions,
  reducer: reducer
};
