const a = {
  choices: [
    {
      message: {
        content:
          '听到你说迷茫，我能感受到你此刻心里的那片雾。有时候，站在十字路口看不清前路，并不是因为你走错了，而是生命在提醒你，该停下来歇一歇，听听内心的声音了。没关系，慢慢来，我在这里陪着你。当方向感暂时隐匿时，我们可以试着把目光投向更远的未来，让心底的愿景慢慢浮现，为你点亮一盏灯。如果你愿意，我们可以一起进行一个简短的疗愈练习，帮助你拨开眼前的迷雾，重新连接内心的方向感。准备好了的话，轻轻告诉我，我就带你开始。',
        reasoning_content:
          'Here\'s a thinking process:\n\n1.  **Analyze User Input:**\n   - User said: "迷茫" (Confused/Lost)\n   - This directly maps to the "四、 迷茫、失去方向、自我约束 (Deep)" category in the routing SOP.\n   - Specifically: "表达人生迷茫/失去方向/没有盼头 -> 强制调用 trigger_future_vision"\n\n2.  **Determine Tool Call:**\n   - `practice_id`: "trigger_future_vision"\n   - `reason`: "用户直接表达迷茫，感到失去方向" (User directly expressed confusion/feeling lost, lacking direction)\n\n3.  **Check Constraints:**\n   - Must output plain text only, NO markdown.\n   - ABSOLUTELY NO function names, parameters, or call codes in the text reply.\n   - Do NOT describe exercise steps.\n   - Act as a calm, immersive, slow-paced healing guide.\n   - Provide healing content and guide to the practice.\n\n4.  **Draft Response (Internal Refinement - Mental):**\n   听到你说迷茫，我能感受到你此刻心里的那片雾。有时候，站在十字路口看不清前路，并不是因为你走错了，而是生命在提醒你，该停下来歇一歇，听听内心的声音了。没关系，慢慢来，我在这里陪着你。当方向感暂时隐匿时，我们可以试着把目光投向更远的未来，让心底的愿景慢慢浮现，为你点亮一盏灯。如果你愿意，我们可以一起进行一个简短的疗愈练习，帮助你拨开眼前的迷雾，重新连接内心的方向感。准备好了的话，轻轻告诉我，我就带你开始。\n\n   Check against constraints:\n   - Plain text? Yes.\n   - No markdown? Yes.\n   - No function names/codes? Yes.\n   - No exercise steps? Yes.\n   - Matches tone? Yes, calm, immersive, slow-paced.\n   - Routes correctly? Yes, triggers the future vision practice based on "迷茫".\n\n5.  **Final Output Generation:** (Will invoke the tool first, then output the text response)\n   I will call the `route_healing_practice` tool with the specified parameters, then output the drafted plain text response. Ensure strict compliance with all constraints.✅\n   *Self-Correction/Verification during thought:*\n   - The prompt says: "当用户表达负面情绪或需要疗愈时，必须调用此工具进行分诊。"\n   - I need to make the tool call.\n   - The text response must strictly avoid markdown and any mention of the tool.\n   - The draft looks solid. I will proceed. \n   - Output matches exactly.✅\n   - Proceeds. \n   [Tool Call Generation] -> `route_healing_practice` with `practice_id: "trigger_future_vision"`, `reason: "用户直接表达迷茫，感到失去方向"`\n   [Text Output] -> Plain text response as drafted. \n   All constraints met.✅\n   Output matches the final response. \n   *(Proceeds)*',
        role: 'assistant',
      },
      finish_reason: 'stop',
      index: 0,
      logprobs: null,
    },
  ],
  object: 'chat.completion',
  usage: {
    prompt_tokens: 1030,
    completion_tokens: 757,
    total_tokens: 1787,
    completion_tokens_details: { reasoning_tokens: 640, text_tokens: 757 },
    prompt_tokens_details: { text_tokens: 1030 },
  },
  created: 1782785748,
  system_fingerprint: null,
  model: 'qwen3.6-plus',
  id: 'chatcmpl-4c2eb5f8-47d9-950a-9b01-164f6b499360',
}

const b = {
  choices: [
    {
      message: {
        content: '',
        reasoning_content:
          'The user input is simply "恐懼" (Fear). I need to assess the emotional state and select the most appropriate healing practice based on the provided SOP.\n\n1.  **Analyze the Input:** "恐懼" (Fear) directly indicates a state of fear, anxiety, or worry about something unknown or future.\n2.  **Consult the SOP (Routing Logic Tree):**\n    *   **Category One (Panic):** Focuses on rapid heartbeat, physical tightness, or waiting anxiously. While fear *can* lead to panic, "Fear" is a broader category.\n    *   **Category Two (Chaos):** Focuses on shame or feeling unworthy.\n    *   **Category Three (Rumination):** Includes "恐惧未知/害怕失败/不敢迈出下一步" (Fear of the unknown/fear of failure/afraid to take the next step) -> `trigger_fear_release`.\n    *   **Category Four (Deep):** Focuses on confusion, lack of direction, long-term trauma.\n3.  **Determine the Best Match:** The input "Fear" aligns best with Category Three (Rumination), specifically dealing with "Fear of the unknown/fear of failure". However, looking at Category Four, it doesn\'t fit there as well. Let\'s re-read Category Three. "恐惧未知/害怕失败/不敢迈出下一步 -> 强制调用 trigger_fear_release". The word "恐懼" (Fear) strongly points to `trigger_fear_release`.\n4.  **Formulate the Response:**\n    *   Acknowledge the fear gently.\n    *   Offer comfort.\n    *   Guide the user to the `trigger_fear_release` practice without revealing the tool name.\n\n*Self-Correction/Refinement:* Is there any other possibility? "Fear" can sometimes mean "Panic" (Category 1), but without symptoms like "heart beating fast" or "suffocating", `trigger_fear_release` is the safer, more direct match for the emotion "Fear".\n\n**Decision:** Call `trigger_fear_release`.\n**Reason:** 用户表达了恐惧情绪 (User expressed fear emotion).\n\n**Drafting the text response:**\n恐惧是一种很沉重的感觉，它像迷雾一样笼罩着你，让你看不清前方的路。没关系的，我在这里陪着你。我们可以试着一起把这个让你感到害怕的重担卸下来。深呼吸，我们准备做一个练习，去面对并释放这份恐惧。\n\n**Check Constraints:**\n*   No Markdown.\n*   No function names in text.\n*   No steps described.\n*   Empathetic tone.\n\nThe plan is solid. I will call the tool and provide the supportive text.\n\nWait, looking closely at the SOP again.\nCategory 3: "恐惧未知/害怕失败/不敢迈出下一步 -> trigger_fear_release".\nCategory 4: "原生家庭创伤... -> trigger_birth_memory", "长期被压抑... -> trigger_deep_release".\nThe input is just "Fear". It fits the description "恐惧未知" (fear of unknown) or general fear. `trigger_fear_release` is the most appropriate choice.\n\nLet\'s execute the tool call.\nPractice ID: trigger_fear_release\nReason: 用户直接表达了恐惧的情绪 (User directly expressed the emotion of fear).\n\nText:\n看见你了，我在这里。恐惧有时候像一阵突如其来的寒风，让我们忍不住想要退缩，这是身体在保护你。别怕，我们不需要立刻战胜它，只需要给它一个出口。让我们试着一起把心里的那个重担卸下来，慢慢呼吸，把那份紧绷感交给我，我们会一起走过这段艰难的时刻，准备好释放这份恐惧。',
        role: 'assistant',
        tool_calls: [
          {
            function: {
              arguments:
                '{"practice_id": "trigger_fear_release", "reason": "用户表达了恐惧的情绪，对应分类三中恐惧未知/害怕失败的情况"}',
              name: 'route_healing_practice',
            },
            id: 'call_b747c4b8d6764c6e97a016e1',
            index: 0,
            type: 'function',
          },
        ],
      },
      finish_reason: 'tool_calls',
      index: 0,
      logprobs: null,
    },
  ],
  object: 'chat.completion',
  usage: {
    prompt_tokens: 1030,
    completion_tokens: 826,
    total_tokens: 1856,
    completion_tokens_details: { reasoning_tokens: 763, text_tokens: 826 },
    prompt_tokens_details: { text_tokens: 1030 },
  },
  created: 1782785922,
  system_fingerprint: null,
  model: 'qwen3.6-plus',
  id: 'chatcmpl-63cf0588-4e2f-9c9a-9ad3-430bc93c9842',
}

