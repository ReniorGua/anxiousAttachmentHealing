<template>
  <div class="belief-flip">
    <!-- Transformation history list -->
    <div class="history-list" ref="historyRef">
      <div
        v-for="item in transformations"
        :key="item.id"
        class="history-item"
      >
        <p class="history-negative">{{ item.negative }}</p>
        <div class="history-divider">
          <span class="divider-line"></span>
          <span class="divider-arrow">↑</span>
        </div>
        <p class="history-positive">{{ item.positive }}</p>
      </div>
    </div>

    <!-- Active working area -->
    <div class="active-area">

      <!-- Phase A: Input negative belief -->
      <transition name="cinematic-fade" mode="out-in">
        <div v-if="phase === 'negative'" key="phase-negative" class="phase phase-negative">
          <p class="guidance-text">
            写下此时困住你的一条"个人律法"。
          </p>
          <p class="guidance-hint">
            例如：我很笨、我不配得到爱
          </p>
          <div class="input-wrapper">
            <textarea
              v-model="currentNegative"
              ref="negativeInputRef"
              class="belief-input negative-input"
              placeholder="把它写下来..."
              rows="2"
              @keydown.enter.exact.prevent="submitNegative"
            />
            <button
              class="submit-btn"
              :disabled="!currentNegative.trim()"
              @click="submitNegative"
            >
              继续
            </button>
          </div>
        </div>
      </transition>

      <!-- Phase B: Input positive affirmation -->
      <transition name="cinematic-fade" mode="out-in">
        <div v-if="phase === 'positive'" key="phase-positive" class="phase phase-positive">
          <div class="negative-display">
            <p class="negative-text">{{ currentNegative }}</p>
          </div>
          <p class="guidance-text guidance-flip">
            现在，试着用一句充满力量的<br/>
            "自我肯定"来反驳它。
          </p>
          <p class="guidance-hint">
            例如：我足够聪明，知道自己有多优秀
          </p>
          <div class="input-wrapper">
            <textarea
              v-model="currentPositive"
              ref="positiveInputRef"
              class="belief-input positive-input"
              placeholder="写下一句反驳..."
              rows="2"
              @keydown.enter.exact.prevent="submitPositive"
            />
            <button
              class="submit-btn"
              :disabled="!currentPositive.trim()"
              @click="submitPositive"
            >
              完成翻转
            </button>
          </div>
        </div>
      </transition>

      <!-- Phase C: Flip animation -->
      <transition name="cinematic-fade" mode="out-in">
        <div v-if="phase === 'flip'" key="phase-flip" class="phase phase-flip">
          <div class="flip-stage">
            <!-- Negative — struck through -->
            <p class="flip-negative" :class="{ 'is-struck': flipDone }">{{ currentNegative }}</p>
            <!-- Positive — spotlight -->
            <p class="flip-positive" :class="{ 'is-lit': flipDone }">{{ currentPositive }}</p>
          </div>
          <p class="flip-hint">这就是你的新回应方式。</p>
          <button class="next-btn" @click="startNextRound">
            继续翻转下一条
          </button>
        </div>
      </transition>

    </div>

    <!-- Exit -->
    <div class="exit-area">
      <button
        v-if="transformations.length > 0"
        class="seal-btn"
        @click="handleComplete"
      >
        封存我的力量
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted } from 'vue'

const emit = defineEmits<{
  complete: [{ completed: boolean }]
}>()

interface Transformation {
  id: string
  negative: string
  positive: string
}

const phase = ref<'negative' | 'positive' | 'flip'>('negative')
const currentNegative = ref('')
const currentPositive = ref('')
const transformations = ref<Transformation[]>([])
const flipDone = ref(false)
const negativeInputRef = ref<HTMLTextAreaElement | null>(null)
const positiveInputRef = ref<HTMLTextAreaElement | null>(null)
const historyRef = ref<HTMLElement | null>(null)
let idCounter = 0

const scrollHistory = async () => {
  await nextTick()
  if (historyRef.value) {
    historyRef.value.scrollTop = historyRef.value.scrollHeight
  }
}

const focusNegative = () => {
  nextTick(() => {
    negativeInputRef.value?.focus()
  })
}

const focusPositive = () => {
  nextTick(() => {
    positiveInputRef.value?.focus()
  })
}

const submitNegative = () => {
  const text = currentNegative.value.trim()
  if (!text) return
  phase.value = 'positive'
  currentPositive.value = ''
  focusPositive()
}

