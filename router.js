var actions, init, reducer, riot, router, start, triggerRoute, types;

riot = require("riot");

router = require("riot-route");

types = {
  route: "ROUTE"
};

actions = {
  route: function(route) {
    return {
      type: types.route,
      route: route
    };
  }
};

reducer = function(state, action) {
  if (state == null) {
    state = "home";
  }
  if (action.type === types.route) {
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
  var currentPage, currentRoute, redux;
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
  router(function(route) {
    return redux.store.dispatch(actions.route(route));
  });
  currentPage = null;
  currentRoute = null;
  redux.store.subscribe(function() {
    var main, route;
    main = document.getElementById("layoutMain");
    if ((main != null) && ((bootstrap == null) || bootstrap(redux.store, redux.actions))) {
      bootstrap = null;
      route = redux.store.getState().route;
      if (currentRoute !== route) {
        currentRoute = route;
        if (currentPage != null) {
          if (typeof currentPage.unmount === "function") {
            currentPage.unmount(true);
          }
        }
        return currentPage = riot.mount(main, route);
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
