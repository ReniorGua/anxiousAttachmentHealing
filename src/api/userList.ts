import type { UserInfo } from '@/types'
import { generateMockUsers, simulateNetworkDelay } from '@/utils/mock'

// Cache for mock users data
let mockUsersCache: ReturnType<typeof generateMockUsers> | null = null

/**
 * Get User List - Mock Implementation
 */
export async function getUserListApi(params?: { page?: number; size?: number }): Promise<{
  list: UserInfo[]
  total: number
  page: number
  size: number
}> {
  await simulateNetworkDelay(500, 1000)
  
  // Initialize mock data if not exists
  if (!mockUsersCache) {
    mockUsersCache = generateMockUsers(20) // Generate 20 mock users
  }
  
  const page = params?.page || 1
  const size = params?.size || 10
  
  const start = (page - 1) * size
  const end = start + size
  const list = mockUsersCache.slice(start, end)
  
  console.log('[Mock API] Get user list:', {
    page,
    size,
    total: mockUsersCache.length
  })
  
  return {
    list,
    total: mockUsersCache.length,
    page,
    size,
  }
}

/**
 * Create User - Mock Implementation
 */
export async function createUserApi(userData: Partial<UserInfo & { createTime?: string }>): Promise<UserInfo & { createTime: string }> {
  await simulateNetworkDelay(600, 1200)
  
  const newUser: UserInfo & { createTime: string } = {
    id: mockUsersCache ? mockUsersCache.length + 1 : 1,
    name: userData.name || '新用户',
    username: userData.username || `user${Date.now()}`,
    role: userData.role || 'user',
    email: userData.email || '',
    phone: userData.phone || '',
    avatar: userData.avatar,
    createTime: new Date().toISOString(),
  }
  
  if (mockUsersCache) {
    mockUsersCache.push(newUser as any)
  }
  
  console.log('[Mock API] Create user:', newUser)
  
  return newUser
}

/**
 * Update User - Mock Implementation
 */
export async function updateUserApi(id: number, userData: Partial<UserInfo>): Promise<UserInfo> {
  await simulateNetworkDelay(500, 1000)
  
  if (mockUsersCache) {
    const userIndex = mockUsersCache.findIndex(u => u.id === id)
    if (userIndex !== -1) {
      const updatedUser = { ...mockUsersCache[userIndex], ...userData }
      mockUsersCache[userIndex] = updatedUser
      
      console.log('[Mock API] Update user:', updatedUser)
      
      return updatedUser
    }
  }
  
  throw new Error('用户不存在')
}

/**
 * Delete User - Mock Implementation
 */
export async function deleteUserApi(id: number): Promise<void> {
  await simulateNetworkDelay(400, 800)
  
  if (mockUsersCache) {
    const userIndex = mockUsersCache.findIndex(u => u.id === id)
    if (userIndex !== -1) {
      const deletedUser = mockUsersCache[userIndex]
      mockUsersCache.splice(userIndex, 1)
      
      console.log('[Mock API] Delete user:', deletedUser)
      
      return
    }
  }
  
  throw new Error('用户不存在')
}
