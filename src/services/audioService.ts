/**
 * 低频着陆音频引擎 (Low Frequency Grounding Audio Engine)
 * 使用 Web Audio API 纯代码合成，无需外部音频文件
 */

class AudioGroundingEngine {
  private audioContext: AudioContext | null = null
  private masterGain: GainNode | null = null
  private heartbeatGain: GainNode | null = null
  private noiseGain: GainNode | null = null
  private oscillator: OscillatorNode | null = null
  private noiseSource: AudioBufferSourceNode | null = null
  private lowpassFilter: BiquadFilterNode | null = null

  private isPlaying = false
  private isMuted = false // 默认不静音，组件挂载时由 UI 开关控制
  private currentTempo = 60 // BPM
  private heartbeatInterval: number | null = null
  private fadeTime = 3 // seconds

  private baseFrequency = 150 // Hz (可听范围)
  private comfortVolume = 0.7

  /**
   * 初始化音频上下文
   */
  private initAudioContext(): AudioContext {
    // 如果已存在但已关闭，需要重新创建
    if (this.audioContext && this.audioContext.state === 'closed') {
      console.log('[AudioGrounding] Previous context was closed, creating new one')
      this.audioContext = null
    }

    if (!this.audioContext) {
      this.audioContext = new AudioContext()
      console.log('[AudioGrounding] Created new AudioContext')
    }
    return this.audioContext
  }

