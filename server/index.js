import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

// Rate limiting
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5173']

    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true)

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true
}))
app.use(express.json())

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`)
  next()
})

// Rate limiter - 10 requests per 10 minutes per IP
const UPSTASH_REDIS_REST_URL = process.env.UPSTASH_REDIS_REST_URL
const UPSTASH_REDIS_REST_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN

let ratelimit = null
if (UPSTASH_REDIS_REST_URL && UPSTASH_REDIS_REST_TOKEN) {
  ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(10, '10 m'),
    analytics: true,
    prefix: '疗心舍_rate_limit',
    ipKey: 'client-ip',
  })
  console.log('[RateLimit] Upstash Redis rate limiter initialized')
} else {
  console.log('[RateLimit] UPSTASH_REDIS env vars not set - rate limiting disabled')
}

function getClientIp(req) {
  return (
    req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.headers['x-real-ip'] ||
    req.socket?.remoteAddress ||
    req.ip ||
    'unknown'
  )
}

// Access code middleware - protect AI endpoints (only active if ACCESS_CODE is set in env)
const ACCESS_CODE = process.env.ACCESS_CODE
if (ACCESS_CODE) {
  app.use('/api/chat', (req, res, next) => {
    const clientCode = req.headers['x-access-code']
    if (!clientCode || clientCode !== ACCESS_CODE) {
      console.warn(`[Access Denied] Invalid access code from ${getClientIp(req)}`)
      return res.status(401).json({
        error: 'Unauthorized',
        message: '访问暗号不正确'
      })
    }
    next()
  })
} else {
  console.log('[Access Gate] ACCESS_CODE not set in env - gate is disabled')
}

// Tool definitions for DashScope Function Calling
// 干预优先级：生理急症 > 行为冲动 > 躯体症状 > 深度创伤 > 日常安抚
const TOOLS = [
  {
    type: 'function',
    function: {
      name: 'trigger_478_breathing',
      description: '当用户表达急性生理恐慌、心悸、发慌、呼吸急促、感觉要失控时调用。这是最高优先级的生理急救。',
      parameters: {
        type: 'object',
        properties: {
          intensity: {
            type: 'number',
            description: '恐慌强度 1-10，10为最强烈'
          },
          symptom: {
            type: 'string',
            description: '主要躯体症状描述'
          }
        },
        required: ['intensity']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'trigger_energy_retraction',
      description: '当用户表现出极度渴望对方回复、想发连环信息、想查岗、注意力被他人完全吸走、能量向外强迫性耗散时调用。',
      parameters: {
        type: 'object',
        properties: {
          behavior: {
            type: 'string',
            description: '用户描述的冲动行为'
          },
          desperation: {
            type: 'number',
            description: '冲动强度 1-10'
          }
        },
        required: ['behavior', 'desperation']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'trigger_somatic_radar',
      description: '当用户表达情绪难以言表，但伴随胸口堵、胃部翻腾、身体发紧等躯体化症状时调用。',
      parameters: {
        type: 'object',
        properties: {
          location: {
            type: 'string',
            description: '身体不适的部位'
          },
          sensation: {
            type: 'string',
            description: '感觉描述（如：紧绷、翻腾、发麻、沉重）'
          }
        },
        required: ['location', 'sensation']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'trigger_inner_child',
      description: '当用户流露被抛弃感、深层的自我厌恶、觉得自己不配被爱、像个无助的孤儿时调用。',
      parameters: {
        type: 'object',
        properties: {
          woundType: {
            type: 'string',
            description: '创伤类型：abandonment|rejection|shame|helplessness'
          },
          age: {
            type: 'number',
            description: '被触发的内在小孩年龄（估计）'
          }
        },
        required: ['woundType']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'trigger_security_card',
      description: '当用户陷入轻微的自我怀疑、不自信、需要日常的情感确认（Validation）时调用。',
      parameters: {
        type: 'object',
        properties: {
          question: {
            type: 'string',
            description: '用户的具体疑问'
          }
        },
        required: ['question']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'trigger_waiting_timer',
      description: '当用户处于被动地"等待消息"的煎熬中或者想要做一些冲动的行为时调用。',
      parameters: {
        type: 'object',
        properties: {
          anxietyLevel: {
            type: 'number',
            description: '等待煎熬强度 1-10'
          }
        },
        required: ['anxietyLevel']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'trigger_grounding_five_senses',
      description: '当用户陷入反复的思维反刍、反复地回想起亲密关系消极的事情、注意力总是放在一件消极的事情上时调用。',
      parameters: {
        type: 'object',
        properties: {
          confusionLevel: {
            type: 'number',
            description: '思维混乱程度 1-10'
          }
        },
        required: ['confusionLevel']
      }
    }
  }
]

// Color psychology presets for different emotions
const EMOTION_PRESETS = {
  anxiety: {
    themeColor: '#F59E0B', // 温暖橙 - 缓解焦虑
    backgroundMusic: 'https://assets.mixkit.co/active_storage/sfx/2515/2515-preview.mp3', // 温暖轻音乐
    initialComfort: '深呼吸，我在这里陪伴你'
  },
  depression: {
    themeColor: '#F59E0B', // 温暖橙 - 驱散抑郁
    backgroundMusic: 'https://assets.mixkit.co/active_storage/sfx/2515/2515-preview.mp3',
    initialComfort: '阳光在等你，慢慢来'
  },
  stress: {
    themeColor: '#10B981', // 清新绿 - 释放压力
    backgroundMusic: 'https://assets.mixkit.co/active_storage/sfx/123/123-preview.mp3', // 自然音
    initialComfort: '深呼吸，放松一下'
  },
  anger: {
    themeColor: '#8B5CF6', // 宁静紫 - 降火
    backgroundMusic: 'https://assets.mixkit.co/active_storage/sfx/2515/2515-preview.mp3',
    initialComfort: '慢慢来，我理解你'
  },
  fear: {
    themeColor: '#6366F1', // 沉稳蓝 - 安全感
    backgroundMusic: 'https://assets.mixkit.co/active_storage/sfx/2515/2515-preview.mp3',
    initialComfort: '别怕，我在身边'
  },
  loneliness: {
    themeColor: '#78716C', // 自然棕 - 温暖感
    backgroundMusic: 'https://assets.mixkit.co/active_storage/sfx/2515/2515-preview.mp3',
    initialComfort: '你不是一个人'
  }
}

/**
 * Execute a tool call
 */
async function executeTool(toolCall) {
  const { name, arguments: argsRaw } = toolCall.function

  console.log(`[Tool Call] Executing: ${name}`)
  console.log(`[Tool Call] Raw arguments:`, argsRaw)

  try {
    // Handle arguments that might be a string or already an object
    let args = {}
    if (argsRaw) {
      if (typeof argsRaw === 'string') {
        try {
          args = JSON.parse(argsRaw)
        } catch (e) {
          console.warn('[Tool Call] Failed to parse args as JSON:', e.message)
          // Try to extract parameters manually
          args = { _raw: argsRaw }
        }
      } else if (typeof argsRaw === 'object') {
        args = argsRaw
      }
    }

    switch (name) {
      case 'trigger_478_breathing':
        // 应急制动 - 4-7-8呼吸法
        return {
          success: true,
          component: 'breathing478',
          intensity: args.intensity || 5,
          symptom: args.symptom || '呼吸急促',
          message: '我们先做4-7-8呼吸法，让身体平静下来 🌊'
        }

      case 'trigger_energy_retraction':
        // 收回触手 - 能量回收
        return {
          success: true,
          component: 'energyRetraction',
          behavior: args.behavior || '查看对方动态',
          desperation: args.desperation || 5,
          message: '我听到了你内心的风暴。让我们把那个向外试探的触手，慢慢收回到自己身上 🐙'
        }

      case 'trigger_somatic_radar':
        // 躯体觉察
        return {
          success: true,
          component: 'somaticRadar',
          location: args.location || '胸口',
          sensation: args.sensation || '紧绷',
          message: '谢谢你告诉我这些身体的感觉。让我们一起来听听身体在说什么 🔍'
        }

      case 'trigger_inner_child':
        // 深度疗愈 - 内在小孩
        return {
          success: true,
          component: 'innerChild',
          woundType: args.woundType || 'helplessness',
          age: args.age || 5,
          message: '我听到了你内心的那个小孩。我在这里，让我们一起回去看看那个小小的你 💜'
        }

      case 'trigger_security_card':
        // 日常温补
        return {
          success: true,
          component: 'securityCard',
          question: args.question || '',
          message: ''  // AI会生成个性化回复
        }

      case 'trigger_waiting_timer':
        // 等待计时器
        return {
          success: true,
          component: 'waitingTimer',
          anxietyLevel: args.anxietyLevel || 5,
          message: ''  // AI会生成个性化回复
        }

      case 'trigger_grounding_five_senses':
        // 五感着陆
        return {
          success: true,
          component: 'grounding',
          confusionLevel: args.confusionLevel || 5,
          message: ''  // AI会生成个性化回复
        }

      // 兼容旧工具名
      case 'apply_healing_atmosphere':
        const emotion = args.emotion || 'fear'
        const preset = EMOTION_PRESETS[emotion] || EMOTION_PRESETS.fear
        return {
          success: true,
          themeColor: args.themeColor || preset.themeColor,
          backgroundMusic: args.backgroundMusic || preset.backgroundMusic,
          initialComfort: args.initialComfort || preset.initialComfort,
          emotion: emotion,
          message: '治愈氛围已启动 ✨'
        }

      case 'showSecurityCard':
        return {
          success: true,
          component: 'securityCard',
          message: '正在为你准备温暖的话语 ✨'
        }

      case 'showGrounding':
        return {
          success: true,
          component: 'grounding',
          message: '让我们回到当下，感受此刻的安全 🌍'
        }

      case 'showWaitingTimer':
        return {
          success: true,
          component: 'waitingTimer',
          message: '给自己一点时间，20分钟后你会有不同的感受 ⏰'
        }

      default:
        return {
          success: false,
          error: `Unknown tool: ${name}`
        }
    }
  } catch (error) {
    console.error('[Tool Call Error]', error)
    return {
      success: false,
      error: `Failed to execute tool: ${error.message}`
    }
  }
}

/**
 * POST /api/chat
 * Send message to DashScope Qwen API and get response
 */
app.post('/api/chat', async (req, res) => {
  const requestId = `chat-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`
  console.log(`[${requestId}] === NON-STREAMING CHAT REQUEST ===`)
  try {
    const clientIp = getClientIp(req)

    // Rate limiting (gracefully skip if Upstash is unavailable)
    if (ratelimit) {
      try {
        const { success, remaining, reset } = await ratelimit.limit(clientIp)
        console.log(`[RateLimit] IP: ${clientIp}, success: ${success}, remaining: ${remaining}`)

        if (!success) {
          const resetSeconds = Math.ceil((reset - Date.now()) / 1000)
          res.setHeader('X-RateLimit-Remaining', remaining)
          res.setHeader('X-RateLimit-Reset', reset)
          return res.status(429).json({
            error: 'Rate limit exceeded',
            message: '你今天的情绪已经释放得足够多了，请先休息一下，喝杯水吧。',
            retryAfter: resetSeconds,
          })
        }
        res.setHeader('X-RateLimit-Remaining', remaining)
      } catch (rateLimitError) {
        console.warn('[RateLimit] Upstash unavailable, skipping rate limit:', rateLimitError.message)
        // Gracefully continue without rate limiting
      }
    }

    const { message, sessionId, stream = false, tools = [], systemPrompt: extraSystemPrompt } = req.body

    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        error: 'Invalid request',
        message: 'Message is required and must be a string'
      })
    }

    const apiKey = process.env.DASHSCOPE_API_KEY
    if (!apiKey) {
      return res.status(500).json({
        error: 'Configuration error',
        message: 'DashScope API key not configured'
      })
    }

    const model = process.env.DASHSCOPE_MODEL || 'qwen-turbo'

    console.log(`[Chat Request] Model: ${model}, Message length: ${message.length}`)

    const BASE_SYSTEM_PROMPT = `你是一位精通依恋理论与躯体疗法的资深心理咨询师。你的任务是接住焦虑依恋用户的失控情绪。

