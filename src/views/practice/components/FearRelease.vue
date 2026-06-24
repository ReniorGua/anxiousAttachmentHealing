<template>
  <div class="fear-release">
    <!-- Header -->
    <div class="practice-header">
      <p class="practice-icon">🕯️</p>
      <h2 class="practice-title">恐惧释放</h2>
      <p class="practice-guidance">
        现在，请写下你此刻最深的恐惧。<br/>
        比如："我害怕自己永远不够好"。<br/>
        不要评判自己，写下来就好。
      </p>
    </div>

    <!-- Dialogue List -->
    <div class="dialogue-list" ref="dialogueListRef">
      <transition-group name="fade-rise" tag="div" class="dialogue-items">
        <div
          v-for="item in dialogueItems"
          :key="item.id"
          class="dialogue-item"
          :class="item.type"
        >
          <p class="dialogue-text">{{ item.text }}</p>
        </div>
      </transition-group>
    </div>

    <!-- Input Area -->
    <div class="input-section">
      <input
        v-model="inputText"
        ref="inputRef"
        type="text"
        class="fear-input"
        placeholder="写下你的恐惧..."
        @keydown.enter.exact.prevent="handleSubmit"
      />
    </div>

    <!-- Complete Button -->
    <div class="complete-section">
      <button
        @click="handleComplete"
        class="complete-btn"
        :disabled="dialogueItems.length === 0"
      >
        我已经倾倒完毕
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted } from 'vue'

const emit = defineEmits<{
  complete: [{ completed: boolean }]
}>()

interface DialogueItem {
  id: number
  type: 'user' | 'system'
  text: string
}

const inputText = ref('')
const dialogueItems = ref<DialogueItem[]>([])
const dialogueListRef = ref<HTMLElement | null>(null)
const inputRef = ref<HTMLInputElement | null>(null)
let itemIdCounter = 0

const scrollToBottom = async () => {
  await nextTick()
  if (dialogueListRef.value) {
    dialogueListRef.value.scrollTop = dialogueListRef.value.scrollHeight
  }
}

const handleSubmit = async () => {
  const text = inputText.value.trim()
  if (!text) return

  // Add user fear
  dialogueItems.value.push({
    id: itemIdCounter++,
    type: 'user',
    text
  })
  inputText.value = ''

  await scrollToBottom()

  // Add system "谢谢" after 600ms delay
  setTimeout(() => {
    dialogueItems.value.push({
      id: itemIdCounter++,
      type: 'system',
      text: '谢谢。'
    })
    scrollToBottom()
  }, 600)
}

const handleComplete = () => {
  emit('complete', { completed: true })
}

onMounted(() => {
  if (inputRef.value) {
    inputRef.value.focus()
  }
})
</script>

<style scoped>
.fear-release {
  padding: 32px 28px 40px;
  background: rgba(250, 248, 245, 0.98);
  border-radius: 20px;
  max-width: 560px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  min-height: 500px;
}

/* Header */
.practice-header {
  text-align: center;
  margin-bottom: 28px;
  flex-shrink: 0;
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

/* Dialogue List */
.dialogue-list {
  flex: 1;
  overflow-y: auto;
  margin-bottom: 20px;
  padding-right: 4px;
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.08) transparent;
}

.dialogue-list::-webkit-scrollbar {
  width: 4px;
}

.dialogue-list::-webkit-scrollbar-track {
  background: transparent;
}

.dialogue-list::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.08);
  border-radius: 2px;
}

.dialogue-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.dialogue-item {
  padding: 12px 16px;
  border-radius: 12px;
  max-width: 85%;
}

.dialogue-item.user {
  align-self: flex-end;
  background: rgba(180, 170, 160, 0.12);
  border: 1px solid rgba(180, 170, 160, 0.15);
}

.dialogue-item.user .dialogue-text {
  color: #5A5A52;
  font-size: 14px;
  font-weight: 300;
  line-height: 1.7;
  letter-spacing: 0.02em;
}

.dialogue-item.system {
  align-self: flex-start;
  background: transparent;
}

.dialogue-item.system .dialogue-text {
  color: #B0ACA4;
  font-size: 13px;
  font-weight: 300;
  letter-spacing: 0.05em;
  font-style: italic;
}

/* Input */
.input-section {
  flex-shrink: 0;
  margin-bottom: 16px;
}

.fear-input {
  width: 100%;
  padding: 14px 18px;
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(160, 150, 140, 0.12);
  border-radius: 12px;
  font-size: 14px;
  font-weight: 300;
  line-height: 1.6;
  color: #4A4A3E;
  letter-spacing: 0.02em;
  outline: none;
  transition: border-color 400ms ease, box-shadow 400ms ease;
  box-sizing: border-box;
}

.fear-input::placeholder {
  color: #B0ACA4;
}

.fear-input:focus {
  border-color: rgba(160, 150, 140, 0.3);
  box-shadow: 0 0 0 3px rgba(160, 150, 140, 0.06);
}

/* Complete Button */
.complete-section {
  flex-shrink: 0;
}

.complete-btn {
  display: block;
  width: 100%;
  padding: 14px 24px;
  background: rgba(160, 150, 140, 0.1);
  border: 1px solid rgba(160, 150, 140, 0.15);
  border-radius: 12px;
  font-size: 13px;
  font-weight: 300;
  letter-spacing: 0.15em;
  color: #8A8A7E;
  cursor: pointer;
  transition: all 400ms ease;
}

.complete-btn:not(:disabled):hover {
  background: rgba(160, 150, 140, 0.18);
  color: #6A6A5E;
}

.complete-btn:active {
  transform: scale(0.98);
}

.complete-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* Transitions */
.fade-rise-enter-active {
  transition: all 500ms cubic-bezier(0.4, 0, 0.2, 1);
}
.fade-rise-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
</style>
