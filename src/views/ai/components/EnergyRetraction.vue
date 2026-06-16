<template>
  <div
    class="p-6"
    style="background: rgba(0,0,0,0.02); border: 1px solid rgba(0,0,0,0.04);"
  >
    <p class="text-sm font-light text-center opacity-70 mb-4" style="color: #5A5A52;">
      🐙 能量回收练习
    </p>
    <p class="text-xs font-light text-center opacity-50 leading-loose" style="color: #8A8A7E;">
      想象你有许多触手，正在向外界伸展...<br/>
      现在，慢慢地把每一根触手收回到自己的身体中心。<br/>
      感受能量一点点回流，温暖而平静。
    </p>
    <div class="flex justify-center mt-5">
      <button
        v-if="!isDone"
        @click="handleComplete"
        class="min-h-[44px] px-6 py-2 text-xs tracking-widest font-light opacity-60 hover:opacity-80 transition-all active:scale-95 active:opacity-100"
        style="background: rgba(143,169,143,0.15); color: #5A5A52;"
      >
        完成练习
      </button>
      <div v-else class="flex items-center gap-2 opacity-60" style="color: #8FA98F;">
        <span class="text-sm">✿</span>
        <span class="text-xs tracking-widest font-light">已回收</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  complete: [{ completed: boolean }]
}>()

const isDone = ref(false)

const handleComplete = () => {
  if (isDone.value) return
  isDone.value = true
  emit('complete', { completed: true })
}
</script>
