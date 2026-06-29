<template>
  <div class="future-vision">

    <!-- ─── Step 0: Preparation ─── -->
    <transition name="paper-fade" mode="out-in">
      <div v-if="step === 0" key="step-0" class="step step-0">
        <p class="prepare-text">
          在这个练习中，请写下你能想到的、<br/>
          最高但能实现的目标。<br/>
          你要想，这些是你真的渴望追求的，<br/>
          但绝不是达不到就彻底完蛋的压力。
        </p>
        <p class="prepare-breathe">深呼吸，准备好了我们就开始。</p>
        <button class="begin-btn" @click="step = 1">开始书写</button>
      </div>
    </transition>

    <!-- ─── Step 1: Five Years ─── -->
    <transition name="paper-fade" mode="out-in">
      <div v-if="step === 1" key="step-1" class="step step-writing">
        <p class="step-label">第一步 · 五年愿景</p>
        <p class="step-title">未来五年内，我想完成的五件事</p>
        <div class="goal-rows">
          <div
            v-for="(item, i) in fiveYears"
            :key="'fy-' + i"
            class="goal-row"
          >
            <span class="row-num">{{ i + 1 }}</span>
            <input
              v-model="fiveYears[i]"
              class="goal-line"
              :placeholder="'五年后，我想……'"
              @keydown.enter.exact.prevent="focusNext('fiveYears', i)"
            />
          </div>
        </div>
        <button class="step-btn" @click="step = 2">
          沉淀下来，走向明年
        </button>
      </div>
    </transition>

    <!-- ─── Step 2: One Year ─── -->
    <transition name="paper-fade" mode="out-in">
      <div v-if="step === 2" key="step-2" class="step step-writing">
        <p class="step-label">第二步 · 一年愿景</p>
        <p class="step-title">明年，我要完成的五件事</p>
        <div class="goal-rows">
          <div
            v-for="(item, i) in oneYear"
            :key="'oy-' + i"
            class="goal-row"
          >
            <span class="row-num">{{ i + 1 }}</span>
            <input
              v-model="oneYear[i]"
              class="goal-line"
              :placeholder="'明年，我想要……'"
              @keydown.enter.exact.prevent="focusNext('oneYear', i)"
            />
          </div>
        </div>
        <button class="step-btn" @click="step = 3">
          聚焦当下，走向这个月
        </button>
      </div>
    </transition>

    <!-- ─── Step 3: Thirty Days ─── -->
    <transition name="paper-fade" mode="out-in">
      <div v-if="step === 3" key="step-3" class="step step-writing">
        <p class="step-label">第三步 · 三十天愿景</p>
        <p class="step-title">未来三十天内，我想要完成的五件事</p>
        <div class="goal-rows">
          <div
            v-for="(item, i) in thirtyDays"
            :key="'td-' + i"
            class="goal-row"
          >
            <span class="row-num">{{ i + 1 }}</span>
            <input
              v-model="thirtyDays[i]"
              class="goal-line"
              :placeholder="'这个月，我想尝试……'"
              @keydown.enter.exact.prevent="focusNext('thirtyDays', i)"
            />
          </div>
        </div>
        <button class="step-btn" @click="step = 4">
          审视我的全部愿景
        </button>
      </div>
    </transition>

    <!-- ─── Step 4: Oath & Signature ─── -->
    <transition name="paper-fade" mode="out-in">
      <div v-if="step === 4" key="step-4" class="step step-oath" :class="{ 'is-signed': isSigned }">
        <!-- Goals showcase -->
        <div class="vision-showcase">
          <div class="vision-col">
            <p class="col-label">五年</p>
            <div
              v-for="(g, i) in fiveYears.filter(g => g.trim())"
              :key="'ov-fy-' + i"
              class="showcase-item"
            >
              <p class="showcase-text">{{ g }}</p>
            </div>
          </div>
          <div class="vision-col">
            <p class="col-label">一年</p>
            <div
              v-for="(g, i) in oneYear.filter(g => g.trim())"
              :key="'ov-oy-' + i"
              class="showcase-item"
            >
              <p class="showcase-text">{{ g }}</p>
            </div>
          </div>
          <div class="vision-col">
            <p class="col-label">三十天</p>
            <div
              v-for="(g, i) in thirtyDays.filter(g => g.trim())"
              :key="'ov-td-' + i"
              class="showcase-item"
            >
              <p class="showcase-text">{{ g }}</p>
            </div>
          </div>
        </div>

        <!-- Oath -->
        <div class="oath-section">
          <p class="oath-text">
            我非常乐意实现或超越所有这些目标。
          </p>
          <p class="oath-date">{{ formattedDate }}</p>

          <div class="signature-zone" v-if="!isSigned">
            <input
              v-model="signature"
              class="oath-signature"
              placeholder="请在这里签下你的名字，完成对未来的承诺"
              @keydown.enter.exact.prevent="executeSign"
            />
            <button
              class="sign-confirm-btn"
              :disabled="!signature.trim()"
              @click="executeSign"
            >
              确认签署
            </button>
          </div>

          <div v-else class="signature-finished">
            <p class="signed-display">{{ signature }}</p>
            <p class="signed-annotation">—— 已签署 ——</p>
          </div>
        </div>

        <button v-if="isSigned" class="close-btn" @click="handleComplete">
          合上这本愿景，带着力量离开
        </button>
      </div>
    </transition>

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const emit = defineEmits<{
  complete: [{ completed: boolean }]
}>()

