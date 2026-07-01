import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase, isSupabaseConfigured, type Database } from '@/supabase'

export interface TroubleRecord {
  id: string
  content: string
  timestamp: number
  resolved: boolean
}

export interface MilestoneRecord {
  id: string
  content: string
  timestamp: number
  type: 'self_soothing' | 'breakthrough' | 'peace' | 'courage'
}

/**
 * 焦虑触发点 (Trigger Point)
 * 由 LLM 淬炼后识别
 */
export interface TriggerRecord {
  id: string
  content: string
  timestamp: number
  category: string  // 'abandonment' | 'selfWorth' | 'anxiety' | 'impulse' | 'general'
  intensity?: number  // 1-5
}

/**
 * 自我安抚努力 (Self-Soothing Effort)
 * 用户在对话中展现的自我调节尝试
 */
export interface SelfSoothingEffortRecord {
  id: string
  content: string
  timestamp: number
  recognized?: boolean  // 是否已被 AI 认可
}

/**
 * 三十天肯定练习记录
 */
export interface AffirmationRecord {
  id: string
  content: string
  timestamp: number
}

const STORAGE_KEY = 'user_memory'
const ANONYMOUS_UID_KEY = 'anonymous_uid'

type MemoryRow = Database['public']['Tables']['user_memory']['Row']
type MemoryInsert = Database['public']['Tables']['user_memory']['Insert']

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

function getAnonymousUid(): string {
  return localStorage.getItem(ANONYMOUS_UID_KEY) || 'anonymous'
}

