export class AmbientSoundscape {
  constructor() {
    this.ctx = null;
    this.nodes = [];
    this.started = false;
    this.lastStep = 0;
    this.footstepGain = null;
    this.stepTimer = null;
  }

  resume() {
    if (!window.AudioContext) return;
    if (!this.ctx) {
      this.ctx = new AudioContext();
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
    if (!this.started) {
      this.started = true;
      this._initAmbience();
    }
  }

  _initAmbience() {
    const ctx = this.ctx;
    const master = ctx.createGain();
    master.gain.value = 0.18;
    master.connect(ctx.destination);

    const pad = ctx.createOscillator();
    pad.type = "sine";
    pad.frequency.value = 42;
    const padGain = ctx.createGain();
    padGain.gain.value = 0.4;
    pad.connect(padGain).connect(master);
    pad.start();
    this.nodes.push(pad, padGain);

    const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 4, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 3);
    }
    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = "lowpass";
    noiseFilter.frequency.value = 800;
    const noiseGain = ctx.createGain();
    noiseGain.gain.value = 0.25;
    noise.connect(noiseFilter).connect(noiseGain).connect(master);
    noise.start();
    this.nodes.push(noise, noiseFilter, noiseGain);

    this.footstepGain = ctx.createGain();
    this.footstepGain.gain.value = 0;
    this.footstepGain.connect(master);
    this.nodes.push(this.footstepGain);

    this._createFootstep(0.4);
    this._createFootstep(0.82);

    if (!this.stepTimer) {
      this.stepTimer = setInterval(() => {
        this._createFootstep(0.2 + Math.random() * 0.4);
      }, 2600);
    }
  }

  _createFootstep(offset) {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const osc = ctx.createOscillator();
    osc.type = "triangle";
    osc.frequency.value = 180;
    const gain = ctx.createGain();
    gain.gain.value = 0;
    osc.connect(gain).connect(this.footstepGain);
    const now = ctx.currentTime + offset;
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.8, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);
    osc.start(now);
    osc.stop(now + 0.3);
  }
}
