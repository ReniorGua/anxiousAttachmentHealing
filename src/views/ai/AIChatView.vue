<template>
  <div class="flex flex-col h-full" style="background-color: #FAFAF8;">
    <!-- Header -->
    <header
      class="flex items-center justify-center px-4 py-5 flex-shrink-0"
      :style="{ backgroundColor: globalStore.customThemeColor || '#8FA98F' }"
    >
      <h1 class="text-base font-light text-white tracking-widest opacity-90">疗心舍</h1>
    </header>

    <!-- Chat Messages Area -->
    <div class="flex-1 overflow-hidden flex flex-col">
      <div
        ref="messagesContainer"
        class="flex-1 overflow-y-auto px-5 py-8 space-y-8"
      >
        <!-- Empty State -->
        <div v-if="messages.length === 0 && !streamingContent" class="flex flex-col items-center justify-center h-full text-center">
          <div class="w-14 h-14 mb-6 rounded-full flex items-center justify-center" style="background-color: rgba(143, 169, 143, 0.12);">
            <span class="text-2xl opacity-60">✿</span>
          </div>
          <h3 class="text-base font-light mb-2 tracking-wide" style="color: #5A5A4E;">欢迎来到疗心舍</h3>
          <p class="text-sm font-light max-w-xs leading-loose" style="color: #8A8A7E;">
            我在这里倾听你的声音。无论何时，我都会用温暖和理解陪伴你。
          </p>
        </div>

        <!-- Messages -->
        <template v-for="message in messages" :key="message.id">
          <!-- User Message -->
          <div v-if="message.role === 'user'" class="flex justify-end">
            <div
              class="max-w-[80%] px-5 py-3 text-white rounded-none"
              :style="{ backgroundColor: globalStore.customThemeColor || '#8FA98F' }"
            >
              <p class="text-sm leading-loose whitespace-pre-wrap opacity-90">{{ message.content }}</p>
            </div>
          </div>

          <!-- AI Message with optional Healing Component -->
          <div v-else class="flex justify-start flex-col">
            <div class="max-w-[80%] px-5 py-3" style="background-color: rgba(255,255,255,0.7); color: #4A4A3E;">
              <p class="text-sm leading-loose whitespace-pre-wrap">{{ message.content }}</p>
              <p class="text-xs mt-2 opacity-40 tracking-wider">{{ formatTime(message.timestamp) }}</p>
            </div>

            <!-- Healing Component - 缓慢显影效果 -->
            <Transition name="photo-dev">
              <div v-if="message.healingComponent" class="mt-5 max-w-[80%]">
                <SecurityCard v-if="message.healingComponent === 'securityCard'" />
                <GroundingFiveSenses v-if="message.healingComponent === 'grounding'" />
                <WaitingTimer v-if="message.healingComponent === 'waitingTimer'" />
              </div>
            </Transition>
          </div>
        </template>

        <!-- Streaming Message -->
        <div v-if="streamingContent" class="flex justify-start">
          <div class="max-w-[80%] px-5 py-3" style="background-color: rgba(255,255,255,0.7); color: #4A4A3E;">
            <p class="text-sm leading-loose whitespace-pre-wrap">{{ streamingContent }}</p>
          </div>
        </div>

        <!-- Loading Indicator - 缓慢呼吸的三个点 -->
        <div v-if="isStreaming && !streamingContent" class="flex justify-start">
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
    <div class="px-4 py-4 flex-shrink-0" style="background-color: rgba(255,255,254,0.9); border-top: 1px solid rgba(0,0,0,0.04);">
      <form @submit.prevent="handleSubmit" class="flex items-end gap-3">
        <div class="flex-1">
          <textarea
            ref="inputRef"
            v-model="inputMessage"
            :placeholder="isStreaming ? '思考中...' : '说点什么...'"
            :disabled="isStreaming"
            rows="1"
            class="w-full px-4 py-3 resize-none focus:outline-none text-sm max-h-32"
            style="
              background: transparent;
              border: none;
              border-bottom: 1px solid rgba(0,0,0,0.08);
              color: #4A4A3E;
              letter-spacing: 0.02em;
            "
            @focus="(e: FocusEvent) => ((e.target as HTMLTextAreaElement).style.borderBottomColor = `rgba(143, 169, 143, 0.4)`)"
            @blur="(e: FocusEvent) => ((e.target as HTMLTextAreaElement).style.borderBottomColor = 'rgba(0,0,0,0.08)')"
            @input="autoResize"
            @keydown.enter.exact.prevent="handleSubmit"
          />
        </div>
        <button
          type="submit"
          :disabled="!inputMessage.trim() || isStreaming"
          class="w-11 h-11 flex items-center justify-center rounded-none transition-all opacity-80"
          :style="{
            backgroundColor: inputMessage.trim() && !isStreaming ? (globalStore.customThemeColor || '#8FA98F') : 'rgba(0,0,0,0.04)',
            color: inputMessage.trim() && !isStreaming ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.25)',
          }"
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
import { startMemoryService } from '@/services/memoryService'
import type { HealingComponentType } from '@/types/ai'