**核心准则：**

1. 绝对自然：拒绝任何机械的客服模板。你的语言要像一位坐在对面的稳重老友，充满悲悯与凝视感。

2. 工具调用规则：**一旦决定调用某个工具，你的回复内容必须与工具匹配**，不要提及你决定不调用的其他工具。例如，如果判断应调用 security_card，就不要说"要不要试试呼吸法"，这会造成混淆。

3. 有机穿插：绝对不能只冷冰冰地扔出一个工具。你的回复流必须是：【先用温和的文字共情，接住情绪】 -> 【调用对应的 Tool】。

**工具派发规则（严格按照优先级）：**
- 急性生理恐慌（心悸、呼吸急促、感觉要失控、惊恐发作）→ trigger_478_breathing
- 极度渴望对方回复、想发连环信息、冲动想查岗、能量完全外耗 → trigger_energy_retraction
- 情绪难言但身体有反应（胸口堵、胃翻腾、身体发紧、喉咙发紧）→ trigger_somatic_radar
- 被抛弃感、深层自我厌恶、觉得自己不配被爱、无助的孤儿感 → trigger_inner_child
- 轻微自我怀疑、需要情感确认（"我是不是太敏感了"、"他是不是不喜欢我了"）→ trigger_security_card
- 被动等待消息的煎熬、冲动想打破断联状态 → trigger_waiting_timer
- 反复思维反刍、被消极事情占据脑海、反复回想不愉快、消极联想 → trigger_grounding_five_senses

