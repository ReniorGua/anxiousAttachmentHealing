import type { ChatMessage } from '@/types/ai'
import { simulateNetworkDelay } from '@/utils/mock'
import { useGlobalStore } from '@/stores/global'
import { useUserMemoryStore } from '@/stores/userMemory'

export type ColorScheme = 'calm' | 'warm' | 'fresh' | 'serene' | 'natural' | 'default'

export type EmotionType = 'anxiety' | 'depression' | 'stress' | 'anger' | 'fear' | 'loneliness' | 'neutral'

export interface HealingAtmosphereResult {
  success: boolean
  themeColor?: string  // hex color
  backgroundMusic?: string  // URL
  initialComfort?: string  // short comforting message
  emotion?: string
  message?: string
  error?: string
}

export interface EmotionResult {
  success: boolean
  emotion?: EmotionType
  intensity?: number
  colorScheme?: ColorScheme
  reason?: string
  message?: string
  error?: string
}

export interface ToolCallResult {
  toolName: string
  result: HealingAtmosphereResult | EmotionResult
}

// Global type for emotion analysis result (set by API, read by component)
declare global {
  interface Window {
    __lastEmotionResult?: {
      emotion: EmotionType
      intensity?: number
      colorScheme?: ColorScheme
    }
    __lastHealingComponent?: 'securityCard' | 'grounding' | 'waitingTimer'
  }
}

/**
 * AI Chat Request Params
 */
export interface AIChatParams {
  message: string
  sessionId?: string
  stream?: boolean
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
  toolCalls?: ToolCallResult[]
}

/**
 * Backend API URL from environment
 */
const BACKEND_API_URL = import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:3000'

/**
 * Access code from environment
 * Sent in header for server-side verification
 */
const ACCESS_CODE = import.meta.env.VITE_ACCESS_CODE || ''

/**
 * Enable real AI backend or use mock
 * Set to true to use DashScope API via backend proxy
 * Set to false to use mock responses
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
    '感谢你的消息！我收到了："{{message}}"\n\n这是一个演示版本，我的功能还在开发中。要使用完整的 AI 功能，需要配置后端的 AI 服务接口。不过我会继续学习和进步的！💪',
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
  
  // Greeting
  if (/^(hi|hello|hey|你好 | 早上好 | 下午好 | 晚上好)/i.test(lowerMessage)) {
    return getRandomResponse('greeting')
  }
  
  // Who are you
  if (/(who are you|你是谁 | 你是什么)/i.test(lowerMessage)) {
    return getRandomResponse('whoami')
  }
  
  // Weather
  if (/(weather|天气 | 今天.*雨 | 明天.*晴)/i.test(lowerMessage)) {
    return getRandomResponse('weather')
  }
  
  // Time
  if (/(what time|几点了 | 现在.*时间 | today.*date|今天.*号)/i.test(lowerMessage)) {
    return getRandomResponse('time')
  }
  
  // Help
  if (/(help|帮助 | 你能.*什么 | 可以.*什么)/i.test(lowerMessage)) {
    return getRandomResponse('help')
  }
  
  // Thanks
  if (/(thank|谢谢 | 感谢 | thx)/i.test(lowerMessage)) {
    return getRandomResponse('thanks')
  }
  
  // Joke
  if (/(joke|笑话 | 搞笑 | 逗我)/i.test(lowerMessage)) {
    return getRandomResponse('joke')
  }
  
  // Default response with message interpolation
  const defaultResponse = getRandomResponse('default')
  return defaultResponse.replace('{{message}}', message)
}

/**
 * Send message to AI and get response - Real Backend Implementation
 * Calls backend proxy which forwards to DashScope Qwen API
 */
