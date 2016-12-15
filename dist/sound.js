module.exports = {
  init: function(sounds) {
    var audio, file, html5Sounds, ref, results, sound;
    this.sounds = Object.keys(sounds);
    if (((ref = window.plugins) != null ? ref.NativeAudio : void 0) != null) {
      module.exports.play = window.plugins.NativeAudio.play;
      results = [];
      for (sound in sounds) {
        file = sounds[sound];
        results.push(window.plugins.NativeAudio.preloadSimple(sound, "sounds/" + file, console.info, console.error));
      }
      return results;
    } else {
      html5Sounds = {};
      for (sound in sounds) {
        file = sounds[sound];
        audio = document.createElement("audio");
        audio.setAttribute("src", "sounds/" + file);
        audio.setAttribute("type", "audio/mpeg");
        audio.setAttribute("preload", true);
        document.body.appendChild(audio);
        html5Sounds[sound] = audio;
      }
      return module.exports.play = function(soundName) {
        return html5Sounds[soundName].play();
      };
    }
  }
};

//# sourceMappingURL=sound.js.map
