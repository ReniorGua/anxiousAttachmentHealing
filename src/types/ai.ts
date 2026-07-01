// AI Chat Message Types

export type MessageRole = 'user' | 'assistant' | 'system'

export type MessageStatus = 'sending' | 'sent' | 'error' | 'streaming'

export type SpecialType = 'depression' | 'anxiety' | 'stress' | 'anger' | 'fear' | 'tired' | 'lonely' | 'sadness' | null

export type HealingComponentType =
  | 'securityCard'
  | 'grounding'
  | 'waitingTimer'
  | 'breathing478'
  | 'energyRetraction'
  | 'somaticRadar'
  | 'innerChild'
  | 'listWriting'
  | 'freeWriting'
  | 'futureVision'
  | 'fearRelease'
  | 'deepRelease'
  | 'personalLaw'
  | 'birthMemory'
  | 'resistanceExhaustion'
  | 'thirtyDaysAffirmation'
  | 'affirmationEcho'
  | null

export type ListType = 'desires' | 'joys' | 'fears' | 'values' | 'gratitude'

export interface ChatMessage {
  id: string
  role: MessageRole
  content: string
  timestamp: number
  status?: MessageStatus
  specialType?: SpecialType
  healingComponent?: HealingComponentType
  listType?: ListType
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
