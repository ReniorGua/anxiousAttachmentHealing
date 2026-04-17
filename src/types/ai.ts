// AI Chat Message Types

export type MessageRole = 'user' | 'assistant' | 'system'

export type MessageStatus = 'sending' | 'sent' | 'error' | 'streaming'

export type SpecialType = 'depression' | 'anxiety' | 'stress' | 'anger' | 'fear' | 'tired' | 'lonely' | 'sadness' | null

export type HealingComponentType = 'securityCard' | 'grounding' | 'waitingTimer' | null

export interface ChatMessage {
  id: string
  role: MessageRole
  content: string
  timestamp: number
  status?: MessageStatus
  specialType?: SpecialType
  healingComponent?: HealingComponentType
}

export interface ChatSession {
  id: string
  title: string
  messages: ChatMessage[]
  createdAt: number
  updatedAt: number
}

export interface AIChatRequest {
  message: string
  sessionId?: string
}

export interface AIChatResponse {
  messageId: string
  content: string
  sessionId: string
}
