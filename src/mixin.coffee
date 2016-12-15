riot = require "riot"
sound = require "./sound"

module.exports = init: (mixins) ->

  riot.mixin init: -> @on "mount", ->
    componentHandler.upgradeElements @root.querySelectorAll ".mdl"
    componentHandler.upgradeAllRegistered()

  riot.mixin "dropDownLists", init: ->
    @dropDownLists =
      states: [
        {value: "AL", name: "Alabama"}
        {value: "AK", name: "Alaska"}
        {value: "AZ", name: "Arizona"}
        {value: "AR", name: "Arkansas"}
        {value: "CA", name: "California"}
        {value: "CO", name: "Colorado"}
        {value: "CT", name: "Connecticut"}
        {value: "DE", name: "Deleware"}
        {value: "DC", name: "Dist. of Columbia"}
        {value: "FL", name: "Florida"}
        {value: "GA", name: "Georgia"}
        {value: "HA", name: "Hawaii"}
        {value: "ID", name: "Idaho"}
        {value: "IL", name: "Illinois"}
        {value: "IN", name: "Indiana"}
        {value: "IA", name: "Iowa"}
        {value: "KS", name: "Kansas"}
        {value: "KY", name: "Kentucky"}
        {value: "LA", name: "Louisiana"}
        {value: "ME", name: "Maine"}
        {value: "MD", name: "Maryland"}
        {value: "MA", name: "Massachusetts"}
        {value: "MI", name: "Michigan"}
        {value: "MN", name: "Minnesota"}
        {value: "MS", name: "Mississippi"}
        {value: "MO", name: "Missouri"}
        {value: "MT", name: "Montana"}
        {value: "NE", name: "Nebraska"}
        {value: "NV", name: "Nevada"}
        {value: "NV", name: "Nevada"}
        {value: "NH", name: "New Hampshire"}
        {value: "NJ", name: "New Jersey"}
        {value: "NM", name: "New Mexico"}
        {value: "NY", name: "New York"}
        {value: "NC", name: "North Carolina"}
        {value: "ND", name: "North Dakota"}
        {value: "OH", name: "Ohio"}
        {value: "OK", name: "Oklahoma"}
        {value: "OR", name: "Oregon"}
        {value: "PA", name: "Pennsylvania"}
        {value: "RI", name: "Rhode Island"}
        {value: "SC", name: "South Carolina"}
        {value: "SD", name: "South Dakota"}
        {value: "TN", name: "Tennessee"}
        {value: "TX", name: "Texas"}
        {value: "UT", name: "Utah"}
        {value: "VT", name: "Vermont"}
        {value: "VA", name: "Virginia"}
        {value: "WA", name: "Washington"}
        {value: "WV", name: "West Virginia"}
        {value: "WI", name: "Wisconsin"}
        {value: "WY", name: "Wyoming"}
      ]

  riot.mixin "fixDate", init: ->
    @fixDate = (date) ->
      try
        date = new Date(Date.parse date).toISOString().split("T")[0]
      catch
        date = ""
      date
    @fixTime = (date) ->
      try
        date = new Date(Date.parse date).toISOString().split("T")[1].split(":", 2).join ":"
      catch
        date = ""
      date

  riot.mixin "message", init: ->
      @message = (message) ->
        document.querySelector(".snackbar").MaterialSnackbar.showSnackbar {message}

  riot.mixin "multiSelectValues", init: ->
    @multiSelectValues = (multiSelect) ->
      [multiSelect.querySelectorAll("option:checked")...].map (option) -> option.value

  triggerRoute = (tag) ->
    tag.trigger "route"
    triggerRoute tag for tag in tag.tags

  riot.mixin "sound", init: -> @sound = sound

  riot.mixin "state", init: ->
    {actions, store} = require "./redux"
    @actions = actions
    @dispatch = store.dispatch
    @state = store.getState()
    unsubscribe = null
    @on "mount", ->
      @state = store.getState()
      unsubscribe = store.subscribe =>
        @state = store.getState()
        @update()
    @on "unmount", -> unsubscribe()

  register = (name, mixin) -> riot.mixin name, init: -> @[name] = mixin
  register name, mixin for name, mixin of mixins
