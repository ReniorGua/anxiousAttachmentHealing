<template>
  <div class="birth-memory">
    <!-- Step 0: Entry Choice -->
    <transition name="gentle-fade" mode="out-in">
      <div v-if="step === 0" key="step-0" class="step step-0">
        <p class="intro-text">
          每一次呼吸，<br/>都是一次微小的重生。<br/>
          现在，我们要进行一次时光溯源。<br/>
          关于你的出生，你了解多少？
        </p>
        <div class="choice-buttons">
          <button class="choice-btn" @click="choose(true)">
            我依稀知晓那天的情景
          </button>
          <button class="choice-btn secondary" @click="choose(false)">
            我毫无所知，但我愿意想象
          </button>
        </div>
      </div>
    </transition>

    <!-- Step 1: Writing Space -->
    <transition name="gentle-fade" mode="out-in">
      <div v-if="step === 1" key="step-1" class="step step-1">
        <h3 class="writing-title">{{ writingTitle }}</h3>
        <div class="textarea-wrapper">
          <textarea
            v-model="birthText"
            ref="textareaRef"
            class="birth-textarea"
            placeholder="具体时刻、周围的环境、气味、光线，或者你直觉中感受到的任何画面……深呼吸，写下来。"
            rows="8"
          />
        </div>
        <button
          class="done-btn"
          :disabled="!birthText.trim()"
          @click="goToStep(2)"
        >
          我写好了
        </button>
      </div>
    </transition>

    <!-- Step 2: Rebirth & Breathing -->
    <transition name="gentle-fade" mode="out-in">
      <div v-if="step === 2" key="step-2" class="step step-2">
        <!-- Breathing orb as ambient background layer -->
        <div class="breath-orb" aria-hidden="true">
          <div class="orb-ring orb-ring-1"></div>
          <div class="orb-ring orb-ring-2"></div>
          <div class="orb-ring orb-ring-3"></div>
        </div>
        <!-- Inscription content, floats above the orb -->
        <div class="rebirth-content">
          <p class="inscription">{{ birthText }}</p>
        </div>
        <p class="rebirth-guidance">
          跟随光晕的节奏，慢慢读一遍你写下的内容。<br/>
          去感受身体里可能涌现的任何感觉，不要评判。
        </p>
        <button class="finish-btn" @click="handleComplete">
          完成重生
        </button>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted } from 'vue'

const emit = defineEmits<{
  complete: [{ completed: boolean }]
}>()

const step = ref(0)
const birthText = ref('')
const knowsBirth = ref(true)
const textareaRef = ref<HTMLTextAreaElement | null>(null)

const writingTitle = ref('我所知的出生情形')

const choose = (knows: boolean) => {
  knowsBirth.value = knows
  writingTitle.value = knows
    ? '我所知的出生情形'
    : '我对自己出生情形的想象'
  goToStep(1)
}

const goToStep = (targetStep: number) => {
  step.value = targetStep
  if (targetStep === 1) {
    nextTick(() => {
      if (textareaRef.value) {
        textareaRef.value.focus()
      }
    })
  }
}

const handleComplete = () => {
  emit('complete', { completed: true })
}
</script>

<style scoped>
.birth-memory {
  padding: 36px 32px 44px;
  background: linear-gradient(160deg, rgba(250, 240, 235, 0.98), rgba(245, 238, 230, 0.98));
  border-radius: 20px;
  max-width: 560px;
  margin: 0 auto;
  min-height: 540px;
  display: flex;
  flex-direction: column;
}

