<template>
  <section class="cart-panel">
    <header>
      <div>
        <p class="eyebrow">Your mini cart</p>
        <h3>Reservations ({{ totalCount }})</h3>
      </div>
      <button
        class="btn btn-link"
        :disabled="!items.length"
        @click="$emit('clear')"
      >
        Clear all
      </button>
    </header>

    <p v-if="!items.length" class="cart-panel__empty">
      Add a lesson to start building a calmer schedule.
    </p>

    <ul v-else class="cart-panel__list">
      <li v-for="item in items" :key="item.key" class="cart-item">
        <div>
          <p class="cart-item__title">
            {{ item.subject }}
            <span class="cart-item__price">$ {{ item.price }}</span>
          </p>
          <p class="cart-item__meta">
            {{ item.location }} • {{ item.spaces - item.quantity }} spots left
          </p>
        </div>
        <div class="cart-item__actions">
          <button
            class="pill"
            :disabled="item.quantity <= 1"
            @click="emitQuantity(item, item.quantity - 1)"
          >
            −
          </button>
          <span class="cart-item__qty" aria-live="polite">{{ item.quantity }}</span>
          <button
            class="pill"
            :disabled="item.quantity >= item.spaces"
            @click="emitQuantity(item, item.quantity + 1)"
          >
            +
          </button>
          <button class="pill pill--ghost" @click="$emit('remove', item.key)">Remove</button>
        </div>
      </li>
    </ul>
  </section>
</template>

<script setup>
const props = defineProps({
  items: {
    type: Array,
    default: () => []
  },
  totalCount: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['change-quantity', 'remove', 'clear'])

function emitQuantity(item, nextQuantity) {
  emit('change-quantity', {
    key: item.key,
    quantity: nextQuantity,
    limit: item.spaces
  })
}
</script>

<style scoped>
.cart-panel {
  background: #0f172a;
  color: white;
  border-radius: 24px;
  padding: 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
}

header h3 {
  margin: 0.4rem 0 0;
}

.btn-link {
  background: transparent;
  color: rgba(255, 255, 255, 0.8);
  padding: 0;
  text-decoration: underline;
}

.btn-link:disabled {
  opacity: 0.3;
  text-decoration: none;
}

.cart-panel__empty {
  margin: 0;
  background: rgba(255, 255, 255, 0.08);
  padding: 1rem;
  border-radius: 16px;
}

.cart-panel__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.cart-item {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
}

.cart-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.cart-item__title {
  margin: 0;
  font-weight: 600;
}

.cart-item__price {
  margin-left: 0.4rem;
  font-weight: 500;
  color: rgba(248, 250, 252, 0.9);
}

.cart-item__meta {
  margin: 0.15rem 0 0;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
}

.cart-item__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
}

.pill {
  border: none;
  background: rgba(255, 255, 255, 0.15);
  color: white;
  border-radius: 999px;
  padding: 0.35rem 0.85rem;
  cursor: pointer;
}

.pill:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.pill--ghost {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.cart-item__qty {
  min-width: 32px;
  text-align: center;
  font-weight: 600;
}

@media (max-width: 768px) {
  .cart-panel {
    padding: 1.25rem;
  }
}
</style>
