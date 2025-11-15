<template>
  <div class="login-view">
    <div class="login-container">
      <div class="login-header">
        <h1>Welcome Back</h1>
        <p>Sign in to access your account</p>
      </div>

      <div class="login-form">
        <div class="form-group">
          <label>Email Address</label>
          <input v-model="email" type="email" placeholder="your.email@example.com" />
        </div>
        
        <div class="form-group">
          <label>Password</label>
          <input v-model="password" type="password" placeholder="Enter your password" />
        </div>

        <div class="form-options">
          <label class="checkbox-label">
            <input type="checkbox" v-model="rememberMe" />
            <span>Remember me</span>
          </label>
          <a href="#" class="forgot-password">Forgot password?</a>
        </div>

        <button @click="handleLogin" class="btn btn-primary btn-login">
          Sign In
        </button>

        <div class="divider">
          <span>or</span>
        </div>

        <p class="signup-link">
          New user? 
          <a href="#" @click.prevent>Create an account</a>
        </p>

        <div class="demo-note">
          <p>🎓 <strong>Demo Mode:</strong> You can use any credentials to login. Click any button to continue browsing.</p>
        </div>
      </div>

      <div class="quick-access">
        <p>Quick Access (Demo):</p>
        <div class="quick-buttons">
          <button @click="loginAsStudent" class="btn-quick">Continue as Student</button>
          <button @click="loginAsParent" class="btn-quick">Continue as Parent</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const email = ref('')
const password = ref('')
const rememberMe = ref(false)

const handleLogin = () => {
  // Demo login - just redirect to home
  router.push('/')
}

const loginAsStudent = () => {
  email.value = 'student@school.com'
  router.push('/')
}

const loginAsParent = () => {
  email.value = 'parent@example.com'
  router.push('/')
}
</script>

<style scoped>
.login-view {
  min-height: calc(100vh - 160px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
}

.login-container {
  background: white;
  border-radius: 20px;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.login-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 40px 30px;
  text-align: center;
}

.login-header h1 {
  margin-bottom: 10px;
  font-size: 2rem;
}

.login-header p {
  opacity: 0.9;
}

.login-form {
  padding: 30px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #555;
}

.form-group input {
  width: 100%;
  padding: 12px 15px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
  width: auto;
}

.forgot-password {
  color: #667eea;
  text-decoration: none;
  font-size: 0.9rem;
}

.forgot-password:hover {
  text-decoration: underline;
}

.btn-login {
  width: 100%;
  margin-bottom: 20px;
}

.divider {
  text-align: center;
  margin: 25px 0;
  position: relative;
}

.divider::before {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  height: 1px;
  background: #e0e0e0;
}

.divider span {
  background: white;
  padding: 0 15px;
  color: #999;
}

.signup-link {
  text-align: center;
  color: #666;
}

.signup-link a {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
}

.signup-link a:hover {
  text-decoration: underline;
}

.demo-note {
  background: #e7f3ff;
  border: 1px solid #b3d9ff;
  border-radius: 8px;
  padding: 15px;
  margin-top: 20px;
  color: #0066cc;
  font-size: 0.9rem;
}

.quick-access {
  border-top: 1px solid #e0e0e0;
  padding: 20px 30px;
  background: #f8f9fa;
}

.quick-access p {
  margin-bottom: 10px;
  color: #666;
  font-size: 0.9rem;
}

.quick-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.btn-quick {
  padding: 10px 15px;
  border: 2px solid #667eea;
  background: white;
  color: #667eea;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
}

.btn-quick:hover {
  background: #667eea;
  color: white;
}
</style>

