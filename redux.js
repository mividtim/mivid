var assign, auth, getModuleExports, redux, router, thunk;

assign = require("lodash.assign");

auth = require("./auth");

getModuleExports = require("./get-module-exports");

redux = require("redux");

router = require("./router");

thunk = require("redux-thunk");

module.exports = {
  init: function(actionsAndReducers) {
    var devTools, middlewares;
    devTools = (typeof window !== "undefined" && window !== null ? typeof window.devToolsExtension === "function" ? window.devToolsExtension() : void 0 : void 0) || function(f) {
      return f;
    };
    middlewares = redux.compose(redux.applyMiddleware(thunk["default"]), devTools);
    this.actions = assign({}, getModuleExports(actionsAndReducers, "actions"), {
      auth: auth.actions
    });
    this.reducer = redux.combineReducers(assign({}, getModuleExports(actionsAndReducers, "reducer"), {
      auth: auth.reducer,
      route: router.reducer
    }));
    return this.store = redux.createStore(this.reducer, void 0, middlewares);
  }
};
