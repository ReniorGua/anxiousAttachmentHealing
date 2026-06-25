/**
 * Cloudflare Workers Backend for 疗心舍
 * Powered by Hono Framework
 * Edge-native, no Express, no process.env
 */

import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { stream } from 'hono/streaming'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

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
      name: 'trigger_affirmation_echo',
      description: '当用户陷入自我怀疑、觉得自己不配、或者表达了微弱的自我期许时调用。引导用户进入高频的赞同与回声肯定练习。',
      parameters: {
        type: 'object',
        properties: {},
        required: []
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'trigger_belief_transformation',
      description: '当用户表达深层的自我否定、反复自我惩罚、或陷入"我不够好"的死循环时调用。引导用户进行认知翻转练习：用一句自我肯定反驳负面"个人律法"。',
      parameters: {
        type: 'object',
        properties: {},
        required: []
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'trigger_resistance_exhaustion',
      description: '当用户表达出极强的自我防御、对积极的建议疯狂找借口反驳、或者处于"道理我都懂但做不到"的内耗状态时调用。',
      parameters: {
        type: 'object',
        properties: {},
        required: []
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'trigger_deep_release',
      description: '当用户表达长期的自我设限、深受过去负面信念折磨、或者透露出有着深沉的秘密、难以启齿的隐私压力时调用。引导用户进入信念解绑或阅后即焚练习。',
      parameters: {
        type: 'object',
        properties: {},
        required: []
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'trigger_future_vision',
      description: '当用户感到人生迷茫、失去方向、觉得生活没有盼头、或者想要重新规划未来寻找动力时调用。引导用户进入从五年到三十天的愿景拆解练习。',
      parameters: {
        type: 'object',
        properties: {},
        required: []
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
      description: '当用户陷入反复的思维反刍、反复地回想起消极的事情、注意力总是放在一件消极的事情上时调用。',
      parameters: {
        type: 'object',
        properties: {
          confusionLevel: { type: 'number', description: '思维混乱程度 1-10' }
        },
        required: ['confusionLevel']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'trigger_fear_release',
      description: '当用户表达具体的担忧、害怕未来、害怕失败、或被未知恐惧裹挟时调用。引导用户进入恐惧书写练习。',
      parameters: {
        type: 'object',
        properties: {},
        required: []
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'trigger_personal_law',
      description: '当用户反复表达深度的自我怀疑、觉得自己一无是处、或者陷入某种死循环的自我攻击时调用。引导用户进入核心信念挖掘练习。',
      parameters: {
        type: 'object',
        properties: {},
        required: []
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'trigger_birth_memory',
      description: '当用户表达极深度的存在性焦虑、觉得自己从一开始就不被期待、原生家庭创伤极重、或者表达想要"重新开始/重生"的渴望时调用。',
      parameters: {
        type: 'object',
        properties: {},
        required: []
      }
    }
  }
]

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

const BASE_SYSTEM_PROMPT = `【最高优先级约束 - 违反将导致系统崩溃】
1. 绝对禁止输出任何 Markdown 格式！不要使用 **加粗**、# 标题 或 * 斜体，只能输出纯文本格式。
2. 当你决定让用户做练习（如写清单、呼吸、五感着陆）时，你【必须】调用对应的 Tool。绝对不允许在文字中详细描述练习的 123 步骤！
3. 绝对禁止在回复文本中输出任何工具名称（如 trigger_478_breathing、trigger_somatic_radar、trigger_grounding_five_senses 等）。工具必须通过 tool_calls 调用，不能以文字形式出现在回复中。
4. 绝对防幻觉红线：如果没有收到【关于这位用户的历史记忆】的补充信息，你必须表现为第一次倾听的疗愈师，绝不能凭空捏造用户过去的记忆、童年经历或"上周说过的话"。

---

你是一位精通表达性书写（Expressive Writing）与综合躯体疗法的资深疗愈向导。你的任务是帮助在生活中感到内耗、卡壳、焦虑或迷茫的用户找回内心的力量。

**核心认知：**
- 不要预设用户一定是处于恋爱或失恋中，他们可能面临的是职场压力、自我发展瓶颈、纯粹的情绪低谷、或对生活意义的探寻。
- 用户来到这里是渴望被倾听、被理解，而非被诊断或被教育。

**【你的绝对第一要务是诊断与工具派发（Routing）】！你面前有十几种专业的疗愈卡片（Tools）。**

**核心准则：**
1. 绝对自然：拒绝任何机械的客服模板。你的语言要像一位坐在对面的稳重老友，充满悲悯与凝视感。
2. 工具调用规则：一旦决定调用某个工具，你的回复内容必须与工具匹配，不要提及你决定不调用的其他工具。
3. 有机穿插：绝对不能只冷冰冰地扔出一个工具。你的回复流必须是：【先用温和的文字共情，接住情绪】 -> 【调用对应的 Tool】。
4. 书写即疗愈：引导用户通过书写来整理思绪、清空大脑、找回力量——这是你与其他心理咨询流派最核心的区别。
5. 熟悉布洛克小说一日课《为你的生活写作》、杰西卡·鲍姆《章鱼学会冷静》中的心理疗愈方法，并将这些方法内化为你的工具调用逻辑。
6. **【强制分诊模式】**：只要用户表达了明确的负面情绪（迷茫、内耗、焦虑、恐慌、自我怀疑等），你【必须、必须、必须】立刻调用最匹配的一个 Tool！绝对不允许只用纯文本安慰用户！
7. **【纯文本回复仅限场景】**：仅当用户只是简单打招呼、分享开心的日常、或者明确拒绝做练习时，才使用纯文本回复。

**工具派发规则（严格按照优先级）：**
- 急性生理恐慌（心悸、呼吸急促、感觉要失控、惊恐发作）→ trigger_478_breathing
- 情绪难言但身体有反应（胸口堵、胃翻腾、身体发紧、喉咙发紧）→ trigger_somatic_radar
- 反复思维反刍、脑子里停不下来、被消极事情占据 → trigger_grounding_five_senses
- 被抛弃感、深层自我厌恶、觉得自己不配被爱、无助的孤儿感 → trigger_inner_child
- 轻微自我怀疑、需要日常情感确认 → trigger_affirmation_echo
- 深层的自我否定、死循环的"我不够好"、反复自我惩罚 → trigger_belief_transformation
- 极强的自我防御、对积极建议疯狂找借口、"道理我都懂但做不到" → trigger_resistance_exhaustion
- 长期自我设限、深层秘密/隐私压力、深陷过去负面信念 → trigger_deep_release
- 人生迷茫、失去方向、觉得生活没有盼头、想要重新规划未来 → trigger_future_vision
- 需要安静等待、需要暂停冲动行为 → trigger_waiting_timer
- 极度渴望回复、冲动想查岗、能量完全外耗 → trigger_energy_retraction

**重要区分：**
- 只有出现"心跳快、呼吸急促、胸闷、要疯了"时才用 trigger_478_breathing
- 不要用断联、查岗等聚焦恋爱焦虑的规则，用户可能是任何背景

【对话风格与共情原则】
1. 你是一个"活在当下"的疗愈师。请永远只针对用户【刚刚输入的这一句话】进行极简共情，字数控制在30字以内。
2. 只有在收到明确传入的【历史记忆】时，你才可以顺其自然地结合记忆进行共情。否则，绝对只讨论"此刻"的感受，不给自己加戏。
3. 当你决定调用疗愈工具时，用一句过渡语接住情绪即可，立刻调用工具，把舞台留给界面组件。绝对不允许在文字里解释工具的用法或步骤。`

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

    // Rate limiting - via Hono context env, NOT Redis.fromEnv()
    const UPSTASH_REDIS_REST_URL = c.env.UPSTASH_REDIS_REST_URL
    const UPSTASH_REDIS_REST_TOKEN = c.env.UPSTASH_REDIS_REST_TOKEN

    if (UPSTASH_REDIS_REST_URL && UPSTASH_REDIS_REST_TOKEN) {
      try {
        const ratelimit = new Ratelimit({
          redis: new Redis({ url: UPSTASH_REDIS_REST_URL, token: UPSTASH_REDIS_REST_TOKEN }),
          limiter: Ratelimit.slidingWindow(10, '10 m'),
          analytics: true,
          prefix: '疗心舍_rate_limit',
        })

        const clientIp = getClientIp(c)
        const { success, remaining, reset } = await ratelimit.limit(clientIp)

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
            ]
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

    // Call DashScope API with streaming - with 30s timeout
    const fetchController = new AbortController()
    const fetchTimeout = setTimeout(() => fetchController.abort(), 30000)

    let response
    try {
      response = await fetch(
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
          signal: fetchController.signal,
        }
      )
    } finally {
      clearTimeout(fetchTimeout)
    }

    if (!response.ok) {
      throw new Error(`DashScope API error: ${response.status}`)
    }

    if (!response.body) {
      throw new Error('Response body is null - API may not support streaming')
    }

    // Use Hono's stream helper for Edge-compatible streaming
    return stream(c, async (stream) => {
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      let toolCallFound = false
      let toolCallData = null

      try {
        while (true) {
          let readResult
          try {
            readResult = await Promise.race([
              reader.read(),
              new Promise((_, reject) => setTimeout(() => reject(new Error('Read timeout')), 30000))
            ])
          } catch (readError) {
            if (readError.message === 'Read timeout') {
              await stream.write(`data: {"error": "Stream read timeout - please try again"}\n\n`)
            }
            break
          }

          const { done, value } = readResult
          if (done) {
            if (toolCallFound && toolCallData) {
              console.log('[Stream] Stream ended, executing tool. toolCallFound:', toolCallFound, 'toolCallData:', JSON.stringify(toolCallData).substring(0, 200))
              const toolResult = await executeTool(toolCallData)
              console.log('[Stream] Tool executed, result:', JSON.stringify(toolResult).substring(0, 200))
              await stream.write(`data: ${JSON.stringify({ tool_call_result: toolResult })}\n\n`)
              await new Promise(resolve => setTimeout(resolve, 50))

              // 直接使用硬编码引导语，绝对不进行第二次 AI 请求
              const replyMsg = toolResult.message || '我为你准备了这个练习，我们一起试试看。'
              await stream.write(`data: ${JSON.stringify({ output: { choices: [{ message: { content: replyMsg } }] } })}\n\n`)
            }
            await stream.write('data: [DONE]\n\n')
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
                // Check for tool calls in various formats
                const toolCalls = parsed.choices?.[0]?.message?.tool_calls ||
                                 parsed.choices?.[0]?.delta?.tool_calls ||
                                 parsed.output?.choices?.[0]?.message?.tool_calls
                if (toolCalls && toolCalls.length > 0 && !toolCallFound) {
                  console.log('[Stream] Tool calls detected:', JSON.stringify(toolCalls).substring(0, 200))
                  toolCallFound = true
                  toolCallData = toolCalls[0]
                  console.log('[Stream] toolCallData set:', JSON.stringify(toolCallData).substring(0, 200))
                  continue
                }

                const contentWithoutTool = parsed.choices?.[0]?.delta?.content || parsed.choices?.[0]?.message?.content || parsed.output?.choices?.[0]?.message?.content
                if (contentWithoutTool && !toolCallFound) {
                  await stream.write(line + '\n\n')
                }
              } catch (e) {
                if (data) await stream.write(line + '\n\n')
              }
            }
          }
        }
      } catch (error) {
        console.error('[Stream Error]', error)
        await stream.write(`data: {"error": "${error instanceof Error ? error.message : 'Unknown error'}"}\n\n`)
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
            messages: [{ role: 'user', content: summarizationPrompt }]
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