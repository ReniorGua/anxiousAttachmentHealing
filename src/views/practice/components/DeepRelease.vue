<template>
  <div class="deep-release">

    <!-- ─── Mode Entry ─── -->
    <transition name="paper-fade" mode="out-in">
      <div v-if="view === 'entry'" key="entry" class="view view-entry">
        <p class="entry-title">深层释放台</p>
        <p class="entry-subtitle">选择一个你需要的练习</p>
        <div class="mode-cards">
          <button class="mode-card mode-a" @click="enterMode('protocol')">
            <span class="mode-icon">⛓</span>
            <span class="mode-name">信念解绑协议</span>
            <span class="mode-desc">解除那些限制我的个人律法</span>
          </button>
          <button class="mode-card mode-b" @click="enterMode('incinerator')">
            <span class="mode-icon">🔥</span>
            <span class="mode-name">树洞焚化炉</span>
            <span class="mode-desc">写下秘密，然后彻底销毁</span>
          </button>
        </div>
      </div>
    </transition>

    <!-- ════════════════════════════════════ -->
    <!-- MODE A: 信念解绑协议               -->
    <!-- ════════════════════════════════════ -->

    <!-- Step A1: Write belief -->
    <transition name="paper-fade" mode="out-in">
      <div v-if="view === 'protocol' && subPhase === 'writeBelief'" key="a1" class="view view-protocol-a1">
        <p class="guide-main">写下你的一条"个人律法"</p>
        <p class="guide-hint">例如：我不配成功、我必须讨好所有人</p>
        <div class="input-section">
          <input
            v-model="currentBelief"
            ref="beliefInputRef"
            class="belief-line-input"
            placeholder="把它写下来..."
            @keydown.enter.exact.prevent="submitBelief"
          />
          <button class="next-btn" :disabled="!currentBelief.trim()" @click="submitBelief">
            继续
          </button>
        </div>
        <button class="back-link" @click="view = 'entry'">返回</button>
      </div>
    </transition>

    <!-- Step A2: Write impact -->
    <transition name="paper-fade" mode="out-in">
      <div v-if="view === 'protocol' && subPhase === 'writeImpact'" key="a2" class="view view-protocol-a2">
        <p class="guide-main impact-guide">深呼吸。</p>
        <p class="guide-hint impact-hint">详细写下这个想法是如何影响你的生活、工作或人际关系的？</p>
        <div class="impact-textarea-wrap">
          <textarea
            v-model="currentImpact"
            ref="impactInputRef"
            class="impact-textarea"
            placeholder="它让我在...的时候，总是..."
            rows="6"
          />
        </div>
        <div class="action-row">
          <button class="loop-btn" @click="loopToNext">再审视一条</button>
          <button class="unbind-btn" :disabled="!currentImpact.trim()" @click="proceedToSign">我已经准备好解绑</button>
        </div>
        <button class="back-link" @click="subPhase = 'writeBelief'">返回上一步</button>
      </div>
    </transition>

    <!-- Step A3: Signing ceremony -->
    <transition name="paper-fade" mode="out-in">
      <div v-if="view === 'protocol' && subPhase === 'sign'" key="a3" class="view view-protocol-sign">
        <div class="declaration-stage" :class="{ 'is-signed': isSigned }">
          <p class="declaration-text">
            为了追求我选择的自由人生，<br/>
            我不再需要信奉这些负面想法。<br/>
            我放弃的负面想法越多，<br/>
            我对真实的自我承诺就越坚定。
          </p>
          <p class="sign-date">{{ formattedDate }}</p>
          <div class="signature-area" v-if="!isSigned">
            <input
              v-model="signatureName"
              class="signature-input"
              placeholder="请在这里签下你的名字"
              @keydown.enter.exact.prevent="executeSign"
            />
            <button class="sign-btn" :disabled="!signatureName.trim()" @click="executeSign">
              签署
            </button>
          </div>
          <div v-else class="signature-display">
            <p class="signed-name">{{ signatureName }}</p>
            <p class="sign-confirm">—— 已签署 ——</p>
          </div>
        </div>
        <div class="sign-footer" v-if="isSigned">
          <p class="sign-closing">阻抗已清空。新的自我，从此刻开始。</p>
          <button class="seal-btn" @click="handleComplete">封存并离开</button>
        </div>
        <button class="back-link" v-if="!isSigned" @click="subPhase = 'writeImpact'">返回</button>
      </div>
    </transition>

    <!-- ════════════════════════════════════ -->
    <!-- MODE B: 树洞焚化炉                  -->
    <!-- ════════════════════════════════════ -->

    <transition name="paper-fade" mode="out-in">
      <div v-if="view === 'incinerator'" key="b1" class="view view-incinerator">
        <p class="guide-main">我不想让别人知道的隐私</p>
        <p class="guide-hint incinerator-hint">
          写下你能想到的所有不愿被外界知晓的事。<br/>
          系统不会保存、不会上传，写完即毁。
        </p>
        <div class="incinerator-area">
          <textarea
            v-model="secretText"
            ref="secretInputRef"
            class="secret-textarea"
            :class="{ 'is-burning': isBurning }"
            placeholder="在这里写下所有..."
            rows="10"
            :disabled="isBurning || isBurnt"
          />
          <transition name="ash-fade">
            <p v-if="isBurnt" class="ash-message">风已经把它们带走了，这里什么都没有发生过。</p>
          </transition>
        </div>
        <button
          v-if="!isBurnt"
          class="burn-btn"
          :disabled="!secretText.trim() || isBurning"
          @click="startBurn"
        >
          将它们彻底焚毁
        </button>
        <button class="back-link" v-if="!isBurnt" @click="view = 'entry'">返回</button>
      </div>
    </transition>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted } from 'vue'

