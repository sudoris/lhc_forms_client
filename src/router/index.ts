import { createRouter, createWebHistory } from 'vue-router'
import DashBoard from '@/pages/DashBoard.vue'
import LForm from '@/components/lforms/LForm.vue'
import { useLFormStore } from '@/stores/lform'

const loadFhirQuestionnaires = async () => {
  const lFormStore = useLFormStore()

  await lFormStore.loadFhirQuestionnaires()

  return true
}

const loadQuestionnaireResponses = async () => {
  const lFormStore = useLFormStore()

  await lFormStore.loadQuestionnaireResponses()

  // If nothing, undefined or true is returned, the navigation is validated, and the next navigation guard is called.
  return true
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: DashBoard,
      beforeEnter: [loadQuestionnaireResponses]
    },
    {
      path: '/form/:mode/:responseId?',
      name: 'form',
      component: LForm
    },
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (About.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import('../views/AboutView.vue')
    // }
  ]
})

router.beforeEach(async (to, from) => {
  await loadFhirQuestionnaires()
  return true
})

export default router
