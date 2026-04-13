let sentinel: WakeLockSentinel | null = null;

export async function requestScreenWakeLock(): Promise<void> {
  if (typeof navigator === "undefined" || !("wakeLock" in navigator)) return;
  try {
    sentinel?.release();
    sentinel = await navigator.wakeLock.request("screen");
  } catch {
    /* denied, unsupported, or not visible */
  }
}

export function releaseScreenWakeLock(): void {
  try {
    sentinel?.release();
  } catch {
    /* ignore */
  }
  sentinel = null;
}
