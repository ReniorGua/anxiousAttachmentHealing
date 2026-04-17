import { createClient } from '@supabase/supabase-js'

// Supabase configuration
// Add these to your .env.development or .env.production file:
// VITE_SUPABASE_URL=your-supabase-project-url
// VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

// Validate configuration
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '[Supabase] Missing configuration. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.'
  )
}

// Create Supabase client
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      // Auto-refresh session
      autoRefreshToken: true,
      // Persist session to localStorage
      persistSession: true,
      // Detect logout from third-party cookie changes
      detectSessionInUrl: true,
    },
    // Real-time configuration
    realtime: {
      // Enable realtime subscriptions
      params: {
        eventsPerSecond: 10,
      },
    },
  }
)

// Type definitions for database tables
export interface Database {
  public: {
    Tables: {
      chat_sessions: {
        Row: {
          id: string
          user_id: string | null
          title: string
          created_at: string
          updated_at: string
          is_deleted: boolean
        }
        Insert: {
          id?: string
          user_id?: string | null
          title?: string
          created_at?: string
          updated_at?: string
          is_deleted?: boolean
        }
        Update: {
          id?: string
          user_id?: string | null
          title?: string
          created_at?: string
          updated_at?: string
          is_deleted?: boolean
        }
      }
      chat_messages: {
        Row: {
          id: string
          session_id: string
          role: 'user' | 'assistant' | 'system'
          content: string
          status: 'sending' | 'sent' | 'error' | 'streaming' | null
          special_type: string | null
          healing_component: string | null
          metadata: Record<string, any>
          created_at: string
          updated_at: string
          is_deleted: boolean
        }
        Insert: {
          id?: string
          session_id: string
          role: 'user' | 'assistant' | 'system'
          content?: string
          status?: 'sending' | 'sent' | 'error' | 'streaming' | null
          special_type?: string | null
          healing_component?: string | null
          metadata?: Record<string, any>
          created_at?: string
          updated_at?: string
          is_deleted?: boolean
        }
        Update: {
          id?: string
          session_id?: string
          role?: 'user' | 'assistant' | 'system'
          content?: string
          status?: 'sending' | 'sent' | 'error' | 'streaming' | null
          special_type?: string | null
          healing_component?: string | null
          metadata?: Record<string, any>
          created_at?: string
          updated_at?: string
          is_deleted?: boolean
        }
      }
    }
  }
}

// Helper function to check if Supabase is configured
export const isSupabaseConfigured = (): boolean => {
  return !!(supabaseUrl && supabaseAnonKey && supabaseUrl !== 'https://placeholder.supabase.co')
}
