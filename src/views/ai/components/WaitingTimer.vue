<template>
  <div class="waiting-timer">
    <!-- 主容器 - 低饱和材质感 -->
    <div class="timer-card">
      <!-- 圆形倒计时 -->
      <div class="relative flex items-center justify-center mb-10">
        <!-- 外圈 SVG -->
        <svg class="w-48 h-48 -rotate-90 md:w-56 md:h-56">
          <!-- 背景圈 - 极淡 -->
          <circle
            cx="96"
            cy="96"
            r="85"
            stroke="rgba(0,0,0,0.04)"
            stroke-width="4"
            fill="none"
          />
          <!-- 进度圈 -->
          <circle
            cx="96"
            cy="96"
            r="85"
            :stroke="progressColor"
            stroke-width="4"
            fill="none"
            stroke-linecap="round"
            :stroke-dasharray="circumference"
            :stroke-dashoffset="strokeOffset"
            class="transition-all duration-2000 ease-linear"
          />
        </svg>

        <!-- 中心内容 -->
        <div class="absolute inset-0 flex flex-col items-center justify-center">
          <!-- 时间显示 - 电影字幕风格 -->
          <div class="text-2xl md:text-4xl font-light tracking-widest mb-2 opacity-80" :style="{ color: textColor }">
            {{ formattedTime }}
          </div>

          <!-- 状态文字 -->
          <div class="text-xs uppercase tracking-widest opacity-30" :style="{ color: textColor }">
            {{ isRunning ? '进行中' : '已暂停' }}
          </div>

          <!-- 呼吸指示器 - 极缓慢 -->
          <div v-if="isRunning" class="mt-6">
            <div
              class="breathing-dot"
              :class="{ 'breathing-in': isBreathingIn, 'breathing-out': !isBreathingIn }"
            />
          </div>
        </div>
      </div>

      <!-- 提示语 - 电影字幕排版 -->
      <p class="text-center text-sm font-light leading-loose px-8 mb-10 opacity-60" :style="{ color: textColor }">
        这段时间，你的焦虑在照顾你<br/>
        但也请你照顾一下它
      </p>

      <!-- 控制按钮 -->
      <div class="flex justify-center gap-6">
        <button
          v-if="!isRunning"
          @click="startTimer"
          class="min-h-[44px] px-8 py-2.5 text-xs tracking-widest font-light transition-all duration-700 opacity-70 hover:opacity-100 active:scale-95 active:opacity-100"
          :style="{ backgroundColor: primaryColor, color: '#5A5A52' }"
        >
          开始
        </button>

        <button
          v-else
          @click="pauseTimer"
          class="min-h-[44px] px-8 py-2.5 text-xs tracking-widest font-light transition-all duration-700 opacity-70 hover:opacity-100 active:scale-95 active:opacity-100"
          :style="{ backgroundColor: secondaryColor, color: '#5A5A52' }"
        >
          暂停
        </button>

        <button
          v-if="hasStarted"
          @click="resetTimer"
          class="min-h-[44px] px-6 py-2.5 text-xs tracking-widest font-light border-b opacity-40 hover:opacity-80 transition-all duration-700 active:scale-95 active:opacity-100"
          :style="{ borderColor: 'rgba(0,0,0,0.15)', color: textColor }"
        >
          重置
        </button>
      </div>

      <!-- 完成提示 - 缓慢显影 -->
      <transition name="photo-dev">
        <div v-if="isCompleted" class="mt-10 text-center">
          <p class="text-lg opacity-30 mb-2">✿</p>
          <p class="text-sm font-light opacity-60" :style="{ color: textColor }">
            你成功等待了 20 分钟
          </p>
          <p class="text-xs font-light mt-1 opacity-30 tracking-wider" :style="{ color: textColor }">
            你比自己想象的更有耐心
          </p>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'
import { audioGroundingEngine } from '@/services/audioService'

const emit = defineEmits<{
  complete: [{ completed: boolean }]
}>()

/**
 * WaitingTimer - 等待倒计时器
 * 以"关切与注视"为基调：去除阴影装饰，改用低饱和纯色
 * 极缓慢的呼吸动画（8秒循环）
 */

