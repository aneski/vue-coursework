import { reactive } from 'vue'

// Simple reactive cart store
const cart = reactive({
  items: [],
  userInfo: null
})

export function useCart() {
  const addToCart = (classItem) => {
    const existingItem = cart.items.find(item => item.id === classItem.id)
    if (existingItem) {
      existingItem.quantity += 1
    } else {
      cart.items.push({ ...classItem, quantity: 1 })
    }
  }

  const removeFromCart = (itemId) => {
    const index = cart.items.findIndex(item => item.id === itemId)
    if (index > -1) {
      cart.items.splice(index, 1)
    }
  }

  const updateQuantity = (itemId, quantity) => {
    const item = cart.items.find(item => item.id === itemId)
    if (item) {
      if (quantity <= 0) {
        removeFromCart(itemId)
      } else {
        item.quantity = quantity
      }
    }
  }

  const getTotal = () => {
    return cart.items.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const clearCart = () => {
    cart.items = []
  }

  const getCartCount = () => {
    return cart.items.reduce((count, item) => count + item.quantity, 0)
  }

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    getTotal,
    clearCart,
    getCartCount
  }
}