const c = {
  choices: [
    {
      message: {
        content:
          '听到你说想重新开始，我能感受到你心里那份想要放下过往、轻装前行的渴望。过去的重量或许让你觉得有些疲惫，但每一次想要重新出发的念头，都是生命在悄悄为你腾出新的空间。在这里，你不需要急着赶路，也不用勉强自己立刻变好。我们可以慢慢来，把那些积压的感受安放在一个安全的角落，让内在的自己有机会呼吸、舒展。接下来，我会陪你进入一段专属的疗愈练习，帮助你温柔地清理旧日的印记，为全新的自己留出位置。请找个舒服的姿势，我们慢慢开始。',
        reasoning_content:
          'Here\'s a thinking process:\n\n1.  **Analyze User Input:**\n   - User says: "我想重新開始" (I want to start over)\n   - This expresses a desire to reset, often linked to past burdens, trauma, or a feeling of being stuck.\n   - Looking at the routing SOP:\n     - Category 四 (Deep) includes: "原生家庭创伤/渴望重新开始 -> 强制调用 trigger_birth_memory"\n     - The phrase "渴望重新开始" (desire to start over) directly matches the condition for `trigger_birth_memory`.\n\n2.  **Determine Tool Call:**\n   - `practice_id`: "trigger_birth_memory"\n   - `reason`: "用户表达渴望重新开始，符合原生家庭创伤/渴望重新开始的疗愈分诊条件"\n\n3.  **Draft Response (Internal Refinement - adhering to constraints):**\n   - Must be pure text, NO markdown.\n   - Must NOT mention function names, parameters, or call syntax.\n   - Must NOT describe practice steps.\n   - Must be calming, immersive, slow-paced, and guide them to the practice.\n   - Structure: Acknowledge emotion -> Validate -> Gentle guidance -> Invoke tool (silently) -> Provide soothing closing/transition.\n   - Draft (mental): 听到你说想重新开始，我能感受到你心里那份想要放下过往、轻装前行的渴望。过去的重量或许让你觉得有些疲惫，但每一次想要重新出发的念头，都是生命在悄悄为你腾出新的空间。在这里，你不需要急着赶路，也不用勉强自己立刻变好。我们可以慢慢来，把那些积压的感受安放在一个安全的角落，让内在的自己有机会呼吸、舒展。接下来，我会陪你进入一段专属的疗愈练习，帮助你温柔地清理旧日的印记，为全新的自己留出位置。请找个舒服的姿势，我们慢慢开始。\n   - Check constraints: Pure text? Yes. No markdown? Yes. No function names? Yes. No practice steps? Yes. Matches routing? Yes, triggers `trigger_birth_memory` based on "渴望重新开始".\n\n4.  **Execute Tool Call & Output:**\n   - Call `route_healing_practice` with `practice_id: "trigger_birth_memory"`, `reason: "用户表达渴望重新开始，符合渴望重新开始/原生家庭创伤的分诊条件"`\n   - Output the drafted text. All constraints met. Proceed. \n   - Self-Correction/Verification during thought: The prompt says "原生家庭创伤/渴望重新开始 -> 强制调用 trigger_birth_memory". The user said "我想重新開始". This matches perfectly. I will generate the response accordingly. I must ensure absolutely zero markdown formatting. I will double-check the draft to remove any potential formatting artifacts. All good. \n   - Output matches the draft.✅\n   - Tool call will be made silently as instructed.✅\n   - Ready. \n   - Output Generation. \n   *(Self-Correction/Refinement during drafting)*: I need to make sure the tone is exactly as specified: "如自然般包容、提供沉浸式且慢节奏疗愈陪伴的向导". The draft is good. I will ensure it flows naturally and strictly follows the "no markdown" rule. I will output it now. \n   [Proceeds] \n   *Output Generation* (matches the final response)\n   "听到你说想重新开始，我能感受到你心里那份想要放下过往、轻装前行的渴望。过去的重量或许让你觉得有些疲惫，但每一次想要重新出发的念头，都是生命在悄悄为你腾出新的空间。在这里，你不需要急着赶路，也不用勉强自己立刻变好。我们可以慢慢来，把那些积压的感受安放在一个安全的角落，让内在的自己有机会呼吸、舒展。接下来，我会陪你进入一段专属的疗愈练习，帮助你温柔地清理旧日的印记，为全新的自己留出位置。请找个舒服的姿势，我们慢慢开始。" (Pure text, matches all constraints) \n   Tool call parameters: practice_id="trigger_birth_memory", reason="用户表达渴望重新开始，符合渴望重新开始的分诊条件" (Will be called via the tool interface) \n   All steps verified. Output matches response. \n   [Done.] \n   *(Note: I will output the exact text without any formatting, and the system will handle the tool call.)*',
        role: 'assistant',
      },
      finish_reason: 'stop',
      index: 0,
      logprobs: null,
    },
  ],
  object: 'chat.completion',
  usage: {
    prompt_tokens: 1032,
    completion_tokens: 1016,
    total_tokens: 2048,
    completion_tokens_details: { reasoning_tokens: 896, text_tokens: 1016 },
    prompt_tokens_details: { text_tokens: 1032 },
  },
  created: 1782786153,
  system_fingerprint: null,
  model: 'qwen3.6-plus',
  id: 'chatcmpl-d261cc43-7c9f-9506-b9ea-29aa31ad0780',
}

