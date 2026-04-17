import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import './style.css'

// Import stores
import { useUserStore } from './stores/user'
import { useGlobalStore } from './stores/global'
import { useAIChatStore } from './stores/aiChat'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Initialize user state from storage
const userStore = useUserStore(pinia)
const globalStore = useGlobalStore(pinia)
const aiChatStore = useAIChatStore(pinia)

userStore.initFromStorage()
globalStore.initFromStorage()
aiChatStore.loadFromStorage()

app.mount('#app')
