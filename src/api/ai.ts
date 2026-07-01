import type { ChatMessage } from '@/types/ai'
import { simulateNetworkDelay } from '@/utils/mock'

export type ColorScheme = 'calm' | 'warm' | 'fresh' | 'serene' | 'natural' | 'default'

export type EmotionType = 'anxiety' | 'depression' | 'stress' | 'anger' | 'fear' | 'loneliness' | 'neutral'

export interface EmotionResult {
  success: boolean
  emotion?: EmotionType
  intensity?: number
  colorScheme?: ColorScheme
  reason?: string
  message?: string
  error?: string
}

/**
 * AI Chat Request Params
 */
export interface AIChatParams {
  message: string
  sessionId?: string
}

/**
 * AI Chat Response
 */
export interface AIChatResponse {
  messageId: string
  content: string
  sessionId: string
  usage?: {
    input_tokens: number
    output_tokens: number
    total_tokens: number
  }
}

/**
 * Backend API URL from environment
 */
const BACKEND_API_URL = import.meta.env.VITE_BACKEND_API_URL || 'http://127.0.0.1:8787'

/**
 * Access code from environment
 */
const ACCESS_CODE = localStorage.getItem('access_code') || import.meta.env.VITE_ACCESS_CODE || ''

/**
 * Enable real AI backend or use mock
 */
const ENABLE_REAL_AI = true

/**
 * Mock AI responses for common questions
 */
const mockResponses: Record<string, string[]> = {
  greeting: [
    '你好！我是你的 AI 助手，有什么可以帮助你的吗？😊',
    '嗨！很高兴见到你，今天想聊些什么呢？',
    '你好呀！有什么问题或者想法想要分享吗？',
  ],
  whoami: [
    '我是一个基于人工智能的聊天助手，可以回答你的问题、提供帮助或只是聊聊天。虽然我现在还是个演示版本，但我会尽力帮助你！',
    '我是你的智能助手，由先进的 AI 技术驱动。我可以帮助你解答问题、提供建议，或者简单地陪你聊天。',
  ],
  weather: [
    '我暂时无法获取实时天气信息，建议你查看手机天气应用或访问 weather.com 获取最新天气预报。☀️🌧️',
    '抱歉，我目前还不能查询实时天气。不过你可以试试对手机说"嘿 Siri"或"OK Google"来查询天气哦！',
  ],
  time: [
    `现在的时间是 ${new Date().toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })}。⏰`,
    `让我看看...现在是 ${new Date().toLocaleTimeString('zh-CN')}。时间过得真快呀！`,
  ],
  help: [
    '我可以帮助你：\n\n1. 📝 回答各种问题\n2. 💡 提供建议和想法\n3. 💬 进行有趣的对话\n4. 🔍 协助解决问题\n5. 📊 提供信息和知识\n\n请随时告诉我你需要什么帮助！',
    '我很乐意帮助你！我可以：\n• 解答知识性问题\n• 提供创意和建议\n• 进行日常对话\n• 协助分析问题\n\n有什么想问的吗？',
  ],
  thanks: [
    '不客气！如果还有其他问题，随时问我哦！😊',
    '很高兴能帮到你！有需要尽管开口～',
    '应该的！祝你一切顺利！🎉',
  ],
  joke: [
    '为什么程序员总是分不清万圣节和圣诞节？因为 Oct 31 == Dec 25！😄 懂了吗？（提示：Oct 是八进制，Dec 是十进制）',
    '有一天，0 在街上遇到了 8，0 不屑地看了 8 一眼说："胖就了不起啊，还系腰带！" 😂',
    '你知道为什么数学书总是很忧郁吗？因为它有太多的"问题"了！📚',
  ],
  default: [
    '感谢你的消息！我收到了："{{message}}"\n\n这是一个演示版本，我的功能还在开发中。不过我会继续学习和进步的！💪',
    '我明白了，你说的是："{{message}}"\n\n目前我还是个简化版本，主要展示界面交互功能。期待未来能接入真正的 AI 模型为你提供更智能的服务！🤖',
    '收到你的消息啦！内容是："{{message}}"\n\n虽然现在我只能简单回复，但我正在努力学习中。相信不久的将来，我能更好地帮助你！✨',
  ],
}

/**
 * Get random response from category
 */
function getRandomResponse(category: string): string {
  const responses = mockResponses[category] || mockResponses.default
  return responses[Math.floor(Math.random() * responses.length)]
}

/**
 * Analyze message and get appropriate response
 */
export function analyzeMessage(message: string): string {
  const lowerMessage = message.toLowerCase()

  if (/^(hi|hello|hey|你好 | 早上好 | 下午好 | 晚上好)/i.test(lowerMessage)) {
    return getRandomResponse('greeting')
  }
  if (/(who are you|你是谁 | 你是什么)/i.test(lowerMessage)) {
    return getRandomResponse('whoami')
  }
  if (/(weather|天气 | 今天.*雨 | 明天.*晴)/i.test(lowerMessage)) {
    return getRandomResponse('weather')
  }
  if (/(what time|几点了 | 现在.*时间 | today.*date|今天.*号)/i.test(lowerMessage)) {
    return getRandomResponse('time')
  }
  if (/(help|帮助 | 你能.*什么 | 可以.*什么)/i.test(lowerMessage)) {
    return getRandomResponse('help')
  }
  if (/(thank|谢谢 | 感谢 | thx)/i.test(lowerMessage)) {
    return getRandomResponse('thanks')
  }
  if (/(joke|笑话 | 搞笑 | 逗我)/i.test(lowerMessage)) {
    return getRandomResponse('joke')
  }

  const defaultResponse = getRandomResponse('default')
  return defaultResponse.replace('{{message}}', message)
}

/**
 * Send message to AI and get non-streaming response.
 * Used for backend tasks like summarization.
 */
export async function chatWithAI(params: AIChatParams): Promise<AIChatResponse> {
  if (!ENABLE_REAL_AI) {
    await simulateNetworkDelay(1000, 2000)
    const response = analyzeMessage(params.message)

    return {
      messageId: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      content: response,
      sessionId: params.sessionId || `session-${Date.now()}`,
    }
  }

  try {
    const response = await fetch(`${BACKEND_API_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(ACCESS_CODE ? { 'x-access-code': ACCESS_CODE } : {}),
      },
      body: JSON.stringify({
        message: params.message,
        sessionId: params.sessionId,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('[AI API Error]', response.status, errorData)

      if (response.status === 401) {
        throw new Error('访问暗号不正确，请刷新页面重新验证')
      }
      if (response.status === 429) {
        throw new Error('请求过于频繁，请稍后再试')
      }
      throw new Error(errorData.message || `请求失败：${response.status}`)
    }

    const data = await response.json()

    return {
      messageId: data.messageId,
      content: data.content || '',
      sessionId: data.sessionId,
      usage: data.usage,
    }
  } catch (error) {
    console.error('[AI API Error]', error)
    const mockResponse = analyzeMessage(params.message)
    return {
      messageId: `msg-${Date.now()}`,
      content: `[服务暂时不可用]\n\n${mockResponse}`,
      sessionId: params.sessionId || `session-${Date.now()}`,
    }
  }
}

/**
 * Mock AI chat function for simple usage (kept for compatibility)
 */
export async function mockChatWithAI(message: string): Promise<string> {
  if (!ENABLE_REAL_AI) {
    await simulateNetworkDelay(800, 1500)
    return analyzeMessage(message)
  }
  const result = await chatWithAI({ message })
  return result.content
}
