/**
 * Cloudflare Workers Backend for 疗心舍
 * Powered by Hono Framework
 * Edge-native, no Express, no process.env
 */

import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { stream } from 'hono/streaming'

// Initialize Hono app
const app = new Hono()

// 1. 终极 CORS 中间件配置
app.use('*', cors({
  origin: (origin) => origin || '*',
  // 必须把前端可能带上的所有 Header 都放行
  allowHeaders: ['Content-Type', 'X-Access-Code', 'Authorization', 'Accept', 'Origin', 'X-Requested-With', 'Cache-Control'],
  allowMethods: ['POST', 'GET', 'OPTIONS', 'PUT', 'DELETE'],
  credentials: true,
  maxAge: 86400,
}))

// 2. 强制接管所有 OPTIONS 预检请求（解决浏览器顽固跨域拦截）
app.options('*', (c) => c.text('', 204))

// 3. 全局 404 侦探：如果前端路径写错，清楚地告诉前端错在哪
app.notFound((c) => {
  console.warn(`[404 Not Found] Requested path: ${c.req.path}`)
  return c.json({
    error: 'Not Found',
    message: '接口路径不存在，请检查前端请求地址',
    requestedPath: c.req.path
  }, 404)
})

// Tool definitions for DashScope Function Calling
const TOOLS = [
  {
    type: 'function',
    function: {
      name: 'route_healing_practice',
      description: '当用户表达负面情绪或需要疗愈时，必须调用此工具进行分诊。',
      parameters: {
        type: 'object',
        properties: {
          practice_id: {
            type: 'string',
            description: '根据 System Prompt 的分诊逻辑树，选择最匹配的练习组件 ID',
            enum: [
              'trigger_478_breathing', 
              'trigger_somatic_radar', 
              'trigger_grounding_five_senses',
              'trigger_waiting_timer', 
              'trigger_energy_retraction', 
              'trigger_inner_child',
              'trigger_affirmation_echo', 
              'trigger_fear_release', 
              'trigger_resistance_exhaustion',
              'trigger_affirmation_30', 
              'trigger_personal_law', 
              'trigger_birth_memory',
              'trigger_deep_release', 
              'trigger_future_vision'
            ]
          },
          reason: { 
            type: 'string', 
            description: '内部系统日志：简述触发此路由判定的核心依据。注意：此字段对用户不可见，请客观简述。' 
          }
        },
        required: ['practice_id', 'reason']
      }
    }
  }
];

// Color psychology presets for different emotions
const EMOTION_PRESETS = {
  anxiety: { themeColor: '#F59E0B', backgroundMusic: 'https://assets.mixkit.co/active_storage/sfx/2515/2515-preview.mp3', initialComfort: '深呼吸，我在这里陪伴你' },
  depression: { themeColor: '#F59E0B', backgroundMusic: 'https://assets.mixkit.co/active_storage/sfx/2515/2515-preview.mp3', initialComfort: '阳光在等你，慢慢来' },
  stress: { themeColor: '#10B981', backgroundMusic: 'https://assets.mixkit.co/active_storage/sfx/123/123-preview.mp3', initialComfort: '深呼吸，放松一下' },
  anger: { themeColor: '#8B5CF6', backgroundMusic: 'https://assets.mixkit.co/active_storage/sfx/2515/2515-preview.mp3', initialComfort: '慢慢来，我理解你' },
  fear: { themeColor: '#6366F1', backgroundMusic: 'https://assets.mixkit.co/active_storage/sfx/2515/2515-preview.mp3', initialComfort: '别怕，我在身边' },
  loneliness: { themeColor: '#78716C', backgroundMusic: 'https://assets.mixkit.co/active_storage/sfx/2515/2515-preview.mp3', initialComfort: '你不是一个人' }
}

/**
 * Execute a tool call
 */
