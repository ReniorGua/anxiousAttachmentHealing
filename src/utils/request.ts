import axios, { AxiosError, type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios'
import { useUserStore } from '@/stores/user'
import { useGlobalStore } from '@/stores/global'
import type { ApiResponse } from '@/types'
import router from '@/router'

// Request interface for cancellation tracking
interface PendingRequest {
  key: string
  cancel: () => void
}

/**
 * Generate request key for duplicate request detection
 */
const generateRequestKey = (config: AxiosRequestConfig): string => {
  return `${config.method}_${config.url}_${JSON.stringify(config.params)}_${JSON.stringify(config.data)}`
}

/**
 * Axios Instance Configuration
 */
class RequestWrapper {
  private instance: AxiosInstance
  private pendingRequests: Map<string, PendingRequest> = new Map()

  constructor() {
    this.instance = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
      timeout: 10000, // 10 seconds timeout
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.setupInterceptors()
  }

  /**
   * Setup request and response interceptors
   */
  private setupInterceptors() {
    // Request Interceptor
    this.instance.interceptors.request.use(
      (config) => {
        const userStore = useUserStore()
        const globalStore = useGlobalStore()

        // Add anonymous UID to request header for anonymous identity
        if (userStore.anonymousUid) {
          config.headers['X-Anonymous-UID'] = userStore.anonymousUid
        }

        // Ensure Content-Type is set
        if (!config.headers['Content-Type']) {
          config.headers['Content-Type'] = 'application/json'
        }

        // Cancel duplicate requests
        const requestKey = generateRequestKey(config)
        const pendingRequest = this.pendingRequests.get(requestKey)
        
        if (pendingRequest) {
          // Cancel previous duplicate request
          pendingRequest.cancel()
          this.pendingRequests.delete(requestKey)
        }

        // Create new cancel token
        const AbortController = window.AbortController
        if (AbortController && !config.signal) {
          const controller = new AbortController()
          config.signal = controller.signal
          
          // Store the cancel function
          this.pendingRequests.set(requestKey, {
            key: requestKey,
            cancel: () => controller.abort(),
          })
        }

        // Set global loading state if needed
        if (config.showLoading !== false) {
          globalStore.setLoading(true)
        }

        return config
      },
      (error: AxiosError) => {
        const globalStore = useGlobalStore()
        globalStore.setLoading(false)
        return Promise.reject(error)
      }
    )

    // Response Interceptor
    this.instance.interceptors.response.use(
      (response: AxiosResponse<ApiResponse>) => {
        const globalStore = useGlobalStore()
        const config = response.config as AxiosRequestConfig & { showLoading?: boolean }
        
        // Remove from pending requests
        const requestKey = generateRequestKey(config)
        this.pendingRequests.delete(requestKey)

        // Hide loading
        if (config.showLoading !== false) {
          globalStore.setLoading(false)
        }

        const res = response.data

        // Check response code
        if (res.code !== 200 && res.code !== 0) {
          // Handle different error codes
          this.handleError(res.code, res.msg)
          return Promise.reject(new Error(res.msg || 'Request failed'))
        }

        // Return only the data part
        return res.data
      },
      (error: AxiosError) => {
        const globalStore = useGlobalStore()
        globalStore.setLoading(false)

        // Remove from pending requests
        const config = error.config as AxiosRequestConfig
        if (config) {
          const requestKey = generateRequestKey(config)
          this.pendingRequests.delete(requestKey)
        }

        // Handle different HTTP status codes
        if (error.response) {
          const status = error.response.status
          const message = (error.response.data as ApiResponse)?.msg || error.message

          switch (status) {
            case 401:
              // Unauthorized - Token expired or invalid
              this.handleUnauthorized()
              break
            case 403:
              // Forbidden - No permission
              this.showMessage('暂无操作权限', 'error')
              break
            case 404:
              // Not Found
              this.showMessage('请求资源不存在', 'error')
              break
            case 500:
              // Internal Server Error
              this.showMessage('服务器繁忙，请稍后重试', 'error')
              break
            default:
              this.showMessage(message || '请求失败，请稍后重试', 'error')
          }
        } else if (error.code === 'ECONNABORTED' || error.name === 'AbortError') {
          // Request cancelled or timeout
          this.showMessage('请求超时，请检查网络', 'error')
        } else if (error.code === 'ERR_NETWORK') {
          // Network error
          this.showMessage('网络错误，请检查网络连接', 'error')
        } else {
          // Other errors
          this.showMessage(error.message || '请求失败，请稍后重试', 'error')
        }

        return Promise.reject(error)
      }
    )
  }

  /**
   * Handle unauthorized access (401)
   */
  private handleUnauthorized() {
    // Anonymous system - no login to refresh, just show message
    this.showMessage('会话已过期，请刷新页面', 'warning')
  }

  /**
   * Handle error codes
   */
  private handleError(code: number, msg: string) {
    switch (code) {
      case 401:
        this.showMessage('会话已过期', 'warning')
        break
      case 403:
        this.showMessage('暂无操作权限', 'error')
        break
      case 404:
        this.showMessage('请求资源不存在', 'error')
        break
      case 500:
        this.showMessage('服务器繁忙，请稍后重试', 'error')
        break
      default:
        this.showMessage(msg || '请求失败，请稍后重试', 'error')
    }
  }

  /**
   * Show message (using a simple implementation, can be replaced with Ant Design Vue Message)
   */
  private showMessage(message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') {
    // Simple console log for now, can be replaced with UI component
    console.log(`[${type.toUpperCase()}] ${message}`)
    
    // You can integrate with a message component library here
    // For example: ElMessage[type](message) or message[type](message)
  }

  /**
   * Get axios instance
   */
  getInstance(): AxiosInstance {
    return this.instance
  }

  /**
   * Request method
   */
  request<T = any>(config: AxiosRequestConfig): Promise<T> {
    return this.instance.request(config)
  }

  /**
   * GET request
   */
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, url, method: 'GET' })
  }

  /**
   * POST request
   */
  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, url, method: 'POST', data })
  }

  /**
   * PUT request
   */
  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, url, method: 'PUT', data })
  }

  /**
   * DELETE request
   */
  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, url, method: 'DELETE' })
  }
}

// Extend AxiosRequestConfig to support custom options
declare module 'axios' {
  interface AxiosRequestConfig {
    showLoading?: boolean
  }
}

// Create singleton instance
const request = new RequestWrapper()

export default request