/* ─── Step 0: Entry ─── */
.step {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.step-0 {
  justify-content: center;
  align-items: center;
  text-align: center;
}

.intro-text {
  font-size: 15px;
  font-weight: 300;
  line-height: 2.6;
  color: #7A7268;
  letter-spacing: 0.04em;
  margin-bottom: 44px;
}

.choice-buttons {
  display: flex;
  flex-direction: column;
  gap: 14px;
  width: 100%;
  max-width: 320px;
}

.choice-btn {
  padding: 16px 28px;
  background: rgba(210, 195, 180, 0.18);
  border: 1px solid rgba(200, 185, 170, 0.25);
  border-radius: 9999px;
  font-size: 13px;
  font-weight: 300;
  letter-spacing: 0.12em;
  color: #7A7268;
  cursor: pointer;
  transition: all 1000ms cubic-bezier(0.4, 0, 0.2, 1);
}

.choice-btn:hover {
  background: rgba(210, 195, 180, 0.32);
  color: #5A5248;
  transform: translateY(-2px);
}

.choice-btn:active {
  transform: scale(0.98);
}

.choice-btn.secondary {
  background: rgba(200, 190, 180, 0.1);
  border-color: rgba(200, 190, 180, 0.18);
  color: #9A9288;
}

.choice-btn.secondary:hover {
  background: rgba(200, 190, 180, 0.22);
  color: #7A7268;
}

/* ─── Step 1: Writing Space ─── */
.step-1 {
  justify-content: flex-start;
  padding-top: 8px;
}

.writing-title {
  font-size: 14px;
  font-weight: 300;
  letter-spacing: 0.18em;
  color: rgba(160, 150, 140, 0.7);
  margin-bottom: 20px;
  text-align: center;
}

.textarea-wrapper {
  flex: 1;
  margin-bottom: 16px;
}

.birth-textarea {
  width: 100%;
  height: 100%;
  min-height: 280px;
  padding: 20px 22px;
  background: rgba(255, 255, 255, 0.45);
  border: none;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 300;
  line-height: 2.2;
  color: #5A5248;
  letter-spacing: 0.02em;
  resize: none;
  outline: none;
  transition: background 600ms ease;
  box-sizing: border-box;
  font-family: inherit;
}

.birth-textarea::placeholder {
  color: rgba(180, 170, 160, 0.6);
  line-height: 2.4;
}

.birth-textarea:focus {
  background: rgba(255, 255, 255, 0.65);
}

.done-btn {
  align-self: flex-end;
  padding: 12px 32px;
  background: rgba(200, 185, 170, 0.2);
  border: 1px solid rgba(190, 175, 160, 0.25);
  border-radius: 9999px;
  font-size: 13px;
  font-weight: 300;
  letter-spacing: 0.15em;
  color: #8A7E72;
  cursor: pointer;
  transition: all 800ms cubic-bezier(0.4, 0, 0.2, 1);
}

.done-btn:not(:disabled):hover {
  background: rgba(200, 185, 170, 0.35);
  color: #5A5248;
}

.done-btn:active {
  transform: scale(0.97);
}

.done-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

/* ─── Step 2: Rebirth & Breathing ─── */
.step-2 {
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  text-align: center;
  overflow: hidden;
  padding-top: 16px;
}

/* Breathing orb as ambient background, centered and fixed size */
.breath-orb {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 280px;
  height: 280px;
  z-index: 0;
  pointer-events: none;
}

.orb-ring {
  position: absolute;
  border-radius: 50%;
  animation: orbBreath 12s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}

.orb-ring-1 {
  inset: 0;
  background: radial-gradient(circle, rgba(240, 220, 200, 0.22) 0%, rgba(230, 210, 190, 0.06) 70%, transparent 100%);
  animation-delay: 0s;
}

.orb-ring-2 {
  inset: 22px;
  background: radial-gradient(circle, rgba(235, 215, 195, 0.18) 0%, rgba(225, 205, 185, 0.05) 70%, transparent 100%);
  animation-delay: 1s;
}

.orb-ring-3 {
  inset: 44px;
  background: radial-gradient(circle, rgba(230, 210, 190, 0.15) 0%, rgba(220, 200, 180, 0.04) 70%, transparent 100%);
  animation-delay: 2s;
}

/* Inscription content floats above the orb, scrollable if needed */
.rebirth-content {
  position: relative;
  z-index: 1;
  width: 100%;
  padding: 0 4px;
  overflow: visible;
}

.inscription {
  font-size: 14px;
  font-weight: 300;
  line-height: 2.2;
  color: rgba(120, 110, 100, 0.9);
  letter-spacing: 0.03em;
  text-align: center;
  word-break: break-word;
}

.rebirth-guidance {
  position: relative;
  z-index: 1;
  width: 100%;
  font-size: 12px;
  font-weight: 300;
  line-height: 2.2;
  color: rgba(140, 130, 120, 0.65);
  letter-spacing: 0.03em;
  text-align: center;
  margin-top: 16px;
  flex-shrink: 0;
}

.finish-btn {
  position: relative;
  z-index: 1;
  flex-shrink: 0;
  margin-top: 20px;
  padding: 14px 40px;
  background: rgba(210, 195, 180, 0.22);
  border: 1px solid rgba(200, 185, 170, 0.28);
  border-radius: 9999px;
  font-size: 13px;
  font-weight: 300;
  letter-spacing: 0.2em;
  color: #8A7E72;
  cursor: pointer;
  transition: all 1000ms cubic-bezier(0.4, 0, 0.2, 1);
}

.finish-btn:hover {
  background: rgba(210, 195, 180, 0.38);
  color: #5A5248;
}

.finish-btn:active {
  transform: scale(0.97);
}

/* Breathing orb animation: 4s in, 2s hold, 6s out = 12s total */
@keyframes orbBreath {
  0% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.5;
  }
  /* 4s inhale */
  33% {
    transform: translate(-50%, -50%) scale(1.18);
    opacity: 0.9;
  }
  /* 2s hold at top */
  50% {
    transform: translate(-50%, -50%) scale(1.18);
    opacity: 0.9;
  }
  /* 6s exhale */
  100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.5;
  }
}

/* ─── Transitions ─── */
.gentle-fade-enter-active {
  transition: opacity 1000ms cubic-bezier(0.4, 0, 0.2, 1), transform 1000ms cubic-bezier(0.4, 0, 0.2, 1);
}
.gentle-fade-leave-active {
  transition: opacity 700ms cubic-bezier(0.4, 0, 0.2, 1);
}
.gentle-fade-enter-from {
  opacity: 0;
  transform: translateY(18px);
}
.gentle-fade-leave-to {
  opacity: 0;
}
</style>
