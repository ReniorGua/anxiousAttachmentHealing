<template>
  <div
    class="p-6"
    style="background: rgba(0,0,0,0.02); border: 1px solid rgba(0,0,0,0.04);"
  >
    <p class="text-sm font-light text-center opacity-70 mb-2" style="color: #5A5A52;">
      ✍️ 清单疗法
    </p>
    <p class="text-xs font-light text-center opacity-50 leading-loose mb-5" style="color: #8A8A7E;">
      {{ guideText }}
    </p>

    <!-- List Input Area -->
    <div class="mb-5">
      <div
        v-for="(item, index) in listItems"
        :key="index"
        class="flex items-center gap-2 mb-2"
      >
        <span class="text-xs opacity-30" style="color: #8A8A7E;">{{ index + 1 }}.</span>
        <span class="text-sm font-light flex-1" style="color: #5A5A52;">{{ item }}</span>
        <button
          @click="removeItem(index)"
          class="opacity-30 hover:opacity-60 transition-opacity text-xs"
          style="color: #5A5A52;"
        >
          ×
        </button>
      </div>

      <div class="flex items-center gap-2 mt-3">
        <span class="text-xs opacity-30" style="color: #8A8A7E;">{{ listItems.length + 1 }}.</span>
        <input
          v-model="currentInput"
          @keydown.enter.prevent="addItem"
          type="text"
          placeholder="写下你心里的声音..."
          class="flex-1 text-sm font-light bg-transparent border-b outline-none transition-colors"
          style="color: #5A5A52; border-color: rgba(0,0,0,0.08);"
        />
      </div>
    </div>

    <!-- Submit Button -->
    <div class="flex justify-center">
      <button
        @click="handleComplete"
        :disabled="listItems.length === 0"
        class="min-h-[44px] px-8 py-2 text-xs tracking-widest font-light transition-all"
        :class="listItems.length === 0 ? 'opacity-30 cursor-not-allowed' : 'opacity-60 hover:opacity-80'"
        style="background-color: rgba(143,169,143,0.15); color: #5A5A52;"
      >
        封存我的清单
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  listType?: 'desires' | 'joys' | 'fears' | 'values' | 'gratitude'
}>()

const emit = defineEmits<{
  complete: [{ completed: boolean; content: string }]
}>()

const listItems = ref<string[]>([])
const currentInput = ref('')

const guideText = computed(() => {
  const guides: Record<string, string> = {
    desires: '不要思考可行性，写下你脑袋里冒出的任何想做的事，哪怕是荒谬的...',
    joys: '写下那些曾经让你感到快乐的小事，哪怕是很久以前的回忆...',
    fears: '不要评判，不要分析，只是把害怕的事情写下来...',
    values: '什么对你来说真正重要？写下你内心深处的价值观...',
    gratitude: '今天有没有什么事让你感到一丝温暖？哪怕很小的事...'
  }
  return guides[props.listType || 'desires'] || guides.desires
})

const addItem = () => {
  const text = currentInput.value.trim()
  if (text) {
    listItems.value.push(text)
    currentInput.value = ''
  }
}

const removeItem = (index: number) => {
  listItems.value.splice(index, 1)
}

const handleComplete = () => {
  if (listItems.value.length > 0) {
    emit('complete', { completed: true, content: listItems.value.join('\n') })
  }
}
</script>