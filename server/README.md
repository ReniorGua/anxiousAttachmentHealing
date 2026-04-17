# AI 后端代理服务设置指南

## 📋 目录

1. [快速开始](#快速开始)
2. [获取阿里云 DashScope API Key](#获取阿里云-dashscope-api-key)
3. [配置后端服务](#配置后端服务)
4. [启动服务](#启动服务)
5. [故障排查](#故障排查)

---

## 🚀 快速开始

### 1. 安装后端依赖

```bash
cd server
npm install
```

### 2. 配置 API Key

复制环境变量示例文件并填入你的 API Key：

```bash
# Windows PowerShell
Copy-Item .env.example .env

# 或者手动创建 .env 文件
```

编辑 `.env` 文件，填入你的阿里云 DashScope API Key：

```env
DASHSCOPE_API_KEY=sk-your-actual-api-key-here
DASHSCOPE_MODEL=qwen-turbo
PORT=3000
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

### 3. 启动后端服务

```bash
# 开发模式（支持热重载）
npm run dev

# 或普通模式
npm start
```

看到以下输出表示成功：

```
╔════════════════════════════════════════════════════════╗
║  Vue3 Admin Backend Server                             ║
║  Running on http://localhost:3000                      ║
║                                                        ║
║  Endpoints:                                            ║
║  POST /api/chat          - Chat with AI                ║
║  POST /api/chat/stream   - Stream chat response        ║
║  GET  /api/health        - Health check                ║
║  GET  /api/models        - List available models       ║
╚════════════════════════════════════════════════════════╝
```

### 4. 启动前端

打开新终端窗口：

```bash
npm run dev
```

访问 http://localhost:5173 即可使用 AI 聊天功能！

---

## 🔑 获取阿里云 DashScope API Key

### 步骤 1: 注册/登录阿里云账号

访问 [阿里云官网](https://www.aliyun.com/) 并登录你的账号。

### 步骤 2: 开通 DashScope 服务

1. 访问 [DashScope 控制台](https://dashscope.console.aliyun.com/)
2. 如果是首次使用，需要开通服务
3. 新用户通常有免费额度

### 步骤 3: 创建 API Key

1. 进入 [API Key 管理页面](https://dashscope.console.aliyun.com/apiKey)
2. 点击"创建新的 API Key
3. 复制生成的 API Key（格式：`sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`）
4. **重要**: API Key 只显示一次，请妥善保管

### 步骤 4: 查看额度和使用情况

在 [用量查询](https://dashscope.console.aliyun.com/usage) 可以查看：
- 剩余额度
- 使用量统计
- 账单详情

---

## ⚙️ 配置后端服务

### 环境变量说明

| 变量名 | 说明 | 默认值 | 必填 |
|--------|------|--------|------|
| `DASHSCOPE_API_KEY` | 阿里云 DashScope API Key | - | ✅ |
| `DASHSCOPE_MODEL` | 使用的模型 | `qwen-turbo` | ❌ |
| `PORT` | 服务器端口 | `3000` | ❌ |
| `ALLOWED_ORIGINS` | CORS 允许的源 | `http://localhost:5173` | ❌ |

### 可选模型

| 模型 ID | 名称 | 特点 | 适用场景 |
|--------|------|------|----------|
| `qwen-turbo` | 通义千问 Turbo | 速度最快，成本最低 | 日常对话、简单问答 |
| `qwen-plus` | 通义千问 Plus | 性能平衡 | 复杂任务、代码生成 |
| `qwen-max` | 通义千问 Max | 最强性能 | 高难度任务、专业领域 |
| `qwen-max-longcontext` | 通义千问 Max 长文本 | 支持超长上下文 | 长文档分析、论文阅读 |

修改模型只需编辑 `.env` 文件：

```env
DASHSCOPE_MODEL=qwen-plus
```

---

## 🎯 启动服务

### 方式一：分别启动（推荐开发使用）

**终端 1 - 启动后端：**
```bash
cd server
npm run dev
```

**终端 2 - 启动前端：**
```bash
npm run dev
```

### 方式二：同时启动（需要安装 concurrently）

```bash
# 安装 concurrently
npm install -g concurrently

# 一键启动所有服务
npm run dev:all
```

### 方式三：生产环境部署

```bash
# 构建前端
npm run build

# 启动后端（使用 PM2 等进程管理器）
cd server
pm2 start index.js --name vue3-admin-backend
```

---

## 🔍 故障排查

### 问题 1: 后端启动失败

**错误信息**: `Error: DashScope API key not configured`

**解决方案**:
1. 检查 `server/.env` 文件是否存在
2. 确认 `DASHSCOPE_API_KEY` 已正确填写
3. 重启后端服务

### 问题 2: CORS 错误

**错误信息**: `Not allowed by CORS`

**解决方案**:

1. 检查 `.env` 中的 `ALLOWED_ORIGINS`
2. 确保包含前端的地址（如 `http://localhost:5173`）
3. 多个地址用逗号分隔

### 问题 3: API 调用失败 - 401

**错误信息**: `Invalid DashScope API key`

**解决方案**:
1. 检查 API Key 是否正确（是否复制完整）
2. 确认 API Key 未过期
3. 在 DashScope 控制台重新生成 API Key

### 问题 4: API 调用失败 - 429

**错误信息**: `请求过于频繁`

**解决方案**:
1. 降低请求频率
2. 检查是否有程序在循环调用
3. 考虑升级 DashScope 套餐

### 问题 5: 前端无法连接后端

**错误信息**: `Failed to fetch`

**解决方案**:
1. 确认后端服务已启动（访问 http://localhost:3000/api/health）
2. 检查前端 `.env.development` 中的 `VITE_BACKEND_API_URL`
3. 检查防火墙设置

### 问题 6: 响应速度慢

**可能原因**:
1. 网络延迟
2. 模型响应慢（特别是 qwen-max）

**解决方案**:
1. 切换到更快的模型（如 qwen-turbo）
2. 检查网络连接
3. 启用流式响应提升用户体验

---

## 📊 API 端点说明

### POST /api/chat

普通聊天接口，返回完整响应。

**请求体**:
```json
{
  "message": "你好",
  "sessionId": "session-123",
  "stream": false
}
```

**响应**:
```json
{
  "messageId": "msg-123",
  "content": "你好！有什么可以帮助你的吗？",
  "sessionId": "session-123",
  "usage": {
    "input_tokens": 10,
    "output_tokens": 20,
    "total_tokens": 30
  }
}
```

### POST /api/chat/stream

流式聊天接口，使用 SSE 实时返回内容。

**请求体**:
```json
{
  "message": "写一首诗",
  "sessionId": "session-123"
}
```

**响应**: Server-Sent Events 流

### GET /api/health

健康检查接口。

**响应**:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "service": "vue3-admin-backend",
  "version": "1.0.0"
}
```

### GET /api/models

获取可用模型列表。

**响应**:
```json
{
  "models": [
    { "id": "qwen-turbo", "name": "通义千问 Turbo", "description": "速度快，成本低" },
    { "id": "qwen-plus", "name": "通义千问 Plus", "description": "性能平衡" },
    { "id": "qwen-max", "name": "通义千问 Max", "description": "最强性能" }
  ],
  "current": "qwen-turbo"
}
```

---

## 💡 最佳实践

### 1. 安全

- ✅ **永远不要**在前端代码中硬编码 API Key
- ✅ 使用环境变量管理敏感信息
- ✅ 在生产环境使用 HTTPS
- ✅ 限制 CORS 允许的源

### 2. 成本优化

- ✅ 根据场景选择合适的模型
- ✅ 设置预算告警
- ✅ 监控用量情况
- ✅ 对高频请求做缓存

### 3. 性能优化

- ✅ 使用流式响应提升用户体验
- ✅ 实现请求去重和防抖
- ✅ 添加本地缓存
- ✅ 使用连接池

### 4. 错误处理

- ✅ 实现重试机制
- ✅ 提供友好的错误提示
- ✅ 记录错误日志
- ✅ 实现降级方案（如 Mock 回复）

---

## 📞 技术支持

- 阿里云 DashScope 文档：https://help.aliyun.com/zh/dashscope/
- 通义千问模型介绍：https://tongyi.aliyun.com/qianwen/
- 项目 Issues：https://github.com/your-repo/issues

---

## 📝 更新日志

### v1.0.0 (2024-01-01)
- ✨ 初始版本
- ✅ 支持通义千问多种模型
- ✅ 流式响应支持
- ✅ 完整的错误处理
- ✅ CORS 配置
- ✅ 健康检查端点
