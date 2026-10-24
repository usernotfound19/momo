// Web Audio API ambient chime and acoustic chord generator

class SoundManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false; // Start enabled, will activate on user interaction
  private ambientInterval: number | null = null;
  private happyInterval: number | null = null;
  private masterGain: GainNode | null = null;

  private initCtx(): boolean {
    try {
      if (!this.ctx) {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(0.3, this.ctx.currentTime); // clear, audible volume
        this.masterGain.connect(this.ctx.destination);
      }

      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      return true;
    } catch (e) {
      console.warn('Audio init error:', e);
      return false;
    }
  }

  public toggleMute(): boolean {
    const ready = this.initCtx();
    this.isMuted = !this.isMuted;

    if (!this.isMuted && ready) {
      this.playGentleChime(523.25, 0.6); // audible feedback note
      this.startAmbientChimes();
    } else {
      this.stopAmbientChimes();
      this.stopHappySong();
    }
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  // Play a soft, audible bell chime tone
  public playGentleChime(freq: number = 587.33, duration: number = 1.0) {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx || !this.masterGain) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.25, this.ctx.currentTime + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // Audio fallback
    }
  }

  // Play upbeat, distinct Happy Happy Happy Cat melody
  public playHappyHappySong() {
    this.isMuted = false;
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;

    this.stopAmbientChimes();
    this.stopHappySong();

    // The iconic bouncy happy happy happy cat theme melody!
    // Bouncy staccato notes: E5 - G#5 - B5 - E6 - B5 - G#5 - E5
    const notes = [
      { f: 659.25, d: 0.12 }, // E5
      { f: 830.61, d: 0.12 }, // G#5
      { f: 987.77, d: 0.15 }, // B5
      { f: 1318.51, d: 0.22 }, // E6
      { f: 987.77, d: 0.14 }, // B5
      { f: 830.61, d: 0.14 }, // G#5
      { f: 659.25, d: 0.24 }, // E5
      { f: 987.77, d: 0.14 }, // B5
      { f: 1174.66, d: 0.14 }, // D6
      { f: 1318.51, d: 0.30 }, // E6
    ];

    let noteIdx = 0;
    const playNote = () => {
      if (this.isMuted || !this.ctx || !this.masterGain) return;
      const current = notes[noteIdx % notes.length];
      noteIdx++;

      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        // Use square/triangle blend for cartoon video game cat bounce
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(current.f, this.ctx.currentTime);

        gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.35, this.ctx.currentTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + current.d);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start();
        osc.stop(this.ctx.currentTime + current.d);
      } catch {
        // Ignore
      }
    };

    playNote();
    this.happyInterval = window.setInterval(playNote, 160);
  }

  public stopHappySong() {
    if (this.happyInterval) {
      clearInterval(this.happyInterval);
      this.happyInterval = null;
    }
  }

  // Play celebration chord progression
  public playCelebrationChord() {
    this.isMuted = false;
    this.initCtx();
    const chord = [523.25, 659.25, 783.99, 987.77, 1046.50]; // Cmaj7 (C5, E5, G5, B5, C6)
    chord.forEach((freq, idx) => {
      setTimeout(() => {
        this.playGentleChime(freq, 2.0);
      }, idx * 120);
    });
  }

  // Ambient gentle romantic chord loops
  public startAmbientChimes() {
    if (this.ambientInterval) return;
    this.initCtx();

    const chords = [
      [261.63, 329.63, 392.00, 493.88], // Cmaj7
      [220.00, 261.63, 329.63, 392.00], // Am7
      [174.61, 220.00, 261.63, 329.63], // Fmaj7
      [196.00, 246.94, 293.66, 392.00], // G
    ];

    let chordIdx = 0;

    const playHarmonics = () => {
      if (this.isMuted || !this.ctx || !this.masterGain) return;
      const current = chords[chordIdx % chords.length];
      chordIdx++;

      current.forEach((freq, i) => {
        setTimeout(() => {
          if (!this.isMuted && this.ctx && this.masterGain) {
            try {
              const osc = this.ctx.createOscillator();
              const gain = this.ctx.createGain();

              osc.type = 'sine';
              osc.frequency.setValueAtTime(freq * 1.5, this.ctx.currentTime); // sweeter higher octave

              gain.gain.setValueAtTime(0.0001, this.ctx.currentTime);
              gain.gain.linearRampToValueAtTime(0.08, this.ctx.currentTime + 0.25);
              gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 3.8);

              osc.connect(gain);
              gain.connect(this.masterGain);

              osc.start();
              osc.stop(this.ctx.currentTime + 3.8);
            } catch {
              // Ignore
            }
          }
        }, i * 320);
      });
    };

    playHarmonics();
    this.ambientInterval = window.setInterval(playHarmonics, 6000);
  }

  public stopAmbientChimes() {
    if (this.ambientInterval) {
      clearInterval(this.ambientInterval);
      this.ambientInterval = null;
    }
  }
}

export const soundManager = new SoundManager();
