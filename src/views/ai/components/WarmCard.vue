<template>
  <div class="warm-card p-5">
    <div class="flex items-start gap-4">
      <div class="flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center" style="background-color: rgba(251, 191, 36, 0.08);">
        <span class="text-xl opacity-40">☀</span>
      </div>
      <div class="flex-1">
        <h3 class="text-sm font-light mb-1.5 tracking-wide opacity-70" style="color: #92400E;">温暖正在靠近</h3>
        <p class="text-xs font-light leading-loose opacity-50" style="color: #92400E;">
          {{ message }}
        </p>
        <div class="flex flex-wrap gap-2 mt-3">
          <span
            v-for="(tip, index) in tips"
            :key="index"
            class="px-3 py-1 text-xs rounded-none border-b opacity-40"
            style="color: #92400E; border-color: rgba(146, 64, 14, 0.15);"
          >
            {{ tip }}
          </span>
        </div>
      </div>
    </div>
    <div class="mt-4 pt-3" style="border-top: 1px solid rgba(0,0,0,0.04);">
      <p class="text-xs font-light opacity-30" style="color: #92400E;">✿ 记住，你不是一个人。寻求帮助是勇敢的表现。</p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  message: string
  tips?: string[]
}>()

const defaultTips = [
  '和信任的人聊聊你的感受',
  '给自己一些安静的休息时间',
  '记录三件今天发生的好事',
  '散散步，接触自然阳光'
]
</script>

<style scoped>
.warm-card {
  background: rgba(251, 191, 36, 0.04);
  border: 1px solid rgba(0, 0, 0, 0.03);
}

h3, p {
  line-height: 1.8 !important;
}
</style>
