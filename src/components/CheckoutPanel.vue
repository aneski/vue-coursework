<template>
  <!-- CheckoutPanel: Collects guardian contact info and emits checkout data.
       - Shows a disabled state when the cart is empty.
       - Pre-fills form fields if initialInfo prop is provided.
       - Validates name (letters only) and phone (digits only).
       - Emits submit with form data on valid submission.
       - Email is optional but included for completeness.
  -->
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

// Props: disabled flag (e.g., empty cart), initialInfo to pre-fill form
// - disabled: When true, all inputs and the submit button are disabled.
// - initialInfo: Object with {name, email, phone} to pre-populate the form.
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

// Emit submit event with form data to parent
// Payload: {name, email, phone} (trimmed strings).
const emit = defineEmits(['submit'])

// Reactive form bound to inputs; initialized from initialInfo prop
// Updates in real time as user types; parent can reset via initialInfo changes.
const form = reactive({
  name: props.initialInfo.name,
  email: props.initialInfo.email,
  phone: props.initialInfo.phone
})

// Sync form if parent updates initialInfo after mount
// Ensures the form stays in sync if parent clears or changes info post-render.
watch(
  () => props.initialInfo,
  (next) => {
    form.name = next.name
    form.email = next.email
    form.phone = next.phone
  },
  { deep: true }
)

// Simple validation patterns: name (letters only), phone (digits only)
// Email is optional; basic HTML5 email type provides browser validation.
const namePattern = /^[A-Za-z\s]+$/
const phonePattern = /^[0-9]+$/

// Computed validation state; submit is disabled if invalid
// Name must contain only letters and spaces; phone must be digits only.
const isValid = computed(() => {
  const name = form.name.trim()
  const phone = form.phone.trim()
  const nameOk = namePattern.test(name)
  const phoneOk = phonePattern.test(phone)
  return nameOk && phoneOk
})

// Emit form data to parent on submit if valid and not disabled
// Trims values before emission; parent handles further validation/saving.
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
