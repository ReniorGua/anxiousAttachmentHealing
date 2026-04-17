/**
 * Mock Streaming API for AI Chat
 * Simulates streaming text output character by character
 */

import { simulateNetworkDelay } from '@/utils/mock'

/**
 * Create a mock readable stream that yields text character by character as Uint8Array
 */
export function createMockStream(text: string): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder()
  
  return new ReadableStream({
    async start(controller) {
      // Initial delay before streaming starts
      await simulateNetworkDelay(300, 600)
      
      const characters = text.split('')
      let index = 0
      
      const pushChar = () => {
        if (index < characters.length) {
          const char = characters[index]
          controller.enqueue(encoder.encode(char))
          index++
          
          // Random delay between characters (30-100ms) for realistic typing effect
          const delay = Math.random() * 70 + 30
          setTimeout(pushChar, delay)
        } else {
          controller.close()
        }
      }
      
      pushChar()
    },
  })
}
