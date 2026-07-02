/**
 * Mock Data Utilities
 * Only simulateNetworkDelay is used in production.
 */

/**
 * Simulate network delay
 */
export async function simulateNetworkDelay(minMs: number = 500, maxMs: number = 1500) {
  const delay = Math.floor(Math.random() * (maxMs - minMs)) + minMs
  await new Promise(resolve => setTimeout(resolve, delay))
}
