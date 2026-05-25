/**
 * 记忆淬炼服务 (Memory Quenching Service)
 *
 * 后台静默运行，当对话轮数超过4轮或对话中断超过3分钟时，
 * 自动调用 LLM 提炼用户的焦虑触发点和自我安抚努力，更新到 userMemory。
 */

import { useAIChatStore } from '@/stores/aiChat'
import { useUserMemoryStore } from '@/stores/userMemory'

const BACKEND_API_URL = import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:3000'

// 配置参数
const ROUND_THRESHOLD = 4      // 对话轮数阈值（用户+AI=1轮）
const IDLE_THRESHOLD = 3 * 60 * 1000  // 3分钟（毫秒）

// 状态
let lastActivityTime = 0
let pendingRoundCount = 0
let isProcessing = false
let idleTimer: ReturnType<typeof setTimeout> | null = null
let roundCounter = { user: 0, ai: 0 }

/**
 * 重置轮数计数器
 */
function resetRoundCounter() {
  roundCounter = { user: 0, ai: 0 }
  pendingRoundCount = 0
}

/**
 * 增加对话轮次计数
 */
function incrementRound(role: 'user' | 'ai') {
  if (role === 'user') {
    roundCounter.user++
  } else {
    roundCounter.ai++
  }

  // 一次完整的对话轮 = 用户说了一句 + AI回复了一句
  pendingRoundCount = Math.min(roundCounter.user, roundCounter.ai)

  console.log(`[MemoryQuenching] Round count: user=${roundCounter.user}, ai=${roundCounter.ai}, pending=${pendingRoundCount}`)
}

/**
 * 更新最后活动时间
 */
function updateLastActivity() {
  lastActivityTime = Date.now()

  // 清除旧的 idle timer
  if (idleTimer !== null) {
    clearTimeout(idleTimer)
    idleTimer = null
  }

  // 设置新的 idle timer
  idleTimer = setTimeout(() => {
    console.log('[MemoryQuenching] Idle timeout reached, triggering淬炼...')
    triggerQuenching()
  }, IDLE_THRESHOLD)
}

/**
 * 触发记忆淬炼
 */
async function triggerQuenching() {
  if (isProcessing) {
    console.log('[MemoryQuenching] Already processing, skipping...')
    return
  }

  const aiChatStore = useAIChatStore()
  const userMemoryStore = useUserMemoryStore()

  const session = aiChatStore.currentSession
  if (!session || session.messages.length < 2) {
    console.log('[MemoryQuenching] Not enough messages, skipping...')
    return
  }

  isProcessing = true

  try {
    // 获取当前会话的所有消息
    const messages = session.messages.slice(-10) // 取最近10条

    // 构造 summarization prompt
    const conversationText = messages
      .map(m => `${m.role === 'user' ? '用户' : 'AI'}: ${m.content}`)
      .join('\n')

    console.log('[MemoryQuenching] Calling LLM to summarize...')

    const response = await fetch(`${BACKEND_API_URL}/api/summarize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        conversation: conversationText,
        timestamp: Date.now()
      }),
    })

    if (!response.ok) {
      throw new Error(`Summarization failed: ${response.status}`)
    }

    const result = await response.json()

    console.log('[MemoryQuenching] Received summary:', result)

    // 解析并更新 userMemory
    if (result.triggers && result.triggers.length > 0) {
      for (const trigger of result.triggers) {
        userMemoryStore.addTrigger({
          content: trigger,
          category: detectCategory(trigger),
        })
      }
    }

    if (result.selfSoothingEfforts && result.selfSoothingEfforts.length > 0) {
      for (const effort of result.selfSoothingEfforts) {
        userMemoryStore.addSelfSoothingEffort({
          content: effort,
        })
      }
    }

    console.log('[MemoryQuenching] Memory updated successfully')

  } catch (error) {
    console.error('[MemoryQuenching] Error during summarization:', error)
  } finally {
    isProcessing = false
    resetRoundCounter()
  }
}

/**
 * 根据触发点内容推测分类
 */
function detectCategory(trigger: string): string {
  const text = trigger.toLowerCase()
  if (text.includes('抛弃') || text.includes('离开') || text.includes('分手')) {
    return 'abandonment'
  }
  if (text.includes('价值') || text.includes('不值得') || text.includes('配不上')) {
    return 'selfWorth'
  }
  if (text.includes('焦虑') || text.includes('担心') || text.includes('害怕')) {
    return 'anxiety'
  }
  if (text.includes('控制') || text.includes('冲动') || text.includes('忍不住')) {
    return 'impulse'
  }
  return 'general'
}

/**
 * 启动记忆淬炼监控
 */
export function startMemoryQuenching() {
  const aiChatStore = useAIChatStore()

  // 订阅消息变化
  const unsubscribe = aiChatStore.$subscribe((mutation, state) => {
    // 只监听当前会话的消息变化
    if (state.currentSessionId) {
      const session = state.sessions.find(s => s.id === state.currentSessionId)
      if (session && session.messages.length > 0) {
        const lastMessage = session.messages[session.messages.length - 1]
        incrementRound(lastMessage.role as 'user' | 'ai')
        updateLastActivity()

        // 检查是否达到轮数阈值
        if (pendingRoundCount >= ROUND_THRESHOLD) {
          console.log(`[MemoryQuenching] Reached ${ROUND_THRESHOLD} rounds, triggering quenching...`)
          triggerQuenching()
        }
      }
    }
  })

  // 初始化最后活动时间
  updateLastActivity()

  console.log('[MemoryQuenching] Service started')

  // 返回停止函数
  return () => {
    unsubscribe()
    if (idleTimer !== null) {
      clearTimeout(idleTimer)
    }
    console.log('[MemoryQuenching] Service stopped')
  }
}

/**
 * 手动触发一次淬炼（供外部调用）
 */
export async function manualTriggerQuenching(): Promise<void> {
  await triggerQuenching()
}