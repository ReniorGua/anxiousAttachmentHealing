/**
 * Cloudflare Workers Backend for 疗心舍
 * Powered by Hono Framework
 */

import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

// Initialize Hono app
const app = new Hono()

// CORS middleware - allow all origins for flexibility
app.use('*', cors({
  origin: (origin) => origin,
  allowHeaders: ['Content-Type', 'X-Access-Code'],
  allowMethods: ['POST', 'GET', 'OPTIONS'],
  credentials: true,
}))

// Tool definitions for DashScope Function Calling
const TOOLS = [
  {
    type: 'function',
    function: {
      name: 'trigger_478_breathing',
      description: '当用户表达急性生理恐慌、心悸、发慌、呼吸急促、感觉要失控时调用。这是最高优先级的生理急救。',
      parameters: {
        type: 'object',
        properties: {
          intensity: { type: 'number', description: '恐慌强度 1-10，10为最强烈' },
          symptom: { type: 'string', description: '主要躯体症状描述' }
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
          behavior: { type: 'string', description: '用户描述的冲动行为' },
          desperation: { type: 'number', description: '冲动强度 1-10' }
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
          location: { type: 'string', description: '身体不适的部位' },
          sensation: { type: 'string', description: '感觉描述（如：紧绷、翻腾、发麻、沉重）' }
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
          woundType: { type: 'string', description: '创伤类型：abandonment|rejection|shame|helplessness' },
          age: { type: 'number', description: '被触发的内在小孩年龄（估计）' }
        },
        required: ['woundType']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'trigger_security_card',
      description: '当用户陷入轻微的自我怀疑、不自信、需要日常的情感确认时调用。',
      parameters: {
        type: 'object',
        properties: {
          question: { type: 'string', description: '用户的具体疑问' }
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
          anxietyLevel: { type: 'number', description: '等待煎熬强度 1-10' }
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
          confusionLevel: { type: 'number', description: '思维混乱程度 1-10' }
        },
        required: ['confusionLevel']
      }
    }
  }
]

// Color psychology presets for different emotions
const EMOTION_PRESETS = {
  anxiety: {
    themeColor: '#F59E0B',
    backgroundMusic: 'https://assets.mixkit.co/active_storage/sfx/2515/2515-preview.mp3',
    initialComfort: '深呼吸，我在这里陪伴你'
  },
  depression: {
    themeColor: '#F59E0B',
    backgroundMusic: 'https://assets.mixkit.co/active_storage/sfx/2515/2515-preview.mp3',
    initialComfort: '阳光在等你，慢慢来'
  },
  stress: {
    themeColor: '#10B981',
    backgroundMusic: 'https://assets.mixkit.co/active_storage/sfx/123/123-preview.mp3',
    initialComfort: '深呼吸，放松一下'
  },
  anger: {
    themeColor: '#8B5CF6',
    backgroundMusic: 'https://assets.mixkit.co/active_storage/sfx/2515/2515-preview.mp3',
    initialComfort: '慢慢来，我理解你'
  },
  fear: {
    themeColor: '#6366F1',
    backgroundMusic: 'https://assets.mixkit.co/active_storage/sfx/2515/2515-preview.mp3',
    initialComfort: '别怕，我在身边'
  },
  loneliness: {
    themeColor: '#78716C',
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

  let args = {}
  if (argsRaw) {
    if (typeof argsRaw === 'string') {
      try { args = JSON.parse(argsRaw) } catch (e) { args = { _raw: argsRaw } }
    } else if (typeof argsRaw === 'object') {
      args = argsRaw
    }
  }

  switch (name) {
    case 'trigger_478_breathing':
      return {
        success: true,
        component: 'breathing478',
        intensity: args.intensity || 5,
        symptom: args.symptom || '呼吸急促',
        message: '我们先做4-7-8呼吸法，让身体平静下来 🌊'
      }
    case 'trigger_energy_retraction':
      return {
        success: true,
        component: 'energyRetraction',
        behavior: args.behavior || '查看对方动态',
        desperation: args.desperation || 5,
        message: '我听到了你内心的风暴。让我们把那个向外试探的触手，慢慢收回到自己身上 🐙'
      }
    case 'trigger_somatic_radar':
      return {
        success: true,
        component: 'somaticRadar',
        location: args.location || '胸口',
        sensation: args.sensation || '紧绷',
        message: '谢谢你告诉我这些身体的感觉。让我们一起来听听身体在说什么 🔍'
      }
    case 'trigger_inner_child':
      return {
        success: true,
        component: 'innerChild',
        woundType: args.woundType || 'helplessness',
        age: args.age || 5,
        message: '我听到了你内心的那个小孩。我在这里，让我们一起回去看看那个小小的你 💜'
      }
    case 'trigger_security_card':
      return { success: true, component: 'securityCard', question: args.question || '', message: '' }
    case 'trigger_waiting_timer':
      return { success: true, component: 'waitingTimer', anxietyLevel: args.anxietyLevel || 5, message: '' }
    case 'trigger_grounding_five_senses':
      return { success: true, component: 'grounding', confusionLevel: args.confusionLevel || 5, message: '' }
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
      return { success: true, component: 'securityCard', message: '正在为你准备温暖的话语 ✨' }
    case 'showGrounding':
      return { success: true, component: 'grounding', message: '让我们回到当下，感受此刻的安全 🌍' }
    case 'showWaitingTimer':
      return { success: true, component: 'waitingTimer', message: '给自己一点时间，20分钟后你会有不同的感受 ⏰' }
    default:
      return { success: false, error: `Unknown tool: ${name}` }
  }
}

function getClientIp(c) {
  return (
    c.req.header('x-forwarded-for')?.split(',')[0]?.trim() ||
    c.req.header('x-real-ip') ||
    'unknown'
  )
}

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

/**
 * POST /api/chat
 * Non-streaming chat with DashScope
 */
app.post('/api/chat', async (c) => {
  const requestId = `chat-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`
  console.log(`[${requestId}] === NON-STREAMING CHAT REQUEST ===`)

  try {
    // Access code check
    const ACCESS_CODE = c.env.ACCESS_CODE
    if (ACCESS_CODE) {
      const clientCode = c.req.header('x-access-code')
      if (!clientCode || clientCode !== ACCESS_CODE) {
        console.warn(`[Access Denied] Invalid access code`)
        return c.json({ error: 'Unauthorized', message: '访问暗号不正确' }, 401)
      }
    }

    // Rate limiting
    const UPSTASH_REDIS_REST_URL = c.env.UPSTASH_REDIS_REST_URL
    const UPSTASH_REDIS_REST_TOKEN = c.env.UPSTASH_REDIS_REST_TOKEN
    let ratelimit = null
    if (UPSTASH_REDIS_REST_URL && UPSTASH_REDIS_REST_TOKEN) {
      ratelimit = new Ratelimit({
        redis: Redis.fromEnv({ UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN }),
        limiter: Ratelimit.slidingWindow(10, '10 m'),
        analytics: true,
        prefix: '疗心舍_rate_limit',
      })
    }

    if (ratelimit) {
      try {
        const clientIp = getClientIp(c)
        const { success, remaining, reset } = await ratelimit.limit(clientIp)
        console.log(`[RateLimit] IP: ${clientIp}, success: ${success}, remaining: ${remaining}`)
        if (!success) {
          const resetSeconds = Math.ceil((reset - Date.now()) / 1000)
          return c.json({
            error: 'Rate limit exceeded',
            message: '你今天的情绪已经释放得足够多了，请先休息一下，喝杯水吧。',
            retryAfter: resetSeconds,
          }, 429, {
            'X-RateLimit-Remaining': remaining.toString(),
            'X-RateLimit-Reset': reset.toString()
          })
        }
      } catch (rateLimitError) {
        console.warn('[RateLimit] Upstash unavailable, skipping:', rateLimitError.message)
      }
    }

    const body = await c.req.json()
    const { message, sessionId, tools = [], systemPrompt: extraSystemPrompt } = body

    if (!message || typeof message !== 'string') {
      return c.json({ error: 'Invalid request', message: 'Message is required and must be a string' }, 400)
    }

    const apiKey = c.env.DASHSCOPE_API_KEY
    if (!apiKey) {
      return c.json({ error: 'Configuration error', message: 'DashScope API key not configured' }, 500)
    }

    const model = c.env.DASHSCOPE_MODEL || 'qwen-plus'
    const mergedSystemPrompt = extraSystemPrompt
      ? `${BASE_SYSTEM_PROMPT}\n\n【关于这位用户的历史记忆】\n${extraSystemPrompt}`
      : BASE_SYSTEM_PROMPT

    // Call DashScope API
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
            { role: 'system', content: mergedSystemPrompt },
            { role: 'user', content: message }
          ]
        }),
      }
    )

    if (!dashscopeResponse.ok) {
      const errorData = await dashscopeResponse.json().catch(() => ({}))
      console.error('[DashScope Error]', dashscopeResponse.status, errorData)
      throw new Error(`DashScope API error: ${dashscopeResponse.status}`)
    }

    const data = await dashscopeResponse.json()
    const toolCalls = data.choices?.[0]?.message?.tool_calls
    const firstContent = data.choices?.[0]?.message?.content

    if (toolCalls && toolCalls.length > 0) {
      console.log(`[Chat] Tool calls detected: ${toolCalls.length}`)

      const toolResults = []
      for (const toolCall of toolCalls) {
        const result = await executeTool(toolCall)
        toolResults.push({
          toolCallId: toolCall.id,
          toolName: toolCall.function.name,
          result: result
        })
      }

      // Second API call to get final response
      const toolNames = toolResults.map(tr => tr.toolName).join(', ')
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
            messages: [
              { role: 'system', content: mergedSystemPrompt },
              { role: 'user', content: message },
              { role: 'assistant', content: data.choices?.[0]?.message?.content || '' },
              { role: 'user', content: `工具 ${toolNames} 已执行。用户的原始消息是："${message}"。请根据以上信息，生成一段温暖、有同理心、个性化的回复，直接输出文字内容，不需要再调用工具。` }
            ]
          }),
        }
      )

      let secondContent = ''
      if (secondResponse.ok) {
        const secondData = await secondResponse.json()
        secondContent = secondData.choices?.[0]?.message?.content || ''
      }

      const displayContent = firstContent || secondContent || ''

      return c.json({
        messageId: `msg-${Date.now()}`,
        content: displayContent,
        sessionId: sessionId || `session-${Date.now()}`,
        toolCalls: toolResults,
        usage: data.usage || {},
      })
    }

    // No tool calls, return normal response
    const aiResponse = data.choices?.[0]?.message?.content || '谢谢你分享这些。我听到了，愿意继续听你说。'

    return c.json({
      messageId: `msg-${Date.now()}`,
      content: aiResponse,
      sessionId: sessionId || `session-${Date.now()}`,
      usage: data.usage || {},
    })

  } catch (error) {
    console.error('[Chat Error]', error)
    return c.json({
      error: 'Internal server error',
      message: '抱歉，服务遇到了一点问题，但我还在这里陪你。'
    }, 500)
  }
})

