// Global type definitions

// API Response Structure
export interface ApiResponse<T = any> {
  code: number
  msg: string
  data: T
}

// Router Meta
export interface RouteMeta {
  title: string
  requiresAuth: boolean
  roles?: string[]
  icon?: string
  keepAlive?: boolean
}