// 常量
const TOTAL_SECONDS = 20 * 60 // 20 分钟
const RADIUS = 85
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

// State
const remainingSeconds = ref(TOTAL_SECONDS)
const isRunning = ref(false)
const hasStarted = ref(false)
const isCompleted = ref(false)
const isBreathingIn = ref(true)

// 定时器引用
let timerInterval: ReturnType<typeof setInterval> | null = null
let breathingInterval: ReturnType<typeof setInterval> | null = null

// Computed
const progress = computed(() => remainingSeconds.value / TOTAL_SECONDS)

const circumference = computed(() => CIRCUMFERENCE)

const strokeOffset = computed(() => {
  return CIRCUMFERENCE * (1 - progress.value)
})

const formattedTime = computed(() => {
  const minutes = Math.floor(remainingSeconds.value / 60)
  const seconds = remainingSeconds.value % 60
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
})

// 莫兰迪色系 - 低饱和
const primaryColor = '#D0D4CC' // 灰绿 - 主色
const secondaryColor = '#DCD8D0' // 暖米色
const borderColor = '#CECAC0' // 暖灰

const progressColor = computed(() => {
  if (isCompleted.value) return '#A8D8A8' // 淡绿色完成
  if (isRunning.value) return '#B0B8B0' // 灰绿
  return 'rgba(0,0,0,0.08)' // 极淡灰
})

const textColor = computed(() => {
  return '#5A5A52' // 深灰文字
})

// Methods
const startTimer = () => {
  if (isCompleted.value) return

  isRunning.value = true
  hasStarted.value = true

  // 启动倒计时 - 慢速动画在CSS中
  timerInterval = setInterval(() => {
    if (remainingSeconds.value > 0) {
      remainingSeconds.value--
    } else {
      completeTimer()
    }
  }, 1000)

  // 启动呼吸指示器 - 8秒一循环（更缓慢）
  breathingInterval = setInterval(() => {
    isBreathingIn.value = !isBreathingIn.value
  }, 8000)

  // 开启低频着陆音频 - 比心跳略慢的 50 BPM，通过听觉引导降低生理唤醒
  console.log('[WaitingTimer] Starting audio...')
  audioGroundingEngine.setTempo(50)
  audioGroundingEngine.startGrounding()
}

const pauseTimer = () => {
  isRunning.value = false

  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }

  if (breathingInterval) {
    clearInterval(breathingInterval)
    breathingInterval = null
  }

  // 暂停时降低音频音量但不关闭
  audioGroundingEngine.stopGrounding()
}

const resetTimer = () => {
  pauseTimer()
  remainingSeconds.value = TOTAL_SECONDS
  hasStarted.value = false
  isCompleted.value = false
  isBreathingIn.value = true
}

const completeTimer = () => {
  pauseTimer()
  isCompleted.value = true
  // 完成时平滑关闭音频
  audioGroundingEngine.stopGrounding()
  // 通知父组件练习完成
  emit('complete', { completed: true })
}

// 组件卸载时清理
onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval)
  if (breathingInterval) clearInterval(breathingInterval)
  audioGroundingEngine.stopGrounding()
})
</script>

<style scoped>
.waiting-timer {
  @apply relative flex items-center justify-center min-h-96;
}

/* 卡片样式 - 低饱和材质感 */
.timer-card {
  @apply relative z-10 p-6 md:p-10;
  background: rgba(0, 0, 0, 0.015);
  border: 1px solid rgba(0, 0, 0, 0.04);
}

/* 呼吸点 - 极缓慢动画 */
.breathing-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #B0B8B0;
}

.breathing-in {
  animation: breathe-in 8s ease-in-out infinite;
}

.breathing-out {
  animation: breathe-out 8s ease-in-out infinite;
}

@keyframes breathe-in {
  0%, 100% {
    transform: scale(0.7);
    opacity: 0.2;
  }
  50% {
    transform: scale(1.3);
    opacity: 0.6;
  }
}

@keyframes breathe-out {
  0%, 100% {
    transform: scale(0.7);
    opacity: 0.2;
  }
  50% {
    transform: scale(1.3);
    opacity: 0.6;
  }
}

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 800ms ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 文字行距 */
p, div, span {
  line-height: 1.9 !important;
}
</style>
