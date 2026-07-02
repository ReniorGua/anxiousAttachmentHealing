import { defineStore } from 'pinia'
import { ref } from 'vue'

export type ColorScheme = 'calm' | 'warm' | 'fresh' | 'serene' | 'natural' | 'default'

export const useGlobalStore = defineStore('global', () => {
  // State
  const loading = ref<boolean>(false)
  const theme = ref<string>('light')
  const language = ref<string>('zh-CN')
  const collapsed = ref<boolean>(false)
  const colorScheme = ref<ColorScheme>('default')
  const customThemeColor = ref<string | null>(null)  // Custom hex color
  const backgroundMusic = ref<string | null>(null)  // Background music URL
  const initialComfort = ref<string | null>(null)  // Short comforting message

  // Apply color scheme to document
  function applyColorScheme(scheme: ColorScheme) {
    if (scheme === 'default') {
      document.documentElement.removeAttribute('data-theme')
      customThemeColor.value = null
    } else {
      document.documentElement.setAttribute('data-theme', scheme)
    }
    colorScheme.value = scheme
    localStorage.setItem('colorScheme', scheme)
    console.log(`[Theme] Applied color scheme: ${scheme}`)
  }

  // Apply custom healing atmosphere (from tool call)
  function applyHealingAtmosphere(themeColor: string, music?: string, comfort?: string) {
    console.log(`[Theme] Applying healing atmosphere:`, { themeColor, music, comfort })
    console.log(`[Theme] Current CSS --theme-primary:`, getComputedStyle(document.documentElement).getPropertyValue('--theme-primary'))

    // Set custom theme color
    customThemeColor.value = themeColor
    document.documentElement.style.setProperty('--theme-primary', themeColor)

    // Calculate hover color (slightly darker)
    const hoverColor = adjustColorBrightness(themeColor, -20)
    document.documentElement.style.setProperty('--theme-primary-hover', hoverColor)

    // Calculate light variant for backgrounds
    const lightColor = adjustColorBrightness(themeColor, 90)
    document.documentElement.style.setProperty('--theme-primary-light', lightColor)

    console.log(`[Theme] After setProperty --theme-primary:`, document.documentElement.style.getPropertyValue('--theme-primary'))
    console.log(`[Theme] HTML element has data-theme:`, document.documentElement.getAttribute('data-theme'))

    // Set background music
    if (music) {
      backgroundMusic.value = music
      localStorage.setItem('backgroundMusic', music)
    }

    // Set initial comfort message
    if (comfort) {
      initialComfort.value = comfort
      console.log(`[Theme] Initial comfort: ${comfort}`)
    }

    // Mark as using custom theme
    colorScheme.value = 'default' // Reset scheme to indicate custom

    // Verify the CSS variable is set
    const computedColor = getComputedStyle(document.documentElement).getPropertyValue('--theme-primary').trim()
    console.log(`[Theme] Verified computed --theme-primary:`, computedColor)
  }

  // Helper: Adjust hex color brightness
  function adjustColorBrightness(hex: string, percent: number): string {
    const cleanHex = hex.replace('#', '')
    const num = parseInt(cleanHex, 16)
    if (isNaN(num)) {
      console.warn('[Theme] Invalid hex color:', hex)
      return hex
    }
    const amt = Math.round(2.55 * percent)
    const R = Math.max(0, Math.min(255, (num >> 16) + amt))
    const G = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) + amt))
    const B = Math.max(0, Math.min(255, (num & 0x0000FF) + amt))
    return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1).toUpperCase()
  }

  // Actions
  /**
   * Set global loading state
   */
  function setLoading(value: boolean) {
    loading.value = value
  }

  /**
   * Set theme
   */
  function setTheme(value: string) {
    theme.value = value
    localStorage.setItem('theme', value)
  }

  /**
   * Set language
   */
  function setLanguage(value: string) {
    language.value = value
    localStorage.setItem('language', value)
  }

  /**
   * Toggle sidebar collapsed state
   */
  function toggleCollapsed() {
    collapsed.value = !collapsed.value
  }

  /**
   * Set sidebar collapsed state
   */
  function setCollapsed(value: boolean) {
    collapsed.value = value
  }

  /**
   * Initialize from storage
   */
  function initFromStorage() {
    const storedTheme = localStorage.getItem('theme')
    const storedLanguage = localStorage.getItem('language')
    const storedColorScheme = localStorage.getItem('colorScheme') as ColorScheme | null

    if (storedTheme) {
      theme.value = storedTheme
    }

    if (storedLanguage) {
      language.value = storedLanguage
    }

    if (storedColorScheme) {
      applyColorScheme(storedColorScheme)
    }
  }

  return {
    // State
    loading,
    theme,
    language,
    collapsed,
    colorScheme,
    customThemeColor,
    backgroundMusic,
    initialComfort,
    // Actions
    setLoading,
    setTheme,
    setLanguage,
    toggleCollapsed,
    setCollapsed,
    applyColorScheme,
    applyHealingAtmosphere,
    initFromStorage,
  }
})