const submitPositive = () => {
  const text = currentPositive.value.trim()
  if (!text) return

  // Record transformation
  transformations.value.push({
    id: `t-${idCounter++}`,
    negative: currentNegative.value.trim(),
    positive: text
  })

  // Trigger flip animation
  phase.value = 'flip'
  flipDone.value = false
  scrollHistory()

  // After brief delay, trigger the visual flip
  setTimeout(() => {
    flipDone.value = true
  }, 200)
}

const startNextRound = () => {
  currentNegative.value = ''
  currentPositive.value = ''
  flipDone.value = false
  phase.value = 'negative'
  nextTick(() => {
    focusNegative()
    scrollHistory()
  })
}

const handleComplete = () => {
  emit('complete', { completed: true })
}

onMounted(() => {
  focusNegative()
})
</script>

<style scoped>
.belief-flip {
  padding: 28px 28px 32px;
  background: linear-gradient(180deg, rgba(252, 250, 246, 0.98), rgba(248, 245, 240, 0.98));
  border-radius: 20px;
  max-width: 560px;
  margin: 0 auto;
  min-height: 540px;
  display: flex;
  flex-direction: column;
}

/* ─── History list ─── */
.history-list {
  flex-shrink: 0;
  max-height: 180px;
  overflow-y: auto;
  margin-bottom: 20px;
  padding-right: 4px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  scrollbar-width: thin;
  scrollbar-color: rgba(200, 190, 180, 0.2) transparent;
}

.history-list::-webkit-scrollbar {
  width: 3px;
}

.history-list::-webkit-scrollbar-track {
  background: transparent;
}

.history-list::-webkit-scrollbar-thumb {
  background: rgba(200, 190, 180, 0.2);
  border-radius: 2px;
}

.history-item {
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 10px;
  border: 1px solid rgba(200, 190, 180, 0.1);
}

.history-negative {
  font-size: 12px;
  font-weight: 300;
  color: rgba(160, 150, 140, 0.55);
  letter-spacing: 0.02em;
  line-height: 1.7;
  text-decoration: line-through;
  text-decoration-color: rgba(200, 185, 170, 0.3);
}

.history-divider {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 4px 0;
}

.divider-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(to right, transparent, rgba(200, 190, 180, 0.2), transparent);
}

.divider-arrow {
  font-size: 10px;
  color: rgba(200, 190, 180, 0.35);
}

.history-positive {
  font-size: 12px;
  font-weight: 400;
  color: rgba(140, 130, 115, 0.75);
  letter-spacing: 0.02em;
  line-height: 1.7;
}

