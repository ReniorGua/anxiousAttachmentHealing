<template>
  <div class="personal-law">
    <!-- Step 0: Preparation -->
    <transition name="step-fade">
      <div v-if="step === 0" key="step-0" class="step step-0">
        <p class="preparation-text">
          请先做一个深呼吸。<br/>
          接下来，我们会面对一些内心的阴影，<br/>
          但请记住，看见它们，<br/>
          就是剥夺它们权力的第一步。
        </p>
        <button class="ready-btn" @click="goToStep(1)">
          我准备好了
        </button>
      </div>
    </transition>

    <!-- Steps 1-4: Writing prompts -->
    <transition name="step-fade">
      <div v-if="step >= 1 && step <= 4" key="step-writing" class="step step-writing">
        <transition name="prompt-fade" mode="out-in">
          <p :key="step" class="breath-hint">深呼吸...</p>
        </transition>
        <transition name="prompt-fade" mode="out-in">
          <p :key="'prompt-' + step" class="writing-prompt">{{ prompts[step - 1] }}</p>
        </transition>
        <transition name="input-fade" mode="out-in">
          <div :key="'input-' + step" class="input-wrapper">
            <textarea
              v-model="answers[step - 1]"
              ref="inputRef"
              class="law-input"
              :placeholder="'在这里轻轻写下...'"
              rows="3"
              @keydown.enter.exact.prevent="handleContinue"
            />
            <button
              class="continue-btn"
              :disabled="!answers[step - 1].trim()"
              @click="handleContinue"
            >
              继续
            </button>
          </div>
        </transition>
        <p class="step-indicator">{{ step }} / 4</p>
      </div>
    </transition>

    <!-- Step 5: Review and select core belief -->
    <transition name="step-fade">
      <div v-if="step === 5" key="step-5" class="step step-5">
        <transition name="prompt-fade" mode="out-in">
          <p key="review-prompt" class="writing-prompt review-guidance">
            现在，请看着你写下的这四句话。<br/>
            深呼吸。<br/>
            哪一句是最基本、最强烈、最能承载情感的？<br/>
            其余的句子似乎都是由它衍生而来的。
          </p>
        </transition>
        <div class="beliefs-list">
          <transition-group name="belief-item" tag="div" class="beliefs-items">
            <div
              v-for="(answer, index) in answers"
              :key="'belief-' + index"
              class="belief-item"
              :class="{
                selected: selectedBelief === index,
                fading: selectedBelief !== null && selectedBelief !== index
              }"
              @click="selectBelief(index)"
            >
              <p class="belief-text">{{ answer }}</p>
            </div>
          </transition-group>
        </div>
        <transition name="conclusion-fade">
          <div v-if="selectedBelief !== null" class="conclusion-section">
            <div class="core-law-card">
              <p class="core-law-label">你的个人律法</p>
              <p class="core-law-text">{{ answers[selectedBelief] }}</p>
            </div>
            <p class="final-words">
              它只是一个被你误认为是真理的想法，而不是事实。<br/>
              今天，我们把它留在这里。
            </p>
            <button class="seal-btn" @click="handleComplete">
              封存并离开
            </button>
          </div>
        </transition>
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
const answers = ref(['', '', '', ''])
const selectedBelief = ref<number | null>(null)
const inputRef = ref<HTMLTextAreaElement | null>(null)

const prompts = [
  '关于我自己，我觉得最糟糕的是——',
  '我对自己最负面的评价是——',
  '阻碍我获得真正平静的最大障碍是——',
  '关于我这个人，我内心深处最不愿面对的评判是——'
]

const goToStep = (targetStep: number) => {
  step.value = targetStep
  if (targetStep >= 1 && targetStep <= 4) {
    nextTick(() => {
      if (inputRef.value) {
        inputRef.value.focus()
      }
    })
  }
}

const handleContinue = () => {
  if (step.value < 4) {
    goToStep(step.value + 1)
  } else {
    goToStep(5)
  }
}

const selectBelief = (index: number) => {
  selectedBelief.value = index
}

