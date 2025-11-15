<template>
  <nav class="navbar">
    <div class="nav-container">
      <router-link to="/" class="logo">
        <span class="logo-emoji">🎓</span>
        <span class="logo-text">AfterSchool Hub</span>
      </router-link>
      
      <ul class="nav-menu">
        <li>
          <router-link to="/">Home</router-link>
        </li>
        <li>
          <router-link to="/classes">Classes</router-link>
        </li>
        <li>
          <router-link to="/cart" class="cart-link">
            Cart
            <span v-if="cartCount > 0" class="cart-badge">{{ cartCount }}</span>
          </router-link>
        </li>
      </ul>

      <div class="nav-actions">
        <router-link to="/login" class="btn-login">Sign In</router-link>
      </div>

      <button @click="toggleMobileMenu" class="mobile-menu-btn">
        <span>☰</span>
      </button>
    </div>

    <ul v-if="showMobileMenu" class="nav-mobile">
      <li>
        <router-link to="/" @click="toggleMobileMenu">Home</router-link>
      </li>
      <li>
        <router-link to="/classes" @click="toggleMobileMenu">Classes</router-link>
      </li>
      <li>
        <router-link to="/cart" @click="toggleMobileMenu">
          Cart
          <span v-if="cartCount > 0" class="cart-badge">{{ cartCount }}</span>
        </router-link>
      </li>
      <li>
        <router-link to="/login" @click="toggleMobileMenu">Sign In</router-link>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useCart } from '../store/cart'

const { getCartCount } = useCart()
const showMobileMenu = ref(false)

const cartCount = computed(() => getCartCount())

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
}
</script>

<style scoped>
.navbar {
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
  margin-bottom: 20px;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: #333;
  font-size: 1.3rem;
  font-weight: 700;
}

.logo-emoji {
  font-size: 2rem;
}

.logo-text {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.nav-menu {
  display: flex;
  list-style: none;
  gap: 30px;
  margin: 0;
  padding: 0;
}

.nav-menu a {
  text-decoration: none;
  color: #333;
  font-weight: 600;
  transition: color 0.3s;
  position: relative;
}

.nav-menu a:hover,
.nav-menu a.router-link-active {
  color: #667eea;
}

.nav-menu a.router-link-active::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 0;
  right: 0;
  height: 2px;
  background: #667eea;
}

.cart-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.cart-badge {
  background: #764ba2;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 700;
}

.btn-login {
  padding: 10px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: transform 0.3s;
}

.btn-login:hover {
  transform: translateY(-2px);
}

.mobile-menu-btn {
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #333;
}

.nav-mobile {
  display: none;
  list-style: none;
  padding: 20px;
  margin: 0;
  border-top: 1px solid #e0e0e0;
}

.nav-mobile li {
  margin-bottom: 10px;
}

.nav-mobile a {
  text-decoration: none;
  color: #333;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px;
  border-radius: 8px;
  transition: background 0.3s;
}

.nav-mobile a:hover,
.nav-mobile a.router-link-active {
  background: #f0f0f0;
}

@media (max-width: 768px) {
  .nav-menu,
  .nav-actions {
    display: none;
  }
  
  .mobile-menu-btn {
    display: block;
  }
  
  .nav-mobile {
    display: block;
  }
}
</style>