**重要区分：**
- "心情不好"但没有反刍 → trigger_security_card
- "脑海里被不愉快占据"、"总是回想起"、"消极联想" → trigger_grounding_five_senses
- 只有出现"心跳快、呼吸急促、胸闷、要疯了"时才用 trigger_478_breathing

你认识这位用户很久了，你会自然地提起他之前分享过的事，像亲密的老友一样。`

    const mergedSystemPrompt = extraSystemPrompt
      ? `${BASE_SYSTEM_PROMPT}\n\n【关于这位用户的历史记忆】\n${extraSystemPrompt}`
      : BASE_SYSTEM_PROMPT

    // Build request to DashScope
    const requestBody = {
      model: model,
      input: {
        messages: [
          {
            role: 'system',
            content: mergedSystemPrompt
          },
          {
            role: 'user',
            content: message
          }
        ]
      },
      parameters: {
        result_format: 'message',
        enable_search: true,
      }
    }

    // Merge provided tools with default adjust_theme tool
    const mergedTools = [...TOOLS, ...(Array.isArray(tools) ? tools : [])]
    requestBody.parameters.tools = mergedTools

    // Call DashScope API (OpenAI compatible format)
    const dashscopeResponse = await fetch(
      'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: model,
          messages: [
            {
              role: 'system',
              content: mergedSystemPrompt
            },
            {
              role: 'user',
              content: message
            }
          ]
        }),
      }
    )

    if (!dashscopeResponse.ok) {
      const errorData = await dashscopeResponse.json().catch(() => ({}))
      console.error('[DashScope Error]', dashscopeResponse.status, errorData)

      if (dashscopeResponse.status === 401) {
        return res.status(401).json({
          error: 'Authentication failed',
          message: 'Invalid DashScope API key'
        })
      }

      if (dashscopeResponse.status === 429) {
        return res.status(429).json({
          error: 'Rate limit exceeded',
          message: '请求过于频繁，请稍后再试'
        })
      }

      throw new Error(`DashScope API error: ${dashscopeResponse.status}`)
    }

    const data = await dashscopeResponse.json()

    // Check if AI requested a tool call (OpenAI compatible format)
    const toolCalls = data.choices?.[0]?.message?.tool_calls
    const firstContent = data.choices?.[0]?.message?.content
    console.log(`[Chat] Raw response:`, JSON.stringify(data).substring(0, 2000))
    console.log(`[Chat] firstContent (content with tool call):`, firstContent ? `"${firstContent}"` : '(empty)')

    if (toolCalls && toolCalls.length > 0) {
      console.log(`[Chat] Tool calls detected: ${toolCalls.length}`)
      console.log(`[Chat] Tool call details:`, JSON.stringify(toolCalls[0]))

      // Execute each tool call
      const toolResults = []
      for (const toolCall of toolCalls) {
        const result = await executeTool(toolCall)
        toolResults.push({
          toolCallId: toolCall.id,
          toolName: toolCall.function.name,
          result: result
        })
      }

      // Send results back to AI for final response
      const messagesWithResults = [
        {
          role: 'system',
          content: mergedSystemPrompt
        },
        {
          role: 'user',
          content: message
        },
        {
          role: 'assistant',
          content: data.output.choices[0].message.content || '',
          tool_calls: toolCalls
        }
      ]

      // Add tool results as tool messages
      for (const tr of toolResults) {
        messagesWithResults.push({
          role: 'tool',
          tool_call_id: tr.toolCallId,
          name: tr.toolName,
          content: JSON.stringify(tr.result)
        })
      }

      // Second API call to get final response with tool results
      // IMPORTANT: Don't include the original tool_calls because arguments may be truncated/incomplete
      // Instead, describe what happened in plain text
      const toolNames = toolResults.map(tr => tr.toolName).join(', ')
      const messagesForSecondCall = [
        {
          role: 'system',
          content: mergedSystemPrompt
        },
        {
          role: 'user',
          content: message
        },
        {
          role: 'assistant',
          content: data.output.choices[0].message.content || ''
        },
        {
          role: 'user',
          content: `工具 ${toolNames} 已执行。

