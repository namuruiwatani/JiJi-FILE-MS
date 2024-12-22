import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CreateView from '../views/CreateView.vue'
import EditView from '../views/EditView.vue'

const routes = [
  { path: '/', name: 'Home', component: HomeView },
  { path: '/create', name: 'Create', component: CreateView },
  { path: '/edit/:id', name: 'Edit', component: EditView },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
