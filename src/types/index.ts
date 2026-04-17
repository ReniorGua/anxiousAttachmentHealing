// Global type definitions

// API Response Structure
export interface ApiResponse<T = any> {
  code: number
  msg: string
  data: T
}

// User Types
export interface UserInfo {
  id: number
  name: string
  username: string
  role: string
  avatar?: string
  email?: string
  phone?: string
}

export interface LoginParams {
  username: string
  password: string
  remember?: boolean
}

export interface LoginResponse {
  token: string
  userInfo: UserInfo
}

// Order Types
export interface OrderItem {
  id: number
  orderNo: string
  amount: number
  status: number
  statusText: string
  createTime: string
  updateTime: string
  customerName: string
  customerPhone: string
}

export interface OrderListParams {
  page: number
  size: number
  status?: number
  orderNo?: string
}

export interface OrderListResponse {
  list: OrderItem[]
  total: number
  page: number
  size: number
}

export interface OrderStatusParams {
  id: number
  status: number
}

// Pagination
export interface PageParams {
  page: number
  size: number
}

export interface PageResponse<T> {
  list: T[]
  total: number
  page: number
  size: number
}

// Router Meta
export interface RouteMeta {
  title: string
  requiresAuth: boolean
  roles?: string[]
  icon?: string
  keepAlive?: boolean
}
