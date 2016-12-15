var assign, auth, mixin, redux, router, sound;

assign = require("lodash.assign");

auth = require("./auth");

mixin = require("./mixin");

redux = require("./redux");

window.riot = require("riot");

router = require("./router");

sound = require("./sound");

module.exports = {
  init: function(arg) {
    var actionsAndReducers, auth0ClientId, auth0Domain, bootstrap, layoutTagName, mixins, sounds;
    auth0ClientId = arg.auth0ClientId, auth0Domain = arg.auth0Domain, actionsAndReducers = arg.actionsAndReducers, bootstrap = arg.bootstrap, layoutTagName = arg.layoutTagName, mixins = arg.mixins, sounds = arg.sounds;
    auth.init(auth0ClientId, auth0Domain);
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

//# sourceMappingURL=index.js.map