/**
 * POST /api/chat/stream
 * Streaming chat response (Server-Sent Events)
 */
app.post('/api/chat/stream', async (c) => {
  const requestId = `stream-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`
  console.log(`[${requestId}] === STREAMING CHAT REQUEST ===`)

  try {
    // Access code check
    const ACCESS_CODE = c.env.ACCESS_CODE
    if (ACCESS_CODE) {
      const clientCode = c.req.header('x-access-code')
      if (!clientCode || clientCode !== ACCESS_CODE) {
        return c.json({ error: 'Unauthorized', message: '访问暗号不正确' }, 401)
      }
    }

    const body = await c.req.json()
    const { message, sessionId, tools = [], systemPrompt: extraSystemPrompt } = body

    if (!message) {
      return c.json({ error: 'Message is required' }, 400)
    }

    const apiKey = c.env.DASHSCOPE_API_KEY
    if (!apiKey) {
      return c.json({ error: 'API key not configured' }, 500)
    }

    const model = c.env.DASHSCOPE_MODEL || 'qwen-plus'
    const mergedSystemPrompt = extraSystemPrompt
      ? `${BASE_SYSTEM_PROMPT}\n\n【关于这位用户的历史记忆】\n${extraSystemPrompt}`
      : BASE_SYSTEM_PROMPT

    // Call DashScope API with streaming
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
            { role: 'system', content: mergedSystemPrompt },
            { role: 'user', content: message }
          ],
          stream: true,
        }),
      }
    )

    if (!response.ok) {
      throw new Error(`DashScope API error: ${response.status}`)
    }

    // Stream response back to client using Edge-compatible ReadableStream
    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''
    let toolCallFound = false
    let toolCallData = null
    let toolResult = null

    const stream = new ReadableStream({
      async start(controller) {
        try {
          while (true) {
            const { done, value } = await reader.read()
            if (done) {
              if (toolCallFound && toolCallData) {
                toolResult = await executeTool(toolCallData)
                controller.enqueue(`data: ${JSON.stringify({ tool_call_result: toolResult })}\n\n`)
                await new Promise(resolve => setTimeout(resolve, 50))

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
                      messages: [
                        { role: 'system', content: mergedSystemPrompt },
                        { role: 'user', content: message },
                        { role: 'assistant', content: '我听到了你内心的风暴。' },
                        { role: 'user', content: `系统提示：疗愈组件 "${toolCallData.function.name}" 已在界面显示。请直接输出1-2句15字以内的简短引导语，邀请用户配合组件练习。不要提及组件名称，不要输出任何格式（如**加粗**），不要描述用户情绪。范例输出："来，我们一起做。"` }
                      ]
                    }),
                  }
                )

                if (secondResponse.ok) {
                  const secondData = await secondResponse.json()
                  const secondContent = secondData.choices?.[0]?.message?.content || ''
                  if (secondContent && secondContent.trim()) {
                    controller.enqueue(`data: ${JSON.stringify({ output: { choices: [{ message: { content: secondContent } }] } })}\n\n`)
                  }
                }
              }
              controller.enqueue('data: [DONE]\n\n')
              break
            }

            const chunk = decoder.decode(value, { stream: true })
            buffer += chunk

            const lines = buffer.split('\n')
            buffer = lines.pop() || ''

            for (const line of lines) {
              const trimmedLine = line.trim()
              if (!trimmedLine || trimmedLine.startsWith(':')) continue
              if (trimmedLine.startsWith('data:')) {
                const data = trimmedLine.slice(5).trim()
                if (data === '[DONE]') continue

                try {
                  const parsed = JSON.parse(data)
                  const toolCalls = parsed.choices?.[0]?.message?.tool_calls
                  if (toolCalls && toolCalls.length > 0 && !toolCallFound) {
                    toolCallFound = true
                    toolCallData = toolCalls[0]
                    continue
                  }

                  const contentWithoutTool = parsed.choices?.[0]?.delta?.content || parsed.choices?.[0]?.message?.content || parsed.output?.choices?.[0]?.message?.content
                  if (contentWithoutTool && !toolCallFound) {
                    controller.enqueue(line + '\n\n')
                  }
                } catch (e) {
                  if (data) controller.enqueue(line + '\n\n')
                }
              }
            }
          }
          controller.close()
        } catch (error) {
          console.error('[Stream Error]', error)
          controller.enqueue(`data: {"error": "${error instanceof Error ? error.message : 'Unknown error'}"}\n\n`)
          controller.close()
        }
      }
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'X-Accel-Buffering': 'no',
      }
    })

  } catch (error) {
    console.error('[Stream Error]', error)
    return c.json({
      error: 'Streaming error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, 500)
  }
})

