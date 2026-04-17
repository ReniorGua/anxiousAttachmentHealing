# 疗心舍

一个温暖的心理健康陪伴应用，以「关切与注视」为核心视觉基调，用缓慢、静谧的交互体验，陪伴用户度过每一个需要温暖的时刻。

## 视觉理念

「关切与注视」—— 像暗房里慢慢显影的照片，像电影结尾缓慢滚动的字幕，像一个安静陪伴在你身边的人。

- **极简边框**：去除所有多余的边框和强烈的阴影，改用极细的分割线和低饱和度的材质感底色
- **电影字幕排版**：克制的文字排版，加大行距，像电影字幕一样留白
- **暗房显影动画**：所有状态切换都采用缓慢的淡入淡出效果，如同暗房里照片显影般静谧

## 技术栈

### 核心技术
- **框架**: Vue 3.5+ (Setup 语法糖 + Composition API)
- **构建工具**: Vite 7.x
- **语言**: TypeScript 5.x
- **样式**: Tailwind CSS 3.x
- **状态管理**: Pinia 3.x
- **路由**: Vue Router 4.x
- **后端代理**: Express.js (连接阿里云 DashScope 通义千问 API)
- **数据库**: Supabase (可选，用于存储聊天记录)

### AI 能力
- **模型**: 阿里云通义千问 (Qwen Turbo/Plus/Max)
- **接入方式**: 后端代理 + SSE 流式响应
- **特色功能**: 情绪感知、安全感卡片、五感着陆练习

## 快速开始

### 环境要求
- Node.js 18+
- npm 9+

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制环境变量模板并填写实际配置：

```bash
cp .env.example .env.development
cp server/.env.example server/.env
```

编辑 `.env.development`：
```env
VITE_DASHSCOPE_API_KEY=your-dashscope-api-key
VITE_DASHSCOPE_MODEL=qwen-turbo
VITE_BACKEND_API_URL=http://localhost:3000
```

编辑 `server/.env`：
```env
DASHSCOPE_API_KEY=your-dashscope-api-key
DASHSCOPE_MODEL=qwen-turbo
PORT=3000
```

### 3. 启动后端服务

```bash
cd server
node index.js
```

服务将在 http://localhost:3000 启动

### 4. 启动前端

```bash
npm run dev
```

访问 http://localhost:5173

### 测试账号
- **用户名**: `admin` 或 `user`
- **密码**: 任意密码

## 核心功能

### 1. AI 聊天陪伴

在「疗心舍」中，AI 不是冰冷的问答机器，而是一个温暖、安全的陪伴者。

- **流式响应**：文字逐字显现，像手写信一样缓缓展开
- **情绪感知**：自动识别用户情绪，调整回应方式
- **安全感卡片**：当检测到用户情绪低落时，自动展示温暖的自我肯定语句
- **五感着陆练习**：当检测到用户焦虑时，引导进行 5-4-3-2-1 接地练习
- **等待计时器**：帮助用户度过想要冲动联系他人的时刻

### 2. 安全感卡片 (SecurityCard)

莫兰迪色系的温暖卡片，点击即可获得一句自我肯定的话语。

```
"我值得被爱，也值得拥有美好的一切"
"此刻，我安全了"
"我接纳此刻的自己"
```

### 3. 五感着陆练习 (GroundingFiveSenses)

基于 5-4-3-2-1 接地技术，帮助用户通过感官回归当下：

- 视觉：说出 5 样看到的东西
- 触觉：触摸 4 样东西
- 听觉：倾听 3 种声音
- 嗅觉：嗅闻 2 种气味
- 味觉：品尝 1 样东西

### 4. 20 分钟等待计时器 (WaitingTimer)

圆形倒计时，帮助用户阻断想要立刻发消息的冲动。配合极缓慢的呼吸动画和温暖的话语：

> "这段时间，你的焦虑在照顾你。但也请你照顾一下它。"

## 目录结构

```
├── src/
│   ├── api/                    # API 接口
│   │   ├── ai.ts              # AI 聊天接口
│   │   ├── user.ts            # 用户接口
│   │   └── order.ts           # 订单接口
│   ├── components/            # 公共组件
│   ├── layouts/               # 布局组件
│   │   ├── MainLayout.vue     # 主布局
│   │   └── LoginLayout.vue    # 登录布局
│   ├── router/                # 路由配置
│   ├── stores/                # Pinia 状态管理
│   │   ├── aiChat.ts          # AI 聊天状态
│   │   ├── user.ts            # 用户状态
│   │   └── global.ts          # 全局状态
│   ├── types/                 # TypeScript 类型
│   ├── utils/                 # 工具函数
│   ├── views/                 # 业务页面
│   │   ├── ai/               # AI 聊天模块
│   │   │   ├── AIChatView.vue         # 主聊天页面
│   │   │   ├── SecurityCard.vue       # 安全感卡片
│   │   │   ├── GroundingFiveSenses.vue # 五感练习
│   │   │   ├── WaitingTimer.vue       # 等待计时器
│   │   │   └── components/
│   │   │       ├── WarmCard.vue       # 温暖卡片
│   │   │       └── BreathingGuide.vue # 呼吸引导
│   │   ├── dashboard/         # 首页
│   │   ├── order/             # 订单管理
│   │   └── user/              # 用户管理
│   ├── App.vue
│   ├── main.ts
│   └── style.css              # 全局样式
├── server/                    # 后端服务
│   ├── index.js               # Express 服务器
│   └── package.json
├── supabase/                  # Supabase 配置
│   └── schema.sql             # 数据库 schema
├── .env.example               # 环境变量模板
└── tailwind.config.js         # Tailwind 配置
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

## 环境配置

### 开发环境

```env
VITE_DASHSCOPE_API_KEY=your-api-key
VITE_DASHSCOPE_MODEL=qwen-turbo
VITE_BACKEND_API_URL=http://localhost:3000
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 生产环境

在 Vercel/Railway/Render 等平台设置相同的环境变量。

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

「疗心舍」的设计理念从「暗房显影」和「电影字幕」中汲取灵感，感谢所有让这个世界变得更温暖的人和事。

## 许可证

MIT License