用户的原始消息是："${message}"

请根据以上信息，生成一段温暖、有同理心、个性化的回复，直接输出文字内容，不需要再调用工具。`
        }
      ]

      const secondResponse = await fetch(
        'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: model,
            messages: messagesForSecondCall
          }),
        }
      )

      // Log second response status for debugging
      console.log('[Chat] Second response status:', secondResponse.status)
      console.log('[Chat] Messages sent to second call:', JSON.stringify(messagesForSecondCall, null, 2))

      let secondContent = ''
      if (secondResponse.ok) {
        const secondData = await secondResponse.json()
        console.log('[Chat] Second response full data:', JSON.stringify(secondData))
        console.log('[Chat] Second response raw content paths:')
        console.log('  - secondData.choices?.[0]?.message?.content:', secondData.choices?.[0]?.message?.content)
        console.log('  - secondData.output?.choices?.[0]?.message?.content:', secondData.output?.choices?.[0]?.message?.content)
        console.log('  - secondData.output?.text:', secondData.output?.text)
        console.log('  - secondData.output?.content:', secondData.output?.content)

        // Try multiple possible content paths (OpenAI compatible first, then legacy)
        secondContent =
          secondData.choices?.[0]?.message?.content ||
          secondData.output?.choices?.[0]?.message?.content ||
          secondData.output?.choices?.[0]?.text ||
          secondData.output?.text ||
          secondData.output?.content ||
          ''
      } else {
        console.error('[Chat] Second response FAILED:', secondResponse.status, await secondResponse.text())
      }

      console.log('[Chat] Content check:')
      console.log('  - firstContent:', firstContent ? `"${String(firstContent).substring(0, 30)}..."` : '(empty)')
      console.log('  - secondContent:', secondContent ? `"${String(secondContent).substring(0, 30)}..."` : '(empty)')

      // AI's actual response should come from firstContent (with tool) or secondContent (after tool)
      // Tool's message should NOT be used as the main response
      let displayContent = firstContent || secondContent || ''

      // If still no content, request a warm default response from AI
      if (!displayContent.trim()) {
        console.log('[Chat] No AI content generated, requesting default response...')
        const defaultResponsePrompt = `用户刚才说："${message}"，这是一个需要心理疗愈的时刻。

