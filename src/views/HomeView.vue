<template>
  <div class="home">
    <section class="hero">
      <h1>Welcome to AfterSchool Learning Hub</h1>
      <p class="subtitle">Discover amazing classes and activities for students of all ages</p>
      <router-link to="/classes" class="btn btn-primary">Browse Classes</router-link>
    </section>

    <section class="features">
      <div class="feature-card">
        <div class="feature-icon">📚</div>
        <h3>Diverse Programs</h3>
        <p>From STEM to arts, sports to music - we have something for everyone</p>
      </div>
      <div class="feature-card">
        <div class="feature-icon">👨‍🏫</div>
        <h3>Expert Instructors</h3>
        <p>Learn from experienced teachers passionate about education</p>
      </div>
      <div class="feature-card">
        <div class="feature-icon">🎯</div>
        <h3>Flexible Schedule</h3>
        <p>Classes designed to fit your busy after-school schedule</p>
      </div>
      <div class="feature-card">
        <div class="feature-icon">💰</div>
        <h3>Affordable Pricing</h3>
        <p>Quality education at prices that work for families</p>
      </div>
    </section>

    <section class="popular-classes">
      <h2>Popular Classes</h2>
      <div class="classes-grid">
        <div v-for="classItem in popularClasses" :key="classItem.id" class="class-card">
          <div class="class-emoji">{{ classItem.image }}</div>
          <h3>{{ classItem.title }}</h3>
          <p class="category">{{ classItem.category }}</p>
          <p class="price">${{ classItem.price.toFixed(2) }}</p>
          <router-link :to="`/classes`" class="btn btn-small">Learn More</router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { classes } from '../data/classes'

const popularClasses = classes.slice(0, 6)
</script>

<style scoped>
.home {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.hero {
  text-align: center;
  padding: 80px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 20px;
  margin-bottom: 60px;
}

.hero h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
  font-weight: 700;
}

.subtitle {
  font-size: 1.3rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  margin-bottom: 60px;
}

.feature-card {
  text-align: center;
  padding: 30px 20px;
  background: white;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.feature-card h3 {
  margin-bottom: 10px;
  color: #333;
}

.popular-classes {
  margin-top: 60px;
}

.popular-classes h2 {
  text-align: center;
  margin-bottom: 40px;
  font-size: 2rem;
  color: #333;
}

.classes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 30px;
}

.class-card {
  background: white;
  border-radius: 15px;
  padding: 30px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}

.class-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
}

.class-emoji {
  font-size: 4rem;
  margin-bottom: 15px;
}

.class-card h3 {
  margin-bottom: 10px;
  color: #333;
  font-size: 1.3rem;
}

.category {
  color: #667eea;
  font-weight: 600;
  margin-bottom: 10px;
  text-transform: uppercase;
  font-size: 0.9rem;
}

.price {
  font-size: 1.5rem;
  font-weight: 700;
  color: #764ba2;
  margin-bottom: 15px;
}

@media (max-width: 768px) {
  .hero h1 {
    font-size: 2rem;
  }
  
  .subtitle {
    font-size: 1.1rem;
  }
  
  .classes-grid {
    grid-template-columns: 1fr;
  }
}
</style>

