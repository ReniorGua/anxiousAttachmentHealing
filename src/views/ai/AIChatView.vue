<template>
  <div class="flex flex-col h-[100dvh] w-full overflow-hidden bg-[rgba(250,248,245,1)]">

    <router-link to="/" class="return-btn" title="返回首页">
      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 19l-7-7 7-7"></path>
      </svg>
    </router-link>

    <div class="top-nav">
      <router-link to="/practice" class="nav-icon-btn" title="疗愈岛屿">
        <span class="text-sm">🌿</span>
      </router-link>
      <router-link to="/chat/memory" class="nav-icon-btn" title="成长年轮">
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3m6-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      </router-link>
    </div>

    <div class="flex-none text-center mb-6 pt-4">
      <h1 class="text-[28px] font-[300] tracking-[0.15em] text-[#5A5A52] mb-3">倾诉树洞</h1>
      <p class="text-[14px] font-[300] text-[#8A8A7E] tracking-[0.05em]">在这里停下来，照顾自己</p>
    </div>

    <div
      ref="messageListRef"
      class="flex-1 overflow-y-auto overscroll-none"
    >
      <div class="max-w-[640px] mx-auto px-4">

        <div v-if="messages.length === 0 && !streamingContent" class="empty-state">
          <div class="empty-icon">✿</div>
          <h3 class="empty-title">欢迎来到松间心舍。</h3>
          <p class="empty-text">
            这是一个没有评判、绝对安全的情绪避难所。<br/>
            无论是生活卡壳、深夜内耗，还是单纯想找个树洞写点什么，我都在这里陪你。
          </p>
        </div>

        <div v-for="(message) in messages" :key="message.id">
          <div v-if="message.role === 'user'" class="message-item message-user">
            <div
              class="max-w-[80%] px-5 py-3 text-white rounded-none"
              :style="{ backgroundColor: globalStore.customThemeColor || '#8FA98F' }"
            >
              <p class="text-sm leading-loose whitespace-pre-wrap opacity-90">{{ message.content }}</p>
            </div>
          </div>

          <div v-else class="message-item message-ai">
            <div class="max-w-[80%] px-5 py-3" style="background-color: rgba(255,255,255,0.7); color: #4A4A3E;">
              <p class="text-sm leading-loose whitespace-pre-wrap">{{ message.content }}</p>
              <p class="text-xs mt-2 opacity-40 tracking-wider">{{ formatTime(message.timestamp) }}</p>
            </div>

            <Transition name="photo-dev">
              <component
                v-if="message.healingComponent && healingComponents[message.healingComponent]"
                :is="healingComponents[message.healingComponent].component"
                v-bind="{ ...healingComponents[message.healingComponent].props, ...(message.healingComponent === 'listWriting' ? { listType: message.listType } : {}) }"
                class="mt-5 max-w-[80%]"
                @complete="onHealingComplete(message.id, $event)"
              />
            </Transition>
          </div>
        </div>

        <div v-if="streamingContent" class="message-item message-ai">
          <div class="max-w-[80%] px-5 py-3" style="background-color: rgba(255,255,255,0.7); color: #4A4A3E;">
            <p class="text-sm leading-loose whitespace-pre-wrap">{{ streamingContent }}</p>
          </div>
        </div>

        <div v-if="isStreaming && !streamingContent" class="message-item message-ai">
          <div class="px-5 py-3" style="background-color: rgba(255,255,255,0.7);">
            <div class="flex space-x-2">
              <div class="w-1.5 h-1.5 rounded-full" :style="{ backgroundColor: globalStore.customThemeColor || '#8FA98F', animation: 'breathe-dot 2.4s ease-in-out infinite' }"></div>
              <div class="w-1.5 h-1.5 rounded-full" :style="{ backgroundColor: globalStore.customThemeColor || '#8FA98F', animation: 'breathe-dot 2.4s ease-in-out infinite 0.4s' }"></div>
              <div class="w-1.5 h-1.5 rounded-full" :style="{ backgroundColor: globalStore.customThemeColor || '#8FA98F', animation: 'breathe-dot 2.4s ease-in-out infinite 0.8s' }"></div>
            </div>
          </div>
        </div>

      </div>
    </div>

    <div class="flex-none px-6 py-4 bg-[rgba(250,248,245,0.95)] border-t border-black/[0.04]">
      <form @submit.prevent="handleSubmit" class="max-w-[640px] mx-auto flex items-end gap-3">
        <div class="flex-1">
          <textarea
            ref="inputRef"
            v-model="inputMessage"
            :placeholder="isStreaming ? '思考中...' : '说点什么...'"
            :disabled="isStreaming"
            rows="1"
            inputmode="text"
            enterkeyhint="send"
            class="input-textarea"
            @input="autoResize"
            @keydown.enter.exact.prevent="handleSubmit"
          ></textarea>
        </div>
        <button
          type="button"
          :disabled="!inputMessage.trim() && !isStreaming"
          class="send-button"
          :class="{ active: inputMessage.trim() && !isStreaming }"
          @click="isStreaming ? handleStop() : handleSubmit()"
        >
          <svg v-if="!isStreaming" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
          </svg>
          <svg v-else class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <rect x="6" y="6" width="12" height="12" rx="1"></rect>
          </svg>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, watch, onMounted, computed } from 'vue'
