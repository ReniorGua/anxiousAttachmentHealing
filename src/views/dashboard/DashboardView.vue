<template>
  <div class="space-y-5 px-4 py-5">
    <!-- Page Header -->
    <div class="mb-5">
      <h1 class="text-lg font-light tracking-wider opacity-80" style="color: #333;">首页</h1>
      <p class="text-xs font-light tracking-wider mt-1 opacity-40" style="color: #666;">欢迎使用业务管理系统</p>
    </div>

    <!-- Data Cards - Mobile: 2 columns, Desktop: 4 columns -->
    <div class="grid grid-cols-2 gap-4">
      <!-- Total Orders Card -->
      <div class="p-4" style="background: rgba(255,255,255,0.6); border: 1px solid rgba(0,0,0,0.04);">
        <div class="flex flex-col">
          <p class="text-xs font-light tracking-widest mb-2 opacity-40" style="color: #666;">总订单数</p>
          <p class="text-2xl font-light tracking-wide opacity-80" style="color: #165DFF;">{{ stats.totalOrders }}</p>
        </div>
        <div class="mt-3 flex items-center text-xs">
          <span class="font-light opacity-60" style="color: #52C41A;">↑ 12%</span>
          <span class="ml-1 font-light opacity-30" style="color: #999;">较上月</span>
        </div>
      </div>

      <!-- Total Users Card -->
      <div class="p-4" style="background: rgba(255,255,255,0.6); border: 1px solid rgba(0,0,0,0.04);">
        <div class="flex flex-col">
          <p class="text-xs font-light tracking-widest mb-2 opacity-40" style="color: #666;">用户总数</p>
          <p class="text-2xl font-light tracking-wide opacity-80" style="color: #36CFC9;">{{ stats.totalUsers }}</p>
        </div>
        <div class="mt-3 flex items-center text-xs">
          <span class="font-light opacity-60" style="color: #52C41A;">↑ 8%</span>
          <span class="ml-1 font-light opacity-30" style="color: #999;">较上月</span>
        </div>
      </div>

      <!-- Revenue Card -->
      <div class="p-4" style="background: rgba(255,255,255,0.6); border: 1px solid rgba(0,0,0,0.04);">
        <div class="flex flex-col">
          <p class="text-xs font-light tracking-widest mb-2 opacity-40" style="color: #666;">本月营收</p>
          <p class="text-xl font-light tracking-wide opacity-80" style="color: #FF7D00;">¥{{ stats.revenue }}</p>
        </div>
        <div class="mt-3 flex items-center text-xs">
          <span class="font-light opacity-60" style="color: #52C41A;">↑ 15%</span>
          <span class="ml-1 font-light opacity-30" style="color: #999;">较上月</span>
        </div>
      </div>

      <!-- Pending Orders Card -->
      <div class="p-4" style="background: rgba(255,255,255,0.6); border: 1px solid rgba(0,0,0,0.04);">
        <div class="flex flex-col">
          <p class="text-xs font-light tracking-widest mb-2 opacity-40" style="color: #666;">待处理</p>
          <p class="text-2xl font-light tracking-wide opacity-80" style="color: #FF4D4F;">{{ stats.pendingOrders }}</p>
        </div>
        <div class="mt-3 flex items-center text-xs">
          <span class="font-light opacity-60" style="color: #FF4D4F;">↓ 5%</span>
          <span class="ml-1 font-light opacity-30" style="color: #999;">较上月</span>
        </div>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="mt-5 p-5" style="background: rgba(255,255,255,0.6); border: 1px solid rgba(0,0,0,0.04);">
      <h2 class="text-sm font-light tracking-wider mb-4 opacity-70" style="color: #333;">最近活动</h2>
      <div class="space-y-3">
        <div
          v-for="activity in recentActivities"
          :key="activity.id"
          class="flex items-start space-x-3 py-2"
          :style="{ borderBottom: activity.id !== recentActivities.length ? '1px solid rgba(0,0,0,0.03)' : 'none' }"
        >
          <div
            :class="[
              'w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0',
            ]"
            :style="{
              backgroundColor: activity.type === 'order' ? '#165DFF' :
                activity.type === 'user' ? '#36CFC9' : '#FF7D00',
              opacity: 0.4
            }"
          />
          <div class="flex-1 min-w-0">
            <p class="text-sm font-light tracking-wide opacity-60" style="color: #333;">{{ activity.content }}</p>
            <p class="text-xs font-light mt-0.5 tracking-wider opacity-30" style="color: #999;">{{ activity.time }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// Statistics data (mock data - replace with API call)
const stats = ref({
  totalOrders: 1286,
  totalUsers: 5642,
  revenue: '128,640',
  pendingOrders: 23,
})

// Recent activities (mock data)
const recentActivities = ref([
  { id: 1, type: 'order', content: '新订单 #ORD-20260311001 已创建', time: '5 分钟前' },
  { id: 2, type: 'user', content: '新用户 张三 注册账号', time: '12 分钟前' },
  { id: 3, type: 'order', content: '订单 #ORD-20260310998 已完成', time: '25 分钟前' },
  { id: 4, type: 'system', content: '系统自动备份完成', time: '1 小时前' },
  { id: 5, type: 'order', content: '订单 #ORD-20260310995 已发货', time: '2 小时前' },
])

// Load dashboard data (can be replaced with API call)
onMounted(() => {
  console.log('Dashboard mounted, loading data...')
})
</script>

<style scoped>
h1, h2, p {
  line-height: 1.8 !important;
}
</style>
