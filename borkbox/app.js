(function () {
  "use strict";

  var STORAGE_KEY = "borkbox_settings";

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

  function buildCalibrationWavDataUri() {
    var sampleRate = 22050;
    var durationSec = 0.22;
    var freq = 880;
    var numSamples = Math.floor(durationSec * sampleRate);
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
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeAscii(view, 36, "data");
    view.setUint32(40, dataSize, true);

    var o = 44;
    for (var i = 0; i < numSamples; i += 1) {
      var t = i / sampleRate;
      var env = Math.min(1, i / 120) * Math.min(1, (numSamples - i) / 400);
      var s = Math.sin(2 * Math.PI * freq * t) * 0.35 * env;
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

  var calibrationHowl = null;

  function getCalibrationHowl() {
    if (!calibrationHowl) {
      calibrationHowl = new Howl({
        src: [buildCalibrationWavDataUri()],
        format: ["wav"],
        html5: false,
        preload: true,
        pool: 2,
      });
    }
    return calibrationHowl;
  }

  var AudioEngine = {
    primeAudioContextFromGesture: function () {
      var h = getCalibrationHowl();
      h.volume(0.0001);
      var id = h.play();
      if (id) h.stop(id);
      h.volume(0.1);
    },
    unlockWebAudio: function () {
      getCalibrationHowl();
      var ctx = Howler.ctx;
      if (ctx && ctx.state === "suspended") {
        return ctx.resume();
      }
      return Promise.resolve();
    },
    playCalibrationChime: function () {
      var h = getCalibrationHowl();
      h.stop();
      h.volume(0.1);
      h.play();
    },
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

  function init() {
    if (typeof Howl === "undefined" || typeof Howler === "undefined") {
      console.error("BorkBox: Howler failed to load. Check network or use a local howler.min.js.");
      return;
    }

    var splash = $("splash");
    var main = $("main-panel");
    var boot = $("boot-placeholder");
    var startBtn = $("start-training");
    var themeLabel = $("theme-label");
    var root = $("app-root");

    var starting = false;

    function applyUI(settings) {
      if (themeLabel) themeLabel.textContent = settings.theme;
    }

    function showMain(settings) {
      setVisible(boot, false);
      setVisible(splash, false);
      setVisible(main, true);
      applyUI(settings);
    }

    function showSplashOverlay() {
      setVisible(boot, false);
      setVisible(main, false);
      setVisible(splash, true);
    }

    var settings = loadSettings();
    if (root) root.setAttribute("data-hydrated", "true");

    if (settings.completedOnboarding) {
      showMain(settings);
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