/* ─── Active area ─── */
.active-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.phase {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

/* ─── Guidance ─── */
.guidance-text {
  font-size: 15px;
  font-weight: 300;
  line-height: 2;
  color: #7A7068;
  letter-spacing: 0.03em;
  text-align: center;
  margin-bottom: 8px;
}

.guidance-hint {
  font-size: 12px;
  font-weight: 300;
  color: rgba(170, 160, 150, 0.55);
  letter-spacing: 0.04em;
  text-align: center;
  margin-bottom: 24px;
}

.guidance-flip {
  margin-bottom: 6px;
}

/* ─── Input ─── */
.input-wrapper {
  width: 100%;
}

.belief-input {
  width: 100%;
  padding: 14px 18px;
  background: rgba(255, 255, 255, 0.55);
  border: 1px solid rgba(210, 200, 190, 0.2);
  border-radius: 12px;
  font-size: 14px;
  font-weight: 300;
  line-height: 1.9;
  color: #5A5248;
  letter-spacing: 0.02em;
  resize: none;
  outline: none;
  transition: border-color 600ms ease, box-shadow 600ms ease;
  box-sizing: border-box;
  font-family: inherit;
  text-align: center;
}

.belief-input::placeholder {
  color: rgba(190, 180, 170, 0.5);
  text-align: center;
  font-size: 13px;
}

.belief-input:focus {
  border-color: rgba(210, 200, 190, 0.4);
  box-shadow: 0 0 0 3px rgba(210, 200, 190, 0.07);
}

.submit-btn {
  display: block;
  width: 100%;
  margin-top: 10px;
  padding: 12px 24px;
  background: rgba(210, 200, 188, 0.22);
  border: 1px solid rgba(200, 190, 178, 0.25);
  border-radius: 9999px;
  font-size: 13px;
  font-weight: 300;
  letter-spacing: 0.15em;
  color: #8A7E72;
  cursor: pointer;
  transition: all 700ms cubic-bezier(0.4, 0, 0.2, 1);
}

.submit-btn:not(:disabled):hover {
  background: rgba(210, 200, 188, 0.38);
  color: #5A5248;
}

.submit-btn:active {
  transform: scale(0.97);
}

.submit-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

/* ─── Phase Positive: negative display above ─── */
.negative-display {
  width: 100%;
  padding: 14px 20px;
  background: rgba(240, 235, 228, 0.45);
  border-radius: 10px;
  border: 1px solid rgba(210, 200, 188, 0.15);
  margin-bottom: 20px;
  text-align: center;
}

.negative-text {
  font-size: 13px;
  font-weight: 300;
  color: rgba(160, 150, 140, 0.6);
  letter-spacing: 0.03em;
  line-height: 1.7;
  text-decoration: line-through;
  text-decoration-color: rgba(200, 185, 170, 0.3);
}

/* ─── Phase Flip: cinematic stage ─── */
.phase-flip {
  justify-content: center;
  align-items: center;
  text-align: center;
}

.flip-stage {
  width: 100%;
  padding: 32px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.flip-negative {
  font-size: 14px;
  font-weight: 300;
  color: rgba(180, 170, 160, 0.55);
  letter-spacing: 0.03em;
  line-height: 1.8;
  text-decoration: line-through;
  text-decoration-color: rgba(200, 185, 170, 0.35);
  opacity: 1;
  transition: opacity 1000ms cubic-bezier(0.4, 0, 0.2, 1),
              transform 1000ms cubic-bezier(0.4, 0, 0.2, 1),
              color 1000ms ease;
  transform: translateY(0);
}

.flip-negative.is-struck {
  opacity: 0.3;
  transform: translateY(-4px);
  color: transparent;
}

.flip-positive {
  font-size: 16px;
  font-weight: 400;
  color: rgba(160, 145, 130, 0.4);
  letter-spacing: 0.03em;
  line-height: 1.9;
  opacity: 0;
  transform: translateY(10px) scale(0.97);
  transition: opacity 1000ms cubic-bezier(0.4, 0, 0.2, 1) 200ms,
              transform 1000ms cubic-bezier(0.4, 0, 0.2, 1) 200ms,
              color 1000ms ease;
}

.flip-positive.is-lit {
  opacity: 1;
  transform: translateY(0) scale(1);
  color: rgba(130, 110, 90, 0.85);
}

.flip-hint {
  font-size: 12px;
  font-weight: 300;
  color: rgba(170, 160, 150, 0.5);
  letter-spacing: 0.08em;
  margin-bottom: 20px;
}

.next-btn {
  padding: 12px 32px;
  background: rgba(210, 200, 188, 0.22);
  border: 1px solid rgba(200, 190, 178, 0.25);
  border-radius: 9999px;
  font-size: 13px;
  font-weight: 300;
  letter-spacing: 0.15em;
  color: #8A7E72;
  cursor: pointer;
  transition: all 700ms cubic-bezier(0.4, 0, 0.2, 1);
}

.next-btn:hover {
  background: rgba(210, 200, 188, 0.38);
  color: #5A5248;
}

.next-btn:active {
  transform: scale(0.97);
}

/* ─── Exit ─── */
.exit-area {
  flex-shrink: 0;
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.seal-btn {
  padding: 10px 28px;
  background: none;
  border: 1px solid rgba(210, 200, 188, 0.2);
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 300;
  letter-spacing: 0.12em;
  color: rgba(170, 160, 150, 0.5);
  cursor: pointer;
  transition: all 600ms ease;
}

.seal-btn:hover {
  color: rgba(150, 140, 130, 0.7);
  border-color: rgba(200, 190, 178, 0.3);
}

/* ─── Cinematic transition ─── */
.cinematic-fade-enter-active {
  transition: opacity 900ms cubic-bezier(0.4, 0, 0.2, 1), transform 900ms cubic-bezier(0.4, 0, 0.2, 1);
}
.cinematic-fade-leave-active {
  transition: opacity 600ms cubic-bezier(0.4, 0, 0.2, 1);
}
.cinematic-fade-enter-from {
  opacity: 0;
  transform: translateY(16px);
}
.cinematic-fade-leave-to {
  opacity: 0;
}
</style>