import { useAIChatStore } from '@/stores/aiChat'
import { useGlobalStore } from '@/stores/global'
import { useUserMemoryStore } from '@/stores/userMemory'
import SecurityCard from './components/SecurityCard.vue'
import GroundingFiveSenses from './components/GroundingFiveSenses.vue'
import WaitingTimer from './components/WaitingTimer.vue'
import BreathingGuide from './components/BreathingGuide.vue'
import EnergyRetraction from './components/EnergyRetraction.vue'
import SomaticRadar from './components/SomaticRadar.vue'
import InnerChild from './components/InnerChild.vue'
import ListWriting from './components/ListWriting.vue'
import FreeWriting from './components/FreeWriting.vue'
import FutureVision from './components/FutureVision.vue'
import FearRelease from './components/FearRelease.vue'
import DeepRelease from './components/DeepRelease.vue'
import PersonalLaw from './components/PersonalLaw.vue'
import BirthMemory from './components/BirthMemory.vue'
import ResistanceExhaustion from './components/ResistanceExhaustion.vue'
import ThirtyDaysAffirmation from './components/ThirtyDaysAffirmation.vue'
import AffirmationEcho from './components/AffirmationEcho.vue'
import { audioGroundingEngine } from '@/services/audioService'
import type { HealingComponentType } from '@/types/ai'

const aiChatStore = useAIChatStore()
const globalStore = useGlobalStore()
const userMemoryStore = useUserMemoryStore()

// 动态组件映射表
const healingComponents: Record<string, { component: any; props?: Record<string, any> }> = {
  securityCard: { component: SecurityCard },
  grounding: { component: GroundingFiveSenses },
  waitingTimer: { component: WaitingTimer },
  breathing478: { component: BreathingGuide, props: { mode: '478' } },
  energyRetraction: { component: EnergyRetraction },
  somaticRadar: { component: SomaticRadar },
  innerChild: { component: InnerChild },
  listWriting: { component: ListWriting, props: {} },
  freeWriting: { component: FreeWriting },
  futureVision: { component: FutureVision },
  fearRelease: { component: FearRelease },
  deepRelease: { component: DeepRelease },
  personalLaw: { component: PersonalLaw },
  birthMemory: { component: BirthMemory },
  resistanceExhaustion: { component: ResistanceExhaustion },
  thirtyDaysAffirmation: { component: ThirtyDaysAffirmation },
  affirmationEcho: { component: AffirmationEcho },
}