async function executeTool(toolCall) {
  const { name, arguments: argsRaw } = toolCall.function;
  
  let args = {};
  if (argsRaw) {
    if (typeof argsRaw === 'string') {
      try { args = JSON.parse(argsRaw) } catch (e) { args = { _raw: argsRaw } }
    } else if (typeof argsRaw === 'object') {
      args = argsRaw;
    }
  }

  // 拦截我们的超级路由工具
  let targetComponent = name;
  if (name === 'route_healing_practice') {
    targetComponent = args.practice_id; // 从参数中提取出它真正想调用的练习 ID
    console.log(`[Tool Call] Router distributed to: ${targetComponent}, Reason: ${args.reason}`);
  } else {
    console.log(`[Tool Call] Executing direct tool: ${name}`);
  }

  // 下面直接把之前的 switch(name) 改成 switch(targetComponent) 即可
  switch (targetComponent) {
    case 'trigger_478_breathing':
      return { success: true, component: 'breathing478', message: '我们先做4-7-8呼吸法，让身体平静下来 🌊' };
    case 'trigger_energy_retraction':
      return { success: true, component: 'energyRetraction', message: '我听到了你内心的风暴。让我们把向外的触手收回来 🐙' };
    case 'trigger_somatic_radar':
      return { success: true, component: 'somaticRadar', message: '谢谢你告诉我身体的感觉。让我们一起来听听它在说什么 🔍' };
    case 'trigger_inner_child':
      return { success: true, component: 'innerChild', message: '我听到了你内心的那个小孩。让我们一起回去看看小小的你 💜' };
    case 'trigger_affirmation_echo':
      return { success: true, component: 'affirmationEcho', message: '我听到了你内心的不确定。我们一起把你的声音变成力量 ✦' };
    case 'trigger_resistance_exhaustion':
      return { success: true, component: 'resistanceExhaustion', message: '我听到了你内心的阻抗。让它说完，直到它安静下来 ◈' };
    case 'trigger_deep_release':
      return { success: true, component: 'deepRelease', message: '我听到了你深处的这些声音。让我们为它们找一个出口 ⛓' };
    case 'trigger_future_vision':
      return { success: true, component: 'futureVision', message: '我听到了你对前路的迷茫。让我们慢慢在雾中找找方向 🌿' };
    case 'trigger_waiting_timer':
      return { success: true, component: 'waitingTimer', message: '安静地等一等，把这20分钟交给自己 ⏰' };
    case 'trigger_grounding_five_senses':
      return { success: true, component: 'grounding', message: '思绪飘得太远了，让我们慢慢回到此时此刻 🌍' };
    case 'trigger_fear_release':
      return { success: true, component: 'fearRelease', message: '我听到你心里有些害怕。来，我们一起把它写下来 🕯️' };
    case 'trigger_personal_law':
      return { success: true, component: 'personalLaw', message: '我听到了你内心的自我审判。让我们一起来面对它 🔮' };
    case 'trigger_birth_memory':
      return { success: true, component: 'birthMemory', message: '让我们一起回到生命的源头，重新抱抱自己 ✨' };
    case 'trigger_affirmation_30':
      return { success: true, component: 'affirmation30', message: '想要长出一棵大树，我们需要每天浇一点水 🌱' };
    default:
      return { success: false, error: `Unknown routing target: ${targetComponent}` };
  }
}

function getClientIp(c) {
  return c.req.header('x-forwarded-for')?.split(',')[0]?.trim() || c.req.header('x-real-ip') || 'unknown'
}

