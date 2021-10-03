import { createRouter, createMemoryHistory } from 'vue-router'
import NoAuth from '../views/NoAuth.vue'

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: NoAuth
    },
  ]
})

export { router }
