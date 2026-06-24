<template>
  <div class="practice-space">

    <!-- Return -->
    <router-link to="/" class="return-btn" title="返回首页">
      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 19l-7-7 7-7"/>
      </svg>
    </router-link>

    <!-- Top Nav -->
    <div class="top-nav">
      <router-link to="/chat" class="nav-icon-btn" title="倾诉树洞">
        <span class="text-sm">💬</span>
      </router-link>
      <router-link to="/chat/memory" class="nav-icon-btn" title="成长年轮">
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3m6-2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      </router-link>
    </div>

    <!-- ─── Hero / Triage Section ─── -->
    <div class="hero-section">
      <p class="hero-greeting">
        在这里停下来，照顾自己。<br/>
        此刻，是什么困住了你？
      </p>

      <!-- Filter Tags -->
      <div class="filter-tags">
        <button
          v-for="tag in filterTags"
          :key="tag.id"
          class="filter-tag"
          :class="{ 'is-active': activeTag === tag.id }"
          @click="setTag(tag.id)"
        >
          {{ tag.label }}
        </button>
      </div>
    </div>

    <!-- ─── Cards Grid ─── -->
    <div class="practice-grid">
      <transition-group name="card-fade" tag="div" class="cards-inner">
        <div
          v-for="card in filteredCards"
          :key="card.id"
          class="practice-card"
          :class="[card.sceneWeight, { 'card-exiting': exitingIds.has(card.id) }]"
          :style="card.cardStyle"
          @click="openPractice(card)"
        >
          <!-- Card header bar (deep cards only) -->
          <div v-if="card.sceneWeight === 'deep'" class="card-spine"></div>

          <div class="card-body">
            <div class="card-icon">{{ card.icon }}</div>
            <h3 class="card-title">{{ card.title }}</h3>
            <p class="card-subtitle">{{ card.sceneSubtitle }}</p>
            <p class="card-description">{{ card.description }}</p>
          </div>

          <!-- Weight indicator dots -->
          <div class="card-footer">
            <div class="weight-dots">
              <span
                v-for="n in card.sceneWeightDot"
                :key="n"
                class="weight-dot"
              ></span>
            </div>
          </div>
        </div>
      </transition-group>
    </div>

    <!-- Modal Overlay -->
    <transition name="modal-fade">
      <div v-if="activePractice" class="modal-overlay" @click.self="handleOverlayClick">
        <div class="modal-container">
          <button class="modal-close" @click="closePractice">
            <span>×</span>
          </button>
          <component
            :is="activePractice.component"
            v-bind="getComponentProps(activePractice.id)"
            @complete="handleComplete"
          />
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import BreathingGuide from '@/views/ai/components/BreathingGuide.vue'
import GroundingFiveSenses from '@/views/ai/GroundingFiveSenses.vue'
import SomaticRadar from '@/views/ai/components/SomaticRadar.vue'
import InnerChild from '@/views/ai/components/InnerChild.vue'
import EnergyRetraction from '@/views/ai/components/EnergyRetraction.vue'
import AffirmationEcho from './components/AffirmationEcho.vue'
import WaitingTimer from '@/views/ai/WaitingTimer.vue'
import ThirtyDaysAffirmation from './components/ThirtyDaysAffirmation.vue'
import FearRelease from './components/FearRelease.vue'
import PersonalLaw from './components/PersonalLaw.vue'
import BirthMemory from './components/BirthMemory.vue'
import ResistanceExhaustion from './components/ResistanceExhaustion.vue'
import DeepRelease from './components/DeepRelease.vue'
import FutureVision from './components/FutureVision.vue'
import { useUserMemoryStore } from '@/stores/userMemory'

interface FilterTag {
  id: string
  label: string
}

interface PracticeCard {
  id: string
  title: string
  description: string
  sceneSubtitle: string
  icon: string
  tags: string[]
  sceneWeight: 'light' | 'deep'
  sceneWeightDot: number
  cardStyle: Record<string, string>
  component: any
}

