# Vue3 Business Admin Template

基于 Vue3 + Vite + TypeScript 的企业级后台管理系统模板，支持移动端适配和 AI 聊天功能。

## 🚀 技术栈

### 核心技术
- **框架**: Vue 3.5+ (Setup 语法糖 + Composition API)
- **构建工具**: Vite 7.x
- **语言**: TypeScript 5.x (严格模式)
- **样式**: Tailwind CSS 3.x (自定义主题，移动端优先)
- **状态管理**: Pinia 3.x
- **路由**: Vue Router 4.x
- **网络请求**: Axios (核心封装)
- **AI 功能**: Vercel AI SDK (@ai-sdk/openai)
- **工程规范**: ESLint + Prettier

### 移动端适配
- ✅ 响应式布局（360px - 1536px）
- ✅ 底部导航栏（移动端）
- ✅ 顶部导航栏（桌面端）
- ✅ 触摸优化（44px 最小点击区域）
- ✅ iOS 安全区域适配
- ✅ 视口配置优化

## 📦 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

**移动端调试**：
- 使用浏览器开发者工具的 Device Mode
- 推荐尺寸：iPhone 12/13/14 Pro (390x844)
- 或在真实移动设备上访问局域网 IP

### 构建生产版本

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

### 代码检查

```bash
# ESLint 检查
npm run lint

# ESLint 自动修复
npm run lint:fix

# Prettier 格式化
npm run format

# TypeScript 类型检查
npm run type-check
```

## 📁 目录结构

```
vue3-business-admin/
├── src/
│   ├── api/                    # API 接口模块
│   │   ├── user.ts            # 用户接口
│   │   ├── order.ts           # 订单接口
│   │   └── ai.ts              # AI 聊天接口（新增）
│   ├── layouts/               # 布局组件
│   │   ├── MainLayout.vue     # 主布局（移动端底部导航）
│   │   └── LoginLayout.vue    # 登录布局
│   ├── router/                # 路由配置
│   │   └── index.ts           # 路由守卫、动态路由
│   ├── stores/                # Pinia 状态管理
│   │   ├── user.ts            # 用户状态
│   │   ├── global.ts          # 全局状态
│   │   └── aiChat.ts          # AI 聊天状态（新增）
│   ├── types/                 # TypeScript 类型定义
│   │   ├── index.ts           # 全局类型
│   │   └── ai.ts              # AI 类型（新增）
│   ├── utils/                 # 工具函数
│   │   ├── request.ts         # Axios 封装
│   │   ├── storage.ts         # 存储工具
│   │   └── time.ts            # 时间工具
│   ├── views/                 # 业务页面
│   │   ├── ai/                # AI 聊天（新增）
│   │   │   └── AIChatView.vue
│   │   ├── dashboard/         # 首页（移动端适配）
│   │   ├── order/             # 订单管理（移动端适配）
│   │   └── user/              # 用户管理
│   │       ├── LoginView.vue  # 登录页（移动端适配）
│   │       └── UserListView.vue
│   ├── App.vue
│   ├── main.ts
│   └── style.css              # 全局样式（移动端优化）
├── .env.development           # 开发环境变量
├── .env.production            # 生产环境变量
├── tailwind.config.js         # Tailwind 配置（移动端断点）
├── vite.config.ts             # Vite 配置
├── tsconfig.json              # TypeScript 配置
└── README.md
```

## 🔧 核心功能

### 1. 移动端适配改造

#### 响应式断点（tailwind.config.js）
```javascript
screens: {
  'xs': '360px',    // 小屏手机（Android 常见）
  'sm': '414px',    // 大屏手机（iPhone Plus/Max）
  'md': '768px',    // 平板
  'lg': '1024px',   // 小屏桌面
  'xl': '1280px',   // 中屏桌面
  '2xl': '1536px',  // 大屏桌面
}
```

