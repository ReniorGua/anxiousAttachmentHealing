import type { OrderListParams, OrderListResponse, OrderStatusParams } from '@/types'
import { generateMockOrders, simulateNetworkDelay, createPaginatedResponse } from '@/utils/mock'

// Cache for mock orders data
let mockOrdersCache: ReturnType<typeof generateMockOrders> | null = null

/**
 * Get Order List - Mock Implementation
 * @param params - Query parameters (page, size, status, orderNo)
 */
export async function getOrderListApi(params: OrderListParams): Promise<OrderListResponse> {
  await simulateNetworkDelay(600, 1200)
  
  // Initialize mock data if not exists
  if (!mockOrdersCache) {
    mockOrdersCache = generateMockOrders(50) // Generate 50 mock orders
  }
  
  let filteredOrders = [...mockOrdersCache]
  
  // Apply filters
  if (params.status) {
    filteredOrders = filteredOrders.filter(order => order.status === params.status)
  }
  
  if (params.orderNo) {
    filteredOrders = filteredOrders.filter(order => 
      order.orderNo.toLowerCase().includes(params.orderNo!.toLowerCase())
    )
  }
  
  // Create paginated response
  const paginatedResult = createPaginatedResponse(
    filteredOrders,
    params.page,
    params.size
  )
  
  console.log('[Mock API] Get order list:', {
    page: params.page,
    size: params.size,
    total: paginatedResult.total,
    filters: { status: params.status, orderNo: params.orderNo }
  })
  
  return {
    list: paginatedResult.list,
    total: paginatedResult.total,
    page: paginatedResult.page,
    size: paginatedResult.size,
  }
}

/**
 * Update Order Status - Mock Implementation
 * @param params - Order ID and new status
 */
export async function updateOrderStatusApi(params: OrderStatusParams): Promise<void> {
  await simulateNetworkDelay(500, 1000)
  
  // Find and update order in mock cache
  if (mockOrdersCache) {
    const order = mockOrdersCache.find(o => o.id === params.id)
    if (order) {
      const statusMap: Record<number, string> = {
        1: '待支付',
        2: '已支付',
        3: '已发货',
        4: '已完成',
        5: '已取消',
      }
      
      order.status = params.status
      order.statusText = statusMap[params.status] || '未知状态'
      order.updateTime = new Date().toISOString()
      
      console.log('[Mock API] Update order status:', {
        orderId: params.id,
        newStatus: params.status,
        statusText: order.statusText
      })
      
      return
    }
  }
  
  throw new Error('订单不存在')
}

/**
 * Get Order Detail - Mock Implementation
 * @param id - Order ID
 */
export async function getOrderDetailApi(id: number): Promise<any> {
  await simulateNetworkDelay(400, 800)
  
  if (mockOrdersCache) {
    const order = mockOrdersCache.find(o => o.id === id)
    if (order) {
      console.log('[Mock API] Get order detail:', order)
      return {
        ...order,
        // Add some extra details for the detail view
        shippingAddress: '北京市朝阳区某某街道某某小区 1 号楼 1 单元 101 室',
        paymentMethod: '支付宝',
        remark: '请尽快发货',
      }
    }
  }
  
  throw new Error('订单不存在')
}
