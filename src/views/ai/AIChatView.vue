<template>
  <div class="flex flex-col h-[100dvh] w-full overflow-hidden bg-[rgba(250,248,245,1)]">

    <!-- Top Left Return -->
    <router-link to="/" class="return-btn" title="返回首页">
      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 19l-7-7 7-7"/>
      </svg>
    </router-link>

    <!-- Top Mini Navigation -->
    <div class="top-nav">
      <router-link to="/practice" class="nav-icon-btn" title="疗愈岛屿">
        <span class="text-sm">🌿</span>
      </router-link>
      <router-link to="/chat/memory" class="nav-icon-btn" title="成长年轮">
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3m6-2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      </router-link>
    </div>

    <!-- Header -->
    <div class="flex-none text-center mb-6 pt-4">
      <h1 class="text-[28px] font-[300] tracking-[0.15em] text-[#5A5A52] mb-3">倾诉树洞</h1>
      <p class="text-[14px] font-[300] text-[#8A8A7E] tracking-[0.05em]">在这里停下来，照顾自己</p>
    </div>

    <!-- Chat Messages Area -->
    <div
      ref="messageListRef"
      class="flex-1 overflow-y-auto overscroll-none"
    >
      <div class="max-w-[640px] mx-auto px-4">

        <!-- Welcome Screen (Empty State) -->
        <div v-if="messages.length === 0 && !streamingContent" class="empty-state">
          <div class="empty-icon">✿</div>
          <h3 class="empty-title">欢迎来到松间心舍。</h3>
          <p class="empty-text">
            这是一个没有评判、绝对安全的情绪避难所。<br/>
            无论是生活卡壳、深夜内耗，还是单纯想找个树洞写点什么，我都在这里陪你。
          </p>
        </div>

        <!-- Messages -->
        <template v-for="(message, index) in messages" :key="message.id">
          <!-- User Message -->
          <div v-if="message.role === 'user'" class="message-item message-user">
            <div
              class="max-w-[80%] px-5 py-3 text-white rounded-none"
              :style="{ backgroundColor: globalStore.customThemeColor || '#8FA98F' }"
            >
              <p class="text-sm leading-loose whitespace-pre-wrap opacity-90">{{ message.content }}</p>
            </div>
          </div>

          <!-- AI Message with optional Healing Component -->
          <div v-else class="message-item message-ai">
            <div class="max-w-[80%] px-5 py-3" style="background-color: rgba(255,255,255,0.7); color: #4A4A3E;">
              <p class="text-sm leading-loose whitespace-pre-wrap">{{ message.content }}</p>
              <p class="text-xs mt-2 opacity-40 tracking-wider">{{ formatTime(message.timestamp) }}</p>
            </div>

            <!-- Healing Component -->
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
        </template>

        <!-- Streaming Message -->
        <div v-if="streamingContent" class="message-item message-ai">
          <div class="max-w-[80%] px-5 py-3" style="background-color: rgba(255,255,255,0.7); color: #4A4A3E;">
            <p class="text-sm leading-loose whitespace-pre-wrap">{{ streamingContent }}</p>
          </div>
        </div>

        <!-- Loading Indicator -->
        <div v-if="isStreaming && !streamingContent" class="message-item message-ai">
          <div class="px-5 py-3" style="background-color: rgba(255,255,255,0.7);">
            <div class="flex space-x-2">
              <div
                class="w-1.5 h-1.5 rounded-full"
                :style="{
                  backgroundColor: globalStore.customThemeColor || '#8FA98F',
                  animation: 'breathe-dot 2.4s ease-in-out infinite'
                }"
              />
              <div
                class="w-1.5 h-1.5 rounded-full"
                :style="{
                  backgroundColor: globalStore.customThemeColor || '#8FA98F',
                  animation: 'breathe-dot 2.4s ease-in-out infinite 0.4s'
                }"
              />
              <div
                class="w-1.5 h-1.5 rounded-full"
                :style="{
                  backgroundColor: globalStore.customThemeColor || '#8FA98F',
                  animation: 'breathe-dot 2.4s ease-in-out infinite 0.8s'
                }"
              />
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- Input Area -->
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
          />
        </div>
        <button
          type="submit"
          :disabled="!inputMessage.trim() || isStreaming"
          class="send-button"
          :class="{ active: inputMessage.trim() && !isStreaming }"
        >
          <svg v-if="!isStreaming" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
          </svg>
          <svg v-else class="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
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
import { streamChatWithAI, chatWithAI } from '@/api/ai'
import SecurityCard from './SecurityCard.vue'
import GroundingFiveSenses from './GroundingFiveSenses.vue'
import WaitingTimer from './WaitingTimer.vue'
import BreathingGuide from './components/BreathingGuide.vue'
import EnergyRetraction from './components/EnergyRetraction.vue'
import SomaticRadar from './components/SomaticRadar.vue'
import InnerChild from './components/InnerChild.vue'
import ListWriting from './components/ListWriting.vue'
import FreeWriting from './components/FreeWriting.vue'
import { startMemoryService } from '@/services/memoryService'
import { audioGroundingEngine } from '@/services/audioService'
import type { HealingComponentType } from '@/types/ai'

