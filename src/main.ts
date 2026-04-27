import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import './style.css'

// Import stores
import { useUserStore } from './stores/user'
import { useGlobalStore } from './stores/global'
import { useAIChatStore } from './stores/aiChat'
import { useUserMemoryStore } from './stores/userMemory'

// Import memory quenching service (silent background service)
import { startMemoryQuenching } from './services/memoryQuenching'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Initialize stores - anonymous identity is initialized first
const userStore = useUserStore(pinia)
const globalStore = useGlobalStore(pinia)
const aiChatStore = useAIChatStore(pinia)
const userMemoryStore = useUserMemoryStore(pinia)

userStore.initFromStorage()
globalStore.initFromStorage()
userMemoryStore.loadFromStorage()
aiChatStore.loadFromStorage()

// Start memory quenching service (silent background)
startMemoryQuenching()

app.mount('#app')
