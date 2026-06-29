<template>
  <div class="affirmation-practice">
    <!-- Header -->
    <div class="practice-header">
      <p class="practice-icon">🌱</p>
      <h2 class="practice-title">三十天自我重塑</h2>
      <p class="practice-guidance">
        写下一句你在慢慢相信的、关于你自己的正面肯定。<br/>
        让它成为今天生长的养分。
      </p>
    </div>

    <!-- Progress Indicator -->
    <div class="progress-section">
      <div class="progress-track">
        <div
          class="progress-fill"
          :style="{ width: progressPercent + '%' }"
        />
      </div>
      <p class="progress-label">
        <span class="progress-current">{{ currentDay }}</span>
        <span class="progress-sep">/</span>
        <span class="progress-total">30</span>
        <span class="progress-unit">天</span>
      </p>
    </div>

    <!-- Input Area -->
    <div class="input-section">
      <textarea
        v-model="inputText"
        ref="inputRef"
        :placeholder="placeholderText"
        class="affirmation-input"
        rows="2"
        @keydown.enter.exact.prevent="handleSubmit"
      />
      <button
        @click="handleSubmit"
        class="submit-btn"
        :class="{ active: inputText.trim().length > 0 }"
        :disabled="isSubmitting || inputText.trim().length === 0"
      >
        <span v-if="isSubmitting">种下中...</span>
        <span v-else>种下这颗种子</span>
      </button>
    </div>

    <!-- Achievement Banner (when 30 days reached) -->
    <transition name="bloom">
      <div v-if="showAchievement" class="achievement-banner">
        <div class="achievement-icon">🍃</div>
        <p class="achievement-text">你用三十句话，为自己重新浇灌出了一片绿洲。</p>
      </div>
    </transition>

    <!-- History List -->
    <div class="history-section">
      <p class="history-label" v-if="affirmations.length > 0">已种下的种子</p>
      <div class="history-list">
        <transition-group name="fade-rise" tag="div" class="history-items">
          <div
            v-for="item in displayedAffirmations"
            :key="item.id"
            class="history-item"
          >
            <p class="history-content">{{ item.content }}</p>
            <p class="history-date">{{ formatDate(item.timestamp) }}</p>
          </div>
        </transition-group>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useUserMemoryStore } from '@/stores/userMemory'

const emit = defineEmits<{
  complete: [{ completed: boolean }]
}>()

const userMemoryStore = useUserMemoryStore()

const inputText = ref('')
const isSubmitting = ref(false)
const inputRef = ref<HTMLTextAreaElement | null>(null)
const showAchievement = ref(false)

// Load affirmations from store
const affirmations = computed(() => userMemoryStore.affirmations)
const currentDay = computed(() => Math.min(affirmations.value.length + 1, 30))
const progressPercent = computed(() => (affirmations.value.length / 30) * 100)

const displayedAffirmations = computed(() => {
  return [...affirmations.value].sort((a, b) => b.timestamp - a.timestamp)
})

const placeholderText = computed(() => {
  const day = currentDay.value
  const examples: Record<number, string> = {
    1: '例如：我值得被好好对待',
    5: '例如：我正在学会相信自己',
    10: '例如：我值得等待那个对的人',
    15: '例如：我可以照顾好自己的情绪',
    20: '例如：我已经足够好了',
    25: '例如：我值得被爱',
    30: '例如：我就是我，我已经很好',
  }
  return examples[day] || '写下今天你想对自己说的话...'
})

