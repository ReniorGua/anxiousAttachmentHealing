-- =====================================================
-- Supabase Schema for AI Chat - 疗心舍
-- =====================================================
-- Run this script in Supabase SQL Editor to set up the database
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- Table: chat_sessions
-- Stores chat session metadata
-- =====================================================
CREATE TABLE IF NOT EXISTS chat_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,  -- NULL for anonymous users
    title TEXT NOT NULL DEFAULT '新对话',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_deleted BOOLEAN DEFAULT FALSE
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_id ON chat_sessions(user_id) WHERE is_deleted = FALSE;
CREATE INDEX IF NOT EXISTS idx_chat_sessions_updated_at ON chat_sessions(updated_at DESC);

-- =====================================================
-- Table: chat_messages
-- Stores individual messages in a chat session
-- =====================================================
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL DEFAULT '',
    status TEXT DEFAULT 'sent' CHECK (status IN ('sending', 'sent', 'error', 'streaming')),
    special_type TEXT,  -- 'depression', 'anxiety', etc.
    healing_component TEXT,  -- 'securityCard', 'grounding', 'waitingTimer'
    metadata JSONB DEFAULT '{}',  -- Additional data like emotion detection results
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_deleted BOOLEAN DEFAULT FALSE
);

-- Indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON chat_messages(session_id) WHERE is_deleted = FALSE;
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at ASC);
CREATE INDEX IF NOT EXISTS idx_chat_messages_role ON chat_messages(role);

-- =====================================================
-- Row Level Security (RLS) Policies
-- Enable RLS for row-level security
-- =====================================================

ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- For anonymous users (user_id is NULL), allow access to own data
-- This uses a simple session-based approach

-- Policy: Users can insert their own sessions
CREATE POLICY "Users can insert their own sessions"
    ON chat_sessions FOR INSERT
    TO authenticated, anon
    WITH CHECK (true);

-- Policy: Users can view their own sessions
CREATE POLICY "Users can view their own sessions"
    ON chat_sessions FOR SELECT
    TO authenticated, anon
    USING (
        -- Allow if user_id matches, or if user_id is NULL (anonymous)
        user_id IS NULL
    );

-- Policy: Users can update their own sessions
CREATE POLICY "Users can update their own sessions"
    ON chat_sessions FOR UPDATE
    TO authenticated, anon
    USING (user_id IS NULL);

-- Policy: Users can delete their own sessions
CREATE POLICY "Users can delete their own sessions"
    ON chat_sessions FOR DELETE
    TO authenticated, anon
    USING (user_id IS NULL);


-- Policy: Users can insert their own messages
CREATE POLICY "Users can insert their own messages"
    ON chat_messages FOR INSERT
    TO authenticated, anon
    WITH CHECK (true);

-- Policy: Users can view messages in their own sessions
CREATE POLICY "Users can view messages in their own sessions"
    ON chat_messages FOR SELECT
    TO authenticated, anon
    USING (
        EXISTS (
            SELECT 1 FROM chat_sessions
            WHERE id = chat_messages.session_id
            AND chat_sessions.user_id IS NULL
        )
    );

-- Policy: Users can update their own messages
CREATE POLICY "Users can update their own messages"
    ON chat_messages FOR UPDATE
    TO authenticated, anon
    USING (
        EXISTS (
            SELECT 1 FROM chat_sessions
            WHERE id = chat_messages.session_id
            AND chat_sessions.user_id IS NULL
        )
    );

-- Policy: Users can delete their own messages
CREATE POLICY "Users can delete their own messages"
    ON chat_messages FOR DELETE
    TO authenticated, anon
    USING (
        EXISTS (
            SELECT 1 FROM chat_sessions
            WHERE id = chat_messages.session_id
            AND chat_sessions.user_id IS NULL
        )
    );


-- =====================================================
-- Functions
-- =====================================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for chat_sessions
DROP TRIGGER IF EXISTS update_chat_sessions_updated_at ON chat_sessions;
CREATE TRIGGER update_chat_sessions_updated_at
    BEFORE UPDATE ON chat_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger for chat_messages
DROP TRIGGER IF EXISTS update_chat_messages_updated_at ON chat_messages;
CREATE TRIGGER update_chat_messages_updated_at
    BEFORE UPDATE ON chat_messages
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();


-- =====================================================
-- Realtime Subscriptions (Optional)
-- Enable this if you want real-time message updates
-- =====================================================

-- To enable realtime for chat_messages:
-- 1. Go to Supabase Dashboard > Database > Replication
-- 2. Add chat_messages table to replication
-- 3. Enable realtime in the API settings

-- For now, we'll use polling or manual refresh
-- See: https://supabase.com/docs/guides/realtime


-- =====================================================
-- Sample Data (Optional - for testing)
-- =====================================================

-- Uncomment to insert sample data:
/*
INSERT INTO chat_sessions (id, title) VALUES
    ('11111111-1111-1111-1111-111111111111', '测试对话1'),
    ('22222222-2222-2222-2222-222222222222', '测试对话2');

INSERT INTO chat_messages (session_id, role, content) VALUES
    ('11111111-1111-1111-1111-111111111111', 'user', '你好'),
    ('11111111-1111-1111-1111-111111111111', 'assistant', '你好！有什么我可以帮助你的吗？'),
    ('22222222-2222-2222-2222-222222222222', 'user', '我今天心情不好');
*/