#### 视口配置（index.html）
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
```

#### 移动端优化特性
- **底部导航栏**：仅在移动端显示（< md 断点）
- **卡片式列表**：订单列表改为卡片布局
- **触摸反馈**：所有按钮添加 `active:scale` 效果
- **安全区域**：iOS 刘海屏适配（safe-area-inset）
- **防误触**：最小点击区域 44px

### 2. AI 聊天功能（新增）

#### 环境配置
在 `.env.development` 或 `.env.production` 中添加：

```env
# AI Configuration
VITE_AI_API_KEY=your-api-key-here
VITE_AI_BASE_URL=https://api.openai.com/v1
VITE_AI_MODEL=gpt-3.5-turbo
```

#### 核心文件
- **类型定义**: `src/types/ai.ts`
- **状态管理**: `src/stores/aiChat.ts`
- **API 模块**: `src/api/ai.ts`
- **聊天页面**: `src/views/ai/AIChatView.vue`

#### 功能特性
- ✅ 聊天气泡界面（用户右对齐，AI 左对齐）
- ✅ 流式响应模拟（打字机效果）
- ✅ 聊天记录本地存储（localStorage）
- ✅ 新建对话/清空记录
- ✅ 加载状态指示器
- ✅ 错误处理与友好提示

#### 使用方式
1. 登录后点击底部导航的 "AI 助手" 图标
2. 在输入框输入消息，按回车或点击发送按钮
3. AI 会自动回复（当前为模拟响应）
4. 点击右上角菜单可新建对话或清空记录

**注意**：当前使用 `mockChatWithAI()` 模拟 AI 响应。要使用真实 AI 服务：
1. 配置后端 API 代理
2. 在 `src/api/ai.ts` 中替换为实际的 `chatWithAI()` 调用
3. 设置正确的 API Key 和 Base URL

### 3. Axios 请求封装

**请求拦截器**:
- ✅ 自动从 Pinia 获取 token 并添加到请求头
- ✅ 统一设置 Content-Type
- ✅ 取消重复请求
- ✅ 全局 Loading 状态

**响应拦截器**:
- ✅ 统一解析返回格式 `{ code, msg, data }`
- ✅ 成功响应只返回 data
- ✅ 错误处理：401/403/404/500
- ✅ 10 秒超时配置

### 4. Pinia 状态管理

**用户状态** (`src/stores/user.ts`):
- `token`: 登录令牌
- `userInfo`: 用户信息
- `login()`: 登录方法（支持模拟登录）
- `logout()`: 退出登录

**全局状态** (`src/stores/global.ts`):
- `loading`: 全局加载状态
- `theme`: 主题设置
- `collapsed`: 侧边栏折叠状态

**AI 聊天状态** (`src/stores/aiChat.ts`):
- `sessions`: 聊天会话列表
- `currentSessionId`: 当前会话 ID
- `isLoading`: 加载状态
- `addUserMessage()`: 添加用户消息
- `addAIMessage()`: 添加 AI 消息
- `clearAllChats()`: 清空聊天记录

## 🔐 登录说明

### 测试账号（本地开发）
当前项目使用**模拟登录**，无需真实后端即可测试：

- **用户名**: `admin` 或 `user`
- **密码**: 任意密码（例如：`123456`）

### 登录逻辑
- **本地开发**: `src/api/user.ts` 中的 `loginApi()` 使用模拟数据
- **生产环境**: 取消注释真实 API 调用，配置后端接口地址

### 对接真实后端
如果要对接真实后端，需要：

1. 在 `.env.development` 中配置正确的 `VITE_API_BASE_URL`
2. 在 `src/api/user.ts` 中：
   ```typescript
   // 删除模拟逻辑，使用真实 API 调用
   export async function loginApi(params: LoginParams): Promise<LoginResponse> {
     return request.post<LoginResponse>('/api/user/login', params)
   }
   ```
3. 确保后端返回格式：`{ code: 200, msg: 'success', data: { token, userInfo } }`

## 🌐 环境配置

### 开发环境 (`.env.development`)

```env
NODE_ENV=development
VITE_APP_TITLE=Business Admin - Dev
VITE_API_BASE_URL=http://dev-api.xxx.com
VITE_PORT=3000

# AI Configuration
VITE_AI_API_KEY=your-api-key-here
VITE_AI_BASE_URL=https://api.openai.com/v1
VITE_AI_MODEL=gpt-3.5-turbo
```

### 生产环境 (`.env.production`)

```env
NODE_ENV=production
VITE_APP_TITLE=Business Admin
VITE_API_BASE_URL=https://api.xxx.com

# AI Configuration
VITE_AI_API_KEY=your-production-api-key-here
VITE_AI_BASE_URL=https://api.openai.com/v1
VITE_AI_MODEL=gpt-3.5-turbo
```

## 📱 移动端测试说明

### 浏览器调试
1. 打开 Chrome DevTools (F12)
2. 点击 Device Toolbar (Ctrl+Shift+M)
3. 选择设备：
   - iPhone 12/13/14 Pro (390x844)
   - iPhone 14 Pro Max (430x932)
   - Samsung Galaxy S20 (360x800)
   - iPad Mini (768x1024)

### 真机测试
1. 确保手机和电脑在同一局域网
2. 运行 `npm run dev`
3. 在手机浏览器访问 `http://[你的IP]:3000`
4. 查看网络面板中的设备列表获取 IP

### 测试要点
- [ ] 底部导航正常显示和切换
- [ ] 所有页面内容完整显示无溢出
- [ ] 输入框获取焦点时键盘正常弹出
- [ ] 按钮点击区域足够大（≥44px）
- [ ] 长列表滚动流畅
- [ ] AI 聊天页面消息气泡正确对齐

## 📄 浏览器支持

### 移动端
- iOS Safari >= 14
- Android Chrome >= 90
- Samsung Internet >= 14

### 桌面端
- Chrome >= 90
- Firefox >= 88
- Safari >= 14
- Edge >= 90

## 🔧 定制指南

### 修改主题色
编辑 `tailwind.config.js` 中的 `colors` 配置：

```javascript
colors: {
  primary: {
    DEFAULT: '#165DFF',  // 主色
    // ...
  },
}
```

### 添加新页面
1. 在 `src/views/` 创建新组件
2. 在 `src/router/index.ts` 添加路由
3. 在 `src/layouts/MainLayout.vue` 添加导航项

### 集成真实 AI 服务
1. 安装依赖：已安装 `ai` 和 `@ai-sdk/openai`
2. 配置环境变量
3. 在 `src/api/ai.ts` 中实现真实 API 调用
4. 考虑使用 Vercel AI SDK 的 `useChat` hook 实现流式响应

## 📖 最佳实践

1. **移动端优先**: 先写移动端样式，再用 `md:` `lg:` 适配桌面
2. **触摸优化**: 所有交互元素保持 ≥44px 点击区域
3. **性能优化**: 图片懒加载，列表虚拟化（长列表）
4. **类型安全**: 避免使用 any，定义清晰的 TypeScript 接口
5. **状态持久化**: 重要数据使用 localStorage 持久化

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

## 📜 许可证

MIT License
