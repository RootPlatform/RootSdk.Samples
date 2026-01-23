// Audio Manager for game sound effects using Web Audio API

class AudioManager {
  private audioContext: AudioContext | null = null;
  private enabled: boolean = true;

  private getContext(): AudioContext {
    if (!this.audioContext) {
      this.audioContext = new AudioContext();
    }
    return this.audioContext;
  }

  public setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public toggle(): boolean {
    this.enabled = !this.enabled;
    return this.enabled;
  }

  // Play a simple beep sound
  private playTone(frequency: number, duration: number, type: OscillatorType = "sine", volume: number = 0.3): void {
    if (!this.enabled) return;

    try {
      const ctx = this.getContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

      gainNode.gain.setValueAtTime(volume, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + duration);
    } catch (e) {
      console.warn("Audio playback failed:", e);
    }
  }

  // Sound when placing a move
  public playMove(): void {
    this.playTone(440, 0.1, "sine", 0.2);
  }

  // Sound when opponent makes a move
  public playOpponentMove(): void {
    this.playTone(330, 0.1, "sine", 0.15);
  }

  // Victory fanfare
  public playWin(): void {
    if (!this.enabled) return;

    try {
      const ctx = this.getContext();
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      const duration = 0.15;

      notes.forEach((freq, index) => {
        setTimeout(() => {
          this.playTone(freq, 0.3, "sine", 0.25);
        }, index * duration * 1000);
      });
    } catch (e) {
      console.warn("Audio playback failed:", e);
    }
  }

  // Loss sound
  public playLose(): void {
    if (!this.enabled) return;

    try {
      const ctx = this.getContext();
      const notes = [392, 349.23, 329.63, 293.66]; // G4, F4, E4, D4
      const duration = 0.2;

      notes.forEach((freq, index) => {
        setTimeout(() => {
          this.playTone(freq, 0.25, "sine", 0.2);
        }, index * duration * 1000);
      });
    } catch (e) {
      console.warn("Audio playback failed:", e);
    }
  }

  // Draw sound
  public playDraw(): void {
    this.playTone(349.23, 0.3, "triangle", 0.2);
    setTimeout(() => {
      this.playTone(349.23, 0.3, "triangle", 0.2);
    }, 350);
  }

  // Match found sound
  public playMatchFound(): void {
    if (!this.enabled) return;

    this.playTone(523.25, 0.15, "sine", 0.25);
    setTimeout(() => {
      this.playTone(659.25, 0.15, "sine", 0.25);
    }, 150);
    setTimeout(() => {
      this.playTone(783.99, 0.2, "sine", 0.25);
    }, 300);
  }

  // Click/UI sound
  public playClick(): void {
    this.playTone(600, 0.05, "sine", 0.15);
  }
}

export const audioManager = new AudioManager();