const aiChatStore = useAIChatStore()
const globalStore = useGlobalStore()
const userMemoryStore = useUserMemoryStore()

// Refs
const inputRef = ref<HTMLTextAreaElement | null>(null)
const messagesContainer = ref<HTMLElement | null>(null)

// State
const inputMessage = ref('')
const isStreaming = ref(false)
const streamingContent = ref('')
const currentStreamingMessageId = ref<string | null>(null)

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
const scrollToBottomImmediate = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

/**
 * Detect healing component based on user message keywords
 */
const detectHealingComponent = (message: string): HealingComponentType => {
  const lowerMsg = message.toLowerCase()

  if (/心跳|心跳快|喘不过气|呼吸急促|呼吸困难|大脑空白|惊恐|很怕|害怕/.test(lowerMsg)) {
    return 'grounding'
  }

  if (/他爱不爱|抛弃|不值得|没价值|自我价值|不爱我|不要我了/.test(lowerMsg)) {
    return 'securityCard'
  }

  if (/现在就找他|马上找他|不发信息会疯|忍不住|控制不住/.test(lowerMsg)) {
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
      streamingContent.value = fullContent
      scrollToBottomImmediate()
    }
    console.log('[Chat] Stream complete, content length:', fullContent.length)
  } catch (error: any) {
    // Check if this is a rate limit error
    const isRateLimit = error?.message?.includes('429') ||
      error?.message?.includes('情绪已经释放得足够多了') ||
      error?.status === 429

    console.error('[Chat] Stream error:', error)

    if (isRateLimit) {
      // Don't fallback for rate limit - show the friendly message
      fullContent = error?.response?.data?.message || error?.message || '你今天的情绪已经释放得足够多了，请先休息一下，喝杯水吧。'
    } else {
      // Try non-streaming fallback for other errors
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

  // Check if a healing component was triggered via tool call
  const triggeredComponent = (window as any).__lastHealingComponent as HealingComponentType | undefined
  if (triggeredComponent) {
    healingComponent = triggeredComponent
    delete (window as any).__lastHealingComponent
  }

  // If no tool call triggered, check keywords
  if (!healingComponent) {
    healingComponent = detectHealingComponent(userMessage)
    console.log('[Chat] Keyword detection result:', healingComponent)
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

    scrollToBottomImmediate()
    isStreaming.value = true
    streamingContent.value = ''

    const { content, healingComponent } = await handleStreamingResponse(message)

    const aiMessage = await aiChatStore.addAIMessage(content)

    if (healingComponent) {
      aiChatStore.addHealingComponent(aiMessage.id, healingComponent)
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

  // Use requestAnimationFrame to ensure browser has painted before scrolling
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      if (messagesContainer.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
      }
      if (inputRef.value) {
        inputRef.value.focus()
      }
    })
  })

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
  nextTick(() => scrollToBottomImmediate())
}, { deep: true })

// Also watch for the actual messages array to handle reload from storage
watch(() => aiChatStore.sessions, () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
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

/* 呼吸dot动画 - 替代bounce */
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
</style>
