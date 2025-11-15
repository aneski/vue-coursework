<template>
  <div class="checkout-view">
    <h1>Checkout</h1>
    
    <div v-if="cart.items.length === 0" class="empty-checkout">
      <p>Your cart is empty. Please add items to cart first.</p>
      <router-link to="/classes" class="btn btn-primary">Browse Classes</router-link>
    </div>

    <div v-else class="checkout-content">
      <div class="checkout-form">
        <h2>Student & Parent Information</h2>
        
        <div class="form-section">
          <h3>Student Details</h3>
          <div class="form-group">
            <label>Student Name *</label>
            <input v-model="formData.studentName" type="text" required />
          </div>
          <div class="form-group">
            <label>Student Age *</label>
            <input v-model="formData.studentAge" type="number" min="6" max="18" required />
          </div>
        </div>

        <div class="form-section">
          <h3>Parent/Guardian Details</h3>
          <div class="form-group">
            <label>Parent Name *</label>
            <input v-model="formData.parentName" type="text" required />
          </div>
          <div class="form-group">
            <label>Email *</label>
            <input v-model="formData.email" type="email" required />
          </div>
          <div class="form-group">
            <label>Phone Number *</label>
            <input v-model="formData.phone" type="tel" required />
          </div>
          <div class="form-group">
            <label>Address *</label>
            <input v-model="formData.address" type="text" required />
          </div>
        </div>

        <div class="form-section">
          <h3>Payment Information</h3>
          <div class="form-group">
            <label>Card Number *</label>
            <input v-model="formData.cardNumber" type="text" placeholder="1234 5678 9012 3456" maxlength="19" required />
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Expiry Date *</label>
              <input v-model="formData.expiryDate" type="text" placeholder="MM/YY" maxlength="5" required />
            </div>
            <div class="form-group">
              <label>CVV *</label>
              <input v-model="formData.cvv" type="text" placeholder="123" maxlength="3" required />
            </div>
          </div>
        </div>

        <div class="payment-note">
          <p>💳 This is a demo application. No actual payment will be processed.</p>
        </div>
      </div>

      <div class="order-summary">
        <h2>Order Summary</h2>
        
        <div class="order-items">
          <div v-for="item in cart.items" :key="item.id" class="order-item">
            <span>{{ item.title }} x{{ item.quantity }}</span>
            <span>${{ (item.price * item.quantity).toFixed(2) }}</span>
          </div>
        </div>

        <div class="summary-totals">
          <div class="summary-row">
            <span>Subtotal:</span>
            <span>${{ getTotal().toFixed(2) }}</span>
          </div>
          <div class="summary-row">
            <span>Tax (7%):</span>
            <span>${{ getTax().toFixed(2) }}</span>
          </div>
          <div class="summary-divider"></div>
          <div class="summary-row total">
            <span>Total:</span>
            <span>${{ getGrandTotal().toFixed(2) }}</span>
          </div>
        </div>

        <button @click="handleCheckout" class="btn btn-primary btn-place-order" :disabled="isProcessing">
          {{ isProcessing ? 'Processing...' : 'Place Order' }}
        </button>

        <router-link to="/cart" class="btn btn-secondary">Back to Cart</router-link>
      </div>
    </div>

    <!-- Success Modal -->
    <div v-if="showSuccess" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <div class="success-icon">✅</div>
        <h2>Order Confirmed!</h2>
        <p>Thank you for your purchase. An email confirmation has been sent to {{ formData.email }}</p>
        <div class="order-details">
          <p><strong>Order ID:</strong> {{ orderId }}</p>
          <p><strong>Total Amount:</strong> ${{ getGrandTotal().toFixed(2) }}</p>
        </div>
        <div class="modal-actions">
          <router-link to="/" class="btn btn-primary">Back to Home</router-link>
          <router-link to="/classes" class="btn btn-secondary">Browse More Classes</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useCart } from '../store/cart'
import { useRouter } from 'vue-router'

const router = useRouter()
const { cart, getTotal, clearCart } = useCart()
const isProcessing = ref(false)
const showSuccess = ref(false)
const orderId = ref('')

const formData = reactive({
  studentName: '',
  studentAge: '',
  parentName: '',
  email: '',
  phone: '',
  address: '',
  cardNumber: '',
  expiryDate: '',
  cvv: ''
})

const getTax = () => {
  return getTotal() * 0.07
}

const getGrandTotal = () => {
  return getTotal() + getTax()
}

const generateOrderId = () => {
  return 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase()
}

const handleCheckout = () => {
  isProcessing.value = true
  
  // Simulate API call
  setTimeout(() => {
    orderId.value = generateOrderId()
    isProcessing.value = false
    showSuccess.value = true
    clearCart()
  }, 1500)
}

const closeModal = () => {
  showSuccess.value = false
}
</script>

<style scoped>
.checkout-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.checkout-view h1 {
  font-size: 2.5rem;
  margin-bottom: 30px;
  color: #333;
}

.empty-checkout {
  text-align: center;
  padding: 60px 20px;
}

.checkout-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 30px;
}

.checkout-form {
  background: white;
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.form-section {
  margin-bottom: 30px;
}

.form-section h3 {
  margin-bottom: 20px;
  color: #333;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 10px;
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

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.payment-note {
  background: #fff3cd;
  border: 1px solid #ffc107;
  border-radius: 8px;
  padding: 15px;
  color: #856404;
  margin-top: 20px;
}

.order-summary {
  position: sticky;
  top: 20px;
  height: fit-content;
  background: white;
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.order-summary h2 {
  margin-bottom: 20px;
  color: #333;
}

.order-items {
  margin-bottom: 20px;
}

.order-item {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
}

.summary-totals {
  margin-top: 20px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.summary-row.total {
  font-size: 1.3rem;
  font-weight: 700;
  color: #764ba2;
}

.summary-divider {
  border-top: 2px solid #e0e0e0;
  margin: 15px 0;
}

.btn-place-order {
  width: 100%;
  margin-bottom: 10px;
}

.btn-secondary {
  width: 100%;
  background: #6c757d;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 20px;
  padding: 40px;
  max-width: 500px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.success-icon {
  font-size: 4rem;
  margin-bottom: 20px;
}

.modal-content h2 {
  margin-bottom: 15px;
  color: #333;
}

.order-details {
  background: #f8f9fa;
  border-radius: 10px;
  padding: 20px;
  margin: 20px 0;
  text-align: left;
}

.modal-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.modal-actions .btn {
  flex: 1;
}

@media (max-width: 968px) {
  .checkout-content {
    grid-template-columns: 1fr;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>

