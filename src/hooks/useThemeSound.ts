import { useEffect, useRef, useState } from "react";
import type { ThemeChime } from "../data/themeFlavors";

const SOUND_KEY = "theme-sound";

function readStoredEnabled(): boolean {
  try {
    return localStorage.getItem(SOUND_KEY) === "on";
  } catch {
    return false;
  }
}

/**
 * Short, synthesized "cute" chimes (Web Audio oscillators, no audio
 * files needed) for theme switches and a few celebratory moments.
 * Off by default -- browsers block autoplay anyway, and a portfolio
 * shouldn't make noise without being asked. The AudioContext is only
 * created lazily on the first play, inside a real user gesture.
 */
export function useThemeSound() {
  const [enabled, setEnabled] = useState(readStoredEnabled);
  const ctxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(SOUND_KEY, enabled ? "on" : "off");
    } catch {
      // ignore -- per-viewer convenience only
    }
  }, [enabled]);

  function getCtx(): AudioContext | null {
    if (typeof window === "undefined") return null;
    const AudioCtor = window.AudioContext ?? (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtor) return null;
    if (!ctxRef.current) ctxRef.current = new AudioCtor();
    if (ctxRef.current.state === "suspended") ctxRef.current.resume();
    return ctxRef.current;
  }

  function pingNote(
    ctx: AudioContext,
    waveform: OscillatorType,
    freq: number,
    startAt: number,
    duration: number,
  ) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 4000;

    osc.type = waveform;
    osc.frequency.value = freq;

    gain.gain.setValueAtTime(0, startAt);
    gain.gain.linearRampToValueAtTime(0.16, startAt + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startAt);
    osc.stop(startAt + duration + 0.05);
  }

  function playChime(chime: ThemeChime) {
    if (!enabled) return;
    const ctx = getCtx();
    if (!ctx) return;
    const now = ctx.currentTime;

    if (chime.style === "twinkle") {
      pingNote(ctx, chime.waveform, chime.baseFreq, now, 0.35);
      pingNote(ctx, chime.waveform, chime.baseFreq * 1.5, now + 0.1, 0.4);
    } else {
      pingNote(ctx, chime.waveform, chime.baseFreq, now, 0.5);
      pingNote(ctx, chime.waveform, chime.baseFreq * 1.5, now, 0.5);
    }
  }

  return { enabled, toggleEnabled: () => setEnabled((e) => !e), playChime };
}
