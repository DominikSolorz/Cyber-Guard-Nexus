// Sound manager for terminal feedback and alerts
// In production, this would use actual audio files

type SoundType = 'keypress' | 'success' | 'error' | 'alert' | 'notification';

let soundEnabled = true;

class AudioManager {
  private audioContext: AudioContext | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      } catch (e) {
        console.warn('Audio context not available');
      }
    }
  }

  playBeep(frequency: number, duration: number, type: OscillatorType = 'sine') {
    if (!soundEnabled || !this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = type;

    gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  playKeypress() {
    this.playBeep(800, 0.05, 'square');
  }

  playSuccess() {
    this.playBeep(600, 0.1);
    setTimeout(() => this.playBeep(800, 0.1), 100);
  }

  playError() {
    this.playBeep(200, 0.2, 'sawtooth');
  }

  playAlert() {
    this.playBeep(1000, 0.1, 'square');
    setTimeout(() => this.playBeep(1200, 0.1, 'square'), 150);
    setTimeout(() => this.playBeep(1000, 0.1, 'square'), 300);
  }

  playNotification() {
    this.playBeep(700, 0.15);
  }
}

const audioManager = new AudioManager();

export const playSound = (soundType: SoundType) => {
  switch (soundType) {
    case 'keypress':
      audioManager.playKeypress();
      break;
    case 'success':
      audioManager.playSuccess();
      break;
    case 'error':
      audioManager.playError();
      break;
    case 'alert':
      audioManager.playAlert();
      break;
    case 'notification':
      audioManager.playNotification();
      break;
  }
};

export const enableSound = () => {
  soundEnabled = true;
};

export const disableSound = () => {
  soundEnabled = false;
};
