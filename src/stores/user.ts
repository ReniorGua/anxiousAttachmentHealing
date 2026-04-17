import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { UserInfo, LoginParams } from '@/types'
import { loginApi, getUserInfoApi, logoutApi } from '@/api/user'

export const useUserStore = defineStore('user', () => {
  // State
  const token = ref<string>('')
  const userInfo = ref<UserInfo | null>(null)

  // Getters
  const isLoggedIn = computed(() => !!token.value)
  const userName = computed(() => userInfo.value?.name || '')
  const userRole = computed(() => userInfo.value?.role || '')
  const userId = computed(() => userInfo.value?.id || 0)

  // Actions
  /**
   * User Login
   * @param params - Login credentials
   */
  async function login(params: LoginParams) {
    try {
      const res = await loginApi(params)
      token.value = res.token
      userInfo.value = res.userInfo
      
      // Persist token and user info
      if (params.remember) {
        localStorage.setItem('token', res.token)
        localStorage.setItem('userInfo', JSON.stringify(res.userInfo))
      } else {
        sessionStorage.setItem('token', res.token)
        sessionStorage.setItem('userInfo', JSON.stringify(res.userInfo))
      }
      
      return res
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  }

  /**
   * Get User Info
   */
  async function getUserInfo() {
    try {
      const res = await getUserInfoApi()
      userInfo.value = res
      return res
    } catch (error) {
      console.error('Get user info failed:', error)
      throw error
    }
  }

  /**
   * Logout
   */
  async function logout() {
    try {
      await logoutApi()
    } finally {
      // Clear state regardless of API success
      token.value = ''
      userInfo.value = null
      
      // Clear storage
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
      sessionStorage.removeItem('token')
      sessionStorage.removeItem('userInfo')
    }
  }

  /**
   * Initialize user state from storage
   */
  function initFromStorage() {
    const storedToken = localStorage.getItem('token') || sessionStorage.getItem('token')
    const storedUserInfo = localStorage.getItem('userInfo') || sessionStorage.getItem('userInfo')
    
    if (storedToken) {
      token.value = storedToken
    }
    
    if (storedUserInfo) {
      try {
        userInfo.value = JSON.parse(storedUserInfo)
      } catch (e) {
        console.error('Parse user info failed:', e)
      }
    }
  }

  /**
   * Refresh user info
   */
  async function refreshUserInfo() {
    await getUserInfo()
  }

  return {
    // State
    token,
    userInfo,
    // Getters
    isLoggedIn,
    userName,
    userRole,
    userId,
    // Actions
    login,
    getUserInfo,
    logout,
    initFromStorage,
    refreshUserInfo,
  }
})