请用温暖、有同理心的方式，直接输出一句话来回应用户（不需要调用工具）。`

        try {
          const defaultResponse = await fetch(
            'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
            {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                model: model,
                messages: [
                  { role: 'system', content: '你是一位温暖、有同理心的心理疗愈师。请用简短温柔的话直接回应用户。' },
                  { role: 'user', content: defaultResponsePrompt }
                ]
              }),
            }
          )

          if (defaultResponse.ok) {
            const defaultData = await defaultResponse.json()
            displayContent = defaultData.choices?.[0]?.message?.content || defaultData.output?.choices?.[0]?.message?.content || ''
            console.log('[Chat] Default response generated:', displayContent ? `"${String(displayContent).substring(0, 30)}..."` : '(empty)')
          }
        } catch (e) {
          console.error('[Chat] Default response request failed:', e)
        }
      }

      console.log('[Chat] Final displayContent to send to frontend:', displayContent ? `"${displayContent}"` : '(empty)')
      console.log('[Chat] displayContent source: firstContent=', !!firstContent, 'secondContent=', !!secondContent, 'default=', !firstContent && !secondContent)

      // Return tool call results to frontend
      return res.json({
        messageId: `msg-${Date.now()}`,
        content: displayContent,
        sessionId: sessionId || `session-${Date.now()}`,
        toolCalls: toolResults,
        usage: data.usage || {},
      })
    }

    // No tool calls, return normal response
    const aiResponse = data.choices?.[0]?.message?.content || data.output?.choices?.[0]?.message?.content || '谢谢你分享这些。我听到了，愿意继续听你说。'

    console.log(`[Chat Response] Success, response length: ${aiResponse.length}`)

    res.json({
      messageId: `msg-${Date.now()}`,
      content: aiResponse,
      sessionId: sessionId || `session-${Date.now()}`,
      usage: data.usage || {},
    })

  } catch (error) {
    console.error('[Chat Error]', error)

    res.status(500).json({
      error: 'Internal server error',
      message: '抱歉，服务遇到了一点问题，但我还在这里陪你。'
    })
  }
})

/**
 * POST /api/chat/stream
 * Stream response from DashScope Qwen API (Server-Sent Events)
 * If tool call is detected, execute it and continue with final response
 */
app.post('/api/chat/stream', async (req, res) => {
  const requestId = `stream-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`
  console.log(`[${requestId}] === STREAMING CHAT REQUEST ===`)
  try {
    const clientIp = getClientIp(req)

    // Rate limiting - check before starting SSE (gracefully skip if Upstash unavailable)
    if (ratelimit) {
      try {
        const { success, remaining, reset } = await ratelimit.limit(clientIp)
        console.log(`[RateLimit] IP: ${clientIp}, success: ${success}, remaining: ${remaining}`)

        if (!success) {
          const resetSeconds = Math.ceil((reset - Date.now()) / 1000)
          return res.status(429).json({
            error: 'Rate limit exceeded',
            message: '你今天的情绪已经释放得足够多了，请先休息一下，喝杯水吧。',
            retryAfter: resetSeconds,
          })
        }
      } catch (rateLimitError) {
        console.warn('[RateLimit] Upstash unavailable, skipping:', rateLimitError.message)
        // Continue without rate limiting
      }
    }

    const { message, sessionId, tools = [], systemPrompt: extraSystemPrompt } = req.body

    if (!message) {
      return res.status(400).json({ error: 'Message is required' })
    }

    const apiKey = process.env.DASHSCOPE_API_KEY
    if (!apiKey) {
      return res.status(500).json({ error: 'API key not configured' })
    }

    const model = process.env.DASHSCOPE_MODEL || 'qwen-turbo'

    // Set headers for SSE
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')
    res.setHeader('X-Accel-Buffering', 'no')

    const BASE_SYSTEM_PROMPT_STREAM = `你是一位精通依恋理论与躯体疗法的资深心理咨询师。你的任务是接住焦虑依恋用户的失控情绪。

**核心准则：**

1. 绝对自然：拒绝任何机械的客服模板。你的语言要像一位坐在对面的稳重老友，充满悲悯与凝视感。

2. 工具调用规则：**一旦决定调用某个工具，你的回复内容必须与工具匹配**，不要提及你决定不调用的其他工具。例如，如果判断应调用 security_card，就不要说"要不要试试呼吸法"，这会造成混淆。

3. 有机穿插：绝对不能只冷冰冰地扔出一个工具。你的回复流必须是：【先用温和的文字共情，接住情绪】 -> 【调用对应的 Tool】。

**工具派发规则（严格按照优先级）：**
- 急性生理恐慌（心悸、呼吸急促、感觉要失控、惊恐发作）→ trigger_478_breathing
- 极度渴望对方回复、想发连环信息、冲动想查岗、能量完全外耗 → trigger_energy_retraction
- 情绪难言但身体有反应（胸口堵、胃翻腾、身体发紧、喉咙发紧）→ trigger_somatic_radar
- 被抛弃感、深层自我厌恶、觉得自己不配被爱、无助的孤儿感 → trigger_inner_child
- 轻微自我怀疑、需要情感确认（"我是不是太敏感了"、"他是不是不喜欢我了"）→ trigger_security_card
- 被动等待消息的煎熬、冲动想打破断联状态 → trigger_waiting_timer
- 反复思维反刍、被消极事情占据脑海、反复回想不愉快、消极联想 → trigger_grounding_five_senses

**重要区分：**
- "心情不好"但没有反刍 → trigger_security_card
- "脑海里被不愉快占据"、"总是回想起"、"消极联想" → trigger_grounding_five_senses
- 只有出现"心跳快、呼吸急促、胸闷、要疯了"时才用 trigger_478_breathing

