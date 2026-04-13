"use client";

import { useCallback, useEffect, useState } from "react";
import { AudioEngine } from "@/lib/audio/audioEngine";
import { requestScreenWakeLock } from "@/lib/audio/wakeLock";
import {
  defaultSettings,
  loadSettings,
  saveSettings,
  type BorkBoxSettings,
} from "@/lib/settings";
import { SplashScreen } from "@/components/splash/SplashScreen";

export function HomeClient() {
  const [settings, setSettings] = useState<BorkBoxSettings>(defaultSettings);
  const [hydrated, setHydrated] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    const s = loadSettings();
    setSettings(s);
    setShowSplash(!s.completedOnboarding);
    setHydrated(true);
  }, []);

  const handleStartTraining = useCallback(() => {
    if (starting) return;
    setStarting(true);

    AudioEngine.primeAudioContextFromGesture();

    void (async () => {
      try {
        await AudioEngine.unlockWebAudio();
        await requestScreenWakeLock();

        const next: BorkBoxSettings = {
          ...loadSettings(),
          completedOnboarding: true,
        };
        saveSettings(next);
        setSettings(next);
        setShowSplash(false);
        AudioEngine.playCalibrationChime();
      } finally {
        setStarting(false);
      }
    })();
  }, [starting]);

  if (!hydrated) {
    return (
      <div className="min-h-[100dvh] bg-slate-50 dark:bg-slate-900" aria-hidden />
    );
  }

  return (
    <div className="relative min-h-[100dvh] bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-50">
      <main
        className="mx-auto flex min-h-[100dvh] max-w-lg flex-col px-4 py-6"
        style={{
          paddingTop: "max(1.5rem, env(safe-area-inset-top))",
          paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))",
          paddingLeft: "max(1rem, env(safe-area-inset-left))",
          paddingRight: "max(1rem, env(safe-area-inset-right))",
        }}
      >
        <header className="mb-6 text-center">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
            BorkBox
          </p>
          <h1 className="mt-1 text-2xl font-bold">Training mode</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Soundboard zones will appear here in the next milestone.
          </p>
        </header>

        <section className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white/50 p-6 dark:border-slate-600 dark:bg-slate-800/30">
          <p className="text-center text-sm text-slate-600 dark:text-slate-400">
            Onboarding complete. Theme preference:{" "}
            <span className="font-medium text-slate-900 dark:text-slate-100">
              {settings.theme}
            </span>
            .
          </p>
        </section>
      </main>

      {showSplash ? (
        <SplashScreen onStartTraining={handleStartTraining} busy={starting} />
      ) : null}
    </div>
  );
}
