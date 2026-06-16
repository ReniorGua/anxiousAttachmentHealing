<template>
  <div class="practice-space">
    <!-- Top Left Return -->
    <router-link to="/" class="return-btn" title="返回首页">
      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 19l-7-7 7-7"/>
      </svg>
    </router-link>

    <!-- Top Mini Navigation -->
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

    <!-- Header -->
    <div class="practice-header">
      <h1 class="practice-title">疗愈岛屿</h1>
      <p class="practice-subtitle">在这里，你可以随时停下来，照顾自己</p>
    </div>

    <!-- Practice Cards Grid -->
    <div class="practice-grid">
      <div
        v-for="card in practiceCards"
        :key="card.id"
        class="practice-card"
        :style="card.cardStyle"
        @click="openPractice(card)"
      >
        <div class="card-icon">{{ card.icon }}</div>
        <h3 class="card-title">{{ card.title }}</h3>
        <p class="card-description">{{ card.description }}</p>
      </div>
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
import { ref, defineComponent } from 'vue'
import BreathingGuide from '@/views/ai/components/BreathingGuide.vue'
import GroundingFiveSenses from '@/views/ai/GroundingFiveSenses.vue'
import ListWriting from '@/views/ai/components/ListWriting.vue'
import FreeWriting from '@/views/ai/components/FreeWriting.vue'
import SomaticRadar from '@/views/ai/components/SomaticRadar.vue'
import InnerChild from '@/views/ai/components/InnerChild.vue'
import EnergyRetraction from '@/views/ai/components/EnergyRetraction.vue'
import SecurityCard from '@/views/ai/SecurityCard.vue'
import WaitingTimer from '@/views/ai/WaitingTimer.vue'
import ThirtyDaysAffirmation from './components/ThirtyDaysAffirmation.vue'
import { useUserMemoryStore } from '@/stores/userMemory'

interface PracticeCard {
  id: string
  title: string
  description: string
  icon: string
  cardStyle: Record<string, string>
  component: ReturnType<typeof defineComponent>
}

const practiceCards: PracticeCard[] = [
  {
    id: 'affirmation30',
    title: '三十天自我重塑',
    description: '用三十句话，拼凑出一个更强大、更稳固的你',
    icon: '🌱',
    cardStyle: {
      background: 'linear-gradient(135deg, rgba(143,169,143,0.14), rgba(143,169,143,0.07))',
      borderColor: 'rgba(143,169,143,0.18)'
    },
    component: ThirtyDaysAffirmation
  },
  {
    id: 'breathing',
    title: '4-7-8 呼吸急救',
    description: '当焦虑来袭，用呼吸找回平静',
    icon: '🌊',
    cardStyle: {
      background: 'linear-gradient(135deg, rgba(143,169,143,0.12), rgba(143,169,143,0.06))',
      borderColor: 'rgba(143,169,143,0.15)'
    },
    component: BreathingGuide
  },
  {
    id: 'grounding',
    title: '五感着陆',
    description: '通过感官回归当下，感受此刻的安全',
    icon: '🌍',
    cardStyle: {
      background: 'linear-gradient(135deg, rgba(100,120,140,0.1), rgba(100,120,140,0.05))',
      borderColor: 'rgba(100,120,140,0.12)'
    },
    component: GroundingFiveSenses
  },
  {
    id: 'listWriting',
    title: '清单书写',
    description: '把心里的声音一条条写下来',
    icon: '✍️',
    cardStyle: {
      background: 'linear-gradient(135deg, rgba(160,150,130,0.1), rgba(160,150,130,0.05))',
      borderColor: 'rgba(160,150,130,0.12)'
    },
    component: ListWriting
  },
  {
    id: 'freeWriting',
    title: '自由书写',
    description: '让思绪自由流淌，不评判，不停顿',
    icon: '📝',
    cardStyle: {
      background: 'linear-gradient(135deg, rgba(140,130,150,0.1), rgba(140,130,150,0.05))',
      borderColor: 'rgba(140,130,150,0.12)'
    },
    component: FreeWriting
  },
  {
    id: 'somatic',
    title: '躯体雷达',
    description: '扫描身体的信号，读懂情绪的语言',
    icon: '🔍',
    cardStyle: {
      background: 'linear-gradient(135deg, rgba(130,150,140,0.1), rgba(130,150,140,0.05))',
      borderColor: 'rgba(130,150,140,0.12)'
    },
    component: SomaticRadar
  },
  {
    id: 'innerChild',
    title: '内在小孩',
    description: '回到那个小小的自己身边',
    icon: '💜',
    cardStyle: {
      background: 'linear-gradient(135deg, rgba(120,80,140,0.12), rgba(120,80,140,0.06))',
      borderColor: 'rgba(120,80,140,0.15)'
    },
    component: InnerChild
  },
  {
    id: 'energy',
    title: '能量回收',
    description: '把向外耗散的精力慢慢收回',
    icon: '🐙',
    cardStyle: {
      background: 'linear-gradient(135deg, rgba(100,130,120,0.1), rgba(100,130,120,0.05))',
      borderColor: 'rgba(100,130,120,0.12)'
    },
    component: EnergyRetraction
  },
  {
    id: 'security',
    title: '安全感卡片',
    description: '给自己一份温柔的肯定',
    icon: '✦',
    cardStyle: {
      background: 'linear-gradient(135deg, rgba(200,190,180,0.15), rgba(200,190,180,0.08))',
      borderColor: 'rgba(200,190,180,0.12)'
    },
    component: SecurityCard
  },
  {
    id: 'waiting',
    title: '等待计时器',
    description: '给自己20分钟，安静地等待',
    icon: '⏰',
    cardStyle: {
      background: 'linear-gradient(135deg, rgba(180,170,160,0.1), rgba(180,170,160,0.05))',
      borderColor: 'rgba(180,170,160,0.12)'
    },
    component: WaitingTimer
  }
]

