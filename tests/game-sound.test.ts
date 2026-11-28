// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  parseSoundEnabled,
  playGameSound,
  readSoundEnabled,
  resetAudioContextForTests,
  SOUND_PREFERENCE_EVENT,
  SOUND_PREFERENCE_KEY,
  toggleSoundEnabled,
  writeSoundEnabled,
} from "@/lib/game-sound";

describe("game sound engine", () => {
  const storage = new Map<string, string>();
  const originalAudioContext = window.AudioContext;

  beforeEach(() => {
    storage.clear();
    resetAudioContextForTests();
    Object.defineProperty(window, "localStorage", {
      configurable: true,
      value: {
        getItem: (key: string) => storage.get(key) ?? null,
        setItem: (key: string, value: string) => storage.set(key, value),
      },
    });
  });

  afterEach(() => {
    resetAudioContextForTests();
    Object.defineProperty(window, "AudioContext", {
      configurable: true,
      writable: true,
      value: originalAudioContext,
    });
  });

  it("defaults to enabled and persists mute toggles in localStorage", () => {
    const listener = vi.fn();
    window.addEventListener(SOUND_PREFERENCE_EVENT, listener);

    expect(parseSoundEnabled(null)).toBe(true);
    expect(readSoundEnabled()).toBe(true);

    expect(toggleSoundEnabled()).toBe(false);
    expect(storage.get(SOUND_PREFERENCE_KEY)).toBe("off");
    expect(readSoundEnabled()).toBe(false);

    expect(toggleSoundEnabled()).toBe(true);
    expect(storage.get(SOUND_PREFERENCE_KEY)).toBe("on");
    expect(readSoundEnabled()).toBe(true);
    expect(listener).toHaveBeenCalledTimes(2);

    window.removeEventListener(SOUND_PREFERENCE_EVENT, listener);
  });

  it("synthesizes Web Audio notes when enabled and stays silent when muted", () => {
    const start = vi.fn();
    const stop = vi.fn();
    const connect = vi.fn();
    const setValueAtTime = vi.fn();
    const exponentialRampToValueAtTime = vi.fn();
    const resume = vi.fn().mockResolvedValue(undefined);

    const createOscillator = vi.fn(() => ({
      type: "sine",
      frequency: { setValueAtTime, exponentialRampToValueAtTime },
      connect,
      start,
      stop,
    }));
    const createGain = vi.fn(() => ({
      gain: { setValueAtTime, exponentialRampToValueAtTime },
      connect,
    }));

    class MockAudioContext {
      state = "suspended";
      currentTime = 1;
      destination = {};
      resume = resume;
      createOscillator = createOscillator;
      createGain = createGain;
    }

    Object.defineProperty(window, "AudioContext", {
      configurable: true,
      writable: true,
      value: MockAudioContext,
    });

    playGameSound("win");

    expect(resume).toHaveBeenCalledTimes(1);
    expect(createOscillator).toHaveBeenCalledTimes(4);
    expect(createGain).toHaveBeenCalledTimes(4);
    expect(start).toHaveBeenCalledTimes(4);
    expect(stop).toHaveBeenCalledTimes(4);

    createOscillator.mockClear();
    writeSoundEnabled(false);
    playGameSound("score");

    expect(createOscillator).not.toHaveBeenCalled();
  });

  it("degrades safely when AudioContext is unavailable", () => {
    Object.defineProperty(window, "AudioContext", {
      configurable: true,
      writable: true,
      value: undefined,
    });

    expect(() => playGameSound("move")).not.toThrow();
  });
});
