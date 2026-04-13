"use client";

import { Howl, Howler } from "howler";

function writeAscii(view: DataView, offset: number, str: string) {
  for (let i = 0; i < str.length; i += 1) {
    view.setUint8(offset + i, str.charCodeAt(i));
  }
}

/** Short PCM WAV (mono 16-bit) as a data URI — no network, Web Audio friendly. */
function buildCalibrationWavDataUri(): string {
  const sampleRate = 22050;
  const durationSec = 0.22;
  const freq = 880;
  const numSamples = Math.floor(durationSec * sampleRate);
  const dataSize = numSamples * 2;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

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

  let offset = 44;
  for (let i = 0; i < numSamples; i += 1) {
    const t = i / sampleRate;
    const env = Math.min(1, i / 120) * Math.min(1, (numSamples - i) / 400);
    const s = Math.sin(2 * Math.PI * freq * t) * 0.35 * env;
    const int16 = Math.max(-1, Math.min(1, s)) * 0x7fff;
    view.setInt16(offset, int16, true);
    offset += 2;
  }

  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i += 1) {
    binary += String.fromCharCode(bytes[i]!);
  }
  return `data:audio/wav;base64,${btoa(binary)}`;
}

let calibrationHowl: Howl | null = null;

function getCalibrationHowl(): Howl {
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

/**
 * Ensures Howler’s Web Audio context exists and is running.
 * Call from a user gesture; avoid awaiting before the first `play()` on iOS Safari.
 */
export async function unlockWebAudio(): Promise<void> {
  getCalibrationHowl();
  const ctx = Howler.ctx;
  if (ctx?.state === "suspended") {
    await ctx.resume();
  }
}

/**
 * Synchronously primes playback from a tap/click handler so iOS allows audio.
 * Pairs with `unlockWebAudio()` (await resume) in the same handler.
 */
export function primeAudioContextFromGesture(): void {
  const h = getCalibrationHowl();
  h.volume(0.0001);
  const id = h.play();
  if (id) {
    h.stop(id);
  }
  h.volume(0.1);
}

/** Calibration chime at 10% volume per user flow. */
export function playCalibrationChime(): void {
  const h = getCalibrationHowl();
  h.stop();
  h.volume(0.1);
  h.play();
}

export function isWebAudioRunning(): boolean {
  return Howler.ctx?.state === "running";
}

/** Howler-backed Web Audio helper: unlock on gesture, calibration chime, `html5: false`. */
export const AudioEngine = {
  primeAudioContextFromGesture,
  unlockWebAudio,
  playCalibrationChime,
  isWebAudioRunning,
} as const;
