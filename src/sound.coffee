module.exports =
  init: (sounds) ->
    @sounds = Object.keys sounds
    if window.plugins?.NativeAudio?
      module.exports.play = window.plugins.NativeAudio.play
      for sound, file of sounds
        window.plugins.NativeAudio.preloadSimple sound, "sounds/#{file}", console.info, console.error
    else
      html5Sounds = {}
      for sound, file of sounds
        audio = document.createElement "audio"
        audio.setAttribute "src", "sounds/#{file}"
        audio.setAttribute "type", "audio/mpeg"
        audio.setAttribute "preload", yes
        document.body.appendChild audio
        html5Sounds[sound] = audio
      module.exports.play = (soundName) -> html5Sounds[soundName].play()
