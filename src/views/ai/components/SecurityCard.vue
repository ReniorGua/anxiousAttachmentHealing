<template>
  <div class="security-card-wrapper">
    <transition name="photo-dev" mode="out-in">
      <!-- Front Side -->
      <div
        v-if="!isRevealed"
        key="front"
        class="security-card flex flex-col items-center justify-center rounded-2xl cursor-pointer transition-transform active:scale-[0.97]"
        :style="{ backgroundColor: currentColor }"
        @click="handleReveal"
      >
        <div class="text-4xl mb-5 opacity-60">{{ currentIcon }}</div>
        <h3 class="text-lg font-light text-white text-center mb-3 tracking-wide opacity-90">
          自我肯定
        </h3>
        <p class="text-xs text-white text-opacity-50 text-center tracking-wider">
          点击感受
        </p>
      </div>

      <!-- Back Side -->
      <div
        v-else
        key="back"
        class="security-card flex flex-col items-center justify-center rounded-2xl cursor-pointer transition-transform active:scale-[0.97]"
        :style="{ backgroundColor: backColor }"
        @click="handleReveal"
      >
        <div class="text-3xl mb-5 opacity-50">✦</div>
        <p class="text-base font-light text-white text-center leading-loose px-6 tracking-wide opacity-90">
          {{ currentAffirmation }}
        </p>
        <p class="text-xs text-white text-opacity-40 mt-6 tracking-widest">
          点击返回
        </p>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

/**
 * SecurityCard - 安全感卡片
 * 以"关切与注视"为基调：去除3D翻转，改用暗房显影般的淡入淡出
 */

// 莫兰迪色系 - 低饱和度
const COLORS = [
  '#C8CCC4', // 灰绿色 - 沉静
  '#D8D0C4', // 暖米色 - 温暖
  '#CEC8D4', // 灰紫色 - 柔和
  '#C4CED8', // 灰蓝色 - 宁谧
  '#D8D4C0', // 淡橄榄 - 平和
  '#D4D0C4', // 暖灰色 - 沉稳
]

// 图标列表
const ICONS = ['✿', '✦', '❀', '❃', '✼', '❣']

// 自我肯定语句库
const AFFIRMATIONS = [
  '我值得被爱，也值得拥有美好的一切',
  '此刻，我安全了',
  '我允许自己感受到平静与安宁',
  '我有能力面对生活中的一切挑战',
  '我的感受是真实的，我尊重它们',
  '我值得休息，也值得被善待',
  '我是一个足够好的人',
  '我选择原谅自己，也原谅他人',
  '我愿意给自己时间和空间去成长',
  '我值得拥有内心渴望的温暖',
  '我信任自己解决问题的能力',
  '我让自己放下不必要的担忧',
  '我值得被听见、被理解',
  '我接纳此刻的自己',
  '我给自己无条件的爱与支持',
]

// State
const isRevealed = ref(false)
const affirmationIndex = ref(Math.floor(Math.random() * AFFIRMATIONS.length))

// Computed
const currentColor = computed(() => COLORS[Math.floor(Math.random() * COLORS.length)])
const backColor = computed(() => COLORS[Math.floor(Math.random() * COLORS.length)])
const currentIcon = computed(() => ICONS[Math.floor(Math.random() * ICONS.length)])
const currentAffirmation = computed(() => AFFIRMATIONS[affirmationIndex.value])

// Methods
const handleReveal = () => {
  isRevealed.value = !isRevealed.value
  if (!isRevealed.value) {
    // 生成新的肯定语索引（避免重复）
    let newIndex = Math.floor(Math.random() * AFFIRMATIONS.length)
    while (newIndex === affirmationIndex.value && AFFIRMATIONS.length > 1) {
      newIndex = Math.floor(Math.random() * AFFIRMATIONS.length)
    }
    affirmationIndex.value = newIndex
  }
}
</script>

<style scoped>
.security-card-wrapper {
  width: 100%;
}

.security-card {
  width: 100%;
  min-height: 280px;
  padding: 40px 32px;
}
</style>