const activePractice = ref<PracticeCard | null>(null)
const showCompletionMessage = ref(false)
const userMemoryStore = useUserMemoryStore()

const getComponentProps = (cardId: string) => {
  if (cardId === 'listWriting') {
    return { listType: 'desires' }
  }
  if (cardId === 'breathing') {
    return { mode: '478' }
  }
  return {}
}

const openPractice = (card: PracticeCard) => {
  activePractice.value = card
  showCompletionMessage.value = false
}

const closePractice = () => {
  activePractice.value = null
  showCompletionMessage.value = false
}

const handleOverlayClick = (e: MouseEvent) => {
  if (e.target === e.currentTarget) {
    closePractice()
  }
}

const handleComplete = (event: { completed?: boolean; content?: string }) => {
  if (event.content) {
    userMemoryStore.addMilestone(`清单书写：${event.content.split('\n').slice(0, 3).join('、')}`, 'self_soothing')
  } else {
    userMemoryStore.addMilestone('完成了清单书写练习', 'self_soothing')
  }
  showCompletionMessage.value = true
  setTimeout(() => {
    closePractice()
  }, 2000)
}
</script>

<style scoped>
.practice-space {
  min-height: 100vh;
  padding: 24px 24px 48px;
  background: linear-gradient(180deg, rgba(250,248,245,1) 0%, rgba(245,243,240,1) 100%);
}

/* Top Mini Navigation */
.top-nav {
  position: fixed;
  top: 16px;
  right: 16px;
  display: flex;
  gap: 12px;
}

.nav-icon-btn {
  width: 36px;
  height: 36px;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #5A5A52;
  background: rgba(255, 255, 255, 0.6);
  transition: all 500ms ease;
  text-decoration: none;
}

.nav-icon-btn:hover {
  background: rgba(255, 255, 255, 0.9);
}

/* Return Button */
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
  color: #5A5A52;
  background: rgba(255, 255, 255, 0.6);
  transition: all 500ms ease;
  text-decoration: none;
  z-index: 100;
}

.return-btn:hover {
  background: rgba(255, 255, 255, 0.9);
}

/* Header */
.practice-header {
  text-align: center;
  margin-bottom: 48px;
  padding-top: 16px;
}

.practice-title {
  font-size: 28px;
  font-weight: 300;
  letter-spacing: 0.15em;
  color: #5A5A52;
  margin-bottom: 12px;
}

.practice-subtitle {
  font-size: 14px;
  font-weight: 300;
  color: #8A8A7E;
  letter-spacing: 0.05em;
}

/* Grid */
.practice-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  max-width: 960px;
  margin: 0 auto;
}

/* Cards */
.practice-card {
  padding: 32px 24px;
  border-radius: 16px;
  border: 1px solid;
  cursor: pointer;
  transition: all 800ms cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.practice-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.06);
}

.practice-card:active {
  transform: translateY(-2px) scale(0.98);
  transition-duration: 150ms;
}

.card-icon {
  font-size: 36px;
  margin-bottom: 16px;
  opacity: 0.8;
}

.card-title {
  font-size: 16px;
  font-weight: 400;
  letter-spacing: 0.08em;
  color: #5A5A52;
  margin-bottom: 8px;
}

.card-description {
  font-size: 13px;
  font-weight: 300;
  color: #8A8A7E;
  line-height: 1.7;
  letter-spacing: 0.03em;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
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
  background: rgba(250, 248, 245, 0.98);
  border-radius: 20px;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.15);
}

.modal-close {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 36px;
  height: 36px;
  border-radius: 9999px;
  border: none;
  background: rgba(0, 0, 0, 0.04);
  color: #8A8A7E;
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 600ms ease;
  z-index: 10;
}

.modal-close:hover {
  background: rgba(0, 0, 0, 0.08);
  color: #5A5A52;
}

/* Modal Transition */
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

/* Scrollbar */
.modal-container::-webkit-scrollbar {
  width: 6px;
}

.modal-container::-webkit-scrollbar-track {
  background: transparent;
}

.modal-container::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
}
</style>