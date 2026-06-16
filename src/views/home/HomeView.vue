<template>
  <div class="home">
    <!-- Decorative background elements -->
    <div class="bg-circle bg-circle-1"></div>
    <div class="bg-circle bg-circle-2"></div>
    <div class="bg-circle bg-circle-3"></div>

    <!-- Top Mini Navigation -->
    <div class="top-nav">
      <router-link to="/chat/memory" class="nav-icon-btn" title="成长年轮">
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3m6-2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      </router-link>
    </div>

    <!-- Main content -->
    <div class="home-content">
      <div class="home-header">
        <h1 class="home-title">松间心舍</h1>
        <p class="home-subtitle">在这里停下来，照顾自己</p>
      </div>

      <div class="choice-cards">
        <router-link to="/chat" class="choice-card choice-card-chat">
          <div class="card-bg-pattern"></div>
          <div class="card-content">
            <span class="card-icon">💬</span>
            <h2 class="card-title">倾诉树洞</h2>
            <p class="card-description">和疗愈师说说话，释放你心里的声音</p>
          </div>
          <div class="card-enter">
            <span>进入</span>
            <span class="arrow">→</span>
          </div>
        </router-link>

        <router-link to="/practice" class="choice-card choice-card-practice">
          <div class="card-bg-pattern"></div>
          <div class="card-content">
            <span class="card-icon">🌿</span>
            <h2 class="card-title">疗愈岛屿</h2>
            <p class="card-description">独自练习，找回内心的平静</p>
          </div>
          <div class="card-enter">
            <span>进入</span>
            <span class="arrow">→</span>
          </div>
        </router-link>
      </div>

      <div class="home-footer">
        <p>给自己一段安静的时光</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.home {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, rgba(250, 248, 245, 1) 0%, rgba(245, 243, 240, 1) 50%, rgba(240, 238, 235, 1) 100%);
  position: relative;
  overflow: hidden;
  padding: 48px 24px;
}

/* Decorative circles */
.bg-circle {
  position: absolute;
  border-radius: 50%;
  opacity: 0.4;
  filter: blur(80px);
}

.bg-circle-1 {
  width: 400px;
  height: 400px;
  background: rgba(143, 169, 143, 0.15);
  top: -100px;
  right: -100px;
}

.bg-circle-2 {
  width: 300px;
  height: 300px;
  background: rgba(200, 190, 180, 0.12);
  bottom: -50px;
  left: -50px;
}

.bg-circle-3 {
  width: 200px;
  height: 200px;
  background: rgba(180, 170, 160, 0.1);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/* Content */
.home-content {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 640px;
  text-align: center;
}

/* Header */
.home-header {
  margin-bottom: 64px;
}

.home-title {
  font-size: 36px;
  font-weight: 300;
  letter-spacing: 0.2em;
  color: #5A5A52;
  margin-bottom: 16px;
}

.home-subtitle {
  font-size: 15px;
  font-weight: 300;
  color: #8A8A7E;
  letter-spacing: 0.08em;
}

/* Choice cards */
.choice-cards {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.choice-card {
  position: relative;
  display: block;
  padding: 40px 32px;
  border-radius: 20px;
  text-decoration: none;
  overflow: hidden;
  transition: all 800ms cubic-bezier(0.4, 0, 0.2, 1);
}

.choice-card-chat {
  background: linear-gradient(135deg, rgba(143, 169, 143, 0.12), rgba(143, 169, 143, 0.06));
  border: 1px solid rgba(143, 169, 143, 0.18);
}

.choice-card-practice {
  background: linear-gradient(135deg, rgba(160, 150, 130, 0.1), rgba(160, 150, 130, 0.05));
  border: 1px solid rgba(160, 150, 130, 0.15);
}

.choice-card:hover {
  transform: translateY(-6px);
}

.choice-card-chat:hover {
  box-shadow: 0 20px 60px rgba(143, 169, 143, 0.15);
}

.choice-card-practice:hover {
  box-shadow: 0 20px 60px rgba(160, 150, 130, 0.12);
}

/* Card background pattern */
.card-bg-pattern {
  position: absolute;
  inset: 0;
  opacity: 0.5;
  background: radial-gradient(circle at 80% 20%, rgba(255,255,255,0.3) 0%, transparent 50%);
}

/* Card content */
.card-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 24px;
}

.card-icon {
  font-size: 40px;
  margin-bottom: 16px;
  opacity: 0.85;
}

.card-title {
  font-size: 20px;
  font-weight: 400;
  letter-spacing: 0.15em;
  color: #5A5A52;
  margin-bottom: 8px;
}

.card-description {
  font-size: 14px;
  font-weight: 300;
  color: #8A8A7E;
  line-height: 1.7;
}

/* Enter indicator */
.card-enter {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 300;
  letter-spacing: 0.1em;
  color: #8A8A7E;
  opacity: 0;
  transform: translateY(8px);
  transition: all 600ms cubic-bezier(0.4, 0, 0.2, 1);
}

.choice-card:hover .card-enter {
  opacity: 1;
  transform: translateY(0);
}

.arrow {
  transition: transform 400ms ease;
}

.choice-card:hover .arrow {
  transform: translateX(4px);
}

/* Footer */
.home-footer {
  margin-top: 64px;
}

.home-footer p {
  font-size: 12px;
  font-weight: 300;
  color: #B0ACA4;
  letter-spacing: 0.1em;
}

/* Top Mini Navigation */
.top-nav {
  position: fixed;
  top: 16px;
  right: 16px;
  z-index: 100;
}

.nav-icon-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #5A5A52;
  background: rgba(255, 255, 255, 0.6);
  transition: all 500ms ease;
  text-decoration: none;
}

.nav-icon-btn:hover {
  background: rgba(255, 255, 255, 0.9);
}
</style>