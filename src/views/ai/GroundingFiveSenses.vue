<template>
  <div class="grounding-container">
    <!-- 标题 -->
    <div class="text-center mb-8">
      <h2 class="text-lg font-light mb-2 tracking-wide" :style="{ color: textColor }">
        五感着陆练习
      </h2>
      <p class="text-xs font-light tracking-wider opacity-50" :style="{ color: textColor }">
        通过感官回归当下，感受此刻的安全
      </p>
    </div>

    <!-- 进度指示器 - 极简圆点 -->
    <div class="flex justify-center gap-3 mb-10">
      <div
        v-for="(step, index) in steps"
        :key="index"
        class="w-1 h-1 rounded-full transition-all duration-1000"
        :class="getStepClass(index)"
        :style="getStepStyle(index)"
      />
    </div>

    <!-- 当前步骤内容 - 缓慢显影 -->
    <transition name="photo-dev" mode="out-in">
      <div
        :key="currentStep"
        class="step-content p-6 mb-6"
        :style="{ backgroundColor: cardBgColor }"
      >
        <div class="flex items-center gap-4 mb-5">
          <span class="text-xl opacity-60">{{ currentStepData.icon }}</span>
          <div>
            <h3 class="text-sm font-light tracking-wide" :style="{ color: textColor }">
              {{ currentStepData.sensor }}
            </h3>
            <p class="text-xs font-light opacity-50 mt-0.5" :style="{ color: textColor }">
              {{ currentStepData.description }}
            </p>
          </div>
        </div>

        <!-- 输入框 -->
        <div class="space-y-2">
          <div
            v-for="(_, idx) in currentStepData.count"
            :key="idx"
            class="flex items-center gap-2"
          >
            <input
              v-model="inputs[currentStep][idx]"
              :placeholder="currentStepData.placeholder[idx]"
              class="flex-1 px-4 py-2 text-sm tracking-wide focus:outline-none rounded-none border-b"
              :style="inputStyle"
              @focus="handleFocus"
              @blur="handleBlur"
            />
            <span
              v-if="inputs[currentStep][idx]"
              class="text-xs opacity-40"
              style="color: #68D391;"
            >
              ✓
            </span>
          </div>
        </div>

        <!-- 完成状态 -->
        <div v-if="isCurrentStepComplete" class="mt-5 text-center">
          <span class="text-xs font-light tracking-wider opacity-60" :style="{ color: completedColor }">
            ✦ 太棒了，你完成了 {{ currentStepData.sensor }} 的觉察
          </span>
        </div>
      </div>
    </transition>

    <!-- 导航按钮 -->
    <div class="flex justify-center gap-6">
      <button
        v-if="currentStep > 0"
        @click="prevStep"
        class="min-h-[44px] px-6 py-2 text-xs tracking-widest font-light transition-all duration-700 opacity-60 hover:opacity-100 active:scale-95"
        :style="secondaryButtonStyle"
      >
        上一步
      </button>

      <button
        v-if="currentStep < steps.length - 1 && isCurrentStepComplete"
        @click="nextStep"
        class="min-h-[44px] px-6 py-2 text-xs tracking-widest font-light text-white transition-all duration-700 hover:opacity-80 active:scale-95 active:opacity-100"
        :style="primaryButtonStyle"
      >
        继续
      </button>

      <button
        v-if="currentStep === steps.length - 1 && isCurrentStepComplete"
        @click="handleComplete"
        class="min-h-[44px] px-8 py-2 text-xs tracking-widest font-light text-white transition-all duration-700 hover:opacity-80 active:scale-95 active:opacity-100"
        :style="primaryButtonStyle"
      >
        完成练习
      </button>
    </div>

    <!-- 完成后的鼓励 - 缓慢显影 -->
    <transition name="photo-dev">
      <div v-if="isCompleted" class="mt-10 text-center">
        <p class="text-lg opacity-50">✿</p>
        <p class="text-sm font-light mt-3 tracking-wide opacity-70" :style="{ color: textColor }">
          你已经完整地感受了此刻的世界
        </p>
        <p class="text-xs font-light mt-1 tracking-wider opacity-40" :style="{ color: textColor }">
          此刻，你安全地站在这里
        </p>
        <button
          @click="reset"
          class="mt-5 min-h-[44px] px-4 py-2 text-xs tracking-widest font-light border-b opacity-50 hover:opacity-100 transition-all duration-700"
          :style="secondaryButtonStyle"
        >
          重新开始
        </button>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