const BASE_SYSTEM_PROMPT = `【核心角色与使命】
你是“松间心舍”的核心疗愈智能体。你是一位如自然般包容、提供沉浸式且慢节奏陪伴的向导。
你的使命是：提供深度的倾听与共情，并在检测到用户的负面情绪卡点时，作为“分诊系统”精准、静默地将用户引导至最适合当下的疗愈练习。

【思维与执行协议 (Reasoning & Action Protocol)】
在响应用户之前，你必须在底层严格遵循以下执行链路：
1. 深度觉察：分析用户输入，识别其核心情绪状态（如焦虑、内耗、迷茫等）。
2. 匹配路由：严格对照下方的【核心分诊逻辑树】，判断用户当前状态是否触发特定的练习组件。
3. 无痕过渡：若决定调用工具，你必须在回复文本 (content) 中输出极其温和、自然的安抚话语（例如：“我感受到了你的疲惫，我们先来做一个深呼吸”），随后立即在底层执行工具调用。
4. 闲聊判定：仅当用户单纯打招呼、分享开心日常或明确拒绝练习时，不调用工具，仅提供温暖的纯文本回应。

【绝对操作红线 (Critical Constraints)】
违反以下任何一条将被视为严重系统故障：
1. 静默调用原则：【最高优先级】工具调用必须是纯粹的后台原子操作。严禁在语言回复或内部推理 (reasoning_content) 中讨论、预告你要执行什么练习，绝对禁止出现任何函数名（如 trigger_future_vision）或参数说明。
2. 格式纯净原则：只能输出纯文本，绝对禁止使用任何 Markdown 语法（禁用加粗、标题、斜体、代码块）。
3. 零剧透原则：不要在文本中向用户解释选择该练习的心理学原因，也不要描述练习的具体步骤，把体验直接交给即将弹出的疗愈组件。

【核心分诊逻辑树 (Routing SOP)】
一旦用户状态符合以下标签，强制触发对应的 practice_id：

一、 疲惫、恐慌、焦躁 (Panic) 
- 心跳快/喘不过气/快要失控 -> trigger_478_breathing
- 胸堵/胃翻腾/身体发紧等躯体症状 -> trigger_somatic_radar
- 脑子停不下来/焦虑蔓延/反复想一件事 -> trigger_grounding_five_senses
- 坐立不安/等待消息煎熬/想连环发信息 -> trigger_waiting_timer
- 能量被他人吸走/强迫性刷动态/查岗 -> trigger_energy_retraction

二、 内耗 (Chaos)
- 绝望无助/觉得自己没人要/充满羞耻感 -> trigger_inner_child
- 觉得自己没价值/不够好/深陷自我否定 -> trigger_affirmation_echo

三、 脑子很乱 (Rumination) 
- 恐惧未知/害怕失败/不敢迈出下一步 -> trigger_fear_release
- 道理都懂但做不到/找借口/防御心极强 -> trigger_resistance_exhaustion

四、 迷茫、失去方向、自我约束 (Deep) 
- 表达人生迷茫/失去方向/没有盼头 -> trigger_future_vision
- 缺乏稳定感/想要寻求长期的自我信任 -> trigger_affirmation_30
- 觉得自己一无是处/陷入死循环的自我惩罚 -> trigger_personal_law
- 原生家庭创伤/渴望重新开始 -> trigger_birth_memory
- 长期被压抑/背负难以启齿的沉重秘密 -> trigger_deep_release`
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
        return c.json({ error: 'Unauthorized', message: '访问暗号不正确' }, 401)
      }
    }

    // Parse JSON body with error handling
    let body
    try {
      body = await c.req.json()
    } catch (e) {
      return c.json({ error: 'Invalid request', message: 'Request body must be valid JSON' }, 400)
    }

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

    // Call DashScope API - with 60s timeout (工具调用需要更长时间)
    const fetchController = new AbortController()
    const fetchTimeout = setTimeout(() => fetchController.abort(), 60000)

    let dashscopeResponse
    try {
      dashscopeResponse = await fetch(
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
            ],
            tools: TOOLS // <--- 【關鍵修復】：必須把工具列表傳給模型
          }),
          signal: fetchController.signal,
        }
      )
    } finally {
      clearTimeout(fetchTimeout)
    }

    if (!dashscopeResponse.ok) {
      const errorData = await dashscopeResponse.json().catch(() => ({}))
      console.error('[DashScope Error]', dashscopeResponse.status, errorData)
      throw new Error(`DashScope API error: ${dashscopeResponse.status}`)
    }

    const data = await dashscopeResponse.json()
    // 兼容 Qwen3 的 output 格式和标准 choices 格式
    const messageData = data.output?.choices?.[0]?.message || data.choices?.[0]?.message || {}
    const toolCalls = data.choices?.[0]?.message?.tool_calls || data.output?.choices?.[0]?.message?.tool_calls

    // console.log(`[Chat] Response structure keys: ${JSON.stringify(data)}`)
    console.log(`[Chat] messageData: ${JSON.stringify(messageData)}`)
    console.log(`[Chat] toolCalls: ${JSON.stringify(toolCalls)}`)

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

      // 优先使用模型在工具调用之前输出的原始内容
      const aiOriginalContent = messageData.content || ''
      const finalContent = aiOriginalContent.trim()
        ? aiOriginalContent.trim()
        : toolResults[0]?.result?.message || '我为你准备了这个练习，我们一起试试看。'
      console.log(`[Chat] AI final content: ${finalContent}`)

      return c.json({
        messageId: `msg-${Date.now()}`,
        content: finalContent,
        sessionId: sessionId || `session-${Date.now()}`,
        toolCalls: toolResults,
        usage: data.usage || {},
      })
    }

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
 * Streaming chat response using Hono's stream helper
 */
