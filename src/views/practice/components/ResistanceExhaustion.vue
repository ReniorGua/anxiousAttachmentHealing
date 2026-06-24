<template>
  <div class="resistance-exhaustion">
    <!-- Phase 0: Setup -->
    <transition name="paper-fade" mode="out-in">
      <div v-if="phase === 0" key="phase-0" class="phase phase-0">
        <p class="setup-title">准备你的中线练习</p>
        <div class="setup-form">
          <div class="form-field">
            <label class="field-label">你的名字是？</label>
            <input
              v-model="userName"
              class="field-input"
              placeholder="请输入名字"
              @keydown.enter.exact.prevent="nameEnter"
            />
          </div>
          <div class="form-field">
            <label class="field-label">今天你想注入身体的一句肯定语是？</label>
            <textarea
              v-model="affirmation"
              class="field-textarea"
              placeholder="例如：我对生活充满掌控力"
              rows="2"
              @keydown.enter.exact.prevent="affirmationEnter"
            />
          </div>
          <button
            class="start-btn"
            :disabled="!userName.trim() || !affirmation.trim()"
            @click="startPractice"
          >
            开始穿越阻抗
          </button>
        </div>
      </div>
    </transition>

    <!-- Phases 1-3: Resistance rounds -->
    <transition name="paper-fade" mode="out-in">
      <div v-if="phase >= 1 && phase <= 3" key="phase-resistance" class="phase phase-resistance">
        <!-- Stage header -->
        <div class="stage-header">
          <p class="stage-label">第 {{ phase }} 阶段 · {{ roundLabel }}</p>
          <p class="round-count">第 {{ currentRound + 1 }} / 15 轮</p>
        </div>

        <!-- Split arena -->
        <div class="arena">
          <!-- Left: Affirmation side -->
          <div class="affirm-side">
            <div class="affirm-strip" v-for="(round, i) in completedRounds" :key="round.id">
              <p class="affirm-text">{{ round.leftText }}</p>
            </div>
            <div class="affirm-current">
              <p class="affirm-text current">{{ currentLeftText }}</p>
            </div>
          </div>

          <!-- Center divider -->
          <div class="center-line" aria-hidden="true">
            <div class="line-glow"></div>
          </div>

          <!-- Right: Resistance side -->
          <div class="resist-side" ref="resistSideRef">
            <div
              v-for="(round, i) in completedRounds"
              :key="round.id"
              class="resist-item"
            >
              <p class="resist-text">{{ round.rightText }}</p>
            </div>
            <div class="resist-input-area" v-if="!practiceDone">
              <textarea
                v-model="currentResistance"
                ref="resistInputRef"
                class="resist-input"
                placeholder="脑海中弹出的第一个负面反驳是..."
                rows="2"
                @keydown.enter.exact.prevent="submitResistance"
              />
              <button
                class="resist-submit"
                :disabled="!currentResistance.trim()"
                @click="submitResistance"
              >
                继续
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- Phase 4: Pure affirmation -->
    <transition name="paper-fade" mode="out-in">
      <div v-if="phase === 4" key="phase-pure" class="phase phase-pure">
        <div class="pure-stage">
          <div class="pure-affirmations">
            <transition-group name="pure-rise" tag="div" class="pure-list">
              <p
                v-for="(line, i) in pureAffirmations"
                :key="'pure-' + i"
                class="pure-text"
                :style="{ transitionDelay: i * 600 + 'ms' }"
              >
                {{ line }}
              </p>
            </transition-group>
          </div>
          <p class="pure-closing">
            阻抗已经耗尽。<br/>
            现在，这句话真正属于你了。
          </p>
          <button class="seal-btn" @click="handleComplete">
            封存力量并离开
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted } from 'vue'

const emit = defineEmits<{
  complete: [{ completed: boolean }]
}>()

interface Round {
  id: number
  leftText: string
  rightText: string
}

