# ============================================================
# 松间心舍 · Cloudflare 部署指南
# ============================================================

> 本项目部署在 Cloudflare Pages + Cloudflare Workers，采用边缘部署架构。

---

## 架构概览

```
用户浏览器 → Cloudflare Pages (边缘节点) → Cloudflare Workers → 阿里云 DashScope
                              ↓
                       Supabase (记忆云同步)
```

**技术栈：**
- 前端：Vue 3 + Vite + Tailwind CSS → Cloudflare Pages
- 后端：Hono Framework → Cloudflare Workers
- AI：阿里云 DashScope 通义千问 API

---

## 前置条件

- Node.js 18+ 已安装
- Git 已安装
- Cloudflare 账号（免费注册：cloudflare.com）
- Wrangler CLI 已安装：`npm install -g wrangler`

---

## 环境变量配置

### 1. 前端环境变量 (.env.production)

```env
VITE_DASHSCOPE_API_KEY=sk-你的阿里云API密钥
VITE_DASHSCOPE_MODEL=qwen-plus
VITE_SUPABASE_URL=https://你的项目.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
VITE_ACCESS_CODE=你和AI都知道的那句话
VITE_BACKEND_API_URL=https://你的域名/api
```

### 2. 后端环境变量 (server/.dev.vars 或 Cloudflare Secrets)

```env
DASHSCOPE_API_KEY=sk-你的阿里云API密钥
DASHSCOPE_MODEL=qwen-plus
ACCESS_CODE=你和AI都知道的那句话
```

---

## 部署步骤

### 1. 部署后端 (Cloudflare Workers)

```bash
cd server

# 首次登录 Cloudflare
wrangler login

# 设置敏感环境变量（ Secrets ）
npx wrangler secret put DASHSCOPE_API_KEY
npx wrangler secret put ACCESS_CODE

# 部署到 Cloudflare Workers
wrangler deploy
```

部署成功后，Workers URL 格式为：
`https://healing-backend.<your-subdomain>.workers.dev`

### 2. 部署前端 (Cloudflare Pages)

```bash
# 构建前端
npm run build

# 部署到 Cloudflare Pages
npx wrangler pages deploy dist --project-name=healing-frontend
```

或者通过 GitHub 集成：
1. 登录 [dash.cloudflare.com](https://dash.cloudflare.com)
2. **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**
3. 选择你的 GitHub 仓库
4. 配置构建：
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
5. 点击 **Deploy**

### 3. 配置自定义域名

#### 后端域名
在 `server/wrangler.toml` 中已配置：
```toml
routes = [
  { pattern = "api.healing-rest-return.cyou", custom_domain = true }
]
```

#### 前端域名
在 Cloudflare Dashboard 中：
1. 进入 Pages 项目 → **Settings → Custom Domains**
2. 点击 **Set up a custom domain**
3. 输入你的域名
4. Cloudflare 会自动配置 SSL 证书

---

## API 接口

### POST /api/chat/stream

流式聊天接口，SSE 格式返回，支持中途取消。

**请求头：**
- `Content-Type: application/json`
- `X-Access-Code: <your-code>`

**请求体：**
```json
{
  "message": "用户消息",
  "sessionId": "会话ID",
  "tool_choice": "auto"
}
```

**响应：** SSE 流，包含 `choices[0].delta.content` 和 `choices[0].delta.tool_calls`

```bash
curl -X POST https://api.healing-rest-return.cyou/api/chat/stream \
  -H "Content-Type: application/json" \
  -H "X-Access-Code: your-code" \
  -d '{"message": "我最近总是很焦虑"}'
```

### POST /api/summarize

记忆淬炼接口，分析对话提取焦虑触发点。

**请求体：**
```json
{
  "conversation": "对话内容"
}
```

**响应：**
```json
{
  "triggers": ["触发点1", "触发点2"],
  "selfSoothingEfforts": ["努力1", "努力2"],
  "summary": "简短描述"
}
```

---

## 验证部署

### 验证后端

```bash
curl -X POST https://api.healing-rest-return.cyou/api/chat/stream \
  -H "Content-Type: application/json" \
  -H "X-Access-Code: your-code" \
  -d '{"message":"你好"}'
```

返回 SSE 流 = 部署成功。

### 验证前端

访问你的域名，检查：
- [ ] 页面正常加载，显示松间心舍界面
- [ ] 点击聊天图标，能正常对话
- [ ] AI 回复流式显示
- [ ] 点击停止按钮能中断 AI 回复

---

## 常见问题

**Q: Cloudflare Workers 有哪些限制？**
A: Workers 有 10ms CPU 时间限制和 128MB 内存限制（免费计划）。Hono 框架完全兼容。

**Q: 如何查看 Workers 日志？**
A: `wrangler tail` 或在 Dashboard 的 **Logs** 中查看实时日志。

**Q: Workers 计费方式？**
A: 免费计划每月 10 万请求，超出 $5/百万请求。

**Q: 如何更新环境变量？**
A: 使用 `npx wrangler secret put 变量名` 更新 Secrets，然后重新部署。

**Q: 域名 SSL 证书问题？**
A: Cloudflare 自动为你域名提供免费 SSL 证书。

---

## 本地开发

### 启动后端
```bash
cd server
npx wrangler dev
```

### 启动前端
```bash
npm run dev
```

---

## 架构总结

```
┌─────────────────────────────────────────────────────────────┐
│                        用户浏览器                             │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Cloudflare Pages                          │
│                    (Vue 3 + Vite 前端)                       │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Cloudflare Workers                        │
│                    (Hono 后端服务)                           │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────────┐  │
│  │ /api/chat   │  │ /api/summarize│  │ 工具调用路由       │  │
│  │ /stream     │  │              │  │ executeTool()     │  │
│  └─────────────┘  └──────────────┘  └────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    阿里云 DashScope                          │
│                    (通义千问 API)                            │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Supabase                                │
│                  (记忆云同步·可选)                           │
└─────────────────────────────────────────────────────────────┘
```

前端部署在 Cloudflare Pages，后端部署在 Cloudflare Workers，全部在 Cloudflare 全球边缘网络上，速度更快，安全性更高。