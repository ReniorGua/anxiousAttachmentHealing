<template>
  <div class="flex flex-col h-screen" style="background-color: #FAFAF8;">
    <!-- Header -->
    <header
      class="flex items-center justify-between px-5 flex-shrink-0"
      :style="{ backgroundColor: globalStore.customThemeColor || '#8FA98F', paddingTop: 'max(1.25rem, env(safe-area-inset-top))', paddingBottom: '1.25rem' }"
    >
      <!-- Back button -->
      <button
        @click="$router.back()"
        class="w-8 h-8 flex items-center justify-center opacity-80 hover:opacity-100 transition-opacity"
      >
        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 19l-7-7 7-7"/>
        </svg>
      </button>

      <h1 class="text-base font-light text-white tracking-widest opacity-90">成长年轮</h1>

      <!-- Spacer for balance -->
      <div class="w-8"></div>
    </header>

    <!-- Timeline Content -->
    <div class="flex-1 overflow-y-auto">
      <!-- Empty State -->
      <div v-if="sortedMilestones.length === 0" class="flex flex-col items-center justify-center h-full text-center px-8">
        <div class="w-16 h-16 mb-6 rounded-full flex items-center justify-center" style="background-color: rgba(143, 169, 143, 0.1);">
          <span class="text-2xl opacity-40">✿</span>
        </div>
        <h3 class="text-base font-light mb-2 tracking-wide" style="color: #5A5A4E;">还没有记录</h3>
        <p class="text-sm font-light max-w-xs leading-loose" style="color: #8A8A7E;">
          每一次你尝试安抚自己，都是值得被记住的进步。
        </p>
      </div>

      <!-- Timeline -->
      <div v-else class="px-5 py-10">
        <!-- Year rings header -->
        <div class="text-center mb-12">
          <p class="text-xs tracking-widest opacity-40 font-light" style="color: #8FA98F;">你走过的路</p>
        </div>

        <!-- Timeline entries -->
        <div class="relative">
          <!-- Vertical line -->
          <div
            class="absolute left-5 top-0 bottom-0 w-px"
            style="background: linear-gradient(to bottom, transparent, rgba(143,169,143,0.2) 10%, rgba(143,169,143,0.2) 90%, transparent);"
          ></div>

          <!-- Entries -->
          <div class="space-y-12">
            <div
              v-for="(milestone, index) in sortedMilestones"
              :key="milestone.id"
              class="relative flex items-start gap-6"
            >
              <!-- Dot on timeline -->
              <div
                class="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center z-10"
                :style="{
                  backgroundColor: getDotColor(milestone.type),
                  boxShadow: '0 0 12px rgba(143,169,143,0.15)'
                }"
              >
                <span class="text-sm">{{ getDotIcon(milestone.type) }}</span>
              </div>

              <!-- Content card -->
              <div class="flex-1 pt-1">
                <!-- Date -->
                <p class="text-xs tracking-widest mb-2" style="color: rgba(143,169,143,0.6);">
                  {{ formatDate(milestone.timestamp) }}
                </p>
                <!-- Content -->
                <p class="text-sm leading-relaxed font-light" style="color: #4A4A3E;">
                  {{ milestone.content }}
                </p>
                <!-- Type tag -->
                <div class="mt-2">
                  <span
                    class="text-xs px-2 py-0.5 rounded-full font-light"
                    :style="{
                      backgroundColor: getTagBg(milestone.type),
                      color: getTagColor(milestone.type)
                    }"
                  >
                    {{ getTypeLabel(milestone.type) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Bottom blessing -->
        <div class="mt-16 text-center">
          <p class="text-sm font-light tracking-wide" style="color: rgba(143,169,143,0.5);">
            每一圈年轮，都是一次温柔的自我接纳。
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useGlobalStore } from '@/stores/global'
import { useUserMemoryStore } from '@/stores/userMemory'
import type { MilestoneRecord } from '@/stores/userMemory'

const globalStore = useGlobalStore()
const userMemoryStore = useUserMemoryStore()

// Sort milestones by timestamp descending (newest first)
const sortedMilestones = computed(() => {
  return [...userMemoryStore.milestones].sort((a, b) => b.timestamp - a.timestamp)
})

const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp)
  const now = new Date()
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return '今天'
  if (diffDays === 1) return '昨天'
  if (diffDays < 7) return `${diffDays}天前`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}周前`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)}个月前`
  return `${Math.floor(diffDays / 365)}年前`
}

const getDotColor = (type: MilestoneRecord['type']): string => {
  const colors: Record<string, string> = {
    self_soothing: 'rgba(143,169,143,0.25)',
    breakthrough: 'rgba(180,160,120,0.25)',
    peace: 'rgba(143,169,143,0.15)',
    courage: 'rgba(180,140,100,0.2)',
  }
  return colors[type] || 'rgba(143,169,143,0.25)'
}

const getDotIcon = (type: MilestoneRecord['type']): string => {
  const icons: Record<string, string> = {
    self_soothing: '✿',
    breakthrough: '◇',
    peace: '○',
    courage: '☆',
  }
  return icons[type] || '✿'
}

const getTagBg = (type: MilestoneRecord['type']): string => {
  const bgs: Record<string, string> = {
    self_soothing: 'rgba(143,169,143,0.1)',
    breakthrough: 'rgba(180,160,120,0.1)',
    peace: 'rgba(143,169,143,0.08)',
    courage: 'rgba(180,140,100,0.1)',
  }
  return bgs[type] || 'rgba(143,169,143,0.1)'
}

const getTagColor = (type: MilestoneRecord['type']): string => {
  const colors: Record<string, string> = {
    self_soothing: '#8FA98F',
    breakthrough: '#B4A078',
    peace: '#8FA98F',
    courage: '#B48C64',
  }
  return colors[type] || '#8FA98F'
}

const getTypeLabel = (type: MilestoneRecord['type']): string => {
  const labels: Record<string, string> = {
    self_soothing: '自我安抚',
    breakthrough: '突破',
    peace: '平静',
    courage: '勇气',
  }
  return labels[type] || '记录'
}
</script>

<style scoped>
.overflow-y-auto::-webkit-scrollbar {
  width: 3px;
}
.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}
.overflow-y-auto::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.06);
  border-radius: 2px;
}
</style>