# ============================================================
# 疗心舍 · Cloudflare 部署指南（迁移版）
# ============================================================

> 本指南适用于从 Vercel + Railway 迁移到 Cloudflare Pages + Cloudflare Workers。
> 迁移过程中域名解析无需变更，继续使用您现有的自定义域名。

---

##架构变化

```
# 迁移前
用户浏览器 → Vercel 前端 → 后端代理 (Railway) → 阿里云 DashScope
                     ↓
              Supabase (记忆云同步)

# 迁移后
用户浏览器 → Cloudflare Pages 前端 → Cloudflare Workers 后端 → 阿里云 DashScope
                        ↓
                 Supabase (记忆云同步)
```

**主要变化：**
- 前端：Vercel → Cloudflare Pages
- 后端：Railway → Cloudflare Workers（无需维护服务器，按请求计费）
- 速度：Cloudflare 全球边缘网络，访问更快

---

## 前置条件

- Node.js 18+ 已安装
- Git 已安装
- Cloudflare 账号（免费注册：cloudflare.com）
- Wrangler CLI 已安装：`npm install -g wrangler`

---

## 第一步：打包生产环境变量

1. 复制模板文件：
   ```bash
   cp .env.production.example .env.production
   ```

2. 编辑 `.env.production`，填入真实值：
   ```
   VITE_DASHSCOPE_API_KEY=sk-你的阿里云API密钥
   VITE_DASHSCOPE_MODEL=qwen-plus
   VITE_SUPABASE_URL=https://你的项目.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGc...
   VITE_ACCESS_CODE=你和AI都知道的那句话
   VITE_BACKEND_API_URL=https://你的域名/api
   ```

---

## 第二步：迁移后端（Railway → Cloudflare Workers）

### 2.1 创建 Cloudflare Workers 项目

在后端目录创建 `wrangler.toml`：

```toml
name = "liaoxinshe-backend"
main = "src/index.js"
compatibility_date = "2024-01-01"

[vars]
ALLOWED_ORIGINS = "https://你的域名,https://*.workers.dev"

# 环境变量（在 Cloudflare Dashboard 中设置更安全）
# DASHSCOPE_API_KEY=sk-xxx
# DASHSCOPE_MODEL=qwen-plus
# ACCESS_CODE=你春天时相信的那句话
```

### 2.2 重构后端代码

Cloudflare Workers 使用 `workerd` 运行时，需要将 Express.js 转换为 Fetch API 方式。

将 `server/index.js` 重命名为 `server/src/index.js` 并做以下修改：

```javascript
// 原来（Express.js）
const express = require('express')
const cors = require('cors')
const app = express()
app.use(cors())
app.post('/api/chat', (req, res) => { ... })
app.listen(3000)

//改为（Cloudflare Workers）
export default {
  async fetch(request, env) {
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-Access-Code',
    }

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders })
    }

    const url = new URL(request.url)

    if (url.pathname === '/api/chat' && request.method === 'POST') {
      // 处理聊天请求
      const body = await request.json()
      const { message } = body

      // 调用 DashScope
      const response = await fetch('https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.DASHSCOPE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: env.DASHSCOPE_MODEL || 'qwen-plus',
          messages: [{ role: 'user', content: message }],
        }),
      })

      const data = await response.json()
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    return new Response('Not Found', { status: 404 })
  }
}
```

### 2.3 处理 CORS 和环境变量

在 Workers 中，环境变量通过 `env` 对象访问：

```javascript
// 获取环境变量
const apiKey = env.DASHSCOPE_API_KEY
const model = env.DASHSCOPE_MODEL || 'qwen-plus'
const accessCode = env.ACCESS_CODE
```

### 2.4 部署后端

```bash
cd server

# 首次登录 Cloudflare
wrangler login

# 部署到 Cloudflare Workers
wrangler deploy
```

部署成功后，Workers URL格式为：
`https://liaoxinshe-backend.<your-subdomain>.workers.dev`

### 2.5 在 Cloudflare Dashboard 设置环境变量