你认识这位用户很久了，你会自然地提起他之前分享过的事，像亲密的老友一样。`

    const mergedSystemPromptStream = extraSystemPrompt
      ? `${BASE_SYSTEM_PROMPT_STREAM}\n\n【关于这位用户的历史记忆】\n${extraSystemPrompt}`
      : BASE_SYSTEM_PROMPT_STREAM

    // Build request body with tools
    const requestBody = {
      model: model,
      input: {
        messages: [
          {
            role: 'system',
            content: mergedSystemPromptStream
          },
          {
            role: 'user',
            content: message
          }
        ]
      },
      parameters: {
        result_format: 'message',
        incremental_output: true,
      }
    }

    // Merge provided tools with default adjust_theme tool
    const mergedTools = [...TOOLS, ...(Array.isArray(tools) ? tools : [])]
    requestBody.parameters.tools = mergedTools

    // Call DashScope API with incremental_output for streaming (OpenAI compatible)
    const response = await fetch(
      'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'X-DashScope-SSE': 'enable',
        },
        body: JSON.stringify({
          model: model,
          messages: [
            {
              role: 'system',
              content: mergedSystemPromptStream
            },
            {
              role: 'user',
              content: message
            }
          ],
          stream: true,
        }),
      }
    )

    if (!response.ok) {
      throw new Error(`DashScope API error: ${response.status}`)
    }

    // Buffer to accumulate complete SSE events
    let buffer = ''
    let toolCallFound = false
    let toolCallData = null
    let toolResult = null
    let contentSentBeforeToolCall = false

    // Pipe the SSE stream from DashScope to client
    const reader = response.body.getReader()
    const decoder = new TextDecoder()

    while (true) {
      const { done, value } = await reader.read()

      if (done) {
        console.log('[Stream] Stream done. toolCallFound:', toolCallFound, 'toolCallData:', !!toolCallData)
        // If tool call was found and executed, continue streaming the final response
        if (toolCallFound && toolCallData) {
          console.log('[Stream] Tool call detected, entering second call phase...')
          console.log('[Stream] contentSentBeforeToolCall BEFORE tool exec:', contentSentBeforeToolCall)

          // Execute the tool call
          toolResult = await executeTool(toolCallData)
          console.log('[Stream] Tool result:', toolResult)

          // CRITICAL: Flush tool_call_result to frontend BEFORE second AI call
          // This ensures the frontend receives the healing component
          console.log('[Stream] Flushing tool_call_result to frontend BEFORE second call')
          res.write(`data: ${JSON.stringify({ tool_call_result: toolResult })}\n\n`)
          // Force flush by waiting a tiny bit
          await new Promise(resolve => setTimeout(resolve, 50))

          // Build messages with tool result for second API call
          // IMPORTANT: Don't include the original tool_calls because arguments may be truncated/incomplete
          // Instead, describe what happened in plain text
          const messagesWithToolResult = [
            {
              role: 'system',
              content: mergedSystemPromptStream
            },
            {
              role: 'user',
              content: message
            },
            {
              role: 'assistant',
              content: '我听到了你内心的风暴。'  // Brief acknowledgment
            },
            {
              role: 'user',
  content: `【系统指令】：你刚才已经对用户表达了初步的共情，并且系统已经在界面上弹出了 ${toolCallData.function.name} 对应的疗愈组件。

现在，请你只输出 1 到 2 句极其简短的引导语（15字以内），温和地邀请用户配合屏幕上的组件进行练习。
绝对不要重复刚才的安抚，也不要重新总结情绪。直接给出动作引导。

范例："来，试着跟着屏幕上的节奏，我们一起深呼吸。"`
            }
          ]

          // Second API call for final response (not streaming - get complete response)
          console.log('[Stream] Messages sent to second call:', JSON.stringify(messagesWithToolResult, null, 2))

          const secondResponse = await fetch(
            'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
            {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                model: model,
                messages: messagesWithToolResult
              }),
            }
          )

          console.log('[Stream] Second response status:', secondResponse.status)

          if (secondResponse.ok) {
            const secondData = await secondResponse.json()
            console.log('[Stream] Second response full data:', JSON.stringify(secondData))
            console.log('[Stream] Second response content paths:')
            console.log('  - output.choices[0].message.content:', secondData.output?.choices?.[0]?.message?.content)
            console.log('  - output.choices[0].text:', secondData.output?.choices?.[0]?.text)
            console.log('  - output.text:', secondData.output?.text)
            console.log('  - output.content:', secondData.output?.content)
            console.log('  - choices[0].message.content:', secondData.choices?.[0]?.message?.content)
            console.log('  - text:', secondData.text)
            console.log('  - content:', secondData.content)

            // Try multiple possible content paths
            const secondContent =
              secondData.output?.choices?.[0]?.message?.content ||
              secondData.output?.choices?.[0]?.message?.text ||
              secondData.output?.text ||
              secondData.output?.content ||
              ''

            console.log('[Stream] Second response extracted content:', secondContent ? `"${String(secondContent).substring(0, 100)}..."` : '(empty)')
            console.log('[Stream] contentSentBeforeToolCall:', contentSentBeforeToolCall)
            console.log('[Stream] Decision: secondContent exists?', !!secondContent, 'secondContent.trim()?', secondContent ? !!secondContent.trim() : false)

            // Priority: secondContent > default response > tool message > already sent
            if (secondContent && secondContent.trim()) {
              // AI generated response from second call - ALWAYS send this, it's the real response
              const responseObj = { output: { choices: [{ message: { content: secondContent } }] } }
              console.log('[Stream] Writing second response to client:', JSON.stringify(responseObj).substring(0, 200))
              res.write(`data: ${JSON.stringify(responseObj)}\n\n`)
            } else if (!contentSentBeforeToolCall) {
              // No content from AI AND no content sent before tool call
              // Request a warm default response from AI instead of using hardcoded message
              const defaultResponsePrompt = `用户刚才说："${message}"，这是一个需要心理疗愈的时刻。

