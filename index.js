var auth, mixin, redux, router, sound;

auth = require("./auth");

mixin = require("./mixin");

redux = require("./redux");

window.riot = require("riot");

router = require("./router");

sound = require("./sound");

module.exports = {
  init: function(arg) {
    var actionsAndReducers, auth0ClientId, auth0Domain, bootstrap, layoutTagName, logoURL, mixins, primaryColor, sounds;
    auth0ClientId = arg.auth0ClientId, auth0Domain = arg.auth0Domain, logoURL = arg.logoURL, primaryColor = arg.primaryColor, actionsAndReducers = arg.actionsAndReducers, bootstrap = arg.bootstrap, layoutTagName = arg.layoutTagName, mixins = arg.mixins, sounds = arg.sounds;
    auth.init(auth0ClientId, auth0Domain, logoURL, primaryColor);
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