const inputRef = ref<HTMLTextAreaElement | null>(null)
const messageListRef = ref<HTMLElement | null>(null)

const inputMessage = ref('')
const isStreaming = ref(false)
const streamingContent = ref('')
const isAudioEnabled = ref(false)
let abortController: AbortController | null = null

const messages = computed(() => aiChatStore.currentMessages)

const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp)
  return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
}

const autoResize = (event: Event) => {
  const target = event.target as HTMLTextAreaElement
  target.style.height = 'auto'
  target.style.height = `${Math.min(target.scrollHeight, 128)}px`
}

const scrollToBottom = async () => {
  await nextTick()
  if (messageListRef.value) {
    messageListRef.value.scrollTop = messageListRef.value.scrollHeight
  }
}

const toggleAudio = () => {
  isAudioEnabled.value = !isAudioEnabled.value
  audioGroundingEngine.setMuted(!isAudioEnabled.value)
}

const onHealingComplete = async (messageId: string, event: { completed?: boolean; heartRate?: string }) => {
  const session = aiChatStore.sessions.find(s => s.id === aiChatStore.currentSessionId)
  const msg = session?.messages.find(m => m.id === messageId)
  const componentType = msg?.healingComponent

  if (componentType === 'breathing478') userMemoryStore.addMilestone('完成了4-7-8呼吸练习', 'self_soothing')
  else if (componentType === 'waitingTimer') userMemoryStore.addMilestone('成功等待了20分钟', 'self_soothing')
  else if (componentType === 'grounding') userMemoryStore.addMilestone('完成了五感着陆练习', 'self_soothing')
  else if (componentType === 'energyRetraction') userMemoryStore.addMilestone('进行了能量回收练习', 'self_soothing')
  else if (componentType === 'somaticRadar') userMemoryStore.addMilestone('进行了躯体觉察练习', 'self_soothing')
  else if (componentType === 'innerChild') userMemoryStore.addMilestone('与内在小孩对话', 'self_soothing')
}

// Tool Name → HealingComponentType 映射表
const toolToComponentMap: Record<string, HealingComponentType> = {
  'trigger_478_breathing': 'breathing478',
  'trigger_energy_retraction': 'energyRetraction',
  'trigger_somatic_radar': 'somaticRadar',
  'trigger_inner_child': 'innerChild',
  'trigger_grounding_five_senses': 'grounding',
  'trigger_waiting_timer': 'waitingTimer',
  'trigger_affirmation_echo': 'affirmationEcho',
  'trigger_belief_transformation': 'affirmationEcho',
  'trigger_resistance_exhaustion': 'resistanceExhaustion',
  'trigger_fear_release': 'fearRelease',
  'trigger_deep_release': 'deepRelease',
  'trigger_personal_law': 'personalLaw',
  'trigger_future_vision': 'futureVision',
  'trigger_birth_memory': 'birthMemory',
  'trigger_affirmation_30': 'thirtyDaysAffirmation',
}

/**
 * 原生 Fetch 流式拦截
 * - 截获 delta.content 拼接到 fullContent
 * - 截获 delta.tool_calls[0].function.arguments 累加到 toolArgumentsBuffer
 * - 不再发送二次兜底请求
 * - 不再使用暴力正则清理 trigger_XXX
 */