// ─── Filter Tags ───
const filterTags: FilterTag[] = [
  { id: 'all',     label: '全部' },
  { id: 'panic',   label: '🌪️ 恐慌与焦躁' },
  { id: 'chaos',   label: '🥀 疲惫与内耗' },
  { id: 'rumination', label: '🧠 脑子很乱' },
  { id: 'deep',    label: '🌱 深度重塑' },
]

const activeTag = ref('all')
const exitingIds = ref(new Set<string>())

const setTag = (tagId: string) => {
  activeTag.value = tagId
}

// ─── Cards Data ───
const practiceCards: PracticeCard[] = [
  // ── 🌪️ 恐慌与焦躁 ──
  {
    id: 'grounding',
    title: '五感着陆',
    description: '通过感官回归当下，感受此刻的安全',
    sceneSubtitle: '适合：思绪乱飞、焦虑蔓延时',
    icon: '🌍',
    tags: ['panic'],
    sceneWeight: 'light',
    sceneWeightDot: 1,
    cardStyle: {
      background: 'linear-gradient(150deg, rgba(218,232,228,0.22), rgba(210,225,220,0.1))',
      borderColor: 'rgba(180,205,198,0.22)'
    },
    component: GroundingFiveSenses
  },
  {
    id: 'breathing',
    title: '4-7-8 呼吸急救',
    description: '当焦虑来袭，用呼吸找回平静',
    sceneSubtitle: '适合：心悸、胸闷、快要失控时',
    icon: '🌊',
    tags: ['panic'],
    sceneWeight: 'light',
    sceneWeightDot: 1,
    cardStyle: {
      background: 'linear-gradient(150deg, rgba(200,225,230,0.2), rgba(195,220,228,0.09))',
      borderColor: 'rgba(175,205,215,0.2)'
    },
    component: BreathingGuide
  },
  {
    id: 'somatic',
    title: '躯体雷达',
    description: '扫描身体的信号，读懂情绪的语言',
    sceneSubtitle: '适合：身体说不清哪里不对劲时',
    icon: '🔍',
    tags: ['panic'],
    sceneWeight: 'light',
    sceneWeightDot: 1,
    cardStyle: {
      background: 'linear-gradient(150deg, rgba(210,225,218,0.18), rgba(205,220,212,0.08))',
      borderColor: 'rgba(185,205,195,0.2)'
    },
    component: SomaticRadar
  },
  {
    id: 'waiting',
    title: '等待计时器',
    description: '给自己20分钟，安静地等待',
    sceneSubtitle: '适合：等待消息、坐立不安时',
    icon: '⏰',
    tags: ['panic'],
    sceneWeight: 'light',
    sceneWeightDot: 1,
    cardStyle: {
      background: 'linear-gradient(150deg, rgba(220,215,208,0.18), rgba(215,210,203,0.08))',
      borderColor: 'rgba(205,200,190,0.18)'
    },
    component: WaitingTimer
  },
  {
    id: 'energy',
    title: '能量回收',
    description: '把向外耗散的精力慢慢收回',
    sceneSubtitle: '适合：被别人占满、能量透支时',
    icon: '🐙',
    tags: ['panic'],
    sceneWeight: 'light',
    sceneWeightDot: 2,
    cardStyle: {
      background: 'linear-gradient(150deg, rgba(195,215,208,0.18), rgba(188,210,202,0.08))',
      borderColor: 'rgba(175,200,190,0.18)'
    },
    component: EnergyRetraction
  },
  // ── 🥀 疲惫与内耗 ──
  {
    id: 'innerChild',
    title: '内在小孩',
    description: '回到那个小小的自己身边',
    sceneSubtitle: '适合：觉得自己不够好、不配被爱时',
    icon: '💜',
    tags: ['chaos'],
    sceneWeight: 'light',
    sceneWeightDot: 2,
    cardStyle: {
      background: 'linear-gradient(150deg, rgba(220,205,225,0.2), rgba(215,200,220,0.09))',
      borderColor: 'rgba(205,190,215,0.2)'
    },
    component: InnerChild
  },
  {
    id: 'affirmationEcho',
    title: '认知翻转',
    description: '写下困住你的否定句，然后用你自己的声音，为它写下一个新的回应。',
    sceneSubtitle: '适合：自我否定、不相信迈出那一步时',
    icon: '✦',
    tags: ['chaos', 'rumination'],
    sceneWeight: 'light',
    sceneWeightDot: 2,
    cardStyle: {
      background: 'linear-gradient(150deg, rgba(238,228,215,0.3), rgba(232,222,210,0.14))',
      borderColor: 'rgba(220,208,195,0.28)'
    },
    component: AffirmationEcho
  },
  // ── 🧠 脑子很乱 ──
  {
    id: 'fearRelease',
    title: '直面恐惧',
    description: '写下那些让你不安的声音。不加评判，只做倾听。',
    sceneSubtitle: '适合：不敢迈出下一步时',
    icon: '🕯️',
    tags: ['rumination'],
    sceneWeight: 'light',
    sceneWeightDot: 2,
    cardStyle: {
      background: 'linear-gradient(150deg, rgba(225,215,205,0.22), rgba(218,208,198,0.1))',
      borderColor: 'rgba(208,198,185,0.2)'
    },
    component: FearRelease
  },
  {
    id: 'resistanceExhaustion',
    title: '穿越阻抗',
    description: '当你无法相信一句自我肯定时，不如让内心的反对声音尽情说个够，直到它安静下来。',
    sceneSubtitle: '适合：道理都懂但做不到时',
    icon: '◈',
    tags: ['rumination'],
    sceneWeight: 'light',
    sceneWeightDot: 2,
    cardStyle: {
      background: 'linear-gradient(150deg, rgba(218,210,200,0.22), rgba(210,202,192,0.1))',
      borderColor: 'rgba(205,195,182,0.2)'
    },
    component: ResistanceExhaustion
  },
  // ── 🌱 深度重塑 ──
  {
    id: 'affirmation30',
    title: '三十天自我重塑',
    description: '用三十句话，拼凑出一个更强大、更稳固的你',
    sceneSubtitle: '适合：建立稳定的自我信任',
    icon: '🌱',
    tags: ['deep'],
    sceneWeight: 'deep',
    sceneWeightDot: 3,
    cardStyle: {
      background: 'linear-gradient(160deg, rgba(232,245,232,0.35), rgba(225,240,225,0.16))',
      borderColor: 'rgba(195,220,195,0.28)'
    },
    component: ThirtyDaysAffirmation
  },
  {
    id: 'personalLaw',
    title: '个人律法',
    description: '层层剥开表面的焦虑，找出那句一直在潜意识里惩罚你的核心信念。',
    sceneSubtitle: '适合：反复自我惩罚、死循环的内在批判时',
    icon: '🔮',
    tags: ['deep'],
    sceneWeight: 'deep',
    sceneWeightDot: 3,
    cardStyle: {
      background: 'linear-gradient(160deg, rgba(228,220,238,0.3), rgba(220,212,230,0.14))',
      borderColor: 'rgba(205,195,218,0.28)'
    },
    component: PersonalLaw
  },
  {
    id: 'birthMemory',
    title: '生命原点',
    description: '通过文字与呼吸，重返生命降临的最初时刻，拥抱并安抚那个最脆弱的自己。',
    sceneSubtitle: '适合：寻找存在意义、感到不被欢迎时',
    icon: '✨',
    tags: ['deep'],
    sceneWeight: 'deep',
    sceneWeightDot: 3,
    cardStyle: {
      background: 'linear-gradient(160deg, rgba(245,235,225,0.32), rgba(238,228,218,0.15))',
      borderColor: 'rgba(220,205,192,0.26)'
    },
    component: BirthMemory
  },
  {
    id: 'deepRelease',
    title: '深层释放',
    description: '面对潜意识深处的枷锁与秘密。签下解绑协议，或者将隐私彻底焚毁。',
    sceneSubtitle: '适合：长期自我设限、有沉重秘密时',
    icon: '⛓',
    tags: ['deep'],
    sceneWeight: 'deep',
    sceneWeightDot: 4,
    cardStyle: {
      background: 'linear-gradient(160deg, rgba(220,212,205,0.28), rgba(212,204,197,0.13))',
      borderColor: 'rgba(200,190,180,0.24)'
    },
    component: DeepRelease
  },
  {
    id: 'futureVision',
    title: '时光愿景',
    description: '从五年到三十天。锚定你真正渴望实现的目标，并亲手签下对未来的承诺。',
    sceneSubtitle: '适合：失去方向、觉得生活没有盼头时',
    icon: '🌿',
    tags: ['deep'],
    sceneWeight: 'deep',
    sceneWeightDot: 3,
    cardStyle: {
      background: 'linear-gradient(160deg, rgba(215,232,215,0.3), rgba(208,225,208,0.14))',
      borderColor: 'rgba(190,212,190,0.26)'
    },
    component: FutureVision
  },
]

