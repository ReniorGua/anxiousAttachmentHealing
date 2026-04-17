<template>
  <div class="breathing-guide p-6">
    <div class="text-center mb-6">
      <div
        class="w-32 h-32 mx-auto rounded-full flex items-center justify-center transition-all duration-2000"
        :class="breathingClass"
      >
        <span class="text-3xl opacity-50">{{ currentEmoji }}</span>
      </div>
    </div>

    <div class="text-center mb-4">
      <h3 class="text-base font-light tracking-wide mb-1 opacity-70" style="color: #5A5A52;">{{ phaseText }}</h3>
      <p class="text-xs font-light tracking-wide opacity-40" style="color: #5A5A52;">{{ instruction }}</p>
    </div>

    <div class="flex justify-center items-center gap-5 mb-5">
      <div class="text-center">
        <div class="text-2xl font-light tracking-wider opacity-60" style="color: #5A5A52;">{{ Math.ceil(remainingTime) }}</div>
        <div class="text-xs font-light tracking-widest opacity-30 mt-0.5" style="color: #5A5A52;">秒</div>
      </div>
      <div class="flex gap-1.5">
        <div
          v-for="i in 4"
          :key="i"
          class="w-1 h-1 rounded-full transition-all duration-1000"
          :class="i <= completedCycles ? 'opacity-50' : 'opacity-15'"
          :style="{ backgroundColor: i <= completedCycles ? '#9CA3AF' : '#9CA3AF' }"
        />
      </div>
    </div>

    <div class="flex justify-center gap-4">
      <button
        @click="togglePause"
        class="px-6 py-2 text-xs tracking-widest font-light rounded-none transition-all duration-700 opacity-60 hover:opacity-80"
        style="background-color: rgba(0,0,0,0.04); color: #5A5A52;"
      >
        {{ isPaused ? '继续' : '暂停' }}
      </button>
      <button
        @click="reset"
        class="px-6 py-2 text-xs tracking-widest font-light rounded-none border-b transition-all duration-700 opacity-30 hover:opacity-60"
        style="border-color: rgba(0,0,0,0.1); color: #5A5A52;"
      >
        重置
      </button>
    </div>

    <div class="mt-5 pt-4" style="border-top: 1px solid rgba(0,0,0,0.03);">
      <p class="text-xs font-light text-center opacity-25 tracking-wider" style="color: #5A5A52;">
        建议：每天练习 3-5 分钟，有助于缓解焦虑情绪
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps<{
  message?: string
}>()

type Phase = 'inhale' | 'hold' | 'exhale' | 'rest'

// 呼吸节奏 - 更缓慢
const PHASE_DURATION = {
  inhale: 6,
  hold: 6,
  exhale: 6,
  rest: 3
}

const phases: Phase[] = ['inhale', 'hold', 'exhale', 'rest']
const phaseIndex = ref(0)
const remainingTime = ref(PHASE_DURATION.inhale)
const isPaused = ref(false)
const completedCycles = ref(0)
let timerInterval: number | null = null

const currentPhase = computed(() => phases[phaseIndex.value])

const phaseText = computed(() => {
  const texts: Record<Phase, string> = {
    inhale: '吸气',
    hold: '屏住',
    exhale: '呼气',
    rest: '休息'
  }
  return texts[currentPhase.value]
})

const instruction = computed(() => {
  const instructions: Record<Phase, string> = {
    inhale: '慢慢用鼻子吸气，感受腹部膨胀',
    hold: '轻轻屏住呼吸，保持放松',
    exhale: '慢慢用嘴巴呼气，释放紧张',
    rest: '短暂休息，准备下一个循环'
  }
  return instructions[currentPhase.value]
})

const currentEmoji = computed(() => {
  const emojis: Record<Phase, string> = {
    inhale: '≈',
    hold: '•',
    exhale: '∿',
    rest: '⁕'
  }
  return emojis[currentPhase.value]
})

const breathingClass = computed(() => {
  const classes: Record<Phase, string> = {
    inhale: 'scale-100',
    hold: 'scale-110',
    exhale: 'scale-100',
    rest: 'scale-95'
  }
  return classes[currentPhase.value]
})

const tick = () => {
  if (isPaused.value) return

  if (remainingTime.value > 0) {
    remainingTime.value -= 0.1
  } else {
    // Move to next phase
    phaseIndex.value = (phaseIndex.value + 1) % phases.length

    // Count completed cycles
    if (phaseIndex.value === 0) {
      completedCycles.value++
    }

    remainingTime.value = PHASE_DURATION[phases[phaseIndex.value]]
  }
}

const togglePause = () => {
  isPaused.value = !isPaused.value
}

const reset = () => {
  phaseIndex.value = 0
  remainingTime.value = PHASE_DURATION.inhale
  completedCycles.value = 0
  isPaused.value = false
}

onMounted(() => {
  timerInterval = window.setInterval(tick, 100)
})

onUnmounted(() => {
  if (timerInterval) {
    clearInterval(timerInterval)
  }
})
</script>

<style scoped>
.breathing-guide {
  background: rgba(0, 0, 0, 0.02);
  border: 1px solid rgba(0, 0, 0, 0.04);
}

h3, p {
  line-height: 1.8 !important;
}
</style>
