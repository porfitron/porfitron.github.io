"use client";

import { BellOff } from "lucide-react";

type SplashScreenProps = {
  onStartTraining: () => void;
  busy?: boolean;
};

export function SplashScreen({ onStartTraining, busy }: SplashScreenProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex min-h-[100dvh] flex-col bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-50"
      style={{
        paddingTop: "max(1rem, env(safe-area-inset-top))",
        paddingBottom: "max(1rem, env(safe-area-inset-bottom))",
        paddingLeft: "max(1rem, env(safe-area-inset-left))",
        paddingRight: "max(1rem, env(safe-area-inset-right))",
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="splash-title"
      aria-describedby="splash-desc"
    >
      <div className="flex flex-1 flex-col items-center justify-center gap-8 px-4">
        <div className="text-center">
          <h1
            id="splash-title"
            className="text-3xl font-bold tracking-tight sm:text-4xl"
          >
            BorkBox™
          </h1>
          <p
            id="splash-desc"
            className="mt-2 max-w-sm text-sm text-slate-600 dark:text-slate-400"
          >
            Tap below to enable sound and keep your screen awake while training.
          </p>
        </div>

        <div className="flex w-full max-w-sm flex-col gap-3 rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur-sm dark:border-slate-700 dark:bg-slate-800/80">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200">
              <BellOff className="h-5 w-5" aria-hidden />
            </div>
            <div className="min-w-0 text-left text-sm leading-relaxed text-slate-700 dark:text-slate-300">
              <p className="font-medium text-slate-900 dark:text-slate-100">
                Check the silent switch (iPhone)
              </p>
              <p className="mt-1">
                If the side mute switch shows orange, training sounds will not play even after
                you unlock audio. Flip it off before you start.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="shrink-0 px-4 pb-2">
        <button
          type="button"
          onClick={onStartTraining}
          disabled={busy}
          className="flex min-h-[52px] w-full items-center justify-center rounded-xl bg-slate-900 px-4 text-base font-semibold text-white shadow-md transition-transform active:scale-95 disabled:opacity-60 dark:bg-slate-100 dark:text-slate-900"
        >
          {busy ? "Starting…" : "Start Training"}
        </button>
      </div>
    </div>
  );
}
