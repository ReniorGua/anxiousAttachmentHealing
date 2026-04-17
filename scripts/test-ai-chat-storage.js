#!/usr/bin/env node

/**
 * AI Chat Storage Test Script
 * Tests localStorage persistence and retrieval for AI chat messages
 */

console.log('🧪 AI Chat Storage Test\n')
console.log('This script tests the localStorage persistence mechanism.')
console.log('Run this in your browser console (F12) while on the AI Chat page.\n')

const testScript = `
// Test 1: Check current state
console.log('=== Test 1: Current State ===');
console.log('Sessions in localStorage:', localStorage.getItem('ai-chat-sessions') ? 'EXISTS' : 'EMPTY');
console.log('Current session ID:', localStorage.getItem('ai-chat-current-session'));

if (localStorage.getItem('ai-chat-sessions')) {
  try {
    const sessions = JSON.parse(localStorage.getItem('ai-chat-sessions'));
    console.log('Number of sessions:', sessions.length);
    sessions.forEach((session, idx) => {
      console.log(\`  Session \\${idx + 1}: \\${session.id}\`);
      console.log(\`    Title: \\${session.title}\`);
      console.log(\`    Messages: \\${session.messages.length}\`);
      session.messages.forEach((msg, msgIdx) => {
        console.log(\`      Message \\${msgIdx + 1}: [\\${msg.role}] \\${msg.content.substring(0, 50)}...\`);
      });
    });
  } catch (e) {
    console.error('Failed to parse sessions:', e);
  }
}

// Test 2: Simulate adding a message
console.log('\\n=== Test 2: Simulate Adding Message ===');
const testMessage = {
  id: 'test-' + Date.now(),
  role: 'assistant',
  content: 'This is a test message at ' + new Date().toLocaleTimeString(),
  timestamp: Date.now(),
  status: 'sent'
};

let sessions = [];
try {
  const stored = localStorage.getItem('ai-chat-sessions');
  if (stored) {
    sessions = JSON.parse(stored);
  }
  
  if (sessions.length === 0) {
    console.log('No sessions found, creating one...');
    sessions.push({
      id: 'test-session-' + Date.now(),
      title: 'Test Session',
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    });
  }
  
  const currentSessionId = localStorage.getItem('ai-chat-current-session') || sessions[0].id;
  const session = sessions.find(s => s.id === currentSessionId);
  
  if (session) {
    console.log('Adding test message to session:', session.id);
    session.messages.push(testMessage);
    session.updatedAt = Date.now();
    
    localStorage.setItem('ai-chat-sessions', JSON.stringify(sessions));
    console.log('✅ Message saved to localStorage');
    console.log('Total messages in session:', session.messages.length);
  } else {
    console.error('❌ Session not found:', currentSessionId);
  }
} catch (e) {
  console.error('❌ Error saving message:', e);
}

// Test 3: Verify persistence
console.log('\\n=== Test 3: Verify Persistence ===');
setTimeout(() => {
  try {
    const stored = localStorage.getItem('ai-chat-sessions');
    if (stored) {
      const sessions = JSON.parse(stored);
      const lastSession = sessions[sessions.length - 1];
      const lastMessage = lastSession.messages[lastSession.messages.length - 1];
      
      if (lastMessage && lastMessage.content.includes('test message')) {
        console.log('✅ TEST PASSED: Message persisted correctly');
        console.log('Last message:', lastMessage.content);
      } else {
        console.log('⚠️  TEST WARNING: Last message is not the test message');
        console.log('Last message:', lastMessage?.content);
      }
    } else {
      console.error('❌ TEST FAILED: No sessions in localStorage');
    }
  } catch (e) {
    console.error('❌ TEST FAILED: Error verifying:', e);
  }
}, 100);

// Test 4: Pinia Store Check (if available)
console.log('\\n=== Test 4: Pinia Store Check ===');
if (window.__pinia) {
  try {
    const aiChatStore = window.__pinia.state.value.aiChat || {};
    console.log('Pinia store exists: YES');
    console.log('Sessions in store:', aiChatStore.sessions?.length || 0);
    console.log('Current session ID:', aiChatStore.currentSessionId);
    console.log('Messages:', aiChatStore.sessions?.[0]?.messages?.length || 0);
  } catch (e) {
    console.error('Error accessing Pinia store:', e);
  }
} else {
  console.log('Pinia store not accessible (this is normal in production build)');
}

console.log('\\n=== Tests Complete ===');
`;

console.log('Copy and paste the following code into your browser console:\n');
console.log('─'.repeat(80));
console.log(testScript);
console.log('─'.repeat(80));
console.log('\nThen press Enter to run the tests.');
console.log('\nThe tests will:');
console.log('1. Check current localStorage state');
console.log('2. Add a test message');
console.log('3. Verify the message was persisted');
console.log('4. Check Pinia store state (if accessible)');
console.log('\nLook for ✅ (passed) or ❌ (failed) indicators in the output.\n');