export async function chatWithAI(params: AIChatParams): Promise<AIChatResponse> {
  const globalStore = useGlobalStore()
  const userMemoryStore = useUserMemoryStore()

  // Read memory context from localStorage and format as system prompt
  userMemoryStore.loadFromStorage()
  const memoryContext = userMemoryStore.getContextSummary()

  // If real AI is disabled, use mock
  if (!ENABLE_REAL_AI) {
    await simulateNetworkDelay(1000, 2000)
    const response = analyzeMessage(params.message)

    console.log('[Mock AI] Chat request:', {
      message: params.message,
      sessionId: params.sessionId,
      response: response.substring(0, 50) + '...'
    })

    return {
      messageId: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      content: response,
      sessionId: params.sessionId || `session-${Date.now()}`,
    }
  }

  try {
    console.log('[Real AI] Sending request to backend:', {
      message: params.message.substring(0, 50) + '...',
      sessionId: params.sessionId,
      stream: params.stream,
      hasMemoryContext: !!memoryContext,
    })

    const response = await fetch(`${BACKEND_API_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(ACCESS_CODE ? { 'X-Access-Code': ACCESS_CODE } : {}),
      },
      body: JSON.stringify({
        message: params.message,
        systemPrompt: memoryContext,
        sessionId: params.sessionId,
        stream: params.stream || false,
      }),
    })

    console.log('[Real AI] Non-streaming response status:', response.status)

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

    console.log('[Real AI] Full response data:', JSON.stringify(data).substring(0, 500))
    console.log('[Real AI] Response received:', {
      messageId: data.messageId,
      contentLength: data.content ? data.content.length : 0,
      contentPreview: data.content ? data.content.substring(0, 100) : 'EMPTY',
      toolCalls: data.toolCalls,
      usage: data.usage,
    })

    // Handle tool calls from response
    if (data.toolCalls && data.toolCalls.length > 0) {
      console.log('[Real AI] Tool calls in response:', JSON.stringify(data.toolCalls))

      for (const toolCall of data.toolCalls) {
        console.log('[Real AI] Processing tool:', toolCall.toolName, 'success:', toolCall.result?.success)
        if (toolCall.toolName === 'apply_healing_atmosphere' && toolCall.result?.success) {
          const result = toolCall.result as HealingAtmosphereResult
          const { themeColor, backgroundMusic, initialComfort, emotion } = result

          console.log('[Real AI] Healing atmosphere result:', { themeColor, backgroundMusic, initialComfort, emotion })

          // Apply healing atmosphere immediately
          if (themeColor) {
            console.log('[Real AI] Calling applyHealingAtmosphere...')
            globalStore.applyHealingAtmosphere(themeColor, backgroundMusic, initialComfort)
            console.log('[Real AI] applyHealingAtmosphere called')
          }
        }

        // Handle ALL healing component tools (new and legacy names)
        const healingToolNames = [
          'showSecurityCard', 'showGrounding', 'showWaitingTimer',
          'trigger_478_breathing', 'trigger_energy_retraction',
          'trigger_somatic_radar', 'trigger_inner_child', 'trigger_security_card'
        ]
        if (healingToolNames.includes(toolCall.toolName) && toolCall.result?.success) {
          const result = toolCall.result as any
          if (result.component) {
            window.__lastHealingComponent = result.component
            console.log('[Real AI] Healing component stored:', result.component)
          }
        }
      }
    } else {
      console.log('[Real AI] No tool calls in response')
    }

    return {
      messageId: data.messageId,
      content: data.content,
      sessionId: data.sessionId,
      usage: data.usage,
      toolCalls: data.toolCalls,
    }
  } catch (error) {
    console.error('[AI API Error]', error)

    // Always fallback to mock on any error
    console.warn('[AI API] Falling back to mock response')
    const mockResponse = analyzeMessage(params.message)
    return {
      messageId: `msg-${Date.now()}`,
      content: `[服务暂时不可用]\n\n${mockResponse}`,
      sessionId: params.sessionId || `session-${Date.now()}`,
    }
  }
}

/**
 * Stream chat response from AI
 * Returns a ReadableStream for processing streaming responses
 * Tool calls are executed automatically during streaming
 */
export async function* streamChatWithAI(params: AIChatParams): AsyncGenerator<string, void, unknown> {
  const globalStore = useGlobalStore()
  const userMemoryStore = useUserMemoryStore()

  // Read memory context from localStorage
  userMemoryStore.loadFromStorage()
  const memoryContext = userMemoryStore.getContextSummary()

  if (!ENABLE_REAL_AI) {
    // Mock streaming for demo
    const response = analyzeMessage(params.message)
    const words = response.split('')

    for (const word of words) {
      yield word
      await simulateNetworkDelay(50, 100)
    }
    return
  }

  try {
    console.log('[Stream AI] Sending request to backend...')

    const response = await fetch(`${BACKEND_API_URL}/api/chat/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(ACCESS_CODE ? { 'X-Access-Code': ACCESS_CODE } : {}),
      },
      body: JSON.stringify({
        message: params.message,
        systemPrompt: memoryContext,
        sessionId: params.sessionId,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('[Stream AI] Error response:', response.status, errorData)
      throw new Error(`Streaming failed: ${response.status} - ${errorData.message || 'Unknown error'}`)
    }

    const reader = response.body?.getReader()
    if (!reader) {
      throw new Error('ReadableStream not supported')
    }

    const decoder = new TextDecoder()
    let buffer = ''

    try {
      while (true) {
        const { done, value } = await reader.read()

        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        buffer += chunk

        // Process complete lines
        const lines = buffer.split('\n')
        buffer = lines.pop() || '' // Keep incomplete line in buffer

        for (const line of lines) {
          const trimmedLine = line.trim()

          // Skip empty lines and comments
          if (!trimmedLine || trimmedLine.startsWith(':')) {
            continue
          }

          // Parse SSE data
          if (trimmedLine.startsWith('data:')) {
            const data = trimmedLine.slice(5).trim()

            console.log('[Stream AI] Raw data:', data.substring(0, 50) + '...')

            if (data === '[DONE]') {
              console.log('[Stream AI] Stream completed with [DONE]')
              return
            }

            try {
              const parsed = JSON.parse(data)

              // Handle different response formats
              let content = ''

              // Check for tool call result from backend (after tool execution)
              if (parsed.tool_call_result) {
                const result = parsed.tool_call_result
                console.log('[Stream AI] Tool call result from backend:', JSON.stringify(result))
                console.log('[Stream AI] Setting __lastHealingComponent to:', result.component)

                // CRITICAL: Clear accumulated content when tool call result is received
                // The content sent before the tool call was just the AI's acknowledgment before calling the tool
                // The real response will come AFTER this in the stream, so we clear both buffers

                // Note: streamingContent cannot be cleared here because it's a ref in the component,
                // but the component will handle clearing it when the stream ends

                if (result.success) {
                  // Handle apply_healing_atmosphere result
                  if (result.themeColor) {
                    globalStore.applyHealingAtmosphere(result.themeColor, result.backgroundMusic, result.initialComfort)
                    console.log('[Stream AI] Applied healing atmosphere:', result.themeColor)
                  }

                  // Handle new healing component tool results
                  if (result.component) {
                    // Store the component type for the UI to render
                    window.__lastHealingComponent = result.component
                    console.log('[Stream AI] Healing component stored in window:', result.component)
                  }

                  // Handle emotion result
                  if (result.emotion && result.emotion !== 'neutral') {
                    window.__lastEmotionResult = {
                      emotion: result.emotion,
                      intensity: result.intensity,
                      colorScheme: result.colorScheme,
                    }
                    console.log('[Stream AI] Stored emotion result:', window.__lastEmotionResult)
                  }
                }
                continue
              }

              // Check for tool calls in the stream
              const toolCalls = parsed.output?.choices?.[0]?.message?.tool_calls
              if (toolCalls && toolCalls.length > 0) {
                console.log('[Stream AI] Tool calls detected in stream:', toolCalls)
                // Don't yield content for tool call messages
                continue
              }

              // Format 1: OpenAI streaming delta content (incremental)
              const deltaContent = parsed.choices?.[0]?.delta?.content
              // Format 2: Direct content in choices
              const directContent = parsed.output?.choices?.[0]?.message?.content || parsed.choices?.[0]?.message?.content
              // Format 3: Incremental content (legacy)
              const textContent = parsed.output?.text

              if (deltaContent) {
                content = deltaContent
              } else if (directContent) {
                content = directContent
              } else if (textContent) {
                content = textContent
              }
              // Format 3: Error in stream
              else if (parsed.error) {
                console.error('[Stream AI] Error in stream:', parsed.error)
                throw new Error(parsed.error)
              }

              if (content) {
                // Safety check: if content contains tool_call_result JSON, strip it
                // The JSON can appear anywhere in content if AI included it in response
                if (content.includes('"tool_call_result"')) {
                  console.log('[Stream AI] Content contains tool_call_result JSON, stripping it')
                  // Match the full JSON object even if it spans multiple lines
                  content = content.replace(/\{[\s\S]*?"tool_call_result"[\s\S]*?\}/g, '').trim()
                  // Also handle case where it appears as standalone line
                  content = content.replace(/^[\s]*\{\s*"tool_call_result"[^}]*\}[\s]*$/gm, '').trim()
                }
                if (content) {
                  console.log('[Stream AI] Yielding content:', JSON.stringify(content).substring(0, 100))
                  yield content
                }
              }
            } catch (e) {
              // Try to yield as plain text if not JSON
              console.warn('[Stream AI] Failed to parse JSON, using as text:', data.substring(0, 100))
              // But first check if it's actually a tool_call_result that we should handle
              try {
                const parsedErr = JSON.parse(data)
                if (parsedErr?.tool_call_result) {
                  console.log('[Stream AI] tool_call_result in catch block, handling it')
                  const result = parsedErr.tool_call_result

                  if (result.component) {
                    window.__lastHealingComponent = result.component
                  }
                  continue
                }
              } catch (e2) {
                // Not JSON or not tool_call_result, yield as plain text
              }
              if (data && data !== '[DONE]') {
                yield data
              }
            }
          }
        }
      }
    } finally {
      reader.releaseLock()
      console.log('[Stream AI] Reader released')
      console.log('[Stream AI] Final __lastHealingComponent:', (window as any).__lastHealingComponent)
    }
  } catch (error) {
    console.error('[Stream AI Error]', error)
    throw error
  }
}

/**
 * Mock AI chat function for simple usage (kept for compatibility)
 */
export async function mockChatWithAI(message: string): Promise<string> {
  if (!ENABLE_REAL_AI) {
    await simulateNetworkDelay(800, 1500)
    const response = analyzeMessage(message)
    
    console.log('[Mock AI] Simple chat request:', {
      message: message.substring(0, 50) + '...',
      response: response.substring(0, 50) + '...'
    })
    
    return response
  }

  // Use real API
  const result = await chatWithAI({ message })
  return result.content
}
