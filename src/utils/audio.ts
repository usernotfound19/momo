// Web Audio API ambient chime and acoustic chord generator

class SoundManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = true;
  private ambientInterval: number | null = null;
  private happyInterval: number | null = null;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (!this.isMuted) {
      this.initCtx();
      this.startAmbientChimes();
      this.playGentleChime(523.25); // C5 welcome chime
    } else {
      this.stopAmbientChimes();
      this.stopHappySong();
    }
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public unmuteAndPlay() {
    this.isMuted = false;
    this.initCtx();
    this.playCelebrationChord();
  }

  // Play a soft bell/crystal chime tone
  public playGentleChime(freq: number = 587.33, duration: number = 1.2) {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.0001, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.08, this.ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // Audio autoplay policy fallback
    }
  }

  // Play bouncy notes for Happy Happy Happy meme song
  public playHappyHappySong() {
    this.initCtx();
    if (!this.ctx) return;

    this.stopAmbientChimes();
    this.stopHappySong();

    // Notes sequence resembling the bouncy happy happy happy cat jingle
    // Rhythm: Dun dun dun, dun dun dun dun dun! (Upbeat major bouncy tones)
    const pattern = [
      { f: 523.25, d: 0.14 }, // C5
      { f: 587.33, d: 0.14 }, // D5
      { f: 659.25, d: 0.22 }, // E5
      { f: 659.25, d: 0.14 }, // E5
      { f: 783.99, d: 0.14 }, // G5
      { f: 659.25, d: 0.14 }, // E5
      { f: 587.33, d: 0.14 }, // D5
      { f: 523.25, d: 0.28 }, // C5
      { f: 783.99, d: 0.18 }, // G5
      { f: 880.00, d: 0.18 }, // A5
      { f: 1046.50, d: 0.35 }, // C6
    ];

    let step = 0;
    const playStep = () => {
      if (!this.ctx) return;
      const note = pattern[step % pattern.length];
      step++;

      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(note.f, this.ctx.currentTime);

        gain.gain.setValueAtTime(0.0001, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.12, this.ctx.currentTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + note.d);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + note.d);
      } catch {
        // Audio error fallback
      }
    };

    playStep();
    this.happyInterval = window.setInterval(playStep, 180);
  }

  public stopHappySong() {
    if (this.happyInterval) {
      clearInterval(this.happyInterval);
      this.happyInterval = null;
    }
  }

  // Play gentle celebratory chord when she forgives
  public playCelebrationChord() {
    this.initCtx();
    const notes = [261.63, 329.63, 392.0, 493.88, 587.33, 659.25, 783.99]; // Cmaj9
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playGentleChime(freq, 2.0);
      }, idx * 100);
    });
  }

  // Calm ambient chord progressions
  private startAmbientChimes() {
    if (this.ambientInterval) return;

    const chords = [
      [261.63, 329.63, 392.0, 493.88], // Cmaj7
      [220.0, 261.63, 329.63, 392.0],  // Am7
      [174.61, 220.0, 261.63, 329.63], // Fmaj7
      [196.0, 246.94, 293.66, 392.0],  // G
    ];

    let chordIndex = 0;

    const playNext = () => {
      if (this.isMuted || !this.ctx) return;
      const currentChord = chords[chordIndex % chords.length];
      chordIndex++;

      currentChord.forEach((freq, i) => {
        setTimeout(() => {
          if (!this.isMuted && this.ctx) {
            try {
              const osc = this.ctx.createOscillator();
              const gain = this.ctx.createGain();
              osc.type = 'sine';
              osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
              gain.gain.setValueAtTime(0.0001, this.ctx.currentTime);
              gain.gain.linearRampToValueAtTime(0.018, this.ctx.currentTime + 0.3);
              gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 4.5);
              osc.connect(gain);
              gain.connect(this.ctx.destination);
              osc.start();
              osc.stop(this.ctx.currentTime + 4.5);
            } catch {
              // Ignore
            }
          }
        }, i * 350);
      });
    };

    playNext();
    this.ambientInterval = window.setInterval(playNext, 7000);
  }

  private stopAmbientChimes() {
    if (this.ambientInterval) {
      clearInterval(this.ambientInterval);
      this.ambientInterval = null;
    }
  }
}

export const soundManager = new SoundManager();
