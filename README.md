# 松间心舍 (Healing Rest Return)

一个温暖的心理健康陪伴应用，以「关切与注视」为核心视觉基调，用缓慢、静谧的交互体验，陪伴用户度过每一个需要温暖的时刻。

## 视觉理念

「关切与注视」—— 像暗房里慢慢显影的照片，像电影结尾缓慢滚动的字幕，像一个安静陪伴在你身边的人。

- **极简边框**：去除所有多余的边框和强烈的阴影，改用极细的分割线和低饱和度的材质感底色
- **电影字幕排版**：克制的文字排版，加大行距，像电影字幕一样留白
- **暗房显影动画**：所有状态切换都采用缓慢的淡入淡出效果，如同暗房里照片显影般静谧

## 技术栈

### 核心技术
- **前端框架**: Vue 3.5+ (Setup 语法糖 + Composition API)
- **构建工具**: Vite 7.x
- **语言**: TypeScript 5.x
- **样式**: Tailwind CSS 3.x
- **状态管理**: Pinia 3.x
- **路由**: Vue Router 4.x
- **后端**: Hono Framework (Cloudflare Workers 边缘部署)
- **数据库**: Supabase (可选，用于存储聊天记录和记忆)

### AI 能力
- **模型**: 阿里云通义千问 (Qwen Turbo/Plus/Max)
- **接入方式**: SSE 流式响应 + Function Calling 工具调用
- **特色功能**: 情绪分诊、疗愈练习组件自动触发、流式对话中断取消

## 快速开始

### 环境要求
- Node.js 18+
- npm 9+
- Wrangler CLI (`npm install -g wrangler`)

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

前端环境变量 (`.env.development`):
```env
VITE_DASHSCOPE_API_KEY=your-dashscope-api-key
VITE_DASHSCOPE_MODEL=qwen-plus
VITE_BACKEND_API_URL=http://localhost:8787
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_ACCESS_CODE=your-access-code
```

后端环境变量 (`server/.dev.vars`):
```env
DASHSCOPE_API_KEY=your-dashscope-api-key
DASHSCOPE_MODEL=qwen-plus
ACCESS_CODE=your-access-code
```

### 3. 启动后端服务

```bash
cd server
npx wrangler dev
```

服务将在 http://localhost:8787 启动

### 4. 启动前端

```bash
npm run dev
```

访问 http://localhost:5173

## 核心功能

### 1. AI 流式聊天陪伴

在「松间心舍」中，AI 不是冰冷的问答机器，而是一个温暖、安全的陪伴者。

- **流式响应**：文字逐字显现，像手写信一样缓缓展开
- **中途取消**：支持点击停止按钮中断 AI 回复
- **情绪感知**：自动识别用户情绪，调整回应方式
- **工具调用**：检测到需要疗愈时，自动触发对应练习组件

### 2. 疗愈练习组件

当 AI 检测到用户需要特定疗愈时，会通过 Function Calling 触发对应组件：

| 组件 | 触发条件 |
|------|----------|
| 478 呼吸法 (Breathing478) | 用户焦虑、紧张 |
| 五感着陆练习 (GroundingFiveSenses) | 用户感到不真实、解离 |
| 等待计时器 (WaitingTimer) | 用户想冲动联系他人 |
| 能量回收练习 (EnergyRetraction) | 用户感到被掏空 |
| 身体扫描雷达 (SomaticRadar) | 用户有身体紧绷 |
| 内在小孩 (InnerChild) | 用户童年创伤相关 |
| 恐惧释放 (FearRelease) | 用户表达恐惧 |
| 深层释放 (DeepRelease) | 用户背负沉重秘密 |
| 阻抗耗尽 (ResistanceExhaustion) | 用户处于抗拒状态 |
| 肯定语回声 (AffirmationEcho) | 用户需要正向肯定 |
| 30天肯定语 (ThirtyDaysAffirmation) | 用户需要长期疗愈 |
| 个人法则 (PersonalLaw) | 用户有被侵犯感 |
| 未来愿景 (FutureVision) | 用户失去希望 |
| 出生记忆 (BirthMemory) | 用户有创伤根源 |

### 3. 安全感卡片 (SecurityCard)

莫兰迪色系的温暖卡片，点击即可获得一句自我肯定的话语。

### 4. 书写疗愈

- **清单书写 (ListWriting)**: 通过结构化问题引导用户梳理情绪
- **自由书写 (FreeWriting)**: 无评判的自由表达出口

## 目录结构

