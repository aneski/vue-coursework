<script setup>
import { computed, ref, watch, onMounted } from 'vue'
import LessonList from './components/LessonList.vue'
import CartPanel from './components/CartPanel.vue'
import CheckoutPanel from './components/CheckoutPanel.vue'
import lessonsData from './data/lessons.json'
import { useCart } from './store/cart'

const toSlug = (value) => {
  return String(value ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const makeLessonKey = (lesson, index = 0) => {
  const subjectSlug = toSlug(lesson.subject)
  const locationSlug = toSlug(lesson.location)
  const composite = [subjectSlug, locationSlug].filter(Boolean).join('-')
  return composite || `lesson-${index}`
}

// Attach a stable key to each lesson so the cart can reference lessons reliably.
const normalizeLessons = (source) =>
  source.map((lesson, index) => ({ ...lesson, key: makeLessonKey(lesson, index) }))

const lessons = ref(normalizeLessons(lessonsData))
const loading = ref(false)
const error = ref('')
const reservationSaved = ref(false)

const sortKey = ref('subject')
const sortOrder = ref('asc')
const cartOpen = ref(false)

const { cart, addToCart, updateQuantity, removeFromCart, clearCart, getCartCount, getCartTotal, setUserInfo } = useCart()

const reservationsMap = computed(() => {
  return cart.items.reduce((acc, item) => {
    acc[item.key] = item.quantity
    return acc
  }, {})
})

// When USE_REMOTE is true and API_URL is set, lessons are loaded from the Express backend.
// Otherwise the app falls back to the bundled JSON in src/data/lessons.json.
const USE_REMOTE = import.meta.env.VITE_ENABLE_REMOTE === 'true'
const API_URL = import.meta.env.VITE_API_URL?.trim()

const searchTerm = ref('')

async function fetchLessonsFromServer(query = '') {
  const base = API_URL?.replace(/\/$/, '')
  if (!base) return

  loading.value = true
  error.value = ''

  try {
    const url = query
      ? `${base}/search?q=${encodeURIComponent(query)}`
      : `${base}/lessons`

    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Lessons request failed with status ${response.status}`)
    }

    const payload = await response.json()
    if (Array.isArray(payload)) {
      lessons.value = normalizeLessons(payload)
    }
  } catch (err) {
    console.warn('[App] Backend request failed, falling back to local lessons.json:', err)
    error.value = 'Unable to load lessons from the server. Showing local lessons instead.'
    lessons.value = normalizeLessons(lessonsData)
  } finally {
    loading.value = false
  }
}

const displayLessons = computed(() => {
  const key = sortKey.value
  const direction = sortOrder.value === 'asc' ? 1 : -1
  return [...lessons.value].sort((a, b) => {
    const valueA = a[key]
    const valueB = b[key]
    if (typeof valueA === 'string') {
      return valueA.localeCompare(valueB) * direction
    }
    return (valueA - valueB) * direction
  })
})

const cartCount = computed(() => getCartCount())
const cartTotal = computed(() => getCartTotal())
const hasItems = computed(() => cart.items.length > 0)

function handleReserve(lesson) {
  addToCart(lesson)
  reservationSaved.value = false
}

function handleQuantityChange({ key, quantity, limit }) {
  updateQuantity(key, quantity, limit)
}

function handleRemove(key) {
  removeFromCart(key)
}

function handleClear() {
  clearCart()
  reservationSaved.value = false
}

async function handleCheckout(info) {
  setUserInfo(info)
  reservationSaved.value = false

  // Local-only mode: act as before without calling the backend.
  if (!USE_REMOTE || !API_URL) {
    reservationSaved.value = true
    return
  }

  const base = API_URL.replace(/\/$/, '')

  const itemsPayload = cart.items
    .filter((item) => item.id)
    .map((item) => ({
      lessonId: item.id,
      spaces: item.quantity
    }))

  if (!itemsPayload.length) {
    // No backend IDs available; fall back to local-only behaviour.
    reservationSaved.value = true
    return
  }

  try {
    const orderResponse = await fetch(`${base}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: info.name,
        email: info.email,
        phone: info.phone,
        items: itemsPayload
      })
    })

    if (!orderResponse.ok) {
      throw new Error(`Order request failed with status ${orderResponse.status}`)
    }

    // Update lesson spaces locally and on the backend.
    for (const item of cart.items) {
      const index = lessons.value.findIndex((lesson) => lesson.key === item.key)
      if (index === -1) continue

      const lesson = lessons.value[index]
      const currentSpaces = Number(lesson.spaces ?? 0)
      const newSpaces = Math.max(0, currentSpaces - item.quantity)

      lessons.value[index] = { ...lesson, spaces: newSpaces }

      if (lesson.id) {
        await fetch(`${base}/lessons/${lesson.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ spaces: newSpaces })
        })
      }
    }

    reservationSaved.value = true
  } catch (err) {
    console.error('[App] Checkout failed:', err)
    error.value = 'Order could not be saved to the server. Your cart is still available.'
  }
}

function toggleCart() {
  if (!hasItems.value) return
  cartOpen.value = !cartOpen.value
}

function closeCart() {
  cartOpen.value = false
}

function handleSearchChange(value) {
  searchTerm.value = value

  if (!USE_REMOTE || !API_URL) {
    // Local mode keeps using the built-in client-side filter in LessonList.
    return
  }

  // Fire a backend search as the user types.
  fetchLessonsFromServer(value)
}

function dismissSuccess() {
  reservationSaved.value = false
}

watch(hasItems, (next) => {
  if (!next) {
    cartOpen.value = false
  }
})

onMounted(async () => {
  if (!USE_REMOTE || !API_URL) {
    // Local JSON only; no loading state needed
    loading.value = false
    return
  }

  await fetchLessonsFromServer('')
})
</script>

<template>
  <div class="page">
    <div class="background-glow" aria-hidden="true"></div>

    <header class="hero">
      <p class="eyebrow">After-School Coursework</p>
      <h1>Curated sessions for calm afternoons</h1>
      <p class="subtitle">Plan lessons now. The backend sync will arrive soon.</p>

      <div class="hero__actions">
        <button
          class="cart-toggle"
          :class="{ 'cart-toggle--disabled': !hasItems }"
          :disabled="!hasItems"
          @click="toggleCart"
        >
          <span>Cart</span>
          <span class="cart-toggle__count">{{ cartCount }}</span>
        </button>
      </div>
    </header>

    <section class="banner">
      <p>
        Browse 10 curated lessons, reserve up to 5 spaces per session, then sync with the backend when it is live.
      </p>
    </section>

    <main class="layout">
      <LessonList
        :lessons="displayLessons"
        :loading="loading"
        :error="error"
        :reservations="reservationsMap"
        v-model:sortKey="sortKey"
        v-model:sortOrder="sortOrder"
        @search-change="handleSearchChange"
        @reserve="handleReserve"
      />
    </main>

    <transition name="drawer">
      <div v-if="cartOpen" class="drawer" role="dialog" aria-label="Shopping cart">
        <div class="drawer__overlay" @click="closeCart"></div>
        <aside class="drawer__panel">
          <div class="drawer__header">
            <div>
              <p class="eyebrow">Reservations</p>
              <h3>Lesson cart</h3>
            </div>
            <button class="drawer__close" @click="closeCart">Close</button>
          </div>

          <CartPanel
            :items="cart.items"
            :total-count="cartCount"
            :total-price="cartTotal"
            @change-quantity="handleQuantityChange"
            @remove="handleRemove"
            @clear="handleClear"
          />

          <CheckoutPanel
            :disabled="!hasItems"
            :initial-info="cart.userInfo"
            @submit="handleCheckout"
          />

          <div v-if="reservationSaved" class="toast" role="dialog" aria-label="Checkout successful">
            <h4>Checkout successful</h4>
            <p>Your reservation has been saved. We'll sync it with the backend shortly.</p>
            <button type="button" @click="dismissSuccess">Close</button>
          </div>
        </aside>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.page {
  min-height: 100vh;
  padding: 3rem 1.5rem 4rem;
  background: linear-gradient(135deg, #eef2ff, #fef3c7);
}

.background-glow {
  position: fixed;
  inset: 0;
  background: radial-gradient(circle at 20% 20%, rgba(244, 114, 182, 0.25), transparent 55%),
    radial-gradient(circle at 80% 0%, rgba(59, 130, 246, 0.25), transparent 45%),
    radial-gradient(circle at 50% 90%, rgba(16, 185, 129, 0.2), transparent 40%);
  z-index: 0;
}

.hero {
  position: relative;
  z-index: 1;
  max-width: 960px;
  margin: 0 auto 2.5rem;
  text-align: center;
}

.hero h1 {
  font-size: clamp(2.4rem, 4vw, 3.2rem);
  margin: 0.5rem 0 0.75rem;
  color: #0f172a;
}

.hero__actions {
  margin-top: 1.75rem;
  display: flex;
  justify-content: center;
}

.cart-toggle {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  border: none;
  border-radius: 999px;
  padding: 0.85rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  background: #0f172a;
  color: white;
  box-shadow: 0 15px 35px rgba(15, 23, 42, 0.25);
  cursor: pointer;
}

.cart-toggle--disabled {
  background: #94a3b8;
  box-shadow: none;
}

.cart-toggle__count {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 999px;
  padding: 0.15rem 0.9rem;
}

.subtitle {
  color: #334155;
}

.layout {
  position: relative;
  z-index: 1;
  max-width: 1200px;
  margin: 0 auto;
}

.banner {
  position: relative;
  z-index: 1;
  max-width: 960px;
  margin: 0 auto 1.75rem;
  padding: 0.85rem 1.5rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.08);
  text-align: center;
  color: #0f172a;
  font-weight: 500;
}

.toast {
  margin: 1rem 0 0;
  padding: 1rem 1.25rem;
  border-radius: 16px;
  background: #ecfccb;
  color: #166534;
  font-weight: 600;
  box-shadow: 0 15px 30px rgba(22, 101, 52, 0.15);
}

.toast h4 {
  margin: 0 0 0.25rem;
  font-size: 0.95rem;
}

.toast p {
  margin: 0 0 0.75rem;
  font-weight: 400;
}

.toast button {
  border: none;
  border-radius: 999px;
  padding: 0.45rem 1rem;
  font-size: 0.9rem;
  font-weight: 600;
  background: #166534;
  color: #f9fafb;
  cursor: pointer;
}

.drawer-enter-active,
.drawer-leave-active {
  transition: opacity 0.25s ease;
}

.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
}

.drawer {
  position: fixed;
  inset: 0;
  z-index: 20;
}

.drawer__overlay {
  position: absolute;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
}

.drawer__panel {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: min(420px, 100%);
  background: #f8fafc;
  padding: 2rem 1.5rem;
  box-shadow: -20px 0 50px rgba(15, 23, 42, 0.2);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.drawer__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
}

.drawer__close {
  border: none;
  background: transparent;
  font-weight: 600;
  cursor: pointer;
  color: #0f172a;
}

@media (max-width: 640px) {
  .page {
    padding: 2rem 1rem 3rem;
  }
}

function dismissSuccess() {
  reservationSaved.value = false
}
</style>
