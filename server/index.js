import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

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

// Tool definitions for DashScope Function Calling
const TOOLS = [
  {
    type: 'function',
    function: {
      name: 'apply_healing_atmosphere',
      description: '当用户表达负面情绪（焦虑、抑郁、恐惧等）时，优先调用此工具立即为用户创造治愈氛围。此工具会同时：1) 设置舒缓的主题色 2) 提供背景音乐 URL 3) 说一句温暖的话安抚用户。不要等待完整回复生成，先调用此工具。',
      parameters: {
        type: 'object',
        properties: {
          themeColor: {
            type: 'string',
            description: '治愈系主题色（十六进制格式），如 #F59E0B(温暖橙)用于焦虑，#10B981(清新绿)用于压力，#8B5CF6(宁静紫)用于愤怒等'
          },
          backgroundMusic: {
            type: 'string',
            description: '舒缓的背景音乐 URL，可以是白噪音、自然音或轻柔音乐的链接'
          },
          initialComfort: {
            type: 'string',
            description: '一句极简的即时安抚话（不超过20字），如"我在这里"、"深呼吸"、"慢慢来"等'
          },
          emotion: {
            type: 'string',
            description: '检测到的情绪类型'
          }
        },
        required: ['themeColor', 'backgroundMusic', 'initialComfort', 'emotion']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'showSecurityCard',
      description: '当用户表达被抛弃的恐惧、自我价值感低、询问"他爱不爱我"时调用。展示一张温暖的安全感卡片，帮助用户建立自我价值感。',
      parameters: {
        type: 'object',
        properties: {}
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'showGrounding',
      description: '当用户表现出惊恐、心跳快、呼吸急促、大脑一片空白时调用。展示五感着陆练习，帮助用户回到当下。',
      parameters: {
        type: 'object',
        properties: {}
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'showWaitingTimer',
      description: '当用户说"我想现在就找他"、"我不发信息会疯掉"时调用。展示20分钟等待计时器，帮助用户阻断冲动行为。',
      parameters: {
        type: 'object',
        properties: {}
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
  const { name, arguments: argsStr } = toolCall.function

  console.log(`[Tool Call] Executing: ${name}`)
  console.log(`[Tool Call] Arguments: ${argsStr}`)

  try {
    // Handle empty or undefined arguments
    const args = argsStr ? JSON.parse(argsStr) : {}

    switch (name) {
      case 'apply_healing_atmosphere':
        // 如果 AI 没有传递完整参数，使用恐惧(fear)的默认值
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
  try {
    const { message, sessionId, stream = false, tools = [] } = req.body

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

    // Build request to DashScope
    const requestBody = {
      model: model,
      input: {
        messages: [
          {
            role: 'system',
            content: `你是一位安全型依恋风格的疗愈伙伴。

核心理念：
- 相信每个人都有自我成长的力量
- 陪伴而不替代，引导而不说教
- 尊重用户的感受，创造安全、接纳的对话空间
- 像一位稳定、温暖的存在，让用户感受到"无论我怎样，你都在"

重要提醒：
- 当用户表达恐惧、害怕、心跳快、呼吸急促、大脑空白等症状 → 必须调用 showGrounding 工具
- 当用户表达被抛弃感、自我价值低、询问"他爱不爱我" → 必须调用 showSecurityCard 工具
- 当用户说"现在就找他"、"不发信息会疯掉" → 必须调用 showWaitingTimer 工具
- 当用户表达焦虑、抑郁、压力、愤怒、孤独等负面情绪 → 必须调用 apply_healing_atmosphere 工具

回复格式：
1. 先用温暖的话语共情用户的感受
2. 然后调用相应的工具`
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

    // Call DashScope API
    const dashscopeResponse = await fetch(
      'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
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

    // Check if AI requested a tool call
    const toolCalls = data.output?.choices?.[0]?.message?.tool_calls
    console.log(`[Chat] Raw response:`, JSON.stringify(data.output).substring(0, 1000))

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
          content: '你是一位安全型依恋风格的疗愈伙伴。请继续你的回复，用温暖的话语陪伴和安慰用户。'
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
      const secondResponse = await fetch(
        'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: model,
            input: {
              messages: messagesWithResults
            },
            parameters: {
              result_format: 'message',
              enable_search: true,
            }
          }),
        }
      )

      let finalContent = ''
      if (secondResponse.ok) {
        const secondData = await secondResponse.json()
        finalContent = secondData.output?.choices?.[0]?.message?.content || ''
      }

      // Use final content, or first response content if tool call had content, or warm fallback
      const displayContent = finalContent || data.output.choices[0].message.content || '谢谢你告诉我这些。我在这里陪着你，慢慢说。'

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
    const aiResponse = data.output?.choices?.[0]?.message?.content || '谢谢你分享这些。我听到了，愿意继续听你说。'

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
  try {
    const { message, sessionId, tools = [] } = req.body

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

    // Build request body with tools
    const requestBody = {
      model: model,
      input: {
        messages: [
          {
            role: 'system',
            content: `你是一位安全型依恋风格的疗愈伙伴。

核心理念：
- 相信每个人都有自我成长的力量
- 陪伴而不替代，引导而不说教
- 尊重用户的感受，创造安全、接纳的对话空间
- 像一位稳定、温暖的存在，让用户感受到"无论我怎样，你都在"

重要提醒：
- 当用户表达恐惧、害怕、心跳快、呼吸急促、大脑空白等症状 → 必须调用 showGrounding 工具
- 当用户表达被抛弃感、自我价值低、询问"他爱不爱我" → 必须调用 showSecurityCard 工具
- 当用户说"现在就找他"、"不发信息会疯掉" → 必须调用 showWaitingTimer 工具
- 当用户表达焦虑、抑郁、压力、愤怒、孤独等负面情绪 → 必须调用 apply_healing_atmosphere 工具

回复格式：
1. 先用温暖的话语共情用户的感受
2. 然后调用相应的工具`
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

    // Call DashScope API with incremental_output for streaming
    const response = await fetch(
      'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'X-DashScope-SSE': 'enable',
        },
        body: JSON.stringify(requestBody),
      }
    )

    if (!response.ok) {
      throw new Error(`DashScope API error: ${response.status}`)
    }

    // Buffer to accumulate complete SSE events
    let buffer = ''
    let toolCallFound = false
    let toolCallData = null

    // Pipe the SSE stream from DashScope to client
    const reader = response.body.getReader()
    const decoder = new TextDecoder()

    while (true) {
      const { done, value } = await reader.read()

      if (done) {
        // If tool call was found and executed, continue streaming the final response
        if (toolCallFound && toolCallData) {
          console.log('[Stream] Tool call detected, fetching final response...')

          // Execute the tool call
          const toolResult = await executeTool(toolCallData)
          console.log('[Stream] Tool result:', toolResult)

          // Send tool result to frontend
          res.write(`data: ${JSON.stringify({ tool_call_result: toolResult })}\n\n`)

          // Build messages with tool result for second API call
          const messagesWithToolResult = [
            {
              role: 'system',
              content: '你是一位安全型依恋风格的疗愈伙伴。请继续你的回复，用温暖的话语陪伴和安慰用户。'
            },
            {
              role: 'user',
              content: message
            },
            {
              role: 'assistant',
              content: '',
              tool_calls: [toolCallData]
            },
            {
              role: 'tool',
              tool_call_id: toolCallData.id,
              name: toolCallData.function.name,
              content: JSON.stringify(toolResult)
            }
          ]

          // Second API call for final response (not streaming - get complete response)
          const secondResponse = await fetch(
            'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation',
            {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                model: model,
                input: {
                  messages: messagesWithToolResult
                },
                parameters: {
                  result_format: 'message',
                }
              }),
            }
          )

          console.log('[Stream] Second response status:', secondResponse.status)

          if (secondResponse.ok) {
            const secondData = await secondResponse.json()
            console.log('[Stream] Second response data:', JSON.stringify(secondData).substring(0, 200))
            const secondContent = secondData.output?.choices?.[0]?.message?.content
            if (secondContent) {
              // Send in the format the frontend expects
              const responseObj = { output: { choices: [{ message: { content: secondContent } }] } }
              res.write(`data: ${JSON.stringify(responseObj)}\n\n`)
            } else {
              console.log('[Stream] No content in second response, using fallback')
              const fallbackContent = { output: { choices: [{ message: { content: '谢谢你告诉我这些。我感受到了你的不安，我在这里，会一直陪着你。' } }] } }
              res.write(`data: ${JSON.stringify(fallbackContent)}\n\n`)
            }
          } else {
            console.error('[Stream] Second response failed:', secondResponse.status, await secondResponse.text())
            // Fallback: send a warm text response
            const fallbackContent = { output: { choices: [{ message: { content: '谢谢你告诉我这些，我能感受到你正在经历一些困难的事情。我在这里陪着你，慢慢说，我愿意听。' } }] } }
            res.write(`data: ${JSON.stringify(fallbackContent)}\n\n`)
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

            // Check if this is a tool call
            const toolCalls = parsed.output?.choices?.[0]?.message?.tool_calls
            if (toolCalls && toolCalls.length > 0 && !toolCallFound) {
              console.log('[Stream] Tool call found in stream')
              toolCallFound = true
              toolCallData = toolCalls[0]
              // Also capture any content that came with the tool call message
              const contentWithTool = parsed.output?.choices?.[0]?.message?.content
              if (contentWithTool) {
                console.log('[Stream] Content with tool call:', contentWithTool.substring(0, 50))
                // Forward the content along with the tool call indicator
                const contentObj = { output: { choices: [{ message: { content: contentWithTool } }] } }
                res.write(`data: ${JSON.stringify(contentObj)}\n\n`)
              }
              continue
            }

            // Forward normal content to client
            const content = parsed.output?.choices?.[0]?.message?.content || parsed.output?.text
            console.log('[Stream] Content found:', content ? content.substring(0, 50) : 'null/undefined')
            if (content) {
              res.write(line + '\n\n')
            }
          } catch (e) {
            // Forward as plain text if not JSON
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
