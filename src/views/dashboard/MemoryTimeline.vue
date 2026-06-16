<template>
  <div class="memory-timeline">
    <!-- Top Left Return -->
    <router-link to="/" class="return-btn" title="返回">
      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 19l-7-7 7-7"/>
      </svg>
    </router-link>

    <!-- Top Mini Navigation -->
    <div class="top-nav">
      <router-link to="/chat" class="nav-icon-btn" title="倾诉树洞">
        <span class="text-sm">💬</span>
      </router-link>
      <router-link to="/practice" class="nav-icon-btn" title="疗愈岛屿">
        <span class="text-sm">🌿</span>
      </router-link>
    </div>

    <!-- Header -->
    <div class="page-header">
      <h1 class="page-title">成长年轮</h1>
      <p class="page-subtitle">每一次你尝试安抚自己，都是值得被记住的进步</p>
    </div>

    <!-- Timeline Content -->
    <div class="timeline-content">
      <!-- Empty State -->
      <div v-if="sortedMilestones.length === 0" class="empty-state">
        <div class="empty-icon">✿</div>
        <h3 class="empty-title">还没有记录</h3>
        <p class="empty-text">每一次你尝试安抚自己，都是值得被记住的进步。</p>
      </div>

      <!-- Timeline -->
      <div v-else class="timeline">
        <!-- Timeline entries -->
        <div class="timeline-entries">
          <div
            v-for="(milestone, index) in sortedMilestones"
            :key="milestone.id"
            class="timeline-entry"
            :class="{ 'is-achievement': isThirtyDayAffirmation(milestone) }"
          >
            <!-- Dot -->
            <div class="entry-dot" :class="{ 'dot-achievement': isThirtyDayAffirmation(milestone) }">
              <span class="dot-icon">{{ getDotIcon(milestone.type) }}</span>
            </div>

            <!-- Content -->
            <div class="entry-content" :class="{ 'content-achievement': isThirtyDayAffirmation(milestone) }">
              <p class="entry-date">{{ formatDate(milestone.timestamp) }}</p>
              <p class="entry-text">{{ milestone.content }}</p>
              <span
                v-if="!isThirtyDayAffirmation(milestone)"
                class="entry-tag"
                :style="{ backgroundColor: getTagBg(milestone.type), color: getTagColor(milestone.type) }"
              >
                {{ getTypeLabel(milestone.type) }}
              </span>
              <!-- Achievement special highlight -->
              <div v-else class="achievement-highlight">
                <span class="achievement-icon">🍂</span>
                <p class="achievement-label">你已经用三十句话，为自己重新浇灌出了一片绿洲。</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Bottom blessing -->
        <div class="bottom-blessing">
          <p>每一圈年轮，都是一次温柔的自我接纳。</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useUserMemoryStore } from '@/stores/userMemory'
import type { MilestoneRecord } from '@/stores/userMemory'

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

// Detect 30-day affirmation achievement milestone
const isThirtyDayAffirmation = (milestone: MilestoneRecord): boolean => {
  return milestone.content === '三十天自我重塑练习' && milestone.type === 'breakthrough'
}
</script>

<style scoped>
.memory-timeline {
  min-height: 100vh;
  padding: 24px 24px 48px;
  background: linear-gradient(180deg, rgba(250,248,245,1) 0%, rgba(245,243,240,1) 100%);
}

/* Top Mini Navigation */
.top-nav {
  position: fixed;
  top: 16px;
  right: 16px;
  display: flex;
  gap: 12px;
}

.nav-icon-btn {
  width: 36px;
  height: 36px;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #5A5A52;
  background: rgba(255, 255, 255, 0.6);
  transition: all 500ms ease;
  text-decoration: none;
}

.nav-icon-btn:hover {
  background: rgba(255, 255, 255, 0.9);
}

/* Return Button */
.return-btn {
  position: fixed;
  top: 16px;
  left: 16px;
  width: 36px;
  height: 36px;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #5A5A52;
  background: rgba(255, 255, 255, 0.6);
  transition: all 500ms ease;
  text-decoration: none;
  z-index: 100;
}

.return-btn:hover {
  background: rgba(255, 255, 255, 0.9);
}

/* Header */
.page-header {
  text-align: center;
  margin-bottom: 48px;
  padding-top: 16px;
}

.page-title {
  font-size: 28px;
  font-weight: 300;
  letter-spacing: 0.15em;
  color: #5A5A52;
  margin-bottom: 12px;
}

.page-subtitle {
  font-size: 14px;
  font-weight: 300;
  color: #8A8A7E;
  letter-spacing: 0.05em;
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 80px 24px;
}

.empty-icon {
  font-size: 48px;
  opacity: 0.3;
  margin-bottom: 24px;
}

.empty-title {
  font-size: 18px;
  font-weight: 300;
  color: #5A5A52;
  margin-bottom: 12px;
}

.empty-text {
  font-size: 14px;
  font-weight: 300;
  color: #8A8A7E;
  line-height: 1.7;
}

/* Timeline */
.timeline-content {
  max-width: 560px;
  margin: 0 auto;
}

.timeline-entries {
  position: relative;
  padding-left: 32px;
}

.timeline-entries::before {
  content: '';
  position: absolute;
  left: 8px;
  top: 0;
  bottom: 0;
  width: 1px;
  background: linear-gradient(to bottom, transparent, rgba(143,169,143,0.2) 10%, rgba(143,169,143,0.2) 90%, transparent);
}

.timeline-entry {
  position: relative;
  margin-bottom: 40px;
}

.entry-dot {
  position: absolute;
  left: -28px;
  top: 0;
  width: 24px;
  height: 24px;
  border-radius: 9999px;
  background: rgba(143, 169, 143, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
}

.dot-icon {
  font-size: 10px;
  color: #8FA98F;
}

.entry-content {
  background: rgba(255, 255, 255, 0.5);
  border-radius: 12px;
  padding: 16px;
}

.entry-date {
  font-size: 12px;
  font-weight: 300;
  color: rgba(143,169,143,0.6);
  letter-spacing: 0.05em;
  margin-bottom: 8px;
}

.entry-text {
  font-size: 14px;
  font-weight: 300;
  color: #5A5A52;
  line-height: 1.7;
  margin-bottom: 10px;
}

.entry-tag {
  display: inline-block;
  font-size: 11px;
  padding: 4px 10px;
  border-radius: 20px;
  font-weight: 300;
}

/* Bottom Blessing */
.bottom-blessing {
  text-align: center;
  margin-top: 48px;
  padding-top: 24px;
}

.bottom-blessing p {
  font-size: 14px;
  font-weight: 300;
  color: rgba(143,169,143,0.5);
  letter-spacing: 0.05em;
}

/* Achievement Entry */
.timeline-entry.is-achievement .entry-dot {
  background: rgba(180, 160, 100, 0.2);
}
.timeline-entry.is-achievement .dot-icon {
  color: #B4A078;
}
.timeline-entry.is-achievement .entry-content {
  background: linear-gradient(135deg, rgba(200, 185, 140, 0.1), rgba(180, 165, 120, 0.06));
  border: 1px solid rgba(180, 165, 120, 0.15);
}

.achievement-highlight {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
  padding: 10px 14px;
  background: rgba(200, 185, 140, 0.08);
  border-radius: 10px;
}
.achievement-icon {
  font-size: 20px;
  flex-shrink: 0;
}
.achievement-label {
  font-size: 12px;
  font-weight: 300;
  line-height: 1.7;
  color: #8A7A5A;
  letter-spacing: 0.02em;
}
</style>