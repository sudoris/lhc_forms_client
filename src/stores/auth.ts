import { ref } from 'vue'
import { defineStore } from 'pinia'
import api from '@/api/index.js'

export const useAuthStore = defineStore('authStore', () => {
  const isAuthenticated = ref(false)
})