```
├── src/
│   ├── api/
│   │   └── ai.ts              # AI 聊天接口（流式）
│   ├── components/            # 公共组件
│   ├── layouts/               # 布局组件
│   ├── router/                # 路由配置
│   ├── stores/                # Pinia 状态管理
│   │   ├── aiChat.ts          # AI 聊天状态
│   │   ├── global.ts          # 全局状态
│   │   └── userMemory.ts      # 用户记忆状态
│   ├── types/                 # TypeScript 类型
│   ├── utils/                 # 工具函数
│   ├── views/
│   │   ├── ai/
│   │   │   ├── AIChatView.vue         # 倾诉树洞（主聊天页面）
│   │   │   ├── components/            # 疗愈组件
│   │   │   │   ├── SecurityCard.vue
│   │   │   │   ├── GroundingFiveSenses.vue
│   │   │   │   ├── WaitingTimer.vue
│   │   │   │   ├── Breathing478.vue
│   │   │   │   ├── EnergyRetraction.vue
│   │   │   │   ├── SomaticRadar.vue
│   │   │   │   ├── InnerChild.vue
│   │   │   │   ├── FearRelease.vue
│   │   │   │   ├── DeepRelease.vue
│   │   │   │   ├── ResistanceExhaustion.vue
│   │   │   │   ├── AffirmationEcho.vue
│   │   │   │   ├── ThirtyDaysAffirmation.vue
│   │   │   │   ├── PersonalLaw.vue
│   │   │   │   ├── FutureVision.vue
│   │   │   │   ├── BirthMemory.vue
│   │   │   │   ├── ListWriting.vue
│   │   │   │   └── FreeWriting.vue
│   │   ├── dashboard/
│   │   │   ├── DashboardView.vue      # 首页
│   │   │   └── MemoryTimeline.vue     # 成长年轮
│   │   ├── practice/
│   │   │   └── PracticeSpaceView.vue  # 疗愈岛屿
│   │   └── home/
│   │       └── HomeView.vue           # 欢迎页
│   ├── App.vue
│   ├── main.ts
│   └── style.css
├── server/                    # Cloudflare Workers 后端
│   ├── index.js               # Hono 服务器
│   ├── wrangler.toml          # Wrangler 配置
│   └── .dev.vars              # 本地环境变量
├── supabase/                  # Supabase 配置
│   └── schema.sql
└── vite.config.ts
```

## 设计原则

### 1. 视觉克制

- 不使用强烈的阴影，改用极细分割线
- 不使用高饱和度颜色，改用低饱和度莫兰迪色系
- 卡片使用半透明材质感底色

### 2. 动画静谧

所有动画都遵循「暗房显影」原则：

```css
/* 暗房显影动画 */
@keyframes photo-dev-in {
  0% { opacity: 0; filter: brightness(0.6) blur(2px); }
  100% { opacity: 1; filter: brightness(1) blur(0); }
}
```

动画时长：800ms - 1200ms（缓慢）
缓动函数：ease-out（不急促）

### 3. 文字呼吸感

- 行距：1.9（电影字幕般舒展）
- 字间距：0.02em - 0.05em（克制的呼吸感）
- 标题和正文保持适当对比度

## API 接口

### POST /api/chat/stream

流式聊天接口，SSE 格式返回，支持中途取消。

```bash
curl -X POST https://api.healing-rest-return.cyou/api/chat/stream \
  -H "Content-Type: application/json" \
  -H "X-Access-Code: your-code" \
  -d '{"message": "我最近总是很焦虑", "sessionId": "xxx"}'
```

### POST /api/summarize

记忆淬炼接口，分析对话提取焦虑触发点。

## 环境配置

### 开发环境

```env
VITE_DASHSCOPE_API_KEY=your-api-key
VITE_DASHSCOPE_MODEL=qwen-plus
VITE_BACKEND_API_URL=http://localhost:8787
```

### 生产环境

部署在 Cloudflare Workers，参考 DEPLOY.md 进行配置。

## 获取 API Key

### 阿里云 DashScope
1. 访问 https://dashscope.console.aliyun.com/apiKey
2. 创建 API Key
3. 选择模型：qwen-turbo（速度快）或 qwen-plus（效果更好）

### Supabase (可选)
1. 访问 https://supabase.com/dashboard
2. 创建新项目
3. 在 Settings > API 获取 URL 和 anon key

## 浏览器支持

- Chrome >= 90
- Firefox >= 88
- Safari >= 14
- Edge >= 90
- iOS Safari >= 14
- Android Chrome >= 90

## 致谢

「松间心舍」的设计理念从「暗房显影」和「电影字幕」中汲取灵感，感谢所有让这个世界变得更温暖的人和事。

## 许可证

MIT License