const handleStreamingResponse = async (userMessage: string, signal?: AbortSignal) => {
  let fullContent = ''
  let healingComponent: HealingComponentType = null
  let toolArgumentsBuffer = ''
  let isAborted = false

  try {
    const API_BASE = import.meta.env.VITE_BACKEND_API_URL || 'http://127.0.0.1:8787'

    // 分层记忆发送：history 限制最近 5 条，summary 为情绪侧写
    const recentHistory = aiChatStore.currentMessages.slice(-5)
    const summary = userMemoryStore.getContextSummary()

    const response = await fetch(`${API_BASE}/api/chat/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-access-code': localStorage.getItem('access_code') || '',
      },
      body: JSON.stringify({
        message: userMessage,
        sessionId: aiChatStore.currentSessionId,
        history: recentHistory.map(m => ({ role: m.role, content: m.content })),
        summary,
        tool_choice: 'auto',
      }),
      signal,
    })

    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`)

    const reader = response.body?.getReader()
    const decoder = new TextDecoder('utf-8')
    let buffer = ''

    if (reader) {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const rawLine of lines) {
          const line = rawLine.trim()
          if (!line || line.startsWith(':')) continue

          if (line.startsWith('data:')) {
            const dataStr = line.slice(5).trim()
            if (dataStr === '[DONE]') continue

            try {
              const parsed = JSON.parse(dataStr)

              // 1. 标准内容拼接（跳过含 tool_calls 的 chunk）
              const delta = parsed.choices?.[0]?.delta
              const directContent = parsed.output?.choices?.[0]?.message?.content || parsed.choices?.[0]?.message?.content
              const textContent = parsed.output?.text
              let chunkContent = ''
              if (delta?.content) {
                chunkContent = delta.content
              } else if (directContent) {
                chunkContent = directContent
              } else if (textContent) {
                chunkContent = textContent
              }

              if (chunkContent && !delta?.tool_calls) {
                fullContent += chunkContent
                streamingContent.value = fullContent
                scrollToBottom()
              }

              // 2. 截获并累加工具调用参数（JSON 碎片不能进入 fullContent）
              if (delta?.tool_calls && delta.tool_calls.length > 0) {
                const toolCall = delta.tool_calls[0]
                if (toolCall.function?.name) {
                  // tool name 只记日志，不进入渲染
                  console.log(`[Stream] Tool call: ${toolCall.function.name}`)
                }
                if (toolCall.function?.arguments) {
                  toolArgumentsBuffer += toolCall.function.arguments
                }
              }
            } catch {
              // 静默忽略截断的 JSON chunk
            }
          }
        }
      }
    }

    // 3. 流结束后统一解析 toolArgumentsBuffer → healingComponent
    if (toolArgumentsBuffer) {
      try {
        const args = JSON.parse(toolArgumentsBuffer)
        const practiceId = args.practice_id || args.practiceId
        if (practiceId && toolToComponentMap[practiceId]) {
          healingComponent = toolToComponentMap[practiceId] as HealingComponentType
        }
      } catch (e) {
        console.warn('[Stream] Failed to parse tool arguments:', e)
      }
    }

  } catch (error: any) {
    if (error.name === 'AbortError' || error instanceof DOMException) {
      console.warn('[Stream] Stream aborted by user')
      isAborted = true
    } else {
      const isRateLimit = error?.message?.includes('429')
      if (isRateLimit) {
        fullContent = '你今天的情绪已经释放得足够多了，请先休息一下，喝杯水吧。'
      } else {
        fullContent = '网络连接不稳定，请稍后重试。'
      }
    }
  }

  // 4. 基础清理：去除首尾空白
  fullContent = fullContent.trim()

  // 5. 防止画面空无一物
  if (healingComponent && !fullContent) {
    fullContent = '我为你准备了这个练习，我们一起试试看。'
  }

  return { content: fullContent, healingComponent, isAborted }
}

const handleStop = () => {
  abortController?.abort()
  abortController = null
}

