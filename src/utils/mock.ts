/**
 * Mock Data Utilities
 * 用于本地开发环境的模拟数据生成
 */

/**
 * Generate mock token
 */
export function generateMockToken(): string {
  return `mock-token-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Generate mock user info based on username
 */
export function generateMockUser(username: string) {
  const isAdmin = username === 'admin'
  
  return {
    id: isAdmin ? 1 : 2,
    name: isAdmin ? '管理员' : '普通用户',
    username: username,
    role: isAdmin ? 'admin' : 'user',
    email: `${username}@example.com`,
    phone: '138****0000',
    avatar: undefined,
  }
}

/**
 * Generate mock order list
 */
export function generateMockOrders(count: number = 10) {
  const statuses = [
    { value: 1, text: '待支付' },
    { value: 2, text: '已支付' },
    { value: 3, text: '已发货' },
    { value: 4, text: '已完成' },
    { value: 5, text: '已取消' },
  ]
  
  const customerNames = ['张三', '李四', '王五', '赵六', '钱七', '孙八', '周九', '吴十']
  const customerPhones = [
    '138****1234',
    '139****5678',
    '136****9012',
    '137****3456',
    '135****7890',
    '133****2345',
    '131****6789',
    '130****0123',
  ]
  
  return Array.from({ length: count }, (_, i) => {
    const statusIndex = Math.floor(Math.random() * statuses.length)
    const customerIndex = Math.floor(Math.random() * customerNames.length)
    
    return {
      id: i + 1,
      orderNo: `ORD-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(i + 1).padStart(4, '0')}`,
      amount: Math.floor(Math.random() * 2000) + 100,
      status: statuses[statusIndex]?.value ?? 1,
      statusText: statuses[statusIndex]?.text ?? '待支付',
      createTime: `2026-03-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')} ${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:00`,
      updateTime: new Date().toISOString(),
      customerName: customerNames[customerIndex] || '用户',
      customerPhone: customerPhones[customerIndex] || '138****0000',
    }
  })
}

/**
 * Generate mock user list
 */
export function generateMockUsers(count: number = 10) {
  const roles = ['admin', 'user']
  const names = ['张三', '李四', '王五', '赵六', '钱七', '孙八', '周九', '吴十', '郑十一', '王十二']
  
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    username: `user${i + 1}`,
    name: names[i] || `用户${i + 1}`,
    role: i === 0 ? 'admin' : 'user',
    email: `user${i + 1}@example.com`,
    phone: `138****${String(1000 + i).slice(-4)}`,
    createTime: `2026-0${Math.floor(Math.random() * 3) + 1}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')} ${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:00`,
  }))
}

/**
 * Simulate network delay
 */
export async function simulateNetworkDelay(minMs: number = 500, maxMs: number = 1500) {
  const delay = Math.floor(Math.random() * (maxMs - minMs)) + minMs
  await new Promise(resolve => setTimeout(resolve, delay))
}

/**
 * Create paginated response
 */
export function createPaginatedResponse<T>(
  data: T[],
  page: number,
  size: number
): { list: T[]; total: number; page: number; size: number } {
  const start = (page - 1) * size
  const end = start + size
  const list = data.slice(start, end)
  
  return {
    list,
    total: data.length,
    page,
    size,
  }
}
