<template>
  <!-- LessonList: Renders a searchable, sortable grid of lesson cards.
       - Shows header with description and controls for search/sort.
       - Displays skeleton placeholders while loading.
       - Shows error message if backend request fails.
       - Shows 'all full' message if no lessons match filters.
       - For each lesson, renders LessonCard with reserved count and reserve handler.
       - Emits search-change as user types (for optional backend search).
  -->
  <section class="lesson-list">
    <header class="lesson-list__header">
      <div>
        <p class="eyebrow">After-School Picks</p>
        <h2>Hand-picked sessions for calmer afternoons</h2>
        <p class="subtitle">
          Reserve a spot now and we will sync the details once the backend goes live.
        </p>
      </div>
      <div class="lesson-list__controls">
        <label class="lesson-list__search">
          <span>Search</span>
          <input
            type="search"
            v-model.trim="searchQuery"
            placeholder="Search by subject or location"
          />
        </label>
        <label>
          <span>Sort by</span>
          <select :value="sortKeyModel" @change="$emit('update:sortKey', $event.target.value)">
            <option value="subject">Subject</option>
            <option value="location">Location</option>
            <option value="price">Price</option>
            <option value="spaces">Spaces</option>
          </select>
        </label>
        <label>
          <span>Order</span>
          <select :value="sortOrderModel" @change="$emit('update:sortOrder', $event.target.value)">
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </label>
      </div>
    </header>

    <div v-if="loading" class="lesson-list__skeletons">
      <div v-for="n in 6" :key="n" class="lesson-list__skeleton"></div>
    </div>

    <p v-else-if="error" class="lesson-list__state lesson-list__state--error">
      {{ error }}
    </p>

    <p v-else-if="!filteredLessons.length" class="lesson-list__state">
      All sessions are full right now. Check back soon.
    </p>

    <div v-else class="lesson-list__grid">
      <LessonCard
        v-for="lesson in filteredLessons"
        :key="lesson.key"
        :lesson="lesson"
        :reserved="getReserved(lesson.key)"
        @reserve="$emit('reserve', lesson)"
      />
    </div>
  </section>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import LessonCard from './LessonCard.vue'

// Props: lessons array, loading/error flags, reservations map, sort key/order
// - lessons: Array of lesson objects to display.
// - loading: When true, show skeleton UI instead of real lessons.
// - error: Error message string; if truthy, show error state.
// - reservations: Map {lessonKey: quantity} indicating how many spaces are in cart.
// - sortKey/sortOrder: Current sort field and direction; controlled by parent.
const props = defineProps({
  lessons: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  },
  reservations: {
    type: Object,
    default: () => ({})
  },
  sortKey: {
    type: String,
    default: 'subject'
  },
  sortOrder: {
    type: String,
    default: 'asc'
  }
})

// Emit events to parent: reserve, update:sortKey, update:sortOrder, search-change
// - reserve: Payload is the lesson object the user wants to add to cart.
// - update:sortKey/update:sortOrder: New values for v-model bindings.
// - search-change: Emitted as user types (debounced by parent if needed).
const emit = defineEmits(['reserve', 'update:sortKey', 'update:sortOrder', 'search-change'])

// Local search query used to filter the lessons list on the client.
// Mirrors input value; changes trigger search-change emission for optional backend search.
const searchQuery = ref('')

// When searchQuery changes, emit to parent for optional backend search
// Parent may choose to debounce and perform a backend search or ignore.
watch(searchQuery, (value) => {
  emit('search-change', value)
})

// Client-side filter by subject or location (case-insensitive)
// If query is empty, returns unsorted lessons list (parent handles sorting).
// Otherwise, filters on subject or location containing the query substring.
const filteredLessons = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  if (!query) {
    return props.lessons
  }

  return props.lessons.filter((lesson) => {
    const subject = String(lesson.subject ?? '').toLowerCase()
    const location = String(lesson.location ?? '').toLowerCase()
    return subject.includes(query) || location.includes(query)
  })
})

// Get reserved count for a lesson key from the reservations map
// Returns 0 if lessonKey not found (no spaces in cart).
const getReserved = (lessonKey) => props.reservations[lessonKey] ?? 0

// Computed refs for v-model bindings on sort controls
// Allows parent to control sort state via v-model.
const sortKeyModel = computed(() => props.sortKey)
const sortOrderModel = computed(() => props.sortOrder)
</script>

<style scoped>
.lesson-list {
  background: rgba(255, 255, 255, 0.92);
  border-radius: 32px;
  padding: 2.5rem;
  box-shadow: 0 35px 80px rgba(15, 23, 42, 0.08);
  border: 1px solid rgba(15, 23, 42, 0.04);
}

.lesson-list__header {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.lesson-list__header h2 {
  margin: 0.25rem 0 0.75rem;
  font-size: clamp(1.75rem, 3vw, 2.25rem);
  color: #0f172a;
}

.subtitle {
  margin: 0;
  color: #475569;
}

.lesson-list__controls {
  display: flex;
  gap: 1rem;
  background: #f8fafc;
  padding: 1rem 1.25rem;
  border-radius: 20px;
  border: 1px solid rgba(15, 23, 42, 0.07);
  justify-content: center;
  align-items: center;
}

.lesson-list__controls label {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: #0f172a;
}

.lesson-list__controls select {
  border-radius: 12px;
  border: 1px solid rgba(15, 23, 42, 0.15);
  padding: 0.5rem 0.85rem;
  font-size: 0.95rem;
}

.lesson-list__search input {
  border-radius: 12px;
  border: 1px solid rgba(15, 23, 42, 0.15);
  padding: 0.5rem 0.85rem;
  font-size: 0.95rem;
}

.lesson-list__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.25rem;
}

.lesson-list__skeletons {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}

.lesson-list__skeleton {
  height: 220px;
  border-radius: 24px;
  background: linear-gradient(120deg, #f4f4f5 0%, #ede9fe 100%);
  animation: shimmer 1.8s infinite;
}

.lesson-list__state {
  margin: 1.5rem 0;
  padding: 1rem 1.5rem;
  border-radius: 1rem;
  background: #ecfccb;
  color: #1a2e05;
  font-weight: 600;
}

.lesson-list__state--error {
  background: #fee2e2;
  color: #7f1d1d;
}

@keyframes shimmer {
  0% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.6;
  }
}

@media (max-width: 768px) {
  .lesson-list {
    padding: 1.75rem;
  }

  .lesson-list__controls {
    width: 100%;
    flex-direction: column;
  }
}
</style>
