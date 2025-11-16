<template>
  <section class="checkout-panel">
    <header>
      <div>
        <p class="eyebrow">Checkout</p>
        <h3>Secure your calm</h3>
        <p class="subtitle">
          We will sync these details with the backend as soon as it is online.
        </p>
      </div>
      <span class="tag" :class="{ 'tag--disabled': disabled }">
        {{ disabled ? 'Cart empty' : 'Ready' }}
      </span>
    </header>

    <form class="checkout-form" @submit.prevent="submit">
      <label>
        <span>Guardian name</span>
        <input
          type="text"
          v-model.trim="form.name"
          placeholder="Avery Daniels"
          :disabled="disabled"
          required
        />
      </label>

      <label>
        <span>Email</span>
        <input
          type="email"
          v-model.trim="form.email"
          placeholder="hello@email.com"
          :disabled="disabled"
        />
      </label>

      <label>
        <span>Phone</span>
        <input
          type="tel"
          v-model.trim="form.phone"
          placeholder="(555) 123-4567"
          :disabled="disabled"
          required
        />
      </label>

      <button class="btn btn-primary" type="submit" :disabled="disabled || !isValid">
        Checkout
      </button>
    </form>
  </section>
</template>

<script setup>
import { computed, reactive, watch } from 'vue'

const props = defineProps({
  disabled: {
    type: Boolean,
    default: false
  },
  initialInfo: {
    type: Object,
    default: () => ({
      name: '',
      email: '',
      phone: ''
    })
  }
})

const emit = defineEmits(['submit'])

const form = reactive({
  name: props.initialInfo.name,
  email: props.initialInfo.email,
  phone: props.initialInfo.phone
})

watch(
  () => props.initialInfo,
  (next) => {
    form.name = next.name
    form.email = next.email
    form.phone = next.phone
  },
  { deep: true }
)

const namePattern = /^[A-Za-z\s]+$/
const phonePattern = /^[0-9]+$/

const isValid = computed(() => {
  const name = form.name.trim()
  const phone = form.phone.trim()
  const nameOk = namePattern.test(name)
  const phoneOk = phonePattern.test(phone)
  return nameOk && phoneOk
})

function submit() {
  if (props.disabled || !isValid.value) return
  emit('submit', { ...form })
}
</script>

<style scoped>
.checkout-panel {
  background: #f8fafc;
  border-radius: 24px;
  padding: 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  border: 1px solid rgba(15, 23, 42, 0.08);
}

header {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: flex-start;
}

h3 {
  margin: 0.25rem 0;
}

.tag {
  border-radius: 999px;
  padding: 0.35rem 0.9rem;
  font-size: 0.85rem;
  background: #10b981;
  color: white;
}

.tag--disabled {
  background: #94a3b8;
}

.checkout-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

label {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  font-weight: 600;
  color: #0f172a;
}

input {
  border-radius: 12px;
  border: 1px solid rgba(15, 23, 42, 0.15);
  padding: 0.85rem 1rem;
  font-size: 1rem;
}

input:disabled {
  background: #e2e8f0;
}

@media (max-width: 768px) {
  .checkout-panel {
    padding: 1.25rem;
  }
}
</style>
