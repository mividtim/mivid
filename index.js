var auth, graphql, mixin, redux, router, sound;

auth = require("./auth");

graphql = require("./graphql");

mixin = require("./mixin");

redux = require("./redux");

window.riot = require("riot");

router = require("./router");

sound = require("./sound");

module.exports = {
  init: function(arg) {
    var actionsAndReducers, apiBase, auth0ClientId, auth0Domain, bootstrap, layoutTagName, mixins, sounds;
    apiBase = arg.apiBase, auth0ClientId = arg.auth0ClientId, auth0Domain = arg.auth0Domain, actionsAndReducers = arg.actionsAndReducers, bootstrap = arg.bootstrap, layoutTagName = arg.layoutTagName, mixins = arg.mixins, sounds = arg.sounds;
    auth.init(auth0ClientId, auth0Domain);
    graphql.init(apiBase);
    redux.init(actionsAndReducers || {});
    if (sounds != null) {
      sound.init(sounds);
    }
    mixin.init(mixins);
    riot.mount(layoutTagName || "layout");
    router.init(bootstrap);
    return router.start();
  }
};