const d = {
  choices: [
    {
      message: {
        content: '',
        reasoning_content:
          '用户表达了“背负难以启齿的沉重秘密”。\n根据【核心分诊逻辑树（Routing SOP）】：\n第四类：迷茫、失去方向、自我约束 (Deep)\n其中有一项规则：“长期被压抑/背负难以启齿的沉重秘密 -> 强制调用 trigger_deep_release”\n\n因此，需要调用的工具是 `trigger_deep_release`。\n理由是：用户明确表示自己背负难以启齿的沉重秘密。\n\n按照约束：\n1. 只能输出纯文本，禁止Markdown。\n2. 文本回复中不能出现函数名、参数或调用代码。\n3. 不要描述练习步骤。\n\n回复策略：\n先用自然、包容、慢节奏的话语回应用户，表达接纳和理解，不急于追问秘密是什么，而是提供一个安全的空间。\n引导用户进行释放的练习（通过调用工具实现，回复中提及引导即可，不需要描述具体步骤，因为工具会被调用并接管具体练习流程，或者回复引导语配合工具）。\n\n回复草稿：\n我听到了你心底的那份沉重。有些话语在喉咙里转了千百回，却因为太重、太深，始终难以说出口。这里没有评判，只有安静的陪伴和接纳。不需要急着把秘密摊开，我们先试着给这沉重的行囊找一个安全的安放之处，让紧绷的神经稍微松弛下来，你愿意跟我一起做一次释放的练习吗？\n\n检查约束：\n- 纯文本？是。\n- 无Markdown？是。\n- 无代码？是。\n- 无步骤描述？是。\n- 调用工具？是。\n\n确认调用参数：\npractice_id: trigger_deep_release\nreason: 用户表达自己背负难以启齿的沉重秘密。\n\n执行。',
        role: 'assistant',
        tool_calls: [
          {
            function: {
              arguments:
                '{"practice_id": "trigger_deep_release", "reason": "用户表达自己背负难以启齿的沉重秘密"}',
              name: 'route_healing_practice',
            },
            id: 'call_53e8978cff53489a982c1300',
            index: 0,
            type: 'function',
          },
        ],
      },
      finish_reason: 'tool_calls',
      index: 0,
      logprobs: null,
    },
  ],
  object: 'chat.completion',
  usage: {
    prompt_tokens: 1037,
    completion_tokens: 421,
    total_tokens: 1458,
    completion_tokens_details: { reasoning_tokens: 363, text_tokens: 421 },
    prompt_tokens_details: { text_tokens: 1037 },
  },
  created: 1782786300,
  system_fingerprint: null,
  model: 'qwen3.6-plus',
  id: 'chatcmpl-28e4d856-cd9a-9adf-a57b-bb200d99c866',
}