const aiChatStore = useAIChatStore()
const globalStore = useGlobalStore()
const userMemoryStore = useUserMemoryStore()

// Refs
const inputRef = ref<HTMLTextAreaElement | null>(null)
const messageListRef = ref<HTMLElement | null>(null)

// State
const inputMessage = ref('')
const isStreaming = ref(false)
const streamingContent = ref('')
const currentStreamingMessageId = ref<string | null>(null)
const isAudioEnabled = ref(false)

// Welcome screen emotion capsules
const emotionCapsules = [
  { text: '☁️ 脑子很乱，停不下来' },
  { text: '✍️ 感觉生活卡壳了，想梳理一下' },
  { text: '🥀 觉得好内耗，很疲惫' },
  { text: '💔 我觉得没有人理解我' },
]

// Handle capsule click - send message directly
const handleCapsuleClick = (text: string) => {
  inputMessage.value = text
  handleSubmit()
}

// Get messages from store
const messages = computed(() => aiChatStore.currentMessages)

/**
 * Format timestamp
 */
const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp)
  return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
}

/**
 * Auto-resize textarea
 */
const autoResize = (event: Event) => {
  const target = event.target as HTMLTextAreaElement
  target.style.height = 'auto'
  target.style.height = `${Math.min(target.scrollHeight, 128)}px`
}

/**
 * Scroll to bottom
 */
const scrollToBottom = async () => {
  await nextTick()
  if (messageListRef.value) {
    messageListRef.value.scrollTop = messageListRef.value.scrollHeight
  }
}

/**
 * Toggle global audio (mute/unmute)
 * 点击静音图标时立即停止所有音频，并阻止新音频播放
 */
const toggleAudio = () => {
  isAudioEnabled.value = !isAudioEnabled.value
  audioGroundingEngine.setMuted(!isAudioEnabled.value)
}

/**
 * Handle completion of healing components
 * 当用户在疗愈组件中点击"完成"时，记录到用户记忆系统
 */
const onHealingComplete = async (messageId: string, event: { completed?: boolean; heartRate?: string }) => {
  console.log('[Chat] Healing component completed:', messageId, event)

  // 获取完成的组件类型
  const session = aiChatStore.sessions.find(s => s.id === aiChatStore.currentSessionId)
  const msg = session?.messages.find(m => m.id === messageId)
  const componentType = msg?.healingComponent

  // 记录里程碑到用户记忆
  if (componentType === 'breathing478') {
    userMemoryStore.addMilestone('完成了4-7-8呼吸练习', 'self_soothing')
  } else if (componentType === 'waitingTimer') {
    userMemoryStore.addMilestone('成功等待了20分钟', 'self_soothing')
  } else if (componentType === 'grounding') {
    userMemoryStore.addMilestone('完成了五感着陆练习', 'self_soothing')
  } else if (componentType === 'energyRetraction') {
    userMemoryStore.addMilestone('进行了能量回收练习', 'self_soothing')
  } else if (componentType === 'somaticRadar') {
    userMemoryStore.addMilestone('进行了躯体觉察练习', 'self_soothing')
  } else if (componentType === 'innerChild') {
    userMemoryStore.addMilestone('与内在小孩对话', 'self_soothing')
  }

  console.log('[Chat] Milestone recorded for component:', componentType)
}

/**
 * Detect healing component based on user message keywords
 */
