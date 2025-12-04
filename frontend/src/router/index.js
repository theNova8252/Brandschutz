import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '../views/LoginView.vue';
import ChaptersView from '../views/ChaptersView.vue';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: LoginView },
  { path: '/chapters', component: ChaptersView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
