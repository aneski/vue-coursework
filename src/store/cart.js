import { reactive } from 'vue'

const cart = reactive({
  items: [],
  userInfo: {
    name: '',
    email: '',
    phone: ''
  }
})

function findItem(itemKey) {
  return cart.items.find(item => item.key === itemKey)
}

export function useCart() {
  const addToCart = (lesson) => {
    const existingItem = findItem(lesson.key)
    if (existingItem) {
      if (existingItem.quantity < lesson.spaces) {
        existingItem.quantity += 1
      }
    } else {
      cart.items.push({ ...lesson, quantity: 1 })
    }
  }

  const removeFromCart = (itemKey) => {
    const index = cart.items.findIndex(item => item.key === itemKey)
    if (index > -1) {
      cart.items.splice(index, 1)
    }
  }

  const updateQuantity = (itemKey, quantity, limit) => {
    const item = findItem(itemKey)
    if (!item) return

    if (quantity <= 0) {
      removeFromCart(itemKey)
    } else {
      const max = limit ?? item.spaces ?? quantity
      item.quantity = Math.min(quantity, max)
    }
  }

  const clearCart = () => {
    cart.items.splice(0, cart.items.length)
  }

  const getCartCount = () => {
    return cart.items.reduce((count, item) => count + item.quantity, 0)
  }

  const getCartTotal = () => {
    return cart.items.reduce((sum, item) => {
      const price = Number(item.price) || 0
      const quantity = Number(item.quantity) || 0
      return sum + price * quantity
    }, 0)
  }

  const getLessonReservation = (lessonKey) => {
    const item = findItem(lessonKey)
    return item ? item.quantity : 0
  }

  const setUserInfo = (info) => {
    cart.userInfo = { ...info }
  }

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartCount,
    getLessonReservation,
    getCartTotal,
    setUserInfo
  }
}