const phase = ref(0)
const userName = ref('')
const affirmation = ref('')
const currentRound = ref(0) // 0-14
const currentResistance = ref('')
const completedRounds = ref<Round[]>([])
const resistInputRef = ref<HTMLTextAreaElement | null>(null)
const resistSideRef = ref<HTMLElement | null>(null)
let roundIdCounter = 0

const TOTAL_ROUNDS = 15
const practiceDone = computed(() => currentRound.value >= TOTAL_ROUNDS)

const stage = computed(() => {
  if (currentRound.value < 5) return 1
  if (currentRound.value < 10) return 2
  return 3
})

const roundLabel = computed(() => {
  if (stage.value === 1) return '第一人称'
  if (stage.value === 2) return '第二人称'
  return '第三人称'
})

const currentLeftText = computed(() => {
  const name = userName.value.trim()
  const aff = affirmation.value.trim()
  const s = stage.value
  if (s === 1) return aff
  if (s === 2) return `${name}，你${aff}`
  return `${name}${aff}`
})

const pureAffirmations = computed(() => {
  const aff = affirmation.value.trim()
  return Array(5).fill(aff)
})

const scrollResist = async () => {
  await nextTick()
  if (resistSideRef.value) {
    resistSideRef.value.scrollTop = resistSideRef.value.scrollHeight
  }
}

const nameEnter = () => {
  // focus affirmation input
}

const affirmationEnter = () => {
  if (userName.value.trim() && affirmation.value.trim()) {
    startPractice()
  }
}

const startPractice = () => {
  if (!userName.value.trim() || !affirmation.value.trim()) return
  phase.value = 1
  currentRound.value = 0
  completedRounds.value = []
  currentResistance.value = ''
  nextTick(() => {
    resistInputRef.value?.focus()
  })
}

const submitResistance = () => {
  const text = currentResistance.value.trim()
  if (!text) return

  completedRounds.value.push({
    id: roundIdCounter++,
    leftText: currentLeftText.value,
    rightText: text
  })
  currentResistance.value = ''
  currentRound.value++

  scrollResist()

  if (currentRound.value >= TOTAL_ROUNDS) {
    // Move to phase 4
    setTimeout(() => {
      phase.value = 4
    }, 400)
  } else {
    // Check if stage changed
    const newStage = computed(() => {
      if (currentRound.value < 5) return 1
      if (currentRound.value < 10) return 2
      return 3
    }).value
    if (newStage !== stage.value) {
      phase.value = newStage
      nextTick(() => {
        resistInputRef.value?.focus()
      })
    } else {
      nextTick(() => {
        resistInputRef.value?.focus()
      })
    }
  }
}

const handleComplete = () => {
  emit('complete', { completed: true })
}
</script>

<style scoped>
.resistance-exhaustion {
  padding: 28px 24px 32px;
  background: linear-gradient(160deg, rgba(252, 248, 242, 0.98), rgba(248, 244, 238, 0.98));
  border-radius: 20px;
  max-width: 560px;
  margin: 0 auto;
  min-height: 540px;
  display: flex;
  flex-direction: column;
}

