<template>
  <div class="space-y-5 px-4 py-5">
    <!-- Page Header -->
    <div class="flex items-center justify-between mb-5">
      <div>
        <h1 class="text-lg font-light tracking-wider opacity-80" style="color: #333;">订单管理</h1>
        <p class="text-xs font-light tracking-wider mt-1 opacity-40" style="color: #666;">查看和管理所有订单</p>
      </div>
      <button
        class="px-5 py-2 text-xs tracking-widest font-light rounded-none transition-all duration-700 opacity-70 hover:opacity-100"
        style="background-color: #165DFF; color: rgba(255,255,255,0.85);"
        @click="handleRefresh"
      >
        刷新
      </button>
    </div>

    <!-- Search & Filter -->
    <div class="p-5" style="background: rgba(255,255,255,0.6); border: 1px solid rgba(0,0,0,0.04);">
      <div class="space-y-4">
        <!-- Order Number Search -->
        <div>
          <label class="block text-xs font-light tracking-widest mb-2 opacity-40" style="color: #666;">订单编号</label>
          <input
            v-model="searchForm.orderNo"
            type="text"
            placeholder="请输入订单编号"
            class="w-full px-0 py-2.5 text-sm font-light tracking-wide focus:outline-none rounded-none border-b"
            style="
              background: transparent;
              border: none;
              border-bottom: 1px solid rgba(0,0,0,0.08);
              color: #333;
            "
            @keyup.enter="handleSearch"
          />
        </div>

        <!-- Status Filter -->
        <div>
          <label class="block text-xs font-light tracking-widest mb-2 opacity-40" style="color: #666;">订单状态</label>
          <select
            v-model="searchForm.status"
            class="w-full px-0 py-2.5 text-sm font-light tracking-wide focus:outline-none rounded-none border-b appearance-none"
            style="
              background: transparent;
              border: none;
              border-bottom: 1px solid rgba(0,0,0,0.08);
              color: #333;
            "
          >
            <option value="">全部</option>
            <option :value="1">待支付</option>
            <option :value="2">已支付</option>
            <option :value="3">已发货</option>
            <option :value="4">已完成</option>
            <option :value="5">已取消</option>
          </select>
        </div>

        <!-- Search Button -->
        <button
          class="w-full py-2.5 text-sm tracking-widest font-light rounded-none transition-all duration-700 opacity-70 hover:opacity-100"
          style="background-color: rgba(0,0,0,0.04); color: #333;"
          @click="handleSearch"
        >
          搜索
        </button>
      </div>
    </div>

    <!-- Order List - Card Layout -->
    <div class="space-y-3">
      <!-- Order Card -->
      <div
        v-for="order in orderList"
        :key="order.id"
        class="p-4 transition-all duration-700"
        style="background: rgba(255,255,255,0.6); border: 1px solid rgba(0,0,0,0.04);"
      >
        <!-- Card Header -->
        <div class="flex items-center justify-between mb-3 pb-3" style="border-bottom: 1px solid rgba(0,0,0,0.03);">
          <span class="text-sm font-light tracking-wide truncate flex-1 opacity-70" style="color: #165DFF;">{{ order.orderNo }}</span>
          <span
            :class="[
              'px-2 py-1 text-xs font-light tracking-wider flex-shrink-0 ml-2 opacity-50',
            ]"
            :style="{
              color: order.status === 1 ? '#FF7D00' :
                order.status === 2 ? '#165DFF' :
                order.status === 3 ? '#36CFC9' :
                order.status === 4 ? '#52C41A' :
                '#999'
            }"
          >
            {{ order.statusText }}
          </span>
        </div>

        <!-- Card Content -->
        <div class="space-y-2 text-sm">
          <div class="flex items-center justify-between">
            <span class="text-xs font-light tracking-wider opacity-30" style="color: #666;">客户</span>
            <span class="text-xs font-light tracking-wide opacity-60" style="color: #333;">{{ order.customerName }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-xs font-light tracking-wider opacity-30" style="color: #666;">电话</span>
            <span class="text-xs font-light tracking-wide opacity-60" style="color: #333;">{{ order.customerPhone }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-xs font-light tracking-wider opacity-30" style="color: #666;">金额</span>
            <span class="text-xs font-light tracking-wide opacity-60" style="color: #333;">¥{{ order.amount.toFixed(2) }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-xs font-light tracking-wider opacity-30" style="color: #666;">时间</span>
            <span class="text-xs font-light tracking-wider opacity-30" style="color: #999;">{{ order.createTime }}</span>
          </div>
        </div>

        <!-- Card Actions -->
        <div class="flex items-center space-x-3 mt-4 pt-3" style="border-top: 1px solid rgba(0,0,0,0.03);">
          <button
            v-if="order.status === 2"
            class="flex-1 py-2 text-xs tracking-widest font-light rounded-none transition-all duration-700 opacity-70 hover:opacity-100"
            style="background-color: #165DFF; color: rgba(255,255,255,0.85);"
            @click="handleUpdateStatus(order)"
          >
            发货
          </button>
          <button
            class="flex-1 py-2 text-xs tracking-widest font-light rounded-none border transition-all duration-700 opacity-40 hover:opacity-70"
            style="border-color: rgba(0,0,0,0.1); color: #333;"
            @click="handleViewDetail(order)"
          >
            详情
          </button>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="orderList.length === 0" class="p-8 text-center" style="background: rgba(255,255,255,0.6); border: 1px solid rgba(0,0,0,0.04);">
        <div class="opacity-20">
          <span class="text-4xl">☐</span>
          <p class="mt-4 text-sm font-light tracking-wider opacity-50" style="color: #666;">暂无订单数据</p>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div class="flex items-center justify-between p-4 mt-4" style="background: rgba(255,255,255,0.6); border: 1px solid rgba(0,0,0,0.04);">
      <p class="text-xs font-light tracking-wider opacity-40" style="color: #666;">
        {{ pagination.page }} / {{ Math.ceil(pagination.total / pagination.size) }} 页
      </p>
      <div class="flex space-x-2">
        <button
          :disabled="pagination.page === 1"
          class="px-4 py-1.5 text-xs tracking-widest font-light rounded-none border transition-all duration-700 opacity-40 hover:opacity-70 disabled:opacity-20"
          style="border-color: rgba(0,0,0,0.08); color: #333;"
          @click="handlePageChange(pagination.page - 1)"
        >
          上一页
        </button>
        <button
          :disabled="pagination.page >= Math.ceil(pagination.total / pagination.size)"
          class="px-4 py-1.5 text-xs tracking-widest font-light rounded-none border transition-all duration-700 opacity-40 hover:opacity-70 disabled:opacity-20"
          style="border-color: rgba(0,0,0,0.08); color: #333;"
          @click="handlePageChange(pagination.page + 1)"
        >
          下一页
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import type { OrderItem } from '@/types'
import { getOrderListApi, updateOrderStatusApi } from '@/api/order'

// Search form
const searchForm = reactive({
  orderNo: '',
  status: undefined as number | undefined,
})

// Order list
const orderList = ref<OrderItem[]>([])

// Pagination
const pagination = reactive({
  page: 1,
  size: 10,
  total: 0,
})

// Loading state
const loading = ref(false)

/**
 * Load order list
 */
const loadOrderList = async () => {
  loading.value = true

  try {
    const params = {
      page: pagination.page,
      size: pagination.size,
      status: searchForm.status,
      orderNo: searchForm.orderNo || undefined,
    }

    const res = await getOrderListApi(params)
    orderList.value = res.list
    pagination.total = res.total
  } catch (error) {
    console.error('Load order list failed:', error)
    // Mock data for demo
    orderList.value = generateMockData()
    pagination.total = 50
  } finally {
    loading.value = false
  }
}

/**
 * Generate mock data for demo
 */
const generateMockData = (): OrderItem[] => {
  const statuses = [
    { value: 1, text: '待支付' },
    { value: 2, text: '已支付' },
    { value: 3, text: '已发货' },
    { value: 4, text: '已完成' },
    { value: 5, text: '已取消' },
  ]

  return Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    orderNo: `ORD-20260311${String(i + 1).padStart(3, '0')}`,
    amount: Math.floor(Math.random() * 1000) + 100,
    status: statuses[i % 5]?.value ?? 1,
    statusText: statuses[i % 5]?.text ?? '待支付',
    createTime: `2026-03-11 ${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:00`,
    updateTime: new Date().toISOString(),
    customerName: `用户${i + 1}`,
    customerPhone: `138****${String(i + 1000).slice(-4)}`,
  }))
}

/**
 * Handle search
 */
const handleSearch = () => {
  pagination.page = 1
  loadOrderList()
}

/**
 * Handle page change
 */
const handlePageChange = (page: number) => {
  if (page < 1) return
  pagination.page = page
  loadOrderList()
}

/**
 * Handle refresh
 */
const handleRefresh = () => {
  loadOrderList()
}

/**
 * Handle update status
 */
const handleUpdateStatus = async (order: OrderItem) => {
  if (!confirm(`确定要将订单 ${order.orderNo} 标记为已发货吗？`)) {
    return
  }

  try {
    await updateOrderStatusApi({ id: order.id, status: 3 })
    alert('订单状态已更新')
    loadOrderList()
  } catch (error) {
    console.error('Update order status failed:', error)
    alert('更新失败，请重试')
  }
}

/**
 * Handle view detail
 */
const handleViewDetail = (order: OrderItem) => {
  alert(`查看订单详情：${order.orderNo}`)
}

onMounted(() => {
  loadOrderList()
})
</script>

<style scoped>
h1, p {
  line-height: 1.8 !important;
}
</style>
