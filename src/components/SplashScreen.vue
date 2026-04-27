<template>
  <Transition name="splash-fade" @after-leave="onFadeOutComplete">
    <div v-if="visible" class="splash-screen">
      <div class="splash-content">
        <p class="splash-text">深呼吸，我一直都在这里。</p>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const emit = defineEmits<{
  complete: []
}>()

const visible = ref(true)

onMounted(() => {
  // Total duration: 2.5s display + 1.5s fade-out transition
  setTimeout(() => {
    visible.value = false
  }, 2500)
})

function onFadeOutComplete() {
  emit('complete')
}
</script>

<style scoped>
.splash-screen {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  /* 极低饱和度的底色 — 温暖的灰褐色调 */
  background-color: #E8E4DF;
}

.splash-content {
  text-align: center;
  padding: 2rem;
}

.splash-text {
  font-size: 1.125rem;
  font-weight: 300;
  letter-spacing: 0.2em;
  color: #7A756E;
  /* 文字淡入动画 */
  animation: text-fade-in 1.8s ease-out forwards;
}

@keyframes text-fade-in {
  0% {
    opacity: 0;
    transform: translateY(8px);
  }
  40% {
    opacity: 1;
    transform: translateY(0);
  }
  80% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateY(-4px);
  }
}

/* 整体淡出 */
.splash-fade-leave-active {
  transition: opacity 1.5s ease-in-out;
}

.splash-fade-leave-to {
  opacity: 0;
}
</style>
