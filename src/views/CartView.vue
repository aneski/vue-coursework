<template>
  <div class="cart-view">
    <h1>Shopping Cart</h1>
    
    <div v-if="cart.items.length === 0" class="empty-cart">
      <div class="empty-icon">🛒</div>
      <h2>Your cart is empty</h2>
      <p>Browse our classes and add items to your cart!</p>
      <router-link to="/classes" class="btn btn-primary">Browse Classes</router-link>
    </div>

    <div v-else class="cart-content">
      <div class="cart-items">
        <div v-for="item in cart.items" :key="item.id" class="cart-item">
          <div class="item-info">
            <div class="item-emoji">{{ item.image }}</div>
            <div class="item-details">
              <h3>{{ item.title }}</h3>
              <p class="item-category">{{ item.category }}</p>
              <p class="item-schedule">{{ item.schedule }}</p>
            </div>
          </div>
          
          <div class="item-controls">
            <div class="quantity-control">
              <button @click="decreaseQuantity(item.id)" class="qty-btn">-</button>
              <span class="qty-value">{{ item.quantity }}</span>
              <button @click="increaseQuantity(item.id)" class="qty-btn">+</button>
            </div>
            <div class="item-price">${{ (item.price * item.quantity).toFixed(2) }}</div>
            <button @click="removeItem(item.id)" class="remove-btn">🗑️</button>
          </div>
        </div>
      </div>

      <div class="cart-summary">
        <div class="summary-card">
          <h2>Order Summary</h2>
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
          <router-link to="/checkout" class="btn btn-primary btn-checkout">
            Proceed to Checkout
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCart } from '../store/cart'

const { cart, removeFromCart, updateQuantity, getTotal } = useCart()

const getTax = () => {
  return getTotal() * 0.07
}

const getGrandTotal = () => {
  return getTotal() + getTax()
}

const removeItem = (itemId) => {
  removeFromCart(itemId)
}

const increaseQuantity = (itemId) => {
  const item = cart.items.find(item => item.id === itemId)
  if (item) {
    updateQuantity(itemId, item.quantity + 1)
  }
}

const decreaseQuantity = (itemId) => {
  const item = cart.items.find(item => item.id === itemId)
  if (item) {
    updateQuantity(itemId, item.quantity - 1)
  }
}
</script>

<style scoped>
.cart-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.cart-view h1 {
  font-size: 2.5rem;
  margin-bottom: 30px;
  color: #333;
}

.empty-cart {
  text-align: center;
  padding: 80px 20px;
}

.empty-icon {
  font-size: 5rem;
  margin-bottom: 20px;
}

.empty-cart h2 {
  margin-bottom: 10px;
  color: #333;
}

.empty-cart p {
  color: #666;
  margin-bottom: 30px;
}

.cart-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 30px;
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.cart-item {
  background: white;
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.item-info {
  display: flex;
  gap: 20px;
  flex: 1;
}

.item-emoji {
  font-size: 3rem;
}

.item-details {
  flex: 1;
}

.item-details h3 {
  margin-bottom: 5px;
  color: #333;
  font-size: 1.2rem;
}

.item-category {
  color: #667eea;
  font-weight: 600;
  margin-bottom: 5px;
  font-size: 0.9rem;
}

.item-schedule {
  color: #666;
  font-size: 0.9rem;
}

.item-controls {
  display: flex;
  align-items: center;
  gap: 20px;
}

.quantity-control {
  display: flex;
  align-items: center;
  gap: 15px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  padding: 5px 10px;
}

.qty-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #667eea;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s;
  border-radius: 5px;
}

.qty-btn:hover {
  background: #f0f0f0;
}

.qty-value {
  font-weight: 600;
  min-width: 30px;
  text-align: center;
  color: #333;
}

.item-price {
  font-size: 1.3rem;
  font-weight: 700;
  color: #764ba2;
  min-width: 100px;
}

.remove-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 5px;
  border-radius: 5px;
  transition: background 0.3s;
}

.remove-btn:hover {
  background: #ffe0e0;
}

.cart-summary {
  position: sticky;
  top: 20px;
  height: fit-content;
}

.summary-card {
  background: white;
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.summary-card h2 {
  margin-bottom: 20px;
  color: #333;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}

.summary-row span {
  color: #333;
  font-weight: 500;
}

.summary-row.total {
  font-size: 1.3rem;
  font-weight: 700;
  color: #764ba2;
}

.summary-row.total span {
  color: #764ba2;
}

.summary-divider {
  border-top: 2px solid #e0e0e0;
  margin: 20px 0;
}

.btn-checkout {
  width: 100%;
  margin-top: 20px;
  text-align: center;
  display: block;
}

@media (max-width: 968px) {
  .cart-content {
    grid-template-columns: 1fr;
  }
  
  .cart-item {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .item-controls {
    width: 100%;
    justify-content: space-between;
    margin-top: 20px;
  }
}
</style>

