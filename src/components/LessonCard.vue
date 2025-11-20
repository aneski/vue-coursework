<template>
  <!-- LessonCard: Displays a single lesson with image, details, and reserve button.
       - Shows lesson image in a styled badge; gracefully handles missing images.
       - Displays subject, location, price, and total spaces.
       - Indicates availability with a colored dot and spots left text.
       - Shows how many spaces are already reserved (if any).
       - Disables the reserve button when no spots remain.
       - Emits 'reserve' with the full lesson object on button click.
  -->
  <article class="lesson-card">
    <div class="lesson-card__badge" aria-hidden="true">
      <img :src="imageSrc" :alt="`${lesson.subject} image`" />
    </div>

    <div class="lesson-card__body">
      <header>
        <h3>{{ lesson.subject }}</h3>
      </header>
      <ul class="lesson-card__details">
        <li>Subject: {{ lesson.subject }}</li>
        <li>Location: {{ lesson.location }}</li>
        <li>Price: £{{ lesson.price }}</li>
        <li>Spaces: {{ lesson.spaces }}</li>
      </ul>
      <footer>
        <div class="lesson-card__availability">
          <span :class="['dot', seatsLeft === 0 ? 'dot--full' : 'dot--open']"></span>
          <span v-if="seatsLeft > 0">{{ seatsLeft }} spots left</span>
          <span v-else>Fully booked</span>
          <span v-if="reserved" class="lesson-card__reserved">Reserved: {{ reserved }}</span>
        </div>
        <button
          class="btn btn-primary"
          :disabled="seatsLeft === 0"
          @click="$emit('reserve', lesson)"
        >
          Add to cart
        </button>
      </footer>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue'

// Props: lesson object, reserved count (how many are already in cart)
// - lesson: Must include at least {subject, location, price, spaces, image}.
// - reserved: Number of spaces already in cart; used to compute remaining seats.
const props = defineProps({
  lesson: {
    type: Object,
    required: true
  },
  reserved: {
    type: Number,
    default: 0
  }
})

// Compute image src: handle full URLs, root-relative, or local asset paths
// 1) If image is a full HTTP(S) URL or starts with '/', use it as-is.
// 2) Otherwise, resolve relative to the component's module URL (Vite asset handling).
// Returns empty string on failure to avoid broken image UI.
const imageSrc = computed(() => {
  const raw = props.lesson.image
  if (!raw) return ''

  const apiUrl = import.meta.env.VITE_API_URL && import.meta.env.VITE_API_URL.trim()

  if (typeof raw === 'string') {
    if (raw.startsWith('http://') || raw.startsWith('https://')) {
      return raw
    }

    if (raw.startsWith('/images/')) {
      if (apiUrl) {
        const base = apiUrl.replace(/\/$/, '')
        return `${base}${raw}`
      }
      return raw
    }
  }

  try {
    return new URL(raw, import.meta.url).href
  } catch (e) {
    return ''
  }
})

// Compute remaining seats, never negative
// Uses lesson.spaces (total) minus reserved count (in cart).
// If lesson.spaces is missing/undefined, treats it as 0.
const seatsLeft = computed(() => {
  const remaining = (props.lesson.spaces ?? 0) - props.reserved
  return remaining > 0 ? remaining : 0
})
</script>

<style scoped>
.lesson-card {
  display: grid;
  grid-template-columns: 72px 1fr;
  gap: 1.25rem;
  padding: 1.5rem;
  border-radius: 1.5rem;
  background: #fff;
  box-shadow: 0 25px 60px rgba(15, 23, 42, 0.08);
  border: 1px solid rgba(15, 23, 42, 0.04);
}

.lesson-card__badge {
  width: 72px;
  height: 72px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #fce7f3, #ede9fe);
}

.lesson-card__badge img {
  width: 52px;
  height: 52px;
  object-fit: cover;
  border-radius: 16px;
}

.lesson-card__body header h3 {
  margin: 0.15rem 0 0.5rem;
  font-size: 1.25rem;
  color: #111827;
}

.lesson-card__eyebrow {
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.12em;
  color: #6b7280;
  margin: 0;
}

.lesson-card__description {
  margin: 0 0 1.25rem;
  color: #4b5563;
}

.lesson-card__details {
  list-style: none;
  margin: 0 0 1.25rem;
  padding: 0;
  color: #111827;
  line-height: 1.5;
}

.lesson-card__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 1rem;
  font-weight: 600;
}

.lesson-card__price {
  color: #7c3aed;
}

.lesson-card__total {
  color: #475569;
}

.lesson-card__availability {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  color: #374151;
  font-weight: 600;
}

.lesson-card__reserved {
  color: #7c3aed;
}

.lesson-card footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  display: inline-block;
}

.dot--open {
  background: #10b981;
}

.dot--full {
  background: #ef4444;
}

@media (max-width: 640px) {
  .lesson-card {
    grid-template-columns: 1fr;
  }

  .lesson-card__badge {
    width: 64px;
    height: 64px;
  }
}
</style>
