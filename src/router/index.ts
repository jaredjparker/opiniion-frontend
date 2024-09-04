import { createRouter, createWebHistory } from 'vue-router'
import CustomerLogsView from '../views/CustomerLogsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/customer-logs',
      name: 'Customer Logs',
      component: CustomerLogsView
    }
  ]
})

export default router
