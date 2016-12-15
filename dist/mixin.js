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
    riot.mixin("dropDownLists", {
      init: function() {
        return this.dropDownLists = {
          states: [
            {
              value: "AL",
              name: "Alabama"
            }, {
              value: "AK",
              name: "Alaska"
            }, {
              value: "AZ",
              name: "Arizona"
            }, {
              value: "AR",
              name: "Arkansas"
            }, {
              value: "CA",
              name: "California"
            }, {
              value: "CO",
              name: "Colorado"
            }, {
              value: "CT",
              name: "Connecticut"
            }, {
              value: "DE",
              name: "Deleware"
            }, {
              value: "DC",
              name: "Dist. of Columbia"
            }, {
              value: "FL",
              name: "Florida"
            }, {
              value: "GA",
              name: "Georgia"
            }, {
              value: "HA",
              name: "Hawaii"
            }, {
              value: "ID",
              name: "Idaho"
            }, {
              value: "IL",
              name: "Illinois"
            }, {
              value: "IN",
              name: "Indiana"
            }, {
              value: "IA",
              name: "Iowa"
            }, {
              value: "KS",
              name: "Kansas"
            }, {
              value: "KY",
              name: "Kentucky"
            }, {
              value: "LA",
              name: "Louisiana"
            }, {
              value: "ME",
              name: "Maine"
            }, {
              value: "MD",
              name: "Maryland"
            }, {
              value: "MA",
              name: "Massachusetts"
            }, {
              value: "MI",
              name: "Michigan"
            }, {
              value: "MN",
              name: "Minnesota"
            }, {
              value: "MS",
              name: "Mississippi"
            }, {
              value: "MO",
              name: "Missouri"
            }, {
              value: "MT",
              name: "Montana"
            }, {
              value: "NE",
              name: "Nebraska"
            }, {
              value: "NV",
              name: "Nevada"
            }, {
              value: "NV",
              name: "Nevada"
            }, {
              value: "NH",
              name: "New Hampshire"
            }, {
              value: "NJ",
              name: "New Jersey"
            }, {
              value: "NM",
              name: "New Mexico"
            }, {
              value: "NY",
              name: "New York"
            }, {
              value: "NC",
              name: "North Carolina"
            }, {
              value: "ND",
              name: "North Dakota"
            }, {
              value: "OH",
              name: "Ohio"
            }, {
              value: "OK",
              name: "Oklahoma"
            }, {
              value: "OR",
              name: "Oregon"
            }, {
              value: "PA",
              name: "Pennsylvania"
            }, {
              value: "RI",
              name: "Rhode Island"
            }, {
              value: "SC",
              name: "South Carolina"
            }, {
              value: "SD",
              name: "South Dakota"
            }, {
              value: "TN",
              name: "Tennessee"
            }, {
              value: "TX",
              name: "Texas"
            }, {
              value: "UT",
              name: "Utah"
            }, {
              value: "VT",
              name: "Vermont"
            }, {
              value: "VA",
              name: "Virginia"
            }, {
              value: "WA",
              name: "Washington"
            }, {
              value: "WV",
              name: "West Virginia"
            }, {
              value: "WI",
              name: "Wisconsin"
            }, {
              value: "WY",
              name: "Wyoming"
            }
          ]
        };
      }
    });
    riot.mixin("fixDate", {
      init: function() {
        this.fixDate = function(date) {
          try {
            date = new Date(Date.parse(date)).toISOString().split("T")[0];
          } catch (error) {
            date = "";
          }
          return date;
        };
        return this.fixTime = function(date) {
          try {
            date = new Date(Date.parse(date)).toISOString().split("T")[1].split(":", 2).join(":");
          } catch (error) {
            date = "";
          }
          return date;
        };
      }
    });
    riot.mixin("message", {
      init: function() {
        return this.message = function(message) {
          return document.querySelector(".snackbar").MaterialSnackbar.showSnackbar({
            message: message
          });
        };
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

//# sourceMappingURL=mixin.js.map
