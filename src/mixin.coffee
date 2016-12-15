riot = require "riot"
sound = require "./sound"

module.exports = init: (mixins) ->

  riot.mixin init: -> @on "mount", ->
    componentHandler.upgradeElements @root.querySelectorAll ".mdl"
    componentHandler.upgradeAllRegistered()

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