// Remove duplicate id by keying on card.id+index in the grid
const filteredCards = computed(() => {
  if (activeTag.value === 'all') return practiceCards
  return practiceCards.filter(card => card.tags.includes(activeTag.value))
})

// ─── Component props ───
const getComponentProps = (cardId: string) => {
  if (cardId === 'breathing') return { mode: '478' }
  return {}
}

// ─── Modal ───
const activePractice = ref<PracticeCard | null>(null)
const showCompletionMessage = ref(false)
const userMemoryStore = useUserMemoryStore()

const openPractice = (card: PracticeCard) => {
  activePractice.value = card
  showCompletionMessage.value = false
}

const closePractice = () => {
  activePractice.value = null
  showCompletionMessage.value = false
}

const handleOverlayClick = (e: MouseEvent) => {
  if (e.target === e.currentTarget) closePractice()
}

const handleComplete = (event: { completed?: boolean; content?: string }) => {
  showCompletionMessage.value = true
  setTimeout(() => closePractice(), 2000)
}
</script>

<style scoped>
/* ─── Root ─── */
.practice-space {
  min-height: 100vh;
  padding: 0 24px 60px;
  background: linear-gradient(175deg, rgba(250,248,245,1) 0%, rgba(246,243,240,1) 100%);
}

/* ─── Navigation ─── */
.top-nav {
  position: fixed;
  top: 16px;
  right: 16px;
  display: flex;
  gap: 10px;
  z-index: 100;
}

