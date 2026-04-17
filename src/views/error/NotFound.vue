<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="text-center">
      <h1 class="text-9xl font-bold text-primary">404</h1>
      <p class="text-2xl text-gray-600 mt-4 mb-8">页面不存在</p>
      <p class="text-gray-500 mb-8">抱歉，您访问的页面不存在或已被移除</p>
      <button class="btn-primary" @click="handleGoHome">
        返回首页
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const handleGoHome = () => {
  router.push('/')
}
</script>
