import type { ThemeChime } from "../data/themeFlavors";

const SOUND_KEY = "theme-sound";
let ctx: AudioContext | null = null;

export function isSoundEnabled(): boolean {
  try {
    return localStorage.getItem(SOUND_KEY) === "on";
  } catch {
    return false;
  }
}

export function setSoundEnabled(on: boolean) {
  try {
    localStorage.setItem(SOUND_KEY, on ? "on" : "off");
  } catch {
    // ignore -- per-viewer convenience only
  }
}

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const AudioCtor =
    window.AudioContext ??
    (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtor) return null;
  if (!ctx) ctx = new AudioCtor();
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

function pingNote(
  audioCtx: AudioContext,
  waveform: OscillatorType,
  freq: number,
  startAt: number,
  duration: number,
) {
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  const filter = audioCtx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 4000;

  osc.type = waveform;
  osc.frequency.value = freq;

  gain.gain.setValueAtTime(0, startAt);
  gain.gain.linearRampToValueAtTime(0.16, startAt + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start(startAt);
  osc.stop(startAt + duration + 0.05);
}

/**
 * Short, synthesized "cute" chimes (Web Audio oscillators, no audio
 * files needed). Reads the sound-on/off flag from localStorage itself,
 * so any component can trigger one -- not just the theme picker that
 * owns the toggle UI. Off by default; the AudioContext is only created
 * lazily on first play, inside a real user gesture.
 */
export function playChime(chime: ThemeChime) {
  if (!isSoundEnabled()) return;
  const audioCtx = getCtx();
  if (!audioCtx) return;
  const now = audioCtx.currentTime;

  if (chime.style === "twinkle") {
    pingNote(audioCtx, chime.waveform, chime.baseFreq, now, 0.35);
    pingNote(audioCtx, chime.waveform, chime.baseFreq * 1.5, now + 0.1, 0.4);
  } else {
    pingNote(audioCtx, chime.waveform, chime.baseFreq, now, 0.5);
    pingNote(audioCtx, chime.waveform, chime.baseFreq * 1.5, now, 0.5);
  }
}
