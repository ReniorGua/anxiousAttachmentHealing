# 🤖 AI 聊天功能完整设置指南

## 📋 目录

1. [概述](#概述)
2. [架构说明](#架构说明)
3. [快速开始](#快速开始)
4. [详细配置](#详细配置)
5. [使用说明](#使用说明)
6. [故障排查](#故障排查)

---

## 概述

本项目已集成阿里云通义千问（DashScope）AI 能力，提供智能聊天功能。

### ✨ 主要特性

- ✅ **后端代理**: 安全的 API 调用方式，不暴露 API Key
- ✅ **流式响应**: 打字机效果，提升用户体验
- ✅ **多模型支持**: 支持通义千问全系列模型
- ✅ **错误处理**: 完善的错误处理和降级方案
- ✅ **本地缓存**: localStorage 保存聊天记录
- ✅ **Mock 模式**: API 不可用时自动降级为 Mock 回复

---

## 架构说明

```
┌─────────────┐      ┌──────────────┐      ┌─────────────────┐
│   前端      │ ───► │  后端代理    │ ───► │ 阿里云 DashScope │
│ Vue3 + Vite │      │ Express Node │      │   Qwen API      │
└─────────────┘      └──────────────┘      └─────────────────┘
     │                      │                       │
     │ http://localhost:    │ Port 3000             │ HTTPS
     │ 5173                 │                       │
     └──────────────────────┴───────────────────────┘
                          安全通信
```

### 技术栈

**前端**:
- Vue 3 + TypeScript
- Pinia (状态管理)
- TailwindCSS (样式)

**后端**:
- Node.js + Express
- CORS 中间件
- 原生 Fetch API

**AI 服务**:
- 阿里云通义千问
- 支持模型：qwen-turbo, qwen-plus, qwen-max, qwen-max-longcontext

---

## 快速开始

### 前置条件

- Node.js >= 18.x
- npm >= 9.x
- 阿里云 DashScope API Key

### 步骤 1: 安装依赖

```bash
# 安装后端依赖
npm run install:server

# 或者手动安装
cd server
npm install
cd ..
```

### 步骤 2: 获取 API Key

1. 访问 https://dashscope.console.aliyun.com/apiKey
2. 登录/注册阿里云账号
3. 点击"创建新的 API Key"
4. 复制生成的 Key（格式：`sk-xxxxxxxx`）

### 步骤 3: 配置 API Key

编辑 `server/.env` 文件：

```env
DASHSCOPE_API_KEY=sk-你的 API Key
```

### 步骤 4: 启动服务

**方式 A: 同时启动（推荐）**

```bash
npm run dev:all
```

**方式 B: 分别启动**

终端 1 - 后端:
```bash
cd server
npm run dev
```

终端 2 - 前端:
```bash
npm run dev
```

### 步骤 5: 测试

1. 打开浏览器访问 http://localhost:5173
2. 点击左侧菜单"AI 助手"
3. 发送消息："你好"
4. 收到 AI 回复表示成功！

---

## 详细配置

### 环境变量说明

#### 后端环境变量 (`server/.env`)

```env
# 阿里云 DashScope API Key（必填）
DASHSCOPE_API_KEY=sk-your-api-key-here

# 使用的模型（可选，默认：qwen-turbo）
DASHSCOPE_MODEL=qwen-turbo

# 服务器端口（可选，默认：3000）
PORT=3000

# CORS 允许的源（可选，多个用逗号分隔）
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

#### 前端环境变量 (`.env.development`)

```env
# 后端服务地址
VITE_BACKEND_API_URL=http://localhost:3000

# 模型选择（可选，由后端控制）
VITE_DASHSCOPE_MODEL=qwen-turbo
```

### 模型选择指南

| 模型 | 速度 | 效果 | 成本 | 适用场景 |
|------|------|------|------|----------|
| **qwen-turbo** | ⚡⚡⚡ | ⭐⭐ | 💰 | 日常对话、简单问答 |
| **qwen-plus** | ⚡⚡ | ⭐⭐⭐ | 💰💰 | 复杂任务、代码生成 |
| **qwen-max** | ⚡ | ⭐⭐⭐⭐⭐ | 💰💰💰 | 高难度专业任务 |
| **qwen-max-longcontext** | ⚡ | ⭐⭐⭐⭐⭐ | 💰💰💰💰 | 长文档分析 |

切换模型：编辑 `server/.env` 中的 `DASHSCOPE_MODEL`

---

## 使用说明

### API 端点

#### POST /api/chat

普通聊天接口。

**请求示例**:
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"你好","sessionId":"session-123"}'
```

**响应示例**:
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

#### POST /api/chat/stream

流式聊天接口（Server-Sent Events）。

**请求示例**:
```bash
curl -X POST http://localhost:3000/api/chat/stream \
  -H "Content-Type: application/json" \
  -d '{"message":"写一首诗"}'
```

**响应**: SSE 流

#### GET /api/health

健康检查。

**响应**:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "service": "vue3-admin-backend",
  "version": "1.0.0"
}
```

#### GET /api/models

获取可用模型列表。

**响应**:
```json
{
  "models": [
    {"id": "qwen-turbo", "name": "通义千问 Turbo", "description": "速度快，成本低"},
    {"id": "qwen-plus", "name": "通义千问 Plus", "description": "性能平衡"},
    {"id": "qwen-max", "name": "通义千问 Max", "description": "最强性能"}
  ],
  "current": "qwen-turbo"
}
```

### 测试脚本

```bash
# 测试后端是否正常运行
npm run test:backend
```

---

## 故障排查

### 常见问题

#### 1. 后端启动失败

**错误**: `Error: DashScope API key not configured`

**解决**:
```bash
# 检查 .env 文件
cat server/.env

# 确保包含以下内容
DASHSCOPE_API_KEY=sk-xxxxx
```

#### 2. CORS 错误

**错误**: `Not allowed by CORS`

**解决**:
1. 检查 `server/.env` 的 `ALLOWED_ORIGINS`
2. 添加前端地址：`http://localhost:5173`
3. 重启后端

#### 3. API Key 无效

**错误**: `Invalid DashScope API key` (401)

**解决**:
1. 检查 API Key 是否完整（以 `sk-` 开头）
2. 在 DashScope 控制台重新生成
3. 更新 `server/.env`

#### 4. 请求过于频繁

**错误**: `请求过于频繁` (429)

**解决**:
1. 降低请求频率
2. 检查是否有循环调用
3. 升级 DashScope 套餐

#### 5. 前端无法连接后端

**错误**: `Failed to fetch`

**解决**:
```bash
# 检查后端是否运行
curl http://localhost:3000/api/health

# 应该返回：{"status":"ok",...}
```

### 日志调试

查看后端日志：
```bash
cd server
npm run dev
# 观察控制台输出
```

查看前端日志：
```
浏览器 -> F12 -> Console
查找 [AI Chat] 开头的日志
```

---

## 最佳实践

### 安全

- ✅ 永远不要在前端暴露 API Key
- ✅ 使用环境变量管理敏感信息
- ✅ 生产环境使用 HTTPS
- ✅ 限制 CORS 白名单

### 成本优化

- ✅ 根据场景选择合适模型
- ✅ 设置预算告警
- ✅ 监控用量情况
- ✅ 实现请求缓存

### 性能优化

- ✅ 使用流式响应
- ✅ 实现请求防抖
- ✅ 添加本地缓存
- ✅ 使用连接池

### 错误处理

- ✅ 实现重试机制
- ✅ 提供友好错误提示
- ✅ 记录错误日志
- ✅ 实现降级方案（Mock）

---

## 费用说明

### 免费额度

新用户通常有一定免费额度，详见：
https://help.aliyun.com/zh/dashscope/pricing

### 计费方式

按 Token 数量计费：
- Input Token: 输入内容
- Output Token: AI 回复内容

### 查看用量

访问 https://dashscope.console.aliyun.com/usage

---

## 相关资源

- 📚 官方文档：https://help.aliyun.com/zh/dashscope/
- 🔑 API Key 管理：https://dashscope.console.aliyun.com/apiKey
- 💰 价格说明：https://help.aliyun.com/zh/dashscope/pricing
- 📊 用量查询：https://dashscope.console.aliyun.com/usage

---

## 更新日志

### v1.0.0 (2024-01-01)
- ✨ 初始版本
- ✅ 阿里云 DashScope 集成
- ✅ 后端代理服务
- ✅ 流式响应支持
- ✅ 完善错误处理
- ✅ Mock 降级方案

---

## 技术支持

如有问题请：
1. 查看本文档
2. 查看 `server/README.md`
3. 检查项目 Issues
4. 联系技术支持
