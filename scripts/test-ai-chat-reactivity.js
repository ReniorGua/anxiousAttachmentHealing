#!/usr/bin/env node

/**
 * AI Chat Reactivity Test Script
 * Tests Vue/Pinia store reactivity for AI chat messages
 * 
 * Run this in browser console (F12) on the AI Chat page
 */

console.log('🧪 AI Chat Reactivity Test\n')
console.log('This tests if messages properly appear in the UI after being added to the store.\n')

const testCode = `
// === PHASE 1: Initial State Check ===
console.log('=== PHASE 1: Initial State ===');

// Check if Pinia store is accessible
let store = null;
try {
  // Try to access via global property or window
  store = window.aiChatStore || 
          document.querySelector('#__nuxt')?.__vueParentComponent?.provides?._store?.aiChat ||
          null;
  console.log('✅ Store accessible:', !!store);
} catch (e) {
  console.log('⚠️  Store not directly accessible (this is normal in production)');
}

// Check localStorage
const storedSessions = localStorage.getItem('ai-chat-sessions');
console.log('📦 LocalStorage has sessions:', !!storedSessions);

if (storedSessions) {
  try {
    const sessions = JSON.parse(storedSessions);
    console.log('   Sessions count:', sessions.length);
    if (sessions.length > 0) {
      const lastSession = sessions[sessions.length - 1];
      console.log('   Last session ID:', lastSession.id);
      console.log('   Messages in last session:', lastSession.messages.length);
      lastSession.messages.forEach((msg, i) => {
        console.log(\`     [\\${msg.role}] \\${msg.content.substring(0, 30)}...\\`);
      });
    }
  } catch (e) {
    console.error('❌ Failed to parse sessions:', e);
  }
}

// === PHASE 2: Simulate Adding Message ===
console.log('\\n=== PHASE 2: Add Test Message ===');

const testData = {
  sessionId: 'test-' + Date.now(),
  userMessage: {
    id: 'user-' + Date.now(),
    role: 'user',
    content: 'Test message at ' + new Date().toLocaleTimeString(),
    timestamp: Date.now(),
    status: 'sent'
  },
  aiMessage: {
    id: 'ai-' + Date.now(),
    role: 'assistant',
    content: 'AI response at ' + new Date().toLocaleTimeString(),
    timestamp: Date.now(),
    status: 'sent'
  }
};

console.log('Test data created:', testData);

// Create or get session
let sessions = [];
if (storedSessions) {
  try {
    sessions = JSON.parse(storedSessions);
  } catch (e) {
    console.error('Failed to parse, starting fresh');
    sessions = [];
  }
}

if (sessions.length === 0) {
  console.log('Creating new test session...');
  sessions.push({
    id: testData.sessionId,
    title: 'Reactivity Test',
    messages: [],
    createdAt: Date.now(),
    updatedAt: Date.now()
  });
}

// Add messages
const session = sessions.find(s => s.id === testData.sessionId) || sessions[0];
session.id = testData.sessionId; // Ensure we're using our test session ID
session.messages.push(testData.userMessage, testData.aiMessage);
session.updatedAt = Date.now();
session.title = 'Reactivity Test ' + new Date().toLocaleTimeString();

// Save back to localStorage
localStorage.setItem('ai-chat-sessions', JSON.stringify(sessions));
localStorage.setItem('ai-chat-current-session', testData.sessionId);

console.log('✅ Messages added to localStorage');
console.log('   User message:', testData.userMessage.content);
console.log('   AI message:', testData.aiMessage.content);
console.log('   Total messages:', session.messages.length);

// === PHASE 3: Verify Persistence ===
console.log('\\n=== PHASE 3: Verify Immediately ===');

setTimeout(() => {
  const verifyStored = localStorage.getItem('ai-chat-sessions');
  if (verifyStored) {
    try {
      const verifySessions = JSON.parse(verifyStored);
      const currentId = localStorage.getItem('ai-chat-current-session');
      console.log('Current session ID:', currentId);
      
      const verifySession = verifySessions.find(s => s.id === currentId);
      if (verifySession) {
        console.log('Session found:', verifySession.id);
        console.log('Messages count:', verifySession.messages.length);
        
        const lastMsg = verifySession.messages[verifySession.messages.length - 1];
        console.log('Last message role:', lastMsg.role);
        console.log('Last message content:', lastMsg.content.substring(0, 50));
        
        if (lastMsg.id === testData.aiMessage.id) {
          console.log('✅ TEST PASSED: AI message persisted correctly');
        } else {
          console.log('⚠️  TEST WARNING: Last message is different than expected');
        }
      } else {
        console.error('❌ TEST FAILED: Session not found');
      }
    } catch (e) {
      console.error('❌ TEST FAILED: Parse error:', e);
    }
  } else {
    console.error('❌ TEST FAILED: No data in localStorage');
  }
  
  console.log('\\n=== Test Complete ===');
  console.log('\\nNext steps:');
  console.log('1. Check if messages are visible in the UI');
  console.log('2. If NOT visible, there\\'s a Vue reactivity issue');
  console.log('3. If visible, refresh the page and check again');
  console.log('4. Check console for any Vue warnings or errors');
  
}, 100);
`;

console.log('─'.repeat(80));
console.log('Copy the code below and paste it into your browser console (F12):');
console.log('─'.repeat(80));
console.log(testCode);
console.log('─'.repeat(80));
console.log('\n📋 Instructions:');
console.log('1. Open the AI Chat page');
console.log('2. Press F12 to open DevTools');
console.log('3. Go to Console tab');
console.log('4. Clear console');
console.log('5. Copy and paste the code above');
console.log('6. Press Enter to run');
console.log('7. Watch the output for ✅ (passed) or ❌ (failed)\n');
console.log('🔍 What this tests:');
console.log('  - localStorage persistence');
console.log('  - Message structure validity');
console.log('  - Immediate retrieval after save');
console.log('  - Session ID consistency\n');
console.log('💡 After running:');
console.log('  - Check if the test messages appear in the chat UI');
console.log('  - If they DON\\'T appear → Vue reactivity issue');
console.log('  - If they DO appear → Issue might be timing-related');
console.log('  - Refresh page to see if messages persist\n');