  /**
   * 创建棕色噪声 (Brown Noise)
   * 棕色噪声比白色噪声更低沉，比粉色噪声更厚重
   */
  private createBrownNoise(context: AudioContext): AudioBuffer {
    const sampleRate = context.sampleRate
    const bufferSize = sampleRate * 2 // 2 seconds buffer
    const buffer = context.createBuffer(1, bufferSize, sampleRate)
    const data = buffer.getChannelData(0)

    let lastOut = 0.0
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1
      data[i] = (lastOut + 0.02 * white) / 1.02
      lastOut = data[i]
      data[i] *= 3.5 // 增益补偿
    }
    return buffer
  }

  /**
   * 创建心跳脉冲
   * 使用指数衰减实现自然的渐入渐出
   */
  private createHeartbeatPulse(): void {
    if (!this.heartbeatGain || !this.audioContext) return

    const now = this.audioContext.currentTime
    const beatDuration = 0.15 // 单次心跳持续时间
    const peakGain = 0.6

    // 平滑的指数衰减包络
    this.heartbeatGain.gain.cancelScheduledValues(now)
    this.heartbeatGain.gain.setValueAtTime(this.heartbeatGain.gain.value, now)
    this.heartbeatGain.gain.linearRampToValueAtTime(peakGain, now + 0.08)
    this.heartbeatGain.gain.exponentialRampToValueAtTime(0.001, now + beatDuration)
  }

  /**
   * 启动心跳节奏循环
   */
  private startHeartbeatLoop(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval)
    }

    const intervalMs = (60 / this.currentTempo) * 1000

    this.createHeartbeatPulse()
    this.heartbeatInterval = window.setInterval(() => {
      this.createHeartbeatPulse()
    }, intervalMs)
  }

  /**
   * 停止心跳节奏循环
   */
  private stopHeartbeatLoop(): void {
    if (this.heartbeatInterval !== null) {
      clearInterval(this.heartbeatInterval)
      this.heartbeatInterval = null
    }
  }

  /**
   * 平滑开启声音
   * 音量在 3 秒内从 0 升至舒适阈值
   */
  async startGrounding(): Promise<void> {
    if (this.isPlaying) {
      console.log('[AudioGrounding] Already playing, skip')
      return
    }

    console.log('[AudioGrounding] startGrounding called, isMuted:', this.isMuted)

    const context = this.initAudioContext()

    // 确保音频上下文在运行（iOS 需要用户交互）
    if (context.state === 'suspended') {
      console.log('[AudioGrounding] Context suspended, resuming...')
      try {
        await context.resume()
        console.log('[AudioGrounding] Context resumed successfully, state:', context.state)
      } catch (e) {
        console.error('[AudioGrounding] Failed to resume context:', e)
        return
      }
    }

    // 如果音频上下文仍未运行，尝试创建一个新的
    if (context.state !== 'running') {
      console.warn('[AudioGrounding] Context not running after resume, state:', context.state)
    }

    // 创建主增益节点
    this.masterGain = context.createGain()
    // 组件触发时默认允许播放，静音状态由 masterGain 控制
    this.masterGain.gain.setValueAtTime(0, context.currentTime)
    this.masterGain.gain.linearRampToValueAtTime(this.comfortVolume, context.currentTime + this.fadeTime)
    this.masterGain.connect(context.destination)

    // 创建心跳增益节点（叠加在主增益上）
    this.heartbeatGain = context.createGain()
    this.heartbeatGain.gain.setValueAtTime(0.001, context.currentTime)
    this.heartbeatGain.connect(this.masterGain)

    // 创建低频正弦波振荡器
    this.oscillator = context.createOscillator()
    this.oscillator.type = 'sine'
    this.oscillator.frequency.setValueAtTime(this.baseFrequency, context.currentTime)

    // 正弦波增益
    const oscGain = context.createGain()
    oscGain.gain.setValueAtTime(0.5, context.currentTime)
    this.oscillator.connect(oscGain)
    oscGain.connect(this.heartbeatGain)

    // 创建低通滤波器
    this.lowpassFilter = context.createBiquadFilter()
    this.lowpassFilter.type = 'lowpass'
    this.lowpassFilter.frequency.setValueAtTime(200, context.currentTime)
    this.lowpassFilter.Q.setValueAtTime(1, context.currentTime)

    // 创建棕色噪声
    const brownNoiseBuffer = this.createBrownNoise(context)
    this.noiseSource = context.createBufferSource()
    this.noiseSource.buffer = brownNoiseBuffer
    this.noiseSource.loop = true

    // 噪声增益
    this.noiseGain = context.createGain()
    this.noiseGain.gain.setValueAtTime(0.3, context.currentTime)
    this.noiseSource.connect(this.noiseGain)
    this.noiseGain.connect(this.lowpassFilter)
    this.lowpassFilter.connect(this.heartbeatGain)

    // 启动所有节点
    try {
      this.oscillator.start()
      this.noiseSource.start()
      console.log('[AudioGrounding] Audio nodes started')
    } catch (e) {
      console.error('[AudioGrounding] Error starting audio nodes:', e)
      return
    }

    // 启动心跳节奏
    this.startHeartbeatLoop()

    this.isPlaying = true
    console.log('[AudioGrounding] Started grounding audio')
  }

  /**
   * 平滑关闭声音
   * 音量在 3 秒内降至 0
   */
  async stopGrounding(): Promise<void> {
    if (!this.isPlaying || !this.audioContext || !this.masterGain) return

    const context = this.audioContext
    const now = context.currentTime

    // 停止心跳节奏
    this.stopHeartbeatLoop()

    // 音量渐出：3秒内降至 0
    this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now)
    this.masterGain.gain.linearRampToValueAtTime(0, now + this.fadeTime)

    // 等待渐出完成后关闭所有节点
    setTimeout(() => {
      this.oscillator?.stop()
      this.noiseSource?.stop()
      this.oscillator?.disconnect()
      this.noiseSource?.disconnect()
      this.lowpassFilter?.disconnect()
      this.heartbeatGain?.disconnect()
      this.masterGain?.disconnect()

      this.oscillator = null
      this.noiseSource = null
      this.lowpassFilter = null
      this.heartbeatGain = null
      this.masterGain = null

      this.isPlaying = false
      console.log('[AudioGrounding] Stopped grounding audio')
    }, this.fadeTime * 1000 + 100)
  }

  /**
   * 动态调整心跳节奏快慢
   * @param bpm - 每分钟心跳数 (40-120 范围内)
   */
  setTempo(bpm: number): void {
    // 限制 BPM 范围
    this.currentTempo = Math.max(40, Math.min(120, bpm))

    // 如果正在播放，更新心跳节奏
    if (this.isPlaying) {
      this.startHeartbeatLoop()
    }

    console.log(`[AudioGrounding] Tempo set to ${this.currentTempo} BPM`)
  }

  /**
   * 设置基础频率
   * @param freq - 频率 (60-90Hz)
   */
  setFrequency(freq: number): void {
    this.baseFrequency = Math.max(60, Math.min(90, freq))
    if (this.oscillator && this.audioContext) {
      this.oscillator.frequency.setValueAtTime(
        this.baseFrequency,
        this.audioContext.currentTime
      )
    }
  }

  /**
   * 设置舒适音量
   * @param volume - 音量 (0-1)
   */
  setVolume(volume: number): void {
    this.comfortVolume = Math.max(0, Math.min(1, volume))
    if (this.isPlaying && this.masterGain && this.audioContext) {
      this.masterGain.gain.setValueAtTime(
        this.masterGain.gain.value,
        this.audioContext.currentTime
      )
      this.masterGain.gain.linearRampToValueAtTime(
        this.comfortVolume,
        this.audioContext.currentTime + 0.5
      )
    }
  }

  /**
   * 获取当前播放状态
   */
  getIsPlaying(): boolean {
    return this.isPlaying
  }

  /**
   * 获取当前 BPM
   */
  getTempo(): number {
    return this.currentTempo
  }

  /**
   * 获取静音状态
   */
  getIsMuted(): boolean {
    return this.isMuted
  }

  /**
   * 切换静音状态
   * @param muted - true 则立即静音，false 则恢复播放
   */
  setMuted(muted: boolean): void {
    if (this.isMuted === muted) {
      console.log('[AudioGrounding] setMuted called but already', muted)
      return
    }

    this.isMuted = muted
    console.log('[AudioGrounding] setMuted:', muted, 'isPlaying:', this.isPlaying)

    if (!this.isPlaying || !this.masterGain || !this.audioContext) {
      console.log('[AudioGrounding] setMuted: no audio playing, just stored state')
      return
    }

    const context = this.audioContext
    const now = context.currentTime

    if (muted) {
      // 立即静音：音量降至 0，但不停止音频节点
      this.masterGain.gain.cancelScheduledValues(now)
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now)
      this.masterGain.gain.linearRampToValueAtTime(0, now + 0.3)
      console.log('[AudioGrounding] Muted: true (audio silenced)')
    } else {
      // 取消静音：音量渐入恢复
      this.masterGain.gain.cancelScheduledValues(now)
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now)
      this.masterGain.gain.linearRampToValueAtTime(this.comfortVolume, now + 0.3)
      console.log('[AudioGrounding] Unmuted: audio restored')
    }
  }
}

// 导出单例
export const audioGroundingEngine = new AudioGroundingEngine()