/* ─── Shared ─── */
.phase {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

/* ─── Phase 0: Setup ─── */
.phase-0 {
  justify-content: center;
  align-items: center;
}

.setup-title {
  font-size: 15px;
  font-weight: 300;
  letter-spacing: 0.12em;
  color: rgba(160, 150, 140, 0.65);
  margin-bottom: 32px;
  text-align: center;
}

.setup-form {
  width: 100%;
  max-width: 380px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field-label {
  font-size: 13px;
  font-weight: 300;
  color: rgba(140, 130, 120, 0.7);
  letter-spacing: 0.04em;
}

.field-input {
  width: 100%;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(210, 200, 190, 0.2);
  border-radius: 10px;
  font-size: 14px;
  font-weight: 300;
  color: #5A5248;
  letter-spacing: 0.02em;
  outline: none;
  transition: border-color 500ms ease;
  box-sizing: border-box;
  font-family: inherit;
}

.field-input:focus {
  border-color: rgba(210, 200, 190, 0.4);
}

.field-input::placeholder {
  color: rgba(200, 190, 180, 0.5);
}

.field-textarea {
  width: 100%;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(210, 200, 190, 0.2);
  border-radius: 10px;
  font-size: 14px;
  font-weight: 300;
  color: #5A5248;
  letter-spacing: 0.02em;
  resize: none;
  outline: none;
  transition: border-color 500ms ease;
  box-sizing: border-box;
  font-family: inherit;
  line-height: 1.9;
}

.field-textarea:focus {
  border-color: rgba(210, 200, 190, 0.4);
}

.field-textarea::placeholder {
  color: rgba(200, 190, 180, 0.5);
}

.start-btn {
  padding: 14px 24px;
  background: rgba(210, 200, 188, 0.28);
  border: 1px solid rgba(200, 190, 178, 0.28);
  border-radius: 9999px;
  font-size: 13px;
  font-weight: 300;
  letter-spacing: 0.15em;
  color: #8A7E72;
  cursor: pointer;
  transition: all 700ms cubic-bezier(0.4, 0, 0.2, 1);
}

.start-btn:not(:disabled):hover {
  background: rgba(210, 200, 188, 0.45);
  color: #5A5248;
}

.start-btn:active {
  transform: scale(0.97);
}

.start-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

/* ─── Phase Resistance ─── */
.phase-resistance {
  justify-content: flex-start;
}

.stage-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding: 0 4px;
}

.stage-label {
  font-size: 11px;
  font-weight: 300;
  letter-spacing: 0.15em;
  color: rgba(180, 170, 160, 0.5);
}

.round-count {
  font-size: 11px;
  font-weight: 300;
  letter-spacing: 0.1em;
  color: rgba(200, 190, 180, 0.4);
}

/* Split arena */
.arena {
  flex: 1;
  display: flex;
  gap: 0;
  min-height: 0;
  position: relative;
}

/* ─── Affirmation side ─── */
.affirm-side {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow: hidden;
}

.affirm-strip {
  padding: 8px 10px;
  background: rgba(240, 235, 228, 0.4);
  border-radius: 8px;
  border-left: 2px solid rgba(220, 205, 188, 0.3);
}

.affirm-strip .affirm-text {
  font-size: 12px;
  font-weight: 300;
  color: rgba(160, 150, 138, 0.65);
  letter-spacing: 0.02em;
  line-height: 1.7;
}

.affirm-current {
  padding: 10px 12px;
  background: rgba(235, 228, 218, 0.55);
  border-radius: 8px;
  border-left: 2px solid rgba(200, 185, 168, 0.4);
}

.affirm-text {
  font-size: 12px;
  font-weight: 300;
  line-height: 1.7;
  letter-spacing: 0.02em;
  word-break: break-word;
}

.affirm-text.current {
  color: rgba(150, 140, 128, 0.85);
}

/* ─── Center divider ─── */
.center-line {
  width: 1px;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    rgba(220, 205, 188, 0.18) 15%,
    rgba(220, 205, 188, 0.22) 50%,
    rgba(220, 205, 188, 0.18) 85%,
    transparent 100%
  );
  margin: 0 10px;
  position: relative;
  flex-shrink: 0;
}

.line-glow {
  position: absolute;
  inset: -4px -8px;
  background: radial-gradient(
    ellipse at center,
    rgba(240, 225, 205, 0.12) 0%,
    transparent 70%
  );
}

/* ─── Resistance side ─── */
.resist-side {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow-y: auto;
  padding-right: 2px;
  scrollbar-width: thin;
  scrollbar-color: rgba(200, 185, 170, 0.2) transparent;
}

.resist-side::-webkit-scrollbar {
  width: 2px;
}

.resist-side::-webkit-scrollbar-track {
  background: transparent;
}

.resist-side::-webkit-scrollbar-thumb {
  background: rgba(200, 185, 170, 0.2);
  border-radius: 1px;
}

.resist-item {
  padding: 8px 10px;
}