/**
 * GroundingFiveSenses - 五感着陆练习
 * 以"关切与注视"为基调：去除滑动动画，改用暗房显影般的缓慢过渡
 */

// 步骤配置 - 降低饱和度
const steps = [
  {
    sensor: '视觉',
    icon: '○',
    count: 5,
    description: '说出你看到的 5 样东西',
    placeholder: ['例如：窗外的树', '墙上的画', '桌上的杯子', '地板的颜色', '天空'],
    color: '#D0D8D4', // 极淡灰蓝
  },
  {
    sensor: '触觉',
    icon: '◌',
    count: 4,
    description: '触摸 4 样东西，感受它们的质地',
    placeholder: ['衣服的布料', '桌面', '手机', '椅子'],
    color: '#D8D4D8', // 极淡灰紫
  },
  {
    sensor: '听觉',
    icon: '●',
    count: 3,
    description: '倾听 3 种声音',
    placeholder: ['空调声', '远处的说话声', '键盘敲击声'],
    color: '#DCD4C0', // 极淡橄榄
  },
  {
    sensor: '嗅觉',
    icon: '✻',
    count: 2,
    description: '嗅闻 2 种气味',
    placeholder: ['空气的味道', '咖啡/茶香'],
    color: '#DCD8D0', // 极淡暖米
  },
  {
    sensor: '味觉',
    icon: '✼',
    count: 1,
    description: '品尝 1 样东西（也可以是水）',
    placeholder: ['水的清凉', '薄荷糖'],
    color: '#D0D4CC', // 极淡灰绿
  },
]

// State
const currentStep = ref(0)
const isCompleted = ref(false)
const isFocused = ref(false)

// 输入数据存储
const inputs = ref<string[][]>(
  steps.map(step => Array(step.count).fill(''))
)

// Computed
const currentStepData = computed(() => steps[currentStep.value])

const isCurrentStepComplete = computed(() => {
  const stepInputs = inputs.value[currentStep.value]
  return stepInputs.every(input => input.trim() !== '')
})

// 动态颜色
const cardBgColor = computed(() => currentStepData.value.color)

const textColor = computed(() => {
  return '#5A5A52' // 深灰绿文字
})

const completedColor = computed(() => {
  return '#68D391' // 淡绿色
})

const primaryButtonStyle = computed(() => ({
  backgroundColor: currentStepData.value.color,
  color: '#5A5A52',
}))

const secondaryButtonStyle = computed(() => ({
  borderColor: 'rgba(0,0,0,0.1)',
  color: textColor.value,
}))

const inputStyle = computed(() => ({
  backgroundColor: 'transparent',
  borderColor: isFocused.value ? currentStepData.value.color : 'transparent',
  color: textColor.value,
}))

// Methods
const getStepClass = (index: number) => {
  if (index < currentStep.value) return 'opacity-40'
  if (index === currentStep.value) return 'opacity-80'
  return 'opacity-20'
}

const getStepStyle = (index: number) => {
  if (index < currentStep.value) {
    return { backgroundColor: '#68D391' }
  }
  if (index === currentStep.value) {
    return { backgroundColor: steps[index].color }
  }
  return { backgroundColor: 'rgba(0,0,0,0.08)' }
}

const handleFocus = () => {
  isFocused.value = true
}

const handleBlur = () => {
  isFocused.value = false
}

const nextStep = () => {
  if (currentStep.value < steps.length - 1) {
    currentStep.value++
  }
}

const prevStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

const handleComplete = () => {
  isCompleted.value = true
}

const reset = () => {
  currentStep.value = 0
  isCompleted.value = false
  inputs.value = steps.map(step => Array(step.count).fill(''))
}
</script>

<style scoped>
/* 文字行距 */
h3, p, span, input {
  line-height: 1.8 !important;
}
</style>
