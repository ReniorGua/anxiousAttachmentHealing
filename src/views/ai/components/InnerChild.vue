<template>
  <div
    class="p-6 rounded-sm"
    style="background: linear-gradient(135deg, rgba(60,40,60,0.95), rgba(40,30,50,0.95)); border: 1px solid rgba(100,80,120,0.2);"
  >
    <p class="text-sm font-light text-center mb-4" style="color: rgba(220,200,230,0.9);">
      💜 内在小孩
    </p>
    <p class="text-xs font-light text-center opacity-70 leading-loose mb-4" style="color: rgba(200,180,210,0.7);">
      想象你回到那个小小的自己身边...<br/>
      那个害怕的、孤独的、渴望被爱的小孩。<br/>
      告诉TA：我在这里，我听到了你。
    </p>
    <div class="flex justify-center">
      <button
        v-if="!isDone"
        @click="handleComplete"
        class="min-h-[44px] px-6 py-2 text-xs tracking-widest font-light opacity-70 hover:opacity-90 transition-all active:scale-95 active:opacity-100"
        style="background: rgba(120,80,140,0.4); color: rgba(220,200,230,0.9);"
      >
        我拥抱了TA
      </button>
      <div v-else class="flex items-center gap-2 opacity-70" style="color: rgba(200,180,220,0.9);">
        <span class="text-sm">✿</span>
        <span class="text-xs tracking-widest font-light">已拥抱</span>
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
