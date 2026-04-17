<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useGlobalStore } from './stores/global'

const route = useRoute()
const globalStore = useGlobalStore()

// Show global loading when needed
const isLoading = computed(() => globalStore.loading)
</script>

<template>
  <div class="app-container">
    <!-- Global Loading Overlay - 缓慢显影 -->
    <transition name="photo-dev">
      <div
        v-if="isLoading"
        class="fixed inset-0 flex items-center justify-center z-50"
        style="background-color: rgba(0,0,0,0.15);"
      >
        <div class="p-8" style="background: rgba(255,255,255,0.9); border: 1px solid rgba(0,0,0,0.04);">
          <div class="w-10 h-10 mx-auto" style="border: 1px solid rgba(22, 93, 255, 0.2); border-top-color: #165DFF; border-radius: 50%; animation: spin-slow 1.5s linear infinite;"></div>
          <p class="mt-4 text-xs font-light tracking-widest text-center opacity-40" style="color: #666;">加载中...</p>
        </div>
      </div>
    </transition>

    <!-- Router View -->
    <router-view />
  </div>
</template>

<style>
.app-container {
  width: 100%;
  min-height: 100vh;
}

@keyframes spin-slow {
  to {
    transform: rotate(360deg);
  }
}

/* 缓慢旋转动画替代快速spin */
.spin-slow {
  animation: spin-slow 1.5s linear infinite;
}
</style>