const handleComplete = () => {
  emit('complete', { completed: true })
}

onMounted(() => {
  // Focus first input when step becomes 1
})
</script>

<style scoped>
.personal-law {
  padding: 36px 32px 44px;
  background: rgba(250, 248, 245, 0.98);
  border-radius: 20px;
  max-width: 560px;
  margin: 0 auto;
  min-height: 520px;
  display: flex;
  flex-direction: column;
}

/* Step 0: Preparation */
.step {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.preparation-text {
  font-size: 15px;
  font-weight: 300;
  line-height: 2.4;
  color: #7A7A6E;
  letter-spacing: 0.04em;
  margin-bottom: 40px;
}

.ready-btn {
  padding: 14px 40px;
  background: rgba(160, 155, 145, 0.12);
  border: 1px solid rgba(160, 155, 145, 0.2);
  border-radius: 9999px;
  font-size: 13px;
  font-weight: 300;
  letter-spacing: 0.2em;
  color: #7A7A6E;
  cursor: pointer;
  transition: all 600ms cubic-bezier(0.4, 0, 0.2, 1);
}

.ready-btn:hover {
  background: rgba(160, 155, 145, 0.2);
  color: #5A5A52;
}

.ready-btn:active {
  transform: scale(0.97);
}

/* Steps 1-4: Writing */
.step-writing {
  justify-content: flex-start;
  padding-top: 20px;
}

.breath-hint {
  font-size: 12px;
  font-weight: 300;
  letter-spacing: 0.15em;
  color: rgba(150, 145, 135, 0.5);
  margin-bottom: 16px;
  text-align: left;
}

.writing-prompt {
  font-size: 16px;
  font-weight: 400;
  line-height: 1.9;
  color: #5A5A52;
  letter-spacing: 0.03em;
  margin-bottom: 24px;
  text-align: left;
}

.review-guidance {
  font-size: 14px;
  font-weight: 300;
  color: #8A8A7E;
  margin-bottom: 28px;
  text-align: center;
  line-height: 2.2;
}

.input-wrapper {
  width: 100%;
}

.law-input {
  width: 100%;
  padding: 16px 18px;
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(160, 155, 145, 0.15);
  border-radius: 12px;
  font-size: 14px;
  font-weight: 300;
  line-height: 1.9;
  color: #4A4A3E;
  letter-spacing: 0.02em;
  resize: none;
  outline: none;
  transition: border-color 400ms ease, box-shadow 400ms ease;
  box-sizing: border-box;
  font-family: inherit;
}

.law-input::placeholder {
  color: #C0BCB4;
}

.law-input:focus {
  border-color: rgba(160, 155, 145, 0.3);
  box-shadow: 0 0 0 3px rgba(160, 155, 145, 0.06);
}

.continue-btn {
  display: block;
  width: 100%;
  margin-top: 12px;
  padding: 14px 24px;
  background: rgba(160, 155, 145, 0.1);
  border: 1px solid rgba(160, 155, 145, 0.15);
  border-radius: 12px;
  font-size: 13px;
  font-weight: 300;
  letter-spacing: 0.15em;
  color: #8A8A7E;
  cursor: pointer;
  transition: all 400ms ease;
}

.continue-btn:not(:disabled):hover {
  background: rgba(160, 155, 145, 0.18);
  color: #6A6A5E;
}

.continue-btn:active {
  transform: scale(0.98);
}

.continue-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.step-indicator {
  margin-top: 24px;
  font-size: 11px;
  font-weight: 300;
  letter-spacing: 0.15em;
  color: rgba(150, 145, 135, 0.4);
  text-align: center;
}

/* Step 5: Review */
.step-5 {
  justify-content: flex-start;
  align-items: center;
}

.beliefs-list {
  width: 100%;
  margin-bottom: 24px;
}

.beliefs-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.belief-item {
  padding: 14px 18px;
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(160, 155, 145, 0.12);
  border-radius: 12px;
  cursor: pointer;
  transition: all 1000ms cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.belief-item:hover:not(.fading):not(.selected) {
  background: rgba(255, 255, 255, 0.85);
  border-color: rgba(160, 155, 145, 0.25);
}

.belief-item.selected {
  background: rgba(250, 248, 242, 0.95);
  border-color: rgba(160, 155, 145, 0.35);
  box-shadow: 0 0 0 3px rgba(160, 155, 145, 0.08), 0 0 20px rgba(160, 155, 145, 0.1);
}

.belief-item.fading {
  opacity: 0.25;
  transform: scale(0.98);
  pointer-events: none;
}

.belief-text {
  font-size: 13px;
  font-weight: 300;
  line-height: 1.8;
  color: #5A5A52;
  letter-spacing: 0.02em;
}

/* Conclusion */
.conclusion-section {
  width: 100%;
  text-align: center;
  animation: fadeInUp 800ms cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

.core-law-card {
  padding: 20px 24px;
  background: linear-gradient(135deg, rgba(200, 190, 175, 0.1), rgba(190, 180, 165, 0.08));
  border: 1px solid rgba(180, 170, 155, 0.2);
  border-radius: 14px;
  margin-bottom: 20px;
}

.core-law-label {
  font-size: 11px;
  font-weight: 300;
  letter-spacing: 0.2em;
  color: rgba(150, 145, 135, 0.6);
  margin-bottom: 10px;
  text-transform: uppercase;
}

.core-law-text {
  font-size: 15px;
  font-weight: 400;
  line-height: 1.8;
  color: #5A5A52;
  letter-spacing: 0.02em;
}

.final-words {
  font-size: 13px;
  font-weight: 300;
  line-height: 2;
  color: #8A8A7E;
  letter-spacing: 0.03em;
  margin-bottom: 24px;
}

.seal-btn {
  padding: 14px 40px;
  background: rgba(160, 155, 145, 0.12);
  border: 1px solid rgba(160, 155, 145, 0.2);
  border-radius: 9999px;
  font-size: 13px;
  font-weight: 300;
  letter-spacing: 0.2em;
  color: #7A7A6E;
  cursor: pointer;
  transition: all 600ms cubic-bezier(0.4, 0, 0.2, 1);
}

.seal-btn:hover {
  background: rgba(160, 155, 145, 0.22);
  color: #5A5A52;
}

.seal-btn:active {
  transform: scale(0.97);
}

/* Step transitions - slow and gentle */
.step-fade-enter-active {
  transition: opacity 800ms cubic-bezier(0.4, 0, 0.2, 1), transform 800ms cubic-bezier(0.4, 0, 0.2, 1);
}
.step-fade-leave-active {
  transition: opacity 500ms cubic-bezier(0.4, 0, 0.2, 1), transform 500ms cubic-bezier(0.4, 0, 0.2, 1);
}
.step-fade-enter-from {
  opacity: 0;
  transform: translateY(16px);
}
.step-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* Prompt and input transitions - gentle fade */
.prompt-fade-enter-active {
  transition: opacity 800ms cubic-bezier(0.4, 0, 0.2, 1);
}
.prompt-fade-leave-active {
  transition: opacity 400ms ease;
}
.prompt-fade-enter-from {
  opacity: 0;
}
.prompt-fade-leave-to {
  opacity: 0;
}

.input-fade-enter-active {
  transition: opacity 800ms cubic-bezier(0.4, 0, 0.2, 1), transform 800ms cubic-bezier(0.4, 0, 0.2, 1);
}
.input-fade-leave-active {
  transition: opacity 400ms ease;
}
.input-fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.input-fade-leave-to {
  opacity: 0;
}

/* Belief items */
.belief-item-enter-active {
  transition: opacity 600ms cubic-bezier(0.4, 0, 0.2, 1), transform 600ms cubic-bezier(0.4, 0, 0.2, 1);
}
.belief-item-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

/* Conclusion fade */
.conclusion-fade-enter-active {
  transition: opacity 1000ms cubic-bezier(0.4, 0, 0.2, 1), transform 1000ms cubic-bezier(0.4, 0, 0.2, 1);
}
.conclusion-fade-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
