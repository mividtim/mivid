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
    var actionsAndReducers, apiBase, bootstrap, layoutTagName, mixins, sounds;
    apiBase = arg.apiBase, actionsAndReducers = arg.actionsAndReducers, bootstrap = arg.bootstrap, layoutTagName = arg.layoutTagName, mixins = arg.mixins, sounds = arg.sounds;
    auth.init(apiBase);
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