.nav-icon-btn {
  width: 36px;
  height: 36px;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #7A7A6E;
  background: rgba(255,255,255,0.65);
  transition: all 500ms ease;
  text-decoration: none;
}

.nav-icon-btn:hover { background: rgba(255,255,255,0.92); }

.return-btn {
  position: fixed;
  top: 16px;
  left: 16px;
  width: 36px;
  height: 36px;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #7A7A6E;
  background: rgba(255,255,255,0.65);
  transition: all 500ms ease;
  text-decoration: none;
  z-index: 100;
}

.return-btn:hover { background: rgba(255,255,255,0.92); }

/* ─── Hero ─── */
.hero-section {
  padding: 72px 0 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  max-width: 680px;
  margin: 0 auto;
}

.hero-greeting {
  font-size: 18px;
  font-weight: 300;
  line-height: 2.2;
  letter-spacing: 0.05em;
  color: #6E6E62;
  text-align: center;
}

/* Filter Tags */
.filter-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
}

.filter-tag {
  padding: 8px 18px;
  border-radius: 9999px;
  border: 1px solid rgba(200, 192, 182, 0.22);
  background: rgba(255,255,255,0.5);
  font-size: 12px;
  font-weight: 300;
  letter-spacing: 0.08em;
  color: rgba(150, 145, 138, 0.75);
  cursor: pointer;
  transition: all 500ms cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;
}

.filter-tag:hover {
  background: rgba(255,255,255,0.8);
  border-color: rgba(200, 192, 182, 0.35);
  color: rgba(130, 125, 118, 0.85);
}

.filter-tag.is-active {
  background: rgba(200, 190, 178, 0.22);
  border-color: rgba(190, 180, 168, 0.35);
  color: rgba(130, 122, 112, 0.9);
}

/* ─── Cards Grid ─── */
.practice-grid {
  max-width: 960px;
  margin: 0 auto;
}

.cards-inner {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;
  align-items: start;
}

/* ─── Cards ─── */
.practice-card {
  border-radius: 16px;
  border: 1px solid;
  cursor: pointer;
  transition: all 600ms cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.practice-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 16px 48px rgba(0,0,0,0.07);
}