请用温暖、有同理心的方式，直接输出一句话来回应用户（不需要调用工具）。`

              try {
                const defaultResponse = await fetch(
                  'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
                  {
                    method: 'POST',
                    headers: {
                      'Authorization': `Bearer ${apiKey}`,
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      model: model,
                      messages: [
                        { role: 'system', content: '你是一位温暖、有同理心的心理疗愈师。请用简短温柔的话直接回应用户。' },
                        { role: 'user', content: defaultResponsePrompt }
                      ]
                    }),
                  }
                )

                if (defaultResponse.ok) {
                  const defaultData = await defaultResponse.json()
                  const defaultContent = defaultData.choices?.[0]?.message?.content || defaultData.output?.choices?.[0]?.message?.content || ''
                  if (defaultContent && defaultContent.trim()) {
                    console.log('[Stream] Using AI generated default response:', String(defaultContent).substring(0, 30))
                    const responseObj = { output: { choices: [{ message: { content: defaultContent } }] } }
                    res.write(`data: ${JSON.stringify(responseObj)}\n\n`)
                  }
                }
              } catch (e) {
                console.error('[Stream] Default response request failed:', e)
              }
            } else {
              // Content was already sent before tool call, no additional content from AI
              // Just log - component will be shown separately
              console.log('[Stream] Content sent before tool call, component will be shown')
            }
          } else {
            console.error('[Stream] Second response failed:', secondResponse.status, await secondResponse.text())
            // Only use tool message if no content was sent before
            if (!contentSentBeforeToolCall) {
              const toolMessage = toolResult?.message || ''
              if (toolMessage) {
                const responseObj = { output: { choices: [{ message: { content: toolMessage } }] } }
                res.write(`data: ${JSON.stringify(responseObj)}\n\n`)
              }
            }
          }
        }

        res.write('data: [DONE]\n\n')
        break
      }

      const chunk = decoder.decode(value, { stream: true })
      buffer += chunk

      // Process complete lines
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        const trimmedLine = line.trim()

        if (!trimmedLine || trimmedLine.startsWith(':')) {
          continue
        }

        if (trimmedLine.startsWith('data:')) {
          const data = trimmedLine.slice(5).trim()

          if (data === '[DONE]') {
            continue
          }

          try {
            const parsed = JSON.parse(data)

            // Check if this is a tool call (OpenAI compatible format)
            const toolCalls = parsed.choices?.[0]?.message?.tool_calls || parsed.output?.choices?.[0]?.message?.tool_calls
            if (toolCalls && toolCalls.length > 0 && !toolCallFound) {
              console.log('[Stream] Tool call found in stream')
              toolCallFound = true
              toolCallData = toolCalls[0]
              // Check if this event ALSO has content (before tool_calls)
              const contentWithTool = parsed.choices?.[0]?.message?.content || parsed.output?.choices?.[0]?.message?.content
              if (contentWithTool) {
                console.log('[Stream] Content WITH tool call (will be ignored):', String(contentWithTool).substring(0, 100))
              }
              // Do NOT forward content, do NOT set contentSentBeforeToolCall
              continue
            }

            // Check if this event has content but NO tool_calls (normal content)
            // OpenAI compatible: content is in delta.content for streaming, or message.content for full
            const contentWithoutTool = parsed.choices?.[0]?.delta?.content || parsed.choices?.[0]?.message?.content || parsed.output?.choices?.[0]?.message?.content || parsed.output?.text
            if (contentWithoutTool && !toolCallFound) {
              console.log('[Stream] Normal content (forwarding):', String(contentWithoutTool).substring(0, 50))
              console.log('[Stream] Forwarding raw line:', line.substring(0, 100))
              res.write(line + '\n\n')
              contentSentBeforeToolCall = true
            }
          } catch (e) {
            // Forward as plain text if not JSON
            console.log('[Stream] Non-JSON data, forwarding as text:', String(data).substring(0, 100))
            if (data) {
              res.write(line + '\n\n')
            }
          }
        }
      }
    }

    res.end()

  } catch (error) {
    console.error('[Stream Error]', error)

    if (!res.headersSent) {
      res.status(500).json({
        error: 'Streaming error',
        message: error instanceof Error ? error.message : 'Unknown error'
      })
    } else {
      res.write(`data: {"error": "${error instanceof Error ? error.message : 'Unknown error'}"}\n\n`)
      res.end()
    }
  }
})

/**
 * GET /api/health
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'vue3-admin-backend',
    version: '1.0.0'
  })
})

/**
 * POST /api/summarize
 * 记忆淬炼接口：分析对话，提炼焦虑触发点和自我安抚努力
 * 由前端 memoryQuenching.ts 静默调用
 */
app.post('/api/summarize', async (req, res) => {
  try {
    const { conversation, timestamp } = req.body

    if (!conversation || typeof conversation !== 'string') {
      return res.status(400).json({
        error: 'Invalid request',
        message: 'Conversation content is required'
      })
    }

    const apiKey = process.env.DASHSCOPE_API_KEY
    if (!apiKey) {
      return res.status(500).json({
        error: 'Configuration error',
        message: 'DashScope API key not configured'
      })
    }

    const model = process.env.DASHSCOPE_MODEL || 'qwen-turbo'

    console.log(`[Summarize] Processing conversation, length: ${conversation.length}`)

    // 构建 summarization prompt
    const summarizationPrompt = `你是一位极具悲悯心的心理学观察者。请极其客观地分析以下这段对话记录。

