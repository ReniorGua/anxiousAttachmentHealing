<template>
  <div
    class="p-6"
    style="background: rgba(0,0,0,0.02); border: 1px solid rgba(0,0,0,0.04);"
  >
    <p class="text-sm font-light text-center opacity-70 mb-4" style="color: #5A5A52;">
      🔍 躯体觉察练习
    </p>
    <p class="text-xs font-light text-center opacity-50 leading-loose mb-4" style="color: #8A8A7E;">
      请闭上眼睛，把注意力带到身体内部...<br/>
      哪里感觉紧绷？哪里感觉沉重？<br/>
      不需要改变，只是观察，像雷达扫描一样。
    </p>
    <div class="flex justify-center gap-4">
      <button
        @click="handleComplete"
        class="min-h-[44px] px-6 py-2 text-xs tracking-widest font-light opacity-60 hover:opacity-80 transition-opacity"
        style="background: rgba(143,169,143,0.15); color: #5A5A52;"
      >
        我感受到了
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  complete: [{ completed: boolean }]
}>()

const handleComplete = () => {
  emit('complete', { completed: true })
}
</script>
