/**
 * Local Storage Utility
 */
export const storage = {
  /**
   * Set item to localStorage
   */
  set(key: string, value: any): void {
    try {
      const serializedValue = JSON.stringify(value)
      localStorage.setItem(key, serializedValue)
    } catch (e) {
      console.error('localStorage set error:', e)
    }
  },

  /**
   * Get item from localStorage
   */
  get<T = any>(key: string): T | null {
    try {
      const item = localStorage.getItem(key)
      if (!item) return null
      return JSON.parse(item) as T
    } catch (e) {
      console.error('localStorage get error:', e)
      return null
    }
  },

  /**
   * Remove item from localStorage
   */
  remove(key: string): void {
    try {
      localStorage.removeItem(key)
    } catch (e) {
      console.error('localStorage remove error:', e)
    }
  },

  /**
   * Clear all items from localStorage
   */
  clear(): void {
    try {
      localStorage.clear()
    } catch (e) {
      console.error('localStorage clear error:', e)
    }
  },

  /**
   * Check if key exists in localStorage
   */
  has(key: string): boolean {
    return localStorage.getItem(key) !== null
  },
}

/**
 * Session Storage Utility
 * Note: Using a different variable name to avoid conflict with native sessionStorage
 */
export const sessionStore = {
  /**
   * Set item to sessionStorage
   */
  set(key: string, value: any): void {
    try {
      const serializedValue = JSON.stringify(value)
      window.sessionStorage.setItem(key, serializedValue)
    } catch (e) {
      console.error('sessionStorage set error:', e)
    }
  },

  /**
   * Get item from sessionStorage
   */
  get<T = any>(key: string): T | null {
    try {
      const item = window.sessionStorage.getItem(key)
      if (!item) return null
      return JSON.parse(item) as T
    } catch (e) {
      console.error('sessionStorage get error:', e)
      return null
    }
  },

  /**
   * Remove item from sessionStorage
   */
  remove(key: string): void {
    try {
      window.sessionStorage.removeItem(key)
    } catch (e) {
      console.error('sessionStorage remove error:', e)
    }
  },

  /**
   * Clear all items from sessionStorage
   */
  clear(): void {
    try {
      window.sessionStorage.clear()
    } catch (e) {
      console.error('sessionStorage clear error:', e)
    }
  },

  /**
   * Check if key exists in sessionStorage
   */
  has(key: string): boolean {
    return window.sessionStorage.getItem(key) !== null
  },
}