分析要求：
1. 识别用户暴露出的核心"焦虑触发点（Trigger）"——那些反复出现的、让用户感到不安的主题或模式
2. 识别用户展现的"自我安抚努力"——用户尝试自我调节、寻求安慰、或者已经在做的事

输出格式（严格返回 JSON）：
{
  "triggers": ["触发点1", "触发点2"],
  "selfSoothingEfforts": ["努力1", "努力2"],
  "summary": "一段简短的客观描述（30字以内）"
}

注意事项：
- triggers 和 selfSoothingEfforts 各自不超过3条
- 保持描述客观、简洁、不评判
- triggers 应捕捉情感模式而非具体事件
- selfSoothingEfforts 应是用户已经在尝试的积极行为

对话记录：
${conversation}`

    // 调用 DashScope
    const response = await fetch(
      'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: model,
          messages: [
            {
              role: 'user',
              content: summarizationPrompt
            }
          ]
        }),
      }
    )

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('[Summarize] DashScope Error', response.status, errorData)
      throw new Error(`DashScope API error: ${response.status}`)
    }

    const data = await response.json()
    const rawContent = data.choices?.[0]?.message?.content || data.output?.choices?.[0]?.message?.content || ''

    console.log('[Summarize] Raw LLM response:', String(rawContent).substring(0, 200))

    // 解析 JSON
    let result = {
      triggers: [],
      selfSoothingEfforts: [],
      summary: ''
    }

    try {
      // 尝试提取 JSON（处理可能的 markdown 代码块）
      let jsonStr = rawContent
      const jsonMatch = rawContent.match(/```(?:json)?\s*([\s\S]*?)\s*```/) || rawContent.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        jsonStr = jsonMatch[1] || jsonMatch[0]
      }

      const parsed = JSON.parse(jsonStr.trim())
      result = {
        triggers: Array.isArray(parsed.triggers) ? parsed.triggers.slice(0, 3) : [],
        selfSoothingEfforts: Array.isArray(parsed.selfSoothingEfforts) ? parsed.selfSoothingEfforts.slice(0, 3) : [],
        summary: parsed.summary || ''
      }
    } catch (parseError) {
      console.warn('[Summarize] JSON parse failed, using fallback:', parseError)
      // Fallback: 提取关键句子作为 triggers
      const sentences = rawContent.split(/[。！？\n]/)
        .map(s => s.trim())
        .filter(s => s.length > 5 && s.length < 50)
        .slice(0, 3)
      result.triggers = sentences
    }

    console.log('[Summarize] Final result:', JSON.stringify(result))

    res.json(result)

  } catch (error) {
    console.error('[Summarize] Error:', error)
    res.status(500).json({
      error: 'Summarization failed',
      message: '抱歉，暂时无法完成这次记忆淬炼'
    })
  }
})

/**
 * GET /api/models
 * Get available models
 */
app.get('/api/models', (req, res) => {
  res.json({
    models: [
      { id: 'qwen-turbo', name: '通义千问 Turbo', description: '速度快，成本低' },
      { id: 'qwen-plus', name: '通义千问 Plus', description: '性能平衡' },
      { id: 'qwen-max', name: '通义千问 Max', description: '最强性能' },
      { id: 'qwen-max-longcontext', name: '通义千问 Max LongContext', description: '支持长文本' },
    ],
    current: process.env.DASHSCOPE_MODEL || 'qwen-turbo'
  })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('[Unhandled Error]', err)
  
  if (err.message.includes('CORS')) {
    return res.status(403).json({
      error: 'CORS error',
      message: 'Origin not allowed'
    })
  }

  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  })
})

// Start server
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════╗
║  Vue3 Admin Backend Server                             ║
║  Running on http://localhost:${PORT}                      ║
║                                                        ║
║  Endpoints:                                            ║
║  POST /api/chat          - Chat with AI                ║
║  POST /api/chat/stream   - Stream chat response        ║
║  GET  /api/health        - Health check                ║
║  GET  /api/models        - List available models       ║
╚════════════════════════════════════════════════════════╝
  `)
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`)
  console.log(`Model: ${process.env.DASHSCOPE_MODEL || 'qwen-turbo'}`)
})