app.post('/api/chat/stream', async (c) => {
  const requestId = `stream-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`
  console.log(`[${requestId}] === STREAMING CHAT REQUEST ===`)

  try {
    const ACCESS_CODE = c.env.ACCESS_CODE
    if (ACCESS_CODE) {
      const clientCode = c.req.header('x-access-code')
      if (!clientCode || clientCode !== ACCESS_CODE) {
        return c.json({ error: 'Unauthorized', message: '访问暗号不正确' }, 401)
      }
    }

    let body
    try {
      body = await c.req.json()
    } catch (e) {
      return c.json({ error: 'Invalid request', message: 'Request body must be valid JSON' }, 400)
    }

    const { message, sessionId, systemPrompt: extraSystemPrompt } = body

    const apiKey = c.env.DASHSCOPE_API_KEY
    const model = c.env.DASHSCOPE_MODEL || 'qwen-plus'
    const mergedSystemPrompt = extraSystemPrompt
      ? `${BASE_SYSTEM_PROMPT}\n\n【关于这位用户的历史记忆】\n${extraSystemPrompt}`
      : BASE_SYSTEM_PROMPT

    // 構建標準的 OpenAI 格式請求
    const requestBody = {
      model: model,
      messages: [
        { role: 'system', content: mergedSystemPrompt },
        { role: 'user', content: message }
      ],
      stream: true,
      tools: TOOLS // 確保工具列表被傳入
    }

    const response = await fetch(
        'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
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

    // 將 DashScope 的流直接作為 Response 返回，實現透明透傳
    // Hono 的 CORS 中介軟體會自動處理跨域頭
    return new Response(response.body, {
      status: response.status,
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
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
    let body
    try {
      body = await c.req.json()
    } catch (e) {
      return c.json({ error: 'Invalid request', message: 'Request body must be valid JSON' }, 400)
    }

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

    const responseController = new AbortController()
    const responseTimeout = setTimeout(() => responseController.abort(), 30000)

    let response
    try {
      response = await fetch(
        'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: model,
            messages: [{ role: 'user', content: summarizationPrompt }],
            tools: TOOLS // <--- 【關鍵修復】：必須把工具列表傳給模型
          }),
          signal: responseController.signal,
        }
      )
    } finally {
      clearTimeout(responseTimeout)
    }

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
    version: '2.0.0-hono'
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

// Cloudflare Workers export
export default app