.resist-text {
  font-size: 11px;
  font-weight: 300;
  color: rgba(180, 170, 160, 0.5);
  letter-spacing: 0.02em;
  line-height: 1.7;
  font-style: italic;
  word-break: break-word;
}

.resist-input-area {
  margin-top: 4px;
}

.resist-input {
  width: 100%;
  padding: 10px 12px;
  background: rgba(255, 255, 255, 0.5);
  border: 1px solid rgba(210, 200, 190, 0.18);
  border-radius: 8px;
  font-size: 12px;
  font-weight: 300;
  color: #5A5248;
  letter-spacing: 0.02em;
  resize: none;
  outline: none;
  transition: border-color 500ms ease;
  box-sizing: border-box;
  font-family: inherit;
  line-height: 1.7;
}

.resist-input:focus {
  border-color: rgba(210, 200, 190, 0.35);
}

.resist-input::placeholder {
  color: rgba(200, 190, 180, 0.45);
  font-style: italic;
}

.resist-submit {
  display: block;
  width: 100%;
  margin-top: 6px;
  padding: 8px 12px;
  background: rgba(210, 200, 188, 0.15);
  border: 1px solid rgba(200, 190, 178, 0.18);
  border-radius: 9999px;
  font-size: 11px;
  font-weight: 300;
  letter-spacing: 0.12em;
  color: rgba(170, 160, 150, 0.65);
  cursor: pointer;
  transition: all 600ms ease;
}

.resist-submit:not(:disabled):hover {
  background: rgba(210, 200, 188, 0.3);
  color: rgba(140, 130, 120, 0.85);
}

.resist-submit:active {
  transform: scale(0.97);
}

.resist-submit:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

/* ─── Phase Pure ─── */
.phase-pure {
  justify-content: flex-start;
  padding-top: 20px;
}

.pure-stage {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 0;
}

.pure-affirmations {
  width: 100%;
  margin-bottom: 28px;
}

.pure-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.pure-text {
  font-size: 16px;
  font-weight: 400;
  letter-spacing: 0.05em;
  color: rgba(160, 145, 128, 0.0);
  line-height: 1.8;
  transition: color 1200ms cubic-bezier(0.4, 0, 0.2, 1);
  text-align: center;
}

.pure-text:nth-child(odd) {
  color: rgba(155, 140, 122, 0.0);
}

.pure-rise-enter-active {
  transition: opacity 1200ms cubic-bezier(0.4, 0, 0.2, 1), transform 1200ms cubic-bezier(0.4, 0, 0.2, 1);
}
.pure-rise-enter-from {
  opacity: 0;
  transform: translateY(12px);
}

.pure-closing {
  font-size: 13px;
  font-weight: 300;
  line-height: 2;
  color: rgba(170, 160, 148, 0.65);
  letter-spacing: 0.04em;
  margin-bottom: 28px;
}

.seal-btn {
  padding: 12px 32px;
  background: rgba(210, 200, 188, 0.2);
  border: 1px solid rgba(200, 190, 178, 0.22);
  border-radius: 9999px;
  font-size: 13px;
  font-weight: 300;
  letter-spacing: 0.15em;
  color: #8A7E72;
  cursor: pointer;
  transition: all 700ms cubic-bezier(0.4, 0, 0.2, 1);
}

.seal-btn:hover {
  background: rgba(210, 200, 188, 0.38);
  color: #5A5248;
}

.seal-btn:active {
  transform: scale(0.97);
}

/* ─── Transitions ─── */
.paper-fade-enter-active {
  transition: opacity 800ms cubic-bezier(0.4, 0, 0.2, 1), transform 800ms cubic-bezier(0.4, 0, 0.2, 1);
}
.paper-fade-leave-active {
  transition: opacity 500ms cubic-bezier(0.4, 0, 0.2, 1);
}
.paper-fade-enter-from {
  opacity: 0;
  transform: translateY(14px);
}
.paper-fade-leave-to {
  opacity: 0;
}
</style>
