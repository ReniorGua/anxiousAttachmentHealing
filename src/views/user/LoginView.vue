<template>
  <div class="min-h-screen flex items-center justify-center px-4 py-8" style="background-color: #F8F8F6;">
    <div class="w-full max-w-sm">
      <!-- Login Card - 低饱和材质感 -->
      <div class="p-8" style="background: rgba(255,255,255,0.5); border: 1px solid rgba(0,0,0,0.04);">
        <!-- Logo & Title -->
        <div class="text-center mb-12">
          <div class="w-14 h-14 mx-auto mb-5 rounded-full flex items-center justify-center" style="background-color: rgba(22, 93, 255, 0.06);">
            <span class="text-2xl opacity-40">☻</span>
          </div>
          <h1 class="text-xl font-light mb-2 tracking-widest opacity-80" style="color: #333;">Business Admin</h1>
          <p class="text-xs font-light tracking-wider opacity-40" style="color: #666;">欢迎登录管理系统</p>
        </div>

        <!-- Login Form -->
        <form @submit.prevent="handleLogin" class="space-y-8">
          <!-- Username Input -->
          <div>
            <label for="username" class="block text-xs font-light tracking-widest mb-3 opacity-50" style="color: #666;">
              用户名
            </label>
            <input
              id="username"
              v-model="loginForm.username"
              type="text"
              placeholder="请输入用户名"
              class="w-full px-0 py-3 text-sm font-light tracking-wide focus:outline-none rounded-none border-b"
              style="
                background: transparent;
                border: none;
                border-bottom: 1px solid rgba(0,0,0,0.08);
                color: #333;
                letter-spacing: 0.02em;
              "
              autocomplete="username"
              required
            />
          </div>

          <!-- Password Input -->
          <div>
            <label for="password" class="block text-xs font-light tracking-widest mb-3 opacity-50" style="color: #666;">
              密码
            </label>
            <input
              id="password"
              v-model="loginForm.password"
              type="password"
              placeholder="请输入密码"
              class="w-full px-0 py-3 text-sm font-light tracking-wide focus:outline-none rounded-none border-b"
              style="
                background: transparent;
                border: none;
                border-bottom: 1px solid rgba(0,0,0,0.08);
                color: #333;
                letter-spacing: 0.02em;
              "
              autocomplete="current-password"
              required
            />
          </div>

          <!-- Remember Me -->
          <div class="flex items-center">
            <input
              id="remember"
              v-model="loginForm.remember"
              type="checkbox"
              class="w-3.5 h-3.5 rounded-none"
              style="accent-color: #165DFF;"
            />
            <label for="remember" class="ml-2 text-xs font-light opacity-40 tracking-wider" style="color: #666;">
              记住我
            </label>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full py-3.5 text-sm tracking-widest font-light rounded-none transition-all duration-700 opacity-80 hover:opacity-100 disabled:opacity-30"
            style="
              background-color: #165DFF;
              color: rgba(255,255,255,0.85);
              letter-spacing: 0.1em;
            "
          >
            {{ loading ? '登录中...' : '登录' }}
          </button>
        </form>

        <!-- Demo Account Info -->
        <div class="mt-10 pt-6" style="border-top: 1px solid rgba(0,0,0,0.04);">
          <p class="text-xs font-light tracking-wider mb-2 opacity-30" style="color: #666;">测试账号</p>
          <p class="text-xs font-light opacity-25 tracking-wide" style="color: #999;">用户名：admin / user</p>
          <p class="text-xs font-light opacity-25 tracking-wide" style="color: #999;">密码：任意密码</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const loading = ref(false)

const loginForm = reactive({
  username: '',
  password: '',
  remember: false,
})

/**
 * Handle Login
 */
const handleLogin = async () => {
  if (!loginForm.username || !loginForm.password) {
    alert('请输入用户名和密码')
    return
  }

  loading.value = true

  try {
    await userStore.login(loginForm)

    // Redirect to original page or home
    const redirect = route.query.redirect as string
    router.push(redirect || '/')
  } catch (error) {
    console.error('Login failed:', error)
    alert('登录失败，请检查用户名和密码')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* 文字行距 */
h1, h2, p, label, input {
  line-height: 1.9 !important;
}
</style>
