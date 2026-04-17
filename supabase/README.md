# Supabase 接入指南 - 疗心舍

本指南帮助你快速在 Supabase 后台建表并接入项目。

## 快速开始（5分钟）

### 步骤 1: 创建 Supabase 项目

1. 访问 [Supabase Dashboard](https://supabase.com/dashboard)
2. 点击 "New Project"
3. 填写项目信息：
   - Name: `liaoxin-she` 或任意名称
   - Database Password: 设置强密码（保存好）
   - Region: 选择离你最近的区域
4. 点击 "Create new project"
5. 等待项目创建完成（约2分钟）

### 步骤 2: 获取 API 密钥

1. 进入项目后，点击左侧菜单 **Settings** > **API**
2. 找到以下信息：
   - `Project URL`: 类似 `https://xxxxx.supabase.co`
   - `anon public` key: 类似 `eyJhbGc...`

### 步骤 3: 配置环境变量

在项目根目录创建 `.env.development` 文件：

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 步骤 4: 运行 SQL 脚本建表

**方式一：Supabase Dashboard（推荐）**

1. 进入 Supabase Dashboard
2. 点击左侧菜单 **SQL Editor**
3. 点击 **New query**
4. 复制 `supabase/schema.sql` 的全部内容
5. 粘贴到编辑器中
6. 点击 **Run** 按钮（或按 `Cmd/Ctrl + Enter`）

**方式二：Supabase CLI**

```bash
# 安装 Supabase CLI（如果还没安装）
npm install -g supabase

# 登录
supabase login

# 初始化（如果项目还没初始化）
supabase init

# 运行 SQL
supabase db execute -f supabase/schema.sql
```

### 步骤 5: 验证表已创建

1. 在 Supabase Dashboard 点击 **Table Editor**
2. 应该能看到两个表：
   - `chat_sessions`
   - `chat_messages`
3. 如果表存在，说明建表成功！

### 步骤 6: 启用实时订阅（可选）

如果你想启用实时消息更新：

1. 进入 **Database** > **Replication**
2. 在 **Source tables** 中添加 `chat_messages` 表
3. 点击 **Enable Replication**

## 表结构说明

### chat_sessions（会话表）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键，会话唯一标识 |
| user_id | UUID | 用户ID（NULL表示匿名用户） |
| title | TEXT | 会话标题（取自第一条消息） |
| created_at | TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | 更新时间 |
| is_deleted | BOOLEAN | 软删除标记 |

### chat_messages（消息表）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键，消息唯一标识 |
| session_id | UUID | 外键，关联 chat_sessions |
| role | TEXT | 角色：user / assistant / system |
| content | TEXT | 消息内容 |
| status | TEXT | 状态：sending / sent / error / streaming |
| special_type | TEXT | 特殊类型（depression / anxiety 等） |
| healing_component | TEXT | 疗愈组件：securityCard / grounding / waitingTimer |
| metadata | JSONB | 附加数据（如情绪分析结果） |
| created_at | TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | 更新时间 |
| is_deleted | BOOLEAN | 软删除标记 |

## 本地开发

```bash
# 1. 克隆项目
git clone <your-repo>
cd vue3-business-admin

# 2. 安装依赖
npm install

# 3. 配置环境变量
cp .env.example .env.development
# 编辑 .env.development 填入你的 API 密钥

# 4. 启动开发服务器
npm run dev
```

## 生产环境部署

### Vercel

```bash
# 添加环境变量
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY

# 部署
vercel --prod
```

### Netlify

在 Netlify Dashboard > Site settings > Environment variables 中添加同样的变量。

## 故障排除

### "Table 'chat_messages' not found"

1. 检查 SQL 脚本是否成功运行
2. 在 SQL Editor 运行：`SELECT * FROM chat_messages LIMIT 1;`
3. 如果报错，检查表名是否正确

### "Invalid API key"

1. 检查 `.env.development` 中的密钥是否正确
2. 确保没有多余的空格或引号
3. 确保密钥是以 `VITE_` 开头

### "Row Level Security policy denied"

1. 进入 Supabase Dashboard > Table Editor > chat_messages
2. 点击 **Policies**
3. 检查策略是否启用
4. 可以暂时禁用 RLS 进行测试（不推荐用于生产环境）

## 后续扩展

### 添加用户认证

```sql
-- 在 chat_sessions 表中添加 user_id 关联
ALTER TABLE chat_sessions
ADD COLUMN user_id UUID REFERENCES auth.users(id);

-- 更新 RLS 策略
CREATE POLICY "Users can view own sessions"
    ON chat_sessions FOR SELECT
    USING (auth.uid() = user_id);
```

### 添加消息搜索

```sql
-- 启用全文搜索
ALTER TABLE chat_messages
ADD COLUMN searchable_content TEXT GENERATED ALWAYS AS (content) STORED;

CREATE INDEX idx_messages_search ON chat_messages USING GIN (to_tsvector('chinese', searchable_content));
```

## 帮助资源

- [Supabase 文档](https://supabase.com/docs)
- [Supabase JS 客户端](https://supabase.com/docs/reference/javascript/introduction)
- [Row Level Security 指南](https://supabase.com/docs/guides/auth/row-level-security)
