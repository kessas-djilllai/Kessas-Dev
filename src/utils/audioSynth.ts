import * as THREE from 'three';

class SpaceAmbientSynth {
  private ctx: AudioContext | null = null;
  private primaryGain: GainNode | null = null;
  private delayNode1: DelayNode | null = null;
  private delayNode2: DelayNode | null = null;
  private delayGain1: GainNode | null = null;
  private delayGain2: GainNode | null = null;
  public isRunning: boolean = false;
  private intervalId: any = null;
  private arpIntervalId: any = null;
  private oscGroup: any[] = [];
  
  constructor() {
    // Lazy loaded on play
  }

  init() {
    if (this.ctx) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioContextClass();
      
      // Primary gain node
      this.primaryGain = this.ctx.createGain();
      this.primaryGain.gain.setValueAtTime(0.0001, this.ctx.currentTime);
      this.primaryGain.connect(this.ctx.destination);
      
      // Feed-forward multi-tap spatial delays: Pristine spacial depth with zero feedback calculation penalty!
      this.delayNode1 = this.ctx.createDelay(2.0);
      this.delayNode1.delayTime.setValueAtTime(0.6, this.ctx.currentTime); // Tap 1 (600ms)
      
      this.delayNode2 = this.ctx.createDelay(3.0);
      this.delayNode2.delayTime.setValueAtTime(1.2, this.ctx.currentTime); // Tap 2 (1200ms)

      this.delayGain1 = this.ctx.createGain();
      this.delayGain1.gain.setValueAtTime(0.3, this.ctx.currentTime); // 30% intensity

      this.delayGain2 = this.ctx.createGain();
      this.delayGain2.gain.setValueAtTime(0.18, this.ctx.currentTime); // 18% intensity
      
      // Connect first tap to primary
      this.delayNode1.connect(this.delayGain1);
      this.delayGain1.connect(this.primaryGain);

      // Connect second tap in series to primary
      this.delayNode1.connect(this.delayNode2);
      this.delayNode2.connect(this.delayGain2);
      this.delayGain2.connect(this.primaryGain);
      
    } catch (e) {
      console.warn("Web Audio API not supported on this platform: ", e);
    }
  }

  private playPadNote(freq: number, duration: number, attack = 2.0, release = 3.0) {
    if (!this.ctx || !this.primaryGain) return;
    const t = this.ctx.currentTime;
    
    let osc: OscillatorNode | null = null;
    let gain: GainNode | null = null;
    let filter: BiquadFilterNode | null = null;

    try {
      osc = this.ctx.createOscillator();
      gain = this.ctx.createGain();
      filter = this.ctx.createBiquadFilter();

      // Soft triangle wave for soothing pads
      osc.type = Math.random() > 0.55 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, t);

      // Lowpass filter to sweep harmonics away (warm celestial atmosphere)
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(220, t);
      filter.frequency.exponentialRampToValueAtTime(700, t + attack);
      filter.frequency.exponentialRampToValueAtTime(120, t + duration);

      // Smooth envelope controls
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.035, t + attack);
      gain.gain.setValueAtTime(0.035, t + duration - release);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);

      osc.connect(filter);
      filter.connect(gain);
      
      // Connect to master volume and ambient spatial delay line
      gain.connect(this.primaryGain);
      if (this.delayNode1) gain.connect(this.delayNode1);

      osc.start(t);
      osc.stop(t + duration);

      // Robust memory leak prevention: explicit disconnection when note plays out!
      const currentOsc = osc;
      const currentFilter = filter;
      const currentGain = gain;
      osc.onended = () => {
        try {
          currentOsc.disconnect();
          currentFilter.disconnect();
          currentGain.disconnect();
        } catch (e) {}
      };
    } catch (err) {
      // Clean up in case of setup failure
      try {
        if (osc) osc.disconnect();
        if (filter) filter.disconnect();
        if (gain) gain.disconnect();
      } catch (e) {}
    }
  }

  private playStarTwinkle(freq: number) {
    if (!this.ctx || !this.primaryGain) return;
    const t = this.ctx.currentTime;

    let osc: OscillatorNode | null = null;
    let gain: GainNode | null = null;
    let filter: BiquadFilterNode | null = null;

    try {
      osc = this.ctx.createOscillator();
      gain = this.ctx.createGain();
      filter = this.ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, t);

      gain.gain.setValueAtTime(0, t);
      // Fast cybernetic attack
      gain.gain.linearRampToValueAtTime(0.012, t + 0.08);
      // Soft long space decay ring
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 1.2);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.primaryGain);
      if (this.delayNode1) gain.connect(this.delayNode1);

      osc.start(t);
      osc.stop(t + 1.3);

      // Robust memory leak prevention: explicit disconnection when note plays out!
      const currentOsc = osc;
      const currentFilter = filter;
      const currentGain = gain;
      osc.onended = () => {
        try {
          currentOsc.disconnect();
          currentFilter.disconnect();
          currentGain.disconnect();
        } catch (e) {}
      };
    } catch (e) {
      try {
        if (osc) osc.disconnect();
        if (filter) filter.disconnect();
        if (gain) gain.disconnect();
      } catch (err) {}
    }
  }

  start() {
    this.init();
    if (this.isRunning) return;
    
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    
    this.isRunning = true;
    
    // Cinematic cosmic progressions (D Minor 9, Bb Major 9, C Dom 9, A Minor 9)
    const chordSeries = [
      [146.83, 220.00, 261.63, 329.63, 349.23], // Dm9
      [116.54, 174.61, 220.00, 261.63, 293.66], // Bbmaj9
      [130.81, 196.00, 233.08, 293.66, 329.63], // C9
      [110.00, 164.81, 196.00, 246.94, 261.63], // Am9
    ];

    let progressionIndex = 0;
    
    const triggerNextBar = () => {
      if (!this.isRunning) return;
      const notes = chordSeries[progressionIndex];
      // Play chord with slightly staggered lush start times
      notes.forEach((freq, idx) => {
        setTimeout(() => {
          if (this.isRunning) {
            this.playPadNote(freq, 8.5, 2.5, 3.5);
          }
        }, idx * 120);
      });
      progressionIndex = (progressionIndex + 1) % chordSeries.length;
    };

    // Trigger instantly
    triggerNextBar();
    this.intervalId = setInterval(triggerNextBar, 8000);

    // Cosmic Plucks (Twinkling star harmonics)
    const pluckFrequencies = [
      587.33, 659.25, 783.99, 880.00, 987.77, 1046.50, 1174.66
    ];

    this.arpIntervalId = setInterval(() => {
      if (!this.isRunning) return;
      if (Math.random() > 0.45) {
        const selectedFreq = pluckFrequencies[Math.floor(Math.random() * pluckFrequencies.length)];
        this.playStarTwinkle(selectedFreq);
      }
    }, 1600);

    // Fade master gain up for luxury entry transition
    if (this.primaryGain && this.ctx) {
      const t = this.ctx.currentTime;
      this.primaryGain.gain.exponentialRampToValueAtTime(1.0, t + 4.0);
    }
  }

  stop() {
    if (!this.isRunning) return;
    this.isRunning = false;
    
    if (this.intervalId) clearInterval(this.intervalId);
    if (this.arpIntervalId) clearInterval(this.arpIntervalId);

    // Smoothly fade out ambient engine volume
    if (this.primaryGain && this.ctx) {
      try {
        const t = this.ctx.currentTime;
        this.primaryGain.gain.linearRampToValueAtTime(0.0001, t + 1.2);
        
        setTimeout(() => {
          if (!this.isRunning && this.ctx && this.ctx.state === 'running') {
            this.ctx.suspend();
          }
        }, 1300);
      } catch (e) {}
    }
  }

  setVolume(vol: number) {
    this.init();
    if (this.primaryGain && this.ctx) {
      try {
        const t = this.ctx.currentTime;
        this.primaryGain.gain.linearRampToValueAtTime(vol, t + 0.5);
      } catch (err) {}
    }
  }
}

export const ambientSynth = new SpaceAmbientSynth();
