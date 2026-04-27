/**
 * 长效记忆大脑 (Long-Term Memory Service)
 *
 * 后台静默运行：
 * 1. 用户发送超过 3 条消息后，自动异步调用 Qwen 提炼焦虑触发点与力量
 * 2. 用户离开页面 / 切换窗口时，同样触发提炼
 * 3. 结果增量更新到 userMemory（不覆盖旧记忆，自动去重）
 * 全程无 Loading、无弹窗
 */

import { useAIChatStore } from '@/stores/aiChat'
import { useUserMemoryStore } from '@/stores/userMemory'

const BACKEND_API_URL = import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:3000'
const ACCESS_CODE = import.meta.env.VITE_ACCESS_CODE || ''

// 触发阈值：用户发送 N 条消息后
const MESSAGE_THRESHOLD = 3

// 状态
let userMessageCount = 0
let isProcessing = false
let visibilityCleanup: (() => void) | null = null

/**
 * 调用 Qwen API，提炼情绪洞察
 * System Prompt：悲悯的心理观察者
 */
async function extractEmotionalInsights(
  conversationText: string
): Promise<{ triggers: string[]; strengths: string[] } | null> {
  const systemPrompt = `你是一位悲悯的心理观察者。请从这段对话中提取：
① 用户的核心焦虑触发点（如：对方没回消息、自我怀疑、害怕被抛弃等），类型限缩在：abandonment（被抛弃/不被爱）/ selfWorth（自我价值）/ anxiety（过度担忧）/ impulse（冲动行为）/ general（一般焦虑）
② 用户展现出的力量（如：尝试了呼吸练习、表达了觉察、主动求助、尝试自我安抚等）
输出必须是标准 JSON 格式，不要有额外文字：
{"triggers":[{"content":"...","category":"..."}],"strengths":[{"content":"..."}]}
若对话内容不足或无法提炼，返回 {"triggers":[],"strengths":[]}`

  try {
    const response = await fetch(`${BACKEND_API_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(ACCESS_CODE ? { 'X-Access-Code': ACCESS_CODE } : {}),
      },
      body: JSON.stringify({
        message: conversationText,
        systemPrompt,
        stream: false,
      }),
    })

    if (!response.ok) {
      console.warn('[MemoryService] Qwen API error:', response.status)
      return null
    }

    const data = await response.json()
    const raw = data.content || data.text || ''

    // 尝试解析 JSON
    const jsonMatch = raw.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      console.warn('[MemoryService] No JSON found in response:', raw.substring(0, 100))
      return null
    }

    const parsed = JSON.parse(jsonMatch[0])
    return {
      triggers: Array.isArray(parsed.triggers) ? parsed.triggers : [],
      strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
    }
  } catch (e) {
    console.error('[MemoryService] extractEmotionalInsights failed:', e)
    return null
  }
}

/**
 * 检查内容是否与现有记录重复（去重）
 */
function isDuplicate(
  newContent: string,
  existingRecords: Array<{ content: string }>
): boolean {
  return existingRecords.some(
    (r) => r.content.trim() === newContent.trim()
  )
}

/**
 * 增量更新 triggers（去重）
 */
function mergeTriggers(
  newTriggers: Array<{ content: string; category?: string }>
) {
  const store = useUserMemoryStore()
  for (const t of newTriggers) {
    if (!t.content || isDuplicate(t.content, store.triggers)) continue
    store.addTrigger({
      content: t.content.trim(),
      category: t.category || 'general',
    })
  }
}

/**
 * 增量更新 strengths（去重）
 */
function mergeStrengths(
  newStrengths: Array<{ content: string }>
) {
  const store = useUserMemoryStore()
  for (const s of newStrengths) {
    if (!s.content || isDuplicate(s.content, store.selfSoothingEfforts)) continue
    store.addSelfSoothingEffort({
      content: s.content.trim(),
    })
  }
}

/**
 * 触发一次记忆提炼
 */
async function triggerQuenching() {
  if (isProcessing) return

  const chatStore = useAIChatStore()
  const session = chatStore.currentSession
  if (!session || session.messages.length < 2) return

  isProcessing = true

  try {
    // 取最近至多 10 条消息
    const messages = session.messages.slice(-10)
    const conversationText = messages
      .map((m) => `${m.role === 'user' ? '用户' : 'AI'}: ${m.content}`)
      .join('\n')

    const result = await extractEmotionalInsights(conversationText)
    if (!result) return

    if (result.triggers.length > 0) {
      mergeTriggers(result.triggers)
    }
    if (result.strengths.length > 0) {
      mergeStrengths(result.strengths)
    }

    console.log('[MemoryService] 记忆提炼完成', {
      triggers: result.triggers.length,
      strengths: result.strengths.length,
    })
  } catch (e) {
    console.error('[MemoryService] triggerQuenching error:', e)
  } finally {
    isProcessing = false
  }
}

/**
 * 注册页面可见性变化监听（用户离开/切换窗口时触发）
 */
function setupVisibilityListener() {
  const handler = () => {
    if (document.visibilityState === 'hidden') {
      console.log('[MemoryService] Page hidden, triggering quenching...')
      triggerQuenching()
    }
  }

  document.addEventListener('visibilitychange', handler)
  visibilityCleanup = () => {
    document.removeEventListener('visibilitychange', handler)
    visibilityCleanup = null
  }
}

/**
 * 启动记忆服务
 */
export function startMemoryService() {
  const chatStore = useAIChatStore()

  // 监听消息变化
  const unsubscribe = chatStore.$subscribe((mutation, state) => {
    if (!state.currentSessionId) return
    const session = state.sessions.find((s) => s.id === state.currentSessionId)
    if (!session) return

    // 只在用户消息时计数
    const lastMsg = session.messages[session.messages.length - 1]
    if (lastMsg?.role === 'user') {
      userMessageCount++
      console.log(`[MemoryService] 用户消息计数: ${userMessageCount}`)

      if (userMessageCount >= MESSAGE_THRESHOLD) {
        userMessageCount = 0 // 重置，避免重复触发
        triggerQuenching()
      }
    }
  })

  // 注册可见性监听
  setupVisibilityListener()

  console.log('[MemoryService] 长效记忆大脑已启动')

  return () => {
    unsubscribe()
    if (visibilityCleanup) visibilityCleanup()
    console.log('[MemoryService] 长效记忆大脑已停止')
  }
}

/**
 * 手动触发一次提炼（供外部调用）
 */
export async function manualTriggerMemory(): Promise<void> {
  await triggerQuenching()
}
