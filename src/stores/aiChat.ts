import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { ChatMessage, ChatSession, SpecialType, HealingComponentType } from '@/types/ai'
import { supabase, isSupabaseConfigured, type Database } from '@/supabase'
import { useUserStore } from './user'

type ChatSessionRow = Database['public']['Tables']['chat_sessions']['Row']
type ChatMessageRow = Database['public']['Tables']['chat_messages']['Row']

/**
 * Generate unique ID (UUID v4)
 */
const generateId = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

/**
 * Convert Supabase row to ChatSession
 */
const rowToSession = (row: ChatSessionRow): ChatSession => ({
  id: row.id,
  title: row.title,
  messages: [],
  createdAt: new Date(row.created_at).getTime(),
  updatedAt: new Date(row.updated_at).getTime(),
})

/**
 * Convert Supabase row to ChatMessage
 */
const rowToMessage = (row: ChatMessageRow): ChatMessage => ({
  id: row.id,
  role: row.role,
  content: row.content,
  timestamp: new Date(row.created_at).getTime(),
  status: row.status || 'sent',
  specialType: row.special_type as SpecialType || null,
  healingComponent: row.healing_component as HealingComponentType || null,
})

export const useAIChatStore = defineStore('aiChat', () => {
  // State
  const sessions = ref<ChatSession[]>([])
  const currentSessionId = ref<string | null>(null)
  const isLoading = ref<boolean>(false)
  const isSyncing = ref<boolean>(false)  // Syncing with Supabase
  const error = ref<string | null>(null)
  const isSupabaseAvailable = ref<boolean>(false)

  // Getters
  const currentSession = computed<ChatSession | null>(() => {
    if (!currentSessionId.value) {
      return null
    }
    const sessionIndex = sessions.value.findIndex(s => s.id === currentSessionId.value)
    return sessionIndex !== -1 ? sessions.value[sessionIndex] : null
  })

  const currentMessages = computed<ChatMessage[]>(() => {
    const session = currentSession.value
    return session ? session.messages : []
  })

  // Check Supabase availability
  const checkSupabase = () => {
    isSupabaseAvailable.value = isSupabaseConfigured()
    console.log('[AI Chat Store] Supabase available:', isSupabaseAvailable.value)
  }

  // Get anonymous UID
  const getAnonymousUid = (): string => {
    const userStore = useUserStore()
    return userStore.anonymousUid || 'anonymous'
  }

  // =====================================================
  // Supabase Operations
  // =====================================================

  /**
   * Fetch sessions from Supabase
   */
  async function fetchSessionsFromSupabase(): Promise<ChatSession[]> {
    if (!isSupabaseAvailable.value) {
      console.log('[AI Chat Store] Supabase not available, skipping fetch')
      return []
    }

    try {
      const { data, error: sbError } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('anonymous_uid', getAnonymousUid())
        .eq('is_deleted', false)
        .order('updated_at', { ascending: false })
        .limit(50)

      if (sbError) throw sbError

      const sessionsFromDb = (data || []).map(rowToSession)
      console.log('[AI Chat Store] Fetched sessions from Supabase:', sessionsFromDb.length)
      return sessionsFromDb
    } catch (err) {
      console.error('[AI Chat Store] Failed to fetch sessions from Supabase:', err)
      return []
    }
  }

  /**
   * Fetch messages for a session from Supabase
   */
  async function fetchMessagesFromSupabase(sessionId: string): Promise<ChatMessage[]> {
    if (!isSupabaseAvailable.value) {
      return []
    }

    try {
      const { data, error: sbError } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', sessionId)
        .eq('anonymous_uid', getAnonymousUid())
        .eq('is_deleted', false)
        .order('created_at', { ascending: true })

      if (sbError) throw sbError

      const messages = (data || []).map(rowToMessage)
      console.log('[AI Chat Store] Fetched messages from Supabase:', messages.length)
      return messages
    } catch (err) {
      console.error('[AI Chat Store] Failed to fetch messages from Supabase:', err)
      return []
    }
  }

  /**
   * Save session to Supabase
   */
  async function saveSessionToSupabase(session: ChatSession): Promise<string | null> {
    if (!isSupabaseAvailable.value) {
      return null
    }

    try {
      const { data, error: sbError } = await supabase
        .from('chat_sessions')
        .upsert({
          id: session.id,
          anonymous_uid: getAnonymousUid(),
          title: session.title,
          created_at: new Date(session.createdAt).toISOString(),
          updated_at: new Date(session.updatedAt).toISOString(),
          is_deleted: false,
        })
        .select()
        .single()

      if (sbError) throw sbError
      console.log('[AI Chat Store] Saved session to Supabase:', data.id)
      return data.id
    } catch (err) {
      console.error('[AI Chat Store] Failed to save session to Supabase:', err)
      return null
    }
  }

  /**
   * Save message to Supabase
   */
  async function saveMessageToSupabase(sessionId: string, message: ChatMessage): Promise<string | null> {
    if (!isSupabaseAvailable.value) {
      return null
    }

    try {
      const { data, error: sbError } = await supabase
        .from('chat_messages')
        .upsert({
          id: message.id,
          session_id: sessionId,
          anonymous_uid: getAnonymousUid(),
          role: message.role,
          content: message.content,
          status: message.status,
          special_type: message.specialType || null,
          healing_component: message.healingComponent || null,
          created_at: new Date(message.timestamp).toISOString(),
          updated_at: new Date(message.timestamp).toISOString(),
          is_deleted: false,
        })
        .select()
        .single()

      if (sbError) throw sbError
      return data.id
    } catch (err) {
      console.error('[AI Chat Store] Failed to save message to Supabase:', err)
      return null
    }
  }

  /**
   * Delete session from Supabase (soft delete)
   */
  async function deleteSessionFromSupabase(sessionId: string): Promise<boolean> {
    if (!isSupabaseAvailable.value) {
      return false
    }

    try {
      const { error: sbError } = await supabase
        .from('chat_sessions')
        .update({ is_deleted: true, updated_at: new Date().toISOString() })
        .eq('id', sessionId)

      if (sbError) throw sbError
      console.log('[AI Chat Store] Deleted session from Supabase:', sessionId)
      return true
    } catch (err) {
      console.error('[AI Chat Store] Failed to delete session from Supabase:', err)
      return false
    }
  }

  /**
   * Update session title in Supabase
   */
  async function updateSessionTitleInSupabase(sessionId: string, title: string): Promise<boolean> {
    if (!isSupabaseAvailable.value) {
      return false
    }

    try {
      const { error: sbError } = await supabase
        .from('chat_sessions')
        .update({ title, updated_at: new Date().toISOString() })
        .eq('id', sessionId)

      if (sbError) throw sbError
      return true
    } catch (err) {
      console.error('[AI Chat Store] Failed to update session title:', err)
      return false
    }
  }

  // =====================================================
  // Core Actions
  // =====================================================

  /**
   * Load from localStorage first, then sync with Supabase
   */
  async function loadFromStorage() {
    try {
      // Load from localStorage first
      const stored = localStorage.getItem('ai-chat-sessions')
      console.log('[AI Chat Store] Loading from localStorage...')

      if (stored) {
        const parsedSessions = JSON.parse(stored)

        parsedSessions.forEach((session: ChatSession) => {
          session.messages.forEach((msg: ChatMessage) => {
            if (!msg.status) {
              msg.status = 'sent'
            }
          })
        })

        sessions.value = parsedSessions
        console.log('[AI Chat Store] Loaded from localStorage:', sessions.value.length)
      }

      const currentId = localStorage.getItem('ai-chat-current-session')
      if (currentId) {
        currentSessionId.value = currentId

        const sessionExists = sessions.value.find(s => s.id === currentId)
        if (!sessionExists) {
          currentSessionId.value = null
        }
      }

      // Check Supabase availability
      checkSupabase()

      // If Supabase is available, try to sync
      if (isSupabaseAvailable.value) {
        await syncWithSupabase()
      }

      console.log('[AI Chat Store] Load complete')
    } catch (e) {
      console.error('[AI Chat Store] Load from storage failed:', e)
      sessions.value = []
      currentSessionId.value = null
    }
  }

  /**
   * Sync local data with Supabase
   */
  async function syncWithSupabase() {
    if (isSyncing.value || !isSupabaseAvailable.value) return

    isSyncing.value = true
    console.log('[AI Chat Store] Starting Supabase sync...')

    try {
      // Fetch sessions from Supabase
      const remoteSessions = await fetchSessionsFromSupabase()

      if (remoteSessions.length === 0) {
        // No remote data, push local sessions to Supabase
        console.log('[AI Chat Store] No remote sessions, pushing local sessions...')
        for (const session of sessions.value) {
          await saveSessionToSupabase(session)
          for (const message of session.messages) {
            await saveMessageToSupabase(session.id, message)
          }
        }
      } else {
        // Merge remote and local sessions
        console.log('[AI Chat Store] Merging sessions...')

        // For each remote session, check if we have it locally
        for (const remoteSession of remoteSessions) {
          const localIndex = sessions.value.findIndex(s => s.id === remoteSession.id)

          if (localIndex === -1) {
            // New session from remote, add to local
            sessions.value.push(remoteSession)
            // Fetch messages for this session
            const messages = await fetchMessagesFromSupabase(remoteSession.id)
            const sessionIndex = sessions.value.findIndex(s => s.id === remoteSession.id)
            if (sessionIndex !== -1) {
              sessions.value[sessionIndex].messages = messages
            }
          } else {
            // Existing session, check timestamps
            const localSession = sessions.value[localIndex]
            if (new Date(remoteSession.updatedAt) > new Date(localSession.updatedAt)) {
              // Remote is newer, fetch messages
              const messages = await fetchMessagesFromSupabase(remoteSession.id)
              sessions.value[localIndex].messages = messages
              sessions.value[localIndex].updatedAt = remoteSession.updatedAt
            }
          }
        }

        // Push any local-only sessions to Supabase
        for (const localSession of sessions.value) {
          const existsRemotely = remoteSessions.some(r => r.id === localSession.id)
          if (!existsRemotely) {
            await saveSessionToSupabase(localSession)
            for (const message of localSession.messages) {
              await saveMessageToSupabase(localSession.id, message)
            }
          }
        }
      }

      // Save current session ID to localStorage
      if (currentSessionId.value) {
        localStorage.setItem('ai-chat-current-session', currentSessionId.value)
      }

      console.log('[AI Chat Store] Supabase sync complete')
    } catch (err) {
      console.error('[AI Chat Store] Supabase sync failed:', err)
    } finally {
      isSyncing.value = false
    }
  }

  /**
   * Save to localStorage (always)
   */
  function saveToStorage() {
    try {
      const sessionsData = JSON.stringify(sessions.value)
      localStorage.setItem('ai-chat-sessions', sessionsData)

      if (currentSessionId.value) {
        localStorage.setItem('ai-chat-current-session', currentSessionId.value)
      }
    } catch (e) {
      console.error('[AI Chat Store] Save to storage failed:', e)
    }
  }

  /**
   * Create new chat session
   */
  async function createSession(title?: string): Promise<ChatSession> {
    const newSession: ChatSession = {
      id: generateId(),
      title: title || '新对话',
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }

    sessions.value.push(newSession)
    currentSessionId.value = newSession.id

    // Save to localStorage
    saveToStorage()

    // Save to Supabase
    await saveSessionToSupabase(newSession)

    return newSession
  }

  /**
   * Add user message
   */
  async function addUserMessage(content: string): Promise<ChatMessage> {
    if (!currentSessionId.value) {
      await createSession()
    }

    const sessionIndex = sessions.value.findIndex(s => s.id === currentSessionId.value)
    if (sessionIndex === -1) {
      throw new Error('No active session')
    }

    const session = sessions.value[sessionIndex]

    const message: ChatMessage = {
      id: generateId(),
      role: 'user',
      content,
      timestamp: Date.now(),
      status: 'sent',
    }

    session.messages.push(message)
    session.updatedAt = Date.now()

    // Update title if first message
    if (session.messages.length === 1) {
      session.title = content.slice(0, 30) + (content.length > 30 ? '...' : '')
      await updateSessionTitleInSupabase(session.id, session.title)
    }

    // Save to localStorage
    saveToStorage()

    // Save to Supabase
    await saveMessageToSupabase(session.id, message)

    return message
  }

  /**
   * Add AI message
   */
  async function addAIMessage(content: string, specialType?: SpecialType): Promise<ChatMessage> {
    const sessionIndex = sessions.value.findIndex(s => s.id === currentSessionId.value)
    if (sessionIndex === -1) {
      console.error('[AI Chat Store] addAIMessage failed: No active session found')
      throw new Error('No active session')
    }

    const session = sessions.value[sessionIndex]

    const message: ChatMessage = {
      id: generateId(),
      role: 'assistant',
      content,
      timestamp: Date.now(),
      status: 'sent',
      specialType,
    }

    session.messages.splice(session.messages.length, 0, message)
    session.updatedAt = Date.now()

    // Save to localStorage
    saveToStorage()

    // Save to Supabase
    await saveMessageToSupabase(session.id, message)

    return message
  }

  /**
   * Add or update streaming AI message (for streaming responses)
   */
  function addStreamingAIMessage(chunk: string): ChatMessage | null {
    const session = sessions.value.find(s => s.id === currentSessionId.value)
    if (!session) {
      return null
    }

    const lastMessage = session.messages[session.messages.length - 1]

    if (lastMessage && lastMessage.role === 'assistant' && lastMessage.status === 'streaming') {
      const lastIndex = session.messages.length - 1
      const updatedMessage: ChatMessage = {
        ...lastMessage,
        content: lastMessage.content + chunk,
        timestamp: Date.now(),
      }
      session.messages.splice(lastIndex, 1, updatedMessage)
    } else {
      const message: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: chunk,
        timestamp: Date.now(),
        status: 'streaming',
      }
      session.messages.push(message)
    }

    session.updatedAt = Date.now()
    return session.messages[session.messages.length - 1]
  }

  /**
   * Mark last message as complete (end of streaming)
   */
  async function completeStreamingMessage() {
    const session = sessions.value.find(s => s.id === currentSessionId.value)
    if (!session) return

    const lastMessage = session.messages[session.messages.length - 1]
    if (lastMessage && lastMessage.role === 'assistant' && lastMessage.status === 'streaming') {
      lastMessage.status = 'sent'
      saveToStorage()
      // Save to Supabase
      await saveMessageToSupabase(session.id, lastMessage)
    }
  }

  /**
   * Set loading state
   */
  function setLoading(loading: boolean) {
    isLoading.value = loading
    if (loading) {
      error.value = null
    }
  }

  /**
   * Set error
   */
  function setError(err: string | null) {
    error.value = err
  }

  /**
   * Clear current session
   */
  function clearCurrentSession() {
    currentSessionId.value = null
  }

  /**
   * Delete session
   */
  async function deleteSession(sessionId: string) {
    sessions.value = sessions.value.filter(s => s.id !== sessionId)

    if (currentSessionId.value === sessionId) {
      currentSessionId.value = null
    }

    // Save to localStorage
    saveToStorage()

    // Delete from Supabase
    await deleteSessionFromSupabase(sessionId)
  }

  /**
   * Clear all chats
   */
  async function clearAllChats() {
    // Delete all from Supabase first
    for (const session of sessions.value) {
      await deleteSessionFromSupabase(session.id)
    }

    sessions.value = []
    currentSessionId.value = null
    error.value = null

    removeFromStorage()
  }

  /**
   * Remove from localStorage
   */
  function removeFromStorage() {
    try {
      localStorage.removeItem('ai-chat-sessions')
      localStorage.removeItem('ai-chat-current-session')
    } catch (e) {
      console.error('Clear chat history failed:', e)
    }
  }

  /**
   * Add healing component to a message
   */
  async function addHealingComponent(messageId: string, componentType: HealingComponentType, listType?: string) {
    const session = sessions.value.find(s => s.id === currentSessionId.value)
    if (!session) return

    const message = session.messages.find(m => m.id === messageId)
    if (message) {
      message.healingComponent = componentType
      if (listType) {
        message.listType = listType as any
      }
      saveToStorage()
      // Save to Supabase
      await saveMessageToSupabase(session.id, message)
    }
  }

  /**
   * Remove healing component from a message
   */
  async function removeHealingComponent(messageId: string) {
    const session = sessions.value.find(s => s.id === currentSessionId.value)
    if (!session) return

    const message = session.messages.find(m => m.id === messageId)
    if (message) {
      message.healingComponent = null
      saveToStorage()
      // Save to Supabase
      await saveMessageToSupabase(session.id, message)
    }
  }

  /**
   * Select session
   */
  function selectSession(sessionId: string) {
    currentSessionId.value = sessionId
    saveToStorage()
  }

  return {
    // State
    sessions,
    currentSessionId,
    isLoading,
    isSyncing,
    error,
    isSupabaseAvailable,
    // Getters
    currentSession,
    currentMessages,
    // Actions
    createSession,
    addUserMessage,
    addAIMessage,
    addStreamingAIMessage,
    completeStreamingMessage,
    setLoading,
    setError,
    clearCurrentSession,
    deleteSession,
    clearAllChats,
    loadFromStorage,
    saveToStorage,
    removeFromStorage,
    selectSession,
    addHealingComponent,
    removeHealingComponent,
    // Supabase sync
    syncWithSupabase,
  }
})