.practice-card:active {
  transform: translateY(-2px) scale(0.98);
  transition-duration: 120ms;
}

/* Light cards — compact, airy */
.practice-card.light {
  padding: 24px 20px 20px;
}

.practice-card.light .card-body {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
}

.practice-card.light .card-icon {
  font-size: 28px;
  margin-bottom: 4px;
}

.practice-card.light .card-title {
  font-size: 14px;
}

.practice-card.light .card-description {
  font-size: 12px;
  line-height: 1.65;
}

/* Deep cards — journal/notebook feel, more presence */
.practice-card.deep {
  padding: 0 0 4px;
  border-radius: 18px;
}

.practice-card.deep .card-spine {
  height: 4px;
  width: 100%;
  border-radius: 18px 18px 0 0;
  background: linear-gradient(to right, rgba(200,190,175,0.35), rgba(190,180,165,0.2));
  margin-bottom: 20px;
}

.practice-card.deep .card-body {
  padding: 0 22px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
}

.practice-card.deep .card-icon {
  font-size: 32px;
  margin-bottom: 4px;
}

.practice-card.deep .card-title {
  font-size: 15px;
  letter-spacing: 0.1em;
}

.practice-card.deep .card-description {
  font-size: 12.5px;
  line-height: 1.75;
}

.practice-card.deep:hover {
  box-shadow: 0 20px 56px rgba(0,0,0,0.09);
}

/* ─── Card Typography ─── */
.card-icon {
  opacity: 0.82;
}

.card-title {
  font-weight: 400;
  letter-spacing: 0.08em;
  color: #5A5A52;
  margin: 0;
}

.card-subtitle {
  font-size: 11px;
  font-weight: 300;
  letter-spacing: 0.06em;
  color: rgba(170, 162, 152, 0.65);
  line-height: 1.5;
}

.card-description {
  font-weight: 300;
  color: #8A8A7E;
  letter-spacing: 0.02em;
  margin: 0;
}

/* Card footer with weight dots */
.card-footer {
  padding: 12px 20px 16px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.weight-dots {
  display: flex;
  gap: 4px;
}

.weight-dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: rgba(200, 190, 178, 0.3);
}

.practice-card.deep .weight-dot {
  background: rgba(200, 190, 178, 0.4);
}

/* ─── Card filter transition ─── */
.card-fade-enter-active {
  transition: opacity 500ms cubic-bezier(0.4, 0, 0.2, 1), transform 500ms cubic-bezier(0.4, 0, 0.2, 1);
}
.card-fade-leave-active {
  transition: opacity 350ms cubic-bezier(0.4, 0, 0.2, 1), transform 350ms cubic-bezier(0.4, 0, 0.2, 1);
  position: absolute;
}
.card-fade-enter-from {
  opacity: 0;
  transform: translateY(10px) scale(0.97);
}
.card-fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
.card-fade-move {
  transition: transform 500ms cubic-bezier(0.4, 0, 0.2, 1);
}

/* ─── Modal ─── */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.38);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 24px;
}

.modal-container {
  position: relative;
  width: 100%;
  max-width: 560px;
  max-height: 90vh;
  overflow-y: auto;
  background: rgba(250,248,245,0.98);
  border-radius: 20px;
  box-shadow: 0 24px 80px rgba(0,0,0,0.14);
}

.modal-close {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 36px;
  height: 36px;
  border-radius: 9999px;
  border: none;
  background: rgba(0,0,0,0.04);
  color: #8A8A7E;
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 600ms ease;
  z-index: 10;
  line-height: 1;
}

.modal-close:hover {
  background: rgba(0,0,0,0.08);
  color: #5A5A52;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 500ms ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
.modal-fade-enter-active .modal-container,
.modal-fade-leave-active .modal-container {
  transition: transform 500ms cubic-bezier(0.4, 0, 0.2, 1);
}
.modal-fade-enter-from .modal-container,
.modal-fade-leave-to .modal-container {
  transform: scale(0.95) translateY(20px);
}

.modal-container::-webkit-scrollbar { width: 5px; }
.modal-container::-webkit-scrollbar-track { background: transparent; }
.modal-container::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 3px; }
</style>
