<template>
  <div class="gate-screen">
    <div class="gate-content">
      <div class="gate-icon">
        <span>✿</span>
      </div>
      <h1 class="gate-title">疗心舍</h1>
      <p class="gate-subtitle">请输入访问暗号</p>

      <form @submit.prevent="handleVerify" class="gate-form">
        <div class="input-wrapper" :class="{ error: hasError, focused: isFocused }">
          <input
            ref="inputRef"
            v-model="inputCode"
            type="text"
            placeholder="访问暗号"
            autocomplete="off"
            autocorrect="off"
            autocapitalize="off"
            spellcheck="false"
            @focus="isFocused = true"
            @blur="isFocused = false"
            @input="hasError = false"
          />
        </div>

        <p v-if="hasError" class="error-msg">暗号不正确，请再试一次</p>

        <button type="submit" class="gate-btn" :disabled="!inputCode.trim()">
          进入
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { supabase, isSupabaseConfigured } from '@/supabase'
import { useUserStore } from '@/stores/user'

const emit = defineEmits<{
  verified: []
}>()

const ACCESS_CODE = import.meta.env.VITE_ACCESS_CODE || ''

const inputCode = ref('')
const hasError = ref(false)
const isFocused = ref(false)
const inputRef = ref<HTMLInputElement | null>(null)
const isLoading = ref(true)

onMounted(async () => {
  // Try to restore verification from Supabase first
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
          emit('verified')
          return
        }
      } catch (e) {
        // Ignore errors, fall through to localStorage check
      }
    }
  }

  // Fallback to localStorage
  if (localStorage.getItem('access_verified') === '1') {
    emit('verified')
    return
  }

  isLoading.value = false
  inputRef.value?.focus()
})

async function handleVerify() {
  if (inputCode.value.trim() === ACCESS_CODE) {
    localStorage.setItem('access_verified', '1')

    // Sync to Supabase
    if (isSupabaseConfigured()) {
      const userStore = useUserStore()
      const uid = userStore.anonymousUid

      if (uid) {
        try {
          await supabase
            .from('access_verification')
            .upsert({ anonymous_uid: uid, verified: true }, { onConflict: 'anonymous_uid' })
        } catch (e) {
          console.warn('[AccessGate] Failed to sync verification to Supabase:', e)
        }
      }
    }

    emit('verified')
  } else {
    hasError.value = true
    inputCode.value = ''
    inputRef.value?.focus()
  }
}
</script>

<style scoped>
.gate-screen {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #FAFAF8;
}

.gate-content {
  width: 100%;
  max-width: 320px;
  padding: 2.5rem 2rem;
  text-align: center;
}

.gate-icon {
  width: 56px;
  height: 56px;
  margin: 0 auto 1.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(143, 169, 143, 0.12);
  font-size: 1.5rem;
  color: #8FA98F;
  opacity: 0.6;
}

.gate-title {
  font-size: 1.5rem;
  font-weight: 300;
  letter-spacing: 0.25em;
  color: #4A4A3E;
  margin: 0 0 0.5rem;
}

.gate-subtitle {
  font-size: 0.875rem;
  font-weight: 300;
  color: #8A8A7E;
  letter-spacing: 0.08em;
  margin: 0 0 2.5rem;
}

.gate-form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.input-wrapper {
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  transition: border-color 0.2s ease;
}

.input-wrapper.focused {
  border-bottom-color: rgba(143, 169, 143, 0.5);
}

.input-wrapper.error {
  border-bottom-color: rgba(220, 100, 100, 0.5);
}

.input-wrapper input {
  width: 100%;
  padding: 0.75rem 0;
  background: transparent;
  border: none;
  outline: none;
  font-size: 1rem;
  font-weight: 300;
  letter-spacing: 0.15em;
  color: #4A4A3E;
  text-align: center;
}

.input-wrapper input::placeholder {
  color: #B0ACA4;
  letter-spacing: 0.15em;
}

.error-msg {
  font-size: 0.75rem;
  color: #C07070;
  letter-spacing: 0.05em;
  margin: 0;
  animation: shake 0.4s ease;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-6px); }
  40%, 80% { transform: translateX(6px); }
}

.gate-btn {
  margin-top: 0.5rem;
  padding: 0.875rem 2rem;
  background-color: #8FA98F;
  color: rgba(255, 255, 255, 0.9);
  border: none;
  font-size: 0.875rem;
  font-weight: 300;
  letter-spacing: 0.2em;
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.gate-btn:hover:not(:disabled) {
  opacity: 0.85;
}

.gate-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}
</style>
