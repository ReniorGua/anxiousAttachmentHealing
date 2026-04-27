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

    <!-- Access Gate - 访问暗号拦截 -->
    <AccessGate v-if="!isAccessVerified" @verified="onAccessVerified" />

    <template v-else>
      <!-- Cinematic Splash Screen -->
      <SplashScreen v-if="showSplash" @complete="onSplashComplete" />

      <!-- Router View - only mount after splash completes, ensures onMounted fires at right time -->
      <router-view v-if="!showSplash" />
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useGlobalStore } from './stores/global'
import { isSupabaseConfigured } from './supabase'
import { useUserStore } from './stores/user'
import { supabase } from './supabase'
import SplashScreen from './components/SplashScreen.vue'
import AccessGate from './components/AccessGate.vue'

const globalStore = useGlobalStore()

// Show global loading when needed
const isLoading = computed(() => globalStore.loading)

// Access gate state - verified if code matches or if no code is configured
const ACCESS_CODE = import.meta.env.VITE_ACCESS_CODE || ''
const isAccessVerified = ref(!ACCESS_CODE)

// Splash screen state
const showSplash = ref(true)

async function checkAccessVerification() {
  if (!ACCESS_CODE) {
    isAccessVerified.value = true
    return
  }

  // Try Supabase first
  if (isSupabaseConfigured()) {
    const userStore = useUserStore()
    const uid = userStore.anonymousUid

    if (uid) {
      try {
        const { data } = await supabase
          .from('access_verification')
          .select('verified')
          .eq('anonymous_uid', uid)
          .single()

        if (data?.verified) {
          localStorage.setItem('access_verified', '1')
          isAccessVerified.value = true
          return
        }
      } catch (e) {
        // Ignore errors
      }
    }
  }

  // Fallback to localStorage
  isAccessVerified.value = localStorage.getItem('access_verified') === '1'
}

onMounted(() => {
  checkAccessVerification()
})

function onAccessVerified() {
  isAccessVerified.value = true
}

function onSplashComplete() {
  showSplash.value = false
}
</script>

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
