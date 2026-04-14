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

  var soundDefs = {
    calibration: {
      loop: false,
      baseVolume: 1,
      src: ["sounds/calibration.wav"],
    },
    clicker: {
      loop: false,
      baseVolume: 0.95,
      src: ["sounds/clicker.wav"],
    },
    whistle: {
      loop: false,
      baseVolume: 0.75,
      src: ["sounds/whistle.m4a", "sounds/whistle.mp3"],
    },
    buzzer: {
      loop: false,
      baseVolume: 0.7,
      src: ["sounds/buzzer.wav"],
    },
    doorbell: {
      loop: true,
      baseVolume: 0.55,
      src: ["sounds/doorbell.mp3"],
    },
    barks: {
      loop: true,
      baseVolume: 0.6,
      src: ["sounds/barks.mp3"],
    },
    fireworks: {
      loop: true,
      baseVolume: 0.5,
      src: ["sounds/fireworks.mp3"],
    },
  };

  var howlCache = {};
  var activeLoopId = null;
  var masterVolume = 1;

  function getHowl(id) {
    if (howlCache[id]) return howlCache[id];
    var def = soundDefs[id];
    if (!def) return null;
    var audioFormat = def.src
      .map(function (srcPath) {
        var extMatch = srcPath.match(/\.(\w+)$/);
        return extMatch ? extMatch[1].toLowerCase() : null;
      })
      .filter(Boolean);
    if (!audioFormat.length) audioFormat = ["wav"];
    var h = new Howl({
      src: def.src,
      format: audioFormat,
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
    });
  }

  function setAcclimationPlaying(btn, on) {
    clearAcclimationPlayingUI();
    if (on && btn) {
      btn.classList.add("bb-playing-slate");
      btn.setAttribute("aria-pressed", "true");
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

  function bindInfoLightbox(openBtnId, rootId, closeBtnId) {
    var openBtn = $(openBtnId);
    var lb = $(rootId);
    var closeBtn = $(closeBtnId);
    if (!openBtn || !lb) return;

    openBtn.classList.add("bb-info-hint");

    var backdrop = lb.querySelector("[data-bb-lightbox-dismiss]");

    function open() {
      if (!lb.classList.contains("hidden")) return;
      openBtn.classList.remove("bb-info-hint");
      setVisible(lb, true);
      lb.setAttribute("aria-hidden", "false");
      openBtn.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";
      if (closeBtn) closeBtn.focus();
    }

    function close() {
      if (lb.classList.contains("hidden")) return;
      setVisible(lb, false);
      lb.setAttribute("aria-hidden", "true");
      openBtn.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
      openBtn.focus();
    }

    openBtn.addEventListener("click", open);
    if (closeBtn) closeBtn.addEventListener("click", close);
    if (backdrop) backdrop.addEventListener("click", close);

    document.addEventListener("keydown", function (e) {
      if (e.key !== "Escape") return;
      if (lb.classList.contains("hidden")) return;
      e.preventDefault();
      close();
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
      bindSoundboard();
    } else {
      showSplashOverlay();
    }

    bindInfoLightbox("acclimation-info-open", "acclimation-info-lightbox", "acclimation-info-close");
    bindInfoLightbox("commands-info-open", "commands-info-lightbox", "commands-info-close");
    bindInfoLightbox("about-info-open", "about-info-lightbox", "about-info-close");

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
          startBtn.textContent = "Start training";
        });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
