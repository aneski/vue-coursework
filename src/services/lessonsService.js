import lessonsFallback from '@/data/lessons.json'

const API_BASE_URL = import.meta.env.VITE_API_URL

function cloneLessons(list = []) {
  return list.map((lesson) => ({ ...lesson }))
}

export async function getLessons() {
  if (API_BASE_URL) {
    try {
      const response = await fetch(`${API_BASE_URL.replace(/\/$/, '')}/lessons`)
      if (!response.ok) {
        throw new Error(`Lessons request failed with status ${response.status}`)
      }

      const payload = await response.json()
      if (Array.isArray(payload) && payload.length) {
        return cloneLessons(payload)
      }
    } catch (error) {
      console.warn('[lessonsService] Falling back to local JSON data:', error)
    }
  }

  return cloneLessons(lessonsFallback)
}
