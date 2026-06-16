<template>
  <div
    class="p-6"
    style="background: rgba(0,0,0,0.02); border: 1px solid rgba(0,0,0,0.04);"
  >
    <p class="text-xs font-light text-center opacity-40 leading-loose mb-5" style="color: #8A8A7E;">
      深呼吸，把你的手放在键盘上。<br/>
      不要停顿，不要修改，不要管错别字，<br/>
      允许一切思绪流淌到这里。
    </p>

    <!-- Writing Area -->
    <div class="mb-6">
      <textarea
        v-model="writingContent"
        ref="textareaRef"
        placeholder="开始写吧..."
        class="w-full h-48 text-sm font-light resize-none outline-none leading-relaxed"
        style="background: transparent; border: none; color: #5A5A52; letter-spacing: 0.02em;"
        @input="autoResize"
      />
    </div>

    <!-- Action Buttons -->
    <div class="flex justify-center gap-6">
      <button
        @click="handleSave"
        class="min-h-[44px] px-6 py-2 text-xs tracking-widest font-light opacity-50 hover:opacity-70 transition-all active:scale-95 active:opacity-100"
        style="color: #5A5A52;"
      >
        保留在我的时光盒
      </button>
      <button
        @click="handleBurn"
        class="min-h-[44px] px-6 py-2 text-xs tracking-widest font-light opacity-50 hover:opacity-70 transition-all active:scale-95 active:opacity-100"
        style="color: #5A5A52;"
      >
        将这些烦恼焚毁
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const emit = defineEmits<{
  complete: [{ completed: boolean; content: string; action: 'save' | 'burn' }]
}>()

const writingContent = ref('')
const textareaRef = ref<HTMLTextAreaElement | null>(null)

const autoResize = () => {
  if (textareaRef.value) {
    textareaRef.value.style.height = 'auto'
    textareaRef.value.style.height = `${Math.min(textareaRef.value.scrollHeight, 300)}px`
  }
}

const handleSave = () => {
  emit('complete', { completed: true, content: writingContent.value, action: 'save' })
}

const handleBurn = () => {
  emit('complete', { completed: true, content: writingContent.value, action: 'burn' })
}

onMounted(() => {
  if (textareaRef.value) {
    textareaRef.value.focus()
  }
})
</script>