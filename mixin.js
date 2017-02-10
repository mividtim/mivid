var riot, sound,
  slice = [].slice;

riot = require("riot");

sound = require("./sound");

module.exports = {
  init: function(mixins) {
    var mixin, name, register, results, triggerRoute;
    riot.mixin({
      init: function() {
        return this.on("mount", function() {
          componentHandler.upgradeElements(this.root.querySelectorAll(".mdl"));
          return componentHandler.upgradeAllRegistered();
        });
      }
    });
    riot.mixin("multiSelectValues", {
      init: function() {
        return this.multiSelectValues = function(multiSelect) {
          return slice.call(multiSelect.querySelectorAll("option:checked")).map(function(option) {
            return option.value;
          });
        };
      }
    });
    triggerRoute = function(tag) {
      var i, len, ref, results;
      tag.trigger("route");
      ref = tag.tags;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        tag = ref[i];
        results.push(triggerRoute(tag));
      }
      return results;
    };
    riot.mixin("sound", {
      init: function() {
        return this.sound = sound;
      }
    });
    riot.mixin("state", {
      init: function() {
        var actions, ref, store, unsubscribe;
        ref = require("./redux"), actions = ref.actions, store = ref.store;
        this.actions = actions;
        this.dispatch = store.dispatch;
        this.state = store.getState();
        unsubscribe = null;
        this.on("mount", function() {
          this.state = store.getState();
          return unsubscribe = store.subscribe((function(_this) {
            return function() {
              _this.state = store.getState();
              return _this.update();
            };
          })(this));
        });
        return this.on("unmount", function() {
          return unsubscribe();
        });
      }
    });
    register = function(name, mixin) {
      return riot.mixin(name, {
        init: function() {
          return this[name] = mixin;
        }
      });
    };
    results = [];
    for (name in mixins) {
      mixin = mixins[name];
      results.push(register(name, mixin));
    }
    return results;
  }
};