const step = ref(0)
const fiveYears = ref(['', '', '', '', ''])
const oneYear = ref(['', '', '', '', ''])
const thirtyDays = ref(['', '', '', '', ''])
const signature = ref('')
const isSigned = ref(false)

const formattedDate = computed(() => {
  const d = new Date()
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`
})

// Focus next input in an array
const focusNext = (array: 'fiveYears' | 'oneYear' | 'thirtyDays', index: number) => {
  const target = array === 'fiveYears' ? fiveYears
    : array === 'oneYear' ? oneYear
    : thirtyDays
  if (index < 4) {
    const inputs = document.querySelectorAll<HTMLInputElement>('.goal-row .goal-line')
    const offset = array === 'fiveYears' ? 0 : array === 'oneYear' ? 5 : 10
    inputs[offset + index + 1]?.focus()
  }
}

const executeSign = () => {
  if (!signature.value.trim()) return
  isSigned.value = true
}

const handleComplete = () => {
  emit('complete', { completed: true })
}
</script>

<style scoped>
.future-vision {
  padding: 28px 28px 36px;
  background: linear-gradient(165deg, rgba(252, 250, 246, 0.98), rgba(248, 245, 240, 0.98));
  border-radius: 20px;
  max-width: 560px;
  margin: 0 auto;
  min-height: 540px;
  display: flex;
  flex-direction: column;
}

/* ─── Shared ─── */
.step {
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* ─── Step 0: Preparation ─── */
.step-0 {
  justify-content: center;
  align-items: center;
  text-align: center;
}

.prepare-text {
  font-size: 14px;
  font-weight: 300;
  line-height: 2.4;
  color: rgba(145, 135, 122, 0.8);
  letter-spacing: 0.04em;
  margin-bottom: 16px;
}

.prepare-breathe {
  font-size: 12px;
  font-weight: 300;
  color: rgba(175, 165, 152, 0.55);
  letter-spacing: 0.1em;
  margin-bottom: 36px;
}

.begin-btn {
  padding: 14px 40px;
  background: rgba(210, 200, 188, 0.25);
  border: 1px solid rgba(200, 190, 178, 0.25);
  border-radius: 9999px;
  font-size: 13px;
  font-weight: 300;
  letter-spacing: 0.2em;
  color: rgba(140, 130, 118, 0.85);
  cursor: pointer;
  transition: all 800ms cubic-bezier(0.4, 0, 0.2, 1);
}

.begin-btn:hover {
  background: rgba(210, 200, 188, 0.42);
  color: rgba(120, 110, 98, 0.95);
}

.begin-btn:active {
  transform: scale(0.97);
}

/* ─── Writing steps ─── */
.step-writing {
  justify-content: flex-start;
  padding-top: 8px;
}

.step-label {
  font-size: 11px;
  font-weight: 300;
  letter-spacing: 0.18em;
  color: rgba(200, 188, 175, 0.5);
  margin-bottom: 6px;
  text-align: center;
}

.step-title {
  font-size: 15px;
  font-weight: 300;
  letter-spacing: 0.05em;
  color: rgba(145, 135, 122, 0.8);
  text-align: center;
  margin-bottom: 24px;
}

/* ─── Goal rows ─── */
.goal-rows {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-bottom: 20px;
}

.goal-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.row-num {
  font-size: 11px;
  font-weight: 300;
  color: rgba(200, 188, 175, 0.4);
  letter-spacing: 0.05em;
  flex-shrink: 0;
  width: 14px;
  text-align: right;
}

.goal-line {
  flex: 1;
  background: transparent;
  border: none;
  border-bottom: 1px solid rgba(210, 198, 185, 0.3);
  padding: 6px 4px 8px;
  font-size: 14px;
  font-weight: 300;
  color: rgba(120, 110, 98, 0.85);
  letter-spacing: 0.03em;
  outline: none;
  transition: border-color 600ms ease;
  box-sizing: border-box;
  font-family: inherit;
}

.goal-line:focus {
  border-bottom-color: rgba(200, 185, 168, 0.55);
}

.goal-line::placeholder {
  color: rgba(200, 188, 175, 0.4);
  font-size: 13px;
  font-weight: 300;
}

.step-btn {
  padding: 13px 24px;
  background: rgba(210, 198, 185, 0.2);
  border: 1px solid rgba(200, 188, 175, 0.22);
  border-radius: 9999px;
  font-size: 13px;
  font-weight: 300;
  letter-spacing: 0.15em;
  color: rgba(145, 135, 122, 0.8);
  cursor: pointer;
  transition: all 700ms ease;
  align-self: flex-end;
}

.step-btn:hover {
  background: rgba(210, 198, 185, 0.38);
  color: rgba(120, 110, 98, 0.95);
}

.step-btn:active {
  transform: scale(0.97);
}

/* ─── Step 4: Oath ─── */
.step-oath {
  justify-content: space-between;
  padding-top: 4px;
}

/* Vision showcase - three columns */
.vision-showcase {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 16px 12px;
  margin-bottom: 24px;
  align-items: start;
}

.vision-col {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.col-label {
  font-size: 10px;
  font-weight: 300;
  letter-spacing: 0.2em;
  color: rgba(200, 188, 175, 0.45);
  text-align: center;
  margin-bottom: 2px;
}

.showcase-item {
  padding: 8px 8px 10px;
  background: rgba(255, 255, 255, 0.45);
  border-radius: 8px;
  border: 1px solid rgba(220, 205, 190, 0.15);
}

.showcase-text {
  font-size: 11px;
  font-weight: 300;
  line-height: 1.7;
  color: rgba(140, 130, 118, 0.75);
  letter-spacing: 0.02em;
  word-break: break-word;
}

/* Oath section */
.oath-section {
  text-align: center;
  padding: 20px 16px;
  background: linear-gradient(135deg, rgba(248, 240, 232, 0.6), rgba(243, 235, 226, 0.4));
  border-radius: 14px;
  border: 1px solid rgba(220, 205, 188, 0.18);
  margin-bottom: 16px;
}

.oath-text {
  font-size: 14px;
  font-weight: 400;
  line-height: 2;
  color: rgba(140, 128, 112, 0.8);
  letter-spacing: 0.04em;
  margin-bottom: 10px;
}

.oath-date {
  font-size: 11px;
  font-weight: 300;
  letter-spacing: 0.12em;
  color: rgba(190, 178, 165, 0.5);
  margin-bottom: 18px;
}

/* Signature zone */
.signature-zone {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
}

.oath-signature {
  width: 100%;
  max-width: 260px;
  padding: 11px 16px;
  background: rgba(255, 255, 255, 0.65);
  border: 1px solid rgba(210, 195, 178, 0.3);
  border-radius: 8px;
  font-size: 13px;
  font-weight: 300;
  letter-spacing: 0.1em;
  color: rgba(130, 118, 102, 0.85);
  outline: none;
  text-align: center;
  transition: border-color 600ms ease, box-shadow 600ms ease;
  box-sizing: border-box;
  font-family: inherit;
}

.oath-signature:focus {
  border-color: rgba(200, 182, 162, 0.55);
  box-shadow: 0 0 0 3px rgba(240, 225, 205, 0.2);
}

.oath-signature::placeholder {
  color: rgba(200, 188, 175, 0.45);
  font-size: 11px;
  letter-spacing: 0.06em;
}

.sign-confirm-btn {
  padding: 11px 28px;
  background: rgba(205, 190, 175, 0.28);
  border: 1px solid rgba(195, 180, 165, 0.28);
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 300;
  letter-spacing: 0.15em;
  color: rgba(140, 128, 112, 0.8);
  cursor: pointer;
  transition: all 700ms ease;
}

.sign-confirm-btn:not(:disabled):hover {
  background: rgba(205, 190, 175, 0.45);
  color: rgba(120, 108, 92, 0.95);
}

.sign-confirm-btn:active {
  transform: scale(0.97);
}

.sign-confirm-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

/* Signed state */
.signature-finished {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  animation: signReveal 1500ms cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

.signed-display {
  font-family: 'Georgia', 'Times New Roman', serif;
  font-size: 20px;
  font-weight: 400;
  letter-spacing: 0.14em;
  color: rgba(135, 120, 105, 0.85);
  font-style: italic;
}

.signed-annotation {
  font-size: 11px;
  font-weight: 300;
  letter-spacing: 0.2em;
  color: rgba(190, 178, 165, 0.45);
}

@keyframes signReveal {
  0% {
    opacity: 0;
    transform: translateY(8px);
    filter: brightness(1.0);
  }
  35% {
    opacity: 1;
    transform: translateY(0);
    filter: brightness(1.35) drop-shadow(0 0 14px rgba(240, 218, 192, 0.55));
  }
  100% {
    opacity: 1;
    transform: translateY(0);
    filter: brightness(1.0) drop-shadow(0 0 4px rgba(240, 218, 192, 0.15));
  }
}

/* Signed ambient glow on whole step */
.step-oath.is-signed {
  background: radial-gradient(ellipse at center bottom, rgba(248, 235, 218, 0.35) 0%, transparent 65%);
}

.close-btn {
  padding: 13px 28px;
  background: rgba(205, 190, 175, 0.22);
  border: 1px solid rgba(195, 180, 165, 0.24);
  border-radius: 9999px;
  font-size: 13px;
  font-weight: 300;
  letter-spacing: 0.15em;
  color: rgba(140, 128, 112, 0.8);
  cursor: pointer;
  transition: all 700ms ease;
  align-self: center;
}

.close-btn:hover {
  background: rgba(205, 190, 175, 0.4);
  color: rgba(120, 108, 92, 0.95);
}

.close-btn:active {
  transform: scale(0.97);
}

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
</style>