const detectHealingComponent = (message: string): HealingComponentType => {
  const lowerMsg = message.toLowerCase()

  // 4-7-8 呼吸 / 生理急症 (最高优先级)
  if (/心跳|心跳快|喘不过气|呼吸急促|呼吸困难|大脑空白|惊恐|要疯了|崩溃|胸闷|手脚发麻/.test(lowerMsg)) {
    return 'breathing478'
  }

  // 能量回收 / 行为冲动 (高优先级)
  if (/不发信息会疯|忍不住|控制不住|刷手机|连环发|想去堵|查看已读|能量耗散/.test(lowerMsg)) {
    return 'energyRetraction'
  }

  // 躯体觉察 (中优先级)
  if (/胃部翻腾|喉咙发紧|身体紧绷|说不清为什么|难受/.test(lowerMsg)) {
    return 'somaticRadar'
  }

  // 内在小孩 / 深度创伤 (低优先级)
  if (/没人要|被抛弃|小时候|像个小孩|羞耻感|绝望|内在小孩/.test(lowerMsg)) {
    return 'innerChild'
  }

  // 安全卡 / 日常温补 (最低优先级) - 扩展关键词覆盖更多情况
  if (/他爱不爱|抛弃|不值得|没价值|自我价值|不爱我|不要我了|太敏感|是不是我|心情不好|难过|焦虑|害怕|担心|不安|孤独|寂寞|累|压力大/.test(lowerMsg)) {
    return 'securityCard'
  }

  return null
}

/**
 * Detect healing component based on AI response content keywords
 * This handles cases where AI generates text mentioning components instead of calling tools
 */
const detectHealingComponentFromAI = (content: string): HealingComponentType => {
  const lowerContent = content.toLowerCase()

  if (/478呼吸|4-7-8呼吸|呼吸法|一起做/.test(lowerContent)) {
    return 'breathing478'
  }
  if (/能量回收|把能量收回来|不再外耗/.test(lowerContent)) {
    return 'energyRetraction'
  }
  if (/五感|着陆|看看周围|听听声音|摸摸/.test(lowerContent)) {
    return 'grounding'
  }
  if (/身体在说什么|躯体觉察|感受一下/.test(lowerContent)) {
    return 'somaticRadar'
  }
  if (/内在小孩|小小的你|回到过去/.test(lowerContent)) {
    return 'innerChild'
  }
  if (/安全确认卡|确认卡|踏实感|值得被爱|我的价值/.test(lowerContent)) {
    return 'securityCard'
  }
  if (/等一等|给你20分钟|20分钟后/.test(lowerContent)) {
    return 'waitingTimer'
  }

  return null
}

/**
 * Handle streaming response
 */
const handleStreamingResponse = async (userMessage: string) => {
  let fullContent = ''
  let healingComponent: HealingComponentType = null

  try {
    console.log('[Chat] Starting stream...')
    for await (const chunk of streamChatWithAI({ message: userMessage, sessionId: aiChatStore.currentSessionId || undefined })) {
      fullContent += chunk
      console.log('[Chat] streamingContent updated, chunk length:', chunk.length, 'fullContent length:', fullContent.length)
      streamingContent.value = fullContent
      scrollToBottom()
    }
    console.log('[Chat] Stream complete, final content length:', fullContent.length, 'content preview:', fullContent.substring(0, 50))
  } catch (error: any) {
    console.error('[Chat] Stream error:', error)
    console.log('[Chat] Catch block: __lastHealingComponent at error time:', (window as any).__lastHealingComponent)

    // Check if this is a rate limit error
    const isRateLimit = error?.message?.includes('429') ||
      error?.message?.includes('情绪已经释放得足够多了') ||
      error?.status === 429

    if (isRateLimit) {
      // Don't fallback for rate limit - show the friendly message
      fullContent = error?.response?.data?.message || error?.message || '你今天的情绪已经释放得足够多了，请先休息一下，喝杯水吧。'
    } else {
      // Try non-streaming fallback for other errors
      // But only if no healing component was already triggered (avoid duplicate content)
      const alreadyTriggeredComponent = (window as any).__lastHealingComponent
      if (alreadyTriggeredComponent) {
        console.log('[Chat] Skipping fallback because healing component already set:', alreadyTriggeredComponent)
        // 不要清空 fullContent！保留流式内容，疗愈组件会单独显示
      } else {
        try {
          console.log('[Chat] Attempting fallback to chatWithAI...')
          const response = await chatWithAI({
            message: userMessage,
            sessionId: aiChatStore.currentSessionId || undefined,
            stream: false,
          })
          fullContent = response.content || ''
          console.log('[Chat] Fallback response length:', fullContent.length, 'First 50 chars:', fullContent.substring(0, 50))
        } catch (fallbackError: any) {
          const isFallbackRateLimit = fallbackError?.message?.includes('429') ||
            fallbackError?.message?.includes('情绪已经释放得足够多了') ||
            fallbackError?.status === 429
          console.error('[Chat] Fallback also failed:', fallbackError)
          if (isFallbackRateLimit) {
            fullContent = fallbackError?.response?.data?.message || fallbackError?.message || '你今天的情绪已经释放得足够多了，请先休息一下，喝杯水吧。'
          } else {
            fullContent = '抱歉，服务暂时不可用，请稍后再试。'
          }
        }
      }
    }
  }

  // Check if a healing component was triggered via tool call
  console.log('[Chat] Checking __lastHealingComponent:', (window as any).__lastHealingComponent)
  const triggeredComponent = (window as any).__lastHealingComponent as HealingComponentType | undefined
  if (triggeredComponent) {
    console.log('[Chat] Using triggeredComponent:', triggeredComponent)
    healingComponent = triggeredComponent
    delete (window as any).__lastHealingComponent
    console.log('[Chat] healingComponent set to:', triggeredComponent)
  }

  // If no tool call triggered, check keywords
  if (!healingComponent) {
    healingComponent = detectHealingComponent(userMessage)
    console.log('[Chat] Keyword detection result:', healingComponent)
  }

  // If still no component, check AI response content for component keywords
  if (!healingComponent) {
    healingComponent = detectHealingComponentFromAI(fullContent)
    console.log('[Chat] AI content detection result:', healingComponent)
  }

  return { content: fullContent, healingComponent }
}

