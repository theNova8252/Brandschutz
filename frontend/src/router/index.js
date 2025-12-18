import { createRouter, createWebHistory } from 'vue-router';

import LoginView from '../views/LoginView.vue';
import ChaptersView from '../views/ChaptersView.vue';
import ChapterDetailView from '../views/ChapterDetailView.vue';
import UsersView from '../views/UsersView.vue';

const routes = [
  { path: '/', redirect: '/login' },

  { path: '/login', component: LoginView },

  { path: '/chapters', name: 'chapters', component: ChaptersView },

  {
    path: '/chapters/:slug',
    name: 'chapter-detail',
    component: ChapterDetailView,
    props: true,
  },

  {
    path: '/users',
    name: 'users',
    component: UsersView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
