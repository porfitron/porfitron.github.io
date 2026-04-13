(function () {
  "use strict";

  var STORAGE_KEY = "borkbox_settings";
  var SR = 22050;

  var defaultSettings = {
    theme: "light",
    volume: 1,
    completedOnboarding: false,
  };

  function mergeSettings(raw) {
    if (!raw || typeof raw !== "object") {
      return Object.assign({}, defaultSettings);
    }
    var theme =
      raw.theme === "dark" || raw.theme === "light" ? raw.theme : defaultSettings.theme;
    var volume =
      typeof raw.volume === "number" && isFinite(raw.volume)
        ? Math.min(1, Math.max(0, raw.volume))
        : defaultSettings.volume;
    var completedOnboarding =
      typeof raw.completedOnboarding === "boolean"
        ? raw.completedOnboarding
        : defaultSettings.completedOnboarding;
    return { theme: theme, volume: volume, completedOnboarding: completedOnboarding };
  }

  function loadSettings() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return Object.assign({}, defaultSettings);
      return mergeSettings(JSON.parse(raw));
    } catch {
      return Object.assign({}, defaultSettings);
    }
  }

  function saveSettings(settings) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      /* ignore */
    }
  }

  function writeAscii(view, offset, str) {
    for (var i = 0; i < str.length; i += 1) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  }

  function buildMonoWavDataUri(numSamples, sampleAt) {
    var dataSize = numSamples * 2;
    var buffer = new ArrayBuffer(44 + dataSize);
    var view = new DataView(buffer);

    writeAscii(view, 0, "RIFF");
    view.setUint32(4, 36 + dataSize, true);
    writeAscii(view, 8, "WAVE");
    writeAscii(view, 12, "fmt ");
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, SR, true);
    view.setUint32(28, SR * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeAscii(view, 36, "data");
    view.setUint32(40, dataSize, true);

    var o = 44;
    for (var i = 0; i < numSamples; i += 1) {
      var s = sampleAt(i, numSamples);
      var int16 = Math.max(-1, Math.min(1, s)) * 0x7fff;
      view.setInt16(o, int16, true);
      o += 2;
    }

    var bytes = new Uint8Array(buffer);
    var binary = "";
    for (var j = 0; j < bytes.byteLength; j += 1) {
      binary += String.fromCharCode(bytes[j]);
    }
    return "data:audio/wav;base64," + btoa(binary);
  }

  function edgeFade(i, n, samples) {
    var a = Math.min(i, n - 1 - i) / samples;
    return a < 1 ? a : 1;
  }

  var soundDefs = {
    calibration: {
      loop: false,
      baseVolume: 1,
      uri: function () {
        var n = Math.floor(0.22 * SR);
        return buildMonoWavDataUri(n, function (i, num) {
          var t = i / SR;
          var env = Math.min(1, i / 120) * Math.min(1, (num - i) / 400);
          return Math.sin((2 * Math.PI * 880 * t) / 1) * 0.35 * env;
        });
      },
    },
    clicker: {
      loop: false,
      baseVolume: 0.95,
      uri: function () {
        var n = Math.floor(0.06 * SR);
        return buildMonoWavDataUri(n, function (i) {
          var t = i / SR;
          return (
            Math.sin(2 * Math.PI * 2600 * t) * Math.exp(-t * 95) * 0.85 +
            Math.sin(2 * Math.PI * 5200 * t) * Math.exp(-t * 120) * 0.25
          );
        });
      },
    },
    whistle: {
      loop: false,
      baseVolume: 0.75,
      uri: function () {
        var n = Math.floor(0.38 * SR);
        return buildMonoWavDataUri(n, function (i) {
          var t = i / SR;
          var vib = 1 + 0.04 * Math.sin(2 * Math.PI * 11 * t);
          var env = Math.min(1, i / 80) * Math.min(1, (n - i) / 200);
          return Math.sin(2 * Math.PI * 2900 * t * vib) * 0.4 * env;
        });
      },
    },
    buzzer: {
      loop: false,
      baseVolume: 0.7,
      uri: function () {
        var n = Math.floor(0.32 * SR);
        return buildMonoWavDataUri(n, function (i, num) {
          var t = i / SR;
          var sq = Math.sign(Math.sin(2 * Math.PI * 105 * t));
          var env = Math.min(1, i / 40) * Math.min(1, (num - i) / 120);
          return sq * 0.38 * env;
        });
      },
    },
    doorbell: {
      loop: true,
      baseVolume: 0.55,
      uri: function () {
        var n = Math.floor(3.2 * SR);
        return buildMonoWavDataUri(n, function (i, num) {
          var t = i / SR;
          var s = 0;
          if (t < 0.22) {
            var d = t / 0.22;
            s += Math.sin(2 * Math.PI * 784 * t) * Math.pow(1 - d, 1.8) * 0.5;
          }
          if (t > 0.58 && t < 1.05) {
            var u = t - 0.58;
            var w = u / 0.47;
            s += Math.sin(2 * Math.PI * 523 * u) * Math.pow(1 - w, 1.6) * 0.48;
          }
          return s * edgeFade(i, num, 320);
        });
      },
    },
    barks: {
      loop: true,
      baseVolume: 0.6,
      uri: function () {
        var period = 0.52;
        var n = Math.floor(period * 4 * SR);
        return buildMonoWavDataUri(n, function (i, num) {
          var t = i / SR;
          var p = t % period;
          var env = 0;
          if (p < 0.16) {
            var u = p / 0.16;
            env = Math.sin(Math.PI * u) * Math.sin(Math.PI * u);
          }
          var gr =
            0.55 * Math.sin(2 * Math.PI * 190 * t) +
            0.22 * Math.sin(2 * Math.PI * 380 * t) +
            0.12 * Math.sin(2 * Math.PI * 95 * t);
          return gr * env * 0.5 * edgeFade(i, num, 280);
        });
      },
    },
    fireworks: {
      loop: true,
      baseVolume: 0.5,
      uri: function () {
        var n = Math.floor(2.4 * SR);
        return buildMonoWavDataUri(n, function (i, num) {
          var t = i / SR;
          var hiss = Math.sin(i * 0.103) * Math.sin(i * 0.0313) * 0.07;
          var pops = [0.22, 0.55, 0.88, 1.25, 1.72, 2.05];
          var pop = 0;
          for (var k = 0; k < pops.length; k += 1) {
            var dt = t - pops[k];
            if (dt > 0 && dt < 0.09) {
              pop +=
                Math.sin(2 * Math.PI * (140 + k * 20) * dt) *
                (1 - dt / 0.09) *
                (0.42 - k * 0.04);
            }
          }
          return (hiss + pop) * edgeFade(i, num, 360);
        });
      },
    },
  };

  var howlCache = {};
  var activeLoopId = null;
  var masterVolume = 1;

  function getHowl(id) {
    if (howlCache[id]) return howlCache[id];
    var def = soundDefs[id];
    if (!def) return null;
    var h = new Howl({
      src: [def.uri()],
      format: ["wav"],
      html5: false,
      preload: true,
      loop: !!def.loop,
      volume: def.baseVolume * masterVolume,
    });
    howlCache[id] = h;
    return h;
  }

  function setMasterVolume(v) {
    masterVolume = Math.min(1, Math.max(0, v));
    Object.keys(soundDefs).forEach(function (id) {
      var h = howlCache[id];
      var def = soundDefs[id];
      if (h && def) h.volume(def.baseVolume * masterVolume);
    });
  }

  function ensureAudioUnlocked() {
    var ctx = Howler.ctx;
    if (ctx && ctx.state === "suspended") {
      return ctx.resume();
    }
    return Promise.resolve();
  }

  function primeAudioContextFromGesture() {
    var h = getHowl("calibration");
    if (!h) return;
    h.volume(0.0001 * masterVolume);
    var id = h.play();
    if (id) h.stop(id);
    h.volume(soundDefs.calibration.baseVolume * masterVolume * 0.1);
  }

  function unlockWebAudio() {
    getHowl("calibration");
    return ensureAudioUnlocked();
  }

  function playCalibrationChime() {
    var h = getHowl("calibration");
    if (!h) return;
    h.stop();
    h.volume(soundDefs.calibration.baseVolume * masterVolume * 0.1);
    h.play();
  }

  var AudioEngine = {
    primeAudioContextFromGesture: primeAudioContextFromGesture,
    unlockWebAudio: unlockWebAudio,
    playCalibrationChime: playCalibrationChime,
  };

  var wakeSentinel = null;

  function requestScreenWakeLock() {
    if (typeof navigator === "undefined" || !navigator.wakeLock) {
      return Promise.resolve();
    }
    return navigator.wakeLock
      .request("screen")
      .then(function (sentinel) {
        if (wakeSentinel) {
          try {
            wakeSentinel.release();
          } catch {
            /* ignore */
          }
        }
        wakeSentinel = sentinel;
      })
      .catch(function () {
        /* denied or unsupported */
      });
  }

  function $(id) {
    return document.getElementById(id);
  }

  function setVisible(el, show) {
    if (!el) return;
    el.classList.toggle("hidden", !show);
  }

  function vibrateShort() {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(50);
    }
  }

  function clearAcclimationPlayingUI() {
    document.querySelectorAll(".sound-acclimation").forEach(function (btn) {
      btn.classList.remove("bb-playing-slate");
      btn.setAttribute("aria-pressed", "false");
      var ring = btn.querySelector(".bb-loop-indicator");
      if (ring) {
        ring.classList.add("hidden");
        ring.classList.remove("bb-loop-ring");
      }
    });
  }

  function setAcclimationPlaying(btn, on) {
    clearAcclimationPlayingUI();
    if (on && btn) {
      btn.classList.add("bb-playing-slate");
      btn.setAttribute("aria-pressed", "true");
      var ring = btn.querySelector(".bb-loop-indicator");
      if (ring) {
        ring.classList.remove("hidden");
        ring.classList.add("bb-loop-ring");
      }
    }
  }

  function stopLoop(id) {
    var h = howlCache[id];
    if (h) h.stop();
    if (activeLoopId === id) activeLoopId = null;
  }

  function stopAllLoops() {
    ["doorbell", "barks", "fireworks"].forEach(stopLoop);
    clearAcclimationPlayingUI();
  }

  function bindSoundboard() {
    document.querySelectorAll(".sound-acclimation").forEach(function (btn) {
      var id = btn.getAttribute("data-sound");
      if (!id) return;
      btn.addEventListener("click", function () {
        void ensureAudioUnlocked();
        var h = getHowl(id);
        if (!h) return;

        if (activeLoopId === id && h.playing()) {
          h.stop();
          activeLoopId = null;
          setAcclimationPlaying(null, false);
          return;
        }

        stopAllLoops();
        h.stop();
        h.play();
        activeLoopId = id;
        setAcclimationPlaying(btn, true);
      });
    });

    document.querySelectorAll(".sound-command").forEach(function (btn) {
      var id = btn.getAttribute("data-sound");
      if (!id) return;
      var pulse =
        id === "clicker" ? "bb-playing-green" : id === "whistle" ? "bb-playing-yellow" : "bb-playing-red";
      btn.addEventListener("click", function () {
        void ensureAudioUnlocked();
        vibrateShort();
        var h = getHowl(id);
        if (!h) return;
        h.stop();
        btn.classList.add(pulse);
        h.once("end", function () {
          btn.classList.remove(pulse);
        });
        var playId = h.play();
        if (!playId) btn.classList.remove(pulse);
      });
    });
  }

  function init() {
    if (typeof Howl === "undefined" || typeof Howler === "undefined") {
      console.error("BorkBox: Howler failed to load. Check vendor/howler.min.js.");
      return;
    }

    var splash = $("splash");
    var main = $("main-panel");
    var boot = $("boot-placeholder");
    var startBtn = $("start-training");
    var themeLabel = $("theme-label");
    var adFooter = $("ad-footer");
    var root = $("app-root");

    var starting = false;

    function applyUI(settings) {
      if (themeLabel) themeLabel.textContent = settings.theme;
      setMasterVolume(settings.volume);
    }

    function showMain(settings) {
      setVisible(boot, false);
      setVisible(splash, false);
      setVisible(main, true);
      if (adFooter) setVisible(adFooter, true);
      applyUI(settings);
    }

    function showSplashOverlay() {
      setVisible(boot, false);
      setVisible(main, false);
      if (adFooter) setVisible(adFooter, false);
      setVisible(splash, true);
    }

    var settings = loadSettings();
    if (root) root.setAttribute("data-hydrated", "true");

    if (settings.completedOnboarding) {
      showMain(settings);
      bindSoundboard();
    } else {
      showSplashOverlay();
    }

    if (!startBtn) return;

    startBtn.addEventListener("click", function () {
      if (starting) return;
      starting = true;
      startBtn.disabled = true;
      startBtn.textContent = "Starting…";

      AudioEngine.primeAudioContextFromGesture();

      Promise.resolve()
        .then(function () {
          return AudioEngine.unlockWebAudio();
        })
        .then(function () {
          return requestScreenWakeLock();
        })
        .then(function () {
          var next = Object.assign({}, loadSettings(), { completedOnboarding: true });
          saveSettings(next);
          showMain(next);
          bindSoundboard();
          AudioEngine.playCalibrationChime();
        })
        .finally(function () {
          starting = false;
          startBtn.disabled = false;
          startBtn.textContent = "Start Training";
        });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
