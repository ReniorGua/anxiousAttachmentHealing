import { defineStore } from 'pinia'
import { ref } from 'vue'

const ANONYMOUS_UID_KEY = 'anonymous_uid'

/**
 * Generate UUID v4
 */
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export const useUserStore = defineStore('user', () => {
  // Anonymous identity - no login required
  const anonymousUid = ref<string>('')

  /**
   * Initialize anonymous identity from localStorage
   * If not found, generate a new UUID and persist it
   */
  function initFromStorage() {
    let uid = localStorage.getItem(ANONYMOUS_UID_KEY)
    if (!uid) {
      uid = generateUUID()
      localStorage.setItem(ANONYMOUS_UID_KEY, uid)
      console.log('[UserStore] Generated new anonymous UID:', uid)
    }
    anonymousUid.value = uid
    console.log('[UserStore] Anonymous UID initialized:', anonymousUid.value)
  }

  return {
    anonymousUid,
    initFromStorage,
  }
})
