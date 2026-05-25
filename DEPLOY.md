# ============================================================
# 疗心舍 · Vercel 部署指南（傻瓜版）
# ============================================================

## 前置条件

- Node.js 18+ 已安装
- Git 已安装
- Vercel 账号（免费注册：vercel.com）

---

## 第一步：打包生产环境变量

1. 复制模板文件：
   ```
   cp .env.production.example .env.production
   ```

2. 编辑 `.env.production`，填入真实值：
   ```
   VITE_DASHSCOPE_API_KEY=sk-你的阿里云API密钥
   VITE_DASHSCOPE_MODEL=qwen-plus
   VITE_SUPABASE_URL=https://你的项目.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGc...
   VITE_ACCESS_CODE=你和AI都知道的那句话
   VITE_BACKEND_API_URL=https://你的后端地址.railway.app
   ```

---

## 第二步：在 Vercel 控制台配置环境变量

1. 登录 vercel.com，进入你的项目
2. 进入 **Settings → Environment Variables**
3. 逐一添加以下变量（名称和值均从 `.env.production` 复制）：

   | 变量名 | 值 |
   |--------|-----|
   | VITE_DASHSCOPE_API_KEY | sk-7dbc57c2db974c3ab... |
   | VITE_DASHSCOPE_MODEL | qwen-plus |
   | VITE_SUPABASE_URL | https://xxx.supabase.co |
   | VITE_SUPABASE_ANON_KEY | eyJhbGc... |
   | VITE_ACCESS_CODE | 你春天时相信的那句话 |
   | VITE_BACKEND_API_URL | https://xxx.railway.app |

4. **重要**：为 Production 和 Preview 环境都添加，Development 可留空

---

## 第三步：一键部署（终端命令）

```bash
# 进入项目目录
cd /path/to/HealRestReturn

# 登录 Vercel（首次需要）
vercel login

# 部署到预览环境（可分享链接）
vercel

# 确认无误后，部署到生产环境
vercel --prod
```

**就这么简单。Vercel 会自动检测到 `vercel.json` 并处理 Vue Router 的 History 模式 404 问题。**

---

## 第四步：验证部署

部署完成后，Vercel 会给出访问链接，例如：
`https://your-app.vercel.app`

测试以下功能：
- [ ] 打开链接，显示疗心舍界面
- [ ] 点击聊天图标，能正常对话
- [ ] 点击左上角"成长年轮"图标，能打开记忆时间轴
- [ ] 刷新 `/memory` 页面，不会404（这是 History 模式的关键验证）

---

## 关于后端 AI 代理服务

**前端不直接调用 DashScope**，所有 AI 请求都经过后端代理。
你需要额外部署 `server/` 目录到 Railway。

---

### 详细操作：Railway 部署后端

#### 第一步：检查 server/package.json

确保 `server/package.json` 长这样：

```json
{
  "name": "liaoxinshe-backend",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "start": "node index.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "@upstash/ratelimit": "^2.0.0",
    "@upstash/redis": "^1.34.0"
  }
}
```

#### 第二步：在 Railway 创建项目

1. 打开 [railway.app](https://railway.app)，用 GitHub 账号登录
2. 点击 **New Project → Deploy from GitHub repo**
3. 选择你的 `vue3-business-admin` 仓库
4. Railway 默认部署根目录，**需要修改**：进入 **Settings → Root Directory**，改成 `server`
5. 在 **Environment** 标签页添加变量（从 `server/.env` 复制）：
   - `DASHSCOPE_API_KEY=sk-你的真实密钥`
   - `DASHSCOPE_MODEL=qwen-plus`
   - `ACCESS_CODE=你春天时相信的那句话`
   - `ALLOWED_ORIGINS=https://你的app.vercel.app,https://*.vercel.app`

#### 第三步：获取 Railway URL

Railway 部署完成后会给你一个 URL，格式类似：
```
https://liaoxinshe-backend.up.railway.app
```

**复制这个 URL**，稍后用到。

#### 第四步：更新后端 CORS 允许 Vercel 域名

在 Railway 的 Environment 变量里修改：
```
ALLOWED_ORIGINS=https://your-app.vercel.app,https://*.vercel.app
```

> 如果你不知道 Vercel 域名，可以先填 `*`，确认能调通后再收窄。

#### 第五步：在 Vercel 配置前端环境变量

在 Vercel 控制台设置：
```
VITE_BACKEND_API_URL=https://你的-railway-url.up.railway.app
```

#### 第六步：验证后端是否正常

```bash
curl -X POST https://你的-railway-url.up.railway.app/api/chat \
  -H "Content-Type: application/json" \
  -H "X-Access-Code: 你春天时相信的那句话" \
  -d '{"message":"你好"}'
```

返回 AI 回复 = 部署成功。

---

### 或者：直接用 Railway CLI 部署（无需 GitHub）

```bash
cd server

# 首次登录
railway login

# 初始化项目（选空项目）
railway init

# 添加环境变量
railway variables set DASHSCOPE_API_KEY=sk-xxx
railway variables set DASHSCOPE_MODEL=qwen-plus
railway variables set ACCESS_CODE=你春天时相信的那句话
railway variables set ALLOWED_ORIGINS=https://*.vercel.app

# 部署
railway up
```

Railway CLI 会返回一个 URL，复制到 Vercel 的 `VITE_BACKEND_API_URL` 即可。

---

## 常见问题

**Q: 部署后 API 调用报错？**
A: 检查 `VITE_BACKEND_API_URL` 是否指向已部署的后端服务地址

**Q: 刷新页面 404？**
A: 确保 `vercel.json` 已在项目根目录，并且 rewrites 规则正确

**Q: AI 回复是"服务暂时不可用"？**
A: 1）检查后端是否正常运行；2）检查 ACCESS_CODE 前后端是否一致

---

## 架构总结

```
用户浏览器 → Vercel 前端 → 后端代理 (Railway/Render) → 阿里云 DashScope
                ↓
         Supabase (记忆云同步)
```

前端只和后端通信，后端代理转发到阿里云。API Key 不暴露在浏览器。