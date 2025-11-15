<template>
  <div class="classes-view">
    <div class="header-section">
      <h1>Browse Classes</h1>
      <div class="controls">
        <div class="search-box">
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Search classes..." 
            class="search-input"
          />
        </div>
        <div class="filter-box">
          <select v-model="selectedCategory" class="category-filter">
            <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
          </select>
        </div>
      </div>
    </div>

    <div class="classes-grid">
      <div v-for="classItem in filteredClasses" :key="classItem.id" class="class-card-detailed">
        <div class="class-header">
          <div class="class-emoji-large">{{ classItem.image }}</div>
          <div class="class-info">
            <h3>{{ classItem.title }}</h3>
            <span class="category-badge">{{ classItem.category }}</span>
          </div>
        </div>
        
        <p class="class-description">{{ classItem.description }}</p>
        
        <div class="class-details">
          <div class="detail-item">
            <span class="detail-label">👤 Instructor:</span>
            <span class="dyn-detail-label" >{{ classItem.instructor }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">🎂 Age Range:</span>
            <span class="dyn-detail-label" >{{ classItem.ageRange }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">📅 Schedule:</span>
            <span class="dyn-detail-label" >{{ classItem.schedule }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">⏱️ Duration:</span>
            <span class="dyn-detail-label" >{{ classItem.duration }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">👥 Spots:</span>
            <span class="dyn-detail-label" >{{ classItem.enrolled }}/{{ classItem.capacity }}</span>
          </div>
        </div>
        
        <div class="class-footer">
          <div class="price-large">${{ classItem.price.toFixed(2) }}</div>
          <button @click="addToCart(classItem)" class="btn btn-primary" :disabled="classItem.enrolled >= classItem.capacity">
            {{ classItem.enrolled >= classItem.capacity ? 'Full' : 'Add to Cart' }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="filteredClasses.length === 0" class="no-results">
      <p>No classes found matching your criteria.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { classes, categories } from '../data/classes'
import { useCart } from '../store/cart'

const searchQuery = ref('')
const selectedCategory = ref('All')
const { addToCart } = useCart()

const filteredClasses = computed(() => {
  let result = classes.filter(cls => {
    const matchesSearch = cls.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                          cls.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesCategory = selectedCategory.value === 'All' || cls.category === selectedCategory.value
    return matchesSearch && matchesCategory
  })
  return result
})
</script>

<style scoped>
.classes-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.header-section {
  margin-bottom: 40px;
}

.header-section h1 {
  font-size: 2.5rem;
  margin-bottom: 30px;
  color: #333;
}

.dyn-detail-label {
  font-size: 1rem;
  color: #333;
  font-weight: 500;
}

.controls {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.search-box {
  flex: 1;
  min-width: 250px;
}

.search-input {
  width: 100%;
  padding: 12px 20px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
}

.filter-box {
  min-width: 200px;
}

.category-filter {
  width: 100%;
  padding: 12px 20px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 1rem;
  background: white;
  cursor: pointer;
  transition: border-color 0.3s;
}

.category-filter:focus {
  outline: none;
  border-color: #667eea;
}

.classes-grid {
  display: grid;
  gap: 30px;
}

.class-card-detailed {
  background: white;
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}

.class-card-detailed:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
}

.class-header {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.class-emoji-large {
  font-size: 4rem;
  flex-shrink: 0;
}

.class-info {
  flex: 1;
}

.class-info h3 {
  margin-bottom: 10px;
  color: #333;
  font-size: 1.5rem;
}

.category-badge {
  display: inline-block;
  padding: 5px 15px;
  background: #667eea;
  color: white;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
}

.class-description {
  color: #666;
  margin-bottom: 20px;
  line-height: 1.6;
}

.class-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-bottom: 25px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 10px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.detail-label {
  font-weight: 600;
  color: #667eea;
  font-size: 0.9rem;
}

.class-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 20px;
  border-top: 2px solid #e0e0e0;
}

.price-large {
  font-size: 2rem;
  font-weight: 700;
  color: #764ba2;
}

.no-results {
  text-align: center;
  padding: 60px 20px;
  color: #999;
  font-size: 1.2rem;
}

@media (max-width: 768px) {
  .controls {
    flex-direction: column;
  }
  
  .search-input,
  .category-filter {
    width: 100%;
  }
  
  .class-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .class-footer {
    flex-direction: column;
    gap: 15px;
  }
  
  .price-large {
    font-size: 1.5rem;
  }
}
</style>

