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
              <div v-if="message.healingComponent" class="mt-5 max-w-[80%]">
                <SecurityCard
                  v-if="message.healingComponent === 'securityCard'"
                  @complete="onHealingComplete(message.id, $event)"
                />
                <GroundingFiveSenses
                  v-if="message.healingComponent === 'grounding'"
                  @complete="onHealingComplete(message.id, $event)"
                />
                <WaitingTimer
                  v-if="message.healingComponent === 'waitingTimer'"
                  @complete="onHealingComplete(message.id, $event)"
                />
                <BreathingGuide
                  v-if="message.healingComponent === 'breathing478'"
                  mode="478"
                  @complete="onHealingComplete(message.id, $event)"
                />
                <EnergyRetraction
                  v-if="message.healingComponent === 'energyRetraction'"
                  @complete="onHealingComplete(message.id, $event)"
                />
                <SomaticRadar
                  v-if="message.healingComponent === 'somaticRadar'"
                  @complete="onHealingComplete(message.id, $event)"
                />
                <Transition name="fade-in-slow">
                  <InnerChild
                    v-if="message.healingComponent === 'innerChild'"
                    @complete="onHealingComplete(message.id, $event)"
                  />
                </Transition>
                <Transition name="fade-in-slow">
                  <ListWriting
                    v-if="message.healingComponent === 'listWriting'"
                    :listType="message.listType"
                    @complete="onHealingComplete(message.id, $event)"
                  />
                </Transition>
                <Transition name="fade-in-slow">
                  <FreeWriting
                    v-if="message.healingComponent === 'freeWriting'"
                    @complete="onHealingComplete(message.id, $event)"
                  />
                </Transition>
              </div>
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
          type="submit"
          :disabled="!inputMessage.trim() || isStreaming"
          class="send-button"
          :class="{ active: inputMessage.trim() && !isStreaming }"
        >
          <svg v-if="!isStreaming" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
          </svg>
          <svg v-else class="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, watch, onMounted, onUnmounted, computed } from 'vue'
import { useAIChatStore } from '@/stores/aiChat'
import { useGlobalStore } from '@/stores/global'
import { useUserMemoryStore } from '@/stores/userMemory'
import { chatWithAI } from '@/api/ai'
import SecurityCard from './components/SecurityCard.vue'
import GroundingFiveSenses from './components/GroundingFiveSenses.vue'
import WaitingTimer from './components/WaitingTimer.vue'
import BreathingGuide from './components/BreathingGuide.vue'
import EnergyRetraction from './components/EnergyRetraction.vue'
import SomaticRadar from './components/SomaticRadar.vue'
import InnerChild from './components/InnerChild.vue'
import ListWriting from './components/ListWriting.vue'
import FreeWriting from './components/FreeWriting.vue'
import { audioGroundingEngine } from '@/services/audioService'
import type { HealingComponentType } from '@/types/ai'

const aiChatStore = useAIChatStore()
const globalStore = useGlobalStore()
const userMemoryStore = useUserMemoryStore()

const inputRef = ref<HTMLTextAreaElement | null>(null)
const messageListRef = ref<HTMLElement | null>(null)

const inputMessage = ref('')
const isStreaming = ref(false)
const streamingContent = ref('')
const currentStreamingMessageId = ref<string | null>(null)
const isAudioEnabled = ref(false)

const emotionCapsules = [
  { text: '☁️ 脑子很乱，停不下来' },
  { text: '✍️ 感觉生活卡壳了，想梳理一下' },
  { text: '🥀 觉得好内耗，很疲惫' },
  { text: '💔 我觉得没有人理解我' },
]

const handleCapsuleClick = (text: string) => {
  inputMessage.value = text
  handleSubmit()
}

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

// 统一定义 Tool Name 到组件的映射表
const toolToComponentMap: Record<string, HealingComponentType> = {
  'trigger_478_breathing': 'breathing478',
  'trigger_energy_retraction': 'energyRetraction',
  'trigger_somatic_radar': 'somaticRadar',
  'trigger_inner_child': 'innerChild',
  'trigger_grounding_five_senses': 'grounding',
  'trigger_waiting_timer': 'waitingTimer',
  'trigger_affirmation_echo': 'securityCard',
  'trigger_belief_transformation': 'securityCard',
  'trigger_resistance_exhaustion': 'securityCard',
  'trigger_fear_release': 'freeWriting',
  'trigger_deep_release': 'freeWriting',
  'trigger_personal_law': 'securityCard',
  'trigger_future_vision': 'securityCard',
  'trigger_birth_memory': 'innerChild'
}

const detectHealingComponent = (message: string): HealingComponentType => {
  const lowerMsg = message.toLowerCase()
  if (/心跳|心跳快|喘不过气|呼吸急促|大脑空白|惊恐|要疯了|崩溃/.test(lowerMsg)) return 'breathing478'
  if (/不发信息会疯|忍不住|控制不住|刷手机|连环发|能量耗散/.test(lowerMsg)) return 'energyRetraction'
  if (/胃部翻腾|喉咙发紧|身体紧绷|难受/.test(lowerMsg)) return 'somaticRadar'
  if (/没人要|被抛弃|小时候|羞耻感|绝望|内在小孩/.test(lowerMsg)) return 'innerChild'
  if (/他爱不爱|抛弃|不值得|没价值|是不是我|心情不好|难过|焦虑|害怕|担心|累/.test(lowerMsg)) return 'securityCard'
  return null
}

