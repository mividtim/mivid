var actionTypes, actions, init, reducer, riot, router, start, triggerRoute;

riot = require("riot");

router = require("riot-route");

actionTypes = {
  route: "ROUTE"
};

actions = {
  route: function(route) {
    return {
      type: actionTypes.route,
      route: route
    };
  }
};

reducer = function(state, action) {
  if (state == null) {
    state = "home";
  }
  if (action.type === actionTypes.route) {
    if (action.route.length < 1) {
      return "home";
    } else {
      return action.route;
    }
  } else {
    return state;
  }
};

triggerRoute = function(tag) {
  var key, results;
  if (typeof tag.trigger === "function") {
    tag.trigger("route");
  }
  results = [];
  for (key in tag.tags) {
    results.push(triggerRoute(tag.tags[key]));
  }
  return results;
};

init = function(bootstrap) {
  var redux, tags;
  redux = require("./redux");
  riot.mixin({
    init: function() {
      var route;
      route = "";
      this.on("mount", function() {
        var state;
        state = redux.store.getState();
        if (state.route === this.root.localName) {
          triggerRoute(this);
        }
        return route = state.route;
      });
      return this.on("update", function() {
        var routed, state;
        state = redux.store.getState();
        routed = state.route === this.root.localName && state.route !== route;
        route = state.route;
        if (routed) {
          return triggerRoute(this);
        }
      });
    }
  });
  tags = {};
  router(function(route) {
    var token;
    if (route.startsWith("access_token")) {
      token = route.split("id_token=")[1].split("&")[0];
      localStorage.setItem("authToken", token);
      redux.store.dispatch(redux.actions.auth.loggedIn(token));
      return window.location.hash = "";
    } else {
      return redux.store.dispatch(actions.route(route));
    }
  });
  redux.store.subscribe(function() {
    var main, route, state, tag;
    state = redux.store.getState();
    if ((bootstrap == null) || bootstrap(redux.store, redux.actions)) {
      bootstrap = null;
      route = state.route;
      main = document.getElementById("layoutMain");
      if ((main != null) && (tags[route] == null)) {
        tag = tags[route] = document.createElement("route");
        tag.setAttribute("tag", route);
        main.appendChild(tag);
        return riot.mount("route");
      }
    }
  });
  return router.start();
};

start = function() {
  return router.exec();
};

module.exports = {
  actions: actions,
  reducer: reducer,
  init: init,
  start: start
};

//# sourceMappingURL=router.js.map