export const useUserMemoryStore = defineStore('userMemory', () => {
  // State
  const recentTroubles = ref<TroubleRecord[]>([])
  const milestones = ref<MilestoneRecord[]>([])
  const triggers = ref<TriggerRecord[]>([])       // 焦虑触发点
  const selfSoothingEfforts = ref<SelfSoothingEffortRecord[]>([])  // 自我安抚努力
  const affirmations = ref<AffirmationRecord[]>([])  // 三十天肯定练习
  const isLoaded = ref(false)

  // =====================================================
  // localStorage Operations
  // =====================================================

  function loadFromStorage() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const data = JSON.parse(stored)
        recentTroubles.value = data.recentTroubles || []
        milestones.value = data.milestones || []
        triggers.value = data.triggers || []
        selfSoothingEfforts.value = data.selfSoothingEfforts || []
        affirmations.value = data.affirmations || []
      }
      isLoaded.value = true
      console.log('[UserMemory] Loaded from localStorage:', {
        troubles: recentTroubles.value.length,
        milestones: milestones.value.length,
        triggers: triggers.value.length,
        efforts: selfSoothingEfforts.value.length,
        affirmations: affirmations.value.length,
      })
    } catch (e) {
      console.error('[UserMemory] Load failed:', e)
      recentTroubles.value = []
      milestones.value = []
      isLoaded.value = true
    }
  }

  function saveToStorage() {
    try {
      const data = {
        recentTroubles: recentTroubles.value,
        milestones: milestones.value,
        triggers: triggers.value,
        selfSoothingEfforts: selfSoothingEfforts.value,
        affirmations: affirmations.value,
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch (e) {
      console.error('[UserMemory] Save to localStorage failed:', e)
    }
  }

  // =====================================================
  // Supabase Operations
  // =====================================================

  /**
   * Push all current memory records to Supabase (full sync)
   * Used for initial migration and conflict resolution
   */
  async function pushAllToSupabase(): Promise<void> {
    if (!isSupabaseConfigured()) return
    const uid = getAnonymousUid()

    const records: MemoryInsert[] = []

    for (const t of recentTroubles.value) {
      records.push({
        id: t.id,
        anonymous_uid: uid,
        memory_type: 'trouble',
        content: t.content,
        timestamp: t.timestamp,
        metadata: { resolved: t.resolved },
      })
    }

    for (const m of milestones.value) {
      records.push({
        id: m.id,
        anonymous_uid: uid,
        memory_type: 'milestone',
        content: m.content,
        timestamp: m.timestamp,
        metadata: { type: m.type },
      })
    }

    for (const t of triggers.value) {
      records.push({
        id: t.id,
        anonymous_uid: uid,
        memory_type: 'trigger',
        content: t.content,
        timestamp: t.timestamp,
        metadata: { category: t.category, intensity: t.intensity },
      })
    }

    for (const e of selfSoothingEfforts.value) {
      records.push({
        id: e.id,
        anonymous_uid: uid,
        memory_type: 'strength',
        content: e.content,
        timestamp: e.timestamp,
        metadata: { recognized: e.recognized },
      })
    }

    if (records.length === 0) return

    try {
      const { error } = await supabase
        .from('user_memory')
        .upsert(records, { onConflict: 'id' })

      if (error) {
        console.warn('[UserMemory] Push to Supabase failed:', error.message)
      } else {
        console.log('[UserMemory] Pushed', records.length, 'records to Supabase')
      }
    } catch (e) {
      console.warn('[UserMemory] Push to Supabase error:', e)
    }
  }

  /**
   * Push a single record to Supabase
   */
  async function pushRecord(insert: MemoryInsert): Promise<void> {
    if (!isSupabaseConfigured()) return

    try {
      await supabase
        .from('user_memory')
        .upsert(insert, { onConflict: 'id' })
    } catch (e) {
      console.warn('[UserMemory] Push record error:', e)
    }
  }

  /**
   * Fetch memory from Supabase and merge with local
   * Conflict resolution: newer timestamp wins (last-write-wins)
   */
  async function syncFromSupabase(): Promise<void> {
    if (!isSupabaseConfigured()) return

    const uid = getAnonymousUid()

    try {
      const { data, error } = await supabase
        .from('user_memory')
        .select('*')
        .eq('anonymous_uid', uid)
        .eq('is_deleted', false)

      if (error) {
        console.warn('[UserMemory] Fetch from Supabase failed:', error.message)
        return
      }

      if (!data || data.length === 0) {
        console.log('[UserMemory] No cloud records found')
        return
      }

      console.log('[UserMemory] Fetched', data.length, 'records from Supabase')

      // Build maps from cloud data keyed by id
      const cloudMap = new Map<string, MemoryRow>()
      for (const row of data as MemoryRow[]) {
        cloudMap.set(row.id, row)
      }

      // Build maps from local data keyed by id
      const localTroubleMap = new Map(recentTroubles.value.map(t => [t.id, t]))
      const localMilestoneMap = new Map(milestones.value.map(m => [m.id, m]))
      const localTriggerMap = new Map(triggers.value.map(t => [t.id, t]))
      const localEffortMap = new Map(selfSoothingEfforts.value.map(e => [e.id, e]))

      let changed = false

      // Merge: if cloud is newer, update local
      for (const [id, cloud] of cloudMap) {
        switch (cloud.memory_type) {
          case 'trouble': {
            const local = localTroubleMap.get(id)
            if (!local || cloud.timestamp > local.timestamp) {
              const resolved = cloud.metadata?.resolved ?? false
              if (!localTroubleMap.has(id)) {
                recentTroubles.value.push({ id, content: cloud.content, timestamp: cloud.timestamp, resolved })
              } else {
                const idx = recentTroubles.value.findIndex(t => t.id === id)
                if (idx !== -1) {
                  recentTroubles.value[idx] = { id, content: cloud.content, timestamp: cloud.timestamp, resolved }
                }
              }
              changed = true
            }
            break
          }
          case 'milestone': {
            const local = localMilestoneMap.get(id)
            if (!local || cloud.timestamp > local.timestamp) {
              if (!localMilestoneMap.has(id)) {
                milestones.value.push({ id, content: cloud.content, timestamp: cloud.timestamp, type: cloud.metadata?.type || 'self_soothing' })
              } else {
                const idx = milestones.value.findIndex(m => m.id === id)
                if (idx !== -1) {
                  milestones.value[idx] = { id, content: cloud.content, timestamp: cloud.timestamp, type: cloud.metadata?.type || 'self_soothing' }
                }
              }
              changed = true
            }
            break
          }
          case 'trigger': {
            const local = localTriggerMap.get(id)
            if (!local || cloud.timestamp > local.timestamp) {
              if (!localTriggerMap.has(id)) {
                triggers.value.push({ id, content: cloud.content, timestamp: cloud.timestamp, category: cloud.metadata?.category || 'general', intensity: cloud.metadata?.intensity })
              } else {
                const idx = triggers.value.findIndex(t => t.id === id)
                if (idx !== -1) {
                  triggers.value[idx] = { id, content: cloud.content, timestamp: cloud.timestamp, category: cloud.metadata?.category || 'general', intensity: cloud.metadata?.intensity }
                }
              }
              changed = true
            }
            break
          }
          case 'strength': {
            const local = localEffortMap.get(id)
            if (!local || cloud.timestamp > local.timestamp) {
              if (!localEffortMap.has(id)) {
                selfSoothingEfforts.value.push({ id, content: cloud.content, timestamp: cloud.timestamp, recognized: cloud.metadata?.recognized })
              } else {
                const idx = selfSoothingEfforts.value.findIndex(e => e.id === id)
                if (idx !== -1) {
                  selfSoothingEfforts.value[idx] = { id, content: cloud.content, timestamp: cloud.timestamp, recognized: cloud.metadata?.recognized }
                }
              }
              changed = true
            }
            break
          }
        }
      }

      if (changed) {
        // Trim arrays to max size
        recentTroubles.value = recentTroubles.value.slice(0, 10)
        milestones.value = milestones.value.slice(0, 20)
        triggers.value = triggers.value.slice(0, 20)
        selfSoothingEfforts.value = selfSoothingEfforts.value.slice(0, 20)
        saveToStorage()
        console.log('[UserMemory] Merged cloud data into local store')
      }
    } catch (e) {
      console.warn('[UserMemory] Sync from Supabase error:', e)
    }
  }

  // =====================================================
  // Memory Operations (all dual-write: local + cloud)
  // =====================================================

  function addTrouble(content: string): TroubleRecord {
    const record: TroubleRecord = {
      id: generateId(),
      content,
      timestamp: Date.now(),
      resolved: false,
    }
    recentTroubles.value.unshift(record)
    recentTroubles.value = recentTroubles.value.filter(t => !t.resolved).slice(0, 10)
    saveToStorage()

    // Silent cloud sync
    pushRecord({
      id: record.id,
      anonymous_uid: getAnonymousUid(),
      memory_type: 'trouble',
      content: record.content,
      timestamp: record.timestamp,
      metadata: { resolved: false },
    })

    return record
  }

  function resolveTrouble(id: string) {
    const trouble = recentTroubles.value.find(t => t.id === id)
    if (trouble) {
      trouble.resolved = true
      saveToStorage()
      pushRecord({
        id,
        anonymous_uid: getAnonymousUid(),
        memory_type: 'trouble',
        content: trouble.content,
        timestamp: trouble.timestamp,
        metadata: { resolved: true },
      })
    }
  }

  function addMilestone(content: string, type: MilestoneRecord['type'] = 'self_soothing'): MilestoneRecord {
    const record: MilestoneRecord = {
      id: generateId(),
      content,
      timestamp: Date.now(),
      type,
    }
    milestones.value.unshift(record)
    milestones.value = milestones.value.slice(0, 20)
    saveToStorage()

    pushRecord({
      id: record.id,
      anonymous_uid: getAnonymousUid(),
      memory_type: 'milestone',
      content: record.content,
      timestamp: record.timestamp,
      metadata: { type },
    })

    return record
  }

  function addTrigger(record: Omit<TriggerRecord, 'id' | 'timestamp'>): TriggerRecord {
    const newRecord: TriggerRecord = {
      ...record,
      id: generateId(),
      timestamp: Date.now(),
    }
    triggers.value.unshift(newRecord)
    triggers.value = triggers.value.slice(0, 20)
    saveToStorage()

    pushRecord({
      id: newRecord.id,
      anonymous_uid: getAnonymousUid(),
      memory_type: 'trigger',
      content: newRecord.content,
      timestamp: newRecord.timestamp,
      metadata: { category: newRecord.category, intensity: newRecord.intensity },
    })

    return newRecord
  }

  function addSelfSoothingEffort(record: Omit<SelfSoothingEffortRecord, 'id' | 'timestamp'>): SelfSoothingEffortRecord {
    const newRecord: SelfSoothingEffortRecord = {
      ...record,
      id: generateId(),
      timestamp: Date.now(),
    }
    selfSoothingEfforts.value.unshift(newRecord)
    selfSoothingEfforts.value = selfSoothingEfforts.value.slice(0, 20)
    saveToStorage()

    pushRecord({
      id: newRecord.id,
      anonymous_uid: getAnonymousUid(),
      memory_type: 'strength',
      content: newRecord.content,
      timestamp: newRecord.timestamp,
      metadata: { recognized: newRecord.recognized },
    })

    return newRecord
  }

  function addAffirmation(content: string): AffirmationRecord {
    const newRecord: AffirmationRecord = {
      id: generateId(),
      content,
      timestamp: Date.now(),
    }
    affirmations.value.unshift(newRecord)
    saveToStorage()

    pushRecord({
      id: newRecord.id,
      anonymous_uid: getAnonymousUid(),
      memory_type: 'milestone',
      content,
      timestamp: newRecord.timestamp,
      metadata: { type: 'self_soothing', source: 'affirmation_30days' },
    })

    // Check if just completed 30 days
    if (affirmations.value.length === 30) {
      // Add special achievement milestone
      addMilestone('三十天自我重塑练习', 'breakthrough')
      console.log('[UserMemory] 🎉 Achieved 30-day affirmation milestone!')
    }

    return newRecord
  }

  // =====================================================
  // Context Summary (for AI injection)
  // =====================================================

  function getContextSummary(): string {
    const now = Date.now()
    const twentyFourHours = 24 * 60 * 60 * 1000
    const cutoff = now - twentyFourHours

    const recentTriggers = triggers.value.filter(t => t.timestamp >= cutoff).slice(0, 2)
    const recentEfforts = selfSoothingEfforts.value.filter(e => e.timestamp >= cutoff).slice(0, 2)

    if (recentTriggers.length === 0 && recentEfforts.length === 0) {
      return ''
    }

    const sentences: string[] = []

    if (recentTriggers.length > 0) {
      const triggerTexts = recentTriggers.map(t => `"${t.content}"`).join('和')
      console.log('[UserMemory] Injecting 24h triggers into context:', triggerTexts)
      sentences.push(`我记得你之前提到过，${triggerTexts}。`)
    }

    if (recentEfforts.length > 0) {
      const effortTexts = recentEfforts.map(e => `"${e.content}"`).join('、')
      if (recentEfforts.length === 1) {
        sentences.push(`我也记得你曾尝试过${recentEfforts[0].content}——你能这样为自己努力，真的很了不起。`)
      } else {
        sentences.push(`我还记得你尝试过${effortTexts}，这些都是在好好照顾自己的方式。`)
      }
    }

    return sentences.join(' ')
  }

  return {
    recentTroubles,
    milestones,
    triggers,
    selfSoothingEfforts,
    affirmations,
    isLoaded,
    loadFromStorage,
    saveToStorage,
    addTrouble,
    resolveTrouble,
    addMilestone,
    addTrigger,
    addSelfSoothingEffort,
    addAffirmation,
    getContextSummary,
    syncFromSupabase,
    pushAllToSupabase,
  }
})