const handleSubmit = async () => {
  const message = inputMessage.value.trim()
  if (!message || isStreaming.value) return

  try {
    await aiChatStore.addUserMessage(message)
    inputMessage.value = ''
    if (inputRef.value) inputRef.value.style.height = 'auto'

    scrollToBottom()
    isStreaming.value = true
    streamingContent.value = ''

    abortController = new AbortController()
    const { content, healingComponent, isAborted } = await handleStreamingResponse(message, abortController.signal)
    abortController = null

    if (isAborted) {
      streamingContent.value = ''
      isStreaming.value = false
      await nextTick()
      return
    }

    streamingContent.value = ''
    isStreaming.value = false
    await nextTick()

    const aiMessage = await aiChatStore.addAIMessage(content)
    if (healingComponent) {
      aiChatStore.addHealingComponent(aiMessage.id, healingComponent, undefined)
    }

    userMemoryStore.addTrouble(message)
    const progressKeywords = ['做得很好', '进步', '骄傲', '勇敢', '平静']
    if (progressKeywords.some(kw => content.includes(kw))) {
      userMemoryStore.addMilestone(message, 'self_soothing')
    }

  } catch (error) {
    console.error('[Chat] Error:', error)
    abortController = null
    isStreaming.value = false
    streamingContent.value = ''
  }
}

onMounted(async () => {
  userMemoryStore.loadFromStorage()
  userMemoryStore.syncFromSupabase()
  await aiChatStore.loadFromStorage()

  if (!aiChatStore.currentSessionId) {
    aiChatStore.createSession()
  }

  await nextTick()
  scrollToBottom()
  if (inputRef.value) inputRef.value.focus()
})

watch(() => messages.value.length, () => {
  nextTick(() => scrollToBottom())
}, { deep: true })

watch(() => aiChatStore.sessions, () => {
  scrollToBottom()
}, { deep: true })
</script>

<style scoped>
/* 极细滚动条 */
.overflow-y-auto::-webkit-scrollbar {
  width: 3px;
}
.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}
.overflow-y-auto::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.06);
  border-radius: 2px;
}

/* 呼吸dot动画 */
@keyframes breathe-dot {
  0%, 100% {
    opacity: 0.25;
    transform: scale(0.85);
  }
  50% {
    opacity: 0.7;
    transform: scale(1);
  }
}

/* 消息行距 */
p {
  line-height: 1.9 !important;
}

/* 照片显影过渡 */
.photo-dev-enter-active,
.photo-dev-leave-active {
  transition: opacity 1.5s ease;
}
.photo-dev-enter-from,
.photo-dev-leave-to {
  opacity: 0;
}

/* Top Mini Navigation */
.top-nav {
  position: absolute;
  top: 16px;
  right: 16px;
  display: flex;
  gap: 12px;
  z-index: 10;
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
  position: absolute;
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
  z-index: 10;
}
.return-btn:hover {
  background: rgba(255, 255, 255, 0.9);
}

/* Message Items */
.message-item {
  padding: 6px 0;
}
.message-user {
  display: flex;
  justify-content: flex-end;
}
.message-ai {
  display: flex;
  flex-direction: column;
}

/* Input Textarea */
.input-textarea {
  width: 100%;
  padding: 12px 16px;
  resize: none;
  outline: none;
  max-height: 120px;
  background: transparent;
  border: none;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  color: #4A4A3E;
  letter-spacing: 0.02em;
  font-size: 14px;
  line-height: 1.6;
}
.input-textarea:focus {
  border-bottom-color: rgba(143, 169, 143, 0.4);
}
.input-textarea::placeholder {
  color: #B0ACA4;
}

/* Send Button */
.send-button {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: rgba(0, 0, 0, 0.04);
  color: rgba(0, 0, 0, 0.25);
  transition: all 500ms ease;
  flex-shrink: 0;
  cursor: pointer;
}
.send-button.active {
  background: #8FA98F;
  color: rgba(255, 255, 255, 0.9);
}
.send-button:active {
  transform: scale(0.92);
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 48px 24px;
}
.empty-icon {
  font-size: 48px;
  opacity: 0.3;
  margin-bottom: 24px;
}
.empty-title {
  font-size: 18px;
  font-weight: 300;
  color: #5A5A52;
  margin-bottom: 12px;
}
.empty-text {
  font-size: 14px;
  font-weight: 300;
  color: #8A8A7E;
  line-height: 1.7;
}
</style>
