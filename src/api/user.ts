import type { LoginParams, LoginResponse, UserInfo } from '@/types'
import { generateMockToken, generateMockUser, simulateNetworkDelay } from '@/utils/mock'

/**
 * User Login - Mock Implementation
 * @param params - Login credentials (username, password, remember)
 * 
 * Note: This is a mock implementation for local development.
 * In production, it should call the real backend API.
 */
export async function loginApi(params: LoginParams): Promise<LoginResponse> {
  // Simulate network delay
  await simulateNetworkDelay(800, 1500)
  
  // Simple validation (accept any username/password for demo)
  if (!params.username || !params.password) {
    throw new Error('用户名或密码不能为空')
  }
  
  // Check if account is locked (for demo purposes)
  if (params.username === 'locked') {
    throw new Error('账户已被锁定，请联系管理员')
  }
  
  const mockResponse: LoginResponse = {
    token: generateMockToken(),
    userInfo: generateMockUser(params.username),
  }
  
  console.log('[Mock API] Login successful:', mockResponse)
  
  return mockResponse
}

/**
 * Get User Info - Mock Implementation
 */
export async function getUserInfoApi(): Promise<UserInfo> {
  await simulateNetworkDelay(300, 800)
  
  // Try to get stored user info
  const storedUserInfo = localStorage.getItem('userInfo') || sessionStorage.getItem('userInfo')
  
  if (storedUserInfo) {
    try {
      const userInfo = JSON.parse(storedUserInfo) as UserInfo
      console.log('[Mock API] Get user info:', userInfo)
      return userInfo
    } catch (e) {
      console.error('[Mock API] Parse user info failed:', e)
    }
  }
  
  // Return default user if no stored info
  const defaultUser = generateMockUser('user')
  console.log('[Mock API] Get default user info:', defaultUser)
  return defaultUser
}

/**
 * Logout - Mock Implementation
 */
export async function logoutApi(): Promise<void> {
  await simulateNetworkDelay(300, 500)
  console.log('[Mock API] Logout successful')
  // In real implementation, you would call the backend to invalidate the token
}
