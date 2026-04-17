#!/usr/bin/env node

/**
 * Backend Health Check Script
 * Tests if the backend server is running and responding correctly
 */

const BACKEND_URL = 'http://localhost:3000'

async function checkHealth() {
  try {
    console.log('🔍 Checking backend health...\n')
    
    // Test 1: Health endpoint
    console.log('Test 1: Health Check')
    const healthResponse = await fetch(`${BACKEND_URL}/api/health`)
    
    if (!healthResponse.ok) {
      throw new Error(`Health check failed with status ${healthResponse.status}`)
    }
    
    const healthData = await healthResponse.json()
    console.log('✅ Health check passed')
    console.log(`   Status: ${healthData.status}`)
    console.log(`   Service: ${healthData.service}`)
    console.log(`   Version: ${healthData.version}\n`)
    
    // Test 2: Models endpoint
    console.log('Test 2: Available Models')
    const modelsResponse = await fetch(`${BACKEND_URL}/api/models`)
    
    if (!modelsResponse.ok) {
      throw new Error(`Models endpoint failed with status ${modelsResponse.status}`)
    }
    
    const modelsData = await modelsResponse.json()
    console.log('✅ Models endpoint working')
    console.log(`   Current model: ${modelsData.current}`)
    console.log(`   Available models: ${modelsData.models.length}`)
    modelsData.models.forEach(model => {
      console.log(`     - ${model.id}: ${model.description}`)
    })
    console.log()
    
    // Test 3: Chat endpoint (basic test)
    console.log('Test 3: Chat Endpoint')
    const chatResponse = await fetch(`${BACKEND_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: '你好，请简单介绍一下自己',
      }),
    })
    
    if (!chatResponse.ok) {
      const errorData = await chatResponse.json().catch(() => ({}))
      
      if (chatResponse.status === 401) {
        console.log('⚠️  API Key 配置问题')
        console.log('   请在 server/.env 文件中配置你的 DashScope API Key')
        console.log('   获取地址：https://dashscope.console.aliyun.com/apiKey\n')
        return false
      }
      
      throw new Error(`Chat endpoint failed with status ${chatResponse.status}: ${errorData.message || 'Unknown error'}`)
    }
    
    const chatData = await chatResponse.json()
    console.log('✅ Chat endpoint working')
    console.log(`   Response length: ${chatData.content.length} characters`)
    console.log(`   Message ID: ${chatData.messageId}`)
    
    if (chatData.usage) {
      console.log(`   Token usage:`)
      console.log(`     - Input: ${chatData.usage.input_tokens || 0}`)
      console.log(`     - Output: ${chatData.usage.output_tokens || 0}`)
      console.log(`     - Total: ${chatData.usage.total_tokens || 0}`)
    }
    console.log()
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('✅ All tests passed! Backend is ready.')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
    
    return true
    
  } catch (error) {
    console.log('❌ Backend check failed!\n')
    console.error('Error:', error.message)
    console.log('\nTroubleshooting steps:')
    console.log('1. Make sure backend is running: cd server && npm run dev')
    console.log('2. Check if port 3000 is available')
    console.log('3. Verify .env file exists in server/ directory')
    console.log('4. Check server logs for errors\n')
    return false
  }
}

// Run the check
checkHealth().then(success => {
  process.exit(success ? 0 : 1)
})