1. 登录 [dash.cloudflare.com](https://dash.cloudflare.com)
2. 进入 **Workers & Pages** → 找到你的后端项目
3. **Settings → Variables** 添加：
   - `DASHSCOPE_API_KEY` = `sk-你的真实密钥`
   - `DASHSCOPE_MODEL` = `qwen-plus`
   - `ACCESS_CODE` = `你春天时相信的那句话`
4. 保存后重新部署使变量生效

---

## 第三步：迁移前端（Vercel → Cloudflare Pages）

### 3.1 使用 Wrangler 部署

```bash
# 进入前端目录
cd /path/to/HealRestReturn

# 部署到 Cloudflare Pages
wrangler pages deploy dist --project-name=liaoxinshe
```

### 3.2 或者通过 GitHub 集成

1. 登录 [dash.cloudflare.com](https://dash.cloudflare.com)
2. **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**
3. 选择你的 GitHub 仓库
4. 配置构建：
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
5. 点击 **Deploy**

### 3.3 配置 Pages 函数（处理 SPA 路由）

Cloudflare Pages 默认支持 SPA 路由，但需要在项目根目录添加 `_routes.json`：

```json
{
  "version": 1,
  "include": ["/*"],
  "exclude": ["/static/*"]
}
```

或者在 Cloudflare Dashboard 中配置：
1. 进入 Pages 项目 → **Settings → Functions**
2. **Single Page Application** 切换为 ON

### 3.4 设置环境变量

在 Cloudflare Dashboard 中：
1. **Settings → Environment Variables**
2. 添加前端环境变量（去掉 `VITE_` 前缀，因为 Pages 会自动处理）：

| Variable Name | Value |
|--------------|-------|
| DASHSCOPE_API_KEY | sk-7dbc57c2db974c3ab... |
| DASHSCOPE_MODEL | qwen-plus |
| SUPABASE_URL | https://xxx.supabase.co |
| SUPABASE_ANON_KEY | eyJhbGc... |
| ACCESS_CODE | 你春天时相信的那句话 |
| BACKEND_API_URL | https://liaoxinshe-backend.xxx.workers.dev |

> 注意：Cloudflare Pages 的环境变量在构建时注入，如果使用 Vite 的 `import.meta.env`，变量必须以 `VITE_` 开头。

### 3.5 配置自定义域名

1. 在 Cloudflare Dashboard 中进入 **Workers & Pages**
2. 选择你的项目 → **Settings → Custom Domains**
3. 点击 **Set up a custom domain**
4. 输入你的域名（如 `yourdomain.com`）
5. Cloudflare 会 自动配置 SSL证书

如果域名是在其他注册商购买的，需要修改 DNS：
- 添加一条 CNAME 记录指向 Cloudflare Pages分配的域名

---

## 第四步：验证部署

### 4.1 验证前端

访问你的域名，检查：
- [ ] 页面正常加载，显示疗心舍界面
- [ ] 点击聊天图标，能正常对话
- [ ] 点击左上角"成长年轮"图标，能打开记忆时间轴
- [ ] 刷新 `/memory` 页面，不会404

### 4.2 验证后端

```bash
curl -X POST https://liaoxinshe-backend.xxx.workers.dev/api/chat \
  -H "Content-Type: application/json" \
  -H "X-Access-Code: 你春天时相信的那句话" \
  -d '{"message":"你好"}'
```

返回 AI 回复 = 部署成功。

---

## 第五步：更新 DNS 和域名解析

如果你的域名目前在 Vercel/Railway 使用，迁移到 Cloudflare 后需要更新 DNS：

1. 登录你的域名注册商（购买域名的平台）
2. 修改 DNS 服务器为 Cloudflare：
   - 在注册商设置中，将 nameserver 改为 Cloudflare 提供的地址
   - ( Cloudflare 会提示你具体的 nameserver 地址)
3. 在 Cloudflare Dashboard 中添加 DNS 记录：
   - 前端：添加一条 CNAME 记录指向 Pages 项目
   - 后端：Workers 不需要 DNS，直接使用 *.workers.dev 域名

---

## 常见问题

**Q: Cloudflare Workers 有哪些限制？**
A: Workers 有 10ms CPU 时间限制和 128MB 内存限制（免费计划）。Express.js 完全兼容，但某些 Node.js API 需要使用 Web API 替代。

**Q: 如何查看 Workers 日志？**
A: `wrangler tail` 或在 Dashboard 的 **Logs** 中查看实时日志。

**Q: Workers 计费方式？**
A: 免费计划每月 10 万请求，超出 $5/百万请求。比 Railway 按小时计费更经济。

**Q: 原来的 Railway 后端可以保留吗？**
A: 可以，但建议逐步迁移。可以在迁移期间保持两个后端，通过切换 `BACKEND_API_URL` 测试。

**Q: 域名 SSL 证书问题？**
A: Cloudflare 自动为你域名提供免费 SSL 证书。如果域名在其他注册商，确保 DNS 正确配置即可。

---

## 架构总结

```
用户浏览器 → Cloudflare Pages (边缘节点) → Cloudflare Workers → 阿里云 DashScope
                         ↓
                  Supabase (记忆云同步)
```

前端部署在 Cloudflare Pages，后端部署在 Cloudflare Workers，全部在 Cloudflare 全球边缘网络上，速度更快，安全性更高。