const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp)
  const now = new Date()
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
  if (diffDays === 0) return '今天'
  if (diffDays === 1) return '昨天'
  if (diffDays < 7) return `${diffDays}天前`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}周前`
  return `${Math.floor(diffDays / 30)}个月前`
}

const handleSubmit = async () => {
  const text = inputText.value.trim()
  if (!text || isSubmitting.value) return

  isSubmitting.value = true

  const previousCount = affirmations.value.length
  await userMemoryStore.addAffirmation(text)

  inputText.value = ''

  // Check if just reached 30 days
  if (previousCount === 29 && affirmations.value.length === 30) {
    showAchievement.value = true
    setTimeout(() => {
      showAchievement.value = false
    }, 5000)
  }

  setTimeout(() => {
    isSubmitting.value = false
  }, 800)
}

onMounted(() => {
  if (inputRef.value) {
    inputRef.value.focus()
  }
})
</script>

<style scoped>
.affirmation-practice {
  padding: 32px 28px 40px;
  background: rgba(250, 248, 245, 0.98);
  border-radius: 20px;
  max-width: 560px;
  margin: 0 auto;
}

/* Header */
.practice-header {
  text-align: center;
  margin-bottom: 32px;
}

.practice-icon {
  font-size: 32px;
  margin-bottom: 12px;
  opacity: 0.8;
}

.practice-title {
  font-size: 18px;
  font-weight: 300;
  letter-spacing: 0.15em;
  color: #5A5A52;
  margin-bottom: 12px;
}

.practice-guidance {
  font-size: 13px;
  font-weight: 300;
  line-height: 2;
  color: #8A8A7E;
  letter-spacing: 0.03em;
}

/* Progress */
.progress-section {
  margin-bottom: 28px;
}

.progress-track {
  height: 2px;
  background: rgba(143, 169, 143, 0.12);
  border-radius: 1px;
  margin-bottom: 12px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(to right, rgba(143, 169, 143, 0.4), rgba(143, 169, 143, 0.7));
  border-radius: 1px;
  transition: width 600ms cubic-bezier(0.4, 0, 0.2, 1);
}

.progress-label {
  text-align: center;
  font-size: 12px;
  font-weight: 300;
  letter-spacing: 0.1em;
  color: #8A8A7E;
}

.progress-current {
  color: #8FA98F;
  font-weight: 400;
}

.progress-sep {
  margin: 0 2px;
}

.progress-total {
  margin-right: 4px;
}

/* Input */
.input-section {
  margin-bottom: 32px;
}

.affirmation-input {
  width: 100%;
  padding: 16px 20px;
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(143, 169, 143, 0.12);
  border-radius: 12px;
  font-size: 14px;
  font-weight: 300;
  line-height: 1.8;
  color: #4A4A3E;
  letter-spacing: 0.03em;
  resize: none;
  outline: none;
  transition: border-color 400ms ease, box-shadow 400ms ease;
  box-sizing: border-box;
}

.affirmation-input::placeholder {
  color: #B0ACA4;
}

.affirmation-input:focus {
  border-color: rgba(143, 169, 143, 0.35);
  box-shadow: 0 0 0 3px rgba(143, 169, 143, 0.06);
}

.submit-btn {
  display: block;
  width: 100%;
  margin-top: 12px;
  padding: 14px 24px;
  background: rgba(143, 169, 143, 0.1);
  border: 1px solid rgba(143, 169, 143, 0.15);
  border-radius: 12px;
  font-size: 13px;
  font-weight: 300;
  letter-spacing: 0.15em;
  color: #8FA98F;
  cursor: pointer;
  transition: all 400ms ease;
}

.submit-btn.active {
  background: rgba(143, 169, 143, 0.2);
  color: #6B8B6B;
}

.submit-btn:active {
  transform: scale(0.98);
}

.submit-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* Achievement Banner */
.achievement-banner {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  background: linear-gradient(135deg, rgba(200, 185, 140, 0.12), rgba(180, 165, 120, 0.08));
  border: 1px solid rgba(180, 165, 120, 0.2);
  border-radius: 12px;
  margin-bottom: 28px;
}

.achievement-icon {
  font-size: 24px;
  flex-shrink: 0;
}

.achievement-text {
  font-size: 13px;
  font-weight: 300;
  line-height: 1.8;
  color: #8A7A5A;
  letter-spacing: 0.03em;
}

/* History */
.history-section {
  border-top: 1px solid rgba(143, 169, 143, 0.08);
  padding-top: 24px;
}

.history-label {
  font-size: 11px;
  font-weight: 300;
  letter-spacing: 0.15em;
  color: rgba(143, 169, 143, 0.4);
  margin-bottom: 16px;
  text-transform: uppercase;
}

.history-items {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.history-item {
  padding: 14px 16px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 10px;
  border: 1px solid rgba(143, 169, 143, 0.06);
}

.history-content {
  font-size: 13px;
  font-weight: 300;
  line-height: 1.8;
  color: #5A5A52;
  letter-spacing: 0.02em;
  margin-bottom: 6px;
}

.history-date {
  font-size: 11px;
  font-weight: 300;
  letter-spacing: 0.05em;
  color: rgba(143, 169, 143, 0.45);
}

/* Transitions */
.bloom-enter-active {
  transition: all 800ms cubic-bezier(0.4, 0, 0.2, 1);
}
.bloom-leave-active {
  transition: all 500ms ease;
}
.bloom-enter-from {
  opacity: 0;
  transform: translateY(-8px) scale(0.96);
}
.bloom-leave-to {
  opacity: 0;
}

.fade-rise-enter-active {
  transition: all 600ms cubic-bezier(0.4, 0, 0.2, 1);
}
.fade-rise-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
</style>