const detectHealingComponentFromAI = (content: string): HealingComponentType => {
  const lowerContent = content.toLowerCase()
  if (/478呼吸|4-7-8呼吸/.test(lowerContent)) return 'breathing478'
  if (/能量回收|不再外耗/.test(lowerContent)) return 'energyRetraction'
  if (/五感|着陆/.test(lowerContent)) return 'grounding'
  if (/躯体觉察/.test(lowerContent)) return 'somaticRadar'
  if (/内在小孩/.test(lowerContent)) return 'innerChild'
  if (/确认卡|踏实感/.test(lowerContent)) return 'securityCard'
  if (/给你20分钟/.test(lowerContent)) return 'waitingTimer'
  return null
}

/**
 * 🎯 核心修复：原生 Fetch 拦截流
 * 彻底抛弃旧版解析器，兼容 OpenAI 标准流，并增加对「AI 恶意打印 JSON」的正则拦截
 */
const handleStreamingResponse = async (userMessage: string) => {
  let fullContent = ''
  let healingComponent: HealingComponentType = null
  let currentToolName = ''

  try {
    const API_BASE = import.meta.env.VITE_BACKEND_API_URL || 'http://127.0.0.1:8787'
    const response = await fetch(`${API_BASE}/api/chat/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-access-code': localStorage.getItem('access_code') || ''
      },
      body: JSON.stringify({ message: userMessage, sessionId: aiChatStore.currentSessionId })
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
        buffer = lines.pop() || '' // 保留未完整的区块

        for (const line of lines) {
          const trimmedLine = line.trim()
          if (!trimmedLine || trimmedLine.startsWith(':')) continue

          if (trimmedLine.startsWith('data:')) {
            const dataStr = trimmedLine.slice(5).trim()
            if (dataStr === '[DONE]') continue

            try {
              const parsed = JSON.parse(dataStr)
              const delta = parsed.choices?.[0]?.delta

              // 1. 标准内容拼接
              if (delta?.content) {
                fullContent += delta.content
                streamingContent.value = fullContent
                scrollToBottom()
              }

              // 2. 拦截标准 Tool Calls
              if (delta?.tool_calls && delta.tool_calls.length > 0) {
                const toolCall = delta.tool_calls[0]
                if (toolCall.function?.name) {
                  currentToolName = toolCall.function.name
                }
              }
            } catch (e) {
               // 静默忽略截断的 JSON chunk 错误，避免触发 Fallback 导致双重气泡
            }
          }
        }
      }
    }
  } catch (error: any) {
    const isRateLimit = error?.message?.includes('429')
    if (isRateLimit) {
      fullContent = '你今天的情绪已经释放得足够多了，请先休息一下，喝杯水吧。'
    } else {
      // 只有在【完全没有收到任何内容】的情况下才允许重试，否则坚决不 Fallback
      if (!fullContent) {
        try {
          const fallback = await chatWithAI({ message: userMessage, sessionId: aiChatStore.currentSessionId, stream: false })
          fullContent = fallback.content || '网络连接不稳定，请稍后重试。'
        } catch (fbError) {}
      }
    }
  }

  // --- 强力防护网：拦截并抹除画面上的丑陋 JSON ---
  const rogueJsonRegex = /\{[^}]*"tool"\s*:\s*"([^"]+)"[^}]*\}/g;
  let match;
  while ((match = rogueJsonRegex.exec(fullContent)) !== null) {
    const extractedTool = match[1];
    if (toolToComponentMap[extractedTool]) {
      healingComponent = toolToComponentMap[extractedTool];
    }
  }
  
  if (healingComponent || currentToolName) {
    healingComponent = healingComponent || toolToComponentMap[currentToolName];
    // 抹除包含 tool 键值的 JSON 结构
    fullContent = fullContent.replace(/\{[^}]*"tool"\s*:\s*"[^"]+"[^}]*\}/g, '').trim();
    
    // 使用 String.fromCharCode 安全处理反引号，避免 Markdown 代码块被截断
    const tick3 = String.fromCharCode(96, 96, 96);
    const jsonBlockRegex = new RegExp(tick3 + '(?:json)?\\\\s*', 'g');
    const tickRegex = new RegExp(tick3, 'g');
    
    fullContent = fullContent
      .replace(jsonBlockRegex, '')
      .replace(tickRegex, '')
      .replace(/[”“"]*$/, '')
      .trim();
  }

  // --- 最终兜底机制 ---
  if (!healingComponent) healingComponent = detectHealingComponent(userMessage)
  if (!healingComponent) healingComponent = detectHealingComponentFromAI(fullContent)

  // 防止画面空无一物
  if (healingComponent && !fullContent.trim()) {
    fullContent = '我为你准备了这个练习，我们一起试试看。'
  }

  return { content: fullContent, healingComponent }
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

    const { content, healingComponent } = await handleStreamingResponse(message)

    // 🎯 核心修复：先同步关闭流状态，并强制等待 DOM 更新，彻底掐断「两个回复框重叠」的时序 Bug
    streamingContent.value = ''
    isStreaming.value = false
    await nextTick()

    // 随后再将最终结果存入 Store
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

/* 照片显影过渡 - 用于疗愈组件 */
.photo-dev-enter-active,
.photo-dev-leave-active {
  transition: opacity 1.5s ease;
}
.photo-dev-enter-from,
.photo-dev-leave-to {
  opacity: 0;
}

/* 缓慢淡入过渡 - 用于内在小孩等深度疗愈组件 */
.fade-in-slow-enter-active,
.fade-in-slow-leave-active {
  transition: opacity 2s ease;
}
.fade-in-slow-enter-from,
.fade-in-slow-leave-to {
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