const a1 = {
  content:
    '{"practice_id": "trigger_future_vision", "reason": "用户明确表达迷茫，感到失去方向"}\n\n我听见了你心底的那阵迷雾。迷茫的时候，就像独自走在没有路标的旷野里，脚步变得沉重，连呼吸都带着不确定。没关系的，我们先停下来，允许自己在这片雾气中歇息一会儿。你不需要立刻看清远方，只需要感受此刻的存在。我会在这里陪你，慢慢地，我们一起把目光投向内心深处的微光，让那些关于未来的画面，自然地浮现出来。现在，请放松身体，跟随我为你准备的练习，去触碰那份属于你的方向感。',
  reasoning_content:
    'Here\'s a thinking process:\n\n1.  **Analyze User Input:**\n   - User says: "迷茫" (Confused/Lost/Directionless)\n   - This is a clear expression of a negative emotional state, specifically falling under the "Deep" category in the routing SOP.\n   - SOP Category IV: 迷茫、失去方向、自我约束 (Deep)\n     - "表达人生迷茫/失去方向/没有盼头 -> 强制调用 trigger_future_vision"\n\n2.  **Determine Tool Call:**\n   - `practice_id`: "trigger_future_vision"\n   - `reason`: "用户明确表达迷茫，感到失去方向" (Matches the SOP exactly)\n\n3.  **Generate Response (Mental Refinement - adhering to constraints):**\n   - Constraint Check: NO markdown, NO function names/parameters in text, describe practice steps? NO.\n   - Tone: Nature-like,包容, immersive, slow-paced healing companion.\n   - Content: Acknowledge the feeling of being lost, provide gentle, grounding/healing words, and guide them to the practice (without detailing steps, as per constraint 3).\n   - Draft:\n     我听见了你心底的那阵迷雾。迷茫的时候，就像独自走在没有路标的旷野里，脚步变得沉重，连呼吸都带着不确定。没关系的，我们先停下来，允许自己在这片雾气中歇息一会儿。你不需要立刻看清远方，只需要感受此刻的存在。我会在这里陪你，慢慢地，我们一起把目光投向未来，让心里那颗关于方向的种子，重新找到生长的力量。现在，请闭上眼睛，跟随我为你准备的练习，去感受一下内心深处的微光。\n   - Check constraints: Pure text? Yes. No markdown? Yes. No function names/code? Yes. Doesn\'t describe steps? Yes. Matches SOP? Yes.\n\n4.  **Execute Tool Call & Output:**\n   - Call `route_healing_practice` with `practice_id: "trigger_future_vision"`, `reason: "用户明确表达迷茫，感到失去方向"`\n   - Output the drafted response.✅\n   - All constraints met. Proceed. \n   - Self-Correction/Verification during thought: \n     - Constraint 1: 绝对禁止使用Markdown格式。 -> I will ensure the output is strictly plain text.\n     - Constraint 2: 绝对不能出现任何函数名、参数。 -> Checked.\n     - Constraint 3: 不要描述练习步骤。 -> Checked.\n     - SOP: 迷茫 -> trigger_future_vision. Checked.\n     - Ready. \n   - Generate response. \n   - *Self-Correction/Note during generation prep*: I need to make sure the tool call is properly formatted and the text response strictly follows the plain text rule. I will output the tool call first, then the text. The prompt says "工具调用必须通过底层机制默默完成", so I will just output the tool call block and then the plain text. All good. \n   - Proceed. \n   - Output matches the final response. \n   - [Done] \n   - *Output Generation* (matches the final response)\n   - `route_healing_practice` called.\n   - Text: 我听见了你心底的那阵迷雾... (as drafted)\n   - All constraints verified.✅\n   - Output matches response. \n   - *(Proceeds)*',
  role: 'assistant',
}
const b1 = {
  content:
    '听到你想要寻求长期的自我信任，这是一份非常珍贵且充满力量的愿望。建立对自己的信任就像在内心种下一棵树，需要每天温柔的浇灌与耐心的陪伴，它不求一时的速成，而是追求细水长流的稳固。在这个过程中，你会慢慢感受到那种源自内在的安定感，不再轻易被外界的风吹草动摇曳。\n\n我会一直在这里陪着你，不急不躁地见证这份力量的生长。让我们通过一个练习，帮助你在生活的点滴中建立起这份长久而坚定的信任。准备好之后，我们就开始这段旅程。',
  reasoning_content:
    '用户表达了“想要寻求长期的自我信任”。\n根据核心分诊逻辑树：\n四、 迷茫、失去方向、自我约束 (Deep)\n- 缺乏稳定感/想要寻求长期的自我信任 -> 强制调用 trigger_affirmation_30\n\n因此，我应该调用 `route_healing_practice` 工具，`practice_id` 为 "trigger_affirmation_30"，`reason` 为用户表达想要寻求长期的自我信任。\n\n同时，回复需要遵循约束：\n1. 纯文本，无Markdown。\n2. 不泄露函数名或调用代码。\n3. 不描述练习步骤。\n4. 像自然般包容、慢节奏的疗愈向导。\n\n回复构思：\n听到你想要寻求长期的自我信任，这是一份很珍贵的力量。建立对自己的信任就像种下一棵树，需要每天的浇灌和陪伴，不急于一时。在这个过程中，你会慢慢感受到内心的稳定与坚实。我会陪伴你，让我们一起通过一个练习，帮助你在日常中建立起这份长久而稳固的信任。请准备好，我们开始吧。\n\n检查：\n- 是否纯文本？是。\n- 是否调用工具？是。\n- 是否泄露信息？否。\n- 是否符合疗愈向导人设？是。',
  role: 'assistant',
}
//  /api/chat 调用链：
//   - 前端调用 chatWithAI() → src/api/ai.ts:228
//   - 服务端 /api/chat 解析 tool_calls，执行工具，返回 toolCalls 数组
//   - 前端收到完整响应后处理 data.toolCalls（ai.ts:270-299）

//   /api/chat/stream 调用链：
//   - 前端调用 streamChatWithAI() → src/api/ai.ts:375
//   - 服务端透传 SSE 流
//   - 前端解析 SSE，检测到 tool_calls 时只是 continue 跳过（ai.ts:458-462）
//   - 没有实际执行工具调用的逻辑

//   问题所在：/api/chat/stream 前端代码检测到了 tool_calls，但只是跳过不显示，并没有：
//   1. 收集完整的 tool_calls 信息
//   2. 把 tool_calls 发回服务端执行
//   3. 继续对话获取最终回复


//  第 407 行 - 当流式响应检测到工具调用但没有返回内容时：
//   const nonStreamResult = await chatWithAI({ message: userMessage, sessionId: aiChatStore.currentSessionId, stream:
//   false })

//   第 427 行 - 当流式请求出错且没有任何内容时（fallback）：
//   const fallback = await chatWithAI({ message: userMessage, sessionId: aiChatStore.currentSessionId, stream: false })

//   所以流程是：
//   1. 先尝试 /api/chat/stream（流式）
//   2. 如果检测到 tool_calls 且流式没有返回文本内容 → 切换到 /api/chat（非流式）获取工具执行结果
//   3. 如果流式出错且没有任何内容 → 降级到 /api/chat 重试

//   所以目前 只有 /api/chat 真正执行了工具调用，/api/chat/stream 只是透传流式内容，不处理工具调用。


