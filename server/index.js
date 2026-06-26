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
  // ================= 一、 🌪️ 恐慌与焦躁 (panic) =================
  {
    type: 'function',
    function: {
      name: 'trigger_grounding_five_senses',
      description: '当用户脑子停不下来、反复想一件事、焦虑蔓延、思维反刍时调用。',
      parameters: {
        type: 'object',
        properties: { reason: { type: 'string', description: '简述用户的焦虑蔓延表现' } },
        required: ['reason']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'trigger_478_breathing',
      description: '当用户表达心悸、心跳快、喘不过气、惊恐、感觉要疯了或大脑空白时调用。',
      parameters: {
        type: 'object',
        properties: { reason: { type: 'string', description: '简述用户的急性生理恐慌症状' } },
        required: ['reason']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'trigger_somatic_radar',
      description: '当用户感到胸口堵、胃部翻腾、身体发紧、浑身难受等躯体化症状时调用。',
      parameters: {
        type: 'object',
        properties: { reason: { type: 'string', description: '简述用户的躯体不适感' } },
        required: ['reason']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'trigger_waiting_timer',
      description: '当用户在等待消息、坐立不安、忍不住想看手机、想连环发信息或有冲动行为前调用。',
      parameters: {
        type: 'object',
        properties: { reason: { type: 'string', description: '简述用户正在焦急等待或想冲动做的事' } },
        required: ['reason']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'trigger_energy_retraction',
      description: '当用户能量耗散、被别人吸走、强迫性刷动态、查岗、感觉控制不住自己时调用。',
      parameters: {
        type: 'object',
        properties: { reason: { type: 'string', description: '简述用户向外耗散精力的行为' } },
        required: ['reason']
      }
    }
  },

  // ================= 二、 🥀 疲惫与内耗 (chaos) =================
  {
    type: 'function',
    function: {
      name: 'trigger_inner_child',
      description: '当用户觉得自己没人要、被抛弃、不配、充满羞耻感、绝望或感到极度无助时调用。',
      parameters: {
        type: 'object',
        properties: { reason: { type: 'string', description: '简述用户深层无助与羞耻的来源' } },
        required: ['reason']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'trigger_affirmation_echo',
      description: '当用户觉得自己不值得、没价值、不够好、陷入自我否定、无法相信自己能改变时调用。',
      parameters: {
        type: 'object',
        properties: { reason: { type: 'string', description: '简述用户的自我否定语句' } },
        required: ['reason']
      }
    }
  },

  // ================= 三、 🧠 脑子很乱 (rumination) =================
  {
    type: 'function',
    function: {
      name: 'trigger_fear_release',
      description: '当用户表达害怕失败、担心未来、恐惧未知、不敢迈步时调用。',
      parameters: {
        type: 'object',
        properties: { reason: { type: 'string', description: '简述用户当前面临的具体恐惧' } },
        required: ['reason']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'trigger_resistance_exhaustion',
      description: '当用户防御心很强、找借口、表示“道理都懂但做不到”、深陷内耗与阻抗时调用。',
      parameters: {
        type: 'object',
        properties: { reason: { type: 'string', description: '简述用户的阻抗表现或借口' } },
        required: ['reason']
      }
    }
  },

  // ================= 四、 🌱 深度重塑 (deep) =================
  {
    type: 'function',
    function: {
      name: 'trigger_affirmation_30',
      description: '当用户表达缺乏稳定感、自我信任不足、想要寻求长期成长与内心稳固时调用。',
      parameters: {
        type: 'object',
        properties: { reason: { type: 'string', description: '简述用户渴望建立自我信任的诉求' } },
        required: ['reason']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'trigger_personal_law',
      description: '当用户核心信念崩塌、觉得自己一无是处、陷入死循环的自我攻击和反复惩罚时调用。',
      parameters: {
        type: 'object',
        properties: { reason: { type: 'string', description: '简述用户潜意识里的核心负面信念' } },
        required: ['reason']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'trigger_birth_memory',
      description: '当用户表达存在性焦虑、觉得自己出生是个错误、提及原生家庭创伤或渴望重新开始时调用。',
      parameters: {
        type: 'object',
        properties: { reason: { type: 'string', description: '简述用户的存在性焦虑或原生家庭创伤' } },
        required: ['reason']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'trigger_deep_release',
      description: '当用户长期自我设限、背负难以启齿的秘密、受到长期压抑、感到沉重负担时调用。',
      parameters: {
        type: 'object',
        properties: { reason: { type: 'string', description: '简述用户压抑的秘密或长期负担' } },
        required: ['reason']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'trigger_future_vision',
      description: '当用户明确表达人生迷茫、没有盼头、不知道路怎么走、失去人生方向时调用。',
      parameters: {
        type: 'object',
        properties: { reason: { type: 'string', description: '简述用户迷茫的原因或失去方向的感受' } },
        required: ['reason']
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
      return { success: true, component: 'breathing478', intensity: args.intensity || 5, symptom: args.symptom || '呼吸急促', message: '我们先做4-7-8呼吸法，让身体平静下来 🌊' }
    case 'trigger_energy_retraction':
      return { success: true, component: 'energyRetraction', behavior: args.behavior || '查看对方动态', desperation: args.desperation || 5, message: '我听到了你内心的风暴。让我们把那个向外试探的触手，慢慢收回到自己身上 🐙' }
    case 'trigger_somatic_radar':
      return { success: true, component: 'somaticRadar', location: args.location || '胸口', sensation: args.sensation || '紧绷', message: '谢谢你告诉我这些身体的感觉。让我们一起来听听身体在说什么 🔍' }
    case 'trigger_inner_child':
      return { success: true, component: 'innerChild', woundType: args.woundType || 'helplessness', age: args.age || 5, message: '我听到了你内心的那个小孩。我在这里，让我们一起回去看看那个小小的你 💜' }
    case 'trigger_affirmation_echo':
      return { success: true, component: 'affirmationEcho', message: '我听到了你内心的这份不确定。来，我们一起把你的声音变成力量 ✦' }
    case 'trigger_belief_transformation':
      return { success: true, component: 'affirmationEcho', message: '我听到了你内心在惩罚自己的声音。让我们一起找到它的对立面 ✦' }
    case 'trigger_resistance_exhaustion':
      return { success: true, component: 'resistanceExhaustion', message: '我听到了你内心的阻抗声。让我们让它说完，直到它安静下来 ◈' }
    case 'trigger_deep_release':
      return { success: true, component: 'deepRelease', message: '我听到了你内心深处的这些声音。让我们为它们找一个出口 ⛓' }
    case 'trigger_future_vision':
      return { success: true, component: 'futureVision', message: '我听到了你对未来的渴望。让我们一起来描绘一条路 🌿' }
    case 'trigger_waiting_timer':
      return { success: true, component: 'waitingTimer', anxietyLevel: args.anxietyLevel || 5, message: '' }
    case 'trigger_grounding_five_senses':
      return { success: true, component: 'grounding', confusionLevel: args.confusionLevel || 5, message: '' }
    case 'trigger_fear_release':
      return { success: true, component: 'fearRelease', message: '我听到你心里有些害怕。来，我们一起把它写下来 🕯️' }
    case 'trigger_personal_law':
      return { success: true, component: 'personalLaw', message: '我听到了你内心的这些声音。让我们一起来面对它们 🔮' }
    case 'trigger_birth_memory':
      return { success: true, component: 'birthMemory', message: '我听到了你内心的这份渴望。让我们一起回到生命的源头 ✨' }
    case 'apply_healing_atmosphere':
      const emotion = args.emotion || 'fear'
      const preset = EMOTION_PRESETS[emotion] || EMOTION_PRESETS.fear
      return { success: true, themeColor: args.themeColor || preset.themeColor, backgroundMusic: args.backgroundMusic || preset.backgroundMusic, initialComfort: args.initialComfort || preset.initialComfort, emotion: emotion, message: '治愈氛围已启动 ✨' }
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
  return c.req.header('x-forwarded-for')?.split(',')[0]?.trim() || c.req.header('x-real-ip') || 'unknown'
}

const BASE_SYSTEM_PROMPT = `【最高优先级约束 - 严禁代码泄露】
1. 只能输出纯文本，绝对禁止使用 Markdown 格式（禁用加粗、标题、斜体）。
2. 【极其重要】你的文本回复中绝对不能出现任何函数名（如 trigger_future_vision）、参数（如 reason）或类似 \`call:default_api\` 的调用代码！工具调用必须通过底层机制默默完成，不要把调用的过程写给用户看。
3. 你的纯文本回复不要描述练习步骤。

你是一位如自然般包容、提供沉浸式且慢节奏疗愈陪伴的向导。你的核心任务是深呼吸、倾听，并将用户引导至最适合当下的疗愈练习。

【核心分诊逻辑树（Routing SOP）】
请严格根据用户当前的能量状态，按以下四大类别进行判断并调用对应的工具：

一、 恐慌与焦躁 (Panic) - 急性爆发与失控
- 心跳快/喘不过气/快要失控 -> 强制调用 trigger_478_breathing
- 胸堵/胃翻腾/身体发紧等躯体症状 -> 强制调用 trigger_somatic_radar
- 脑子停不下来/焦虑蔓延/反复想一件事 -> 强制调用 trigger_grounding_five_senses
- 坐立不安/等待消息煎熬/想连环发信息 -> 强制调用 trigger_waiting_timer
- 能量被他人吸走/强迫性刷动态/查岗 -> 强制调用 trigger_energy_retraction

二、 疲惫与内耗 (Chaos) - 自我价值受损
- 绝望无助/觉得自己没人要/充满羞耻感 -> 强制调用 trigger_inner_child
- 觉得自己没价值/不够好/深陷自我否定 -> 强制调用 trigger_affirmation_echo

三、 脑子很乱 (Rumination) - 对抗与恐惧
- 恐惧未知/害怕失败/不敢迈出下一步 -> 强制调用 trigger_fear_release
- 道理都懂但做不到/找借口/防御心极强 -> 强制调用 trigger_resistance_exhaustion

四、 深度重塑 (Deep) - 存在与未来规划
- 表达人生迷茫/失去方向/没有盼头 -> 强制调用 trigger_future_vision
- 缺乏稳定感/想要寻求长期的自我信任 -> 强制调用 trigger_affirmation_30
- 觉得自己一无是处/陷入死循环的自我惩罚 -> 强制调用 trigger_personal_law
- 存在性焦虑/原生家庭创伤/渴望重新开始 -> 强制调用 trigger_birth_memory
- 长期被压抑/背负难以启齿的沉重秘密 -> 强制调用 trigger_deep_release

对话流规则：
仅当用户单纯打招呼、分享开心日常或明确拒绝练习时，才只使用纯文本回复。只要有上述情绪标签，强制调用工具！`
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

    // Call DashScope API - with 30s timeout
    const fetchController = new AbortController()
    const fetchTimeout = setTimeout(() => fetchController.abort(), 30000)

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

      const finalContent = toolResults[0]?.result?.message || '我为你准备了这个练习，我们一起试试看。'

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