/**
 * Handle submit
 */
const handleSubmit = async () => {
  const message = inputMessage.value.trim()
  if (!message || isStreaming.value) return

  try {
    await aiChatStore.addUserMessage(message)
    inputMessage.value = ''

    if (inputRef.value) {
      inputRef.value.style.height = 'auto'
    }

    scrollToBottom()
    isStreaming.value = true
    streamingContent.value = ''

    const { content, healingComponent } = await handleStreamingResponse(message)

    // Check __lastHealingComponent AGAIN after streaming completes
    // because tool_call_result may arrive after streaming ends
    const finalHealingComponent = (window as any).__lastHealingComponent as HealingComponentType | undefined
    const finalListType = (window as any).__lastListType as string | undefined
    let effectiveHealingComponent = healingComponent
    if (finalHealingComponent) {
      console.log('[Chat] Final healing component detected after stream:', finalHealingComponent)
      effectiveHealingComponent = finalHealingComponent
      delete (window as any).__lastHealingComponent
      delete (window as any).__lastListType
    }

    const aiMessage = await aiChatStore.addAIMessage(content)

    if (effectiveHealingComponent) {
      aiChatStore.addHealingComponent(aiMessage.id, effectiveHealingComponent, finalListType)
    }

    // Update user memory - record the user's message as a potential trouble
    userMemoryStore.addTrouble(message)

    // Check if user showed positive progress (keywords in AI response)
    const progressKeywords = ['做得很好', '你进步了', '我为你骄傲', '你很勇敢', '相信自己', 'peace', '平静', '好起来了']
    if (progressKeywords.some(kw => content.includes(kw))) {
      userMemoryStore.addMilestone(message, 'self_soothing')
    }

    streamingContent.value = ''
    isStreaming.value = false

  } catch (error) {
    console.error('[Chat] Error:', error)
    isStreaming.value = false
    streamingContent.value = ''
  }
}

// 长效记忆大脑
let stopMemoryService: (() => void) | null = null

// Initialize
onMounted(async () => {
  userMemoryStore.loadFromStorage()
  // 静默拉取云端记忆（不阻塞 UI，不显示 loading）
  userMemoryStore.syncFromSupabase()
  await aiChatStore.loadFromStorage()

  if (!aiChatStore.currentSessionId) {
    aiChatStore.createSession()
  }

  await nextTick()

  // Scroll to bottom after messages loaded
  scrollToBottom()
  if (inputRef.value) {
    inputRef.value.focus()
  }

  // 启动长效记忆大脑
  stopMemoryService = startMemoryService()
})

onUnmounted(() => {
  if (stopMemoryService) {
    stopMemoryService()
    stopMemoryService = null
  }
})

// Watch messages - scroll to bottom when messages change
watch(() => messages.value.length, () => {
  nextTick(() => scrollToBottom())
}, { deep: true })

// Also watch for the actual messages array to handle reload from storage
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
  border-radius: 50%;
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
  border-radius: 50%;
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
}
.send-button.active {
  background: #8FA98F;
  color: rgba(255, 255, 255, 0.9);
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