data: {"choices":[{"delta":{"content":null,"reasoning_content":"Here","role":"assistant"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"'s a thinking process"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":":\n\n1."},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"  **Analyze"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" User Input:** The"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" user simply"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" said \"恐惧\""},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" (Fear).\n"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"2.  **"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"Identify Emotional State"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":":** The core emotion"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" is fear"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"/anxiety about the"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" future"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" or unknown.\n"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"3.  **"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"Map to Routing Logic"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" Tree:**\n"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"   - Look at"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" Category"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" Three: 脑子"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"很"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"乱 (Rum"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"ination)\n"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"   - Sub-category"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":": "},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"恐惧未知/害怕"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"失败/不敢迈出"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"下一步 -> 强制"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"调用 trigger_fear"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"_release\n   -"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" The input \"恐惧"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"\" directly aligns"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" with this."},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"\n4. "},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" **Select Tool &"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" Reason:**\n  "},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" - `"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"practice_id`: `"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"trigger_fear_release"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"`\n   -"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" `reason`: "},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"用户直接表达了“"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"恐惧”的情绪，"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"符合“恐惧未知"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"/害怕失败/"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"不敢迈出下一步”"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"的状态"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"。\n5."},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" "},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" **Draft Response ("},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"Internal Ref"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"inement - adhering"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" to constraints):**\n"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"   - Constraint Check"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" "},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"1: Pure text"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" only, NO markdown"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":".\n   -"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" Constraint Check 2"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":": NO function names"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":", parameters"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":", or code in"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" the text"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":".\n   -"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" Constraint Check 3"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":": Do NOT describe"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" practice"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" steps.\n  "},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" - Persona"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":": Nature-like包容"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":", immersive, slow"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"-paced healing companion."},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"\n   -"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" Content: Acknowledge"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" the fear, validate"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" it gently, guide"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" to"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" the practice naturally."},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"\n  "},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" - Draft: "},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"我感受到"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"你此刻正被"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"恐惧笼罩"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"。没关系的，"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"恐惧只是"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"内心在提醒你有些"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"未知需要"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"被看见。我们可以"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"慢慢来"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"，把这份沉重的"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"感觉交给"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"一个安全的空间去"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"释放。请"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"深呼吸，跟着我"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"为你准备的"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"练习，让紧绷"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"的神经"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"一点点松绑，"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"我会"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"一直在这里陪着你"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"。"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"\n6. "},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" **Tool"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" Call Generation:**\n"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"   -"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" Call `route_he"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"aling_practice`"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" with `practice_id"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":": \"trigger_f"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"ear_release\"` and"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" `reason:"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" \"用户直接表达了"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"恐惧的情绪，符合"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"恐惧未知或害怕"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"失败的状态\"`"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"\n7. "},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" **Final"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" Output Generation:** Combine"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" tool"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" call (handled by"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" system) and"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" pure text response."},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" Ensure"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" strict compliance with constraints"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":". I will output"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" the tool call first"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":","},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" then the text."},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" All constraints met"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":".✅\n  "},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" - Text"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" matches draft.\n"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"   - No markdown"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":".\n   -"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" No code"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" leaks.\n  "},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" -"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" Follows routing logic"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":". \n"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"   Proceed. \n"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"   Output"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" matches the response."},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" \n   *"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"Self-Correction"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"/Verification during thought"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":":*\n   -"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" Check routing logic:"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" \"恐惧未知/"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"害怕失败/不敢"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"迈出下一步 -> "},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"强制调用 trigger"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"_fear_release\"."},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" Input"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" is just \"恐惧"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"\","},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" which fits perfectly."},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"\n   -"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" Check constraints: \""},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"绝对禁止使用 Markdown"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" 格式\", \""},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"绝对不能"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"出现任何函数名"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"\", \"不要"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"描述练习步骤\"."},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" All checked"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":".\n   -"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" Tone"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":": Calm,"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" nature"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"-like, slow-paced"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":".\n   -"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" Ready. \n  "},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" Output Generation"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":". \n   *("},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"Note"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":": I will generate"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" the tool call block"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" as required, followed"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" by the pure text"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" response.)* \n"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"   `["},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"Tool Call] route"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"_healing_practice"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"({\"practice_id\":"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" \"trigger_fear"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"_release\", \"reason"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"\": \"用户直接"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"表达了恐惧的情绪，"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"符合恐惧未知或"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"害怕不敢迈步的状态"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"\"})"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"`\n   `["},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"Text"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" Response] 我"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"感受到你此刻正"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"被恐惧笼罩。"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"没关系的，恐惧"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"只是内心在提醒你"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"有些未知需要被"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"温柔对待。我们可以"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"慢慢来"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"，把这份沉重的"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"感觉交"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"托给一个安全的"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"空间。"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"请闭上眼睛，深呼吸"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"，我会"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"陪着你一起把"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"那些"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"紧抓不放的不"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"安一点点"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"松开，让呼吸"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"带你"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"回到安稳的当下"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"。`"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" (Matches constraints)"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"✅\n   Proceed"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"s. \n  "},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" *Output Generation*"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" (matches the final"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" response)\n  "},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" *(Self-Cor"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"rection/"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"Note during generation prep"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":")*: I need"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" to make sure the"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" tool"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" call is formatted exactly"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" as requested by the"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" system prompt structure,"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" and the text follows"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" immediately after. I"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" will strictly avoid"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" any markdown in the"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" text"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" part. All good"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":". \n  "},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" Output matches response."},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" \n   `["},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"Done]`\n"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":"{\"","reasoning_content":null},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":"call\": \"route","reasoning_content":null},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":"_healing_practice","reasoning_content":null},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":"\", \"args\":","reasoning_content":null},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":" {\"practice_id","reasoning_content":null},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":"\": \"trigger_f","reasoning_content":null},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":"ear_release\", \"","reasoning_content":null},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":"reason\": \"用户","reasoning_content":null},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":"直接表达了恐惧的情绪","reasoning_content":null},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":"，符合恐惧未知","reasoning_content":null},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":"或害怕失败的状态","reasoning_content":null},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"delta":{"content":"\"}}","reasoning_content":null},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[{"finish_reason":"stop","delta":{"content":"","reasoning_content":null},"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: {"choices":[],"object":"chat.completion.chunk","usage":{"prompt_tokens":1030,"completion_tokens":844,"total_tokens":1874,"completion_tokens_details":{"reasoning_tokens":798,"text_tokens":844},"prompt_tokens_details":{"text_tokens":1030}},"created":1782800450,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-5c204aa7-23bd-90ab-bf79-8850297aefde"}

data: [DONE]



data: {"choices":[{"delta":{"content":null,"reasoning_content":"Here","role":"assistant"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"'s a thinking process"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":":\n\n1."},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"  **Analyze"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" User Input:**\n"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"   - User input"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":": \"恐惧\""},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" (Fear)\n"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"   - This is"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" a clear"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" expression of a negative"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" emotion,"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" specifically fear.\n\n"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"2.  **"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"Match with Routing SOP"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" ("},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"Core Triage Logic"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"):**\n"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"   - I need"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" to categor"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"ize \"恐惧\""},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" ("},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"Fear) into one"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" of the four main"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" categories: Panic,"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" Chaos, Rum"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"ination, or Deep"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":".\n   -"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" Looking at the categories"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":":\n     -"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" 一、 "},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"疲惫、恐慌、"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"焦躁 (P"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"anic): Focus"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"es on physical symptoms"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" of"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" panic, racing mind"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":", waiting"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":", energy drain."},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" Not"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" a perfect match for"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" just \"fear"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"\".\n     -"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" 二、 "},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"内耗 (Ch"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"aos): Focuses"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" on despair, shame"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":", self"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"-worth issues."},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" Not a direct"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" match.\n    "},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" - 三、"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" 脑子很乱"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" (Rumination"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"): Includes \"恐惧"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"未知/"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"害怕失败/不敢"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"迈出下一步\" ("},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"Fear of the unknown"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"/f"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"ear of failure/h"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"es"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"itation to take the"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" next step) ->"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" This matches \"恐惧"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"\""},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" (Fear) very"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" well"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":". The corresponding tool"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" is `trigger"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"_fear_release`."},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"\n     - "},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"四、 迷茫"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"、失去方向、"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"自我约束 (Deep"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"): Focuses on"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" life direction, long"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"-term self-trust"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":", self-pun"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"ishment, family trauma"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":", heavy secrets."},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"\n\n"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"   - Therefore,"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" \""},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"恐惧\" falls under"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" Category"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" 三 (R"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"umination), specifically"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" matching \"恐惧未知"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"/害怕"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"失败/不敢迈出"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"下一步\". The tool"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" to call is `"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"trigger_fear_release"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"`.\n\n3."},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"  **Formulate"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" Tool Call:**\n"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"   - `practice"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"_id`: \"trigger"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"_fear_release"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"\"\n   -"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" `reason`: \""},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"用户直接表达了恐惧"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"情绪"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"，符合分诊"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"逻辑中"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"‘恐惧未知/"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"害怕失败"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"/不敢迈出下一步"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"’的判定"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"标准。\"\n\n"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"4"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":".  **Draft"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" Response (Internal Ref"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"inement according to constraints"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"):**\n"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"   - Constraints check"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":":\n     -"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" Pure text only,"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" NO markdown"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":".\n     -"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" NO"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" function names, parameters"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":", or code in"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" the text.\n"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"     -"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" Do not describe practice"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" steps.\n    "},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" - Be a slow"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"-paced, immersive healing"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" guide. Breat"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"he, listen"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":", provide healing words"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":", guide"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" to the practice."},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"\n   - Draft"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":":\n     "},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"我在这里陪"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"着你。恐惧是一种"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"很沉重的"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"感觉，它像"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"一阵"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"冷风突然吹"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"过心里"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"，让你想要退缩"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"或者"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"紧紧抓住些什么。"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"没"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"关系的，我们不需要"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"立刻"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"驱赶它，"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"也不需要"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"评判自己为什么会害怕"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"。先"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"慢慢地把注意力带"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"回到呼吸上"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"，感受空气温柔"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"地进出"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"鼻腔。当你准备好的"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"时候，我会"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"陪你一起做一个专门"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"释放恐惧的练习"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"，让那些紧绷"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"和"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"不安慢慢落地。"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"你愿意"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"跟我一起试一试吗"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"？\n\n"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"5.  **"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"Final"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" Check against Constraints:**"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"\n   - Pure"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" text? Yes."},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"\n   - No"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" markdown? Yes."},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"\n   - No"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" function names/code in"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" text? Yes."},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"\n   - Matches"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" routing logic"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"? Yes, `"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"trigger_fear_release"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"` for fear."},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"\n   - Tone"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" appropriate? Yes,"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" slow"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":", immersive, healing"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":".\n   -"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" Ready. Output matches"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" the draft"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":". I will generate"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" the tool call first"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":", then the text"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" response. ("},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"Note: The system"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" expects"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" me to output the"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" tool"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" call and the text"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" response together"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":", but the prompt"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" says"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" \"工具调用必须"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"通过底层"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"机制默默完成，"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"不要把调用的过程"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"写给用户看。"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"\" I will just"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" output the tool call"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" block and then the"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" pure text response.)"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"\n"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"   - Wait,"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" the prompt says \""},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"你的纯文本回复"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"不要描述练习步骤"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"。\" and \""},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"绝对不能"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"出现任何函数名"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"... "},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"工具调用必须通过"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"底层机制默默完成"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"\". I will follow"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" the standard"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" format for tool calling"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":".\n"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"   - I will"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" generate"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" the tool call and"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" the"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" response. All constraints"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" met"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":".✅\n  "},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" - Proceed. \n"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"   - Self-C"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"orrection/"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"Verification during thought:"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" \n     - Check"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" category mapping again:"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" \"恐惧"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"未知/害怕失败"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"/不敢迈出下一步"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" -> 强制调用"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" trigger_fear"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"_release\". User said"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" \"恐惧"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"\". This is a"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" direct match.\n"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"     - Response tone"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":": calm"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":", grounding, invites"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" them"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" to the practice without"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" detailing"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" steps.\n    "},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" - Format"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":": I will output"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" the tool call first"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":", then the pure"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" text."},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"\n     - All"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" good. \n    "},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" - Output generation."},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" \n     - *"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"Self-Correction"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"/Note during generation"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" prep*: I need"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" to make sure the"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" text response strictly avoids"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" markdown. I will"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" remove any potential formatting"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":". I"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" will write it as"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" plain text.\n"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"     - Text:"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" 我在这里陪"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"着你。恐惧是一种"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"很沉重的感觉，"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"它像一阵冷"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"风突然吹过"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"心里，让你想要"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"退缩或者紧紧抓住"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"些什么。没关系的"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"，我们不需要"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"立刻驱赶它"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"，也不需要评判自己"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"为什么会害怕。先"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"慢慢地把注意力带"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"回到呼吸上，"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"感受空气温柔地"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"进出鼻腔。当你"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"准备好的时候，我会"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"陪你一起做一个专门"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"释放恐惧的练习"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"，让那些紧绷"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"和不安慢慢落地"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"。你愿意跟我"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"一起试一试吗？"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"\n     - Matches"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" perfectly. Proceeds"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":". \n     -"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" Output matches response"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":". \n     -"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" [Done"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"] \n     -"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" *Output Generation*"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" (matches the final"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" refined"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" version) -> *"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"Proceeds*."},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" \n     - *"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"Note*: I will"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" ensure the tool call"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" is correctly"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" formatted according to the"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" schema"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":".\n     -"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" `{\""},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"practice_id\": \""},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"trigger_fear_release"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"\", \"reason\":"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" \"用户直接表达了"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"恐惧情绪，符合"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"分诊逻辑中"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"‘恐惧未知/"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"害怕失败/不敢"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"迈出下一步’的"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"判定标准。\""},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"}`\n     -"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" All set"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":". \n     -"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" Output matches exactly"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":". \n     -"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" [Final Check of"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" the Prompt]: \""},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"只能"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"输出纯文本，"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"绝对禁止使用 Markdown"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" 格式... "},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"你的纯"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"文本回复不要描述"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"练习步骤。\""},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" -> I will strictly"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" output"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" plain text for the"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" conversation"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" part. The tool"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" call is"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" handled separately by the"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" system."},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" I will just provide"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" the response"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" text after the tool"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" call."},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" Actually, in this"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" interface, I"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" just output the tool"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" call and then"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" the text. I"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"'ll"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" make sure the text"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" has"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" zero markdown.\n"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"     - Ready."},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" \n     - Output"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" Generation. \n    "},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" - *(Done."},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":")*"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":null,"tool_calls":[{"index":0,"id":"call_c8dd330233124f7796c5f799","type":"function","function":{"name":"route_healing_practice","arguments":""}}]},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":null,"tool_calls":[{"index":0,"id":"","type":"function","function":{"arguments":"{\"practice_id\": \"trigger"}}]},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":null,"tool_calls":[{"index":0,"id":"","type":"function","function":{"arguments":"_fear_release"}}]},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":null,"tool_calls":[{"index":0,"id":"","type":"function","function":{"arguments":"\""}}]},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":null,"tool_calls":[{"index":0,"id":"","type":"function","function":{"arguments":", \"reason\": \"用户直接"}}]},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":null,"tool_calls":[{"index":0,"id":"","type":"function","function":{"arguments":"表达了恐惧情绪，"}}]},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":null,"tool_calls":[{"index":0,"id":"","type":"function","function":{"arguments":"符合分诊逻辑"}}]},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":null,"tool_calls":[{"index":0,"id":"","type":"function","function":{"arguments":"中“"}}]},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":null,"tool_calls":[{"index":0,"id":"","type":"function","function":{"arguments":"恐惧未知/害怕"}}]},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":null,"tool_calls":[{"index":0,"id":"","type":"function","function":{"arguments":"失败/不敢迈出"}}]},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":null,"tool_calls":[{"index":0,"id":"","type":"function","function":{"arguments":"下一步”的判定"}}]},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":null,"tool_calls":[{"index":0,"id":"","type":"function","function":{"arguments":"标准。"}}]},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":null,"tool_calls":[{"index":0,"id":"","type":"function","function":{"arguments":"\""}}]},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":null,"tool_calls":[{"index":0,"id":"","type":"function","function":{"arguments":"}"}}]},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"delta":{"tool_calls":[{"function":{"arguments":""},"index":0,"id":"","type":"function"}]},"index":0}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[{"finish_reason":"tool_calls","delta":{"content":"","reasoning_content":null},"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: {"choices":[],"object":"chat.completion.chunk","usage":{"prompt_tokens":1030,"completion_tokens":1319,"total_tokens":2349,"completion_tokens_details":{"reasoning_tokens":1244,"text_tokens":1319},"prompt_tokens_details":{"text_tokens":1030}},"created":1782800697,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-7999b4d7-b7a3-9ba9-8a05-107864424463"}

data: [DONE]


data: {"choices":[{"delta":{"content":null,"reasoning_content":"用户","role":"assistant"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800971,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-13e967e8-6423-9ddd-9bb5-85dfe83995ca"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"说"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800971,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-13e967e8-6423-9ddd-9bb5-85dfe83995ca"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"“我喘不过"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800971,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-13e967e8-6423-9ddd-9bb5-85dfe83995ca"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"气”，这对应"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800971,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-13e967e8-6423-9ddd-9bb5-85dfe83995ca"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"分"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800971,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-13e967e8-6423-9ddd-9bb5-85dfe83995ca"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"诊逻辑树中的"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800971,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-13e967e8-6423-9ddd-9bb5-85dfe83995ca"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"："},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800971,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-13e967e8-6423-9ddd-9bb5-85dfe83995ca"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"\n一、 "},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800971,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-13e967e8-6423-9ddd-9bb5-85dfe83995ca"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"疲惫、恐慌、"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800971,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-13e967e8-6423-9ddd-9bb5-85dfe83995ca"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"焦躁 (P"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800971,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-13e967e8-6423-9ddd-9bb5-85dfe83995ca"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"anic)\n-"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800971,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-13e967e8-6423-9ddd-9bb5-85dfe83995ca"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" 心跳快/"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800971,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-13e967e8-6423-9ddd-9bb5-85dfe83995ca"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"喘不过气/"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800971,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-13e967e8-6423-9ddd-9bb5-85dfe83995ca"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"快要失控 -> "},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800971,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-13e967e8-6423-9ddd-9bb5-85dfe83995ca"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"强制调用 trigger_"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800971,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-13e967e8-6423-9ddd-9bb5-85dfe83995ca"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"478_b"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800971,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-13e967e8-6423-9ddd-9bb5-85dfe83995ca"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"reathing\n\n因此"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800971,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-13e967e8-6423-9ddd-9bb5-85dfe83995ca"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"，需要调用工具"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800971,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-13e967e8-6423-9ddd-9bb5-85dfe83995ca"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":" `trigger"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800971,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-13e967e8-6423-9ddd-9bb5-85dfe83995ca"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"_478"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800971,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-13e967e8-6423-9ddd-9bb5-85dfe83995ca"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"_breathing`"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800971,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-13e967e8-6423-9ddd-9bb5-85dfe83995ca"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"，理由为用户描述"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800971,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-13e967e8-6423-9ddd-9bb5-85dfe83995ca"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"自己"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800971,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-13e967e8-6423-9ddd-9bb5-85dfe83995ca"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"喘不过气，"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800971,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-13e967e8-6423-9ddd-9bb5-85dfe83995ca"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"伴有"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800971,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-13e967e8-6423-9ddd-9bb5-85dfe83995ca"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"恐慌/焦虑的身体"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800971,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-13e967e8-6423-9ddd-9bb5-85dfe83995ca"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"反应"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800971,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-13e967e8-6423-9ddd-9bb5-85dfe83995ca"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"。\n回复需要"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800971,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-13e967e8-6423-9ddd-9bb5-85dfe83995ca"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"符合"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800971,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-13e967e8-6423-9ddd-9bb5-85dfe83995ca"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"“如自然般"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800971,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-13e967e8-6423-9ddd-9bb5-85dfe83995ca"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"包容、"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800971,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-13e967e8-6423-9ddd-9bb5-85dfe83995ca"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"提供沉浸式且慢"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800971,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-13e967e8-6423-9ddd-9bb5-85dfe83995ca"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"节奏疗愈陪伴的"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800971,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-13e967e8-6423-9ddd-9bb5-85dfe83995ca"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"向导”的人设"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800971,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-13e967e8-6423-9ddd-9bb5-85dfe83995ca"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"，不使用"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800971,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-13e967e8-6423-9ddd-9bb5-85dfe83995ca"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"Markdown，不描述"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800971,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-13e967e8-6423-9ddd-9bb5-85dfe83995ca"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"练习步骤。"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800971,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-13e967e8-6423-9ddd-9bb5-85dfe83995ca"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"\n\n构造回复："},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800971,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-13e967e8-6423-9ddd-9bb5-85dfe83995ca"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"\n深呼吸"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800971,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-13e967e8-6423-9ddd-9bb5-85dfe83995ca"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"，我在这里。听到"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800971,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-13e967e8-6423-9ddd-9bb5-85dfe83995ca"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"你喘不过气"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800971,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-13e967e8-6423-9ddd-9bb5-85dfe83995ca"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"，先试着慢慢"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800971,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-13e967e8-6423-9ddd-9bb5-85dfe83995ca"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"把注意力放回"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800971,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-13e967e8-6423-9ddd-9bb5-85dfe83995ca"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"呼吸上。我会"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800971,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-13e967e8-6423-9ddd-9bb5-85dfe83995ca"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"陪你"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800971,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-13e967e8-6423-9ddd-9bb5-85dfe83995ca"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"一起慢慢来，"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800971,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-13e967e8-6423-9ddd-9bb5-85dfe83995ca"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"我们先"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800971,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-13e967e8-6423-9ddd-9bb5-85dfe83995ca"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"通过一个小小的练习"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800971,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-13e967e8-6423-9ddd-9bb5-85dfe83995ca"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"让"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800971,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-13e967e8-6423-9ddd-9bb5-85dfe83995ca"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"身体重新找到节奏"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800971,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-13e967e8-6423-9ddd-9bb5-85dfe83995ca"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"，"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800971,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-13e967e8-6423-9ddd-9bb5-85dfe83995ca"}

data: {"choices":[{"delta":{"content":null,"reasoning_content":"好吗？"},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800971,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-13e967e8-6423-9ddd-9bb5-85dfe83995ca"}

data: {"choices":[{"delta":{"content":"我在这里","reasoning_content":null},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800971,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-13e967e8-6423-9ddd-9bb5-85dfe83995ca"}

data: {"choices":[{"delta":{"content":"，先陪你慢慢","reasoning_content":null},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800971,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-13e967e8-6423-9ddd-9bb5-85dfe83995ca"}

data: {"choices":[{"delta":{"content":"把呼吸找","reasoning_content":null},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800971,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-13e967e8-6423-9ddd-9bb5-85dfe83995ca"}

data: {"choices":[{"delta":{"content":"回来。听到你说","reasoning_content":null},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800971,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-13e967e8-6423-9ddd-9bb5-85dfe83995ca"}

data: {"choices":[{"delta":{"content":"喘不过气，","reasoning_content":null},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800971,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-13e967e8-6423-9ddd-9bb5-85dfe83995ca"}

data: {"choices":[{"delta":{"content":"先试着把肩膀","reasoning_content":null},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800971,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-13e967e8-6423-9ddd-9bb5-85dfe83995ca"}

data: {"choices":[{"delta":{"content":"放","reasoning_content":null},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800971,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-13e967e8-6423-9ddd-9bb5-85dfe83995ca"}

data: {"choices":[{"delta":{"content":"下来，不用急着","reasoning_content":null},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800971,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-13e967e8-6423-9ddd-9bb5-85dfe83995ca"}

data: {"choices":[{"delta":{"content":"好","reasoning_content":null},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800971,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-13e967e8-6423-9ddd-9bb5-85dfe83995ca"}

data: {"choices":[{"delta":{"content":"起来，我会一直","reasoning_content":null},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800971,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-13e967e8-6423-9ddd-9bb5-85dfe83995ca"}

data: {"choices":[{"delta":{"content":"在这里陪着你。","reasoning_content":null},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800971,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-13e967e8-6423-9ddd-9bb5-85dfe83995ca"}

data: {"choices":[{"delta":{"content":"我们先来做一个非常","reasoning_content":null},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800971,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-13e967e8-6423-9ddd-9bb5-85dfe83995ca"}

data: {"choices":[{"delta":{"content":"简单的呼吸练习，","reasoning_content":null},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800971,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-13e967e8-6423-9ddd-9bb5-85dfe83995ca"}

data: {"choices":[{"delta":{"content":"让身体重新找回","reasoning_content":null},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800971,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-13e967e8-6423-9ddd-9bb5-85dfe83995ca"}

data: {"choices":[{"delta":{"content":"平稳的节奏。","reasoning_content":null},"finish_reason":null,"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800971,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-13e967e8-6423-9ddd-9bb5-85dfe83995ca"}

data: {"choices":[{"finish_reason":"stop","delta":{"content":"","reasoning_content":null},"index":0,"logprobs":null}],"object":"chat.completion.chunk","usage":null,"created":1782800971,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-13e967e8-6423-9ddd-9bb5-85dfe83995ca"}

data: {"choices":[],"object":"chat.completion.chunk","usage":{"prompt_tokens":1033,"completion_tokens":214,"total_tokens":1247,"completion_tokens_details":{"reasoning_tokens":160,"text_tokens":214},"prompt_tokens_details":{"text_tokens":1033}},"created":1782800971,"system_fingerprint":null,"model":"qwen3.6-plus","id":"chatcmpl-13e967e8-6423-9ddd-9bb5-85dfe83995ca"}

data: [DONE]



