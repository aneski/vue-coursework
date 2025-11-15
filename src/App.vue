<template>
  <div class="app-shell">
    <header class="hero">
      <p class="eyebrow">After-School Coursework</p>
      <h1>Build a calmer lessons experience</h1>
      <p class="subtitle">A simplified single-page layout is under construction.</p>
    </header>
    <section class="placeholder">
      <p>Router-based navigation has been removed. A streamlined lessons UI is on the way.</p>
    </section>
  </div>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
  padding: 4rem 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.hero {
  max-width: 520px;
}

.hero h1 {
  margin-bottom: 1rem;
}

.eyebrow {
  font-size: 0.9rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #6b7280;
}

.subtitle {
  color: #4b5563;
}

.placeholder {
  margin-top: 3rem;
  padding: 2rem;
  border-radius: 1.5rem;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(8px);
  box-shadow: 0 20px 45px rgba(15, 23, 42, 0.08);
}
</style>
