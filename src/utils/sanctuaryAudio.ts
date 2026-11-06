// Web Audio API 기반 감성 추모 사운드스케이프 & 인터랙티브 효과음 엔진

class SanctuaryAudioEngine {
  private ctx: AudioContext | null = null;
  private bgmGain: GainNode | null = null;
  private isBgmPlaying: boolean = false;
  private bgmInterval: any = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // 1. 촛불 켤 때 맑고 영롱한 크리스탈 벨 사운드
  public playCandleChime() {
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now); // A5
      osc.frequency.exponentialRampToValueAtTime(1760, now + 0.15);
      osc.frequency.exponentialRampToValueAtTime(1320, now + 1.2);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.25, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 1.8);
    } catch {}
  }

  // 2. 턴테이블 LP / 음악 탭 시 감성적인 앰비언트 코드 진행 토글
  public toggleVinylBgm(onStateChange?: (isPlaying: boolean) => void): boolean {
    try {
      this.initContext();
      if (!this.ctx) return false;

      if (this.isBgmPlaying) {
        this.stopBgm();
        onStateChange?.(false);
        return false;
      } else {
        this.startGentlePad();
        onStateChange?.(true);
        return true;
      }
    } catch {
      return false;
    }
  }

  private startGentlePad() {
    if (!this.ctx) return;
    this.isBgmPlaying = true;

    // 평화로운 F 메이저 9 / C 메이저 아르페지오 음계
    const notes = [261.63, 329.63, 392.0, 523.25, 659.25, 349.23, 440.0, 587.33];
    let noteIndex = 0;

    const playAmbientNote = () => {
      if (!this.isBgmPlaying || !this.ctx) return;
      const freq = notes[noteIndex % notes.length];
      noteIndex++;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, now);
      filter.frequency.exponentialRampToValueAtTime(400, now + 3.5);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.8);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.8);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 3.8);
    };

    playAmbientNote();
    this.bgmInterval = setInterval(playAmbientNote, 2400);
  }

  public stopBgm() {
    this.isBgmPlaying = false;
    if (this.bgmInterval) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
  }

  // 3. 카드 열기 / 소품 선택 부드러운 탭 사운드
  public playSoftClick() {
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(260, now + 0.08);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.08);
    } catch {}
  }

  public isPlaying(): boolean {
    return this.isBgmPlaying;
  }
}

export const sanctuaryAudio = new SanctuaryAudioEngine();