/**
 * POST /api/summarize
 * 记忆淬炼接口：分析对话，提炼焦虑触发点和自我安抚努力
 */
app.post('/api/summarize', async (c) => {
  try {
    const body = await c.req.json()
    const { conversation } = body

    if (!conversation || typeof conversation !== 'string') {
      return c.json({ error: 'Invalid request', message: 'Conversation content is required' }, 400)
    }

    const apiKey = c.env.DASHSCOPE_API_KEY
    if (!apiKey) {
      return c.json({ error: 'Configuration error', message: 'DashScope API key not configured' }, 500)
    }

    const model = c.env.DASHSCOPE_MODEL || 'qwen-plus'

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

对话记录：
${conversation}`

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
          messages: [{ role: 'user', content: summarizationPrompt }]
        }),
      }
    )

    if (!response.ok) {
      throw new Error(`DashScope API error: ${response.status}`)
    }

    const data = await response.json()
    const rawContent = data.choices?.[0]?.message?.content || ''

    let result = { triggers: [], selfSoothingEfforts: [], summary: '' }
    try {
      const jsonMatch = rawContent.match(/```(?:json)?\s*([\s\S]*?)\s*```/) || rawContent.match(/\{[\s\S]*\}/)
      const jsonStr = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : rawContent
      const parsed = JSON.parse(jsonStr.trim())
      result = {
        triggers: Array.isArray(parsed.triggers) ? parsed.triggers.slice(0, 3) : [],
        selfSoothingEfforts: Array.isArray(parsed.selfSoothingEfforts) ? parsed.selfSoothingEfforts.slice(0, 3) : [],
        summary: parsed.summary || ''
      }
    } catch (parseError) {
      console.warn('[Summarize] JSON parse failed:', parseError)
      const sentences = rawContent.split(/[。！？\n]/).map(s => s.trim()).filter(s => s.length > 5 && s.length < 50).slice(0, 3)
      result.triggers = sentences
    }

    return c.json(result)

  } catch (error) {
    console.error('[Summarize] Error:', error)
    return c.json({ error: 'Summarization failed', message: '抱歉，暂时无法完成这次记忆淬炼' }, 500)
  }
})

/**
 * GET /api/health
 * Health check endpoint
 */
app.get('/api/health', (c) => {
  return c.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'healing-backend-cloudflare',
    version: '1.0.0'
  })
})

/**
 * GET /api/models
 * Get available models
 */
app.get('/api/models', (c) => {
  return c.json({
    models: [
      { id: 'qwen-turbo', name: '通义千问 Turbo', description: '速度快，成本低' },
      { id: 'qwen-plus', name: '通义千问 Plus', description: '性能平衡' },
      { id: 'qwen-max', name: '通义千问 Max', description: '最强性能' },
      { id: 'qwen-max-longcontext', name: '通义千问 Max LongContext', description: '支持长文本' },
    ],
    current: c.env.DASHSCOPE_MODEL || 'qwen-turbo'
  })
})

// Error handling
app.onError((err, c) => {
  console.error('[Unhandled Error]', err)
  return c.json({
    error: 'Internal server error',
    message: err.message || 'Something went wrong'
  }, 500)
})

export default app