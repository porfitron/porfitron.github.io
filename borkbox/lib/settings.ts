export type Theme = "light" | "dark";

export type BorkBoxSettings = {
  theme: Theme;
  volume: number;
  completedOnboarding: boolean;
};

const STORAGE_KEY = "borkbox_settings";

export const defaultSettings: BorkBoxSettings = {
  theme: "light",
  volume: 1,
  completedOnboarding: false,
};

function mergeSettings(raw: unknown): BorkBoxSettings {
  if (!raw || typeof raw !== "object") return { ...defaultSettings };
  const o = raw as Record<string, unknown>;
  const theme = o.theme === "dark" || o.theme === "light" ? o.theme : defaultSettings.theme;
  const volume =
    typeof o.volume === "number" && Number.isFinite(o.volume)
      ? Math.min(1, Math.max(0, o.volume))
      : defaultSettings.volume;
  const completedOnboarding =
    typeof o.completedOnboarding === "boolean"
      ? o.completedOnboarding
      : defaultSettings.completedOnboarding;
  return { theme, volume, completedOnboarding };
}

export function loadSettings(): BorkBoxSettings {
  if (typeof window === "undefined") return { ...defaultSettings };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...defaultSettings };
    return mergeSettings(JSON.parse(raw));
  } catch {
    return { ...defaultSettings };
  }
}

export function saveSettings(settings: BorkBoxSettings): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    /* ignore quota / private mode */
  }
}
