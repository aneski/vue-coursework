<template>
  <footer class="footer">
    <div class="footer-content">
      <div class="footer-section">
        <h3>AfterSchool Hub</h3>
        <p>Empowering students through quality after-school education and activities.</p>
        <div class="social-links">
          <a href="#" class="social-link">📘</a>
          <a href="#" class="social-link">📷</a>
          <a href="#" class="social-link">🐦</a>
          <a href="#" class="social-link">📧</a>
        </div>
      </div>

      <div class="footer-section">
        <h4>Quick Links</h4>
        <ul>
          <li><router-link to="/">Home</router-link></li>
          <li><router-link to="/classes">Browse Classes</router-link></li>
          <li><router-link to="/login">Login</router-link></li>
          <li><router-link to="/cart">My Cart</router-link></li>
        </ul>
      </div>

      <div class="footer-section">
        <h4>Categories</h4>
        <ul>
          <li><a href="#" @click.prevent>STEM</a></li>
          <li><a href="#" @click.prevent>Music</a></li>
          <li><a href="#" @click.prevent>Sports</a></li>
          <li><a href="#" @click.prevent>Arts</a></li>
        </ul>
      </div>

      <div class="footer-section">
        <h4>Contact Us</h4>
        <ul>
          <li>📧 info@afterschoolhub.com</li>
          <li>📞 +1 (555) 123-4567</li>
          <li>📍 123 Education Street, Learning City, LC 12345</li>
          <li>🕐 Mon-Fri: 9:00 AM - 6:00 PM</li>
        </ul>
      </div>
    </div>

    <div class="footer-bottom">
      <p>&copy; {{ currentYear }} AfterSchool Learning Hub. All rights reserved.</p>
      <div class="footer-links">
        <a href="#">Privacy Policy</a>
        <a href="#">Terms of Service</a>
        <a href="#">Refund Policy</a>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'

const currentYear = computed(() => new Date().getFullYear())
</script>

<style scoped>
.footer {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  margin-top: 60px;
  padding: 50px 20px 20px;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 40px;
  margin-bottom: 40px;
}

.footer-section h3 {
  margin-bottom: 15px;
  font-size: 1.5rem;
}

.footer-section h4 {
  margin-bottom: 15px;
  font-size: 1.1rem;
}

.footer-section p {
  opacity: 0.9;
  line-height: 1.6;
  margin-bottom: 15px;
}

.footer-section ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-section ul li {
  margin-bottom: 10px;
}

.footer-section a {
  color: white;
  text-decoration: none;
  transition: opacity 0.3s;
  opacity: 0.9;
}

.footer-section a:hover {
  opacity: 1;
}

.social-links {
  display: flex;
  gap: 15px;
  margin-top: 15px;
}

.social-link {
  display: inline-block;
  font-size: 1.5rem;
  padding: 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  transition: background 0.3s, transform 0.3s;
}

.social-link:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-3px);
}

.footer-bottom {
  max-width: 1200px;
  margin: 0 auto;
  padding-top: 30px;
  border-top: 1px solid rgba(255, 255, 255, 0.3);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

.footer-bottom p {
  margin: 0;
  opacity: 0.9;
}

.footer-links {
  display: flex;
  gap: 20px;
}

.footer-links a {
  color: white;
  text-decoration: none;
  opacity: 0.9;
  transition: opacity 0.3s;
}

.footer-links a:hover {
  opacity: 1;
}

@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    gap: 30px;
  }
  
  .footer-bottom {
    flex-direction: column;
    text-align: center;
  }
  
  .footer-links {
    flex-direction: column;
    gap: 10px;
  }
}
</style>

