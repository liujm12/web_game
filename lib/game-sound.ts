export const SOUND_PREFERENCE_KEY = "turboarcade-sound-v1";
export const SOUND_PREFERENCE_EVENT = "turboarcade-sound-change";

export type GameSoundEffect =
  | "start"
  | "move"
  | "score"
  | "merge"
  | "combo"
  | "win"
  | "error"
  | "over"
  | "pad-0"
  | "pad-1"
  | "pad-2"
  | "pad-3";

type ToneStep = {
  frequency: number;
  endFrequency?: number;
  duration: number;
  delay?: number;
  type?: OscillatorType;
  gain?: number;
};

const SOUND_PATTERNS: Record<GameSoundEffect, ToneStep[]> = {
  start: [
    { frequency: 392, duration: 0.06, type: "triangle", gain: 0.06 },
    { frequency: 523.25, duration: 0.09, delay: 0.055, type: "triangle", gain: 0.07 },
  ],
  move: [
    { frequency: 270, endFrequency: 340, duration: 0.045, type: "sine", gain: 0.045 },
  ],
  score: [
    { frequency: 523.25, duration: 0.06, type: "triangle", gain: 0.065 },
    { frequency: 659.25, duration: 0.09, delay: 0.05, type: "triangle", gain: 0.07 },
  ],
  merge: [
    { frequency: 440, endFrequency: 660, duration: 0.09, type: "triangle", gain: 0.065 },
  ],
  combo: [
    { frequency: 523.25, duration: 0.055, type: "triangle", gain: 0.065 },
    { frequency: 659.25, duration: 0.055, delay: 0.05, type: "triangle", gain: 0.07 },
    { frequency: 783.99, duration: 0.11, delay: 0.1, type: "triangle", gain: 0.075 },
  ],
  win: [
    { frequency: 523.25, duration: 0.07, type: "triangle", gain: 0.07 },
    { frequency: 659.25, duration: 0.07, delay: 0.065, type: "triangle", gain: 0.07 },
    { frequency: 783.99, duration: 0.07, delay: 0.13, type: "triangle", gain: 0.075 },
    { frequency: 1046.5, duration: 0.18, delay: 0.195, type: "triangle", gain: 0.08 },
  ],
  error: [
    { frequency: 220, endFrequency: 165, duration: 0.11, type: "sawtooth", gain: 0.04 },
  ],
  over: [
    { frequency: 293.66, duration: 0.09, type: "triangle", gain: 0.06 },
    { frequency: 220, duration: 0.11, delay: 0.085, type: "triangle", gain: 0.06 },
    { frequency: 164.81, duration: 0.18, delay: 0.185, type: "triangle", gain: 0.055 },
  ],
  "pad-0": [{ frequency: 261.63, duration: 0.18, type: "sine", gain: 0.075 }],
  "pad-1": [{ frequency: 329.63, duration: 0.18, type: "sine", gain: 0.075 }],
  "pad-2": [{ frequency: 392.0, duration: 0.18, type: "sine", gain: 0.075 }],
  "pad-3": [{ frequency: 523.25, duration: 0.18, type: "sine", gain: 0.075 }],
};

type WindowWithWebkitAudio = Window & {
  webkitAudioContext?: typeof AudioContext;
};

let sharedAudioContext: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") {
    return null;
  }

  if (sharedAudioContext) {
    return sharedAudioContext;
  }

  const AudioContextCtor =
    window.AudioContext ?? (window as WindowWithWebkitAudio).webkitAudioContext;

  if (typeof AudioContextCtor !== "function") {
    return null;
  }

  try {
    sharedAudioContext = new AudioContextCtor();
    return sharedAudioContext;
  } catch {
    return null;
  }
}

export function resetAudioContextForTests() {
  sharedAudioContext = null;
}

export function parseSoundEnabled(raw: string | null): boolean {
  if (raw === "off" || raw === "false") {
    return false;
  }

  return true;
}

export function readSoundSnapshot(): string {
  if (typeof window === "undefined") {
    return "on";
  }

  try {
    return typeof window.localStorage?.getItem === "function"
      ? window.localStorage.getItem(SOUND_PREFERENCE_KEY) ?? "on"
      : "on";
  } catch {
    return "on";
  }
}

export function readSoundEnabled(): boolean {
  return parseSoundEnabled(readSoundSnapshot());
}

export function writeSoundEnabled(enabled: boolean) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    if (typeof window.localStorage?.setItem === "function") {
      window.localStorage.setItem(SOUND_PREFERENCE_KEY, enabled ? "on" : "off");
    }
    window.dispatchEvent(new Event(SOUND_PREFERENCE_EVENT));
  } catch {
    return;
  }
}

export function toggleSoundEnabled(): boolean {
  const next = !readSoundEnabled();
  writeSoundEnabled(next);
  return next;
}

export function playGameSound(effect: GameSoundEffect) {
  if (!readSoundEnabled()) {
    return;
  }

  const context = getAudioContext();
  if (!context) {
    return;
  }

  try {
    if (context.state === "suspended") {
      void context.resume();
    }

    const steps = SOUND_PATTERNS[effect];
    const baseTime = context.currentTime;

    for (const step of steps) {
      const startTime = baseTime + (step.delay ?? 0);
      const stopTime = startTime + step.duration;
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();
      const peakGain = step.gain ?? 0.06;

      oscillator.type = step.type ?? "triangle";
      oscillator.frequency.setValueAtTime(step.frequency, startTime);
      if (step.endFrequency && step.endFrequency !== step.frequency) {
        oscillator.frequency.exponentialRampToValueAtTime(
          step.endFrequency,
          stopTime,
        );
      }

      gainNode.gain.setValueAtTime(0.0001, startTime);
      gainNode.gain.exponentialRampToValueAtTime(peakGain, startTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, stopTime);

      oscillator.connect(gainNode);
      gainNode.connect(context.destination);

      oscillator.start(startTime);
      oscillator.stop(stopTime + 0.01);
    }
  } catch {
    return;
  }
}
