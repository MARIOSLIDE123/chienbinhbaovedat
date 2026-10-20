// Web Audio API Sound Effects Utility for Interactive Learning
// Zero-latency, works completely offline with no external audio file dependencies.

class SoundEffectsManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  constructor() {
    try {
      const saved = localStorage.getItem('green_planet_sound_muted');
      if (saved) {
        this.isMuted = JSON.parse(saved);
      }
    } catch {
      this.isMuted = false;
    }
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    try {
      localStorage.setItem('green_planet_sound_muted', JSON.stringify(muted));
    } catch {}
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Cheerful, bright chime chord for correct answers (C5 -> E5 -> G5 -> C6)
   */
  public playCorrect() {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const notes = [
        { freq: 523.25, time: 0, duration: 0.18 },    // C5
        { freq: 659.25, time: 0.08, duration: 0.22 }, // E5
        { freq: 783.99, time: 0.16, duration: 0.25 }, // G5
        { freq: 1046.50, time: 0.24, duration: 0.45 } // C6
      ];

      const now = ctx.currentTime;

      notes.forEach(({ freq, time, duration }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        // Pleasant sine/triangle mix
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + time);

        // Volume envelope
        gain.gain.setValueAtTime(0, now + time);
        gain.gain.linearRampToValueAtTime(0.28, now + time + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + time + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + time);
        osc.stop(now + time + duration);
      });
    } catch (e) {
      console.warn('Could not play correct sound', e);
    }
  }

  /**
   * Gentle, soft two-tone reminder for incorrect answers
   */
  public playIncorrect() {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;

      // First lower tone
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(260, now);
      osc1.frequency.exponentialRampToValueAtTime(200, now + 0.18);

      gain1.gain.setValueAtTime(0.22, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.18);

      // Second tone slightly lower
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(190, now + 0.16);
      osc2.frequency.exponentialRampToValueAtTime(140, now + 0.38);

      gain2.gain.setValueAtTime(0.22, now + 0.16);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.16);
      osc2.stop(now + 0.38);
    } catch (e) {
      console.warn('Could not play incorrect sound', e);
    }
  }
}

export const soundEffects = new SoundEffectsManager();
export const playCorrectSound = () => soundEffects.playCorrect();
export const playIncorrectSound = () => soundEffects.playIncorrect();