const emit = defineEmits<{
  complete: [{ completed: boolean }]
}>()

// ─── Views: 'entry' | 'protocol' | 'incinerator'
const view = ref<'entry' | 'protocol' | 'incinerator'>('entry')
// Protocol sub-phases
const subPhase = ref<'writeBelief' | 'writeImpact' | 'sign'>('writeBelief')
// Protocol state
const currentBelief = ref('')
const currentImpact = ref('')
const signatureName = ref('')
const isSigned = ref(false)
// Incinerator state
const secretText = ref('')
const isBurning = ref(false)
const isBurnt = ref(false)

// Refs
const beliefInputRef = ref<HTMLInputElement | null>(null)
const impactInputRef = ref<HTMLTextAreaElement | null>(null)
const secretInputRef = ref<HTMLTextAreaElement | null>(null)

const formattedDate = computed(() => {
  const d = new Date()
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`
})

const focusBelief = () => {
  nextTick(() => beliefInputRef.value?.focus())
}
const focusImpact = () => {
  nextTick(() => impactInputRef.value?.focus())
}
const focusSecret = () => {
  nextTick(() => secretInputRef.value?.focus())
}

const enterMode = (mode: 'protocol' | 'incinerator') => {
  view.value = mode
  if (mode === 'protocol') {
    subPhase.value = 'writeBelief'
    currentBelief.value = ''
    currentImpact.value = ''
    isSigned.value = false
    signatureName.value = ''
    nextTick(() => focusBelief())
  } else {
    secretText.value = ''
    isBurning.value = false
    isBurnt.value = false
    nextTick(() => focusSecret())
  }
}

const submitBelief = () => {
  if (!currentBelief.value.trim()) return
  subPhase.value = 'writeImpact'
  currentImpact.value = ''
  nextTick(() => focusImpact())
}

const loopToNext = () => {
  currentBelief.value = ''
  currentImpact.value = ''
  subPhase.value = 'writeBelief'
  nextTick(() => focusBelief())
}

const proceedToSign = () => {
  if (!currentImpact.value.trim()) return
  subPhase.value = 'sign'
  isSigned.value = false
  signatureName.value = ''
}

const executeSign = () => {
  if (!signatureName.value.trim()) return
  isSigned.value = true
}

const startBurn = () => {
  if (!secretText.value.trim() || isBurning.value) return
  isBurning.value = true
  // After burn animation completes
  setTimeout(() => {
    secretText.value = ''
    isBurning.value = false
    isBurnt.value = true
  }, 2000)
}

const handleComplete = () => {
  emit('complete', { completed: true })
}
</script>

<style scoped>
.deep-release {
  padding: 28px 28px 36px;
  background: linear-gradient(160deg, rgba(248, 244, 238, 0.98), rgba(243, 239, 233, 0.98));
  border-radius: 20px;
  max-width: 560px;
  margin: 0 auto;
  min-height: 540px;
  display: flex;
  flex-direction: column;
}

/* ─── Shared ─── */
.view {
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* ─── Entry ─── */
.view-entry {
  justify-content: center;
  align-items: center;
  text-align: center;
  gap: 0;
}

.entry-title {
  font-size: 18px;
  font-weight: 300;
  letter-spacing: 0.18em;
  color: rgba(150, 140, 128, 0.7);
  margin-bottom: 8px;
}

.entry-subtitle {
  font-size: 12px;
  font-weight: 300;
  letter-spacing: 0.1em;
  color: rgba(180, 170, 158, 0.5);
  margin-bottom: 36px;
}

.mode-cards {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  max-width: 320px;
}

.mode-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 24px 20px;
  border-radius: 16px;
  border: 1px solid;
  cursor: pointer;
  transition: all 800ms cubic-bezier(0.4, 0, 0.2, 1);
  background: none;
}

.mode-a {
  border-color: rgba(210, 200, 188, 0.25);
  color: rgba(150, 140, 128, 0.8);
}

.mode-a:hover {
  background: rgba(240, 230, 218, 0.4);
  border-color: rgba(200, 190, 175, 0.4);
}

.mode-b {
  border-color: rgba(210, 200, 188, 0.2);
  color: rgba(160, 150, 138, 0.7);
}

.mode-b:hover {
  background: rgba(235, 225, 215, 0.35);
  border-color: rgba(200, 190, 175, 0.35);
}

.mode-icon {
  font-size: 24px;
  opacity: 0.7;
}

.mode-name {
  font-size: 14px;
  font-weight: 400;
  letter-spacing: 0.12em;
}

.mode-desc {
  font-size: 11px;
  font-weight: 300;
  letter-spacing: 0.06em;
  opacity: 0.65;
}

/* ─── Protocol A1: Belief input ─── */
.view-protocol-a1 {
  justify-content: flex-start;
  padding-top: 20px;
}

.guide-main {
  font-size: 15px;
  font-weight: 300;
  color: rgba(140, 130, 118, 0.85);
  letter-spacing: 0.04em;
  text-align: center;
  margin-bottom: 8px;
  line-height: 1.9;
}

.guide-hint {
  font-size: 12px;
  font-weight: 300;
  color: rgba(180, 170, 158, 0.5);
  letter-spacing: 0.04em;
  text-align: center;
  margin-bottom: 28px;
}

.input-section {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.belief-line-input {
  width: 100%;
  padding: 14px 18px;
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(210, 200, 190, 0.2);
  border-radius: 10px;
  font-size: 14px;
  font-weight: 300;
  color: #5A5248;
  letter-spacing: 0.03em;
  outline: none;
  transition: border-color 600ms ease;
  box-sizing: border-box;
  font-family: inherit;
  text-align: center;
}

.belief-line-input:focus {
  border-color: rgba(200, 190, 178, 0.4);
}

.belief-line-input::placeholder {
  color: rgba(200, 190, 180, 0.45);
}

.next-btn {
  padding: 13px 24px;
  background: rgba(210, 200, 188, 0.25);
  border: 1px solid rgba(200, 190, 178, 0.25);
  border-radius: 9999px;
  font-size: 13px;
  font-weight: 300;
  letter-spacing: 0.15em;
  color: #8A7E72;
  cursor: pointer;
  transition: all 700ms ease;
}

.next-btn:not(:disabled):hover {
  background: rgba(210, 200, 188, 0.4);
  color: #5A5248;
}

.next-btn:active { transform: scale(0.97); }
.next-btn:disabled { opacity: 0.3; cursor: not-allowed; }

.back-link {
  margin-top: 24px;
  align-self: center;
  background: none;
  border: none;
  font-size: 11px;
  font-weight: 300;
  letter-spacing: 0.1em;
  color: rgba(180, 170, 158, 0.45);
  cursor: pointer;
  transition: color 500ms ease;
  padding: 4px 8px;
}

.back-link:hover {
  color: rgba(160, 150, 138, 0.65);
}

/* ─── Protocol A2: Impact ─── */
.view-protocol-a2 {
  justify-content: flex-start;
  padding-top: 12px;
}

.impact-guide {
  margin-bottom: 4px;
}

.impact-hint {
  margin-bottom: 20px;
}

.impact-textarea-wrap {
  width: 100%;
  margin-bottom: 16px;
}

.impact-textarea {
  width: 100%;
  padding: 16px 18px;
  background: rgba(255, 255, 255, 0.55);
  border: 1px solid rgba(210, 200, 190, 0.2);
  border-radius: 12px;
  font-size: 14px;
  font-weight: 300;
  line-height: 2;
  color: #5A5248;
  letter-spacing: 0.02em;
  resize: none;
  outline: none;
  transition: border-color 600ms ease;
  box-sizing: border-box;
  font-family: inherit;
}

.impact-textarea:focus {
  border-color: rgba(200, 190, 178, 0.38);
}

.impact-textarea::placeholder {
  color: rgba(200, 190, 180, 0.45);
}

.action-row {
  display: flex;
  gap: 10px;
  width: 100%;
}

.loop-btn {
  flex: 1;
  padding: 13px 12px;
  background: rgba(255, 255, 255, 0.4);
  border: 1px solid rgba(210, 200, 190, 0.2);
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 300;
  letter-spacing: 0.12em;
  color: rgba(160, 150, 138, 0.7);
  cursor: pointer;
  transition: all 600ms ease;
}

.loop-btn:hover {
  background: rgba(255, 255, 255, 0.6);
  color: rgba(140, 130, 118, 0.85);
}

.loop-btn:active { transform: scale(0.97); }

.unbind-btn {
  flex: 1.4;
  padding: 13px 12px;
  background: rgba(210, 195, 178, 0.3);
  border: 1px solid rgba(200, 185, 168, 0.28);
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 300;
  letter-spacing: 0.12em;
  color: rgba(140, 130, 118, 0.85);
  cursor: pointer;
  transition: all 700ms ease;
}

.unbind-btn:not(:disabled):hover {
  background: rgba(210, 195, 178, 0.5);
  color: rgba(120, 110, 98, 0.95);
}

.unbind-btn:active { transform: scale(0.97); }
.unbind-btn:disabled { opacity: 0.3; cursor: not-allowed; }

/* ─── Protocol A3: Signing ceremony ─── */
.view-protocol-sign {
  justify-content: center;
  align-items: center;
  text-align: center;
}

.declaration-stage {
  width: 100%;
  padding: 32px 24px;
  transition: all 1000ms ease;
}

.declaration-text {
  font-size: 14px;
  font-weight: 300;
  line-height: 2.4;
  color: rgba(150, 140, 128, 0.75);
  letter-spacing: 0.04em;
  margin-bottom: 24px;
  transition: all 1000ms cubic-bezier(0.4, 0, 0.2, 1);
}

.declaration-stage.is-signed .declaration-text {
  color: rgba(160, 148, 132, 0.55);
}

.sign-date {
  font-size: 12px;
  font-weight: 300;
  letter-spacing: 0.1em;
  color: rgba(190, 180, 168, 0.45);
  margin-bottom: 20px;
}

.signature-area {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  max-width: 260px;
  margin: 0 auto;
}

.signature-input {
  width: 100%;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(210, 200, 190, 0.25);
  border-radius: 8px;
  font-size: 14px;
  font-weight: 300;
  color: #5A5248;
  letter-spacing: 0.08em;
  outline: none;
  text-align: center;
  transition: border-color 600ms ease;
  box-sizing: border-box;
  font-family: inherit;
}

.signature-input:focus {
  border-color: rgba(200, 188, 172, 0.45);
}

.signature-input::placeholder {
  color: rgba(200, 190, 180, 0.45);
  font-size: 12px;
}

.sign-btn {
  padding: 12px 24px;
  background: rgba(200, 185, 168, 0.28);
  border: 1px solid rgba(190, 175, 158, 0.28);
  border-radius: 9999px;
  font-size: 13px;
  font-weight: 300;
  letter-spacing: 0.15em;
  color: rgba(140, 130, 118, 0.85);
  cursor: pointer;
  transition: all 700ms ease;
}

.sign-btn:not(:disabled):hover {
  background: rgba(200, 185, 168, 0.48);
  color: rgba(120, 110, 98, 0.95);
}

.sign-btn:active { transform: scale(0.97); }
.sign-btn:disabled { opacity: 0.3; cursor: not-allowed; }

.signature-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  animation: signGlow 1800ms cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

.signed-name {
  font-family: 'Georgia', 'Times New Roman', serif;
  font-size: 22px;
  font-weight: 400;
  letter-spacing: 0.12em;
  color: rgba(140, 128, 112, 0.85);
  font-style: italic;
}

.sign-confirm {
  font-size: 11px;
  font-weight: 300;
  letter-spacing: 0.2em;
  color: rgba(190, 180, 168, 0.45);
}

@keyframes signGlow {
  0% {
    opacity: 0;
    transform: translateY(8px);
    filter: brightness(1.0);
  }
  40% {
    opacity: 1;
    transform: translateY(0);
    filter: brightness(1.4) drop-shadow(0 0 12px rgba(240, 225, 200, 0.5));
  }
  100% {
    opacity: 1;
    transform: translateY(0);
    filter: brightness(1.0) drop-shadow(0 0 4px rgba(240, 225, 200, 0.15));
  }
}

.sign-footer {
  margin-top: 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.sign-closing {
  font-size: 12px;
  font-weight: 300;
  color: rgba(170, 160, 148, 0.55);
  letter-spacing: 0.06em;
  line-height: 1.8;
}

.seal-btn {
  padding: 13px 36px;
  background: rgba(200, 185, 168, 0.25);
  border: 1px solid rgba(190, 175, 158, 0.25);
  border-radius: 9999px;
  font-size: 13px;
  font-weight: 300;
  letter-spacing: 0.15em;
  color: rgba(140, 130, 118, 0.85);
  cursor: pointer;
  transition: all 700ms ease;
}

.seal-btn:hover {
  background: rgba(200, 185, 168, 0.42);
  color: rgba(120, 110, 98, 0.95);
}

.seal-btn:active { transform: scale(0.97); }

/* ─── Incinerator ─── */
.view-incinerator {
  justify-content: flex-start;
  padding-top: 12px;
}

.incinerator-hint {
  line-height: 2;
  margin-bottom: 20px;
}

.incinerator-area {
  width: 100%;
  margin-bottom: 16px;
  position: relative;
}

.secret-textarea {
  width: 100%;
  min-height: 300px;
  padding: 18px 20px;
  background: rgba(50, 40, 32, 0.04);
  border: 1px solid rgba(180, 165, 148, 0.12);
  border-radius: 14px;
  font-size: 14px;
  font-weight: 300;
  line-height: 2.2;
  color: rgba(100, 90, 78, 0.8);
  letter-spacing: 0.02em;
  resize: none;
  outline: none;
  transition: filter 1800ms cubic-bezier(0.4, 0, 0.2, 1),
              opacity 1800ms cubic-bezier(0.4, 0, 0.2, 1),
              transform 1800ms cubic-bezier(0.4, 0, 0.2, 1);
  box-sizing: border-box;
  font-family: inherit;
}

.secret-textarea.is-burning {
  filter: blur(6px) grayscale(0.6);
  opacity: 0;
  transform: translateY(-20px);
  pointer-events: none;
}

.secret-textarea::placeholder {
  color: rgba(180, 165, 148, 0.4);
  font-style: italic;
}

.ash-message {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
  font-size: 13px;
  font-weight: 300;
  color: rgba(170, 160, 148, 0.55);
  letter-spacing: 0.06em;
  padding: 12px 16px;
  background: rgba(248, 244, 238, 0.85);
  border-radius: 8px;
}

.burn-btn {
  padding: 14px 32px;
  background: linear-gradient(135deg, rgba(200, 120, 80, 0.18), rgba(180, 100, 70, 0.14));
  border: 1px solid rgba(200, 140, 100, 0.22);
  border-radius: 9999px;
  font-size: 13px;
  font-weight: 300;
  letter-spacing: 0.15em;
  color: rgba(160, 100, 70, 0.8);
  cursor: pointer;
  transition: all 700ms ease;
}

.burn-btn:not(:disabled):hover {
  background: linear-gradient(135deg, rgba(210, 130, 90, 0.32), rgba(190, 110, 80, 0.26));
  color: rgba(150, 90, 60, 0.95);
}

.burn-btn:active { transform: scale(0.97); }
.burn-btn:disabled { opacity: 0.3; cursor: not-allowed; }

/* ─── Transitions ─── */
.paper-fade-enter-active {
  transition: opacity 900ms cubic-bezier(0.4, 0, 0.2, 1), transform 900ms cubic-bezier(0.4, 0, 0.2, 1);
}
.paper-fade-leave-active {
  transition: opacity 600ms cubic-bezier(0.4, 0, 0.2, 1);
}
.paper-fade-enter-from {
  opacity: 0;
  transform: translateY(16px);
}
.paper-fade-leave-to {
  opacity: 0;
}

.ash-fade-enter-active {
  transition: opacity 1000ms cubic-bezier(0.4, 0, 0.2, 1) 200ms,
              transform 1000ms cubic-bezier(0.4, 0, 0.2, 1) 200ms;
}
.ash-fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
</style>
